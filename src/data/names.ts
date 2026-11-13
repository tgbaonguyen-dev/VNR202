// Tên gọi và chi tiết hồ sơ, đều hư cấu.

export const HO = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
export const TEN_NAM = ["Văn Hùng", "Văn Tâm", "Đức Thắng", "Văn Bình", "Quang Minh", "Văn Sơn", "Hữu Phước", "Văn Lợi", "Đình Khoa", "Văn Nghĩa", "Công Thành", "Minh Tuấn"];
export const TEN_NU = ["Thị Lan", "Thị Hoa", "Thị Mai", "Thị Hương", "Thị Thu", "Thị Hạnh", "Thị Nga", "Thị Liên", "Thị Thảo", "Thị Ngọc", "Thị Bích", "Thị Yến"];
export const TEN_GOI_NAM = ["Hùng", "Tuấn", "Nam", "Dũng", "Phúc", "Khoa", "Bình", "Long", "Hải", "Trung"];
export const TEN_GOI_NU = ["Lan", "Mai", "Hoa", "Thảo", "Hương", "Trang", "Ngọc", "Vy", "Linh", "Hằng"];

export const DREAMS = ["Bác sĩ", "Thầy giáo", "Cô giáo", "Kỹ sư", "Lái xe", "Bộ đội", "Ca sĩ", "Họa sĩ", "Nhà văn", "Cầu thủ bóng đá"];

/** Nghề của bố mẹ theo hoàn cảnh */
export const PARENT_JOBS: Record<string, [string, string]> = {
  dongcon: ["làm ruộng", "làm ruộng"],
  conmot: ["thợ mộc", "giáo viên tiểu học"],
  itruong: ["làm thuê theo mùa vụ", "làm thuê theo mùa vụ"],
  ongba: ["làm ruộng", "buôn bán nhỏ ở chợ"],
  anhchixa: ["làm ruộng", "làm ruộng, nuôi lợn"],
};

export const SIBLINGS: Record<string, { n: number; older: boolean }> = {
  dongcon: { n: 5, older: true },
  conmot: { n: 0, older: false },
  itruong: { n: 2, older: false },
  ongba: { n: 1, older: false },
  anhchixa: { n: 3, older: true },
};

/** Thu nhập gia đình gốc theo hoàn cảnh, triệu đồng/năm theo giá 2025 khi kinh tế đạt mức 2025 */
export const HOUSEHOLD_BASE: Record<string, number> = {
  dongcon: 75,
  conmot: 85,
  itruong: 55,
  ongba: 75,
  anhchixa: 85,
};
