import type { Item } from "../types";
import { has, owns } from "./turningPoints";

// Ảnh kỷ vật: public/images/items/<id>.png (vuông, nền trong suốt).
// Không có ảnh thì game dùng hình giữ chỗ.

export const ITEMS: Item[] = [
  // Phổ biến – thành tựu chung
  { id: "tem_phieu", name: "Sổ tem phiếu", rarity: "common", context: "Mỗi tháng, cả nhà chờ ngày đi lĩnh gạo theo tem phiếu.", hoiDoId: "bao_cap", cond: (s) => s.year === 1985 },
  { id: "radio", name: "Đài bán dẫn", rarity: "common", context: "Tối nào cả nhà cũng quây quần nghe đài.", hoiDoId: "radio", cond: (s) => s.year >= 1988 },
  { id: "bao_gao", name: "Bao gạo đầy", rarity: "common", context: "Lần đầu tiên, nhà đủ gạo ăn quanh năm.", hoiDoId: "gao", cond: (s) => s.year >= 1989 },
  { id: "cap_sach", name: "Cặp sách lớp Một", rarity: "common", context: "Chiếc cặp ông mua cho ngày đầu đi học.", cond: (s) => s.age >= 6 },
  { id: "bong_den", name: "Bóng đèn điện", rarity: "common", context: "Tạm biệt ngọn đèn dầu.", hoiDoId: "dien", cond: (s) => s.year >= s.settings.electricityYear },
  { id: "xe_dap", name: "Xe đạp", rarity: "common", context: "Chiếc xe đạp chở bạn đến trường.", hoiDoId: "xedap", cond: (s) => s.age >= 11 },
  {
    id: "tivi",
    name: "Tivi đen trắng",
    rarity: "common",
    context: "Cả xóm sang xem nhờ chiếc tivi đầu tiên.",
    hoiDoId: "tivi",
    cond: (s) => owns(s, "bong_den") && (s.money >= 30 || s.year >= s.settings.electricityYear + 3),
  },
  {
    id: "cuc_gach",
    name: "Điện thoại cục gạch",
    rarity: "common",
    context: "Chiếc di động đầu tiên, chỉ nghe gọi và nhắn tin.",
    hoiDoId: "dienthoai",
    cond: (s) => s.year >= 2003 && (s.money >= 35 || s.familyId === "anhchixa" || s.year >= 2008),
  },
  { id: "the_bhyt", name: "Thẻ bảo hiểm y tế", rarity: "common", context: "Ốm đau đã có bảo hiểm y tế đỡ một phần.", hoiDoId: "bhyt", cond: (s) => s.year >= 2004 },
  {
    id: "smartphone",
    name: "Điện thoại thông minh",
    rarity: "common",
    context: "Cả thế giới nằm gọn trong lòng bàn tay.",
    hoiDoId: "internet",
    cond: (s) => (s.year >= 2012 && (s.stats.know >= 65 || s.money >= 70)) || s.year >= 2014,
  },
  { id: "khau_trang", name: "Khẩu trang", rarity: "common", context: "Năm cả nước cùng chống dịch.", cond: (s) => s.year === 2020 },

  // Hiếm – một lựa chọn đúng lúc
  {
    id: "giay_khen",
    name: "Giấy khen học sinh giỏi",
    rarity: "rare",
    context: "Mẹ lồng khung treo ngay giữa nhà.",
    cond: (s) => s.age >= 7 && s.age <= 14 && (s.stats.know >= 62 || (s.focusCount.study ?? 0) >= 5 || (has(s, "hoche") && s.stats.know >= 52)),
  },
  { id: "chung_chi_nghe", name: "Chứng chỉ nghề", rarity: "rare", context: "Có nghề trong tay, đi đâu cũng không lo.", cond: (s) => has(s, "nghe") && s.year >= 2002 },
  { id: "bao_trung_tuyen", name: "Giấy báo trúng tuyển đại học", rarity: "rare", context: "Cả xóm kéo sang chúc mừng.", cond: (s) => has(s, "daihoc") },
  { id: "the_cong_nhan", name: "Thẻ công nhân khu công nghiệp", rarity: "rare", context: "Lần đầu xa làng, lần đầu nhận lương tháng.", cond: (s) => has(s, "thanhpho") },
  { id: "xe_may", name: "Xe máy đời đầu", rarity: "rare", context: "Dành dụm mấy năm mới mua được.", hoiDoId: "xemay", cond: (s) => has(s, "xemay") },
  { id: "the_fdi", name: "Thẻ nhân viên nhà máy vốn nước ngoài", rarity: "rare", context: "Hội nhập mở ra những việc làm mới.", cond: (s) => has(s, "fdi") },
  { id: "bien_hieu", name: "Biển hiệu cửa hàng nhỏ", rarity: "rare", context: "Tấm biển đầu tiên mang tên nhà mình.", cond: (s) => (has(s, "kinhdoanh") && (has(s, "kinhdoanh_ok") || s.year >= 2009)) || (has(s, "tulam") && s.year >= 2018) || has(s, "xuong") },
  { id: "thiep_cuoi", name: "Thiệp cưới", rarity: "rare", context: "Ngày vui của cả hai họ.", cond: (s) => has(s, "kethon") },
  { id: "may_tinh", name: "Máy vi tính đầu tiên", rarity: "rare", context: "Lần đầu cả nhà biết tới thư điện tử.", hoiDoId: "maytinh", cond: (s) => has(s, "maytinh") },
  { id: "so_to_hop_tac", name: "Sổ thành viên tổ hợp tác", rarity: "rare", context: "Một cây làm chẳng nên non.", cond: (s) => has(s, "tohoptac") },
  { id: "don_online", name: "Đơn hàng trực tuyến đầu tiên", rarity: "rare", context: "Đơn hàng đầu tiên gửi đi từ chính căn nhà mình.", cond: (s) => has(s, "online") || has(s, "online2020") },
  { id: "qua_cua_em", name: "Món quà từ tháng lương đầu của em", rarity: "rare", context: "Năm ấy bạn đi làm để em được đi học.", cond: (s) => has(s, "quacuaem") },
  { id: "so_chuyen", name: "Cuốn sổ chép chuyện ông bà kể", rarity: "rare", context: "Những câu chuyện của ông bà, giữ lại cho đời sau.", cond: (s) => has(s, "sochuyen") },
  { id: "cay_dan", name: "Cây đàn ghi-ta", rarity: "rare", context: "Cây đàn theo bạn qua bao đám cưới trong xóm.", cond: (s) => has(s, "hocdan") && s.year >= 2011 },
  { id: "cup_bong_da", name: "Chiếc cúp bóng đá giải huyện", rarity: "rare", context: "Cả làng mở tiệc mừng đội nhà vô địch.", cond: (s) => has(s, "vodich") },
  { id: "tu_sach", name: "Tủ sách nhỏ cho trẻ trong xóm", rarity: "rare", context: "Mỗi chiều, bọn trẻ kéo đến đọc sách.", cond: (s) => has(s, "tusach") },
  { id: "anh_gap_lai", name: "Tấm ảnh chụp chung ngày gặp lại", rarity: "rare", context: "Hai đứa trẻ ngày nào giờ đã đi hai con đường.", cond: (s) => has(s, "reunion") },

  // Rất hiếm – một chuỗi lựa chọn nhất quán
  {
    id: "anh_tot_nghiep",
    name: "Ảnh tốt nghiệp cùng bố mẹ",
    rarity: "epic",
    context: "Người đầu tiên trong xóm có tấm bằng đại học.",
    cond: (s) => has(s, "daihoc") && s.year >= 2007 && ((s.focusCount.learn ?? 0) >= 1 || s.stats.know >= 72) && (s.familyId === "dongcon" || s.familyId === "itruong"),
  },
  {
    id: "so_do",
    name: "Sổ đỏ ngôi nhà tự xây",
    rarity: "epic",
    context: "Ngôi nhà mang công sức của cả một đời làm lụng.",
    hoiDoId: "nhakiencod",
    cond: (s) => has(s, "xaynha_som") && has(s, "kethon"),
  },
  {
    id: "thu_cam_on",
    name: "Thư cảm ơn của bà con",
    rarity: "epic",
    context: "Những dòng chữ nắn nót của cả xóm gửi tặng.",
    cond: (s) =>
      has(s, "gopsuc2022") &&
      s.stats.bond >= 78 &&
      [(s.focusCount.community ?? 0) >= 3, has(s, "thiennguyen"), has(s, "khuyenhoc"), has(s, "lamduong"), has(s, "quyengop3")].filter(Boolean).length >= 3,
  },
  {
    id: "huy_hieu",
    name: "Ngọn đèn soi đường",
    rarity: "epic",
    context: "Từ học việc ngày nào, giờ bạn là người soi đường cho lớp sau.",
    cond: (s) =>
      s.careerPts + s.careerBonus >= 28 &&
      s.stats.bond >= 70 &&
      [has(s, "fdi") || has(s, "kinhdoanh_ok"), has(s, "nangnghe"), has(s, "xuong"), has(s, "truyennghe")].filter(Boolean).length >= 2,
  },
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));
export const RARITY_LABEL = { common: "Phổ biến", rare: "Hiếm", epic: "Rất hiếm" } as const;
export const RARITY_ORDER = { epic: 0, rare: 1, common: 2 } as const;
