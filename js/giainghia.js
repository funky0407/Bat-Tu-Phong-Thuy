// Giải nghĩa ngắn, hiện khi bấm vào một thuật ngữ. Nội dung mang tính tham khảo.
(function (BT) {
  BT.GIAI_NGHIA = {
    // Thập thần
    'Tỷ Kiên': 'Cùng hành, cùng âm dương với nhật chủ. Đại diện anh em, bạn bè, đồng nghiệp ngang hàng; tính tự lập, ý chí riêng. Nhiều quá dễ cạnh tranh, chia tài.',
    'Kiếp Tài': 'Cùng hành, khác âm dương với nhật chủ. Năng lực hành động, dám làm, giỏi giao tế; nhưng dễ hao tài, tranh giành, liều lĩnh.',
    'Thực Thần': 'Hành do nhật chủ sinh ra, cùng âm dương. Sự hưởng thụ, tài nghệ, ăn nói ôn hòa, phúc lộc. Chế được Thất Sát.',
    'Thương Quan': 'Hành do nhật chủ sinh ra, khác âm dương. Tài năng nổi bật, sáng tạo, thích thể hiện; dễ phá lệ, xung khắc với cấp trên (Chính Quan).',
    'Thiên Tài': 'Hành do nhật chủ khắc, cùng âm dương. Tiền bạc bất ngờ, kinh doanh, đầu tư, hào phóng. Chỉ người cha (cả nam lẫn nữ); với nam còn chỉ người tình.',
    'Chính Tài': 'Hành do nhật chủ khắc, khác âm dương. Thu nhập ổn định từ công sức, tính cần kiệm, thực tế; với nam chỉ vợ.',
    'Thất Sát': 'Hành khắc nhật chủ, cùng âm dương. Áp lực, thử thách, quyền uy, quyết đoán; cần Thực Thần chế hoặc Ấn hóa thì thành uy quyền.',
    'Chính Quan': 'Hành khắc nhật chủ, khác âm dương. Kỷ luật, danh dự, chức vị, trách nhiệm; với nữ chỉ chồng.',
    'Thiên Ấn': 'Hành sinh nhật chủ, cùng âm dương (còn gọi Kiêu thần). Trực giác, học thuật khác thường, huyền học; nhiều quá dễ cô độc, đoạt Thực.',
    'Chính Ấn': 'Hành sinh nhật chủ, khác âm dương. Học vấn, bằng cấp, sự che chở, mẹ, quý nhân nâng đỡ.',
    'Nhật chủ': 'Thiên can của trụ ngày, đại diện cho chính bạn. Mọi thập thần đều được xét theo quan hệ với can này.',
    // Trường sinh
    'Trường Sinh': 'Giai đoạn mới sinh: sức sống bắt đầu, được nuôi dưỡng, thuận lợi khởi đầu.',
    'Mộc Dục': 'Giai đoạn tắm gội: non nớt, dễ dao động, liên quan sắc đẹp và tình cảm.',
    'Quan Đới': 'Giai đoạn đội mũ, mặc áo: trưởng thành dần, có chí tiến thủ.',
    'Lâm Quan': 'Giai đoạn ra làm quan: sung sức, tự lập, có địa vị.',
    'Đế Vượng': 'Giai đoạn cực thịnh: năng lượng mạnh nhất; thịnh quá thì sắp suy.',
    'Suy': 'Giai đoạn bắt đầu yếu: chín chắn, bảo thủ, nên giữ hơn là tiến.',
    'Bệnh': 'Giai đoạn bệnh: sức lực giảm, cần nghỉ ngơi và hỗ trợ.',
    'Tử': 'Giai đoạn chết: năng lượng gần cạn, dừng lại để chuyển hóa.',
    'Mộ': 'Giai đoạn nhập kho: thu tàng, tích trữ; cũng là kho của hành đó.',
    'Tuyệt': 'Giai đoạn đứt đoạn: khí đã hết, chuẩn bị cho chu kỳ mới; dễ biến động.',
    'Thai': 'Giai đoạn thụ thai: mầm mống mới hình thành, còn mong manh.',
    'Dưỡng': 'Giai đoạn nuôi dưỡng trong bụng mẹ: tích lũy để chuẩn bị ra đời.',
    // Thần sát
    'Thiên Ất Quý Nhân': 'Sao quý nhân hàng đầu: gặp người giúp đỡ, gặp dữ hóa lành.',
    'Thái Cực Quý Nhân': 'Quý nhân thiên về trí tuệ, tôn giáo, triết học, huyền học.',
    'Văn Xương': 'Thông minh, học giỏi, có văn tài, thuận lợi thi cử.',
    'Lộc Thần': 'Lộc của nhật can: thu nhập, cơm áo đầy đủ, có chỗ dựa.',
    'Kim Dư': 'Xe vàng: phúc lộc, hôn nhân thuận, được người khác giới giúp.',
    'Dương Nhận': 'Còn gọi Kình Dương, là đế vượng của can ngày (can âm đếm nghịch). Cương quyết, mạnh mẽ nhưng nóng nảy, dễ thương tật, tranh chấp, hao tài. Thân nhược gặp sao này lại được giúp thân; thân vượng gặp thì xấu thêm (sách Dự đoán theo Tứ Trụ tr.315–316).',
    'Phúc Tinh Quý Nhân': 'Tra theo can năm hoặc can ngày. Chủ phúc lộc dồi dào, cuộc sống bình an (sách Dự đoán theo Tứ Trụ tr.300).',
    'Quốc Ấn': 'Tra theo can năm hoặc can ngày. Người thành thực, đáng tin, thanh liêm, có nề nếp, có thể nắm quyền quản lý (sách tr.302).',
    'Thiên Y': 'Chi đứng liền trước chi tháng. Vượng thì có năng khiếu y thuật, tâm lý, hoặc trong họ có người làm thuốc; không vượng thì sức khỏe yếu (sách tr.142, 307–308).',
    'Khôi Canh': 'Trụ ngày là Nhâm Thìn, Canh Tuất, Canh Thìn hoặc Mậu Tuất. Thông tuệ, quyết đoán, nghiêm khắc. Tốt khi tứ trụ không có tài, quan, hình xung; gặp tài quan hay hình xung phá hại thì trắc trở, hôn nhân khó thuận (sách tr.301).',
    'Kim Thần': 'Trụ ngày hoặc trụ giờ là Ất Sửu, Kỷ Tỵ, Quý Dậu. Thông minh, hiếu học, tính gấp và mạnh mẽ. Cần Hỏa luyện: gặp Hỏa thì phát, gặp Thủy nhiều thì kém (sách tr.307).',
    'Thiên Xá': 'Ngày Mậu Dần sinh mùa xuân, Giáp Ngọ mùa hạ, Mậu Thân mùa thu, Giáp Tý mùa đông. Sao cứu giải, giúp hóa hung thành cát (sách tr.311).',
    'Thiên La Địa Võng': 'Cặp chi Thìn–Tỵ hoặc Tuất–Hợi, lấy chi năm hoặc chi ngày làm chủ. Chủ vướng thị phi pháp lý, tai nạn, bệnh tật; nam kỵ Tuất–Hợi, nữ kỵ Thìn–Tỵ; đi cùng tam hình thì càng phải giữ mình (sách tr.144–145, 313–314).',
    'Cấu Giảo': 'Tính từ chi năm, ngôi thứ ba trước và sau. Chủ cãi cọ, kiện tụng, tai nạn; năm hay vận gặp sao này nên cẩn trọng (sách tr.318).',
    'Đại Hao': 'Còn gọi Nguyên Thần, tính từ ngôi xung của chi năm. Chủ trắc trở, hao tổn, làm cái hại nặng thêm; vận gặp Đại Hao thì mười năm khó yên (sách tr.320–321).',
    'Thập Ác Đại Bại': 'Trụ ngày là một trong mười ngày lộc rơi vào không vong (Giáp Thìn, Ất Tỵ, Bính Thân, Đinh Hợi, Mậu Tuất, Kỷ Sửu, Canh Thìn, Tân Tỵ, Nhâm Thân, Quý Hợi). Chủ hao tán, khó giữ của; gặp Thiên Đức, Nguyệt Đức hoặc cát thần thì được giải (sách tr.323–324).',
    'Âm Dương Sai Thố': 'Sao xét ở trụ ngày, liên quan cung phu thê: chủ hôn nhân dễ lệch nhịp, không hòa thuận với gia đình bên vợ hoặc bên chồng (sách tr.326).',
    'Cách cục': 'Khuôn mẫu chính của lá số, lấy chi tháng làm gốc: can tàng trong chi tháng thấu lên thiên can thì lấy thập thần của can đó làm cách, không thấu thì lấy bản khí; chi tháng là lộc của nhật can thì gọi Kiến Lộc, là đế vượng thì gọi Kình Dương. Có 10 chính cách; cách đặc biệt (hóa khí, chuyên vượng, tòng) cần luận riêng (sách Dự đoán theo Tứ Trụ tr.356–376).',
    'Đào Hoa': 'Còn gọi Hàm Trì: duyên dáng, có sức hút, nhiều quan hệ tình cảm.',
    'Dịch Mã': 'Di chuyển, thay đổi chỗ ở hoặc công việc, đi xa, xuất ngoại.',
    'Hoa Cái': 'Thông minh, có khiếu nghệ thuật, tôn giáo; dễ cô độc, sống nội tâm.',
    'Tướng Tinh': 'Tố chất lãnh đạo, có uy, được người khác phục.',
    'Kiếp Sát': 'Dễ gặp mất mát, tai bất ngờ; nếu cát thì là người mưu lược, nhanh nhạy.',
    'Tai Sát': 'Còn gọi Bạch Hổ sát: đề phòng tai nạn, kiện tụng, bệnh tật.',
    'Vong Thần': 'Tâm tư sâu kín, mưu tính; xấu thì dễ thị phi, hao tổn.',
    'Cô Thần': 'Cô độc, thích tự lập; ảnh hưởng chuyện hôn nhân (thường xét cho nam).',
    'Quả Tú': 'Quạnh quẽ, ít nương tựa; ảnh hưởng chuyện hôn nhân (thường xét cho nữ).',
    'Hồng Loan': 'Sao hỷ sự: hôn nhân, tình duyên, tin vui.',
    'Thiên Hỷ': 'Sao vui mừng: tin tốt, cưới hỏi, sinh con, thăng tiến.',
    'Thiên Đức': 'Phúc đức trời ban: giảm nhẹ tai ương, gặp hung hóa cát.',
    'Nguyệt Đức': 'Phúc đức theo tháng: hiền lành, được che chở, giải hung.',
    'Không Vong': 'Trụ rơi vào tuần trống: điều tốt giảm lực, điều xấu cũng giảm; dễ hụt hẫng.',
    // 12 Tuế Quân
    'Thái Tuế': 'Năm bản mệnh trùng chi: nhiều biến động, nên thận trọng, giữ ổn định.',
    'Thái Dương': 'Sao sáng: được nâng đỡ, nhất là từ nam giới, cấp trên.',
    'Tang Môn': 'Đề phòng chuyện buồn, tang chế, sức khỏe người thân.',
    'Thái Âm': 'Sao lành: được nữ giới giúp, tâm trạng an hòa.',
    'Quan Phù': 'Đề phòng giấy tờ, pháp lý, kiện tụng.',
    'Tử Phù': 'Dễ mệt mỏi, buồn phiền, sức khỏe giảm.',
    'Tuế Phá': 'Năm xung với chi này: dễ hao tài, thay đổi đột ngột.',
    'Long Đức': 'Sao cát: quý nhân, mọi việc hanh thông.',
    'Bạch Hổ': 'Đề phòng tai nạn, máu huyết, tranh chấp.',
    'Phúc Đức': 'Sao cát: phúc lộc, bình an, có tin vui.',
    'Điếu Khách': 'Đề phòng tin buồn, đi đường, lời ra tiếng vào.',
    'Bệnh Phù': 'Đề phòng ốm vặt, sức khỏe suy giảm.',
    // Dụng thần
    'Dụng thần': 'Hành có ích nhất cho lá số, giúp cân bằng ngũ hành. Vận, năm mang hành này thường thuận lợi.',
    'Hỷ thần': 'Hành hỗ trợ Dụng thần, cùng phe có lợi cho lá số. Gặp hành này cũng là điều tốt.',
    'Kỵ thần': 'Hành mạnh nhất trong phe bất lợi, làm lá số mất cân bằng nhiều nhất. Vận, năm mang hành này dễ trắc trở.',
    'Cừu thần': 'Hành bất lợi thứ hai (cùng phe với Kỵ thần). Mức xấu nhẹ hơn Kỵ thần.',
    'Nhàn thần': 'Hành trung gian, ảnh hưởng không rõ rệt, tốt xấu tùy tổ hợp.',
    'Điều hầu': 'Cân bằng khí hậu của lá số: sinh mùa đông cần Hỏa sưởi ấm, sinh mùa hạ cần Thủy làm mát. Xét song song với Dụng thần phù ức; khi hành điều hầu đã đủ thì chỉ là ghi chú, khi thiếu thì cần ưu tiên bổ sung.',
    'Thông căn': 'Thiên can có gốc khi địa chi trong tứ trụ tàng can cùng hành. Gốc ở khí chính vững nhất, khí giữa và khí dư yếu dần; can vô căn (hư phù) thì lực yếu, dễ bị khắc. App tính can có gốc khí chính đủ 1 phần, khí giữa 0.8, khí dư 0.7, vô căn 0.5.',
    'Tam đắc': 'Ba tiêu chí cổ điển đánh giá nhật chủ: đắc lệnh (khí chính chi tháng là Tỷ Kiếp hoặc Ấn), đắc địa (nhật chủ có gốc ở địa chi), đắc thế (có từ hai can Tỷ Kiếp, Ấn khác). Đắc hai trong ba thì thiên vượng, đắc một hoặc không thì thiên nhược.',
    'Tòng cách': 'Lá số đặc biệt khi nhật chủ quá yếu (vô căn, không có Ấn Tỷ đỡ) hoặc quá mạnh (chuyên vượng). Khi đó không nâng đỡ hay tiết chế nữa mà thuận theo thế mạnh nhất, nên Dụng thần ngược với phép Phù ức. Chân tòng hiếm gặp; giả tòng còn tùy vận, cần người luận xét kỹ.',
    // Ngũ hành theo mùa
    'Vượng': 'Hành cùng mùa sinh: mạnh nhất.',
    'Tướng': 'Hành được mùa sinh ra: mạnh thứ hai.',
    'Hưu': 'Hành sinh ra mùa: đã cho đi, trạng thái nghỉ.',
    'Tù': 'Hành khắc mùa: bị kìm lại.',
    'Tử': 'Hành bị mùa khắc: yếu nhất. Ở bảng trường sinh, Tử là giai đoạn năng lượng cạn.'
  };

  // Ứng dụng của từng hành: màu, hướng, số (Hà Đồ), ngành nghề
  BT.UNG_DUNG_HANH = [
    { mau: 'Xanh lá, xanh ngọc', huong: 'Đông, Đông Nam', so: '3, 8', nghe: 'Giáo dục, thiết kế, xuất bản, gỗ, nông lâm, dược thảo' },
    { mau: 'Đỏ, hồng, cam, tím', huong: 'Nam', so: '2, 7', nghe: 'Năng lượng, điện tử, truyền thông, ẩm thực, làm đẹp, giải trí' },
    { mau: 'Vàng, nâu đất', huong: 'Trung tâm, Đông Bắc, Tây Nam', so: '5, 10', nghe: 'Bất động sản, xây dựng, nông sản, bảo hiểm, quản lý kho' },
    { mau: 'Trắng, xám, bạc, ánh kim', huong: 'Tây, Tây Bắc', so: '4, 9', nghe: 'Tài chính, ngân hàng, cơ khí, luật, kỹ thuật, trang sức' },
    { mau: 'Đen, xanh dương, xanh than', huong: 'Bắc', so: '1, 6', nghe: 'Thương mại, vận tải, du lịch, logistics, tư vấn, thủy sản' }
  ];

  BT.GIAI_NGHIA_QH = {
    hop: 'Hợp: các chữ gắn kết, hỗ trợ nhau; có thể hóa thành hành mới. Thường là dấu hiệu hòa hợp, hợp tác.',
    xung: 'Xung: hai chữ đối đầu, gây biến động, thay đổi. Xung trụ nào thì lĩnh vực của trụ đó dễ xáo trộn (năm: gia đình gốc, tháng: công việc/cha mẹ, ngày: bản thân/hôn nhân, giờ: con cái/hậu vận).',
    hinh: 'Hình: tổn thương, rắc rối, thị phi hoặc kiện tụng.',
    hai: 'Hại: ngấm ngầm cản trở, tiểu nhân, hiểu lầm.',
    pha: 'Phá: làm hỏng, đổ vỡ nhẹ, kế hoạch dở dang.'
  };
})(window.BT);
