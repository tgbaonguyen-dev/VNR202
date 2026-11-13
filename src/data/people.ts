import type { Effects, Family, FocusId, Reflection, StatKey } from "../types";

export const FAMILIES: Family[] = [
  {
    id: "dongcon",
    name: "Nhà đông con",
    blurb: "Anh chị em đông, ai cũng nhường nhau. Muốn học tiếp thì cả nhà phải cùng gánh.",
    stats: { health: 70, happy: 60, know: 36, bond: 72 },
    money: 15,
  },
  {
    id: "conmot",
    name: "Con một",
    blurb: "Bố mẹ dồn hết cho bạn đi học. Về sau, việc chăm bố mẹ cũng một mình bạn lo.",
    stats: { health: 70, happy: 60, know: 46, bond: 54 },
    money: 22,
  },
  {
    id: "itruong",
    name: "Nhà ít ruộng, bố mẹ đi làm thuê",
    blurb: "Xuất phát khó hơn nhà khác, nhưng chỉ cần một cơ hội là cả nhà bứt lên.",
    stats: { health: 72, happy: 58, know: 38, bond: 62 },
    money: 12,
  },
  {
    id: "ongba",
    name: "Ông bà sống cùng",
    blurb: "Tối nào cũng có chuyện kể. Lớn lên, bạn là người chăm ông bà.",
    stats: { health: 70, happy: 64, know: 40, bond: 68 },
    money: 18,
  },
  {
    id: "anhchixa",
    name: "Có anh chị đi làm xa",
    blurb: "Thỉnh thoảng có tiền và quà gửi về, nhưng mâm cơm nhà vắng người.",
    stats: { health: 70, happy: 58, know: 40, bond: 56 },
    money: 24,
  },
];

export const FAMILY_BY_ID = Object.fromEntries(FAMILIES.map((f) => [f.id, f]));

export interface FocusDef {
  id: FocusId;
  label: string;
  effects: Effects;
  adult: boolean;
}

export const FOCUS: FocusDef[] = [
  { id: "study", label: "Học hành", effects: { know: 3, happy: -1 }, adult: false },
  { id: "help", label: "Phụ giúp gia đình", effects: { bond: 2, money: 1 }, adult: false },
  { id: "play", label: "Vui chơi với bạn bè", effects: { happy: 3, health: 1 }, adult: false },
  { id: "learn", label: "Học thêm", effects: { know: 3, money: -1 }, adult: true },
  { id: "work", label: "Làm việc", effects: { money: 2, career: 1, health: -1 }, adult: true },
  { id: "family", label: "Gia đình và bạn bè", effects: { happy: 2, bond: 2 }, adult: true },
  { id: "health", label: "Giữ gìn sức khỏe", effects: { health: 3 }, adult: true },
  { id: "community", label: "Góp sức cho làng xóm", effects: { bond: 3, happy: 1, money: -1 }, adult: true },
];

export const FOCUS_BY_ID = Object.fromEntries(FOCUS.map((f) => [f.id, f])) as Record<FocusId, FocusDef>;

export const FRIENDS: { name: string; pronoun: string }[] = [
  { name: "Lan", pronoun: "cô ấy" },
  { name: "Hùng", pronoun: "cậu ấy" },
  { name: "Mai", pronoun: "cô ấy" },
  { name: "Tuấn", pronoun: "cậu ấy" },
  { name: "Hoa", pronoun: "cô ấy" },
  { name: "Nam", pronoun: "cậu ấy" },
  { name: "Thảo", pronoun: "cô ấy" },
  { name: "Dũng", pronoun: "cậu ấy" },
  { name: "Hương", pronoun: "cô ấy" },
  { name: "Phúc", pronoun: "cậu ấy" },
  { name: "Trang", pronoun: "cô ấy" },
  { name: "Khoa", pronoun: "cậu ấy" },
  { name: "Ngọc", pronoun: "cô ấy" },
  { name: "Bình", pronoun: "cậu ấy" },
];

export const REFLECTIONS: Reflection[] = [
  {
    id: "r18",
    year: 2003,
    question: "Mười tám tuổi. Bạn nghĩ gì khi nhìn lại ngôi làng?",
    answers: ["Rồi mình sẽ về.", "Làng mình khác nhiều quá.", "Mình muốn làng mình đẹp hơn nữa."],
  },
  {
    id: "r30",
    year: 2015,
    question: "Ba mươi tuổi. Điều gì khiến bạn tự hào nhất đến lúc này?",
    answers: ["Những gì mình đã học.", "Gia đình nhỏ của mình.", "Việc mình tự tay làm ra."],
  },
  {
    id: "r40",
    year: 2025,
    question: "Nhìn lại 40 năm, bạn muốn nói gì?",
    answers: [
      "Đời mình đã khác rất nhiều so với ngày chào đời.",
      "Cảm ơn những người đã đi cùng mình.",
      "Mình còn muốn làm thêm nhiều điều.",
    ],
  },
];

export const CHERISH = ["Gia đình", "Tri thức", "Cộng đồng", "Sự nghiệp"];

export const STRENGTHS: Record<StatKey | "career", string> = {
  health: "Một đời khỏe khoắn, bền bỉ",
  happy: "Một đời nhiều niềm vui",
  know: "Một đời ham học hỏi",
  bond: "Một đời gắn bó với làng xóm",
  career: "Một đời dìu dắt người khác",
};

export const STAT_LABELS: Record<StatKey, string> = {
  health: "Sức khỏe",
  happy: "Hạnh phúc",
  know: "Tri thức",
  bond: "Gắn kết",
};

export const MONEY_LABELS = { tight: "Eo hẹp", enough: "Vừa đủ", comfy: "Dư dả" } as const;

export const CAREER_TITLES: Record<string, string[]> = {
  fdi: ["Học việc", "Công nhân", "Kỹ thuật viên", "Tổ trưởng", "Người dẫn dắt"],
  kinhdoanh: ["Học việc", "Phụ bán hàng", "Chủ cơ sở nhỏ", "Chủ cơ sở có thuê người", "Người dẫn dắt"],
  thanhpho: ["Học việc", "Công nhân", "Thợ chính", "Tổ trưởng", "Người dẫn dắt"],
  daihoc: ["Học việc", "Nhân viên", "Nhân viên chính", "Trưởng nhóm", "Người dẫn dắt"],
  nghe: ["Học việc", "Thợ", "Thợ chính", "Chủ tiệm", "Người dẫn dắt"],
  default: ["Học việc", "Lao động", "Nông dân giỏi", "Tổ trưởng sản xuất", "Người dẫn dắt"],
};
