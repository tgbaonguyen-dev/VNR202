# SRS (bản rút gọn)

Game chưa có tên. Phiên bản 0.2: trang tĩnh trên Vercel, không máy chủ.

## 1. Giới thiệu

**Mục đích.** Minigame trình duyệt cho phần tương tác môn VNR202, chủ đề thành tựu công cuộc Đổi mới. Người chơi sống một đời từ 1985 đến 2025 và thấy thành tựu Đổi mới qua đời sống của nhân vật.

**Phạm vi.** Có: game một người chơi trên trình duyệt, tấm thẻ cuộc đời lưu thành ảnh. Không có: tài khoản, máy chủ, cơ sở dữ liệu, trang admin, màn hình tổng hợp, bảng xếp hạng, MC dẫn dắt.

**Người dùng.** Sinh viên trong lớp, vào bằng link hoặc QR, tự chơi theo hướng dẫn trên màn hình.

## 2. Ràng buộc

- Desktop trước (1280–1440px), điện thoại dùng được.
- Tiếng Việt, font đủ dấu.
- Không thu thập dữ liệu người chơi. Biệt danh chỉ nằm trong trình duyệt.
- Số liệu thật phải có nguồn và link. Mốc lịch sử chỉ ghi năm.
- Không nội dung đau buồn; không xếp hạng giàu nghèo.

## 3. Yêu cầu chức năng

P0 bắt buộc · P1 nên có · P2 nếu còn thời gian. Cột cuối là trạng thái trong code hiện tại.

| Mã | Yêu cầu | Ưu tiên | Trạng thái |
| --- | --- | --- | --- |
| FR-01 | Màn mở đầu: tên game (giữ chỗ), hướng dẫn 4 câu, ô biệt danh, nút "Chào đời", ghi chú minh bạch | P0 | Xong |
| FR-02 | Giấy khai sinh: random 1 trong 5 hoàn cảnh và tên bạn thơ ấu; "Đầu thai lại", "Bắt đầu sống" | P0 | Xong |
| FR-10 | Tự chạy từng năm 1985–2025; tạm dừng (nút hoặc phím Space); tốc độ 1x/2x/4x | P0 | Xong |
| FR-11 | Bốn chỉ số 0–100 có sàn tối thiểu và hiệu ứng giảm dần | P0 | Xong |
| FR-12 | Túi tiền ẩn số, hiện 3 nấc, không âm | P0 | Xong |
| FR-13 | Bậc sự nghiệp 5 bậc theo con đường đã chọn | P1 | Xong |
| FR-14 | Dồn sức mỗi năm, không làm dừng game; 3 lựa chọn dưới 18 tuổi, 5 lựa chọn từ 18 tuổi | P1 | Xong |
| FR-15 | Ngã rẽ chung: 1995, 2000, 2003, 2007, 2011, 2015, 2018, 2020, 2022 | P0 | Xong |
| FR-15a | Lựa chọn riêng theo hoàn cảnh năm 2005: mỗi hoàn cảnh một câu hỏi khác nhau | P0 | Xong |
| FR-15b | Lựa chọn đời tư: sở thích 2009, trông con 2013 (nếu đã có gia đình), duyên muộn 2014 (nếu chưa), về làng 2017 (nếu đang làm xa), truyền nghề 2024 | P1 | Xong |
| FR-15c | Mọi lựa chọn mở được đều để lại hệ quả về sau (thẻ nhắc lại, sự kiện, kỷ vật, dòng kể, hoặc mở nhánh mới). Có test tự động kiểm tra | P0 | Xong |
| FR-16 | Lựa chọn chưa có hiện dạng khóa kèm lý do | P0 | Xong |
| FR-17 | (Thay bằng FR-26) | – | – |
| FR-18 | Thẻ nhắc lại lựa chọn sau vài năm | P1 | Xong |
| FR-19 | Trở ngại nhẹ luôn có sự kiện vượt qua | P0 | Xong |
| FR-20 | Bố cục 3 cột: hồ sơ và trạng thái; trọng tâm năm nay và ghi chép cuộc đời; gia đình, bạn cùng xóm và bản đồ cuộc đời | P0 | Xong |
| FR-21 | Mỗi năm tối đa N thẻ nổi bật theo thứ tự ưu tiên, còn lại hiện dạng dòng gọn | P0 | Xong |
| FR-22 | Năm có thẻ Đất nước hoặc kỷ vật được giữ tối thiểu T giây | P0 | Xong |
| FR-23 | Thay đổi trong nhà (điện, mái, đường, nước) hiện trong ghi chép kèm nhãn "Nhờ Đổi mới" / "Nhờ lựa chọn của bạn" | P0 | Xong |
| FR-25 | Tài chính: lương theo nghề và chức vụ, thăng chức, tiết kiệm, nợ, tài sản ròng; quy theo giá năm 2025, ghi rõ là ước lượng minh họa | P0 | Xong |
| FR-26 | Chi tiêu, đầu tư không làm dừng game: mua sắm lớn (xe máy, máy tính, xây nhà, sửa nhà bố mẹ) và chi mỗi năm một lần (biếu bố mẹ, đi chơi xa, góp quỹ làng), chọn giữ tiền mặt hay gửi tiết kiệm | P1 | Xong |
| FR-27 | Gia đình và cuộc đời: bố mẹ (tên, tuổi, nghề), anh chị em, vợ/chồng, con, bạn thân, sở thích | P0 | Xong |
| FR-28 | Bạn cùng xóm sinh năm 1985: người bạn thân và 2 bạn khác, trạng thái theo lựa chọn của từng người | P1 | Xong |
| FR-29 | Bản đồ cuộc đời 1 ô một năm; biểu đồ quỹ đạo 4 chỉ số trên tấm thẻ cuối | P1 | Xong |
| FR-35 | Điều khiển: tốc độ 1×–16×, tới quyết định tiếp theo, tự động quyết định, ghi suy nghĩ | P1 | Xong |
| FR-24 | Bảng màu 4 thời kỳ | P2 | Xong |
| FR-30 | 32 kỷ vật, 3 độ hiếm, nhận theo điều kiện | P0 | Xong |
| FR-31 | Thẻ "Vừa nhận" có ô kỷ vật, câu bối cảnh, Hồi đó kèm nguồn | P0 | Xong |
| FR-32 | Túi kỷ vật dạng lưới, ô chưa có hiện "?" | P0 | Xong |
| FR-33 | Hồi đó luôn kèm nguồn, đi cùng kỷ vật hoặc ngã rẽ | P0 | Xong |
| FR-34 | Sổ tay thời đại | P2 | Xong (tab trong túi kỷ vật) |
| FR-40 | Người bạn chọn khác người chơi ở 2000, 2003, 2007 | P0 | Xong |
| FR-41 | Cảnh gặp lại 2022: hai người kể 3 dòng, chọn cách góp sức; nhà eo hẹp được bà con hỗ trợ | P0 | Xong |
| FR-42 | Suy ngẫm tuổi 18, 30, 40: 3 câu sẵn + tự viết 120 ký tự | P1 | Xong |
| FR-50 | Tấm thẻ cuộc đời: nhà 1985 và 2025, 3 kỷ vật quý, những lựa chọn làm nên đời bạn, 3 điều về thời đại, điểm mạnh, con đường người bạn, câu nói tuổi 40, câu thảo luận; không có tiền | P0 | Xong |
| FR-51 | Lưu tấm thẻ thành ảnh PNG | P1 | Xong |
| FR-52 | "Sống một đời khác" | P0 | Xong |

## 4. Yêu cầu phi chức năng

| Mã | Yêu cầu |
| --- | --- |
| NFR-01 | Trang tĩnh, mở được khi chỉ có kết nối tải trang lần đầu |
| NFR-02 | Bundle JS dưới 500 KB (hiện khoảng 215 KB) |
| NFR-03 | Nút tối thiểu 44px, tương phản đạt 4.5:1, tôn trọng `prefers-reduced-motion` |
| NFR-04 | Không lưu hay gửi dữ liệu người chơi đi đâu |
| NFR-05 | Mọi số liệu nằm trong `hoiDo.ts` kèm `source` + `url` |
| NFR-06 | Ảnh thiếu thì tự dùng hình giữ chỗ |

## 5. Nghiệm thu

- `npm test` qua: mọi hoàn cảnh sống trọn đời; không năm nào vượt số thẻ cho phép; mọi Hồi đó có link.
- `npm run sim`: không hoàn cảnh nào luôn thấp nhất; mọi kỷ vật Rất hiếm đều có người nhận.
- Độ đa dạng: 600 đời giả lập cho khoảng 400 con đường đời khác nhau và hơn 540 bộ kỷ vật khác nhau.
- Mọi thẻ Đất nước khớp database Mốc lịch sử đã đối chiếu giáo trình.
- Chơi tay đủ 5 hoàn cảnh không lỗi; mở được trên laptop, máy chiếu, 2 điện thoại.
