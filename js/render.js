// Dựng giao diện và xử lý tương tác.
(function (BT) {
  var G = BT.GAN, Z = BT.ZHI;
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hk(e) { return 'h-' + BT.HANH_KEY[e]; }
  function dau(i) { return BT.isDuong(i) ? '+' : '−'; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // Thuật ngữ bấm để xem giải nghĩa
  function tn(text, cls) {
    return '<button type="button" class="tn ' + (cls || '') + '" data-k="' + esc(text) + '">' + esc(text) + '</button>';
  }
  function canTile(g, nho) {
    var e = BT.ganHanh(g);
    return '<span class="o-chu ' + hk(e) + (nho ? ' nho' : '') + '"><span class="han">' + BT.GAN_HAN[g] + '</span>' +
      '<span class="vi">' + G[g] + '</span><span class="hanh">' + dau(g) + BT.HANH[e] + '</span></span>';
  }
  function chiTile(z, nho) {
    var e = BT.zhiHanh(z);
    return '<span class="o-chu ' + hk(e) + (nho ? ' nho' : '') + '"><span class="han">' + BT.ZHI_HAN[z] + '</span>' +
      '<span class="vi">' + Z[z] + '</span><span class="hanh">' + dau(z) + BT.HANH[e] + ' · ' + BT.CON_GIAP[z] + '</span></span>';
  }
  function gz(g, z) {
    return '<span class="mau ' + hk(BT.ganHanh(g)) + '">' + G[g] + '</span> <span class="mau ' + hk(BT.zhiHanh(z)) + '">' + Z[z] + '</span>';
  }
  function tangHtml(p, gon) {
    return '<div class="tang">' + p.tang.map(function (t) {
      return '<span class="' + hk(BT.ganHanh(t.g)) + '"><b>' + G[t.g] + '</b> <i>' + (gon ? '' : dau(t.g) + BT.HANH[BT.ganHanh(t.g)] + ' · ') +
        BT.THAP_THAN_TAT[t.tt] + '</i></span>';
    }).join('') + '</div>';
  }
  function ttHtml(p) { return p.tt < 0 ? tn('Nhật chủ', 'cat') : tn(BT.THAP_THAN[p.tt]); }
  function saoHtml(list) {
    if (!list.length) return '<span class="trong">—</span>';
    return '<div class="ds-sao">' + list.map(function (s) { return tn(s.ten, s.cat ? 'cat' : 'hung'); }).join('') + '</div>';
  }

  // Bảng cột trụ dùng chung cho tứ trụ, đại vận, lưu nguyệt
  function bangTru(cols, opt) {
    opt = opt || {};
    var rows = [
      ['Thập thần', function (p) { return ttHtml(p); }],
      ['Thiên can', function (p) { return canTile(p.g, opt.nho); }],
      ['Địa chi', function (p) { return chiTile(p.z, opt.nho); }],
      ['Tàng can', function (p) { return tangHtml(p, opt.gon); }],
      ['Trường sinh', function (p) { return tn(BT.TRUONG_SINH[p.ts]); }]
    ];
    if (opt.goc) rows.push([tn('Thông căn'), function (p) {
      return p.goc ? '<span class="goc goc-' + p.goc.muc + '" title="' + esc(p.goc.cho.join('; ') || 'Không có gốc') + '">' + BT.MUC_CAN[p.goc.muc] + '</span>' : '<span class="trong">—</span>';
    }]);
    if (!opt.gon) rows.push(['Nạp âm', function (p) { return '<span class="mau ' + hk(BT.NAP_AM_HANH(p.napAm)) + '" style="font-size:.84rem">' + p.napAm + '</span>'; }]);
    if (opt.sao) rows.push(['Thần sát', function (p) { return saoHtml(p.sao); }, 'hang-sao']);
    if (opt.danhGia) rows.push(['Theo dụng thần', function (p) { return dgHtml(BT.danhGia(S.chart, p.g, p.z)); }]);
    var head = '<tr><th class="nhan"></th>' + cols.map(function (c, i) {
      return '<th class="' + (c.cls || '') + '" data-i="' + i + '">' + c.head + '</th>';
    }).join('') + '</tr>';
    var body = rows.map(function (r) {
      return '<tr class="' + (r[2] || '') + '"><th class="nhan">' + r[0] + '</th>' + cols.map(function (c) {
        return '<td class="' + (c.cls || '') + '">' + r[1](c.p) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<div class="cuon"><table class="tru ' + (opt.cls || '') + '"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
  }

  var DG_CLS = { 'Rất thuận': 'tot2', 'Thuận': 'tot', 'Bình': 'binh', 'Nghịch': 'xau', 'Rất nghịch': 'xau2' };
  function dgHtml(d, chiTiet) {
    return '<span class="dg ' + DG_CLS[d.muc] + '" title="Can: ' + BT.VAI_TRO[d.vg] + ' · Chi: ' + BT.VAI_TRO[d.vz] + '">' + d.muc + '</span>' +
      (chiTiet ? ' <span class="ghi-chu-nho">can ' + BT.VAI_TRO[d.vg].replace(' thần', '') + ', chi ' + BT.VAI_TRO[d.vz].replace(' thần', '') + '</span>' : '');
  }

  function dungThanHtml(c) {
    var dt = c.dungThan, nc = BT.ganHanh(c.dg);
    var hang = dt.ds.map(function (x) {
      var v = x.vai, e = x.e;
      return '<div class="dt-dong vai-' + v + ' ' + hk(e) + '">' + tn(BT.VAI_TRO[v], v < 2 ? 'cat' : v < 4 ? 'hung' : '') +
        '<span class="dt-hanh">' + BT.HANH[e] + '</span><span class="dt-nhom">' + BT.NHOM_THAP_THAN[(e - nc + 5) % 5] + '</span></div>';
    }).join('');
    var tot = dt.ds.filter(function (x) { return x.vai < 2; });
    var U = BT.UNG_DUNG_HANH;
    function hangUd(ten, k) {
      return '<tr><th>' + ten + '</th>' + tot.map(function (x) { return '<td>' + U[x.e][k] + '</td>'; }).join('') + '</tr>';
    }
    var ud = '<div class="cuon"><table class="ud-bang"><thead><tr><th></th>' + tot.map(function (x) {
      return '<th class="' + hk(x.e) + '"><span class="mau">' + BT.HANH[x.e] + '</span><small>' + BT.VAI_TRO[x.vai] + (x.so && tot.length > 2 ? ' ' + x.so : '') + '</small></th>';
    }).join('') + '</tr></thead><tbody>' + hangUd('Màu', 'mau') + hangUd('Hướng', 'huong') + hangUd('Số', 'so') + hangUd('Ngành', 'nghe') + '</tbody></table></div>';
    return '<div class="dt-luoi">' + hang + '</div>' +
      '<div class="ket-luan">' + dt.lyDo + (dt.ghiChuDieuHau ? '<span class="dh">' + tn('Điều hầu') + ': ' + esc(dt.ghiChuDieuHau.text) + '</span>' : '') + '</div>' +
      (dt.satNguong ? '<div class="canh-bao" role="note"><b>⚠ Sát ngưỡng.</b> ' + esc(dt.satNguong.text.replace('Kết luận sát ngưỡng: l', 'L')) + '</div>' : '') +
      (dt.lechTamDac ? '<div class="canh-bao" role="note"><b>⚠ Tam đắc.</b> ' + esc(dt.lechTamDac) + '</div>' : '') +
      (dt.tong ? '<div class="canh-bao" role="note"><b>⚠ ' + tn('Tòng cách') + '.</b> ' + esc(dt.tong.text) + '</div>' : '') +
      '<h4 class="tieu-nho">Ứng dụng hành có lợi</h4>' + ud +
      '<p class="ghi-chu">Xác định theo phép Phù ức dựa trên điểm ngũ hành ở trên. Lá số đặc biệt (tòng cách, hóa khí) cần luận riêng.</p>';
  }

  function tamDacHtml(c) {
    var td = c.nguHanh.tamDac;
    function o(ok, ten, ghi) { return '<span class="td-o ' + (ok ? 'co' : 'khong') + '">' + (ok ? '✓' : '✗') + ' ' + ten + '</span>' + (ghi ? ' <small>' + esc(ghi) + '</small>' : ''); }
    return '<span class="tam-dac">' + tn('Tam đắc') + ': ' +
      o(td.lenh, 'Đắc lệnh', 'tháng ' + td.khiThang) + ' · ' +
      o(td.dia, 'Đắc địa', td.dia ? 'gốc tại ' + td.goc.cho.join(', ') : 'nhật chủ vô căn') + ' · ' +
      o(td.the, 'Đắc thế', td.canTro.length ? td.canTro.join(', ') : 'không có can Tỷ/Ấn khác') +
      ' → <b>' + td.so + '/3</b> (' + (td.so >= 2 ? 'thiên vượng' : 'thiên nhược') + ')</span>';
  }

  function quanHeHtml(list) {
    if (!list.length) return '<p class="trong">Không có hợp, xung, hình, hại đáng kể.</p>';
    var ten = { hop: 'Hợp', xung: 'Xung', hinh: 'Hình', hai: 'Hại', pha: 'Phá' };
    var thuTu = { xung: 0, hinh: 1, hai: 2, pha: 3, hop: 4 };
    return '<div class="qh">' + list.slice().sort(function (a, b) { return thuTu[a.loai] - thuTu[b.loai]; }).map(function (q) {
      return '<div class="qh-dong"><button type="button" class="qh-loai ' + q.loai + '" data-qh="' + q.loai + '">' + ten[q.loai] + '</button>' +
        '<span>' + esc(q.text) + '</span><span class="giua">' + esc(q.giua) + '</span></div>';
    }).join('') + '</div>';
  }

  // ---------- Trạng thái ----------
  var S = { chart: null, tab: 'ban-menh', nam: new Date().getFullYear(), vanChon: null };

  function ngayDL(inp) { return pad(inp.d) + '/' + pad(inp.m) + '/' + inp.y; }

  function renderTomTat(c) {
    var inp = c.inp, al = c.amLich, kv = c.khoiVan, dt = c.dungThan;
    var am = pad(al.d) + '/' + pad(al.m) + (al.nhuan ? ' (nhuận)' : '') + '/' + al.y;
    var nc = BT.ganHanh(c.dg);
    function muc(nhan, giaTri) { return '<div><dt>' + nhan + '</dt><dd>' + giaTri + '</dd></div>'; }
    $('#tom-tat').innerHTML =
      '<div class="tt-ten">' + esc(inp.name || 'Lá số chưa đặt tên') + (inp.bd ? ' <span>“' + esc(inp.bd) + '”</span>' : '') + '</div>' +
      '<dl class="tt-ds">' +
      muc('Dương lịch', ngayDL(inp) + ' · ' + pad(inp.h) + ':' + pad(inp.mi)) +
      muc('Âm lịch', am) +
      muc('Giới tính', inp.gender === 1 ? 'Nam' : 'Nữ') +
      muc('Tuổi', G[c.year.g] + ' ' + Z[c.year.z] + ' (' + BT.CON_GIAP[c.year.z] + ')') +
      muc('Nạp âm', BT.napAm(c.year.g, c.year.z)) +
      muc('Nhật chủ', '<span class="mau ' + hk(nc) + '">' + G[c.dg] + ' ' + BT.HANH[nc] + '</span> · ' + c.nguHanh.ketLuan) +
      muc('Dụng thần', '<span class="mau ' + hk(dt.D) + '">' + BT.HANH[dt.D] + '</span>') +
      muc('Khởi vận', kv.ngayDL.split('-').reverse().join('/') + ' · đi ' + (kv.thuan ? 'thuận' : 'nghịch')) +
      '</dl>';
  }

  function renderBanMenh(c) {
    var nh = c.nguHanh;
    var cols = c.tru.map(function (p, i) {
      var phu = { 'Giờ': pad(c.inp.h) + ':' + pad(c.inp.mi), 'Ngày': pad(c.inp.d), 'Tháng': pad(c.inp.m), 'Năm': c.inp.y }[p.ten] || '';
      return { p: p, head: (p.ten === 'Giờ' || p.ten === 'Ngày' || p.ten === 'Tháng' || p.ten === 'Năm' ? 'Trụ ' + p.ten.toLowerCase() : p.ten) +
        '<span class="phu">' + (p.ten === 'Ngày' ? 'Nhật chủ · ' : '') + phu + '</span>',
        cls: p.ten === 'Ngày' ? 'nhat-chu' : (i < 2 ? 'phu-cot' : '') };
    });
    var bars = nh.pct.map(function (v, e) {
      return '<div class="nh-dong ' + hk(e) + '"><span class="ten-h">' + BT.HANH[e] + '</span>' +
        '<span class="nh-thanh"><span style="width:' + v + '%"></span></span>' +
        '<span class="so">' + v.toFixed(1) + '%</span><span class="tt">' + tn(nh.trangThai[e].ten) + '</span></div>';
    }).join('');
    var coTrongLaSo = {};
    c.tuTru.forEach(function (p) { p.sao.forEach(function (x) { coTrongLaSo[x.id] = 1; }); });
    function nhomSao(cat) {
      return BT.bangThanSat(c).filter(function (r) { return r.cat === cat; }).map(function (r) {
        return '<div class="ts-o' + (coTrongLaSo[r.id] ? ' co' : '') + '">' + tn(r.ten, cat ? 'cat' : 'hung') + '<span>' + r.vi.join(', ') + '</span></div>';
      }).join('');
    }
    $('#trang-ban-menh').innerHTML =
      '<section class="giay"><div class="bang-ten">Bát tự bản mệnh <small>Bấm vào thuật ngữ để xem giải nghĩa</small></div>' +
      bangTru(cols, { sao: true, goc: true }) + '</section>' +
      '<div class="bm-luoi">' +
        '<div class="cot">' +
          '<section class="giay"><div class="bang-ten">Năng lượng ngũ hành</div><div class="nh">' + bars + '</div>' +
          '<div class="ket-luan">Nhật chủ <b class="mau ' + hk(nh.nhatChu) + '">' + G[c.dg] + ' ' + BT.HANH[nh.nhatChu] + '</b> sinh mùa ' +
          '<b class="mau ' + hk(BT.zhiHanh(c.month.z)) + '">' + BT.HANH[BT.zhiHanh(c.month.z)] + '</b>. Lực hỗ trợ (Ấn + Tỷ) <b>' + nh.hoTro.toFixed(1) + '%</b> → <strong>' + nh.ketLuan + '</strong>.' + tamDacHtml(c) + '</div></section>' +
          '<section class="giay"><div class="bang-ten">Hợp · Xung · Hình · Hại</div>' +
          quanHeHtml(BT.lietKeQuanHe(c.tuTru.map(function (p) { return { g: p.g, z: p.z, ten: 'Trụ ' + p.ten.toLowerCase() }; }))) + '</section>' +
        '</div>' +
        '<section class="giay"><div class="bang-ten">Dụng thần · Hỷ thần</div>' + dungThanHtml(c) + '</section>' +
      '</div>' +
      '<section class="giay"><div class="bang-ten">Thần sát <small>Dòng tô vàng: sao có mặt trong tứ trụ · bên phải là vị trí của sao</small></div>' +
        '<div class="ts-cot">' +
          '<div class="ts-nhom"><h4 class="tieu-nho">Cát tinh</h4><div class="ts-ds">' + nhomSao(true) + '</div></div>' +
          '<div class="ts-nhom"><h4 class="tieu-nho">Hung tinh</h4><div class="ts-ds">' + nhomSao(false) + '</div></div>' +
        '</div>' +
      '</section>';
  }

  function renderDaiVan(c) {
    var nay = new Date().getFullYear();
    var vanNay = BT.vanCuaNam(c, nay);
    if (S.vanChon == null) S.vanChon = Math.max(0, c.daiVan.indexOf(vanNay));
    var cols = c.daiVan.map(function (v, i) {
      var cls = (v === vanNay ? 'dang ' : '') + (i === S.vanChon ? 'da-chon ' : '') + 'chon-duoc';
      return { p: v, cls: cls, head: v.namBD + '–' + v.namKT + '<span class="phu">Tuổi ' + v.tuoi + (v === vanNay ? ' · đang chạy' : '') + '</span>' };
    });
    var v = c.daiVan[S.vanChon];
    var o = '';
    for (var y = v.namBD; y <= v.namKT; y++) {
      var g = ((y - 4) % 10 + 10) % 10, z = ((y - 4) % 12 + 12) % 12;
      o += '<button type="button" class="o-nam' + (y === nay ? ' nay' : '') + '" data-nam="' + y + '"><span class="nam">' + y + '</span>' +
        '<span class="gz">' + gz(g, z) + '</span><span>' + BT.THAP_THAN_TAT[BT.thapThan(c.dg, g)] + ' · ' + BT.TRUONG_SINH[BT.truongSinh(c.dg, z)] + '</span>' + dgHtml(BT.danhGia(c, g, z)) + '</button>';
    }
    var qh = BT.lietKeQuanHe(c.tuTru.map(function (p) { return { g: p.g, z: p.z, ten: 'Trụ ' + p.ten.toLowerCase() }; }), [{ g: v.g, z: v.z, ten: 'Vận ' + G[v.g] + ' ' + Z[v.z] }]);
    $('#trang-dai-van').innerHTML =
      '<section class="giay"><div class="bang-ten">Đại vận <small>Mỗi vận 10 năm · bấm tiêu đề cột để xem các năm trong vận</small></div>' +
      bangTru(cols, { nho: true, gon: true, cls: 'van', danhGia: true }) + '</section>' +
      '<section class="giay"><div class="bang-ten">Lưu niên trong vận ' + G[v.g] + ' ' + Z[v.z] + ' <small>' + v.namBD + '–' + v.namKT + ' · bấm một năm để xem chi tiết</small></div>' +
      '<div class="luoi-nam">' + o + '</div></section>' +
      '<section class="giay"><div class="bang-ten">Vận ' + G[v.g] + ' ' + Z[v.z] + ' tác động tứ trụ</div>' + quanHeHtml(qh) + '</section>';
  }

  function renderLuuNien(c) {
    var ln = BT.luuNien(c, S.nam);
    var n = ln.nam;
    var homNay = new Date();
    var bon = ln.tueQuan.map(function (t) {
      var p = t.tru;
      return '<div><h4>Trụ ' + p.ten.toLowerCase() + '</h4><span class="tq-gz">' + gz(p.g, p.z) + '</span>' + tn(t.sao.ten, t.sao.cat ? 'cat' : 'hung') + '</div>';
    }).join('');
    var thangCols = ln.thang.map(function (t) {
      var tu = new Date(t.tu.y, t.tu.m - 1, t.tu.d, t.tu.h, t.tu.mi), den = new Date(t.den.y, t.den.m - 1, t.den.d, t.den.h, t.den.mi);
      var dang = homNay >= tu && homNay < den;
      return { p: t, cls: dang ? 'dang' : '', head: pad(t.tu.d) + '/' + pad(t.tu.m) + '<span class="phu">' + BT.TIET_KHI[ln.thang.indexOf(t)] + (dang ? ' · tháng này' : '') + '</span>' };
    });
    $('#trang-luu-nien').innerHTML =
      '<section class="giay"><div class="bang-ten">Lưu niên ' + S.nam +
        '<span class="chon-nam"><button type="button" class="nut" data-buoc="-1" aria-label="Năm trước">◀</button>' +
        '<input id="o-nam" type="number" min="1900" max="2200" value="' + S.nam + '" aria-label="Năm lưu niên">' +
        '<button type="button" class="nut" data-buoc="1" aria-label="Năm sau">▶</button>' +
        '<button type="button" class="nut" data-buoc="0">Năm nay</button></span></div>' +
        '<div class="nam-tom"><div style="display:flex;gap:10px">' + canTile(n.g) + chiTile(n.z) + '</div>' +
        '<dl><dt>Theo ' + tn('Dụng thần') + '</dt><dd>' + dgHtml(BT.danhGia(c, n.g, n.z), true) + '</dd>' +
        '<dt>Thập thần</dt><dd>' + ttHtml(n) + '</dd>' +
        '<dt>Trường sinh</dt><dd>' + tn(BT.TRUONG_SINH[n.ts]) + '</dd>' +
        '<dt>Tàng can</dt><dd>' + n.tang.map(function (t) { return '<span class="mau ' + hk(BT.ganHanh(t.g)) + '">' + G[t.g] + '</span> (' + BT.THAP_THAN[t.tt] + ')'; }).join(', ') + '</dd>' +
        '<dt>Nạp âm</dt><dd>' + n.napAm + '</dd>' +
        '<dt>Đại vận</dt><dd>' + (ln.van ? gz(ln.van.g, ln.van.z) + ' (' + ln.van.namBD + '–' + ln.van.namKT + ', ' + BT.THAP_THAN[ln.van.tt] + ')' : 'Chưa khởi vận') + '</dd>' +
        '<dt>Sao năm mang tới</dt><dd>' + (n.sao.length ? n.sao.map(function (s) { return tn(s.ten, s.cat ? 'cat' : 'hung'); }).join(', ') : '—') + '</dd></dl></div>' +
      '</section>' +
      '<div class="hai-cot">' +
        '<section class="giay"><div class="bang-ten">Tuế quân theo từng trụ</div><div class="bon-cot">' + bon + '</div>' +
          '<p class="ghi-chu">Vị trí của chi năm ' + Z[n.z] + ' so với chi mỗi trụ trong vòng 12 thần Tuế quân.</p></section>' +
        '<section class="giay"><div class="bang-ten">Năm & vận tác động tứ trụ</div>' + quanHeHtml(ln.quanHe) + '</section>' +
      '</div>' +
      '<section class="giay"><div class="bang-ten">Lưu nguyệt ' + S.nam + ' <small>Tháng tính theo tiết khí, giờ Việt Nam</small></div>' +
        bangTru(thangCols, { nho: true, gon: true, cls: 'van', danhGia: true }) + '</section>';
  }

  function render() {
    var c = S.chart;
    renderTomTat(c);
    renderBanMenh(c); renderDaiVan(c); renderLuuNien(c);
    chonTab(S.tab);
  }

  function chonTab(id) {
    S.tab = id;
    document.querySelectorAll('.tabs button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.tab === id ? 'true' : 'false'); });
    document.querySelectorAll('.trang').forEach(function (t) { t.hidden = t.id !== 'trang-' + id; });
    try { localStorage.setItem('bt-tab', id); } catch (e) {}
  }

  // ---------- Popover giải nghĩa ----------
  var pop = null;
  function dongPop() { if (pop) { pop.remove(); pop = null; } }
  function moPop(el, title, text) {
    dongPop();
    pop = document.createElement('div');
    pop.className = 'giai'; pop.setAttribute('role', 'dialog');
    pop.innerHTML = '<h5>' + esc(title) + '</h5><p>' + esc(text) + '</p>';
    document.body.appendChild(pop);
    var r = el.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    var x = Math.min(Math.max(16, r.left + r.width / 2 - w / 2), window.innerWidth - w - 16);
    var y = r.bottom + 8 + h > window.innerHeight ? r.top - h - 8 : r.bottom + 8;
    pop.style.left = x + 'px'; pop.style.top = Math.max(8, y) + 'px';
  }

  // ---------- URL & form ----------
  function docInput() {
    var f = $('#form-nhap');
    var d = f.ngay.value.split('-'), t = (f.gio.value || '12:00').split(':');
    return { name: f.ten.value.trim(), gender: Number(f.gioitinh.value), y: +d[0], m: +d[1], d: +d[2], h: +t[0], mi: +t[1],
      bd: f.bietdanh.value.trim(), nl: f.nguoiluan.value.trim() };
  }
  function ganForm(inp) {
    var f = $('#form-nhap');
    f.ten.value = inp.name; f.gioitinh.value = String(inp.gender);
    f.ngay.value = inp.y + '-' + pad(inp.m) + '-' + pad(inp.d); f.gio.value = pad(inp.h) + ':' + pad(inp.mi);
    f.bietdanh.value = inp.bd || ''; f.nguoiluan.value = inp.nl || '';
  }
  function ghiUrl() {
    var i = S.chart.inp;
    var q = '?ten=' + encodeURIComponent(i.name) + '&gt=' + i.gender + '&ngay=' + i.y + '-' + pad(i.m) + '-' + pad(i.d) +
      '&gio=' + pad(i.h) + ':' + pad(i.mi) + '&nam=' + S.nam +
      (i.bd ? '&bd=' + encodeURIComponent(i.bd) : '') + (i.nl ? '&nl=' + encodeURIComponent(i.nl) : '');
    try { history.replaceState(null, '', q + location.hash); } catch (e) {}
  }
  function docUrl() {
    try {
      var p = new URLSearchParams(location.search);
      if (!p.get('ngay')) return null;
      var d = p.get('ngay').split('-'), t = (p.get('gio') || '12:00').split(':');
      if (p.get('nam')) S.nam = +p.get('nam');
      return { name: p.get('ten') || '', gender: p.get('gt') === '0' ? 0 : 1, y: +d[0], m: +d[1], d: +d[2], h: +t[0], mi: +t[1],
        bd: p.get('bd') || '', nl: p.get('nl') || '' };
    } catch (e) { return null; }
  }

  function lap(inp) {
    if (!inp.y || !inp.m || !inp.d || inp.y < 1900 || inp.y > 2100) { $('#loi').textContent = 'Ngày sinh chưa hợp lệ. Hãy chọn ngày từ năm 1900 đến 2100.'; return; }
    $('#loi').textContent = '';
    moForm(false);
    S.chart = BT.lapLaSo(inp); S.vanChon = null;
    render(); ghiUrl();
    document.title = (inp.name ? inp.name + ' · ' : '') + 'Bát Tự Phong Thủy';
  }

  function moForm(mo) {
    $('#form-nhap').hidden = !mo;
    $('#nut-sua').setAttribute('aria-expanded', mo ? 'true' : 'false');
    $('#nut-sua').textContent = mo ? 'Đóng' : 'Sửa thông tin';
    if (mo) $('#ten').focus();
  }

  // ---------- Hồ sơ PDF ----------
  var tieuDeCu = '';
  function chuoiCss(s) { return '"' + String(s).replace(/["\\]/g, '\\$&') + '"'; }
  function moHoSo() {
    var inp = S.chart.inp, khoa = JSON.stringify(inp);
    if (S.hoSoKhoa !== khoa) {
      $('#hs-noi-dung').innerHTML = BT.taoHoSo(S.chart, { bietDanh: inp.bd, nam: new Date().getFullYear() });
      S.hoSoKhoa = khoa;
    }
    var chan = 'Hồ Sơ Mệnh Lý Bát Tự' + (inp.nl ? ' • ' + inp.nl : '');
    var font = "font-family: 'Noto Serif', Georgia, serif; font-size: 8.5pt; color: #8a7a6a;";
    $('#hs-trang-in').textContent = '@page { size: A4; margin: 14mm 15mm 16mm; ' +
      '@bottom-left { content: ' + chuoiCss(chan) + '; ' + font + ' } ' +
      '@bottom-right { content: "Trang " counter(page) " / " counter(pages); ' + font + ' } }';
    $('#ho-so').hidden = false;
    document.body.classList.add('xem-ho-so');
    window.scrollTo(0, 0);
  }
  function dongHoSo() {
    $('#ho-so').hidden = true;
    document.body.classList.remove('xem-ho-so');
    $('#hs-trang-in').textContent = '';
  }
  function inHoSo() {
    var inp = S.chart.inp;
    tieuDeCu = document.title;
    document.title = 'Hồ Sơ Bát Tự ' + (inp.bd || inp.name || '');
    window.print();
  }
  window.addEventListener('afterprint', function () { if (tieuDeCu) { document.title = tieuDeCu; tieuDeCu = ''; } });

  // ---------- Xuất ảnh ----------
  function xuatAnh() {
    if (!window.html2canvas) { $('#loi').textContent = 'Chưa tải được thư viện xuất ảnh (cần kết nối mạng).'; return; }
    var vung = $('#vung-in');
    var nen = getComputedStyle(document.body).backgroundColor;
    window.html2canvas(vung, { backgroundColor: nen, scale: 2 }).then(function (cv) {
      var a = document.createElement('a');
      a.download = 'la-so-' + (S.chart.inp.name || 'bat-tu').replace(/\s+/g, '-') + '-' + S.tab + '.png';
      a.href = cv.toDataURL('image/png'); a.click();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    try { S.tab = localStorage.getItem('bt-tab') || S.tab; } catch (e) {}
    var h = location.hash.slice(1);
    if (['ban-menh', 'dai-van', 'luu-nien'].indexOf(h) >= 0) S.tab = h;
    var inp = docUrl() || { name: 'Nguyễn Ngọc Linh', gender: 1, y: 1994, m: 1, d: 17, h: 2, mi: 56, bd: 'Sói', nl: 'Tít Nguyễn' };
    ganForm(inp);
    $('#form-nhap').addEventListener('submit', function (e) { e.preventDefault(); lap(docInput()); });
    document.querySelectorAll('.tabs button').forEach(function (b) { b.addEventListener('click', function () { chonTab(b.dataset.tab); }); });
    $('#nut-in').addEventListener('click', function () { window.print(); });
    $('#nut-anh').addEventListener('click', xuatAnh);
    $('#nut-ho-so').addEventListener('click', moHoSo);
    $('#nut-sua').addEventListener('click', function () { moForm($('#form-nhap').hidden); });
    $('#hs-quay-lai').addEventListener('click', dongHoSo);
    $('#hs-in').addEventListener('click', inHoSo);
    var hen = null;
    $('#hs-tao-lai').addEventListener('click', function () {
      var b = this;
      if (!hen) { b.textContent = 'Bấm lần nữa: bỏ phần đã sửa'; hen = setTimeout(function () { b.textContent = 'Tạo lại nội dung'; hen = null; }, 4000); return; }
      clearTimeout(hen); hen = null; b.textContent = 'Tạo lại nội dung';
      S.hoSoKhoa = null; moHoSo();
    });

    document.addEventListener('click', function (e) {
      var t = e.target.closest('.tn');
      if (t) { e.stopPropagation(); var k = t.dataset.k; moPop(t, k, BT.GIAI_NGHIA[k] || 'Chưa có giải nghĩa.'); return; }
      var q = e.target.closest('.qh-loai');
      if (q) { moPop(q, q.textContent, BT.GIAI_NGHIA_QH[q.dataset.qh]); return; }
      var th = e.target.closest('table.van thead th.chon-duoc');
      if (th) { S.vanChon = +th.dataset.i; renderDaiVan(S.chart); return; }
      var on = e.target.closest('.o-nam');
      if (on) { S.nam = +on.dataset.nam; renderLuuNien(S.chart); chonTab('luu-nien'); ghiUrl(); window.scrollTo({ top: $('.tabs').offsetTop - 8 }); return; }
      var b = e.target.closest('[data-buoc]');
      if (b) { var st = +b.dataset.buoc; S.nam = st === 0 ? new Date().getFullYear() : S.nam + st; renderLuuNien(S.chart); ghiUrl(); return; }
      if (!e.target.closest('.giai')) dongPop();
    });
    document.addEventListener('change', function (e) {
      if (e.target.id === 'o-nam') { var v = +e.target.value; if (v >= 1900 && v <= 2200) { S.nam = v; renderLuuNien(S.chart); ghiUrl(); } }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') dongPop(); });
    window.addEventListener('scroll', dongPop, { passive: true });
    lap(inp);
  });
})(window.BT);
