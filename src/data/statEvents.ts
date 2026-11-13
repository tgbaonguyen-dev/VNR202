import type { GameState, StatEvent } from "../types";
import { has } from "./turningPoints";

// Sự kiện theo chỉ số: chỉ số thấp thì gặp trở ngại nhẹ (luôn có cách vượt qua),
// chỉ số rất cao thì có dịp tỏa sáng. Mỗi người chơi gặp một tổ hợp khác nhau
// tùy tuổi, thời kỳ, hoàn cảnh và lựa chọn. Không có nội dung đau buồn.

const away = (s: GameState) => has(s, "thanhpho") || has(s, "fdi") || has(s, "olaitp") || has(s, "daihoc") || has(s, "xanha");
const kids = (s: GameState) => s.people.children.some((y) => y <= s.year - 5);
const farm = (s: GameState) => has(s, "olang") || has(s, "phu") || has(s, "vequelang") || ["dongcon", "itruong"].includes(s.familyId);

export const STAT_EVENTS: StatEvent[] = [
  // ---------------- Sức khỏe thấp
  { id: "lh_gay", stat: "health", kind: "low", minAge: 2, maxAge: 8, maxYear: 1992, text: "Bạn gầy nhom, hay ốm vặt.", sub: "Mẹ dành phần trứng gà cho bạn mỗi sáng.", effects: { happy: -1 }, follow: { after: 1, text: "Có thêm cháo trứng, bát canh cua, bạn cứng cáp hẳn lên.", effects: { health: 5 } } },
  { id: "lh_saurang", stat: "health", kind: "low", minAge: 6, maxAge: 12, text: "Bạn bị sâu răng, ăn kẹo là nhức.", effects: { happy: -1 }, follow: { after: 1, text: "Trạm y tế xã nhổ cho cái răng sâu. Từ đó bạn chăm đánh răng.", effects: { health: 3 } } },
  { id: "lh_matkem", stat: "health", kind: "low", minAge: 9, maxAge: 17, maxYear: 1996, text: "Học dưới đèn dầu nhiều, mắt bạn bắt đầu kém.", sub: "Bạn phải dí sát mặt vào trang sách.", effects: { know: -1 }, follow: { after: 1, text: "Bố kê lại bàn học sát cửa sổ, bạn học ban ngày nhiều hơn.", effects: { health: 3 } } },
  { id: "lh_saynang", stat: "health", kind: "low", minAge: 12, maxAge: 40, cond: farm, text: "Bạn bị say nắng giữa trưa ngoài đồng.", effects: { happy: -1 }, follow: { after: 1, text: "Bạn đổi giờ ra đồng sang sáng sớm và chiều mát, khỏe ra hẳn.", effects: { health: 4 } } },
  { id: "lh_tangca", stat: "health", kind: "low", minAge: 18, maxAge: 35, cond: (s) => has(s, "fdi") || has(s, "thanhpho"), text: "Tăng ca liên tục, bạn mệt rã rời.", sub: "Có hôm ngủ gục trên xe đưa đón.", effects: { happy: -2 }, follow: { after: 1, text: "Bạn xin bớt ca đêm, tối nào cũng đi bộ một vòng quanh khu trọ.", effects: { health: 5 } } },
  { id: "lh_daday", stat: "health", kind: "low", minAge: 20, maxAge: 40, text: "Ăn uống thất thường, bạn bị đau dạ dày.", effects: { happy: -1 }, follow: { after: 1, text: "Bạn ăn đúng bữa, bớt cà phê. Bệnh dần đỡ hẳn.", effects: { health: 4 } } },
  { id: "lh_daulung", stat: "health", kind: "low", minAge: 25, maxAge: 40, text: "Làm việc nặng nhiều năm, bạn bắt đầu đau lưng.", effects: { happy: -1 }, follow: { after: 1, text: "Bạn tập vài bài vươn vai mỗi sáng, lưng đỡ hẳn.", effects: { health: 4 } } },
  { id: "lh_matngu", stat: "health", kind: "low", minAge: 28, maxAge: 40, minYear: 2012, text: "Bạn hay thức khuya xem điện thoại, sáng ra mệt mỏi.", effects: { happy: -1 }, follow: { after: 1, text: "Bạn để điện thoại ngoài phòng khách khi đi ngủ. Ngủ ngon hơn hẳn.", effects: { health: 4, happy: 1 } } },
  { id: "lh_khamsuckhoe", stat: "health", kind: "low", minAge: 30, maxAge: 40, minYear: 2010, text: "Đi khám sức khỏe, bác sĩ dặn bạn phải giảm muối, giảm mỡ.", effects: { happy: -1 }, follow: { after: 1, text: "Cả nhà ăn nhạt đi một chút. Lần khám sau, chỉ số đã đẹp hơn.", effects: { health: 5 } } },

  // ---------------- Vui vẻ thấp
  { id: "lp_trech", stat: "happy", kind: "low", minAge: 7, maxAge: 13, text: "Bạn bị mấy đứa trong lớp trêu vì áo vá.", effects: { bond: -1 }, follow: { after: 1, text: "Cô giáo xếp bạn ngồi cạnh một bạn tốt bụng. Hai đứa thành bạn thân.", effects: { happy: 4, bond: 2 } } },
  { id: "lp_thikem", stat: "happy", kind: "low", minAge: 10, maxAge: 17, text: "Bạn buồn mấy ngày vì bài kiểm tra bị điểm kém.", follow: { after: 1, text: "Bố bảo: điểm kém một lần, cố thêm là được. Kỳ sau bạn khá lên.", effects: { happy: 3, know: 2 } } },
  { id: "lp_nhonha", stat: "happy", kind: "low", minAge: 17, maxAge: 30, cond: away, text: "Xa nhà, nhiều đêm bạn nhớ mẹ không ngủ được.", sub: "Bạn mở lại mấy lá thư mẹ gửi đọc đi đọc lại.", follow: { after: 1, text: "Bạn quen thêm mấy người đồng hương, cuối tuần nấu cơm quê ăn chung.", effects: { happy: 4, bond: 2 } } },
  { id: "lp_tetkove", stat: "happy", kind: "low", minAge: 19, maxAge: 35, cond: away, text: "Năm nay bạn không về quê ăn Tết được.", effects: { bond: -1 }, follow: { after: 1, text: "Tết năm sau bạn về sớm, ở lại lâu hơn mọi năm.", effects: { happy: 4, bond: 3 } } },
  { id: "lp_chanviec", stat: "happy", kind: "low", minAge: 22, maxAge: 38, text: "Công việc lặp đi lặp lại, bạn thấy chán.", follow: { after: 1, text: "Bạn xin chuyển sang việc mới trong cùng chỗ làm, thấy có hứng thú trở lại.", effects: { happy: 4, know: 1 } } },
  { id: "lp_aplucTien", stat: "happy", kind: "low", minAge: 25, maxAge: 40, cond: (s) => s.money < 45, text: "Lo tiền nong, bạn hay cáu gắt.", effects: { bond: -1 }, follow: { after: 1, text: "Cả nhà ngồi lại tính toán chi tiêu. Nói ra được, ai cũng nhẹ lòng.", effects: { happy: 3, bond: 3 } } },
  { id: "lp_bamuoi", stat: "happy", kind: "low", minAge: 29, maxAge: 33, text: "Bước sang tuổi ba mươi, bạn băn khoăn mình đã làm được gì.", follow: { after: 1, text: "Bạn ngồi viết ra những điều đã qua, thấy mình đi được xa hơn mình tưởng.", effects: { happy: 4 } } },
  { id: "lp_mua", stat: "happy", kind: "low", minAge: 12, maxAge: 40, cond: farm, text: "Mưa dầm cả tháng, việc đồng áng đình trệ.", follow: { after: 1, text: "Trời nắng lại, cả xóm rủ nhau ra đồng làm bù.", effects: { happy: 3, bond: 2 } } },

  // ---------------- Hiểu biết thấp
  { id: "lk_lenbang", stat: "know", kind: "low", minAge: 7, maxAge: 14, text: "Bạn bị gọi lên bảng mà không làm được bài.", effects: { happy: -1 }, follow: { after: 1, text: "Bạn nhờ anh lớn trong xóm kèm thêm, giờ đã dám giơ tay phát biểu.", effects: { know: 4 } } },
  { id: "lk_mattranh", stat: "know", kind: "low", minAge: 15, maxAge: 22, text: "Bạn đọc mãi không hiểu tờ hướng dẫn trên bao phân bón.", effects: { money: -1 }, follow: { after: 1, text: "Bạn đi nghe buổi tập huấn của xã, giờ đọc hướng dẫn thạo hẳn.", effects: { know: 3 } } },
  { id: "lk_maytinh", stat: "know", kind: "low", minAge: 20, maxAge: 40, minYear: 2005, text: "Chỗ làm chuyển sang dùng máy tính, bạn lóng ngóng.", effects: { happy: -1 }, follow: { after: 1, text: "Bạn nhờ đồng nghiệp trẻ chỉ dần, vài tháng sau đã thạo.", effects: { know: 4 } } },
  { id: "lk_thutuc", stat: "know", kind: "low", minAge: 20, maxAge: 40, text: "Đi làm giấy tờ, bạn điền sai mấy lần, phải về rồi lên lại.", effects: { happy: -1 }, follow: { after: 1, text: "Cán bộ xã chỉ tận tình. Lần sau bạn còn hướng dẫn được cho hàng xóm.", effects: { know: 3, bond: 1 } } },
  { id: "lk_conhoi", stat: "know", kind: "low", minAge: 28, maxAge: 40, cond: kids, text: "Con hỏi bài Toán, bạn loay hoay không giải được.", follow: { after: 1, text: "Tối nào bạn cũng ngồi học lại cùng con. Hai bố mẹ con cùng tiến bộ.", effects: { know: 3, bond: 3 } } },
  { id: "lk_smartphone", stat: "know", kind: "low", minAge: 25, maxAge: 40, minYear: 2015, text: "Bạn bị một tin nhắn lạ dụ bấm vào đường link, may mà kịp dừng.", effects: { happy: -1 }, follow: { after: 1, text: "Bạn đi nghe buổi hướng dẫn an toàn trên mạng ở nhà văn hóa.", effects: { know: 4 } } },

  // ---------------- Gắn kết thấp
  { id: "lb_giananh", stat: "bond", kind: "low", minAge: 8, maxAge: 16, cond: (s) => s.people.siblings > 0, text: "Bạn và anh chị em giận nhau vì tranh nhau việc nhà.", follow: { after: 1, text: "Mẹ chia việc rõ ràng, mỗi đứa một phần. Nhà yên hẳn.", effects: { bond: 4 } } },
  { id: "lb_itve", stat: "bond", kind: "low", minAge: 19, maxAge: 40, cond: away, text: "Mải việc, cả năm bạn chỉ về thăm nhà được một lần.", sub: "Mẹ gọi điện chỉ hỏi: con ăn cơm chưa.", follow: { after: 1, text: "Bạn đặt lịch về quê mỗi tháng một lần, dù chỉ một ngày.", effects: { bond: 5 } } },
  { id: "lb_banxa", stat: "bond", kind: "low", minAge: 22, maxAge: 40, text: "Lâu lắm rồi bạn không liên lạc với {friend}.", follow: { after: 1, text: "Bạn chủ động gọi cho {friend}. Hai người nói chuyện đến khuya như ngày xưa.", effects: { bond: 4, happy: 2 } } },
  { id: "lb_hangxom", stat: "bond", kind: "low", minAge: 20, maxAge: 40, text: "Hàng xóm hiểu lầm chuyện ranh giới mảnh vườn.", effects: { happy: -1 }, follow: { after: 1, text: "Hai nhà ngồi uống chén nước, nói rõ với nhau. Từ đó còn thân hơn.", effects: { bond: 4 } } },
  { id: "lb_concaucua", stat: "bond", kind: "low", minAge: 30, maxAge: 40, cond: kids, text: "Con ít nói chuyện với bạn, đi học về là vào phòng.", follow: { after: 1, text: "Cuối tuần nào bạn cũng đưa con đi chơi một buổi. Con dần kể chuyện trường lớp.", effects: { bond: 5 } } },
  { id: "lb_codon", stat: "bond", kind: "low", minAge: 18, maxAge: 30, cond: (s) => has(s, "thanhpho") || has(s, "fdi"), text: "Ở phòng trọ một mình, bạn thấy lạc lõng.", follow: { after: 1, text: "Bạn tham gia đội bóng của khu trọ, quen thêm cả chục người.", effects: { bond: 4, health: 2 } } },
  { id: "lb_hoplop", stat: "bond", kind: "low", minAge: 25, maxAge: 40, text: "Lớp cũ họp mặt, bạn bận không đi được.", follow: { after: 1, text: "Năm sau bạn đi họp lớp, được bạn bè kéo vào nhóm chung.", effects: { bond: 3, happy: 2 } } },

  // ---------------- Tiền eo hẹp
  { id: "lm_ghiso", stat: "money", kind: "low", minAge: 4, maxAge: 40, text: "Nhà phải mua chịu ở quầy tạp hóa, ghi vào sổ nợ.", effects: { happy: -1 }, follow: { after: 1, text: "Vụ mùa xong, nhà trả hết sổ nợ, bà chủ quầy còn cho thêm gói kẹo.", effects: { happy: 2, money: 1 } } },
  { id: "lm_banlon", stat: "money", kind: "low", minAge: 4, maxAge: 18, text: "Nhà phải bán lứa lợn sớm để có tiền đóng học cho anh chị em.", follow: { after: 1, text: "Lứa lợn sau được giá, nhà bù lại được.", effects: { money: 2 } } },
  { id: "lm_xehong", stat: "money", kind: "low", minAge: 12, maxAge: 40, text: "Xe hỏng mà chưa có tiền sửa, bạn đi bộ mấy tuần.", effects: { health: 1, happy: -1 }, follow: { after: 1, text: "Chú hàng xóm sửa giúp, chỉ lấy tiền phụ tùng.", effects: { bond: 2 } } },
  { id: "lm_tetthieu", stat: "money", kind: "low", minAge: 6, maxAge: 40, text: "Tết năm nay nhà thiếu tiền sắm sửa.", sub: "Mâm cỗ nhỏ hơn mọi năm, nhưng đủ mặt cả nhà.", follow: { after: 1, text: "Năm sau làm ăn khá hơn, Tết nhà bạn đầy đủ hơn hẳn.", effects: { happy: 3, money: 1 } } },
  { id: "lm_hocphi", stat: "money", kind: "low", minAge: 28, maxAge: 40, cond: kids, text: "Đến kỳ đóng học phí cho con, bạn phải xoay xở.", effects: { happy: -1 }, follow: { after: 1, text: "Bạn nhận thêm việc làm buổi tối, đóng đủ cho con kỳ sau.", effects: { money: 2 } } },
  { id: "lm_vayho", stat: "money", kind: "low", minAge: 20, maxAge: 40, text: "Bạn phải vay họ hàng một khoản để xoay vòng.", effects: { happy: -1 }, follow: { after: 1, text: "Bạn trả đủ khoản vay đúng hẹn, họ hàng càng tin bạn.", effects: { bond: 2, money: 1 } } },
  { id: "lm_tietkiem", stat: "money", kind: "low", minAge: 18, maxAge: 40, text: "Cuối tháng nào cũng hụt tiền, bạn bắt đầu ghi sổ chi tiêu.", follow: { after: 1, text: "Nhờ ghi sổ, bạn cắt được mấy khoản không cần, cuối tháng đã có dư.", effects: { money: 2, know: 1 } } },

  // ---------------- Chỉ số rất cao: dịp tỏa sáng
  { id: "hh_chay", stat: "health", kind: "high", minAge: 14, maxAge: 40, text: "Bạn được cử đi chạy giải việt dã của huyện.", effects: { happy: 3, bond: 1 } },
  { id: "hh_gat", stat: "health", kind: "high", minAge: 15, maxAge: 40, cond: farm, text: "Mùa gặt, bạn gặt nhanh nhất xóm, ai cũng gọi sang đổi công.", effects: { bond: 3 } },
  { id: "hp_hat", stat: "happy", kind: "high", minAge: 15, maxAge: 40, text: "Bạn được mời lên hát trong đêm văn nghệ của thôn.", effects: { bond: 3 } },
  { id: "hp_vui", stat: "happy", kind: "high", minAge: 20, maxAge: 40, text: "Nhà bạn lúc nào cũng rộn tiếng cười, bạn bè hay ghé chơi.", effects: { bond: 2 } },
  { id: "hk_daykem", stat: "know", kind: "high", minAge: 14, maxAge: 22, text: "Bạn kèm học cho mấy em nhỏ trong xóm.", effects: { bond: 3 } },
  { id: "hk_bao", stat: "know", kind: "high", minAge: 22, maxAge: 40, text: "Bạn viết bài chia sẻ kinh nghiệm làm ăn, được đọc trên loa xã.", effects: { happy: 2, bond: 2 } },
  { id: "hk_sangkien", stat: "know", kind: "high", minAge: 22, maxAge: 40, minYear: 2000, text: "Sáng kiến của bạn ở chỗ làm được khen thưởng.", effects: { happy: 3, career: 1 } },
  { id: "hb_truongthon", stat: "bond", kind: "high", minAge: 28, maxAge: 40, text: "Bà con tín nhiệm, bầu bạn làm tổ trưởng tổ dân phố.", effects: { happy: 2, bond: 2 } },
  { id: "hb_dongho", stat: "bond", kind: "high", minAge: 20, maxAge: 40, text: "Họ hàng nhờ bạn đứng ra lo việc chung của dòng họ.", effects: { bond: 2 } },
  { id: "hm_hocbong", stat: "money", kind: "high", minAge: 28, maxAge: 40, text: "Bạn góp tiền lập một suất học bổng nhỏ cho học trò nghèo trong xã.", effects: { bond: 4, money: -1 } },
  { id: "hm_giupho", stat: "money", kind: "high", minAge: 25, maxAge: 40, text: "Bạn cho người em họ vay vốn làm ăn, không lấy lãi.", effects: { bond: 3, money: -1 } },
];
