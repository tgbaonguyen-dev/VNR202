import type { Milestone } from "../types";

// Chỉ ghi năm. Nội dung phải khớp database "Mốc lịch sử" trên Notion
// và được nhóm đối chiếu với giáo trình trước khi lên lớp.

const GIAO_TRINH = "Giáo trình Lịch sử Đảng Cộng sản Việt Nam";
const MOFA = "https://mofa.gov.vn/tt_baochi/nr040810155502/ns151005111009/LSNG%20P4_p301-p400.pdf/download";

export const HISTORY: Milestone[] = [
  {
    year: 1985,
    text: "Kinh tế còn nhiều khó khăn; nhiều nhu yếu phẩm còn được phân phối theo tem phiếu.",
    source: "Tạp chí Quản lý Nhà nước; " + GIAO_TRINH,
    url: "https://www.quanlynhanuoc.vn/?p=67908",
  },
  {
    year: 1986,
    text: "Đại hội VI của Đảng đề ra đường lối Đổi mới.",
    big: true,
    source: "Bộ Công Thương; Thư viện Quốc hội (Nghị quyết Đại hội VI)",
    url: "https://moit.gov.vn/tin-tuc/dai-hoi-vi-cua-dang-khoi-xuong-va-lanh-dao-su-nghiep-doi-moi-dat-nuoc.html",
  },
  {
    year: 1987,
    text: "Luật Đầu tư nước ngoài tại Việt Nam được ban hành.",
    source: "Luật số 4-HĐNN8 (Thư viện pháp luật)",
    url: "https://thuvienphapluat.vn/van-ban/doanh-nghiep/luat-dau-tu-nuoc-ngoai-tai-viet-nam-1987-4-hdnn8-37468.aspx",
  },
  {
    year: 1988,
    text: "Nghị quyết 10 của Bộ Chính trị (Khoán 10) giao khoán ruộng đất đến hộ nông dân.",
    big: true,
    unlockText: "Từ nay gia đình bạn được tự quyết việc làm ăn trên mảnh ruộng khoán.",
    unlocks: ["khoan10"],
    effects: { money: 3 },
    catchUp: true,
    source: "Nghị quyết số 10-NQ/TW",
    url: "https://caselaw.vn/van-ban-phap-luat/137224-nghi-quyet-so-10-nq-tw-ngay-05-04-1988-cua-bo-chinh-tri-ve-doi-moi-quan-ly-kinh-te-nong-nghiep",
  },
  {
    year: 1989,
    text: "Từ chỗ thiếu lương thực, Việt Nam bắt đầu xuất khẩu gạo.",
    source: "Tạp chí Tòa án nhân dân; " + GIAO_TRINH,
    url: "https://tapchitoaan.vn/chuyen-doi-so-dua-dat-nuoc-buoc-vao-ky-nguyen-moi-ky-nguyen-cua-tien-tien-van-minh-hien-dai11829.html",
  },
  { year: 1991, text: "Đại hội VII của Đảng.", source: GIAO_TRINH },
  {
    year: 1994,
    text: "Hoa Kỳ bỏ lệnh cấm vận kinh tế đối với Việt Nam.",
    source: "Bộ Ngoại giao, Lịch sử ngoại giao (tr. 301–400)",
    url: MOFA,
  },
  {
    year: 1995,
    text: "Việt Nam bình thường hóa quan hệ với Hoa Kỳ và gia nhập ASEAN.",
    big: true,
    source: "Bộ Ngoại giao, Lịch sử ngoại giao (tr. 301–400)",
    url: MOFA,
  },
  {
    year: 1996,
    text: "Đại hội VIII đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.",
    unlockText: "Tỉnh bên bắt đầu xây khu công nghiệp. Sau này bạn có thể lên đó tìm việc.",
    unlocks: ["kcn"],
    source: GIAO_TRINH,
  },
  {
    year: 2000,
    text: "Luật Doanh nghiệp năm 1999 có hiệu lực; doanh nghiệp tư nhân ra đời nhiều hơn.",
    unlockText: "Từ nay mở một cơ sở kinh doanh nhỏ dễ dàng hơn trước.",
    unlocks: ["luatdn"],
    source: "Luật Doanh nghiệp số 13/1999/QH10 (VCCI)",
    url: "https://vcci.com.vn/legal-document/luat-doanh-nghiep",
  },
  {
    year: 2001,
    text: "Đại hội IX; Hiệp định Thương mại Việt Nam – Hoa Kỳ có hiệu lực.",
    source: "Trung tâm WTO (VCCI)",
    url: "https://trungtamwto.vn/hiep-dinh-khac/209-hiep-dinh-ve-quan-he-thuong-mai-giua-cong-hoa-xa-hoi-chu-nghia-viet-nam-va-hop-chung-quoc-hoa-ky-",
  },
  { year: 2006, text: "Đại hội X của Đảng.", source: GIAO_TRINH },
  {
    year: 2007,
    text: "Việt Nam chính thức trở thành thành viên WTO.",
    big: true,
    unlockText: "Một nhà máy vốn nước ngoài mở ở tỉnh bên và đang tuyển người.",
    unlocks: ["wto"],
    source: "Cổng Thông tin điện tử Chính phủ",
    url: "https://en.baochinhphu.vn/vn-officially-becomes-a-full-wto-member-1112136.htm",
  },
  {
    year: 2010,
    text: "Chương trình mục tiêu quốc gia xây dựng nông thôn mới được phê duyệt.",
    big: true,
    unlockText: "Làng bạn bắt đầu làm đường bê tông, xây lại trường học.",
    unlocks: ["ntm"],
    effects: { money: 2 },
    catchUp: true,
    source: "Quyết định số 800/QĐ-TTg",
    url: "https://caselaw.vn/van-ban-phap-luat/196858-quyet-dinh-so-800-qd-ttg-ngay-04-06-2010-cua-thu-tuong-chinh-phu-phe-duyet-chuong-trinh-muc-tieu-quoc-gia-ve-xay-dung-nong-thon-moi-giai-doan-2010-2020-van-ban-het-hieu-luc",
  },
  { year: 2011, text: "Đại hội XI của Đảng.", source: GIAO_TRINH },
  { year: 2016, text: "Đại hội XII của Đảng.", source: GIAO_TRINH },
  {
    year: 2020,
    text: "Đại dịch COVID-19 ảnh hưởng đến việc làm và đời sống; cả nước cùng chống dịch.",
    big: true,
    source: GIAO_TRINH,
  },
  { year: 2021, text: "Đại hội XIII của Đảng.", source: GIAO_TRINH },
  {
    year: 2022,
    text: "Chương trình mục tiêu quốc gia giảm nghèo bền vững giai đoạn 2021–2025 được phê duyệt.",
    big: true,
    source: "Quyết định số 90/QĐ-TTg",
    url: "https://caselaw.vn/van-ban-phap-luat/401049-quyet-dinh-so-90-qd-ttg-ngay-18-01-2022-cua-thu-tuong-chinh-phu-phe-duyet-chuong-trinh-muc-tieu-quoc-gia-giam-ngheo-ben-vung-giai-doan-2021-2025",
  },
];
