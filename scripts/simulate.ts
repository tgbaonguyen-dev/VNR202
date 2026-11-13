// Giả lập nhiều đời để kiểm tra cân bằng: npm run sim [số đời]
import { DEFAULT_SETTINGS } from "../src/config";
import { advance, askParents, openRequests, requestState, newGame, resolve, isLocked, moneyTier, strengthOf, careerLevel, buy, canBuy, setBanked } from "../src/engine/engine";
import { netWorth } from "../src/engine/life";
import { PURCHASES } from "../src/data/turningPoints";
import { TP_BY_ID } from "../src/data/turningPoints";
import { REFLECTIONS, FAMILIES, FOCUS } from "../src/data/people";
import { ITEMS } from "../src/data/items";
import type { GameState } from "../src/types";

type Strategy = "random" | "first" | "last";

function rnd(seed: number) {
  let x = seed;
  return () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648);
}

export function playLife(seed: number, strategy: Strategy, familyId?: string): GameState {
  const r = rnd(seed * 7 + 3);
  let s = newGame({ seed, nickname: "Sim", settings: DEFAULT_SETTINGS, familyId });
  let guard = 0;
  while (!s.finished && guard++ < 500) {
    if (s.pending.length) {
      const p = s.pending[0];
      if (p.type === "turning" || p.type === "reunion") {
        const tp = p.type === "turning" ? TP_BY_ID[p.id] : TP_BY_ID["tp2022"];
        const open = tp.options.filter((o) => !isLocked(s, o));
        const o = strategy === "first" ? open[0] : strategy === "last" ? open[open.length - 1] : open[Math.floor(r() * open.length)];
        s = resolve(s, { type: p.type, optionId: o.id });
      } else if (p.type === "minigame") {
        const ok = r() < 0.5;
        s = resolve(s, { type: "minigame", result: { score: ok ? 80 : 40, bought: ok ? 6 : 3, needed: 6, extras: ok ? 1 : 0, moneyLeft: ok ? 5 : 0, seconds: ok ? 15 : 30, skipped: false } });
      } else if (p.type === "kidask") {
        const c = (["yes", "later", "explain"] as const)[strategy === "first" ? 0 : strategy === "last" ? 2 : Math.floor(r() * 3)];
        s = resolve(s, { type: "kidask", choice: c });
      } else if (p.type === "reflection") {
        const ref = REFLECTIONS.find((x) => x.id === p.id)!;
        s = resolve(s, { type: "reflection", answer: ref.answers[0] });
      } else {
        s = resolve(s, { type: "outcome" });
      }
      continue;
    }
    if (s.age < 18 && r() < 0.5) {
      const open = openRequests(s).filter((q) => requestState(s, q.id) === "open");
      if (open.length) s = askParents(s, open[Math.floor(r() * open.length)].id);
    }
    if (strategy === "random" && s.age >= 6 && r() < 0.25) {
      const pool = FOCUS.filter((f) => f.adult === s.age >= 18);
      s = { ...s, focus: pool[Math.floor(r() * pool.length)].id };
    }
    if (s.year === 2000 && strategy !== "last") s = setBanked(s, true);
    if (strategy !== "last") for (const p of PURCHASES) if (canBuy(s, p.id) && (p.repeatable ? r() < 0.2 : strategy === "first" || r() < 0.3)) s = buy(s, p.id);
    s = advance(s);
  }
  if (!s.finished) throw new Error(`Đời ${seed} không kết thúc`);
  return s;
}

function main() {
  const n = Number(process.argv[2] ?? 500);
  const strategies: Strategy[] = ["random", "first", "last"];
  const byFamily: Record<string, { n: number; stats: number[]; tiers: Record<string, number>; stage: number }> = {};
  const itemCount: Record<string, number> = {};
  const strengths: Record<string, number> = {};
  const worth: number[] = [];
  const income: number[] = [];
  let inDebt = 0;
  let maxCardsYear = 0;

  for (let i = 0; i < n; i++) {
    const strat = strategies[i % 3];
    const fam = FAMILIES[i % FAMILIES.length].id;
    const s = playLife(1000 + i, strat, fam);
    const b = (byFamily[fam] ??= { n: 0, stats: [0, 0, 0, 0], tiers: {}, stage: 0 });
    b.n++;
    b.stats = b.stats.map((v, k) => v + Object.values(s.stats)[k]);
    const t = moneyTier(s.money);
    b.tiers[t] = (b.tiers[t] ?? 0) + 1;
    b.stage += s.houseStage;
    for (const it of s.items) itemCount[it] = (itemCount[it] ?? 0) + 1;
    worth.push(netWorth(s));
    income.push(s.fin.income / 12);
    if (s.fin.debt > 0) inDebt++;
    const st = strengthOf(s);
    strengths[st] = (strengths[st] ?? 0) + 1;
    const perYear: Record<number, number> = {};
    for (const c of s.feed) if (!c.compact) perYear[c.year] = (perYear[c.year] ?? 0) + 1;
    maxCardsYear = Math.max(maxCardsYear, ...Object.values(perYear));
    void careerLevel;
  }

  console.log(`\n=== ${n} đời ===\n`);
  console.log("Theo hoàn cảnh (Sức khỏe / Hạnh phúc / Tri thức / Gắn kết, túi tiền cuối, giai đoạn nhà TB):");
  for (const [fam, b] of Object.entries(byFamily)) {
    const avg = b.stats.map((v) => (v / b.n).toFixed(0)).join(" / ");
    console.log(`  ${fam.padEnd(9)} ${avg}  tiền ${JSON.stringify(b.tiers)}  nhà ${(b.stage / b.n).toFixed(1)}`);
  }
  console.log("\nTỷ lệ nhận kỷ vật:");
  for (const it of ITEMS) {
    const pct = (((itemCount[it.id] ?? 0) / n) * 100).toFixed(0);
    console.log(`  ${it.rarity.padEnd(6)} ${it.name.padEnd(38)} ${pct}%`);
  }
  console.log("\nĐiểm mạnh nổi bật:", strengths);
  const q = (a: number[], p: number) => [...a].sort((x, y) => x - y)[Math.floor(p * (a.length - 1))].toFixed(0);
  console.log(`Tài sản ròng tuổi 40 (triệu, giá 2025): p10 ${q(worth, 0.1)} · trung vị ${q(worth, 0.5)} · p90 ${q(worth, 0.9)}`);
  console.log(`Thu nhập/tháng tuổi 40 (triệu): p10 ${q(income, 0.1)} · trung vị ${q(income, 0.5)} · p90 ${q(income, 0.9)}`);
  console.log(`Còn nợ lúc 40 tuổi: ${((inDebt / n) * 100).toFixed(0)}%`);
  console.log("Số thẻ nổi bật nhiều nhất trong một năm:", maxCardsYear);
  const neverEpic = ITEMS.filter((i) => i.rarity === "epic" && !itemCount[i.id]);
  if (neverEpic.length) console.log("\n⚠ Kỷ vật Rất hiếm không ai nhận:", neverEpic.map((i) => i.name));
}

if (process.argv[1]?.includes("simulate")) main();
