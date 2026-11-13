# Thẻ kỷ vật cho "Hứng đáp án" — danh sách và prompt

Thẻ bài trong Hứng đáp án dùng **32 kỷ vật** của game chính (`src/data/items.ts`). Thẻ mốc lịch sử và thẻ Đại hội đã bỏ.

- Mỗi thẻ = **khung theo độ hiếm** + **hình kỷ vật pixel** ở giữa + tên + câu bối cảnh (game tự ghi chữ).
- Điểm: Thường 50 · Hiếm 120 · Rất hiếm 250.
- Hình kỷ vật: **64×64, vuông**, lưu ở `public/images/catch/card-<mã>.png`. Ảnh kỷ vật cũ trong `public/images/items/` của game chính giữ nguyên.
- Gom nhiều món trong một lần tạo được (xem cuối file).

## Dùng chung

**Negative prompt:**

```
text, letters, numbers, writing, watermark, signature, logo, flag, emblem, star symbol, hammer and sickle, coat of arms, portrait of a leader, statue, weapon, blood, sad, blur, anti-aliasing, 3d render, photo, realistic, cropped object, object touching the edge
```

**Bảng màu:**

```
#1f1712 #3b2c22 #5c4636 #6b4226 #8a5a33 #b07b46 #d4a76a #9c6b1f #d9a11a #f2c14e #fbe3a1 #6e2418 #a8402b #d0644a #eb9a7c #2e4a1f #4f6b2c #6f8a3a #a3b85c #d3e09a #1f3d5c #2f6db5 #5c9bd1 #a9d0ec #e2f1f8 #c99c74 #e8c49e #f3ecda #fffaf0 #2e1650 #4b2a7b #8a6bc4
```

**Đuôi chung** (đã gắn sẵn trong từng prompt dưới đây):
`16-bit pixel art item icon, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text`

Giấy tờ (sổ, thẻ, thiệp, giấy khen…): vẽ **không có chữ**, chỉ có dòng kẻ hoặc khối màu giả chữ.

---

## Khung thẻ, mặt sau, gói (128×128)

| File | Prompt |
| --- | --- |
| `card-common.png` | `16-bit pixel art UI, square collectible card frame, plain warm wooden border (#8a5a33, #b07b46) with simple rounded corners and small wooden pegs at each corner, large center area flat plain cream paper #f3ecda completely empty, 1px outline #1f1712, filling most of the image, solid flat #00ff00 background, no text` |
| `card-rare.png` | `16-bit pixel art UI, square collectible card frame, deep blue lacquer border (#1f3d5c, #2f6db5) with light blue edge highlights #5c9bd1 and small bamboo leaf motifs in each corner, large center area flat plain cream paper #f3ecda completely empty, 1px outline #1f1712, filling most of the image, solid flat #00ff00 background, no text` |
| `card-epic.png` | `16-bit pixel art UI, square collectible card frame, rich gold lacquer border (#9c6b1f, #d9a11a, #f2c14e) with lotus flower motifs in each corner and tiny white sparkles, large center area flat plain cream paper #f3ecda completely empty, 1px outline #1f1712, filling most of the image, solid flat #00ff00 background, no text` |
| `card-back.png` | `16-bit pixel art UI, back side of a square collectible card, symmetrical woven bamboo pattern in brown and gold (#6b4226, #b07b46, #d9a11a), a simple lotus rosette in the center, thin gold border, filling most of the image, solid flat #00ff00 background, no text, no logo` |
| `pack.png` | `16-bit pixel art game item, a closed trading card pack wrapped in straw-colored rice paper (#e8c49e, #d4a76a) tied with a red string cross (#a8402b) and a small bow, slightly puffy, centered with empty space around it, 1px outline #1f1712, solid flat #00ff00 background, no text` |

---

## 32 kỷ vật

### Thường (11 thẻ · 50 điểm)

| File | Kỷ vật | Prompt |
| --- | --- | --- |
| `card-tem_phieu.png` | Sổ tem phiếu | `16-bit pixel art item icon, a small worn paper ration booklet from the 1980s, pale cream cover (#e8c49e) with a faded brown border, slightly open showing rows of small square paper coupons with dotted perforation lines, a few coupons torn off, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text` |
| `card-radio.png` | Đài bán dẫn | `16-bit pixel art item icon, an old 1980s portable transistor radio, wooden brown case (#8a5a33) with a round speaker grille, a silver tuning dial and a long telescopic antenna, a leather carrying strap, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text` |
| `card-bao_gao.png` | Bao gạo đầy | `16-bit pixel art item icon, a plump full burlap rice sack (#c99c74) tied at the top with string, white rice grains spilling slightly from the top, a small wooden scoop leaning on it, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text on the sack` |
| `card-cap_sach.png` | Cặp sách lớp Một | `16-bit pixel art item icon, a small child's school satchel from the 1990s made of green canvas (#4f6b2c) with a brown leather flap and metal buckle, a pencil and a ruler peeking out, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text` |
| `card-bong_den.png` | Bóng đèn điện | `16-bit pixel art item icon, a glowing incandescent light bulb hanging from a short cord with a bakelite socket, warm yellow glow (#f2c14e, #fbe3a1) and small light rays, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text` |
| `card-xe_dap.png` | Xe đạp | `16-bit pixel art item icon, a classic black men's bicycle from the 1990s seen from the side, a front basket, a rear rack with a tied bundle, chrome bell, single object centered with empty space around it, side view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no brand` |
| `card-tivi.png` | Tivi đen trắng | `16-bit pixel art item icon, a small old black and white CRT television with a wooden cabinet (#8a5a33), a rounded grey glowing screen, two round knobs on the side and a rabbit-ear antenna on top, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no brand` |
| `card-cuc_gach.png` | Điện thoại cục gạch | `16-bit pixel art item icon, a chunky early 2000s mobile phone ("brick phone"), dark grey body with a stubby antenna, a tiny green monochrome screen and rows of rubber buttons, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no brand` |
| `card-the_bhyt.png` | Thẻ bảo hiểm y tế | `16-bit pixel art item icon, a small rectangular health insurance card, pale blue and white (#a9d0ec, #fffaf0) with a simple green cross shape and blank lines instead of writing, a small photo square placeholder, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no emblem` |
| `card-smartphone.png` | Điện thoại thông minh | `16-bit pixel art item icon, a modern smartphone standing slightly tilted, slim dark body, bright screen showing a few colorful app tiles and a tiny rice field photo, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no logo` |
| `card-khau_trang.png` | Khẩu trang | `16-bit pixel art item icon, a light blue pleated face mask (#a9d0ec, #5c9bd1) with white ear loops, lying neatly, a small bottle of hand gel beside it, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm caring feel, solid flat #00ff00 background, no text` |

### Hiếm (17 thẻ · 120 điểm)

| File | Kỷ vật | Prompt |
| --- | --- | --- |
| `card-giay_khen.png` | Giấy khen học sinh giỏi | `16-bit pixel art item icon, a certificate of merit for a good student in a simple wooden frame, cream paper with a red and gold decorative border, blank lines instead of writing, a small red ribbon rosette in the corner, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no emblem, no star` |
| `card-chung_chi_nghe.png` | Chứng chỉ nghề | `16-bit pixel art item icon, a vocational certificate folder lying open beside a wrench and a screwdriver, cream paper with blank lines instead of writing and a small round seal shape without symbols, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no emblem` |
| `card-bao_trung_tuyen.png` | Giấy báo trúng tuyển đại học | `16-bit pixel art item icon, a university acceptance letter pulled halfway out of an envelope, cream paper with blank lines instead of writing, a small graduation cap shape printed in the corner, a tiny sparkle of joy, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no emblem` |
| `card-the_cong_nhan.png` | Thẻ công nhân khu công nghiệp | `16-bit pixel art item icon, a factory worker ID badge on a blue lanyard, white plastic card with a blank photo square and blank lines instead of writing, a small gear shape in the corner, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no logo` |
| `card-xe_may.png` | Xe máy đời đầu | `16-bit pixel art item icon, a classic small step-through motorbike from the late 1990s seen from the side, red and cream body (#a8402b, #f3ecda), round headlight, chrome rear rack, single object centered with empty space around it, side view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no brand, no license plate numbers` |
| `card-the_fdi.png` | Thẻ nhân viên nhà máy vốn nước ngoài | `16-bit pixel art item icon, a modern employee ID card in a clear plastic holder on a green lanyard, blank photo square and blank lines instead of writing, a small abstract globe shape in the corner, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, solid flat #00ff00 background, no text, no logo, no flag` |
| `card-bien_hieu.png` | Biển hiệu cửa hàng nhỏ | `16-bit pixel art item icon, a small shop signboard painted bright blue (#2f6db5) with a white border, blank center with only simple decorative shapes, hanging from two short chains, single object centered with empty space around it, front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text` |
| `card-thiep_cuoi.png` | Thiệp cưới | `16-bit pixel art item icon, a red wedding invitation card (#a8402b) half open, gold decorative pattern of flowers and swirls, a small gold ribbon, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm joyful feel, solid flat #00ff00 background, no text, no characters, no symbols` |
| `card-may_tinh.png` | Máy vi tính đầu tiên | `16-bit pixel art item icon, an early 2000s desktop computer, beige boxy CRT monitor showing a simple blue screen, beige keyboard and a mouse, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no logo` |
| `card-so_to_hop_tac.png` | Sổ thành viên tổ hợp tác | `16-bit pixel art item icon, a small green membership booklet lying open beside a bundle of rice stalks, pages with blank lines instead of writing, several small hands drawn as a simple circle pattern on the cover, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no emblem` |
| `card-don_online.png` | Đơn hàng trực tuyến đầu tiên | `16-bit pixel art item icon, a small cardboard delivery box tied with string, a blank paper label on top, a smartphone beside it showing a simple shopping cart shape, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm feel, solid flat #00ff00 background, no text, no logo` |
| `card-qua_cua_em.png` | Món quà từ tháng lương đầu của em | `16-bit pixel art item icon, a small gift box wrapped in pink paper with a red ribbon bow, a folded handmade card leaning on it with a tiny heart drawing, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm tender feel, solid flat #00ff00 background, no text` |
| `card-so_chuyen.png` | Cuốn sổ chép chuyện ông bà kể | `16-bit pixel art item icon, an old hand-bound notebook with a brown cloth cover lying open, pages filled with wavy lines instead of writing and a tiny drawing of a buffalo, a pencil and a pair of reading glasses beside it, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text` |
| `card-cay_dan.png` | Cây đàn ghi-ta | `16-bit pixel art item icon, an acoustic guitar with a warm honey wood body (#d4a76a, #b07b46), dark neck, small flower sticker on the body, leaning slightly, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text, no brand` |
| `card-cup_bong_da.png` | Chiếc cúp bóng đá giải huyện | `16-bit pixel art item icon, a small shiny gold trophy cup with two handles on a wooden base, a red ribbon tied to one handle, a leather football beside it, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, joyful feel, solid flat #00ff00 background, no text, no numbers, no star` |
| `card-tu_sach.png` | Tủ sách nhỏ cho trẻ trong xóm | `16-bit pixel art item icon, a small wooden bookshelf with three shelves full of colorful children's books, a tiny potted plant on top, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic Vietnamese feel, solid flat #00ff00 background, no text on the books` |
| `card-anh_gap_lai.png` | Tấm ảnh chụp chung ngày gặp lại | `16-bit pixel art item icon, a small framed photo standing on a stand, the photo shows two adult friends smiling side by side in front of a rice field, clearly friends not a couple, a simple wooden frame, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, warm nostalgic feel, solid flat #00ff00 background, no text` |

### Rất hiếm (4 thẻ · 250 điểm)

| File | Kỷ vật | Prompt |
| --- | --- | --- |
| `card-anh_tot_nghiep.png` | Ảnh tốt nghiệp cùng bố mẹ | `16-bit pixel art item icon, a gold-framed photo standing on a stand, the photo shows a young graduate in a gown and cap between proud smiling parents in simple country clothes, a few golden sparkles around the frame, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, proud warm feel, solid flat #00ff00 background, no text, no emblem` |
| `card-so_do.png` | Sổ đỏ ngôi nhà tự xây | `16-bit pixel art item icon, a red booklet (#a8402b) lying in front of a small model of a two-story house, the booklet cover has only a simple gold border and a small house outline, no writing, a set of keys on a ring beside it, golden sparkles, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, proud warm feel, solid flat #00ff00 background, no text, no emblem, no star` |
| `card-thu_cam_on.png` | Thư cảm ơn của bà con | `16-bit pixel art item icon, a bundle of handwritten thank-you letters tied with a red string, the top letter unfolded showing wavy lines instead of writing and a small drawn flower, a few pressed flower petals around, golden sparkles, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from top left, heartfelt warm feel, solid flat #00ff00 background, no text` |
| `card-huy_hieu.png` | Ngọn đèn soi đường | `16-bit pixel art item icon, a traditional brass oil lamp with a glass chimney glowing with a warm bright golden light (#f2c14e, #fbe3a1), soft light rays spreading around it like guiding the way, golden sparkles, single object centered with empty space around it, 3/4 front view, 1px dark outline #1f1712, light from the lamp itself, inspiring warm feel, solid flat #00ff00 background, no text, no badge, no emblem, no star` |

---

## Gom nhiều món một lần

Nếu app tạo được nhiều món trong một ảnh, gom theo nhóm (liệt kê theo thứ tự trái sang phải, trên xuống dưới, thêm `sprite sheet, N items in a grid, evenly spaced, not touching, solid flat #00ff00 background`):

| Lần | Gồm | Lưới |
| --- | --- | --- |
| 1 | 11 thẻ Thường | 4×3 |
| 2 | 9 thẻ Hiếm đầu (`giay_khen` → `so_to_hop_tac`) | 3×3 |
| 3 | 8 thẻ Hiếm còn lại (`don_online` → `anh_gap_lai`) | 3×3 |
| 4 | 4 thẻ Rất hiếm | 2×2 |
| 5 | 3 khung + mặt sau + gói (128×128) | 3×2 |

## Kiểm tra

- [ ] Giấy tờ không có chữ, không có ngôi sao, huy hiệu, quốc huy.
- [ ] `anh_gap_lai` là hai người bạn, không trông như cặp đôi.
- [ ] Nền xanh `#00ff00` trơn, vật không chạm mép.
- [ ] Đúng tên file `card-<mã>.png`.
