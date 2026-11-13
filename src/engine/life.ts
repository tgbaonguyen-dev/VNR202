import type { GameState } from "../types";
import { has } from "../data/turningPoints";
import { CAREER_TITLES } from "../data/people";
import { HOUSEHOLD_BASE } from "../data/names";
import { WB_GDP_PC, inflationOf } from "../data/economy";

// Tiền trong game: triệu đồng, quy theo giá năm 2025.
// Đây là ước lượng minh họa để người chơi dễ hình dung, không phải số liệu thống kê.

/**
 * Mức sống chung của nền kinh tế so với hiện nay, theo GDP bình quân đầu người
 * giá so sánh của World Bank (1985 ≈ 0,15 lần năm 2024). Năm 2025 dùng số năm 2024.
 */
export function eraMult(year: number): number {
  const v = WB_GDP_PC.values;
  const y = Math.min(2024, Math.max(1985, year));
  return v[y] / v[2024];
}

export function careerLevel(s: GameState): number {
  return Math.min(4, Math.floor((s.careerPts + s.careerBonus) / 4));
}

function careerPath(s: GameState): string {
  return ["fdi", "kinhdoanh", "daihoc", "thanhpho", "nghe"].find((m) => has(s, m)) ?? "default";
}

export function careerTitle(s: GameState): string {
  return CAREER_TITLES[careerPath(s)][careerLevel(s)];
}

export interface Occupation {
  job: string;
  /** Thu nhập năm ở bậc 1, khi kinh tế đạt mức 2025 */
  base: number;
  student?: boolean;
}

export function occupation(s: GameState): Occupation {
  const a = s.age;
  if (a < 3) return { job: "Em bé", base: 0 };
  if (a < 6) return { job: "Trẻ mẫu giáo", base: 0 };
  if (a < 11) return { job: "Học sinh tiểu học", base: 0 };
  if (a < 15) return { job: "Học sinh trung học cơ sở", base: 0 };
  if (a < 18) {
    if (has(s, "capba")) return { job: "Học sinh trung học phổ thông", base: 0 };
    if (has(s, "nghe")) return { job: "Học nghề", base: 0 };
    return { job: "Phụ việc gia đình", base: 0 };
  }
  if (has(s, "xuong")) return { job: "Chủ xưởng nhỏ ở làng", base: 150 };
  if (has(s, "fdi")) return { job: "Nhà máy vốn nước ngoài", base: 130 };
  if (has(s, "kinhdoanh")) return { job: "Chủ cơ sở kinh doanh nhỏ", base: has(s, "kinhdoanh_ok") ? 140 : 105 };
  if (has(s, "daihoc") && a < 22) return { job: "Sinh viên đại học", base: 15, student: true };
  if (has(s, "daihoc")) return { job: "Nhân viên văn phòng", base: 120 };
  if (has(s, "hocxa") && a < 21) return { job: "Đang học xa", base: 15, student: true };
  if (has(s, "hocxa")) return { job: "Cán bộ kỹ thuật nông nghiệp", base: 105 };
  if (has(s, "thanhpho") || has(s, "oanhchi") || has(s, "xanha")) return { job: "Công nhân khu công nghiệp", base: 95 };
  if (has(s, "tulam")) return { job: "Tự làm ăn riêng", base: 100 };
  if (has(s, "nghe")) return { job: "Thợ có tay nghề", base: 90 };
  if (has(s, "thueruong")) return { job: "Nông dân, làm thêm ruộng thuê", base: 75 };
  if (has(s, "lamthue")) return { job: "Làm thuê nhiều nghề", base: 65 };
  return { job: "Làm nông cùng gia đình", base: 60 };
}

export function education(s: GameState): string {
  const a = s.age;
  if (a < 6) return "Chưa đi học";
  if (a < 11) return "Đang học tiểu học";
  if (a < 15) return "Đang học trung học cơ sở";
  let e: string;
  if (has(s, "daihoc")) e = a >= 22 ? "Đại học" : "Đang học đại học";
  else if (has(s, "hocxa")) e = a >= 21 ? "Cao đẳng" : "Đang học cao đẳng";
  else if (has(s, "capba")) e = a >= 18 ? "Trung học phổ thông" : "Đang học trung học phổ thông";
  else if (has(s, "nghe")) e = a >= 17 ? "Trung cấp nghề" : "Đang học nghề";
  else e = "Trung học cơ sở";
  if (has(s, "nangnghe")) e += ", học nâng tay nghề";
  return e;
}

export function residence(s: GameState): string {
  const away = has(s, "thanhpho") || has(s, "fdi") || has(s, "oanhchi") || has(s, "xanha") || has(s, "daihoc") || has(s, "hocxa");
  if (s.age >= 18 && away && !has(s, "vequelang") && !has(s, "gannha") && !has(s, "thaychi") && !has(s, "chamongba")) {
    if (has(s, "daihoc") && s.age < 22) return "Ký túc xá ở thành phố";
    return has(s, "fdi") ? "Nhà trọ gần nhà máy ở tỉnh bên" : "Nhà trọ ở thành phố";
  }
  return "Một làng quê Việt Nam";
}

/** Nhóm thu nhập hộ gia đình 1–5 */
export function incomeGroup(s: GameState): number {
  const m = s.money;
  if (m < 20) return 1;
  if (m < 35) return 2;
  if (m < 55) return 3;
  if (m < 75) return 4;
  return 5;
}

const HOUSE_VALUE = { 1: 30, 2: 80, 3: 250, 4: 600 } as const;

export interface AssetLine {
  label: string;
  value: number;
}

export function assets(s: GameState): AssetLine[] {
  if (s.age < 18) return [];
  const out: AssetLine[] = [];
  if (has(s, "xaynha")) out.push({ label: "Nhà ở", value: HOUSE_VALUE[s.houseStage] });
  if (has(s, "xemay")) out.push({ label: "Xe máy", value: 20 });
  if (has(s, "maytinh")) out.push({ label: "Máy vi tính", value: 5 });
  if (has(s, "kinhdoanh_ok") || (has(s, "kinhdoanh") && s.year >= 2009)) out.push({ label: "Cơ sở kinh doanh", value: 80 });
  if (has(s, "xuong")) out.push({ label: "Xưởng nhỏ", value: 150 });
  return out;
}

export function netWorth(s: GameState): number {
  return s.fin.savings - s.fin.debt + assets(s).reduce((t, a) => t + a.value, 0);
}

export function monthlyIncome(s: GameState): number {
  return s.fin.income / 12;
}

/** Cập nhật tài chính một năm. Gọi trong vòng năm của engine. */
export function updateFinance(d: GameState) {
  const m = eraMult(d.year);
  const famBase = HOUSEHOLD_BASE[d.familyId] ?? 70;
  d.fin.household = famBase * m * (0.7 + d.money / 100);

  if (d.age < 18) {
    d.fin.income = 0;
    return;
  }
  const occ = occupation(d);
  let inc = occ.base * m * (1 + 0.15 * careerLevel(d));
  if (d.focus === "work") inc *= 1.1;
  if (d.focus === "learn" || d.focus === "family") inc *= 0.93;
  if (has(d, "tohoptac") && d.year >= 2015) inc *= 1.08;
  // Chính sách đến nhà (xem ripples.ts)
  if (has(d, "dm_dkkd")) inc *= 1.08;
  if (has(d, "dm_daotao")) inc *= 1.08;
  if (has(d, "dm_ntm") && !has(d, "thanhpho") && !has(d, "fdi")) inc *= 1.04;
  if (has(d, "dm_giamngheo")) inc *= 1.05;
  if (has(d, "tutrong") && d.year >= 2013 && d.year <= 2016) inc *= 0.8;
  if (d.year === 2020 && !has(d, "online2020")) inc *= 0.85;
  d.fin.income = inc;

  if (d.people.spouse) d.fin.household = inc + inc * 0.9;
  else d.fin.household = Math.max(d.fin.household, inc);

  // Chi tiêu sinh hoạt
  let cost = 0.7 * inc + d.people.children.filter((y) => y <= d.year).length * 10 * m;
  if (has(d, "gannha") || has(d, "thaychi") || has(d, "chamongba")) cost += 4 * m;
  if (occ.student) cost = inc; // sinh viên làm thêm đủ tiêu, gia đình lo học phí
  d.fin.savings += inc - cost;
  // Gửi tiết kiệm: lãi sau trượt giá khoảng 2%/năm (minh họa).
  // Giữ tiền mặt ở nhà: mất giá theo lạm phát thật của năm đó (World Bank).
  if (d.fin.banked && d.fin.savings > 0) d.fin.savings *= 1.02;
  else if (d.fin.savings > 0) d.fin.savings /= 1 + Math.max(0, inflationOf(d.year) ?? 0) / 100;

  // Trả nợ dần
  if (d.fin.debt > 0 && d.fin.savings > 0) {
    const pay = Math.min(d.fin.debt, 0.25 * inc, d.fin.savings);
    d.fin.debt -= pay;
    d.fin.savings -= pay;
  }
  if (d.fin.savings < 0) {
    d.fin.debt += -d.fin.savings;
    d.fin.savings = 0;
  }
}

/** Tiền vào ra bất ngờ từ sự kiện: 1 điểm tiền ≈ 4 triệu theo mức sống năm đó */
export function windfall(d: GameState, points: number) {
  if (d.age < 18) return;
  d.fin.savings += points * 4 * eraMult(d.year);
  if (d.fin.savings < 0) {
    d.fin.debt += -d.fin.savings;
    d.fin.savings = 0;
  }
}

export function formatMoney(trieu: number): string {
  const v = Math.round(trieu);
  if (Math.abs(v) >= 1000) {
    const ty = Math.round((trieu / 1000) * 10) / 10;
    return `${ty.toLocaleString("vi-VN")} tỷ đồng`;
  }
  if (Math.abs(trieu) < 1 && trieu !== 0) return `${(Math.round(trieu * 10) * 100).toLocaleString("vi-VN")} nghìn đồng`;
  if (Math.abs(trieu) < 10) return `${(Math.round(trieu * 10) / 10).toLocaleString("vi-VN")} triệu đồng`;
  return `${v.toLocaleString("vi-VN")} triệu đồng`;
}

export function ageOf(birthYear: number, year: number) {
  return year - birthYear;
}

/** Trạng thái của một người bạn cùng tuổi, theo những gì họ đã chọn */
export function peerStatus(choices: Record<string, string>, age: number): string {
  if (age < 6) return "thời thơ ấu";
  if (age < 15) return "đang đi học";
  const c2000 = choices.tp2000;
  if (age < 18) return c2000 === "capba" ? "học cấp ba" : c2000 === "nghe" ? "học nghề" : "đi làm phụ gia đình";
  const c2003 = choices.tp2003;
  let work =
    c2003 === "daihoc" ? (age < 22 ? "sinh viên đại học" : "nhân viên văn phòng") : c2003 === "thanhpho" ? "công nhân khu công nghiệp" : "làm ăn ở làng";
  if (age >= 22) {
    const c2007 = choices.tp2007;
    if (c2007 === "fdi") work = "làm nhà máy vốn nước ngoài";
    if (c2007 === "kinhdoanh") work = "chủ cơ sở kinh doanh nhỏ";
  }
  if (age >= 30 && choices.tp2015 === "tohoptac") work += ", vào tổ hợp tác";
  if (age >= 26 && choices.tp2011 === "kethon") work += ", đã lập gia đình";
  return work;
}
