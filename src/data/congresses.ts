import type { TurningPoint } from "../types";

// Tám kỳ Đại hội trong đời người chơi (1986–2021).
// "focus" là định hướng chính của Đại hội, viết theo nội dung phổ biến trong giáo trình.
// CẦN NHÓM ĐỐI CHIẾU TỪNG CÂU VỚI GIÁO TRÌNH trước khi lên lớp (verified: false).
// "local" và các lựa chọn là chuyện hư cấu ở cấp xã, cấp hộ.

export interface Congress {
  year: number;
  num: string;
  /** Định hướng chính, ngắn gọn */
  focus: string;
  /** Ở xã bạn, định hướng ấy thành việc gì (hư cấu) */
  local: string;
  verified: boolean;
}

export const CONGRESSES: Congress[] = [
  { year: 1986, num: "VI", focus: "Đổi mới toàn diện đất nước, trước hết là đổi mới tư duy kinh tế; phát triển kinh tế hàng hóa nhiều thành phần.", local: "Xã cho các hộ tự chăn nuôi, làm nghề phụ, mang sản phẩm ra chợ bán.", verified: false },
  { year: 1991, num: "VII", focus: "Thông qua Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên chủ nghĩa xã hội và Chiến lược ổn định, phát triển kinh tế – xã hội đến năm 2000.", local: "Xã khuyến khích các hộ mở rộng làm ăn: đào ao, trồng cây ăn quả, cho con đi học.", verified: false },
  { year: 1996, num: "VIII", focus: "Đẩy mạnh công nghiệp hóa, hiện đại hóa đất nước.", local: "Máy móc bắt đầu về làng; thanh niên được giới thiệu lên các khu công nghiệp.", verified: false },
  { year: 2001, num: "IX", focus: "Phát triển nền kinh tế thị trường định hướng xã hội chủ nghĩa.", local: "Hộ nào cũng có thể mở cửa hàng, buôn bán, góp vốn làm ăn.", verified: false },
  { year: 2006, num: "X", focus: "Đẩy mạnh toàn diện công cuộc đổi mới, sớm đưa nước ta ra khỏi tình trạng kém phát triển.", local: "Xã mở lớp khuyến nông, dạy nghề ngắn hạn, cho vay vốn làm ăn.", verified: false },
  { year: 2011, num: "XI", focus: "Ba đột phá chiến lược: hoàn thiện thể chế kinh tế thị trường, phát triển nguồn nhân lực, xây dựng kết cấu hạ tầng.", local: "Xã vận động bà con góp sức làm đường, học thêm nghề, đăng ký làm ăn đàng hoàng.", verified: false },
  { year: 2016, num: "XII", focus: "Phát triển kinh tế nhanh, bền vững; đổi mới mô hình tăng trưởng.", local: "Bà con được hướng dẫn làm ăn theo cách mới: sản xuất sạch, liên kết, ứng dụng kỹ thuật.", verified: false },
  { year: 2021, num: "XIII", focus: "Khơi dậy khát vọng phát triển đất nước phồn vinh, hạnh phúc; đẩy mạnh chuyển đổi số.", local: "Xã mở lớp dạy bán hàng trên mạng, làm thủ tục qua điện thoại.", verified: false },
];

export const CONGRESS_BY_YEAR = Object.fromEntries(CONGRESSES.map((c) => [c.year, c]));

// Mỗi Đại hội là một lần nhà bạn chọn cách đáp lại. Không có lựa chọn tốt nhất.
// Dấu "dm_*" đổi luật tiền lâu dài trong engine; dấu khác được dùng ở ripples.ts.
export const CONGRESS_TPS: TurningPoint[] = [
  {
    year: 1986, id: "dh6", title: "Đại hội VI", question: "Bạn mới một tuổi. Bố mẹ ngồi bàn chuyện làm ăn. Bạn chọn giúp bố mẹ:", personal: true,
    options: [
      { id: "dh6_lon", label: "Nuôi thêm lợn gà, mang ra chợ bán", effects: { money: 1, health: -1 }, marks: ["dm_cho"], echo: { after: 3, text: "Lứa lợn năm nào cũng bán được giá, nhà có thêm khoản dư.", effects: { money: 1 } } },
      { id: "dh6_dan", label: "Bố đan thêm rổ rá, mẹ dệt chiếu bán", effects: { money: 1, bond: 2 }, marks: ["nghephu"], echo: { after: 4, text: "Nghề đan của bố thành nghề phụ của cả xóm, nhà nhà rủ nhau làm.", effects: { bond: 3, money: 1 } } },
      { id: "dh6_cu", label: "Giữ như cũ, chờ xem đã", effects: { happy: 1 }, echo: { after: 3, text: "Thấy hàng xóm làm ăn khấm khá, bố mẹ cũng bắt đầu nuôi thêm lứa gà.", effects: { money: 1 } } },
    ],
  },
  {
    year: 1991, id: "dh7", title: "Đại hội VII", question: "Bạn sáu tuổi. Nhà có chút vốn đầu tiên. Bố mẹ dồn vào việc gì?", personal: true,
    options: [
      { id: "dh7_ao", label: "Đào ao thả cá", effects: { money: 1, health: 1 }, marks: ["aoca"], echo: { after: 3, text: "Ao cá nhà bạn cho thu hoạch, Tết năm ấy có cá kho cả nồi.", effects: { money: 1, happy: 2 } } },
      { id: "dh7_cay", label: "Trồng vườn cây ăn quả", effects: { happy: 1 }, marks: ["vuoncay"], echo: { after: 6, text: "Vườn cây năm nào giờ trĩu quả, thương lái về tận vườn mua.", effects: { money: 2 } } },
      { id: "dh7_hoc", label: "Để dành cho bạn đi học đầy đủ", effects: { know: 3 }, marks: ["dmhoc"], echo: { after: 5, text: "Nhờ bố mẹ lo cho học hành từ sớm, bạn luôn có đủ sách vở.", effects: { know: 2 } } },
    ],
  },
  {
    year: 1996, id: "dh8", title: "Đại hội VIII", question: "Bạn mười một tuổi. Máy móc bắt đầu về làng. Nhà bạn…", personal: true,
    options: [
      { id: "dh8_may", label: "Góp tiền với hàng xóm mua chung máy cày", effects: { money: -1, bond: 3 }, marks: ["maycay"], echo: { after: 2, text: "Có máy cày chung, mùa vụ nhanh hẳn, bố mẹ có thêm thời gian làm việc khác.", effects: { money: 2, health: 1 } } },
      { id: "dh8_tho", label: "Bố đi làm thợ xây ở công trình trên huyện", effects: { money: 2, bond: -1 }, marks: ["bothoxay"], echo: { after: 3, text: "Bố về kể chuyện công trình, chuyện nhà cao tầng. Bạn nghe say mê.", effects: { know: 1, money: 1 } } },
      { id: "dh8_ruong", label: "Giữ ruộng, làm kỹ hơn", effects: { health: 1, happy: 1 }, echo: { after: 2, text: "Ruộng nhà bạn năm nào cũng tốt nhất xóm, ai cũng hỏi kinh nghiệm.", effects: { bond: 2 } } },
    ],
  },
  {
    year: 2001, id: "dh9", title: "Đại hội IX", question: "Bạn mười sáu tuổi. Đầu làng mở thêm nhiều cửa hàng. Nhà bạn…", personal: true,
    options: [
      { id: "dh9_tapHoa", label: "Mẹ mở quầy tạp hóa trước nhà", effects: { money: 2, happy: -1 }, marks: ["taphoa"], echo: { after: 4, text: "Quầy tạp hóa của mẹ thành chỗ cả xóm ghé, tối nào cũng đông người.", effects: { money: 1, bond: 3 } } },
      { id: "dh9_gopvon", label: "Góp vốn cùng mấy nhà làm xưởng nhỏ", effects: { money: 1, bond: 2 }, marks: ["gopvon"], roll: { chance: () => 0.6, success: { effects: { money: 2 }, text: "Xưởng làm ăn được, cuối năm chia lãi cho các nhà góp vốn." }, fail: { effects: { money: -2 }, text: "Xưởng thua lỗ năm đầu.", follow: { after: 1, text: "Các nhà góp vốn bàn lại, đổi mặt hàng. Năm sau xưởng có lãi.", effects: { money: 2, bond: 2 } } } } },
      { id: "dh9_hocnghe", label: "Bạn đi học thêm tin học buổi tối", effects: { know: 3, money: -1 }, marks: ["tinhoc"], echo: { after: 3, text: "Biết dùng máy tính, bạn được nhờ làm sổ sách cho mấy cửa hàng trong xã.", effects: { money: 1, know: 1 } } },
    ],
  },
  {
    year: 2006, id: "dh10", title: "Đại hội X", question: "Bạn hai mươi mốt tuổi. Xã mở lớp, cho vay vốn. Bạn…", personal: true,
    options: [
      { id: "dh10_khuyennong", label: "Học lớp khuyến nông, làm giống lúa mới", effects: { know: 2, money: 1 }, marks: ["khuyennong"], echo: { after: 2, text: "Giống lúa mới cho năng suất cao, cả xóm sang xin giống.", effects: { money: 2, bond: 2 } } },
      { id: "dh10_vayvon", label: "Vay vốn ưu đãi mở hàng sửa xe", effects: { money: 1, happy: 1 }, marks: ["suaxe"], echo: { after: 3, text: "Hàng sửa xe của bạn đông khách, trả xong vốn vay trước hạn.", effects: { money: 2, happy: 2 } } },
      { id: "dh10_hocnghe", label: "Học nghề ngắn hạn, đi làm công ty", effects: { know: 1, money: 1, bond: -1 }, marks: ["dm_daotao"], echo: { after: 3, text: "Có chứng chỉ nghề, bạn được nhận vào làm chính thức.", effects: { career: 2 } } },
    ],
  },
  {
    year: 2011, id: "dh11", title: "Đại hội XI", question: "Bạn hai mươi sáu tuổi. Xã vận động làm đường, học nghề, đăng ký làm ăn. Bạn góp sức vào…", personal: true,
    options: [
      { id: "dh11_duong", label: "Góp công, góp đất làm đường liên thôn", effects: { bond: 5, money: -1 }, marks: ["dm_ntm"], echo: { after: 2, text: "Đường liên thôn hoàn thành, xe tải vào tận nơi mua nông sản.", effects: { money: 2, happy: 2 } } },
      { id: "dh11_hoc", label: "Đi học văn bằng hai buổi tối", effects: { know: 4, health: -1 }, marks: ["vanbang2"], echo: { after: 4, text: "Văn bằng hai giúp bạn lên được vị trí mới.", effects: { career: 3 } } },
      { id: "dh11_dkkd", label: "Đăng ký hộ kinh doanh cho cơ sở của nhà", effects: { money: 1 }, marks: ["dm_dkkd"], echo: { after: 2, text: "Có giấy phép, cơ sở nhà bạn ký được hợp đồng với công ty ở tỉnh.", effects: { money: 2 } } },
    ],
  },
  {
    year: 2016, id: "dh12", title: "Đại hội XII", question: "Bạn ba mươi mốt tuổi. Bà con được hướng dẫn làm ăn theo cách mới. Bạn…", personal: true,
    options: [
      { id: "dh12_sach", label: "Chuyển sang sản xuất sạch, có chứng nhận", effects: { health: 2, money: -1 }, marks: ["sxsach"], echo: { after: 3, text: "Rau sạch nhà bạn vào được siêu thị ở tỉnh, giá cao hơn hẳn.", effects: { money: 2 } } },
      { id: "dh12_lienket", label: "Vào hợp tác xã kiểu mới, liên kết bao tiêu", effects: { bond: 4, money: 1 }, marks: ["htxmoi"], echo: { after: 2, text: "Hợp tác xã bao tiêu đầu ra, bạn không còn lo bị ép giá.", effects: { money: 1, happy: 2 } } },
      { id: "dh12_khoinghiep", label: "Thử mở một dịch vụ nhỏ ở làng", effects: { money: 1, happy: 2 }, marks: ["khoinghiep"], roll: { chance: (s) => Math.min(0.75, 0.35 + s.stats.know * 0.004), success: { effects: { money: 2 }, text: "Dịch vụ nhỏ của bạn đắt khách ngay năm đầu." }, fail: { effects: { money: -2 }, text: "Năm đầu ế khách.", follow: { after: 1, text: "Bạn đổi cách làm, khách dần quay lại.", effects: { money: 2, know: 1 } } } } },
    ],
  },
  {
    year: 2021, id: "dh13", title: "Đại hội XIII", question: "Bạn ba mươi sáu tuổi. Xã mở lớp chuyển đổi số. Bạn…", personal: true,
    options: [
      { id: "dh13_online", label: "Học bán hàng trên mạng", effects: { know: 2, money: 1 }, marks: ["bannmang"], echo: { after: 2, text: "Đơn hàng trên mạng của bạn gửi đi khắp các tỉnh.", effects: { money: 2 } } },
      { id: "dh13_dulich", label: "Cùng làng làm du lịch cộng đồng", effects: { bond: 4, happy: 2 }, marks: ["dulichcd"], echo: { after: 2, text: "Khách thành phố về làng ở nhà dân, ăn cơm quê. Làng rộn ràng hẳn lên.", effects: { money: 2, bond: 2 } } },
      { id: "dh13_daybo", label: "Dạy bố mẹ, hàng xóm dùng điện thoại làm thủ tục", effects: { bond: 5 }, marks: ["daysodn"], echo: { after: 1, text: "Bố mẹ tự gọi khám bệnh, tự nhận tiền qua điện thoại, cứ khoe với cả xóm.", effects: { bond: 3, happy: 3 } } },
    ],
  },
];
