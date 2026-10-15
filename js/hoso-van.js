// Kho văn mẫu cho Hồ sơ mệnh lý. Giọng văn: xưng "bạn", hình ảnh ngũ hành, tiêu đề giàu cảm xúc.
// Chỉ số hành: 0 Mộc, 1 Hỏa, 2 Thổ, 3 Kim, 4 Thủy. Nhóm thập thần: 0 Tỷ Kiếp, 1 Thực Thương, 2 Tài, 3 Quan Sát, 4 Ấn.
(function (BT) {
  var V = BT.VAN = {};

  // Hình tượng và tính cách 10 nhật can
  V.NHAT_CHU = [
    { hinh: 'cây đại thụ vươn thẳng lên trời, rễ cắm sâu vào đất', tinh: 'chính trực, có chí tiến thủ, nhân hậu và luôn muốn vươn lên dẫn dắt người khác',
      tieuDe: 'Ngay Thẳng Và Khát Khao Vươn Lên', text: 'Như cây đại thụ, bạn sống có nguyên tắc, coi trọng danh dự và luôn muốn mình trưởng thành hơn mỗi ngày. Bạn ít khi chịu cúi đầu, nhưng cũng vì thế mà đôi lúc cứng nhắc, khó uốn mình trước hoàn cảnh.' },
    { hinh: 'dây leo, hoa cỏ mềm mại, uốn mình theo gió mà vẫn bám chắc', tinh: 'khéo léo, mềm mỏng, giỏi thích nghi và có óc thẩm mỹ tinh tế',
      tieuDe: 'Mềm Mại Nhưng Bền Bỉ', text: 'Như dây leo tìm đường lên cao, bạn giỏi quan sát, biết dựa thế và khéo léo trong giao tiếp. Bề ngoài nhu hòa nhưng bên trong rất kiên trì; điểm yếu là đôi khi tính toán quá nhiều, thiếu cảm giác an toàn.' },
    { hinh: 'mặt trời rực rỡ, chiếu sáng muôn nơi mà không đòi hỏi đáp đền', tinh: 'nhiệt tình, hào phóng, thẳng thắn và giàu năng lượng lan tỏa',
      tieuDe: 'Rực Rỡ Và Hào Sảng', text: 'Bạn giống như mặt trời: đi đến đâu là ấm áp đến đó, thích giúp đỡ và được mọi người chú ý. Nhưng nắng gắt quá thì dễ làm người khác mệt; bạn cần học cách tiết chế cảm xúc và sự nóng vội.' },
    { hinh: 'ngọn nến, ánh đèn trong đêm, nhỏ mà ấm, soi đường cho người khác', tinh: 'tinh tế, chu đáo, giàu cảm xúc và có trực giác nhạy bén',
      tieuDe: 'Ánh Đèn Tinh Tế Trong Đêm', text: 'Bạn là người để ý từng chi tiết nhỏ, chu đáo với người thân và có khả năng thấu hiểu cảm xúc người khác. Ngọn lửa bên trong bạn âm ỉ, bền lâu, nhưng cũng dễ chao đảo trước gió, nên bạn hay lo nghĩ và nhạy cảm.' },
    { hinh: 'núi cao, tường thành vững chãi, che chở và giữ gìn', tinh: 'điềm tĩnh, đáng tin cậy, trọng chữ tín và có sức chịu đựng phi thường',
      tieuDe: 'Vững Chãi Như Núi', text: 'Bạn là chỗ dựa của nhiều người: ít nói, làm nhiều, giữ lời hứa. Sự vững vàng ấy là sức mạnh, nhưng núi thì khó dời, bạn đôi khi bảo thủ, chậm thay đổi và giữ cảm xúc quá kín.' },
    { hinh: 'ruộng vườn màu mỡ, mềm và ẩm, nuôi dưỡng vạn vật', tinh: 'bao dung, chu toàn, khéo vun vén và giàu lòng trắc ẩn',
      tieuDe: 'Đất Lành Nuôi Dưỡng', text: 'Bạn có khả năng chăm lo, sắp xếp và nuôi dưỡng mọi thứ xung quanh. Bạn mềm mỏng, chịu thiệt về mình, nhưng cũng vì vậy hay ôm việc, lo cho người khác mà quên chăm sóc bản thân.' },
    { hinh: 'thanh kiếm thép, khối quặng cứng cáp chờ được tôi luyện', tinh: 'quyết đoán, nghĩa khí, thẳng thắn và mạnh mẽ trong hành động',
      tieuDe: 'Thép Cứng Chờ Tôi Luyện', text: 'Bạn làm việc dứt khoát, ghét vòng vo và sẵn sàng đứng ra bảo vệ lẽ phải. Thép càng qua lửa càng sắc: thử thách là thứ làm nên bạn, nhưng sự thẳng thắn đôi khi khiến bạn vô tình làm tổn thương người khác.' },
    { hinh: 'viên ngọc, món trang sức tinh xảo, sáng lấp lánh khi được lau chùi', tinh: 'tinh tế, trọng hình thức, cầu toàn và có lòng tự trọng cao',
      tieuDe: 'Viên Ngọc Cầu Toàn', text: 'Bạn coi trọng sự chỉn chu, đẹp đẽ và cảm giác được tôn trọng. Bạn có gu, có tiêu chuẩn riêng, nhưng cũng dễ tổn thương bởi lời chê và hay tự gây áp lực vì muốn mọi thứ hoàn hảo.' },
    { hinh: 'sông lớn, biển cả cuồn cuộn, mạnh mẽ và không ngừng chảy', tinh: 'thông minh, phóng khoáng, giàu ý tưởng và thích tự do',
      tieuDe: 'Dòng Sông Không Ngừng Chảy', text: 'Bạn có tầm nhìn rộng, đầu óc nhanh nhạy và thích khám phá. Nước lớn thì sức mạnh lớn, nhưng không có bờ đê thì dễ tràn: bạn cần kỷ luật để không bị cuốn theo cảm hứng nhất thời.' },
    { hinh: 'sương mây, giọt mưa nhẹ nhàng, thẩm thấu vạn vật', tinh: 'cực kỳ thông minh, tư duy linh hoạt, đa sầu đa cảm và có chiều sâu nội tâm',
      tieuDe: 'Trí Tuệ Vượt Trội Nhưng Khép Kín', text: 'Bạn là người sâu sắc, nhìn thấu tâm can người khác nhưng lại hiếm khi bộc lộ tâm tư của mình. Trông bề ngoài hiền lành, tĩnh lặng nhưng bên trong luôn có hàng ngàn kịch bản chạy trong đầu.' }
  ];

  // Mô tả tháng sinh theo địa chi tháng
  V.THANG = ['giữa mùa Đông giá buốt', 'cuối mùa Đông, lúc khí lạnh đạt cực điểm', 'đầu Xuân, khí trời còn se lạnh',
    'giữa Xuân, cây cối đâm chồi', 'cuối Xuân, đất trời ẩm ướt', 'đầu Hạ, nắng bắt đầu gay gắt', 'giữa Hạ, nóng rực như lửa',
    'cuối Hạ, oi nồng khô hanh', 'đầu Thu, gió heo may thổi', 'giữa Thu, Kim khí sắc lạnh', 'cuối Thu, khô hanh',
    'đầu Đông, khí lạnh tràn về'];

  V.TRANG_THAI_MUA = {
    'Vượng': 'đúng lúc {H} khí đắc lệnh, mạnh nhất trong năm',
    'Tướng': 'lúc {H} khí đang được mùa sinh trợ, khá mạnh',
    'Hưu': 'lúc {H} khí đã truyền sức cho mùa, ở trạng thái nghỉ',
    'Tù': 'lúc {H} khí bị kìm hãm, khó phát huy',
    'Tử': 'lúc {H} khí suy yếu nhất trong năm'
  };

  // Tên hiện tượng đầu mục 1 (theo hành nhật chủ)
  V.HIEN_TUONG_DONG = ['Cây Khô Trong Giá Rét', 'Ngọn Lửa Giữa Trời Đông', 'Đất Đóng Băng', 'Kim Hàn Thủy Lạnh', 'Thủy Khí Đóng Băng'];
  V.HIEN_TUONG_HA = ['Cây Khát Nước Mùa Hạ', 'Lửa Cháy Đồng Khô', 'Đất Nứt Nẻ Mùa Hạ', 'Kim Gặp Lửa Nung', 'Dòng Nước Giữa Nắng Hạ'];

  // {MUC}: "thiếu Hỏa trầm trọng" (dưới 3%) hoặc "Hỏa khí yếu"
  V.HAU_QUA_DONG = 'nhưng vì {MUC}, Mệnh cục của bạn mang nhiều hàn khí, dễ dẫn đến sự u uất, suy nghĩ miên man và đôi khi thiếu đi ngọn lửa nhiệt huyết để dứt khoát hành động.';
  V.HAU_QUA_HA = 'nhưng vì {MUC}, cục diện nóng rát, khô hạn, khiến bạn dễ nóng vội, căng thẳng và khó giữ được sự bình tĩnh, bền bỉ.';
  V.THE = {
    vuong: 'Thế {T} này mang lại sức sống bền bỉ, ý chí tự lập mạnh mẽ',
    hoa: 'Thế {T} này giúp bạn linh hoạt, không quá cứng cũng không quá yếu',
    nhuoc: 'Thế {T} này khiến bạn nhạy cảm, dễ chịu ảnh hưởng của hoàn cảnh và cần quý nhân, môi trường tốt để bung tỏa'
  };

  // Ý nghĩa nhóm thập thần theo giới tính: [miền 1, miền 2, khuyết 1, khuyết 2]
  V.NHOM = [
    { a: 'Bản Lĩnh & Sự Tự Tin', b: 'Anh Em, Bạn Bè, Đồng Nghiệp',
      ka: 'Thiếu Tỷ Kiếp khiến bạn dễ nghi ngờ bản thân, ngại va chạm và hay nhường phần thiệt về mình. Bạn cần học cách nói "không" và đứng vững trên quan điểm riêng.',
      kb: 'Bạn thường phải tự lực cánh sinh, ít nhận được sự hậu thuẫn từ anh em, bạn bè. Mối quan hệ nào bền lâu đều do chính bạn vun đắp, nên hãy chủ động kết giao những người cùng chí hướng.' },
    { a: 'Tài Năng & Sự Biểu Đạt', b: { nam: 'Sự Hưởng Thụ & Hậu Vận', nu: 'Con Cái & Hậu Vận' },
      ka: 'Thiếu Thực Thương khiến bạn có nhiều ý tưởng nhưng khó diễn đạt thành lời, thành sản phẩm. Năng lực thật thường bị đánh giá thấp hơn thực tế vì bạn không biết "trình diễn".',
      kb: { nam: 'Bạn hay sống vì trách nhiệm mà quên tận hưởng, dễ căng thẳng kéo dài. Hãy dành chỗ cho sở thích, nghệ thuật để cuộc sống có lối thoát cảm xúc.',
        nu: 'Duyên con cái đến chậm hoặc cần nhiều tâm sức chăm lo. Bạn nên dành thời gian cho bản thân thư giãn để giữ năng lượng nuôi dưỡng gia đình.' } },
    { a: 'Tiền Bạc', b: { nam: 'Người Vợ/Tình Duyên', nu: 'Người Cha & Khả Năng Quản Lý' },
      ka: 'Việc khuyết Tài không có nghĩa là nghèo, mà nó báo hiệu bạn không quá chấp niệm vào vật chất, hoặc việc tích lũy tài sản phải dựa vào Thực Thương (trí tuệ, chuyên môn) để sinh ra Tài. Tuy nhiên, tiền bạc khó giữ lâu, dễ thất thoát hoặc đầu tư sai lệch nếu thiếu tỉnh táo.',
      kb: { nam: 'Nam mệnh khuyết Tài Tinh báo hiệu đường tình cảm khá lận đận, duyên đến duyên đi khó nắm bắt, thường kết hôn muộn hoặc phải kiên nhẫn rất nhiều trong việc thấu hiểu người bạn đời.',
        nu: 'Sợi dây gắn kết với người cha có phần mỏng manh, đồng thời khả năng quản lý chi tiêu, sắp xếp nguồn lực cần được rèn luyện nhiều hơn.' } },
    { a: { nam: 'Sự Nghiệp & Địa Vị', nu: 'Sự Nghiệp & Địa Vị' }, b: { nam: 'Kỷ Luật & Con Cái', nu: 'Người Chồng/Tình Duyên' },
      ka: 'Thiếu Quan Sát khiến bạn không thích bị gò bó, khó gắn bó lâu với môi trường nhiều quy tắc. Con đường sự nghiệp của bạn hợp với tự do, chuyên môn hơn là leo thang chức vị.',
      kb: { nam: 'Bạn dễ thiếu kỷ luật với chính mình, làm việc theo cảm hứng. Hãy tự đặt ra khuôn khổ, mục tiêu rõ ràng để năng lực không bị phân tán. Với nam mệnh, Quan Sát còn chỉ con cái, nên duyên con cái cũng cần kiên nhẫn vun đắp.',
        nu: 'Nữ mệnh khuyết Quan Tinh báo hiệu duyên phu thê đến muộn, khó tìm được người thật sự khiến bạn nể phục. Kiên nhẫn và tiêu chuẩn rõ ràng sẽ giúp bạn gặp đúng người.' } },
    { a: 'Học Vấn & Bằng Cấp', b: 'Mẹ, Quý Nhân & Sự Che Chở',
      ka: 'Thiếu Ấn tinh khiến con đường học hành của bạn ít đi theo lối mòn; bạn học từ thực tế nhiều hơn sách vở. Bằng cấp không phải lợi thế, kinh nghiệm mới là vũ khí.',
      kb: 'Bạn sớm phải tự lập, ít được che chở. Lòng tin vào người khác đến chậm, nhưng chính điều đó khiến bạn trưởng thành và bản lĩnh hơn bạn bè đồng trang lứa.' }
  ];

  // Tên tiêu đề hình ảnh cho cặp (hành của hàng X, hành nhật chủ Y): [tốt, xấu]
  V.CAP = {
    '00': ['Rừng Cây Nương Tựa', 'Rừng Rậm Che Lấp'], '11': ['Lửa Thêm Bạn Đồng Hành', 'Lửa Dữ Thiêu Đốt'],
    '22': ['Đất Dày Vững Chãi', 'Đất Dày Ứ Trệ'], '33': ['Kim Hợp Sức', 'Kim Cứng Dễ Gãy'], '44': ['Sông Thêm Nguồn', 'Nước Tràn Bờ'],
    '01': ['Củi Khô Nuôi Lửa', 'Củi Nhiều Lửa Tắt'], '02': ['Rễ Cây Giữ Đất', 'Rễ Cây Xẻ Đất'], '03': ['Gỗ Quý Chờ Đẽo', 'Gỗ Cứng Mẻ Dao'],
    '04': ['Xả Bớt Sự Úng Ngập', 'Cây Hút Cạn Nguồn'], '10': ['Gỗ Hóa Ánh Sáng', 'Lửa Thiêu Rừng'], '12': ['Lửa Ấm Đất Lành', 'Lửa Nung Đất Khô'],
    '13': ['Lửa Luyện Thành Khí', 'Lửa Lớn Chảy Kim'], '14': ['Mặt Trời Soi Nước', 'Nước Sôi Lửa Bỏng'], '20': ['Đất Lành Cây Tốt', 'Đất Dày Vùi Rễ'],
    '21': ['Đất Thu Lửa Dữ', 'Đất Dày Lửa Tối'], '23': ['Đất Dưỡng Kim', 'Đất Dày Vùi Kim'], '24': ['Đắp Đê Chặn Nước', 'Đất Lấp Dòng Chảy'],
    '30': ['Đẽo Gọt Thành Tài', 'Rìu Sắc Chặt Cây'], '31': ['Lửa Rèn Ra Của', 'Kim Nhiều Lửa Yếu'], '32': ['Đất Sinh Vàng Ngọc', 'Kim Rút Khí Đất'],
    '34': ['Nguồn Nước Từ Đá', 'Kim Hàn Thủy Lạnh'], '40': ['Nước Tưới Cây Xanh', 'Nước Nhiều Cây Úng'], '41': ['Nước Dập Lửa Dữ', 'Nước Lớn Tắt Lửa'],
    '42': ['Nước Thấm Đất Màu', 'Nước Lũ Trôi Đất'], '43': ['Kim Sinh Thủy Tú', 'Nước Nhiều Kim Chìm']
  };

  // Tác dụng theo quan hệ thập thần (nhóm), khi là hành tốt / xấu. {X} hành của hàng, {Y} hành nhật chủ
  V.TAC_DUNG_TOT = [
    '{X} cùng hành với bản mệnh, tiếp thêm sức để thân đủ mạnh gánh vác Tài, Quan. Đại diện cho sự tự tin, bạn bè và đồng đội hỗ trợ.',
    '{X} dùng để thấm hút, tiết bớt {Y} khí dư thừa, đồng thời chuyển năng lượng thành sản phẩm, ý tưởng. Đại diện cho trí tuệ, kỹ năng chuyên môn và tài ăn nói.',
    '{X} là đích đến của năng lượng bản mệnh, biến nỗ lực thành của cải. Đại diện cho tiền bạc, khả năng quản lý{VO}.',
    'Dùng {X} để ngăn dòng {Y} vượng. {X} mang lại kỷ luật, ranh giới, giúp mệnh chủ không bị cảm xúc chi phối và xây dựng sự nghiệp vững vàng.',
    '{X} sinh {Y}, nuôi dưỡng bản mệnh. Đại diện cho học vấn, quý nhân nâng đỡ và sự bình an trong tâm trí.'
  ];
  V.TAC_DUNG_XAU = [
    '{Y} vốn đã đủ, thêm {X} chỉ làm năng lượng ứ đọng. Sinh ra thói ỷ lại, suy nghĩ miên man, và dễ bị bạn bè anh em làm liên lụy hao tài.',
    '{X} rút khí của bản mệnh, khiến bạn dễ kiệt sức, nói nhiều làm ít, tiêu hao tâm lực vào những việc không đem lại kết quả.',
    'Thân chưa đủ sức mà gặp {X} thì thành "tài nhiều thân nhược": nhìn thấy cơ hội nhưng không giữ được, dễ vì tiền mà mệt mỏi.',
    '{X} khắc thân, tạo áp lực, căng thẳng, thị phi; bạn dễ bị cấp trên hoặc hoàn cảnh đè nén.',
    '{X} sinh {Y} khi {Y} đã đủ, chỉ làm thêm bảo thủ, nguyên tắc cứng nhắc cản trở sự phát triển.'
  ];
  V.DIEU_HAU_DUNG = {
    1: { ten: 'Điều Hầu & Nung Chảy', text: 'Đây là linh hồn của lá số. Mệnh cực hàn bắt buộc phải có Hỏa sưởi ấm, làm tan băng để khí lưu thông. Hỏa mang lại đam mê, năng lượng dương' },
    4: { ten: 'Điều Hầu & Giải Nhiệt', text: 'Đây là linh hồn của lá số. Mệnh cục khô nóng bắt buộc phải có Thủy làm mát, tưới nhuần để vạn vật sinh sôi. Thủy mang lại sự bình tĩnh, trí tuệ' }
  };
  V.MIEN_NGAN = [ 'sự tự tin và đồng đội', 'trí tuệ, sáng tạo', 'của cải', 'danh tiếng, sự nghiệp', 'quý nhân, học vấn' ];
  V.XAU_NGAN = [ 'gây ứ đọng, cạnh tranh', 'tiêu hao sức lực', 'hao tài, áp lực tiền bạc', 'áp lực, thị phi', 'trì trệ, bảo thủ' ];

  // Thai nguyên
  V.DOM = ['MẦM XANH', 'LỬA', 'ĐẤT LÀNH', 'ÁNH KIM', 'NƯỚC'];
  V.DONG_TU = ['tiếp sức sống cho', 'sưởi ấm', 'nâng đỡ', 'định hình', 'tưới mát'];

  // Thần sát: lời luận theo giọng hồ sơ
  V.SAO = {
    quynhan: 'Bạn sở hữu đệ nhất cát thần bảo mệnh. Khi gặp khó khăn thường có người tài giỏi dang tay giúp đỡ, gặp dữ dễ hóa lành.',
    thaicuc: 'Ngôi sao của trí tuệ tâm linh: bạn có trực giác tốt, dễ đến với triết học, tôn giáo, huyền học, và thường được người lớn tuổi quý mến.',
    vanxuong: 'Sao của sự hiếu học, tư duy logic và khiếu văn chương. Bạn là người có tư chất nghiên cứu, hợp làm chuyên gia, thiết kế, công nghệ hoặc cố vấn.',
    loc: 'Lộc Thần an vị: cơm áo không lo thiếu, công việc ổn định và luôn có nguồn thu nhập đều đặn để nương tựa.',
    kimdu: 'Xe vàng chở phúc: hôn nhân thuận lợi, dễ được người khác giới nâng đỡ, cuộc sống có phần sung túc.',
    tuongtinh: 'Tố chất của người cầm quân: bạn có uy, nói ra được người khác lắng nghe, hợp với vị trí quản lý, dẫn dắt đội nhóm.',
    daohoa: 'Bạn có sức hút tự nhiên, duyên dáng và được nhiều người để ý. Đây là lợi thế lớn trong giao tiếp, bán hàng, nghệ thuật, nhưng cần tỉnh táo trong chuyện tình cảm.',
    dichma: 'Ngựa trời phi nước đại: cuộc đời bạn gắn với di chuyển, thay đổi chỗ ở, công việc. Càng đi xa, càng ra ngoài, vận càng mở.',
    hoacai: 'Lọng hoa che đầu: bạn thông minh, có khiếu nghệ thuật và tâm linh, nhưng tâm hồn hay cô độc, thích những khoảng lặng riêng.',
    hongloan: 'Sao hỷ sự chiếu mệnh: tình duyên có nhiều cơ hội, dễ gặp người hợp ý và mang lại niềm vui cho gia đạo.',
    thienhy: 'Sao vui mừng: bạn mang năng lượng tích cực, thường gặp tin vui về cưới hỏi, con cái hoặc thăng tiến.',
    thienduc: 'Phúc đức trời ban: gặp dữ hóa lành, tai ương giảm nhẹ. Bạn sống tử tế thì phúc phần càng dày.',
    nguyetduc: 'Phúc đức theo tháng: tâm hiền, được che chở, hiểm nguy thường lướt qua mà không để lại thương tổn lớn.',
    duongnhan: 'Lưỡi dao sắc trong mệnh: bạn cương quyết, dám làm dám chịu, nhưng nóng nảy dễ gây va chạm. Hãy biến sự sắc bén thành chuyên môn thay vì xung đột.',
    kiepsat: 'Cần đề phòng mất mát bất ngờ, tiền bạc dễ bị lừa hoặc hao hụt. Khi biết tiết chế, đây lại là sao của người mưu lược, nhanh nhạy.',
    taisat: 'Cẩn trọng đi lại, sức khỏe và giấy tờ pháp lý. Đừng chủ quan với những rủi ro nhỏ.',
    vongthan: 'Tâm tư sâu kín, hay tính toán trong lòng. Hãy chọn lời khi nói để tránh thị phi không đáng có.',
    cothan: 'Thích tự lập, có những khoảng cô đơn khó chia sẻ. Trong tình cảm cần chủ động mở lòng hơn.',
    quatu: 'Đôi lúc cảm thấy quạnh quẽ, thiếu người đồng hành thấu hiểu. Tình cảm cần vun đắp bằng sự kiên nhẫn.',
    khongvong: 'Trụ rơi vào tuần trống: điều tốt giảm lực, điều xấu cũng nhẹ đi. Bạn dễ có cảm giác hụt hẫng, nên đặt kỳ vọng vừa phải.'
  };
  V.SAO_CHU_DE = { quynhan: 'Quý Nhân', vanxuong: 'Học Thuật', thaicuc: 'Tâm Linh', loc: 'Tài Lộc', kimdu: 'Phúc Lộc', tuongtinh: 'Quyền Uy',
    daohoa: 'Duyên Phận', dichma: 'Dịch Chuyển', hoacai: 'Nghệ Thuật', hongloan: 'Hỷ Sự', thienhy: 'Hỷ Sự', thienduc: 'Phúc Đức', nguyetduc: 'Phúc Đức' };
  V.SAO_UU_TIEN = ['quynhan', 'vanxuong', 'thaicuc', 'thienduc', 'nguyetduc', 'loc', 'tuongtinh', 'kimdu', 'daohoa', 'hongloan', 'thienhy', 'dichma', 'hoacai'];
  V.SAO_HUNG = ['duongnhan', 'kiepsat', 'taisat', 'vongthan', 'cothan', 'quatu', 'khongvong'];
  V.QUY_NHAN_QUA = ['bạn bè, đồng đội', 'trí tuệ, chuyên môn và kỹ năng của chính mình', 'công việc kinh doanh và các mối quan hệ tài chính',
    'môi trường công sở và cấp trên', 'thầy cô, người lớn tuổi và con đường học vấn'];

  // Thập thần tọa chi ngày
  V.TOA_CHI = [
    ['Độc Lập Tự Chủ (Tỷ Kiên Tọa Chi)', 'Bạn ngồi trên chính sức mạnh của mình: tự tin, độc lập, không thích dựa dẫm. Trong hôn nhân, cả hai đều có cái tôi riêng, cần sự tôn trọng ngang hàng.'],
    ['Cạnh Tranh Ngầm (Kiếp Tài Tọa Chi)', 'Bên trong bạn luôn có một ngọn lửa hơn thua. Bạn dám nghĩ dám làm, nhưng cần cẩn trọng chuyện tiền bạc chung và giữ hòa khí trong gia đình.'],
    ['Sống Để Tận Hưởng (Thực Thần Tọa Chi)', 'Bạn biết cách tận hưởng cuộc sống, ăn nói ôn hòa, dễ mến. Người bạn đời thường hiền lành, mang lại cảm giác thư thái.'],
    ['Cá Tính Khó Thuần (Thương Quan Tọa Chi)', 'Bạn thông minh, sắc sảo, ghét bị kiểm soát. Tài năng rất lớn nhưng lời nói đôi khi sắc như dao, dễ gây hiểu lầm trong các mối quan hệ thân mật.'],
    ['Khéo Xoay Xở (Thiên Tài Tọa Chi)', 'Bạn nhanh nhạy với cơ hội, hào phóng, giao thiệp rộng. Tiền đến nhanh nhưng cũng đi nhanh; chuyện tình cảm nhiều màu sắc.'],
    ['Thực Tế Chắc Chắn (Chính Tài Tọa Chi)', 'Bạn sống thực tế, cẩn thận với từng đồng tiền và coi trọng gia đình. Người bạn đời thường đảm đang, biết vun vén.'],
    ['Nguyên Tắc Ngầm (Thất Sát Tọa Chi)', 'Dù linh hoạt, nhưng việc ngồi trên Thất Sát cho thấy bạn có những giới hạn và sự cố chấp ngầm rất lớn. Rất khó để người khác thay đổi quyết định của bạn khi bạn đã tin vào điều gì đó.'],
    ['Đứng Đắn Chuẩn Mực (Chính Quan Tọa Chi)', 'Bạn sống có trách nhiệm, giữ gìn hình ảnh và trọng lễ nghĩa. Hôn nhân thường ổn định, người bạn đời đáng tin cậy.'],
    ['Trực Giác Bí Ẩn (Thiên Ấn Tọa Chi)', 'Bạn có trực giác mạnh, suy nghĩ khác người và thích những điều sâu xa. Đôi khi bạn cô độc trong thế giới riêng của mình.'],
    ['Hiền Hòa Được Che Chở (Chính Ấn Tọa Chi)', 'Bạn hiền lành, nhân hậu, được người thân yêu thương che chở. Người bạn đời thường chu đáo, như một điểm tựa tinh thần.']
  ];
  // Câu bổ sung khi một nhóm thập thần vượng
  V.NHOM_VUONG = [
    'Tỷ Kiếp dồi dào ({P}%) khiến bạn có lòng tự trọng cao, ít chịu khuất phục, nhưng cũng dễ cố chấp.',
    'Kết hợp với Thực Thương vượng ({P}%), bạn là người có tư chất nghiên cứu, sáng tạo và có khiếu diễn đạt.',
    'Tài tinh vượng ({P}%) cho bạn đầu óc thực tế, nhạy bén với cơ hội kiếm tiền.',
    'Quan Sát vượng ({P}%) cho bạn tinh thần trách nhiệm cao, nhưng cũng hay tự tạo áp lực cho bản thân.',
    'Ấn tinh vượng ({P}%) cho bạn lòng ham học hỏi, suy nghĩ sâu, nhưng đôi khi nghĩ nhiều hơn làm.'
  ];
  V.RAO_CAN = [
    ['Thiếu Điểm Tựa Bản Thân', 'Bạn dễ dao động trước ý kiến của người khác, chưa thật sự tin vào năng lực của mình. Hãy rèn luyện sự tự tin bằng những thành công nhỏ mỗi ngày.'],
    ['Khó Diễn Đạt Bản Thân', 'Bạn có nhiều ý tưởng nhưng ngại trình bày, ngại thể hiện. Năng lực thật bị che khuất vì bạn không chủ động lên tiếng.'],
    ['Rào Cản Hành Động', 'Mệnh cục {Y} vượng mà {X} (Tài tinh) {KHUYET} dễ sinh tâm lý "sợ rủi ro". Bạn ấp ủ nhiều dự án, giỏi lập kế hoạch, nhưng khi bắt tay vào làm lại hay chần chừ, khó biến ý tưởng thành kết quả và của cải cụ thể.'],
    ['Thiếu Khuôn Khổ', 'Bạn làm việc theo cảm hứng, dễ bỏ dở khi hết hứng thú. Thiếu kỷ luật là điểm nghẽn lớn nhất ngăn bạn đi đường dài.'],
    ['Thiếu Sự Kiên Nhẫn Học Hỏi', 'Bạn giỏi xoay xở thực tế nhưng ngại đầu tư dài hạn cho học tập. Không có nền tảng vững, thành quả dễ bấp bênh.']
  ];
  V.SUC_KHOE = ['gan, mật, hệ thần kinh và gân cốt', 'tim mạch, huyết áp và mắt', 'dạ dày, tỳ vị và hệ tiêu hóa',
    'phổi, đường hô hấp và da', 'thận, hệ bài tiết và xương khớp'];

  // Đại vận
  V.VAN_MUC = {
    'Rất thuận': 'Đây là một đại vận Dụng Thần cực mạnh, khi {H} khí hội tụ đúng thứ lá số cần.',
    'Thuận': 'Đây là một đại vận khá thuận lợi, mang tới những hành có ích cho mệnh cục.',
    'Bình': 'Đây là một đại vận trung tính, tốt xấu đan xen, thành bại phụ thuộc nhiều vào lựa chọn của bạn.',
    'Nghịch': 'Đây là một đại vận Kỵ Thần, nhiều thử thách hơn cơ hội.',
    'Rất nghịch': 'Đây là một đại vận Kỵ Thần cực mạnh, khi {H} khí tràn ngập.'
  };
  V.VAN_TOT = [
    'Bạn bè, đồng đội trở thành chỗ dựa, bạn tự tin dấn thân và gặt hái từ hợp tác.',
    'Tài năng được bộc lộ, ý tưởng biến thành sản phẩm, danh tiếng nhờ chuyên môn mà lên.',
    'Tiền bạc, cơ hội kinh doanh mở rộng{VO}.',
    'Sự nghiệp có bước tiến, được cấp trên ghi nhận, vị thế xã hội rõ ràng hơn.',
    'Có quý nhân nâng đỡ, học hành, bằng cấp, nhà cửa thuận lợi, tâm trí an yên.'
  ];
  V.VAN_XAU = [
    'Làm lụng vất vả nhưng tiền tài dễ bị hao hụt do Tỷ Kiếp tranh đoạt, bạn bè anh em dễ làm liên lụy.',
    'Tâm trí nhiều âu lo, nói nhiều làm ít, dễ va chạm với cấp trên vì cái tôi lớn.',
    'Tham nhiều việc, tiền vào rồi ra, áp lực tài chính đè nặng.',
    'Áp lực công việc, thị phi, sức khỏe giảm sút vì căng thẳng kéo dài.',
    'Trì trệ, ỷ lại, nhiều kế hoạch nhưng chậm triển khai, cảm giác bế tắc.'
  ];

  // Lưu niên
  V.NAM_TIEU_DE = { 'Rất thuận': 'NĂM VÀNG RỰC RỠ', 'Thuận': 'Năm Khởi Sắc', 'Bình': 'Năm Tích Lũy', 'Nghịch': 'Năm Cần Thận Trọng', 'Rất nghịch': 'NĂM THỬ THÁCH LỚN' };
  V.NAM_DINH_CAO = ['TỶ KIẾP', 'TÀI NĂNG', 'TÀI TINH', 'QUAN TINH', 'ẤN TINH'];
  V.NAM_TOT = [
    'tiếp thêm bạn bè, đồng đội, tinh thần vững vàng hơn',
    'giúp đầu óc bạn minh mẫn, sáng tạo, tìm ra giải pháp cho công việc',
    'mang tiền bạc và cơ hội tới{VO}',
    'mở ra cơ hội thể hiện năng lực với cấp trên, ổn định vị trí',
    'đem quý nhân, cơ hội học tập và sự che chở'
  ];
  V.NAM_XAU = [
    'dễ sinh cạnh tranh, hao tài vì bạn bè',
    'khiến bạn nói nhiều làm ít, dễ va chạm vì lời nói',
    'tiền vào rồi ra, dễ ham lợi trước mắt',
    'mang áp lực, thị phi, công việc căng thẳng',
    'làm bạn ỷ lại, chần chừ, suy nghĩ miên man'
  ];
  V.NAM_KET = {
    'Rất thuận': 'Mọi cơ hội dồn về, đây là năm để bạn mạnh dạn tăng tốc.',
    'Thuận': 'Nhìn chung là một năm tiến triển, nên chủ động nắm bắt.',
    'Bình': 'Năm của sự tích lũy, giữ nhịp ổn định là thắng lợi.',
    'Nghịch': 'Nên phòng thủ, tránh đầu tư mạo hiểm và giữ gìn sức khỏe.',
    'Rất nghịch': 'Hãy cẩn trọng từng bước, ưu tiên an toàn và giữ các mối quan hệ quan trọng.'
  };
  V.TRU_MIEN = { 'năm': 'gia đình gốc, ông bà cha mẹ', 'tháng': 'công việc, môi trường làm việc', 'ngày': 'bản thân và hôn nhân', 'giờ': 'con cái, kế hoạch dài hạn' };

  // Cải vận
  V.TU_KHOA = ['Học hỏi, Sáng tạo, Nhân ái', 'Nhiệt huyết, Ánh sáng, Ngoại giao', 'Kỷ luật, Tín nghĩa', 'Quyết đoán, Nguyên tắc, Chính xác', 'Linh hoạt, Trí tuệ, Kết nối'];
  V.TU_DUY = [
    [['Nguyên tắc "Học Mỗi Ngày"', 'Mộc là sự sinh trưởng. Mỗi ngày học thêm một điều mới, đọc sách, tham gia khóa học. Tri thức chính là rễ cây giúp bạn đứng vững trước giông bão.'],
     ['Nuôi Dưỡng Lòng Nhân Ái', 'Giúp đỡ người khác, làm thiện nguyện, chăm sóc cây cối. Năng lượng Mộc lớn lên từ sự cho đi.']],
    [['Nguyên tắc "Đốt Cháy Trì Hoãn"', 'Đừng chìm trong mớ lý thuyết. Hỏa đại diện cho hành động bộc phát. Khi có ý tưởng, phải dùng hành động thực thi ngay lập tức để tạo ra kết quả. Tập thói quen bộc lộ cảm xúc ra ngoài thay vì kìm nén.'],
     ['Sưởi Ấm Các Mối Quan Hệ', 'Hãy chủ động mở lòng, cười nhiều hơn, tham gia các hội nhóm sôi nổi, giao tiếp nhiệt tình. Cơ hội tài lộc và tình duyên của bạn nằm ở kỹ năng "Sưởi ấm" người khác.']],
    [['Nguyên tắc "Giữ Chữ Tín"', 'Thổ là sự vững chãi. Nói ít, làm chắc, hứa gì làm nấy. Uy tín là tài sản lớn nhất bạn có thể xây dựng.'],
     ['Xây Kỷ Luật Cá Nhân', 'Lập kế hoạch, giờ giấc cố định, theo dõi tiến độ. Khuôn khổ không trói buộc bạn mà là con đê giữ năng lượng không bị tràn đi vô ích.']],
    [['Nguyên tắc "Cắt Bỏ Dứt Khoát"', 'Kim là sự sắc bén. Học cách nói "không", loại bỏ những việc và mối quan hệ tiêu hao. Quyết định nhanh, đúng lúc.'],
     ['Rèn Sự Chính Xác', 'Làm việc với số liệu, quy trình, tiêu chuẩn. Sự chỉn chu biến bạn thành người không thể thay thế.']],
    [['Nguyên tắc "Mềm Như Nước"', 'Thủy là sự linh hoạt. Đừng cứng nhắc đối đầu, hãy tìm đường vòng, lắng nghe nhiều hơn tranh luận.'],
     ['Mở Rộng Kết Nối', 'Đi nhiều, gặp gỡ nhiều, trao đổi thông tin. Cơ hội của bạn chảy đến qua những mối quan hệ rộng khắp.']]
  ];
  V.SINH_HOAT = [
    'Người cần Mộc nên sống gần cây xanh, đi bộ trong công viên, trồng cây trong nhà. Tập các bộ môn kéo giãn, dẻo dai như: **Yoga, Pilates, Đi bộ đường dài**. Ngủ sớm để gan được nghỉ ngơi, tinh thần luôn tươi mới.',
    'Người {Y} hàn rất kỵ việc thức khuya (âm thịnh dương suy). Bắt buộc phải dậy sớm phơi nắng (tốt nhất từ 7h - 9h sáng). Tham gia các bộ môn thể thao mạnh mẽ, sinh nhiệt, đổ nhiều mồ hôi như: **Chạy bộ, Gym, Cardio, Yoga nóng**. Cơ thể càng nóng, từ trường năng lượng của bạn càng mạnh mẽ, đẩy lùi thị phi và bệnh tật.',
    'Người cần Thổ nên giữ nếp sinh hoạt đều đặn, ăn uống đúng giờ, đi chân trần trên đất, làm vườn. Các bộ môn phù hợp: **Leo núi, Thái cực quyền, Tập tạ nhẹ**. Sự ổn định trong nhịp sống chính là cách nạp Thổ hiệu quả nhất.',
    'Người cần Kim nên tập hít thở sâu, đến nơi không khí trong lành, sắp xếp không gian gọn gàng. Các bộ môn phù hợp: **Bơi lội, Võ thuật, Bắn cung**. Kỷ luật trong luyện tập giúp tinh thần bạn sắc bén.',
    'Người cần Thủy nên uống đủ nước, nghỉ ngơi hợp lý, tránh nóng giận. Các bộ môn phù hợp: **Bơi lội, Thiền, Yoga nhẹ nhàng**. Sự tĩnh lặng giúp bạn hạ nhiệt và nhìn mọi việc sáng suốt hơn.'
  ];

  // Tổng kết
  // hành mạnh nhất có thể là Kỵ thần, nên dùng hình ảnh trung tính (không khen, không chê)
  V.BUC_TRANH = ['rừng cây rậm rạp', 'rực lửa', 'đất đai dày dặn', 'kim khí sắc lạnh', 'ngập tràn nước'];
  V.MAM = ['một mầm cây tràn đầy trí tuệ', 'một đốm lửa nhiệt huyết', 'một nền đất vững chãi', 'một khối kim loại quý', 'một mạch nước ngầm tinh khiết'];
  V.KIM_CHI_NAM = ['Học không ngừng, Vươn như cây', 'Hành động phá tan Băng giá, Nhiệt huyết xua đuổi Cô đơn', 'Giữ chữ Tín, Xây nền Móng',
    'Quyết đoán sắc bén, Kỷ luật thép', 'Mềm như nước, Bền như dòng chảy'];
  V.KIM_CHI_NAM_HOA = 'Nhiệt huyết dẫn đường, Hành động tạo kết quả';
  V.LOI_KHUYEN = ['kiên trì học hỏi, nuôi dưỡng lòng nhân ái', 'mạnh dạn bộc lộ năng lực, sưởi ấm những người xung quanh và sẵn sàng thay đổi',
    'giữ chữ tín, xây dựng kỷ luật và nền móng vững chắc', 'quyết đoán, chỉn chu và dám cắt bỏ những gì tiêu hao',
    'linh hoạt, mở rộng kết nối và giữ tâm bình thản'];})(window.BT);
