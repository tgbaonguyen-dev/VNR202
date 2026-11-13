// Kiểu dữ liệu chung giữa dữ liệu, engine và giao diện.
// Đổi file này thì báo cả nhóm.

export type StatKey = "health" | "happy" | "know" | "bond";
export type Stats = Record<StatKey, number>;

/** Tác động lên chỉ số. money và career là số ẩn của engine. */
export type Effects = Partial<Stats> & { money?: number; career?: number };

export type Rarity = "common" | "rare" | "epic";
export type MoneyTier = "tight" | "enough" | "comfy";
export type Era = "e85" | "e90" | "e00" | "e10";

export type FocusId =
  | "study"
  | "help"
  | "play"
  | "learn"
  | "work"
  | "family"
  | "health"
  | "community";

export interface Family {
  id: string;
  name: string;
  blurb: string;
  stats: Stats;
  money: number;
}

/** Mẩu "Hồi đó…" – thông tin thật, bắt buộc có nguồn. */
export interface HoiDo {
  id: string;
  text: string;
  source: string;
  url: string;
  /** true nếu nguồn là cơ quan thống kê / văn bản chính thức */
  official: boolean;
}

export interface Milestone {
  year: number;
  text: string;
  /** Mốc lớn: thẻ được giữ lâu hơn */
  big?: boolean;
  /** Dòng "Từ nay gia đình bạn có thể…" */
  unlockText?: string;
  /** Khóa mở được bật trong state.unlocked */
  unlocks?: string[];
  effects?: Effects;
  /** Nhà đang eo hẹp được cộng gấp đôi */
  catchUp?: boolean;
  source: string;
  url?: string;
}

export interface RollResult {
  effects?: Effects;
  marks?: string[];
  text: string;
  follow?: { after: number; text: string; effects?: Effects; marks?: string[] };
}

export interface Option {
  id: string;
  label: string;
  hint?: string;
  effects?: Effects;
  marks?: string[];
  /** Kết quả hiện sau khi chọn */
  outcome?: string;
  /** Điều kiện để mở; không thỏa thì hiện dạng khóa */
  requires?: (s: GameState) => boolean;
  lockedReason?: string;
  /** Lựa chọn có may rủi (thi đại học, mở cơ sở) */
  roll?: { chance: (s: GameState) => number; success: RollResult; fail: RollResult };
  /** Dòng tự kể về mình ở cảnh gặp lại (ngôi thứ nhất) */
  selfLine?: string;
  /** Dòng kể về người bạn khi người bạn chọn lựa chọn này */
  friendLine?: string;
  /** Thẻ nhắc lại sau vài năm */
  echo?: { after: number; text: string; effects?: Effects; marks?: string[] };
  hoiDoId?: string;
  /** Tác động thêm theo hoàn cảnh (ví dụ nhà khó khăn cho con học cấp ba) */
  extra?: (s: GameState) => RollResult | null;
}

export interface TurningPoint {
  year: number;
  id: string;
  title: string;
  question: string;
  options: Option[];
  /** Người bạn chọn khác người chơi */
  friendDiverges?: boolean;
  /** Lựa chọn riêng của người chơi (theo hoàn cảnh, đời tư): người bạn không chọn theo */
  personal?: boolean;
  /** Hộp lựa chọn nhanh: ngắn, không có tiêu đề năm lớn */
  quick?: boolean;
  hoiDoId?: string;
  /** Chỉ xuất hiện khi thỏa điều kiện */
  cond?: (s: GameState) => boolean;
  /** Nhóm dòng kể ở cảnh gặp lại */
  storyGroup?: "school" | "work" | "life";
}

export interface Purchase {
  id: string;
  label: string;
  desc: string;
  /** Giá quy theo giá năm 2025, triệu đồng */
  price: number;
  /** Phần phải có sẵn, còn lại được vay (0..1) */
  downPayment: number;
  /** Có xuất hiện trong danh sách chưa */
  available: (s: GameState) => boolean;
  effects?: Effects;
  marks?: string[];
  /** Mua được nhiều lần, tối đa một lần mỗi năm */
  repeatable?: boolean;
}

export interface LifeEvent {
  id: string;
  text: string;
  minAge?: number;
  maxAge?: number;
  year?: number;
  minYear?: number;
  cond?: (s: GameState) => boolean;
  effects?: Effects;
  /** Xác suất mỗi năm khi đủ điều kiện (mặc định 0.3) */
  chance?: number;
  /** Luôn xảy ra khi đủ điều kiện */
  always?: boolean;
  follow?: { after: number; text: string; sub?: string; effects?: Effects; marks?: string[] };
  hoiDoId?: string;
  /** Câu thứ hai: chi tiết hoặc suy nghĩ, hiện nhỏ dưới dòng chính */
  sub?: string;
}

/** Cảnh làng theo năm và suy nghĩ theo tâm trạng: chỉ để kể, không đổi chỉ số */
export interface Scene {
  id: string;
  fromYear: number;
  toYear: number;
  text: string;
  cond?: (s: GameState) => boolean;
}

export interface Mood {
  id: string;
  text: string;
  minAge: number;
  maxAge: number;
  cond: (s: GameState) => boolean;
}

export interface Item {
  id: string;
  name: string;
  rarity: Rarity;
  context: string;
  cond: (s: GameState) => boolean;
  hoiDoId?: string;
}

export interface Reflection {
  id: string;
  year: number;
  question: string;
  answers: string[];
}

export type CardKind = "history" | "item" | "life" | "echo" | "friend" | "choice" | "money" | "thought" | "scene";

export interface Card {
  id: string;
  year: number;
  kind: CardKind;
  text: string;
  sub?: string;
  itemId?: string;
  hoiDoId?: string;
  source?: string;
  url?: string;
  big?: boolean;
  /** true nếu vượt giới hạn thẻ của năm: hiện dạng dòng gọn */
  compact?: boolean;
  /** Thay đổi trong nhà đến từ đâu */
  tag?: "doimoi" | "choice";
  /** Dòng tin không vui (hiện màu khác) */
  down?: boolean;
  age?: number;
}

export type HouseKey =
  | "electric"
  | "tv"
  | "bike"
  | "motorbike"
  | "road"
  | "sign"
  | "boxes"
  | "pond"
  | "computer"
  | "water";

export interface HouseChange {
  key: HouseKey | "stage";
  by: "doimoi" | "choice";
  label: string;
}

export type Pending =
  | { type: "turning"; id: string }
  | { type: "reflection"; id: string }
  | { type: "reunion" }
  | { type: "outcome"; title: string; text: string; hoiDoId?: string }
  | { type: "kidask"; id: string; childAge: number }
  | { type: "minigame"; id: string };

/** Kết quả một mini-game người chơi tự điều khiển */
export interface MiniResult {
  score: number;
  bought: number;
  needed: number;
  extras: number;
  moneyLeft: number;
  seconds: number;
  skipped: boolean;
}

/** Sự kiện xảy ra khi một chỉ số đang thấp (hoặc rất cao) */
export interface StatEvent {
  id: string;
  stat: StatKey | "money";
  kind: "low" | "high";
  minAge: number;
  maxAge: number;
  minYear?: number;
  maxYear?: number;
  cond?: (s: GameState) => boolean;
  text: string;
  sub?: string;
  effects?: Effects;
  /** Trở ngại luôn có cách vượt qua */
  follow?: { after: number; text: string; effects?: Effects };
}

/** Hệ quả của một mốc chính sách đến tận nhà bạn, vài năm sau mốc */
export interface Ripple {
  id: string;
  /** Năm của mốc trong history.ts */
  from: number;
  /** Bao nhiêu năm sau mốc thì đến nhà bạn */
  after: number;
  /** Tên ngắn hiện ở bảng "Đổi mới đến nhà bạn" */
  short: string;
  text: string;
  sub?: string;
  cond?: (s: GameState) => boolean;
  effects?: Effects;
  marks?: string[];
}

/** Thứ con bạn xin bạn, khi bạn đã thành bố mẹ */
export interface KidRequest {
  id: string;
  label: string;
  /** Lời con xin */
  plea: string;
  minAge: number;
  maxAge: number;
  minYear?: number;
  /** Triệu đồng, quy theo giá năm 2025 */
  price: number;
  /** Thứ bạn từng xin bố mẹ tương tự (id trong REQUESTS), để nhắc lại */
  sameAs?: string;
  yes: string;
  later: string;
  explain: string;
}

export interface Friend {
  name: string;
  pronoun: string;
  choices: Record<string, string>;
}

/** Bạn cùng xóm, cùng tuổi (ngoài người bạn thân) */
export interface Peer {
  name: string;
  gender: "Nam" | "Nữ";
  choices: Record<string, string>;
}

export interface People {
  father: { name: string; birthYear: number; job: string };
  mother: { name: string; birthYear: number; job: string };
  siblings: number;
  /** Anh chị em lớn hơn hay nhỏ hơn */
  siblingsOlder: boolean;
  grandparents: boolean;
  spouse?: { name: string; since: number };
  children: number[];
}

/** Tài chính cá nhân, triệu đồng, quy theo giá năm 2025 */
export interface Finance {
  savings: number;
  debt: number;
  income: number;
  household: number;
  /** Gửi tiết kiệm ngân hàng thay vì giữ tiền mặt */
  banked: boolean;
  /** Tiền để dành và nợ của bố mẹ (quỹ chung của nhà khi bạn còn nhỏ) */
  famSavings: number;
  famDebt: number;
  /** Thu nhập của bố mẹ một năm */
  famIncome: number;
}

/** Thứ bạn xin bố mẹ khi còn nhỏ */
export interface ChildRequest {
  id: string;
  label: string;
  desc: string;
  minAge: number;
  maxAge: number;
  minYear?: number;
  /** Triệu đồng, quy theo giá năm 2025 */
  price: number;
  effects?: Effects;
  marks?: string[];
  /** Câu kể khi nhận được */
  got: string;
}

export interface YearSnapshot {
  year: number;
  stats: Stats;
  marks: string[];
}

export interface Settings {
  secondsPerYear: number;
  defaultSpeed: 1 | 2 | 4;
  maxFeaturedCards: number;
  holdSeconds: number;
  electricityYear: number;
  features: {
    focus: boolean;
    reflections: boolean;
    eraTheme: boolean;
    hoiDo: boolean;
    officialOnly: boolean;
    /** Mini-game tự điều khiển ở các mốc */
    minigames: boolean;
  };
}

export interface GameState {
  seed: number;
  rng: number;
  nickname: string;
  familyId: string;
  year: number;
  age: number;
  stats: Stats;
  money: number;
  careerPts: number;
  careerBonus: number;
  focus: FocusId;
  focusCount: Partial<Record<FocusId, number>>;
  marks: string[];
  unlocked: string[];
  choices: Record<string, string>;
  items: string[];
  newItems: string[];
  seenHoiDo: string[];
  houseStage: 1 | 2 | 3 | 4;
  house: HouseKey[];
  houseChanges: HouseChange[];
  doors: string[];
  firedEvents: string[];
  scheduled: { year: number; card: Omit<Card, "id" | "year">; effects?: Effects; marks?: string[] }[];
  friend: Friend;
  feed: Card[];
  pending: Pending[];
  gender: "Nam" | "Nữ";
  birthMonth: number;
  dream: string;
  people: People;
  peers: Peer[];
  fin: Finance;
  lastCareerLevel: number;
  timeline: YearSnapshot[];
  announced: string[];
  reflections: Record<string, string>;
  cherish?: string;
  settings: Settings;
  finished: boolean;
  cardSeq: number;
  /** Kết quả mini-game theo id */
  minigames: Record<string, MiniResult>;
}
