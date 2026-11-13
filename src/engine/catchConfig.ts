// Cấu hình chế độ "Hứng đáp án". Trang quản trị sửa được tất cả, máy chủ lưu vào data/config.json.
// Mỗi phòng chụp lại cấu hình lúc bấm Bắt đầu, sửa giữa chừng không ảnh hưởng phòng đang chơi.

export interface GameConfig {
  /** Thời gian chơi của mỗi người (giây). Mở hộp quà, lật thẻ không tính vào. */
  playSec: number;
  /** Giây đọc câu hỏi trước khi đồ rơi */
  readySec: number;
  /** Giây hứng của mỗi câu */
  roundSec: number;
  /** Giây báo đáp án */
  revealSec: number;

  /** Tốc độ rơi gốc (% chiều cao sân mỗi giây) và mức tăng mỗi câu */
  fallSpeed: number;
  fallAccel: number;
  /** Khoảng cách giữa hai quả rơi (giây) */
  cropInterval: number;
  /** Tỉ lệ quả rơi ra là đáp án đúng (0..1) */
  correctShare: number;
  /** Khoảng cách ngang tối thiểu giữa các đồ mới rơi (% bề ngang) */
  minGap: number;
  /** Bề rộng thúng (% bề ngang sân) và tốc độ chạy */
  basketWidth: number;
  basketSpeed: number;

  /** Xác suất mỗi câu có hộp quà */
  giftChance: number;
  /** Mỗi lượt đồ phụ: xác suất ra thỏi vàng, buff, ô đổi điểm */
  goldChance: number;
  buffChance: number;
  swapChance: number;
  /** Khoảng cách giữa các lượt đồ phụ (giây) */
  extraInterval: number;

  goodPoints: number;
  badPoints: number;
  perfectBonus: number;
  goldPoints: number;
  comboMax: number;

  /** Bật ô đổi điểm với người xếp ngay trên */
  swapEnabled: boolean;
  /** Hiện thanh đua */
  raceBar: boolean;
  /** Nhạc nền mặc định bật */
  music: boolean;
  /** Dùng bộ câu hỏi nhóm soạn (nếu có), thay vì tự sinh từ mốc lịch sử */
  customQuestions: boolean;
  maxPlayers: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  playSec: 300,
  readySec: 4,
  roundSec: 12,
  revealSec: 2.6,
  fallSpeed: 20,
  fallAccel: 0.8,
  cropInterval: 0.85,
  correctShare: 0.5,
  minGap: 16,
  basketWidth: 10,
  basketSpeed: 110,
  giftChance: 0.4,
  goldChance: 0.18,
  buffChance: 0.45,
  swapChance: 0.1,
  extraInterval: 3.5,
  goodPoints: 20,
  badPoints: 10,
  perfectBonus: 50,
  goldPoints: 50,
  comboMax: 3,
  swapEnabled: true,
  raceBar: true,
  music: true,
  customQuestions: true,
  maxPlayers: 80,
};

/** Giới hạn từng mục, để cấu hình sai không làm hỏng game. Dùng cho cả kiểm tra và giao diện quản trị. */
export const CONFIG_LIMITS: Record<keyof GameConfig, { min?: number; max?: number; step?: number; label: string; group: string }> = {
  playSec: { min: 60, max: 1800, step: 30, label: "Thời gian chơi mỗi người (giây)", group: "Thời gian" },
  readySec: { min: 1, max: 15, step: 0.5, label: "Đọc câu hỏi (giây)", group: "Thời gian" },
  roundSec: { min: 4, max: 40, step: 1, label: "Hứng mỗi câu (giây)", group: "Thời gian" },
  revealSec: { min: 1, max: 10, step: 0.2, label: "Báo đáp án (giây)", group: "Thời gian" },
  fallSpeed: { min: 5, max: 60, step: 1, label: "Tốc độ rơi gốc", group: "Rơi và thúng" },
  fallAccel: { min: 0, max: 5, step: 0.1, label: "Tăng tốc mỗi câu", group: "Rơi và thúng" },
  cropInterval: { min: 0.2, max: 3, step: 0.05, label: "Khoảng cách giữa hai quả (giây)", group: "Rơi và thúng" },
  correctShare: { min: 0.2, max: 0.9, step: 0.05, label: "Tỉ lệ quả đúng (0–1)", group: "Rơi và thúng" },
  minGap: { min: 0, max: 40, step: 1, label: "Khoảng cách ngang tối thiểu (%)", group: "Rơi và thúng" },
  basketWidth: { min: 5, max: 30, step: 1, label: "Bề rộng thúng (%)", group: "Rơi và thúng" },
  basketSpeed: { min: 40, max: 300, step: 5, label: "Tốc độ thúng", group: "Rơi và thúng" },
  giftChance: { min: 0, max: 1, step: 0.05, label: "Xác suất hộp quà mỗi câu", group: "Vật phẩm" },
  goldChance: { min: 0, max: 1, step: 0.01, label: "Xác suất thỏi vàng", group: "Vật phẩm" },
  buffChance: { min: 0, max: 1, step: 0.01, label: "Xác suất buff", group: "Vật phẩm" },
  swapChance: { min: 0, max: 1, step: 0.01, label: "Xác suất ô đổi điểm", group: "Vật phẩm" },
  extraInterval: { min: 1, max: 15, step: 0.5, label: "Khoảng cách đồ phụ (giây)", group: "Vật phẩm" },
  goodPoints: { min: 1, max: 200, step: 1, label: "Điểm mỗi quả đúng", group: "Điểm" },
  badPoints: { min: 0, max: 200, step: 1, label: "Điểm trừ mỗi quả sai", group: "Điểm" },
  perfectBonus: { min: 0, max: 500, step: 5, label: "Thưởng hứng đủ", group: "Điểm" },
  goldPoints: { min: 0, max: 500, step: 5, label: "Điểm thỏi vàng", group: "Điểm" },
  comboMax: { min: 1, max: 6, step: 1, label: "Chuỗi nhân tối đa", group: "Điểm" },
  swapEnabled: { label: "Bật ô đổi điểm", group: "Tính năng" },
  raceBar: { label: "Hiện thanh đua", group: "Tính năng" },
  music: { label: "Nhạc nền mặc định bật", group: "Tính năng" },
  customQuestions: { label: "Dùng câu hỏi nhóm soạn", group: "Tính năng" },
  maxPlayers: { min: 2, max: 200, step: 1, label: "Số người tối đa mỗi phòng", group: "Tính năng" },
};

/** Gộp cấu hình nhận được với mặc định, kẹp mọi số vào giới hạn */
export function sanitizeConfig(input: unknown): GameConfig {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out = { ...DEFAULT_CONFIG } as Record<string, number | boolean>;
  for (const key of Object.keys(DEFAULT_CONFIG) as (keyof GameConfig)[]) {
    const def = DEFAULT_CONFIG[key];
    const v = src[key];
    if (typeof def === "boolean") out[key] = typeof v === "boolean" ? v : def;
    else {
      const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
      const lim = CONFIG_LIMITS[key];
      out[key] = Number.isFinite(n) ? Math.min(lim.max ?? n, Math.max(lim.min ?? n, n)) : def;
    }
  }
  return out as unknown as GameConfig;
}

// ---------------------------------------------------------------- câu hỏi nhóm soạn

export interface CustomQuestion {
  id: string;
  cau_hoi: string;
  dung: string;
  sai_1: string;
  sai_2: string;
  giai_thich: string;
  nguon: string;
  url?: string;
  do_kho?: "de" | "vua" | "kho";
}

export const QUESTION_LIMITS = { prompt: 120, answer: 40, explain: 220 };

/** Kiểm tra một câu hỏi; trả về danh sách lỗi (rỗng là hợp lệ) */
export function validateQuestion(q: Partial<CustomQuestion>): string[] {
  const err: string[] = [];
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  if (!s(q.id)) err.push("thiếu mã");
  if (!s(q.cau_hoi)) err.push("thiếu câu hỏi");
  else if (s(q.cau_hoi).length > QUESTION_LIMITS.prompt) err.push(`câu hỏi dài quá ${QUESTION_LIMITS.prompt} ký tự`);
  const ans = [s(q.dung), s(q.sai_1), s(q.sai_2)];
  if (ans.some((a) => !a)) err.push("thiếu đáp án");
  if (ans.some((a) => a.length > QUESTION_LIMITS.answer)) err.push(`đáp án dài quá ${QUESTION_LIMITS.answer} ký tự`);
  if (new Set(ans.map((a) => a.toLowerCase())).size < 3) err.push("3 đáp án phải khác nhau");
  if (!s(q.giai_thich)) err.push("thiếu giải thích");
  if (!s(q.nguon)) err.push("thiếu nguồn");
  return err;
}

export function sanitizeQuestions(input: unknown): { ok: CustomQuestion[]; errors: string[] } {
  const list = Array.isArray(input) ? input : [];
  const ok: CustomQuestion[] = [];
  const errors: string[] = [];
  const ids = new Set<string>();
  list.slice(0, 500).forEach((raw, i) => {
    const q = (raw ?? {}) as Partial<CustomQuestion>;
    const e = validateQuestion(q);
    const id = String(q.id ?? "").trim();
    if (ids.has(id)) e.push("trùng mã");
    if (e.length) errors.push(`Dòng ${i + 1} (${id || "không mã"}): ${e.join(", ")}`);
    else {
      ids.add(id);
      const t = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);
      ok.push({
        id,
        cau_hoi: t(q.cau_hoi, QUESTION_LIMITS.prompt),
        dung: t(q.dung, QUESTION_LIMITS.answer),
        sai_1: t(q.sai_1, QUESTION_LIMITS.answer),
        sai_2: t(q.sai_2, QUESTION_LIMITS.answer),
        giai_thich: t(q.giai_thich, QUESTION_LIMITS.explain),
        nguon: t(q.nguon, 200),
        url: t(q.url, 300) || undefined,
        do_kho: q.do_kho === "de" || q.do_kho === "kho" ? q.do_kho : "vua",
      });
    }
  });
  return { ok, errors };
}
