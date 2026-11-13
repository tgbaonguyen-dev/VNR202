# Asset pixel cho chế độ "Hứng đáp án"

Danh sách đầy đủ để làm bằng app tạo ảnh pixel. **Tất cả là ảnh vuông.** Bỏ hết vào `public/images/catch/`, đặt đúng tên file.

- Xuất cỡ nào cũng được (512×512 càng tốt), agent sẽ cắt sát, tách nền, thu nhỏ về đúng cỡ ghi trong bảng và giữ nét pixel.
- Không làm được nền trong suốt thì để một màu trơn chói (xanh lá `#00ff00`), agent tách nền.
- Mục có ★ cần thêm code (chưa có trong game). Mục có ◆ là khung hình chuyển động, không bắt buộc: game tự làm chuyển động từ ảnh tĩnh nếu thiếu.
- Ảnh do AI tạo: ghi vào `docs/ASSETS.md`, `IMAGES_ARE_AI` đang bật.

## Phong cách chung

Dán vào đầu mọi prompt (hoặc ô style của app):

```
pixel art, 16-bit retro game style, crisp hard pixel edges, no anti-aliasing, no blur,
limited warm earthy palette (rice green, straw yellow, brick red, bamboo brown, soft sky blue, cream),
Vietnamese countryside, cozy friendly mood,
no text, no letters, no numbers, no logos, no flags, no emblems, no political symbols, no weapons
```

Ảnh vật thể (mọi mục trừ ảnh nền), thêm vào cuối:

```
single object centered with empty space around it, transparent background
```

Ảnh nền, thêm vào cuối:

```
wide panoramic composition, main details in the middle horizontal band, simple sky on top, simple ground at bottom
```

Bảng màu: `#2a2118 #6e5d47 #8a5a33 #c99c5d #d9bf72 #f3ecda #a8402b #b5523b #6f8a3a #a99a5c #e9d9a8 #8fb6d6 #4b2a7b #f2c14e #2f6db5`

Làm nhiều khung (◆): giữ **cùng seed, cùng prompt gốc**, chỉ đổi phần `frame N of M`.

## Luật nội dung (bắt buộc)

- Không cờ, huy hiệu, ngôi sao, búa liềm, quốc huy, chân dung hay tượng lãnh tụ. Không chữ, không số (game tự ghi).
- Không chiến tranh, tai nạn, bệnh tật, cảnh buồn. Không làm cảnh nghèo trông thảm hại.
- Hình có người: thân thiện, không đồng phục có phù hiệu.

---

## A. Ảnh nền màn chơi — 256×256, nền đặc

Game đổi nền theo năm của câu hỏi. Ít thời gian thì chỉ làm `bg-1995.png`.

| File | Prompt |
| --- | --- |
| `bg-1985.png` | `Vietnamese village in the 1980s, thatched huts, mud walls, bamboo hedge, dirt path, sparse rice field, water buffalo, soft dusk light` |
| `bg-1995.png` | `Vietnamese village in the 1990s, mix of thatched and tiled roofs, new wooden electric poles, bicycles, lush green rice paddies` |
| `bg-2007.png` | `Vietnamese village in the 2000s, brick houses with red tile roofs, small shops, motorbikes on the road, factory chimney far away` |
| `bg-2020.png` | `modern Vietnamese countryside, two-story painted houses, concrete road with street lamps, school building, cell tower, golden rice field` |
| `bg-clouds.png` | `a few soft pixel clouds on plain light sky blue background, wide panoramic composition` (lớp mây trôi phía trên) |

## B. Thúng hứng — 64×64

| File | Prompt |
| --- | --- |
| `basket.png` | `woven bamboo basket (thúng) seen from the front, wide and low shape, woven pattern` |
| `basket-wide.png` | `extra wide woven bamboo basket, wide and low shape, faint purple glow` |
| ◆ `basket-catch-1.png` … `-3.png` | `woven bamboo basket, wide and low shape, frame N of 3: normal, squashed down, bounced up` |

## C. Đồ rơi

**Đáp án — 64×64.** Game đổi ngẫu nhiên giữa các kiểu. Ít nhất làm `tag-wood.png`.

| File | Prompt |
| --- | --- |
| `tag-wood.png` | `blank wooden hanging signboard with rope on top, wide horizontal shape, empty center` |
| `tag-paper.png` | `blank cream paper scroll unrolled horizontally, wide shape, empty center` |
| `tag-sack.png` | `burlap rice sack lying sideways with blank cream label patch in the middle, wide shape` |
| `tag-hat.png` | `conical hat (nón lá) seen from the side with a blank cream ribbon band across, wide shape` |

**Vật phẩm — 32×32**

| File | Prompt |
| --- | --- |
| `coin.png` | `small round gold coin with square hole in the center, shiny highlight` |
| ◆ `coin-1.png` … `coin-4.png` | `gold coin with square hole spinning, frame N of 4: front, angled, edge-on, angled back` |
| `buff-wide.png` | `power-up icon: bamboo basket with two outward arrows, purple glow border` |
| `buff-slow.png` | `power-up icon: wooden hourglass, purple glow border` |
| `buff-x2.png` | `power-up icon: two stacked gold coins with sparkles, purple glow border` |
| ★ `buff-magnet.png` | `power-up icon: red horseshoe magnet, purple glow border` |
| ★ `buff-shield.png` | `power-up icon: round woven bamboo shield, purple glow border` |
| ★ `hazard-mud.png` | `small splash of brown mud, cartoonish` |
| ★ `hazard-rock.png` | `small grey pebble` |

## D. Thẻ bài — thẻ vuông

**Khung, mặt sau, gói — 128×128**

| File | Prompt |
| --- | --- |
| `card-common.png` | `square collectible card frame, plain wooden border, cream paper center left empty, simple corners` |
| `card-rare.png` | `square collectible card frame, blue lacquer border with bamboo motifs, cream paper center left empty` |
| `card-epic.png` | `square collectible card frame, gold lacquer border with lotus motifs and soft sparkle, cream paper center left empty` |
| `card-back.png` | `back side of a square collectible card, woven bamboo pattern, brown and gold` |
| `card-slot.png` | `empty square card slot outline, dashed cream border, faint` (ô thẻ trống trong bộ sưu tập) |
| `pack.png` | `closed trading card pack, straw paper wrapping tied with red string` |
| ◆ `pack-open-1.png` … `-4.png` | `card pack opening sequence, frame N of 4: closed, string loosening, paper tearing, bursting with light` |

**Hình minh họa thẻ — 64×64**, nằm trong ô giữa khung thẻ. Thêm vào cuối prompt `full scene filling the whole square, solid background` (không dùng câu nền trong suốt).

Với 8 hình Đại hội, thêm vào prompt: `no flags, no emblems, no portraits, no statues`.

| File | Thẻ | Prompt |
| --- | --- | --- |
| `art-c1985.png` | Thời bao cấp | `villagers queuing with small paper ration books in front of a cooperative store, 1980s` |
| `art-c1986.png` | Đại hội VI | `large meeting hall interior, rows of seats, podium with flowers, warm light, 1980s style` |
| `art-c1987.png` | Luật Đầu tư nước ngoài | `new factory building under construction with a crane, workers in hard hats` |
| `art-c1988.png` | Khoán 10 | `farming family harvesting golden rice on their own small field, happy` |
| `art-c1989.png` | Xuất khẩu gạo | `rice sacks being loaded onto a cargo ship at a river port` |
| `art-c1991.png` | Đại hội VII | `meeting hall with long tables and stacks of documents, flowers on podium, early 1990s` |
| `art-c1994.png` | Hoa Kỳ bỏ cấm vận | `cargo containers being unloaded at a busy seaport, morning` |
| `art-c1995.png` | Gia nhập ASEAN | `ten hands joined in a circle over a round table, friendly` |
| `art-c1996.png` | Đại hội VIII | `meeting hall with a large painting of factories and power lines on the back wall, flowers on podium` |
| `art-c2000.png` | Luật Doanh nghiệp | `small family shop opening, blank signboard, shelves full of goods` |
| `art-c2001.png` | Đại hội IX | `meeting hall with a large painting of a busy market on the back wall, flowers on podium` |
| `art-c2001b.png` | Hiệp định Thương mại Việt Nam – Hoa Kỳ | `garment factory sewing line, stacks of shirts and shoes packed in boxes` |
| `art-c2006.png` | Đại hội X | `meeting hall with a large painting of a bustling town street on the back wall, flowers on podium` |
| `art-c2007.png` | Gia nhập WTO | `container ship and stacks of colorful containers, globe silhouette in the sky` |
| `art-c2010.png` | Nông thôn mới | `new concrete village road with street lights and a two-story school` |
| `art-c2011.png` | Đại hội XI | `meeting hall with a large painting of a highway, a school and workers on the back wall, flowers on podium` |
| `art-c2016.png` | Đại hội XII | `meeting hall with a large painting of green fields and solar panels on the back wall, flowers on podium` |
| `art-c2020.png` | Chống dịch COVID-19 | `villagers wearing face masks handing out rice bags, caring mood` |
| `art-c2021.png` | Đại hội XIII | `modern meeting hall with screens, a large painting of a city skyline and rice fields on the back wall, flowers on podium` |
| `art-c2022.png` | Giảm nghèo bền vững | `family receiving seedlings and a piglet from village staff, smiling` |

## E. Hiệu ứng — 64×64

| File | Prompt |
| --- | --- |
| `fx-correct.png` | `bright green check mark with small sparkles` |
| `fx-wrong.png` | `soft red cross mark, gentle not scary` |
| `fx-sparkle.png` | `burst of golden sparkles and small stars` |
| ◆ `fx-sparkle-1.png` … `-3.png` | `golden sparkle burst, frame N of 3: small, large, fading` |
| `fx-confetti.png` | `colorful paper confetti burst` |
| `fx-steal.png` | `quick hand grabbing a card with motion lines, playful` |
| `fx-robbed.png` | `empty card slot with a small puff of dust, playful` |
| `fx-combo.png` | `small rising flame of sparkles, warm orange` |
| `fx-bonus.png` | `small pile of gold coins with a burst of light` |
| `fx-levelup.png` | `upward golden arrow with sparkles` (chuỗi đúng lên mức mới) |

## F. Biểu tượng giao diện — 32×32

| File | Prompt |
| --- | --- |
| `ui-clock.png` | `small round wall clock` |
| `ui-score.png` | `small pile of gold coins` |
| `ui-cards.png` | `small fanned stack of three cards` |
| `ui-players.png` | `two small villager heads side by side, one with conical hat` |
| `ui-question.png` | `small open book` |
| `ui-crown.png` | `golden conical hat (nón lá) with a small sparkle` |
| `ui-rank-1.png` | `small gold medal with red ribbon, no numbers` |
| `ui-rank-2.png` | `small silver medal with red ribbon, no numbers` |
| `ui-rank-3.png` | `small bronze medal with red ribbon, no numbers` |
| `ui-offline.png` | `small grey cloud with a broken line` (người chơi rớt mạng) |
| `ui-keys.png` | `two small keyboard arrow keys left and right` (hướng dẫn điều khiển) |
| `ui-touch.png` | `small hand finger touching a screen` (hướng dẫn trên điện thoại) |

## G. Khung giao diện — 128×128

Game kéo giãn phần giữa nên giữa phải trơn, 4 góc là phần trang trí.

| File | Prompt |
| --- | --- |
| `panel-wood.png` | `square wooden panel frame, decorative corners, plain flat center, for UI box` |
| `panel-paper.png` | `square aged cream paper panel, slightly torn edges, plain flat center, for UI box` |
| `btn.png` | `square wooden button, raised bevel, plain flat center` |
| `btn-pressed.png` | `square wooden button pressed down, sunken bevel, plain flat center` |
| `question-board.png` | `square blackboard with wooden frame, plain dark green center` (khung câu hỏi) |

## H. Màn hình chiếu

| File | Cỡ | Prompt |
| --- | --- | --- |
| `host-bg.png` | 256×256, nền đặc | `village communal house courtyard at festival time, red lanterns, crowd silhouettes, wide panoramic composition` |
| `host-banner.png` | 128×128 | `long red and gold festive paper banner with tassels, wide horizontal shape, empty center` |
| `podium.png` | 128×128 | `three-step wooden winner podium, middle step tallest, red cloth and flowers, wide and low shape, no numbers` |
| `lantern.png` | 64×64 | `red Vietnamese paper lantern with gold tassel` |
| ◆ `lantern-1.png` … `-2.png` | 64×64 | `red paper lantern swinging, frame N of 2: tilted left, tilted right` |

## I. Nhân vật người chơi ★ — 64×64

Người chơi chọn khi vào phòng; hiện ở bảng xếp hạng, lúc cướp thẻ và trên thúng.

Thêm vào prompt: `bust portrait, no red star, no badge, no uniform insignia`.

| File | Prompt |
| --- | --- |
| `ava-1.png` | `cute villager kid with conical hat, smiling` |
| `ava-2.png` | `cute girl with two braids and white school shirt` |
| `ava-3.png` | `cute boy with short hair and a red scarf` |
| `ava-4.png` | `cute farmer with straw hat and towel on shoulder` |
| `ava-5.png` | `cute student with glasses holding a book` |
| `ava-6.png` | `cute factory worker with plain blue cap` |
| `ava-7.png` | `cute shopkeeper girl with apron` |
| `ava-8.png` | `cute grandma with headscarf, warm smile` |
| `ava-9.png` | `cute water buffalo calf` |
| `ava-10.png` | `cute duckling` |

---

## Thứ tự làm

| Đợt | Mục | Số file | Kết quả |
| --- | --- | --- | --- |
| 1 | A (`bg-1995`), B (`basket`), C (`tag-wood`, `coin`, 3 buff) | 7 | Màn chơi đổi mặt |
| 2 | D (khung, mặt sau, gói, 20 hình thẻ) | 26 | Mở thẻ đẹp |
| 3 | E, F, G | 27 | Chỉn chu, đồng bộ |
| 4 | A còn lại, H | 9 | Đổi nền theo thời, màn chiếu có không khí |
| 5 | I, các mục ★ và ◆ | 30+ | Tính năng mới và chuyển động mượt |

Xong đợt nào nhắn agent gắn đợt đó.
