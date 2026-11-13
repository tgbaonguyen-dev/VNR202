import type { Mood, Scene } from "../types";
import { has } from "./turningPoints";

// Cảnh làng: mỗi năm hiện một dòng để thấy làng đổi khác dần.
// Chỉ kể chuyện cấp làng, hư cấu, không có số liệu, không nhận định cấp quốc gia.
// Mốc thời gian bám theo các "cánh cửa" trong engine (điện, tivi, điện thoại, máy tính, điện thoại thông minh).

const dien = (s: { settings: { electricityYear: number } }) => s.settings.electricityYear;

export const SCENES: Scene[] = [
  // 1985–1988: những năm khó
  { id: "sc_temphieu", fromYear: 1985, toYear: 1987, text: "Mẹ dậy từ tờ mờ sáng, cầm sổ ra hợp tác xã xếp hàng nhận phần gạo." },
  { id: "sc_khoaian", fromYear: 1985, toYear: 1988, text: "Bữa cơm nhà ai trong xóm cũng độn thêm khoai, thêm sắn." },
  { id: "sc_dendau", fromYear: 1985, toYear: 1988, text: "Tối đến, cả xóm chỉ le lói mấy ngọn đèn dầu. Người lớn tắt đèn sớm cho đỡ tốn." },
  { id: "sc_kenh", fromYear: 1985, toYear: 1988, text: "Bọn trẻ trong xóm đi chân đất, quần áo mặc chung từ anh xuống em." },
  { id: "sc_kenhieukhien", fromYear: 1986, toYear: 1988, text: "Ngoài đình, mấy ông cụ ngồi bàn chuyện đồng áng đến khuya, ai cũng mong mùa tới khá hơn." },
  { id: "sc_xedap", fromYear: 1985, toYear: 1989, text: "Cả xóm chỉ vài nhà có xe đạp. Ai cần đi chợ huyện thì mượn nhau." },

  // 1989–1994: ruộng khoán, chợ đông dần
  { id: "sc_lua", fromYear: 1989, toYear: 1992, text: "Mùa gặt năm nay, sân nhà nào cũng vàng thóc phơi." },
  { id: "sc_cho", fromYear: 1989, toYear: 1994, text: "Chợ làng họp đông hơn hẳn. Có thêm hàng vải, hàng bánh kẹo từ thị trấn về." },
  { id: "sc_bannuoc", fromYear: 1990, toYear: 1994, text: "Mấy nhà đầu ngõ mở hàng nước chè, bán thêm thuốc lào, kẹo lạc." },
  { id: "sc_nuoiheo", fromYear: 1989, toYear: 1994, text: "Nhà nào cũng nuôi thêm con lợn, coi như ống tiết kiệm của cả nhà." },
  { id: "sc_mainha", fromYear: 1991, toYear: 1995, text: "Vài nhà trong xóm thay mái lá bằng mái ngói đỏ au." },
  { id: "sc_dai", fromYear: 1989, toYear: 1995, text: "Chiều chiều, tiếng đài bán dẫn nhà bên vọng sang, cả nhà ngồi nghe tin tức." },
  { id: "sc_dientruoc", fromYear: 1992, toYear: 1994, text: "Người ta bắt đầu dựng cột điện dọc đường cái. Bọn trẻ đếm từng cột mỗi ngày." },

  // Điện về và mấy năm sau đó
  { id: "sc_tivi", fromYear: 1996, toYear: 1999, text: "Tối tối, cả xóm kéo sang nhà có tivi xem phim truyện. Sân chật kín dép." },
  { id: "sc_quat", fromYear: 1996, toYear: 2000, text: "Trưa hè năm nay, nhà bạn có chiếc quạt điện. Bà bảo chẳng phải phe phẩy quạt nan nữa." },
  { id: "sc_xaxat", fromYear: 1995, toYear: 2000, text: "Có điện, nhà bên mua máy xay xát. Cả xóm khỏi phải giã gạo bằng chày.", cond: (s) => s.year >= dien(s) },
  { id: "sc_dicty", fromYear: 1997, toYear: 2002, text: "Mấy anh chị lớn trong xóm khăn gói ra thành phố làm ở nhà máy. Tết về ai cũng khác hẳn." },
  { id: "sc_honda", fromYear: 1997, toYear: 2002, text: "Đường làng thỉnh thoảng có tiếng xe máy. Ai đi qua bọn trẻ cũng chạy ra ngõ nhìn." },
  { id: "sc_gieng", fromYear: 1996, toYear: 2001, text: "Nhà bác đầu xóm khoan giếng, lắp máy bơm. Hàng xóm sang xin nước về ăn." },
  { id: "sc_truonglop", fromYear: 1995, toYear: 2000, text: "Trường cấp hai xây thêm dãy lớp mới, có cả cửa kính." },

  // 2000–2006: điện thoại, đường sá
  { id: "sc_dtcong", fromYear: 2000, toYear: 2004, text: "Bưu điện xã có máy điện thoại. Ai có con đi làm xa thì ra đó chờ cuộc gọi." },
  { id: "sc_dtdidong", fromYear: 2004, toYear: 2007, text: "Trong xóm đã có người cầm điện thoại di động. Tiếng chuông kêu là cả nhà giật mình." },
  { id: "sc_karaoke", fromYear: 2001, toYear: 2007, text: "Đám cưới trong làng giờ có dàn loa thuê, hát karaoke đến khuya." },
  { id: "sc_nhamai", fromYear: 2002, toYear: 2008, text: "Dọc đường cái mọc lên mấy ngôi nhà mái bằng hai tầng, quét vôi xanh vôi vàng." },
  { id: "sc_quannet", fromYear: 2003, toYear: 2008, text: "Thị trấn mở quán net đầu tiên. Bọn học sinh rủ nhau đi chơi điện tử sau giờ học." },
  { id: "sc_xebuyt", fromYear: 2003, toYear: 2009, text: "Có tuyến xe khách chạy thẳng từ huyện lên thành phố. Người đi làm xa đỡ vất vả hẳn." },
  { id: "sc_tramyte", fromYear: 2004, toYear: 2009, text: "Trạm y tế xã được sửa lại, có thêm phòng khám cho bà mẹ và trẻ em." },

  // 2007–2012: nhà máy, đường bê tông
  { id: "sc_kcn", fromYear: 2007, toYear: 2012, text: "Gần huyện mọc lên mấy nhà máy mới. Sáng sớm xe đưa đón công nhân chạy qua làng." },
  { id: "sc_xemay", fromYear: 2007, toYear: 2012, text: "Giờ nhà nào cũng có xe máy. Đường làng chiều nào cũng rộn tiếng xe." },
  { id: "sc_tulanh", fromYear: 2008, toYear: 2013, text: "Hàng xóm khoe tủ lạnh mới, mùa hè có đá lạnh mời cả xóm." },
  { id: "sc_maycay", fromYear: 2008, toYear: 2014, text: "Máy gặt đập về tận ruộng. Mùa gặt giờ chỉ vài ngày là xong." },
  { id: "sc_xaytruong", fromYear: 2010, toYear: 2015, text: "Xã họp bàn làm nông thôn mới. Nhà nào cũng góp ngày công, hiến một khoảnh đất làm đường." },
  { id: "sc_dentuong", fromYear: 2011, toYear: 2016, text: "Đường làng có đèn đường. Tối đi về không phải soi đèn pin nữa." },
  { id: "sc_vovu", fromYear: 2009, toYear: 2014, text: "Nhà văn hóa thôn mới khánh thành. Tối tối các bà các mẹ ra tập văn nghệ." },

  // 2013–2019: điện thoại thông minh, buôn bán trên mạng
  { id: "sc_smartphone", fromYear: 2013, toYear: 2017, text: "Ông bà trong xóm bắt đầu cầm điện thoại cảm ứng, nhờ cháu chỉ cách gọi có hình." },
  { id: "sc_wifi", fromYear: 2014, toYear: 2018, text: "Quán nước đầu làng treo biển có wifi. Thanh niên ngồi kín bàn." },
  { id: "sc_banonline", fromYear: 2015, toYear: 2019, text: "Mấy chị trong xóm đăng ảnh rau, trứng, mắm lên mạng bán cho người thành phố." },
  { id: "sc_shipper", fromYear: 2016, toYear: 2020, text: "Xe giao hàng vào tận ngõ. Bà con đặt hàng trên điện thoại, mấy hôm là có." },
  { id: "sc_ve_que", fromYear: 2015, toYear: 2020, text: "Vài người trẻ đi làm xa trở về, mở xưởng nhỏ, mở vườn ngay tại làng." },
  { id: "sc_dulichxom", fromYear: 2016, toYear: 2019, text: "Cuối tuần có khách thành phố về làng chụp ảnh cánh đồng, ăn cơm nhà dân." },
  { id: "sc_sanbong", fromYear: 2015, toYear: 2019, text: "Sân bóng cỏ nhân tạo mở cạnh trường học. Chiều nào cũng đông người đá." },

  // 2020–2021: dịch bệnh, không kể chuyện đau buồn
  { id: "sc_khautrang", fromYear: 2020, toYear: 2020, text: "Đi đâu ai cũng đeo khẩu trang. Loa xã nhắc bà con rửa tay, hạn chế tụ tập." },
  { id: "sc_hoconline", fromYear: 2020, toYear: 2021, text: "Bọn trẻ trong xóm học qua điện thoại. Nhà nào có wifi thì cho hàng xóm sang học nhờ." },
  { id: "sc_gaoxom", fromYear: 2021, toYear: 2021, text: "Bà con góp gạo, góp rau gửi lên cho người làm xa chưa về được." },

  // 2022–2025
  { id: "sc_quetma", fromYear: 2022, toYear: 2025, text: "Bà bán rau ở chợ làng treo mã QR. Người mua quét điện thoại là xong." },
  { id: "sc_dientoi", fromYear: 2022, toYear: 2025, text: "Vài nhà trong xóm lắp tấm pin mặt trời trên mái." },
  { id: "sc_ocop", fromYear: 2022, toYear: 2025, text: "Đặc sản làng được đóng gói đẹp, gửi đi bán khắp nơi." },
  { id: "sc_conchau", fromYear: 2022, toYear: 2025, text: "Ngày Tết, con cháu đi làm xa về đỗ kín đường làng bằng xe máy, ô tô." },
  { id: "sc_thuvien", fromYear: 2023, toYear: 2025, text: "Trường làng có phòng máy tính. Bọn trẻ học lập trình từ cấp hai." },
  { id: "sc_cuoi", fromYear: 2024, toYear: 2025, text: "Cây đa đầu làng vẫn đứng đó. Chỉ có con đường dưới gốc đã thành đường nhựa." },
];

// Suy nghĩ: những lúc nhân vật dừng lại tự nhủ. Theo tuổi, tâm trạng, hoàn cảnh.
export const MOODS: Mood[] = [
  // Tuổi thơ
  { id: "md_tho1", minAge: 6, maxAge: 11, cond: (s) => s.stats.happy >= 60, text: "Lớn lên mình muốn làm thầy giáo, hay làm người lái máy cày nhỉ?" },
  { id: "md_tho2", minAge: 7, maxAge: 12, cond: (s) => s.money < 35, text: "Mình thấy mẹ đếm từng đồng trước khi đi chợ. Mình tự hứa sẽ đỡ đần mẹ." },
  { id: "md_tho3", minAge: 6, maxAge: 12, cond: (s) => s.familyId === "ongba", text: "Bà bảo hồi xưa làng mình nghèo lắm. Mình không biết còn nghèo hơn bây giờ là thế nào." },
  { id: "md_tho4", minAge: 8, maxAge: 13, cond: (s) => s.familyId === "anhchixa", text: "Mình nhớ anh chị. Đêm nào cũng nằm đếm còn bao nhiêu ngày nữa đến Tết." },
  { id: "md_tho5", minAge: 8, maxAge: 13, cond: (s) => s.familyId === "dongcon", text: "Nhà đông, ăn gì cũng phải chia. Nhưng tối nào cũng vui như hội." },
  { id: "md_tho6", minAge: 6, maxAge: 12, cond: (s) => s.familyId === "conmot", text: "Nhà chỉ có mình mình. Đôi khi mình ước có một đứa em để chơi cùng." },

  // Mới lớn
  { id: "md_lon1", minAge: 13, maxAge: 17, cond: (s) => s.stats.know >= 55, text: "Mình bắt đầu tò mò thế giới ngoài lũy tre làng trông ra sao." },
  { id: "md_lon2", minAge: 13, maxAge: 17, cond: (s) => s.stats.know < 50, text: "Học hành dạo này hơi đuối. Mình không biết mình hợp với việc gì." },
  { id: "md_lon3", minAge: 14, maxAge: 18, cond: (s) => has(s, "thanban"), text: "Có {friend} bên cạnh, chuyện gì cũng thấy nhẹ đi một nửa." },
  { id: "md_lon4", minAge: 15, maxAge: 18, cond: () => true, text: "Mình hay đứng ngoài đê nhìn mấy chuyến xe khách đi về phía thành phố." },
  { id: "md_lon5", minAge: 14, maxAge: 18, cond: (s) => has(s, "phu"), text: "Tay mình chai rồi. Bố bảo thế mới thành người lớn." },

  // Đôi mươi
  { id: "md_20a", minAge: 19, maxAge: 25, cond: (s) => has(s, "thanhpho") || has(s, "fdi") || has(s, "daihoc"), text: "Thành phố ồn quá. Có đêm mình nằm nhớ tiếng ếch nhái ngoài đồng." },
  { id: "md_20b", minAge: 19, maxAge: 25, cond: (s) => has(s, "olang"), text: "Bạn bè đi xa gần hết. Mình ở lại, đôi lúc cũng băn khoăn không biết chọn vậy có đúng không." },
  { id: "md_20c", minAge: 19, maxAge: 26, cond: (s) => s.money < 35, text: "Tiền lương chưa đủ tiêu. Mình học cách ghi chép từng khoản chi." },
  { id: "md_20d", minAge: 20, maxAge: 27, cond: (s) => s.stats.happy >= 70, text: "Có những buổi chiều mình thấy cuộc đời rộng mở thật." },
  { id: "md_20e", minAge: 21, maxAge: 28, cond: (s) => s.stats.health < 50, text: "Dạo này mình hay mệt. Có lẽ nên nghỉ ngơi nhiều hơn." },
  { id: "md_20f", minAge: 20, maxAge: 28, cond: (s) => !has(s, "kethon"), text: "Mẹ bắt đầu hỏi chuyện lập gia đình. Mình chỉ cười cho qua." },

  // Ba mươi
  { id: "md_30a", minAge: 29, maxAge: 36, cond: (s) => has(s, "kethon"), text: "Nhìn con ngủ, mình hiểu ra vì sao ngày xưa bố mẹ chịu khó đến thế." },
  { id: "md_30b", minAge: 29, maxAge: 38, cond: (s) => s.stats.bond >= 70, text: "Đi đâu trong làng cũng có người gọi tên mình chào hỏi. Thấy ấm lòng." },
  { id: "md_30c", minAge: 30, maxAge: 38, cond: (s) => s.money >= 55, text: "Cuộc sống đủ đầy hơn rồi. Mình tự nhắc đừng quên những năm còn khó." },
  { id: "md_30d", minAge: 30, maxAge: 38, cond: (s) => s.money < 40, text: "Mình chưa khá giả gì. Nhưng nhìn lại thì mỗi năm vẫn nhích lên được một chút." },
  { id: "md_30e", minAge: 30, maxAge: 39, cond: (s) => s.stats.know >= 65, text: "Mình vẫn giữ thói quen học thêm điều mới mỗi năm." },
  { id: "md_30f", minAge: 31, maxAge: 39, cond: () => true, text: "Tóc {bo} đã bạc trắng. Mình thấy thời gian đi nhanh quá." },
  { id: "md_30g", minAge: 32, maxAge: 39, cond: (s) => has(s, "vequelang") || has(s, "veque"), text: "Về làng rồi mới thấy làng đổi khác nhiều thế nào so với ngày mình đi." },
  { id: "md_30h", minAge: 32, maxAge: 39, cond: (s) => has(s, "olaitp") || has(s, "thanhpho"), text: "Thành phố giờ đã thành nhà. Nhưng hỏi quê đâu, mình vẫn kể tên làng." },
];
