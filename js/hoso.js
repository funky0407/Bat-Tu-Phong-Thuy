// Hồ sơ mệnh lý: ghép số liệu lá số với kho văn mẫu (hoso-van.js) thành trang A4 để in ra PDF.
(function (BT) {
  var G = BT.GAN, Z = BT.ZHI, H = BT.HANH, TT = BT.THAP_THAN, V;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hoa(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function thuong(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function pc(v) { return (Math.round(v * 10) / 10) + '%'; }
  function dam(s) { return s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function gz(g, z) { return G[g] + ' ' + Z[z]; }
  function el(e) { return 'hs-' + BT.HANH_KEY[e]; }

  BT.taoHoSo = function (c, opt) {
    V = BT.VAN;
    var inp = c.inp, gt = inp.gender === 1 ? 'nam' : 'nu';
    var nc = BT.ganHanh(c.dg), nh = c.nguHanh, p = nh.pct, dt = c.dungThan;
    var bd = (opt.bietDanh || '').trim() || (inp.name || '').trim().split(/\s+/).pop() || 'bạn';
    var Y = opt.nam || new Date().getFullYear();
    var mua = [11, 0, 1].indexOf(c.month.z) >= 0 ? 'dong' : [5, 6, 7].indexOf(c.month.z) >= 0 ? 'ha' : '';
    var lanh = dt.dieuHau && dt.dieuHau.e === 1, nong = dt.dieuHau && dt.dieuHau.e === 4;
    function nhom(e) { return (e - nc + 5) % 5; }
    function chon(x) { return typeof x === 'string' ? x : x[gt]; }
    function vaiTen(e) { return ['Dụng Thần', 'Hỷ Thần', 'Kỵ Thần', 'Cừu Thần', 'Nhàn Thần'][dt.vai[e]]; }
    function tot(e) { return dt.vai[e] < 2; }
    function xau(e) { return dt.vai[e] === 2 || dt.vai[e] === 3; }
    // "thiên can Bính Hỏa (Chính Tài – Hỷ Thần) và địa chi Thìn Thổ (Chính Quan – Dụng Thần)"
    function canChiVai(t) {
      var eg = BT.ganHanh(t.g), ez = BT.zhiHanh(t.z);
      return 'thiên can ' + G[t.g] + ' ' + H[eg] + ' (' + TT[t.tt] + ' – ' + vaiTen(eg) + ') và địa chi ' +
        Z[t.z] + ' ' + H[ez] + ' (' + TT[t.tang[0].tt] + ' – ' + vaiTen(ez) + ')';
    }
    var VO_BANG = gt === 'nam' ? ' và hạnh phúc gia đạo' : '';
    var VO_VAN = gt === 'nam' ? ', tình duyên rộng mở' : '';
    var VO_NAM = gt === 'nam' ? ', tình duyên bừng sáng' : '';
    var manhNhat = p.indexOf(Math.max.apply(null, p)), yeuNhat = p.indexOf(Math.min.apply(null, p));
    var o = [];

    // ---------- Đầu trang ----------
    o.push('<header class="hs-dau"><div class="hs-hoa-van">◆ &nbsp;•&nbsp; ◆</div><div class="hs-nho">HỒ SƠ MỆNH LÝ BÁT TỰ • HUYỀN HỌC PHƯƠNG ĐÔNG</div>' +
      '<h1>LUẬN GIẢI TOÀN DIỆN LÁ SỐ BÁT TỰ</h1>' +
      '<div class="hs-phu">Khảo Sát Ngũ Hành • Thần Sát Cung Mệnh • Bản Đồ Tâm Lý • Bát Tự Cải Vận • Đại Vận &amp; Lưu Niên</div></header>');

    // ---------- I. Thông tin & tứ trụ ----------
    var al = c.amLich;
    var namAm = gz(((al.y - 4) % 10 + 10) % 10, ((al.y - 4) % 12 + 12) % 12);
    var am = pad(al.d) + '/' + pad(al.m) + '/' + al.y;
    var tn = c.tru[0], mc = c.tru[1];
    o.push('<h2>❖ I. THÔNG TIN GIA CHỦ &amp; TỨ TRỤ MỆNH BÀN</h2>' +
      '<div class="hs-ttin">' +
      '<b>Họ và tên gia chủ:</b><span class="dam">' + esc(inp.name || (opt.bietDanh || '').trim() || '—') + '</span>' +
      '<b>Dương lịch sinh:</b><span class="dam">' + pad(inp.d) + '/' + pad(inp.m) + '/' + inp.y + ' - ' + pad(inp.h) + ':' + pad(inp.mi) + ' (Giờ ' + Z[c.time.z] + ')</span>' +
      '<b>Giới tính:</b><span>' + (gt === 'nam' ? 'Nam giới' : 'Nữ giới') + '</span>' +
      '<b>Âm lịch sinh:</b><span>' + am + ' (' + (al.nhuan ? 'tháng nhuận, ' : '') + 'Năm ' + namAm + ')</span>' +
      '<b>Mệnh Cung:</b><span class="dam">' + gz(mc.g, mc.z) + '</span>' +
      '<b>Thai Nguyên:</b><span class="do">' + gz(tn.g, tn.z) + '</span></div>');

    var tru = [c.tru[5], c.tru[4], c.tru[3], c.tru[2]]; // Năm, Tháng, Ngày, Giờ
    function cot(f) { return tru.map(function (t) { return '<td' + (t.ten === 'Ngày' ? ' class="nc"' : '') + '>' + f(t) + '</td>'; }).join(''); }
    o.push('<h3 class="hs-giua">BẢNG TỨ TRỤ MỆNH BÀN CHI TIẾT</h3><table class="hs-bang hs-tutru"><thead><tr><th>HẠNG MỤC</th><th>TRỤ NĂM</th><th>TRỤ THÁNG</th><th class="nc">TRỤ NGÀY (NHẬT CHỦ)</th><th>TRỤ GIỜ</th></tr></thead><tbody>' +
      '<tr><th>Can Chi</th>' + cot(function (t) { return '<b>' + gz(t.g, t.z) + '</b>'; }) + '</tr>' +
      '<tr><th>Thiên Can</th>' + cot(function (t) { return '<span class="' + el(BT.ganHanh(t.g)) + '">' + G[t.g] + ' (' + H[BT.ganHanh(t.g)] + ')</span><i>' + (t.tt < 0 ? 'Nhật Can' : TT[t.tt]) + '</i>'; }) + '</tr>' +
      '<tr><th>Địa Chi</th>' + cot(function (t) { return '<span class="' + el(BT.zhiHanh(t.z)) + '">' + Z[t.z] + ' (' + H[BT.zhiHanh(t.z)] + ')</span><i>' + TT[t.tang[0].tt] + '</i>'; }) + '</tr>' +
      '<tr><th>Tàng Can</th>' + cot(function (t) { return t.tang.map(function (x) { return G[x.g] + ' (' + BT.THAP_THAN_TAT[x.tt] + ')'; }).join(', '); }) + '</tr>' +
      '<tr><th>Thông Căn</th>' + cot(function (t) { return BT.MUC_CAN[t.goc.muc]; }) + '</tr>' +
      '<tr><th>Nạp Âm</th>' + cot(function (t) { return t.napAm; }) + '</tr>' +
      '<tr><th>Trường Sinh</th>' + cot(function (t) { return BT.TRUONG_SINH[t.ts]; }) + '</tr>' +
      '<tr><th>Thần Sát Chính</th>' + cot(function (t) { return t.sao.length ? t.sao.map(function (s) { return s.ten; }).join(', ') : '—'; }) + '</tr>' +
      '</tbody></table>');

    // ---------- II. Cục diện ngũ hành ----------
    var mt = BT.mucThan(nh.hoTro), the = mt.ten;
    var thuc = (nc + 1) % 5, tai = (nc + 2) % 5;
    o.push('<h2>❖ II. PHÂN TÍCH CHUYÊN SÂU CỤC DIỆN NGŨ HÀNH &amp; NĂNG LƯỢNG</h2><div class="hs-so">' +
      '<div><b class="' + el(nc) + '">' + G[c.dg] + ' ' + H[nc] + '</b><span>NHẬT CHỦ</span></div>' +
      '<div><b class="do">' + the + '</b><span>ĐỘ VƯỢNG MỆNH · ' + pc(nh.hoTro) + '</span></div>' +
      '<div><b class="' + el(nc) + '">' + pc(p[nc]) + '</b><span>LỰC ' + H[nc].toUpperCase() + ' (THÂN)</span></div>' +
      '<div><b class="' + el(thuc) + '">' + pc(p[thuc]) + '</b><span>LỰC ' + H[thuc].toUpperCase() + ' (THỰC THƯƠNG)</span></div>' +
      '<div><b class="' + el(tai) + '">' + pc(p[tai]) + '</b><span>LỰC ' + H[tai].toUpperCase() + ' (TÀI TINH)</span></div></div>');

    // 1. Bản chất nhật chủ
    var nct = V.NHAT_CHU[c.dg];
    var hienTuong = lanh ? V.HIEN_TUONG_DONG[nc] : nong ? V.HIEN_TUONG_HA[nc] :
      (mt.key === 'vuong' ? H[nc] + ' Khí Dồi Dào' : mt.key === 'nhuoc' ? H[nc] + ' Khí Cần Nâng Đỡ' : 'Thế Cân Bằng Mong Manh');
    var soCan = c.tuTru.filter(function (t) { return t.g === c.dg; }).length;
    var theKey = mt.key;
    var p1 = 'Nhật Can ' + G[c.dg] + ' ' + H[nc] + ' (' + (BT.isDuong(c.dg) ? 'Dương ' : 'Âm ') + H[nc] + ') mang hình tượng của ' + nct.hinh + '. Đặc trưng của người ' +
      G[c.dg] + ' ' + H[nc] + ' là ' + nct.tinh + '. Bạn sinh vào Tháng ' + Z[c.month.z] + ' (' + V.THANG[c.month.z] + '), ' +
      ([1, 4, 7, 10].indexOf(c.month.z) >= 0 && nc !== 2 ? 'thời khắc giao mùa khi Thổ khí đương lệnh' : V.TRANG_THAI_MUA[nh.trangThai[nc].ten].replace('{H}', H[nc])) + '. ' +
      (soCan >= 2 ? 'Cục diện cho thấy sự hiện diện của ' + soCan + ' can ' + G[c.dg] + ' ' + H[nc] + ' xếp hàng ngang, đẩy năng lượng hỗ trợ bản mệnh lên tới ' + pc(nh.hoTro) + '. '
        : 'Tổng lực hỗ trợ bản mệnh (Ấn + Tỷ Kiếp) đạt ' + pc(nh.hoTro) + '. ') +
      V.THE[theKey].replace('{T}', the.toUpperCase()) +
      (lanh ? ', ' + V.HAU_QUA_DONG.replace('{MUC}', p[1] < 3 ? 'thiếu Hỏa trầm trọng (' + pc(p[1]) + ')' : 'Hỏa khí yếu (' + pc(p[1]) + ')')
        : nong ? ', ' + V.HAU_QUA_HA.replace('{MUC}', p[4] < 3 ? 'thiếu Thủy trầm trọng (' + pc(p[4]) + ')' : 'Thủy khí yếu (' + pc(p[4]) + ')') : '.');
    var tdc = nh.tamDac;
    var dongY = tdc.ket === 'nua' || (tdc.ket === 'vuong') === (nh.hoTro >= BT.NGUONG_VUONG);
    var pTamDac = '<b>Đối chiếu bốn yếu tố của nhật chủ:</b> ' + (tdc.lenh ? 'được lệnh' : 'không được lệnh') + ' (chi tháng ở ' + tdc.tsThang + '); ' +
      (tdc.dia ? 'đắc địa tại ' + tdc.diaCho.join(', ') : 'không đắc địa') + '; ' +
      (tdc.sinh ? 'được sinh nhờ ' + tdc.sinhTu.join(', ') : 'không có Ấn sinh') + '; ' +
      (tdc.tro ? 'được trợ giúp bởi ' + tdc.troTu.join(', ') : 'không có can Tỷ Kiếp trợ giúp') +
      '. Theo phép này nhật chủ ' + tdc.ketTen + (dongY ? ', khớp với kết quả tính độ.' : ', khác với kết quả tính độ (xem cảnh báo ở mục 3).');
    o.push('<h4>1. Bản chất Nhật Chủ &amp; Hiện tượng "' + hienTuong + '"</h4><p>' + p1 + '</p><p>' + pTamDac + '</p>');

    // 2. Điểm mù
    var w = yeuNhat, nw = nhom(w), N = V.NHOM[nw];
    var tenNhom = BT.NHOM_THAP_THAN[nw];
    var td2 = p[w] === 0 ? 'Điểm Mù Khuyết ' + H[w] + ' (Khuyết ' + tenNhom + ') Cực Đoan' : p[w] < 5 ? 'Điểm Mù Khuyết ' + H[w] + ' (' + tenNhom + ' Mỏng Manh)' : 'Điểm Yếu ' + H[w] + ' (' + tenNhom + ' Chưa Đủ Lực)';
    var quanHeNgay = BT.lietKeQuanHe(c.tuTru.map(function (t) { return { g: t.g, z: t.z, ten: 'Trụ ' + t.ten.toLowerCase() }; }))
      // cung phu thê là địa chi ngày: chỉ lấy quan hệ địa chi, bỏ thiên can tương xung
      .filter(function (q) { return q.giua.indexOf('Trụ ngày') >= 0 && !q.tot && q.text.indexOf('tương xung') < 0; });
    var vaoTinh = (nw === 2 && gt === 'nam') || (nw === 3 && gt === 'nu');
    o.push('<h4>2. ' + td2 + '</h4><p>Lá số bộc lộ một ' + (p[w] < 5 ? 'sự khuyết thiếu vô cùng đáng chú ý' : 'điểm yếu cần lưu tâm') + ': Năng lượng ' + H[w] + ' (' + tenNhom + ') ' +
      (p[w] === 0 ? 'bằng 0%' : 'chỉ đạt ' + pc(p[w])) + '. Trong Bát Tự ' + (gt === 'nam' ? 'nam' : 'nữ') + ' giới, ' + tenNhom + ' vừa đại diện cho ' + chon(N.a) + ', vừa đại diện cho ' + chon(N.b) + '.' +
      (xau(w) ? ' Lưu ý: ' + H[w] + ' là ' + vaiTen(w) + ' của lá số, nên việc ' + H[w] + ' yếu không gây hại cho cân bằng ngũ hành; ảnh hưởng chủ yếu nằm ở các lĩnh vực đời sống dưới đây.' : '') + '</p>' +
      '<ul><li><b>Về ' + chon(N.a) + ':</b> ' + chon(N.ka) + '</li><li><b>Về ' + chon(N.b) + ':</b> ' + chon(N.kb) +
      (vaoTinh && quanHeNgay.length ? ' Thêm vào đó, trụ Ngày (cung phu thê) gặp ' + quanHeNgay.map(function (q) { return q.text; }).join(', ') + ', càng đòi hỏi sự nhẫn nại và thấu hiểu.' : '') + '</li></ul>');

    // 3. Bảng Hỷ Dụng Kỵ
    var NHAN = function (x) {
      if (x.vai === 0) return ['DỤNG THẦN CỐT LÕI', 'dung'];
      if (x.vai === 1) return [dt.ds.filter(function (y) { return y.vai === 1; }).length > 1 ? 'HỶ THẦN SỐ ' + x.so : 'HỶ THẦN', x.so === 2 ? 'hy2' : 'hy1'];
      if (x.vai === 4) return ['NHÀN THẦN', 'nhan'];
      return x.vai === 2 ? ['KỴ THẦN', 'ky1'] : ['CỪU THẦN', 'ky2'];
    };
    var hang = dt.ds.map(function (x) {
      var e = x.e, r = nhom(e), ten = NHAN(x), title, text;
      var X = H[e], Yh = H[nc], key = '' + e + nc;
      var tenTT = r < 2 ? [TT[2 * r], TT[2 * r + 1]] : [TT[2 * r + 1], TT[2 * r]];
      if (x.vai === 0 && dt.dieuHau && dt.dieuHau.e === e) {
        title = V.DIEU_HAU_DUNG[e].ten;
        text = V.DIEU_HAU_DUNG[e].text + ', ' + V.MIEN_NGAN[r] + (r === 2 ? VO_BANG : '') + '.';
      } else if (x.vai < 2) {
        title = V.CAP[key][0];
        text = (p[e] >= 15 ? 'Rất may mắn mệnh có ' + pc(p[e]) + ' ' + X + '. ' : '') +
          V.TAC_DUNG_TOT[r].replace(/\{X\}/g, X).replace(/\{Y\}/g, Yh).replace('{VO}', VO_BANG);
      } else if (x.vai === 4) {
        title = 'Trung Gian Điều Phối';
        text = X + ' giữ vai trò trung gian, ảnh hưởng không rõ rệt; tốt hay xấu tùy vào tổ hợp của vận và năm.';
      } else {
        title = (lanh && e === 4) ? 'Gia Tăng Băng Giá' : V.CAP[key][1];
        text = (p[e] >= 25 ? X + ' (' + pc(p[e]) + ') đã quá dư thừa. ' : '') +
          V.TAC_DUNG_XAU[r].replace(/\{X\}/g, X).replace(/\{Y\}/g, Yh) +
          (lanh && (e === 3 || e === 4) ? ' Giữa mùa đông, ' + X + ' chỉ làm mọi thứ thêm lạnh lẽo, bế tắc.' : '') +
          (nong && (e === 0 || e === 1) ? ' Giữa mùa hạ, ' + X + ' chỉ làm mệnh cục thêm khô nóng, bức bối.' : '');
      }
      if (dt.dieuHau && dt.dieuHau.e === e && x.vai !== 0) text += ' Đồng thời ' + X + ' là hành Điều hầu: ' +
        (e === 1 ? 'mệnh lạnh giá rất cần Hỏa sưởi ấm để khí lưu thông.' : 'mệnh khô nóng rất cần Thủy làm mát.');
      var gdh = dt.ghiChuDieuHau;
      if (gdh && gdh.xungDot && gdh.e === e) text += ' Lưu ý: ' + X + ' cũng là hành Điều hầu (' + (e === 1 ? 'sinh mùa đông cần sưởi ấm' : 'sinh mùa hạ cần giải nhiệt') +
        '), nên chỉ phần ' + X + ' dư thừa mới bất lợi; một lượng vừa phải vẫn có ích, không nên loại bỏ hoàn toàn.';
      if (x.vai < 2 && p[e] < 5) text += ' Nguyên cục ' + (p[e] === 0 ? 'hoàn toàn vắng bóng ' : 'gần như vắng bóng ') + X + ' (' + pc(p[e]) + '), cần nhờ vận, năm và môi trường bổ sung.';
      else if (x.vai < 2 && p[e] < 15 && !(x.vai === 0 && dt.dieuHau && dt.dieuHau.e === e)) text += ' Hiện mệnh có ' + pc(p[e]) + ' ' + X + ', nên bổ sung thêm.';
      return '<tr><td><span class="hs-nhan ' + ten[1] + '">' + ten[0] + '</span></td><td class="' + el(e) + '"><b>' + X.toUpperCase() + '</b></td><td>' + tenTT.join('<br>') +
        '</td><td class="trai"><b>' + title + ':</b> ' + text + '</td></tr>';
    }).join('');
    o.push('<h4>3. Bảng Định Vị Hỷ - Dụng Thần &amp; Kỵ Thần</h4><table class="hs-bang hs-dt"><thead><tr><th>PHÂN LOẠI</th><th>NGŨ HÀNH</th><th>THẬP THẦN</th><th>Ý NGHĨA &amp; TÁC DỤNG CỨU ỨNG MỆNH CỤC</th></tr></thead><tbody>' + hang + '</tbody></table>' +
      (dt.ghiChuDieuHau && !dt.ghiChuDieuHau.thieu ? '<p><b>Ghi chú Điều hầu:</b> ' + dt.ghiChuDieuHau.text.split(' Theo Phù ức')[0] + '</p>' : '') +
      (dt.satNguong ? '<div class="hs-hop hs-canh-bao"><p><b>⚠ Kết luận sát ngưỡng:</b> ' + dt.satNguong.text.replace('Kết luận sát ngưỡng: l', 'L') +
        ' Vì vậy các nhận định về Hỷ, Dụng, Kỵ thần và đánh giá vận, năm bên dưới nên được xem là xu hướng tham khảo.</p></div>' : '') +
      (dt.lechTamDac ? '<div class="hs-hop hs-canh-bao"><p><b>⚠ Tam đắc:</b> ' + dt.lechTamDac + '</p></div>' : '') +
      (dt.tong ? '<div class="hs-hop hs-canh-bao"><p><b>⚠ Khả năng Tòng cách:</b> ' + dt.tong.text +
        ' Toàn bộ phần luận bên dưới đang theo Phù ức; nếu người luận xác định đây là ' + dt.tong.loai.toLowerCase() + ', vai trò các hành và đánh giá vận, năm sẽ đảo ngược.</p></div>' : ''));

    // ---------- III. Thần sát & cung mệnh ----------
    o.push('<h2>❖ III. PHÂN TÍCH CHUYÊN SÂU THẦN SÁT &amp; CUNG MỆNH</h2>');
    var etn = BT.ganHanh(tn.g), dungVang = p[dt.D] < 5;
    var tdTN, txTN, gzTN = gz(tn.g, tn.z).toUpperCase();
    if ((etn === dt.D || BT.zhiHanh(tn.z) === dt.D) && dungVang) {
      var eD = dt.D;
      tdTN = 'THAI NGUYÊN ' + gzTN + ' - ĐỐM ' + V.DOM[eD] + ' CỨU MẠNG TRONG TRỨNG NƯỚC';
      var canD = BT.ganHanh(tn.g) === eD ? G[tn.g] + ' ' + H[eD] : Z[tn.z] + ' ' + H[eD];
      txTN = 'Khá ảo diệu, dù nguyên cục 4 trụ của ' + esc(bd) + ' có ' + H[eD] + ' = ' + pc(p[eD]) + ', nhưng Thai Nguyên (khí thụ thai bẩm sinh) lại là <b>' + gzTN + '</b>. ' +
        canD + ' xuất hiện ngay tại gốc rễ sinh mệnh, âm thầm ' + V.DONG_TU[eD] + ' cục diện của bạn. Điều này chỉ ra rằng, dù cuộc sống có những giai đoạn bế tắc, nghèo túng hay cô độc, ' +
        'sâu thẳm bên trong bạn vẫn luôn có một nguồn hy vọng, một quý nhân ngầm hoặc một sự may mắn bẩm sinh giúp bạn lật ngược thế cờ vào phút chót.';
    } else {
      var dgTN = BT.danhGia(c, tn.g, tn.z).muc;
      var moTaTN = 'Thai Nguyên ' + gz(tn.g, tn.z) + ' gồm ' + canChiVai(tn) + '. ';
      if (dgTN === 'Rất thuận' || dgTN === 'Thuận') {
        tdTN = 'THAI NGUYÊN ' + gzTN + ' - BỆ PHÓNG BẨM SINH';
        txTN = moTaTN + 'Khí thụ thai nghiêng về hành có lợi cho lá số. Nền tảng bẩm sinh của bạn vững vàng: gia đình, gốc gác hoặc thiên phú tự nhiên chính là bệ đỡ để bạn đi xa.';
      } else if (dgTN === 'Nghịch' || dgTN === 'Rất nghịch') {
        tdTN = 'THAI NGUYÊN ' + gzTN + ' - KHỞI ĐẦU TỪ THỬ THÁCH';
        txTN = moTaTN + 'Khí thụ thai nghiêng về hành bất lợi. Điểm xuất phát của bạn không quá thuận lợi, nhiều thứ phải tự thân vận động; bù lại, chính nghịch cảnh rèn cho bạn bản lĩnh hơn người.';
      } else {
        tdTN = 'THAI NGUYÊN ' + gzTN + ' - KHÍ CHẤT BẨM SINH';
        txTN = moTaTN + 'Tốt xấu cân bằng, thiên phú của bạn không thiên lệch, thành tựu chủ yếu đến từ lựa chọn và nỗ lực của bản thân.';
      }
    }
    var dgMC = BT.danhGia(c, mc.g, mc.z).muc, zmc = BT.zhiHanh(mc.z);
    txTN += '<br>Mệnh Cung <b>' + gz(mc.g, mc.z) + '</b> gồm ' + canChiVai(mc) + '. ' +
      (dgMC === 'Rất thuận' || dgMC === 'Thuận' ? 'Cung mệnh nghiêng về hành có lợi, cho thấy con đường đời của bạn gắn với ' + V.MIEN_NGAN[nhom(zmc)] + ' và đó cũng là nơi bạn tìm thấy may mắn.'
        : dgMC === 'Nghịch' || dgMC === 'Rất nghịch' ? 'Cung mệnh nghiêng về hành bất lợi, nhắc bạn đừng quá sa đà vào ' + V.MIEN_NGAN[nhom(zmc)] + ' mà quên cân bằng cuộc sống.'
          : 'Cung mệnh trung tính, cuộc đời bạn do chính bạn định hướng.');
    o.push('<div class="hs-hop"><h4>1. ' + tdTN + '</h4><p>' + txTN + '</p></div>');

    // 2. Thần sát nổi bật trong tứ trụ
    var bang = {}, thuTuTru = ['Năm', 'Tháng', 'Ngày', 'Giờ'];
    var vi = {}; BT.bangThanSat(c).forEach(function (r) { vi[r.id] = r.vi; });
    tru.forEach(function (t) {
      t.sao.forEach(function (s) {
        var o2 = bang[s.id] || (bang[s.id] = { ten: s.ten, cat: s.cat, noi: [], hanh: [] });
        var loc = vi[s.id] && vi[s.id].indexOf(G[t.g]) >= 0 && (s.id === 'thienduc' || s.id === 'nguyetduc') ? G[t.g] : Z[t.z];
        if (o2.noi.indexOf(loc) < 0) { o2.noi.push(loc); o2.hanh.push(loc === G[t.g] ? BT.ganHanh(t.g) : BT.zhiHanh(t.z)); }
      });
    });
    var catDs = V.SAO_UU_TIEN.filter(function (id) { return bang[id]; }).slice(0, 4);
    var hungDs = V.SAO_HUNG.filter(function (id) { return bang[id]; }).slice(0, 2);
    if (catDs.length || hungDs.length) {
      var td3 = catDs.length ? '"' + bang[catDs[0]].ten + '" ' + (bang[catDs[0]].noi.length > 1 ? 'Quần Tụ' : 'Hộ Mệnh') +
        (catDs[1] && V.SAO_CHU_DE[catDs[1]] ? ' &amp; Ngôi Sao ' + V.SAO_CHU_DE[catDs[1]] : '') : 'Những Ngôi Sao Cần Lưu Tâm';
      var li = catDs.map(function (id) {
        var s = bang[id], txt = V.SAO[id];
        var k = s.hanh.findIndex(function (e) { return tot(e); });
        if (k >= 0) txt += ' ' + s.noi[k] + ' ' + H[s.hanh[k]] + ' cũng chính là ' + vaiTen(s.hanh[k]) + ', chứng tỏ ' +
          (id === 'quynhan' ? 'bạn gặp được quý nhân' : 'phúc khí của sao này đến với bạn') + ' thông qua ' + V.QUY_NHAN_QUA[nhom(s.hanh[k])] + '.';
        return '<li><b>' + s.ten + ' (Tại ' + s.noi.join(', ') + '):</b> ' + txt + '</li>';
      }).concat(hungDs.map(function (id) {
        var s = bang[id];
        return '<li><b>Lưu ý ' + s.ten + ' (Tại ' + s.noi.join(', ') + '):</b> ' + V.SAO[id] + '</li>';
      }));
      o.push('<h4>2. ' + td3 + '</h4><ul>' + li.join('') + '</ul>');
    }

    // ---------- IV. Bản đồ tâm lý ----------
    var nhomPct = [0, 1, 2, 3, 4].map(function (k) { return p[(nc + k) % 5]; });
    var nv = [1, 2, 3, 4].sort(function (a, b) { return nhomPct[b] - nhomPct[a]; })[0];
    var toa = V.TOA_CHI[c.tru[3].tang[0].tt];
    o.push('<h2>❖ IV. BẢN ĐỒ TÂM LÝ &amp; NÚT THẮT NĂNG LƯỢNG</h2><h4>1. Đặc Điểm Tính Cách Cốt Lõi</h4><ul>' +
      '<li><b>' + nct.tieuDe + ':</b> ' + nct.text + (nhomPct[nv] >= 15 ? ' ' + V.NHOM_VUONG[nv].replace('{P}', Math.round(nhomPct[nv] * 10) / 10) : '') + '</li>' +
      '<li><b>' + toa[0] + ':</b> ' + toa[1] + '</li>' +
      (theKey === 'vuong' ? '<li><b>Tự Chủ Mạnh Mẽ:</b> Thân vượng giúp bạn có sức chịu đựng tốt, không dễ gục ngã. Nhưng năng lượng dư thừa cần được dẫn ra ngoài bằng công việc, sáng tạo, nếu không sẽ thành cố chấp.</li>'
        : theKey === 'nhuoc' ? '<li><b>Nhạy Cảm Và Cần Điểm Tựa:</b> Thân nhược khiến bạn dễ mệt mỏi khi gánh quá nhiều. Biết chọn môi trường, chọn người đồng hành là chìa khóa để bạn phát huy hết năng lực.</li>' : '') +
      '</ul>');
    var rc = V.RAO_CAN[nw];
    o.push('<div class="hs-hop"><h4>2. CẢNH BÁO ĐIỂM MÙ &amp; SỨC KHỎE</h4><ul>' +
      '<li><b>' + rc[0] + ':</b> ' + rc[1].replace('{Y}', H[manhNhat]).replace('{X}', H[w]).replace('{KHUYET}', p[w] === 0 ? 'khuyết hẳn' : 'yếu') + '</li>' +
      '<li><b>Cảnh Báo Sức Khỏe:</b> ' + (lanh ? 'Lá số sinh mùa đông, hàn khí nặng. ' : nong ? 'Lá số sinh mùa hạ, khô nóng. ' : '') +
      'Hãy chú ý đến ' + V.SUC_KHOE[manhNhat] + ' (do ' + H[manhNhat] + (p[manhNhat] >= 30 ? ' quá vượng, ' : ' mạnh nhất, ') + pc(p[manhNhat]) + ') và ' +
      V.SUC_KHOE[w] + ' (do ' + H[w] + (p[w] === 0 ? ' khuyết, ' : ' yếu, ') + pc(p[w]) + '). ' +
      (lanh ? 'Cần giữ ấm cơ thể, không tắm đêm.' : nong ? 'Cần giữ mát, uống đủ nước, tránh thức khuya và nóng giận.' : 'Duy trì nhịp sinh hoạt điều độ, khám sức khỏe định kỳ.') + '</li></ul></div>');

    // ---------- V. Đại vận & lưu niên ----------
    var van = BT.vanCuaNam(c, Y), iv = c.daiVan.indexOf(van);
    o.push('<h2>❖ V. LUẬN GIẢI ĐẠI VẬN &amp; LƯU NIÊN TRỌNG TÂM (' + (Y - 2) + ' - ' + (Y + 1) + ')</h2>');
    if (van) {
      var dv = BT.danhGia(c, van.g, van.z), ttg = TT[van.tt], ttz = TT[van.tang[0].tt];
      var k = Y - van.namBD, viTri = k <= 2 ? 'những năm đầu' : k <= 6 ? 'giữa chặng' : 'những năm cuối cùng';
      var hanhVan = [BT.ganHanh(van.g), BT.zhiHanh(van.z)];
      var hTot = hanhVan.filter(function (e, i, a) { return tot(e) && a.indexOf(e) === i; }).map(function (e) { return H[e]; }).join(', ');
      var hXau = hanhVan.filter(function (e, i, a) { return xau(e) && a.indexOf(e) === i; }).map(function (e) { return H[e]; }).join(', ');
      var ez = BT.zhiHanh(van.z), eg = BT.ganHanh(van.g);
      // câu luận cho một hành của vận: tốt → VAN_TOT, xấu → VAN_XAU, Nhàn thần → không có tác động rõ
      function cauVan(e) { return tot(e) ? V.VAN_TOT[nhom(e)].replace('{VO}', VO_VAN) : xau(e) ? V.VAN_XAU[nhom(e)] : null; }
      var cz = cauVan(ez), cg = cauVan(eg);
      var tx = 'Bạn đang ở ' + viTri + ' của đại vận ' + gz(van.g, van.z) + ' (can ' + G[van.g] + ' ' + H[eg] + ' – ' + ttg + ', ' + vaiTen(eg) +
        '; chi ' + Z[van.z] + ' ' + H[ez] + ' – ' + ttz + ', ' + vaiTen(ez) + '). ' +
        V.VAN_MUC[dv.muc].replace('{H}', dv.diem > 0 ? hTot : hXau) + ' ' +
        (k >= 7 ? 'Giai đoạn 10 năm qua, ' : 'Trong giai đoạn này, ');
      if (cz) tx += thuong(cz) + (cg && cg !== cz ? ' Song song đó, ' + thuong(cg) : '');
      else if (cg) tx += thuong(cg) + ' Địa chi ' + Z[van.z] + ' là Nhàn Thần nên không tạo thêm tác động rõ rệt.';
      else tx += 'cả can lẫn chi đều là Nhàn Thần, vận trình ít biến động lớn.';
      var qhv = BT.quanHeHaiTru({ g: van.g, z: van.z }, { g: c.day.g, z: c.day.z });
      qhv.forEach(function (q) {
        if (q.text.indexOf('lục xung') >= 0) tx += ' Vận ' + Z[van.z] + ' xung chi ngày ' + Z[c.day.z] + ', chuyện bản thân và hôn nhân dễ có biến động.';
        if (q.text.indexOf('tương xung') >= 0) tx += ' Can vận ' + G[van.g] + ' xung can ngày ' + G[c.day.g] + ', dễ có áp lực, va chạm trực diện.';
        if (q.text.indexOf('lục hợp') >= 0) tx += ' Vận ' + Z[van.z] + ' lục hợp với chi ngày ' + Z[c.day.z] + ', các mối quan hệ thân thiết được gắn kết.';
      });
      var sau = c.daiVan[iv + 1];
      if (sau && van.namKT - Y <= 2) {
        var ds2 = BT.danhGia(c, sau.g, sau.z);
        var sauTxt = 'đại vận ' + gz(sau.g, sau.z) + ' (' + sau.namBD + ' - ' + sau.namKT + ', ' + ds2.muc.toLowerCase() + ')';
        tx += ds2.diem > dv.diem + 0.3 ? (dv.diem < 0.4 ? ' Tuy nhiên, giai đoạn chịu đựng này sắp kết thúc để nhường chỗ cho ' : ' Phía trước còn thuận lợi hơn: ') + sauTxt + '.'
          : ds2.diem < dv.diem - 0.3 ? ' Từ năm ' + sau.namBD + ', bạn bước sang ' + sauTxt + ', cần chuẩn bị kỹ lưỡng từ bây giờ: tích lũy, giữ sức khỏe và các mối quan hệ quý.'
            : ' Từ năm ' + sau.namBD + ', ' + sauTxt + ' tiếp nối với nhịp độ tương tự.';
      }
      o.push('<h4>1. Chu Kỳ Đại Vận Hiện Tại: ' + gz(van.g, van.z) + ' (' + van.namBD + ' - ' + van.namKT + ' | ' + van.tuoi + ' - ' + (van.tuoi + 9) + ' tuổi)</h4><p>' + tx + '</p>');
    } else {
      o.push('<h4>1. Giai Đoạn Trước Khởi Vận</h4><p>Bạn chưa bước vào đại vận đầu tiên (khởi vận năm ' + c.daiVan[0].namBD + '). Giai đoạn này vận trình chịu ảnh hưởng chủ yếu từ trụ tháng và môi trường gia đình.</p>');
    }

    var hangNam = [];
    for (var y = Y - 2; y <= Y + 1; y++) hangNam.push(luanNam(y));
    o.push('<h4>2. Luận Giải Chi Tiết Các Lưu Niên Bước Ngoặt</h4><table class="hs-bang hs-ln"><thead><tr><th>LƯU NIÊN</th><th>THẬP THẦN</th><th>PHÂN TÍCH CHI TIẾT &amp; XU HƯỚNG VẬN TRÌNH</th></tr></thead><tbody>' + hangNam.join('') + '</tbody></table>');

    function luanNam(y) {
      var g = ((y - 4) % 10 + 10) % 10, z = ((y - 4) % 12 + 12) % 12;
      var d = BT.danhGia(c, g, z), eg = BT.ganHanh(g), ez = BT.zhiHanh(z);
      var tg = BT.thapThan(c.dg, g), tz = BT.thapThan(c.dg, BT.TANG_CAN[z][0]);
      var vy = BT.vanCuaNam(c, y), moi = c.daiVan.filter(function (v) { return v.namBD === y; })[0];
      function cau(e, ttIdx, ten) {
        var r = Math.floor(ttIdx / 2);
        if (tot(e)) return ten + ' (' + TT[ttIdx] + ') là ' + vaiTen(e) + ', ' + V.NAM_TOT[r].replace('{VO}', VO_NAM);
        if (xau(e)) return ten + ' (' + TT[ttIdx] + ') thuộc ' + vaiTen(e) + ', ' + V.NAM_XAU[r];
        return ten + ' (' + TT[ttIdx] + ') giữ thế trung tính';
      }
      var tx = eg === ez && Math.floor(tg / 2) === Math.floor(tz / 2)
        ? G[g] + ' ' + H[eg] + ' và ' + Z[z] + ' ' + H[ez] + ' cùng xuất hiện, ' + (tot(eg) ? vaiTen(eg) + ' được nhân đôi sức mạnh: ' + V.NAM_TOT[Math.floor(tg / 2)].replace('{VO}', VO_NAM) : xau(eg) ? vaiTen(eg) + ' dồn dập: ' + V.NAM_XAU[Math.floor(tg / 2)] : 'năng lượng trung tính') + '.'
        : cau(eg, tg, G[g] + ' ' + H[eg]) + '. ' + cau(ez, tz, Z[z] + ' ' + H[ez]) + '.';
      var xungs = [], hops = [], tonNgay = [];
      c.tuTru.forEach(function (t) {
        BT.quanHeHaiTru({ g: g, z: z }, { g: t.g, z: t.z }).forEach(function (q) {
          if (q.loai === 'xung' && q.text.indexOf('lục xung') >= 0) xungs.push({ chi: Z[t.z], mien: V.TRU_MIEN[t.ten.toLowerCase()], ten: 'trụ ' + t.ten.toLowerCase() });
          if (q.loai === 'hop' && q.text.indexOf('lục hợp') >= 0 && t.ten === 'Ngày') hops.push(Z[t.z]);
          if ((q.loai === 'hai' || q.loai === 'hinh' || q.loai === 'pha') && t.ten === 'Ngày') tonNgay.push(q);
        });
      });
      if (vy) BT.quanHeHaiTru({ g: g, z: z }, { g: vy.g, z: vy.z }).forEach(function (q) {
        if (q.loai === 'xung' && q.text.indexOf('lục xung') >= 0) xungs.unshift({ chi: Z[vy.z], mien: 'chỗ ở, công việc', ten: 'đại vận' });
      });
      if (z === c.year.z) tx += ' Năm trùng tuổi (phạm Thái Tuế), nên giữ ổn định, tránh quyết định vội vàng.';
      var theoChi = {};
      xungs.forEach(function (x) { (theoChi[x.chi] = theoChi[x.chi] || []).push(x); });
      Object.keys(theoChi).forEach(function (chi, i) {
        var ds = theoChi[chi];
        tx += ' ' + (i ? 'Đồng thời' : 'Tuy nhiên') + ', ' + Z[z] + ' xung ' + chi + ' (' + ds.map(function (x) { return x.ten; }).join(', ') + '), sẽ có sự biến động lớn về ' + ds.map(function (x) { return x.mien; }).join('; ') + '.';
      });
      hops.forEach(function (h) { tx += ' ' + Z[z] + ' lục hợp ' + h + ' (cung phu thê), thuận cho tình cảm và hợp tác.'; });
      if (tonNgay.length) {
        var yNghia = { hai: 'hiểu lầm, tiểu nhân ngấm ngầm', hinh: 'va chạm, thị phi', pha: 'đổ vỡ nhỏ, kế hoạch dở dang' };
        tx += ' Chi năm với chi ngày (cung phu thê): ' + tonNgay.map(function (q) { return q.text; }).join(', ') + ', cần đề phòng ' +
          tonNgay.map(function (q) { return yNghia[q.loai]; }).filter(function (s, i, a) { return a.indexOf(s) === i; }).join(', ') + ', nhất là trong chuyện bản thân và hôn nhân.';
      }
      var title;
      if (moi) {
        title = 'Chuyển Giao Đại Vận ' + gz(moi.g, moi.z);
        tx += ' Bạn chính thức bước vào 10 năm đại vận ' + gz(moi.g, moi.z) + ' (' + BT.danhGia(c, moi.g, moi.z).muc.toLowerCase() + ').';
      } else if (xungs.length && (xungs[0].ten === 'đại vận' || xungs[0].ten === 'trụ ngày')) {
        title = 'NĂM ĐẠI BIẾN ĐỘNG (XUNG ' + xungs[0].chi.toUpperCase() + (d.diem >= 0.4 ? ' - ĐÓN ' + H[ez].toUpperCase() : '') + ')';
      } else {
        title = V.NAM_TIEU_DE[d.muc] + (eg === ez && d.muc === 'Rất thuận' ? ' (' + V.NAM_DINH_CAO[Math.floor(tg / 2)] + ' ĐỈNH CAO)' : '');
      }
      tx += ' ' + (moi && d.diem >= 0.4 && BT.danhGia(c, moi.g, moi.z).diem < 0
        ? 'Bản thân năm này vẫn thuận lợi, hãy tận dụng để tích lũy và chuẩn bị hành trang cho chặng đường mới.' : V.NAM_KET[d.muc]);
      return '<tr><td><b>' + y + '</b><br>(' + gz(g, z) + ')</td><td>' + TT[tg] + '<br>' + TT[tz] + '</td><td class="trai"><b>' + title + ':</b> ' + tx + '</td></tr>';
    }

    // ---------- VI. Cải vận ----------
    var hyDs = dt.ds.filter(function (x) { return x.vai === 1; }).map(function (x) { return x.e; });
    var kyDs = dt.ds.filter(function (x) { return x.vai === 2 || x.vai === 3; }).map(function (x) { return x.e; });
    var phu = hyDs[hyDs.length - 1];
    var moTa = H[manhNhat] + ' vượng' + (lanh ? ', hàn khí nặng' : nong ? ', khô nóng' : '') + (p[w] < 3 ? ', khuyết ' + H[w] + ' trầm trọng' : ', ' + H[w] + ' yếu');
    var td = V.TU_DUY[dt.D];
    o.push('<h2>❖ VI. ĐỊNH HƯỚNG BÁT TỰ CẢI VẬN TOÀN DIỆN (THÂN - TÂM - TRÍ)</h2><p>Đối diện với mệnh cục ' + moTa + ', chiến lược cải vận của bạn phải tập trung vào việc <b>Nạp ' + H[dt.D].toUpperCase() +
      '</b> (' + V.TU_KHOA[dt.D] + ') và <b>Nạp ' + H[phu].toUpperCase() + '</b> (' + V.TU_KHOA[phu] + ').</p>' +
      '<h4>1. Chuyển Hóa Tư Duy &amp; Hành Vi</h4><ul>' + td.map(function (b) { return '<li><b>' + b[0] + ':</b> ' + b[1] + '</li>'; }).join('') + '</ul>');
    function lyDoTot(e) { return '(' + H[e] + ' kích hoạt ' + V.MIEN_NGAN[nhom(e)] + ')'; }
    function lyDoXau(e) {
      if (lanh && e === 4) return '(Thủy gây lạnh, u uất)';
      if (lanh && e === 3) return '(Kim sinh Thủy)';
      return '(' + H[e] + ' ' + V.XAU_NGAN[nhom(e)] + ')';
    }
    var UD = BT.UNG_DUNG_HANH;
    var tot5 = [dt.D].concat(hyDs);
    function dong(ten, f) {
      return '<tr><th>' + ten + '</th><td class="trai">' + tot5.map(function (e, i) { return f(e) + (i === 0 ? ' ' + lyDoTot(e) : ''); }).join('; ') + '.</td>' +
        '<td class="trai">' + kyDs.map(function (e) { return f(e) + ' ' + lyDoXau(e); }).join('; ') + '.</td></tr>';
    }
    o.push('<h4>2. Phong Thủy Không Gian &amp; Màu Sắc Năng Lượng</h4><table class="hs-bang hs-pt"><thead><tr><th>YẾU TỐ PHONG THỦY</th><th>KHUYÊN DÙNG (KÍCH HOẠT ' +
      tot5.map(function (e) { return H[e].toUpperCase(); }).join(', ') + ')</th><th>CẦN HẠN CHẾ (' + kyDs.map(function (e) { return (dt.vai[e] === 2 ? 'KỴ THẦN ' : 'CỪU THẦN ') + H[e].toUpperCase(); }).join(', ') + ')</th></tr></thead><tbody>' +
      dong('Màu Sắc Trang Phục &amp; Không Gian', function (e) { return UD[e].mau; }) +
      dong('Phương Hướng Làm Việc &amp; Ngôi Nhà', function (e) { return 'Hướng ' + UD[e].huong; }) +
      dong('Con Số May Mắn', function (e) { return UD[e].so; }) +
      dong('Ngành Nghề Phù Hợp', function (e) { return UD[e].nghe; }) +
      '</tbody></table>');
    var sh = V.SINH_HOAT[dt.D].replace('{Y} hàn', lanh ? H[nc] + ' hàn' : 'cần Hỏa');
    if (lanh && dt.D !== 1) sh += ' Ngoài ra, lá số sinh mùa đông thiếu Hỏa (Điều hầu): nên dậy sớm đón nắng, giữ ấm cơ thể, hạn chế thức khuya và vận động ra mồ hôi để bổ sung dương khí.';
    if (nong && dt.D !== 4) sh += ' Ngoài ra, lá số sinh mùa hạ thiếu Thủy (Điều hầu): nên uống đủ nước, giữ mát, nghỉ ngơi hợp lý và tránh nóng giận.';
    o.push('<h4>3. Sinh Học &amp; Tinh Thần Giải Tỏa</h4><p>' + dam(sh) + '</p>');

    // ---------- VII. Tổng kết ----------
    var batDau = V.BUC_TRANH[manhNhat] + (lanh && manhNhat === 4 ? ' giá lạnh' : '');
    var kc = dt.D === 1 && !lanh ? V.KIM_CHI_NAM_HOA : V.KIM_CHI_NAM[dt.D];
    var hy0 = hyDs[0];
    var p7a = 'Lá số Bát Tự của ' + esc(bd) + ' là một bức tranh ' + batDau + ' (' + G[c.dg] + ' ' + H[nc] + ' ' + (theKey === 'nhuoc' ? 'nhược' : theKey === 'vuong' ? 'vượng' : 'trung hòa') + '). ' +
      'Chìa khóa cân bằng nằm ở ' + H[dt.D] + ' (Dụng Thần) và ' + H[hy0] + ' (Hỷ Thần)' +
      (p[hy0] >= 5 ? '; nguyên cục đã ấp ủ ' + V.MAM[hy0] + ' (' + H[hy0] + ' ' + pc(p[hy0]) + ') chờ được khơi dậy.'
        : '; trong đó ' + H[hy0] + ' – ' + V.MAM[hy0] + ' – ' + (p[hy0] === 0 ? 'hoàn toàn vắng bóng' : 'còn rất mỏng (' + pc(p[hy0]) + ')') + ' trong nguyên cục, cần được bổ sung từ vận, năm và môi trường.') +
      ' Khó khăn lớn nhất của ' + esc(bd) + ' là sự ' + (p[w] === 0 ? 'vắng bóng hoàn toàn' : 'mỏng manh') + ' của ' + H[w] + ' khí (' + pc(p[w]) + ' ' + tenNhom +
      ') – khiến ' + chon(N.a).toLowerCase() + ' và ' + chon(N.b).toLowerCase() + ' dễ bị lẩn khuất, trì hoãn.';
    function gzNam(y) { return gz(((y - 4) % 10 + 10) % 10, ((y - 4) % 12 + 12) % 12); }
    var dvd = van ? BT.danhGia(c, van.g, van.z) : null, sau2 = van ? c.daiVan[iv + 1] : c.daiVan[0];
    var dsau = sau2 ? BT.danhGia(c, sau2.g, sau2.z) : null;
    var p7b;
    if (dvd && dsau && van.namKT - Y <= 1) {
      p7b = 'Bạn đang ở chặng cuối của Đại vận ' + gz(van.g, van.z) + ' (' + dvd.muc.toLowerCase() + '); từ năm ' + sau2.namBD + ' chuyển sang Đại vận ' + gz(sau2.g, sau2.z) + ' (' + dsau.muc.toLowerCase() + ')' +
        (dsau.diem > dvd.diem + 0.3 ? (dvd.diem < 0.4 ? ' – "Bĩ cực thái lai", giai đoạn khó khăn sắp qua, một chu kỳ thuận lợi đang mở ra.' : ', một chu kỳ còn thuận lợi hơn đang mở ra.')
          : dsau.diem < dvd.diem - 0.3 ? ', nhiều thử thách hơn; hãy tận dụng thời gian còn lại để tích lũy và đặt nền móng vững chắc.' : ', nhịp độ tương tự.');
    } else if (dvd && dvd.diem < 0.4 && dsau && dsau.diem >= 0.4) {
      p7b = '"Bĩ cực thái lai" (Khổ tận cam lai). Đại vận ' + gz(van.g, van.z) + ' còn nhiều thử thách, nhưng từ năm ' + sau2.namBD + ', Đại vận ' + gz(sau2.g, sau2.z) + ' (' + dsau.muc.toLowerCase() + ') sẽ mở ra chu kỳ thuận lợi.';
    } else if (dvd && dvd.diem >= 0.4) {
      p7b = 'Bạn đang ở giai đoạn thuận lợi của Đại vận ' + gz(van.g, van.z) + ' (' + dvd.muc.toLowerCase() + '), đây là lúc tận dụng tối đa từng cơ hội.';
    } else if (dvd) {
      p7b = 'Đại vận ' + gz(van.g, van.z) + (dvd.diem > -0.4 ? ' tốt xấu đan xen' : ' còn nhiều thử thách') +
        (dsau ? ', Đại vận kế tiếp ' + gz(sau2.g, sau2.z) + ' (từ ' + sau2.namBD + ') cũng chưa thật sự thuận lợi' : '') + ', nhưng đó cũng là lúc nội lực của bạn được tôi luyện.';
    } else if (dsau) {
      p7b = 'Bạn chưa bước vào đại vận đầu tiên; Đại vận ' + gz(sau2.g, sau2.z) + ' (từ ' + sau2.namBD + ') được đánh giá ' + dsau.muc.toLowerCase() + '.';
    } else p7b = 'Mỗi giai đoạn đều có bài học riêng, quan trọng là bạn giữ vững phương hướng.';
    p7b += ' Kim chỉ nam cho bạn là: <b>"' + kc + '"</b>.';
    var namTot = null;
    for (var yy = Y; yy <= Y + 3; yy++) {
      var dd = BT.danhGia(c, ((yy - 4) % 10 + 10) % 10, ((yy - 4) % 12 + 12) % 12);
      if (dd.diem >= 0.4 && (!namTot || dd.diem > namTot.d)) namTot = { y: yy, d: dd.diem, muc: dd.muc };
    }
    var p7c = 'Hãy ' + V.LOI_KHUYEN[dt.D] + '.';
    if (namTot) {
      var vanMoi = c.daiVan.filter(function (v) { return v.namBD === namTot.y; })[0], dgMoi = vanMoi && BT.danhGia(c, vanMoi.g, vanMoi.z);
      p7c += ' Trong giai đoạn ' + Y + ' - ' + (Y + 3) + ', năm thuận lợi nổi bật nhất là ' + gzNam(namTot.y) + ' (' + namTot.y + ', ' + namTot.muc.toLowerCase() + ')' +
        (vanMoi && dgMoi.diem < 0.4 ? ', cũng là năm bước sang Đại vận ' + gz(vanMoi.g, vanMoi.z) + ' (' + dgMoi.muc.toLowerCase() + '): hãy dùng năm này để tích lũy và chuẩn bị hành trang cho chặng đường mới.'
          : namTot.y === Y ? ', đang diễn ra ngay lúc này, hãy nắm lấy để biến nỗ lực thành quả ngọt.' : ', hãy chuẩn bị sẵn sàng để nắm lấy cơ hội.');
    }
    var vanTot = c.daiVan.filter(function (v) { return v.namBD > Y && BT.danhGia(c, v.g, v.z).diem >= 0.4; })[0];
    if (vanTot) {
      var mucVT = BT.danhGia(c, vanTot.g, vanTot.z).muc;
      p7c += (vanTot.namBD - Y <= 6 ? ' Sắp tới, ' : ' Về đường dài, ') + 'Đại vận ' + gz(vanTot.g, vanTot.z) + ' (' + vanTot.namBD + ' - ' + vanTot.namKT + ', ' + mucVT.toLowerCase() + ') sẽ là ' +
        (mucVT === 'Rất thuận' ? 'thời kỳ hoàng kim để bạn gặt hái.' : 'giai đoạn thuận lợi để bạn bứt phá.');
    }
    o.push('<h2>❖ VII. LỜI KHUYÊN TỔNG KẾT &amp; KIM CHỈ NAM HÀNH ĐỘNG</h2><div class="hs-hop hs-ket"><p>' + p7a + '</p><p>' + p7b + '</p><p>' + p7c + '</p></div>');

    return o.join('');
  };
})(window.BT);
