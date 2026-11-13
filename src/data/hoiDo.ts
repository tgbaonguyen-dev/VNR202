import type { HoiDo } from "../types";

// Mọi con số thật trong game nằm ở đây, kèm nguồn và link.
// Nguồn "Young Lives TN9" là bảng trích lại từ Báo cáo cập nhật nghèo 2006
// (Viện Hàn lâm KHXH Việt Nam) -> official: false.

const YL = "https://www.younglives.org.uk/sites/default/files/migrated/YL-TN9-Nguyen-Childhood-Poverty-In-Vietnam.pdf";
const YL_NAME = "Viện Hàn lâm KHXH VN, Báo cáo cập nhật nghèo 2006 (trích qua Young Lives, 2008)";
const KSMS2006 = "https://www.nso.gov.vn/su-kien/2019/03/ket-qua-tom-tat-khao-sat-muc-song-ho-gia-dinh-2006/";
const KSMS2006_NAME = "Tổng cục Thống kê, Kết quả tóm tắt Khảo sát mức sống hộ gia đình 2006";

export const HOI_DO: HoiDo[] = [
  {
    id: "bao_cap",
    text: "Trước Đổi mới, hàng hóa khan hiếm, nhiều nhu yếu phẩm được phân phối theo cơ chế bao cấp.",
    source: "Tạp chí Quản lý Nhà nước, \u201cTư duy mở đường: 40 năm Việt Nam Đổi mới\u201d",
    url: "https://www.quanlynhanuoc.vn/?p=67908",
    official: false,
  },
  {
    id: "gao",
    text: "Sau một năm thực hiện Nghị quyết 10, Việt Nam từ chỗ thiếu lương thực đã lần đầu xuất khẩu khoảng 1,2 triệu tấn gạo.",
    source: "Tạp chí Tòa án nhân dân",
    url: "https://tapchitoaan.vn/chuyen-doi-so-dua-dat-nuoc-buoc-vao-ky-nguyen-moi-ky-nguyen-cua-tien-tien-van-minh-hien-dai11829.html",
    official: false,
  },
  {
    id: "radio",
    text: "Năm 1993, cứ 10 hộ có khoảng 4 hộ có đài. Khi tivi phổ biến, đài vắng dần: năm 2004 chỉ còn 19%.",
    source: YL_NAME,
    url: YL,
    official: false,
  },
  {
    id: "dien",
    text: "Năm 1993, chỉ khoảng một nửa dân số dùng điện để thắp sáng. Năm 1998 đã gần 8 trên 10 người.",
    source: YL_NAME,
    url: YL,
    official: false,
  },
  {
    id: "tivi",
    text: "Năm 1993, cứ 10 hộ chỉ khoảng 2 hộ có tivi. Năm 1998 đã hơn một nửa.",
    source: YL_NAME,
    url: YL,
    official: false,
  },
  {
    id: "xedap",
    text: "Hồi đó xe đạp là phương tiện của số đông: năm 1993, khoảng 2 trên 3 hộ có xe đạp.",
    source: YL_NAME,
    url: YL,
    official: false,
  },
  {
    id: "capba",
    text: "Năm 1998, cứ 10 bạn trong độ tuổi cấp ba chỉ khoảng 3 bạn được đi học cấp ba. Năm 1993, con số này chưa tới 1 bạn.",
    source: YL_NAME,
    url: YL,
    official: false,
  },
  {
    id: "xemay",
    text: "Năm 1993, cứ 10 hộ chỉ khoảng 1 hộ có xe máy. Năm 2006, ở nông thôn đã gần một nửa số hộ có xe máy.",
    source: `${YL_NAME}; ${KSMS2006_NAME}`,
    url: KSMS2006,
    official: true,
  },
  {
    id: "dienthoai",
    text: "Năm 2006, ở nông thôn cứ 10 hộ chỉ khoảng 2 hộ có điện thoại, trong khi ở thành thị đã là 2 trên 3 hộ.",
    source: KSMS2006_NAME,
    url: KSMS2006,
    official: true,
  },
  {
    id: "nhakiencod",
    text: "Năm 2002, chỉ khoảng 1 trên 8 hộ có nhà kiên cố. Đến 2006 đã gần 1 trên 4 hộ.",
    source: KSMS2006_NAME,
    url: KSMS2006,
    official: true,
  },
  {
    id: "maytinh",
    text: "Năm 2006, ở nông thôn cứ 100 hộ chỉ khoảng 3 hộ có máy vi tính.",
    source: KSMS2006_NAME,
    url: KSMS2006,
    official: true,
  },
  {
    id: "chenhlech",
    text: "Đời sống đi lên, nhưng khoảng cách vẫn còn: năm 2006, thu nhập bình quân ở thành thị vẫn gấp khoảng 2 lần nông thôn, dù khoảng cách đang hẹp dần.",
    source: KSMS2006_NAME,
    url: KSMS2006,
    official: true,
  },
  {
    id: "bhyt",
    text: "Năm 1998, chỉ khoảng 16% người có thẻ bảo hiểm y tế hoặc thẻ khám chữa bệnh miễn phí. Năm 2004 là 38%.",
    source: YL_NAME,
    url: YL,
    official: false,
  },
  {
    id: "nuocsach",
    text: "Năm 1993, chỉ khoảng 1 trên 4 người được dùng nước sạch. Năm 2004 đã gần 6 trên 10 người.",
    source: YL_NAME,
    url: YL,
    official: false,
  },
  {
    id: "internet",
    text: "Cuối năm 2015, khoảng một nửa dân số Việt Nam đã dùng Internet.",
    source: "Bộ Thông tin và Truyền thông (qua báo Viettimes)",
    url: "https://viettimes.vn/52-dan-so-viet-nam-su-dung-internet-post15795.html",
    official: false,
  },
  {
    id: "gia1986",
    text: "Năm 1986, chỉ số giá bán lẻ trên thị trường tăng 587,2% so với năm 1985. Tiền để dành mất giá chỉ sau vài tháng.",
    source: "Báo Đại biểu Nhân dân, \u201cBài học từ cuộc cải cách giá – lương – tiền\u201d",
    url: "https://daibieunhandan.vn/bai-hoc-tu-cuoc-cai-cach-gia-luong-tien-10198804.html",
    official: false,
  },
  {
    id: "tangtruong",
    text: "GDP bình quân đầu người năm 1986 chỉ tăng 0,6%. Đến năm 1995 đã tăng 7,7% một năm.",
    source: "World Bank, World Development Indicators (NY.GDP.PCAP.KD.ZG)",
    url: "https://data.worldbank.org/indicator/NY.GDP.PCAP.KD.ZG?locations=VN",
    official: true,
  },
  {
    id: "gdp40nam",
    text: "Tính theo giá so sánh, GDP bình quân đầu người năm 2024 gấp khoảng 6,6 lần năm 1985.",
    source: "World Bank, World Development Indicators (NY.GDP.PCAP.KN)",
    url: "https://data.worldbank.org/indicator/NY.GDP.PCAP.KN?locations=VN",
    official: true,
  },
  {
    id: "lamphat2008",
    text: "Năm 2008, giá tiêu dùng tăng 23,1%. Năm 2011 lại tăng 18,7%.",
    source: "World Bank, World Development Indicators (FP.CPI.TOTL.ZG)",
    url: "https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG?locations=VN",
    official: true,
  },
  {
    id: "thunhap2021",
    text: "Năm 2021, thu nhập bình quân một người một tháng ở nông thôn là 3.486 nghìn đồng, ở thành thị là 5.388 nghìn đồng (giá hiện hành).",
    source: "Tổng cục Thống kê, Thông cáo báo chí Khảo sát mức sống dân cư 2021",
    url: "https://www.nso.gov.vn/wp-content/uploads/2022/06/Thong-cao-bao-chi-KSMS2021_28.6.2022final.pdf",
    official: true,
  },
];

export const HOI_DO_BY_ID: Record<string, HoiDo> = Object.fromEntries(HOI_DO.map((h) => [h.id, h]));
