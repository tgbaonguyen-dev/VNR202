# PLAN

Hướng: trang tĩnh trên Vercel. Code lõi và giao diện đã chạy được trọn một đời (xem cột Trạng thái trong `SRS.md`).

## Việc còn lại

### Nhóm
- [ ] Đặt tên game: `src/config.ts` và `index.html`.
- [ ] Tạo ảnh theo `docs/ASSETS.md`, bỏ vào `public/images/`. Nếu ảnh tạo bằng AI thì bật `IMAGES_ARE_AI`.
- [ ] Đối chiếu từng mốc trong `src/data/history.ts` với giáo trình (database Mốc lịch sử trên Notion). Sửa câu chữ cho khớp.
- [ ] Soát `src/data/hoiDo.ts`: mẩu nào chưa vững nguồn thì bỏ hoặc bật `officialOnly`.
- [ ] Soát chính tả, giọng văn trong `lifeEvents.ts`, `items.ts`, `turningPoints.ts`.
- [ ] Deploy Vercel, tạo QR.
- [ ] Chơi thử 5 hoàn cảnh trên laptop, máy chiếu, 2 điện thoại.
- [ ] Hoàn thiện hồ sơ AI Usage.

### Agent (nếu còn thời gian)
- [ ] Hiệu ứng chuyển kênh 1 giây khi sang thời kỳ mới.
- [ ] Ngôi nhà dạng ảnh tách lớp (nếu nhóm tạo được ảnh từng lớp).
- [ ] Thêm sự kiện đời thường cho đa dạng (đúng luật nội dung trong `AGENTS.md`).

## Cắt giảm khi trễ

1. Bỏ bảng màu thời kỳ (`features.eraTheme = false`).
2. Bỏ suy ngẫm tuổi 18 và 30 (`features.reflections = false`; tuổi 40 vẫn còn).
3. Tắt Hồi đó trích lại (`features.officialOnly = true`).

## Quy ước git

- `main` luôn deploy được; làm trên `feat/<phần>` rồi merge.
- Commit: `feat`, `fix`, `data`, `asset`, `docs`, `chore`. Sửa số liệu hay mốc dùng `data` và ghi nguồn trong mô tả.
