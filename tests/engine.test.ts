import { describe, expect, it } from "vitest";
import { playLife } from "../scripts/simulate";
import { FAMILIES } from "../src/data/people";
import { HOI_DO } from "../src/data/hoiDo";
import { HISTORY } from "../src/data/history";
import { ITEMS } from "../src/data/items";
import { TP_BY_ID, TURNING_POINTS } from "../src/data/turningPoints";
import { readFileSync } from "node:fs";
import { DEFAULT_SETTINGS } from "../src/config";
import { askParents, isLocked, newGame, requestState } from "../src/engine/engine";

describe("engine", () => {
  it("mọi hoàn cảnh đều sống trọn đến 2025", () => {
    for (const f of FAMILIES) {
      for (const strat of ["random", "first", "last"] as const) {
        const s = playLife(42, strat, f.id);
        expect(s.finished).toBe(true);
        expect(s.year).toBe(2025);
        expect(s.age).toBe(40);
      }
    }
  });

  it("mỗi năm không quá số thẻ nổi bật cho phép", () => {
    for (let i = 0; i < 50; i++) {
      const s = playLife(i, "random");
      const perYear: Record<number, number> = {};
      for (const c of s.feed) if (!c.compact) perYear[c.year] = (perYear[c.year] ?? 0) + 1;
      expect(Math.max(...Object.values(perYear))).toBeLessThanOrEqual(DEFAULT_SETTINGS.maxFeaturedCards);
    }
  });

  it("cùng seed cho cùng một đời", () => {
    const a = playLife(7, "random");
    const b = playLife(7, "random");
    expect(a.items).toEqual(b.items);
    expect(a.stats).toEqual(b.stats);
  });

  it("thi đại học bị khóa khi chưa học cấp ba", () => {
    const s = newGame({ seed: 1, nickname: "A", settings: DEFAULT_SETTINGS });
    const daihoc = TP_BY_ID.tp2003.options.find((o) => o.id === "daihoc")!;
    expect(isLocked(s, daihoc)).toBe(true);
  });
});

describe("dữ liệu", () => {
  it("mọi mẩu Hồi đó có nguồn và link", () => {
    for (const h of HOI_DO) {
      expect(h.source.length).toBeGreaterThan(3);
      expect(h.url).toMatch(/^https:\/\//);
    }
  });

  it("mỗi năm có tối đa một mốc lịch sử, mốc nào cũng có nguồn", () => {
    const years = HISTORY.map((h) => h.year);
    expect(new Set(years).size).toBe(years.length);
    for (const h of HISTORY) expect(h.source).toBeTruthy();
  });

  it("id kỷ vật không trùng", () => {
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(ITEMS.length);
  });

  it("mọi lựa chọn mở được đều để lại hệ quả về sau", () => {
    const src = ["src/data/items.ts", "src/data/lifeEvents.ts", "src/data/turningPoints.ts", "src/engine/engine.ts"]
      .map((f) => readFileSync(f, "utf8"))
      .join("\n");
    const used = (m: string) => (src.match(new RegExp(`has\\(s, "${m}"\\)|has\\(d, "${m}"\\)`, "g")) ?? []).length > 0;
    const missing: string[] = [];
    for (const tp of TURNING_POINTS) {
      for (const o of tp.options) {
        if (o.requires && o.requires.toString().includes("=> false")) continue; // lựa chọn chỉ để hiện khóa
        if (!o.effects && !o.roll) continue; // lựa chọn chỉ để hiện khóa
        const lasting = !!o.echo || !!o.roll || !!o.extra || (o.marks ?? []).some(used) || !!o.selfLine;
        if (!lasting) missing.push(`${tp.id}/${o.id}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("xin bố mẹ: mỗi năm một lần, bố mẹ quyết theo tiền nhà", () => {
    let s = newGame({ seed: 1, nickname: "T", settings: DEFAULT_SETTINGS, familyId: "conmot" });
    s = { ...s, age: 10, year: 1995, fin: { ...s.fin, famSavings: 20 } };
    const a = askParents(s, "xedap");
    expect(requestState(a, "xedap")).toBe("got");
    expect(a.fin.famSavings).toBeCloseTo(17);
    expect(requestState(a, "sachtk")).toBe("asked");
    const poor = askParents({ ...s, fin: { ...s.fin, famSavings: 0.2 } }, "xedap");
    expect(requestState(poor, "xedap")).toBe("asked");
    expect(poor.fin.famSavings).toBeCloseTo(0.2);
  });
});
