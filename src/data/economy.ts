// Số liệu kinh tế thật dùng để chỉnh nhịp tiền trong game.
// Mỗi dãy số có nguồn và link. Không thêm số nếu không có nguồn.

export const WB_GDP_PC = {
  source: "World Bank, World Development Indicators: GDP bình quân đầu người, giá so sánh (NY.GDP.PCAP.KN)",
  url: "https://data.worldbank.org/indicator/NY.GDP.PCAP.KN?locations=VN",
  /** Đồng/người/năm, giá so sánh. Năm 2025 chưa có số, game dùng số năm 2024. */
  values: {
    1985: 9332170.6, 1986: 9387988.0, 1987: 9528982.5, 1988: 9817657.9, 1989: 10326387.8,
    1990: 10628259.9, 1991: 11028243.2, 1992: 11741526.4, 1993: 12447577.6, 1994: 13305365.5,
    1995: 14332917.3, 1996: 15434577.8, 1997: 16452086.8, 1998: 17152561.1, 1999: 17738655.2,
    2000: 18729878.7, 2001: 19681806.3, 2002: 20712577.3, 2003: 21921272.4, 2004: 23345889.3,
    2005: 24875838.1, 2006: 26262018.7, 2007: 27641381.9, 2008: 28677487.6, 2009: 29776516.3,
    2010: 31328550.8, 2011: 32955911.6, 2012: 34365207.0, 2013: 35848061.8, 2014: 37689878.2,
    2015: 39826504.1, 2016: 41958923.1, 2017: 44316124.5, 2018: 47099601.8, 2019: 50078486.2,
    2020: 51037897.0, 2021: 51888451.8, 2022: 55897197.4, 2023: 58287452.8, 2024: 61998017.3,
  } as Record<number, number>,
};

export const WB_CPI = {
  source: "World Bank, World Development Indicators: Lạm phát giá tiêu dùng, % mỗi năm (FP.CPI.TOTL.ZG)",
  url: "https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG?locations=VN",
  /** % mỗi năm. World Bank có số cho Việt Nam từ 1996. */
  values: {
    1996: 5.7, 1997: 3.2, 1998: 7.3, 1999: 4.1, 2000: -1.7, 2001: -0.4, 2002: 3.8, 2003: 3.2,
    2004: 7.8, 2005: 8.3, 2006: 7.4, 2007: 8.3, 2008: 23.1, 2009: 6.7, 2010: 9.2, 2011: 18.7,
    2012: 9.1, 2013: 6.6, 2014: 4.1, 2015: 0.6, 2016: 2.7, 2017: 3.5, 2018: 3.5, 2019: 2.8,
    2020: 3.2, 2021: 1.8, 2022: 3.2, 2023: 3.3, 2024: 3.6,
  } as Record<number, number>,
};

/** Chỉ số giá bán lẻ năm 1986 tăng 587,2% so với 1985 (báo Đại biểu Nhân dân) */
export const RETAIL_1986 = {
  percent: 587.2,
  source: "Báo Đại biểu Nhân dân, “Bài học từ cuộc cải cách giá – lương – tiền”",
  url: "https://daibieunhandan.vn/bai-hoc-tu-cuoc-cai-cach-gia-luong-tien-10198804.html",
};

/** Lạm phát một năm (%), nếu có nguồn */
export function inflationOf(year: number): number | undefined {
  if (year === 1986) return RETAIL_1986.percent;
  return WB_CPI.values[year];
}
