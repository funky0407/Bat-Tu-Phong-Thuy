// Lập lá số Bát tự. Dùng lunar-javascript (6tail) để lấy can chi và tiết khí,
// phần thập thần, trường sinh, thần sát, ngũ hành tự tính bằng bảng trong vi.js / shensha.js.
(function (BT) {
  var L = window; // lunar.js gắn Solar, Lunar... vào window
  var GIO_VN_SO_VOI_BK = 1; // tiết khí của thư viện theo giờ Bắc Kinh (UTC+8), VN là UTC+7

  function idx(gz) { return { g: BT.GAN_HAN.indexOf(gz[0]), z: BT.ZHI_HAN.indexOf(gz[1]) }; }
  function cong(y, m, d, h, mi, gio) {
    var t = new Date(Date.UTC(y, m - 1, d, h, mi) + gio * 3600e3);
    return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes()];
  }
  function solar(a) { return L.Solar.fromYmdHms(a[0], a[1], a[2], a[3], a[4], 0); }
  // sect 1: từ 23 giờ đã sang ngày mới (giờ Tý thuộc ngày hôm sau). Sách "Dự đoán theo Tứ Trụ" tr.45, 178, 252 nói rõ
  // ranh giới ngày là 23 giờ, không phải 0 giờ.
  function eightChar(s) { var ec = s.getLunar().getEightChar(); ec.setSect(1); return ec; }
  function solarVN(s) { // đổi một mốc tiết khí giờ Bắc Kinh sang giờ VN
    var a = cong(s.getYear(), s.getMonth(), s.getDay(), s.getHour(), s.getMinute(), -GIO_VN_SO_VOI_BK);
    return { y: a[0], m: a[1], d: a[2], h: a[3], mi: a[4] };
  }

  // Chi tiết một trụ so với nhật can dg
  BT.chiTietTru = function (ten, g, z, dg, laNhatChu) {
    return {
      ten: ten, g: g, z: z,
      tt: laNhatChu ? -1 : BT.thapThan(dg, g),
      ts: BT.truongSinh(dg, z),
      tang: BT.TANG_CAN[z].map(function (tg) { return { g: tg, tt: BT.thapThan(dg, tg) }; }),
      napAm: BT.napAm(g, z)
    };
  };

  BT.lapLaSo = function (inp) {
    var local = solar([inp.y, inp.m, inp.d, inp.h, inp.mi]);
    var bk = solar(cong(inp.y, inp.m, inp.d, inp.h, inp.mi, GIO_VN_SO_VOI_BK));
    var ecL = eightChar(local), ecB = eightChar(bk);

    var year = idx(ecB.getYear()), month = idx(ecB.getMonth());
    var day = idx(ecL.getDay()), time = idx(ecL.getTime());
    var dg = day.g;
    // Cung mệnh: tháng (Dần = 1 … Sửu = 12) + giờ (Dần = 1 … Tý = 11, Sửu = 12); lấy 14 (hoặc 26) trừ đi, gặp Mão an mệnh.
    // Tự tính từ trụ tháng (tiết khí) và trụ giờ (giờ VN) để không bị lệch giờ khi phải dùng mốc giờ Bắc Kinh.
    var soThang = (month.z + 10) % 12 + 1, soGio = (time.z + 10) % 12 + 1, tong = soThang + soGio;
    var viTriMenh = (tong >= 14 ? 26 : 14) - tong;
    var cungMenh = { g: ((year.g + 1) * 2 + viTriMenh - 1) % 10, z: (viTriMenh + 1) % 12 };
    var thaiNguyen = { g: (month.g + 1) % 10, z: (month.z + 3) % 12 };

    var chart = {
      inp: inp, year: year, month: month, day: day, time: time, dg: dg,
      lunar: local.getLunar(), amLich: BT.amLichVN(inp.d, inp.m, inp.y)
    };
    // Số ngày từ lúc sinh đến tiết (Tiết, không phải Khí) kế tiếp, dùng để biết 18 ngày cuối tháng tứ quý (Thổ nắm lệnh).
    try { chart.ngayDenTiet = bk.getLunar().getNextJie().getSolar().subtract(bk); } catch (e) { chart.ngayDenTiet = null; }
    dungTuTru(chart, thaiNguyen, cungMenh);

    // Đại vận
    var yun = ecB.getYun(inp.gender);
    var ds = yun.getDaYun(10);
    chart.khoiVan = { nam: yun.getStartYear(), thang: yun.getStartMonth(), ngay: yun.getStartDay(),
      ngayDL: yun.getStartSolar().toYmd(), thuan: yun.isForward() };
    chart.daiVan = [];
    for (var i = 1; i < ds.length; i++) {
      var p = idx(ds[i].getGanZhi());
      var v = BT.chiTietTru('Vận ' + i, p.g, p.z, dg);
      // tuổi tròn đạt được trong năm bắt đầu vận (thư viện trả tuổi mụ tính theo năm dương lịch, dễ lệch với cách tính Việt Nam)
      v.namBD = ds[i].getStartYear(); v.namKT = ds[i].getEndYear(); v.tuoi = v.namBD - inp.y;
      chart.daiVan.push(v);
    }
    return chart;
  };

  // Dựng các trụ, thần sát, ngũ hành, cách cục và dụng thần từ bốn trụ đã biết (không cần ngày dương lịch).
  function dungTuTru(chart, thaiNguyen, cungMenh) {
    var dg = chart.dg, year = chart.year, month = chart.month, day = chart.day, time = chart.time;
    chart.tru = [
      BT.chiTietTru('Thai nguyên', thaiNguyen.g, thaiNguyen.z, dg),
      BT.chiTietTru('Cung mệnh', cungMenh.g, cungMenh.z, dg),
      BT.chiTietTru('Giờ', time.g, time.z, dg),
      BT.chiTietTru('Ngày', day.g, day.z, dg, true),
      BT.chiTietTru('Tháng', month.g, month.z, dg),
      BT.chiTietTru('Năm', year.g, year.z, dg)
    ];
    chart.tuTru = chart.tru.slice(2); // Giờ, Ngày, Tháng, Năm
    var goc = { 'Ngày': 'day', 'Năm': 'year' };
    chart.tru.forEach(function (p) { p.sao = BT.thanSatCuaTru(chart, p, goc[p.ten]); });
    chart.nguHanh = BT.nangLuongNguHanh(chart);
    chart.cachCuc = BT.dinhCach(chart);
    chart.dungThan = BT.timDungThan(chart);
    return chart;
  }

  // Lập lá số trực tiếp từ can chi, mỗi trụ là [can, chi] (chỉ số 0–9, 0–11). Dùng để kiểm thử với ví dụ trong sách.
  BT.lapTuTruTho = function (nam, thang, ngay, gio, gioiTinh) {
    function o(a) { return { g: a[0], z: a[1] }; }
    var year = o(nam), month = o(thang), day = o(ngay), time = o(gio);
    var soThang = (month.z + 10) % 12 + 1, soGio = (time.z + 10) % 12 + 1, tong = soThang + soGio, vt = (tong >= 14 ? 26 : 14) - tong;
    var chart = { inp: { gender: gioiTinh }, year: year, month: month, day: day, time: time, dg: day.g };
    return dungTuTru(chart, { g: (month.g + 1) % 10, z: (month.z + 3) % 12 },
      { g: ((year.g + 1) * 2 + vt - 1) % 10, z: (vt + 1) % 12 });
  };

  BT.vanCuaNam = function (chart, Y) {
    var dv = chart.daiVan;
    for (var i = dv.length - 1; i >= 0; i--) if (Y >= dv[i].namBD) return dv[i];
    return null; // trước khi khởi vận
  };

  // Lưu niên và 12 lưu nguyệt của năm Y
  BT.luuNien = function (chart, Y) {
    var g = ((Y - 4) % 10 + 10) % 10, z = ((Y - 4) % 12 + 12) % 12;
    var nam = BT.chiTietTru('Lưu niên ' + Y, g, z, chart.dg);
    nam.sao = BT.thanSatCuaTru(chart, nam);
    var tueQuan = chart.tuTru.map(function (p) { return { tru: p, sao: BT.tueQuan(p.z, z) }; });

    var tbl = L.Lunar.fromYmd(Y, 1, 1).getJieQiTable();
    var keys = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', 'XIAO_HAN', 'LI_CHUN'];
    var moc = keys.map(function (k) { return solarVN(tbl[k]); });
    var g0 = ((g % 5) * 2 + 2) % 10; // Ngũ Hổ Độn: can tháng Dần
    var thang = [];
    for (var i = 0; i < 12; i++) {
      var t = BT.chiTietTru(BT.TIET_KHI[i], (g0 + i) % 10, (2 + i) % 12, chart.dg);
      t.tu = moc[i]; t.den = moc[i + 1];
      thang.push(t);
    }
    var van = BT.vanCuaNam(chart, Y);
    var ngoai = [nam].concat(van ? [van] : []).map(function (p, i) {
      return { g: p.g, z: p.z, ten: i === 0 ? 'Năm ' + Y : 'Đại vận' };
    });
    var nhom = chart.tuTru.map(function (p) { return { g: p.g, z: p.z, ten: 'Trụ ' + p.ten.toLowerCase() }; });
    return { Y: Y, nam: nam, van: van, tueQuan: tueQuan, thang: thang,
      quanHe: BT.lietKeQuanHe(nhom, ngoai) };
  };

  // Thông căn: thiên can g có gốc (cùng hành trong tàng can) ở địa chi nào của tứ trụ.
  // muc: 3 gốc ở khí chính, 2 chỉ ở khí giữa, 1 chỉ ở khí dư, 0 vô căn (can "hư phù").
  var KHI = ['khí chính', 'khí giữa', 'khí dư'];
  BT.thongCan = function (tuTru, g) {
    var e = BT.ganHanh(g), muc = 0, cho = [];
    tuTru.forEach(function (p) {
      BT.TANG_CAN[p.z].forEach(function (tg, i) {
        if (BT.ganHanh(tg) !== e) return;
        muc = Math.max(muc, 3 - i);
        cho.push(BT.ZHI[p.z] + ' (trụ ' + p.ten.toLowerCase() + ', ' + KHI[i] + ')');
      });
    });
    return { muc: muc, cho: cho };
  };
  BT.MUC_CAN = ['vô căn', 'gốc yếu (khí dư)', 'có gốc (khí giữa)', 'gốc vững (khí chính)'];

  // ===================== ĐỘ VƯỢNG CỦA NGŨ HÀNH =====================
  // Theo sách "Dự đoán theo Tứ Trụ" (Thiệu Vĩ Hoa), mục II "Tính điểm để đo độ vượng suy của nhật chủ", tr.331–355.
  // Mỗi thiên can 36 độ, mỗi địa chi 30 độ (chia cho các nhân nguyên tàng trong chi); biến đổi do hợp, xung, khắc, rồi
  // nhân hệ số của hành nắm lệnh. Nhật chủ vượng khi phe mình (cùng hành + sinh) từ 40% tổng độ trở lên (tr.352).
  // Những chỗ sách tự mâu thuẫn giữa quy tắc và ví dụ thì theo quy tắc, ghi chú ngay tại chỗ.
  // Độ của nhân nguyên tàng trong chi (tr.342): [can, độ]. Lưu ý Thân: Canh 18, Mậu 9, Nhâm 3 (khác thứ tự khí trong BT.TANG_CAN).
  var CHI_NN = [[[9, 30]], [[5, 18], [9, 9], [7, 3]], [[0, 18], [2, 9], [4, 3]], [[1, 30]], [[4, 18], [1, 9], [9, 3]], [[2, 18], [6, 9], [4, 3]],
    [[3, 21], [5, 9]], [[5, 18], [3, 9], [1, 3]], [[6, 18], [4, 9], [8, 3]], [[7, 30]], [[4, 18], [7, 9], [3, 3]], [[8, 21], [0, 9]]];
  var TAM_HOI = [[2, 3, 4, 0], [5, 6, 7, 1], [8, 9, 10, 3], [11, 0, 1, 4]];   // ba chi, hành hóa
  var TAM_HOP = [[8, 0, 4, 4], [2, 6, 10, 1], [5, 9, 1, 3], [11, 3, 7, 0]];   // sinh, vượng, mộ, hành hóa
  var LUC_HOP = [[0, 1, 2], [2, 11, 0], [3, 10, 1], [4, 9, 3], [5, 8, 4], [6, 7, 2]]; // hai chi, hành hóa
  var HOA_CAN = [2, 3, 4, 0, 1]; // ngũ hợp, tra theo can nhỏ: Giáp Kỷ Thổ, Ất Canh Kim, Bính Tân Thủy, Đinh Nhâm Mộc, Mậu Quý Hỏa
  var MUA_TU_QUY = { 1: 4, 4: 0, 7: 1, 10: 3 }; // đầu tháng Sửu Thìn Mùi Tuất: hành của mùa; 18 ngày cuối: Thổ (tr.346)
  BT.NGUONG_VUONG = 40;
  function sinh(a, b) { return (a + 1) % 5 === b; }
  function khac(a, b) { return (a + 2) % 5 === b; }
  function truc(a, b) { return (a === 3 && b === 0) || (a === 0 && b === 3) || (a === 4 && b === 1) || (a === 1 && b === 4); }

  BT.tinhDo = function (chart) {
    var pos = [chart.tru[5], chart.tru[4], chart.tru[3], chart.tru[2]]; // Năm, Tháng, Ngày, Giờ: thứ tự kề nhau
    var g = pos.map(function (p) { return p.g; }), z = pos.map(function (p) { return p.z; });
    var hg = g.map(BT.ganHanh), hanhThang = BT.zhiHanh(z[1]);
    var nhom = [], ghi = [];
    var chi = z.map(function () { return { hoa: -1, luc: false, tam: false, khuBi: false, xung: 0 }; });
    function coCan(h) { return hg.some(function (x) { return x === h; }); }
    function bi(k) { return chi[k].hoa >= 0 || chi[k].khuBi; }
    function hanhChi(k) { return chi[k].hoa >= 0 ? chi[k].hoa : BT.zhiHanh(z[k]); }
    function ten(k) { return BT.ZHI[z[k]]; }

    // 1. Tam hội (72 độ), tam hợp (60 độ): đủ ba chi (không cần kề nhau), phải có thiên can cùng hành dẫn ra mới thành cục.
    //    Không có thiên can dẫn thì "hợp mà không hóa", chi chỉ còn bản khí (tr.342–343). Chi trùng lặp ngoài bộ ba giữ nguyên.
    function ba(ds, d, loai) {
      ds.forEach(function (t) {
        var vt = [];
        for (var k = 0; k < 3; k++) {
          var c = -1;
          if (z[1] === t[k]) c = 1; else for (var i = 0; i < 4; i++) if (z[i] === t[k]) { c = i; break; }
          if (c < 0) return;
          vt.push(c);
        }
        if (vt.some(bi)) return;
        if (coCan(t[3])) {
          nhom.push({ h: t[3], d: d, loai: loai, vt: vt }); vt.forEach(function (v) { chi[v].hoa = t[3]; chi[v].tam = true; });
          ghi.push(loai + ' ' + BT.HANH[t[3]] + ' thành cục (' + d + ' độ)');
        } else {
          vt.forEach(function (v) { chi[v].khuBi = true; chi[v].tam = true; });
          ghi.push(loai + ' ' + BT.HANH[t[3]] + ' không có thiên can dẫn nên không thành cục');
        }
      });
    }
    ba(TAM_HOI, 72, 'Tam hội'); ba(TAM_HOP, 60, 'Tam hợp');

    // 2. Bán tam hợp (40 độ): hai chi KỀ NHAU, sinh–vượng hoặc vượng–mộ của một tam hợp.
    var i, j, t;
    for (i = 0; i < 3; i++) {
      if (bi(i) || bi(i + 1)) continue;
      for (t = 0; t < TAM_HOP.length; t++) {
        var T = TAM_HOP[t], a = z[i], b = z[i + 1];
        if (!((a === T[0] && b === T[1]) || (a === T[1] && b === T[0]) || (a === T[1] && b === T[2]) || (a === T[2] && b === T[1]))) continue;
        if (coCan(T[3])) {
          nhom.push({ h: T[3], d: 40, loai: 'Bán hợp', vt: [i, i + 1] }); chi[i].hoa = chi[i + 1].hoa = T[3];
          ghi.push('Bán hợp ' + ten(i) + ' ' + ten(i + 1) + ' hóa ' + BT.HANH[T[3]] + ' (40 độ)');
        } else { chi[i].khuBi = chi[i + 1].khuBi = true; ghi.push('Bán hợp ' + ten(i) + ' ' + ten(i + 1) + ' không có thiên can dẫn'); }
        break;
      }
    }

    // 3. Lục hợp (36 độ): hai chi kề nhau; hóa khi có thiên can hóa thần và bản khí chi tháng cùng hành hoặc sinh hóa thần.
    //    Tranh hợp (một chi hợp với hai chi) thì không hóa (tr.344). Chi đã nằm trong tam/bán tam hợp thì không còn lục hợp.
    var cap = [], dem = [0, 0, 0, 0];
    for (i = 0; i < 3; i++) {
      if (bi(i) || bi(i + 1)) continue;
      for (t = 0; t < LUC_HOP.length; t++) {
        var L6 = LUC_HOP[t];
        if ((z[i] === L6[0] && z[i + 1] === L6[1]) || (z[i] === L6[1] && z[i + 1] === L6[0])) { cap.push([i, i + 1, L6[2]]); dem[i]++; dem[i + 1]++; }
      }
    }
    cap.forEach(function (c) {
      chi[c[0]].luc = chi[c[1]].luc = true;
      if (dem[c[0]] > 1 || dem[c[1]] > 1) { chi[c[0]].khuBi = chi[c[1]].khuBi = true; ghi.push('Tranh hợp ' + ten(c[0]) + ' ' + ten(c[1])); return; }
      var h = c[2];
      if (coCan(h) && (hanhThang === h || sinh(hanhThang, h))) {
        nhom.push({ h: h, d: 36, loai: 'Lục hợp', vt: [c[0], c[1]] }); chi[c[0]].hoa = chi[c[1]].hoa = h;
        ghi.push('Lục hợp ' + ten(c[0]) + ' ' + ten(c[1]) + ' hóa ' + BT.HANH[h] + ' (36 độ)');
      } else { chi[c[0]].khuBi = chi[c[1]].khuBi = true; ghi.push('Lục hợp ' + ten(c[0]) + ' ' + ten(c[1]) + ' không hóa'); }
    });

    // 4. Lục xung: chỉ tính khi hai chi KỀ NHAU, không dính hợp nào. Chỉ còn bản khí rồi hao 1/3, hoặc 1/2 nếu chi bị xung
    //    thuộc trục Mộc–Kim hoặc Hỏa–Thủy đối với hành của chi tháng (bảng tr.345). Xung giữa hai kho không hao.
    //    Hai chi kẹp xung một chi: chi kẹp hao 1/3, chi bị kẹp hao 2/3 (cộng dồn).
    for (i = 0; i < 3; i++) {
      if (bi(i) || bi(i + 1) || Math.abs(z[i] - z[i + 1]) !== 6) continue;
      if ([1, 4, 7, 10].indexOf(z[i]) >= 0) { ghi.push('Xung giữa hai kho ' + ten(i) + ' ' + ten(i + 1) + ' không hao'); continue; }
      [i, i + 1].forEach(function (k) { chi[k].xung = Math.min(1, chi[k].xung + (truc(BT.zhiHanh(z[k]), hanhThang) ? 1 / 2 : 1 / 3)); });
      ghi.push('Xung ' + ten(i) + ' ' + ten(i + 1));
    }

    // Hành nắm lệnh: chi tháng hợp hóa thì lấy hành hóa, hợp không hóa thì giữ hành chi tháng (tr.345). Tháng tứ quý:
    // 18 ngày cuối trước tiết kế tiếp là Thổ, những ngày đầu là hành của mùa (tr.346). Không có ngày sinh thì mặc định Thổ.
    var henLenh;
    if (chi[1].hoa >= 0) henLenh = chi[1].hoa;
    else if (MUA_TU_QUY[z[1]] != null) henLenh = (chart.ngayDenTiet == null || chart.ngayDenTiet <= 18) ? 2 : MUA_TU_QUY[z[1]];
    else henLenh = hanhThang;

    function nguon(k) { // nhân nguyên còn lại của chi ở vị trí k: hợp hóa thì mất hết, khử bì hoặc xung thì chỉ còn bản khí
      if (chi[k].hoa >= 0) return [];
      var all = CHI_NN[z[k]].map(function (n) { return { h: BT.ganHanh(n[0]), d: n[1] }; });
      return (chi[k].khuBi || chi[k].xung) ? [all[0]] : all;
    }
    function dua(k) { // chỗ dựa của thiên can k: nhân nguyên cùng hành hoặc sinh ra hành của can (tr.333–336)
      for (var m = 0; m < 4; m++) {
        if (chi[m].hoa >= 0 && (chi[m].hoa === hg[k] || sinh(chi[m].hoa, hg[k]))) return true;
        if (nguon(m).some(function (n) { return n.h === hg[k] || sinh(n.h, hg[k]); })) return true;
      }
      return false;
    }

    // 5. Thiên can: có chỗ dựa 36 độ, hư phù 9 độ.
    var base = g.map(function (_, k) { return dua(k) ? 36 : 9; });
    var hop = [0, 0, 0, 0]; // 0 không hợp, 1 hợp không hóa, 2 hợp hóa
    var loss = [0, 0, 0, 0];
    var capCan = [], demCan = [0, 0, 0, 0];
    for (i = 0; i < 3; i++) if (Math.abs(g[i] - g[i + 1]) === 5) { capCan.push([i, i + 1]); demCan[i]++; demCan[i + 1]++; }
    capCan.forEach(function (c) {
      var a = c[0], b = c[1];
      if (demCan[a] > 1 || demCan[b] > 1) { // tranh hợp: cả ba can cùng hao 1/3, không hóa (tr.339)
        [a, b].forEach(function (k) { if (!hop[k]) { hop[k] = 1; loss[k] += 12; if (base[k] === 9) base[k] = 36; } });
        ghi.push('Tranh hợp thiên can'); return;
      }
      if (base[a] === 9 && base[b] === 9) return; // cả hai hư phù thì không coi là hợp, mỗi can 9 độ (tr.339)
      if (base[a] === 9) base[a] = 36; if (base[b] === 9) base[b] = 36; // chỉ một can hư phù vẫn là hợp, không tính hư phù
      // Điều kiện thành hóa (tr.336–338): hóa thần phải nắm lệnh, và địa chi của cả hai can cùng hành hoặc sinh phù hóa thần
      // (hoặc đã hợp hóa ra hóa thần). Ba kiểu: chính hóa, thê tòng phu hóa (hành can dương), phu tòng thê hóa (hành can âm).
      var duong = g[a] % 2 === 0 ? a : b, am = duong === a ? b : a;
      var h = null, kieu = '';
      function chiOk(x) { return [hanhChi(a), hanhChi(b)].every(function (y) { return y === x || sinh(y, x); }); }
      var cands = [[HOA_CAN[Math.min(g[a], g[b])], 'chính hóa'], [hg[duong], 'thê tòng phu hóa'], [hg[am], 'phu tòng thê hóa']];
      for (var q = 0; q < cands.length; q++) if (cands[q][0] === henLenh && chiOk(cands[q][0])) { h = cands[q][0]; kieu = cands[q][1]; break; }
      if (h != null) {
        nhom.push({ h: h, d: 60, loai: 'Ngũ hợp', can: [a, b] }); hop[a] = hop[b] = 2;
        ghi.push('Ngũ hợp ' + BT.GAN[g[a]] + ' ' + BT.GAN[g[b]] + ' ' + kieu + ' ' + BT.HANH[h] + ' (60 độ)');
      } else { // hợp mà không hóa được xem là khắc gần: bên bị khắc hao 1/3
        hop[a] = hop[b] = 1; loss[khac(hg[a], hg[b]) ? b : a] += 12;
        ghi.push('Ngũ hợp ' + BT.GAN[g[a]] + ' ' + BT.GAN[g[b]] + ' không hóa');
      }
    });
    // 6. Địa chi cùng trụ ảnh hưởng thiên can: chi sinh hoặc cùng hành 0, can sinh chi -6, can khắc chi -12, chi khắc can -18 (tr.340–341).
    var t1 = g.map(function (_, k) {
      if (hop[k] === 2) return 0;
      var hc = hanhChi(k), r;
      if (hc === hg[k] || sinh(hc, hg[k])) r = 0; else if (sinh(hg[k], hc)) r = 6; else if (khac(hg[k], hc)) r = 12; else r = 18;
      return Math.max(0, base[k] - loss[k] - r);
    });
    // 7. Khắc giữa các thiên can không hợp: kề nhau hao 1/3 (12 độ), cách một ngôi hao 1/6 (6 độ), xa hơn không hao; một can khắc
    //    hai hoặc ba can thì mỗi can bị khắc hao 1/3. Can hư phù hoặc đã hao từ một nửa trở lên không còn lực khắc người khác;
    //    can có ngũ hợp không khắc, không bị khắc (tr.339–340).
    var khacLoss = [0, 0, 0, 0];
    for (i = 0; i < 4; i++) {
      if (hop[i] || t1[i] <= 18) continue;
      var nan = [];
      for (j = 0; j < 4; j++) if (i !== j && !hop[j] && khac(hg[i], hg[j])) nan.push(j);
      nan.forEach(function (v) {
        var kc = Math.abs(i - v), m = nan.length >= 2 ? 12 : kc === 1 ? 12 : kc === 2 ? 6 : 0;
        khacLoss[v] = Math.max(khacLoss[v], m);
      });
    }
    var canDo = t1.map(function (v, k) { return hop[k] === 2 ? 0 : Math.max(0, v - khacLoss[k]); });

    // 8. Địa chi: bản khí +6 nếu cùng hành với thiên can trực đỉnh (can có chỗ dựa), không bị xung, không dính lục hợp, tam hợp,
    //    tam hội; -8 nếu bị thiên can trực đỉnh khắc (tr.341–342). Các ví dụ trong sách chỉ cộng 6 khi chi cùng hành với can.
    var chiDo = z.map(function (_, k) {
      var ds = nguon(k);
      if (!ds.length) return ds;
      var truc = hop[k] !== 2 && base[k] >= 18, hc = BT.zhiHanh(z[k]);
      if (truc && khac(hg[k], hc)) ds[0].d = Math.max(0, ds[0].d - 8);
      else if (truc && hop[k] === 0 && hg[k] === hc && !chi[k].luc && !chi[k].tam && !chi[k].xung) ds[0].d += 6;
      if (chi[k].xung) ds[0].d *= (1 - chi[k].xung);
      return ds;
    });

    var diem = [0, 0, 0, 0, 0];
    canDo.forEach(function (v, k) { if (hop[k] !== 2) diem[hg[k]] += v; });
    chiDo.forEach(function (ds) { ds.forEach(function (n) { diem[n.h] += n.d; }); });
    nhom.forEach(function (n) { diem[n.h] += n.d; });
    // 9. Hành nắm lệnh tăng 1/5, hành bị hành nắm lệnh khắc giảm 1/5 (tr.345–346).
    var sauLenh = diem.map(function (v, e) { return e === henLenh ? v * 1.2 : khac(henLenh, e) ? v * 0.8 : v; });
    return { diem: diem, sauLenh: sauLenh, henLenh: henLenh, nhom: nhom, ghi: ghi, canDo: canDo, hop: hop, chi: chi };
  };

  // Mức vượng nhược dùng chung cho lời luận (ngưỡng vượng của sách là 40% phe mình).
  BT.mucThan = function (hoTro) {
    if (hoTro >= 60) return { key: 'vuong', ten: 'Cường Vượng' };
    if (hoTro >= 48) return { key: 'vuong', ten: 'Thân Vượng' };
    if (hoTro >= 40) return { key: 'hoa', ten: 'Trung Hòa Thiên Vượng' };
    if (hoTro >= 33) return { key: 'hoa', ten: 'Trung Hòa Thiên Nhược' };
    if (hoTro >= 20) return { key: 'nhuoc', ten: 'Thân Nhược' };
    return { key: 'nhuoc', ten: 'Cực Nhược' };
  };

  BT.nangLuongNguHanh = function (chart) {
    chart.tuTru.forEach(function (p) { p.goc = BT.thongCan(chart.tuTru, p.g); });
    var d = BT.tinhDo(chart), diem = d.sauLenh;
    var mua = BT.zhiHanh(chart.month.z); // chỉ để hiển thị vượng/tướng/hưu/tù/tử theo mùa sinh
    var trangThai = diem.map(function (_, e) {
      if (e === mua) return { ten: 'Vượng', k: 1.3 };
      if ((mua + 1) % 5 === e) return { ten: 'Tướng', k: 1.15 };
      if ((e + 1) % 5 === mua) return { ten: 'Hưu', k: 1 };
      if ((e + 2) % 5 === mua) return { ten: 'Tù', k: 0.9 };
      return { ten: 'Tử', k: 0.8 };
    });
    var tong = diem.reduce(function (s, v) { return s + v; }, 0) || 1;
    var pct = diem.map(function (v) { return Math.round(v / tong * 1000) / 10; });
    var nc = BT.ganHanh(chart.dg), an = (nc + 4) % 5;
    var hoTro = Math.round((pct[nc] + pct[an]) * 10) / 10;
    var ket = hoTro >= BT.NGUONG_VUONG ? 'Thân vượng' : 'Thân nhược';
    var hy = ket === 'Thân nhược' ? [an, nc] : [(nc + 1) % 5, (nc + 2) % 5, (nc + 3) % 5];
    var nh = { pct: pct, trangThai: trangThai, hoTro: hoTro, ketLuan: ket, hy: hy, nhatChu: nc, do: d, henLenh: d.henLenh, nhom: d.nhom };
    chart.nguHanh = nh;
    nh.tamDac = BT.tamDac(chart);
    return nh;
  };

  // Bốn yếu tố của nhật chủ (sách tr.69–71): được lệnh, đắc địa, được sinh, được trợ giúp.
  //  - Được lệnh: chi tháng là trường sinh, mộc dục, quan đới, lâm quan hoặc đế vượng của nhật can (can âm tính nghịch).
  //  - Đắc địa: các chi còn lại có lộc, kình dương; can dương thêm trường sinh và mộ khố.
  //  - Được sinh: có Ấn trong thiên can hoặc tàng can.
  //  - Được trợ giúp: có thiên can khác cùng hành (Tỷ Kiếp).
  // Kết luận: được lệnh mà có thêm một yếu tố thì vượng; được lệnh mà không có yếu tố nào thì vẫn không coi là vượng;
  // không được lệnh thì phải có đủ cả ba yếu tố kia mới vượng, có hai thì nửa vượng nửa nhược.
  var TEN_TS = BT.TRUONG_SINH;
  BT.tamDac = function (chart) {
    var dg = chart.dg, nc = BT.ganHanh(dg), an = (nc + 4) % 5, duong = BT.isDuong(dg);
    var tsThang = BT.truongSinh(dg, chart.month.z), lenh = tsThang <= 4;
    var chiKhac = chart.tuTru.filter(function (p) { return p.ten !== 'Tháng'; });
    var diaCho = [], viTri = { 'Năm': 0, 'Tháng': 1, 'Ngày': 2, 'Giờ': 3 };
    var cd = chart.nguHanh && chart.nguHanh.do && chart.nguHanh.do.chi;
    chiKhac.forEach(function (p) {
      var f = cd && cd[viTri[p.ten]];
      if (f && (f.hoa >= 0 || f.khuBi || f.xung)) return; // chi đã hợp hoặc bị xung thì mất gốc (sách tr.184: Tý Sửu hợp nên mất)
      var t = BT.truongSinh(dg, p.z);
      if (t === 3 || t === 4 || (duong && (t === 0 || t === 8))) diaCho.push(BT.ZHI[p.z] + ' (trụ ' + p.ten.toLowerCase() + ', ' + TEN_TS[t] + ')');
    });
    var sinhTu = [], troTu = [];
    chart.tuTru.forEach(function (p) {
      if (p.ten !== 'Ngày') {
        if (BT.ganHanh(p.g) === an) sinhTu.push(BT.GAN[p.g] + ' (' + BT.THAP_THAN[BT.thapThan(dg, p.g)] + ', trụ ' + p.ten.toLowerCase() + ')');
        if (BT.ganHanh(p.g) === nc) troTu.push(BT.GAN[p.g] + ' (' + BT.THAP_THAN[BT.thapThan(dg, p.g)] + ', trụ ' + p.ten.toLowerCase() + ')');
      }
      BT.TANG_CAN[p.z].forEach(function (tg) {
        if (BT.ganHanh(tg) === an) sinhTu.push(BT.GAN[tg] + ' tàng trong ' + BT.ZHI[p.z]);
      });
    });
    var dia = diaCho.length > 0, sinh_ = sinhTu.length > 0, tro = troTu.length > 0;
    var so = (dia ? 1 : 0) + (sinh_ ? 1 : 0) + (tro ? 1 : 0);
    var ket = lenh ? (so >= 1 ? 'vuong' : 'nhuoc') : (so === 3 ? 'vuong' : so === 2 ? 'nua' : 'nhuoc');
    var ketTen = { vuong: 'thiên vượng', nhuoc: 'thiên nhược', nua: 'nửa vượng nửa nhược' }[ket];
    return { lenh: lenh, tsThang: TEN_TS[tsThang], dia: dia, diaCho: diaCho, sinh: sinh_, sinhTu: sinhTu, tro: tro, troTu: troTu,
      so: so, ket: ket, ketTen: ketTen, goc: BT.thongCan(chart.tuTru, dg) };
  };

  // ===================== CÁCH CỤC =====================
  // Sách tr.356–366: lấy chi tháng làm chính; nhân nguyên tàng trong chi tháng thấu lên thiên can nào thì lấy thập thần của can đó
  // làm cách (không thấu thì lấy bản khí). Chi tháng là lộc của nhật can thì Kiến Lộc, là đế vượng (kình dương) thì Kình Dương.
  var TEN_CACH = ['Tỷ Kiếp', 'Kiếp Tài', 'Thực Thần', 'Thương Quan', 'Thiên Tài', 'Chính Tài', 'Thất Sát', 'Chính Quan', 'Thiên Ấn', 'Chính Ấn'];
  var TEN_NGOAI = ['Khúc Trực', 'Viêm Thượng', 'Gia Tường', 'Tòng Cách (Kim)', 'Nhuận Hạ'];
  BT.dinhCach = function (chart) {
    var dg = chart.dg, mz = chart.month.z, ts = BT.truongSinh(dg, mz), nh = chart.nguHanh, nc = nh.nhatChu;
    var tang = BT.TANG_CAN[mz], thieng = [chart.year.g, chart.month.g, chart.time.g];
    var cach;
    if (ts === 3) cach = { ten: 'Kiến Lộc', can: null, thau: false };
    else if (ts === 4) cach = { ten: 'Kình Dương', can: null, thau: false };
    else {
      var thau = null; // nhân nguyên thấu lên thiên can; Tỷ Kiên, Kiếp Tài không thành cách (bảng tr.356–366)
      for (var i = 0; i < tang.length; i++) if (thieng.indexOf(tang[i]) >= 0 && BT.thapThan(dg, tang[i]) > 1) { thau = tang[i]; break; }
      var can = thau != null ? thau : tang[0], tt = BT.thapThan(dg, can);
      cach = { ten: TEN_CACH[tt], can: can, thau: thau != null, tt: tt };
    }
    // Cách đặc biệt: hóa khí (nhật can hợp hóa thành công) hoặc chuyên vượng (một hành độc vượng, không có hành khắc).
    var dac = null;
    nh.nhom.forEach(function (n) {
      // Chỉ là hóa khí cách khi nhật can thật sự đổi hành; phu tòng thê / thê tòng phu về đúng hành nhật can thì
      // nhật chủ vẫn giữ hành cũ (chỉ can kia đổi sang phe mình), luận Phù ức như thường.
      if (n.loai === 'Ngũ hợp' && n.can.indexOf(2) >= 0 && n.h !== nc) dac ={ ten: 'Hóa ' + BT.HANH[n.h], D: n.h, hy: (n.h + 4) % 5, loai: 'hoa' };
    });
    if (!dac && nh.hoTro >= 65) {
      var kh = (nc + 3) % 5; // hành khắc nhật chủ
      var thangOk = nc === 2 ? [1, 4, 7, 10].indexOf(mz) >= 0 || BT.zhiHanh(mz) === 2
        : BT.zhiHanh(mz) === nc || nh.nhom.some(function (n) { return n.h === nc; });
      var coKhac = [chart.year, chart.month, chart.day, chart.time].some(function (p) { return BT.ganHanh(p.g) === kh || BT.zhiHanh(p.z) === kh; });
      if (thangOk && !coKhac) dac = { ten: TEN_NGOAI[nc], D: nc, hy: (nc + 4) % 5, loai: 'vuong' };
    }
    cach.dac = dac;
    return cach;
  };

  // ===================== BẢNG DỤNG THẦN ĐIỀU HẦU (sách tr.389–396) =====================
  // Theo can ngày, mỗi tháng âm (tháng 1 = Dần … 12 = Sửu) có thứ tự ưu tiên các thiên can điều hầu.
  var DIEU_HAU = [
    [[2, 9], [6, 2, 3], [6, 3, 8], [9, 3, 6], [9, 3, 6], [9, 6, 3], [6, 3, 8], [6, 3, 2], [6, 0, 3, 8, 9], [6, 3, 2, 4], [3, 6, 2], [3, 6, 2]],
    [[2, 9], [2, 9], [9, 2, 4], [9], [9, 2], [9, 2], [2, 9, 5], [9, 2, 3], [9, 7], [2, 4], [2], [2]],
    [[8, 6], [8, 5], [8, 0], [8, 6, 9], [8, 6], [8, 6], [8, 4], [8, 9], [0, 8], [0, 4, 6, 8], [8, 4, 5], [8, 0]],
    [[0, 6], [6, 0], [0, 6, 4], [0, 6], [8, 6, 9], [0, 8, 6], [0, 6, 2, 4], [0, 6, 2, 4], [0, 6, 4], [0, 6], [0, 6], [0, 6]],
    [[2, 0, 9], [2, 0, 9], [0, 2, 9], [0, 2, 9], [8, 0, 2], [9, 2, 0], [2, 9, 0], [2, 9], [0, 2, 9], [0, 2], [2, 0], [2, 0]],
    [[2, 6, 0], [0, 9, 2], [2, 9, 0], [9, 2], [9, 2], [9, 2], [2, 9], [2, 9], [0, 2, 9], [2, 0, 4], [2, 0, 4], [2, 0, 4]],
    [[4, 0, 2, 8, 3], [3, 0, 2, 6], [0, 3, 8, 9], [8, 2, 3, 4], [8, 9], [3, 0], [3, 0], [3, 0, 2], [0, 8], [3, 2], [3, 0, 2], [2, 3, 0]],
    [[5, 8, 6], [8, 0], [8, 0], [8, 0, 9], [8, 5, 9], [8, 6, 0], [8, 0, 4], [8, 0, 3], [8, 0], [8, 2], [2, 4, 8, 0], [2, 4, 8, 5]],
    [[6, 2, 4], [4, 7, 6], [0, 6, 2], [8, 7, 6, 9], [9, 6, 7], [7, 0], [4, 3], [0, 6], [0, 2, 4], [4, 2, 6], [4, 2], [2, 0, 3]],
    [[7, 2], [6, 7], [2, 7, 0], [7], [6, 7, 9], [6, 7, 9], [3], [7, 2], [7, 0, 9, 8], [6, 7, 4, 3], [2, 7], [2, 3]]
  ];
  BT.bangDieuHau = function (chart) {
    var thang = (chart.month.z - 2 + 12) % 12, ds = DIEU_HAU[chart.dg][thang];
    var co = [], thieu = [];
    ds.forEach(function (c) {
      var thay = chart.tuTru.some(function (p) { return (p.ten !== 'Ngày' && p.g === c) || BT.TANG_CAN[p.z].indexOf(c) >= 0; });
      (thay ? co : thieu).push(c);
    });
    return { thang: thang + 1, ds: ds, co: co, thieu: thieu };
  };

  // ===================== DỤNG THẦN =====================
  // Theo sách tr.97–111, 378–381: dụng thần là "thuốc" chữa "bệnh" (bên nặng) của tứ trụ; có ba phép: sinh phù/áp chế,
  // thông quan, điều hầu. Phép chính là sinh phù/áp chế theo bảng bệnh–thuốc ở tr.108; thông quan và điều hầu bổ trợ.
  // Vai trò: 0 Dụng, 1 Hỷ (cùng phe, trợ Dụng), 2 Kỵ (hành mạnh nhất của phe đối lập), 3 Cừu (hành mạnh thứ hai phe đối lập),
  // 4 Nhàn (hành còn lại, ảnh hưởng trung tính)
  BT.VAI_TRO = ['Dụng thần', 'Hỷ thần', 'Kỵ thần', 'Cừu thần', 'Nhàn thần'];
  BT.NHOM_THAP_THAN = ['Tỷ Kiếp', 'Thực Thương', 'Tài tinh', 'Quan Sát', 'Ấn tinh']; // theo (hành - nhật chủ + 5) % 5
  BT.timDungThan = function (chart) {
    var nh = chart.nguHanh, nc = nh.nhatChu, p = nh.pct;
    var ty = nc, thuc = (nc + 1) % 5, tai = (nc + 2) % 5, quan = (nc + 3) % 5, an = (nc + 4) % 5;
    function co(e) { return p[e] >= 5; } // "có trong mệnh": từ 5% độ trở lên (dưới mức đó coi như không có)
    var H = BT.HANH;
    // Nhóm thập thần theo hành: T Tỷ Kiếp, S Thực Thương, C Tài, Q Quan Sát, A Ấn
    var NHOM = { T: ty, S: thuc, C: tai, Q: quan, A: an };
    var TEN_NHOM = { T: 'Tỷ Kiếp', S: 'Thực Thương', C: 'Tài tinh', Q: 'Quan Sát', A: 'Ấn tinh' };
    // Chọn Dụng thần theo cách cục (sách tr.378–381): "nhật chủ vượng/nhược, nhóm X nhiều → lấy các nhóm sau (theo thứ tự có trong mệnh)".
    var QUY_TAC = {
      tai:    { vuong: { T: 'QS', A: 'CS', S: 'C' }, nhuoc: { C: 'T', S: 'AT', Q: 'TA' } },
      quan:   { vuong: { T: 'QS', A: 'CQ', S: 'AC' }, nhuoc: { C: 'TA', Q: 'AT', S: 'A' } },
      an:     { vuong: { T: 'QS', C: 'Q', A: 'CS' }, nhuoc: { S: 'AT', Q: 'AT', C: 'TA' } },
      thuong: { vuong: { T: 'Q', A: 'CQ' }, nhuoc: { S: 'AT', C: 'TA', Q: 'AT' } },
      sat:    { vuong: { T: 'QC', A: 'CQS', Q: 'S' }, nhuoc: { C: 'TA', Q: 'AT', S: 'AT' } },
      thuc:   { vuong: { T: 'QSC', A: 'CQS', C: 'QS' }, nhuoc: { C: 'AT', S: 'AT' } },
      loc:    { vuong: { '*': 'CQS' }, nhuoc: { '*': 'AT' } }
    };
    var KHOA = { 'Chính Tài': 'tai', 'Thiên Tài': 'tai', 'Chính Quan': 'quan', 'Chính Ấn': 'an', 'Thiên Ấn': 'an', 'Thương Quan': 'thuong',
      'Thất Sát': 'sat', 'Thực Thần': 'thuc', 'Kiến Lộc': 'loc', 'Kình Dương': 'loc' };
    var cachTen = chart.cachCuc ? chart.cachCuc.ten : null, khoa = KHOA[cachTen] || 'tai';
    function phuUc(nhuoc) {
      var ban = nhuoc ? ['S', 'C', 'Q'] : ['T', 'A', 'S', 'C', 'Q'];
      var nhieu = ban.sort(function (a, b) { return p[NHOM[b]] - p[NHOM[a]]; })[0];
      var bang = QUY_TAC[khoa][nhuoc ? 'nhuoc' : 'vuong'];
      var ds = bang[nhieu] || bang['*'] || (nhuoc ? 'AT' : (p[an] > p[ty] ? 'CQS' : 'QSC'));
      var dsPhu = ds.split('');
      var chon = dsPhu.filter(function (k) { return co(NHOM[k]); });
      var thieu = chon.length === 0;
      var D = NHOM[(chon[0] || dsPhu[0])], D2 = NHOM[(chon[1] || dsPhu.filter(function (k) { return NHOM[k] !== D; })[0] || dsPhu[0])];
      var tenD = TEN_NHOM[chon[0] || dsPhu[0]];
      var lyDo = 'Cách ' + (cachTen || 'phổ thông') + ', thân ' + (nhuoc ? 'nhược' : 'vượng') + ' mà ' + TEN_NHOM[nhieu] + ' nhiều: lấy ' + tenD + ' làm Dụng thần' +
        (thieu ? ' (trong mệnh chưa có hành này, cần bổ sung nhờ vận, năm và môi trường)' : '') + ' (sách tr.378–381).';
      if (nh.hoTro >= 35 && nh.hoTro < 45) lyDo = 'Lá số gần cân bằng. ' + lyDo;
      return { D: D, D2: D2, lyDo: lyDo, nhieu: nhieu, thieu: thieu };
    }
    var nhuoc = nh.hoTro < BT.NGUONG_VUONG;
    var pu = phuUc(nhuoc), D = pu.D, lyDo = pu.lyDo;
    var P = D; // dụng thần theo phù ức

    // Sát ngưỡng: lực phe mình trong khoảng ±5 điểm quanh mốc 40% thì chỉ cần lệch ít là đổi phe vượng/nhược, kéo theo đổi Dụng thần.
    var satNguong = null;
    if (Math.abs(nh.hoTro - BT.NGUONG_VUONG) < 5) {
      var alt = phuUc(!nhuoc);
      satNguong = { hoTro: nh.hoTro, cach: Math.round(Math.abs(nh.hoTro - BT.NGUONG_VUONG) * 10) / 10, D2: alt.D,
        phia: nhuoc ? 'hơi nhược' : 'hơi vượng', phia2: nhuoc ? 'hơi vượng' : 'hơi nhược' };
    }

    // Cách đặc biệt và tòng cách (sách tr.369–376, 381). Chỉ cách Hóa khí (nhật chủ hợp hóa thành công theo đúng quy tắc tính độ)
    // mới tự đổi Dụng thần; chuyên vượng và tòng cách dùng ngưỡng ước lượng nên app chỉ cảnh báo để người luận xét thêm.
    var td = nh.tamDac, tong = null, tuTru = chart.tuTru, dac = chart.cachCuc && chart.cachCuc.dac;
    if (dac) {
      tong = { loai: dac.ten, chan: false, D2: dac.D, hy2: dac.hy,
        text: 'Có dấu hiệu cách đặc biệt ' + dac.ten + ' (sách tr.369–376): ' + (dac.loai === 'hoa'
          ? 'nhật chủ hợp hóa thành ' + H[dac.D] + ' thành công, lá số theo thế hóa khí.'
          : 'một hành độc vượng (' + nh.hoTro + '% thuộc phe nhật chủ), không có hành khắc chế.') +
          ' Nếu luận theo cách này, Dụng thần là ' + H[dac.D] + ', Hỷ thần là ' + H[dac.hy] + '; khác với kết quả Phù ức ở trên.' };
    } else {
      var canTroTru = tuTru.filter(function (q) { return q.ten !== 'Ngày' && (BT.ganHanh(q.g) === ty || BT.ganHanh(q.g) === an); });
      var chiTangAn = tuTru.some(function (q) { return BT.TANG_CAN[q.z].some(function (tg) { return BT.ganHanh(tg) === an; }); });
      // Sách tr.373–375: tòng tài lấy Thực Thương sinh Tài, tòng sát lấy Tài, tòng nhi lấy Thực Thương làm dụng thần.
      var TEN_TONG = {}; TEN_TONG[thuc] = ['Tòng nhi', 'Thực Thương', thuc, tai]; TEN_TONG[tai] = ['Tòng tài', 'Tài tinh', thuc, tai]; TEN_TONG[quan] = ['Tòng sát', 'Quan Sát', tai, quan];
      var voCan = td.goc.muc === 0 && !chiTangAn && (canTroTru.length === 0 || (nh.hoTro < 35 && canTroTru.every(function (q) { return q.goc.muc === 0; })));
      // Theo tính độ (đã trừ phần gốc bị hợp hóa, bị xung tan), phe nhật chủ dưới 20% là Cực Nhược: cũng cảnh báo Tòng.
      var cucNhuoc = !voCan && nh.hoTro < 20;
      if (voCan || cucNhuoc) {
        var theo = [thuc, tai, quan].sort(function (a, b) { return p[b] - p[a]; })[0], tt = TEN_TONG[theo];
        var chan = voCan && canTroTru.length === 0;
        tong = { loai: tt[0], chan: chan, D2: tt[2], hy2: tt[3],
          text: (chan ? 'Có dấu hiệu Chân tòng' : 'Có dấu hiệu Giả tòng') + ' (' + tt[0] + '): ' + (cucNhuoc
            ? 'sau khi tính hợp hóa, xung và khắc, phe nhật chủ ' + BT.GAN[chart.dg] + ' (Tỷ Kiếp + Ấn) chỉ còn ' + nh.hoTro + '% tổng độ, dưới mức 20%.'
            : 'nhật chủ ' + BT.GAN[chart.dg] + ' vô căn, địa chi không tàng Ấn' +
            (chan ? ', thiên can không có Tỷ Kiếp hay Ấn.' : ', các can ' + canTroTru.map(function (q) { return BT.GAN[q.g]; }).join(', ') + ' đỡ thân đều vô căn, lực hỗ trợ chỉ ' + nh.hoTro + '%.')) +
            ' Nếu luận Tòng, lá số thuận theo ' + tt[1] + ' (' + H[theo] + ') đang mạnh nhất: Dụng thần là ' + H[tt[2]] + ', Hỷ thần là ' + H[tt[3]] +
            ', kỵ Ấn và Tỷ Kiếp; ngược hẳn với kết quả Phù ức ở trên.' +
            (chan ? '' : ' Giả tòng chỉ thành khi các can đỡ thân bị khắc chế; nếu Ấn hoặc Tỷ được vận, năm sinh trợ thì vẫn luận theo Phù ức.') };
      }
    }

    // Đối chiếu bốn yếu tố với kết quả tính độ; chỉ cảnh báo khi hai bên lệch rõ.
    var lechTamDac = null;
    if ((td.ket === 'vuong' && nhuoc) || (td.ket === 'nhuoc' && !nhuoc)) lechTamDac = 'Hai cách đánh giá chưa thống nhất: theo tính độ ngũ hành, lá số ' + (nhuoc ? 'thiên nhược' : 'thiên vượng') +
      ' (phe nhật chủ ' + nh.hoTro + '%, mốc 40%), nhưng xét bốn yếu tố (được lệnh, đắc địa, được sinh, được trợ) thì ' + td.ketTen +
      '. Nên xem kỹ sức của nguyệt lệnh và gốc của nhật chủ trước khi chốt Dụng thần.';

    // Điều hầu (khí hậu). Sách tr.100–101: sinh tháng hạ phải dùng Thủy, sinh tháng đông phải dùng Hỏa điều hầu.
    // dieuHau: chỉ khi hành điều hầu thiếu (dưới 12%), dùng làm căn cứ luận "hàn/khô nóng".
    // ghiChuDieuHau: luôn có cho người sinh mùa đông/hạ, kể cả khi hành điều hầu không thiếu.
    var mz = chart.month.z, dieuHau = null, ghiChuDieuHau = null;
    var dongSinh = [11, 0, 1].indexOf(mz) >= 0, haSinh = [5, 6, 7].indexOf(mz) >= 0;
    if (dongSinh || haSinh) {
      var eDH = dongSinh ? 1 : 4, mua = dongSinh ? 'mùa đông' : 'mùa hạ', canh = dongSinh ? 'sưởi ấm' : 'giải nhiệt, làm mát';
      if (p[eDH] < 12) {
        dieuHau = { e: eDH, text: dongSinh ? 'Sinh mùa đông, lá số lạnh và thiếu Hỏa: cần Hỏa để điều hòa khí hậu.' : 'Sinh mùa hạ, lá số nóng và thiếu Thủy: cần Thủy để điều hòa khí hậu.' };
        ghiChuDieuHau = { e: eDH, thieu: true, text: dieuHau.text };
      } else {
        ghiChuDieuHau = { e: eDH, thieu: false, text: 'Sinh ' + mua + ', theo phép Điều hầu lá số vẫn cần ' + H[eDH] + ' để ' + canh +
          '. Hiện ' + H[eDH] + ' đạt ' + p[eDH] + '% nên khí hậu đã được điều hòa phần nào, không cần bổ sung gấp.' };
      }
    }
    var bdh = BT.bangDieuHau(chart);
    bdh.text = 'Bảng Điều hầu (sách tr.389–396): ngày ' + BT.GAN[chart.dg] + ' sinh tháng ' + bdh.thang + ' âm ưu tiên ' +
      bdh.ds.map(function (c) { return BT.GAN[c]; }).join(', ') + '. Trong lá số ' +
      (bdh.co.length ? 'có ' + bdh.co.map(function (c) { return BT.GAN[c]; }).join(', ') : 'không có can nào trong số đó') +
      (bdh.thieu.length ? '; chưa có ' + bdh.thieu.map(function (c) { return BT.GAN[c]; }).join(', ') + '.' : '.');

    var hy, vai = [];
    if (dac && dac.loai === 'hoa') {
      // Cách hóa khí: nhật chủ đã hợp hóa thành công nên lấy chính hành hóa làm Dụng thần (sách tr.381–382).
      // Hỷ là hành sinh Dụng, Nhàn là hành do Dụng sinh, Kỵ là hành khắc Dụng, Cừu là hành sinh Kỵ.
      D = dac.D; P = D; hy = (D + 4) % 5;
      vai[D] = 0; vai[hy] = 1; vai[(D + 3) % 5] = 2; vai[(D + 2) % 5] = 3; vai[(D + 1) % 5] = 4;
      lyDo = 'Cách ' + dac.ten + ': nhật chủ ' + BT.GAN[chart.dg] + ' hợp hóa thành công nên lấy ' + H[D] + ' làm Dụng thần (sách tr.381–382).';
    } else {
      // Hỷ cùng phe với Dụng; Kỵ, Cừu, Nhàn là phe đối lập xếp theo độ mạnh
      var nangDo = [an, ty], tietKhi = [thuc, tai, quan];
      var phe = nangDo.indexOf(D) >= 0 ? nangDo : tietKhi, doi = nangDo.indexOf(D) >= 0 ? tietKhi : nangDo;
      hy = D === quan ? tai : D === thuc ? tai : D === tai ? thuc : phe.filter(function (e) { return e !== D; })[0];
      var con = doi.slice().sort(function (a, b) { return p[b] - p[a]; });
      vai[D] = 0; vai[hy] = 1; vai[con[0]] = 2; vai[con[1]] = 3;
      [0, 1, 2, 3, 4].forEach(function (e) { if (vai[e] == null) vai[e] = 4; });
    }

    // Danh sách theo thứ tự hiển thị: Dụng, Hỷ, Nhàn, Kỵ, Cừu
    var ds = [{ e: D, vai: 0 }, { e: hy, vai: 1 }];
    [4, 2, 3].forEach(function (v) {
      [0, 1, 2, 3, 4].forEach(function (e) { if (vai[e] === v) ds.push({ e: e, vai: v, so: v === 2 ? 1 : v === 3 ? 2 : undefined }); });
    });
    // Hành điều hầu đang bị xếp vào phe bất lợi: nói rõ chỉ phần dư thừa mới xấu
    if (ghiChuDieuHau && !ghiChuDieuHau.thieu && (vai[ghiChuDieuHau.e] === 2 || vai[ghiChuDieuHau.e] === 3)) {
      ghiChuDieuHau.xungDot = true;
      ghiChuDieuHau.text += ' Theo Phù ức, ' + H[ghiChuDieuHau.e] + ' đang là ' + BT.VAI_TRO[vai[ghiChuDieuHau.e]] +
        ': phần dư thừa mới bất lợi, còn một lượng vừa phải vẫn có ích cho khí hậu của lá số.';
    }
    if (satNguong) satNguong.text = 'Kết luận sát ngưỡng: phe nhật chủ (Tỷ Kiếp + Ấn) chiếm ' + satNguong.hoTro + '%, chỉ cách mốc 40% của sách ' + satNguong.cach +
      ' điểm. App đang xét lá số ' + satNguong.phia + ' nên chọn ' + H[D] + ' làm Dụng thần; nếu xét ' + satNguong.phia2 +
      ', Dụng thần sẽ là ' + H[satNguong.D2] + '. Nên đối chiếu thêm việc nhật chủ có đắc lệnh, có gốc ở địa chi hay không và yếu tố Điều hầu trước khi kết luận.';
    return { D: D, P: P, vai: vai, ds: ds, lyDo: lyDo, dieuHau: dieuHau, ghiChuDieuHau: ghiChuDieuHau, bangDieuHau: bdh, satNguong: satNguong,
      tong: tong, lechTamDac: lechTamDac };
  };

  // Đánh giá một cặp can chi (đại vận, lưu niên, lưu nguyệt) theo dụng thần. Chi nặng hơn can (can 2 phần, chi 3 phần).
  // Tính bằng số nguyên để tránh sai số dấu phẩy động ở ngưỡng (0.4*-2 + 0.6*2 = 0.3999… trong JS).
  // Rất thuận cần có Dụng thần đi kèm Dụng/Hỷ; Rất nghịch là Kỵ đi kèm Kỵ/Cừu. Hỷ+Hỷ chỉ là Thuận, Cừu+Cừu chỉ là Nghịch.
  var DIEM_VAI = [2, 1, -2, -1, 0];
  BT.danhGia = function (chart, g, z) {
    var dt = chart.dungThan;
    var vg = dt.vai[BT.ganHanh(g)], vz = dt.vai[BT.zhiHanh(z)];
    var t = 2 * DIEM_VAI[vg] + 3 * DIEM_VAI[vz]; // từ -10 đến 10
    var muc = t >= 7 ? 'Rất thuận' : t >= 2 ? 'Thuận' : t > -2 ? 'Bình' : t > -7 ? 'Nghịch' : 'Rất nghịch';
    return { diem: t / 5, muc: muc, vg: vg, vz: vz };
  };
})(window.BT);
