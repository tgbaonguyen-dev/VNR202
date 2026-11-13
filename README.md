# Gặt Dấu Đổi Mới — VNR202

Minigame chơi cả lớp về các mốc lịch sử của công cuộc Đổi mới. Mỗi đáp án là
một loại nông sản; người chơi điều khiển thúng để hứng đúng loại, nhận vật phẩm
và mở thẻ làng nghề.

Ứng dụng gồm game Gặt Dấu Đổi Mới, màn hình chiếu và trang quản trị. Máy chủ Node +
WebSocket giữ phòng trong bộ nhớ; không có tài khoản, cơ sở dữ liệu hay dữ liệu
người chơi lâu dài.

## Chạy thử

```sh
npm install
npm run dev:server
npm run dev
```

Vite chạy ở `http://localhost:5173` và chuyển tiếp WebSocket sang máy chủ ở cổng
8787. Bản production chạy cả trang web và WebSocket bằng `npm start` sau khi
build.

## Địa chỉ

- `/`: vào phòng với tư cách người chơi.
- `/#lop`: vào thẳng màn người chơi.
- `/#lop-1234`: vào màn người chơi với mã phòng điền sẵn.
- `/#admin`: tạo phòng trên màn hình chiếu, cấu hình game, soạn câu hỏi và xem
  các phòng đang hoạt động.

Trang quản trị dùng mật khẩu từ biến môi trường `ADMIN_PASSWORD`. Máy chủ cũng
kiểm tra mật khẩu khi nhận lệnh tạo phòng; người chơi thường không thể tự mở
phòng qua WebSocket. Cấu hình và câu hỏi được lưu trong `DATA_DIR`, mặc định là
`./data`.

## Lệnh

| Lệnh | Việc |
| --- | --- |
| `npm run dev` | Chạy giao diện để phát triển |
| `npm run dev:server` | Chạy máy chủ và tự tải lại khi sửa |
| `npm run build` | Kiểm tra kiểu rồi build ra `dist/` |
| `npm start` | Phục vụ `dist/`, API quản trị và WebSocket `/ws` |
| `npm test` | Chạy test engine và dữ liệu |

## Deploy

Vercel không phù hợp vì game cần kết nối WebSocket lâu dài. Repo có sẵn
`render.yaml` và `Dockerfile` để deploy trên Render, Railway, Fly.io hoặc VPS.
Khi deploy cần đặt `ADMIN_PASSWORD`; nếu muốn giữ cấu hình qua lần deploy, gắn
ổ đĩa bền vào đường dẫn `DATA_DIR`.

Chi tiết bàn giao và deploy nằm trong `docs/HANDOFF.md`.
