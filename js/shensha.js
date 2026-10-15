// Thần sát và quan hệ hợp – xung – hình – hại. Toàn bộ là bảng tra truyền thống.
(function (BT) {
  // Tam hợp cục của một địa chi: 0 Thủy (Thân Tý Thìn), 1 Hỏa (Dần Ngọ Tuất), 2 Kim (Tỵ Dậu Sửu), 3 Mộc (Hợi Mão Mùi)
  var CUC = [0, 2, 1, 3, 0, 2, 1, 3, 0, 2, 1, 3];
  function byCuc(table) { return function (z) { return [table[CUC[z]]]; }; }

  // Mỗi sao: tên, cát/hung, gốc tra, và hàm trả về danh sách mục tiêu (chỉ số địa chi, hoặc 'g:x' là thiên can).
  // Gốc tra: 'gan' = can ngày và can năm; 'ganNgay' = chỉ can ngày; 'zhi' = chi ngày và chi năm; 'zhiNam' = chỉ chi năm;
  // 'nam' = chi năm; 'month' = chi tháng. f(b, chart) nhận thêm lá số khi cần giới tính.
  // Nguồn: sách "Dự đoán theo Tứ Trụ" (Thiệu Vĩ Hoa), chương 9–10, tr.293–326. Hồng Loan, Thiên Hỷ sách không đề cập, giữ theo bảng truyền thống.
  BT.SAO = [
    // Thiên Ất theo "Giáp Mậu Sửu Mùi, Ất Kỷ Tý Thân, Bính Đinh Hợi Dậu, Nhâm Quý Mão Tị, Canh Tân Dần Ngọ" (tr.294–296)
    { id: 'quynhan', ten: 'Thiên Ất Quý Nhân', cat: true, goc: 'gan',
      f: function (g) { return [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [2, 6], [2, 6], [3, 5], [3, 5]][g]; } },
    { id: 'thaicuc', ten: 'Thái Cực Quý Nhân', cat: true, goc: 'gan',
      f: function (g) { return [[0, 6], [0, 6], [9, 3], [9, 3], [4, 10, 1, 7], [4, 10, 1, 7], [2, 11], [2, 11], [5, 8], [5, 8]][g]; } },
    { id: 'phuctinh', ten: 'Phúc Tinh Quý Nhân', cat: true, goc: 'gan', // tr.300
      f: function (g) { return [[2, 0], [3, 1], [2, 0], [11], [8], [7], [6], [5], [4], [3, 1]][g]; } },
    { id: 'vanxuong', ten: 'Văn Xương', cat: true, goc: 'gan',
      f: function (g) { return [[5], [6], [8], [9], [8], [9], [11], [0], [2], [3]][g]; } },
    { id: 'quocan', ten: 'Quốc Ấn', cat: true, goc: 'gan', // tr.302
      f: function (g) { return [[10], [11], [1], [2], [1], [2], [4], [5], [7], [8]][g]; } },
    { id: 'loc', ten: 'Lộc Thần', cat: true, goc: 'ganNgay', // tr.139, 308: tra theo can ngày
      f: function (g) { return [[2], [3], [5], [6], [5], [6], [8], [9], [11], [0]][g]; } },
    { id: 'kimdu', ten: 'Kim Dư', cat: true, goc: 'ganNgay', // tr.306: tra theo can ngày
      f: function (g) { return [[4], [5], [7], [8], [7], [8], [10], [11], [1], [2]][g]; } },
    // Kình Dương là đế vượng của can ngày, can âm đếm nghịch: Ất Dần, Đinh Kỷ Tị, Tân Thân, Quý Hợi (tr.142–143, 315).
    // Sách bác cách đặt "trước lộc một ngôi" (Ất Thìn, Đinh Kỷ Mùi, Tân Tuất, Quý Sửu).
    { id: 'duongnhan', ten: 'Dương Nhận', cat: false, goc: 'ganNgay',
      f: function (g) { return [[3], [2], [6], [5], [6], [5], [9], [8], [0], [11]][g]; } },
    { id: 'daohoa', ten: 'Đào Hoa', cat: true, goc: 'zhi', f: byCuc([9, 3, 6, 0]) },
    { id: 'dichma', ten: 'Dịch Mã', cat: true, goc: 'zhi', f: byCuc([2, 8, 11, 5]) },
    { id: 'hoacai', ten: 'Hoa Cái', cat: true, goc: 'zhi', f: byCuc([4, 10, 1, 7]) },
    { id: 'tuongtinh', ten: 'Tướng Tinh', cat: true, goc: 'zhi', f: byCuc([0, 6, 9, 3]) },
    { id: 'kiepsat', ten: 'Kiếp Sát', cat: false, goc: 'zhi', f: byCuc([5, 11, 2, 8]) },
    { id: 'taisat', ten: 'Tai Sát', cat: false, goc: 'zhiNam', f: byCuc([6, 0, 3, 9]) }, // tr.317: lấy chi năm làm chủ
    { id: 'vongthan', ten: 'Vong Thần', cat: false, goc: 'zhi', f: byCuc([11, 5, 8, 2]) },
    { id: 'cothan', ten: 'Cô Thần', cat: false, goc: 'zhiNam', // tr.318–319
      f: function (z) { return [[2], [5], [8], [11]][Math.floor(((z + 1) % 12) / 3)]; } },
    { id: 'quatu', ten: 'Quả Tú', cat: false, goc: 'zhiNam',
      f: function (z) { return [[10], [1], [4], [7]][Math.floor(((z + 1) % 12) / 3)]; } },
    // Thiên La Địa Võng: Thìn gặp Tị, Tuất gặp Hợi (tr.313–314, lấy chi năm hoặc chi ngày làm chủ)
    { id: 'thienla', ten: 'Thiên La Địa Võng', cat: false, goc: 'zhi',
      f: function (z) { return z === 4 ? [5] : z === 5 ? [4] : z === 10 ? [11] : z === 11 ? [10] : []; } },
    // Cấu Giảo: ngôi thứ ba sau và thứ ba trước chi năm (tr.318)
    { id: 'caugiao', ten: 'Cấu Giảo', cat: false, goc: 'zhiNam',
      f: function (z) { return [(z + 3) % 12, (z + 9) % 12]; } },
    // Đại Hao (Nguyên Thần): nam dương nữ âm lấy chi sau ngôi xung của chi năm, nam âm nữ dương lấy chi trước (tr.320–321)
    { id: 'daihao', ten: 'Đại Hao', cat: false, goc: 'zhiNam',
      f: function (z, chart) {
        var thuan = (chart.year.g % 2 === 0) === (chart.inp && chart.inp.gender === 1);
        return [(z + (thuan ? 7 : 5)) % 12];
      } },
    { id: 'hongloan', ten: 'Hồng Loan', cat: true, goc: 'nam',
      f: function (z) { return [(3 - z + 12) % 12]; } },
    { id: 'thienhy', ten: 'Thiên Hỷ', cat: true, goc: 'nam',
      f: function (z) { return [(9 - z + 12) % 12]; } },
    { id: 'thienduc', ten: 'Thiên Đức', cat: true, goc: 'month', target: 'mixed',
      // theo chi tháng; giá trị 'g:x' là thiên can, số là địa chi
      f: function (z) { return [[5], ['g:6'], ['g:3'], [8], ['g:8'], ['g:7'], [11], ['g:0'], ['g:9'], [2], ['g:2'], ['g:1']][z]; } },
    { id: 'nguyetduc', ten: 'Nguyệt Đức', cat: true, goc: 'month', target: 'mixed',
      f: function (z) { return [['g:8'], ['g:6'], ['g:2'], ['g:0'], ['g:8'], ['g:6'], ['g:2'], ['g:0'], ['g:8'], ['g:6'], ['g:2'], ['g:0']][z]; } },
    // Thiên Y: chi đứng trước chi tháng một ngôi (tr.142, 307)
    { id: 'thieny', ten: 'Thiên Y', cat: true, goc: 'month',
      f: function (z) { return [(z + 11) % 12]; } }
  ];

  // Các sao tra theo cả trụ ngày (hoặc giờ): ds = danh sách [can, chi] hợp lệ; tru = trụ được xét; mua = chỉ xét khi sinh đúng mùa.
  var MUA_THANG = function (z) { return [2, 3, 4].indexOf(z) >= 0 ? 0 : [5, 6, 7].indexOf(z) >= 0 ? 1 : [8, 9, 10].indexOf(z) >= 0 ? 2 : 3; }; // xuân hạ thu đông
  BT.SAO_TRU = [
    { id: 'khoicanh', ten: 'Khôi Canh', cat: true, tru: ['Ngày'], ds: [[8, 4], [6, 10], [6, 4], [4, 10]] }, // tr.301
    { id: 'kimthan', ten: 'Kim Thần', cat: true, tru: ['Ngày', 'Giờ'], ds: [[1, 1], [5, 5], [9, 9]] },    // tr.307
    { id: 'thienxa', ten: 'Thiên Xá', cat: true, tru: ['Ngày'], mua: [[4, 2], [0, 6], [4, 8], [0, 0]] },   // tr.311
    { id: 'thapac', ten: 'Thập Ác Đại Bại', cat: false, tru: ['Ngày'],                                    // tr.323
      ds: [[0, 4], [1, 5], [8, 8], [2, 8], [3, 11], [6, 4], [4, 10], [9, 11], [7, 5], [5, 1]] },
    { id: 'amduong', ten: 'Âm Dương Sai Thố', cat: false, tru: ['Ngày'],                                   // tr.326
      ds: [[2, 0], [3, 1], [4, 2], [7, 3], [8, 4], [9, 5], [2, 6], [3, 7], [4, 8], [7, 9], [8, 10], [9, 11]] }
  ];
  function truHopSao(s, chart, p) {
    if (s.tru.indexOf(p.ten) < 0) return false;
    if (s.mua) { var m = s.mua[MUA_THANG(chart.month.z)]; return p.g === m[0] && p.z === m[1]; }
    return s.ds.some(function (d) { return d[0] === p.g && d[1] === p.z; });
  }

  // Không Vong theo tuần của trụ ngày
  BT.khongVong = function (g, z) {
    var start = BT.jiazi(g, z) - BT.jiazi(g, z) % 10;
    var z0 = start % 12;
    return [(z0 + 10) % 12, (z0 + 11) % 12];
  };

  function hit(targets, p) {
    return targets.some(function (t) {
      return typeof t === 'string' ? Number(t.slice(2)) === p.g : t === p.z;
    });
  }
  function goc(s, chart) {
    return s.goc === 'gan' ? [chart.day.g, chart.year.g]
      : s.goc === 'ganNgay' ? [chart.day.g]
      : s.goc === 'zhi' ? [chart.day.z, chart.year.z]
      : s.goc === 'zhiNam' || s.goc === 'nam' ? [chart.year.z]
      : [chart.month.z];
  }

  // Thần sát cho một trụ p = {g, z}, dựa trên lá số chart (có day, year, month).
  BT.thanSatCuaTru = function (chart, p, laTruGoc) {
    var out = [];
    BT.SAO.forEach(function (s) {
      var bases = goc(s, chart);
      var trung = bases.some(function (b, i) {
        // không tự tra trụ gốc với chính nó (chi ngày với trụ ngày, chi năm với trụ năm)
        if (laTruGoc && s.goc === 'zhi' && ((i === 0 && laTruGoc === 'day') || (i === 1 && laTruGoc === 'year'))) return false;
        return hit(s.f(b, chart), p);
      });
      if (trung) out.push({ id: s.id, ten: s.ten, cat: s.cat });
    });
    BT.SAO_TRU.forEach(function (s) { if (truHopSao(s, chart, p)) out.push({ id: s.id, ten: s.ten, cat: s.cat }); });
    var kv = BT.khongVong(chart.day.g, chart.day.z);
    if (laTruGoc !== 'day' && kv.indexOf(p.z) >= 0) out.push({ id: 'khongvong', ten: 'Không Vong', cat: false });
    return out;
  };

  // Bảng tóm tắt: mỗi sao rơi vào những địa chi/thiên can nào
  BT.bangThanSat = function (chart) {
    var rows = BT.SAO.map(function (s) {
      var seen = {}, list = [];
      goc(s, chart).forEach(function (b) {
        s.f(b, chart).forEach(function (t) {
          var label = typeof t === 'string' ? BT.GAN[Number(t.slice(2))] : BT.ZHI[t];
          if (!seen[label]) { seen[label] = 1; list.push(label); }
        });
      });
      return { id: s.id, ten: s.ten, cat: s.cat, vi: list };
    });
    BT.SAO_TRU.forEach(function (s) {
      var ds = s.mua ? [s.mua[MUA_THANG(chart.month.z)]] : s.ds;
      rows.push({ id: s.id, ten: s.ten, cat: s.cat, vi: ds.map(function (d) { return BT.GAN[d[0]] + ' ' + BT.ZHI[d[1]]; }) });
    });
    rows.push({ id: 'khongvong', ten: 'Không Vong', cat: false,
      vi: BT.khongVong(chart.day.g, chart.day.z).map(function (z) { return BT.ZHI[z]; }) });
    return rows;
  };

  // 12 thần Tuế Quân: vị trí của chi năm lưu niên so với chi của một trụ
  BT.TUE_QUAN = [
    { ten: 'Thái Tuế', cat: false }, { ten: 'Thái Dương', cat: true }, { ten: 'Tang Môn', cat: false },
    { ten: 'Thái Âm', cat: true }, { ten: 'Quan Phù', cat: false }, { ten: 'Tử Phù', cat: false },
    { ten: 'Tuế Phá', cat: false }, { ten: 'Long Đức', cat: true }, { ten: 'Bạch Hổ', cat: false },
    { ten: 'Phúc Đức', cat: true }, { ten: 'Điếu Khách', cat: false }, { ten: 'Bệnh Phù', cat: false }
  ];
  BT.tueQuan = function (truZ, namZ) { return BT.TUE_QUAN[(namZ - truZ + 12) % 12]; };

  // ---------- Hợp – xung – hình – hại ----------
  var HOP_HOA = ['Thổ', 'Kim', 'Thủy', 'Mộc', 'Hỏa'];
  var TAM_HOP = [[8, 0, 4, 'Thủy'], [2, 6, 10, 'Hỏa'], [5, 9, 1, 'Kim'], [11, 3, 7, 'Mộc']];
  var TAM_HOI = [[2, 3, 4, 'Mộc'], [5, 6, 7, 'Hỏa'], [8, 9, 10, 'Kim'], [11, 0, 1, 'Thủy']];
  var LUC_HOP_HOA = { '0-1': 'Thổ', '2-11': 'Mộc', '3-10': 'Hỏa', '4-9': 'Kim', '5-8': 'Thủy', '6-7': 'Thổ' }; // Ngọ Mùi hợp Thổ (có sách ghi hợp Hỏa)
  var PHA = ['0-9', '1-4', '2-11', '3-6', '5-8', '7-10'];

  function key(a, b) { return Math.min(a, b) + '-' + Math.max(a, b); }

  // Quan hệ giữa 2 trụ a, b ({g, z, ten}); trả về danh sách {loai, text, tot}
  BT.quanHeHaiTru = function (a, b) {
    var r = [];
    if (a.g != null && b.g != null) {
      if (Math.abs(a.g - b.g) === 5) r.push({ loai: 'hop', tot: true,
        text: BT.GAN[a.g] + ' – ' + BT.GAN[b.g] + ' hợp hóa ' + HOP_HOA[Math.min(a.g, b.g)] });
      var lo = Math.min(a.g, b.g), hi = Math.max(a.g, b.g);
      if (lo < 4 && hi === lo + 6) r.push({ loai: 'xung', tot: false,
        text: BT.GAN[a.g] + ' – ' + BT.GAN[b.g] + ' tương xung' });
    }
    var x = a.z, y = b.z;
    if (x === y) {
      if ([4, 6, 9, 11].indexOf(x) >= 0) r.push({ loai: 'hinh', tot: false, text: BT.ZHI[x] + ' – ' + BT.ZHI[y] + ' tự hình' });
      return r;
    }
    var k = key(x, y);
    if ((x + y) % 12 === 1) r.push({ loai: 'hop', tot: true, text: BT.ZHI[x] + ' – ' + BT.ZHI[y] + ' lục hợp (' + LUC_HOP_HOA[k] + ')' });
    if (Math.abs(x - y) === 6) r.push({ loai: 'xung', tot: false, text: BT.ZHI[x] + ' – ' + BT.ZHI[y] + ' lục xung' });
    if ((x + y) % 12 === 7) r.push({ loai: 'hai', tot: false, text: BT.ZHI[x] + ' – ' + BT.ZHI[y] + ' tương hại' });
    if (PHA.indexOf(k) >= 0) r.push({ loai: 'pha', tot: false, text: BT.ZHI[x] + ' – ' + BT.ZHI[y] + ' tương phá' });
    if (k === '0-3') r.push({ loai: 'hinh', tot: false, text: 'Tý – Mão hình (vô lễ)' });
    [[2, 5, 8, 'vô ân'], [1, 10, 7, 'trì thế']].forEach(function (h) {
      if (h.indexOf(x) >= 0 && h.indexOf(y) >= 0 && h.indexOf(x) < 3 && h.indexOf(y) < 3)
        r.push({ loai: 'hinh', tot: false, text: BT.ZHI[x] + ' – ' + BT.ZHI[y] + ' hình (' + h[3] + ')' });
    });
    TAM_HOP.forEach(function (t) {
      var ix = t.indexOf(x), iy = t.indexOf(y);
      if (ix >= 0 && iy >= 0 && ix < 3 && iy < 3 && (ix === 1 || iy === 1))
        r.push({ loai: 'hop', tot: true, text: BT.ZHI[x] + ' – ' + BT.ZHI[y] + ' bán hợp ' + t[3] + ' cục' });
    });
    return r;
  };

  // Tam hợp, tam hội đủ bộ trong một nhóm trụ
  BT.boBa = function (zs) {
    var r = [];
    TAM_HOP.forEach(function (t) {
      if ([0, 1, 2].every(function (i) { return zs.indexOf(t[i]) >= 0; }))
        r.push({ loai: 'hop', tot: true, text: 'Tam hợp ' + t[3] + ' cục: ' + [0, 1, 2].map(function (i) { return BT.ZHI[t[i]]; }).join(' – ') });
    });
    TAM_HOI.forEach(function (t) {
      if ([0, 1, 2].every(function (i) { return zs.indexOf(t[i]) >= 0; }))
        r.push({ loai: 'hop', tot: true, text: 'Tam hội ' + t[3] + ' phương: ' + [0, 1, 2].map(function (i) { return BT.ZHI[t[i]]; }).join(' – ') });
    });
    return r;
  };

  // Liệt kê quan hệ: giữa các trụ trong `nhom`, và (nếu có) giữa `ngoai` với từng trụ trong nhóm
  BT.lietKeQuanHe = function (nhom, ngoai) {
    var r = [];
    function add(a, b) {
      BT.quanHeHaiTru(a, b).forEach(function (q) { q.giua = a.ten + ' & ' + b.ten; r.push(q); });
    }
    if (!ngoai) {
      for (var i = 0; i < nhom.length; i++) for (var j = i + 1; j < nhom.length; j++) add(nhom[i], nhom[j]);
      BT.boBa(nhom.map(function (p) { return p.z; })).forEach(function (q) { q.giua = 'Tứ trụ'; r.push(q); });
    } else {
      ngoai.forEach(function (o) { nhom.forEach(function (p) { add(o, p); }); });
      BT.boBa(nhom.concat(ngoai).map(function (p) { return p.z; })).forEach(function (q) { q.giua = 'Tứ trụ + vận/năm'; r.push(q); });
    }
    return r;
  };
})(window.BT);
