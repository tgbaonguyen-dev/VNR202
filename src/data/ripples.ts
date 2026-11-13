import type { GameState, Ripple } from "../types";
import { has } from "./turningPoints";

// Mốc lịch sử đến tận nhà bạn: mỗi dòng là hệ quả ở cấp làng, cấp hộ, hư cấu,
// gắn với một mốc trong history.ts. Không có số liệu, không nhận định cấp quốc gia.
// Một số dấu (marks) bắt đầu bằng "dm_" đổi luật tiền trong engine (xem famSaveRate, updateFinance).

const farm = (s: GameState) => ["dongcon", "itruong", "ongba", "anhchixa"].includes(s.familyId);

export const RIPPLES: Ripple[] = [
  // 1986: Đại hội VI
  { id: "r86_cho", from: 1986, after: 1, short: "Chợ họp đông, được mang hàng đi bán", text: "Mẹ được mang thóc, mang gà ra chợ huyện bán, không còn sợ bị giữ lại dọc đường.", sub: "Lần đầu mẹ đi chợ về có dư một ít tiền lẻ.", effects: { happy: 1 } },
  { id: "r86_nghephu", from: 1986, after: 2, short: "Bố mẹ làm thêm nghề phụ", text: "Bố đan thêm rổ rá, mẹ nuôi thêm lứa lợn để bán.", sub: "Nhà mình tự quyết làm gì thì làm, miễn chịu khó.", cond: farm, effects: { money: 1 } },
  { id: "r86_xuong", from: 1986, after: 3, short: "Bố nhận thêm việc ở xưởng", text: "Bố nhận đóng bàn ghế cho mấy nhà trong xã, làm không hết việc.", sub: "Tiền công trả bằng tiền, không phải chờ chia theo công điểm.", cond: (s) => s.familyId === "conmot", effects: { money: 1 } },

  // 1987: Luật Đầu tư nước ngoài
  { id: "r87_kcn", from: 1987, after: 12, short: "Nhà máy vốn nước ngoài gần làng", text: "Mấy chị trong xóm vào làm nhà máy vốn nước ngoài, lương tháng gửi về đều đặn.", sub: "Cánh cửa mở từ khi bạn mới hai tuổi, giờ mới đến tận làng.", effects: { happy: 1 } },

  // 1988: Khoán 10
  { id: "r88_thoc", from: 1988, after: 1, short: "Ruộng khoán: thóc đầy bồ", text: "Vụ đầu làm ruộng khoán, thóc nhà bạn đầy bồ. Bố mẹ dậy sớm hơn, về muộn hơn, mà vui hơn.", sub: "Làm được bao nhiêu, nộp đủ phần, còn lại là của nhà mình.", cond: farm, effects: { happy: 2 }, marks: ["dm_khoan"] },
  { id: "r88_ankhoai", from: 1988, after: 2, short: "Bữa cơm không còn độn khoai", text: "Bữa cơm nhà bạn không còn phải độn khoai sắn nữa.", sub: "Bà bảo cả đời bà mới thấy nồi cơm trắng thế này ngày thường.", cond: farm, effects: { health: 1 } },
  { id: "r88_bancon", from: 1988, after: 3, short: "Có thóc thừa để bán", text: "Thóc thừa bố mẹ đem bán, mua được chiếc xe đạp cũ.", cond: farm, effects: { money: 1 } },

  // 1989: Xuất khẩu gạo
  { id: "r89_thuongla", from: 1989, after: 2, short: "Thương lái về tận làng mua lúa", text: "Thương lái về tận làng mua lúa. Bố không phải gánh thóc đi xa bán nữa.", cond: farm, effects: { money: 1 } },

  // 1994–1995: Bỏ cấm vận, bình thường hóa, ASEAN
  { id: "r95_hang", from: 1995, after: 1, short: "Hàng hóa mới về chợ", text: "Chợ huyện bày bán quạt máy, đài cát-xét, quần áo kiểu mới.", sub: "Bạn đứng xem mãi chiếc đồng hồ điện tử biết kêu.", effects: { happy: 2 } },
  { id: "r94_xemay", from: 1994, after: 4, short: "Xe máy về làng", text: "Chú hàng xóm mua chiếc xe máy, chở cả làng đi viện, đi chợ khi cần.", effects: { bond: 1 } },

  // 1996: Công nghiệp hóa, khu công nghiệp
  { id: "r96_anhchi", from: 1996, after: 3, short: "Anh chị lên khu công nghiệp làm", text: "Anh chị bạn lên khu công nghiệp làm, tháng nào cũng gửi tiền về.", sub: "Mẹ dùng tiền ấy đóng học cho bạn.", cond: (s) => s.people.siblings > 0 && s.people.siblingsOlder, marks: ["dm_guive"] },
  { id: "r96_luong", from: 1996, after: 8, short: "Lương tháng ở khu công nghiệp", text: "Bạn nhận lương tháng đều đặn, không còn phụ thuộc mùa màng.", cond: (s) => has(s, "thanhpho"), effects: { money: 1 } },

  // 2000: Luật Doanh nghiệp
  { id: "r00_cuahang", from: 2000, after: 2, short: "Làng có cửa hàng, xưởng nhỏ", text: "Đầu làng mở xưởng mộc, cửa hàng tạp hóa có đăng ký. Thanh niên trong làng có thêm chỗ làm gần nhà.", effects: { money: 1 } },
  { id: "r00_kinhdoanh", from: 2000, after: 8, short: "Cơ sở của bạn có giấy phép", text: "Cơ sở của bạn đăng ký kinh doanh, được nhận đơn hàng lớn.", sub: "Có giấy tờ đàng hoàng, bạn ký được hợp đồng với công ty ở tỉnh.", cond: (s) => has(s, "kinhdoanh"), marks: ["dm_dkkd"] },

  // 2001: Hiệp định Thương mại Việt Nam – Hoa Kỳ
  { id: "r01_maymac", from: 2001, after: 2, short: "Xưởng may làm hàng xuất khẩu", text: "Xưởng may ở huyện nhận đơn hàng xuất khẩu, tuyển thêm thợ trong làng.", sub: "Mấy chị trong xóm vừa làm ruộng vừa đi may.", effects: { money: 1 } },
  { id: "r01_nghe", from: 2001, after: 4, short: "Tay nghề được trả công cao hơn", text: "Bạn được xưởng gọi làm thêm vì có tay nghề.", cond: (s) => has(s, "nghe"), effects: { money: 1 } },

  // 2007: WTO
  { id: "r07_fdi", from: 2007, after: 1, short: "Nhà máy mới tuyển người", text: "Nhà máy mới mở ở tỉnh bên. Ai có tay nghề, có ngoại ngữ thì được nhận ngay.", cond: (s) => !has(s, "fdi"), effects: { know: 1 } },
  { id: "r07_luong", from: 2007, after: 3, short: "Học thêm để lên bậc", text: "Nhà máy mở lớp đào tạo, bạn học thêm và được lên bậc.", cond: (s) => has(s, "fdi"), effects: { know: 3 }, marks: ["dm_daotao"] },
  { id: "r07_nongsan", from: 2007, after: 4, short: "Nông sản bán đi xa", text: "Cánh đồng làng chuyển sang trồng giống mới theo hợp đồng với công ty.", sub: "Bố bảo trồng theo hợp đồng thì đỡ lo rớt giá.", cond: (s) => has(s, "olang") || has(s, "tohoptac") || farm(s), effects: { money: 1 } },
  { id: "r07_hangngoai", from: 2007, after: 2, short: "Siêu thị về huyện", text: "Huyện mở siêu thị đầu tiên. Cả nhà đi xem như đi hội.", effects: { happy: 2 } },

  // 2010: Nông thôn mới
  { id: "r10_duong", from: 2010, after: 1, short: "Đường bê tông về ngõ", text: "Cả xóm góp công làm đường. Xe chở nông sản vào tận ngõ, bán được giá hơn.", sub: "Nhà bạn hiến một khoảnh vườn để mở rộng đường.", effects: { bond: 2 }, marks: ["dm_ntm"] },
  { id: "r10_truong", from: 2010, after: 3, short: "Trường làng xây mới", text: "Trường tiểu học của làng được xây lại hai tầng, có sân chơi.", sub: "Bạn nhớ lớp học vách đất ngày xưa của mình.", effects: { happy: 2 } },
  { id: "r10_tramyte", from: 2010, after: 5, short: "Trạm y tế xã đạt chuẩn", text: "Trạm y tế xã được nâng cấp. Bố mẹ khám bệnh ngay trong xã, không phải lên huyện.", effects: { health: 1 } },
  { id: "r10_nuoc", from: 2010, after: 6, short: "Nước máy về làng", text: "Nước máy về tận nhà. Mẹ không còn phải lọc nước giếng bằng bể cát.", effects: { health: 1 } },

  // 2020: COVID-19
  { id: "r20_hotro", from: 2020, after: 0, short: "Gói hỗ trợ trong dịch", text: "Xã phát gạo, hỗ trợ cho những nhà mất việc vì dịch.", cond: (s) => s.money < 45, effects: { money: 1, bond: 2 } },
  { id: "r20_vaccine", from: 2020, after: 1, short: "Tiêm vắc-xin ở trạm y tế xã", text: "Cả nhà xếp hàng tiêm vắc-xin ở trạm y tế xã.", sub: "Mẹ dặn đi dặn lại phải mang theo giấy tờ.", effects: { health: 1 } },

  // 2022: Giảm nghèo bền vững
  { id: "r22_sinhke", from: 2022, after: 1, short: "Hỗ trợ sinh kế cho hộ khó khăn", text: "Xã hỗ trợ giống, vốn và lớp tập huấn cho các hộ còn khó khăn trong làng.", sub: "Nhà bạn được nhận một đợt giống cây và con giống.", cond: (s) => s.money < 45, marks: ["dm_giamngheo"] },
  { id: "r22_hoctap", from: 2022, after: 1, short: "Làng có thêm lớp dạy nghề", text: "Làng mở lớp dạy nghề cho người trẻ chưa có việc ổn định.", sub: "Bạn giới thiệu mấy đứa cháu trong họ đi học.", cond: (s) => s.money >= 45, effects: { bond: 2 } },
];

export const RIPPLE_BY_ID = Object.fromEntries(RIPPLES.map((r) => [r.id, r]));
