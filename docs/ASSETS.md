# Danh sách hình ảnh

Bỏ ảnh vào đúng đường dẫn dưới đây là game tự dùng. Thiếu ảnh nào thì game tự vẽ hình giữ chỗ, không lỗi.
Tên file phải đúng y chang (chữ thường, không dấu, đuôi `.png`).

Nếu ảnh được tạo bằng AI, bật `IMAGES_ARE_AI = true` trong `src/config.ts` để màn mở đầu ghi chú điều này.

## Quy ước chung

- Phong cách: đồ họa phẳng retro, viền đậm, ít chi tiết, không gradient.
- Không chữ trong hình, không logo thương hiệu, không quốc huy hay biểu tượng chính trị, không người thật nhận diện được.
- Bảng màu gợi ý: kem `#F3E9D2`, mực `#2B2118`, đỏ son `#C8553D`, vàng đất `#E0A458`, xanh rêu `#588157`, xanh lam `#3D5A80`, nâu gỗ `#6B4F3A`.

## Asset SVG vẽ trong giao diện

Các hình dưới đây là SVG/CSS tự vẽ, không phải ảnh AI và không tải từ mạng:

- `src/ui/catch/ClassRoom.tsx`: cảnh đồng làng và phiên chợ, thúng tre, nón lá cho đáp án, đồng xu, biểu tượng ba vật phẩm, minh họa đồng ruộng trên thẻ sưu tầm và bục ba hạng đầu.
- `src/ui/minigames/Market.tsx`: hình gạo, muối, chai nước mắm/dầu, vải, bánh kẹo và đồ chơi tại từng sạp.

Màu của cảnh lấy từ biến thời kỳ trong `src/ui/styles.css`; nội dung và logic chơi không phụ thuộc hình minh họa.

## 1. Kỷ vật (32 ảnh, đã đủ) – `public/images/items/<id>.png`

Vuông 512×512, **nền trong suốt**, một đồ vật ở giữa, chừa lề khoảng 10%. Khung độ hiếm do game tự vẽ, ảnh không cần khung.

| File | Kỷ vật |
| --- | --- |
| tem_phieu.png | Sổ tem phiếu |
| radio.png | Đài bán dẫn |
| bao_gao.png | Bao gạo đầy |
| cap_sach.png | Cặp sách lớp Một |
| bong_den.png | Bóng đèn điện (sợi đốt) |
| xe_dap.png | Xe đạp |
| tivi.png | Tivi đen trắng có ăng-ten |
| cuc_gach.png | Điện thoại di động đời đầu, có phím bấm |
| the_bhyt.png | Thẻ bảo hiểm y tế (không chữ) |
| smartphone.png | Điện thoại thông minh |
| khau_trang.png | Khẩu trang y tế |
| giay_khen.png | Giấy khen trong khung (không chữ) |
| chung_chi_nghe.png | Chứng chỉ nghề cuộn tròn |
| bao_trung_tuyen.png | Phong bì giấy báo trúng tuyển |
| the_cong_nhan.png | Thẻ công nhân đeo dây |
| xe_may.png | Xe máy số đời đầu (không logo) |
| the_fdi.png | Thẻ nhân viên nhà máy |
| bien_hieu.png | Biển hiệu cửa hàng nhỏ (không chữ) |
| thiep_cuoi.png | Thiệp cưới đỏ |
| may_tinh.png | Máy vi tính để bàn màn hình CRT |
| so_to_hop_tac.png | Cuốn sổ thành viên |
| don_online.png | Hộp hàng đóng gói có tem gửi |
| qua_cua_em.png | Hộp quà nhỏ thắt nơ |
| so_chuyen.png | Cuốn sổ tay cũ, bìa vải |
| cay_dan.png | Cây đàn ghi-ta gỗ |
| cup_bong_da.png | Chiếc cúp nhỏ có quả bóng (không chữ) |
| tu_sach.png | Tủ sách gỗ nhỏ đầy sách |
| anh_gap_lai.png | Tấm ảnh chụp hai người bạn |
| anh_tot_nghiep.png | Tấm ảnh tốt nghiệp có mũ cử nhân |
| so_do.png | Cuốn sổ bìa đỏ (không chữ, không quốc huy) |
| thu_cam_on.png | Lá thư viết tay |
| huy_hieu.png | Ngọn đèn bão cũ (kỷ vật "Ngọn đèn soi đường"; giữ tên file cũ) |

## 2. Ảnh đại diện – `public/images/avatar/`

Dọc 256×304 (tỉ lệ khoảng 5:6), chân dung minh họa cùng phong cách với kỷ vật, không phải người thật.

| File | Dùng ở |
| --- | --- |
| player-nam.png | Hồ sơ cá nhân khi người chơi là nam |
| player-nu.png | Hồ sơ cá nhân khi người chơi là nữ |
| friend-nam.png | Người bạn cũ là nam (cảnh gặp lại 2022) |
| friend-nu.png | Người bạn cũ là nữ (cảnh gặp lại 2022) |

Game không còn hiển thị ngôi nhà nên không cần ảnh nhà.
