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
  function eightChar(s) { var ec = s.getLunar().getEightChar(); ec.setSect(2); return ec; } // sect 2: giờ Tý muộn giữ ngày cũ
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
    chart.nguHanh = BT.nangLuongNguHanh(chart);
    chart.dungThan = BT.timDungThan(chart);
    return chart;
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

  // Năng lượng ngũ hành có trọng số: can tính theo độ thông căn (gốc khí chính 1, khí giữa 0.8, khí dư 0.7, vô căn 0.5),
  // chi chia theo tàng can, chi tháng x1.5, rồi nhân hệ số mùa sinh (vượng tướng hưu tù tử)
  var TACH = { 1: [1], 2: [0.7, 0.3], 3: [0.6, 0.3, 0.1] };
  var HE_SO_CAN = [0.5, 0.7, 0.8, 1];
  BT.nangLuongNguHanh = function (chart) {
    var diem = [0, 0, 0, 0, 0];
    chart.tuTru.forEach(function (p) {
      p.goc = BT.thongCan(chart.tuTru, p.g);
      diem[BT.ganHanh(p.g)] += HE_SO_CAN[p.goc.muc];
      var w = TACH[BT.TANG_CAN[p.z].length], heSo = p.ten === 'Tháng' ? 1.5 : 1;
      BT.TANG_CAN[p.z].forEach(function (tg, i) { diem[BT.ganHanh(tg)] += w[i] * heSo; });
    });
    var mua = BT.zhiHanh(chart.month.z);
    var trangThai = diem.map(function (_, e) {
      if (e === mua) return { ten: 'Vượng', k: 1.3 };
      if ((mua + 1) % 5 === e) return { ten: 'Tướng', k: 1.15 };
      if ((e + 1) % 5 === mua) return { ten: 'Hưu', k: 1 };
      if ((e + 2) % 5 === mua) return { ten: 'Tù', k: 0.9 };
      return { ten: 'Tử', k: 0.8 };
    });
    var tong = 0;
    diem = diem.map(function (v, e) { v *= trangThai[e].k; tong += v; return v; });
    var pct = diem.map(function (v) { return Math.round(v / tong * 1000) / 10; });
    var nc = BT.ganHanh(chart.dg), an = (nc + 4) % 5;
    var hoTro = Math.round((pct[nc] + pct[an]) * 10) / 10;
    var ket = hoTro >= 55 ? 'Thân vượng' : hoTro >= 45 ? 'Trung hòa' : 'Thân nhược';
    var hy = ket === 'Thân nhược' ? [an, nc] : ket === 'Thân vượng' ? [(nc + 1) % 5, (nc + 2) % 5, (nc + 3) % 5] : [];
    return { pct: pct, trangThai: trangThai, hoTro: hoTro, ketLuan: ket, hy: hy, nhatChu: nc, tamDac: BT.tamDac(chart) };
  };

  // Tam đắc của nhật chủ, phép đối chiếu cổ điển (đắc hai trong ba thì thiên vượng, đắc một hoặc không thì thiên nhược):
  //  - Đắc lệnh: khí chính của chi tháng là Tỷ Kiếp hoặc Ấn của nhật chủ.
  //  - Đắc địa: nhật chủ thông căn, tức có cùng hành trong tàng can của ít nhất một địa chi.
  //  - Đắc thế: trong ba thiên can còn lại có từ hai can Tỷ Kiếp hoặc Ấn trở lên.
  BT.tamDac = function (chart) {
    var dg = chart.dg, nc = BT.ganHanh(dg), an = (nc + 4) % 5;
    function phe(e) { return e === nc || e === an; }
    var khiThang = BT.TANG_CAN[chart.month.z][0];
    var lenh = phe(BT.ganHanh(khiThang));
    var goc = BT.thongCan(chart.tuTru, dg);
    var canTro = chart.tuTru.filter(function (p) { return p.ten !== 'Ngày' && phe(BT.ganHanh(p.g)); })
      .map(function (p) { return BT.GAN[p.g] + ' (' + BT.THAP_THAN[BT.thapThan(dg, p.g)] + ', trụ ' + p.ten.toLowerCase() + ')'; });
    var the = canTro.length >= 2;
    var so = (lenh ? 1 : 0) + (goc.muc > 0 ? 1 : 0) + (the ? 1 : 0);
    return { lenh: lenh, khiThang: BT.GAN[khiThang] + ' ' + BT.HANH[BT.ganHanh(khiThang)] + ' (' + BT.THAP_THAN[BT.thapThan(dg, khiThang)] + ')',
      dia: goc.muc > 0, goc: goc, the: the, canTro: canTro, so: so };
  };

  // Dụng thần theo phép Phù ức (nâng đỡ khi nhược, tiết chế khi vượng), kèm Điều hầu cho người sinh mùa đông/hạ.
  // Vai trò: 0 Dụng, 1 Hỷ (cùng phe, trợ Dụng), 2 Kỵ (hành mạnh nhất của phe đối lập), 3 Cừu (hành mạnh thứ hai phe đối lập),
  // 4 Nhàn (hành còn lại, ảnh hưởng trung tính)
  BT.VAI_TRO = ['Dụng thần', 'Hỷ thần', 'Kỵ thần', 'Cừu thần', 'Nhàn thần'];
  BT.NHOM_THAP_THAN = ['Tỷ Kiếp', 'Thực Thương', 'Tài tinh', 'Quan Sát', 'Ấn tinh']; // theo (hành - nhật chủ + 5) % 5
  BT.timDungThan = function (chart) {
    var nh = chart.nguHanh, nc = nh.nhatChu, p = nh.pct;
    var ty = nc, thuc = (nc + 1) % 5, tai = (nc + 2) % 5, quan = (nc + 3) % 5, an = (nc + 4) % 5;
    // Phù ức theo một phía (nhược hoặc vượng); dùng lại để tính phương án thay thế khi kết luận sát ngưỡng
    function phuUc(nhuoc) {
      var D, lyDo;
      if (nhuoc) {
        var manh = [thuc, tai, quan].sort(function (a, b) { return p[b] - p[a]; })[0];
        if (manh === tai) { D = ty; lyDo = 'Thân nhược, Tài tinh nặng nhất làm hao thân và khắc Ấn, nên dùng Tỷ Kiếp để gánh Tài.'; }
        else if (manh === quan) { D = an; lyDo = 'Thân nhược, Quan Sát nặng nhất, dùng Ấn tinh để hóa Sát sinh thân.'; }
        else { D = an; lyDo = 'Thân nhược, Thực Thương tiết khí nhiều, dùng Ấn tinh vừa sinh thân vừa chế Thực Thương.'; }
        if (nh.ketLuan === 'Trung hòa') lyDo = 'Lá số gần trung hòa, hơi nghiêng nhược. ' + lyDo.replace('Thân nhược, ', '').replace(/^./, function (c) { return c.toUpperCase(); });
      } else {
        if (p[an] > p[ty]) { D = tai; lyDo = 'Thân vượng nhờ Ấn tinh nhiều, dùng Tài tinh để khắc bớt Ấn.'; }
        else if (p[quan] >= 10) { D = quan; lyDo = 'Thân vượng do Tỷ Kiếp nhiều, dùng Quan Sát để chế ngự.'; }
        else { D = thuc; lyDo = 'Thân vượng do Tỷ Kiếp nhiều mà Quan Sát yếu, dùng Thực Thương để tiết khí, lưu thông.'; }
        if (nh.ketLuan === 'Trung hòa') lyDo = 'Lá số gần trung hòa, hơi nghiêng vượng. ' + lyDo.replace('Thân vượng', 'Phần dư');
      }
      return { D: D, lyDo: lyDo };
    }
    var nhuoc = nh.hoTro < 50;
    var pu = phuUc(nhuoc), D = pu.D, lyDo = pu.lyDo;
    var P = D; // dụng thần theo phù ức

    // Sát ngưỡng: lực hỗ trợ trong khoảng 45–55% thì chỉ cần lệch vài điểm là đổi phe vượng/nhược, kéo theo đổi Dụng thần
    var satNguong = null;
    if (nh.hoTro >= 45 && nh.hoTro < 55) {
      var alt = phuUc(!nhuoc);
      satNguong = { hoTro: nh.hoTro, cach: Math.round(Math.abs(nh.hoTro - 50) * 10) / 10, D2: alt.D,
        phia: nhuoc ? 'hơi nhược' : 'hơi vượng', phia2: nhuoc ? 'hơi vượng' : 'hơi nhược' };
    }

    // Tòng cách (lá số đặc biệt). App chỉ cảnh báo, không tự đổi Dụng thần, vì định tòng cần người luận xét thêm.
    //  - Chân tòng nhược: nhật chủ vô căn, không có can Tỷ Kiếp/Ấn, địa chi không tàng Ấn.
    //  - Giả tòng nhược: nhật chủ vô căn, lực hỗ trợ dưới 35%, có Tỷ/Ấn lộ nhưng đều vô căn và địa chi không tàng Ấn.
    //  - Tòng cường (chuyên vượng): nhật chủ đắc lệnh, Ấn + Tỷ từ 80% trở lên, Quan Sát dưới 8% và không có can Quan Sát có gốc.
    var td = nh.tamDac, tong = null, tuTru = chart.tuTru;
    var canTroTru = tuTru.filter(function (q) { return q.ten !== 'Ngày' && (BT.ganHanh(q.g) === ty || BT.ganHanh(q.g) === an); });
    var chiTangAn = tuTru.some(function (q) { return BT.TANG_CAN[q.z].some(function (tg) { return BT.ganHanh(tg) === an; }); });
    var TEN_TONG = {}; TEN_TONG[thuc] = ['Tòng nhi', 'Thực Thương', tai]; TEN_TONG[tai] = ['Tòng tài', 'Tài tinh', thuc]; TEN_TONG[quan] = ['Tòng sát', 'Quan Sát', tai];
    if (td.goc.muc === 0 && !chiTangAn && (canTroTru.length === 0 || (nh.hoTro < 35 && canTroTru.every(function (q) { return q.goc.muc === 0; })))) {
      var theo = [thuc, tai, quan].sort(function (a, b) { return p[b] - p[a]; })[0], tt = TEN_TONG[theo];
      var chan = canTroTru.length === 0;
      tong = { loai: tt[0], chan: chan, D2: theo, hy2: tt[2],
        text: (chan ? 'Có dấu hiệu Chân tòng' : 'Có dấu hiệu Giả tòng') + ' (' + tt[0] + '): nhật chủ ' + BT.GAN[chart.dg] + ' vô căn, địa chi không tàng Ấn' +
          (chan ? ', thiên can không có Tỷ Kiếp hay Ấn.' : ', các can ' + canTroTru.map(function (q) { return BT.GAN[q.g]; }).join(', ') + ' đỡ thân đều vô căn, lực hỗ trợ chỉ ' + nh.hoTro + '%.') +
          ' Nếu luận Tòng, lá số thuận theo ' + tt[1] + ' (' + BT.HANH[theo] + ') đang mạnh nhất: Dụng thần là ' + BT.HANH[theo] + ', Hỷ thần là ' + BT.HANH[tt[2]] +
          ', kỵ Ấn và Tỷ Kiếp; ngược hẳn với kết quả Phù ức ở trên.' +
          (chan ? '' : ' Giả tòng chỉ thành khi các can đỡ thân bị khắc chế; nếu Ấn hoặc Tỷ được vận, năm sinh trợ thì vẫn luận theo Phù ức.') };
    } else if (nh.hoTro >= 80 && td.lenh && p[quan] < 8 && !tuTru.some(function (q) { return q.ten !== 'Ngày' && BT.ganHanh(q.g) === quan && q.goc.muc > 0; })) {
      var chuyen = p[ty] >= p[an] ? ty : an;
      tong = { loai: 'Tòng cường', chan: false, D2: chuyen, hy2: chuyen === ty ? an : ty,
        text: 'Có dấu hiệu Tòng cường (chuyên vượng): Ấn và Tỷ Kiếp chiếm ' + nh.hoTro + '%, Quan Sát chỉ ' + p[quan] + '% và không có can Quan Sát có gốc. ' +
          'Nếu luận Tòng, lá số thuận theo thế vượng: Dụng thần là ' + BT.HANH[chuyen] + ', Hỷ thần là ' + BT.HANH[chuyen === ty ? an : ty] + ', kỵ Quan Sát và Tài tinh.' };
    }

    // Đối chiếu tam đắc với kết luận theo điểm số; chỉ cảnh báo khi lệch rõ (đắc đủ 3 mà điểm nhược, hoặc không đắc gì mà điểm vượng)
    var lechTamDac = null;
    if ((td.so === 3 && nhuoc) || (td.so === 0 && !nhuoc)) lechTamDac = 'Hai cách đánh giá chưa thống nhất: theo điểm ngũ hành, lá số ' + (nhuoc ? 'thiên nhược' : 'thiên vượng') +
      ' (hỗ trợ ' + nh.hoTro + '%), nhưng theo tam đắc nhật chủ đắc ' + td.so + '/3 (' + (td.so >= 2 ? 'thiên vượng' : 'thiên nhược') + '). Nên xem kỹ sức của nguyệt lệnh và gốc của nhật chủ trước khi chốt Dụng thần.';

    // Điều hầu (khí hậu): sinh mùa đông cần Hỏa, mùa hạ cần Thủy.
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
        ghiChuDieuHau = { e: eDH, thieu: false, text: 'Sinh ' + mua + ', theo phép Điều hầu lá số vẫn cần ' + BT.HANH[eDH] + ' để ' + canh +
          '. Hiện ' + BT.HANH[eDH] + ' đạt ' + p[eDH] + '% nên khí hậu đã được điều hòa phần nào, không cần bổ sung gấp.' };
      }
    }

    // Hỷ cùng phe với Dụng; Kỵ, Cừu, Nhàn là phe đối lập xếp theo độ mạnh
    var nangDo = [an, ty], tietKhi = [thuc, tai, quan];
    var phe = nangDo.indexOf(D) >= 0 ? nangDo : tietKhi, doi = nangDo.indexOf(D) >= 0 ? tietKhi : nangDo;
    var hy = D === quan ? tai : D === thuc ? tai : D === tai ? thuc : phe.filter(function (e) { return e !== D; })[0];
    var con = doi.slice().sort(function (a, b) { return p[b] - p[a]; });
    var vai = [];
    vai[D] = 0; vai[hy] = 1; vai[con[0]] = 2; vai[con[1]] = 3;
    [0, 1, 2, 3, 4].forEach(function (e) { if (vai[e] == null) vai[e] = 4; });

    // Danh sách theo thứ tự hiển thị: Dụng, Hỷ, Nhàn, Kỵ, Cừu
    var ds = [{ e: D, vai: 0 }, { e: hy, vai: 1 }];
    [4, 2, 3].forEach(function (v) {
      [0, 1, 2, 3, 4].forEach(function (e) { if (vai[e] === v) ds.push({ e: e, vai: v, so: v === 2 ? 1 : v === 3 ? 2 : undefined }); });
    });
    // Hành điều hầu đang bị xếp vào phe bất lợi: nói rõ chỉ phần dư thừa mới xấu
    if (ghiChuDieuHau && !ghiChuDieuHau.thieu && (vai[ghiChuDieuHau.e] === 2 || vai[ghiChuDieuHau.e] === 3)) {
      ghiChuDieuHau.xungDot = true;
      ghiChuDieuHau.text += ' Theo Phù ức, ' + BT.HANH[ghiChuDieuHau.e] + ' đang là ' + BT.VAI_TRO[vai[ghiChuDieuHau.e]] +
        ': phần dư thừa mới bất lợi, còn một lượng vừa phải vẫn có ích cho khí hậu của lá số.';
    }
    if (satNguong) satNguong.text = 'Kết luận sát ngưỡng: lực hỗ trợ ' + satNguong.hoTro + '%, chỉ cách mốc 50% ' + satNguong.cach +
      ' điểm. App đang xét lá số ' + satNguong.phia + ' nên chọn ' + BT.HANH[D] + ' làm Dụng thần; nếu xét ' + satNguong.phia2 +
      ', Dụng thần sẽ là ' + BT.HANH[satNguong.D2] + '. Nên đối chiếu thêm việc nhật chủ có đắc lệnh, có gốc ở địa chi hay không và yếu tố Điều hầu trước khi kết luận.';
    return { D: D, P: P, vai: vai, ds: ds, lyDo: lyDo, dieuHau: dieuHau, ghiChuDieuHau: ghiChuDieuHau, satNguong: satNguong,
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
