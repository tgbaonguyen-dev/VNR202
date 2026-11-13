import type {
  Card,
  CardKind,
  Effects,
  GameState,
  HouseChange,
  HouseKey,
  MoneyTier,
  Option,
  Settings,
  StatKey,
  TurningPoint,
} from "../types";
import { END_YEAR, START_YEAR } from "../config";
import { FAMILIES, FAMILY_BY_ID, FOCUS_BY_ID, FRIENDS, REFLECTIONS, STRENGTHS } from "../data/people";
import { HO, TEN_NAM, TEN_NU, TEN_GOI_NAM, TEN_GOI_NU, DREAMS, PARENT_JOBS, SIBLINGS } from "../data/names";
import { careerLevel, careerTitle, formatMoney, updateFinance, windfall, monthlyIncome, eraMult } from "./life";
import { HISTORY } from "../data/history";
import { LIFE_EVENTS } from "../data/lifeEvents";
import { SCENES, MOODS } from "../data/scenes";
import { REQUESTS, REQUEST_BY_ID, SCHOOL_COSTS, OPTION_SCHOOL, KID_REQUESTS, KID_REQUEST_BY_ID } from "../data/requests";
import { HOUSEHOLD_BASE } from "../data/names";
import { inflationOf } from "../data/economy";
import { RIPPLES } from "../data/ripples";
import { STAT_EVENTS } from "../data/statEvents";
import { CONGRESS_BY_YEAR } from "../data/congresses";
import { MARKETS } from "./market";
import type { MiniResult } from "../types";
import { ITEMS, ITEM_BY_ID } from "../data/items";
import { HOI_DO_BY_ID } from "../data/hoiDo";
import { PURCHASES, PURCHASE_BY_ID, TURNING_POINTS, TP_BY_ID, has } from "../data/turningPoints";
export { careerLevel, careerTitle } from "./life";

// ---------------------------------------------------------------- RNG

/** mulberry32: trả về [số 0..1, trạng thái mới] */
export function nextRandom(rng: number): [number, number] {
  let t = (rng + 0x6d2b79f5) | 0;
  const next = t;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next];
}

function rand(d: GameState): number {
  const [v, n] = nextRandom(d.rng);
  d.rng = n;
  return v;
}

function pick<T>(d: GameState, arr: T[]): T {
  return arr[Math.floor(rand(d) * arr.length)];
}

// ---------------------------------------------------------------- tiện ích

const STAT_KEYS: StatKey[] = ["health", "happy", "know", "bond"];
const STAT_FLOOR = 25;
const MONEY_FLOOR = 8;

export function moneyTier(money: number): MoneyTier {
  if (money < 35) return "tight";
  if (money < 80) return "enough";
  return "comfy";
}

export function eraOf(year: number): "e85" | "e90" | "e00" | "e10" {
  if (year < 1990) return "e85";
  if (year < 2000) return "e90";
  if (year < 2010) return "e00";
  return "e10";
}

function fill(text: string, d: GameState): string {
  const given = (n: string) => n.split(" ").slice(-1)[0];
  return text
    .replaceAll("{friend}", d.friend.name)
    .replaceAll("{spouse}", d.people.spouse ? given(d.people.spouse.name) : "người thương")
    .replaceAll("{bo}", given(d.people.father.name))
    .replaceAll("{me}", given(d.people.mother.name));
}

function applyStat(cur: number, delta: number): number {
  if (delta >= 0) return Math.min(100, cur + delta * Math.max(0.25, (105 - cur) / 70));
  return Math.max(STAT_FLOOR, cur + delta * Math.max(0.4, cur / 60));
}

export function applyEffects(d: GameState, e?: Effects, catchUp = false) {
  if (!e) return;
  for (const k of STAT_KEYS) {
    const v = e[k];
    if (v) d.stats[k] = applyStat(d.stats[k], v);
  }
  if (e.money) {
    const bonus = catchUp && d.money < 35 && e.money > 0 ? 2 : 1;
    d.money = Math.min(100, Math.max(MONEY_FLOOR, d.money + e.money * bonus));
    windfall(d, e.money * bonus);
  }
  if (e.career) d.careerBonus += e.career;
}

function addMarks(d: GameState, marks?: string[]) {
  for (const m of marks ?? []) if (!d.marks.includes(m)) d.marks.push(m);
}

const PRIORITY: Record<CardKind, number> = { history: 0, choice: 1, item: 2, money: 3, life: 4, echo: 5, friend: 6, thought: 7, scene: 8 };

function relayout(d: GameState, year: number) {
  const cards = d.feed.filter((c) => c.year === year);
  const sorted = [...cards].sort((a, b) => PRIORITY[a.kind] - PRIORITY[b.kind]);
  sorted.forEach((c, i) => (c.compact = i >= d.settings.maxFeaturedCards));
}

function pushCard(d: GameState, card: Omit<Card, "id" | "year">) {
  d.cardSeq += 1;
  d.feed.push({ ...card, id: `c${d.cardSeq}`, year: d.year, age: d.age });
  relayout(d, d.year);
}

function hoiDoAllowed(d: GameState, id?: string): string | undefined {
  if (!id || !d.settings.features.hoiDo) return undefined;
  const h = HOI_DO_BY_ID[id];
  if (!h) return undefined;
  if (d.settings.features.officialOnly && !h.official) return undefined;
  return id;
}

function seeHoiDo(d: GameState, id?: string) {
  if (id && !d.seenHoiDo.includes(id)) d.seenHoiDo.push(id);
}

// ---------------------------------------------------------------- khởi tạo

export interface NewGameOptions {
  seed: number;
  nickname: string;
  settings: Settings;
  familyId?: string;
}

export function newGame(o: NewGameOptions): GameState {
  let rng = o.seed | 0;
  const r1 = nextRandom(rng);
  rng = r1[1];
  const r2 = nextRandom(rng);
  rng = r2[1];
  const family = o.familyId ? FAMILY_BY_ID[o.familyId] : FAMILIES[Math.floor(r1[0] * FAMILIES.length)];
  const friend = FRIENDS[Math.floor(r2[0] * FRIENDS.length)];
  const draw = <T,>(arr: T[]): T => {
    const r = nextRandom(rng);
    rng = r[1];
    return arr[Math.floor(r[0] * arr.length)];
  };
  const gender = draw(["Nam", "Nữ"] as const);
  const ho = draw(HO);
  const sib = SIBLINGS[family.id];
  const jobs = PARENT_JOBS[family.id];
  const peers = [0, 1].map(() => {
    const g = draw(["Nam", "Nữ"] as const);
    return { name: draw(g === "Nam" ? TEN_GOI_NAM : TEN_GOI_NU), gender: g, choices: {} };
  });

  const d: GameState = {
    seed: o.seed,
    rng,
    nickname: o.nickname.trim() || "Bạn",
    familyId: family.id,
    year: START_YEAR,
    age: 0,
    stats: { ...family.stats },
    money: family.money,
    careerPts: 0,
    careerBonus: 0,
    focus: "help",
    focusCount: {},
    marks: [],
    unlocked: [],
    choices: {},
    items: [],
    newItems: [],
    seenHoiDo: [],
    houseStage: 1,
    house: [],
    houseChanges: [],
    doors: [],
    firedEvents: [],
    scheduled: [],
    gender,
    birthMonth: 1 + Math.floor(nextRandom(rng)[0] * 12),
    dream: draw(DREAMS),
    people: {
      // Nhà có anh chị lớn thì bố mẹ lớn tuổi hơn
      father: { name: `${ho} ${draw(TEN_NAM)}`, birthYear: (sib.older ? 1946 : 1956) + Math.floor(nextRandom(rng + 7)[0] * 5), job: jobs[0] },
      mother: { name: `${draw(HO)} ${draw(TEN_NU)}`, birthYear: (sib.older ? 1948 : 1958) + Math.floor(nextRandom(rng + 11)[0] * 5), job: jobs[1] },
      siblings: sib.n,
      siblingsOlder: sib.older,
      grandparents: family.id === "ongba",
      children: [],
    },
    peers,
    fin: { savings: 0, debt: 0, income: 0, household: 0, banked: false, famSavings: 0, famDebt: 0, famIncome: 0 },
    lastCareerLevel: 0,
    timeline: [],
    announced: [],
    friend: { name: friend.name, pronoun: friend.pronoun, choices: {} },
    feed: [],
    pending: [],
    reflections: {},
    minigames: {},
    settings: o.settings,
    finished: false,
    cardSeq: 0,
  };
  processYear(d, true);
  return d;
}

// ---------------------------------------------------------------- vòng năm

export function advance(s: GameState): GameState {
  if (s.finished || s.pending.length > 0 || s.year >= END_YEAR) return s;
  const d = structuredClone(s);
  d.year += 1;
  d.age += 1;
  processYear(d, false);
  return d;
}

const DOORS: { key: string; year: (s: Settings) => number }[] = [
  { key: "khoan10", year: () => 1988 },
  { key: "dien", year: (s) => s.electricityYear },
  { key: "tivi", year: (s) => s.electricityYear + 1 },
  { key: "kcn", year: () => 1996 },
  { key: "luatdn", year: () => 2000 },
  { key: "dienthoai", year: () => 2003 },
  { key: "bhyt", year: () => 2004 },
  { key: "maytinh", year: () => 2005 },
  { key: "wto", year: () => 2007 },
  { key: "ntm", year: () => 2010 },
  { key: "smartphone", year: () => 2013 },
  { key: "online", year: () => 2015 },
];
export const DOOR_COUNT = DOORS.length;

function moneyDrift(year: number): number {
  if (year <= 1988) return 0;
  if (year <= 2006) return 0.8;
  if (year <= 2019) return 1;
  if (year === 2020) return -3;
  return 1;
}

function processYear(d: GameState, first: boolean) {
  d.newItems = [];
  d.houseChanges = [];

  // 1. Trôi tự nhiên
  if (!first) {
    d.money = Math.min(100, Math.max(MONEY_FLOOR, d.money + moneyDrift(d.year)));
    if (d.age >= 6 && d.settings.features.focus) {
      const f = FOCUS_BY_ID[d.focus];
      const effects = { ...f.effects };
      if (effects.career) {
        d.careerPts += effects.career;
        delete effects.career;
      }
      applyEffects(d, effects);
      d.focusCount[d.focus] = (d.focusCount[d.focus] ?? 0) + 1;
    } else if (d.age >= 18) {
      d.careerPts += 1;
    }
    if (d.age > 30) d.stats.health = Math.max(STAT_FLOOR, d.stats.health - 0.3);
    d.stats.happy += (55 - d.stats.happy) * 0.04;
    d.stats.bond += (55 - d.stats.bond) * 0.04;
    if (d.age === 18 && (d.focus === "study" || d.focus === "help" || d.focus === "play")) d.focus = "work";
  }

  // 2. Việc đã hẹn
  const due = d.scheduled.filter((x) => x.year === d.year);
  d.scheduled = d.scheduled.filter((x) => x.year !== d.year);
  for (const x of due) {
    applyEffects(d, x.effects);
    addMarks(d, x.marks);
    pushCard(d, { ...x.card, text: fill(x.card.text, d), sub: x.card.sub ? fill(x.card.sub, d) : undefined });
  }

  // 3. Mốc lịch sử
  const m = HISTORY.find((h) => h.year === d.year);
  if (m) {
    for (const u of m.unlocks ?? []) if (!d.unlocked.includes(u)) d.unlocked.push(u);
    applyEffects(d, m.effects, m.catchUp);
    const dh = CONGRESS_BY_YEAR[d.year];
    pushCard(d, { kind: "history", text: m.text, sub: m.unlockText ?? (dh ? `Định hướng: ${dh.focus}` : undefined), source: m.source, url: m.url, big: m.big || !!dh });
  }
  d.doors = DOORS.filter((x) => d.year >= x.year(d.settings)).map((x) => x.key);
  runRipples(d);

  // 4. Ngã rẽ
  for (const tp of TURNING_POINTS.filter((t) => t.year === d.year && (!t.cond || t.cond(d)))) {
    if (tp.id === "tp2022") d.pending.push({ type: "reunion" });
    else d.pending.push({ type: "turning", id: tp.id });
  }

  // 4b. Mini-game tự điều khiển
  if (d.settings.features.minigames) {
    for (const m of Object.values(MARKETS)) if (m.year === d.year && !d.minigames[m.id]) d.pending.push({ type: "minigame", id: m.id });
  }

  // 5. Sự kiện đời thường và sự kiện theo chỉ số
  runLifeEvents(d);
  runStatEvents(d);

  // 6. Tin người bạn, cảnh làng, tâm trạng
  friendNews(d);
  villageScene(d);
  moodLine(d);

  // 7. Kỷ vật và ngôi nhà
  checkItems(d);
  updateHouse(d);

  // 8. Tài chính, công việc, gia đình riêng
  familyYear(d);
  updateFinance(d);
  lifeMilestones(d);
  kidAsks(d);
  announcePurchases(d);

  // 9. Suy ngẫm
  if (d.settings.features.reflections) {
    for (const r of REFLECTIONS) if (r.year === d.year && r.id !== "r40") d.pending.push({ type: "reflection", id: r.id });
  }
  if (d.year === END_YEAR) d.pending.push({ type: "reflection", id: "r40" });

  snapshot(d);
  maybeFinish(d);
}

function snapshot(d: GameState) {
  const snap = { year: d.year, stats: { ...d.stats }, marks: [...d.marks] };
  const i = d.timeline.findIndex((t) => t.year === d.year);
  if (i >= 0) d.timeline[i] = snap;
  else d.timeline.push(snap);
}

// ---------------------------------------------------------------- mốc lịch sử đến nhà bạn

function runRipples(d: GameState) {
  for (const r of RIPPLES) {
    if (r.from + r.after !== d.year || d.announced.includes(`rip:${r.id}`)) continue;
    if (r.cond && !r.cond(d)) continue;
    d.announced.push(`rip:${r.id}`);
    applyEffects(d, r.effects);
    addMarks(d, r.marks);
    const m = HISTORY.find((h) => h.year === r.from);
    const from = `Từ mốc năm ${r.from}${m ? `: ${m.text.replace(/\.$/, "")}` : ""}.`;
    pushCard(d, { kind: "life", text: fill(r.text, d), sub: [r.sub, from].filter(Boolean).join(" "), tag: "doimoi" });
  }
}

/** Những hệ quả của Đổi mới đã đến nhà bạn, để hiện ở bảng bên */
export function ripplesReached(s: GameState) {
  return RIPPLES.filter((r) => s.announced.includes(`rip:${r.id}`));
}

// ---------------------------------------------------------------- tiền nhà bố mẹ

/** Phần thu nhập bố mẹ để dành được mỗi năm, tùy hoàn cảnh (minh họa) */
const FAM_RATE: Record<string, number> = { conmot: 0.1, ongba: 0.06, anhchixa: 0.04, dongcon: 0.035, itruong: 0.03 };
function famSaveRate(d: GameState): number {
  let r = FAM_RATE[d.familyId] ?? 0.05;
  if (d.familyId === "anhchixa" && d.year >= 1993) r += 0.05; // anh chị gửi tiền về
  if (d.year < 1989) r *= 0.3; // những năm khó, làm ra chỉ đủ ăn
  // Chính sách đến nhà: mỗi dấu cộng thêm phần để dành được
  if (has(d, "dm_cho")) r += 0.01;
  if (has(d, "dm_khoan")) r += 0.025;
  if (has(d, "dm_guive")) r += 0.015;
  if (has(d, "dm_ntm")) r += 0.01;
  if (has(d, "dm_giamngheo")) r += 0.02;
  return r;
}

export function parentsIncome(d: GameState): number {
  const base = HOUSEHOLD_BASE[d.familyId] ?? 70;
  const lvl = d.age < 18 ? 0.7 + d.money / 100 : 1.05;
  return base * eraMult(d.year) * lvl;
}

/** Bố mẹ vay để lo cho con: ghi thẻ một lần cho mỗi đợt vay */
function famPay(d: GameState, amount: number, why: string) {
  d.fin.famSavings -= amount;
  if (d.fin.famSavings < 0) {
    const loan = -d.fin.famSavings;
    d.fin.famDebt += loan;
    d.fin.famSavings = 0;
    if (!d.announced.includes(`famloan:${why}`)) {
      d.announced.push(`famloan:${why}`);
      pushCard(d, {
        kind: "money",
        text: `Tiền nhà không đủ, bố mẹ vay họ hàng khoảng ${formatMoney(loan)} để lo cho bạn ${why}.`,
        sub: "Mẹ dặn: con cứ học, chuyện tiền để bố mẹ lo.",
        down: true,
      });
      applyEffects(d, { bond: 2 });
    }
  }
}

function familyYear(d: GameState) {
  const inc = parentsIncome(d);
  d.fin.famIncome = inc;
  // Tiền mặt bố mẹ cất ở nhà mất giá theo lạm phát thật của năm đó
  const infl = inflationOf(d.year);
  if (infl && infl > 0 && d.fin.famSavings > 0) d.fin.famSavings /= 1 + infl / 100;
  let surplus = inc * famSaveRate(d);
  // Trả nợ trước
  if (d.fin.famDebt > 0) {
    const pay = Math.min(d.fin.famDebt, surplus);
    d.fin.famDebt -= pay;
    surplus -= pay;
    if (d.fin.famDebt < 0.05) {
      d.fin.famDebt = 0;
      pushCard(d, { kind: "money", text: "Bố mẹ đã trả xong khoản vay lo cho bạn đi học.", sub: "Tối đó mẹ nấu thêm món, bố rót chén rượu nhỏ." });
      applyEffects(d, { happy: 2, bond: 2 });
    }
  }
  d.fin.famSavings += surplus;
  // Tiền học
  for (const c of SCHOOL_COSTS) {
    if (!has(d, c.mark) || d.age < c.fromAge || d.age > c.toAge) continue;
    if (c.mark === "hocthem" && !d.announced.includes("got:hocthem")) continue;
    const cost = c.perYear;
    if (!d.announced.includes(`school:${c.mark}`)) {
      d.announced.push(`school:${c.mark}`);
      if (c.mark !== "hocthem")
        pushCard(d, { kind: "money", text: `Năm học mới, bố mẹ đóng khoảng ${formatMoney(cost)} tiền ${c.label} cho bạn.`, sub: "Bạn nhìn mẹ gói tiền trong chiếc khăn mùi xoa, hiểu đó là cả mấy tháng làm lụng." });
    }
    famPay(d, cost, c.label);
  }
  // Lời hứa năm trước
  for (const a of d.announced.filter((x) => x.startsWith(`promise:`) && x.endsWith(`:${d.year}`))) {
    const id = a.split(":")[1];
    const r = REQUEST_BY_ID[id];
    if (r && !d.announced.includes(`got:${id}`)) {
      famPay(d, r.price, "sắm sửa");
      giveRequest(d, r, `Bố mẹ giữ đúng lời hứa năm trước: ${lower(r.label)}.`, "Bạn mừng đến mất ngủ.");
    }
  }
}

const lower = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

function giveRequest(d: GameState, r: (typeof REQUESTS)[number], text: string, reaction: string) {
  d.announced.push(`got:${r.id}`);
  applyEffects(d, r.effects);
  addMarks(d, r.marks);
  pushCard(d, { kind: "choice", text, sub: `${reaction} ${r.got}`, tag: "choice" });
}

export type AskState = "open" | "asked" | "got" | "promised" | "gone";

export function requestState(s: GameState, id: string): AskState {
  const r = REQUEST_BY_ID[id];
  if (s.announced.includes(`got:${id}`)) return "got";
  if (s.announced.some((a) => a.startsWith(`promise:${id}:`))) return "promised";
  if (!r || s.age < r.minAge || s.age > r.maxAge || (r.minYear && s.year < r.minYear)) return "gone";
  if (s.announced.includes(`ask:${s.year}`)) return "asked";
  return "open";
}

/** Những thứ hợp tuổi, hợp thời để xin */
export function openRequests(s: GameState) {
  return REQUESTS.filter((r) => s.age >= r.minAge && s.age <= r.maxAge && (!r.minYear || s.year >= r.minYear));
}

/** Xin bố mẹ một thứ. Mỗi năm xin được một lần. Bố mẹ quyết theo tiền nhà. */
export function askParents(s: GameState, id: string): GameState {
  if (requestState(s, id) !== "open") return s;
  const d = structuredClone(s);
  const r = REQUEST_BY_ID[id];
  d.announced.push(`ask:${d.year}`);
  const ratio = d.fin.famSavings / r.price;
  const ask = `Bạn xin bố mẹ ${lower(r.label)}.`;
  if (ratio >= 3) {
    d.fin.famSavings -= r.price;
    giveRequest(d, r, ask, "Bố cười: chuyện này thì bố mẹ lo được.");
    d.announced.push(`askres:${id}:yes`);
  } else if (ratio >= 1) {
    d.fin.famSavings -= r.price;
    applyEffects(d, { bond: 1 });
    giveRequest(d, r, ask, "Mẹ đếm lại tiền trong hộp sắt, nghĩ một lúc lâu rồi mới gật đầu.");
    d.announced.push(`askres:${id}:hard`);
  } else if (ratio >= 0.4 && d.age < r.maxAge) {
    d.announced.push(`promise:${id}:${d.year + 1}`);
    d.announced.push(`askres:${id}:later`);
    pushCard(d, {
      kind: "choice",
      text: ask,
      sub: d.familyId === "itruong" || d.familyId === "dongcon" ? "Bố hẹn: đợi bán xong vụ lúa sau, bố mua cho. Bạn phụ việc đồng thêm cho nhanh." : "Mẹ hẹn: sang năm nhà dư dả hơn, mẹ mua cho. Bạn gật đầu, chờ được.",
    });
    applyEffects(d, { bond: 2 });
  } else {
    pushCard(d, { kind: "choice", text: ask, sub: "Mẹ xoa đầu bạn: năm nay nhà còn khó, con thông cảm cho bố mẹ nhé. Bạn không nài thêm.", down: true });
    applyEffects(d, { bond: 2, happy: -1 });
    d.announced.push(`askres:${id}:no`);
  }
  checkItems(d);
  snapshot(d);
  return d;
}

// ---------------------------------------------------------------- con xin bạn

function kidAge(d: GameState): number | null {
  const born = d.people.children.filter((y) => y <= d.year);
  if (born.length === 0) return null;
  return d.year - born[0];
}

/** Mỗi năm có thể một lần con xin bạn một thứ */
function kidAsks(d: GameState) {
  // lời hẹn năm trước
  for (const a of d.announced.filter((x) => x.startsWith("kidpromise:") && x.endsWith(`:${d.year}`))) {
    const r = KID_REQUEST_BY_ID[a.split(":")[1]];
    if (!r) continue;
    spendSavings(d, r.price);
    applyEffects(d, { happy: 3, bond: 2 });
    pushCard(d, { kind: "choice", text: `Bạn giữ lời hứa năm trước, mua cho con ${r.label}.`, sub: r.later, tag: "choice" });
  }
  const age = kidAge(d);
  if (age === null || d.pending.some((p) => p.type === "kidask")) return;
  const pool = KID_REQUESTS.filter(
    (r) => age >= r.minAge && age <= r.maxAge && (!r.minYear || d.year >= r.minYear) && !d.announced.includes(`kidask:${r.id}`),
  );
  if (pool.length === 0 || rand(d) > 0.55) return;
  const r = pick(d, pool);
  d.announced.push(`kidask:${r.id}`);
  d.pending.push({ type: "kidask", id: r.id, childAge: age });
}

function spendSavings(d: GameState, amount: number) {
  d.fin.savings -= amount;
  if (d.fin.savings < 0) {
    d.fin.debt += -d.fin.savings;
    d.fin.savings = 0;
  }
}

/** Ngày bạn bằng tuổi con, bạn đã xin bố mẹ thứ tương tự ra sao */
export function kidMemory(s: GameState, id: string): string | null {
  const r = KID_REQUEST_BY_ID[id];
  if (!r?.sameAs) return null;
  const res = s.announced.find((a) => a.startsWith(`askres:${r.sameAs}:`))?.split(":")[2];
  const old = REQUEST_BY_ID[r.sameAs];
  if (!res || !old) return null;
  const what = lower(old.label);
  if (res === "yes") return `Ngày bạn bằng tuổi con, bạn xin bố mẹ ${what}, bố mẹ đồng ý ngay.`;
  if (res === "hard") return `Ngày bạn bằng tuổi con, bạn xin bố mẹ ${what}. Mẹ đã đếm đi đếm lại tiền trong hộp sắt mới gật đầu.`;
  if (res === "later") return `Ngày bạn bằng tuổi con, bạn xin bố mẹ ${what}. Bố mẹ hẹn sang năm, và đã giữ lời.`;
  return `Ngày bạn bằng tuổi con, bạn cũng từng xin bố mẹ ${what}. Năm ấy nhà còn khó, mẹ xoa đầu bạn bảo để sau.`;
}

export type KidChoice = "yes" | "later" | "explain";

function resolveKid(d: GameState, id: string, choice: KidChoice) {
  const r = KID_REQUEST_BY_ID[id];
  if (!r) return;
  d.choices[`kid_${id}`] = choice;
  if (choice === "yes") {
    spendSavings(d, r.price);
    applyEffects(d, { happy: 3, bond: 1 });
    pushCard(d, { kind: "choice", text: `Con xin ${r.label}. Bạn đồng ý.`, sub: r.yes, tag: "choice" });
    d.scheduled.push({ year: d.year + 3, card: { kind: "echo", text: `Con vẫn nhắc ${r.label} năm ấy bố mẹ mua cho. Con bảo: nhà mình lúc nào cũng lo cho con trước.` }, effects: { happy: 2 } });
  } else if (choice === "later") {
    d.announced.push(`kidpromise:${id}:${d.year + 1}`);
    applyEffects(d, { bond: 2 });
    pushCard(d, { kind: "choice", text: `Con xin ${r.label}. Bạn hẹn con sang năm.`, sub: "Con hơi buồn, nhưng gật đầu. Bạn ghi lời hứa vào sổ.", tag: "choice" });
    d.scheduled.push({ year: d.year + 4, card: { kind: "echo", text: "Con học được cách chờ đợi. Muốn gì con cũng tự để dành một phần trước." }, effects: { bond: 2 } });
  } else {
    applyEffects(d, { bond: 3, happy: -1 });
    pushCard(d, { kind: "choice", text: `Con xin ${r.label}. Bạn ngồi giải thích chuyện tiền nong trong nhà cho con nghe.`, sub: r.explain, tag: "choice" });
    d.scheduled.push({ year: d.year + 3, card: { kind: "echo", text: "Con lớn hơn, biết hỏi han chuyện nhà. Có hôm con bảo: con không cần mua đâu, mình để dành." }, effects: { bond: 3 } });
  }
}

// ---------------------------------------------------------------- mini-game

/** Tổng điểm các mini-game: dùng để phát quà trên lớp, không tính tiền hay chỉ số */
export function totalScore(s: GameState): number {
  return Object.values(s.minigames ?? {}).reduce((a, r) => a + (r.skipped ? 0 : r.score), 0);
}

export function maxScore(s: GameState): number {
  return s.settings.features.minigames ? Object.keys(MARKETS).length * 100 : 0;
}

/** Mã xác nhận ngắn để nhóm kiểm tra điểm khi phát quà */
export function scoreCode(s: GameState): string {
  const str = `${s.nickname}|${s.seed}|${totalScore(s)}|vnr202`;
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  const c = (h >>> 0).toString(36).toUpperCase().padStart(7, "0");
  return `${c.slice(0, 3)}-${c.slice(3, 7)}`;
}

function resolveMarket(d: GameState, id: string, r: MiniResult) {
  d.minigames[id] = r;
  if (id === "cho86") {
    if (r.skipped) {
      pushCard(d, { kind: "life", text: "Năm ấy mẹ đi chợ về, giỏ chỉ lưng lửng. Giá cả mỗi ngày một khác." });
      return;
    }
    if (r.bought >= r.needed) {
      applyEffects(d, { happy: 2, bond: 2, money: 1 });
      pushCard(d, { kind: "choice", text: `Phiên chợ năm 1986: mua đủ ${r.needed}/${r.needed} món, trong ${r.seconds} giây.`, sub: "Mẹ về đến ngõ, thở phào. Chậm thêm chút nữa là giá đã khác.", tag: "choice" });
    } else {
      applyEffects(d, { happy: -1, bond: 1 });
      pushCard(d, { kind: "choice", text: `Phiên chợ năm 1986: chỉ mua được ${r.bought}/${r.needed} món. Tiền mang theo không theo kịp giá.`, sub: "Tối ấy cả nhà ăn cơm độn khoai, mẹ để phần bạn bát cơm trắng nhất.", down: true });
      d.scheduled.push({ year: d.year + 1, card: { kind: "life", text: "Hàng xóm chia nhau từng bát gạo, từng nhúm muối. Nhà nào cũng qua được mùa giáp hạt." }, effects: { bond: 3 } });
    }
    return;
  }
  if (id === "cho90") {
    const past = d.minigames.cho86;
    if (r.skipped) {
      pushCard(d, { kind: "life", text: "Năm nay mẹ đi chợ về, giỏ đầy, còn mua cho bạn gói kẹo." });
      return;
    }
    const treats = r.extras > 0 ? " Mẹ còn mua cho bạn thêm quà." : "";
    applyEffects(d, { happy: 2 + r.extras * 2, health: 1 });
    pushCard(d, {
      kind: "choice",
      text: `Phiên chợ năm 1990: mua đủ ${r.bought}/${r.needed} món, còn dư ${r.moneyLeft} đồng.${treats}`,
      sub: past && !past.skipped
        ? `Cũng 26 đồng ấy, cũng danh sách ấy. Năm 1986 mẹ mua được ${past.bought}/${past.needed} món${past.bought >= past.needed ? ` và còn ${past.moneyLeft} đồng` : ""}. Năm nay giá đứng yên, sạp nào cũng đầy hàng.`
        : "Giá đứng yên, sạp nào cũng đầy hàng. Mẹ bảo mấy năm trước đi chợ cứ như chạy đua với giá.",
      tag: "doimoi",
    });
  }
}

/** Thông tin để bố mẹ cân nhắc khi bạn chọn con đường học */
export function schoolNote(s: GameState, optionId: string): string | null {
  const c = OPTION_SCHOOL[optionId];
  if (!c) return null;
  const total = c.years * c.perYear;
  const have = s.fin.famSavings;
  const lead = `Tiền ${c.label}: khoảng ${formatMoney(total)} trong ${c.years} năm.`;
  if (have >= total) return `${lead} Bố mẹ lo được.`;
  if (have >= total * 0.4) return `${lead} Bố mẹ phải thắt lưng buộc bụng.`;
  return `${lead} Bố mẹ sẽ phải vay thêm.`;
}

function parentsReact(d: GameState, optionId: string): string | null {
  const c = OPTION_SCHOOL[optionId];
  if (!c) return null;
  const total = c.years * c.perYear;
  if (d.fin.famSavings >= total) return "Bố bảo: nhà mình lo được, con cứ yên tâm mà học.";
  if (d.fin.famSavings >= total * 0.4) return "Mẹ tính đi tính lại, bảo sẽ bán bớt thóc, nuôi thêm lứa lợn. Con cứ học.";
  return "Bố mẹ ngồi bàn đến khuya. Sáng ra mẹ bảo: nhà sẽ vay thêm họ hàng, học là để đổi đời, con cứ đi.";
}

/** Thăng chức, kết hôn, con cái: những dấu mốc riêng có hệ quả về tiền */
function lifeMilestones(d: GameState) {
  if (d.age >= 18) {
    const lv = careerLevel(d);
    if (lv > d.lastCareerLevel) {
      d.lastCareerLevel = lv;
      const per = Math.round(monthlyIncome(d) * 10) / 10;
      pushCard(d, {
        kind: "money",
        text: `Bạn được lên ${careerTitle(d).toLowerCase()}. Thu nhập khoảng ${per.toLocaleString("vi-VN")} triệu đồng mỗi tháng.`,
      });
    }
    if (!d.announced.includes("firstjob") && d.fin.income > 0 && !occupationIsStudent(d)) {
      d.announced.push("firstjob");
      const per = Math.round(monthlyIncome(d) * 10) / 10;
      pushCard(d, { kind: "money", text: `Tháng lương đầu tiên: khoảng ${per.toLocaleString("vi-VN")} triệu đồng mỗi tháng (quy theo giá năm 2025).` });
    }
  }
  if (has(d, "kethon") && !d.people.spouse) {
    const g = d.gender === "Nam" ? TEN_GOI_NU : TEN_GOI_NAM;
    d.people.spouse = { name: pick(d, g), since: d.year };
    d.people.children.push(d.year + 1);
    if (rand(d) < 0.6) d.people.children.push(d.year + 4 + Math.floor(rand(d) * 3));
  }
  if (d.people.children.includes(d.year) && d.year !== d.people.children[0] && !d.announced.includes(`baby:${d.year}`)) {
    d.announced.push(`baby:${d.year}`);
    pushCard(d, { kind: "life", text: "Gia đình nhỏ của bạn đón thêm một em bé." });
    applyEffects(d, { happy: 5 });
  }
  if (d.fin.debt > 0 && d.fin.debt < 1 && d.announced.includes("debt")) {
    d.fin.debt = 0;
  }
  if (d.announced.includes("debt") && d.fin.debt === 0 && !d.announced.includes("debtfree")) {
    d.announced.push("debtfree");
    pushCard(d, { kind: "money", text: "Bạn đã trả hết nợ." });
    applyEffects(d, { happy: 3 });
  }
}

function occupationIsStudent(d: GameState) {
  return (has(d, "daihoc") && d.age < 22) || (has(d, "hocxa") && d.age < 21);
}

/** Báo một lần khi một khoản chi tiêu vừa trong tầm tay */
function announcePurchases(d: GameState) {
  for (const p of PURCHASES) {
    if (p.repeatable || !p.available(d) || d.announced.includes("buy:" + p.id)) continue;
    if (d.fin.savings >= p.price * p.downPayment) {
      d.announced.push("buy:" + p.id);
      pushCard(d, { kind: "money", text: `Bạn đã dành dụm đủ để ${p.label.toLowerCase()} (mở mục Chi tiêu, đầu tư).` });
    }
  }
}

function spentCount(s: GameState, id: string) {
  return s.announced.filter((a) => a.startsWith(`spent:${id}:`)).length;
}

export function boughtThisYear(s: GameState, id: string) {
  return s.announced.includes(`spent:${id}:${s.year}`);
}

export function canBuy(s: GameState, id: string): boolean {
  const p = PURCHASE_BY_ID[id];
  if (!p || !p.available(s) || s.fin.savings < p.price * p.downPayment) return false;
  return !(p.repeatable && boughtThisYear(s, id));
}

/** Hệ quả cộng dồn của các khoản chi lặp lại */
function repeatConsequence(d: GameState, id: string) {
  const n = spentCount(d, id);
  if (id === "bieubome" && n === 3) {
    pushCard(d, { kind: "echo", text: "Bố mẹ đi đâu cũng khoe đứa con hiếu thảo. Cả xóm ai cũng biết." });
    applyEffects(d, { bond: 3, happy: 2 });
  }
  if (id === "dulich" && n === 2) {
    pushCard(d, { kind: "echo", text: "Những chuyến đi xa thành câu chuyện cả nhà nhắc mãi trong các bữa cơm." });
    applyEffects(d, { happy: 3 });
  }
  if (id === "quyengop" && n === 3) {
    addMarks(d, ["quyengop3"]);
    pushCard(d, { kind: "echo", text: "Tên bạn được ghi trên tấm bảng công đức của nhà văn hóa làng." });
    applyEffects(d, { bond: 3 });
  }
}

export function setBanked(s: GameState, banked: boolean): GameState {
  if (s.year < 2000 || s.fin.banked === banked) return s;
  const d = structuredClone(s);
  d.fin.banked = banked;
  if (banked && !d.announced.includes("bank")) {
    d.announced.push("bank");
    pushCard(d, { kind: "money", text: "Bạn mở sổ tiết kiệm đầu tiên ở ngân hàng của huyện.", tag: "choice" });
  }
  return d;
}

export function buy(s: GameState, id: string): GameState {
  if (!canBuy(s, id)) return s;
  const d = structuredClone(s);
  const p = PURCHASE_BY_ID[id];
  const pay = Math.min(d.fin.savings, p.price);
  const loan = p.price - pay;
  d.fin.savings -= pay;
  d.fin.debt += loan;
  d.money = Math.max(MONEY_FLOOR, d.money - (p.repeatable ? p.price / 20 : Math.min(30, p.price / 20 + 5)));
  if (loan > 0) d.announced.push("debt");
  d.newItems = [];
  d.houseChanges = [];
  applyEffectsNoMoney(d, p.effects);
  addMarks(d, p.marks);
  if (p.id === "xaynha" && d.year < 2013) addMarks(d, ["xaynha_som"]);
  if (p.id === "bieubome") {
    if (d.fin.famDebt > 0) d.fin.famDebt = Math.max(0, d.fin.famDebt - p.price);
    else d.fin.famSavings += p.price;
  }
  if (p.repeatable) {
    d.announced.push(`spent:${p.id}:${d.year}`);
    repeatConsequence(d, p.id);
  }
  pushCard(d, {
    kind: "money",
    text: `${p.label}: khoảng ${formatMoney(p.price)}${loan > 0 ? `, vay thêm ${formatMoney(loan)}` : ""}.`,
    tag: "choice",
  });
  checkItems(d);
  updateHouse(d);
  snapshot(d);
  return d;
}

function applyEffectsNoMoney(d: GameState, e?: Effects) {
  if (!e) return;
  const { money: _m, ...rest } = e;
  void _m;
  applyEffects(d, rest);
}

function eventEligible(d: GameState, e: (typeof LIFE_EVENTS)[number]): boolean {
  if (d.firedEvents.includes(e.id)) return false;
  if (e.year !== undefined && e.year !== d.year) return false;
  if (e.minYear !== undefined && d.year < e.minYear) return false;
  if (e.minAge !== undefined && d.age < e.minAge) return false;
  if (e.maxAge !== undefined && d.age > e.maxAge) return false;
  if (e.cond && !e.cond(d)) return false;
  return true;
}

function fireEvent(d: GameState, e: (typeof LIFE_EVENTS)[number]) {
  d.firedEvents.push(e.id);
  applyEffects(d, e.effects);
  const h = hoiDoAllowed(d, e.hoiDoId);
  seeHoiDo(d, h);
  const sum = Object.values(e.effects ?? {}).reduce((t, v) => t + (v ?? 0), 0);
  pushCard(d, { kind: "life", text: fill(e.text, d), sub: e.sub ? fill(e.sub, d) : undefined, hoiDoId: h, down: sum < 0 });
  if (e.follow) {
    d.scheduled.push({
      year: d.year + e.follow.after,
      card: { kind: "life", text: e.follow.text, sub: e.follow.sub },
      effects: e.follow.effects,
      marks: e.follow.marks,
    });
  }
}

function runLifeEvents(d: GameState) {
  const eligible = LIFE_EVENTS.filter((e) => eventEligible(d, e));
  for (const e of eligible.filter((x) => x.always)) fireEvent(d, e);
  const optional = eligible.filter((x) => !x.always);
  if (optional.length === 0) return;
  // Tối đa hai sự kiện ngẫu nhiên mỗi năm
  const pool = [...optional];
  let fired = 0;
  for (let i = 0; i < 3 && pool.length && fired < 2; i++) {
    const e = pick(d, pool);
    pool.splice(pool.indexOf(e), 1);
    if (rand(d) < (e.chance ?? 0.4)) {
      fireEvent(d, e);
      fired++;
    }
  }
}

/** Mỗi năm một cảnh làng để năm nào cũng có không khí riêng */
function villageScene(d: GameState) {
  const pool = SCENES.filter((x) => d.year >= x.fromYear && d.year <= x.toYear && !d.firedEvents.includes(x.id) && (!x.cond || x.cond(d)));
  if (pool.length === 0) return;
  const x = pick(d, pool);
  d.firedEvents.push(x.id);
  pushCard(d, { kind: "scene", text: fill(x.text, d) });
}

/** Thỉnh thoảng một dòng suy nghĩ, theo tâm trạng và hoàn cảnh lúc đó */
function moodLine(d: GameState) {
  if (rand(d) > 0.35) return;
  const pool = MOODS.filter((m) => d.age >= m.minAge && d.age <= m.maxAge && !d.firedEvents.includes(m.id) && m.cond(d));
  if (pool.length === 0) return;
  const m = pick(d, pool);
  d.firedEvents.push(m.id);
  pushCard(d, { kind: "thought", text: fill(m.text, d) });
}

const LOW = 42;
const HIGH = 85;

/** Chỉ số thấp: một trở ngại nhẹ có cách vượt qua. Chỉ số rất cao: một dịp tỏa sáng. */
function runStatEvents(d: GameState) {
  const val = (k: (typeof STAT_EVENTS)[number]["stat"]) => (k === "money" ? d.money : d.stats[k]);
  const ok = (e: (typeof STAT_EVENTS)[number]) =>
    !d.firedEvents.includes(e.id) &&
    d.age >= e.minAge &&
    d.age <= e.maxAge &&
    (e.minYear === undefined || d.year >= e.minYear) &&
    (e.maxYear === undefined || d.year <= e.maxYear) &&
    (!e.cond || e.cond(d));
  // Mặt yếu nhất của người chơi lúc này (tính cả tiền) dễ gặp trở ngại hơn
  // Trẻ nhỏ chưa lo tiền nong: chỉ xét bốn chỉ số
  const keys: (StatKey | "money")[] = d.age < 12 ? ["health", "happy", "know", "bond"] : ["health", "happy", "know", "bond", "money"];
  const weakest = keys.reduce((a, k) => (val(k) < val(a) ? k : a), keys[0]);
  const v = val(weakest);
  const chance = Math.min(0.6, Math.max(0.12, (LOW + 28 - v) / 40));
  const lows = STAT_EVENTS.filter((e) => e.kind === "low" && e.stat === weakest && ok(e));
  if (lows.length && rand(d) < chance) fireStatEvent(d, pick(d, lows));
  const highs = STAT_EVENTS.filter((e) => e.kind === "high" && val(e.stat) >= HIGH && ok(e));
  if (highs.length && rand(d) < 0.25) fireStatEvent(d, pick(d, highs));
}

function fireStatEvent(d: GameState, e: (typeof STAT_EVENTS)[number]) {
  d.firedEvents.push(e.id);
  applyEffects(d, e.effects);
  pushCard(d, { kind: "life", text: fill(e.text, d), sub: e.sub ? fill(e.sub, d) : undefined, down: e.kind === "low" });
  if (e.follow) d.scheduled.push({ year: d.year + e.follow.after, card: { kind: "life", text: e.follow.text }, effects: e.follow.effects });
}

function friendNews(d: GameState) {
  for (const tp of TURNING_POINTS) {
    if (!tp.friendDiverges || d.year !== tp.year + 2) continue;
    const optId = d.friend.choices[tp.id];
    const opt = tp.options.find((o) => o.id === optId);
    if (opt?.friendLine) pushCard(d, { kind: "friend", text: `Nghe tin ${fill(opt.friendLine, d)}.` });
  }
}

export function checkItems(d: GameState) {
  for (const it of ITEMS) {
    if (d.items.includes(it.id) || !it.cond(d)) continue;
    d.items.push(it.id);
    d.newItems.push(it.id);
    const h = hoiDoAllowed(d, it.hoiDoId);
    seeHoiDo(d, h);
    pushCard(d, { kind: "item", text: it.name, sub: it.context, itemId: it.id, hoiDoId: h });
  }
}

const HOUSE_LABELS: Record<HouseKey, string> = {
  electric: "Điện về nhà",
  tv: "Ăng-ten tivi trên mái",
  bike: "Chiếc xe đạp",
  motorbike: "Chiếc xe máy",
  road: "Đường bê tông",
  sign: "Biển hiệu cửa hàng",
  boxes: "Hàng gửi đi bán",
  pond: "Ao nuôi của mô hình",
  computer: "Máy vi tính",
  water: "Giếng nước sạch",
};

const HOUSE_TEXT: Partial<Record<HouseKey, string>> = {
  electric: "Nhà bạn được kéo điện về. Bóng đèn điện thay cho ngọn đèn dầu.",
  road: "Đường bê tông về đến ngõ nhà bạn.",
  water: "Nhà bạn có giếng nước sạch.",
};
const STAGE_TEXT = {
  2: "Nhà bạn thay mái lá bằng mái tôn.",
  3: "Nhà bạn xây lại bằng gạch, lợp ngói.",
  4: "Ngôi nhà mới kiên cố đã xây xong.",
};

export function updateHouse(d: GameState) {
  const want: [HouseKey, boolean, HouseChange["by"]][] = [
    ["electric", d.year >= d.settings.electricityYear, "doimoi"],
    ["tv", d.items.includes("tivi"), "doimoi"],
    ["bike", d.items.includes("xe_dap"), "doimoi"],
    ["water", d.firedEvents.includes("nuocsach"), "doimoi"],
    ["road", d.unlocked.includes("ntm") && d.year >= 2011, "doimoi"],
    ["motorbike", has(d, "xemay"), "choice"],
    ["sign", d.items.includes("bien_hieu"), "choice"],
    ["boxes", d.items.includes("don_online"), "choice"],
    ["pond", has(d, "mohinh"), "choice"],
    ["computer", has(d, "maytinh"), "choice"],
  ];
  for (const [key, on, by] of want) {
    if (on && !d.house.includes(key)) {
      d.house.push(key);
      d.houseChanges.push({ key, by, label: HOUSE_LABELS[key] });
      if (HOUSE_TEXT[key]) pushCard(d, { kind: "life", text: HOUSE_TEXT[key]!, tag: by });
    }
  }
  let stage = d.houseStage;
  if (stage < 2 && d.year >= 1993 && (d.money >= 30 || d.year >= 1998)) stage = 2;
  if (stage < 3 && d.year >= 2003 && (d.money >= 45 || d.year >= 2012)) stage = 3;
  if (stage < 4 && has(d, "xaynha")) stage = 4;
  if (stage !== d.houseStage) {
    const label = { 2: "Mái tôn thay mái lá", 3: "Nhà gạch mái ngói", 4: "Ngôi nhà kiên cố" }[stage as 2 | 3 | 4];
    const by: HouseChange["by"] = stage === 4 || (stage === 3 && d.year < 2012) ? "choice" : "doimoi";
    d.houseStage = stage;
    d.houseChanges.push({ key: "stage", by, label });
    pushCard(d, { kind: "life", text: STAGE_TEXT[stage as 2 | 3 | 4], tag: by });
  }
}

function maybeFinish(d: GameState) {
  if (d.year >= END_YEAR && d.pending.length === 0) d.finished = true;
}

// ---------------------------------------------------------------- lựa chọn

export function isLocked(s: GameState, o: Option): boolean {
  return !!o.requires && !o.requires(s);
}

/** Danh sách lựa chọn người bạn có thể chọn */
function friendOptions(d: GameState, tp: TurningPoint): Option[] {
  const friendState = { ...d, marks: friendMarks(d) } as GameState;
  return tp.options.filter((o) => !isLocked(friendState, o) && (o.effects || o.roll));
}

function friendMarks(d: GameState): string[] {
  const out: string[] = [];
  for (const [tpId, optId] of Object.entries(d.friend.choices)) {
    const o = TP_BY_ID[tpId]?.options.find((x) => x.id === optId);
    if (o) out.push(...(o.marks ?? []), ...(o.roll?.success.marks ?? []));
  }
  return out;
}

function chooseForFriend(d: GameState, tp: TurningPoint, playerOpt: string) {
  let pool = friendOptions(d, tp);
  if (tp.friendDiverges) {
    const diff = pool.filter((o) => o.id !== playerOpt);
    if (diff.length) pool = diff;
  }
  if (pool.length) d.friend.choices[tp.id] = pick(d, pool).id;
  // Hai bạn cùng xóm khác chọn ngẫu nhiên trong những gì họ chọn được
  for (const peer of d.peers) {
    const st = { ...d, marks: marksFrom(peer.choices) } as GameState;
    const opts = tp.options.filter((o) => !isLocked(st, o) && (o.effects || o.roll));
    if (opts.length) peer.choices[tp.id] = pick(d, opts).id;
  }
}

function marksFrom(choices: Record<string, string>): string[] {
  const out: string[] = [];
  for (const [tpId, optId] of Object.entries(choices)) {
    const o = TP_BY_ID[tpId]?.options.find((x) => x.id === optId);
    if (o) out.push(...(o.marks ?? []), ...(o.roll?.success.marks ?? []));
  }
  return out;
}

function applyOption(d: GameState, tp: TurningPoint, o: Option): { title: string; text: string; hoiDoId?: string } | null {
  applyEffects(d, o.effects);
  addMarks(d, o.marks);
  d.choices[tp.id] = o.id;
  const texts: string[] = [];
  if (o.roll) {
    const ok = rand(d) < o.roll.chance(d);
    const r = ok ? o.roll.success : o.roll.fail;
    applyEffects(d, r.effects);
    addMarks(d, r.marks);
    texts.push(r.text);
    if (r.follow) d.scheduled.push({ year: d.year + r.follow.after, card: { kind: "echo", text: r.follow.text }, effects: r.follow.effects, marks: r.follow.marks });
  }
  const extra = o.extra?.(d);
  if (extra) {
    applyEffects(d, extra.effects);
    addMarks(d, extra.marks);
    texts.push(extra.text);
  }
  if (o.outcome) texts.push(fill(o.outcome, d));
  const react = extra ? null : parentsReact(d, o.id === "daihoc" && !has(d, "daihoc") ? "" : o.id);
  if (react) texts.push(react);
  if (o.echo)
    d.scheduled.push({ year: d.year + o.echo.after, card: { kind: "echo", text: o.echo.text }, effects: o.echo.effects, marks: o.echo.marks });

  const hoiDoId = hoiDoAllowed(d, o.hoiDoId);
  seeHoiDo(d, hoiDoId);
  const dhLead = tp.id.startsWith("dh") ? `Đại hội ${CONGRESS_BY_YEAR[tp.year]?.num}, nhà bạn chọn: ` : "Bạn chọn: ";
  pushCard(d, { kind: "choice", text: `${dhLead}${o.label}.`, sub: texts.join(" ") || undefined, hoiDoId, tag: tp.id.startsWith("dh") ? "choice" : undefined });
  if (texts.length === 0 && !hoiDoId) return null;
  return { title: o.label, text: texts.join(" "), hoiDoId };
}

export type Resolution =
  | { type: "turning"; optionId: string }
  | { type: "reunion"; optionId: string }
  | { type: "reflection"; answer: string }
  | { type: "outcome" }
  | { type: "kidask"; choice: KidChoice }
  | { type: "minigame"; result: MiniResult };

export function resolve(s: GameState, r: Resolution): GameState {
  const head = s.pending[0];
  if (!head || head.type !== r.type) return s;
  const d = structuredClone(s);
  d.pending.shift();
  d.newItems = [];
  d.houseChanges = [];
  const outcomes: { title: string; text: string; hoiDoId?: string }[] = [];

  if (head.type === "turning" && r.type === "turning") {
    const tp = TP_BY_ID[head.id];
    const o = tp.options.find((x) => x.id === r.optionId);
    if (!o || isLocked(d, o)) return s;
    const out = applyOption(d, tp, o);
    if (out) outcomes.push(out);
    if (!tp.personal) chooseForFriend(d, tp, o.id);
  } else if (head.type === "reunion" && r.type === "reunion") {
    const tp = TP_BY_ID["tp2022"];
    const o = tp.options.find((x) => x.id === r.optionId);
    if (!o) return s;
    const wasTight = d.money < 35;
    addMarks(d, ["reunion"]);
    applyOption(d, tp, o);
    if (wasTight) {
      applyEffects(d, { money: 6 });
      pushCard(d, { kind: "life", text: `Bà con và ${d.friend.name} cùng gia đình bạn chọn một mô hình hợp với sức nhà mình.` });
    }
    if (has(d, "thanban")) {
      applyEffects(d, { bond: 4, happy: 3 });
      pushCard(d, { kind: "friend", text: `Hai người cười mãi khi nhắc lại mùa hè rong chơi năm 1995.` });
    }
    chooseForFriend(d, tp, o.id);
  } else if (head.type === "minigame" && r.type === "minigame") {
    resolveMarket(d, head.id, r.result);
  } else if (head.type === "kidask" && r.type === "kidask") {
    resolveKid(d, head.id, r.choice);
  } else if (head.type === "reflection" && r.type === "reflection") {
    d.reflections[head.id] = r.answer.slice(0, 120);
  }

  checkItems(d);
  updateHouse(d);
  lifeMilestones(d);
  snapshot(d);
  // kết quả hiện trước các việc còn chờ
  d.pending.unshift(...outcomes.map((o) => ({ type: "outcome" as const, ...o })));
  maybeFinish(d);
  return d;
}

export function addThought(s: GameState, text: string): GameState {
  const d = structuredClone(s);
  pushCard(d, { kind: "thought", text: text.slice(0, 160) });
  return d;
}

export function setFocus(s: GameState, focus: GameState["focus"]): GameState {
  return { ...s, focus };
}

export function setCherish(s: GameState, cherish: string): GameState {
  return { ...s, cherish };
}

// ---------------------------------------------------------------- tổng kết

export function strengthOf(s: GameState): string {
  if (s.items.includes("huy_hieu")) return STRENGTHS.career;
  // So với mức thường gặp (từ giả lập) để điểm mạnh phản ánh lựa chọn, không phản ánh chỉ số vốn cao
  const base: Record<StatKey, number> = { health: 66, happy: 86, know: 78, bond: 90 };
  const top = (Object.keys(s.stats) as StatKey[]).sort((a, b) => s.stats[b] - base[b] - (s.stats[a] - base[a]))[0];
  return STRENGTHS[top];
}

function optionOf(s: GameState, tpId: string, who: "self" | "friend") {
  const tp = TP_BY_ID[tpId];
  const optId = who === "self" ? s.choices[tpId] : s.friend.choices[tpId];
  return tp?.options.find((x) => x.id === optId);
}

function selfLineOf(s: GameState, tpId: string): string | null {
  const o = optionOf(s, tpId, "self");
  if (!o) return null;
  if (o.id === "daihoc") return has(s, "daihoc") ? "Mình đỗ đại học" : "Mình thi trượt đại học, rồi vừa làm vừa học";
  return o.selfLine ?? null;
}

const FAMILY_TPS = ["fam_dongcon", "fam_conmot", "fam_ongba", "fam_anhchixa", "fam_itruong"];

/** Tất cả những lựa chọn lớn của người chơi, theo thứ tự thời gian */
export function lifePath(s: GameState): string[] {
  return ["tp2000", "tp2003", ...FAMILY_TPS, "tp2007", "tp2011", "tp2017"]
    .map((id) => selfLineOf(s, id))
    .filter((x): x is string => !!x);
}

/** Ba dòng kể ở cảnh gặp lại: học hành, con đường, đời sống */
export function storyLines(s: GameState): { self: string[]; friend: string[] } {
  const first = (ids: string[]) => ids.map((id) => selfLineOf(s, id)).find((x) => !!x) ?? null;
  const self = [
    first(["tp2003", "tp2000"]),
    first(["tp2017", "tp2007"]),
    first([...FAMILY_TPS, "tp2011"]),
  ].filter((x): x is string => !!x);
  const friend = ["tp2003", "tp2007", "tp2011"]
    .map((id) => optionOf(s, id, "friend")?.friendLine?.replaceAll("{friend}", s.friend.name))
    .filter((x): x is string => !!x);
  return { self, friend };
}

export function topItems(s: GameState, n = 3): string[] {
  const order = { epic: 0, rare: 1, common: 2 };
  return [...s.items].sort((a, b) => order[ITEM_BY_ID[a].rarity] - order[ITEM_BY_ID[b].rarity]).slice(0, n);
}

export const FAMILY_NAME = (s: GameState) => FAMILY_BY_ID[s.familyId].name;
