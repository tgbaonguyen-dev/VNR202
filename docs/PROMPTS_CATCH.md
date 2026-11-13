# Prompt chi tiết từng item — "Hứng đáp án"

Mỗi prompt dưới đây **dùng được ngay, không cần ghép thêm**: đã gồm phong cách, màu, ánh sáng, bố cục và nền.
Lưu ảnh tĩnh vào `public/images/catch/`, animation vào `public/images/catch/anim/`, đúng tên file.

## Dùng chung

**Negative prompt** (dán vào ô negative của app, dùng cho mọi ảnh):

```
text, letters, numbers, watermark, signature, logo, flag, emblem, star symbol, hammer and sickle, coat of arms, portrait of a leader, statue, weapon, war, blood, injury, sad crying, dark horror, blur, anti-aliasing, gradient smoothing, 3d render, photo, realistic, noise, jpeg artifacts, cropped object, object touching the edge
```

**Bảng màu** (32 màu, dán vào ô palette nếu app có):

```
#1f1712 #3b2c22 #5c4636 #6b4226 #8a5a33 #b07b46 #d4a76a #9c6b1f #d9a11a #f2c14e #fbe3a1 #6e2418 #a8402b #d0644a #eb9a7c #2e4a1f #4f6b2c #6f8a3a #a3b85c #d3e09a #1f3d5c #2f6db5 #5c9bd1 #a9d0ec #e2f1f8 #c99c74 #e8c49e #f3ecda #fffaf0 #2e1650 #4b2a7b #8a6bc4
```

**Quy ước trong mọi prompt:** viền 1 pixel màu `#1f1712`, ánh sáng từ góc trên bên trái, mỗi chất liệu 2–3 sắc độ, nền xanh trơn `#00ff00` (agent tách nền). Ảnh xuất vuông, cỡ nào cũng được.

---

# PHẦN 1 — ẢNH TĨNH

## A. Ảnh nền (256×256)

Ảnh nền không tách nền, không dùng `#00ff00`. Phần trên cùng và dưới cùng sẽ bị cắt để thành khung ngang, nên chi tiết đặt ở dải giữa.

### `bg-1985.png`
```
16-bit pixel art game background, side view of a poor but peaceful Vietnamese village in the mid 1980s at soft golden dusk.
Middle band: three small thatched huts with straw roofs (#d4a76a, #9c6b1f) and mud brick walls (#b07b46), a tall bamboo hedge (#4f6b2c, #2e4a1f) behind them, a narrow dirt path (#8a5a33) winding across, a water buffalo resting near a small pond, a few areca palm trees.
Bottom band: sparse young rice paddies with visible water between rows (#6f8a3a, #5c9bd1).
Top band: simple warm sky gradient in flat pixel steps (#fbe3a1 to #eb9a7c), one or two flat clouds.
No electricity poles, no vehicles. Calm, nostalgic, not sad. Crisp pixel edges, limited palette, 1px dark outlines #1f1712, no text.
```

### `bg-1995.png`
```
16-bit pixel art game background, side view of a Vietnamese village in the mid 1990s on a bright clear morning.
Middle band: a mix of thatched huts and houses with red clay tile roofs (#a8402b, #d0644a), new wooden electricity poles with thin wires along the road, two bicycles leaning on a fence, a small village market stall with a striped canvas awning, bamboo hedge and coconut palms.
Bottom band: lush green rice paddies in neat rows (#6f8a3a, #a3b85c) with a raised dirt dike.
Top band: soft sky blue (#a9d0ec, #e2f1f8) with flat pixel clouds.
Hopeful, lively mood. Crisp pixel edges, limited palette, 1px dark outlines #1f1712, no text.
```

### `bg-2007.png`
```
16-bit pixel art game background, side view of a Vietnamese village in the late 2000s on a sunny afternoon.
Middle band: one- and two-story brick houses with red tile roofs and painted walls (cream #f3ecda, pale yellow #fbe3a1), a row of small shops with blank colored signboards, motorbikes parked on a paved road, power lines, a factory with a chimney and light grey smoke far in the background on the right.
Bottom band: green rice fields with a concrete irrigation canal.
Top band: clear blue sky (#5c9bd1, #a9d0ec) with flat clouds.
Busy, prosperous mood. Crisp pixel edges, limited palette, 1px dark outlines #1f1712, no text on signs.
```

### `bg-2020.png`
```
16-bit pixel art game background, side view of a modern Vietnamese countryside village around 2020 on a bright day.
Middle band: colorful two- and three-story houses with balconies and flower pots, a wide concrete road with street lamps, a two-story school building with a yard, a tall slim cell tower, a few solar panels on one roof, trees lining the road.
Bottom band: golden ripe rice field (#d9a11a, #f2c14e) ready for harvest, a small combine harvester at the far edge.
Top band: clean bright sky (#a9d0ec, #e2f1f8) with flat clouds.
Modern, happy, green mood. Crisp pixel edges, limited palette, 1px dark outlines #1f1712, no text, no flags.
```

### `bg-clouds.png`
```
16-bit pixel art, a horizontal band of 4 to 5 soft fluffy pixel clouds in cream white (#fffaf0) with light blue shading (#e2f1f8), spread evenly across the image, on solid flat #00ff00 background.
Clouds must tile seamlessly left to right. Crisp pixel edges, no outline or very soft #a9d0ec outline, no text.
```

## B. Thúng (64×64)

### `basket.png`
```
16-bit pixel art game sprite, a traditional Vietnamese woven bamboo basket (thúng) seen straight from the front, wide and shallow, about 3 times wider than tall.
Visible criss-cross woven bamboo pattern in #b07b46 and #d4a76a, darker inner rim #6b4226, thick rolled rim on top, slight curve at the bottom.
Light from top left, 1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### `basket-wide.png`
```
16-bit pixel art game sprite, an extra wide traditional Vietnamese woven bamboo basket (thúng) seen from the front, about 5 times wider than tall, same style as a normal basket but stretched.
Criss-cross woven bamboo pattern #b07b46 and #d4a76a, rolled rim, a soft purple glow outline around the basket (#8a6bc4) showing it is powered up.
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

## C. Đồ rơi

### Bảng đáp án (64×64) — giữa phải trơn để game ghi chữ

### `tag-wood.png`
```
16-bit pixel art game sprite, a blank rectangular wooden signboard about 3 times wider than tall, hanging from a short rope loop at the top center.
Warm wood planks #b07b46 with darker grain lines #8a5a33, a thin darker frame #6b4226, the center area flat and plain light wood #d4a76a for text to be placed later.
Light from top left, 1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. Absolutely no text or marks in the center.
```

### `tag-paper.png`
```
16-bit pixel art game sprite, a blank cream paper scroll unrolled horizontally, about 3 times wider than tall, with rolled wooden ends on the left and right (#8a5a33).
Paper color #f3ecda with soft shading #e8c49e at the edges, the center area flat and plain for text to be placed later.
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### `tag-sack.png`
```
16-bit pixel art game sprite, a burlap rice sack lying on its side, about 3 times wider than tall, tied at both ends with string.
Rough burlap texture in #c99c74 and #b07b46, a large blank rectangular cream label patch (#f3ecda) stitched in the middle, flat and plain for text.
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text, no logo on the label.
```

### `tag-hat.png`
```
16-bit pixel art game sprite, a Vietnamese conical palm-leaf hat (nón lá) seen from the side, wide and low, with a horizontal blank cream ribbon band (#f3ecda) wrapped across its middle, wide enough for a short word.
Hat leaf color #e8c49e with fine ring lines #c99c74, darker underside #b07b46.
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### Vật phẩm (32×32)

### `coin.png`
```
16-bit pixel art game pickup sprite, a small round Vietnamese-style old gold coin with a square hole in the center, seen from the front.
Gold #d9a11a with a light rim #f2c14e, a bright highlight pixel cluster at top left #fbe3a1, darker shade at bottom right #9c6b1f, thin raised ring around the square hole.
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text, no characters on the coin.
```

### `buff-wide.png`
```
16-bit pixel art power-up icon, a small woven bamboo basket (#b07b46, #d4a76a) with two bold arrows pointing outward to the left and right (#fffaf0), inside a rounded square badge with a glowing purple border (#4b2a7b inner, #8a6bc4 glow).
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### `buff-slow.png`
```
16-bit pixel art power-up icon, a small wooden hourglass with a frame #8a5a33 and golden sand #f2c14e, sand half in the top half in the bottom, inside a rounded square badge with a glowing purple border (#4b2a7b inner, #8a6bc4 glow).
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### `buff-x2.png`
```
16-bit pixel art power-up icon, two gold coins with square holes stacked slightly offset (#d9a11a, #f2c14e) with three small white sparkles (#fffaf0), inside a rounded square badge with a glowing purple border (#4b2a7b inner, #8a6bc4 glow).
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text, no number 2.
```

### ★ `buff-magnet.png`
```
16-bit pixel art power-up icon, a red horseshoe magnet (#a8402b, #d0644a) with silver tips (#9aa3a8), two small curved attraction lines, inside a rounded square badge with a glowing purple border (#4b2a7b inner, #8a6bc4 glow).
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### ★ `buff-shield.png`
```
16-bit pixel art power-up icon, a round woven bamboo shield (#b07b46, #d4a76a) with a spiral weave pattern and a darker rim #6b4226, inside a rounded square badge with a glowing purple border (#4b2a7b inner, #8a6bc4 glow). Friendly, not a weapon.
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### ★ `hazard-mud.png`
```
16-bit pixel art game sprite, a small round blob of brown mud (#6b4226, #8a5a33) with a glossy highlight #b07b46 and two tiny droplets, cartoonish and funny, not dirty-looking.
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### ★ `hazard-rock.png`
```
16-bit pixel art game sprite, a small rounded grey river pebble (#55606a, #9aa3a8) with a light highlight at top left (#e2f1f8) and a tiny crack line.
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

## D. Thẻ bài

### Khung, mặt sau, gói (128×128)

### `card-common.png`
```
16-bit pixel art UI, a square collectible card frame, plain warm wooden border about 1/8 of the width thick (#8a5a33, #b07b46) with simple rounded corners and small wooden pegs at each corner.
The large center area is flat plain cream paper (#f3ecda) completely empty, for art and text added later.
1px outline #1f1712. Centered, filling most of the image, on solid flat #00ff00 background. No text, no decoration in the center.
```

### `card-rare.png`
```
16-bit pixel art UI, a square collectible card frame, deep blue lacquer border (#1f3d5c, #2f6db5) with thin light blue edge highlights (#5c9bd1) and small bamboo leaf motifs in each corner (#a3b85c).
The large center area is flat plain cream paper (#f3ecda) completely empty.
1px outline #1f1712. Centered, filling most of the image, on solid flat #00ff00 background. No text.
```

### `card-epic.png`
```
16-bit pixel art UI, a square collectible card frame, rich gold lacquer border (#9c6b1f, #d9a11a, #f2c14e) with lotus flower motifs in each corner (#eb9a7c petals) and tiny white sparkles (#fffaf0) on the border.
The large center area is flat plain cream paper (#f3ecda) completely empty.
1px outline #1f1712. Centered, filling most of the image, on solid flat #00ff00 background. No text.
```

### `card-back.png`
```
16-bit pixel art UI, the back side of a square collectible card, a symmetrical woven bamboo pattern in brown and gold (#6b4226, #b07b46, #d9a11a), a simple lotus rosette in the center, thin gold border.
1px outline #1f1712. Centered, filling most of the image, on solid flat #00ff00 background. No text, no logo, no star.
```

### `card-slot.png`
```
16-bit pixel art UI, an empty square card slot, a dashed cream outline (#e8c49e) with slightly darker inner shadow (#c99c74), mostly transparent-looking inside, faint and subtle.
Centered, filling most of the image, on solid flat #00ff00 background. No text.
```

### `pack.png`
```
16-bit pixel art game item, a closed trading card pack, rectangular and slightly puffy, wrapped in straw-colored rice paper (#e8c49e, #d4a76a) with a subtle woven texture, tied with a red string cross (#a8402b) and a small bow on top, a small blank paper tag hanging from the string.
Light from top left, 1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### Hình minh họa thẻ (64×64) — cảnh vẽ kín ô vuông, có nền

Quy ước chung cho 20 hình: nhỏ gọn, ít chi tiết, đọc được khi nhỏ; khung cảnh vẽ kín cả ô vuông, không viền ngoài, không chữ.

### `art-c1985.png` — Thời bao cấp
```
16-bit pixel art small square illustration, a short line of three villagers in 1980s simple clothes (white shirts, dark trousers, one conical hat) queuing patiently in front of a small cooperative store with a wooden counter, one holding a small paper booklet, bags of rice behind the counter.
Muted warm colors (#b07b46, #e8c49e, #6e5d47), soft afternoon light. Calm, patient, not sad. Full scene filling the whole square, no text, no signs with letters.
```

### `art-c1986.png` — Đại hội VI
```
16-bit pixel art small square illustration, interior of a large formal meeting hall seen from the back of the room, rows of wooden seats with seated people as small simple silhouettes, a podium at the front decorated with big flower arrangements (#d0644a, #f2c14e, #a3b85c), warm light, 1980s style.
Plain warm cream back wall, no flags, no emblems, no portraits, no statues, no banners with text. Full scene filling the whole square.
```

### `art-c1987.png` — Luật Đầu tư nước ngoài
```
16-bit pixel art small square illustration, a new factory building under construction with steel frame and a tall yellow crane (#f2c14e), two small workers in hard hats, a truck delivering materials, blue sky.
Optimistic mood. Full scene filling the whole square, no text, no logos.
```

### `art-c1988.png` — Khoán 10
```
16-bit pixel art small square illustration, a farming family (father, mother, child) harvesting golden rice on their own small field, the father carrying rice sheaves on a shoulder pole, the mother cutting rice with a sickle, the child smiling with a bundle, a small hut in the background.
Golden rice #d9a11a, #f2c14e, green dike, warm sunlight. Happy, proud mood. Full scene filling the whole square, no text.
```

### `art-c1989.png` — Xuất khẩu gạo
```
16-bit pixel art small square illustration, workers carrying rice sacks up a plank onto a cargo ship at a river port, a stack of sacks on the dock, the ship's hull in deep blue, river water with small ripples.
Full scene filling the whole square, no text on the sacks, no flags on the ship.
```

### `art-c1991.png` — Đại hội VII
```
16-bit pixel art small square illustration, interior of a formal meeting hall in the early 1990s, long tables with neat stacks of documents and small microphones, rows of seated people as small simple silhouettes, flower arrangements at the front podium.
Warm cream walls, soft light. No flags, no emblems, no portraits, no statues, no text. Full scene filling the whole square.
```

### `art-c1994.png` — Hoa Kỳ bỏ cấm vận
```
16-bit pixel art small square illustration, a busy seaport in the morning, a crane unloading colorful shipping containers (#a8402b, #2f6db5, #f2c14e) from a cargo ship, seagulls, bright sky.
Full scene filling the whole square, no text, no logos, no flags.
```

### `art-c1995.png` — Gia nhập ASEAN
```
16-bit pixel art small square illustration, ten hands of different skin tones joined together in a circle seen from above, over a round wooden table, with a few green rice stalks in the center.
Friendly, cooperative mood. Full scene filling the whole square, no flags, no symbols, no text.
```

### `art-c1996.png` — Đại hội VIII
```
16-bit pixel art small square illustration, interior of a formal meeting hall, on the back wall a large painted mural of factories, power lines and a highway, rows of seated people as simple silhouettes, flower arrangements at the podium.
No flags, no emblems, no portraits, no statues, no text. Full scene filling the whole square.
```

### `art-c2000.png` — Luật Doanh nghiệp
```
16-bit pixel art small square illustration, a small family shop opening day, the shop owner smiling at the door, a blank colored signboard above (#2f6db5), shelves full of colorful goods, a red ribbon being cut, a few neighbors clapping.
Full scene filling the whole square, no text on the sign.
```

### `art-c2001.png` — Đại hội IX
```
16-bit pixel art small square illustration, interior of a formal meeting hall, on the back wall a large painted mural of a busy market with stalls and shoppers, rows of seated people as simple silhouettes, flower arrangements at the podium.
No flags, no emblems, no portraits, no statues, no text. Full scene filling the whole square.
```

### `art-c2001b.png` — Hiệp định Thương mại Việt Nam – Hoa Kỳ
```
16-bit pixel art small square illustration, a bright garment factory, a row of workers at sewing machines, finished shirts on hangers, sneakers packed in cardboard boxes ready to ship.
Full scene filling the whole square, no text, no logos on boxes.
```

### `art-c2006.png` — Đại hội X
```
16-bit pixel art small square illustration, interior of a formal meeting hall, on the back wall a large painted mural of a bustling town street with shops and motorbikes, rows of seated people as simple silhouettes, flower arrangements at the podium.
No flags, no emblems, no portraits, no statues, no text. Full scene filling the whole square.
```

### `art-c2007.png` — Gia nhập WTO
```
16-bit pixel art small square illustration, a large container ship loaded with colorful containers sailing out of a harbor, a pale globe silhouette with trade route lines in the sky.
Full scene filling the whole square, no text, no logos, no flags.
```

### `art-c2010.png` — Nông thôn mới
```
16-bit pixel art small square illustration, a new clean concrete village road with street lights and flower beds, a two-story yellow school building with children playing in the yard, rice fields behind.
Full scene filling the whole square, no text, no flags.
```

### `art-c2011.png` — Đại hội XI
```
16-bit pixel art small square illustration, interior of a formal meeting hall, on the back wall a large painted mural of a highway, a school and workers in a workshop, rows of seated people as simple silhouettes, flower arrangements at the podium.
No flags, no emblems, no portraits, no statues, no text. Full scene filling the whole square.
```

### `art-c2016.png` — Đại hội XII
```
16-bit pixel art small square illustration, interior of a formal meeting hall, on the back wall a large painted mural of green fields, wind turbines and solar panels, rows of seated people as simple silhouettes, flower arrangements at the podium.
No flags, no emblems, no portraits, no statues, no text. Full scene filling the whole square.
```

### `art-c2020.png` — Chống dịch COVID-19
```
16-bit pixel art small square illustration, villagers wearing face masks handing out bags of rice and vegetables to neighbors from a table under a tree, smiling eyes, caring and warm mood, daylight.
Full scene filling the whole square, no text, no hospital, no sick people.
```

### `art-c2021.png` — Đại hội XIII
```
16-bit pixel art small square illustration, interior of a modern formal meeting hall with large screens on the side walls, on the back wall a large painted mural of a modern city skyline next to rice fields, rows of seated people as simple silhouettes, flower arrangements at the podium.
No flags, no emblems, no portraits, no statues, no text. Full scene filling the whole square.
```

### `art-c2022.png` — Giảm nghèo bền vững
```
16-bit pixel art small square illustration, a smiling rural family receiving young fruit tree seedlings and a cute piglet from a friendly village staff member, in front of their house, a small vegetable garden.
Hopeful, warm mood. Full scene filling the whole square, no text, no uniforms with badges.
```

## E. Hiệu ứng (64×64)

### `fx-correct.png`
```
16-bit pixel art game effect, a bold bright green check mark (#6f8a3a, #a3b85c, #d3e09a highlight) with a thick 1px outline #1f1712, surrounded by four small white and gold sparkles (#fffaf0, #f2c14e).
Centered with empty space around it, on solid flat #00ff00 background. Do not use the exact background green in the check mark. No text.
```

### `fx-wrong.png`
```
16-bit pixel art game effect, a soft rounded red cross mark (#a8402b, #d0644a) with a 1px outline #1f1712, gentle and friendly not scary, two tiny grey puffs beside it.
Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### `fx-sparkle.png`
```
16-bit pixel art game effect, a burst of golden four-pointed sparkles and small stars (#f2c14e, #fbe3a1, #fffaf0) radiating from the center, one big sparkle in the middle and 6 small ones around.
Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### `fx-confetti.png`
```
16-bit pixel art game effect, a burst of small rectangular paper confetti pieces in red, gold, blue, cream and purple (#a8402b, #f2c14e, #5c9bd1, #fffaf0, #8a6bc4) flying outward from the center, some tilted.
Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### `fx-steal.png`
```
16-bit pixel art game effect, a playful cartoon hand in a cream sleeve quickly grabbing a small square card, with three motion lines behind it, mischievous and funny not criminal.
Skin #e8c49e, card cream with gold border. 1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### `fx-robbed.png`
```
16-bit pixel art game effect, an empty square card slot with a dashed outline (#e8c49e) and a small cartoon puff of dust (#c99c74) where the card used to be, a tiny question mark shape made of dust swirl, playful.
Centered with empty space around it, on solid flat #00ff00 background. No text characters.
```

### `fx-combo.png`
```
16-bit pixel art game effect, a small rising flame made of warm sparkles (#d0644a, #f2c14e, #fbe3a1), teardrop shape, cheerful and magical not dangerous.
1px outline #6e2418. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### `fx-bonus.png`
```
16-bit pixel art game effect, a small pile of gold coins with square holes (#d9a11a, #f2c14e) and a radial burst of light rays behind it (#fbe3a1).
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

### `fx-levelup.png`
```
16-bit pixel art game effect, a bold golden upward arrow (#d9a11a, #f2c14e) with a trail of small sparkles below it (#fffaf0).
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

## F. Biểu tượng giao diện (32×32)

Mỗi biểu tượng: nét đậm, ít chi tiết, đọc được ở 16 pixel; viền 1px `#1f1712`; giữa ảnh; nền `#00ff00`; không chữ.

### `ui-clock.png`
```
16-bit pixel art UI icon, a small round wall clock with a wooden rim (#8a5a33), cream face (#f3ecda), two dark hands pointing to ten and two, no numbers. 1px outline #1f1712. Centered, solid flat #00ff00 background.
```

### `ui-score.png`
```
16-bit pixel art UI icon, a small neat pile of three gold coins with square holes (#d9a11a, #f2c14e, #fbe3a1 highlight). 1px outline #1f1712. Centered, solid flat #00ff00 background.
```

### `ui-cards.png`
```
16-bit pixel art UI icon, a small fanned stack of three square cards, back card wooden brown, middle blue, front gold, each with cream center. 1px outline #1f1712. Centered, solid flat #00ff00 background.
```

### `ui-players.png`
```
16-bit pixel art UI icon, two small friendly villager heads side by side, one wearing a conical hat (#e8c49e), one with short black hair, simple smiling faces. 1px outline #1f1712. Centered, solid flat #00ff00 background.
```

### `ui-question.png`
```
16-bit pixel art UI icon, a small open book with cream pages (#f3ecda) and a brown cover (#8a5a33), a tiny bookmark ribbon in red (#a8402b). 1px outline #1f1712. Centered, solid flat #00ff00 background.
```

### `ui-crown.png`
```
16-bit pixel art UI icon, a golden conical hat (nón lá) (#d9a11a, #f2c14e) seen from the side with two small sparkles (#fffaf0), used as a winner crown. 1px outline #1f1712. Centered, solid flat #00ff00 background.
```

### `ui-rank-1.png`
```
16-bit pixel art UI icon, a round gold medal (#d9a11a, #f2c14e) with a short red ribbon (#a8402b) on top, a simple lotus shape engraved, no numbers. 1px outline #1f1712. Centered, solid flat #00ff00 background.
```

### `ui-rank-2.png`
```
16-bit pixel art UI icon, a round silver medal (#9aa3a8, #e2f1f8) with a short red ribbon (#a8402b) on top, a simple lotus shape engraved, no numbers. 1px outline #1f1712. Centered, solid flat #00ff00 background.
```

### `ui-rank-3.png`
```
16-bit pixel art UI icon, a round bronze medal (#9c6b1f, #b07b46) with a short red ribbon (#a8402b) on top, a simple lotus shape engraved, no numbers. 1px outline #1f1712. Centered, solid flat #00ff00 background.
```

### `ui-offline.png`
```
16-bit pixel art UI icon, a small grey cloud (#9aa3a8) with a broken zigzag line under it showing lost connection. 1px outline #1f1712. Centered, solid flat #00ff00 background.
```

### `ui-keys.png`
```
16-bit pixel art UI icon, two small square keyboard keys side by side in cream (#f3ecda) with dark arrow shapes pointing left and right, slight 3d bevel. 1px outline #1f1712. Centered, solid flat #00ff00 background. No letters.
```

### `ui-touch.png`
```
16-bit pixel art UI icon, a small hand with the index finger touching a phone screen, with two small curved touch ripple lines. Skin #e8c49e, phone dark #3b2c22. 1px outline #1f1712. Centered, solid flat #00ff00 background.
```

## G. Khung giao diện (128×128)

Game kéo giãn phần giữa (9-slice), nên **4 góc là trang trí, 4 cạnh lặp đều, giữa trơn một màu**.

### `panel-wood.png`
```
16-bit pixel art UI panel, a square wooden frame with decorative carved corners and evenly repeating plank edges (#6b4226, #8a5a33, #b07b46), the entire center is one flat plain color (#d4a76a) with no texture.
Symmetrical, suitable for 9-slice scaling. 1px outline #1f1712. Filling most of the image, solid flat #00ff00 background. No text.
```

### `panel-paper.png`
```
16-bit pixel art UI panel, a square sheet of aged cream rice paper with slightly torn decorative edges and soft shading at the border (#e8c49e, #c99c74), the entire center is one flat plain color (#f3ecda).
Symmetrical, suitable for 9-slice scaling. Filling most of the image, solid flat #00ff00 background. No text.
```

### `btn.png`
```
16-bit pixel art UI button, a square wooden button with a raised bevel: light top-left edge #d4a76a, dark bottom-right edge #6b4226, flat center #b07b46.
Symmetrical, suitable for 9-slice scaling. 1px outline #1f1712. Filling most of the image, solid flat #00ff00 background. No text.
```

### `btn-pressed.png`
```
16-bit pixel art UI button pressed down, a square wooden button with a sunken bevel: dark top-left edge #6b4226, light bottom-right edge #d4a76a, flat center slightly darker #8a5a33.
Symmetrical, suitable for 9-slice scaling. 1px outline #1f1712. Filling most of the image, solid flat #00ff00 background. No text.
```

### `question-board.png`
```
16-bit pixel art UI panel, a square school blackboard with a wooden frame (#8a5a33, #b07b46) and a small chalk tray at the bottom with one white chalk stick, the entire center is one flat plain dark green (#2e4a1f).
Suitable for 9-slice scaling. 1px outline #1f1712. Filling most of the image, solid flat #00ff00 background. No text, no chalk writing.
```

## H. Màn hình chiếu

### `host-bg.png` (256×256, nền đặc)
```
16-bit pixel art game background, the courtyard of a traditional Vietnamese village communal house (đình làng) at festival time in the evening, curved tiled roof with upturned corners in the middle band, strings of red paper lanterns (#a8402b, #f2c14e glow), a crowd of happy villagers as simple silhouettes, a big old banyan tree on one side.
Warm festive light. Main details in the middle horizontal band, simple dark sky on top, simple stone courtyard at bottom. No flags, no banners with text, no emblems.
```

### `host-banner.png` (128×128)
```
16-bit pixel art UI, a long horizontal red festive paper banner (#a8402b, #d0644a) with gold trim (#d9a11a) and small gold tassels hanging from both ends, the center area plain red and empty for text added later.
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text, no symbols.
```

### `podium.png` (128×128)
```
16-bit pixel art game object, a three-step wooden winner podium seen from the front, the middle step tallest, left step medium, right step lowest, each step covered with red cloth (#a8402b) with gold edges (#d9a11a), small flower pots at the base.
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No numbers, no text.
```

### `lantern.png` (64×64)
```
16-bit pixel art game object, a round red Vietnamese paper lantern (#a8402b, #d0644a, #eb9a7c highlight) with gold caps (#d9a11a) on top and bottom, a gold tassel hanging below and a short string on top, soft warm glow.
1px outline #1f1712. Centered with empty space around it, on solid flat #00ff00 background. No text.
```

## I. Nhân vật ★ (64×64, chân dung bán thân)

Quy ước chung: đầu to, mắt tròn đơn giản, má hồng `#eb9a7c`, da `#e8c49e` hoặc `#c99c74`, nét dễ thương kiểu game; không phù hiệu, không sao đỏ, không đồng phục có huy hiệu.

### `ava-1.png`
```
16-bit pixel art cute chibi bust portrait, a cheerful village kid wearing a conical palm-leaf hat (#e8c49e), white shirt, big smile, rosy cheeks. 1px outline #1f1712. Centered, solid flat #00ff00 background. No badge, no text.
```

### `ava-2.png`
```
16-bit pixel art cute chibi bust portrait, a girl with two long black braids tied with small red ribbons, plain white school shirt, bright smile. 1px outline #1f1712. Centered, solid flat #00ff00 background. No badge, no text.
```

### `ava-3.png`
```
16-bit pixel art cute chibi bust portrait, a boy with short black hair and a plain red scarf around his neck, cheeky grin, plain light blue shirt. 1px outline #1f1712. Centered, solid flat #00ff00 background. No star, no badge, no text.
```

### `ava-4.png`
```
16-bit pixel art cute chibi bust portrait, a friendly young farmer with a straw hat, a small towel on one shoulder, brown shirt, tanned skin, warm smile. 1px outline #1f1712. Centered, solid flat #00ff00 background. No text.
```

### `ava-5.png`
```
16-bit pixel art cute chibi bust portrait, a studious young person with round glasses holding a small book to the chest, neat hair, cream sweater, gentle smile. 1px outline #1f1712. Centered, solid flat #00ff00 background. No text.
```

### `ava-6.png`
```
16-bit pixel art cute chibi bust portrait, a young factory worker with a plain blue cap and plain blue work jacket, confident smile. 1px outline #1f1712. Centered, solid flat #00ff00 background. No logo, no badge, no text.
```

### `ava-7.png`
```
16-bit pixel art cute chibi bust portrait, a young shopkeeper with hair in a bun, a striped apron, holding a small basket of fruit, cheerful. 1px outline #1f1712. Centered, solid flat #00ff00 background. No text.
```

### `ava-8.png`
```
16-bit pixel art cute chibi bust portrait, a kind smiling grandma with a dark headscarf, grey hair strands, traditional brown blouse, warm eyes. 1px outline #1f1712. Centered, solid flat #00ff00 background. No text.
```

### `ava-9.png`
```
16-bit pixel art cute chibi bust portrait, a baby water buffalo calf with small curved horns, grey-brown fur (#6e5d47, #9aa3a8), big round friendly eyes, a tiny flower behind one ear. 1px outline #1f1712. Centered, solid flat #00ff00 background. No text.
```

### `ava-10.png`
```
16-bit pixel art cute chibi bust portrait, a fluffy yellow duckling (#f2c14e, #fbe3a1) with an orange beak (#d0644a), tiny wings raised happily. 1px outline #1f1712. Centered, solid flat #00ff00 background. No text.
```

---

# PHẦN 2 — ANIMATION (sprite sheet)

**Câu khung chung** đã có sẵn trong từng prompt dưới đây. Mỗi ảnh là một lưới khung, đọc từ trái sang phải, trên xuống dưới. Giữ cùng seed khi tạo lại.

## 1. Nên làm

### `anim/coin-spin.png` — 6 khung, lưới 3×2, mỗi khung 32×32
```
16-bit pixel art animation sprite sheet, 6 frames in a 3 by 2 grid, read left to right then top to bottom, a small round old gold coin with a square hole spinning around its vertical axis.
Frame 1: coin seen fully from the front, round. Frame 2: coin turned slightly, oval and narrower. Frame 3: coin turned more, thin oval. Frame 4: coin edge-on, a thin vertical gold bar. Frame 5: thin oval turning back. Frame 6: slightly narrower oval, almost front again.
Gold #d9a11a, rim #f2c14e, highlight #fbe3a1, shade #9c6b1f, 1px outline #1f1712. Same size, same center position in every frame, only the rotation changes. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

### `anim/basket-catch.png` — 4 khung, lưới 2×2, mỗi khung 64×64
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a traditional Vietnamese woven bamboo basket (thúng) seen from the front catching an object, squash and stretch.
Frame 1: normal shape, wide and shallow. Frame 2: squashed down, wider and flatter. Frame 3: stretched up slightly taller and narrower. Frame 4: back to normal with three tiny gold sparkles above the rim.
Woven pattern #b07b46 and #d4a76a, rim #6b4226, 1px outline #1f1712. Bottom of the basket stays on the same line in every frame. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

### `anim/pack-open.png` — 6 khung, lưới 3×2, mỗi khung 128×128
```
16-bit pixel art animation sprite sheet, 6 frames in a 3 by 2 grid, read left to right then top to bottom, a trading card pack wrapped in straw-colored rice paper tied with a red string cross, opening.
Frame 1: closed pack, still. Frame 2: pack tilted and shaking with small motion lines. Frame 3: red string snapping loose. Frame 4: paper tearing open at the top, a crack of golden light. Frame 5: bright golden light bursting out of the top. Frame 6: large burst of light rays and sparkles, the pack mostly hidden by light.
Paper #e8c49e and #d4a76a, string #a8402b, light #f2c14e and #fffaf0, 1px outline #1f1712. Same size and position in every frame. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

### `anim/fx-sparkle.png` — 4 khung, lưới 2×2, mỗi khung 64×64
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a golden sparkle burst effect.
Frame 1: a tiny bright dot of light in the center. Frame 2: a small four-pointed star with short rays. Frame 3: a large four-pointed star with six small sparkles scattered around. Frame 4: only the small scattered sparkles remain, fading and smaller.
Colors #f2c14e, #fbe3a1, #fffaf0. Same center position in every frame. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

### `anim/fx-correct.png` — 4 khung, lưới 2×2, mỗi khung 64×64
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a bold green check mark popping in.
Frame 1: a small check mark. Frame 2: an oversized check mark slightly bigger than final. Frame 3: check mark at normal size with four small sparkles around. Frame 4: check mark at normal size with sparkles fading away.
Check colors #4f6b2c, #6f8a3a, #a3b85c, highlight #d3e09a, sparkles #f2c14e and #fffaf0, 1px outline #1f1712. Do not use the exact background green in the check. Same center in every frame. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

### `anim/fx-steal.png` — 4 khung, lưới 2×2, mỗi khung 64×64
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a playful cartoon hand snatching a small square card, funny and mischievous not criminal.
Frame 1: open hand in a cream sleeve reaching in from the right toward a card on the left. Frame 2: fingertips touching the card. Frame 3: hand gripping the card. Frame 4: hand pulling the card away to the right with three motion lines.
Skin #e8c49e, sleeve #f3ecda, card cream with a gold border #d9a11a, 1px outline #1f1712. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

### `anim/fx-combo.png` — 4 khung, lưới 2×2, mỗi khung 64×64 (lặp)
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a small magical flame made of warm sparkles flickering in a seamless loop, cheerful not dangerous.
Frame 1: short round flame. Frame 2: tall pointed flame. Frame 3: flame leaning left. Frame 4: flame leaning right.
Colors #d0644a outer, #f2c14e middle, #fbe3a1 core, 1px outline #6e2418. Base of the flame stays at the same point in every frame. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

### `anim/fx-confetti.png` — 4 khung, lưới 2×2, mỗi khung 64×64
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a burst of small rectangular paper confetti.
Frame 1: a tight cluster of confetti in the center. Frame 2: confetti bursting outward in all directions. Frame 3: confetti spread wide, starting to fall and tilt. Frame 4: only a few pieces drifting down near the bottom.
Colors #a8402b, #f2c14e, #5c9bd1, #fffaf0, #8a6bc4. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

## 2. Tùy chọn

### `anim/tag-swing.png` — 4 khung, 2×2, mỗi khung 64×64 (lặp)
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a blank wooden signboard hanging from a rope loop, swinging gently in a seamless loop.
Frame 1: tilted about 10 degrees left. Frame 2: straight. Frame 3: tilted about 10 degrees right. Frame 4: straight.
Wood #b07b46, grain #8a5a33, frame #6b4226, plain center #d4a76a, 1px outline #1f1712. The rope top point stays fixed in every frame. Frames evenly spaced and not touching, solid flat #00ff00 background. No text on the sign.
```

### `anim/basket-wide.png` — 4 khung, 2×2, mỗi khung 64×64
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a woven bamboo basket stretching wider when powered up.
Frame 1: normal width basket. Frame 2: wider basket with a faint purple glow. Frame 3: widest basket with a strong purple glow and two small sparkles. Frame 4: widest basket with a steady soft purple glow.
Basket #b07b46 and #d4a76a, glow #8a6bc4 and #4b2a7b, 1px outline #1f1712. Bottom line and horizontal center stay fixed. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

### `anim/buff-wide.png` — 2 khung, 2×1, mỗi khung 32×32 (lặp)
```
16-bit pixel art animation sprite sheet, 2 frames side by side, a power-up icon of a small bamboo basket with two outward arrows inside a rounded square badge.
Frame 1: dim purple border glow (#4b2a7b), arrows close to the basket. Frame 2: bright purple border glow (#8a6bc4), arrows pushed further outward.
Basket #b07b46, arrows #fffaf0, 1px outline #1f1712. Same badge size and position. Not touching, solid flat #00ff00 background. No text.
```

### `anim/buff-slow.png` — 4 khung, 2×2, mỗi khung 32×32 (lặp)
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a power-up icon of a wooden hourglass inside a rounded square badge with purple glow, sand flowing.
Frame 1: sand full in the top bulb. Frame 2: thin stream of sand falling, top bulb two thirds. Frame 3: sand mostly in the bottom bulb. Frame 4: hourglass tilted mid-flip.
Frame #8a5a33, sand #f2c14e, glass #e2f1f8, badge #4b2a7b with glow #8a6bc4, 1px outline #1f1712. Not touching, solid flat #00ff00 background. No text.
```

### `anim/buff-x2.png` — 2 khung, 2×1, mỗi khung 32×32 (lặp)
```
16-bit pixel art animation sprite sheet, 2 frames side by side, a power-up icon of two stacked gold coins inside a rounded square badge with purple glow.
Frame 1: coins still, no sparkle. Frame 2: coins shining with a bright highlight and two white sparkles.
Coins #d9a11a and #f2c14e, sparkles #fffaf0, badge #4b2a7b with glow #8a6bc4, 1px outline #1f1712. Not touching, solid flat #00ff00 background. No text, no number 2.
```

### ★ `anim/hazard-mud.png` — 3 khung, 3×1, mỗi khung 32×32
```
16-bit pixel art animation sprite sheet, 3 frames side by side, a funny round blob of brown mud hitting the ground.
Frame 1: round mud blob in the air. Frame 2: blob flattening into a splat. Frame 3: wide flat splash with four small droplets flying out.
Mud #6b4226 and #8a5a33, highlight #b07b46, 1px outline #1f1712. Ground line fixed in every frame. Not touching, solid flat #00ff00 background. No text.
```

### `anim/fx-wrong.png` — 3 khung, 3×1, mỗi khung 64×64
```
16-bit pixel art animation sprite sheet, 3 frames side by side, a soft rounded red cross mark, gentle not scary.
Frame 1: small cross appearing. Frame 2: full cross shifted slightly left. Frame 3: full cross shifted slightly right (a little shake).
Cross #a8402b and #d0644a, 1px outline #1f1712. Not touching, solid flat #00ff00 background. No text.
```

### `anim/fx-robbed.png` — 4 khung, 2×2, mỗi khung 64×64
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a card disappearing from its slot, playful.
Frame 1: a square card sitting inside a dashed slot. Frame 2: the card lifting up out of the slot. Frame 3: empty slot with a cartoon puff of dust. Frame 4: empty slot with the dust puff fading.
Card cream with gold border, slot outline #e8c49e, dust #c99c74, 1px outline #1f1712. Slot stays fixed. Not touching, solid flat #00ff00 background. No text.
```

### `anim/fx-bonus.png` — 4 khung, 2×2, mỗi khung 64×64
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a pile of gold coins celebrating.
Frame 1: small still pile of coins. Frame 2: three coins jumping up from the pile. Frame 3: coins landing back with a burst of light rays behind. Frame 4: shining pile with soft light rays.
Coins #d9a11a and #f2c14e, light #fbe3a1, 1px outline #1f1712. Pile base fixed. Not touching, solid flat #00ff00 background. No text.
```

### `anim/fx-levelup.png` — 3 khung, 3×1, mỗi khung 64×64
```
16-bit pixel art animation sprite sheet, 3 frames side by side, a bold golden upward arrow rising.
Frame 1: arrow low in the frame. Frame 2: arrow in the middle with a short sparkle trail. Frame 3: arrow high with a long sparkle trail below.
Arrow #d9a11a and #f2c14e, sparkles #fffaf0, 1px outline #1f1712. Not touching, solid flat #00ff00 background. No text.
```

### `anim/lantern.png` — 4 khung, 2×2, mỗi khung 64×64 (lặp)
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a round red Vietnamese paper lantern with gold caps and a gold tassel, swinging gently in a seamless loop.
Frame 1: tilted left. Frame 2: straight. Frame 3: tilted right. Frame 4: straight. The tassel lags slightly behind the swing.
Lantern #a8402b and #d0644a, glow #eb9a7c, caps #d9a11a, 1px outline #1f1712. The hanging string top point stays fixed. Not touching, solid flat #00ff00 background. No text.
```

### `anim/podium-crown.png` — 4 khung, 2×2, mỗi khung 32×32 (lặp)
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a golden conical hat (nón lá) used as a winner crown, floating up and down in a seamless loop.
Frame 1: low position. Frame 2: high position. Frame 3: low position with a small sparkle. Frame 4: high position with a small sparkle on the other side.
Hat #d9a11a and #f2c14e, sparkles #fffaf0, 1px outline #1f1712. Not touching, solid flat #00ff00 background. No text.
```

### `anim/card-epic-shine.png` — 4 khung, 2×2, mỗi khung 128×128
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a square collectible card frame with a rich gold lacquer border and lotus motifs in the corners, plain empty cream center, a diagonal white shine sweeping across.
Frame 1: thin diagonal shine at the top left corner. Frame 2: shine across the center. Frame 3: shine at the bottom right corner. Frame 4: no shine.
Border #9c6b1f, #d9a11a, #f2c14e, lotus #eb9a7c, center #f3ecda, shine #fffaf0, 1px outline #1f1712. Card identical in every frame except the shine. Not touching, solid flat #00ff00 background. No text.
```

### `anim/card-rare-shine.png` — 4 khung, 2×2, mỗi khung 128×128
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a square collectible card frame with a deep blue lacquer border and bamboo leaf motifs in the corners, plain empty cream center, a diagonal white shine sweeping across.
Frame 1: thin diagonal shine at the top left corner. Frame 2: shine across the center. Frame 3: shine at the bottom right corner. Frame 4: no shine.
Border #1f3d5c, #2f6db5, #5c9bd1, leaves #a3b85c, center #f3ecda, shine #fffaf0, 1px outline #1f1712. Card identical in every frame except the shine. Not touching, solid flat #00ff00 background. No text.
```

## 3. Nhân vật ★ — 6 khung, lưới 3×2, mỗi khung 64×64

Mỗi prompt dưới đây là một nhân vật đầy đủ 6 khung: 1–2 đứng yên và chớp mắt, 3–4 vui (trả lời đúng, cướp được thẻ), 5–6 ngạc nhiên và phụng phịu (bị cướp thẻ).

### `anim/ava-1.png`
```
16-bit pixel art animation sprite sheet, 6 frames in a 3 by 2 grid, read left to right then top to bottom, cute chibi bust portrait of a cheerful village kid wearing a conical palm-leaf hat (#e8c49e) and a white shirt, rosy cheeks (#eb9a7c).
Frame 1: idle, gentle smile. Frame 2: idle, eyes closed blinking. Frame 3: happy, arms raised cheering, big open smile. Frame 4: happy, laughing with eyes closed. Frame 5: surprised, eyes wide, small round mouth. Frame 6: pouting playfully, puffed cheeks.
Same character, same size and same head position in every frame, only the expression and arms change. 1px outline #1f1712. Frames evenly spaced and not touching, solid flat #00ff00 background. No badge, no text.
```

### `anim/ava-2.png`
```
16-bit pixel art animation sprite sheet, 6 frames in a 3 by 2 grid, read left to right then top to bottom, cute chibi bust portrait of a girl with two long black braids tied with small red ribbons and a plain white school shirt.
Frame 1: idle, gentle smile. Frame 2: idle, blinking. Frame 3: happy, arms raised cheering. Frame 4: happy, laughing with eyes closed, braids bouncing. Frame 5: surprised, eyes wide. Frame 6: pouting playfully.
Same character, same size and head position in every frame. 1px outline #1f1712. Frames evenly spaced and not touching, solid flat #00ff00 background. No badge, no text.
```

### `anim/ava-3.png`
```
16-bit pixel art animation sprite sheet, 6 frames in a 3 by 2 grid, read left to right then top to bottom, cute chibi bust portrait of a boy with short black hair, a plain red scarf and a light blue shirt.
Frame 1: idle, cheeky grin. Frame 2: idle, blinking. Frame 3: happy, fist pump in the air. Frame 4: happy, laughing with eyes closed. Frame 5: surprised, eyes wide, hands on cheeks. Frame 6: pouting with arms crossed.
Same character, same size and head position in every frame. 1px outline #1f1712. Frames evenly spaced and not touching, solid flat #00ff00 background. No star, no badge, no text.
```

### `anim/ava-4.png`
```
16-bit pixel art animation sprite sheet, 6 frames in a 3 by 2 grid, read left to right then top to bottom, cute chibi bust portrait of a friendly young farmer with a straw hat, a small towel on one shoulder and a brown shirt, tanned skin (#c99c74).
Frame 1: idle, warm smile. Frame 2: idle, blinking. Frame 3: happy, waving the towel in the air. Frame 4: happy, laughing. Frame 5: surprised, hat slightly lifted. Frame 6: pouting, scratching head.
Same character, same size and head position in every frame. 1px outline #1f1712. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

### `anim/ava-5.png`
```
16-bit pixel art animation sprite sheet, 6 frames in a 3 by 2 grid, read left to right then top to bottom, cute chibi bust portrait of a studious young person with round glasses, neat hair and a cream sweater, holding a small book.
Frame 1: idle, gentle smile holding the book. Frame 2: idle, blinking. Frame 3: happy, holding the book up high. Frame 4: happy, glasses shining, laughing. Frame 5: surprised, glasses slipping down the nose. Frame 6: pouting, hugging the book.
Same character, same size and head position in every frame. 1px outline #1f1712. Frames evenly spaced and not touching, solid flat #00ff00 background. No text on the book.
```

### `anim/ava-6.png`
```
16-bit pixel art animation sprite sheet, 6 frames in a 3 by 2 grid, read left to right then top to bottom, cute chibi bust portrait of a young factory worker with a plain blue cap and a plain blue work jacket.
Frame 1: idle, confident smile. Frame 2: idle, blinking. Frame 3: happy, thumbs up. Frame 4: happy, laughing, cap tilted. Frame 5: surprised, eyes wide. Frame 6: pouting, pulling the cap down.
Same character, same size and head position in every frame. 1px outline #1f1712. Frames evenly spaced and not touching, solid flat #00ff00 background. No logo, no badge, no text.
```

### `anim/ava-7.png`
```
16-bit pixel art animation sprite sheet, 6 frames in a 3 by 2 grid, read left to right then top to bottom, cute chibi bust portrait of a young shopkeeper with hair in a bun and a striped apron, holding a small basket of fruit.
Frame 1: idle, cheerful smile. Frame 2: idle, blinking. Frame 3: happy, lifting the fruit basket. Frame 4: happy, laughing. Frame 5: surprised, a fruit jumping out of the basket. Frame 6: pouting playfully.
Same character, same size and head position in every frame. 1px outline #1f1712. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

### `anim/ava-8.png`
```
16-bit pixel art animation sprite sheet, 6 frames in a 3 by 2 grid, read left to right then top to bottom, cute chibi bust portrait of a kind grandma with a dark headscarf, grey hair strands and a traditional brown blouse.
Frame 1: idle, warm smile. Frame 2: idle, blinking. Frame 3: happy, clapping hands. Frame 4: happy, laughing with eyes closed. Frame 5: surprised, hand on chest. Frame 6: pretend pouting, wagging a finger playfully.
Same character, same size and head position in every frame. 1px outline #1f1712. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

### `anim/ava-9.png`
```
16-bit pixel art animation sprite sheet, 6 frames in a 3 by 2 grid, read left to right then top to bottom, cute chibi bust portrait of a baby water buffalo calf with small curved horns, grey-brown fur (#6e5d47, #9aa3a8), big round eyes and a tiny flower behind one ear.
Frame 1: idle, gentle face. Frame 2: idle, blinking. Frame 3: happy, ears up, big smile. Frame 4: happy, laughing, eyes closed. Frame 5: surprised, eyes wide, ears straight. Frame 6: pouting, ears drooping playfully.
Same character, same size and head position in every frame. 1px outline #1f1712. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

### `anim/ava-10.png`
```
16-bit pixel art animation sprite sheet, 6 frames in a 3 by 2 grid, read left to right then top to bottom, cute chibi bust portrait of a fluffy yellow duckling (#f2c14e, #fbe3a1) with an orange beak (#d0644a).
Frame 1: idle. Frame 2: blinking. Frame 3: happy, tiny wings raised. Frame 4: happy, beak open quacking with eyes closed. Frame 5: surprised, feathers puffed up. Frame 6: pouting, beak pointing sideways.
Same character, same size and head position in every frame. 1px outline #1f1712. Frames evenly spaced and not touching, solid flat #00ff00 background. No text.
```

## 4. Nền động

### `anim/rice-sway.png` — 4 khung, 2×2, mỗi khung 32×32 (lặp)
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a small clump of rice plants swaying in the wind in a seamless loop.
Frame 1: upright. Frame 2: tips bending to the right. Frame 3: upright. Frame 4: tips bending to the left. Roots stay fixed at the bottom.
Green #4f6b2c, #6f8a3a, #a3b85c, ripe tips #f2c14e, 1px outline #2e4a1f. Not touching, solid flat #00ff00 background. No text.
```

### `anim/water-shimmer.png` — 3 khung, 3×1, mỗi khung 64×64 (lặp)
```
16-bit pixel art animation sprite sheet, 3 frames side by side, a small oval patch of pond water with light ripple highlights moving in a seamless loop.
Frame 1: highlights on the left. Frame 2: highlights in the center. Frame 3: highlights on the right.
Water #2f6db5 and #5c9bd1, highlights #a9d0ec and #e2f1f8. Oval shape identical in every frame. Not touching, solid flat #00ff00 background. No text.
```

### `anim/bird-fly.png` — 4 khung, 2×2, mỗi khung 32×32 (lặp)
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a small white egret flying from left to right seen from the side, wing flap loop.
Frame 1: wings fully up. Frame 2: wings level. Frame 3: wings fully down. Frame 4: wings level.
Feathers #fffaf0 and #e2f1f8, beak and legs #f2c14e, 1px outline #3b2c22. Body position fixed. Not touching, solid flat #00ff00 background. No text.
```

### `anim/smoke-chimney.png` — 4 khung, 2×2, mỗi khung 32×32 (lặp)
```
16-bit pixel art animation sprite sheet, 4 frames in a 2 by 2 grid, read left to right then top to bottom, a soft puff of kitchen smoke rising, seamless loop.
Frame 1: small round puff at the bottom. Frame 2: puff rising and growing. Frame 3: puff spreading wider near the top. Frame 4: puff fading, almost gone.
Smoke #e2f1f8 and #9aa3a8, soft 1px outline #9aa3a8. Bottom start point fixed. Not touching, solid flat #00ff00 background. No text.
```

---

## Kiểm tra trước khi gửi

- [ ] Không có chữ, số, cờ, huy hiệu, ngôi sao, chân dung.
- [ ] Nền xanh `#00ff00` trơn (trừ ảnh nền và hình thẻ `art-…`).
- [ ] Vật không chạm mép ảnh; các khung animation không chạm nhau.
- [ ] Đúng tên file, đúng thư mục.

---

# PHẦN 3 — NÔNG SẢN VIỆT (hứng theo đáp án), 32×32

Mỗi câu hỏi gắn 3 đáp án với 3 loại nông sản; đồ rơi liên tục ~8 giây, hứng đúng loại được điểm.
Đuôi chung (đã có trong từng prompt): `single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo`.
Không cho xuất hiện cùng câu: cà phê và vải; lúa và ngô; xoài và chuối; thanh long và điều. Đã bỏ cá tra và tôm.

| File | Nông sản | Hình nhận diện | Prompt |
| --- | --- | --- | --- |
| `crop-lua.png` | Lúa gạo | Bó lúa vàng cong | `16-bit pixel art farm produce icon, a tied bundle of ripe golden rice stalks with heavy drooping grain heads (#d9a11a, #f2c14e) and a red string tie, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-caphe.png` | Cà phê | Cành quả đỏ, lá xanh bóng | `16-bit pixel art farm produce icon, a short coffee branch with a cluster of round shiny red ripe coffee cherries (#a8402b, #d0644a) and two glossy dark green leaves, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-tieu.png` | Hồ tiêu | Chùm dài hạt xanh | `16-bit pixel art farm produce icon, a long hanging spike of fresh green peppercorns (#4f6b2c, #a3b85c) like a small bead string, with one heart-shaped leaf on top, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-dieu.png` | Hạt điều | Quả điều đỏ cam + hạt cong bên dưới | `16-bit pixel art farm produce icon, a cashew apple, bell-shaped bright orange-red fruit (#d0644a, #f2c14e) with the curved grey-brown kidney-shaped cashew nut hanging below it, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-che.png` | Chè (trà) | Búp chè, lá non | `16-bit pixel art farm produce icon, a fresh tea shoot with one bud and two young bright green leaves (#6f8a3a, #a3b85c, #d3e09a) with serrated edges, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-caosu.png` | Cao su | Chén hứng mủ trắng | `16-bit pixel art farm produce icon, a small coconut-shell cup filled with white natural rubber latex (#fffaf0) with a white drip falling into it from a short spout, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-thanhlong.png` | Thanh long | Quả hồng có tai xanh | `16-bit pixel art farm produce icon, a dragon fruit with bright pink-red skin (#d0644a, #eb9a7c) and green-tipped pointed scales, oval shape, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-san.png` | Sắn (khoai mì) | Củ dài nâu, ruột trắng | `16-bit pixel art farm produce icon, two long tapered cassava roots with rough brown bark skin (#6b4226, #8a5a33), one cut end showing white flesh (#fffaf0), single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-ngo.png` | Ngô | Bắp vàng, vỏ xanh mở | `16-bit pixel art farm produce icon, an ear of corn with plump yellow kernels (#f2c14e, #d9a11a) and green husk leaves peeled back, a few brown silk threads on top, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-dua.png` | Dừa | Quả tròn xanh có ống hút | `16-bit pixel art farm produce icon, a whole green young coconut (#6f8a3a, #a3b85c) with the top cut open and a straw sticking out, round chunky shape, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-xoai.png` | Xoài | Quả bầu dục vàng cam | `16-bit pixel art farm produce icon, a ripe Vietnamese mango, curved oval shape, golden yellow to orange skin (#f2c14e, #d0644a) with a small green stem and one leaf, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-vai.png` | Vải thiều | Chùm quả đỏ sần | `16-bit pixel art farm produce icon, a small cluster of three lychees with bumpy dark red skin (#6e2418, #a8402b) on a short branch with two green leaves, one half peeled showing white flesh, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-saurieng.png` | Sầu riêng | Quả bầu dục đầy gai xanh | `16-bit pixel art farm produce icon, a durian, large oval fruit covered in sharp olive-green spikes (#4f6b2c, #a3b85c) with a short brown stem, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-chuoi.png` | Chuối | Nải 3 quả vàng cong | `16-bit pixel art farm produce icon, a small bunch of three ripe yellow bananas (#f2c14e, #d9a11a) with brown tips, curved shape, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
| `crop-mia.png` | Mía | Hai cây mía tím có đốt | `16-bit pixel art farm produce icon, two straight purple sugarcane stalks (#4b2a7b, #8a6bc4) with visible joint rings and a few long green leaves at the top, standing upright, single object centered with empty space around it, 1px dark outline #1f1712, light from top left, chunky readable silhouette, solid flat #00ff00 background, no text, no logo` |
