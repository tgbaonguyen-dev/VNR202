// Mini-game "Đi chợ": luật chơi thuần, không import React.
// Giao diện chạy đồng hồ và gọi các hàm này; engine nhận kết quả qua resolve().
// Tiền trong mini-game là đơn vị trò chơi, không phải giá thật.

export interface Stall {
  id: string;
  label: string;
  /** Giá lúc bắt đầu */
  base: number;
}

export interface MarketConfig {
  id: "cho86" | "cho90";
  year: number;
  title: string;
  intro: string;
  /** Tiền mang theo */
  budget: number;
  durationSec: number;
  /** Thời gian đi từ sạp này sang sạp khác */
  walkSec: number;
  stalls: Stall[];
  /** Món phải mua: id sạp -> số lượng */
  need: Record<string, number>;
  /** Giá tăng bao nhiêu mỗi giây (0.06 = 6%) */
  growth: number;
  /** Mỗi bao nhiêu giây giá nhảy vọt một lần (0 = không) */
  jumpEvery: number;
  jumpFactor: number;
  /** Có lúc sạp hết hàng */
  shortages: boolean;
}

export const MARKETS: Record<string, MarketConfig> = {
  cho86: {
    id: "cho86",
    year: 1986,
    title: "Phiên chợ năm 1986",
    intro: "Mẹ cầm 26 đồng ra chợ. Giá cả tăng theo từng giờ, đi chậm là không đủ tiền. Giúp mẹ mua đủ đồ cho cả nhà.",
    budget: 26,
    durationSec: 30,
    walkSec: 1.1,
    stalls: [
      { id: "gao", label: "Gạo", base: 4 },
      { id: "muoi", label: "Muối", base: 1 },
      { id: "mam", label: "Nước mắm", base: 2 },
      { id: "dau", label: "Dầu hỏa", base: 2 },
      { id: "vai", label: "Vải", base: 5 },
    ],
    need: { gao: 2, muoi: 1, mam: 1, dau: 1, vai: 1 },
    growth: 0.08,
    jumpEvery: 6,
    jumpFactor: 1.3,
    shortages: true,
  },
  cho90: {
    id: "cho90",
    year: 1990,
    title: "Phiên chợ năm 1990",
    intro: "Bạn năm tuổi, theo mẹ ra chợ. Mẹ vẫn mang 26 đồng, vẫn danh sách ấy. Chợ năm nay khác hẳn.",
    budget: 26,
    durationSec: 30,
    walkSec: 0.9,
    stalls: [
      { id: "gao", label: "Gạo", base: 4 },
      { id: "muoi", label: "Muối", base: 1 },
      { id: "mam", label: "Nước mắm", base: 2 },
      { id: "dau", label: "Dầu hỏa", base: 2 },
      { id: "vai", label: "Vải", base: 5 },
      { id: "keo", label: "Bánh kẹo", base: 2 },
      { id: "dochoi", label: "Đồ chơi", base: 3 },
    ],
    need: { gao: 2, muoi: 1, mam: 1, dau: 1, vai: 1 },
    growth: 0.004,
    jumpEvery: 0,
    jumpFactor: 1,
    shortages: false,
  },
};

/** Băm số nhỏ, tất định */
function hash(n: number): number {
  let x = (n | 0) ^ 0x9e3779b9;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

export function jumpsBefore(cfg: MarketConfig, t: number): number {
  return cfg.jumpEvery > 0 ? Math.floor(t / cfg.jumpEvery) : 0;
}

export function priceAt(cfg: MarketConfig, stallId: string, t: number): number {
  const s = cfg.stalls.find((x) => x.id === stallId);
  if (!s) return Infinity;
  const p = s.base * Math.exp(cfg.growth * t) * Math.pow(cfg.jumpFactor, jumpsBefore(cfg, t));
  return Math.round(p * 10) / 10;
}

/** Sạp hết hàng trong từng khoảng 3 giây, tất định theo seed */
export function outOfStock(cfg: MarketConfig, stallId: string, t: number, seed: number): boolean {
  if (!cfg.shortages) return false;
  const i = cfg.stalls.findIndex((x) => x.id === stallId);
  const slot = Math.floor(t / 3);
  if (slot === 0) return false;
  return hash(seed * 31 + i * 101 + slot) < 0.33;
}

export interface MarketState {
  t: number;
  money: number;
  at: string | null;
  /** Đang đi tới sạp nào, còn bao lâu */
  walkingTo: string | null;
  walkLeft: number;
  bought: Record<string, number>;
  done: boolean;
}

export function startMarket(cfg: MarketConfig): MarketState {
  return { t: 0, money: cfg.budget, at: null, walkingTo: null, walkLeft: 0, bought: {}, done: false };
}

export function tick(cfg: MarketConfig, s: MarketState, dt: number): MarketState {
  if (s.done) return s;
  const n = { ...s, t: Math.min(cfg.durationSec, s.t + dt) };
  if (n.walkingTo) {
    n.walkLeft -= dt;
    if (n.walkLeft <= 0) {
      n.at = n.walkingTo;
      n.walkingTo = null;
      n.walkLeft = 0;
    }
  }
  if (n.t >= cfg.durationSec) n.done = true;
  return n;
}

export function walkTo(cfg: MarketConfig, s: MarketState, stallId: string): MarketState {
  if (s.done || s.at === stallId || s.walkingTo === stallId) return s;
  return { ...s, walkingTo: stallId, walkLeft: s.at === null ? cfg.walkSec / 2 : cfg.walkSec };
}

export type BuyResult = "ok" | "notHere" | "out" | "poor" | "enough";

export function canBuy(cfg: MarketConfig, s: MarketState, seed: number): BuyResult {
  if (!s.at || s.walkingTo) return "notHere";
  if (outOfStock(cfg, s.at, s.t, seed)) return "out";
  const needLeft = (cfg.need[s.at] ?? 0) - (s.bought[s.at] ?? 0);
  const extra = cfg.need[s.at] === undefined;
  if (!extra && needLeft <= 0) return "enough";
  if (extra && (s.bought[s.at] ?? 0) >= 1) return "enough";
  if (priceAt(cfg, s.at, s.t) > s.money) return "poor";
  return "ok";
}

export function buy(cfg: MarketConfig, s: MarketState, seed: number): MarketState {
  if (canBuy(cfg, s, seed) !== "ok" || !s.at) return s;
  const price = priceAt(cfg, s.at, s.t);
  const n = { ...s, money: Math.round((s.money - price) * 10) / 10, bought: { ...s.bought, [s.at]: (s.bought[s.at] ?? 0) + 1 } };
  if (allBought(cfg, n) && !cfg.stalls.some((x) => cfg.need[x.id] === undefined)) n.done = true;
  return n;
}

export function neededCount(cfg: MarketConfig): number {
  return Object.values(cfg.need).reduce((a, b) => a + b, 0);
}

export function boughtNeeded(cfg: MarketConfig, s: MarketState): number {
  return Object.entries(cfg.need).reduce((a, [id, q]) => a + Math.min(q, s.bought[id] ?? 0), 0);
}

export function allBought(cfg: MarketConfig, s: MarketState): boolean {
  return boughtNeeded(cfg, s) >= neededCount(cfg);
}

export function extrasBought(cfg: MarketConfig, s: MarketState): number {
  return cfg.stalls.filter((x) => cfg.need[x.id] === undefined && (s.bought[x.id] ?? 0) > 0).length;
}

/** Điểm 0..100: mua đủ đồ là chính, xong sớm được thêm */
export function marketScore(cfg: MarketConfig, s: MarketState): number {
  const frac = boughtNeeded(cfg, s) / neededCount(cfg);
  const speed = allBought(cfg, s) ? 1 - s.t / cfg.durationSec : 0;
  return Math.round(70 * frac + 30 * speed);
}

export interface MarketResult {
  score: number;
  bought: number;
  needed: number;
  extras: number;
  moneyLeft: number;
  seconds: number;
  skipped: boolean;
}

export function marketResult(cfg: MarketConfig, s: MarketState): MarketResult {
  return {
    score: marketScore(cfg, s),
    bought: boughtNeeded(cfg, s),
    needed: neededCount(cfg),
    extras: extrasBought(cfg, s),
    moneyLeft: s.money,
    seconds: Math.round(s.t),
    skipped: false,
  };
}

/** Người chơi bấm "Về nhà" */
export function finish(s: MarketState): MarketState {
  return { ...s, done: true };
}
