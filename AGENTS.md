# AGENTS.md

Hướng dẫn cho mọi AI agent (Codex, Claude Code) làm việc trong repo này. Đọc hết trước khi sửa code.

## Dự án

Minigame trình duyệt cho môn VNR202, **chưa có tên** (giữ chỗ trong `src/config.ts`, không tự đặt tên). Người chơi sinh năm 1985 ở một làng quê Việt Nam và sống đến 2025. Nguyên tắc cốt lõi: **Đổi mới mở ra cánh cửa, bước qua hay không là lựa chọn của người chơi.**

Đọc thêm: `docs/HANDOFF.md` (bàn giao, đọc đầu tiên), `docs/SRS.md` (yêu cầu), `docs/PLAN.md` (việc còn lại), `docs/ASSETS.md` (ảnh).

## Stack

Vite + React 18 + TypeScript, CSS thuần với biến màu theo thời kỳ (`src/ui/styles.css`). Chế độ mô phỏng cuộc đời chạy hoàn toàn trên trình duyệt. Chế độ "Hứng đáp án" chơi cả lớp có **một máy chủ nhỏ** (`server/index.ts`, Node + WebSocket) giữ phòng chơi trong bộ nhớ. **Không cơ sở dữ liệu, không gọi API ngoài, không lưu dữ liệu người chơi.**

## Lệnh

```
npm install
npm run dev
npm test        # bắt buộc qua trước khi báo xong
npm run build   # bắt buộc qua trước khi báo xong
npm run sim     # chạy khi sửa engine hoặc dữ liệu
npm run dev:server  # máy chủ Hứng đáp án khi dev (cổng 8787, Vite tự chuyển /ws sang)
npm start       # chạy máy chủ thật: phục vụ dist/ và WebSocket /ws
```

## Cấu trúc

| Đường dẫn | Nội dung |
| --- | --- |
| `src/types.ts` | Kiểu dữ liệu chung. Đổi thì báo nhóm. |
| `src/config.ts` | Tên game, thiết lập, ghi chú minh bạch, câu thảo luận |
| `src/data/` | Nội dung: `history.ts` (mốc), `hoiDo.ts` (số liệu có nguồn), `items.ts`, `turningPoints.ts` (ngã rẽ, chi tiêu), `lifeEvents.ts`, `people.ts` (hoàn cảnh, dồn sức, bạn cũ, suy ngẫm) |
| `src/engine/engine.ts` | Luật chơi, hàm thuần, không import React. Chạy được trong Node để giả lập. |
| `src/ui/` | Giao diện React. Chỉ đọc state và gọi hàm engine, không tự tính luật chơi. |
| `public/images/` | Ảnh do nhóm tạo, xem `docs/ASSETS.md` |
| `scripts/simulate.ts` | Giả lập cân bằng |
| `tests/` | Vitest |

## Luật nội dung (bắt buộc)

1. **Không tự thêm số liệu.** Số liệu thật chỉ nằm trong `src/data/hoiDo.ts`, mỗi mục có `source` và `url`. Không có nguồn thì không thêm.
2. **Mốc lịch sử chỉ ghi năm**, nội dung khớp database Mốc lịch sử trên Notion. Không tự sửa câu chữ mốc.
3. **Không nội dung đau buồn**: không mất người thân, bệnh nặng, tai nạn. Trở ngại nhẹ phải có `follow` vượt qua.
4. **Không xếp hạng, không so giàu nghèo.** Tiền chỉ hiện 3 nấc; tấm thẻ cuối không nhắc tiền.
5. **Không có lựa chọn tốt nhất.** Mỗi lựa chọn mạnh ở một mặt, đánh đổi ở mặt khác.
5b. **Không có lựa chọn cho vui.** Mỗi lựa chọn phải để lại hệ quả về sau: `echo` (thẻ nhắc lại), `roll`, `extra`, `selfLine`, hoặc `marks` được dùng ở chỗ khác (điều kiện kỷ vật, sự kiện, ngã rẽ). Test `mọi lựa chọn mở được đều để lại hệ quả về sau` sẽ báo lỗi nếu thiếu.
6. Độ hiếm kỷ vật đến từ lựa chọn, không random.
7. Khóa lựa chọn chỉ dùng lý do ở cấp làng ("Làng chưa có máy tính"), không đưa ra nhận định lịch sử cấp quốc gia mà không có nguồn.
8. Văn bản: tiếng Việt, câu ngắn, giọng ấm, không khẩu hiệu.

## Luật giao diện

- Bố cục giữ nguyên qua các thời kỳ, chỉ đổi biến màu (`era-e85`, `era-e90`, `era-e00`, `era-e10`).
- Khung kỷ vật 3 độ hiếm giữ nguyên ở mọi thời kỳ.
- Nhãn "Nhờ Đổi mới" (vàng, chữ tối) và "Nhờ lựa chọn của bạn" (tím đậm, chữ trắng) phải khác nhau cả độ sáng.
- Nút tối thiểu 44px, có viền focus, tôn trọng `prefers-reduced-motion`.
- Không logo, không biểu tượng chính trị, không emoji.
- Ảnh nào cũng phải có fallback (dùng `onError` như `ItemSlot`, `HouseScene`, `Avatar`).

## Khi xong một việc

Ghi: đã làm gì, file nào; mã yêu cầu trong SRS; có đổi `src/types.ts` không; kết quả `npm test` và `npm run sim` nếu có.
