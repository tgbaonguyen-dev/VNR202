# Danh mục asset đang dùng

## Nguyên tắc lựa chọn

Asset được chọn theo bốn tiêu chí:

1. Cùng ngôn ngữ hình ảnh pixel art 16-bit, phù hợp một minigame ngắn và dễ nhận ra trên máy chiếu.
2. Gắn với làng quê, nông sản, nghề thủ công và quá trình thay đổi đời sống trong thời kỳ Đổi mới.
3. Không có logo, chữ trong ảnh, quốc huy, cờ hoặc biểu tượng chính trị.
4. Vật phẩm tương tác phải sáng và có hình khối rõ; nền được giảm sáng để không cạnh tranh với vật phẩm rơi.

Mọi ảnh tải bằng thành phần `Pix` đều có hình chữ thay thế nếu file lỗi. QR được tạo tại trình duyệt, không dùng ảnh tĩnh và không gửi dữ liệu tới dịch vụ ngoài.

## 1. Nền cảnh

Đường dẫn: `public/images/catch/nen/`.

| File | Nơi dùng | Lý do dùng |
| --- | --- | --- |
| `lang-que-moi.png` | Nền trang ngoài, vào phòng và chờ phòng | Con đường nằm giữa tạo chiều sâu; nhà và cây nằm hai bên nên khung nội dung ở giữa vẫn rõ. |
| `chieu-vang.png` | Màn hình host; đồng thời là một cảnh trong ván | Màu vàng ấm giúp màn chiếu khác biệt với màn người chơi và gợi không khí sinh hoạt cộng đồng. |
| `dong-lua.png` | Vòng nền sân chơi | Cánh đồng là hình ảnh cơ bản, dễ đọc và gắn trực tiếp với cơ chế hứng nông sản. |
| `song.png` | Vòng nền sân chơi | Thêm không gian sông nước, tránh toàn bộ ván chỉ có ruộng đồng. |
| `lang-1995.png` | Vòng nền sân chơi | Đại diện làng quê ở giai đoạn giữa hành trình Đổi mới. |
| `vuon-thanh-long.png` | Vòng nền sân chơi | Gắn với nông sản hàng hóa và trùng khớp một loại quả xuất hiện trong gameplay. |
| `lang-co-dien.png` | Vòng nền sân chơi | Cột điện và ánh đèn thể hiện thay đổi hạ tầng ở cấp làng mà không cần chữ giải thích. |
| `vuon-trai-cay.png` | Vòng nền sân chơi | Mở rộng cảnh quan sang kinh tế vườn và tạo mảng màu nhiệt đới. |
| `nong-thon-moi.png` | Vòng nền sân chơi | Đường, nhà và hạ tầng mới cho thấy diện mạo nông thôn thay đổi theo thời gian. |
| `ben-song.png` | Vòng nền sân chơi | Gợi giao thương nông sản bằng đường sông và bổ sung địa hình khác với đồng bằng. |
| `lang-nghe.png` | Vòng nền sân chơi | Kết nối trực tiếp với hệ thống “Thẻ làng nghề” mà người chơi thu thập. |
| `ven-khu-cong-nghiep.png` | Vòng nền sân chơi | Thể hiện sự chuyển tiếp giữa sản xuất nông nghiệp và công nghiệp ở vùng ven. |

Các PNG mới có vùng trong suốt. Giao diện đặt màu trời `#a9d0ec` phía sau để không xuất hiện mảng trống hoặc đen. Riêng ảnh trong sân chơi dùng `brightness(0.72)`, `saturate(0.78)` và `contrast(0.92)` để nông sản và buff giữ độ nổi bật.

## 2. Nhân vật

Đường dẫn: `public/images/catch/nhanvat/`.

| File | Vai trò | Lý do dùng |
| --- | --- | --- |
| `nam.png` | Avatar nam đứng yên | Cho người chơi tự chọn đại diện; hình nhỏ vẫn nhận ra trên bảng xếp hạng. |
| `nu.png` | Avatar nữ đứng yên | Tạo lựa chọn đại diện thứ hai với cùng kích thước và mức độ nổi bật. |
| `nam-chao.png` | Sprite sheet 9 frame chào | Làm màn vào phòng, chờ và kết quả bớt tĩnh. |
| `nu-chao.png` | Sprite sheet 9 frame chào | Giữ chuyển động tương đương giữa hai lựa chọn avatar. |

## 3. Nông sản trả lời

Đường dẫn: `public/images/catch/nongsan/`.

| File | Tên | Lý do dùng |
| --- | --- | --- |
| `lua.png` | Lúa | Biểu tượng nông nghiệp dễ nhận biết nhất, phù hợp chủ đề làng quê. |
| `caphe.png` | Cà phê | Đại diện cây công nghiệp và xuất khẩu. |
| `che.png` | Chè | Bổ sung cây lâu năm có hình dáng khác nhóm quả. |
| `caosu.png` | Cao su | Mở rộng nhóm cây công nghiệp, tránh chỉ dùng trái cây. |
| `thanhlong.png` | Thanh long | Màu và hình dáng nổi bật, dễ phân biệt khi rơi. |
| `ngo.png` | Ngô | Nông sản quen thuộc, tạo hình dài khác lúa và quả tròn. |
| `xoai.png` | Xoài | Mảng vàng rõ trên nền tối. |
| `vai.png` | Vải | Cụm đỏ nhỏ tạo biến thể hình khối. |
| `saurieng.png` | Sầu riêng | Viền gai dễ nhận diện ở tốc độ rơi nhanh. |
| `chuoi.png` | Chuối | Dáng cong đặc trưng, dễ đọc trên màn hình điện thoại. |
| `mia.png` | Mía | Bổ sung hình dài, thẳng và gắn với sản xuất nông nghiệp. |

Mỗi câu chỉ dùng ba loại. Engine loại các cặp dễ nhầm khỏi cùng một câu: lúa–ngô, xoài–chuối, cà phê–vải và sầu riêng–chè.

## 4. Buff và vật phẩm hỗ trợ

Đường dẫn: `public/images/catch/buff/`.

| File | Buff | Lý do hình ảnh và cơ chế |
| --- | --- | --- |
| `ro-to.png` | Thúng rộng | Hình chiếc rổ nói thẳng tác dụng tăng vùng hứng, không cần đọc mô tả. |
| `cham.png` | Chậm lại | Biểu tượng riêng giúp nhận ra vật phẩm điều chỉnh tốc độ rơi. |
| `x2.png` | Nhân đôi | Ký hiệu ×2 là cách nhanh nhất để truyền đạt nhân đôi điểm. |
| `namcham.png` | Nam châm | Ẩn dụ trực tiếp cho việc hút nông sản đúng về phía thúng. |
| `khien.png` | Khiên | Quy ước quen thuộc cho miễn điểm trừ trong 5 giây và chặn đổi điểm. |
| `thu-hoach.png` | Ảnh đại diện tĩnh của Thu hoạch | Dùng cho kiểm kê và fallback của buff đặc biệt. Khối vàng phát sáng khác rõ các buff thường. |
| `thu-hoach-0.png` đến `thu-hoach-4.png` | 5 frame Thu hoạch | Chạy lặp 8 FPS khi rơi. Chuyển động nguyên bản giúp vật phẩm hiếm nổi bật; khi bật giảm chuyển động chỉ dùng frame đầu. |

Buff Thu hoạch thu toàn bộ nông sản đang có trên sân, chuyển chúng thành lượt hứng đúng và không tạo điểm trừ. Asset này do người dùng cung cấp từ bộ `16-bit_pixel_art_game_effect_o`.

## 5. Thẻ làng nghề

Ảnh chạy thật nằm trong `public/images/catch/the/ghep/`. Đây là ảnh đã ghép hình và khung, giúp mọi thẻ có cùng tỷ lệ khi mở quà và khi nằm trong danh sách bên trái.

| File | Thẻ | Lý do dùng |
| --- | --- | --- |
| `non-la.png` | Nón lá | Biểu tượng thủ công quen thuộc; thẻ cơ bản cộng điểm mỗi quả đúng. |
| `dan-tre.png` | Đan tre | Liên hệ tự nhiên với chiếc thúng; tăng bề rộng thúng. |
| `chieu-coi.png` | Chiếu cói | Sản phẩm làng nghề quen thuộc; giảm mức phạt khi hứng sai. |
| `banh-trang.png` | Bánh tráng | Đại diện chế biến nông sản; làm đồ rơi chậm nhẹ. |
| `banh-chung.png` | Bánh chưng | Món ăn truyền thống dễ nhận biết; thưởng thêm khi thắng câu. |
| `banh-tet.png` | Bánh tét | Bổ sung nét văn hóa vùng miền; tăng tần suất thỏi vàng. |
| `guoc-moc.png` | Guốc mộc | Hình ảnh gắn với chuyển động; tăng tốc thúng. |
| `gom-men-lam.png` | Gốm men lam | Nghề thủ công có giá trị cao hơn nhóm thường; nhân điểm đúng. |
| `lua-to-tam.png` | Lụa tơ tằm | Gợi độ bền và kéo dài; tăng thời gian buff. |
| `tranh-dan-gian.png` | Tranh dân gian | Đại diện sản phẩm văn hóa; tăng thưởng câu hoàn hảo. |
| `hoa-sen.png` | Hoa sen | Hình mềm và hướng tâm phù hợp cơ chế hút nhẹ nông sản đúng. |
| `son-mai.png` | Sơn mài | Kỹ thuật thủ công cao, phù hợp độ hiếm cao và hệ số điểm lớn. |
| `kham-xa-cu.png` | Khảm xà cừ | Gợi lớp bảo vệ; miễn phạt quả sai đầu tiên mỗi câu. |
| `dan-bau.png` | Đàn bầu | Nhạc cụ đơn dây gợi chuỗi liên tục; tăng trần combo. |
| `long-den.png` | Lồng đèn | Gắn với quà và lễ hội; tăng tần suất hộp quà. |

Các file cùng tên ngay trong `public/images/catch/the/` là ảnh nguồn chưa ghép. Bản chạy không hiển thị trực tiếp chúng; test hiện dùng chúng để kiểm tra bộ thẻ nguồn có đủ. Ba file `khung/thuong.png`, `khung/hiem.png`, `khung/rat-hiem.png` là khung nguồn, không được tải riêng ở runtime vì đã nằm trong ảnh `the/ghep/`.

## 6. Khung và hộp quà

Đường dẫn: `public/images/catch/khung/`.

| File | Vai trò | Lý do dùng |
| --- | --- | --- |
| `hop-qua.png` | Vật phẩm hộp quà và hoạt cảnh mở quà | Hình hộp kín tạo cảm giác bất ngờ trước khi lật thẻ. |
| `mat-sau.png` | Mặt sau lúc lật thẻ | Che kết quả trong phần đầu animation và tạo nhịp công bố phần thưởng. |

## 7. Hiệu ứng phản hồi

Đường dẫn: `public/images/catch/fx/`.

| File | Vai trò | Lý do dùng |
| --- | --- | --- |
| `dong-ho.png` | Đồng hồ câu và đồng hồ ván | Cùng một ký hiệu thời gian ở mọi vị trí giúp giao diện nhất quán. |
| `dung.png` | Dấu đáp án đúng | Phản hồi tĩnh trong bảng đáp án. |
| `sai.png` | Dấu đáp án sai | Phản hồi tĩnh đối lập rõ với dấu đúng. |
| `dung-anim.png` | Sprite sheet 5 frame khi hứng đúng | Tạo phản hồi tức thì ngay tại vị trí thúng. |
| `sai-anim.png` | Sprite sheet 9 frame khi hứng sai | Làm lỗi dễ nhận ra mà không cần đọc số điểm. |
| `lua-chuoi-anim.png` | Sprite sheet 9 frame combo | Ngọn lửa biểu đạt chuỗi thắng đang tăng. |
| `lap-lanh.png` | Hiệu ứng khi nhặt buff | Dùng chung để người chơi nhận biết vừa kích hoạt vật phẩm hỗ trợ. |
| `thuong-diem.png` | Thỏi vàng | Hình phần thưởng điểm khác rõ nông sản và buff. |

`lua-chuoi.png` và `phao-hoa-anim.png` hiện không được bản chạy tải; chúng được giữ làm nguồn/dự phòng.

## 8. Thành phần giao diện

Đường dẫn: `public/images/catch/ui/`.

| File | Vai trò | Lý do dùng |
| --- | --- | --- |
| `thung.png` | Thúng đứng yên | Vật điều khiển chính, liên hệ trực tiếp cách chơi “hứng nông sản”. |
| `thung-hung-anim.png` | Sprite sheet 5 frame hứng đúng | Cho cảm giác vật phẩm thực sự rơi vào thúng. |
| `thung-nhun-anim.png` | Sprite sheet 5 frame hứng sai | Phản hồi va chạm sai bằng chuyển động khác hứng đúng. |
| `dong-xu.png` | Điểm và ô đổi điểm | Một ký hiệu chung cho giá trị điểm và hành động trao đổi điểm. |
| `hoa-sen-nho.png` | Trang trí số câu | Tạo điểm nhấn Việt Nam nhẹ, không chiếm vai trò biểu tượng chính trị. |
| `vuong-mien.png` | Đích đường đua và hạng nhất | Quy ước thị giác rõ cho người dẫn đầu và người thắng. |

## 9. Font và favicon

| File | Vai trò | Lý do dùng |
| --- | --- | --- |
| `public/fonts/tiny5-vietnamese.woff2` | Tiêu đề pixel có dấu Việt | Giữ phong cách game mà vẫn hiển thị đúng tiếng Việt. |
| `public/fonts/tiny5-latin-ext.woff2` | Ký tự Latin mở rộng của Tiny5 | Hỗ trợ tên và ký tự ngoài bộ tiếng Việt cơ bản. |
| `public/fonts/tiny5-latin.woff2` | Latin cơ bản của Tiny5 | Tách subset để trình duyệt chỉ tải phần cần thiết. |
| `public/fonts/vt323-vietnamese.woff2` | Nội dung pixel có dấu Việt | Dễ đọc hơn Tiny5 ở đoạn văn và kích thước nhỏ. |
| `public/fonts/vt323-latin-ext.woff2` | Ký tự Latin mở rộng của VT323 | Bảo đảm tên người chơi và nội dung mở rộng không thiếu glyph. |
| `public/fonts/vt323-latin.woff2` | Latin cơ bản của VT323 | Giảm dữ liệu tải nhờ cơ chế unicode-range. |
| `public/favicon.svg` | Biểu tượng tab trình duyệt | Giúp nhận ra trang game giữa nhiều tab; không tham gia gameplay. |

Hai font được lưu cục bộ để game không phụ thuộc mạng hoặc Google Fonts trong giờ học. Ghi chú trong `src/ui/fonts.css` xác định nguồn Google Fonts và giấy phép SIL OFL.

## 10. Hình được tạo bằng CSS hoặc tại runtime

Các thành phần sau không có file ảnh riêng:

- Mã QR phòng: thư viện `qrcode` sinh PNG data URL ngay trên trình duyệt từ link `#lop-<mã>`.
- Đường đua, bảng câu hỏi, bảng gỗ, viền giấy, bục xếp hạng và vòng khiên: CSS tạo hình.
- Ô đổi điểm: ghép hai `dong-xu.png` với chữ “ĐỔI” bằng HTML/CSS.
- Âm thanh: Web Audio trong `src/ui/catch/sound.ts`, không dùng file nhạc hoặc hiệu ứng âm thanh.

## 11. Asset có trong repo nhưng không thuộc bản game hiện tại

- `public/images/catch/_du-phong/`: file dự phòng, không được code tải.
- `public/images/items/`, `public/images/avatar/`, `public/images/house/`: thuộc chế độ mô phỏng cuộc đời cũ, hiện không được import hoặc hiển thị.
- Các ảnh nguồn `public/images/catch/the/*.png` và khung độ hiếm rời: phục vụ nguồn/test, không tải trực tiếp khi chơi.

## 12. Nguồn gốc đã biết và phần cần xác minh

- Tám nền mới (`lang-que-moi`, `vuon-thanh-long`, `lang-co-dien`, `vuon-trai-cay`, `nong-thon-moi`, `ben-song`, `lang-nghe`, `ven-khu-cong-nghiep`) do người dùng cung cấp từ thư mục PixelLab trong quá trình phát triển.
- Buff Thu hoạch và năm frame animation do người dùng cung cấp từ bộ `16-bit_pixel_art_game_effect_o`.
- Tiny5 và VT323: Google Fonts, giấy phép SIL OFL theo ghi chú của dự án.
- Nguồn hoặc giấy phép cụ thể của các asset cũ còn lại chưa được ghi trong repo. Nhóm cần xác nhận quyền sử dụng trước khi phát hành công khai; không nên suy đoán nguồn chỉ dựa vào phong cách hình ảnh.
