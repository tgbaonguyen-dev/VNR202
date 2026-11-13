import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MutableRefObject } from "react";
import type { Avatar, ClientMsg, PlayerView, RoomView, ServerMsg } from "../../engine/protocol";
import {
  BASKET_Y,
  BUFFS,
  CARD_BY_ID,
  CARDS,
  CROP_BY_ID,
  RARITY_NAME,
  basketWidth,
  buffActive,
  passiveOf,
  newField,
  rng,
  startRound,
  stepField,
} from "../../engine/catch";
import type { BuffId, Catch, Field, Question } from "../../engine/catch";
import type { GameConfig } from "../../engine/catchConfig";
import { isMuted, setMuted, sfx, startMusic, stopMusic } from "./sound";

// Ảnh: public/images/catch/<nhóm>/<tên>.png. Ảnh nào lỗi cũng có hình thay thế.
const IMG = "/images/catch/";
const BG = ["nen/dong-lua.png", "nen/chieu-vang.png", "nen/song.png", "nen/lang-1995.png"];

// ---------------------------------------------------------------- kết nối máy chủ

function wsUrl(): string {
  const env = (import.meta.env.VITE_WS_URL as string | undefined) ?? "";
  if (env) return env;
  return `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws`;
}

function useSocket(onMsg: (m: ServerMsg) => void) {
  const ws = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<"connecting" | "open" | "closed">("connecting");
  const handler = useRef(onMsg);
  handler.current = onMsg;
  const queue = useRef<ClientMsg[]>([]);

  useEffect(() => {
    const s = new WebSocket(wsUrl());
    ws.current = s;
    s.onopen = () => {
      setStatus("open");
      for (const m of queue.current) s.send(JSON.stringify(m));
      queue.current = [];
    };
    s.onclose = () => setStatus("closed");
    s.onmessage = (e) => {
      try {
        handler.current(JSON.parse(String(e.data)));
      } catch {
        /* bỏ qua tin lỗi */
      }
    };
    return () => s.close();
  }, []);

  const send = useCallback((m: ClientMsg) => {
    const s = ws.current;
    if (s && s.readyState === WebSocket.OPEN) s.send(JSON.stringify(m));
    else queue.current.push(m);
  }, []);

  return { send, status };
}

function useClock(active: boolean) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return;
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, [active]);
  return now;
}

// ---------------------------------------------------------------- ảnh pixel

/** Ảnh pixel giữ nét; lỗi thì hiện ô chữ thay thế */
function Pix({ src, alt = "", label, className = "", style }: { src: string; alt?: string; label?: string; className?: string; style?: CSSProperties }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <span className={`pix-fallback ${className}`} style={style} role={alt ? "img" : undefined} aria-label={alt || undefined}>
        {label ?? alt.slice(0, 2)}
      </span>
    );
  }
  return <img className={`pix ${className}`} src={IMG + src} alt={alt} draggable={false} style={style} onError={() => setOk(false)} />;
}

/** Hoạt ảnh từ dải khung ngang (mỗi khung vuông). Giảm chuyển động thì đứng ở khung đầu. */
function Sprite({ src, frames, size, fps = 12, loop = false, className = "" }: { src: string; frames: number; size: number; fps?: number; loop?: boolean; className?: string }) {
  const style = {
    "--s": `${size}px`,
    "--n": frames,
    "--dur": `${(frames / fps).toFixed(2)}s`,
    "--iter": loop ? "infinite" : "1",
    backgroundImage: `url(${IMG + src})`,
  } as CSSProperties;
  return <span className={`spr ${className}`} style={style} aria-hidden="true" />;
}

function AvatarPic({ avatar, size = 48, wave = false }: { avatar: Avatar; size?: number; wave?: boolean }) {
  if (wave) return <Sprite src={`nhanvat/${avatar}-chao.png`} frames={9} size={size} fps={8} loop className="ava" />;
  return <Pix src={`nhanvat/${avatar}.png`} alt={avatar === "nu" ? "Nhân vật nữ" : "Nhân vật nam"} label={avatar === "nu" ? "Nữ" : "Nam"} className="ava" style={{ width: size, height: size }} />;
}

/** Thúng: đứng yên, hoặc chạy 5 khung khi hứng đúng (trái rơi vào) / sai (nhún giật). Lỗi ảnh thì hiện ô chữ. */
function Basket({ anim }: { anim: { kind: "good" | "bad"; n: number } | null }) {
  const [frame, setFrame] = useState(-1);
  const reduce = useMemo(() => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, []);
  useEffect(() => {
    if (!anim || reduce) return;
    let i = 0;
    setFrame(0);
    const t = window.setInterval(() => {
      i++;
      if (i >= 5) {
        window.clearInterval(t);
        setFrame(-1);
      } else setFrame(i);
    }, 70);
    return () => window.clearInterval(t);
  }, [anim, reduce]);
  if (frame < 0 || !anim) return <Pix src="ui/thung.png" alt="" label="Thúng" className="basket" />;
  const src = anim.kind === "good" ? "ui/thung-hung-anim.png" : "ui/thung-nhun-anim.png";
  return <span className="basket basket-anim" style={{ backgroundImage: `url(${IMG + src})`, backgroundPosition: `${frame * 25}% 0` }} aria-hidden="true" />;
}

function CropPic({ id, size = 32 }: { id: string; size?: number }) {
  const c = CROP_BY_ID[id];
  return <Pix src={`nongsan/${id}.png`} alt={c?.name ?? id} label={c?.name.slice(0, 2)} className="crop" style={{ width: size, height: size }} />;
}

/** Mặt trước thẻ làng nghề: khung theo độ hiếm + hình + tên */
function CardFront({ id, size = 160 }: { id: string; size?: number }) {
  const c = CARD_BY_ID[id];
  if (!c) return null;
  return (
    <div className={`cfront ${c.rarity}`} style={{ width: size }}>
      <div className="cframe" style={{ width: size, height: size }}>
        <Pix src={`the/ghep/${c.id}.png`} alt={c.name} label={c.name} className="cframe-img" />
      </div>
      <strong className="cname">{c.name}</strong>
      <span className="crarity">{RARITY_NAME[c.rarity]}</span>
      <span className="ceffect">{c.desc}</span>
    </div>
  );
}

// ---------------------------------------------------------------- thanh đua

/** Con đường làng: mỗi người một nhân vật, chạy lên theo điểm so với người dẫn đầu */
function RaceBar({ players, meId, big = false }: { players: PlayerView[]; meId?: string; big?: boolean }) {
  const top = Math.max(1, ...players.map((p) => p.points));
  const shown = players.slice(0, big ? 40 : 30);
  return (
    <div className={`race${big ? " big" : ""}`} aria-label="Thanh đua">
      <div className="race-road" />
      <Pix src="ui/vuong-mien.png" className="race-flag" />
      {shown.map((p, i) => (
        <div
          key={p.id}
          className={`racer${p.id === meId ? " me" : ""}${i === 0 ? " lead" : ""}`}
          style={{ left: `${4 + (p.points / top) * 88}%`, zIndex: p.id === meId ? 5 : 2, bottom: `${(i % 3) * 6}px` }}
          title={`${p.name}: ${p.points} điểm`}
        >
          <AvatarPic avatar={p.avatar} size={big ? 40 : 30} />
          <span className="racer-name">{p.id === meId ? "Bạn" : p.name}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- hướng dẫn chơi

function HowTo({ compact = false }: { compact?: boolean }) {
  return (
    <ol className={`howto${compact ? " compact" : ""}`}>
      <li>
        <span className="howto-pic">
          <CropPic id="lua" size={36} />
          <CropPic id="thanhlong" size={36} />
          <CropPic id="mia" size={36} />
        </span>
        <span>
          <b>Đọc câu hỏi.</b> Mỗi phương án đi cùng một loại nông sản.
        </span>
      </li>
      <li>
        <span className="howto-pic">
          <Pix src="ui/thung.png" className="howto-basket" />
        </span>
        <span>
          <b>Di chuyển thúng</b> bằng chuột, thao tác chạm hoặc phím ← →. Hứng đúng được 20 điểm; hứng sai bị trừ điểm.
        </span>
      </li>
      <li>
        <span className="howto-pic">
          <Pix src="buff/ro-to.png" className="howto-ico" />
          <Pix src="buff/x2.png" className="howto-ico" />
          <Pix src="fx/thuong-diem.png" className="howto-ico" />
        </span>
        <span>
          <b>Nhặt vật phẩm hỗ trợ</b> để mở rộng thúng, làm chậm đồ rơi, nhân đôi điểm, hút nông sản đúng hoặc dùng khiên. Mỗi thỏi vàng được thêm 50 điểm.
        </span>
      </li>
      <li>
        <span className="howto-pic">
          <Pix src="khung/hop-qua.png" className="howto-ico" />
          <Pix src="the/ghep/son-mai.png" className="howto-card" />
        </span>
        <span>
          <b>Hứng hộp quà</b> để mở thẻ làng nghề. Hiệu ứng của thẻ kéo dài đến hết ván.
        </span>
      </li>
    </ol>
  );
}

// ---------------------------------------------------------------- khung chung

export function ClassRoom({ onExit, initialCode, mode, adminKey }: { onExit: () => void; initialCode: string | undefined; mode: "home" | "host"; adminKey: string | null }) {
  const [role, setRole] = useState<"choose" | "host" | "player">(mode === "host" ? "host" : initialCode ? "player" : "choose");
  if (role === "host" && adminKey) return <HostScreen onExit={onExit} adminKey={adminKey} />;
  if (role === "player") return <PlayerScreen onExit={onExit} initialCode={initialCode} />;
  return (
    <main className="catch-wrap catch-home">
      <div className="catch-panel">
        <h1 className="px-title game-title">Gặt Dấu Đổi Mới</h1>
        <p className="game-kicker">Trò chơi kiến thức VNR202</p>
        <p>Ba phương án trả lời đi cùng ba loại nông sản. Chọn câu trả lời, điều khiển thúng hứng đúng loại và mở hộp quà để nhận thẻ làng nghề.</p>
        <div className="home-avatars" aria-hidden="true">
          <AvatarPic avatar="nam" size={96} wave />
          <AvatarPic avatar="nu" size={96} wave />
        </div>
        <div className="home-actions">
          <button className="btn primary" onClick={() => setRole("player")} autoFocus>
            Vào phòng
          </button>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------- màn hình chiếu

function HostScreen({ onExit, adminKey }: { onExit: () => void; adminKey: string }) {
  const [room, setRoom] = useState<RoomView | null>(null);
  const [err, setErr] = useState("");
  const { send, status } = useSocket((m) => {
    if (m.t === "room") setRoom(m.room);
    if (m.t === "error") setErr(m.msg);
  });
  const asked = useRef(false);
  useEffect(() => {
    if (!asked.current) {
      asked.current = true;
      send({ t: "host", adminKey });
    }
  }, [send, adminKey]);
  const now = useClock(room?.phase === "playing");
  const left = room ? Math.max(0, Math.ceil((room.startedAt + room.playSec * 1000 - now) / 1000)) : 0;
  const joinUrl = `${location.origin}${location.pathname}#lop`;

  if (!room) {
    return (
      <main className="catch-wrap catch-home">
        <div className="catch-panel">
          <p>{status === "closed" ? "Không kết nối được máy chủ." : "Đang tạo phòng…"} {err}</p>
          <button className="btn" onClick={onExit}>
            Quay lại
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="host" style={{ backgroundImage: `url(${IMG}nen/chieu-vang.png)` }}>
      <header className="host-top">
        <div>
          <div className="host-hint">Người chơi truy cập {joinUrl} và nhập mã phòng</div>
          <div className="host-code">{room.code}</div>
        </div>
        {room.phase === "playing" && (
          <div className="host-time">
            <Pix src="fx/dong-ho.png" className="host-clock" />
            {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
          </div>
        )}
        <div className="row">
          {room.phase === "lobby" && (
            <button className="btn primary" disabled={room.players.length === 0} onClick={() => send({ t: "start" })}>
              Bắt đầu ({room.players.length} người)
            </button>
          )}
          {room.phase === "playing" && (
            <button className="btn" onClick={() => send({ t: "end" })}>
              Kết thúc sớm
            </button>
          )}
          <button className="btn ghost" onClick={onExit}>
            Thoát
          </button>
        </div>
      </header>

      {room.phase === "lobby" && (
        <div className="host-lobby-wrap">
          <div className="host-howto">
            <h3 className="px-title">Cách chơi</h3>
            <HowTo compact />
          </div>
        <div className="host-lobby">
          {room.players.length === 0 && <p className="host-wait">Chờ người chơi vào phòng…</p>}
          {room.players.map((p) => (
            <span key={p.id} className="host-name">
              <AvatarPic avatar={p.avatar} size={40} />
              {p.name}
            </span>
          ))}
        </div>
        </div>
      )}

      {room.phase === "playing" && room.raceBar && (
        <div className="host-race">
          <RaceBar players={room.players} big />
          <div className="host-done">
            {room.players.filter((p) => p.done).length}/{room.players.length} người đã hoàn thành
          </div>
        </div>
      )}
      {room.phase !== "lobby" && (
        <div className="host-grid">
          <section className="host-ranking" aria-label="Bảng xếp hạng">
            {room.phase === "ended" && room.players.length > 0 && (
              <div className="winner-podium" aria-label="Ba hạng đầu">
                {[1, 0, 2].map((idx) => {
                  const p = room.players[idx];
                  const place = idx + 1;
                  return (
                    <div key={place} className={`podium-step place-${place}${p ? "" : " empty"}`}>
                      {p ? (
                        <>
                          {place === 1 && <Pix src="ui/vuong-mien.png" className="podium-crown" />}
                          <AvatarPic avatar={p.avatar} size={place === 1 ? 88 : 68} wave={place === 1} />
                          <strong>{p.name}</strong>
                          <span>
                            {p.points} điểm · đúng {p.correct} câu
                          </span>
                        </>
                      ) : (
                        <span className="podium-none">Trống</span>
                      )}
                      <b>{place}</b>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="board-head">
              <span>Hạng</span>
              <span />
              <span>Người chơi</span>
              <span>Câu đúng</span>
              <span>Thẻ</span>
              <span>Điểm</span>
            </div>
            <ol className="board">
              {room.players.slice(0, 15).map((p, i) => (
                <li key={p.id} className={i < 3 ? `top p${i + 1}` : ""}>
                  <span className="rank">{i === 0 ? <Pix src="ui/vuong-mien.png" alt="Hạng 1" label="1" className="rank-crown" /> : i + 1}</span>
                  <AvatarPic avatar={p.avatar} size={36} />
                  <span className="nm">
                    {p.name}
                    {!p.online && <small> (mất kết nối)</small>}
                  </span>
                  <span className="wins">
                    {p.correct}/{p.answered}
                  </span>
                  <span className="cards">{new Set(p.cards).size}</span>
                  <span className="pts">{p.points}</span>
                </li>
              ))}
            </ol>
          </section>
          <aside className="host-feed">
            <h3>Diễn biến</h3>
            <ul>
              {[...room.feed].reverse().map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </main>
  );
}

// ---------------------------------------------------------------- người chơi

const SAVED = "vnr202-catch";

function PlayerScreen({ onExit, initialCode }: { onExit: () => void; initialCode?: string }) {
  const saved = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem(SAVED) ?? "null") as { code: string; name: string; playerId: string; avatar: Avatar } | null;
    } catch {
      return null;
    }
  }, []);
  const [code, setCode] = useState(initialCode ?? saved?.code ?? "");
  const [name, setName] = useState(saved?.name ?? "");
  const [avatar, setAvatar] = useState<Avatar>(saved?.avatar ?? "nam");
  const [me, setMe] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomView | null>(null);
  const [setup, setSetup] = useState<{ questions: Question[]; config: GameConfig } | null>(null);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const relay = useRef<((m: ServerMsg) => void) | null>(null);

  const { send, status } = useSocket((m) => {
    if (m.t === "joined") {
      setMe(m.playerId);
      setErr("");
      try {
        sessionStorage.setItem(SAVED, JSON.stringify({ code: m.code, name, playerId: m.playerId, avatar }));
      } catch {
        /* không lưu được thì thôi */
      }
    }
    if (m.t === "room") setRoom(m.room);
    if (m.t === "error") setErr(m.msg);
    if (m.t === "setup") setSetup({ questions: m.questions, config: m.config });
    if (m.t === "swappedBy") setToast(`${m.by} đổi điểm với bạn: ${m.before} → ${m.after}`);
    if (m.t === "answered" || m.t === "card" || m.t === "swapped") relay.current?.(m);
  });

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const join = () =>
    send({ t: "join", code: code.trim(), name: name.trim(), avatar, playerId: saved && saved.code === code.trim() ? saved.playerId : undefined });

  if (!me || !room) {
    return (
      <main className="catch-wrap catch-home">
        <form
          className="catch-panel join"
          onSubmit={(e) => {
            e.preventDefault();
            join();
          }}
        >
          <h1 className="px-title">Vào phòng</h1>
          <div className="pick-ava" role="radiogroup" aria-label="Chọn nhân vật">
            {(["nam", "nu"] as Avatar[]).map((a) => (
              <button key={a} type="button" role="radio" aria-checked={avatar === a} className={`ava-opt${avatar === a ? " on" : ""}`} onClick={() => setAvatar(a)}>
                <AvatarPic avatar={a} size={80} wave={avatar === a} />
                <span>{a === "nu" ? "Nữ" : "Nam"}</span>
              </button>
            ))}
          </div>
          <input aria-label="Mã phòng" placeholder="Mã phòng (4 số)" inputMode="numeric" value={code} maxLength={4} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} autoFocus />
          <input aria-label="Tên của bạn" placeholder="Tên của bạn" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
          <button className="btn primary" type="submit" disabled={code.length !== 4 || !name.trim() || status !== "open"}>
            {status === "open" ? "Vào" : status === "connecting" ? "Đang kết nối…" : "Mất kết nối"}
          </button>
          {err && <p className="px-err">{err}</p>}
          <button type="button" className="btn ghost" onClick={onExit}>
            Quay lại
          </button>
        </form>
      </main>
    );
  }

  const mine = room.players.find((p) => p.id === me);
  const rank = room.players.findIndex((p) => p.id === me) + 1;

  return (
    <main className="catch-wrap">
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      {room.phase === "lobby" && mine && (
        <div className="catch-panel lobby">
          <AvatarPic avatar={mine.avatar} size={96} wave />
          <h2 className="px-title">Phòng {room.code}</h2>
          <p>
            {mine.name} đã vào phòng. Vui lòng chờ thầy cô bắt đầu. <span className="px-muted">Hiện có {room.players.length} người chơi.</span>
          </p>
          <h3 className="howto-title">Cách chơi</h3>
          <HowTo />
        </div>
      )}
      {room.phase === "playing" && mine && !setup && <div className="catch-panel"><p>Đang tải câu hỏi…</p></div>}
      {room.phase === "playing" && mine && setup && (
        <CatchPlay room={room} me={mine} rank={rank} send={send} relay={relay} onToast={setToast} questions={setup.questions} cfg={setup.config} />
      )}
      {room.phase === "ended" && mine && <EndScreen room={room} mine={mine} rank={rank} onExit={onExit} />}
    </main>
  );
}

function EndScreen({ room, mine, rank, onExit }: { room: RoomView; mine: PlayerView; rank: number; onExit: () => void }) {
  return (
    <div className="catch-panel end">
      {rank === 1 && <Pix src="ui/vuong-mien.png" alt="Hạng nhất" label="1" className="end-crown" />}
      <AvatarPic avatar={mine.avatar} size={112} wave />
      <h2 className="px-title">Đã hết giờ</h2>
      <p className="end-score">
        Hạng <strong>{rank}</strong>/{room.players.length} · <strong>{mine.points}</strong> điểm
      </p>
      <p>
        Bạn trả lời đúng {mine.correct}/{mine.answered} câu.
      </p>
      <button className="btn" onClick={onExit} style={{ marginTop: 16 }}>
        Về trang đầu
      </button>
    </div>
  );
}

// ---------------------------------------------------------------- màn chơi

interface Fx {
  id: number;
  kind: "good" | "bad" | "buff" | "gift" | "block";
  x: number;
  text: string;
}

type GiftView = { stage: "shake" | "wait" | "flip"; cardId: string | null; duplicate: number };

function CatchPlay({
  room,
  me,
  rank,
  send,
  relay,
  onToast,
  questions,
  cfg,
}: {
  room: RoomView;
  me: PlayerView;
  rank: number;
  send: (m: ClientMsg) => void;
  relay: MutableRefObject<((m: ServerMsg) => void) | null>;
  onToast: (s: string) => void;
  questions: Question[];
  cfg: GameConfig;
}) {
  const READY_SEC = cfg.readySec;
  const ROUND_SEC = cfg.roundSec;
  const REVEAL_SEC = cfg.revealSec;
  const r = useMemo(() => rng(room.startedAt ^ Number(me.id.slice(1) || 7)), [room.startedAt, me.id]);
  const passive = useMemo(() => passiveOf(me.cards, cfg), [me.cards, cfg]);
  // Đồng hồ chơi riêng của mỗi người: mở hộp quà, lật thẻ không tính. Vào lại giữa ván thì tính theo giờ máy chủ.
  const [playLeft, setPlayLeft] = useState(() => Math.max(0, cfg.playSec - (Date.now() - room.startedAt) / 1000));
  const playLeftRef = useRef(playLeft);
  const [finished, setFinished] = useState(false);
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<"ready" | "play" | "reveal">("ready");
  const [phaseT, setPhaseT] = useState(0);
  const [field, setField] = useState<Field>(() => newField());
  const [fx, setFx] = useState<Fx[]>([]);
  const [gift, setGift] = useState<GiftView | null>(null);
  const [combo, setCombo] = useState(0);
  const [lastPts, setLastPts] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [newCard, setNewCard] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [basketAnim, setBasketAnim] = useState<{ kind: "good" | "bad"; n: number } | null>(null);
  const [mute, setMute] = useState(isMuted());
  const [flash, setFlash] = useState<"" | "good" | "bad">("");
  const [goBanner, setGoBanner] = useState(false);
  const [bump, setBump] = useState(false);
  const flashT = useRef(0);
  const flashEdge = useCallback((k: "good" | "bad") => {
    setFlash(k);
    window.clearTimeout(flashT.current);
    flashT.current = window.setTimeout(() => setFlash(""), 220);
  }, []);

  // Nhạc nền khi đang chơi
  useEffect(() => {
    if (cfg.music) startMusic();
    return () => stopMusic();
  }, [cfg.music]);

  // Điểm nhảy lên mỗi khi đổi
  const lastPoints = useRef(me.points);
  useEffect(() => {
    if (me.points === lastPoints.current) return;
    lastPoints.current = me.points;
    setBump(true);
    const t = window.setTimeout(() => setBump(false), 450);
    return () => window.clearTimeout(t);
  }, [me.points]);
  const animN = useRef(0);

  const fieldRef = useRef(field);
  fieldRef.current = field;
  const passiveRef = useRef(passive);
  passiveRef.current = passive;
  const phaseRef = useRef({ phase, t: 0 });
  const good = useRef(0);
  const bad = useRef(0);
  const weighted = useRef(0);
  const gold = useRef(0);
  const shieldUsed = useRef(false);
  const target = useRef(50);
  const keys = useRef({ left: false, right: false });
  const area = useRef<HTMLDivElement>(null);
  const fxId = useRef(1);

  const done = qi >= questions.length;
  const q = questions[Math.min(qi, questions.length - 1)];

  const addFx = useCallback((f: Omit<Fx, "id">) => {
    const id = fxId.current++;
    setFx((list) => [...list.slice(-10), { ...f, id }]);
    window.setTimeout(() => setFx((list) => list.filter((x) => x.id !== id)), 900);
  }, []);

  // Tin từ máy chủ
  useEffect(() => {
    relay.current = (m) => {
      if (m.t === "answered") {
        setCombo(m.combo);
        setLastPts(m.points);
      }
      if (m.t === "swapped") {
        if (m.top) onToast(`Bạn đang dẫn đầu và được cộng ${m.after - m.before} điểm.`);
        else if (m.blocked) onToast(`${m.with} đã dùng khiên để chặn lượt đổi điểm.`);
        else onToast(`Đổi điểm với ${m.with}: ${m.before} → ${m.after}`);
        sfx.flip(m.after > m.before);
      }
      if (m.t === "card") {
        setGift((g) => ({ stage: g && g.stage === "shake" ? "shake" : "flip", cardId: m.cardId, duplicate: m.duplicate }));
        if (!m.duplicate) {
          setNewCard(m.cardId);
          window.setTimeout(() => setNewCard(null), 6000);
        }
      }
    };
    return () => {
      relay.current = null;
    };
  }, [relay, onToast]);

  // Hộp quà: rung 0,9 giây rồi lật thẻ khi đã có kết quả
  useEffect(() => {
    if (gift?.stage !== "shake") return;
    const t = window.setTimeout(() => setGift((g) => (g ? { ...g, stage: g.cardId ? "flip" : "wait" } : g)), 900);
    return () => window.clearTimeout(t);
  }, [gift?.stage]);
  useEffect(() => {
    if (gift?.stage === "wait" && gift.cardId) setGift({ ...gift, stage: "flip" });
  }, [gift]);
  const [giftReady, setGiftReady] = useState(false);
  useEffect(() => {
    if (gift?.stage !== "flip") {
      setGiftReady(false);
      return;
    }
    sfx.flip(!!gift.cardId && CARD_BY_ID[gift.cardId]?.rarity !== "common");
    // Lật thẻ mất khoảng 1 giây; nút Tiếp tục chỉ hiện sau khi xem xong
    const t = window.setTimeout(() => setGiftReady(true), 1400);
    return () => window.clearTimeout(t);
  }, [gift?.stage, gift?.cardId]);

  // Bắt đầu câu mới
  useEffect(() => {
    if (done) return;
    good.current = 0;
    bad.current = 0;
    weighted.current = 0;
    gold.current = 0;
    shieldUsed.current = false;
    setLastPts(null);
    const f = startRound(fieldRef.current, r, passiveRef.current, cfg);
    fieldRef.current = f;
    setField(f);
    phaseRef.current = { phase: "ready", t: 0 };
    setPhase("ready");
    setPhaseT(0);
  }, [qi, done, r, cfg]);

  const onCatch = useCallback(
    (c: Catch) => {
      const f = fieldRef.current;
      if (c.kind === "crop") {
        if (c.answer === q.correct) {
          const m = buffActive(f, "x2") ? 2 : 1;
          const p = passiveRef.current;
          good.current++;
          weighted.current += m;
          setBasketAnim({ kind: "good", n: ++animN.current });
          sfx.good(good.current);
          flashEdge("good");
          addFx({ kind: "good", x: c.x, text: `+${Math.round((20 + p.perGood) * p.goodMult * m)}` });
        } else if (buffActive(f, "shield") && !shieldUsed.current) {
          // Khiên đỡ một lần hứng sai
          shieldUsed.current = true;
          const nf = { ...f, until: { ...f.until, shield: f.t } };
          fieldRef.current = nf;
          setField(nf);
          addFx({ kind: "block", x: c.x, text: "Khiên đỡ!" });
          sfx.block();
        } else {
          bad.current++;
          setBasketAnim({ kind: "bad", n: ++animN.current });
          sfx.bad();
          flashEdge("bad");
          const pen = passiveRef.current.badPenalty;
          addFx({ kind: "bad", x: c.x, text: pen ? `−${pen}` : "Sai" });
          setShake(true);
          window.setTimeout(() => setShake(false), 300);
        }
        return;
      }
      if (c.kind === "swap") {
        addFx({ kind: "buff", x: c.x, text: "Đổi điểm!" });
        send({ t: "swap" });
        return;
      }
      if (c.kind === "gold") {
        gold.current++;
        sfx.coin();
        addFx({ kind: "buff", x: c.x, text: gold.current <= 3 ? "+50 vàng" : "Đủ 3 thỏi" });
        return;
      }
      if (c.kind === "gift") {
        addFx({ kind: "gift", x: c.x, text: "Hộp quà!" });
        setGift({ stage: "shake", cardId: null, duplicate: 0 });
        sfx.giftShake();
        send({ t: "gift" });
        return;
      }
      addFx({ kind: "buff", x: c.x, text: BUFFS[c.kind].name });
      sfx.buff();
      if (c.kind === "shield") send({ t: "shield", sec: BUFFS.shield.sec * passiveRef.current.buffTime });
    },
    [q, addFx, send, flashEdge],
  );

  // Vòng chơi: dừng khi đang mở hộp quà; mỗi câu chạy đủ thời gian mới chuyển
  useEffect(() => {
    if (done || gift || finished) return;
    let raf = 0;
    let last: number | null = null;
    const loop = (t: number) => {
      const dt = last === null ? 0 : Math.min(0.05, (t - last) / 1000);
      last = t;
      const p = passiveRef.current;
      const kspeed = cfg.basketSpeed * 0.85 * p.move * dt;
      if (keys.current.left) target.current = Math.max(0, target.current - kspeed);
      if (keys.current.right) target.current = Math.min(100, target.current + kspeed);
      const ph = phaseRef.current;
      ph.t += dt;
      // Đồng hồ chơi riêng
      playLeftRef.current = Math.max(0, playLeftRef.current - dt);
      if (playLeftRef.current <= 0) {
        if (ph.phase === "play") {
          const g = good.current;
          send({ t: "answer", q: qi, good: g, bad: bad.current, mult: g ? weighted.current / g : 1, gold: gold.current });
        }
        send({ t: "done" });
        setPlayLeft(0);
        setFinished(true);
        return;
      }
      const playing = ph.phase === "play";
      const res = stepField(fieldRef.current, dt, target.current, r, q.correct, qi, playing && ph.t < ROUND_SEC, p, cfg);
      fieldRef.current = res.field;
      setField(res.field);
      for (const c of res.caught) onCatch(c);
      if (ph.phase === "ready" && Math.ceil(READY_SEC - ph.t) !== Math.ceil(READY_SEC - (ph.t - dt)) && ph.t < READY_SEC) sfx.tick();
      if (ph.phase === "ready" && ph.t >= READY_SEC) {
        phaseRef.current = { phase: "play", t: 0 };
        setPhase("play");
        sfx.go();
        setGoBanner(true);
        window.setTimeout(() => setGoBanner(false), 700);
      } else if (ph.phase === "play" && ph.t >= ROUND_SEC) {
        const g = good.current;
        send({ t: "answer", q: qi, good: g, bad: bad.current, mult: g ? weighted.current / g : 1, gold: gold.current });
        sfx.roundEnd(g > 0 && g > bad.current);
        const f = { ...fieldRef.current, drops: [] };
        fieldRef.current = f;
        setField(f);
        phaseRef.current = { phase: "reveal", t: 0 };
        setPhase("reveal");
      } else if (ph.phase === "reveal" && ph.t >= REVEAL_SEC) {
        phaseRef.current = { phase: "ready", t: 0 };
        setQi((i) => i + 1);
        return;
      }
      setPhaseT(ph.t);
      setPlayLeft(playLeftRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [done, gift, finished, r, q, qi, onCatch, send, cfg, READY_SEC, ROUND_SEC, REVEAL_SEC]);

  // Thông báo khi người khác mở thẻ hiếm
  const feedSeen = useRef(room.feed.length);
  useEffect(() => {
    const fresh = room.feed.slice(feedSeen.current).filter((l) => !l.startsWith(me.name));
    feedSeen.current = room.feed.length;
    if (fresh.length) onToast(fresh[fresh.length - 1]);
  }, [room.feed, me.name, onToast]);

  // Điều khiển: chuột/chạm và phím
  useEffect(() => {
    const set = (e: KeyboardEvent, v: boolean) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.current.left = v;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right = v;
    };
    const down = (e: KeyboardEvent) => set(e, true);
    const up = (e: KeyboardEvent) => set(e, false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const point = (clientX: number) => {
    const el = area.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    target.current = Math.max(0, Math.min(100, ((clientX - b.left) / b.width) * 100));
  };

  const w = basketWidth(field, passive, cfg);
  const roundLeft = phase === "play" ? Math.max(0, ROUND_SEC - phaseT) : ROUND_SEC;
  const activeBuffs = (Object.keys(BUFFS) as BuffId[]).filter((b) => buffActive(field, b));
  const owned = CARDS.filter((c) => me.cards.includes(c.id));
  const top = room.players.slice(0, 5);

  return (
    <div className={`catch${shake ? " shake" : ""}`}>
      <aside className="side">
        <section className="side-box me-box">
          <AvatarPic avatar={me.avatar} size={56} />
          <div>
            <div className="me-name">{me.name}</div>
            <div className={`me-pts${bump ? " bump" : ""}`}>
              <Pix src="ui/dong-xu.png" className="hud-ico" label="đ" /> {me.points}
            </div>
            <div className="me-rank">
            Hạng {rank}/{room.players.length} · Đúng {me.correct}/{me.answered} câu
            </div>
          </div>
        </section>

        <section className="side-box">
          <h3 className="side-title">
            Thẻ làng nghề <span>{owned.length}/{CARDS.length}</span>
          </h3>
          {owned.length === 0 ? (
            <p className="side-empty">Hứng hộp quà để mở thẻ. Hiệu ứng của thẻ kéo dài đến hết ván.</p>
          ) : (
            <ul className="perks">
              {owned.map((c) => (
                <li key={c.id} className={`perk ${c.rarity}${newCard === c.id ? " fresh" : ""}`} title={`${c.name} (${RARITY_NAME[c.rarity]}): ${c.desc}`}>
                  <Pix src={`the/ghep/${c.id}.png`} alt={c.name} label={c.name.slice(0, 2)} className="perk-img" />
                  <span className="perk-txt">
                    <b>{c.name}</b>
                    <small>{c.desc}</small>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="side-btns">
          <button type="button" className="btn help-btn" onClick={() => setHelp((h) => !h)} aria-expanded={help}>
            {help ? "Đóng hướng dẫn" : "Cách chơi"}
          </button>
          <button
            type="button"
            className="btn help-btn"
            aria-pressed={!mute}
            onClick={() => {
              setMuted(!mute);
              setMute(!mute);
            }}
          >
            {mute ? "Bật tiếng" : "Tắt tiếng"}
          </button>
        </div>

        <section className="side-box">
          <h3 className="side-title">Cả lớp</h3>
          <ol className="mini-board">
            {top.map((p, i) => (
              <li key={p.id} className={p.id === me.id ? "me" : ""}>
                <span className="mb-rank">{i === 0 ? <Pix src="ui/vuong-mien.png" alt="1" label="1" className="mb-crown" /> : i + 1}</span>
                <AvatarPic avatar={p.avatar} size={24} />
                <span className="mb-name">{p.name}</span>
                <span className="mb-pts">{p.points}</span>
              </li>
            ))}
          </ol>
        </section>
      </aside>

      <div className="stage">
        <div className="stage-top">
          <span className={`playclock${playLeft <= 30 ? " low" : ""}`}>
            <Pix src="fx/dong-ho.png" className="pc-ico" label="Giờ" />
            {Math.floor(playLeft / 60)}:{String(Math.floor(playLeft % 60)).padStart(2, "0")}
            {gift && <small> (dừng)</small>}
          </span>
          {cfg.raceBar && <RaceBar players={room.players} meId={me.id} />}
        </div>
        <div className="qboard">
          <div className="qhead">
            <span className="qnum">
              <Pix src="ui/hoa-sen-nho.png" className="qlotus" /> Câu {Math.min(qi + 1, questions.length)}/{questions.length}
            </span>
            {combo > 1 && (
              <span className="hud-combo">
                <Sprite src="fx/lua-chuoi-anim.png" frames={9} size={28} fps={12} loop /> Chuỗi ×{Math.min(passive.comboMax, combo)}
              </span>
            )}
          </div>
          <div className="qtext">{done ? "Bạn đã chơi hết. Chờ cả lớp xong nhé!" : q.prompt}</div>
          {!done && (
            <div className="qanswers">
              {q.answers.map((a, i) => (
                <div key={i} className={`plaque${phase === "reveal" ? (i === q.correct ? " right" : " dim") : ""}`}>
                  <span className="plaque-ico">
                    <CropPic id={q.crops[i]} size={40} />
                  </span>
                  <span className="plaque-text">{a}</span>
                  {phase === "reveal" && <Pix src={i === q.correct ? "fx/dung.png" : "fx/sai.png"} alt={i === q.correct ? "Đúng" : "Sai"} label={i === q.correct ? "Đ" : "S"} className="plaque-mark" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={`catch-field${flash ? ` flash-${flash}` : ""}`}
          ref={area}
          onPointerMove={(e) => point(e.clientX)}
          onPointerDown={(e) => point(e.clientX)}
          role="application"
          aria-label="Khu hứng đồ. Dùng chuột, chạm hoặc phím mũi tên để di chuyển thúng. Hứng loại nông sản gắn với đáp án đúng."
        >
          <Pix src={BG[qi % BG.length]} className="field-bg" />

          <div className="field-top">
            <span className={`timer${roundLeft <= 3 && phase === "play" ? " low" : ""}`} style={{ "--p": roundLeft / ROUND_SEC } as CSSProperties}>
              <Pix src="fx/dong-ho.png" className="timer-ico" label="Giờ" />
              <b>{Math.ceil(roundLeft)}</b>
            </span>
            <span className="buffs">
              {activeBuffs.map((b) => (
                <span key={b} className="buff-chip" title={BUFFS[b].desc}>
                  <Pix src={`buff/${BUFFS[b].file}.png`} className="buff-ico" label={BUFFS[b].name.slice(0, 2)} />
                  {BUFFS[b].name} {Math.ceil(field.until[b] - field.t)}s
                </span>
              ))}
            </span>
          </div>

          {field.drops.map((d) => (
            <div key={d.id} className={`drop k-${d.kind}`} style={{ left: `${d.x}%`, top: `${d.y}%`, "--spin": `${d.spin}deg` } as CSSProperties}>
              {d.kind === "crop" ? (
                <CropPic id={q.crops[d.answer ?? 0]} size={64} />
              ) : d.kind === "gold" ? (
                <Pix src="fx/thuong-diem.png" alt="Thỏi vàng" label="Vàng" className="gold-ico" />
              ) : d.kind === "gift" ? (
                <Pix src="khung/hop-qua.png" alt="Hộp quà" label="Quà" className="gift-ico" />
              ) : d.kind === "swap" ? (
                <span className="swap-drop" role="img" aria-label="Ô đổi điểm">
                  <Pix src="ui/dong-xu.png" className="swap-coin a" />
                  <Pix src="ui/dong-xu.png" className="swap-coin b" />
                  <b>ĐỔI</b>
                </span>
              ) : (
                <Pix src={`buff/${BUFFS[d.kind].file}.png`} alt={BUFFS[d.kind].name} label={BUFFS[d.kind].name.slice(0, 2)} className="buff-drop" />
              )}
            </div>
          ))}

          {fx.map((f) => (
            <div key={f.id} className={`fx fx-${f.kind}`} style={{ left: `${f.x}%`, top: `${BASKET_Y - 12}%` }}>
              {f.kind === "good" && <Sprite src="fx/dung-anim.png" frames={5} size={56} fps={12} />}
              {f.kind === "bad" && <Sprite src="fx/sai-anim.png" frames={9} size={56} fps={16} />}
              {(f.kind === "buff" || f.kind === "block") && <Pix src={f.kind === "block" ? "buff/khien.png" : "fx/lap-lanh.png"} className="fx-ico" />}
              <span className="fx-text">{f.text}</span>
            </div>
          ))}

          <div className={`catcher${activeBuffs.includes("wide") ? " wide" : ""}`} style={{ left: `${field.basketX}%`, top: `${BASKET_Y}%`, width: `${w}%` }}>
            <Basket anim={basketAnim} />
            {activeBuffs.includes("shield") && <span className="shield-ring" aria-hidden="true" />}
          </div>

          {phase === "ready" && !done && (
            <div className="ready">
              <div className="ready-deco" aria-hidden="true">
                <Pix src="ui/hoa-sen-nho.png" /> Câu {qi + 1}/{questions.length} <Pix src="ui/hoa-sen-nho.png" />
              </div>
              <div className="ready-q">{q.prompt}</div>
              <div className="ready-answers">
                {q.answers.map((a, i) => (
                  <span key={i} className="ready-ans">
                    <CropPic id={q.crops[i]} size={48} />
                    {a}
                  </span>
                ))}
              </div>
              <div className="ready-count" key={Math.ceil(READY_SEC - phaseT)}>
                {Math.max(1, Math.ceil(READY_SEC - phaseT))}
              </div>
              <div className="ready-hint">Hứng loại nông sản đi cùng đáp án đúng</div>
            </div>
          )}
          {goBanner && <div className="go-banner">Hứng nào!</div>}
          {finished && (
            <div className="ready">
              <div className="ready-q">Bạn đã hết giờ</div>
              <div className="ready-hint">Bảng xếp hạng sẽ hiện khi cả lớp hoàn thành.</div>
            </div>
          )}
          {phase === "reveal" && !done && (
            <div className="reveal">
              <div className="reveal-head">
                Đáp án: <CropPic id={q.crops[q.correct]} size={32} /> <strong>{q.answers[q.correct]}</strong>
              </div>
              <div className="reveal-line">
                {q.explain}
              </div>
              <div className="reveal-score">
                Đúng {good.current} · sai {bad.current}
                {gold.current > 0 && (
                  <>
                    {" "}· <Pix src="fx/thuong-diem.png" className="inline-ico" /> {Math.min(3, gold.current)}
                  </>
                )}
                {lastPts !== null && <b className={lastPts >= 0 ? "plus" : "minus"}> {lastPts >= 0 ? `+${lastPts}` : lastPts} điểm</b>}
              </div>
            </div>
          )}

          {help && (
            <div className="help-over" onClick={() => setHelp(false)}>
              <div className="help-card">
                <h3 className="px-title">Cách chơi</h3>
                <HowTo compact />
                <p className="px-muted">Chạm vào nền để đóng hướng dẫn. Đồng hồ vẫn tiếp tục chạy.</p>
              </div>
            </div>
          )}

          {gift && (
            <div className="gift-over">
              {gift.stage !== "flip" ? (
                <div className="gift-box">
                  <Pix src="khung/hop-qua.png" alt="Hộp quà" label="Quà" className="gift-big" />
                  <span className="gift-q">?</span>
                </div>
              ) : (
                gift.cardId && (
                  <div className={`gift-reveal ${CARD_BY_ID[gift.cardId]?.rarity ?? ""}`}>
                    <div className="flip">
                      <div className="face back">
                        <Pix src="khung/mat-sau.png" className="cframe-img" />
                      </div>
                      <div className="face front">
                        <CardFront id={gift.cardId} size={170} />
                      </div>
                    </div>
                    <p className="gift-note">{gift.duplicate ? `Bạn đã có thẻ này và nhận thêm ${gift.duplicate} điểm.` : "Bạn nhận được một hiệu ứng mới cho phần còn lại của ván chơi."}</p>
                    {giftReady ? (
                      <button className="btn primary gift-go" onClick={() => setGift(null)} autoFocus>
                        Tiếp tục
                      </button>
                    ) : (
                      <p className="gift-tap">Đồng hồ tạm dừng trong lúc mở thẻ.</p>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
