// Bảng tra cơ bản: thiên can, địa chi, ngũ hành, tàng can, nạp âm, thập thần, trường sinh.
var BT = window.BT || {};
window.BT = BT;

BT.GAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
BT.GAN_HAN = '甲乙丙丁戊己庚辛壬癸';
BT.ZHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
BT.ZHI_HAN = '子丑寅卯辰巳午未申酉戌亥';
BT.CON_GIAP = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];

// Ngũ hành theo vòng tương sinh: Mộc → Hỏa → Thổ → Kim → Thủy → Mộc
BT.HANH = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
BT.HANH_KEY = ['moc', 'hoa', 'tho', 'kim', 'thuy'];
BT.ganHanh = function (g) { return Math.floor(g / 2); };
BT.ZHI_HANH = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
BT.zhiHanh = function (z) { return BT.ZHI_HANH[z]; };
BT.isDuong = function (i) { return i % 2 === 0; };

// Tàng can: khí chính, khí giữa, khí dư
BT.TANG_CAN = [
  [9], [5, 9, 7], [0, 2, 4], [1], [4, 1, 9], [2, 6, 4],
  [3, 5], [5, 3, 1], [6, 8, 4], [7], [4, 7, 3], [8, 0]
];

BT.NAP_AM = ['Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim',
  'Sơn Đầu Hỏa', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc',
  'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy',
  'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bích Thượng Thổ', 'Kim Bạch Kim',
  'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim', 'Tang Đố Mộc',
  'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy'];
BT.NAP_AM_HANH = function (name) { return BT.HANH.indexOf(name.split(' ').pop()); };

// Chỉ số lục thập hoa giáp (0 = Giáp Tý)
BT.jiazi = function (g, z) { return ((6 * g - 5 * z) % 60 + 60) % 60; };
BT.napAm = function (g, z) { return BT.NAP_AM[Math.floor(BT.jiazi(g, z) / 2)]; };

BT.THAP_THAN = ['Tỷ Kiên', 'Kiếp Tài', 'Thực Thần', 'Thương Quan', 'Thiên Tài',
  'Chính Tài', 'Thất Sát', 'Chính Quan', 'Thiên Ấn', 'Chính Ấn'];
BT.THAP_THAN_TAT = ['Tỷ', 'Kiếp', 'Thực', 'Thương', 'T.Tài', 'C.Tài', 'Sát', 'Quan', 'Kiêu', 'Ấn'];

// Thập thần của can g so với nhật can d → chỉ số trong BT.THAP_THAN
BT.thapThan = function (d, g) {
  var diff = (BT.ganHanh(g) - BT.ganHanh(d) + 5) % 5;
  var cungDau = (d % 2) === (g % 2);
  return diff * 2 + (cungDau ? 0 : 1);
};

BT.TRUONG_SINH = ['Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy',
  'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];
// Vị trí Trường Sinh của từng can; can dương đi thuận, can âm đi nghịch
BT.TS_START = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3];
BT.truongSinh = function (g, z) {
  var s = BT.TS_START[g];
  return BT.isDuong(g) ? (z - s + 12) % 12 : (s - z + 12) % 12;
};

BT.TIET_KHI = ['Lập Xuân', 'Kinh Trập', 'Thanh Minh', 'Lập Hạ', 'Mang Chủng', 'Tiểu Thử',
  'Lập Thu', 'Bạch Lộ', 'Hàn Lộ', 'Lập Đông', 'Đại Tuyết', 'Tiểu Hàn'];
