# Bàn giao dự án game VNR202

> **Phạm vi hiện tại (14/11/2026):** sản phẩm mang tên **Gặt Dấu Đổi Mới**
> và chỉ còn chế độ chơi Hứng đáp án.
> Trang gốc đi thẳng vào màn chọn vai; phần mô phỏng cuộc đời không còn được
> import, build hoặc hiển thị. Các file cũ vẫn được giữ tạm trong source để
> tránh xóa nhầm dữ liệu lịch sử mà game hứng đang sử dụng.
> Người chơi chỉ có thể vào phòng. Quyền tạo phòng nằm trong `/#admin` và được
> máy chủ kiểm tra bằng `ADMIN_PASSWORD`.

Cập nhật: 13/11/2026. Người nhận: nhóm VNR202 và các AI agent (Codex, Claude Code).
Đọc file này trước, rồi đến `AGENTS.md`, `docs/SRS.md`, `docs/ASSETS.md`.

## 1. Tóm tắt trong 30 giây

Minigame mô phỏng cuộc đời trên trình duyệt, chưa đặt tên. Người chơi sinh năm 1985 ở một làng quê Việt Nam, sống đến 40 tuổi (2025), đi qua các mốc Đổi mới.

Code đã chạy trọn một đời, có test, có giả lập cân bằng. Bố cục 3 cột theo kiểu 1in8b.life, viết mới hoàn toàn.

**Việc còn lại chủ yếu là nội dung và ảnh**: đối chiếu mốc lịch sử với giáo trình, tạo nốt ảnh, đặt tên, deploy.

## 2. Chạy và deploy

```
npm install
npm run dev        # http://localhost:5173
npm test           # 8 test, phải qua hết
npm run sim        # giả lập 500 đời, xem cân bằng
npm run build      # kiểm tra kiểu + build ra dist/
```

**Deploy:** push lên GitHub → vercel.com → Add New → Project → chọn repo → Deploy. Vercel tự nhận Vite, không cần cấu hình. Không có máy chủ, không cơ sở dữ liệu, không biến môi trường.

## 3. Những quyết định đã chốt (đừng đổi nếu chưa bàn với nhóm)

| Quyết định | Lý do |
| --- | --- |
| Chỉ nói về thành tựu, không có trục "kinh nghiệm" | Giữ trọng tâm, đủ cho 10 phút trên lớp |
| Không chọn vùng miền; ai cũng sinh ở "một làng quê Việt Nam", khác nhau ở 5 hoàn cảnh gia đình | Tránh so sánh vùng miền |
| Trang tĩnh trên Vercel, không admin, không phòng chơi | Không có MC nên màn hình tổng hợp không ai dùng; bớt điểm hỏng |
| Không nội dung đau buồn (không ai mất, không bệnh nặng, không tai nạn); trở ngại nhẹ luôn có sự kiện vượt qua | Môn học, không khí lớp |
| Có tiền cụ thể (lương, nợ, tài sản ròng) nhưng ghi rõ "quy theo giá 2025, ước lượng minh họa" | Người chơi muốn chi tiết như 1in8b; tránh hiểu nhầm là số liệu thật |
| Tấm thẻ cuối không ghi tiền | Thảo luận không thành so giàu nghèo |
| Mọi lựa chọn phải có hệ quả về sau; có test kiểm tra | Yêu cầu của nhóm: không có lựa chọn cho vui |
| Không dùng code của 1in8b hay repo born-somewhere | Nguồn gốc bản quyền chưa rõ; nội dung lõi khác (thống kê tử vong, tiếng Trung) |
| Bỏ hiển thị ngôi nhà | Ghi chép cuộc đời đủ rõ; thay đổi trong nhà thành dòng ghi chép có nhãn "Nhờ Đổi mới" / "Nhờ lựa chọn của bạn" |
| Mốc lịch sử chỉ ghi năm | Tránh sai ngày tháng |

## 4. Trạng thái từng phần

| Phần | Trạng thái | Ghi chú |
| --- | --- | --- |
| Engine (vòng năm, chỉ số, ngã rẽ, kỷ vật, bạn cũ, tài chính) | Xong | `src/engine/engine.ts`, `src/engine/life.ts` |
| Ngã rẽ | Xong | 9 ngã rẽ chung, 5 lựa chọn riêng theo hoàn cảnh (2005), 5 lựa chọn đời tư có điều kiện |
| Kỷ vật | Xong (32) | Đủ 32 ảnh |
| Giao diện 3 cột | Xong | Đã thử 1440px, 1366px, 390px (điện thoại: dùng được, chưa đẹp) |
| Tấm thẻ cuối + lưu PNG | Xong | Có biểu đồ quỹ đạo và bản đồ cuộc đời |
| Mốc lịch sử | **Chưa đối chiếu giáo trình** | Đã có văn bản gốc cho 12/21 mốc, xem mục 6 |
| Mẩu "Hồi đó…" | Dùng được, có ghi nguồn | 9/15 mẩu là số trích lại, xem mục 6 |
| Ảnh | Thiếu | Xem mục 7 |
| Tên game | **Gặt Dấu Đổi Mới** | `GAME_TITLE` trong `src/config.ts` và `<title>` trong `index.html` |
| Deploy | Chưa | Mục 2 |

Kết quả giả lập gần nhất (600 đời):
- **5 hoàn cảnh cân bằng**: chỉ số cuối gần nhau, không hoàn cảnh nào luôn thấp nhất.
- **Độ đa dạng**: khoảng 400 con đường đời khác nhau trên 600 đời.
- **Kỷ vật Rất hiếm**: rơi trong khoảng 2–35%.
- **Tiền ở tuổi 40**: lương 9–24 triệu/tháng; tài sản ròng trung vị khoảng 800 triệu; khoảng 18% còn nợ.

### Cập nhật 13/11/2026: kéo dài và dày sự kiện
- Nhịp: `secondsPerYear` 5 → 10, `defaultSpeed` 2 → 1. Một đời khoảng 7–9 phút (trước khoảng 2 phút).
- Engine: tối đa 2 sự kiện ngẫu nhiên mỗi năm (trước là 1), xác suất mặc định 0.3 → 0.4.
- `lifeEvents.ts`: thêm 44 sự kiện đời thường (tuổi thơ, mới lớn, trưởng thành), trở ngại nhẹ đều có `follow`.
- `turningPoints.ts`: thêm 5 lựa chọn nhanh `tp1991`, `tp1998`, `tp2002`, `tp2016`, `tp2019`, mỗi lựa chọn có `echo`.
- `strengthOf()`: cập nhật `base` theo giả lập mới.

### Cập nhật 13/11/2026 (lần 2): chi tiết và chiều sâu
- Mỗi năm có một dòng **"Làng năm ấy"** (thẻ loại `scene`, mới), cho thấy làng đổi dần qua từng giai đoạn. Dữ liệu ở `src/data/scenes.ts` (`SCENES`).
- Thỉnh thoảng có dòng **"Suy nghĩ của bạn"** theo tuổi, tâm trạng, hoàn cảnh và lựa chọn đã qua (`MOODS` trong `scenes.ts`).
- Sự kiện có thêm trường `sub`: câu thứ hai kể chi tiết hoặc cảm xúc, hiện nhỏ dưới dòng chính. Đã thêm cho 21 sự kiện chính.
- Thêm 21 sự kiện gia đình: bố mẹ già đi, anh chị em, vợ chồng, con lớn lên.
- Văn bản dùng được `{spouse}`, `{bo}`, `{me}` (tên gọi), ngoài `{friend}`.
- Sửa lỗi: thẻ "đón thêm một em bé" có thể hiện hai lần trong một năm.
- `src/types.ts` đổi: thêm `"scene"` vào `CardKind`; thêm `sub` cho `LifeEvent`; thêm kiểu `Scene`, `Mood`.
- Cảnh làng chỉ là chuyện hư cấu ở cấp làng, không có số liệu. Nhóm nên soát lại câu chữ trong `scenes.ts`.

### Cập nhật 13/11/2026 (lần 3): tiền nhà bố mẹ, xin bố mẹ
- Bố mẹ có quỹ riêng: thu nhập mỗi năm, tiền để dành, nợ họ hàng (`fin.famIncome`, `fin.famSavings`, `fin.famDebt`). Hiện ở bảng tiền khi người chơi dưới 23 tuổi.
- Phần để dành mỗi năm tùy hoàn cảnh (`FAM_RATE` trong `engine.ts`). Trước 1989 chỉ để dành được rất ít. Hoàn cảnh "anh chị đi làm xa" có thêm tiền anh chị gửi về từ 1993.
- **Xin bố mẹ** (dưới 18 tuổi): nút "Xin bố mẹ" thay cho "Chi tiêu, đầu tư". Mỗi năm xin được một lần. Danh sách ở `src/data/requests.ts`. Bố mẹ đồng ý ngay, đồng ý sau khi đắn đo, hẹn sang năm, hoặc từ chối nhẹ nhàng, tùy tiền nhà. Hàm `askParents()`.
- **Tiền học**: cấp ba, học nghề, học thêm, đại học, học xa đều trừ vào quỹ bố mẹ (`SCHOOL_COSTS`). Không đủ thì bố mẹ vay họ hàng, rồi trả dần, có thẻ báo khi trả xong.
- Ở ngã rẽ chuyện học, hộp lựa chọn hiện tiền nhà đang để dành và tiền học của từng lựa chọn (`schoolNote()`). Sau khi chọn có câu phản ứng của bố mẹ.
- Biếu bố mẹ (khi đã đi làm) giờ trả nợ hoặc cộng vào quỹ của bố mẹ.
- `formatMoney` hiện được số lẻ (2,4 triệu, 300 nghìn).
- `src/types.ts` đổi: thêm 3 trường vào `Finance`, thêm kiểu `ChildRequest`. Thêm test xin bố mẹ (9 test).
- Giả lập: nhà "ít ruộng" bị từ chối hoặc hẹn khoảng 2 lần mỗi đời, 70% đời bố mẹ phải vay tiền học. Nhà "một con" gần như luôn được đồng ý. Số tiền đều là minh họa.

### Cập nhật 13/11/2026 (lần 4): bám kinh tế thật, con xin bạn
- `src/data/economy.ts` (mới): GDP bình quân đầu người giá so sánh 1985–2024 và lạm phát 1996–2024 của World Bank, chỉ số giá bán lẻ 1986 (báo Đại biểu Nhân dân). Có nguồn, có link.
- `eraMult` dùng GDP thật thay cho mức tăng 3,9% đều mỗi năm. Những năm 1985–1988 gần như đứng yên, sau 1989 tăng nhanh, 2020–2021 chậm lại, giống thực tế.
- Tiền mặt mất giá theo lạm phát thật. Gửi ngân hàng (từ 2000) giờ có ý nghĩa rõ hơn.
- Thêm 5 mẩu "Hồi đó" có nguồn: `gia1986`, `tangtruong`, `gdp40nam`, `lamphat2008`, `thunhap2021` (Tổng cục Thống kê, Khảo sát mức sống 2021). Gắn vào 6 sự kiện kinh tế mới (1986, 1995, 2008, 2011, 2021, 2024).
- **Con xin bạn**: khi đã có con, mỗi năm có thể có một hộp "Con xin…" (8 thứ, theo tuổi con và thời: áo Tết, xe đạp, học tiếng Anh từ 2015, máy tính bảng từ 2018…). Ba cách trả lời: đồng ý, hẹn sang năm, ngồi giải thích chuyện tiền nong. Mỗi cách có thẻ nhắc lại vài năm sau. Nếu ngày nhỏ bạn từng xin bố mẹ thứ tương tự, hộp sẽ nhắc lại bố mẹ đã trả lời thế nào.
- `src/types.ts` đổi: thêm `Pending` loại `kidask`, kiểu `KidRequest`. Engine: `Resolution` thêm `kidask`.
- Giả lập: 72% đời có con, trung bình 3,4 lần con xin mỗi đời. Tài sản ròng trung vị tuổi 40 giảm từ khoảng 830 xuống 675 triệu vì tiền mặt mất giá.

### Cập nhật 13/11/2026 (lần 5): mốc lịch sử đến tận nhà
- `src/data/ripples.ts` (mới): 27 hệ quả của các mốc 1986, 1987, 1988, 1989, 1994, 1995, 1996, 2000, 2001, 2007, 2010, 2020, 2022, đến nhà bạn sau 0–12 năm. Tùy hoàn cảnh và lựa chọn (nhà làm ruộng, có anh chị đi làm, đã mở cơ sở, đang làm nhà máy…).
- Mỗi hệ quả là một dòng có nhãn "Nhờ Đổi mới", dòng phụ ghi rõ "Từ mốc năm …: <câu mốc>".
- Một số hệ quả đổi luật tiền lâu dài (dấu `dm_*`): ruộng khoán, chợ, tiền anh chị gửi về, nông thôn mới, giảm nghèo tăng phần bố mẹ để dành được (`famSaveRate`); đăng ký kinh doanh, đào tạo ở nhà máy, nông thôn mới, giảm nghèo tăng thu nhập của bạn (`updateFinance`).
- Bảng mới "Đổi mới đến nhà bạn" (cột phải) liệt kê các thay đổi đã đến, kèm năm mốc.
- `src/types.ts` đổi: thêm kiểu `Ripple`.
- Giả lập: mỗi đời nhận 17–22 hệ quả. Ở tuổi 40 khoảng 61–74% số đời ở nấc tiền "dư dả" (trước khoảng 45–59%), 5 hoàn cảnh vẫn gần nhau.
- Câu chữ trong `ripples.ts` là hư cấu cấp làng. Nhóm nên soát để không có câu nào nghe như nhận định lịch sử cấp quốc gia.

### Cập nhật 13/11/2026 (lần 6): mini-game tự điều khiển, bản thử
- Cặp mini-game **Đi chợ 1986 – 1990**: người chơi tự đi giữa các sạp, mua đủ danh sách trong 30 giây. Năm 1986 giá tăng theo từng giây, có lúc nhảy vọt, sạp hết hàng. Năm 1990 cùng tiền, cùng danh sách, nhưng giá đứng yên, có thêm sạp quà. Thẻ năm 1990 nhắc lại kết quả năm 1986.
- Luật chơi: `src/engine/market.ts` (hàm thuần). Giao diện: `src/ui/minigames/Market.tsx`. Bật tắt: `features.minigames` trong `config.ts`.
- Có nút "Bỏ qua". Chế độ tự động quyết định cũng bỏ qua.
- Điểm 0–100 mỗi lượt, chỉ tính từ mini-game. Màn cuối hiện tổng điểm và mã xác nhận (`scoreCode`) để phát quà. Chưa có trang kiểm tra mã.
- Độ khó (người chơi máy, 60 lượt): năm 1986 bấm rất nhanh (0,3 giây mỗi lần) mua đủ 85%, bấm vừa (0,6 giây) 30%, chậm hơn thì không mua đủ. Năm 1990 luôn mua đủ.
- Tiền trong mini-game là đơn vị trò chơi, không phải giá thật.
- `src/types.ts` đổi: `Pending` loại `minigame`, kiểu `MiniResult`, `GameState.minigames`, `features.minigames`. Thêm `tests/market.test.ts` (11 test).

### Cập nhật 13/11/2026 (lần 7): Đại hội, giao diện kiểu giáo trình, thêm lựa chọn
- `src/data/congresses.ts` (mới): 8 kỳ Đại hội VI–XIII, mỗi kỳ có **định hướng chính** (`focus`), **ở xã bạn** (`local`, hư cấu) và **3 lựa chọn của nhà bạn** (`CONGRESS_TPS`, thêm 24 lựa chọn). Mỗi lựa chọn có thẻ nhắc lại hoặc may rủi, một số đổi luật tiền lâu dài (dấu `dm_*`).
- **Câu `focus` của từng Đại hội CHƯA ĐỐI CHIẾU GIÁO TRÌNH** (`verified: false`). Nhóm phải soát trước khi lên lớp. Câu mốc trong `history.ts` giữ nguyên.
- Hộp Đại hội trình bày như trang văn kiện: Đất nước → Ở xã bạn → Nhà bạn. Thẻ Đất nước năm có Đại hội hiện thêm dòng "Định hướng: …".
- Engine cho phép nhiều ngã rẽ trong một năm (Đại hội hiện trước).
- Dải **Dòng thời gian Đổi mới** thay thanh tiến độ: chia theo nhiệm kỳ Đại hội, đánh dấu các mốc, ghi "Nhiệm kỳ Đại hội … (năm–năm)".
- Phong cách giáo trình: tiêu đề bảng dùng chữ có chân, gạch chân màu thời kỳ; thẻ Đất nước có viền trái.
- Nấc tiền "dư dả" nâng từ 70 lên 80 vì thêm nhiều lựa chọn có tiền. Giả lập: 73–79% đời ở nấc dư dả lúc 40 tuổi.
- Ripple `r86_cho` không còn tự cho dấu `dm_cho`; giờ dấu này đến từ lựa chọn ở Đại hội VI.

### Cập nhật 13/11/2026 (lần 8): cảnh ngôi nhà, sự kiện theo chỉ số
- **Đưa lại cảnh ngôi nhà** (trước đã bỏ, nay nhóm yêu cầu): `src/ui/HouseScene.tsx`, vẽ bằng SVG nên không cần ảnh mới. Đặt đầu cột giữa.
  - Nhà đổi theo `houseStage`: nhà tranh, mái tôn, gạch ngói, nhà hai tầng.
  - Đường đất có ổ gà thành đường bê tông có đèn, cột điện, cửa sổ sáng đèn điện (hoặc màn hình xanh khi có máy tính), ăng-ten tivi, bồn nước, xe đạp, xe máy, biển cửa hàng, thùng hàng, ao cá.
  - Hậu cảnh: lũy tre, lúa thưa trước 1989 rồi trĩu vàng, nhà máy (sau khu công nghiệp), trường học (nông thôn mới), cột sóng (2013).
  - Thứ mới xuất hiện có hiệu ứng nảy lên (tắt khi bật giảm chuyển động) kèm nhãn "Nhờ Đổi mới" / "Nhờ lựa chọn của bạn". Dưới cảnh là hàng kỷ vật đã có (ảnh trong `public/images/items`).
- Sửa: nhãn "Nhờ Đổi mới" và "Nhờ lựa chọn của bạn" trước đó thiếu màu trong CSS, đã thêm lại (vàng chữ tối, tím đậm chữ trắng).
- **Sự kiện theo chỉ số**: `src/data/statEvents.ts`, 39 trở ngại nhẹ và 11 dịp tỏa sáng. Mỗi năm, mặt yếu nhất của người chơi (sức khỏe, vui vẻ, hiểu biết, gắn kết, tiền; dưới 12 tuổi không xét tiền) dễ gặp một trở ngại, chỉ số càng thấp càng dễ. Mọi trở ngại có `follow` vượt qua năm sau. Chỉ số từ 85 trở lên có dịp tỏa sáng.
- Giả lập: mỗi đời khoảng 6 trở ngại và 4 dịp tỏa sáng; 297/300 đời có tổ hợp khác nhau. Một số sự kiện tuổi thơ chưa bao giờ xảy ra vì chỉ số tuổi nhỏ thường cao.
- `src/types.ts` đổi: thêm kiểu `StatEvent`.

### Cập nhật 13/11/2026 (lần 9): chế độ "Hứng đáp án" chơi cả lớp, CÓ MÁY CHỦ
Nhóm đồng ý bỏ ràng buộc "không máy chủ" cho chế độ này. Chế độ mô phỏng cuộc đời vẫn chạy được không cần máy chủ.

**Cách chơi.** Màn hình chiếu bấm "Tạo phòng" và hiện mã 4 số. Học sinh vào `<địa chỉ>#lop`, nhập mã và tên. Bấm bắt đầu: mỗi người di chuyển rổ (chuột, chạm, phím ←/→ hoặc A/D) để hứng đáp án đúng đang rơi, kèm vật phẩm: +20 điểm, Rổ to, Chậm lại, ×2 điểm (mỗi buff 8 giây). Trả lời đúng thì mở gói: 68% ra thẻ mốc (Thường 50 / Hiếm 120 / Rất hiếm 250 điểm), 12% điểm thưởng, 20% lượt cướp thẻ (chọn một người, lấy thẻ giá trị nhất của họ; người bị cướp nhận thông báo). Chuỗi đúng nhân điểm tới ×3. Một ván 12 câu hoặc 3 phút. Màn hình chiếu có bảng xếp hạng trực tiếp, dòng diễn biến và bục 3 hạng đầu.

**Nội dung.** Câu hỏi và 20 thẻ chỉ lấy từ mốc trong `history.ts`, câu mốc giữ nguyên văn (có test kiểm tra). Tên ngắn của thẻ ở `SHORT` trong `src/engine/catch.ts`, nhóm soát lại.

**File.**
- `src/engine/catch.ts`: thẻ, câu hỏi (tất định theo seed), gacha, cướp thẻ, vật lý hứng đồ.
- `src/engine/protocol.ts`: tin nhắn giữa trình duyệt và máy chủ.
- `server/index.ts`: máy chủ. Điểm, gacha, cướp thẻ do máy chủ quyết. Phòng chỉ nằm trong bộ nhớ.
- `src/ui/catch/ClassRoom.tsx`: màn chọn vai, màn hình chiếu, màn người chơi.
- `tests/catch.test.ts`: 6 test.

**Chạy khi dev.** Mở 2 cửa sổ: `npm run dev:server` và `npm run dev`. Vite tự chuyển `/ws` sang cổng 8787.

**Deploy.** Vercel không chạy được WebSocket lâu dài, nên chế độ này cần nơi chạy Node, ví dụ Render, Railway, Fly.io. Cấu hình:
- Lệnh build: `npm install && npm run build`
- Lệnh chạy: `npm start`
- Cổng: đọc biến `PORT`.
- Một dịch vụ phục vụ cả trang web lẫn `/ws`, nên chỉ cần deploy một chỗ, không cần Vercel nữa. Muốn vẫn để trang ở Vercel thì đặt `VITE_WS_URL=wss://<máy chủ>/ws` khi build.
- Bản miễn phí của các dịch vụ thường ngủ khi không ai dùng. Mở trang trước giờ học vài phút để đánh thức.

**Đã thử.** Chạy máy chủ thật, giả 1 màn hình chiếu và 2 người chơi bằng WebSocket: tạo phòng, vào phòng, chặn trùng tên, 12 câu, mở thẻ, cướp thẻ, tự kết thúc khi mọi người xong. Chưa thử trên trình duyệt thật và chưa thử với 40+ người cùng lúc.

**Giới hạn.** Máy chủ tin kết quả đúng/sai do trình duyệt gửi lên (đủ cho lớp học, không chống gian lận). Tối đa 80 người một phòng. Rớt mạng thì vào lại bằng cùng mã và tên, giữ nguyên điểm (lưu tạm trong trình duyệt). Màn hình chiếu chưa vào lại được nếu tải lại trang.

### Cập nhật (Codex): asset
- Chế độ Hứng đáp án có cảnh đồng làng và phiên chợ bằng SVG, thúng tre, nón lá đáp án, đồng xu và biểu tượng riêng cho ba vật phẩm. Tất cả nằm trong bundle, không tải ảnh ngoài.
- Thẻ mốc có minh họa đồng ruộng, khung riêng theo ba độ hiếm và hiệu ứng lật khi mở gói. Màn hình chiếu có nền cảnh và bục ba hạng đầu khi kết thúc.
- Mini-game Đi chợ có hình SVG riêng cho từng loại hàng. Đây là SVG tự vẽ, không phải ảnh AI.
- Không đổi engine, dữ liệu, giao thức hay `src/types.ts`.

## 5. Bản đồ code

```
src/config.ts              Tên game, thiết lập (giây/năm, tốc độ, bật tắt tính năng), ghi chú minh bạch, câu thảo luận
src/types.ts               Kiểu dữ liệu chung
src/data/history.ts        Mốc lịch sử (năm, câu, nguồn, link)          ← nhóm soát
src/data/hoiDo.ts          Mẩu "Hồi đó…" (số liệu thật + nguồn + link)   ← nhóm soát
src/data/turningPoints.ts  Ngã rẽ, lựa chọn, chi tiêu
src/data/items.ts          32 kỷ vật và điều kiện nhận
src/data/lifeEvents.ts     Sự kiện đời thường
src/data/people.ts         Hoàn cảnh, dồn sức, bạn cũ, suy ngẫm, chức danh
src/data/names.ts          Tên, nghề bố mẹ, số anh chị em, thu nhập gốc hộ gia đình
src/engine/engine.ts       Luật chơi (hàm thuần, chạy được trong Node)
src/engine/life.ts         Nghề, học vấn, nơi sống, tài chính
src/ui/                    Giao diện React (App, Panels, LifeLog, Dialogs, Spend, Bag, EndCard)
scripts/simulate.ts        Giả lập cân bằng
tests/engine.test.ts       Test engine và luật dữ liệu
public/images/             Ảnh kỷ vật và chân dung
```

**Muốn đổi gì thì sửa ở đâu:**
- **Tốc độ, số giây mỗi năm:** `DEFAULT_SETTINGS` trong `src/config.ts`.
- **Câu chữ một mốc:** `src/data/history.ts`.
- **Thêm một lựa chọn:** `src/data/turningPoints.ts`. Phải có `echo`, `roll`, `extra`, `selfLine` hoặc `marks` được dùng ở chỗ khác, nếu không test sẽ báo lỗi.
- **Mức lương theo nghề:** hàm `occupation()` trong `src/engine/life.ts`.
- **Giá đồ mua sắm:** `PURCHASES` trong `src/data/turningPoints.ts`.
- **Tắt nhanh khi trễ:** `features.eraTheme`, `features.reflections`, `features.officialOnly` trong `src/config.ts`.

## 6. Nguồn và độ tin cậy

**Mốc lịch sử.** Các mốc đã có văn bản gốc, link nằm ngay trong `history.ts`:
- 1986: Đại hội VI.
- 1987: Luật Đầu tư nước ngoài.
- 1988: Nghị quyết 10.
- 1994 và 1995: nguồn là sách Lịch sử ngoại giao của Bộ Ngoại giao.
- 2000: Luật Doanh nghiệp năm 1999 có hiệu lực.
- 2001: Hiệp định Thương mại Việt Nam – Hoa Kỳ có hiệu lực.
- 2007: WTO.
- 2010: Quyết định 800 về nông thôn mới.
- 2022: Quyết định 90 về giảm nghèo bền vững.

Mốc 1985 và 1989 mới có nguồn phụ là bài trên tạp chí. Các mốc Đại hội VII đến XIII ghi nguồn là giáo trình.

**Việc bắt buộc trước buổi học:** đối chiếu từng câu với giáo trình môn và sửa câu chữ cho khớp. Database "Mốc lịch sử" trên Notion có cột trạng thái để đánh dấu.

**Mẩu "Hồi đó…"**:
- **Chính thức (Tổng cục Thống kê, Khảo sát mức sống 2006):** điện thoại, máy tính, nhà kiên cố, chênh lệch thu nhập thành thị – nông thôn, xe máy.
- **Trích lại:** điện, tivi, đài, xe đạp, cấp ba, bảo hiểm y tế, nước sạch. Các số này lấy từ Báo cáo cập nhật nghèo 2006 của Viện Hàn lâm KHXH, nhưng mình chỉ đọc được qua bảng mà Young Lives (2008) trích lại. Nếu nhóm tìm được bản gốc thì thay link.
- **Bài báo:** Internet 2015 (52%, số của Bộ Thông tin và Truyền thông, qua báo Viettimes), gạo 1989, bao cấp.
- **Muốn chỉ hiện nguồn chính thức:** đặt `features.officialOnly = true` trong `src/config.ts`.

**Tiền trong game** vẫn là ước lượng minh họa (mức lương, giá đồ), nhưng **nhịp tăng theo từng năm bám số liệu thật**: `eraMult` trong `life.ts` dùng GDP bình quân đầu người giá so sánh của World Bank (`src/data/economy.ts`), năm 1985 bằng khoảng 0,15 lần năm 2024. Năm 2025 chưa có số nên dùng số 2024. Tiền mặt cất ở nhà (của bạn và của bố mẹ) mất giá theo lạm phát thật của năm đó: 1986 theo chỉ số giá bán lẻ (báo Đại biểu Nhân dân), từ 1996 theo World Bank. Năm 1987–1995 chưa có nguồn lạm phát nên không tính.

## 7. Ảnh còn thiếu

Chi tiết và prompt tiếng Việt có trong `docs/ASSETS.md` và trong lịch sử chat.

| Việc | File |
| --- | --- |
| Nên làm lại | `anh_gap_lai` (trông như cặp đôi, nên là hai người bạn) |
| Tạo mới 4 chân dung | `player-nam`, `player-nu`, `friend-nam`, `friend-nu` |

Quy cách:
- **Kỷ vật:** PNG vuông 512×512, nền trong suốt.
- **Chân dung:** PNG dọc khoảng 256×304.
- **Kiểm tra:** chạy `check_assets.py` (có trong lịch sử chat) để soát tên, kích thước, nền.
- **Ghi chú AI:** `IMAGES_ARE_AI` đang là `true` vì ảnh tạo bằng AI; màn mở đầu sẽ ghi chú điều này.

## 8. Vấn đề đã biết

1. **Font:** font tải từ Google Fonts. Nếu mạng lớp chặn Google thì chữ rơi về font hệ thống, vẫn đọc được nhưng kém đẹp. Muốn chắc chắn thì tải font về `public/fonts/`.
2. **Ông bà:** với hoàn cảnh "Ông bà sống cùng", ông bà vẫn hiện "sống cùng nhà" đến năm 2025, khi đã ngoài 90 tuổi. Đây là chủ ý vì luật không có ai mất, nhưng có thể đổi câu cho tự nhiên hơn.
3. **Tự động quyết định:** chọn ngẫu nhiên, chưa có ưu tiên theo tính cách.
4. **Mốc tham chiếu điểm mạnh:** các số `base` trong `strengthOf()` lấy từ kết quả giả lập. Khi đổi nhiều nội dung, chạy `npm run sim` rồi cập nhật theo trung bình mới.
5. **Kỷ vật Ngọn đèn soi đường (id `huy_hieu`):** trong giả lập ra khoảng 35%, vì chiến lược "luôn chọn lựa chọn đầu tiên" đi đúng chuỗi điều kiện. Với người chơi thật có lẽ thấp hơn. Theo dõi khi chơi thử.
6. **Điện thoại:** giao diện dùng được nhưng dài, cần cuộn nhiều. Ưu tiên laptop và máy chiếu.
7. **Test:** chưa có test cho giao diện, chỉ có test engine và dữ liệu.
8. **Notion lỗi thời:** database "Việc cần làm" và "Asset hình ảnh" trên Notion còn nhắc Railway, admin, ảnh ngôi nhà. Cần cập nhật theo file này.

## 9. Việc tiếp theo, theo thứ tự

1. Đặt tên game.
2. Đối chiếu mốc lịch sử với giáo trình (mục 6).
3. Tạo và thay ảnh (mục 7).
4. Deploy Vercel, tạo QR.
5. Chơi thử đủ 5 hoàn cảnh trên laptop, máy chiếu, 2 điện thoại. Ghi lỗi vào GitHub Issues.
6. Cập nhật Notion theo file này.
7. Hoàn thiện hồ sơ AI Usage: Claude viết engine, dữ liệu, giao diện và tra nguồn; ảnh do AI tạo ảnh; nhóm soát nội dung và chịu trách nhiệm cuối.

## 10. Liên kết

- **Notion, trang VNR202:** https://app.notion.com/p/417a1f337ccf81358eacc308c3a29748
- **Database Mốc lịch sử:** https://app.notion.com/p/d66535fea2ea42e1bda4f8b0a82ee55b
- **Database Hồi đó, nguồn số liệu:** https://app.notion.com/p/2c0691203e2942ef89b9c95764ebd23d
- **Database Kỷ vật:** https://app.notion.com/p/cd151e4afe1c4cb680dd712c329865c8
- **Database Việc cần làm:** https://app.notion.com/p/9130e82896d34d7eb3cb6e113a0f5fd1
- **Nguồn cảm hứng thể loại:** 1 in 8 Billion (1in8b.life)

## 11. Prompt mở đầu cho agent

Dán đoạn này khi giao việc cho Codex hoặc Claude Code:

> Đọc `docs/HANDOFF.md` và `AGENTS.md` trước. Đây là game trang tĩnh (Vite + React + TypeScript), không có máy chủ. Việc của bạn: [mô tả việc]. Giữ đúng các luật nội dung trong `AGENTS.md`, đặc biệt: không tự thêm số liệu, không nội dung đau buồn, mọi lựa chọn phải có hệ quả. Không đặt tên game. Trước khi báo xong, chạy `npm test`, `npm run build` và `npm run sim` nếu đụng engine hay dữ liệu, rồi ghi lại đã sửa file nào và kết quả.

### Cập nhật 14/11/2026: Hứng đáp án kiểu mới (nông sản, hộp quà, thẻ làng nghề), dùng ảnh của nhóm
**Luật chơi** (`src/engine/catch.ts`):
- 10 câu. Mỗi câu: 1,6 giây xem câu hỏi → 8 giây nông sản rơi liên tục → 2,4 giây báo đáp án kèm câu mốc lịch sử.
- 3 đáp án gắn với 3 loại nông sản (11 loại). Hứng đúng loại +20, sai loại −10, đúng ≥3 mà không sai +50; chuỗi câu thắng nhân tới ×3. Không cho 2 loại dễ nhầm chung một câu (lúa/ngô, xoài/chuối, cà phê/vải, sầu riêng/chè).
- 5 buff rơi kèm: Rổ to, Chậm lại, Nhân đôi, Nam châm (hút nông sản đúng), Khiên (không bị lấy điểm).
- Hộp quà bí ẩn (khoảng 45% số câu): rung → lật thẻ → 15 thẻ làng nghề, hàng Tết (Thường 60%, Hiếm 30%, Rất hiếm 10%). Thẻ cho điểm, buff, ×3 điểm, hoặc lấy 100 điểm của người đứng đầu.
- Câu hỏi vẫn chỉ lấy từ mốc trong `history.ts` (có test). Thẻ mốc lịch sử và thẻ Đại hội đã bỏ.

**Máy chủ** tính điểm từ số quả đúng/sai mỗi câu (chặn số ảo, mỗi câu nộp một lần, mỗi câu tối đa một hộp quà), mở thẻ, lấy điểm, khiên. Tin nhắn ở `src/engine/protocol.ts`.

**Giao diện** `src/ui/catch/ClassRoom.tsx` (viết lại): chọn nhân vật nam/nữ, bảng đen câu hỏi, biển đáp án có hình nông sản, đồng hồ 8 giây, chip buff, hiệu ứng hứng đúng/sai, lửa chuỗi, hộp quà và lật thẻ 3D, pháo hoa thẻ hiếm, màn kết thúc và màn chiếu có nhân vật, vương miện, bục 3 hạng. Ảnh lỗi đều có ô chữ thay thế; tắt chuyển động khi máy bật giảm chuyển động.

**Ảnh** `public/images/catch/` (nhóm tạo bằng PixelLab, AI):
- `nongsan/` 11 · `buff/` 5 · `the/` 15 · `khung/` (3 khung thẻ, mặt sau, hộp quà) · `fx/` (đúng, sai, lửa chuỗi, pháo hoa: dải khung; lấp lánh, đồng hồ, thỏi vàng) · `nhanvat/` (nam, nữ + 9 khung vẫy tay) · `nen/` (đồng lúa, chiều vàng, sông, làng 1995; đã tô trời vào chỗ trong suốt) · `ui/` (thúng, vương miện, đồng xu).
- `_du-phong/`: ảnh không dùng (khế có lát hình ngôi sao 5 cánh nên không dùng; vài ảnh tạo trước).

**Font** pixel có dấu tiếng Việt, tải về `public/fonts/` (SIL OFL): Tiny5 (tiêu đề, số), VT323 (chữ). `src/ui/fonts.css`.

**Test**: `tests/catch.test.ts` viết lại (9 test: nguồn câu hỏi, nông sản không trùng, cặp dễ nhầm, điểm, độ hiếm, lấy điểm, vật lý, đủ file ảnh). Tổng 20 test qua. Đã chạy thử máy chủ thật với 2 người chơi giả. **Chưa ai chơi trên trình duyệt thật.**

**Còn thiếu (không bắt buộc)**: ảnh biển câu hỏi và biển đáp án (đang vẽ bằng CSS), bục và huy chương (đang vẽ bằng CSS).

### Cập nhật 14/11/2026 (lần 2): thẻ nội tại, rơi thưa, chơi đủ giờ
- **Thẻ đổi thành nội tại** (có tới hết ván, cộng dồn; thẻ trùng đổi thành điểm 40/80/150). Ví dụ: Nón lá mỗi quả đúng +5; Chiếu cói hứng sai chỉ −5; Khảm xà cừ hứng sai không bị trừ; Đàn bầu chuỗi tối đa ×4; Lồng đèn hộp quà gấp đôi. Máy chủ tính điểm theo nội tại của từng người (`passiveOf` trong `catch.ts`). Bỏ cơ chế lấy điểm của người khác.
- Thẻ hiện ở **cột trái** màn chơi kèm mô tả nội tại, cùng bảng 5 người dẫn đầu. Thẻ đã **ghép sẵn vào khung** (`the/ghep/`).
- **Đồ rơi thưa hơn** (khoảng 1 quả/giây), **cách nhau tối thiểu 16% bề ngang**, đáp án đúng chiếm khoảng một nửa.
- **Chơi lâu hơn**: mỗi câu 4 giây đọc + 12 giây hứng + 2,6 giây báo đáp án. Cả ván không còn bị cắt ở 3 phút: thời gian ván tính theo số câu, cộng dư 2 phút, và kết thúc khi mọi người xong.
- Bỏ pháo hoa. Khiên giờ đỡ một lần hứng sai. Thỏi vàng +50 (tối đa 3 mỗi câu).

### Cập nhật 14/11/2026 (lần 3): chơi theo thời gian, đổi điểm, thanh đua, trang quản trị, sẵn sàng deploy
**Luật mới**
- Mỗi người chơi **5 phút** (sửa được). Câu hỏi nối tiếp nhau tới khi hết giờ (chuẩn bị sẵn 60 câu, hết thì lặp). **Mở hộp quà dừng đồng hồ**; thẻ lật xong mới hiện nút **Tiếp tục**, bấm mới chơi tiếp.
- **Ô đổi điểm** (tròn tím, chữ ĐỔI): hứng được thì đổi điểm với người có điểm cao hơn gần nhất. Khiên chặn được. Đang dẫn đầu thì được +30 thay vì đổi. Tối đa một lần mỗi câu.
- **Thanh đua**: con đường làng, mỗi người một nhân vật chạy theo điểm. Hiện trên màn chơi và màn chiếu.
- Ván kết thúc khi mọi người hết giờ (hoặc sau thời gian chơi + 3 phút).

**Cấu hình** (`src/engine/catchConfig.ts`): thời gian, tốc độ rơi, mật độ, thúng, xác suất vật phẩm, điểm, bật/tắt tính năng. Có giới hạn từng mục, cấu hình sai tự kẹp về. Mỗi phòng chụp cấu hình lúc bấm Bắt đầu.

**Trang quản trị**: `<địa chỉ>/#admin`, mật khẩu là biến môi trường `ADMIN_PASSWORD` (không đặt thì máy chủ tự sinh và in ra log). Ba thẻ:
- *Cấu hình*: sửa mọi thông số, mục khác mặc định được tô màu.
- *Câu hỏi*: soạn câu hỏi trong bảng, nhập/xuất CSV (format như đã thống nhất: `id,cau_hoi,dung,sai_1,sai_2,giai_thich,nguon,url,do_kho`), báo lỗi theo dòng. Cần ≥3 câu và bật "Dùng câu hỏi nhóm soạn"; không đủ thì tự sinh từ mốc lịch sử.
- *Phòng*: phòng đang chạy.
Cấu hình và câu hỏi lưu ở `DATA_DIR` (mặc định `./data`, đã cho vào `.gitignore`).

**Hiệu năng**: máy chủ gom cập nhật tối đa 5 lần/giây; câu hỏi và cấu hình gửi một lần lúc bắt đầu. Đã cập nhật `ws` 8.23 và `tsx` 4.23 (hết lỗ hổng, `npm audit --omit=dev` = 0).

**Đã thử**: máy chủ thật với API quản trị và 2 người chơi giả (đăng nhập, lưu cấu hình, từ chối câu thiếu nguồn, đổi điểm hai chiều, mở thẻ, kết thúc). Test 23/23. Chưa thử với cả lớp thật.

## Deploy (một dịch vụ Node chạy cả trang web và máy chủ)
Vercel **không** chạy được WebSocket lâu dài. Dùng Render, Railway, Fly.io hoặc VPS.

**Render (đã có `render.yaml`)**
1. Đưa code lên GitHub.
2. render.com → New → Blueprint → chọn repo. Render đọc `render.yaml`: build `npm ci --include=dev && npm run build`, chạy `npm start`, kiểm tra `/health`, ổ đĩa 1 GB gắn vào `/var/data` để giữ cấu hình và câu hỏi.
3. Nhập `ADMIN_PASSWORD` trên trang Render (không ghi vào repo).
4. Gói có ổ đĩa là gói trả phí (Starter). Dùng gói miễn phí thì bỏ mục `disk` trong `render.yaml`: game vẫn chạy, nhưng cấu hình và câu hỏi sửa trên web sẽ mất mỗi lần deploy lại (xuất CSV để lưu). Gói miễn phí ngủ khi không ai dùng: mở trang trước giờ học vài phút.

**Docker (Railway, Fly.io, VPS)**: có sẵn `Dockerfile`. Biến môi trường: `PORT` (nền tảng tự đặt), `ADMIN_PASSWORD`, `DATA_DIR=/app/data` (gắn ổ đĩa bền vào đây).

**Sau khi deploy**: vào `<địa chỉ>/#admin` đặt cấu hình, nhập câu hỏi; màn chiếu mở `<địa chỉ>` → Hứng đáp án → Tạo phòng; học sinh vào `<địa chỉ>/#lop`. Làm QR trỏ tới `<địa chỉ>/#lop`.

