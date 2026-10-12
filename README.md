# Bát Tự Phong Thủy

Web app lập lá số Bát Tự (Tứ trụ) theo giờ Việt Nam, chạy hoàn toàn trên trình duyệt, không cần server.

## Tính năng

- Tứ trụ theo tiết khí (đổi giờ Việt Nam UTC+7 sang mốc giờ Bắc Kinh cho trụ năm, trụ tháng), Thai nguyên, Mệnh cung.
- Âm lịch Việt Nam (thuật toán Hồ Ngọc Đức; trước năm 1968 dùng lịch UTC+8).
- Tàng can, thập thần, trường sinh, nạp âm, thần sát, hợp – xung – hình – hại – phá.
- Ngũ hành có trọng số theo mùa và thông căn; đối chiếu tam đắc (đắc lệnh, đắc địa, đắc thế).
- Dụng thần theo Phù ức, ghi chú Điều hầu, cảnh báo kết luận sát ngưỡng và khả năng Tòng cách.
- Đại vận, lưu niên, lưu nguyệt; đánh giá thuận nghịch theo Dụng thần.
- Xuất hồ sơ luận giải dạng A4 để in hoặc lưu PDF, xuất ảnh PNG.

## Chạy

Mở `index.html` bằng trình duyệt. Có thể truyền lá số qua URL, ví dụ:

```
index.html?ten=Nguyen%20Van%20An&gt=1&ngay=1994-01-17&gio=02:56&nam=2026
```

## Cấu trúc

| File | Nội dung |
|---|---|
| `js/vi.js` | Bảng tra: can chi, ngũ hành, tàng can, nạp âm, thập thần, trường sinh |
| `js/amlich.js` | Âm lịch Việt Nam |
| `js/shensha.js` | Thần sát, quan hệ hợp xung hình hại |
| `js/bazi.js` | Lập lá số, ngũ hành, thông căn, tam đắc, Dụng thần, đánh giá vận |
| `js/giainghia.js` | Giải nghĩa thuật ngữ |
| `js/hoso-van.js`, `js/hoso.js` | Kho văn mẫu và trình ghép hồ sơ luận giải |
| `js/render.js` | Giao diện |
| `js/vendor/lunar.js` | Thư viện [lunar-javascript](https://github.com/6tail/lunar-javascript) (can chi, tiết khí) |
| `bao-cao/` | Báo cáo đối chiếu với các nguồn khác |

Nội dung luận giải mang tính tham khảo.
