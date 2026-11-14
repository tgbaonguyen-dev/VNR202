// Máy chủ chế độ "Hứng đáp án" chơi cả lớp.
// - Phục vụ trang web đã build (dist/), WebSocket ở /ws, API quản trị ở /api/admin/*.
// - Phòng chơi nằm trong bộ nhớ. Cấu hình và câu hỏi nhóm soạn lưu ở DATA_DIR (mặc định ./data).
// - Không lưu dữ liệu người chơi.
// Biến môi trường: PORT (mặc định 8787), DATA_DIR, ADMIN_PASSWORD (không đặt thì tự sinh và in ra log).
// Chạy: npm start

import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { WebSocketServer, WebSocket } from "ws";
import { CARD_BY_ID, DUPLICATE_POINTS, MAX_GOLD, QUESTION_POOL, buildQuestions, makeQuestions, passiveOf, rng, rollCard, roundPoints, roundWon } from "../src/engine/catch";
import type { Question } from "../src/engine/catch";
import { DEFAULT_CONFIG, sanitizeConfig, sanitizeQuestions } from "../src/engine/catchConfig";
import type { CustomQuestion, GameConfig } from "../src/engine/catchConfig";
import type { Avatar, ClientMsg, RoomView, ServerMsg } from "../src/engine/protocol";

const PORT = Number(process.env.PORT ?? 8787);
const DIST = join(process.cwd(), "dist");
const DATA = process.env.DATA_DIR ?? join(process.cwd(), "data");
/** Dư thêm sau thời gian chơi, cho người mở hộp quà, chậm mạng */
const GRACE_SEC = 180;
const SWAP_TOP_BONUS = 30;

// ---------------------------------------------------------------- cấu hình và câu hỏi (lưu file)

let config: GameConfig = { ...DEFAULT_CONFIG };
let customQuestions: CustomQuestion[] = [];

async function loadJson(file: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(join(DATA, file), "utf8"));
  } catch {
    return null;
  }
}

async function saveJson(file: string, data: unknown) {
  await mkdir(DATA, { recursive: true });
  const tmp = join(DATA, `${file}.tmp`);
  await writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await rename(tmp, join(DATA, file));
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || randomBytes(6).toString("base64url");
if (!process.env.ADMIN_PASSWORD) console.log(`[quản trị] Chưa đặt ADMIN_PASSWORD, mật khẩu tạm cho lần chạy này: ${ADMIN_PASSWORD}`);

function samePassword(got: string): boolean {
  const a = Buffer.from(got);
  const b = Buffer.from(ADMIN_PASSWORD);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---------------------------------------------------------------- phòng chơi

interface Player {
  id: string;
  name: string;
  points: number;
  ws: WebSocket | null;
  avatar: Avatar;
  cards: string[];
  combo: number;
  answered: number;
  correct: number;
  gifts: number;
  swaps: number;
  shieldUntil: number;
  done: boolean;
  bot: boolean;
}

interface Room {
  code: string;
  host: WebSocket;
  phase: "lobby" | "playing" | "ended";
  seed: number;
  startedAt: number;
  config: GameConfig;
  questions: Question[];
  players: Map<string, Player>;
  feed: string[];
  r: () => number;
  timer?: NodeJS.Timeout;
  botTimer?: NodeJS.Timeout;
  pending?: NodeJS.Timeout;
  createdAt: number;
}

const rooms = new Map<string, Room>();

function newCode(): string {
  let c = "";
  do c = String(randomInt(1000, 10000));
  while (rooms.has(c));
  return c;
}

function send(ws: WebSocket | null, m: ServerMsg) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(m));
}

function view(room: Room): RoomView {
  return {
    code: room.code,
    phase: room.phase,
    startedAt: room.startedAt,
    playSec: room.config.playSec,
    raceBar: room.config.raceBar,
    feed: room.feed.slice(-8),
    players: [...room.players.values()]
      .map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, points: p.points, cards: p.cards, correct: p.correct, answered: p.answered, online: p.bot || !!p.ws, done: p.done }))
      .sort((a, b) => b.points - a.points),
  };
}

function broadcastNow(room: Room) {
  if (room.pending) clearTimeout(room.pending);
  room.pending = undefined;
  const msg = JSON.stringify({ t: "room", room: view(room) } satisfies ServerMsg);
  if (room.host.readyState === WebSocket.OPEN) room.host.send(msg);
  for (const p of room.players.values()) if (p.ws && p.ws.readyState === WebSocket.OPEN) p.ws.send(msg);
}

/** Gom các cập nhật lại, tối đa 5 lần mỗi giây (đủ nhẹ cho 80 người) */
function broadcast(room: Room) {
  if (room.pending) return;
  room.pending = setTimeout(() => broadcastNow(room), 200);
}

function log(room: Room, line: string) {
  room.feed.push(line);
  if (room.feed.length > 40) room.feed.shift();
}

function endRoom(room: Room) {
  if (room.phase !== "playing") return;
  room.phase = "ended";
  if (room.timer) clearTimeout(room.timer);
  if (room.botTimer) clearInterval(room.botTimer);
  for (const player of room.players.values()) if (player.bot) player.done = true;
  log(room, "Hết giờ!");
  broadcastNow(room);
}

function checkAllDone(room: Room) {
  if (room.phase === "playing" && room.players.size > 0 && [...room.players.values()].every((p) => p.done || !p.ws)) endRoom(room);
}

const cleanName = (s: unknown) =>
  String(s ?? "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 20);

function addBots(room: Room, requested: number): number {
  const available = Math.max(0, room.config.maxPlayers - room.players.size);
  const count = Math.min(30, Math.max(0, Math.floor(requested)), available);
  let nextNumber = 1;
  for (let i = 0; i < count; i++) {
    while (room.players.has(`bot${nextNumber}`)) nextNumber++;
    const number = nextNumber++;
    const id = `bot${number}`;
    room.players.set(id, {
      id,
      name: `Bot ${String(number).padStart(2, "0")}`,
      points: 0,
      ws: null,
      avatar: number % 2 === 0 ? "nu" : "nam",
      cards: [],
      combo: 0,
      answered: 0,
      correct: 0,
      gifts: 0,
      swaps: 0,
      shieldUntil: 0,
      done: false,
      bot: true,
    });
  }
  return count;
}

function startBots(room: Room): void {
  room.botTimer = setInterval(() => {
    if (room.phase !== "playing") {
      if (room.botTimer) clearInterval(room.botTimer);
      return;
    }
    let changed = false;
    for (const bot of room.players.values()) {
      if (!bot.bot || bot.done || bot.answered >= room.questions.length || room.r() > 0.45) continue;
      bot.answered++;
      const correct = room.r() < 0.72;
      bot.combo = correct ? bot.combo + 1 : 0;
      if (correct) bot.correct++;
      const basePoints = correct ? randomInt(25, 76) * Math.min(3, Math.max(1, bot.combo)) : -randomInt(0, 16);
      bot.points = Math.max(0, bot.points + basePoints);
      if (room.r() < 0.08) {
        const cardId = rollCard(room.r);
        if (!bot.cards.includes(cardId)) bot.cards.push(cardId);
      }
      changed = true;
    }
    if (changed) broadcast(room);
  }, 1000);
  room.botTimer.unref();
}

function handle(ws: WebSocket, msg: ClientMsg, ctx: { room?: Room; playerId?: string }) {
  if (msg.t === "host") {
    if (!samePassword(msg.adminKey)) {
      send(ws, { t: "error", msg: "Bạn không có quyền tạo phòng." });
      return;
    }
    const room: Room = {
      code: newCode(),
      host: ws,
      phase: "lobby",
      seed: randomInt(1, 2 ** 31),
      startedAt: 0,
      config,
      questions: [],
      players: new Map(),
      feed: [],
      r: rng(Date.now() & 0x7fffffff),
      createdAt: Date.now(),
    };
    rooms.set(room.code, room);
    ctx.room = room;
    send(ws, { t: "hosted", code: room.code });
    broadcastNow(room);
    return;
  }

  if (msg.t === "join") {
    const room = rooms.get(String(msg.code));
    if (!room) return send(ws, { t: "error", msg: "Không tìm thấy phòng. Kiểm tra lại mã." });
    const name = cleanName(msg.name);
    if (!name) return send(ws, { t: "error", msg: "Bạn chưa nhập tên." });
    const back = msg.playerId ? room.players.get(msg.playerId) : undefined;
    if (back) {
      back.ws = ws;
      ctx.room = room;
      ctx.playerId = back.id;
      send(ws, { t: "joined", code: room.code, playerId: back.id });
      if (room.phase === "playing") send(ws, { t: "setup", questions: room.questions, config: room.config });
      broadcast(room);
      return;
    }
    if (room.phase !== "lobby") return send(ws, { t: "error", msg: room.phase === "ended" ? "Phòng đã kết thúc." : "Phòng đang chơi, chờ ván sau nhé." });
    if (room.players.size >= room.config.maxPlayers) return send(ws, { t: "error", msg: "Phòng đã đầy." });
    if ([...room.players.values()].some((p) => p.name.toLowerCase() === name.toLowerCase())) return send(ws, { t: "error", msg: "Tên này đã có người dùng." });
    const id = `p${randomInt(100000, 999999)}`;
    const avatar: Avatar = msg.avatar === "nu" ? "nu" : "nam";
    room.players.set(id, { id, name, avatar, points: 0, cards: [], ws, combo: 0, answered: 0, correct: 0, gifts: 0, swaps: 0, shieldUntil: 0, done: false, bot: false });
    ctx.room = room;
    ctx.playerId = id;
    send(ws, { t: "joined", code: room.code, playerId: id });
    broadcast(room);
    return;
  }

  const room = ctx.room;
  if (!room) return;

  if (msg.t === "addBots" && ws === room.host && room.phase === "lobby") {
    const added = addBots(room, msg.count);
    if (added === 0) send(ws, { t: "error", msg: "Phòng đã đủ người, không thể thêm bot." });
    else {
      log(room, `Đã thêm ${added} bot thử nghiệm.`);
      broadcastNow(room);
    }
    return;
  }

  if (msg.t === "start" && ws === room.host && room.phase === "lobby") {
    // Chụp cấu hình và câu hỏi lúc bắt đầu: sửa trong trang quản trị không ảnh hưởng ván đang chơi
    room.config = config;
    room.questions = room.config.customQuestions && customQuestions.length >= 3 ? buildQuestions(customQuestions, room.seed, QUESTION_POOL) : makeQuestions(room.seed, QUESTION_POOL);
    room.phase = "playing";
    room.startedAt = Date.now();
    room.timer = setTimeout(() => endRoom(room), (room.config.playSec + GRACE_SEC) * 1000);
    startBots(room);
    log(room, "Bắt đầu!");
    for (const p of room.players.values()) send(p.ws, { t: "setup", questions: room.questions, config: room.config });
    broadcastNow(room);
    return;
  }

  if (msg.t === "end" && ws === room.host) {
    endRoom(room);
    return;
  }

  const p = ctx.playerId ? room.players.get(ctx.playerId) : undefined;
  if (!p || room.phase !== "playing" || p.done) return;
  const cfg = room.config;

  if (msg.t === "answer") {
    // Mỗi câu chỉ nộp một lần, đúng thứ tự
    if ((msg.q | 0) !== p.answered || p.answered >= room.questions.length) return;
    p.answered++;
    const won = roundWon(msg.good | 0, msg.bad | 0);
    p.combo = won ? p.combo + 1 : 0;
    if (won) p.correct++;
    const gold = Math.max(0, Math.min(MAX_GOLD, msg.gold | 0));
    const pts = roundPoints(msg.good | 0, msg.bad | 0, p.combo, Number(msg.mult) || 1, passiveOf(p.cards, cfg), cfg) + gold * cfg.goldPoints;
    p.points = Math.max(0, p.points + pts);
    send(ws, { t: "answered", points: pts, combo: p.combo });
    broadcast(room);
    return;
  }

  if (msg.t === "gift") {
    if (p.gifts > p.answered) return; // tối đa một hộp quà mỗi câu
    p.gifts++;
    const cardId = rollCard(room.r);
    const card = CARD_BY_ID[cardId];
    const duplicate = p.cards.includes(cardId);
    if (duplicate) p.points += DUPLICATE_POINTS[card.rarity];
    else p.cards.push(cardId);
    if (card.rarity !== "common" && !duplicate) log(room, `${p.name} mở được thẻ ${card.name}!`);
    send(ws, { t: "card", cardId, duplicate: duplicate ? DUPLICATE_POINTS[card.rarity] : 0 });
    broadcast(room);
    return;
  }

  if (msg.t === "swap") {
    if (!cfg.swapEnabled || p.swaps > p.answered) return; // tối đa một lần đổi mỗi câu
    p.swaps++;
    const ranked = [...room.players.values()].sort((a, b) => b.points - a.points);
    // Người có điểm cao hơn gần nhất
    const above = ranked.filter((x) => x.id !== p.id && x.points > p.points).pop();
    const before = p.points;
    if (!above) {
      p.points += SWAP_TOP_BONUS;
      send(ws, { t: "swapped", with: "", before, after: p.points, top: true });
    } else if (above.shieldUntil > Date.now()) {
      send(ws, { t: "swapped", with: above.name, before, after: before, blocked: true });
      log(room, `${above.name} dùng khiên chặn ${p.name} đổi điểm!`);
    } else {
      const theirs = above.points;
      above.points = before;
      p.points = theirs;
      send(ws, { t: "swapped", with: above.name, before, after: p.points });
      send(above.ws, { t: "swappedBy", by: p.name, before: theirs, after: above.points });
      log(room, `${p.name} đổi điểm với ${above.name}!`);
    }
    broadcast(room);
    return;
  }

  if (msg.t === "shield") {
    p.shieldUntil = Date.now() + Math.min(20, Math.max(0, Number(msg.sec) || 0)) * 1000;
    return;
  }

  if (msg.t === "done") {
    p.done = true;
    broadcast(room);
    checkAllDone(room);
  }
}

// Dọn phòng quá 3 giờ
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.createdAt <= 3 * 3600 * 1000) continue;
    if (room.timer) clearTimeout(room.timer);
    if (room.botTimer) clearInterval(room.botTimer);
    rooms.delete(code);
  }
}, 10 * 60 * 1000).unref();

// ---------------------------------------------------------------- HTTP: API quản trị và trang web

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function json(res: ServerResponse, code: number, data: unknown) {
  res.writeHead(code, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }).end(JSON.stringify(data));
}

async function readBody(req: IncomingMessage, limit = 512 * 1024): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const c of req) {
    size += (c as Buffer).length;
    if (size > limit) throw new Error("too large");
    chunks.push(c as Buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "null");
}

async function api(req: IncomingMessage, res: ServerResponse, path: string) {
  if (path === "/api/admin/login" && req.method === "POST") {
    const body = (await readBody(req).catch(() => null)) as { password?: string } | null;
    const ok = samePassword(String(body?.password ?? ""));
    return json(res, ok ? 200 : 401, { ok });
  }
  if (!samePassword(String(req.headers["x-admin-key"] ?? ""))) return json(res, 401, { error: "Sai mật khẩu quản trị" });

  if (path === "/api/admin/config") {
    if (req.method === "GET") return json(res, 200, { config, defaults: DEFAULT_CONFIG });
    if (req.method === "PUT") {
      config = sanitizeConfig(await readBody(req).catch(() => null));
      await saveJson("config.json", config);
      return json(res, 200, { config });
    }
  }
  if (path === "/api/admin/questions") {
    if (req.method === "GET") return json(res, 200, { questions: customQuestions });
    if (req.method === "PUT") {
      const { ok, errors } = sanitizeQuestions(await readBody(req).catch(() => null));
      if (errors.length) return json(res, 400, { errors, valid: ok.length });
      customQuestions = ok;
      await saveJson("questions.json", customQuestions);
      return json(res, 200, { questions: customQuestions });
    }
  }
  if (path === "/api/admin/rooms" && req.method === "GET") {
    return json(res, 200, { rooms: [...rooms.values()].map((r) => ({ code: r.code, phase: r.phase, players: r.players.size, startedAt: r.startedAt })) });
  }
  return json(res, 404, { error: "Không có" });
}

const http = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://x");
  if (url.pathname === "/health") {
    res.writeHead(200, { "content-type": "text/plain" }).end("ok");
    return;
  }
  if (url.pathname.startsWith("/api/")) {
    try {
      await api(req, res, url.pathname);
    } catch {
      json(res, 500, { error: "Lỗi máy chủ" });
    }
    return;
  }
  let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  if (path.endsWith("/")) path += "index.html";
  let file = join(DIST, path);
  if (!file.startsWith(DIST)) {
    res.writeHead(403).end();
    return;
  }
  try {
    if (!(await stat(file)).isFile()) throw new Error();
  } catch {
    file = join(DIST, "index.html");
  }
  try {
    const body = await readFile(file);
    // Trang HTML luôn tải mới; file trong assets/ có mã băm nên lưu lâu được
    const cache = file.endsWith(".html") ? "no-cache" : file.includes(join("dist", "assets")) ? "public, max-age=31536000, immutable" : "public, max-age=300";
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream", "cache-control": cache }).end(body);
  } catch {
    res.writeHead(404).end("Chưa build: chạy npm run build");
  }
});

const wss = new WebSocketServer({ server: http, path: "/ws", maxPayload: 4096 });

wss.on("connection", (ws) => {
  const ctx: { room?: Room; playerId?: string } = {};
  ws.on("message", (raw) => {
    let msg: ClientMsg;
    try {
      msg = JSON.parse(String(raw));
    } catch {
      return;
    }
    handle(ws, msg, ctx);
  });
  ws.on("close", () => {
    const room = ctx.room;
    if (!room || !ctx.playerId) return;
    const p = room.players.get(ctx.playerId);
    if (p) p.ws = null;
    broadcast(room);
  });
});

async function main() {
  config = sanitizeConfig(await loadJson("config.json"));
  customQuestions = sanitizeQuestions(await loadJson("questions.json")).ok;
  http.listen(PORT, () => console.log(`Máy chủ chạy ở http://localhost:${PORT} (WebSocket /ws, quản trị /#admin). Câu hỏi nhóm soạn: ${customQuestions.length}`));
}

void main();
