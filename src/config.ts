import type { Settings } from "./types";

/**
 * Tên game: nhóm điền sau. Để chuỗi rỗng thì màn mở đầu hiện chữ giữ chỗ.
 * Nhớ sửa cả thẻ <title> trong index.html.
 */
export const GAME_TITLE = "Gặt Dấu Đổi Mới";
export const GAME_TITLE_PLACEHOLDER = "[Tên game]";

/** Bật nếu hình ảnh trong public/images được tạo bằng AI. */
export const IMAGES_ARE_AI = true;

/**
 * Thiết lập mặc định. Không có máy chủ: muốn đổi thì sửa ở đây,
 * push lên git, Vercel tự deploy lại.
 */
export const DEFAULT_SETTINGS: Settings = {
  secondsPerYear: 10,
  defaultSpeed: 1,
  maxFeaturedCards: 2,
  holdSeconds: 2.5,
  electricityYear: 1995,
  features: {
    focus: true,
    reflections: true,
    eraTheme: true,
    hoiDo: true,
    officialOnly: false,
    minigames: true,
  },
};

export const START_YEAR = 1985;
export const END_YEAR = 2025;

export const DISCUSSION_QUESTION =
  "Cùng sống qua một công cuộc Đổi mới, đời sống của mỗi người đã đổi khác thế nào, và vì sao mỗi người lại tốt lên theo một cách riêng?";

export const TRANSPARENCY_NOTE =
  "Nhân vật, làng quê và các sự kiện đời thường là hư cấu. Bốn chỉ số và túi tiền là thiết kế trò chơi. Mốc lịch sử và các mẩu \u201cHồi đó…\u201d là thông tin thật, có ghi nguồn. Game được thiết kế với sự hỗ trợ của AI. Ý tưởng thể loại lấy cảm hứng từ 1 in 8 Billion (1in8b.life).";
