import type { ChildRequest, KidRequest } from "../types";

// Những thứ bạn xin bố mẹ khi còn nhỏ. Bố mẹ quyết định theo tiền nhà đang có.
// Giá là ước lượng minh họa, quy theo giá năm 2025, không phải số liệu.

export const REQUESTS: ChildRequest[] = [
  { id: "truyen", label: "Một quyển truyện tranh", desc: "Đứa bạn cùng lớp có cả bộ, bạn chỉ mong có một quyển.", minAge: 6, maxAge: 12, price: 0.3, effects: { happy: 3, know: 1 }, got: "Bạn đọc đi đọc lại quyển truyện đến thuộc lòng, rồi cho cả xóm mượn." },
  { id: "aotet", label: "Bộ quần áo mới đón Tết", desc: "Áo cũ đã chật, tay áo ngắn cũn.", minAge: 4, maxAge: 14, price: 0.6, effects: { happy: 4 }, got: "Sáng mùng Một, bạn mặc bộ áo mới đi chúc Tết khắp xóm." },
  { id: "thamquan", label: "Đi tham quan cùng lớp", desc: "Cả lớp đi xe khách lên tỉnh, phải đóng tiền xe và tiền ăn.", minAge: 8, maxAge: 17, minYear: 1992, price: 1, effects: { happy: 4, bond: 2, know: 1 }, marks: ["thamquan"], got: "Lần đầu bạn được đi xa nhà, về kể mãi chuyện tòa nhà cao, chuyện bờ biển." },
  { id: "sachtk", label: "Bộ sách tham khảo", desc: "Thầy giới thiệu mấy quyển sách luyện thi, nhà sách huyện mới có.", minAge: 10, maxAge: 17, price: 0.8, effects: { know: 5 }, marks: ["sachtk"], got: "Bạn bọc bìa cẩn thận, học kín cả lề sách." },
  { id: "xedap", label: "Một chiếc xe đạp riêng để đi học", desc: "Trường cấp hai ở xã bên, đi bộ mất gần một tiếng.", minAge: 10, maxAge: 15, price: 3, effects: { happy: 4, health: 2, know: 1 }, marks: ["xedaprieng"], got: "Chiếc xe đạp lau bóng loáng. Bạn chở cả em, cả bạn đi học." },
  { id: "hocthem", label: "Đi học thêm buổi tối", desc: "Nhiều bạn trong lớp đi học thêm ở nhà thầy, phải đóng tiền hằng tháng.", minAge: 11, maxAge: 17, price: 2, effects: { know: 6, happy: -1 }, marks: ["hocthem"], got: "Tối nào bạn cũng đạp xe đến nhà thầy, về đến nhà là ăn cơm nguội." },
  { id: "maytinhct", label: "Máy tính cầm tay để học Toán", desc: "Lên lớp trên, bài nào cũng phải bấm máy.", minAge: 13, maxAge: 17, minYear: 1997, price: 0.6, effects: { know: 3 }, got: "Bạn bấm máy nhanh nhất lớp, đứa nào cũng sang hỏi." },
  { id: "dienthoai", label: "Chiếc điện thoại di động đầu tiên", desc: "Bạn bè đã có, nhắn tin cho nhau mỗi tối.", minAge: 15, maxAge: 17, minYear: 2002, price: 3, effects: { happy: 4, bond: 1 }, marks: ["dtnho"], got: "Bạn lưu số của mẹ đầu tiên trong danh bạ." },
  { id: "dan", label: "Một cây đàn để tập", desc: "Bạn mê nghe đàn ở đội văn nghệ của trường.", minAge: 12, maxAge: 17, price: 1.5, effects: { happy: 5 }, marks: ["dannho"], got: "Tối nào bạn cũng ôm đàn ra hiên tập, hàng xóm sang nghe." },
];

export const REQUEST_BY_ID = Object.fromEntries(REQUESTS.map((r) => [r.id, r]));

/** Tiền học bố mẹ phải lo theo con đường đã chọn */
export const SCHOOL_COSTS: { mark: string; fromAge: number; toAge: number; perYear: number; label: string }[] = [
  { mark: "capba", fromAge: 15, toAge: 17, perYear: 2, label: "học cấp ba" },
  { mark: "nghe", fromAge: 15, toAge: 15, perYear: 3, label: "học nghề" },
  { mark: "hocthem", fromAge: 11, toAge: 17, perYear: 1, label: "học thêm" },
  { mark: "daihoc", fromAge: 18, toAge: 21, perYear: 8, label: "học đại học" },
  { mark: "hocxa", fromAge: 20, toAge: 22, perYear: 6, label: "học xa" },
];

/** Tiền học của một lựa chọn ở ngã rẽ, để bố mẹ cân nhắc trước khi quyết */
export const OPTION_SCHOOL: Record<string, { years: number; perYear: number; label: string }> = {
  capba: { years: 3, perYear: 2, label: "học cấp ba" },
  nghe: { years: 1, perYear: 3, label: "học nghề" },
  daihoc: { years: 4, perYear: 8, label: "học đại học" },
  hocxa: { years: 3, perYear: 6, label: "học xa" },
};

// Khi bạn đã làm bố mẹ: con xin bạn. Giá là ước lượng minh họa.
// Mỗi cách trả lời đều để lại một thẻ nhắc lại vài năm sau.
export const KID_REQUESTS: KidRequest[] = [
  { id: "k_aotet", label: "bộ quần áo mới đón Tết", plea: "Bố mẹ ơi, Tết này con được mặc áo mới không?", minAge: 3, maxAge: 10, price: 0.8, sameAs: "aotet",
    yes: "Sáng mùng Một, con mặc áo mới chạy khắp xóm khoe.", later: "Tết sau con được bộ áo mới, giữ gìn cẩn thận lắm.", explain: "Con mặc lại áo cũ, mẹ khâu thêm cái túi hình con mèo. Con thích hơn cả áo mới." },
  { id: "k_truyen", label: "bộ truyện tranh", plea: "Bạn con có cả bộ truyện, con mượn đọc mãi ngại lắm.", minAge: 6, maxAge: 12, price: 0.5, sameAs: "truyen",
    yes: "Bộ truyện xếp gọn trên giá, con cho cả lớp mượn.", later: "Năm sau con có bộ truyện, đọc đến thuộc lòng.", explain: "Bạn dẫn con lên thư viện xã. Con mượn được mỗi tuần một quyển, đọc nhiều hơn cả mua." },
  { id: "k_xedap", label: "chiếc xe đạp", plea: "Con muốn có xe đạp để tự đi học, không phải chờ bố mẹ đưa đón.", minAge: 6, maxAge: 12, price: 2.5, sameAs: "xedap",
    yes: "Con tự đạp xe đi học, về khoe từng con dốc đã vượt qua.", later: "Năm sau con có xe đạp, tự đi học từ đó.", explain: "Con đi chung xe với bạn cùng xóm. Hai đứa thành bạn thân." },
  { id: "k_tamquan", label: "chuyến đi tham quan cùng lớp", plea: "Lớp con đi tham quan bảo tàng, cô bảo phải đóng tiền xe.", minAge: 7, maxAge: 13, price: 1.2, sameAs: "thamquan",
    yes: "Con về kể chuyện bảo tàng cả tuần, vẽ lại từng hiện vật.", later: "Đợt tham quan sau con được đi, háo hức từ tối hôm trước.", explain: "Cuối tuần, cả nhà chở con lên tỉnh chơi. Con bảo đi với bố mẹ còn vui hơn." },
  { id: "k_tienganh", label: "lớp học tiếng Anh ở trung tâm", plea: "Mấy bạn trong lớp đi học tiếng Anh buổi tối, con cũng muốn đi.", minAge: 7, maxAge: 15, minYear: 2015, price: 6,
    yes: "Con nói tiếng Anh bập bẹ, dạy lại cả ông bà mấy câu chào.", later: "Năm sau con được đi học, chăm chỉ không nghỉ buổi nào.", explain: "Hai bố mẹ con cùng học qua video trên điện thoại mỗi tối." },
  { id: "k_boi", label: "khóa học bơi mùa hè", plea: "Hè này trường mở lớp học bơi, con đăng ký được không?", minAge: 6, maxAge: 12, minYear: 2016, price: 1.5,
    yes: "Con bơi được qua bể, tự tin hẳn lên.", later: "Hè sau con học bơi, mấy tuần đã bơi thạo.", explain: "Bạn tự dạy con bơi ở ao làng, như ông ngày xưa dạy bạn." },
  { id: "k_maytinhbang", label: "chiếc máy tính bảng để học", plea: "Cô giáo giao bài trên mạng, con muốn có máy riêng để học.", minAge: 8, maxAge: 15, minYear: 2018, price: 5,
    yes: "Con học trên máy, bạn đặt giờ để con không mải chơi.", later: "Năm sau con có máy, dùng cẩn thận lắm.", explain: "Con dùng chung điện thoại của bố mẹ mỗi tối. Cả nhà ngồi quây lại học cùng." },
  { id: "k_dan", label: "cây đàn để tập", plea: "Con thích nghe đàn lắm, bố mẹ mua cho con một cây nhé.", minAge: 8, maxAge: 15, price: 3, sameAs: "dan",
    yes: "Tối nào con cũng ôm đàn tập, nhà lúc nào cũng có tiếng nhạc.", later: "Năm sau con có đàn, tập say mê.", explain: "Con mượn đàn của thầy ở nhà văn hóa, tập mỗi chiều thứ Bảy." },
];

export const KID_REQUEST_BY_ID = Object.fromEntries(KID_REQUESTS.map((r) => [r.id, r]));
