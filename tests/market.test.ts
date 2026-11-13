import { describe, expect, it } from "vitest";
import { MARKETS, buy, canBuy, marketResult, startMarket, tick, walkTo, priceAt } from "../src/engine/market";
import type { MarketConfig, MarketState } from "../src/engine/market";

/** Người chơi máy: mua món đắt nhất trước, mỗi lần bấm chậm "react" giây */
function bot(cfg: MarketConfig, seed: number, react: number): MarketState {
  let s = startMarket(cfg);
  const queue = Object.entries(cfg.need)
    .flatMap(([id, q]) => Array(q).fill(id) as string[])
    .sort((a, b) => priceAt(cfg, b, 0) - priceAt(cfg, a, 0));
  let guard = 0;
  while (!s.done && queue.length && guard++ < 2000) {
    const target = queue[0];
    if (s.at !== target) {
      s = walkTo(cfg, s, target);
      while (s.walkingTo && !s.done) s = tick(cfg, s, 0.05);
    }
    s = tick(cfg, s, react);
    const r = canBuy(cfg, s, seed);
    if (r === "ok") {
      s = buy(cfg, s, seed);
      queue.shift();
    } else if (r === "out") {
      queue.push(queue.shift()!);
    } else if (r === "poor") break;
  }
  return s;
}

describe("mini-game đi chợ", () => {
  it("năm 1986 khó hơn hẳn năm 1990 với cùng cách chơi", () => {
    for (const react of [0.4, 0.8]) {
      let s86 = 0, s90 = 0, full86 = 0;
      for (let seed = 1; seed <= 40; seed++) {
        const a = marketResult(MARKETS.cho86, bot(MARKETS.cho86, seed, react));
        const b = marketResult(MARKETS.cho90, bot(MARKETS.cho90, seed, react));
        s86 += a.score; s90 += b.score;
        if (a.bought >= a.needed) full86++;
      }
      expect(s90).toBeGreaterThan(s86);
      // Chơi nhanh vẫn có cơ hội mua đủ năm 1986, chơi chậm thì khó
      if (react === 0.4) expect(full86).toBeGreaterThan(5);
    }
  });

  it("năm 1990 chơi bình thường luôn mua đủ", () => {
    for (let seed = 1; seed <= 20; seed++) {
      const r = marketResult(MARKETS.cho90, bot(MARKETS.cho90, seed, 0.8));
      expect(r.bought).toBe(r.needed);
    }
  });
});
