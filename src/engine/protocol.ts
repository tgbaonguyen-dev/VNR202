// Tin nhắn giữa trình duyệt và máy chủ (chế độ Hứng đáp án).
import type { Question } from "./catch";
import type { GameConfig } from "./catchConfig";

export type Avatar = "nam" | "nu";

export type ClientMsg =
  | { t: "host"; adminKey: string }
  | { t: "addBots"; count: number }
  | { t: "join"; code: string; name: string; avatar: Avatar; playerId?: string }
  | { t: "start" }
  | { t: "end" }
  /** Kết quả một câu: số quả đúng, sai, thỏi vàng; mult là hệ số buff (×2) */
  | { t: "answer"; q: number; good: number; bad: number; mult: number; gold: number }
  /** Hứng được hộp quà */
  | { t: "gift" }
  /** Hứng được ô đổi điểm */
  | { t: "swap" }
  /** Bật khiên (chặn bị đổi điểm) */
  | { t: "shield"; sec: number }
  /** Hết thời gian chơi của mình */
  | { t: "done" };

export interface PlayerView {
  id: string;
  name: string;
  avatar: Avatar;
  points: number;
  cards: string[];
  correct: number;
  answered: number;
  online: boolean;
  done: boolean;
}

export interface RoomView {
  code: string;
  phase: "lobby" | "playing" | "ended";
  /** Lúc bắt đầu (ms) và thời gian chơi mỗi người (giây) */
  startedAt: number;
  playSec: number;
  raceBar: boolean;
  feed: string[];
  players: PlayerView[];
}

export type ServerMsg =
  | { t: "hosted"; code: string }
  | { t: "joined"; code: string; playerId: string }
  | { t: "room"; room: RoomView }
  /** Gửi khi bắt đầu (và khi vào lại giữa ván): bộ câu hỏi và cấu hình của phòng */
  | { t: "setup"; questions: Question[]; config: GameConfig }
  | { t: "answered"; points: number; combo: number }
  /** Thẻ mở được; duplicate > 0 nghĩa là thẻ trùng, đổi thành số điểm này */
  | { t: "card"; cardId: string; duplicate: number }
  /** Kết quả đổi điểm của mình: with = người bị đổi, blocked = họ có khiên, top = mình đang dẫn đầu */
  | { t: "swapped"; with: string; before: number; after: number; blocked?: boolean; top?: boolean }
  /** Mình bị người khác đổi điểm */
  | { t: "swappedBy"; by: string; before: number; after: number }
  | { t: "error"; msg: string };
