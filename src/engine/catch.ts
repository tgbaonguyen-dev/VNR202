// Chế độ "Hứng đáp án" chơi cả lớp: luật chung, hàm thuần.
// Dùng ở cả trình duyệt (vật lý hứng đồ) và máy chủ (điểm, mở thẻ, cướp điểm).
// Câu hỏi chỉ lấy từ mốc trong history.ts (đã có nguồn), không thêm kiến thức mới.
// Mỗi đáp án gắn với một loại nông sản; nông sản rơi liên tục, hứng đúng loại được điểm.

import { HISTORY } from "../data/history";
import { DEFAULT_CONFIG } from "./catchConfig";
import type { CustomQuestion, GameConfig } from "./catchConfig";

// ---------------------------------------------------------------- ngẫu nhiên tất định

export function rng(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], r: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------------------------------------------------------- mốc lịch sử (nguồn câu hỏi)

export interface Milestone {
  id: string;
  year: number;
  name: string;
  /** Câu mốc nguyên văn trong history.ts */
  text: string;
}

/** Tên ngắn của từng mốc, để làm đáp án */
const SHORT: Record<number, string[]> = {
  1985: ["Thời bao cấp"],
  1986: ["Đại hội VI"],
  1987: ["Luật Đầu tư nước ngoài"],
  1988: ["Khoán 10"],
  1989: ["Xuất khẩu gạo"],
  1991: ["Đại hội VII"],
  1994: ["Hoa Kỳ bỏ cấm vận"],
  1995: ["Gia nhập ASEAN"],
  1996: ["Đại hội VIII"],
  2000: ["Luật Doanh nghiệp"],
  2001: ["Đại hội IX", "Hiệp định Thương mại Việt Nam – Hoa Kỳ"],
  2006: ["Đại hội X"],
  2007: ["Gia nhập WTO"],
  2010: ["Nông thôn mới"],
  2011: ["Đại hội XI"],
  2016: ["Đại hội XII"],
  2020: ["Chống dịch COVID-19"],
  2021: ["Đại hội XIII"],
  2022: ["Giảm nghèo bền vững"],
};

export const MILESTONES: Milestone[] = HISTORY.flatMap((h) =>
  (SHORT[h.year] ?? []).map((name, i) => ({ id: `m${h.year}${i ? "b" : ""}`, year: h.year, name, text: h.text })),
);

export const MILESTONE_BY_ID: Record<string, Milestone> = Object.fromEntries(MILESTONES.map((m) => [m.id, m]));

// ---------------------------------------------------------------- nông sản (đồ rơi theo đáp án)

export interface Crop {
  id: string;
  name: string;
}

/** Ảnh: public/images/catch/nongsan/<id>.png */
export const CROPS: Crop[] = [
  { id: "lua", name: "Lúa" },
  { id: "caphe", name: "Cà phê" },
  { id: "che", name: "Chè" },
  { id: "caosu", name: "Cao su" },
  { id: "thanhlong", name: "Thanh long" },
  { id: "ngo", name: "Ngô" },
  { id: "xoai", name: "Xoài" },
  { id: "vai", name: "Vải" },
  { id: "saurieng", name: "Sầu riêng" },
  { id: "chuoi", name: "Chuối" },
  { id: "mia", name: "Mía" },
];

export const CROP_BY_ID: Record<string, Crop> = Object.fromEntries(CROPS.map((c) => [c.id, c]));

/** Cặp dễ nhầm (cùng màu, cùng dáng): không cho xuất hiện chung một câu */
const LOOK_ALIKE: [string, string][] = [
  ["lua", "ngo"],
  ["xoai", "chuoi"],
  ["caphe", "vai"],
  ["saurieng", "che"],
];

function clashes(a: string, b: string) {
  return LOOK_ALIKE.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

/** Chọn 3 nông sản khác nhau, không có cặp dễ nhầm */
export function pickCrops(r: () => number): string[] {
  for (let tries = 0; tries < 50; tries++) {
    const pick = shuffle(CROPS, r).slice(0, 3).map((c) => c.id);
    if (!clashes(pick[0], pick[1]) && !clashes(pick[0], pick[2]) && !clashes(pick[1], pick[2])) return pick;
  }
  return ["lua", "thanhlong", "mia"];
}

// ---------------------------------------------------------------- câu hỏi

export interface Question {
  id: string;
  prompt: string;
  answers: string[];
  /** Nông sản gắn với từng đáp án (cùng thứ tự) */
  crops: string[];
  correct: number;
  /** Câu giải thích hiện khi báo đáp án */
  explain: string;
  /** Nguồn (với câu nhóm soạn) */
  source?: string;
  milestoneId?: string;
}

/** Bộ câu hỏi tự sinh từ mốc lịch sử, tất định theo seed */
export function makeQuestions(seed: number, n: number): Question[] {
  const r = rng(seed);
  const years = [...new Set(MILESTONES.map((c) => c.year))];
  const qs: Question[] = [];
  let pool = shuffle(MILESTONES, r);
  for (let i = 0; i < n; i++) {
    if (i > 0 && i % pool.length === 0) pool = shuffle(MILESTONES, r);
    const m = pool[i % pool.length];
    const crops = pickCrops(r);
    const explain = `${m.year}: ${m.text}`;
    if (r() < 0.5) {
      const wrong = shuffle(years.filter((y) => y !== m.year && Math.abs(y - m.year) <= 12), r).slice(0, 2);
      const opts = shuffle([m.year, ...wrong], r);
      qs.push({ id: `q${i}`, prompt: `Năm nào? “${m.text}”`, answers: opts.map(String), crops, correct: opts.indexOf(m.year), explain, milestoneId: m.id });
    } else {
      const wrong = shuffle(MILESTONES.filter((c) => c.year !== m.year), r).slice(0, 2);
      const opts = shuffle([m, ...wrong], r);
      qs.push({ id: `q${i}`, prompt: `Năm ${m.year} có sự kiện nào?`, answers: opts.map((c) => c.name), crops, correct: opts.indexOf(m), explain, milestoneId: m.id });
    }
  }
  return qs;
}

/** Bộ câu hỏi từ câu nhóm soạn: câu dễ trước, xáo trong từng mức, xáo đáp án, gán nông sản; lặp lại nếu cần thêm */
export function buildQuestions(list: CustomQuestion[], seed: number, n: number): Question[] {
  if (list.length === 0) return makeQuestions(seed, n);
  const r = rng(seed);
  const rank = { de: 0, vua: 1, kho: 2 } as const;
  const ordered = () => {
    const sh = shuffle(list, r);
    return sh.sort((a, b) => rank[a.do_kho ?? "vua"] - rank[b.do_kho ?? "vua"]);
  };
  let pool = ordered();
  const qs: Question[] = [];
  for (let i = 0; i < n; i++) {
    if (i > 0 && i % pool.length === 0) pool = shuffle(list, r);
    const c = pool[i % pool.length];
    const opts = shuffle([c.dung, c.sai_1, c.sai_2], r);
    qs.push({ id: `q${i}`, prompt: c.cau_hoi, answers: opts, crops: pickCrops(r), correct: opts.indexOf(c.dung), explain: c.giai_thich, source: c.nguon });
  }
  return qs;
}

// ---------------------------------------------------------------- buff và thẻ làng nghề

export type BuffId = "wide" | "slow" | "x2" | "magnet" | "shield" | "harvest";

export const BUFFS: Record<BuffId, { name: string; file: string; sec: number; desc: string }> = {
  wide: { name: "Thúng rộng", file: "ro-to", sec: 8, desc: "Thúng rộng gấp rưỡi" },
  slow: { name: "Chậm lại", file: "cham", sec: 8, desc: "Đồ rơi chậm một nửa" },
  x2: { name: "Nhân đôi", file: "x2", sec: 8, desc: "Điểm hứng đúng ×2" },
  magnet: { name: "Nam châm", file: "namcham", sec: 8, desc: "Hút nông sản đúng về thúng" },
  shield: { name: "Khiên", file: "khien", sec: 5, desc: "Hứng sai không bị trừ điểm trong 5 giây" },
  harvest: { name: "Thu hoạch", file: "thu-hoach", sec: 0, desc: "Thu toàn bộ nông sản trên sân và tính là hứng đúng" },
};

export type CardRarity = "common" | "rare" | "epic";
export const RARITY_NAME: Record<CardRarity, string> = { common: "Thường", rare: "Hiếm", epic: "Rất hiếm" };

/** Nội tại: có thẻ là có hiệu lực tới hết ván, nhiều thẻ thì cộng dồn */
export interface Passive {
  /** Điểm cộng thêm cho mỗi quả đúng */
  perGood: number;
  /** Điểm bị trừ mỗi quả sai */
  badPenalty: number;
  /** Thưởng thêm mỗi câu thắng */
  winBonus: number;
  /** Hệ số điểm quả đúng */
  goodMult: number;
  /** Hệ số thưởng hứng đủ (đúng ≥3, không sai) */
  perfectMult: number;
  /** Chuỗi nhân tối đa */
  comboMax: number;
  /** Bề rộng thúng (hệ số) */
  width: number;
  /** Tốc độ rơi (hệ số) */
  fall: number;
  /** Tốc độ di chuyển thúng (hệ số) */
  move: number;
  /** Thời gian buff (hệ số) */
  buffTime: number;
  /** Lực hút nông sản đúng thường trực (0 = không) */
  pull: number;
  /** Số quả sai đầu tiên mỗi câu không bị trừ */
  freeBad: number;
  /** Tỉ lệ ra thỏi vàng, hộp quà (hệ số) */
  goldRate: number;
  giftRate: number;
}

export const BASE_PASSIVE: Passive = {
  perGood: 0, badPenalty: 10, winBonus: 0, goodMult: 1, perfectMult: 1, comboMax: 3,
  width: 1, fall: 1, move: 1, buffTime: 1, pull: 0, freeBad: 0, goldRate: 1, giftRate: 1,
};

export interface CraftCard {
  id: string;
  name: string;
  rarity: CardRarity;
  /** Mô tả nội tại cho người chơi */
  desc: string;
  apply: (p: Passive) => void;
}

/** Ảnh: public/images/catch/the/ghep/<id>.png (đã ghép khung). Làng nghề, hàng Tết: văn hóa, không chính trị. */
export const CARDS: CraftCard[] = [
  // Thường: lợi nhỏ, dễ có
  { id: "non-la", name: "Nón lá", rarity: "common", desc: "Mỗi quả đúng +3 điểm", apply: (p) => void (p.perGood += 3) },
  { id: "dan-tre", name: "Đan tre", rarity: "common", desc: "Thúng rộng thêm 12%", apply: (p) => void (p.width += 0.12) },
  { id: "chieu-coi", name: "Chiếu cói", rarity: "common", desc: "Hứng sai bị trừ ít hơn 40%", apply: (p) => void (p.badPenalty = Math.max(0, Math.round(p.badPenalty * 0.6))) },
  { id: "banh-trang", name: "Bánh tráng", rarity: "common", desc: "Đồ rơi chậm hơn 8%", apply: (p) => void (p.fall *= 0.92) },
  { id: "banh-chung", name: "Bánh chưng", rarity: "common", desc: "Mỗi câu đúng được thêm 15 điểm", apply: (p) => void (p.winBonus += 15) },
  { id: "banh-tet", name: "Bánh tét", rarity: "common", desc: "Thỏi vàng rơi nhiều hơn 50%", apply: (p) => void (p.goldRate += 0.5) },
  { id: "guoc-moc", name: "Guốc mộc", rarity: "common", desc: "Thúng chạy nhanh hơn 15%", apply: (p) => void (p.move += 0.15) },
  // Hiếm: lợi vừa
  { id: "gom-men-lam", name: "Gốm men lam", rarity: "rare", desc: "Điểm hứng đúng được nhân 1,15", apply: (p) => void (p.goodMult *= 1.15) },
  { id: "lua-to-tam", name: "Lụa tơ tằm", rarity: "rare", desc: "Vật phẩm hỗ trợ kéo dài thêm 40%", apply: (p) => void (p.buffTime += 0.4) },
  { id: "tranh-dan-gian", name: "Tranh dân gian", rarity: "rare", desc: "Thưởng câu hoàn hảo tăng 50%", apply: (p) => void (p.perfectMult += 0.5) },
  { id: "hoa-sen", name: "Hoa sen", rarity: "rare", desc: "Nông sản đúng được hút nhẹ về phía thúng", apply: (p) => void (p.pull += 18) },
  // Rất hiếm: lợi rõ nhưng không quyết định ván
  { id: "son-mai", name: "Sơn mài", rarity: "epic", desc: "Điểm hứng đúng được nhân 1,3", apply: (p) => void (p.goodMult *= 1.3) },
  { id: "kham-xa-cu", name: "Khảm xà cừ", rarity: "epic", desc: "Mỗi câu, quả sai đầu tiên không bị trừ", apply: (p) => void (p.freeBad += 1) },
  { id: "dan-bau", name: "Đàn bầu", rarity: "epic", desc: "Chuỗi điểm tối đa tăng thêm 1 bậc", apply: (p) => void (p.comboMax += 1) },
  { id: "long-den", name: "Lồng đèn", rarity: "epic", desc: "Hộp quà rơi nhiều hơn 60%", apply: (p) => void (p.giftRate += 0.6) },
];

export const CARD_BY_ID: Record<string, CraftCard> = Object.fromEntries(CARDS.map((c) => [c.id, c]));

/** Nội tại từ bộ thẻ đang có. Thẻ trùng không cộng thêm nội tại (đổi thành điểm khi mở). */
export function passiveOf(cards: string[], cfg: GameConfig = DEFAULT_CONFIG): Passive {
  const p = { ...BASE_PASSIVE, badPenalty: cfg.badPoints, comboMax: cfg.comboMax };
  for (const id of new Set(cards)) CARD_BY_ID[id]?.apply(p);
  return p;
}

/** Thẻ trùng đổi thành điểm */
export const DUPLICATE_POINTS: Record<CardRarity, number> = { common: 40, rare: 80, epic: 150 };

/** Mở hộp quà: Thường 60%, Hiếm 30%, Rất hiếm 10% */
export function rollCard(r: () => number): string {
  const y = r();
  const rarity: CardRarity = y < 0.1 ? "epic" : y < 0.4 ? "rare" : "common";
  const pool = CARDS.filter((c) => c.rarity === rarity);
  return pool[Math.floor(r() * pool.length)].id;
}

// ---------------------------------------------------------------- điểm (máy chủ tính)

export const GOOD_POINTS = 20;
export const PERFECT_BONUS = 50;
export const GOLD_POINTS = 50;
/** Mỗi câu tính tối đa 3 thỏi vàng */
export const MAX_GOLD = 3;
/** Giới hạn hợp lý cho số quả trong một câu (chống số ảo) */
export const MAX_CATCH = 60;

/** Điểm một câu, có tính nội tại từ thẻ và cấu hình. mult là hệ số buff (×2) do trình duyệt gửi, tối đa 2. */
export function roundPoints(good: number, bad: number, combo: number, mult: number, p: Passive = BASE_PASSIVE, cfg: GameConfig = DEFAULT_CONFIG): number {
  const g = Math.max(0, Math.min(MAX_CATCH, good | 0));
  const b = Math.max(0, Math.min(MAX_CATCH, bad | 0));
  const m = Math.max(1, Math.min(2, mult || 1));
  const c = Math.min(p.comboMax, Math.max(1, combo));
  const perfect = g >= 3 && b === 0 ? cfg.perfectBonus * p.perfectMult : 0;
  const win = roundWon(g, b) ? p.winBonus : 0;
  return Math.round((g * (cfg.goodPoints + p.perGood) * p.goodMult * m + perfect) * c + win) - Math.max(0, b - p.freeBad) * p.badPenalty;
}

/** Câu tính là "đúng" khi hứng đúng nhiều hơn sai */
export function roundWon(good: number, bad: number) {
  return good > 0 && good > bad;
}

// ---------------------------------------------------------------- vật lý hứng đồ (trình duyệt)

/** Thời gian các pha của một câu (giây) */
export const BASKET_Y = 88;
/** Số câu chuẩn bị sẵn cho một ván (chơi theo thời gian, câu hết thì lặp lại) */
export const QUESTION_POOL = 60;

/** gold: thỏi vàng, +50 điểm thưởng */
/** gold: thỏi vàng; swap: đổi điểm với người xếp ngay trên */
export type DropKind = "crop" | BuffId | "gift" | "gold" | "swap";

export interface Drop {
  id: number;
  kind: DropKind;
  /** Với nông sản: chỉ số đáp án (0..2) */
  answer?: number;
  x: number;
  y: number;
  vy: number;
  spin: number;
}

export interface Field {
  t: number;
  basketX: number;
  drops: Drop[];
  nextId: number;
  nextCrop: number;
  nextExtra: number;
  giftAt: number;
  until: Record<BuffId, number>;
}

export function newField(): Field {
  return { t: 0, basketX: 50, drops: [], nextId: 1, nextCrop: 0, nextExtra: 2.5, giftAt: -1, until: { wide: 0, slow: 0, x2: 0, magnet: 0, shield: 0, harvest: 0 } };
}

/** Bắt đầu một câu: bỏ đồ cũ, hẹn giờ có thể rơi hộp quà */
export function startRound(f: Field, r: () => number, p: Passive = BASE_PASSIVE, cfg: GameConfig = DEFAULT_CONFIG): Field {
  const base = f.t;
  const giftChance = Math.min(1, cfg.giftChance * p.giftRate);
  const span = Math.max(1, cfg.roundSec - 5);
  return {
    ...f,
    drops: [],
    nextCrop: base + 0.3,
    nextExtra: base + Math.min(2.5, cfg.roundSec / 3) + r() * 2,
    giftAt: r() < giftChance ? base + 2.5 + r() * span : -1,
  };
}

export function basketWidth(f: Field, p: Passive = BASE_PASSIVE, cfg: GameConfig = DEFAULT_CONFIG): number {
  return cfg.basketWidth * p.width * (f.t < f.until.wide ? 1.6 : 1);
}

export function buffActive(f: Field, b: BuffId) {
  return f.t < f.until[b];
}

export function giveBuff(f: Field, b: BuffId, sec = BUFFS[b].sec, p: Passive = BASE_PASSIVE): Field {
  sec *= p.buffTime;
  return { ...f, until: { ...f.until, [b]: Math.max(f.until[b], f.t) + sec } };
}

export interface Catch {
  kind: DropKind;
  answer?: number;
  x: number;
}

const EXTRA_KINDS: BuffId[] = ["wide", "slow", "x2", "magnet", "shield", "harvest"];

/** Chọn vị trí ngang không sát các đồ đang ở phía trên sân */
function freeX(drops: Drop[], r: () => number, gap: number): number {
  const recent = drops.filter((d) => d.y < 30);
  for (let tries = 0; tries < 12; tries++) {
    const x = 8 + r() * 84;
    if (recent.every((d) => Math.abs(d.x - x) >= gap)) return x;
  }
  return 8 + r() * 84;
}

/** Một bước thời gian. spawning=false khi đã hết giờ câu (đồ còn lại rơi nốt). */
export function stepField(
  f: Field,
  dt: number,
  targetX: number,
  r: () => number,
  correct: number,
  level: number,
  spawning: boolean,
  p: Passive = BASE_PASSIVE,
  cfg: GameConfig = DEFAULT_CONFIG,
): { field: Field; caught: Catch[] } {
  const t = f.t + dt;
  let { nextId, nextCrop, nextExtra, giftAt } = f;
  const fresh: Drop[] = [];
  const speed = (cfg.fallSpeed + Math.min(20, level) * cfg.fallAccel) * p.fall;
  const add = (kind: DropKind, answer?: number) => {
    const x = freeX([...f.drops, ...fresh], r, cfg.minGap);
    fresh.push({ id: nextId++, kind, answer, x, y: -8, vy: speed * (0.9 + r() * 0.25), spin: (r() - 0.5) * 240 });
  };
  if (spawning) {
    while (t >= nextCrop) {
      add("crop", r() < cfg.correctShare ? correct : Math.floor(r() * 3));
      nextCrop += cfg.cropInterval * (0.85 + r() * 0.4);
    }
    if (t >= nextExtra) {
      const x = r();
      const gold = cfg.goldChance * p.goldRate;
      const swap = cfg.swapEnabled ? cfg.swapChance : 0;
      if (x < gold) add("gold");
      else if (x < gold + swap) add("swap");
      else if (x < gold + swap + cfg.buffChance) add(EXTRA_KINDS[Math.floor(r() * EXTRA_KINDS.length)]);
      nextExtra += cfg.extraInterval * (0.8 + r() * 0.5);
    }
    if (giftAt >= 0 && t >= giftAt) {
      add("gift");
      giftAt = -1;
    }
  }
  const slow = t < f.until.slow ? 0.5 : 1;
  const magnet = t < f.until.magnet ? 60 : p.pull;
  const step = cfg.basketSpeed * p.move * dt;
  const bx = Math.max(4, Math.min(96, f.basketX + Math.max(-step, Math.min(step, targetX - f.basketX))));
  const half = basketWidth({ ...f, t }, p, cfg) / 2;
  let caught: Catch[] = [];
  const until = { ...f.until };
  let kept: Drop[] = [];
  for (const d of [...f.drops, ...fresh]) {
    const y = d.y + d.vy * slow * dt;
    let x = d.x;
    if (magnet > 0 && d.kind === "crop" && d.answer === correct && y > 30) x += Math.max(-magnet * dt, Math.min(magnet * dt, bx - x));
    if (y >= BASKET_Y - 4 && y <= BASKET_Y + 3 && Math.abs(x - bx) <= half + 2.5) {
      caught.push({ kind: d.kind, answer: d.answer, x });
      if (d.kind in BUFFS) {
        const b = d.kind as BuffId;
        until[b] = Math.max(until[b], t) + BUFFS[b].sec * p.buffTime;
      }
      continue;
    }
    if (y <= 104) kept.push({ ...d, x, y });
  }
  if (caught.some((item) => item.kind === "harvest")) {
    caught = [
      ...caught.filter((item) => item.kind !== "crop"),
      ...[...f.drops, ...fresh].filter((drop) => drop.kind === "crop").map((drop) => ({ kind: "crop" as const, answer: correct, x: drop.x })),
    ];
    kept = kept.filter((drop) => drop.kind !== "crop");
  }
  return { field: { ...f, t, basketX: bx, drops: kept, nextId, nextCrop, nextExtra, giftAt, until }, caught };
}
