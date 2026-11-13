import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import {
  BUFFS,
  CARDS,
  CROPS,
  MILESTONES,
  MILESTONE_BY_ID,
  makeQuestions,
  newField,
  pickCrops,
  rng,
  rollCard,
  roundPoints,
  roundWon,
  startRound,
  passiveOf,
  stepField,
} from "../src/engine/catch";
import { HISTORY } from "../src/data/history";
import { buildQuestions } from "../src/engine/catch";
import { DEFAULT_CONFIG, sanitizeConfig, sanitizeQuestions } from "../src/engine/catchConfig";

describe("Hứng đáp án", () => {
  it("câu hỏi chỉ lấy từ mốc có trong history.ts, câu mốc giữ nguyên văn", () => {
    for (const m of MILESTONES) {
      const h = HISTORY.find((x) => x.year === m.year);
      expect(h).toBeTruthy();
      expect(m.text).toBe(h!.text);
    }
  });

  it("mỗi câu có 3 đáp án khác nhau, 3 nông sản khác nhau, đáp án đúng khớp mốc", () => {
    for (let seed = 1; seed < 50; seed++) {
      for (const q of makeQuestions(seed, 10)) {
        expect(new Set(q.answers).size).toBe(3);
        expect(new Set(q.crops).size).toBe(3);
        const m = MILESTONE_BY_ID[q.milestoneId!];
        expect([String(m.year), m.name]).toContain(q.answers[q.correct]);
      }
    }
  });

  it("không cho hai nông sản dễ nhầm xuất hiện chung một câu", () => {
    const pairs = [["lua", "ngo"], ["xoai", "chuoi"], ["caphe", "vai"], ["saurieng", "che"]];
    const r = rng(9);
    for (let i = 0; i < 500; i++) {
      const p = pickCrops(r);
      for (const [a, b] of pairs) expect(p.includes(a) && p.includes(b)).toBe(false);
    }
  });

  it("cùng seed thì cùng bộ câu hỏi (mọi máy trong phòng giống nhau)", () => {
    expect(makeQuestions(42, 10)).toEqual(makeQuestions(42, 10));
  });

  it("mọi ảnh nông sản, thẻ, buff đều có file", () => {
    for (const c of CROPS) expect(existsSync(`public/images/catch/nongsan/${c.id}.png`)).toBe(true);
    for (const c of CARDS) expect(existsSync(`public/images/catch/the/${c.id}.png`)).toBe(true);
    for (const b of Object.values(BUFFS)) expect(existsSync(`public/images/catch/buff/${b.file}.png`)).toBe(true);
  });

  it("điểm: đúng cộng, sai trừ, chuỗi và buff nhân, số ảo bị chặn", () => {
    expect(roundPoints(3, 0, 1, 1)).toBe(3 * 20 + 50);
    expect(roundPoints(2, 1, 1, 1)).toBe(40 - 10);
    expect(roundPoints(3, 0, 2, 2)).toBe((60 * 2 + 50) * 2);
    expect(roundPoints(999, 0, 1, 1)).toBe(60 * 20 + 50);
    expect(roundWon(2, 1)).toBe(true);
    expect(roundWon(1, 1)).toBe(false);
  });

  it("mở hộp quà ra đủ ba độ hiếm, Rất hiếm ít nhất", () => {
    const r = rng(7);
    const count = { common: 0, rare: 0, epic: 0 };
    for (let i = 0; i < 2000; i++) {
      const id = rollCard(r);
      count[CARDS.find((c) => c.id === id)!.rarity]++;
    }
    expect(count.common).toBeGreaterThan(count.rare);
    expect(count.rare).toBeGreaterThan(count.epic);
    expect(count.epic).toBeGreaterThan(0);
  });

  it("thẻ là nội tại cộng dồn, thẻ trùng không cộng thêm", () => {
    const p = passiveOf(["non-la", "kham-xa-cu"]);
    expect(p.perGood).toBe(3);
    expect(p.freeBad).toBe(1);
    // 3 đúng ×23, 2 sai nhưng quả đầu được miễn: −10
    expect(roundPoints(3, 2, 1, 1, p)).toBe(3 * 23 - 10);
    expect(passiveOf(["non-la", "non-la"]).perGood).toBe(3);
    expect(passiveOf(["dan-bau"]).comboMax).toBe(4);
  });

  it("thẻ cân bằng: có đủ bộ Rất hiếm cũng không quá 2 lần điểm của người không thẻ", () => {
    const none = roundPoints(6, 1, 3, 1);
    const all = roundPoints(6, 1, 3, 1, passiveOf(CARDS.map((c) => c.id)));
    expect(all).toBeGreaterThan(none);
    expect(all).toBeLessThan(none * 2.6);
  });

  it("đứng yên giữa sân 8 giây vẫn hứng được nông sản và rơi đủ nhiều", () => {
    const r = rng(3);
    let f = startRound(newField(), r);
    let caught = 0;
    let spawned = 0;
    for (let t = 0; t < 16; t += 0.02) {
      const before = f.nextId;
      const res = stepField(f, 0.02, 50, r, 0, 0, t < 12);
      f = res.field;
      spawned += f.nextId - before;
      caught += res.caught.filter((c) => c.kind === "crop").length;
    }
    expect(spawned).toBeGreaterThan(12);
    expect(caught).toBeGreaterThan(0);
  });

  it("cấu hình sai bị kẹp về giới hạn, thiếu thì lấy mặc định", () => {
    const c = sanitizeConfig({ playSec: 5, roundSec: "20", raceBar: "yes", lạ: 1 });
    expect(c.playSec).toBe(60);
    expect(c.roundSec).toBe(20);
    expect(c.raceBar).toBe(DEFAULT_CONFIG.raceBar);
    expect(sanitizeConfig(null)).toEqual(DEFAULT_CONFIG);
  });

  it("câu hỏi nhóm soạn: bắt lỗi từng dòng, câu hợp lệ thì dựng được bộ câu hỏi", () => {
    const good = { id: "a", cau_hoi: "Hỏi?", dung: "Đúng", sai_1: "Sai một", sai_2: "Sai hai", giai_thich: "Vì vậy.", nguon: "Giáo trình", do_kho: "de" };
    const { ok, errors } = sanitizeQuestions([good, { ...good, id: "a" }, { ...good, id: "b", dung: "Sai một" }, { ...good, id: "c", nguon: "" }]);
    expect(ok).toHaveLength(1);
    expect(errors).toHaveLength(3);
    const qs = buildQuestions([good, { ...good, id: "b", cau_hoi: "Hỏi 2?" }, { ...good, id: "c", cau_hoi: "Hỏi 3?" }] as never, 5, 7);
    expect(qs).toHaveLength(7);
    for (const q of qs) {
      expect(q.answers[q.correct]).toBe("Đúng");
      expect(new Set(q.crops).size).toBe(3);
    }
  });
});
