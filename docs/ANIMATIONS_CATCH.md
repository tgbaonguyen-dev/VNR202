# Prompt animation pixel cho "Hứng đáp án"

Mỗi animation = **một ảnh vuông chứa nhiều khung** (sprite sheet). Agent cắt ra từng khung và ghép thành chuyển động.

## Câu chung

**Phong cách** (đầu mọi prompt):

```
pixel art, 16-bit retro game style, crisp hard pixel edges, no anti-aliasing, no blur,
warm earthy Vietnamese countryside palette, cozy friendly mood,
no text, no letters, no numbers, no logos, no flags, no emblems, no political symbols, no weapons
```

**Khung hình** (cuối mọi prompt, thay `N` và `R×C`):

```
animation sprite sheet, N frames in a R by C grid, read left to right then top to bottom,
same character same size same position in every frame, only the motion changes,
frames evenly spaced and not touching, solid flat #00ff00 background
```

**Bảng màu** (nếu app cho nhập):

```
#1f1712 #3b2c22 #5c4636 #6b4226 #8a5a33 #b07b46 #d4a76a #9c6b1f #d9a11a #f2c14e #fbe3a1 #6e2418 #a8402b #d0644a #eb9a7c #2e4a1f #4f6b2c #6f8a3a #a3b85c #d3e09a #1f3d5c #2f6db5 #5c9bd1 #a9d0ec #e2f1f8 #c99c74 #e8c49e #f3ecda #fffaf0 #2e1650 #4b2a7b #8a6bc4
```

## Mẹo

- Ghi rõ từng khung theo thứ tự (`frame 1: …, frame 2: …`). App dễ làm đúng hơn khi được tả từng bước.
- Khung đầu và khung cuối gần giống nhau thì vòng lặp mượt.
- Lệch vị trí ít thì agent căn lại được. Lệch nhiều thì tạo lại.
- Lưu vào `public/images/catch/anim/`, đặt đúng tên file.

## Cần làm hay không

| Mức | Ý nghĩa |
| --- | --- |
| **Nên làm** | Làm bằng code trông cứng, có khung vẽ tay đẹp hơn hẳn |
| Tùy chọn | Code làm tạm được (lắc, nảy, mờ dần); có khung thì sống động hơn |
| Không cần | Code làm tốt, khỏi tạo |

**Không cần tạo animation cho:** đồ rơi lắc khi rơi, buff nhấp nháy, lật thẻ, nền mây trôi, bục 3 hạng, khung giao diện, biểu tượng. Code tự làm.

---

## 1. Nên làm (8 cái)

| File | Khung | Lưới | Prompt riêng |
| --- | --- | --- | --- |
| `coin-spin.png` | 6 | 3×2 | `gold coin with square hole spinning around vertical axis, frame 1 front view, frame 2 slightly turned, frame 3 thin angled, frame 4 edge-on thin line, frame 5 thin angled back, frame 6 slightly turned back` |
| `basket-catch.png` | 4 | 2×2 | `woven bamboo basket catching something, wide and low shape, frame 1 normal, frame 2 squashed down wider, frame 3 stretched up taller, frame 4 back to normal with tiny sparkles above` |
| `pack-open.png` | 6 | 3×2 | `trading card pack wrapped in straw paper tied with red string opening, frame 1 closed, frame 2 shaking, frame 3 string snaps, frame 4 paper tears at top, frame 5 light bursts out, frame 6 bright burst of light and sparkles` |
| `fx-sparkle.png` | 4 | 2×2 | `golden sparkle burst, frame 1 tiny dot of light, frame 2 small star burst, frame 3 large star burst with scattered sparkles, frame 4 fading scattered sparkles` |
| `fx-correct.png` | 4 | 2×2 | `bright green check mark appearing, frame 1 small, frame 2 large overshoot, frame 3 normal size with sparkles, frame 4 normal size sparkles fading` |
| `fx-steal.png` | 4 | 2×2 | `playful cartoon hand grabbing a square card, frame 1 open hand reaching, frame 2 hand touches card, frame 3 hand grabs card, frame 4 hand pulls card away with motion lines` |
| `fx-combo.png` | 4 | 2×2 | `small warm orange flame made of sparkles, flickering loop, frame 1 short, frame 2 tall, frame 3 leaning left, frame 4 leaning right` |
| `fx-confetti.png` | 4 | 2×2 | `colorful paper confetti burst, frame 1 small cluster, frame 2 bursting outward, frame 3 wide spread falling, frame 4 few pieces drifting down` |

## 2. Tùy chọn (14 cái)

**Đồ rơi, thúng**

| File | Khung | Lưới | Prompt riêng |
| --- | --- | --- | --- |
| `tag-swing.png` | 4 | 2×2 | `blank wooden hanging signboard with rope swinging gently while falling, frame 1 tilted left, frame 2 straight, frame 3 tilted right, frame 4 straight` |
| `basket-wide.png` | 4 | 2×2 | `woven bamboo basket stretching wider with purple glow, frame 1 normal width, frame 2 wider, frame 3 widest with purple glow, frame 4 widest glow settled` |
| `buff-wide.png` | 2 | 2×1 | `power-up icon of bamboo basket with two outward arrows, purple glow border, frame 1 dim glow, frame 2 bright glow arrows pushed out` |
| `buff-slow.png` | 4 | 2×2 | `power-up icon of wooden hourglass with purple glow, sand flowing, frame 1 top full, frame 2 sand falling, frame 3 bottom filling, frame 4 hourglass flipping` |
| `buff-x2.png` | 2 | 2×1 | `power-up icon of two stacked gold coins with purple glow, frame 1 coins still, frame 2 coins shining with sparkle` |
| `hazard-mud.png` ★ | 3 | 3×1 | `brown mud blob hitting the ground, frame 1 round blob, frame 2 splat flattening, frame 3 wide splash with droplets` |

**Hiệu ứng**

| File | Khung | Lưới | Prompt riêng |
| --- | --- | --- | --- |
| `fx-wrong.png` | 3 | 3×1 | `soft red cross mark, gentle not scary, frame 1 appearing small, frame 2 shaking left, frame 3 shaking right` |
| `fx-robbed.png` | 4 | 2×2 | `empty square card slot, playful, frame 1 card inside slot, frame 2 card lifting away, frame 3 empty slot with puff of dust, frame 4 dust fading` |
| `fx-bonus.png` | 4 | 2×2 | `pile of gold coins with a burst of light, frame 1 small pile, frame 2 coins jump up, frame 3 coins land with light burst, frame 4 shining pile` |
| `fx-levelup.png` | 3 | 3×1 | `golden upward arrow with sparkles rising, frame 1 arrow low, frame 2 arrow middle, frame 3 arrow high with sparkle trail` |

**Màn hình chiếu**

| File | Khung | Lưới | Prompt riêng |
| --- | --- | --- | --- |
| `lantern.png` | 4 | 2×2 | `red Vietnamese paper lantern with gold tassel swinging, frame 1 tilted left, frame 2 straight, frame 3 tilted right, frame 4 straight` |
| `podium-crown.png` | 4 | 2×2 | `golden conical hat (nón lá) floating with sparkles, frame 1 low, frame 2 high, frame 3 low with sparkle, frame 4 high with sparkle` |

**Thẻ Rất hiếm**

| File | Khung | Lưới | Prompt riêng |
| --- | --- | --- | --- |
| `card-epic-shine.png` | 4 | 2×2 | `square collectible card frame with gold lacquer border and lotus motifs, cream center empty, a diagonal shine sweeping across, frame 1 shine at top left, frame 2 shine at center, frame 3 shine at bottom right, frame 4 no shine` |
| `card-rare-shine.png` | 4 | 2×2 | `square collectible card frame with blue lacquer border and bamboo motifs, cream center empty, a diagonal shine sweeping across, frame 1 shine at top left, frame 2 shine at center, frame 3 shine at bottom right, frame 4 no shine` |

## 3. Nhân vật ★ (10 nhân vật × 3 trạng thái)

Mỗi nhân vật một ảnh, **6 khung, lưới 3×2**. Thêm vào prompt: `bust portrait, no red star, no badge, no uniform insignia`.

Đoạn khung chung (dán sau mô tả nhân vật):

```
frame 1 idle smiling, frame 2 idle blinking, frame 3 happy cheering with arms up,
frame 4 happy laughing, frame 5 surprised with mouth open, frame 6 pouting playfully
```

Khung 1–2 dùng khi đứng yên, khung 3–4 khi trả lời đúng hoặc cướp được thẻ, khung 5–6 khi bị cướp thẻ.

| File | Mô tả nhân vật |
| --- | --- |
| `ava-1.png` | `cute villager kid with conical hat` |
| `ava-2.png` | `cute girl with two braids and white school shirt` |
| `ava-3.png` | `cute boy with short hair and a red scarf` |
| `ava-4.png` | `cute farmer with straw hat and towel on shoulder` |
| `ava-5.png` | `cute student with glasses holding a book` |
| `ava-6.png` | `cute factory worker with plain blue cap` |
| `ava-7.png` | `cute shopkeeper girl with apron` |
| `ava-8.png` | `cute grandma with headscarf` |
| `ava-9.png` | `cute water buffalo calf` |
| `ava-10.png` | `cute duckling` |

## 4. Nền động (tùy chọn)

Nền chính vẫn là ảnh tĩnh. Đây là các lớp nhỏ chồng lên cho sống động.

| File | Khung | Lưới | Prompt riêng |
| --- | --- | --- | --- |
| `rice-sway.png` | 4 | 2×2 | `small clump of rice plants swaying in the wind, frame 1 upright, frame 2 bending right, frame 3 upright, frame 4 bending left` |
| `water-shimmer.png` | 3 | 3×1 | `small patch of pond water with light ripples, frame 1 ripples left, frame 2 ripples center, frame 3 ripples right` |
| `bird-fly.png` | 4 | 2×2 | `small white egret flying side view, frame 1 wings up, frame 2 wings level, frame 3 wings down, frame 4 wings level` |
| `smoke-chimney.png` | 4 | 2×2 | `small puff of kitchen smoke rising from a roof, frame 1 small puff, frame 2 rising, frame 3 spreading, frame 4 fading` |

---

## Thứ tự làm

1. **Mục 1**: 8 ảnh, game có cảm giác "đã" nhất (xu xoay, thúng nảy, mở gói, lấp lánh).
2. **Mục 2**: chọn vài cái bạn thích.
3. **Mục 3**: khi muốn có nhân vật (cần thêm code chọn nhân vật).
4. **Mục 4**: làm cuối, cho nền có sức sống.

★ = cần thêm code mới dùng được.
