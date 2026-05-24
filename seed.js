// seed.js
// Run: node seed.js
// Requires: npm install @prisma/client bcryptjs

require("dotenv").config();
const { PrismaClient } = require("./generated/prisma");
const bcrypt = require("bcrypt");

// ─── Khởi tạo Prisma ─────────────────────────────────────────────────────────
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const prisma = new PrismaClient({ adapter });

// const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const hash = (pw) => bcrypt.hashSync(pw, 10);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickMany = (arr, n) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Sinh ngày random trong khoảng
const randDate = (startDaysAgo, endDaysAgo) => {
  const now = Date.now();
  const msPerDay = 86_400_000;
  const from = now - startDaysAgo * msPerDay;
  const to = now - endDaysAgo * msPerDay;
  return new Date(from + Math.random() * (to - from));
};

// Deadline: quá khứ, gần, xa
const pastDeadline = () => randDate(180, 30);
const nearDeadline = () => randDate(30, 0);
const futureDeadline = () =>
  new Date(Date.now() + randInt(30, 180) * 86_400_000);

// ─── 20 COMPANIES ─────────────────────────────────────────────────────────────
const COMPANIES_DATA = [
  {
    name: "FPT Software",
    email: "contact@fpt-software.com",
    phone: "02873006600",
    description: `FPT Software là công ty thành viên chủ lực của Tập đoàn FPT, hoạt động trong lĩnh vực phát triển phần mềm và dịch vụ công nghệ thông tin. Được thành lập năm 1999, doanh nghiệp đã phát triển thành một trong những công ty công nghệ lớn nhất Việt Nam với mạng lưới văn phòng trải rộng tại nhiều quốc gia như Nhật Bản, Mỹ, Hàn Quốc, Singapore và châu Âu. FPT Software cung cấp đa dạng dịch vụ như phát triển phần mềm, chuyển đổi số, trí tuệ nhân tạo, điện toán đám mây, dữ liệu lớn và tự động hóa quy trình doanh nghiệp.

Công ty nổi bật nhờ khả năng triển khai các dự án công nghệ quy mô lớn cho nhiều tập đoàn quốc tế trong các lĩnh vực tài chính, sản xuất, ô tô, y tế, bán lẻ và viễn thông. FPT Software đầu tư mạnh vào nghiên cứu công nghệ mới như AI, Blockchain, IoT và Cloud nhằm đáp ứng nhu cầu chuyển đổi số toàn cầu. Ngoài ra, doanh nghiệp còn xây dựng hệ sinh thái đào tạo và phát triển nhân lực công nghệ thông qua hợp tác với các trường đại học và tổ chức quốc tế.

Môi trường làm việc tại FPT Software được đánh giá năng động, sáng tạo và có cơ hội phát triển nghề nghiệp rộng mở. Công ty thường xuyên tuyển dụng kỹ sư phần mềm, chuyên gia công nghệ và sinh viên thực tập với nhiều chương trình đào tạo chuyên môn bài bản. Với tốc độ tăng trưởng mạnh, định hướng toàn cầu hóa và nền tảng công nghệ vững chắc, FPT Software hiện là một trong những doanh nghiệp công nghệ có sức ảnh hưởng lớn nhất Việt Nam.`,
    address: "Lô E2a-7, Đường D1, Khu Công nghệ cao, Quận 9, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps?q=FPT%20Software%20L%C3%B4%20E2a-7%20%C4%90%C6%B0%E1%BB%9Dng%20D1%2C%20Khu%20C%C3%B4ng%20ngh%E1%BB%87%20cao%2C%20Qu%E1%BA%ADn%209%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
    logoUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiP5OOYYQ-OhLP2M0tapnypGkRBk9la5AmJg&s",
    coverImageUrl:
      "https://chodat.com.vn/upload/images/Tin%20Tuc/vingroup-mai-mai-tinh-than-khoi-nghiep-va-hanh-trinh-28-nam.jpeg",
    isVerified: true,
    socialLinks: {
      website: "https://fpt-software.com",
      linkedin: "https://linkedin.com/company/fpt-software",
    },
  },
  {
    name: "Vietcombank",
    email: "hr@vietcombank.com.vn",
    phone: "02438343137",
    description: `Vietcombank là một trong những ngân hàng thương mại cổ phần lớn và uy tín nhất Việt Nam, được thành lập từ năm 1963 với tiền thân là Ngân hàng Ngoại thương Việt Nam. Trong nhiều năm hoạt động, Vietcombank luôn giữ vai trò tiên phong trong lĩnh vực tài chính – ngân hàng, đặc biệt ở mảng thanh toán quốc tế, ngoại hối và dịch vụ ngân hàng hiện đại. Ngân hàng hiện sở hữu mạng lưới chi nhánh rộng khắp cả nước cùng hệ thống đối tác quốc tế trải dài trên nhiều quốc gia và vùng lãnh thổ.

Vietcombank cung cấp đa dạng sản phẩm và dịch vụ tài chính dành cho khách hàng cá nhân, doanh nghiệp và tổ chức tài chính như huy động vốn, cho vay, thẻ tín dụng, ngân hàng số, bảo hiểm, đầu tư và quản lý tài sản. Trong lĩnh vực chuyển đổi số, ngân hàng liên tục đầu tư mạnh vào nền tảng ngân hàng điện tử, mobile banking và các giải pháp thanh toán không tiền mặt nhằm nâng cao trải nghiệm khách hàng.

Không chỉ nổi bật về hiệu quả kinh doanh, Vietcombank còn được đánh giá cao về năng lực quản trị rủi ro, chất lượng tài sản và tính ổn định tài chính. Đây cũng là ngân hàng thường xuyên nằm trong nhóm dẫn đầu về lợi nhuận, vốn hóa thị trường và uy tín thương hiệu tại Việt Nam. Với môi trường làm việc chuyên nghiệp, chính sách đào tạo bài bản và định hướng phát triển bền vững, Vietcombank luôn là một trong những doanh nghiệp được nhiều sinh viên và người lao động mong muốn gia nhập trong lĩnh vực tài chính – ngân hàng.`,
    address: "198 Trần Quang Khải, Hoàn Kiếm, Hà Nội",
    mapUrl:
      "https://www.google.com/maps?q=Vietcombank%20198%20Tr%E1%BA%A7n%20Quang%20Kh%E1%BA%A3i%2C%20Ho%C3%A0n%20Ki%E1%BA%BFm%2C%20H%C3%A0%20N%E1%BB%99i&output=embed",
    logoUrl:
      "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-Vietcombank.png",
    coverImageUrl:
      "https://upload.wikimedia.org/wikipedia/vi/thumb/9/9d/Vietcombank_Logo.svg/3840px-Vietcombank_Logo.svg.png",
    isVerified: true,
    socialLinks: { website: "https://vietcombank.com.vn" },
  },
  {
    name: "Shopee Việt Nam",
    email: "careers@shopee.com",
    phone: "02839007788",
    description: `Shopee Việt Nam là một trong những nền tảng thương mại điện tử lớn nhất tại Việt Nam, thuộc tập đoàn công nghệ Sea Limited của Singapore. Ra mắt tại Việt Nam vào năm 2016, Shopee nhanh chóng mở rộng thị phần nhờ mô hình thương mại điện tử tích hợp giữa người bán, người mua và hệ sinh thái logistics – thanh toán trực tuyến hiện đại. Nền tảng này cung cấp đa dạng ngành hàng như điện tử, thời trang, mỹ phẩm, thực phẩm, đồ gia dụng và hàng tiêu dùng.

Shopee nổi bật với chiến lược tập trung mạnh vào trải nghiệm người dùng, các chiến dịch marketing quy mô lớn và hệ thống khuyến mãi thường xuyên. Công ty đầu tư mạnh vào công nghệ AI, dữ liệu lớn và hệ thống logistics nhằm tối ưu quá trình vận hành, giao hàng và cá nhân hóa trải nghiệm mua sắm. Bên cạnh đó, ShopeePay và hệ thống vận chuyển nội bộ giúp nền tảng tăng khả năng cạnh tranh trong thị trường thương mại điện tử đang phát triển mạnh tại Việt Nam.

Không chỉ hỗ trợ doanh nghiệp lớn, Shopee còn tạo điều kiện cho hàng triệu hộ kinh doanh nhỏ và cá nhân tiếp cận khách hàng trên toàn quốc thông qua nền tảng số. Với tốc độ tăng trưởng nhanh, văn hóa doanh nghiệp năng động và môi trường công nghệ hiện đại, Shopee Việt Nam hiện là một trong những công ty công nghệ – thương mại điện tử thu hút nhiều nhân sự trẻ trong lĩnh vực kinh doanh, marketing và phát triển sản phẩm.`,
    address: "Tầng 17, WeWork, 364 Cộng Hòa, Tân Bình, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps?q=Shopee%20Vi%E1%BB%87t%20Nam%20364%20C%E1%BB%99ng%20H%C3%B2a%2C%20T%C3%A2n%20B%C3%ACnh%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
    logoUrl:
      "https://static.vecteezy.com/system/resources/previews/053/407/516/non_2x/shopee-logo-shopee-icon-transparent-social-media-icons-free-png.png",
    coverImageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/1280px-Shopee.svg.png",
    isVerified: true,
    socialLinks: {
      website: "https://careers.shopee.vn",
      facebook: "https://facebook.com/ShopeeCareersVN",
    },
  },
  {
    name: "Techcombank",
    email: "tuyen.dung@techcombank.com.vn",
    phone: "02439447699",
    description: `Techcombank là một trong những ngân hàng thương mại cổ phần tư nhân lớn và phát triển nhanh tại Việt Nam. Được thành lập vào năm 1993, ngân hàng hiện cung cấp đa dạng sản phẩm và dịch vụ tài chính cho khách hàng cá nhân, doanh nghiệp và nhà đầu tư như tín dụng, tiết kiệm, thẻ thanh toán, ngân hàng số, quản lý tài sản và bảo hiểm.

Techcombank nổi bật với chiến lược chuyển đổi số mạnh mẽ và định hướng lấy khách hàng làm trung tâm. Ngân hàng đầu tư lớn vào công nghệ, dữ liệu và AI nhằm tối ưu hóa trải nghiệm người dùng, tự động hóa quy trình vận hành và phát triển các giải pháp tài chính hiện đại. Ngoài ra, Techcombank còn hợp tác với nhiều tập đoàn lớn trong các lĩnh vực bất động sản, hàng không và tiêu dùng nhằm mở rộng hệ sinh thái dịch vụ tài chính.

Trong nhiều năm liên tiếp, Techcombank luôn nằm trong nhóm ngân hàng có lợi nhuận cao và hiệu quả hoạt động tốt tại Việt Nam. Ngân hàng cũng được đánh giá cao về môi trường làm việc hiện đại, chế độ đãi ngộ cạnh tranh và chương trình phát triển nhân tài chuyên nghiệp. Với chiến lược đổi mới liên tục và nền tảng tài chính mạnh, Techcombank đang giữ vai trò quan trọng trong quá trình hiện đại hóa ngành ngân hàng Việt Nam.`,
    address: "191 Bà Triệu, Hai Bà Trưng, Hà Nội",
    mapUrl:
      "https://www.google.com/maps?q=Techcombank%20191%20B%C3%A0%20Tri%E1%BB%87u%2C%20Hai%20B%C3%A0%20Tr%C6%B0ng%2C%20H%C3%A0%20N%E1%BB%99i&output=embed",
    logoUrl:
      "https://inkythuatso.com/uploads/thumbnails/800/2021/09/logo-techcombank-inkythuatso-10-15-17-50.jpg",
    coverImageUrl:
      "https://nhaquanly.vn/uploads/images/2025/04/18/ae-soobin-16-9-under-2mb-1744976979.jpg",
    isVerified: true,
    socialLinks: { website: "https://techcombank.com" },
  },
  {
    name: "Vingroup",
    email: "careers@vingroup.net",
    phone: "02439740740",
    description: `Vingroup là một trong những tập đoàn kinh tế tư nhân lớn nhất Việt Nam, hoạt động đa ngành trong các lĩnh vực bất động sản, công nghệ, công nghiệp, giáo dục, y tế, du lịch và bán lẻ. Được thành lập bởi tỷ phú Phạm Nhật Vượng, Vingroup đã xây dựng hệ sinh thái quy mô lớn với nhiều thương hiệu nổi bật như Vinhomes, VinFast, Vinmec, Vinschool và Vinpearl.

Tập đoàn nổi bật nhờ chiến lược phát triển mạnh mẽ, khả năng đầu tư quy mô lớn và định hướng ứng dụng công nghệ vào nhiều lĩnh vực kinh doanh. Trong đó, VinFast là dự án công nghiệp trọng điểm với tham vọng đưa thương hiệu ô tô điện Việt Nam ra thị trường quốc tế. Ngoài ra, Vingroup còn chú trọng phát triển các lĩnh vực giáo dục, y tế và đô thị thông minh nhằm nâng cao chất lượng sống cho người dân.

Không chỉ có ảnh hưởng lớn về kinh tế, Vingroup còn đóng vai trò tích cực trong các hoạt động xã hội và đổi mới sáng tạo tại Việt Nam. Với quy mô lớn, môi trường làm việc hiện đại và tốc độ phát triển nhanh, Vingroup hiện là một trong những tập đoàn thu hút nguồn nhân lực chất lượng cao trong nhiều lĩnh vực khác nhau.`,
    address: "Số 7 Bảng Lảng, Khu Đô thị Vinhomes Riverside, Long Biên, Hà Nội",
    mapUrl:
      "https://www.google.com/maps?q=Vingroup%20S%E1%BB%91%207%20B%E1%BA%A3ng%20L%E1%BA%A3ng%2C%20Vinhomes%20Riverside%2C%20Long%20Bi%C3%AAn%2C%20H%C3%A0%20N%E1%BB%99i&output=embed",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/vi/thumb/9/98/Vingroup_logo.svg/1280px-Vingroup_logo.svg.png",
    coverImageUrl:
      "https://chodat.com.vn/upload/images/Tin%20Tuc/vingroup-mai-mai-tinh-than-khoi-nghiep-va-hanh-trinh-28-nam.jpeg",
    isVerified: true,
    socialLinks: {
      website: "https://vingroup.net",
      linkedin: "https://linkedin.com/company/vingroup",
    },
  },
  {
    name: "Masan Group",
    email: "hr@masan.com.vn",
    phone: "02838321888",
    description: `Masan Group là một trong những tập đoàn kinh tế tư nhân lớn và có sức ảnh hưởng mạnh tại Việt Nam, hoạt động đa ngành với trọng tâm ở lĩnh vực hàng tiêu dùng nhanh, bán lẻ, thực phẩm, đồ uống và khai khoáng. Được thành lập vào năm 1996, Masan đã xây dựng hệ sinh thái tiêu dùng quy mô lớn với mục tiêu phục vụ nhu cầu thiết yếu hằng ngày của người Việt. Tập đoàn sở hữu nhiều thương hiệu quen thuộc như Chin-su, Nam Ngư, Omachi, Kokomi, Wake-Up 247, Vinacafé Biên Hòa cùng hệ thống bán lẻ WinMart và WinMart+ trải rộng trên toàn quốc.

Masan nổi bật với chiến lược “Point of Life” – xây dựng nền tảng tiêu dùng tích hợp từ sản xuất đến phân phối nhằm tối ưu trải nghiệm khách hàng. Trong lĩnh vực bán lẻ, tập đoàn đã đầu tư mạnh vào chuyển đổi số, logistics và mô hình bán lẻ hiện đại nhằm kết nối người tiêu dùng với hệ sinh thái sản phẩm và dịch vụ đa dạng. Bên cạnh đó, Masan High-Tech Materials còn là một trong những doanh nghiệp khai khoáng công nghệ cao lớn trong khu vực, tập trung vào vật liệu công nghiệp chiến lược.

Không chỉ phát triển mạnh về kinh doanh, Masan còn chú trọng đổi mới sáng tạo, quản trị doanh nghiệp hiện đại và xây dựng nguồn nhân lực chất lượng cao. Tập đoàn thường xuyên hợp tác với các đối tác quốc tế lớn để mở rộng năng lực sản xuất, công nghệ và thị trường. Với định hướng trở thành nền tảng tiêu dùng – bán lẻ hàng đầu Việt Nam, Masan đang đóng vai trò quan trọng trong quá trình hiện đại hóa thị trường tiêu dùng nội địa và nâng cao chất lượng cuộc sống của người dân.`,
    address:
      "Tầng 12, Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Quận 1, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps?q=Masan%20Group%20MPlaza%20Saigon%2039%20L%C3%AA%20Du%E1%BA%A9n%2C%20Qu%E1%BA%ADn%201%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
    logoUrl:
      "https://i0.wp.com/www.senviet.art/wp-content/uploads/edd/2019/09/massan.png?fit=945%2C709&ssl=1",
    coverImageUrl:
      "https://timve365.vn/uploads/f_65780b000d051505b67610fe/banner-1900-x-650-px-2024726825.jpg",
    isVerified: true,
    socialLinks: { website: "https://masangroup.com" },
  },
  {
    name: "KPMG Việt Nam",
    email: "vn-fm-recruitment@kpmg.com.vn",
    phone: "02438310100",
    description: `KPMG Việt Nam là thành viên của mạng lưới KPMG toàn cầu – một trong bốn công ty kiểm toán và tư vấn lớn nhất thế giới. Công ty hoạt động tại Việt Nam trong các lĩnh vực trọng điểm như kiểm toán, tư vấn thuế, tư vấn tài chính, quản trị rủi ro, chuyển đổi số và tư vấn doanh nghiệp. Với nhiều năm kinh nghiệm trên thị trường, KPMG Việt Nam đã xây dựng được uy tín mạnh mẽ trong cộng đồng doanh nghiệp trong và ngoài nước.

KPMG nổi bật nhờ đội ngũ chuyên gia có chuyên môn cao cùng khả năng cung cấp các giải pháp tư vấn toàn diện cho nhiều ngành nghề như ngân hàng, bất động sản, sản xuất, công nghệ và tiêu dùng. Công ty hỗ trợ doanh nghiệp trong việc tối ưu vận hành, nâng cao hiệu quả tài chính, tuân thủ quy định pháp lý và triển khai chiến lược phát triển dài hạn. Ngoài ra, KPMG cũng đầu tư mạnh vào các giải pháp công nghệ, phân tích dữ liệu và chuyển đổi số nhằm đáp ứng xu hướng phát triển của thị trường hiện đại.

Môi trường làm việc tại KPMG được đánh giá chuyên nghiệp, quốc tế và có tính học hỏi cao. Công ty thường xuyên tổ chức các chương trình đào tạo kỹ năng chuyên môn, chương trình thực tập và phát triển nhân tài trẻ. Với mạng lưới toàn cầu, quy trình vận hành chuẩn quốc tế và uy tín thương hiệu lớn, KPMG Việt Nam là điểm đến hấp dẫn đối với các ứng viên theo đuổi lĩnh vực kiểm toán, tài chính và tư vấn doanh nghiệp.`,
    address:
      "Tầng 46, Keangnam Hanoi Landmark Tower, Phạm Hùng, Nam Từ Liêm, Hà Nội",
    mapUrl:
      "https://www.google.com/maps?q=KPMG%20Vi%E1%BB%87t%20Nam%20Keangnam%20Hanoi%20Landmark%20Tower%20Ph%E1%BA%A1m%20H%C3%B9ng%2C%20Nam%20T%E1%BB%AB%20Li%C3%AAm%2C%20H%C3%A0%20N%E1%BB%99i&output=embed",
    logoUrl:
      "https://nextgeneration.vc/wp-content/uploads/2018/07/kpmg-logo.png",
    coverImageUrl:
      "https://assets.kpmg.com/is/image/kpmg/purple-and-blue-colour-brush-stroke-banner:cq5dam.web.2000.500",
    isVerified: true,
    socialLinks: {
      website: "https://kpmg.com/vn",
      linkedin: "https://linkedin.com/company/kpmg-vietnam",
    },
  },
  {
    name: "Grab Việt Nam",
    email: "careers@grab.com",
    phone: "02838266999",
    description: `Grab Việt Nam là công ty công nghệ hoạt động trong lĩnh vực gọi xe, giao hàng, thanh toán điện tử và dịch vụ số. Là thành viên của Grab Holdings – tập đoàn công nghệ hàng đầu Đông Nam Á, Grab đã nhanh chóng trở thành một trong những nền tảng công nghệ phổ biến nhất tại Việt Nam với các dịch vụ như GrabBike, GrabCar, GrabFood, GrabExpress và GrabPay.

Grab nổi bật nhờ hệ sinh thái dịch vụ đa dạng kết hợp công nghệ dữ liệu, AI và bản đồ số để tối ưu trải nghiệm người dùng. Công ty đầu tư mạnh vào nền tảng công nghệ vận hành, hệ thống điều phối tài xế và giải pháp thanh toán không tiền mặt nhằm nâng cao hiệu quả hoạt động. Ngoài ra, Grab còn hợp tác với nhiều doanh nghiệp, nhà hàng, ngân hàng và đối tác địa phương để mở rộng hệ sinh thái dịch vụ.

Không chỉ tập trung vào tăng trưởng kinh doanh, Grab Việt Nam còn triển khai nhiều chương trình hỗ trợ tài xế, thúc đẩy chuyển đổi số cho doanh nghiệp nhỏ và tham gia các hoạt động cộng đồng. Với môi trường làm việc năng động, đổi mới và đa văn hóa, Grab là một trong những công ty công nghệ được nhiều nhân sự trẻ quan tâm tại Việt Nam.`,
    address:
      "Tầng 9, Tòa nhà Deutsches Haus, 33 Lê Duẩn, Quận 1, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps?q=Grab%20Vi%E1%BB%87t%20Nam%2033%20L%C3%AA%20Du%E1%BA%A9n%2C%20Qu%E1%BA%ADn%201%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
    logoUrl:
      "https://inkythuatso.com/uploads/images/2021/11/logo-grab-inkythuatso-2-01-24-09-59-49.jpg",
    coverImageUrl:
      "https://assets.grab.com/wp-content/uploads/sites/11/2024/07/31142707/GF_Hero-Mex_Banner-2.png",
    isVerified: true,
    socialLinks: {
      website: "https://grab.com/vn",
      linkedin: "https://linkedin.com/company/grab",
    },
  },
  {
    name: "VNG Corporation",
    email: "hr@vng.com.vn",
    phone: "02839978797",
    description: `VNG Corporation là một trong những công ty công nghệ hàng đầu Việt Nam, hoạt động trong nhiều lĩnh vực như trò chơi trực tuyến, nền tảng số, thanh toán điện tử, điện toán đám mây và trí tuệ nhân tạo. Được thành lập vào năm 2004, VNG nổi tiếng với nhiều sản phẩm quen thuộc như Zalo, Zing MP3, ZaloPay và hệ thống game online có lượng người dùng lớn tại Việt Nam.

Công ty nổi bật nhờ khả năng phát triển các sản phẩm công nghệ phục vụ hàng chục triệu người dùng trong nước và quốc tế. Zalo hiện là một trong những nền tảng nhắn tin phổ biến nhất Việt Nam, trong khi ZaloPay đóng vai trò quan trọng trong lĩnh vực fintech và thanh toán số. Bên cạnh đó, VNG còn đầu tư mạnh vào AI, Cloud Computing và các công nghệ mới nhằm mở rộng hệ sinh thái số và nâng cao năng lực cạnh tranh toàn cầu.

VNG được đánh giá là môi trường làm việc trẻ trung, sáng tạo và đề cao tinh thần đổi mới. Công ty thường xuyên tuyển dụng kỹ sư phần mềm, chuyên gia dữ liệu, nhà thiết kế sản phẩm và nhân sự công nghệ chất lượng cao. Với định hướng trở thành doanh nghiệp công nghệ toàn cầu, VNG đang góp phần thúc đẩy sự phát triển của ngành công nghệ số tại Việt Nam.`,
    address: "182 Lê Đại Hành, Phường 15, Quận 11, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps?q=VNG%20Corporation%20182%20L%C3%AA%20%C4%90%E1%BA%A1i%20H%C3%A0nh%2C%20Ph%C6%B0%E1%BB%9Dng%2015%2C%20Qu%E1%BA%ADn%2011%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
    logoUrl:
      "https://mondialbrand.com/wp-content/uploads/2024/02/vng_corporation-logo_brandlogos.net_ysr15.png",
    coverImageUrl:
      "https://scdn-img.vnggames.com/mainsite/images/VNGGames-EN-homepage-banner-1650x928.png?qlty=1&size=3840&iswebp=1",
    isVerified: true,
    socialLinks: {
      website: "https://vng.com.vn",
      linkedin: "https://linkedin.com/company/vng-corporation",
    },
  },
  {
    name: "MoMo",
    email: "careers@momo.vn",
    phone: "02844455678",
    description: `MoMo là một trong những công ty fintech hàng đầu Việt Nam, nổi bật với ví điện tử và hệ sinh thái thanh toán số phục vụ hàng chục triệu người dùng trên toàn quốc. Được phát triển bởi Công ty Cổ phần Dịch vụ Di động Trực tuyến, MoMo cung cấp nhiều dịch vụ như chuyển tiền, thanh toán hóa đơn, mua vé, nạp tiền điện thoại, thanh toán mua sắm, đầu tư tài chính và bảo hiểm trực tuyến.

MoMo đóng vai trò quan trọng trong việc thúc đẩy xu hướng thanh toán không tiền mặt tại Việt Nam. Nền tảng này hợp tác với hàng nghìn doanh nghiệp, ngân hàng, cửa hàng và đối tác dịch vụ nhằm xây dựng hệ sinh thái thanh toán đa dạng và tiện lợi. Bên cạnh đó, MoMo còn đầu tư mạnh vào công nghệ bảo mật, AI và dữ liệu lớn nhằm tối ưu trải nghiệm người dùng và tăng tính an toàn cho các giao dịch tài chính.

Không chỉ là ứng dụng thanh toán, MoMo còn hướng tới xây dựng “siêu ứng dụng” phục vụ nhu cầu tài chính và tiêu dùng hàng ngày của người Việt. Công ty thường xuyên triển khai các chương trình ưu đãi, hoàn tiền và chiến dịch cộng đồng nhằm tăng mức độ tiếp cận người dùng. Với tốc độ phát triển nhanh, năng lực đổi mới công nghệ và định hướng mở rộng hệ sinh thái số, MoMo hiện là một trong những thương hiệu fintech có sức ảnh hưởng lớn nhất tại Việt Nam.`,
    address:
      "Tầng 5-6, Tòa nhà IMS, 90 Nguyễn Hữu Cảnh, Bình Thạnh, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps?q=MoMo%2090%20Nguy%E1%BB%85n%20H%E1%BB%AFu%20C%E1%BA%A3nh%2C%20B%C3%ACnh%20Th%E1%BA%A1nh%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
    logoUrl:
      "https://quyhyvong.com/wp-content/uploads/2022/12/Logo-MoMo-1024x1024.png",
    coverImageUrl:
      "https://vietnambusinessinsider.vn/uploads/images/2021/12/21/momo-5-1640059104.jpg",
    isVerified: true,
    socialLinks: {
      website: "https://momo.vn",
      facebook: "https://facebook.com/momo.vn",
    },
  },
  {
    name: "Tiki",
    email: "talent@tiki.vn",
    phone: "02873006789",
    description: `Tiki là một trong những nền tảng thương mại điện tử lớn tại Việt Nam, được thành lập vào năm 2010 với khởi đầu là website bán sách trực tuyến. Sau nhiều năm phát triển, Tiki đã mở rộng thành sàn thương mại điện tử đa ngành cung cấp nhiều sản phẩm như điện tử, gia dụng, thời trang, mỹ phẩm, thực phẩm và hàng tiêu dùng.

Tiki nổi bật nhờ chiến lược tập trung vào chất lượng dịch vụ, tốc độ giao hàng và trải nghiệm khách hàng. Công ty đầu tư mạnh vào hệ thống logistics, kho vận và công nghệ dữ liệu nhằm tối ưu quy trình vận hành và nâng cao chất lượng dịch vụ giao hàng nhanh. Ngoài ra, Tiki còn phát triển các chương trình hỗ trợ nhà bán hàng, quảng cáo số và hệ sinh thái thương mại điện tử hiện đại.

Không chỉ cạnh tranh trong lĩnh vực bán lẻ trực tuyến, Tiki còn góp phần thúc đẩy xu hướng tiêu dùng số và thương mại điện tử tại Việt Nam. Với môi trường làm việc năng động, văn hóa sáng tạo và định hướng công nghệ rõ ràng, Tiki hiện là một trong những doanh nghiệp thu hút nhiều nhân sự trẻ trong lĩnh vực công nghệ và thương mại điện tử.`,
    address: "Tầng 6, 52 Út Tịch, Tân Bình, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps?q=Tiki%2052%20%C3%9At%20T%E1%BB%8Bch%2C%20T%C3%A2n%20B%C3%ACnh%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
    logoUrl: "https://storage.googleapis.com/hust-files/images/tiki_21.1k.png",
    coverImageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/64/Logo_Tiki.png",
    isVerified: true,
    socialLinks: {
      website: "https://tiki.vn",
      linkedin: "https://linkedin.com/company/tiki-vn",
    },
  },
  {
    name: "Lazada Việt Nam",
    email: "hr@lazada.vn",
    phone: "02839335577",
    description: `Lazada Việt Nam là một trong những nền tảng thương mại điện tử lớn tại Việt Nam, thuộc tập đoàn Alibaba của Trung Quốc. Ra mắt tại Việt Nam từ năm 2012, Lazada hoạt động theo mô hình sàn thương mại điện tử kết nối người bán với người tiêu dùng trên nền tảng số. Công ty cung cấp nhiều ngành hàng đa dạng như điện tử, thời trang, mỹ phẩm, gia dụng, thực phẩm và hàng tiêu dùng.

Lazada nổi bật nhờ hệ thống công nghệ thương mại điện tử hiện đại cùng mạng lưới logistics và vận chuyển quy mô lớn. Công ty đầu tư mạnh vào dữ liệu, AI và hệ thống quản lý kho vận nhằm tối ưu trải nghiệm mua sắm trực tuyến cho khách hàng. Ngoài ra, Lazada còn triển khai nhiều chương trình hỗ trợ nhà bán hàng như đào tạo kinh doanh online, quảng cáo số và công cụ quản lý vận hành.

Bên cạnh hoạt động thương mại điện tử, Lazada Việt Nam còn góp phần thúc đẩy quá trình chuyển đổi số trong lĩnh vực bán lẻ tại Việt Nam. Với môi trường làm việc quốc tế, văn hóa đổi mới và tốc độ phát triển nhanh, công ty là điểm đến hấp dẫn đối với nhân sự trong lĩnh vực công nghệ, dữ liệu, marketing và vận hành thương mại điện tử.`,
    address:
      "Tầng 22, Tòa nhà Bitexco Financial Tower, 2 Hải Triều, Quận 1, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps?q=Lazada%20Vi%E1%BB%87t%20Nam%20Bitexco%202%20H%E1%BA%A3i%20Tri%E1%BB%81u%2C%20Qu%E1%BA%ADn%201%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
    logoUrl:
      "https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/177609/Originals/tim-hieu-kich-thuoc-banner-lazada-tieu-chuan-va-cach-thiet-ke-banner-toi-uu-cho-shop-6.jpg",
    coverImageUrl:
      "https://thuvienvector.vn/wp-content/uploads/2025/09/bieu-tuong-logo-lazada.jpg",
    isVerified: true,
    socialLinks: { website: "https://lazada.vn" },
  },
  {
    name: "Deloitte Việt Nam",
    email: "vn.recruitment@deloitte.com",
    phone: "02838220100",
    description: `Deloitte Việt Nam là thành viên của mạng lưới Deloitte toàn cầu – một trong “Big Four” công ty kiểm toán và tư vấn lớn nhất thế giới. Doanh nghiệp hoạt động tại Việt Nam trong nhiều lĩnh vực như kiểm toán, tư vấn thuế, tư vấn tài chính, quản trị rủi ro, chuyển đổi số và tư vấn chiến lược cho doanh nghiệp. Với đội ngũ chuyên gia giàu kinh nghiệm cùng tiêu chuẩn vận hành quốc tế, Deloitte Việt Nam đã đồng hành cùng nhiều tập đoàn lớn, tổ chức tài chính và doanh nghiệp trong nước lẫn quốc tế.

Công ty nổi bật nhờ khả năng cung cấp các giải pháp tư vấn toàn diện giúp doanh nghiệp tối ưu hiệu quả hoạt động, quản trị rủi ro và thích ứng với môi trường kinh doanh thay đổi nhanh chóng. Deloitte cũng tham gia nhiều dự án chuyển đổi số, ESG, phân tích dữ liệu và tư vấn chiến lược cho các tổ chức trong nhiều ngành nghề khác nhau. Bên cạnh đó, doanh nghiệp luôn chú trọng cập nhật xu hướng công nghệ và tiêu chuẩn quốc tế để hỗ trợ khách hàng nâng cao năng lực cạnh tranh.

Deloitte Việt Nam được đánh giá cao nhờ môi trường làm việc chuyên nghiệp, quy trình đào tạo bài bản và cơ hội phát triển nghề nghiệp rộng mở. Công ty thường xuyên tổ chức các chương trình thực tập, tuyển dụng sinh viên tài năng và đào tạo chuyên sâu trong lĩnh vực kiểm toán – tài chính. Với uy tín toàn cầu cùng nền tảng chuyên môn vững mạnh, Deloitte Việt Nam hiện là một trong những lựa chọn hàng đầu đối với các doanh nghiệp và nhân sự muốn phát triển trong lĩnh vực tư vấn và dịch vụ chuyên nghiệp.`,
    address:
      "Tầng 15, Vietcombank Tower, 5 Công Trường Mê Linh, Quận 1, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps?q=Deloitte%20Vi%E1%BB%87t%20Nam%20Vietcombank%20Tower%205%20C%C3%B4ng%20Tr%C6%B0%E1%BB%9Dng%20M%C3%AA%20Linh%2C%20Qu%E1%BA%ADn%201%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
    logoUrl:
      "https://logos-world.net/wp-content/uploads/2021/08/Deloitte-Symbol.png",
    coverImageUrl:
      "https://1000logos.net/wp-content/uploads/2019/08/Deloitte-Logo.jpg",
    isVerified: true,
    socialLinks: {
      website: "https://www2.deloitte.com/vn",
      linkedin: "https://linkedin.com/company/deloitte",
    },
  },
  {
    name: "Be Group",
    email: "careers@be.com.vn",
    phone: "02866662255",
    description: `Be Group là công ty công nghệ Việt Nam hoạt động chủ yếu trong lĩnh vực gọi xe công nghệ, giao hàng và dịch vụ số. Ra mắt vào năm 2018 với ứng dụng be, doanh nghiệp nhanh chóng trở thành một trong những nền tảng công nghệ nội địa nổi bật cạnh tranh trực tiếp với nhiều thương hiệu quốc tế tại thị trường Việt Nam. Hệ sinh thái của Be hiện bao gồm nhiều dịch vụ như beBike, beCar, beDelivery, thanh toán điện tử, bảo hiểm và các giải pháp tài chính dành cho tài xế và người dùng.

Điểm nổi bật của Be Group là định hướng xây dựng nền tảng công nghệ “Made in Vietnam”, tập trung tối ưu trải nghiệm phù hợp với nhu cầu và hành vi người dùng Việt Nam. Công ty đầu tư mạnh vào dữ liệu, AI, hệ thống điều phối và công nghệ vận hành nhằm nâng cao hiệu suất dịch vụ và chất lượng trải nghiệm khách hàng. Ngoài ra, Be còn hợp tác với nhiều ngân hàng, doanh nghiệp bảo hiểm và đối tác công nghệ để mở rộng hệ sinh thái dịch vụ số.

Không chỉ tập trung tăng trưởng thị phần, Be Group còn chú trọng phát triển bền vững và hỗ trợ cộng đồng tài xế thông qua nhiều chính sách phúc lợi và chương trình hỗ trợ thu nhập. Với đội ngũ nhân sự trẻ, năng động cùng tinh thần đổi mới liên tục, doanh nghiệp đang từng bước mở rộng vị thế trong lĩnh vực công nghệ và dịch vụ số tại Việt Nam.`,
    address: "Tầng 8, Tòa nhà IDMC My Dinh, 15 Phạm Hùng, Nam Từ Liêm, Hà Nội",
    mapUrl:
      "https://www.google.com/maps?q=Be%20Group%2015%20Ph%E1%BA%A1m%20H%C3%B9ng%2C%20Nam%20T%E1%BB%AB%20Li%C3%AAm%2C%20H%C3%A0%20N%E1%BB%99i&output=embed",
    logoUrl:
      "https://dongphuchaianh.vn/wp-content/uploads/2024/08/y-nghia-logo-be.jpg",
    coverImageUrl:
      "https://imgmainsite.be.com.vn/2022/09/da356ba9-1920x990-be-copy-1.png",
    isVerified: true,
    socialLinks: { website: "https://be.com.vn" },
  },
  {
    name: "Agribank",
    email: "tuyendung@agribank.com.vn",
    phone: "02438315270",
    description: `Agribank là một trong những ngân hàng thương mại lớn nhất Việt Nam, hoạt động chủ yếu trong lĩnh vực tài chính – ngân hàng với vai trò trọng tâm trong phát triển nông nghiệp và nông thôn. Được thành lập năm 1988, Agribank hiện sở hữu mạng lưới chi nhánh rộng khắp cả nước, đặc biệt tại các khu vực nông thôn và vùng sâu vùng xa.

Ngân hàng cung cấp đa dạng dịch vụ tài chính như huy động vốn, cho vay, thanh toán, ngân hàng số và hỗ trợ tín dụng cho cá nhân, doanh nghiệp và hộ sản xuất. Agribank giữ vai trò quan trọng trong việc thúc đẩy phát triển kinh tế nông nghiệp, hỗ trợ doanh nghiệp vừa và nhỏ cũng như triển khai các chính sách tài chính của Nhà nước.

Bên cạnh hoạt động kinh doanh, Agribank còn tích cực tham gia các chương trình an sinh xã hội, phát triển cộng đồng và hỗ trợ người dân trong nhiều lĩnh vực. Với quy mô lớn, nền tảng tài chính ổn định và mạng lưới rộng khắp, Agribank tiếp tục giữ vị thế là một trong những ngân hàng có ảnh hưởng lớn tại Việt Nam.`,
    address: "2 Láng Hạ, Ba Đình, Hà Nội",
    mapUrl:
      "https://www.google.com/maps?q=Agribank%202%20L%C3%A1ng%20H%E1%BA%A1%2C%20Ba%20%C4%90%C3%ACnh%2C%20H%C3%A0%20N%E1%BB%99i&output=embed",
    logoUrl:
      "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Icon-Agribank.png",
    coverImageUrl:
      "https://congtyquatang.com.vn/wp-content/uploads/2026/02/logo-agribank-vector-01-scaled.jpg",
    isVerified: true,
    socialLinks: { website: "https://agribank.com.vn" },
  },
  {
    name: "Unilever Việt Nam",
    email: "careers.vietnam@unilever.com",
    phone: "02837217150",
    description: `Unilever Việt Nam là công ty thuộc tập đoàn Unilever toàn cầu – một trong những doanh nghiệp hàng đầu thế giới trong lĩnh vực hàng tiêu dùng nhanh. Hoạt động tại Việt Nam từ năm 1995, Unilever đã xây dựng danh mục thương hiệu quen thuộc với người tiêu dùng như OMO, Sunlight, Lifebuoy, Dove, Clear, P/S và Knorr.

Công ty nổi bật nhờ chiến lược phát triển bền vững, tập trung vào đổi mới sản phẩm, nghiên cứu thị trường và xây dựng thương hiệu mạnh. Unilever Việt Nam đầu tư lớn vào hệ thống phân phối, marketing và phát triển sản phẩm phù hợp với nhu cầu người tiêu dùng Việt Nam. Ngoài ra, doanh nghiệp còn chú trọng các chương trình bảo vệ môi trường, phát triển cộng đồng và nâng cao chất lượng sống.

Unilever được đánh giá là môi trường làm việc chuyên nghiệp với văn hóa doanh nghiệp hiện đại, sáng tạo và đề cao phát triển con người. Công ty thường xuyên nằm trong danh sách những nơi làm việc tốt nhất Việt Nam và là điểm đến hấp dẫn với sinh viên, nhân sự trẻ trong lĩnh vực kinh doanh, marketing và quản trị.`,
    address: "156 Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps?q=Unilever%20Vi%E1%BB%87t%20Nam%20156%20Nguy%E1%BB%85n%20L%C6%B0%C6%A1ng%20B%E1%BA%B1ng%2C%20Qu%E1%BA%ADn%207%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
    logoUrl: "https://goldidea.vn/upload/logo-unilever.jpg",
    coverImageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6dLy4GtTGQdvUp3c4pkwN5Ew2rNv64ARDWA&s",
    isVerified: true,
    socialLinks: {
      website:
        "https://www.unilever.com/planet-and-society/sustainability-in-action/vietnam/",
      linkedin: "https://linkedin.com/company/unilever",
    },
  },
  {
    name: "Thế Giới Di Động",
    email: "tuyendung@thegioididong.com",
    phone: "19001222",
    description: `Thế Giới Di Động là một trong những tập đoàn bán lẻ lớn nhất Việt Nam, hoạt động chủ yếu trong lĩnh vực điện thoại, điện máy, công nghệ và hàng tiêu dùng. Được thành lập vào năm 2004, doanh nghiệp đã phát triển mạnh mẽ với nhiều chuỗi bán lẻ nổi tiếng như Thế Giới Di Động, Điện Máy Xanh, Bách Hóa Xanh, TopZone và An Khang. Với hàng nghìn cửa hàng trên toàn quốc, công ty đóng vai trò quan trọng trong việc thay đổi thói quen mua sắm và thúc đẩy mô hình bán lẻ hiện đại tại Việt Nam.

Thế Giới Di Động nổi bật nhờ chiến lược lấy khách hàng làm trung tâm, tập trung vào chất lượng dịch vụ, trải nghiệm mua sắm và tốc độ vận hành. Công ty đầu tư mạnh vào công nghệ quản lý, logistics, dữ liệu khách hàng và thương mại điện tử nhằm tối ưu hiệu quả kinh doanh. Ngoài ra, doanh nghiệp còn xây dựng hệ thống hậu mãi chuyên nghiệp với chính sách bảo hành, đổi trả và chăm sóc khách hàng được đánh giá cao trên thị trường.

Trong nhiều năm liên tiếp, Thế Giới Di Động luôn nằm trong nhóm doanh nghiệp bán lẻ có doanh thu và lợi nhuận dẫn đầu Việt Nam. Công ty cũng được biết đến với văn hóa doanh nghiệp năng động, tốc độ và đề cao tinh thần đổi mới sáng tạo. Với định hướng mở rộng hệ sinh thái bán lẻ đa ngành, ứng dụng công nghệ sâu vào vận hành và nâng cao chất lượng dịch vụ, Thế Giới Di Động tiếp tục giữ vai trò tiên phong trong ngành bán lẻ hiện đại tại Việt Nam.`,
    address: "Số 128 Trần Quang Khải, Tân Định, Quận 1, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps?q=Th%E1%BA%BF%20Gi%E1%BB%9Bi%20Di%20%C4%90%E1%BB%99ng%20128%20Tr%E1%BA%A7n%20Quang%20Kh%E1%BA%A3i%2C%20T%C3%A2n%20%C4%90%E1%BB%8Bnh%2C%20Qu%E1%BA%ADn%201%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
    logoUrl:
      "https://cdn.haitrieu.com/wp-content/uploads/2021/11/Logo-The-Gioi-Di-Dong-MWG.png",
    coverImageUrl:
      "https://atpcare.vn/wp-content/uploads/2020/01/the-gioi-di-dong-logo.png",
    isVerified: true,
    socialLinks: { website: "https://thegioididong.com" },
  },
  {
    name: "PwC Việt Nam",
    email: "vn_recruitment@pwc.com",
    phone: "02838230796",
    description: `PwC Việt Nam là thành viên của mạng lưới PricewaterhouseCoopers toàn cầu – một trong những tập đoàn cung cấp dịch vụ kiểm toán và tư vấn hàng đầu thế giới. Công ty hoạt động tại Việt Nam trong các lĩnh vực như kiểm toán, tư vấn thuế, tư vấn doanh nghiệp, pháp lý, quản trị rủi ro và chuyển đổi số. Với kinh nghiệm quốc tế cùng sự hiểu biết sâu sắc về thị trường trong nước, PwC Việt Nam đã hỗ trợ nhiều doanh nghiệp lớn trong quá trình phát triển và mở rộng hoạt động.

PwC nổi bật nhờ khả năng cung cấp các giải pháp chiến lược toàn diện, giúp doanh nghiệp nâng cao hiệu quả quản trị, tuân thủ pháp lý và tối ưu hoạt động tài chính. Công ty cũng tham gia nhiều dự án liên quan đến ESG, phân tích dữ liệu, công nghệ số và tái cấu trúc doanh nghiệp. Bên cạnh dịch vụ chuyên môn, PwC còn chú trọng phát triển nguồn nhân lực và xây dựng văn hóa học tập liên tục trong tổ chức.

Môi trường làm việc tại PwC được đánh giá hiện đại, chuyên nghiệp và mang tính quốc tế cao. Công ty thường xuyên tuyển dụng sinh viên, thực tập sinh và nhân sự trẻ với các chương trình đào tạo chuyên sâu nhằm phát triển kỹ năng chuyên môn và kỹ năng lãnh đạo. Với uy tín toàn cầu và chất lượng dịch vụ cao, PwC Việt Nam hiện là một trong những doanh nghiệp hàng đầu trong lĩnh vực kiểm toán và tư vấn tại Việt Nam.`,
    address: "Tầng 8, Saigon Tower, 29 Lê Duẩn, Quận 1, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps?q=PwC%20Vi%E1%BB%87t%20Nam%20Saigon%20Tower%2029%20L%C3%AA%20Du%E1%BA%A9n%2C%20Qu%E1%BA%ADn%201%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/05/PricewaterhouseCoopers_Logo.svg",
    coverImageUrl:
      "https://tbcdn.talentbrew.com/company/932/20012/content/PWC%20Launch%20Banner.png",
    isVerified: true,
    socialLinks: {
      website: "https://pwc.com/vn",
      linkedin: "https://linkedin.com/company/pwc",
    },
  },
  {
    name: "Tập đoàn Hòa Phát",
    email: "nhansu@hoaphatteel.com",
    phone: "02462911111",
    description: `Tập đoàn Hòa Phát là một trong những tập đoàn công nghiệp lớn nhất Việt Nam, hoạt động chủ yếu trong lĩnh vực sản xuất thép, công nghiệp nặng, nông nghiệp và bất động sản. Được thành lập từ năm 1992, Hòa Phát đã phát triển mạnh mẽ và trở thành doanh nghiệp dẫn đầu thị phần thép xây dựng tại Việt Nam với hệ thống khu liên hợp sản xuất quy mô lớn.

Hòa Phát nổi bật nhờ chiến lược đầu tư bài bản vào công nghệ sản xuất, quy trình vận hành và chuỗi cung ứng khép kín. Tập đoàn sở hữu nhiều nhà máy hiện đại ứng dụng công nghệ tiên tiến nhằm nâng cao năng suất và tối ưu chi phí sản xuất. Ngoài lĩnh vực thép, Hòa Phát còn mở rộng sang sản xuất nội thất, điện lạnh, nông nghiệp và phát triển bất động sản công nghiệp.

Trong nhiều năm liên tiếp, Hòa Phát duy trì tốc độ tăng trưởng mạnh và đóng vai trò quan trọng trong ngành công nghiệp sản xuất Việt Nam. Tập đoàn cũng chú trọng xây dựng văn hóa doanh nghiệp, phát triển nguồn nhân lực và tham gia các hoạt động xã hội. Với nền tảng tài chính vững mạnh, năng lực sản xuất lớn và định hướng mở rộng dài hạn, Hòa Phát hiện là một trong những doanh nghiệp công nghiệp có ảnh hưởng lớn nhất tại Việt Nam.`,
    address: "Tòa nhà Hòa Phát, 64 Triệu Việt Vương, Hai Bà Trưng, Hà Nội",
    mapUrl:
      "https://www.google.com/maps?q=T%E1%BA%ADp%20%C4%91o%C3%A0n%20H%C3%B2a%20Ph%C3%A1t%2064%20Tri%E1%BB%87u%20Vi%E1%BB%87t%20V%C6%B0%C6%A1ng%2C%20Hai%20B%C3%A0%20Tr%C6%B0ng%2C%20H%C3%A0%20N%E1%BB%99i&output=embed",
    logoUrl:
      "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Hoa-Phat-HPG-Ori.png",
    coverImageUrl:
      "https://file.hoaphat.com.vn/hoaphat-com-vn/2019/10/hpg-logo-cymk-0211-artboard-7-copy-2.jpg",
    isVerified: true,
    socialLinks: {
      website: "https://hoaphatteel.com",
      linkedin: "https://linkedin.com/company/hoa-phat-group",
    },
  },
  {
    name: "Sacombank",
    email: "tuyendung@sacombank.com",
    phone: "02838267530",
    description: `Sacombank là một trong những ngân hàng thương mại cổ phần lớn tại Việt Nam, được thành lập vào năm 1991. Trong quá trình phát triển, Sacombank đã xây dựng mạng lưới hoạt động rộng khắp cả nước và mở rộng hiện diện tại một số thị trường khu vực Đông Nam Á. Ngân hàng cung cấp đa dạng sản phẩm và dịch vụ tài chính cho khách hàng cá nhân, doanh nghiệp và tổ chức như tiền gửi, tín dụng, ngân hàng điện tử, thanh toán quốc tế, bảo hiểm và đầu tư tài chính.

Sacombank nổi bật với chiến lược phát triển ngân hàng bán lẻ hiện đại, tập trung mạnh vào trải nghiệm khách hàng và ứng dụng công nghệ trong hoạt động vận hành. Ngân hàng đầu tư vào các nền tảng ngân hàng số, thanh toán trực tuyến và hệ sinh thái tài chính nhằm đáp ứng nhu cầu giao dịch ngày càng tăng của khách hàng. Bên cạnh đó, Sacombank cũng chú trọng nâng cao chất lượng dịch vụ, quản trị rủi ro và cải thiện hiệu quả hoạt động kinh doanh.

Không chỉ phát triển trong lĩnh vực tài chính, Sacombank còn tích cực tham gia các chương trình cộng đồng, hỗ trợ giáo dục và hoạt động an sinh xã hội. Với môi trường làm việc chuyên nghiệp, chính sách đào tạo nhân sự bài bản và định hướng đổi mới liên tục, Sacombank hiện là một trong những ngân hàng thu hút nguồn nhân lực trẻ trong lĩnh vực tài chính – ngân hàng tại Việt Nam.`,
    address: "266-268 Nam Kỳ Khởi Nghĩa, Quận 3, TP. Hồ Chí Minh",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7328.245127327219!2d106.67358469357907!3d10.789523699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3188e9987f%3A0xfff5914fd4e3e767!2sSACOMBANK%20-%20PGD%20Qu%E1%BA%ADn%203!5e1!3m2!1sen!2s!4v1776918827936!5m2!1sen!2s",
    logoUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBz0H3dKCJwEdq6zsszuSjihAN7HZ4nBEXRg&s",
    coverImageUrl:
      "https://www.sacombank.com.vn/content/dam/sacombank/images/tin-tuc/import/5957/imagestand/UuDaiThanhToanQuocTe2021_banner.jpg",
    isVerified: true,
    socialLinks: { website: "https://sacombank.com" },
  },
];

// ─── RECRUITER cho từng company (1 recruiter / company) ───────────────────────
const RECRUITERS_DATA = [
  // FPT Software [0]
  {
    email: "hr.fpt@fpt-software.com",
    fullName: "Nguyễn Thị Thu Hà",
    phone: "0912000001",
    address: "Quận 9, TP. Hồ Chí Minh",
    bio: "Chuyên viên tuyển dụng cấp cao tại FPT Software với 7 năm kinh nghiệm trong lĩnh vực CNTT. Chuyên tuyển dụng kỹ sư phần mềm, BA, DevOps và data engineer từ fresher đến senior. Có mạng lưới ứng viên rộng và am hiểu thị trường IT Việt Nam.",
    skills: [
      "IT Recruitment",
      "Technical Screening",
      "Headhunting",
      "LinkedIn Sourcing",
      "ATS",
    ],
  },
  // Vietcombank [1]
  {
    email: "hr.vcb@vietcombank.com.vn",
    fullName: "Trần Văn Minh Đức",
    phone: "0912000002",
    address: "Hoàn Kiếm, Hà Nội",
    bio: "Chuyên viên tuyển dụng tại Vietcombank với 6 năm kinh nghiệm trong ngành ngân hàng. Phụ trách tuyển dụng các vị trí từ chuyên viên quan hệ khách hàng, phân tích tín dụng đến vị trí quản lý cấp trung.",
    skills: [
      "Banking Recruitment",
      "Volume Hiring",
      "Competency Interview",
      "HRIS",
      "Onboarding",
    ],
  },
  // Shopee [2]
  {
    email: "careers.shopee@shopee.com",
    fullName: "Lê Thị Phương Linh",
    phone: "0912000003",
    address: "Tân Bình, TP. Hồ Chí Minh",
    bio: "Senior Recruiter tại Shopee Vietnam với chuyên môn tuyển dụng tech và product trong môi trường startup quy mô lớn. 5 năm kinh nghiệm tuyển dụng tại các công ty công nghệ Đông Nam Á.",
    skills: [
      "Tech Recruiting",
      "Product Recruiting",
      "Global Hiring",
      "Diversity Hiring",
      "Offer Negotiation",
    ],
  },
  // Techcombank [3]
  {
    email: "recruit.tcb@techcombank.com.vn",
    fullName: "Phạm Hồng Sơn",
    phone: "0912000004",
    address: "Hai Bà Trưng, Hà Nội",
    bio: "Chuyên viên tuyển dụng tại Techcombank với 6 năm kinh nghiệm ngân hàng tài chính. Chuyên tuyển dụng các vị trí phân tích tín dụng, quản lý rủi ro và kỹ sư phần mềm ngân hàng.",
    skills: [
      "Banking Recruitment",
      "Compliance Hiring",
      "Assessment Center",
      "Competency Interview",
    ],
  },
  // Vingroup [4]
  {
    email: "careers.vin@vingroup.net",
    fullName: "Hoàng Thị Lan",
    phone: "0912000005",
    address: "Long Biên, Hà Nội",
    bio: "Talent Acquisition Manager tại Vingroup với 8 năm kinh nghiệm tuyển dụng đa lĩnh vực từ bất động sản, bán lẻ đến công nghệ. Chuyên tuyển dụng vị trí leadership và high-potential talent.",
    skills: [
      "Talent Strategy",
      "Executive Search",
      "Team Management",
      "Employer Branding",
      "Succession Planning",
    ],
  },
  // Masan [5]
  {
    email: "hr.masan@masan.com.vn",
    fullName: "Vũ Thị Thanh Tâm",
    phone: "0912000006",
    address: "Quận 10, TP. Hồ Chí Minh",
    bio: "HR Business Partner tại Masan Group với 7 năm kinh nghiệm FMCG và bán lẻ. Phụ trách tuyển dụng sales, marketing và vận hành cho hệ thống phân phối toàn quốc.",
    skills: [
      "FMCG Recruiting",
      "Graduate Program",
      "Field Sales Hiring",
      "HRBP",
      "Workforce Planning",
    ],
  },
  // KPMG [6]
  {
    email: "vn.recruit@kpmg.com.vn",
    fullName: "Nguyễn Minh Quân",
    phone: "0912000007",
    address: "Nam Từ Liêm, Hà Nội",
    bio: "Campus & Experienced Hire Recruiter tại KPMG Vietnam với 5 năm kinh nghiệm kiểm toán và tư vấn. Chuyên phụ trách chương trình tuyển sinh cho sinh viên mới ra trường và ứng viên có kinh nghiệm.",
    skills: [
      "Audit Hiring",
      "Campus Recruiting",
      "Case Interview",
      "Assessment Design",
      "Employer Branding",
    ],
  },
  // Grab [7]
  {
    email: "talent.grab@grab.com",
    fullName: "Bùi Thị Thùy Tiên",
    phone: "0912000008",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "Senior Technical Recruiter tại Grab Vietnam với chuyên môn tuyển dụng kỹ sư phần mềm và data scientist cho thị trường Đông Nam Á. 6 năm kinh nghiệm tại các công ty công nghệ đa quốc gia.",
    skills: [
      "Technical Recruiting",
      "Engineering Hiring",
      "Data Science Hiring",
      "Global Sourcing",
      "DEI",
    ],
  },
  // VNG [8]
  {
    email: "hr.vng@vng.com.vn",
    fullName: "Trần Thị Hải Yến",
    phone: "0912000009",
    address: "Quận 11, TP. Hồ Chí Minh",
    bio: "Chuyên viên tuyển dụng tại VNG Corporation với 5 năm kinh nghiệm trong lĩnh vực game và công nghệ. Phụ trách tuyển dụng kỹ sư phần mềm, game designer và data analyst.",
    skills: [
      "Tech Recruiting",
      "Game Industry Hiring",
      "LinkedIn Sourcing",
      "Technical Interview",
    ],
  },
  // MoMo [9]
  {
    email: "careers.momo@momo.vn",
    fullName: "Phan Quốc Hưng",
    phone: "0912000010",
    address: "Bình Thạnh, TP. Hồ Chí Minh",
    bio: "Talent Acquisition Specialist tại MoMo với 4 năm kinh nghiệm fintech. Chuyên tuyển dụng kỹ sư backend, mobile developer và chuyên viên tài chính số cho nền tảng ví điện tử lớn nhất Việt Nam.",
    skills: [
      "Fintech Recruiting",
      "Mobile Hiring",
      "Backend Hiring",
      "Stakeholder Management",
    ],
  },
  // Tiki [10]
  {
    email: "talent.tiki@tiki.vn",
    fullName: "Lý Thị Kim Ngân",
    phone: "0912000011",
    address: "Tân Bình, TP. Hồ Chí Minh",
    bio: "Senior Recruiter tại Tiki với 5 năm kinh nghiệm e-commerce. Phụ trách tuyển dụng product, engineering và data cho nền tảng thương mại điện tử nội địa hàng đầu.",
    skills: [
      "E-commerce Recruiting",
      "Product Hiring",
      "Data Hiring",
      "ATS",
      "Employer Branding",
    ],
  },
  // Lazada [11]
  {
    email: "hr.lazada@lazada.vn",
    fullName: "Đinh Văn Thắng",
    phone: "0912000012",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "HR Manager tại Lazada Vietnam với 6 năm kinh nghiệm trong ngành e-commerce và logistics. Phụ trách tuyển dụng toàn bộ vị trí từ operations đến technology.",
    skills: [
      "E-commerce Hiring",
      "Logistics Recruiting",
      "Volume Hiring",
      "Assessment Center",
    ],
  },
  // Deloitte [12]
  {
    email: "vn.recruit@deloitte.com",
    fullName: "Ngô Thị Bích Phượng",
    phone: "0912000013",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "Campus Recruiter tại Deloitte Vietnam với 4 năm kinh nghiệm professional services. Chuyên tuyển dụng cho các bộ phận Audit, Tax, Advisory và Consulting.",
    skills: [
      "Professional Services HR",
      "Campus Recruiting",
      "Case Interview",
      "Audit Hiring",
      "Tax Hiring",
    ],
  },
  // Be Group [13]
  {
    email: "careers.be@be.com.vn",
    fullName: "Cao Minh Tuấn",
    phone: "0912000014",
    address: "Nam Từ Liêm, Hà Nội",
    bio: "Talent Acquisition tại Be Group với 3 năm kinh nghiệm trong lĩnh vực ride-hailing và công nghệ. Chuyên tuyển dụng mobile developer, backend engineer và operations specialist.",
    skills: [
      "Tech Recruiting",
      "Startup Hiring",
      "Mobile Hiring",
      "Operations Hiring",
    ],
  },
  // Agribank [14]
  {
    email: "tuyendung.agribank@agribank.com.vn",
    fullName: "Dương Thị Mai Hương",
    phone: "0912000015",
    address: "Ba Đình, Hà Nội",
    bio: "Chuyên viên tuyển dụng tại Agribank với 8 năm kinh nghiệm trong ngành ngân hàng nhà nước. Phụ trách tuyển dụng cho hệ thống hơn 2.300 chi nhánh và phòng giao dịch toàn quốc.",
    skills: [
      "Banking Recruitment",
      "Volume Hiring",
      "Rural Banking Hiring",
      "Government Bank HR",
    ],
  },
  // Unilever [15]
  {
    email: "careers.vn@unilever.com",
    fullName: "Hoàng Thị Diệu Linh",
    phone: "0912000016",
    address: "Quận 7, TP. Hồ Chí Minh",
    bio: "HR Business Partner tại Unilever Vietnam với 6 năm kinh nghiệm FMCG đa quốc gia. Phụ trách tuyển dụng và phát triển nhân sự cho khối marketing, sales và supply chain.",
    skills: [
      "FMCG Recruiting",
      "Graduate Program",
      "Management Trainee",
      "Employer Branding",
      "DEI",
    ],
  },
  // TGDĐ [16]
  {
    email: "tuyendung.tgdd@thegioididong.com",
    fullName: "Phùng Văn Đại",
    phone: "0912000017",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "Trưởng phòng tuyển dụng tại Thế Giới Di Động với 9 năm kinh nghiệm bán lẻ. Phụ trách tuyển dụng nhân sự cho hệ thống hơn 2.200 cửa hàng, trung tâm phân phối và văn phòng.",
    skills: [
      "Retail Recruiting",
      "Volume Hiring",
      "Store Staff Hiring",
      "Management Recruiting",
    ],
  },
  // PwC [17]
  {
    email: "vn.careers@pwc.com",
    fullName: "Từ Thị Mỹ Linh",
    phone: "0912000018",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "Recruiter tại PwC Vietnam với 4 năm kinh nghiệm professional services. Chuyên tuyển dụng cho các service line Assurance, Tax, Deals và Advisory.",
    skills: [
      "Big 4 Recruiting",
      "Campus Hiring",
      "Experienced Hire",
      "Professional Interview",
    ],
  },
  // Hòa Phát [18]
  {
    email: "nhansu.hp@hoaphatteel.com",
    fullName: "Lê Bá Hoàng",
    phone: "0912000019",
    address: "Hai Bà Trưng, Hà Nội",
    bio: "Trưởng phòng nhân sự tuyển dụng tại Hòa Phát Group với 10 năm kinh nghiệm trong ngành sản xuất và công nghiệp nặng. Phụ trách tuyển dụng cho các nhà máy thép và các đơn vị sản xuất.",
    skills: [
      "Manufacturing Recruiting",
      "Engineering Hiring",
      "Industrial HR",
      "Volume Hiring",
    ],
  },
  // Sacombank [19]
  {
    email: "tuyendung.scb@sacombank.com",
    fullName: "Võ Thị Thanh Thảo",
    phone: "0912000020",
    address: "Quận 3, TP. Hồ Chí Minh",
    bio: "Chuyên viên tuyển dụng tại Sacombank với 5 năm kinh nghiệm ngân hàng thương mại. Phụ trách tuyển dụng cho khối kinh doanh cá nhân, doanh nghiệp và các trung tâm giao dịch trên toàn quốc.",
    skills: [
      "Retail Banking HR",
      "Volume Hiring",
      "Relationship Banking Hiring",
      "Assessment Center",
    ],
  },
];

// ─── 20 CANDIDATES ────────────────────────────────────────────────────────────
const CANDIDATES_DATA = [
  {
    email: "nguyenvanminh@gmail.com",
    fullName: "Nguyễn Văn Minh",
    phone: "0912345678",
    address: "Quận 3, TP. Hồ Chí Minh",
    bio: "Lập trình viên backend với hơn 3 năm kinh nghiệm làm việc với Node.js, NestJS và PostgreSQL. Đam mê xây dựng các hệ thống có khả năng mở rộng cao và luôn chú trọng đến chất lượng code. Đang tìm kiếm cơ hội phát triển tại các công ty công nghệ hàng đầu.",
    skills: [
      "Node.js",
      "NestJS",
      "PostgreSQL",
      "Docker",
      "Redis",
      "TypeScript",
      "REST API",
      "GraphQL",
    ],
  },
  {
    email: "tranthilanhanh@gmail.com",
    fullName: "Trần Thị Lan Anh",
    phone: "0987654321",
    address: "Cầu Giấy, Hà Nội",
    bio: "Chuyên viên marketing với 4 năm kinh nghiệm trong digital marketing, SEO, SEM và quản lý mạng xã hội. Đã triển khai thành công nhiều chiến dịch cho các thương hiệu bán lẻ và thương mại điện tử.",
    skills: [
      "SEO",
      "Google Ads",
      "Facebook Ads",
      "Content Marketing",
      "Analytics",
      "Email Marketing",
      "Copywriting",
    ],
  },
  {
    email: "phamquocbao@gmail.com",
    fullName: "Phạm Quốc Bảo",
    phone: "0901122334",
    address: "Hải Châu, Đà Nẵng",
    bio: "Nhân viên kinh doanh B2B với 5 năm kinh nghiệm trong ngành phần mềm doanh nghiệp. Kỹ năng đàm phán tốt, xây dựng mối quan hệ khách hàng bền vững và thành tích vượt KPI liên tục 3 năm liền.",
    skills: [
      "B2B Sales",
      "CRM",
      "Negotiation",
      "Prospecting",
      "Cold Calling",
      "HubSpot",
      "Presentation",
    ],
  },
  {
    email: "lethibichngoc@gmail.com",
    fullName: "Lê Thị Bích Ngọc",
    phone: "0933445566",
    address: "Bình Thạnh, TP. Hồ Chí Minh",
    bio: "Chuyên viên nhân sự với 3 năm kinh nghiệm tuyển dụng và phát triển nguồn nhân lực. Thế mạnh trong xây dựng quy trình tuyển dụng, đánh giá năng lực ứng viên và triển khai chính sách phúc lợi.",
    skills: [
      "Recruitment",
      "HR Policy",
      "HRBP",
      "Onboarding",
      "Employee Relations",
      "KPI Design",
      "Labor Law",
    ],
  },
  {
    email: "hoangminhtuan@gmail.com",
    fullName: "Hoàng Minh Tuấn",
    phone: "0944556677",
    address: "Hoàn Kiếm, Hà Nội",
    bio: "Kỹ sư frontend 4 năm kinh nghiệm với React, Next.js và TypeScript. Chú trọng UX/UI và tối ưu hiệu suất ứng dụng web. Đang tìm kiếm môi trường startup nơi vừa code vừa đóng góp ý kiến về product.",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Figma",
      "Redux",
      "Jest",
      "Storybook",
    ],
  },
  {
    email: "nguyenthimai@gmail.com",
    fullName: "Nguyễn Thị Mai",
    phone: "0955667788",
    address: "Thanh Khê, Đà Nẵng",
    bio: "Chuyên viên kế toán với 6 năm kinh nghiệm tại doanh nghiệp sản xuất và thương mại. Thành thạo MISA, Fast, SAP và có kiến thức vững về VAS lẫn IFRS. Mong muốn lên vị trí Kế toán trưởng trong 2-3 năm tới.",
    skills: [
      "MISA",
      "SAP",
      "VAS",
      "IFRS",
      "Tax Declaration",
      "Financial Reporting",
      "Excel Advanced",
      "Auditing",
    ],
  },
  {
    email: "vuducthanh@gmail.com",
    fullName: "Vũ Đức Thành",
    phone: "0966778899",
    address: "Long Biên, Hà Nội",
    bio: "Data Analyst 3 năm kinh nghiệm phân tích dữ liệu kinh doanh cho fintech và e-commerce. Thành thạo Python, SQL và Power BI. Hiện đang nghiên cứu thêm machine learning để mở rộng khả năng phân tích.",
    skills: [
      "Python",
      "SQL",
      "Power BI",
      "Tableau",
      "Excel",
      "Statistics",
      "ETL",
      "A/B Testing",
    ],
  },
  {
    email: "dothihuong@gmail.com",
    fullName: "Đỗ Thị Hương",
    phone: "0977889900",
    address: "Quận 7, TP. Hồ Chí Minh",
    bio: "Chuyên viên tư vấn tài chính cá nhân với chứng chỉ CFP và 5 năm kinh nghiệm tại ngân hàng. Có kiến thức sâu về sản phẩm ngân hàng, bảo hiểm nhân thọ, quỹ đầu tư và lập kế hoạch tài chính.",
    skills: [
      "Financial Planning",
      "Investment Advisory",
      "Insurance",
      "CFP",
      "Banking Products",
      "KYC",
      "AML",
    ],
  },
  {
    email: "nguyenhuuphuc@gmail.com",
    fullName: "Nguyễn Hữu Phúc",
    phone: "0988990011",
    address: "Sơn Trà, Đà Nẵng",
    bio: "Kỹ sư DevOps 4 năm kinh nghiệm xây dựng và vận hành hạ tầng cloud. Kinh nghiệm với AWS, GCP, Kubernetes và các công cụ CI/CD. Thế mạnh trong tối ưu chi phí cloud và cải thiện độ tin cậy hệ thống.",
    skills: [
      "AWS",
      "GCP",
      "Kubernetes",
      "Docker",
      "Terraform",
      "CI/CD",
      "Linux",
      "Monitoring",
      "Ansible",
    ],
  },
  {
    email: "buithithuytien@gmail.com",
    fullName: "Bùi Thị Thùy Tiên",
    phone: "0999001122",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "Chuyên viên quan hệ công chúng 4 năm kinh nghiệm trong PR và truyền thông doanh nghiệp. Quản lý nhiều chiến dịch PR thành công cho FMCG, bất động sản và công nghệ. Mạng lưới báo chí và truyền thông rộng.",
    skills: [
      "PR Strategy",
      "Media Relations",
      "Crisis Management",
      "Press Release",
      "Event Management",
      "Storytelling",
    ],
  },
  {
    email: "tranvankhanh@gmail.com",
    fullName: "Trần Văn Khánh",
    phone: "0900112233",
    address: "Ba Đình, Hà Nội",
    bio: "Business Analyst 5 năm kinh nghiệm tại công ty phần mềm và ngân hàng. Khả năng thu thập yêu cầu, phân tích quy trình nghiệp vụ và viết tài liệu đặc tả kỹ thuật rõ ràng. Thành thạo Agile/Scrum.",
    skills: [
      "Business Analysis",
      "Requirements Gathering",
      "BPMN",
      "UML",
      "Agile",
      "Scrum",
      "JIRA",
      "SQL",
    ],
  },
  {
    email: "phamthinghiem@gmail.com",
    fullName: "Phạm Thị Nghiêm",
    phone: "0911223344",
    address: "Ngũ Hành Sơn, Đà Nẵng",
    bio: "Giáo viên tiếng Anh với bằng TESOL và 6 năm kinh nghiệm tại trung tâm anh ngữ và trường quốc tế. Có kinh nghiệm dạy IELTS, TOEIC và Business English. Tìm cơ hội chuyển sang L&D doanh nghiệp.",
    skills: [
      "TESOL",
      "IELTS Training",
      "Business English",
      "Curriculum Design",
      "E-learning",
      "Facilitation",
    ],
  },
  {
    email: "lethanhlong@gmail.com",
    fullName: "Lê Thành Long",
    phone: "0922334455",
    address: "Tân Bình, TP. Hồ Chí Minh",
    bio: "Kỹ sư AI/ML 3 năm kinh nghiệm triển khai mô hình học máy trong NLP và computer vision. Thành thạo TensorFlow, PyTorch. Đã publish paper nghiên cứu và tham gia các cuộc thi AI trên Kaggle.",
    skills: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "NLP",
      "Computer Vision",
      "MLOps",
      "Scikit-learn",
      "Transformers",
    ],
  },
  {
    email: "nguyenthithuy@gmail.com",
    fullName: "Nguyễn Thị Thúy",
    phone: "0933556677",
    address: "Cầu Giấy, Hà Nội",
    bio: "Chuyên viên kiểm toán 4 năm kinh nghiệm tại Big 4. Thành thạo IFRS và VAS. Đang theo học ACCA và mong muốn phát triển lên Senior Auditor. Cẩn thận, tỉ mỉ và có khả năng làm việc dưới áp lực cao.",
    skills: [
      "External Audit",
      "IFRS",
      "VAS",
      "Financial Reporting",
      "Risk-based Audit",
      "Excel",
      "ACCA",
    ],
  },
  {
    email: "dongocson@gmail.com",
    fullName: "Đỗ Ngọc Sơn",
    phone: "0944667788",
    address: "Hải Châu, Đà Nẵng",
    bio: "Kỹ sư phần mềm full-stack 3 năm kinh nghiệm với React và Node.js. Đam mê xây dựng sản phẩm từ đầu đến cuối và quan tâm đến trải nghiệm người dùng. Có kinh nghiệm làm việc trong môi trường startup.",
    skills: [
      "React",
      "Node.js",
      "TypeScript",
      "MongoDB",
      "Docker",
      "AWS",
      "REST API",
      "GraphQL",
    ],
  },
  {
    email: "vuanhthu@gmail.com",
    fullName: "Vũ Anh Thư",
    phone: "0955778899",
    address: "Quận 2, TP. Hồ Chí Minh",
    bio: "Chuyên viên phân tích tín dụng 3 năm kinh nghiệm tại ngân hàng. Thành thạo phân tích báo cáo tài chính và mô hình tín dụng. Đang học CFA Level 2 và mong muốn phát triển trong lĩnh vực đầu tư.",
    skills: [
      "Credit Analysis",
      "Financial Statement Analysis",
      "Risk Assessment",
      "Excel",
      "Financial Modeling",
      "CFA",
    ],
  },
  {
    email: "nguyenvanhung@gmail.com",
    fullName: "Nguyễn Văn Hùng",
    phone: "0966889900",
    address: "Thủ Đức, TP. Hồ Chí Minh",
    bio: "Kỹ sư mobile (iOS & Android) 4 năm kinh nghiệm. Thành thạo Swift và Kotlin. Đã publish nhiều ứng dụng lên App Store và Google Play. Đang tìm kiếm công ty sản phẩm để phát triển lâu dài.",
    skills: [
      "Swift",
      "Kotlin",
      "iOS",
      "Android",
      "React Native",
      "Firebase",
      "REST API",
      "Git",
    ],
  },
  {
    email: "linhthinhung@gmail.com",
    fullName: "Linh Thị Nhung",
    phone: "0977990011",
    address: "Hoàng Mai, Hà Nội",
    bio: "Chuyên viên nhân sự tổng hợp 4 năm kinh nghiệm. Thành thạo quy trình tuyển dụng, lương thưởng, bảo hiểm và phúc lợi. Có kiến thức vững về Bộ luật Lao động và muốn phát triển theo hướng HRBP.",
    skills: [
      "Recruitment",
      "Payroll",
      "Labor Law",
      "HRIS",
      "Employee Relations",
      "Training",
      "Performance Management",
    ],
  },
  {
    email: "caovantien@gmail.com",
    fullName: "Cao Văn Tiến",
    phone: "0988001122",
    address: "Bắc Từ Liêm, Hà Nội",
    bio: "Kỹ sư hệ thống & vận hành 5 năm kinh nghiệm trong lĩnh vực sản xuất và công nghiệp. Thành thạo quản lý dự án, kiểm soát chất lượng và tối ưu hóa quy trình sản xuất. Kinh nghiệm với các tiêu chuẩn ISO.",
    skills: [
      "Process Engineering",
      "Quality Control",
      "ISO 9001",
      "Project Management",
      "Lean Manufacturing",
      "AutoCAD",
    ],
  },
  {
    email: "ngothilananh@gmail.com",
    fullName: "Ngô Thị Lan Anh",
    phone: "0999112233",
    address: "Đống Đa, Hà Nội",
    bio: "Chuyên viên tài chính kế hoạch (FP&A) 4 năm kinh nghiệm tại doanh nghiệp đa quốc gia. Thành thạo lập kế hoạch ngân sách, phân tích phương sai và báo cáo quản trị. Thành thạo Excel và Power BI.",
    skills: [
      "FP&A",
      "Budgeting",
      "Financial Modeling",
      "Excel",
      "Power BI",
      "Management Reporting",
      "Forecasting",
    ],
  },
];

// ─── JOB TEMPLATES theo industry ─────────────────────────────────────────────
// companyIndex tương ứng với COMPANIES_DATA và RECRUITERS_DATA

const JOBS_TEMPLATES = [
  // ── FPT Software (0) ──────────────────────────────────────────────────────
  {
    title: "Kỹ sư Backend Cấp Cao (Node.js)",
    companyIndex: 0,
    location: "TP. Hồ Chí Minh",
    salary: "$2,000 - $3,500",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Node.js",
      "NestJS",
      "PostgreSQL",
      "Microservices",
      "Docker",
      "AWS",
      "TypeScript",
      "Redis",
    ],
    industry: ["Finance"],
    description:
      "FPT Software tìm kiếm Kỹ sư Backend Senior có kinh nghiệm xây dựng hệ thống microservices quy mô lớn. Bạn sẽ thiết kế và phát triển các API hiệu suất cao, tối ưu cơ sở dữ liệu và mentoring cho junior developer.\n\nYêu cầu:\n- 4+ năm kinh nghiệm với Node.js/NestJS\n- Thành thạo PostgreSQL, Redis\n- Kinh nghiệm với Docker, Kubernetes\n- Hiểu biết về Clean Architecture và SOLID\n- Thành thạo TypeScript",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương được xây dựng cạnh tranh so với thị trường quốc tế, review 2 lần/năm dựa trên hiệu suất thực tế. Ứng viên xuất sắc có thể thương lượng vượt khung.",
      },
      {
        label: "Thưởng hiệu suất",
        content:
          "Thưởng cuối năm tương đương 2-4 tháng lương tùy theo kết quả cá nhân và hiệu quả dự án. Tiêu chí đánh giá rõ ràng, minh bạch ngay từ đầu năm.",
      },
      {
        label: "Bảo hiểm sức khỏe cao cấp",
        content:
          "Gói bảo hiểm sức khỏe cao cấp cho cả nhân viên và người thân, bao gồm nội trú, ngoại trú và nha khoa. Mức bảo hiểm vượt trội so với quy định nhà nước.",
      },
      {
        label: "Budget học tập $500/năm",
        content:
          "Mỗi kỹ sư được cấp ngân sách $500/năm để tự chủ đầu tư vào khóa học, sách kỹ thuật hoặc hội nghị chuyên ngành. Công ty khuyến khích học tập liên tục và chia sẻ kiến thức nội bộ.",
      },
      {
        label: "Hybrid 2 ngày/tuần",
        content:
          "Linh hoạt làm việc từ xa 2 ngày mỗi tuần, giúp cân bằng công việc và cuộc sống cá nhân. Văn phòng hiện đại được trang bị đầy đủ thiết bị cho những ngày làm tại chỗ.",
      },
      {
        label: "MacBook Pro được cấp",
        content:
          "Công ty trang bị MacBook Pro mới nhất để đảm bảo hiệu suất làm việc tối đa. Thiết bị được nâng cấp định kỳ theo chu kỳ 2-3 năm.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm Node.js/NestJS",
        content:
          "Tối thiểu 4 năm kinh nghiệm thực tế với Node.js và NestJS, đã từng xây dựng và vận hành hệ thống API trong môi trường production quy mô lớn. Hiểu sâu về vòng đời request, middleware và dependency injection.",
      },
      {
        label: "Cơ sở dữ liệu & Cache",
        content:
          "Thành thạo PostgreSQL bao gồm query optimization, index design và transaction management. Có kinh nghiệm sử dụng Redis cho caching, session và pub/sub trong hệ thống phân tán.",
      },
      {
        label: "Container & Orchestration",
        content:
          "Kinh nghiệm với Docker để đóng gói ứng dụng và Kubernetes để triển khai, scale hệ thống microservices. Hiểu biết về CI/CD pipeline và quản lý môi trường cloud.",
      },
      {
        label: "Kiến trúc phần mềm",
        content:
          "Hiểu biết vững về Clean Architecture, SOLID principles và các design pattern thường dùng trong backend. Có khả năng đưa ra quyết định kiến trúc và review code cho các thành viên trong nhóm.",
      },
      {
        label: "TypeScript",
        content:
          "Thành thạo TypeScript, sử dụng hệ thống kiểu dữ liệu hiệu quả để viết code an toàn và dễ bảo trì hơn. Quen thuộc với các pattern nâng cao như generic, decorator và type guard.",
      },
    ],
    slots: 3,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Lập trình viên Frontend (React/Next.js)",
    companyIndex: 0,
    location: "Remote",
    salary: "$1,500 - $2,500",
    type: "REMOTE",
    level: "Middle",
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Redux",
      "Figma",
      "Jest",
      "Performance Optimization",
    ],
    industry: ["Sales"],
    description:
      "Vị trí Frontend Developer remote, tham gia phát triển sản phẩm web cho khách hàng quốc tế. Bạn sẽ làm việc chặt chẽ với đội design và backend để xây dựng giao diện chất lượng cao.\n\nYêu cầu:\n- 2+ năm với React, Next.js\n- Thành thạo TypeScript, Tailwind CSS\n- Kinh nghiệm với state management\n- Khả năng đọc hiểu Figma\n- Tiếng Anh giao tiếp tốt",
    benefits: [
      {
        label: "Hoàn toàn remote",
        content:
          "Vị trí này cho phép làm việc 100% từ xa, không giới hạn địa điểm trong lãnh thổ Việt Nam. Đội ngũ giao tiếp qua Slack và họp online định kỳ để duy trì sự kết nối.",
      },
      {
        label: "Thiết bị làm việc được cấp",
        content:
          "Công ty cung cấp laptop và các thiết bị ngoại vi cần thiết để đảm bảo năng suất làm việc tại nhà. Nhân viên có thể đề xuất thêm thiết bị tùy theo nhu cầu công việc thực tế.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao gồm khám chữa bệnh nội và ngoại trú tại các bệnh viện liên kết trên toàn quốc. Nhân viên không cần lo lắng về chi phí y tế thông thường.",
      },
      {
        label: "13 tháng lương",
        content:
          "Ngoài 12 tháng lương cơ bản, nhân viên nhận thêm 1 tháng lương thưởng vào cuối năm như một phần phúc lợi cố định. Điều này giúp ổn định tài chính cá nhân và ghi nhận sự cống hiến xuyên suốt năm.",
      },
      {
        label: "Flexible working hours",
        content:
          "Lịch làm việc linh hoạt, không bắt buộc giờ cố định miễn đảm bảo đủ số giờ làm và tham gia các buổi họp quan trọng. Điều này phù hợp với nhân viên có múi giờ khác nhau hoặc lịch sinh hoạt cá nhân đặc thù.",
      },
      {
        label: "Phụ cấp điện/internet",
        content:
          "Công ty hỗ trợ chi phí điện và internet hàng tháng để bù đắp chi phí làm việc tại nhà. Mức hỗ trợ được tính toán hợp lý và thanh toán cùng kỳ lương.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm React/Next.js",
        content:
          "Tối thiểu 2 năm kinh nghiệm phát triển giao diện với React và Next.js, bao gồm cả SSR lẫn CSR. Quen thuộc với các hooks phổ biến và khả năng tự xây dựng custom hook khi cần.",
      },
      {
        label: "TypeScript & Styling",
        content:
          "Thành thạo TypeScript và Tailwind CSS để xây dựng component có kiểu dữ liệu rõ ràng và giao diện nhất quán. Biết áp dụng responsive design và xử lý các breakpoint phức tạp.",
      },
      {
        label: "State Management",
        content:
          "Có kinh nghiệm với ít nhất một giải pháp quản lý state như Redux Toolkit, Zustand hoặc React Query. Hiểu rõ khi nào nên dùng local state và khi nào cần global state.",
      },
      {
        label: "Đọc hiểu Figma",
        content:
          "Có khả năng đọc và triển khai thiết kế từ Figma một cách chính xác, bao gồm spacing, typography và animation. Biết chủ động phối hợp với designer để làm rõ các chi tiết UI còn mơ hồ.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh đủ để đọc tài liệu kỹ thuật và giao tiếp cơ bản qua email hoặc Slack với khách hàng quốc tế. Khả năng viết comment và document code bằng tiếng Anh rõ ràng.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Kỹ sư DevOps",
    companyIndex: 0,
    location: "TP. Hồ Chí Minh",
    salary: "$2,000 - $3,000",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "AWS",
      "Kubernetes",
      "Terraform",
      "CI/CD",
      "Docker",
      "Linux",
      "Monitoring",
      "Ansible",
    ],
    industry: ["Finance"],
    description:
      "Tìm kiếm DevOps Engineer có kinh nghiệm vận hành và tối ưu hóa hạ tầng cloud cho các dự án outsourcing quy mô lớn.\n\nYêu cầu:\n- 3+ năm kinh nghiệm DevOps/SRE\n- Thành thạo AWS hoặc GCP\n- Kinh nghiệm với Kubernetes, Terraform\n- Hiểu biết về bảo mật hệ thống\n- Kỹ năng scripting (Bash, Python)",
    benefits: [
      {
        label: "Lương hấp dẫn",
        content:
          "Mức lương được xây dựng hấp dẫn so với mặt bằng chung thị trường DevOps tại Việt Nam, phù hợp với kinh nghiệm và kỹ năng thực tế của từng ứng viên. Được review định kỳ 6 tháng một lần.",
      },
      {
        label: "AWS/GCP certification tài trợ",
        content:
          "Công ty chi trả toàn bộ chi phí thi lấy chứng chỉ AWS hoặc GCP, bao gồm phí thi và tài liệu ôn tập. Nhân viên được khuyến khích nâng cấp chứng chỉ lên cấp cao hơn theo lộ trình phát triển.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe bao phủ toàn diện cho nhân viên và một người thân trực tiếp. Chi phí khám chữa bệnh, nằm viện và phẫu thuật đều được bảo hiểm thanh toán đáng kể.",
      },
      {
        label: "On-call allowance",
        content:
          "Nhân viên nhận phụ cấp trực on-call hàng tháng khi phụ trách hỗ trợ hệ thống ngoài giờ hành chính. Mức phụ cấp rõ ràng và được tính thêm khi có sự cố thực tế phát sinh.",
      },
      {
        label: "Laptop cao cấp",
        content:
          "Được cấp laptop cấu hình cao phù hợp với công việc quản lý hạ tầng và chạy nhiều công cụ DevOps đồng thời. Nhân viên có thể chọn theo nhu cầu giữa MacBook và ThinkPad theo danh mục công ty.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm DevOps/SRE",
        content:
          "Tối thiểu 3 năm kinh nghiệm trong vai trò DevOps hoặc SRE, đã vận hành hệ thống production có độ sẵn sàng cao. Quen thuộc với quy trình incident management và post-mortem analysis.",
      },
      {
        label: "Cloud Platform",
        content:
          "Thành thạo AWS hoặc GCP ở mức có thể thiết kế kiến trúc cloud tối ưu về chi phí và hiệu suất. Hiểu rõ các dịch vụ compute, networking, storage và security của nền tảng đang dùng.",
      },
      {
        label: "Kubernetes & Terraform",
        content:
          "Có kinh nghiệm triển khai và quản lý cluster Kubernetes trong môi trường production. Sử dụng Terraform để quản lý hạ tầng dưới dạng code, đảm bảo tính nhất quán và tái sử dụng được.",
      },
      {
        label: "Bảo mật hệ thống",
        content:
          "Hiểu biết về các nguyên tắc bảo mật cloud như IAM, network policy, secret management và vulnerability scanning. Có kinh nghiệm tích hợp security vào pipeline CI/CD theo mô hình DevSecOps.",
      },
      {
        label: "Scripting",
        content:
          "Thành thạo Bash scripting để tự động hóa tác vụ vận hành và Python để xây dựng công cụ nội bộ. Quen viết script rõ ràng, có xử lý lỗi và dễ bảo trì về lâu dài.",
      },
    ],
    slots: 2,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Quản lý Dự án CNTT (IT Project Manager)",
    companyIndex: 0,
    location: "TP. Hồ Chí Minh",
    salary: "$2,500 - $4,000",
    type: "FULL_TIME",
    level: "Manager",
    tags: [
      "Project Management",
      "PMP",
      "Agile",
      "Scrum",
      "Budget Management",
      "Client Communication",
      "IT Outsourcing",
    ],
    industry: ["IT"],
    description:
      "FPT Software tìm IT Project Manager để quản lý các dự án outsourcing quy mô lớn cho khách hàng Nhật Bản và Mỹ. Bạn sẽ chịu trách nhiệm về tiến độ, chất lượng và ngân sách dự án.\n\nYêu cầu:\n- 5+ năm kinh nghiệm quản lý dự án IT\n- Chứng chỉ PMP hoặc PMI-ACP\n- Tiếng Anh thành thạo\n- Tiếng Nhật N2 là lợi thế",
    benefits: [
      {
        label: "Lương cao theo năng lực",
        content:
          "Mức lương được xây dựng linh hoạt và cạnh tranh dựa trên kinh nghiệm thực tế, chứng chỉ chuyên môn và kết quả công việc. Không có trần cứng – ứng viên giỏi sẽ được trả tương xứng.",
      },
      {
        label: "Project completion bonus",
        content:
          "Ngoài lương cơ bản, Project Manager nhận thưởng hoàn thành dự án khi bàn giao đúng tiến độ, đúng ngân sách và đạt sự hài lòng của khách hàng. Đây là động lực lớn để duy trì chất lượng xuyên suốt dự án.",
      },
      {
        label: "PMP renewal sponsored",
        content:
          "Công ty tài trợ toàn bộ chi phí gia hạn chứng chỉ PMP theo chu kỳ 3 năm, bao gồm phí PDU và các khóa đào tạo liên quan. Điều này giúp PM luôn cập nhật chuẩn quản lý dự án quốc tế.",
      },
      {
        label: "Bảo hiểm sức khỏe cao cấp",
        content:
          "Gói bảo hiểm cao cấp bao gồm khám chữa bệnh, nha khoa, nhãn khoa và hỗ trợ sức khỏe tâm thần cho cả nhân viên và gia đình. Mức bảo hiểm được nâng cấp theo cấp bậc trong tổ chức.",
      },
      {
        label: "MacBook Pro",
        content:
          "PM được trang bị MacBook Pro để phục vụ công việc quản lý dự án, họp video và làm tài liệu chuyên nghiệp. Thiết bị được nâng cấp theo chu kỳ để đảm bảo hiệu suất tốt nhất.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm quản lý dự án IT",
        content:
          "Tối thiểu 5 năm kinh nghiệm quản lý dự án phần mềm, đã dẫn dắt ít nhất 2-3 dự án outsourcing có quy mô từ 10 người trở lên. Quen thuộc với quản lý rủi ro, scope và timeline trong môi trường áp lực.",
      },
      {
        label: "Chứng chỉ PMP/PMI-ACP",
        content:
          "Bắt buộc có chứng chỉ PMP hoặc PMI-ACP còn hiệu lực, thể hiện năng lực quản lý dự án theo chuẩn quốc tế. Ứng viên có cả hai chứng chỉ hoặc kết hợp với Agile/Scrum là lợi thế lớn.",
      },
      {
        label: "Tiếng Anh thành thạo",
        content:
          "Tiếng Anh thành thạo cả bốn kỹ năng để giao tiếp trực tiếp với khách hàng Mỹ, viết tài liệu dự án và điều hành họp quốc tế. Khả năng trình bày báo cáo rõ ràng và thuyết phục là yếu tố quan trọng.",
      },
      {
        label: "Tiếng Nhật N2",
        content:
          "Tiếng Nhật N2 trở lên là lợi thế lớn khi làm việc với khách hàng Nhật Bản, giúp giảm rào cản giao tiếp và xây dựng niềm tin nhanh hơn. Ứng viên có chứng chỉ JLPT N2 sẽ được ưu tiên trong vòng phỏng vấn.",
      },
    ],
    slots: 3,
    isHot: true,
    statusVariant: "published_near",
  },
  {
    title: "Thực tập sinh Phát triển Phần mềm",
    companyIndex: 0,
    location: "Đà Nẵng",
    salary: "5tr - 8tr",
    type: "INTERNSHIP",
    level: "Intern",
    tags: [
      "Java",
      "Python",
      "Git",
      "Agile",
      "REST API",
      "Problem Solving",
      "Teamwork",
    ],
    industry: ["Sales"],
    description:
      "Chương trình thực tập 6 tháng dành cho sinh viên CNTT năm 3-4. Bạn sẽ tham gia các dự án thực tế với mentor support đầy đủ.\n\nYêu cầu:\n- Sinh viên năm 3-4 ngành CNTT\n- Biết lập trình Java hoặc Python cơ bản\n- Ham học hỏi và chịu khó",
    benefits: [
      {
        label: "Thực tập có lương",
        content:
          "Thực tập sinh nhận mức lương hàng tháng cạnh tranh so với thị trường, không làm việc miễn phí. Mức lương được xem xét tăng nếu thực tập sinh thể hiện xuất sắc trong quá trình làm việc.",
      },
      {
        label: "Mentor từ senior engineer",
        content:
          "Mỗi thực tập sinh được ghép cặp với một Senior Engineer giàu kinh nghiệm để hướng dẫn kỹ thuật và định hướng nghề nghiệp. Mentor check-in định kỳ hàng tuần để theo dõi tiến độ và giải đáp thắc mắc.",
      },
      {
        label: "Làm dự án thực tế",
        content:
          "Thực tập sinh tham gia trực tiếp vào các dự án khách hàng thực tế, không phải làm bài tập giả định. Đây là cơ hội quý giá để tích lũy kinh nghiệm production thực sự ngay từ khi còn đi học.",
      },
      {
        label: "Certificate hoàn thành",
        content:
          "Sau khi hoàn thành chương trình, thực tập sinh nhận chứng chỉ xác nhận từ FPT Software có giá trị cao trong hồ sơ xin việc. Chứng chỉ ghi rõ dự án đã tham gia và kỹ năng đã đạt được.",
      },
      {
        label: "Cơ hội offer full-time",
        content:
          "Thực tập sinh xuất sắc sẽ được xem xét offer nhân viên chính thức ngay sau khi tốt nghiệp, bỏ qua vòng tuyển dụng thông thường. Đây là con đường nhanh nhất để gia nhập FPT Software với vai trò Junior Developer.",
      },
    ],
    requirements: [
      {
        label: "Sinh viên CNTT năm 3-4",
        content:
          "Đang theo học năm thứ 3 hoặc năm 4 tại các trường đại học chuyên ngành Công nghệ Thông tin, Kỹ thuật phần mềm hoặc các ngành liên quan. Ưu tiên sinh viên đã hoàn thành ít nhất các môn học cơ sở về lập trình và cấu trúc dữ liệu.",
      },
      {
        label: "Lập trình Java hoặc Python",
        content:
          "Biết lập trình cơ bản với Java hoặc Python ở mức có thể viết các chương trình đơn giản, xử lý dữ liệu và gọi API. Không cần kinh nghiệm production nhưng cần hiểu rõ logic lập trình hướng đối tượng.",
      },
      {
        label: "Ham học hỏi và chịu khó",
        content:
          "Thái độ tích cực, sẵn sàng tiếp thu kiến thức mới và không ngại đặt câu hỏi khi gặp khó khăn. Đây là yếu tố quan trọng nhất mà đội ngũ mentor FPT đánh giá cao hơn cả điểm số.",
      },
    ],
    slots: 10,
    isHot: false,
    statusVariant: "published_past",
  },

  // ── Vietcombank (1) ──────────────────────────────────────────────────────────
  {
    title: "Chuyên viên Quan hệ Khách hàng Doanh nghiệp",
    companyIndex: 1,
    location: "Hà Nội",
    salary: "22tr - 33tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Corporate Banking",
      "Relationship Management",
      "Credit Analysis",
      "Trade Finance",
      "Cross-selling",
    ],
    industry: ["Sales"],
    description:
      "Vietcombank tìm Chuyên viên QHKH Doanh nghiệp phụ trách quản lý và phát triển danh mục khách hàng doanh nghiệp vừa và lớn.\n\nYêu cầu:\n- 3+ năm kinh nghiệm corporate banking\n- Hiểu biết sâu về phân tích tín dụng\n- Kinh nghiệm với trade finance, cash management\n- Kỹ năng thuyết trình và đàm phán tốt",
    benefits: [
      {
        label: "Lương cơ bản cao",
        content:
          "Mức lương cơ bản thuộc top đầu hệ thống ngân hàng thương mại nhà nước, cạnh tranh với khối tư nhân. Được điều chỉnh hàng năm theo hiệu suất cá nhân và kết quả kinh doanh của chi nhánh.",
      },
      {
        label: "Hoa hồng theo danh mục",
        content:
          "Chuyên viên nhận hoa hồng hấp dẫn dựa trên quy mô và chất lượng danh mục khách hàng doanh nghiệp quản lý. Mức hoa hồng không giới hạn trần, khuyến khích phát triển danh mục bền vững dài hạn.",
      },
      {
        label: "Bảo hiểm cao cấp toàn gia đình",
        content:
          "Gói bảo hiểm sức khỏe cao cấp được mở rộng cho cả vợ/chồng và con cái, bao gồm khám nội trú, ngoại trú và nha khoa. Đây là phúc lợi vượt trội mà ít tổ chức nào trong ngành cung cấp được.",
      },
      {
        label: "Vay ưu đãi nhân viên",
        content:
          "Nhân viên Vietcombank được vay mua nhà, mua xe với lãi suất ưu đãi đặc biệt thấp hơn thị trường đáng kể. Hạn mức và điều kiện ưu đãi tốt hơn rất nhiều so với khách hàng thông thường.",
      },
      {
        label: "Du lịch hàng năm",
        content:
          "Chương trình du lịch nghỉ dưỡng trong và ngoài nước được tổ chức hàng năm cho toàn bộ nhân viên đạt KPI. Đây là dịp gắn kết đội ngũ và ghi nhận những đóng góp xuất sắc trong năm qua.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm corporate banking",
        content:
          "Tối thiểu 3 năm kinh nghiệm làm việc trong mảng ngân hàng doanh nghiệp, đã trực tiếp quản lý danh mục khách hàng có dư nợ từ 50 tỷ trở lên. Hiểu rõ quy trình cấp tín dụng, phê duyệt và giám sát sau giải ngân.",
      },
      {
        label: "Phân tích tín dụng",
        content:
          "Thành thạo phân tích báo cáo tài chính doanh nghiệp, đánh giá rủi ro tín dụng và lập tờ trình cấp tín dụng theo chuẩn ngân hàng. Có khả năng nhận diện các dấu hiệu cảnh báo rủi ro sớm trong hồ sơ khách hàng.",
      },
      {
        label: "Trade Finance & Cash Management",
        content:
          "Có kinh nghiệm tư vấn và xử lý các sản phẩm tài trợ thương mại như L/C, bảo lãnh ngân hàng, chiết khấu bộ chứng từ. Hiểu biết về giải pháp quản lý dòng tiền và thanh toán doanh nghiệp.",
      },
      {
        label: "Thuyết trình và đàm phán",
        content:
          "Kỹ năng thuyết trình chuyên nghiệp trước ban lãnh đạo doanh nghiệp và đàm phán điều kiện tín dụng hiệu quả. Khả năng xây dựng mối quan hệ bền vững với khách hàng doanh nghiệp ở cấp độ C-level.",
      },
    ],
    slots: 5,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Phân tích Tín dụng Bán lẻ",
    companyIndex: 1,
    location: "TP. Hồ Chí Minh",
    salary: "18tr - 30tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Credit Analysis",
      "Financial Statement Analysis",
      "Risk Assessment",
      "Loan Structuring",
      "Excel",
    ],
    industry: ["Marketing"],
    description:
      "Tìm Chuyên viên Phân tích Tín dụng để thẩm định hồ sơ vay vốn của khách hàng cá nhân và doanh nghiệp nhỏ.\n\nYêu cầu:\n- 2+ năm kinh nghiệm phân tích tín dụng\n- Thành thạo phân tích báo cáo tài chính\n- Kỹ năng Excel tốt",
    benefits: [
      {
        label: "Lương hấp dẫn",
        content:
          "Mức lương cạnh tranh trong hệ thống ngân hàng, được xây dựng dựa trên năng lực và kinh nghiệm thực tế của ứng viên. Được xem xét điều chỉnh tăng theo kết quả đánh giá hàng năm.",
      },
      {
        label: "Thưởng hiệu suất cuối năm",
        content:
          "Thưởng cuối năm được tính dựa trên hiệu suất cá nhân và kết quả kinh doanh chung của đơn vị. Nhân viên xuất sắc có thể nhận mức thưởng tương đương 1-3 tháng lương.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Được tham gia gói bảo hiểm sức khỏe bổ sung ngoài bảo hiểm xã hội bắt buộc, hỗ trợ chi phí khám chữa bệnh tại các bệnh viện chất lượng. Quyền lợi bảo hiểm tăng dần theo thâm niên làm việc.",
      },
      {
        label: "Vay ưu đãi nhân viên",
        content:
          "Nhân viên được tiếp cận các gói vay tiêu dùng, mua nhà và mua xe với lãi suất ưu đãi đặc biệt dành riêng cho nội bộ. Thủ tục đơn giản và được ưu tiên xét duyệt nhanh.",
      },
      {
        label: "Đào tạo chuyên sâu",
        content:
          "Tham gia các khóa đào tạo nghiệp vụ tín dụng nội bộ và bên ngoài do ngân hàng tài trợ hoàn toàn. Lộ trình đào tạo bài bản giúp nâng cao năng lực phân tích và thăng tiến trong sự nghiệp ngân hàng.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm phân tích tín dụng",
        content:
          "Tối thiểu 2 năm kinh nghiệm thẩm định hồ sơ tín dụng cá nhân hoặc doanh nghiệp nhỏ tại tổ chức tín dụng. Đã xử lý đa dạng loại hình vay như vay mua nhà, vay kinh doanh và thẻ tín dụng.",
      },
      {
        label: "Phân tích báo cáo tài chính",
        content:
          "Thành thạo đọc và phân tích báo cáo tài chính để đánh giá khả năng trả nợ và sức khỏe tài chính của khách hàng. Có khả năng phát hiện các điểm bất thường trong số liệu tài chính được cung cấp.",
      },
      {
        label: "Kỹ năng Excel",
        content:
          "Sử dụng Excel thành thạo để xây dựng mô hình tài chính, tính toán các chỉ số tín dụng và lập báo cáo phân tích. Biết dùng các hàm phức tạp và pivot table để xử lý dữ liệu khách hàng hiệu quả.",
      },
    ],
    slots: 8,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Giao dịch viên",
    companyIndex: 1,
    location: "Hà Nội",
    salary: "12tr - 18tr",
    type: "FULL_TIME",
    level: "Junior",
    tags: [
      "Teller",
      "Banking Products",
      "Cash Management",
      "Customer Service",
      "KYC",
    ],
    industry: ["IT"],
    description:
      "Tuyển Giao dịch viên tại các chi nhánh Vietcombank khu vực Hà Nội. Phù hợp cho người mới ra trường muốn xây dựng sự nghiệp ngân hàng.\n\nYêu cầu:\n- Tốt nghiệp Đại học (ưu tiên Kinh tế, Tài chính)\n- Ngoại hình sáng sủa, giao tiếp tốt\n- Cẩn thận và có trách nhiệm cao",
    benefits: [
      {
        label: "Lương cơ bản + thưởng",
        content:
          "Mức lương cơ bản ổn định cộng thêm thưởng theo KPI dịch vụ hàng quý, giúp thu nhập thực tế cao hơn mức khởi điểm. Thưởng được tính rõ ràng dựa trên chỉ tiêu chất lượng và số lượng giao dịch.",
      },
      {
        label: "Bảo hiểm xã hội đầy đủ",
        content:
          "Được đóng đầy đủ bảo hiểm xã hội, bảo hiểm y tế và bảo hiểm thất nghiệp theo quy định nhà nước ngay từ ngày đầu nhận việc. Đây là nền tảng an sinh xã hội quan trọng cho người mới bắt đầu sự nghiệp.",
      },
      {
        label: "Đào tạo nghiệp vụ bài bản",
        content:
          "Được tham gia chương trình đào tạo giao dịch viên chuyên nghiệp do Vietcombank tổ chức trước khi chính thức ngồi quầy. Đào tạo liên tục về sản phẩm mới, quy trình và kỹ năng chăm sóc khách hàng.",
      },
      {
        label: "Môi trường chuyên nghiệp",
        content:
          "Làm việc trong môi trường ngân hàng lớn nhất Việt Nam với văn hóa làm việc chuyên nghiệp, kỷ luật và ổn định. Có nhiều cơ hội thăng tiến nội bộ lên các vị trí chuyên viên sau khi tích lũy kinh nghiệm.",
      },
    ],
    requirements: [
      {
        label: "Bằng đại học",
        content:
          "Tốt nghiệp đại học hệ chính quy, ưu tiên các ngành Kinh tế, Tài chính, Ngân hàng hoặc Kế toán. GPA từ 2.5 trở lên, không có tiền án tiền sự và đảm bảo tư cách pháp lý làm việc trong ngành ngân hàng.",
      },
      {
        label: "Ngoại hình và giao tiếp",
        content:
          "Ngoại hình sáng sủa, gọn gàng và chuyên nghiệp khi tiếp xúc với khách hàng tại quầy giao dịch. Kỹ năng giao tiếp tốt, giọng nói rõ ràng và thái độ niềm nở, kiên nhẫn trong mọi tình huống.",
      },
      {
        label: "Cẩn thận và trách nhiệm",
        content:
          "Tính cẩn thận và chính xác cao trong xử lý tiền mặt và chứng từ giao dịch, tuân thủ nghiêm ngặt quy trình kiểm soát nội bộ. Có tinh thần trách nhiệm cao và trung thực trong công việc liên quan đến tài sản khách hàng.",
      },
    ],
    slots: 20,
    isHot: false,
    statusVariant: "closed",
  },

  // ── Shopee (2) ───────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Mobile (React Native)",
    companyIndex: 2,
    location: "TP. Hồ Chí Minh",
    salary: "$2,000 - $3,500",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "React Native",
      "iOS",
      "Android",
      "TypeScript",
      "Redux",
      "Performance Optimization",
      "Fastlane",
    ],
    industry: ["IT"],
    description:
      "Shopee tìm Mobile Developer tài năng để phát triển ứng dụng di động phục vụ hàng triệu người dùng Đông Nam Á.\n\nYêu cầu:\n- 3+ năm kinh nghiệm React Native\n- Kinh nghiệm tối ưu hiệu suất ứng dụng\n- Hiểu biết về native iOS và Android\n- Thành thạo TypeScript",
    benefits: [
      {
        label: "Mức lương top thị trường",
        content:
          "Shopee trả lương ở mức top 20% thị trường để thu hút và giữ chân những kỹ sư mobile giỏi nhất. Mức lương được benchmark định kỳ với dữ liệu thị trường để đảm bảo luôn cạnh tranh.",
      },
      {
        label: "Annual bonus + Performance bonus",
        content:
          "Ngoài thưởng cuối năm cố định, nhân viên còn nhận performance bonus dựa trên kết quả dự án và đánh giá cá nhân. Hai nguồn thưởng này kết hợp có thể bổ sung đáng kể vào thu nhập tổng năm.",
      },
      {
        label: "Bảo hiểm sức khỏe cao cấp",
        content:
          "Gói bảo hiểm sức khỏe toàn diện do Shopee chi trả hoàn toàn, bao gồm nội trú, ngoại trú, nha khoa và cả hỗ trợ sức khỏe tâm thần. Áp dụng ngay từ ngày đầu tiên nhận việc.",
      },
      {
        label: "Free lunch tại văn phòng",
        content:
          "Căng-tin nội bộ phục vụ bữa trưa miễn phí với thực đơn đa dạng và đảm bảo dinh dưỡng cho nhân viên. Đây giúp tiết kiệm đáng kể chi phí sinh hoạt hàng ngày.",
      },
      {
        label: "Learning budget $1,500/năm",
        content:
          "Mỗi kỹ sư được cấp ngân sách học tập $1,500/năm để đầu tư vào khóa học, hội nghị kỹ thuật hoặc sách chuyên ngành. Shopee tạo điều kiện tối đa để kỹ sư liên tục phát triển kỹ năng.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm React Native",
        content:
          "Tối thiểu 3 năm kinh nghiệm phát triển ứng dụng di động với React Native, đã publish ít nhất một ứng dụng lên App Store và Google Play. Quen thuộc với vòng đời phát triển ứng dụng từ thiết kế đến release.",
      },
      {
        label: "Tối ưu hiệu suất",
        content:
          "Có kinh nghiệm profiling và tối ưu hiệu suất ứng dụng, giảm thời gian load, cải thiện frame rate và giảm mức tiêu thụ pin. Biết sử dụng các công cụ như Flipper, React DevTools để phân tích bottleneck.",
      },
      {
        label: "Native iOS & Android",
        content:
          "Hiểu biết đủ về native iOS và Android để viết native module khi cần và debug các vấn đề platform-specific. Không cần thành thạo Swift/Kotlin nhưng phải biết đọc và hiểu code native cơ bản.",
      },
      {
        label: "TypeScript",
        content:
          "Thành thạo TypeScript trong dự án React Native, sử dụng type system để giảm bug và cải thiện trải nghiệm phát triển. Quen thuộc với các pattern như discriminated union và generic component.",
      },
    ],
    slots: 2,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Quản lý Sản phẩm - Thương mại Điện tử",
    companyIndex: 2,
    location: "TP. Hồ Chí Minh",
    salary: "$2,500 - $4,000",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Product Management",
      "Agile",
      "User Research",
      "Data Analysis",
      "A/B Testing",
      "E-commerce",
    ],
    industry: ["Operations"],
    description:
      "Tìm kiếm Product Manager có kinh nghiệm trong mảng e-commerce để dẫn dắt phát triển các tính năng người dùng cuối.\n\nYêu cầu:\n- 4+ năm kinh nghiệm Product Management\n- Hiểu biết sâu về e-commerce\n- Thành thạo data analysis, A/B testing\n- Tiếng Anh thành thạo",
    benefits: [
      {
        label: "Competitive salary",
        content:
          "Mức lương cạnh tranh được định vị so với các công ty công nghệ hàng đầu khu vực Đông Nam Á. Shopee cam kết trả lương xứng đáng để thu hút Product Manager tài năng nhất thị trường.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên hiệu suất cá nhân và kết quả kinh doanh của sản phẩm phụ trách. PM dẫn dắt sản phẩm tăng trưởng tốt sẽ nhận mức thưởng đáng kể ngoài lương cố định.",
      },
      {
        label: "RSU cho cấp senior",
        content:
          "Restricted Stock Unit được cấp cho Product Manager cấp Senior trở lên, giúp nhân viên trực tiếp hưởng lợi từ sự tăng trưởng giá trị công ty. RSU vest theo lịch 4 năm với cliff 1 năm.",
      },
      {
        label: "Premium health insurance",
        content:
          "Gói bảo hiểm sức khỏe cao cấp bao phủ toàn diện cho cả gia đình, không giới hạn số lần khám và chi phí điều trị ở mức cao. Đây là một trong những gói bảo hiểm tốt nhất trong ngành công nghệ Việt Nam.",
      },
      {
        label: "Free lunch",
        content:
          "Bữa trưa miễn phí tại căng-tin văn phòng với nhiều lựa chọn đa dạng từ món Việt đến quốc tế. Không gian ăn uống thoải mái, cũng là nơi giao lưu và kết nối giữa các team.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm Product Management",
        content:
          "Tối thiểu 4 năm kinh nghiệm trong vai trò Product Manager, đã sở hữu và dẫn dắt ít nhất một sản phẩm hoặc tính năng từ ý tưởng đến launch thành công. Quen thuộc với agile development và làm việc chặt chẽ với engineering team.",
      },
      {
        label: "Hiểu biết về e-commerce",
        content:
          "Hiểu sâu về hành vi người mua hàng online, funnel conversion và các cơ chế vận hành của sàn thương mại điện tử. Có khả năng nhận diện cơ hội sản phẩm dựa trên dữ liệu người dùng và xu hướng thị trường.",
      },
      {
        label: "Data analysis & A/B testing",
        content:
          "Thành thạo phân tích dữ liệu để đưa ra quyết định sản phẩm dựa trên bằng chứng thực tế thay vì cảm tính. Kinh nghiệm thiết kế và phân tích A/B test để đo lường tác động của các thay đổi sản phẩm.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo để làm việc với stakeholder quốc tế, đọc nghiên cứu thị trường và viết tài liệu sản phẩm. Khả năng present rõ ràng bằng tiếng Anh trước ban lãnh đạo Shopee khu vực.",
      },
    ],
    slots: 1,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Nhà thiết kế UX/UI",
    companyIndex: 2,
    location: "TP. Hồ Chí Minh",
    salary: "$1,500 - $2,800",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "UI Design",
      "UX Research",
      "Figma",
      "Prototyping",
      "Design System",
      "User Testing",
      "Mobile Design",
    ],
    industry: ["IT"],
    description:
      "Shopee tìm UX/UI Designer cấp Senior để dẫn dắt thiết kế trải nghiệm người dùng cho các tính năng mới.\n\nYêu cầu:\n- 4+ năm kinh nghiệm UX/UI design\n- Portfolio mạnh\n- Thành thạo Figma\n- Kinh nghiệm thiết kế cho mobile app",
    benefits: [
      {
        label: "Competitive salary",
        content:
          "Mức lương cạnh tranh được xây dựng phù hợp với kinh nghiệm và độ phức tạp của sản phẩm thiết kế. Shopee định vị mức lương designer ở top đầu để đảm bảo thu hút người giỏi nhất.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên đóng góp của designer vào chất lượng sản phẩm và trải nghiệm người dùng. Hiệu suất được đo lường qua các chỉ số UX cụ thể như tỷ lệ hoàn thành luồng và CSAT.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao phủ khám chữa bệnh nội và ngoại trú, được thanh toán hoàn toàn bởi Shopee. Giúp nhân viên yên tâm tập trung vào công việc sáng tạo mà không lo chi phí y tế.",
      },
      {
        label: "Design tools license",
        content:
          "Tất cả license phần mềm thiết kế bao gồm Figma, Adobe Creative Cloud và các công cụ prototyping đều do công ty chi trả. Designer không cần bỏ tiền túi cho bất kỳ công cụ làm việc nào.",
      },
      {
        label: "Free lunch",
        content:
          "Bữa trưa miễn phí tại văn phòng giúp tiết kiệm thời gian và chi phí sinh hoạt hàng ngày. Căng-tin với nhiều lựa chọn đảm bảo designer có năng lượng để sáng tạo xuyên suốt ngày làm việc.",
      },
      {
        label: "MacBook Pro",
        content:
          "MacBook Pro với màn hình Retina sắc nét được cấp để đảm bảo trải nghiệm thiết kế tốt nhất. Máy tính được nâng cấp định kỳ để hỗ trợ các tác vụ thiết kế ngày càng phức tạp.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm UX/UI",
        content:
          "Tối thiểu 4 năm kinh nghiệm thiết kế UX/UI cho sản phẩm kỹ thuật số, đã trực tiếp sở hữu luồng thiết kế từ research đến handoff. Có khả năng cân bằng giữa tư duy người dùng và yêu cầu kinh doanh.",
      },
      {
        label: "Portfolio mạnh",
        content:
          "Portfolio thể hiện rõ quá trình tư duy thiết kế, không chỉ đơn thuần là màn hình đẹp mà còn có wireframe, user flow và kết quả đo lường thực tế. Các dự án trong portfolio ưu tiên ứng dụng có lượng người dùng lớn.",
      },
      {
        label: "Thành thạo Figma",
        content:
          "Sử dụng Figma thành thạo ở mức có thể xây dựng design system, tổ chức component library và tạo prototype có tương tác phức tạp. Biết sử dụng auto-layout, variant và dev mode để handoff hiệu quả.",
      },
      {
        label: "Thiết kế mobile app",
        content:
          "Kinh nghiệm thiết kế giao diện mobile app với hàng triệu người dùng, hiểu rõ các guideline của iOS và Android. Có khả năng tối ưu thiết kế cho nhiều kích thước màn hình và ngữ cảnh sử dụng khác nhau.",
      },
    ],
    slots: 2,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Kỹ sư Dữ liệu (Data Engineer)",
    companyIndex: 2,
    location: "TP. Hồ Chí Minh",
    salary: "$2,000 - $3,500",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Python",
      "Spark",
      "Kafka",
      "Airflow",
      "Data Warehouse",
      "ETL",
      "SQL",
      "dbt",
    ],
    industry: ["Operations"],
    description:
      "Shopee tìm Data Engineer để xây dựng và vận hành hạ tầng dữ liệu phục vụ hàng chục team analyst.\n\nYêu cầu:\n- 3+ năm kinh nghiệm data engineering\n- Thành thạo Python, SQL, Spark, Kafka\n- Kinh nghiệm cloud data warehouse\n- Hiểu biết về data modeling",
    benefits: [
      {
        label: "Lương top market",
        content:
          "Mức lương Data Engineer tại Shopee được định vị ở top thị trường, phản ánh độ khan hiếm và giá trị của kỹ năng data engineering trong lĩnh vực e-commerce quy mô lớn. Được review định kỳ theo benchmark thị trường.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên hiệu suất cá nhân và tác động của các hệ thống data đã xây dựng đến hoạt động kinh doanh. Data Engineer đóng góp hạ tầng chiến lược sẽ được ghi nhận tương xứng.",
      },
      {
        label: "RSU",
        content:
          "Restricted Stock Unit được cấp cho nhân viên đủ điều kiện, tạo động lực gắn bó lâu dài và chia sẻ lợi ích từ tăng trưởng của công ty. Đây là phúc lợi đặc biệt ít công ty ở Việt Nam cung cấp cho kỹ sư dữ liệu.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm sức khỏe cao cấp toàn diện không giới hạn số lần khám, bao phủ nhiều bệnh viện chất lượng cao trong và ngoài nước. Được Shopee chi trả 100% không trừ vào lương nhân viên.",
      },
      {
        label: "Free lunch",
        content:
          "Bữa trưa miễn phí mỗi ngày tại văn phòng, giúp Data Engineer tập trung làm việc mà không phải lo lắng chi phí ăn uống hàng ngày. Thực đơn phong phú được thay đổi thường xuyên.",
      },
      {
        label: "MacBook Pro",
        content:
          "MacBook Pro cấu hình cao được cấp để xử lý các tác vụ data engineering nặng như chạy query phức tạp và quản lý pipeline. Đủ RAM và CPU để làm việc hiệu quả ngay cả khi làm remote.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm data engineering",
        content:
          "Tối thiểu 3 năm kinh nghiệm xây dựng và vận hành pipeline dữ liệu trong môi trường production quy mô lớn. Đã xây dựng hệ thống ETL/ELT xử lý hàng terabyte dữ liệu hàng ngày.",
      },
      {
        label: "Python, SQL, Spark, Kafka",
        content:
          "Thành thạo Python để viết pipeline và công cụ xử lý dữ liệu, SQL nâng cao để query data warehouse phức tạp. Kinh nghiệm với Spark cho batch processing và Kafka cho stream processing.",
      },
      {
        label: "Cloud data warehouse",
        content:
          "Kinh nghiệm triển khai và tối ưu cloud data warehouse như BigQuery, Snowflake hoặc Redshift. Hiểu rõ các chiến lược phân vùng, clustering và caching để giảm chi phí và tăng hiệu suất query.",
      },
      {
        label: "Data modeling",
        content:
          "Hiểu biết vững về các mô hình data warehouse như star schema, snowflake schema và data vault. Có khả năng thiết kế data model phục vụ nhiều use case phân tích khác nhau mà vẫn dễ bảo trì.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "closed",
  },

  // ── Techcombank (3) ──────────────────────────────────────────────────────────
  {
    title: "Chuyên viên Phân tích Hệ thống Ngân hàng (BA)",
    companyIndex: 3,
    location: "Hà Nội",
    salary: "25tr - 40tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Business Analysis",
      "Banking Systems",
      "BPMN",
      "Requirements Gathering",
      "Agile",
      "SQL",
      "Core Banking",
    ],
    industry: ["Finance"],
    description:
      "Techcombank tìm BA có kinh nghiệm ngân hàng để tham gia các dự án chuyển đổi số.\n\nYêu cầu:\n- 4+ năm kinh nghiệm BA trong ngân hàng/tài chính\n- Am hiểu quy trình nghiệp vụ ngân hàng\n- Thành thạo BPMN, UML\n- Tiếng Anh đọc hiểu tốt",
    benefits: [
      {
        label: "Lương cơ bản cao",
        content:
          "Mức lương cơ bản cho BA ngân hàng tại Techcombank thuộc top đầu trong ngành, cạnh tranh với cả các công ty fintech và Big Tech. Được xem xét tăng theo hiệu suất thực tế hàng năm.",
      },
      {
        label: "Thưởng hiệu suất",
        content:
          "Thưởng hiệu suất được tính dựa trên mức độ hoàn thành milestone dự án và chất lượng tài liệu BA cung cấp cho team phát triển. BA hoàn thành dự án đúng hạn và ít thay đổi yêu cầu sẽ được đánh giá cao.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao gồm khám nội ngoại trú, nha khoa và bảo hiểm tử kỳ cho nhân viên và gia đình. Techcombank đầu tư vào sức khỏe nhân viên như một phần văn hóa chăm sóc con người.",
      },
      {
        label: "Vay ưu đãi lãi suất thấp",
        content:
          "Nhân viên Techcombank được tiếp cận các gói vay mua nhà và vay tiêu dùng với lãi suất ưu đãi đặc biệt, thấp hơn lãi suất thị trường đáng kể. Đây là lợi ích tài chính thực tế và lâu dài cho nhân viên.",
      },
      {
        label: "Lộ trình thăng tiến rõ ràng",
        content:
          "Techcombank có hệ thống phân cấp BA rõ ràng từ Associate BA đến Principal BA với tiêu chí thăng tiến minh bạch. Nhân viên biết chính xác cần đạt gì để lên cấp tiếp theo trong vòng 2-3 năm.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm BA ngân hàng",
        content:
          "Tối thiểu 4 năm kinh nghiệm Business Analyst trong lĩnh vực ngân hàng hoặc tài chính, đã tham gia các dự án core banking hoặc digital banking. Có khả năng làm cầu nối hiệu quả giữa bộ phận nghiệp vụ và đội công nghệ.",
      },
      {
        label: "Quy trình nghiệp vụ ngân hàng",
        content:
          "Am hiểu sâu các quy trình nghiệp vụ ngân hàng như tín dụng, thanh toán, quản lý rủi ro và tuân thủ quy định. Hiểu được tác động của thay đổi quy trình đến hệ thống IT và hoạt động vận hành thực tế.",
      },
      {
        label: "BPMN & UML",
        content:
          "Thành thạo vẽ sơ đồ quy trình nghiệp vụ bằng BPMN và UML để mô tả yêu cầu một cách rõ ràng và không mơ hồ. Biết sử dụng các công cụ như Visio, Lucidchart hoặc Draw.io trong công việc hàng ngày.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh đủ để đọc hiểu tài liệu kỹ thuật từ nhà cung cấp nước ngoài và viết user story, requirement bằng tiếng Anh khi cần. Khả năng giao tiếp cơ bản trong các buổi họp quốc tế là lợi thế.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Lập trình viên Backend (Java Spring Boot)",
    companyIndex: 3,
    location: "Hà Nội",
    salary: "25tr - 45tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Java",
      "Spring Boot",
      "Microservices",
      "Kafka",
      "Oracle",
      "Docker",
      "REST API",
      "Core Banking",
    ],
    industry: ["HR"],
    description:
      "Techcombank Technology tìm Senior Backend Developer để phát triển hệ thống ngân hàng lõi và các ứng dụng fintech.\n\nYêu cầu:\n- 4+ năm kinh nghiệm Java Spring Boot\n- Kinh nghiệm với Kafka, Redis\n- Hiểu biết về bảo mật ứng dụng ngân hàng\n- Kinh nghiệm TDD và Clean Code",
    benefits: [
      {
        label: "Lương cạnh tranh với Big Tech",
        content:
          "Techcombank định vị lương kỹ sư backend ngang bằng với các công ty công nghệ lớn để cạnh tranh thu hút nhân tài. Mức lương được benchmark với thị trường tech định kỳ và điều chỉnh linh hoạt.",
      },
      {
        label: "Bonus hiệu suất",
        content:
          "Thưởng hiệu suất hàng quý và cuối năm dựa trên kết quả sprint, chất lượng code và đóng góp kỹ thuật. Kỹ sư tích cực mentoring và cải thiện chất lượng hệ thống sẽ được ghi nhận đặc biệt.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện cho nhân viên, hỗ trợ chi phí khám chữa bệnh tại hệ thống bệnh viện chất lượng. Bảo hiểm tai nạn 24/7 và bảo hiểm nhân thọ cũng được bao gồm trong gói phúc lợi.",
      },
      {
        label: "Remote 2 ngày/tuần",
        content:
          "Chính sách hybrid linh hoạt cho phép làm việc từ xa 2 ngày mỗi tuần, phù hợp với nhịp sống của kỹ sư phần mềm hiện đại. Văn phòng thoáng đãng và thiết bị tốt luôn sẵn sàng cho những ngày làm tại chỗ.",
      },
      {
        label: "MacBook hoặc PC cao cấp",
        content:
          "Kỹ sư được chọn giữa MacBook Pro hoặc PC cao cấp tùy theo sở thích và nhu cầu làm việc cá nhân. Thiết bị được trang bị RAM và CPU đủ mạnh để xử lý môi trường phát triển Java phức tạp.",
      },
    ],
    requirements: [
      {
        label: "Java Spring Boot",
        content:
          "Tối thiểu 4 năm kinh nghiệm phát triển backend với Java Spring Boot trong môi trường production, đã xây dựng các API có độ tin cậy và hiệu suất cao. Thành thạo Spring Security, Spring Data và các module phổ biến trong hệ sinh thái Spring.",
      },
      {
        label: "Kafka & Redis",
        content:
          "Kinh nghiệm thực tế với Apache Kafka để xây dựng hệ thống message-driven và event-sourcing trong ngân hàng. Sử dụng Redis cho caching, session management và rate limiting trong môi trường high-traffic.",
      },
      {
        label: "Bảo mật ứng dụng ngân hàng",
        content:
          "Hiểu biết về các tiêu chuẩn bảo mật ứng dụng tài chính như OWASP Top 10, mã hóa dữ liệu và xác thực đa yếu tố. Có kinh nghiệm implement các cơ chế bảo mật phòng chống gian lận và tấn công trong ngữ cảnh ngân hàng.",
      },
      {
        label: "TDD & Clean Code",
        content:
          "Thực hành Test-Driven Development và viết unit test/integration test đầy đủ đảm bảo độ bao phủ code cao. Áp dụng nguyên tắc Clean Code và SOLID để code dễ đọc, dễ bảo trì và mở rộng theo thời gian.",
      },
    ],
    slots: 3,
    isHot: true,
    statusVariant: "published_near",
  },
  {
    title: "Chuyên viên Quản lý Rủi ro Thị trường",
    companyIndex: 3,
    location: "Hà Nội",
    salary: "25tr - 40tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Risk Management",
      "Basel III",
      "Market Risk",
      "Credit Risk",
      "Stress Testing",
      "VaR",
      "FRM",
    ],
    industry: ["Marketing"],
    description:
      "Techcombank tìm Chuyên viên Quản lý Rủi ro tham gia nhóm Enterprise Risk Management.\n\nYêu cầu:\n- 3+ năm kinh nghiệm quản lý rủi ro ngân hàng\n- Hiểu biết sâu về Basel II/III\n- FRM là lợi thế lớn\n- Tiếng Anh thành thạo",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương được xây dựng cạnh tranh so với các ngân hàng thương mại cổ phần hàng đầu và các tổ chức tài chính quốc tế tại Việt Nam. Ứng viên có chứng chỉ FRM sẽ được ưu đãi thêm trong quá trình đàm phán lương.",
      },
      {
        label: "FRM sponsored",
        content:
          "Techcombank tài trợ toàn bộ chi phí đăng ký thi và tài liệu học tập cho chứng chỉ FRM (Financial Risk Manager). Đây là sự đầu tư của công ty vào năng lực chuyên môn dài hạn của nhân viên trong lĩnh vực rủi ro.",
      },
      {
        label: "Vay ưu đãi nhân viên",
        content:
          "Được tiếp cận các gói vay mua nhà và vay tiêu dùng với lãi suất ưu đãi đặc biệt dành cho nội bộ Techcombank. Thủ tục xét duyệt đơn giản và nhanh chóng hơn so với quy trình thông thường.",
      },
      {
        label: "Môi trường fintech hiện đại",
        content:
          "Làm việc trong ngân hàng được đánh giá là đầu tư mạnh nhất vào công nghệ trong hệ thống ngân hàng Việt Nam. Đội ngũ rủi ro sử dụng các công cụ phân tích dữ liệu tiên tiến và mô hình định lượng hiện đại.",
      },
      {
        label: "Annual trip",
        content:
          "Chương trình du lịch nghỉ dưỡng hàng năm cho nhân viên đạt KPI, được tổ chức tại các điểm đến trong nước hoặc quốc tế. Đây là dịp gắn kết team và tái tạo năng lượng sau một năm làm việc tích cực.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm quản lý rủi ro",
        content:
          "Tối thiểu 3 năm kinh nghiệm trong bộ phận quản lý rủi ro ngân hàng, đã tham gia xây dựng mô hình rủi ro tín dụng, rủi ro thị trường hoặc rủi ro vận hành. Quen thuộc với quy trình báo cáo rủi ro cho ban điều hành và NHNN.",
      },
      {
        label: "Basel II/III",
        content:
          "Hiểu biết sâu về khung quản lý rủi ro Basel II và III, bao gồm các yêu cầu về vốn, đòn bẩy và thanh khoản. Có khả năng áp dụng các phương pháp tính CAR, VaR và stress testing theo chuẩn quốc tế.",
      },
      {
        label: "Chứng chỉ FRM",
        content:
          "Chứng chỉ FRM (Financial Risk Manager) là lợi thế lớn, thể hiện kiến thức chuyên sâu về quản lý rủi ro tài chính theo chuẩn toàn cầu. Ứng viên đang theo học FRM Part I hoặc Part II cũng được xem xét tích cực.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo để đọc tài liệu Basel, báo cáo rủi ro quốc tế và trao đổi với đội kiểm toán nước ngoài. Khả năng viết báo cáo rủi ro bằng tiếng Anh rõ ràng và chuyên nghiệp.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "published_future",
  },

  // ── Vingroup (4) ─────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Phần mềm Nhúng (Embedded C/C++)",
    companyIndex: 4,
    location: "Hà Nội",
    salary: "20tr - 35tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "C/C++",
      "Embedded Systems",
      "RTOS",
      "CAN Bus",
      "AUTOSAR",
      "Linux Embedded",
      "Firmware",
    ],
    industry: ["Finance"],
    description:
      "VinAI tìm kỹ sư phần mềm nhúng để phát triển hệ thống điều khiển xe ô tô điện VinFast.\n\nYêu cầu:\n- 3+ năm kinh nghiệm C/C++ nhúng\n- Kinh nghiệm với RTOS\n- Hiểu biết về giao thức CAN Bus, SPI, I2C\n- AUTOSAR là lợi thế",
    benefits: [
      {
        label: "Lương tương đương thị trường quốc tế",
        content:
          "Mức lương được định vị ngang bằng với các hãng xe và công ty công nghệ ô tô quốc tế, thu hút kỹ sư nhúng giỏi nhất Việt Nam. Được benchmark với thị trường toàn cầu và điều chỉnh cạnh tranh hàng năm.",
      },
      {
        label: "Bảo hiểm sức khỏe cao cấp",
        content:
          "Gói bảo hiểm sức khỏe cao cấp cho nhân viên và gia đình, bao gồm khám nội trú, ngoại trú và nha khoa tại các cơ sở y tế hàng đầu. Bảo hiểm tai nạn lao động đặc biệt cũng được cung cấp cho môi trường kỹ thuật.",
      },
      {
        label: "Vay mua xe VinFast ưu đãi",
        content:
          "Nhân viên Vingroup được mua xe VinFast với mức chiết khấu và lãi suất vay ưu đãi đặc biệt dành riêng cho nội bộ. Đây là phúc lợi độc đáo giúp nhân viên trải nghiệm trực tiếp sản phẩm mình đang phát triển.",
      },
      {
        label: "Đào tạo chuyên môn liên tục",
        content:
          "Kỹ sư được tham gia các chương trình đào tạo kỹ thuật nhúng chuyên sâu do các chuyên gia quốc tế từ ngành ô tô thực hiện. Cơ hội tham dự các hội nghị kỹ thuật automotive quốc tế và học hỏi từ đối tác công nghệ toàn cầu.",
      },
    ],
    requirements: [
      {
        label: "C/C++ nhúng",
        content:
          "Tối thiểu 3 năm kinh nghiệm lập trình C/C++ cho hệ thống nhúng, đã phát triển firmware chạy trên vi điều khiển hoặc vi xử lý trong môi trường tài nguyên hạn chế. Hiểu rõ quản lý bộ nhớ, interrupt handling và bare-metal programming.",
      },
      {
        label: "RTOS",
        content:
          "Kinh nghiệm thực tế với ít nhất một hệ điều hành thời gian thực như FreeRTOS, QNX hoặc VxWorks trong dự án thực. Hiểu rõ khái niệm task scheduling, semaphore, mutex và inter-task communication.",
      },
      {
        label: "Giao thức truyền thông",
        content:
          "Hiểu biết và có kinh nghiệm làm việc với các giao thức truyền thông phổ biến trong ô tô như CAN Bus, LIN, SPI và I2C. Biết cách debug và phân tích traffic trên các bus giao tiếp bằng oscilloscope hoặc logic analyzer.",
      },
      {
        label: "AUTOSAR",
        content:
          "Kiến thức về kiến trúc AUTOSAR Classic hoặc AUTOSAR Adaptive là lợi thế lớn trong dự án phát triển ECU ô tô. Ứng viên có kinh nghiệm với BSW, RTE và SWC theo chuẩn AUTOSAR sẽ được ưu tiên đặc biệt.",
      },
    ],
    slots: 5,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Quản lý PR & Truyền thông",
    companyIndex: 4,
    location: "Hà Nội",
    salary: "35tr - 55tr",
    type: "FULL_TIME",
    level: "Manager",
    tags: [
      "PR Strategy",
      "Media Relations",
      "Crisis Management",
      "Corporate Communication",
      "Brand Reputation",
    ],
    industry: ["Marketing"],
    description:
      "Vingroup tìm PR & Communications Manager để quản lý hình ảnh và truyền thông tập đoàn.\n\nYêu cầu:\n- 6+ năm kinh nghiệm PR/Corporate Communications\n- Mạng lưới quan hệ báo chí rộng\n- Kinh nghiệm xử lý khủng hoảng\n- Kỹ năng viết lách xuất sắc",
    benefits: [
      {
        label: "Lương thỏa thuận",
        content:
          "Mức lương được thương lượng linh hoạt dựa trên kinh nghiệm, mạng lưới quan hệ và năng lực thực tế của ứng viên. Vingroup sẵn sàng trả mức cao nhất thị trường cho ứng viên phù hợp với văn hóa và tầm nhìn tập đoàn.",
      },
      {
        label: "Bonus hiệu suất cao",
        content:
          "Thưởng hiệu suất đáng kể dựa trên chỉ số uy tín thương hiệu, độ phủ truyền thông và xử lý thành công các sự kiện truyền thông quan trọng. Kết quả PR của tập đoàn tốt sẽ được ghi nhận rõ ràng trong thu nhập.",
      },
      {
        label: "Bảo hiểm toàn diện",
        content:
          "Gói bảo hiểm toàn diện bao gồm sức khỏe, nhân thọ và tai nạn cho cả nhân viên và gia đình. Đây là gói bảo hiểm cấp quản lý với quyền lợi vượt trội so với quy định tiêu chuẩn của công ty.",
      },
      {
        label: "Xe đưa đón",
        content:
          "Được hỗ trợ xe đưa đón hoặc phụ cấp xe theo chính sách dành cho cấp quản lý, đặc biệt hữu ích trong các sự kiện và họp báo ngoài giờ hành chính. Giúp tiết kiệm đáng kể thời gian di chuyển trong ngày làm việc dày đặc.",
      },
      {
        label: "Đào tạo leadership",
        content:
          "Tham gia các chương trình phát triển lãnh đạo do Vingroup tổ chức, bao gồm coaching cá nhân và tham dự các hội thảo truyền thông quốc tế. Cơ hội học hỏi từ các chuyên gia PR hàng đầu khu vực Đông Nam Á.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm PR/Communications",
        content:
          "Tối thiểu 6 năm kinh nghiệm trong lĩnh vực PR hoặc truyền thông doanh nghiệp, đã đảm nhận vai trò senior trong ít nhất một tập đoàn hoặc công ty đa quốc gia lớn. Hiểu rõ cách vận hành truyền thông tập đoàn quy mô và đa ngành.",
      },
      {
        label: "Mạng lưới báo chí",
        content:
          "Có mạng lưới quan hệ rộng với phóng viên, biên tập viên và quản lý tòa soạn tại các báo và kênh truyền hình lớn. Khả năng khai thác mạng lưới này để tạo coverage tích cực và kiểm soát thông tin trong tình huống nhạy cảm.",
      },
      {
        label: "Xử lý khủng hoảng",
        content:
          "Đã từng trực tiếp lên kế hoạch và triển khai chiến lược xử lý khủng hoảng truyền thông trong môi trường áp lực cao. Có khả năng ra quyết định nhanh, bình tĩnh và hiệu quả khi tập đoàn đối mặt với sự cố truyền thông.",
      },
      {
        label: "Viết lách xuất sắc",
        content:
          "Kỹ năng viết xuất sắc các thể loại nội dung PR như thông cáo báo chí, bài phát biểu, bài blog và nội dung mạng xã hội. Văn phong linh hoạt, phù hợp với nhiều đối tượng khác nhau từ báo chí đến nhà đầu tư.",
      },
    ],
    slots: 1,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Nhân viên Quản lý Chương trình Đào tạo (L&D)",
    companyIndex: 4,
    location: "Hà Nội",
    salary: "22tr - 35tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Learning & Development",
      "Curriculum Design",
      "E-learning",
      "Facilitation",
      "LMS",
      "Leadership Development",
    ],
    industry: ["HR"],
    description:
      "Vingroup tìm Chuyên viên L&D để thiết kế và triển khai chương trình học tập cho hàng nghìn nhân viên.\n\nYêu cầu:\n- 3+ năm kinh nghiệm L&D hoặc đào tạo doanh nghiệp\n- Kinh nghiệm thiết kế chương trình và e-learning\n- Kỹ năng facilitation và presentation xuất sắc",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương phù hợp với kinh nghiệm và năng lực trong lĩnh vực L&D, cạnh tranh với các tập đoàn đa quốc gia cùng quy mô. Được xem xét điều chỉnh hàng năm theo đóng góp thực tế vào chất lượng đào tạo nội bộ.",
      },
      {
        label: "L&D budget cho bản thân",
        content:
          "Bản thân chuyên viên L&D cũng được cấp ngân sách học tập để liên tục phát triển kỹ năng thiết kế đào tạo và pedagogy. Đây là cách Vingroup đảm bảo đội ngũ L&D luôn cập nhật xu hướng học tập doanh nghiệp mới nhất.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe bao gồm khám chữa bệnh nội và ngoại trú tại các bệnh viện trong mạng lưới Vinmec. Đây là lợi thế đặc biệt của nhân viên Vingroup khi được tiếp cận hệ thống y tế chất lượng cao của tập đoàn.",
      },
      {
        label: "Flexible working",
        content:
          "Lịch làm việc linh hoạt, phù hợp với tính chất công việc L&D thường xuyên phải di chuyển giữa các địa điểm đào tạo. Được phép làm việc từ xa trong những ngày không có lớp học trực tiếp.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm L&D",
        content:
          "Tối thiểu 3 năm kinh nghiệm trong vai trò Learning & Development hoặc đào tạo doanh nghiệp, đã thiết kế và triển khai chương trình học tập cho tổ chức có hơn 500 nhân viên. Hiểu rõ các mô hình thiết kế đào tạo như ADDIE, SAM và phương pháp đo lường hiệu quả Kirkpatrick.",
      },
      {
        label: "Thiết kế chương trình & e-learning",
        content:
          "Có kinh nghiệm thiết kế curriculum đa dạng từ chương trình onboarding, đào tạo kỹ năng đến lãnh đạo. Thành thạo ít nhất một công cụ e-learning authoring như Articulate Storyline, Adobe Captivate hoặc Rise.",
      },
      {
        label: "Facilitation & Presentation",
        content:
          "Kỹ năng facilitation xuất sắc để điều hành workshop, training session và các buổi thảo luận nhóm lớn. Có khả năng trình bày cuốn hút và truyền cảm hứng trước đối tượng đa dạng từ nhân viên mới đến quản lý cấp cao.",
      },
    ],
    slots: 1,
    isHot: false,
    statusVariant: "draft",
  },
  {
    title: "Chuyên viên Phát triển Kinh doanh Bất động sản",
    companyIndex: 4,
    location: "Hà Nội",
    salary: "28tr - 50tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Real Estate",
      "Business Development",
      "Sales",
      "Negotiation",
      "Market Research",
      "Investment Analysis",
    ],
    industry: ["Operations"],
    description:
      "VinHomes tìm Chuyên viên Phát triển Kinh doanh để mở rộng thị phần và phát triển các dự án bất động sản cao cấp.\n\nYêu cầu:\n- 5+ năm kinh nghiệm bán hàng bất động sản\n- Mạng lưới khách hàng tốt\n- Kỹ năng đàm phán xuất sắc",
    benefits: [
      {
        label: "Lương cơ bản + hoa hồng không giới hạn",
        content:
          "Thu nhập gồm lương cơ bản ổn định cộng hoa hồng không giới hạn dựa trên giá trị hợp đồng ký kết. Nhân viên xuất sắc có thể đạt thu nhập hàng trăm triệu đồng mỗi tháng trong mùa cao điểm mở bán.",
      },
      {
        label: "Ưu đãi mua nhà VinHomes",
        content:
          "Được mua căn hộ hoặc nhà liền kề VinHomes với giá ưu đãi đặc biệt và các điều kiện thanh toán linh hoạt dành riêng cho nội bộ. Đây là cơ hội sở hữu bất động sản cao cấp với chi phí thấp hơn thị trường đáng kể.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm sức khỏe cao cấp bao phủ toàn diện cho cả gia đình, bao gồm khám chữa bệnh tại hệ thống Vinmec. Mức quyền lợi bảo hiểm tương xứng với vị trí kinh doanh chiến lược của công ty.",
      },
      {
        label: "Xe công ty",
        content:
          "Được hỗ trợ xe công ty hoặc phụ cấp xăng xe đáng kể để phục vụ công tác gặp gỡ khách hàng và tham quan dự án. Phương tiện di chuyển được đảm bảo để duy trì hình ảnh chuyên nghiệp trước khách hàng cao cấp.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm bán BĐS",
        content:
          "Tối thiểu 5 năm kinh nghiệm bán hàng bất động sản, đã từng chốt thành công các hợp đồng giá trị từ 5 tỷ đồng trở lên. Ưu tiên ứng viên có track record bán sản phẩm cao cấp và có sản phẩm hoàn thành KPI liên tục.",
      },
      {
        label: "Mạng lưới khách hàng",
        content:
          "Có danh sách khách hàng tiềm năng sẵn có trong phân khúc high-end, bao gồm doanh nhân, chuyên gia và nhà đầu tư BĐS. Mạng lưới này là tài sản quan trọng giúp rút ngắn chu kỳ bán hàng và đạt KPI nhanh hơn.",
      },
      {
        label: "Đàm phán xuất sắc",
        content:
          "Kỹ năng đàm phán cao cấp để làm việc với khách hàng khó tính, xử lý phản đối và đi đến thỏa thuận win-win. Có kinh nghiệm đàm phán hợp đồng giá trị lớn và hiểu biết về pháp lý BĐS cơ bản.",
      },
    ],
    slots: 10,
    isHot: true,
    statusVariant: "published_future",
  },

  // ── Masan Group (5) ──────────────────────────────────────────────────────────
  {
    title: "Trưởng Nhóm Kinh doanh FMCG",
    companyIndex: 5,
    location: "TP. Hồ Chí Minh",
    salary: "22tr - 35tr",
    type: "FULL_TIME",
    level: "Team Lead",
    tags: [
      "FMCG Sales",
      "Team Leadership",
      "Distribution Management",
      "Key Account",
      "Route to Market",
    ],
    industry: ["HR"],
    description:
      "Masan tìm Sales Team Leader phụ trách khu vực TP.HCM, dẫn dắt đội nhóm 8-10 nhân viên bán hàng.\n\nYêu cầu:\n- 4+ năm kinh nghiệm FMCG sales\n- 1 năm quản lý\n- Am hiểu thị trường bán lẻ truyền thống và hiện đại",
    benefits: [
      {
        label: "Lương cơ bản + thưởng doanh số",
        content:
          "Thu nhập bao gồm lương cơ bản ổn định cộng thưởng doanh số hàng tháng khi đội nhóm đạt và vượt chỉ tiêu. Cơ chế thưởng rõ ràng theo từng mức doanh số, giúp Team Leader kiểm soát được thu nhập kỳ vọng.",
      },
      {
        label: "Xăng xe và phụ cấp đi lại",
        content:
          "Được thanh toán chi phí xăng xe thực tế và phụ cấp di chuyển hàng tháng để phục vụ công tác giám sát thị trường. Mức phụ cấp được tính phù hợp với địa bàn quản lý và tần suất di chuyển thực tế.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe bổ sung ngoài BHXH bắt buộc, hỗ trợ chi phí khám chữa bệnh tại các bệnh viện trong mạng lưới. Bảo hiểm tai nạn 24/7 cũng được bao gồm vì tính chất công việc di chuyển nhiều ngoài văn phòng.",
      },
      {
        label: "Sản phẩm miễn phí hàng tháng",
        content:
          "Nhân viên nhận giỏ sản phẩm Masan Consumer hàng tháng bao gồm các thương hiệu như Chin-su, Nam Ngư, Wake Up 247 và nhiều sản phẩm mới để trải nghiệm. Đây là cách Masan giúp đội ngũ bán hàng hiểu sản phẩm từ góc độ người tiêu dùng thực sự.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm FMCG sales",
        content:
          "Tối thiểu 4 năm kinh nghiệm bán hàng trong ngành FMCG, đã đạt và vượt KPI doanh số liên tục. Hiểu sâu về cơ chế phân phối, trade marketing và cách thúc đẩy sell-out tại điểm bán.",
      },
      {
        label: "Kinh nghiệm quản lý",
        content:
          "Ít nhất 1 năm kinh nghiệm dẫn dắt đội nhóm bán hàng, có khả năng coaching, phân bổ công việc và giải quyết xung đột trong team. Biết cách tạo động lực và duy trì tinh thần nhóm trong giai đoạn áp lực doanh số.",
      },
      {
        label: "Am hiểu thị trường bán lẻ",
        content:
          "Hiểu rõ đặc điểm và cách vận hành của cả kênh bán lẻ truyền thống (GT) và hiện đại (MT) tại khu vực TP.HCM. Biết cách tối ưu hóa trưng bày sản phẩm, xây dựng quan hệ với chủ điểm bán và theo dõi hiệu quả từng kênh.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Chuyên viên Marketing Nội dung",
    companyIndex: 5,
    location: "TP. Hồ Chí Minh",
    salary: "15tr - 22tr",
    type: "FULL_TIME",
    level: "Junior",
    tags: [
      "Content Writing",
      "SEO",
      "Social Media",
      "Copywriting",
      "Brand Storytelling",
      "Canva",
      "Analytics",
    ],
    industry: ["Operations"],
    description:
      "Masan tìm Content Marketing Specialist cho các thương hiệu tiêu dùng hàng đầu. Sản xuất nội dung đa kênh từ social media, website đến email marketing.\n\nYêu cầu:\n- 1-2 năm kinh nghiệm content marketing\n- Khả năng viết lách sáng tạo\n- Hiểu biết về SEO cơ bản",
    benefits: [
      {
        label: "Lương thưởng cạnh tranh",
        content:
          "Mức lương cơ bản cạnh tranh kết hợp với thưởng hiệu suất quý khi content đạt các chỉ số engagement và traffic tốt. Masan đánh giá cao sự sáng tạo và chất lượng nội dung, không chỉ số lượng bài đăng.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Được tham gia gói bảo hiểm sức khỏe bổ sung ngoài bảo hiểm xã hội, hỗ trợ chi phí khám chữa bệnh tại bệnh viện chất lượng. Quyền lợi bảo hiểm được nâng cấp theo thâm niên làm việc tại công ty.",
      },
      {
        label: "Sản phẩm Masan miễn phí hàng tháng",
        content:
          "Nhận giỏ sản phẩm đa dạng từ portfolio Masan Consumer hàng tháng để sử dụng và cảm nhận thực tế. Trải nghiệm sản phẩm trực tiếp giúp Content Specialist viết nội dung chân thực và thuyết phục hơn.",
      },
      {
        label: "Teambuilding hàng quý",
        content:
          "Mỗi quý, team marketing tổ chức hoạt động teambuilding để gắn kết thành viên và tái tạo năng lượng sáng tạo. Các hoạt động đa dạng từ workshop sáng tạo đến các chuyến đi ngoại khóa thú vị.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm content marketing",
        content:
          "1-2 năm kinh nghiệm sản xuất và phân phối nội dung cho thương hiệu tiêu dùng hoặc agency marketing. Đã tự mình lên kế hoạch content calendar và quản lý đăng bài trên nhiều kênh digital cùng lúc.",
      },
      {
        label: "Viết lách sáng tạo",
        content:
          "Khả năng viết copy hấp dẫn cho nhiều định dạng khác nhau từ caption mạng xã hội ngắn gọn đến bài blog dài. Có thể điều chỉnh giọng văn phù hợp với từng thương hiệu và nhóm đối tượng mục tiêu.",
      },
      {
        label: "SEO cơ bản",
        content:
          "Hiểu biết cơ bản về SEO để tối ưu nội dung website cho công cụ tìm kiếm, bao gồm nghiên cứu từ khóa và tối ưu on-page. Biết sử dụng Google Analytics để theo dõi hiệu quả content và điều chỉnh chiến lược.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Kế toán Tổng hợp",
    companyIndex: 5,
    location: "TP. Hồ Chí Minh",
    salary: "18tr - 28tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "General Accounting",
      "MISA",
      "VAS",
      "Tax Declaration",
      "Financial Reporting",
      "Month-end Close",
    ],
    industry: ["Finance"],
    description:
      "Masan tìm Kế toán Tổng hợp để xử lý nghiệp vụ kế toán hàng ngày và hỗ trợ lập báo cáo tài chính.\n\nYêu cầu:\n- 3+ năm kinh nghiệm kế toán tổng hợp\n- Thành thạo MISA\n- Hiểu biết vững về VAS và luật thuế",
    benefits: [
      {
        label: "Lương cơ bản tốt",
        content:
          "Mức lương cơ bản cạnh tranh trong ngành FMCG, phù hợp với kinh nghiệm và trình độ chuyên môn của từng ứng viên. Được review hàng năm có tính đến lạm phát và mức tăng trưởng của công ty.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao phủ chi phí khám chữa bệnh tại các bệnh viện trong mạng lưới trên toàn quốc. Bảo hiểm xã hội và bảo hiểm y tế được đóng đầy đủ theo quy định từ ngày đầu nhận việc.",
      },
      {
        label: "Sản phẩm công ty",
        content:
          "Nhận sản phẩm Masan Consumer hàng tháng bao gồm các mặt hàng tiêu dùng thiết yếu như gia vị, đồ uống và thực phẩm. Tiết kiệm đáng kể chi phí sinh hoạt gia đình mỗi tháng.",
      },
      {
        label: "13 tháng lương",
        content:
          "Ngoài 12 tháng lương cơ bản, nhân viên nhận thêm 1 tháng lương thưởng cố định vào cuối năm như một phần cam kết phúc lợi. Đây là sự ghi nhận sự gắn bó và đóng góp của nhân viên trong suốt năm tài chính.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm kế toán tổng hợp",
        content:
          "Tối thiểu 3 năm kinh nghiệm làm kế toán tổng hợp, đã tự lập được toàn bộ báo cáo tài chính theo quý và năm. Quen thuộc với quy trình đối chiếu công nợ, hạch toán chi phí và theo dõi tài sản cố định.",
      },
      {
        label: "Thành thạo MISA",
        content:
          "Sử dụng thành thạo phần mềm kế toán MISA để nhập liệu chứng từ, tra cứu sổ sách và xuất báo cáo. Biết cách thiết lập tài khoản, phân loại chi phí và điều chỉnh bút toán cuối kỳ trên hệ thống.",
      },
      {
        label: "VAS và luật thuế",
        content:
          "Hiểu biết vững chắc về Chuẩn mực Kế toán Việt Nam (VAS) và các quy định thuế hiện hành bao gồm thuế GTGT, thuế TNDN và thuế TNCN. Có khả năng lập tờ khai thuế đúng hạn và giải trình với cơ quan thuế khi cần.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Phân tích Chuỗi Cung ứng (Supply Chain Analyst)",
    companyIndex: 5,
    location: "TP. Hồ Chí Minh",
    salary: "20tr - 32tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Supply Chain",
      "Demand Planning",
      "Inventory Management",
      "SAP",
      "Data Analysis",
      "Forecasting",
      "S&OP",
    ],
    industry: ["Marketing"],
    description:
      "Masan tìm Supply Chain Analyst để tối ưu hoạt động chuỗi cung ứng từ nhà máy đến điểm bán lẻ.\n\nYêu cầu:\n- 2+ năm kinh nghiệm supply chain\n- Thành thạo Excel, SAP\n- Kỹ năng phân tích dữ liệu tốt",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương cạnh tranh cho vị trí Supply Chain Analyst trong ngành FMCG, phản ánh mức độ phức tạp của chuỗi cung ứng đa nhà máy, đa sản phẩm của Masan. Được tăng lương theo hiệu suất và mức độ phát triển kỹ năng.",
      },
      {
        label: "Performance bonus",
        content:
          "Thưởng hiệu suất dựa trên các chỉ số chuỗi cung ứng quan trọng như mức tồn kho tối ưu, độ chính xác dự báo nhu cầu và tỷ lệ đáp ứng đơn hàng. Analyst đóng góp cải thiện KPI chuỗi cung ứng sẽ được ghi nhận tương xứng.",
      },
      {
        label: "Sản phẩm Masan",
        content:
          "Nhận giỏ sản phẩm Masan hàng tháng gồm nhiều mặt hàng đa dạng từ gia vị, đồ uống đến thực phẩm chế biến. Hiểu sản phẩm từ góc độ người tiêu dùng giúp analyst có insight tốt hơn khi phân tích demand.",
      },
      {
        label: "Đào tạo supply chain",
        content:
          "Được tham gia các khóa đào tạo chuyên sâu về quản lý chuỗi cung ứng, demand planning và S&OP do chuyên gia trong và ngoài nước thực hiện. Masan đầu tư vào đào tạo để xây dựng năng lực supply chain đẳng cấp quốc tế.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm supply chain",
        content:
          "Tối thiểu 2 năm kinh nghiệm trong lĩnh vực supply chain, logistics hoặc demand planning, ưu tiên ngành FMCG hoặc sản xuất. Đã tham gia các dự án cải thiện quy trình chuỗi cung ứng và đo lường được kết quả thực tế.",
      },
      {
        label: "Excel & SAP",
        content:
          "Thành thạo Excel nâng cao bao gồm pivot table, VBA cơ bản và các mô hình phân tích dự báo. Có kinh nghiệm sử dụng SAP MM hoặc SAP SCM để theo dõi tồn kho và quản lý đơn hàng mua hàng.",
      },
      {
        label: "Phân tích dữ liệu",
        content:
          "Kỹ năng phân tích dữ liệu tốt để nhận diện xu hướng, phát hiện bất thường và đưa ra khuyến nghị cải thiện chuỗi cung ứng. Có khả năng trình bày kết quả phân tích rõ ràng cho các bộ phận không chuyên về số liệu.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "closed",
  },

  // ── KPMG (6) ──────────────────────────────────────────────────────────────────
  {
    title: "Kiểm toán viên Cấp Cao (Senior Auditor)",
    companyIndex: 6,
    location: "Hà Nội",
    salary: "25tr - 40tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "External Audit",
      "IFRS",
      "VAS",
      "Financial Reporting",
      "Risk-based Audit",
      "Client Management",
      "Big 4",
    ],
    industry: ["Marketing"],
    description:
      "KPMG tìm Senior Auditor để thực hiện kiểm toán báo cáo tài chính cho khách hàng lớn.\n\nYêu cầu:\n- 3+ năm kinh nghiệm kiểm toán (ưu tiên Big 4)\n- ACCA/CPA là bắt buộc hoặc đang học\n- Thành thạo IFRS và VAS\n- Tiếng Anh thành thạo",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương Senior Auditor tại KPMG được định vị cạnh tranh trong nhóm Big 4, phản ánh đúng giá trị của kỹ năng kiểm toán chuyên nghiệp trong thị trường. Được review và điều chỉnh theo hiệu suất và tiến trình học ACCA.",
      },
      {
        label: "ACCA/CPA study leave",
        content:
          "Nhân viên được nghỉ có hưởng lương để thi các kỳ thi ACCA và CPA, cùng với hỗ trợ học phí và tài liệu ôn thi. KPMG coi việc hoàn thành chứng chỉ chuyên môn là mục tiêu phát triển của cả hai bên.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện cho nhân viên, đặc biệt hữu ích trong mùa kiểm toán cao điểm khi áp lực công việc lớn. Bao gồm khám sức khỏe định kỳ hàng năm và hỗ trợ tư vấn sức khỏe tâm thần.",
      },
      {
        label: "International secondment",
        content:
          "Cơ hội được luân chuyển sang văn phòng KPMG tại các quốc gia khác trong 3-12 tháng để mở rộng kinh nghiệm kiểm toán quốc tế. Đây là trải nghiệm giá trị giúp Senior Auditor tiếp cận chuẩn mực toàn cầu và xây dựng mạng lưới quốc tế.",
      },
      {
        label: "Fast-track promotion",
        content:
          "Senior Auditor có hiệu suất xuất sắc được xem xét thăng tiến nhanh lên Assistant Manager trong vòng 18-24 tháng, nhanh hơn lộ trình tiêu chuẩn. Tiêu chí thăng tiến rõ ràng và được thông báo từ đầu để nhân viên có định hướng phấn đấu cụ thể.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm kiểm toán",
        content:
          "Tối thiểu 3 năm kinh nghiệm kiểm toán báo cáo tài chính, ưu tiên ứng viên từ Big 4 hoặc các công ty kiểm toán quốc tế. Đã độc lập thực hiện kiểm toán từ lập kế hoạch, thu thập bằng chứng đến lập báo cáo kiểm toán.",
      },
      {
        label: "ACCA/CPA",
        content:
          "Đang theo học hoặc đã hoàn thành chứng chỉ ACCA hoặc CPA là yêu cầu bắt buộc cho vị trí này. Ứng viên đã pass được nhiều kỳ thi ACCA sẽ được ưu tiên trong quá trình tuyển chọn.",
      },
      {
        label: "IFRS & VAS",
        content:
          "Thành thạo cả chuẩn mực kế toán quốc tế IFRS và Chuẩn mực Kế toán Việt Nam VAS để phục vụ đa dạng đối tượng khách hàng. Có khả năng nhận diện sự khác biệt quan trọng giữa hai bộ chuẩn mực và xử lý các tình huống điều chỉnh.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo để đọc tài liệu kiểm toán quốc tế, giao tiếp với khách hàng FDI và viết báo cáo kiểm toán bằng tiếng Anh. Kỹ năng trình bày phát hiện kiểm toán rõ ràng và thuyết phục bằng tiếng Anh là yêu cầu quan trọng.",
      },
    ],
    slots: 4,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Tư vấn Thuế",
    companyIndex: 6,
    location: "TP. Hồ Chí Minh",
    salary: "20tr - 35tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Tax Advisory",
      "CIT",
      "VAT",
      "Transfer Pricing",
      "Tax Due Diligence",
      "International Tax",
      "BEPS",
    ],
    industry: ["HR"],
    description:
      "KPMG tìm Tax Consultant để cung cấp dịch vụ tư vấn thuế cho khách hàng doanh nghiệp và FDI.\n\nYêu cầu:\n- 2+ năm kinh nghiệm tư vấn thuế\n- Kiến thức sâu về CIT, VAT\n- Tiếng Anh thành thạo",
    benefits: [
      {
        label: "Lương theo năng lực",
        content:
          "Mức lương được xây dựng dựa trên kiến thức chuyên môn thuế, kinh nghiệm tư vấn và hiệu quả phục vụ khách hàng. KPMG sẵn sàng trả cao hơn thị trường cho ứng viên có nền tảng thuế vững và tiếng Anh tốt.",
      },
      {
        label: "Performance bonus",
        content:
          "Thưởng hiệu suất dựa trên giá trị dịch vụ thuế cung cấp cho khách hàng và mức độ hài lòng của khách hàng. Consultant hoàn thành nhiều dự án phức tạp và giữ được khách hàng lâu dài sẽ nhận thưởng đáng kể.",
      },
      {
        label: "ACCA support",
        content:
          "KPMG hỗ trợ học phí và ngày nghỉ có lương để nhân viên thi chứng chỉ ACCA, đặc biệt các module liên quan đến thuế và kế toán. Đây là khoản đầu tư của công ty vào sự phát triển chuyên môn dài hạn của nhân viên.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao phủ nhân viên và người thân, giúp giảm bớt gánh nặng chi phí y tế trong cuộc sống. Đặc biệt hữu ích trong mùa deadline thuế cao điểm khi sức khỏe dễ bị ảnh hưởng.",
      },
      {
        label: "International opportunities",
        content:
          "Cơ hội tham gia các dự án thuế quốc tế và luân chuyển sang văn phòng KPMG tại các nước trong khu vực. Tax Consultant xuất sắc có thể được cử đi học hỏi kinh nghiệm tư vấn thuế quốc tế và Transfer Pricing tại nước ngoài.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm tư vấn thuế",
        content:
          "Tối thiểu 2 năm kinh nghiệm tư vấn thuế tại công ty kiểm toán, tư vấn hoặc trong bộ phận thuế của doanh nghiệp lớn. Đã trực tiếp chuẩn bị hồ sơ thuế, trả lời yêu cầu giải trình của cơ quan thuế và hỗ trợ thanh tra thuế.",
      },
      {
        label: "CIT & VAT",
        content:
          "Kiến thức chuyên sâu về thuế thu nhập doanh nghiệp (CIT) và thuế giá trị gia tăng (VAT), bao gồm các quy định đặc thù cho từng ngành. Biết áp dụng ưu đãi thuế, xử lý chi phí được trừ và lập tờ khai thuế chính xác.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo để tư vấn cho khách hàng FDI, viết ý kiến thuế bằng tiếng Anh và làm việc với đội ngũ KPMG quốc tế. Khả năng giải thích các quy định thuế Việt Nam phức tạp bằng tiếng Anh dễ hiểu cho khách hàng nước ngoài.",
      },
    ],
    slots: 3,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Associate Kiểm toán (Dành cho Sinh viên mới tốt nghiệp)",
    companyIndex: 6,
    location: "Hà Nội",
    salary: "13tr - 17tr",
    type: "FULL_TIME",
    level: "Junior",
    tags: [
      "External Audit",
      "Financial Statements",
      "VAS",
      "Excel",
      "Teamwork",
      "ACCA",
      "Big 4",
    ],
    industry: ["HR"],
    description:
      "KPMG tuyển Associate cho bộ phận Kiểm toán, chào đón sinh viên mới tốt nghiệp.\n\nYêu cầu:\n- Tốt nghiệp loại Khá, ngành Kế toán/Kiểm toán\n- TOEIC 700+\n- Chăm chỉ, cẩn thận",
    benefits: [
      {
        label: "Lương cơ bản + overtime pay",
        content:
          "Ngoài lương cơ bản, KPMG trả thêm phụ cấp làm ngoài giờ minh bạch và đúng quy định, đặc biệt trong mùa kiểm toán cao điểm. Đây là sự ghi nhận công bằng cho những giờ làm thêm không thể tránh khỏi trong Big 4.",
      },
      {
        label: "ACCA support",
        content:
          "Hỗ trợ học phí và thời gian ôn thi ACCA, giúp Associate nhanh chóng xây dựng nền tảng kế toán chuyên nghiệp quốc tế. KPMG coi ACCA là chứng chỉ cốt lõi trong lộ trình thăng tiến và tạo mọi điều kiện để nhân viên đạt được.",
      },
      {
        label: "Big 4 training",
        content:
          "Được tham gia chương trình đào tạo bài bản của KPMG từ kiến thức kiểm toán, kỹ năng mềm đến công cụ và quy trình làm việc chuyên nghiệp. Đây là nền tảng kiến thức quý giá mà chỉ môi trường Big 4 mới có thể cung cấp.",
      },
      {
        label: "Mentorship program",
        content:
          "Mỗi Associate mới được assign một Senior hoặc Manager làm mentor trong năm đầu tiên, hỗ trợ định hướng nghề nghiệp và giải đáp thắc mắc về chuyên môn. Mối quan hệ mentor-mentee tại KPMG thường kéo dài và tạo ra mạng lưới nghề nghiệp bền vững.",
      },
      {
        label: "Annual leave 18 ngày",
        content:
          "Số ngày phép năm 18 ngày nhiều hơn quy định tối thiểu của Bộ Lao động, thể hiện cam kết của KPMG về cân bằng công việc - cuộc sống. Nhân viên được khuyến khích sử dụng hết phép để nghỉ ngơi và phục hồi sức khỏe.",
      },
    ],
    requirements: [
      {
        label: "Tốt nghiệp Kế toán/Kiểm toán",
        content:
          "Tốt nghiệp đại học loại Khá trở lên chuyên ngành Kế toán, Kiểm toán hoặc Tài chính từ trường đại học uy tín. GPA từ 3.0/4.0 trở lên thể hiện nền tảng kiến thức vững chắc và khả năng học tập nghiêm túc.",
      },
      {
        label: "TOEIC 700+",
        content:
          "Điểm TOEIC từ 700 trở lên hoặc bằng chứng tương đương về năng lực tiếng Anh, đủ để đọc tài liệu kiểm toán quốc tế. Tiếng Anh tốt là yêu cầu cơ bản để phát triển trong môi trường kiểm toán Big 4 với nhiều khách hàng quốc tế.",
      },
      {
        label: "Chăm chỉ và cẩn thận",
        content:
          "Thái độ làm việc chăm chỉ, cẩn thận và có trách nhiệm cao với chất lượng công việc, đặc biệt trong xử lý số liệu tài chính. Khả năng chịu đựng áp lực trong mùa kiểm toán cao điểm và vẫn duy trì độ chính xác tuyệt đối.",
      },
    ],
    slots: 15,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Tư vấn Quản lý",
    companyIndex: 6,
    location: "Hà Nội",
    salary: "25tr - 45tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Management Consulting",
      "Strategy",
      "Process Improvement",
      "Change Management",
      "Stakeholder Engagement",
    ],
    industry: ["Operations"],
    description:
      "KPMG Advisory tìm Senior Management Consultant cho các dự án tư vấn chiến lược.\n\nYêu cầu:\n- 4+ năm kinh nghiệm consulting\n- Tư duy phân tích xuất sắc\n- Tiếng Anh thành thạo\n- MBA là lợi thế",
    benefits: [
      {
        label: "Lương cạnh tranh Big 4",
        content:
          "Mức lương Management Consultant tại KPMG được định vị cạnh tranh trong nhóm Big 4, phản ánh đúng độ phức tạp và giá trị của dịch vụ tư vấn chiến lược. Ứng viên xuất sắc có thể thương lượng mức lương vượt khung thông thường.",
      },
      {
        label: "Performance bonus",
        content:
          "Thưởng hiệu suất hàng năm được tính dựa trên utilization rate, chất lượng deliverable và đánh giá từ khách hàng. Consultant mang lại giá trị cao cho khách hàng và có repeat business sẽ được thưởng đáng kể.",
      },
      {
        label: "ACCA/MBA support",
        content:
          "KPMG hỗ trợ học phí và thời gian học cho các chứng chỉ chuyên môn như ACCA hoặc chương trình MBA bán thời gian. Đây là khoản đầu tư chiến lược để xây dựng đội ngũ consultant có nền tảng chuyên môn và quản trị vững chắc.",
      },
      {
        label: "International travel",
        content:
          "Cơ hội di chuyển quốc tế để thực hiện dự án tư vấn tại các văn phòng khách hàng ở khu vực ASEAN và toàn cầu. Trải nghiệm làm việc đa quốc gia là lợi thế nghề nghiệp lớn trong ngành tư vấn quản lý.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm consulting",
        content:
          "Tối thiểu 4 năm kinh nghiệm tư vấn quản lý tại công ty tư vấn chuyên nghiệp hoặc bộ phận strategy của tập đoàn lớn. Đã tự mình dẫn dắt workstream trong dự án tư vấn và present kết quả trực tiếp với ban lãnh đạo khách hàng.",
      },
      {
        label: "Tư duy phân tích",
        content:
          "Tư duy phân tích xuất sắc với khả năng xử lý lượng lớn thông tin phức tạp và rút ra insight có giá trị. Thành thạo các framework phân tích kinh doanh như SWOT, Porter Five Forces, BCG Matrix và biết khi nào nên dùng framework nào.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo ở mức có thể thuyết trình tự tin trước C-level khách hàng quốc tế và viết báo cáo tư vấn chuyên nghiệp. Khả năng storytelling bằng tiếng Anh để truyền đạt insight phức tạp một cách đơn giản và thuyết phục.",
      },
      {
        label: "MBA",
        content:
          "Bằng MBA từ trường kinh doanh danh tiếng là lợi thế lớn, thể hiện tư duy quản trị toàn diện và mạng lưới nghề nghiệp rộng. Ứng viên không có MBA nhưng có track record tư vấn xuất sắc vẫn được xem xét tích cực.",
      },
    ],
    slots: 3,
    isHot: false,
    statusVariant: "published_near",
  },

  // ── Grab (7) ─────────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư AI/ML Cấp Cao",
    companyIndex: 7,
    location: "TP. Hồ Chí Minh",
    salary: "$3,000 - $5,000",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "NLP",
      "MLOps",
      "Recommendation System",
      "Deep Learning",
    ],
    industry: ["Sales"],
    description:
      "Grab tìm AI/ML Engineer tài năng để xây dựng mô hình recommendation và fraud detection cho hàng triệu người dùng Đông Nam Á.\n\nYêu cầu:\n- 3+ năm kinh nghiệm ML/AI trong production\n- Thành thạo Python, TensorFlow/PyTorch\n- Kinh nghiệm MLOps pipeline\n- Tiếng Anh thành thạo",
    benefits: [
      {
        label: "Gói lương top thị trường",
        content:
          "Grab định vị lương AI/ML Engineer ở top 10% thị trường để cạnh tranh thu hút nhân tài với các tập đoàn công nghệ toàn cầu. Mức lương bao gồm base salary hấp dẫn và được benchmark định kỳ với thị trường quốc tế.",
      },
      {
        label: "RSU",
        content:
          "Restricted Stock Unit được cấp và vest theo lịch 4 năm, cho phép kỹ sư chia sẻ lợi ích từ sự tăng trưởng của Grab tại thị trường Đông Nam Á. Đây là phần thu nhập dài hạn có tiềm năng giá trị rất cao.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm sức khỏe cao cấp toàn diện không giới hạn số lần khám, bao phủ cả nha khoa và hỗ trợ sức khỏe tâm thần. Grab chi trả 100% phí bảo hiểm, nhân viên không phải đóng bất kỳ khoản nào.",
      },
      {
        label: "Free GrabFood",
        content:
          "Credit GrabFood hàng tháng để đặt đồ ăn trực tiếp từ ứng dụng, giúp tiết kiệm chi phí ăn uống hàng ngày và trải nghiệm sản phẩm của chính công ty. Nhân viên được hưởng lợi trực tiếp từ dịch vụ mình đang xây dựng.",
      },
      {
        label: "L&D budget",
        content:
          "Ngân sách học tập đáng kể để tham dự hội nghị AI/ML hàng đầu như NeurIPS, ICML hoặc mua khóa học chuyên sâu trực tuyến. Grab khuyến khích kỹ sư luôn đi đầu trong các kỹ thuật AI/ML mới nhất.",
      },
      {
        label: "Gym membership",
        content:
          "Đăng ký phòng gym được Grab chi trả hoàn toàn, khuyến khích nhân viên duy trì sức khỏe thể chất bên cạnh sức khỏe tinh thần. Sức khỏe tốt giúp kỹ sư duy trì năng suất và sáng tạo trong công việc đòi hỏi tư duy cao.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm ML/AI production",
        content:
          "Tối thiểu 3 năm kinh nghiệm xây dựng và vận hành mô hình machine learning trong môi trường production thực tế, phục vụ hàng triệu người dùng. Không chỉ nghiên cứu học thuật mà cần kinh nghiệm deploy, monitor và cải tiến mô hình liên tục.",
      },
      {
        label: "Python, TensorFlow/PyTorch",
        content:
          "Thành thạo Python để xây dựng pipeline ML từ đầu đến cuối, sử dụng thành thạo TensorFlow hoặc PyTorch để implement và train mô hình deep learning. Hiểu rõ các kỹ thuật tối ưu như mixed precision training và distributed training.",
      },
      {
        label: "MLOps pipeline",
        content:
          "Kinh nghiệm xây dựng và vận hành MLOps pipeline bao gồm model versioning, feature store, CI/CD cho ML và monitoring drift. Biết sử dụng các công cụ như MLflow, Kubeflow hoặc SageMaker để quản lý vòng đời mô hình.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo để làm việc trong môi trường đa quốc gia của Grab, đọc paper nghiên cứu và trình bày kết quả thực nghiệm. Khả năng collaborate hiệu quả với các kỹ sư từ nhiều quốc gia khác nhau trong cùng một dự án.",
      },
    ],
    slots: 2,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Phân tích Dữ liệu Kinh doanh",
    companyIndex: 7,
    location: "TP. Hồ Chí Minh",
    salary: "$1,200 - $2,200",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "SQL",
      "Python",
      "Power BI",
      "Tableau",
      "A/B Testing",
      "Statistics",
      "Business Intelligence",
    ],
    industry: ["Operations"],
    description:
      "Grab tìm Data Analyst để hỗ trợ đội ngũ Product và Business. Phân tích hành vi người dùng, đo lường hiệu quả tính năng.\n\nYêu cầu:\n- 2+ năm kinh nghiệm Data Analyst\n- Thành thạo SQL, Python\n- Kinh nghiệm BI tools\n- Khả năng thiết kế A/B test",
    benefits: [
      {
        label: "Competitive salary",
        content:
          "Mức lương cạnh tranh theo chuẩn công ty công nghệ khu vực Đông Nam Á, được xây dựng để thu hút Data Analyst có tư duy phân tích sắc bén. Review lương hàng năm dựa trên đóng góp thực tế và benchmark thị trường.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên kết quả của các phân tích và insight đã đóng góp vào quyết định kinh doanh. Data Analyst có insight được áp dụng và tạo ra impact rõ ràng sẽ được ghi nhận đặc biệt trong đánh giá.",
      },
      {
        label: "Premium health insurance",
        content:
          "Gói bảo hiểm sức khỏe cao cấp bao gồm đầy đủ các quyền lợi khám chữa bệnh nội và ngoại trú, nha khoa và sức khỏe tâm thần. Grab chi trả hoàn toàn phí bảo hiểm mà không trừ vào lương nhân viên.",
      },
      {
        label: "Free GrabFood",
        content:
          "Credit GrabFood hàng tháng để trải nghiệm dịch vụ của chính công ty và tiết kiệm chi phí ăn uống hàng ngày. Nhân viên được ưu tiên trải nghiệm các tính năng mới trước khi ra mắt đại trà.",
      },
      {
        label: "Flexible hours",
        content:
          "Giờ làm việc linh hoạt không yêu cầu check-in cứng nhắc, miễn hoàn thành công việc và tham gia đủ các cuộc họp quan trọng. Phù hợp với phong cách làm việc của Data Analyst cần thời gian tập trung phân tích không bị gián đoạn.",
      },
      {
        label: "Remote 2 ngày/tuần",
        content:
          "Chính sách hybrid cho phép làm việc từ xa 2 ngày mỗi tuần, giúp tiết kiệm thời gian di chuyển và tạo không gian tập trung phân tích dữ liệu. Các ngày còn lại làm tại văn phòng để collaboration và whiteboard session.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm Data Analyst",
        content:
          "Tối thiểu 2 năm kinh nghiệm trong vai trò Data Analyst, đã tự mình hoàn thành các phân tích từ đặt câu hỏi, truy xuất dữ liệu đến trình bày kết quả cho stakeholder. Có ít nhất vài dự án phân tích đã được áp dụng vào quyết định kinh doanh thực tế.",
      },
      {
        label: "SQL & Python",
        content:
          "Thành thạo SQL để query và xử lý dữ liệu từ các data warehouse quy mô lớn, bao gồm window function và CTE phức tạp. Sử dụng Python với pandas, numpy và matplotlib để phân tích dữ liệu sâu hơn và tạo visualization tùy chỉnh.",
      },
      {
        label: "BI tools",
        content:
          "Có kinh nghiệm xây dựng dashboard và báo cáo bằng ít nhất một công cụ BI như Tableau, Power BI hoặc Looker. Biết thiết kế dashboard trực quan, dễ đọc và tự phục vụ được nhu cầu theo dõi chỉ số của các team business.",
      },
      {
        label: "A/B testing",
        content:
          "Hiểu rõ phương pháp thiết kế thực nghiệm A/B test đúng cách, bao gồm tính sample size, chọn metric chính xác và diễn giải kết quả thống kê. Biết tránh các bẫy phổ biến như peeking problem và multiple testing issue.",
      },
    ],
    slots: 3,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Kỹ sư iOS (Swift)",
    companyIndex: 7,
    location: "TP. Hồ Chí Minh",
    salary: "$2,000 - $3,500",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Swift",
      "iOS",
      "Xcode",
      "UIKit",
      "SwiftUI",
      "CocoaPods",
      "REST API",
      "Performance Optimization",
    ],
    industry: ["Marketing"],
    description:
      "Grab tuyển iOS Developer để phát triển ứng dụng Grab trên nền tảng iOS.\n\nYêu cầu:\n- 3+ năm kinh nghiệm iOS Swift\n- Kinh nghiệm với UIKit và SwiftUI\n- Hiểu biết về app performance optimization\n- Kinh nghiệm publish app lên App Store",
    benefits: [
      {
        label: "Competitive salary",
        content:
          "Mức lương cạnh tranh theo chuẩn công ty công nghệ Đông Nam Á, được định vị để cạnh tranh với Apple, Google và các startup unicorn trong khu vực. Được review định kỳ theo benchmark thị trường iOS developer.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên đóng góp kỹ thuật, chất lượng code và tác động của các tính năng đã ship lên sản phẩm. Kỹ sư iOS mentoring junior và cải thiện chất lượng hệ thống chung cũng được ghi nhận trong đánh giá.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm sức khỏe cao cấp toàn diện do Grab chi trả hoàn toàn, bao gồm nội trú, ngoại trú và nha khoa tại bệnh viện chất lượng. Không giới hạn số lần khám và chi phí điều trị trong hạn mức chương trình.",
      },
      {
        label: "GrabFood credits",
        content:
          "Credit GrabFood hàng tháng để đặt đồ ăn miễn phí từ ứng dụng, trải nghiệm trực tiếp tính năng mình đang phát triển. Cũng là cách tiết kiệm chi phí bữa ăn hàng ngày một cách thiết thực.",
      },
      {
        label: "MacBook Pro",
        content:
          "MacBook Pro M-series mới nhất được cấp để build ứng dụng iOS nhanh hơn và chạy simulator mượt mà hơn. Thiết bị Apple chính hãng đảm bảo trải nghiệm phát triển iOS tốt nhất có thể.",
      },
      {
        label: "Gym membership",
        content:
          "Thẻ thành viên phòng gym được Grab chi trả để hỗ trợ nhân viên duy trì sức khỏe thể chất và tinh thần. Đặc biệt quan trọng trong các giai đoạn áp lực deadline release lớn.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm iOS Swift",
        content:
          "Tối thiểu 3 năm kinh nghiệm phát triển ứng dụng iOS với Swift, đã tham gia ít nhất một ứng dụng có lượng người dùng thực tế đáng kể. Hiểu sâu về memory management, ARC và các pattern phổ biến trong iOS development như MVVM và Coordinator.",
      },
      {
        label: "UIKit & SwiftUI",
        content:
          "Thành thạo UIKit để xây dựng giao diện phức tạp và SwiftUI cho các tính năng mới theo hướng declarative UI. Biết kết hợp linh hoạt cả hai framework trong cùng một dự án theo yêu cầu thực tế.",
      },
      {
        label: "App performance optimization",
        content:
          "Kinh nghiệm profiling ứng dụng với Instruments, phát hiện và khắc phục memory leak, main thread blocking và rendering issue. Biết tối ưu thời gian khởi động ứng dụng và giảm mức tiêu thụ pin cho thiết bị.",
      },
      {
        label: "App Store publishing",
        content:
          "Có kinh nghiệm hoàn chỉnh quy trình submit và publish ứng dụng lên App Store, bao gồm code signing, provisioning profile và xử lý App Review. Biết chuẩn bị metadata, screenshot và phản hồi các yêu cầu reject từ App Review team.",
      },
    ],
    slots: 3,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Thực tập sinh Mobile Developer",
    companyIndex: 7,
    location: "TP. Hồ Chí Minh",
    salary: "7tr - 10tr",
    type: "INTERNSHIP",
    level: "Intern",
    tags: [
      "React Native",
      "JavaScript",
      "TypeScript",
      "Git",
      "Mobile Development",
      "Teamwork",
    ],
    industry: ["Finance"],
    description:
      "Grab tuyển thực tập sinh Mobile Developer (chương trình 6 tháng, có lương).\n\nYêu cầu:\n- Sinh viên năm 3-4 hoặc mới tốt nghiệp\n- Biết React Native hoặc React.js\n- Tiếng Anh đọc hiểu tốt",
    benefits: [
      {
        label: "Thực tập có lương",
        content:
          "Thực tập sinh nhận mức lương hàng tháng cạnh tranh so với thị trường, được công nhận là thành viên thực sự của đội phát triển chứ không phải lao động miễn phí. Mức lương được tính toán công bằng dựa trên thời gian và đóng góp thực tế.",
      },
      {
        label: "Mentor từ senior engineer",
        content:
          "Mỗi thực tập sinh được ghép cặp với Senior Engineer của Grab để nhận hướng dẫn kỹ thuật hàng tuần và code review chi tiết. Mentor tại Grab thường là những kỹ sư có kinh nghiệm build sản phẩm phục vụ hàng triệu người dùng.",
      },
      {
        label: "GrabFood credits",
        content:
          "Được cấp GrabFood credits hàng tháng để đặt đồ ăn miễn phí, trải nghiệm sản phẩm của công ty và tiết kiệm chi phí sinh hoạt khi còn đi học. Cũng là cơ hội hiểu user journey từ góc độ người dùng thực tế.",
      },
      {
        label: "Cơ hội offer full-time",
        content:
          "Thực tập sinh xuất sắc sẽ nhận offer nhân viên chính thức ngay sau khi tốt nghiệp, bỏ qua quy trình tuyển dụng dài hàng tháng. Đây là con đường nhanh nhất để gia nhập Grab với vai trò kỹ sư mobile được đào tạo bài bản.",
      },
    ],
    requirements: [
      {
        label: "Sinh viên năm 3-4 hoặc mới tốt nghiệp",
        content:
          "Đang theo học năm 3-4 hoặc mới tốt nghiệp tối đa 6 tháng tại các trường đại học chuyên ngành CNTT hoặc kỹ thuật liên quan. Ưu tiên sinh viên có điểm học tập tốt và đã tự học thêm kiến thức ngoài chương trình chính quy.",
      },
      {
        label: "React Native hoặc React.js",
        content:
          "Có kiến thức cơ bản về React Native hoặc React.js đủ để viết component đơn giản, xử lý state và gọi API. Không cần kinh nghiệm production nhưng phải thể hiện được khả năng tự học và giải quyết vấn đề trong technical assessment.",
      },
      {
        label: "Tiếng Anh đọc hiểu",
        content:
          "Đọc hiểu tài liệu kỹ thuật, documentation và thông điệp trên Slack bằng tiếng Anh ở mức độ không cần dịch. Khả năng viết comment code và hỏi đáp kỹ thuật bằng tiếng Anh cơ bản với đội ngũ đa quốc gia.",
      },
    ],
    slots: 5,
    isHot: false,
    statusVariant: "published_past",
  },

  // ── VNG (8) ──────────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Backend Game (C++/Go)",
    companyIndex: 8,
    location: "TP. Hồ Chí Minh",
    salary: "25tr - 45tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "C++",
      "Go",
      "Game Server",
      "Networking",
      "Distributed Systems",
      "Redis",
      "MySQL",
      "Performance",
    ],
    industry: ["Operations"],
    description:
      "VNG tìm Kỹ sư Backend Game để phát triển hệ thống server cho các sản phẩm game online với hàng triệu người chơi đồng thời.\n\nYêu cầu:\n- 4+ năm kinh nghiệm backend C++ hoặc Go\n- Kinh nghiệm với distributed systems\n- Hiểu biết về networking và game server architecture\n- Khả năng tối ưu hiệu suất hệ thống",
    benefits: [
      {
        label: "Lương hấp dẫn theo năng lực",
        content:
          "Mức lương được xây dựng không theo thang bảng cứng mà linh hoạt dựa trên kinh nghiệm thực tế và kỹ năng kỹ thuật. Kỹ sư C++ hoặc Go giỏi có thể đàm phán mức lương vượt xa mặt bằng chung ngành game Việt Nam.",
      },
      {
        label: "Thưởng dự án",
        content:
          "Nhân viên nhận thưởng dự án đặc biệt khi game mới ra mắt thành công hoặc khi đạt milestone quan trọng về số lượng người chơi. Đây là phần thưởng ghi nhận trực tiếp sự đóng góp vào thành công của sản phẩm.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao phủ khám chữa bệnh nội ngoại trú và nha khoa tại các bệnh viện chất lượng. VNG đầu tư vào sức khỏe nhân viên để đội ngũ kỹ sư luôn có năng lượng và tinh thần tốt nhất.",
      },
      {
        label: "Zalo Premium",
        content:
          "Tài khoản Zalo OA Premium được cấp miễn phí, trải nghiệm các tính năng nâng cao của sản phẩm trong cùng hệ sinh thái VNG. Nhân viên VNG luôn được dùng sản phẩm của mình trước khi ra mắt công chúng.",
      },
      {
        label: "Thiết bị làm việc cao cấp",
        content:
          "Laptop hiệu suất cao phù hợp với công việc compile code C++ và chạy game server locally được cấp cho mỗi kỹ sư. Được trang bị màn hình ngoài và các thiết bị ngoại vi cần thiết để làm việc hiệu quả nhất.",
      },
    ],
    requirements: [
      {
        label: "Backend C++ hoặc Go",
        content:
          "Tối thiểu 4 năm kinh nghiệm lập trình backend với C++ hoặc Go trong môi trường production hiệu suất cao. Hiểu sâu về concurrency, lock-free programming và các kỹ thuật tối ưu đặc thù của từng ngôn ngữ.",
      },
      {
        label: "Distributed systems",
        content:
          "Kinh nghiệm thiết kế và vận hành hệ thống phân tán có độ sẵn sàng cao, xử lý hàng triệu request đồng thời. Hiểu rõ các thách thức của distributed computing như consistency, partition tolerance và failure handling.",
      },
      {
        label: "Networking & game server architecture",
        content:
          "Hiểu biết sâu về TCP/UDP networking, WebSocket và các giao thức truyền thông thời gian thực trong game. Có kinh nghiệm hoặc hiểu biết về các kiến trúc game server phổ biến như authoritative server và lock-step protocol.",
      },
      {
        label: "Tối ưu hiệu suất",
        content:
          "Kỹ năng profiling và tối ưu hiệu suất hệ thống ở mức thấp, bao gồm tối ưu cache locality, giảm latency và tăng throughput. Có kinh nghiệm xác định và giải quyết bottleneck trong hệ thống có tải cao với công cụ như perf, valgrind.",
      },
    ],
    slots: 3,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Kỹ sư Phần mềm Zalo (Node.js/Python)",
    companyIndex: 8,
    location: "TP. Hồ Chí Minh",
    salary: "20tr - 40tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Node.js",
      "Python",
      "Microservices",
      "Kafka",
      "Redis",
      "Elasticsearch",
      "Docker",
      "Kubernetes",
    ],
    industry: ["Finance"],
    description:
      "VNG tìm kỹ sư phần mềm để phát triển nền tảng Zalo – ứng dụng nhắn tin lớn nhất Việt Nam với hơn 74 triệu người dùng.\n\nYêu cầu:\n- 3+ năm kinh nghiệm backend\n- Thành thạo Node.js hoặc Python\n- Kinh nghiệm với large-scale systems",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương cạnh tranh trong ngành công nghệ Việt Nam, được xây dựng để thu hút kỹ sư giỏi muốn làm việc trên sản phẩm phục vụ hàng chục triệu người Việt Nam. Được review hàng năm theo hiệu suất cá nhân và thị trường.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên kết quả kinh doanh của công ty và đóng góp cá nhân trong năm. Kỹ sư có đóng góp kỹ thuật xuất sắc hoặc giải quyết được vấn đề khó sẽ nhận mức thưởng cao hơn mức chuẩn.",
      },
      {
        label: "Zalo OA Premium",
        content:
          "Được dùng Zalo OA Premium và các tính năng nội bộ trước khi ra mắt, trải nghiệm trực tiếp sản phẩm mình xây dựng. Nhân viên VNG thường là những người dùng đầu tiên và có tiếng nói trong quyết định tính năng mới.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao gồm khám nội ngoại trú và nha khoa tại các cơ sở y tế hợp tác. Nhân viên được khám sức khỏe định kỳ hàng năm miễn phí và theo dõi tình trạng sức khỏe dài hạn.",
      },
      {
        label: "Flexible working",
        content:
          "Lịch làm việc linh hoạt không yêu cầu check-in cố định, tạo điều kiện để kỹ sư làm việc trong khoảng thời gian năng suất nhất. Văn phòng mở cửa sáng sớm đến tối muộn để phù hợp với nhiều phong cách làm việc khác nhau.",
      },
      {
        label: "Cantine nội bộ",
        content:
          "Căng-tin nội bộ phục vụ bữa ăn trợ giá cho nhân viên với nhiều lựa chọn đa dạng và giá cả phải chăng hơn bên ngoài. Đây là không gian giao lưu, chia sẻ ý tưởng và xây dựng văn hóa công ty thoải mái.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm backend",
        content:
          "Tối thiểu 3 năm kinh nghiệm phát triển backend trong môi trường production, đã làm việc trên hệ thống có lượng người dùng thực tế đáng kể. Quen thuộc với việc xử lý các vấn đề scaling, caching và database optimization trong thực tế.",
      },
      {
        label: "Node.js hoặc Python",
        content:
          "Thành thạo Node.js để xây dựng API và microservices hiệu suất cao, hoặc Python để phát triển backend với khả năng xử lý dữ liệu mạnh mẽ. Hiểu rõ async programming, event loop và các pattern concurrency của ngôn ngữ đang dùng.",
      },
      {
        label: "Large-scale systems",
        content:
          "Có kinh nghiệm hoặc hiểu biết về các thách thức kỹ thuật khi vận hành hệ thống có hàng triệu người dùng đồng thời. Biết cách thiết kế hệ thống chịu được tải cao, tự phục hồi và dễ scale theo chiều ngang.",
      },
    ],
    slots: 5,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Chuyên viên Phân tích Dữ liệu - ZaloPay",
    companyIndex: 8,
    location: "TP. Hồ Chí Minh",
    salary: "18tr - 30tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "SQL",
      "Python",
      "Data Analysis",
      "Fintech",
      "Payment Analytics",
      "Power BI",
      "A/B Testing",
    ],
    industry: ["Sales"],
    description:
      "ZaloPay cần Data Analyst để phân tích hành vi giao dịch và tối ưu trải nghiệm người dùng ví điện tử.\n\nYêu cầu:\n- 2+ năm kinh nghiệm phân tích dữ liệu\n- Thành thạo SQL, Python\n- Kinh nghiệm fintech là lợi thế",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương cạnh tranh trong lĩnh vực fintech Việt Nam, được xây dựng phù hợp với kinh nghiệm phân tích dữ liệu thanh toán và ví điện tử. Được review theo hiệu suất và phạm vi trách nhiệm ngày càng mở rộng.",
      },
      {
        label: "ZaloPay cashback",
        content:
          "Được nhận cashback khi sử dụng ZaloPay cho các giao dịch hàng ngày, hưởng trực tiếp từ dịch vụ mình đang phân tích và cải thiện. Đây là lợi ích thiết thực giúp tiết kiệm trong cuộc sống hàng ngày.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao phủ khám chữa bệnh nội và ngoại trú tại các bệnh viện trong mạng lưới. Nhân viên được khám định kỳ hàng năm để chủ động theo dõi và bảo vệ sức khỏe.",
      },
      {
        label: "13 tháng lương",
        content:
          "Thưởng tháng lương thứ 13 cố định được chi trả vào cuối năm như một phần phúc lợi đảm bảo. Ngoài ra, có thêm các khoản thưởng biến đổi tùy theo kết quả hoạt động kinh doanh của ZaloPay trong năm đó.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm phân tích dữ liệu",
        content:
          "Tối thiểu 2 năm kinh nghiệm phân tích dữ liệu, đã trực tiếp thực hiện phân tích từ đầu đến cuối và trình bày kết quả cho stakeholder. Ưu tiên kinh nghiệm phân tích dữ liệu giao dịch tài chính hoặc hành vi người dùng ứng dụng.",
      },
      {
        label: "SQL & Python",
        content:
          "Thành thạo SQL để query dữ liệu giao dịch lớn từ data warehouse và Python để phân tích sâu hơn với thư viện pandas và visualization. Biết tối ưu query để xử lý hiệu quả hàng triệu bản ghi giao dịch mỗi ngày.",
      },
      {
        label: "Kinh nghiệm fintech",
        content:
          "Kinh nghiệm làm việc trong lĩnh vực fintech, ngân hàng số hoặc ví điện tử là lợi thế lớn. Hiểu về các chỉ số quan trọng trong thanh toán số như transaction success rate, fraud rate, churn và customer lifetime value.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "closed",
  },

  // ── MoMo (9) ──────────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Backend Cấp Cao - Nền tảng Thanh toán",
    companyIndex: 9,
    location: "TP. Hồ Chí Minh",
    salary: "30tr - 55tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Java",
      "Spring Boot",
      "Microservices",
      "Kafka",
      "Redis",
      "Payment Gateway",
      "Security",
      "Fintech",
    ],
    industry: ["Operations"],
    description:
      "MoMo tìm Senior Backend Engineer để xây dựng và tối ưu hệ thống thanh toán phục vụ hơn 31 triệu người dùng.\n\nYêu cầu:\n- 5+ năm kinh nghiệm backend\n- Thành thạo Java Spring Boot\n- Kinh nghiệm với hệ thống payment và bảo mật\n- Hiểu biết về PCI DSS",
    benefits: [
      {
        label: "Lương top fintech market",
        content:
          "Mức lương được định vị ở top thị trường fintech Việt Nam, phản ánh độ phức tạp và trách nhiệm cao của hệ thống thanh toán phục vụ hàng chục triệu người dùng. Benchmark định kỳ để đảm bảo luôn cạnh tranh với các ví điện tử khác.",
      },
      {
        label: "RSU",
        content:
          "Restricted Stock Unit được cấp cho kỹ sư Senior, cho phép trực tiếp hưởng lợi từ quá trình tăng trưởng định giá của MoMo. Đây là phần thu nhập dài hạn có tiềm năng giá trị lớn khi MoMo tiến gần đến IPO.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm sức khỏe cao cấp toàn diện cho nhân viên và người thân, không giới hạn chi phí điều trị trong hạn mức chương trình. Bao gồm khám sức khỏe định kỳ hàng năm tại bệnh viện quốc tế.",
      },
      {
        label: "MoMo credits",
        content:
          "Được cấp MoMo credits hàng tháng để sử dụng trên ứng dụng, thanh toán hóa đơn, mua sắm và chuyển tiền miễn phí. Trải nghiệm trực tiếp sản phẩm giúp kỹ sư có góc nhìn người dùng thực sự khi thiết kế hệ thống.",
      },
      {
        label: "Free lunch",
        content:
          "Bữa trưa miễn phí tại văn phòng với thực đơn đa dạng, giúp tiết kiệm thời gian và chi phí sinh hoạt hàng ngày. Đây cũng là không gian để kỹ sư giao lưu và chia sẻ ý tưởng kỹ thuật với đồng nghiệp các team khác.",
      },
      {
        label: "MacBook Pro",
        content:
          "MacBook Pro mới nhất được cấp để đảm bảo môi trường phát triển Java đủ nhanh và ổn định. Thiết bị được thay mới theo chu kỳ 2-3 năm hoặc sớm hơn nếu phát sinh nhu cầu kỹ thuật đặc biệt.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm backend",
        content:
          "Tối thiểu 5 năm kinh nghiệm phát triển hệ thống backend quan trọng trong môi trường production, đã xử lý hàng triệu giao dịch mỗi ngày. Quen thuộc với các thách thức của high-availability system và disaster recovery planning.",
      },
      {
        label: "Java Spring Boot",
        content:
          "Thành thạo Java Spring Boot ở mức có thể thiết kế kiến trúc microservices, xử lý transaction phức tạp và đảm bảo tính nhất quán dữ liệu. Hiểu sâu về Spring Security, Spring Batch và các cơ chế resilience như circuit breaker.",
      },
      {
        label: "Payment & bảo mật",
        content:
          "Kinh nghiệm trực tiếp với hệ thống payment gateway, xử lý giao dịch tài chính và implement các cơ chế chống gian lận. Hiểu biết về mã hóa dữ liệu nhạy cảm, tokenization và secure communication trong ngữ cảnh thanh toán.",
      },
      {
        label: "PCI DSS",
        content:
          "Hiểu biết về tiêu chuẩn bảo mật PCI DSS để đảm bảo hệ thống xử lý dữ liệu thẻ đáp ứng yêu cầu tuân thủ quốc tế. Có kinh nghiệm tham gia hoặc chuẩn bị cho audit PCI DSS là lợi thế quan trọng.",
      },
    ],
    slots: 3,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Kỹ sư Android (Kotlin) - MoMo App",
    companyIndex: 9,
    location: "TP. Hồ Chí Minh",
    salary: "22tr - 40tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Kotlin",
      "Android",
      "Jetpack Compose",
      "MVVM",
      "REST API",
      "Coroutines",
      "Unit Testing",
    ],
    industry: ["Marketing"],
    description:
      "MoMo tìm Android Developer để phát triển ứng dụng với hàng chục triệu lượt tải và hàng nghìn lượt update.\n\nYêu cầu:\n- 3+ năm kinh nghiệm Android Kotlin\n- Kinh nghiệm với Jetpack Compose\n- Hiểu biết về MVVM/Clean Architecture",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương Android Developer tại MoMo được định vị cạnh tranh với các ứng dụng fintech và super app hàng đầu Việt Nam. Được review theo hiệu suất và benchmark thị trường Android development hàng năm.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên số lượng và chất lượng tính năng đã ship, app store rating và đóng góp kỹ thuật tổng thể. Developer cải thiện được performance ứng dụng hoặc giảm crash rate sẽ được đánh giá cao đặc biệt.",
      },
      {
        label: "MoMo cashback",
        content:
          "Được nhận cashback khi sử dụng MoMo cho các giao dịch hàng ngày từ thanh toán điện nước đến mua sắm online. Trải nghiệm người dùng trực tiếp giúp developer hiểu rõ pain point và cải thiện ứng dụng tốt hơn.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện do MoMo chi trả, bao gồm khám nội ngoại trú và nha khoa tại các bệnh viện hợp tác. Được khám sức khỏe tổng quát định kỳ hàng năm tại cơ sở y tế chất lượng.",
      },
      {
        label: "Flexible working",
        content:
          "Lịch làm việc linh hoạt phù hợp với nhịp làm việc của developer, không yêu cầu giờ check-in cứng nhắc. Miễn hoàn thành sprint goal và tham gia đủ các buổi standup và planning theo lịch team đã thống nhất.",
      },
    ],
    requirements: [
      {
        label: "Android Kotlin",
        content:
          "Tối thiểu 3 năm kinh nghiệm phát triển Android bằng Kotlin, đã tham gia ít nhất một ứng dụng có lượng người dùng thực tế lớn. Thành thạo Kotlin coroutines, Flow và các tính năng ngôn ngữ hiện đại để viết code ngắn gọn và an toàn.",
      },
      {
        label: "Jetpack Compose",
        content:
          "Có kinh nghiệm xây dựng giao diện bằng Jetpack Compose theo hướng declarative UI, biết tối ưu hiệu suất recomposition. Hiểu rõ state management trong Compose và cách tích hợp với ViewModel và architecture components.",
      },
      {
        label: "MVVM/Clean Architecture",
        content:
          "Hiểu và áp dụng thành thạo kiến trúc MVVM kết hợp Clean Architecture để tổ chức code rõ ràng, dễ test và dễ bảo trì. Biết phân tách tầng domain, data và presentation đúng cách và tránh các anti-pattern phổ biến trong Android.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Chuyên viên Quan hệ Đối tác Thương mại (Partnership Executive)",
    companyIndex: 9,
    location: "TP. Hồ Chí Minh",
    salary: "18tr - 30tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Business Development",
      "Partnership",
      "B2B Sales",
      "Negotiation",
      "Fintech",
      "Digital Payment",
    ],
    industry: ["IT"],
    description:
      "MoMo tìm Partnership Executive để phát triển và duy trì quan hệ với các đối tác thương mại trên nền tảng.\n\nYêu cầu:\n- 3+ năm kinh nghiệm business development hoặc account management\n- Kỹ năng đàm phán tốt\n- Hiểu biết về fintech/e-payment",
    benefits: [
      {
        label: "Lương + hoa hồng",
        content:
          "Thu nhập gồm lương cơ bản ổn định và hoa hồng dựa trên số lượng và chất lượng đối tác mới ký kết thành công. Cơ chế hoa hồng minh bạch và không giới hạn trần, khuyến khích phát triển danh mục đối tác bền vững.",
      },
      {
        label: "MoMo credits",
        content:
          "Được cấp MoMo credits hàng tháng để sử dụng trên ứng dụng và chia sẻ trải nghiệm thực tế khi tiếp xúc đối tác. Hiểu sâu sản phẩm từ góc độ người dùng giúp Partnership Executive tư vấn và thuyết phục đối tác hiệu quả hơn.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao phủ khám chữa bệnh nội ngoại trú, đặc biệt hữu ích với lịch công tác gặp gỡ đối tác dày đặc. Bảo hiểm tai nạn 24/7 cũng được bao gồm cho những di chuyển thường xuyên.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên tổng doanh thu từ danh mục đối tác quản lý và mức độ hài lòng, retention của đối tác hiện có. Đây là sự ghi nhận toàn diện cho cả nỗ lực phát triển mới lẫn duy trì mối quan hệ dài hạn.",
      },
    ],
    requirements: [
      {
        label: "Business development / Account management",
        content:
          "Tối thiểu 3 năm kinh nghiệm trong vai trò business development hoặc account management B2B, đã trực tiếp ký kết các thỏa thuận đối tác có giá trị. Quen thuộc với quy trình bán hàng doanh nghiệp từ prospecting đến closing.",
      },
      {
        label: "Kỹ năng đàm phán",
        content:
          "Kỹ năng đàm phán tốt để thương lượng điều khoản hợp tác có lợi cho cả hai bên, xây dựng quan hệ đối tác bền vững thay vì giao dịch một lần. Có khả năng xử lý phản đối từ phía đối tác và tìm ra giải pháp sáng tạo.",
      },
      {
        label: "Hiểu biết fintech/e-payment",
        content:
          "Hiểu biết về hệ sinh thái fintech, ví điện tử và các mô hình kinh doanh thanh toán số để tư vấn cho đối tác một cách thuyết phục. Biết cách trình bày lợi ích tích hợp MoMo cho từng loại hình đối tác khác nhau từ siêu thị đến dịch vụ online.",
      },
    ],
    slots: 4,
    isHot: false,
    statusVariant: "published_future",
  },

  // ── Tiki (10) ────────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Nền tảng Backend (Golang)",
    companyIndex: 10,
    location: "TP. Hồ Chí Minh",
    salary: "25tr - 45tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Go",
      "Microservices",
      "gRPC",
      "Kafka",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Kubernetes",
    ],
    industry: ["Finance"],
    description:
      "Tiki tìm Senior Backend Engineer (Golang) để xây dựng nền tảng e-commerce phục vụ hàng triệu khách hàng Việt Nam.\n\nYêu cầu:\n- 4+ năm kinh nghiệm backend\n- Thành thạo Go\n- Kinh nghiệm microservices quy mô lớn\n- Thành thạo thiết kế database",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương Go developer tại Tiki được định vị cạnh tranh, phản ánh độ khan hiếm của kỹ sư Golang giỏi tại thị trường Việt Nam. Được benchmark với các công ty e-commerce và fintech trong khu vực để luôn ở mức hấp dẫn.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên hiệu suất cá nhân, chất lượng các service đã phát triển và đóng góp vào năng suất của toàn đội engineering. Kỹ sư có đóng góp cải thiện performance hệ thống quy mô lớn sẽ được ghi nhận đặc biệt.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao phủ khám chữa bệnh nội và ngoại trú tại các bệnh viện hợp tác trên toàn quốc. Tiki chi trả 100% phí bảo hiểm cho nhân viên và một phần cho người thân.",
      },
      {
        label: "Free TikiNOW shipping",
        content:
          "Được miễn phí vận chuyển TikiNOW không giới hạn cho tất cả đơn hàng trên Tiki, tiết kiệm đáng kể chi phí mua sắm hàng ngày. Nhân viên cũng được tiếp cận các ưu đãi flash sale nội bộ trước khi công bố rộng rãi.",
      },
      {
        label: "MacBook",
        content:
          "MacBook được cấp phù hợp với nhu cầu develop Go và chạy môi trường microservices local bằng Docker. Thiết bị đủ mạnh để làm việc hiệu quả với các công cụ như minikube và nhiều service chạy song song.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm backend",
        content:
          "Tối thiểu 4 năm kinh nghiệm phát triển backend trong môi trường production, đã xử lý các thách thức về scalability và reliability thực tế. Quen thuộc với monitoring, alerting và on-call rotation trong hệ thống quan trọng.",
      },
      {
        label: "Thành thạo Go",
        content:
          "Thành thạo ngôn ngữ Go với hiểu biết sâu về goroutine, channel, interface và các idiom đặc trưng của Go. Biết cách viết code idiomatic Go, quản lý dependency hiệu quả và tối ưu hiệu suất ứng dụng.",
      },
      {
        label: "Microservices quy mô lớn",
        content:
          "Kinh nghiệm thiết kế, xây dựng và vận hành kiến trúc microservices phục vụ hàng triệu request mỗi ngày. Hiểu các pattern như saga, CQRS, event sourcing và biết khi nào nên và không nên áp dụng trong e-commerce.",
      },
      {
        label: "Thiết kế database",
        content:
          "Thành thạo thiết kế schema database quan hệ, tối ưu index và query cho workload e-commerce đặc thù. Có kinh nghiệm với cả SQL và NoSQL, biết cách chọn giải pháp lưu trữ phù hợp với từng use case cụ thể.",
      },
    ],
    slots: 3,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Quản lý Phân tích Sản phẩm (Product Analytics Manager)",
    companyIndex: 10,
    location: "TP. Hồ Chí Minh",
    salary: "40tr - 65tr",
    type: "FULL_TIME",
    level: "Manager",
    tags: [
      "Product Analytics",
      "SQL",
      "Python",
      "A/B Testing",
      "Data-driven Product",
      "Team Management",
    ],
    industry: ["HR"],
    description:
      "Tiki tìm Product Analytics Manager để dẫn dắt đội ngũ phân tích sản phẩm và cung cấp insight chiến lược cho C-level.\n\nYêu cầu:\n- 6+ năm kinh nghiệm data/product analytics\n- Kinh nghiệm quản lý team\n- Thành thạo SQL, Python\n- Tiếng Anh thành thạo",
    benefits: [
      {
        label: "Gói lương hấp dẫn",
        content:
          "Mức lương cấp Manager trong lĩnh vực product analytics được xây dựng hấp dẫn, phản ánh trách nhiệm dẫn dắt team và cung cấp insight chiến lược cho ban lãnh đạo. Thương lượng linh hoạt dựa trên kinh nghiệm và phạm vi quản lý.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên chất lượng và tác động của các phân tích sản phẩm do team thực hiện, đo bằng mức độ adoption của insight trong quyết định sản phẩm. Manager đào tạo team mạnh và deliver insight chiến lược sẽ được thưởng xứng đáng.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm cao cấp cấp Manager bao phủ toàn diện cho cả gia đình, với mức quyền lợi cao hơn gói nhân viên thông thường. Bao gồm nội trú không giới hạn và hỗ trợ điều trị tại bệnh viện quốc tế.",
      },
      {
        label: "RSU",
        content:
          "Restricted Stock Unit được cấp cho Manager trở lên tại Tiki, tạo động lực gắn bó lâu dài và chia sẻ kết quả tăng trưởng của công ty. Vest theo lịch 4 năm với cliff 1 năm, giá trị tăng theo giá trị doanh nghiệp.",
      },
      {
        label: "Remote partial",
        content:
          "Chính sách hybrid linh hoạt cho phép làm việc từ xa vài ngày mỗi tuần, phù hợp với vai trò Manager cần thời gian suy nghĩ chiến lược không bị gián đoạn. Lịch remote được thỏa thuận linh hoạt với đội ngũ và stakeholder.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm data/product analytics",
        content:
          "Tối thiểu 6 năm kinh nghiệm trong lĩnh vực data analytics hoặc product analytics, đã trực tiếp dẫn dắt phân tích ảnh hưởng đến quyết định sản phẩm quan trọng. Có track record rõ ràng về insight chuyển thành hành động và tạo ra impact đo lường được.",
      },
      {
        label: "Quản lý team",
        content:
          "Kinh nghiệm xây dựng và dẫn dắt đội ngũ analyst từ 3 người trở lên, bao gồm tuyển dụng, coaching và phát triển nghề nghiệp cho team members. Biết phân bổ công việc hiệu quả và xây dựng văn hóa làm việc dữ liệu trong team.",
      },
      {
        label: "SQL & Python",
        content:
          "Thành thạo SQL để query và validate dữ liệu, Python để phân tích nâng cao và xây dựng công cụ tự động hóa cho team. Đủ kỹ năng kỹ thuật để review công việc của team analyst và hỗ trợ khi gặp vấn đề phức tạp.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo để trình bày insight và recommendation trước ban lãnh đạo quốc tế và làm việc với công cụ analytics bằng tiếng Anh. Khả năng viết báo cáo phân tích rõ ràng, thuyết phục bằng tiếng Anh cho stakeholder đa quốc gia.",
      },
    ],
    slots: 1,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Chuyên viên Kinh doanh - Merchant Acquisition",
    companyIndex: 10,
    location: "TP. Hồ Chí Minh",
    salary: "15tr - 25tr",
    type: "FULL_TIME",
    level: "Junior",
    tags: [
      "B2B Sales",
      "E-commerce",
      "Merchant Onboarding",
      "Negotiation",
      "CRM",
      "Cold Calling",
    ],
    industry: ["HR"],
    description:
      "Tiki tìm Chuyên viên Merchant Acquisition để phát triển số lượng nhà bán hàng trên sàn.\n\nYêu cầu:\n- 1-2 năm kinh nghiệm sales B2B\n- Kỹ năng giao tiếp và thuyết phục tốt\n- Chịu áp lực KPI",
    benefits: [
      {
        label: "Lương cơ bản + hoa hồng",
        content:
          "Thu nhập gồm lương cơ bản ổn định cộng hoa hồng dựa trên số lượng merchant mới thành công onboard lên sàn Tiki. Cơ chế hoa hồng rõ ràng giúp nhân viên tự tính toán được thu nhập kỳ vọng theo kết quả thực tế.",
      },
      {
        label: "TikiNOW vouchers",
        content:
          "Được cấp voucher mua sắm TikiNOW hàng tháng để trải nghiệm sản phẩm trên sàn và hiểu trải nghiệm của merchant lẫn khách hàng. Tiết kiệm chi phí mua sắm hàng ngày và có insight thực tế để tư vấn merchant hiệu quả hơn.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe hỗ trợ chi phí khám chữa bệnh nội và ngoại trú, đặc biệt quan trọng với lịch công tác gặp gỡ merchant dày đặc. Bảo hiểm xã hội đầy đủ được đóng từ ngày đầu tiên chính thức.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên tổng số merchant đã acquire và chất lượng của danh mục merchant quản lý theo revenue mang lại. Đây là sự ghi nhận đóng góp của cả năm không chỉ dựa vào kết quả một vài tháng cuối năm.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm sales B2B",
        content:
          "1-2 năm kinh nghiệm bán hàng B2B, đã trực tiếp tiếp cận khách hàng doanh nghiệp qua cold calling, gặp gỡ trực tiếp và email. Có khả năng tự quản lý pipeline và theo dõi tiến độ deal từ prospect đến closing.",
      },
      {
        label: "Giao tiếp và thuyết phục",
        content:
          "Kỹ năng giao tiếp tốt và khả năng trình bày lợi ích của việc bán hàng trên Tiki một cách thuyết phục với nhiều loại merchant khác nhau. Biết lắng nghe lo ngại của merchant và đưa ra giải pháp phù hợp thay vì chỉ pitch một chiều.",
      },
      {
        label: "Chịu áp lực KPI",
        content:
          "Sẵn sàng làm việc trong môi trường có KPI rõ ràng về số lượng merchant mới mỗi tháng và duy trì tinh thần tích cực ngay cả khi gặp tỷ lệ từ chối cao. Kiên trì và liên tục cải thiện kỹ thuật tiếp cận dựa trên feedback thực tế từ thị trường.",
      },
    ],
    slots: 5,
    isHot: false,
    statusVariant: "published_past",
  },

  // ── Lazada (11) ──────────────────────────────────────────────────────────────
  {
    title: "Quản lý Vận hành Kho (Warehouse Operations Manager)",
    companyIndex: 11,
    location: "TP. Hồ Chí Minh",
    salary: "30tr - 50tr",
    type: "FULL_TIME",
    level: "Manager",
    tags: [
      "Warehouse Management",
      "WMS",
      "Inventory Control",
      "Team Supervision",
      "Process Improvement",
      "ERP",
      "Logistics",
    ],
    industry: ["Sales"],
    description:
      "Lazada tìm Warehouse Operations Manager để lãnh đạo đội ngũ 100+ nhân viên kho tại trung tâm phân phối TP.HCM.\n\nYêu cầu:\n- 5+ năm kinh nghiệm quản lý kho e-commerce\n- Thành thạo WMS\n- Kinh nghiệm quản lý nhóm lớn\n- Hiểu biết về lean warehouse",
    benefits: [
      {
        label: "Gói lương hấp dẫn",
        content:
          "Mức lương Manager chuỗi cung ứng được xây dựng hấp dẫn, phản ánh trách nhiệm vận hành kho lớn với hàng trăm nhân viên và hàng triệu đơn hàng mỗi năm. Được review theo kết quả KPI vận hành thực tế hàng năm.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên các chỉ số kho quan trọng như accuracy rate, on-time delivery và cost efficiency. Manager cải thiện được năng suất kho và giảm tỷ lệ lỗi sẽ nhận mức thưởng đặc biệt ngoài thưởng tiêu chuẩn.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm cao cấp cấp Manager bao phủ toàn diện cho nhân viên và gia đình, với mức quyền lợi cao. Bảo hiểm tai nạn lao động đặc biệt quan trọng trong môi trường vận hành kho với xe nâng và thiết bị vận chuyển.",
      },
      {
        label: "Xe đưa đón",
        content:
          "Được hỗ trợ xe đưa đón từ các điểm tập kết gần trung tâm phân phối, giúp Manager không phải lo lắng về di chuyển đến địa điểm kho ở ngoại ô. Đặc biệt hữu ích trong ca sáng sớm và ca tối của môi trường kho 24/7.",
      },
      {
        label: "Lazada vouchers",
        content:
          "Voucher mua sắm Lazada hàng tháng để trải nghiệm dịch vụ từ góc độ khách hàng và hiểu rõ hành trình đơn hàng từ đặt mua đến nhận tay. Giúp Manager đưa ra quyết định vận hành kho dựa trên trải nghiệm thực tế.",
      },
    ],
    requirements: [
      {
        label: "Quản lý kho e-commerce",
        content:
          "Tối thiểu 5 năm kinh nghiệm quản lý kho trong lĩnh vực e-commerce hoặc logistics, đã trực tiếp điều hành kho có quy mô từ 50 nhân viên trở lên. Có kinh nghiệm xử lý peak season với khối lượng đơn hàng tăng đột biến 3-5 lần bình thường.",
      },
      {
        label: "Warehouse Management System",
        content:
          "Thành thạo WMS để quản lý inbound, outbound, inventory count và putaway strategy hiệu quả. Có kinh nghiệm configure và train nhân viên sử dụng WMS, biết khai thác dữ liệu từ hệ thống để ra quyết định vận hành.",
      },
      {
        label: "Quản lý nhóm lớn",
        content:
          "Kinh nghiệm quản lý đội ngũ 100+ nhân viên, bao gồm cả nhân viên chính thức và lao động thời vụ trong mùa cao điểm. Biết xây dựng cấu trúc team, phân cấp quản lý và duy trì tinh thần đội ngũ trong môi trường làm việc thể chất nặng.",
      },
      {
        label: "Lean warehouse",
        content:
          "Hiểu biết và có kinh nghiệm áp dụng các nguyên tắc lean vào vận hành kho như 5S, kaizen và value stream mapping. Đã thực hiện ít nhất một dự án cải tiến quy trình kho và đo lường được kết quả cải thiện thực tế.",
      },
    ],
    slots: 1,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Marketing Hiệu suất (Performance Marketing Specialist)",
    companyIndex: 11,
    location: "TP. Hồ Chí Minh",
    salary: "18tr - 30tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Performance Marketing",
      "Facebook Ads",
      "Google Ads",
      "A/B Testing",
      "Analytics",
      "Attribution",
      "Budget Optimization",
    ],
    industry: ["HR"],
    description:
      "Lazada tìm Performance Marketing Specialist để tối ưu chi phí acquisition và phát triển user base.\n\nYêu cầu:\n- 3+ năm kinh nghiệm performance marketing\n- Kinh nghiệm quản lý Facebook/Google Ads\n- Tư duy data-driven",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương Performance Marketing Specialist được định vị cạnh tranh trong ngành e-commerce, phản ánh kỹ năng tối ưu chi phí quảng cáo và đo lường ROI. Được review theo kết quả campaign thực tế hàng năm.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên các chỉ số hiệu suất marketing như CPA, ROAS và tăng trưởng user base so với đầu năm. Specialist cải thiện được hiệu quả chi tiêu quảng cáo đáng kể sẽ được thưởng vượt mức tiêu chuẩn.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao phủ nội ngoại trú và nha khoa cho nhân viên, giúp yên tâm tập trung vào công việc sáng tạo và phân tích. Được khám sức khỏe tổng quát định kỳ hàng năm miễn phí.",
      },
      {
        label: "Lazada vouchers",
        content:
          "Voucher mua sắm Lazada hàng tháng để mua sắm trực tiếp trên sàn và trải nghiệm user journey từ góc độ khách hàng thực sự. Hiểu trải nghiệm mua sắm giúp specialist tối ưu landing page và quảng cáo hiệu quả hơn.",
      },
      {
        label: "Flexible hours",
        content:
          "Lịch làm việc linh hoạt phù hợp với tính chất công việc performance marketing cần theo dõi campaign liên tục nhưng không cần có mặt văn phòng cố định. Được làm việc từ xa những ngày không cần họp trực tiếp.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm performance marketing",
        content:
          "Tối thiểu 3 năm kinh nghiệm trong vai trò performance marketing, đã trực tiếp quản lý ngân sách quảng cáo đáng kể và chứng minh được khả năng cải thiện ROI. Ưu tiên kinh nghiệm trong ngành e-commerce hoặc marketplace.",
      },
      {
        label: "Facebook/Google Ads",
        content:
          "Thành thạo quản lý và tối ưu campaign trên Facebook Ads Manager và Google Ads, bao gồm cả search, display, shopping và retargeting. Biết tận dụng automated bidding, audience targeting và creative testing để tối ưu hiệu quả chi tiêu.",
      },
      {
        label: "Tư duy data-driven",
        content:
          "Ra quyết định dựa trên dữ liệu, biết đặt câu hỏi đúng và truy xuất insight từ số liệu campaign và hành vi người dùng. Thành thạo Google Analytics, Facebook Analytics và các công cụ attribution để hiểu rõ customer journey đa kênh.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Nhân viên Chăm sóc Khách hàng (Customer Service Agent)",
    companyIndex: 11,
    location: "TP. Hồ Chí Minh",
    salary: "12tr - 18tr",
    type: "FULL_TIME",
    level: "Junior",
    tags: [
      "Customer Service",
      "CRM",
      "Problem Solving",
      "Communication",
      "Email Support",
      "Live Chat",
    ],
    industry: ["Marketing"],
    description:
      "Lazada tuyển Customer Service Agent để hỗ trợ người mua và người bán trên nền tảng.\n\nYêu cầu:\n- Tốt nghiệp đại học\n- Kỹ năng giao tiếp và xử lý tình huống tốt\n- Sẵn sàng làm ca",
    benefits: [
      {
        label: "Lương cơ bản + KPI bonus",
        content:
          "Lương cơ bản ổn định cộng thêm KPI bonus hàng tháng khi đạt các chỉ tiêu về chất lượng xử lý ticket, CSAT và thời gian phản hồi. Cơ chế KPI minh bạch giúp nhân viên biết chính xác cần làm gì để tăng thu nhập.",
      },
      {
        label: "Bảo hiểm xã hội",
        content:
          "Được đóng đầy đủ bảo hiểm xã hội, bảo hiểm y tế và bảo hiểm thất nghiệp từ ngày đầu tiên ký hợp đồng chính thức. Đây là nền tảng an sinh xã hội quan trọng cho nhân viên dịch vụ khách hàng.",
      },
      {
        label: "Đào tạo bài bản",
        content:
          "Được đào tạo bài bản về sản phẩm, quy trình xử lý khiếu nại và kỹ năng giao tiếp khách hàng trước khi chính thức nhận việc. Đào tạo định kỳ về chính sách mới và kỹ năng xử lý tình huống khó để liên tục nâng cao chất lượng phục vụ.",
      },
      {
        label: "Lazada vouchers",
        content:
          "Voucher mua sắm Lazada được cấp hàng tháng để trải nghiệm dịch vụ từ góc độ khách hàng thực tế. Hiểu trải nghiệm mua sắm giúp CS Agent đồng cảm và hỗ trợ khách hàng hiệu quả hơn trong các tình huống phát sinh.",
      },
    ],
    requirements: [
      {
        label: "Bằng đại học",
        content:
          "Tốt nghiệp đại học bất kỳ chuyên ngành, ưu tiên Kinh tế, Quản trị Kinh doanh hoặc các ngành liên quan đến dịch vụ. Không yêu cầu kinh nghiệm, Lazada sẽ đào tạo nghiệp vụ CS từ đầu cho ứng viên phù hợp.",
      },
      {
        label: "Giao tiếp và xử lý tình huống",
        content:
          "Kỹ năng giao tiếp rõ ràng, lịch sự và kiên nhẫn, đặc biệt trong các tình huống khách hàng khó tính hoặc phàn nàn gay gắt. Có khả năng lắng nghe tích cực, xác định vấn đề nhanh và đề xuất giải pháp thỏa đáng.",
      },
      {
        label: "Sẵn sàng làm ca",
        content:
          "Linh hoạt làm việc theo ca, bao gồm ca sáng, chiều và cuối tuần theo lịch phân công của bộ phận. CS Lazada hoạt động nhiều ca để đảm bảo hỗ trợ khách hàng liên tục, đặc biệt trong các mùa sale lớn.",
      },
    ],
    slots: 10,
    isHot: false,
    statusVariant: "published_future",
  },

  // ── Deloitte (12) ────────────────────────────────────────────────────────────
  {
    title: "Senior Consultant - Tư vấn Chuyển đổi Số",
    companyIndex: 12,
    location: "TP. Hồ Chí Minh",
    salary: "30tr - 55tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Digital Transformation",
      "IT Strategy",
      "Change Management",
      "ERP",
      "Cloud Advisory",
      "Project Management",
    ],
    industry: ["HR"],
    description:
      "Deloitte Consulting tìm Senior Consultant để tư vấn chuyển đổi số cho các tập đoàn lớn.\n\nYêu cầu:\n- 4+ năm kinh nghiệm tư vấn CNTT hoặc chuyển đổi số\n- Kinh nghiệm triển khai ERP (SAP/Oracle)\n- Kỹ năng quản lý dự án\n- Tiếng Anh thành thạo",
    benefits: [
      {
        label: "Lương cạnh tranh Big 4",
        content:
          "Mức lương Senior Consultant tại Deloitte được định vị cạnh tranh trong nhóm Big 4, thu hút những nhân tài muốn làm việc trên các dự án chuyển đổi số quy mô lớn nhất Việt Nam. Được review theo hiệu suất và market rate hàng năm.",
      },
      {
        label: "Performance bonus",
        content:
          "Thưởng hiệu suất dựa trên chất lượng deliverable, mức độ hài lòng của khách hàng và đóng góp vào phát triển kinh doanh của practice. Consultant có nhiều khách hàng repeat và được khách hàng yêu cầu làm việc trực tiếp sẽ nhận thưởng cao hơn.",
      },
      {
        label: "International travel",
        content:
          "Cơ hội di chuyển sang các văn phòng Deloitte toàn cầu để thực hiện dự án chuyển đổi số cho khách hàng đa quốc gia. Trải nghiệm làm việc quốc tế là lợi thế nghề nghiệp lớn giúp mở rộng mạng lưới và hiểu biết về chuẩn mực toàn cầu.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm sức khỏe cao cấp toàn diện cho nhân viên và gia đình, đặc biệt hữu ích trong giai đoạn go-live dự án với áp lực và giờ làm việc cao. Bao gồm cả hỗ trợ sức khỏe tâm thần và tư vấn tâm lý.",
      },
      {
        label: "Training budget",
        content:
          "Ngân sách đào tạo hàng năm để tham dự khóa học, hội nghị công nghệ và lấy chứng chỉ liên quan đến ERP, cloud và digital transformation. Deloitte đầu tư vào năng lực của consultant như một phần chiến lược cạnh tranh dài hạn.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm tư vấn IT/chuyển đổi số",
        content:
          "Tối thiểu 4 năm kinh nghiệm tư vấn CNTT hoặc chuyển đổi số, đã trực tiếp dẫn dắt workstream trong dự án ERP hoặc digital transformation tại tổ chức có quy mô lớn. Quen thuộc với các giai đoạn dự án từ discovery, design đến deploy và stabilize.",
      },
      {
        label: "ERP SAP/Oracle",
        content:
          "Kinh nghiệm triển khai ít nhất một module ERP SAP hoặc Oracle trong môi trường doanh nghiệp thực tế, từ thu thập yêu cầu đến go-live. Biết cách bridge gap giữa yêu cầu nghiệp vụ và giải pháp kỹ thuật trong ngữ cảnh ERP.",
      },
      {
        label: "Quản lý dự án",
        content:
          "Kỹ năng quản lý dự án đủ để lập kế hoạch, theo dõi tiến độ và quản lý rủi ro trong môi trường dự án tư vấn phức tạp. Kinh nghiệm với các phương pháp như Agile, Waterfall hoặc hybrid tùy theo yêu cầu khách hàng.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo để giao tiếp với khách hàng đa quốc gia, viết tài liệu tư vấn và trình bày trước ban lãnh đạo cấp cao. Kỹ năng thuyết trình và storytelling bằng tiếng Anh sắc sảo là yêu cầu quan trọng trong môi trường Big 4.",
      },
    ],
    slots: 3,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Manager - Dịch vụ Kiểm toán",
    companyIndex: 12,
    location: "TP. Hồ Chí Minh",
    salary: "55tr - 85tr",
    type: "FULL_TIME",
    level: "Manager",
    tags: [
      "Audit Management",
      "IFRS",
      "Team Leadership",
      "Client Management",
      "Financial Services",
      "Big 4",
    ],
    industry: ["IT"],
    description:
      "Deloitte tìm Audit Manager để lãnh đạo nhóm kiểm toán và quản lý quan hệ khách hàng cấp cao.\n\nYêu cầu:\n- 7+ năm kinh nghiệm kiểm toán (Big 4)\n- ACCA/CPA/CFA\n- Kinh nghiệm quản lý nhóm 5+ người\n- Tiếng Anh thành thạo",
    benefits: [
      {
        label: "Gói lương Manager Big 4",
        content:
          "Mức lương Audit Manager tại Deloitte thuộc top thị trường kiểm toán và tài chính, phản ánh trách nhiệm quản lý nhiều engagement cùng lúc và quan hệ với khách hàng cấp C-level. Được benchmark với thị trường và điều chỉnh cạnh tranh hàng năm.",
      },
      {
        label: "Annual bonus lớn",
        content:
          "Thưởng cuối năm đáng kể dựa trên revenue của các engagement phụ trách, chất lượng kiểm toán và mức độ hài lòng của khách hàng. Manager đóng góp vào phát triển kinh doanh mới và cross-sell sẽ nhận thưởng vượt mức tiêu chuẩn.",
      },
      {
        label: "RSU",
        content:
          "Restricted Stock Unit là phần thu nhập dài hạn quan trọng dành cho Manager trở lên tại Deloitte, tạo động lực gắn bó và chia sẻ thành công của công ty. Đây là tín hiệu rõ ràng về cam kết phát triển nhân tài dài hạn của Deloitte.",
      },
      {
        label: "Bảo hiểm VIP",
        content:
          "Gói bảo hiểm VIP cấp Manager với quyền lợi vượt trội, không giới hạn chi phí điều trị và bao phủ toàn bộ gia đình tại các bệnh viện quốc tế. Mức bảo hiểm nhân thọ và tai nạn cũng được nâng lên đáng kể so với nhân viên thông thường.",
      },
      {
        label: "International secondment",
        content:
          "Cơ hội được phái cử sang văn phòng Deloitte tại các trung tâm tài chính lớn như Singapore, Hồng Kông hoặc Úc từ 3-12 tháng. Đây là trải nghiệm quý giá giúp Audit Manager mở rộng tầm nhìn và xây dựng mạng lưới chuyên môn toàn cầu.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm kiểm toán Big 4",
        content:
          "Tối thiểu 7 năm kinh nghiệm kiểm toán, trong đó phần lớn tại Big 4 hoặc công ty kiểm toán quốc tế. Đã dẫn dắt nhóm kiểm toán nhiều engagement cùng lúc và quản lý quan hệ khách hàng từ cấp CFO trở lên.",
      },
      {
        label: "ACCA/CPA/CFA",
        content:
          "Bắt buộc có ít nhất một chứng chỉ chuyên môn ACCA, CPA hoặc CFA còn hiệu lực. Các chứng chỉ này là bằng chứng về kiến thức chuyên môn đạt chuẩn quốc tế và cam kết với sự phát triển nghề nghiệp liên tục.",
      },
      {
        label: "Quản lý nhóm",
        content:
          "Kinh nghiệm quản lý và phát triển đội ngũ ít nhất 5 người, bao gồm cả Senior và Associate, từ phân công công việc đến đánh giá hiệu suất và coaching. Biết xây dựng văn hóa kiểm toán chuyên nghiệp và duy trì tinh thần nhóm trong mùa cao điểm.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo ở mức có thể thuyết trình báo cáo kiểm toán trực tiếp với Board of Directors của khách hàng FDI và làm việc với đội kiểm toán quốc tế. Kỹ năng viết báo cáo kiểm toán chuyên nghiệp và thư trao đổi khách hàng bằng tiếng Anh.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Analyst - Tư vấn Rủi ro & Tuân thủ",
    companyIndex: 12,
    location: "TP. Hồ Chí Minh",
    salary: "16tr - 24tr",
    type: "FULL_TIME",
    level: "Junior",
    tags: [
      "Risk Advisory",
      "Compliance",
      "Internal Control",
      "AML/KYC",
      "Regulatory",
      "Financial Services",
    ],
    industry: ["Marketing"],
    description:
      "Deloitte Risk Advisory tuyển Analyst để hỗ trợ các dự án tư vấn quản lý rủi ro cho ngân hàng và tổ chức tài chính.\n\nYêu cầu:\n- Tốt nghiệp chuyên ngành Tài chính/Kế toán/Luật\n- Tiếng Anh IELTS 6.5+\n- Có chứng chỉ FRM là lợi thế",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương Analyst tại Deloitte Risk Advisory cạnh tranh so với các vị trí tương đương trong ngành tư vấn và tài chính. Được xem xét tăng nhanh khi nhân viên hoàn thành chứng chỉ chuyên môn và chứng minh được năng lực trong dự án.",
      },
      {
        label: "ACCA/FRM support",
        content:
          "Deloitte hỗ trợ học phí và thời gian học cho ACCA và FRM, giúp Analyst nhanh chóng có nền tảng chứng chỉ vững chắc. Đây là lợi thế lớn vì chi phí thi ACCA và FRM khá cao nếu tự bỏ tiền túi.",
      },
      {
        label: "Big 4 training",
        content:
          "Được đào tạo bài bản về phương pháp tư vấn rủi ro, framework phân tích và kỹ năng trình bày theo chuẩn Deloitte toàn cầu. Nền tảng đào tạo Big 4 là tài sản nghề nghiệp có giá trị suốt sự nghiệp.",
      },
      {
        label: "Fast promotion",
        content:
          "Lộ trình thăng tiến rõ ràng từ Analyst lên Senior Consultant trong 2-3 năm nếu đáp ứng tiêu chí hiệu suất và hoàn thiện chứng chỉ chuyên môn. Deloitte khuyến khích và tạo điều kiện để nhân viên giỏi thăng tiến nhanh hơn lộ trình tiêu chuẩn.",
      },
      {
        label: "Bảo hiểm",
        content:
          "Gói bảo hiểm sức khỏe toàn diện cho nhân viên, bao phủ chi phí khám chữa bệnh tại các bệnh viện trong mạng lưới. Bảo hiểm xã hội và bảo hiểm y tế được đóng đầy đủ từ ngày đầu tiên ký hợp đồng chính thức.",
      },
    ],
    requirements: [
      {
        label: "Bằng Tài chính/Kế toán/Luật",
        content:
          "Tốt nghiệp đại học loại Khá trở lên chuyên ngành Tài chính, Kế toán, Kiểm toán hoặc Luật kinh tế từ trường đại học uy tín. Kiến thức nền vững về tài chính doanh nghiệp và quy định pháp lý là nền tảng quan trọng cho công việc tư vấn rủi ro.",
      },
      {
        label: "IELTS 6.5+",
        content:
          "Điểm IELTS 6.5 trở lên hoặc bằng chứng tương đương, đủ để làm việc trong môi trường đa ngôn ngữ của Deloitte với nhiều khách hàng và tài liệu bằng tiếng Anh. Tiếng Anh tốt là yếu tố phân biệt giữa các ứng viên năng lực tương đương.",
      },
      {
        label: "FRM",
        content:
          "Chứng chỉ FRM (Financial Risk Manager) hoặc đang theo học là lợi thế rõ ràng, thể hiện định hướng nghề nghiệp trong lĩnh vực quản lý rủi ro tài chính. Ứng viên có FRM Part I sẽ được ưu tiên so với ứng viên chưa bắt đầu học.",
      },
    ],
    slots: 5,
    isHot: false,
    statusVariant: "published_future",
  },

  // ── Be Group (13) ────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Mobile - Ứng dụng Be (Flutter)",
    companyIndex: 13,
    location: "Hà Nội",
    salary: "18tr - 35tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Flutter",
      "Dart",
      "iOS",
      "Android",
      "REST API",
      "Firebase",
      "Git",
      "Agile",
    ],
    industry: ["Marketing"],
    description:
      "Be Group tìm Mobile Developer (Flutter) để phát triển ứng dụng gọi xe hàng đầu Việt Nam.\n\nYêu cầu:\n- 2+ năm kinh nghiệm Flutter\n- Hiểu biết về native iOS và Android\n- Kinh nghiệm publish app\n- Tiếng Anh đọc hiểu tốt",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương Flutter developer tại Be Group được định vị cạnh tranh trong thị trường ride-hailing và công nghệ Việt Nam. Được review hàng năm với mức tăng phụ thuộc vào hiệu suất cá nhân và tầm ảnh hưởng của công việc đến sản phẩm.",
      },
      {
        label: "Be credits hàng tháng",
        content:
          "Được cấp Be credits hàng tháng để đặt xe và sử dụng các dịch vụ trên ứng dụng Be hoàn toàn miễn phí. Trải nghiệm trực tiếp sản phẩm giúp kỹ sư hiểu rõ pain point của tài xế và hành khách để cải thiện ứng dụng tốt hơn.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao phủ khám chữa bệnh nội ngoại trú cho nhân viên, được chi trả hoàn toàn bởi công ty. Bảo hiểm xã hội và y tế được đóng đầy đủ theo quy định từ ngày ký hợp đồng chính thức.",
      },
      {
        label: "Flexible working",
        content:
          "Lịch làm việc linh hoạt không yêu cầu giờ check-in cứng, phù hợp với phong cách làm việc của developer. Được làm việc từ xa những ngày không có buổi họp team quan trọng, tạo điều kiện tập trung code hiệu quả hơn.",
      },
      {
        label: "MacBook",
        content:
          "MacBook được cấp để đảm bảo môi trường phát triển Flutter mượt mà, dễ dàng build và test trên cả iOS simulator lẫn Android emulator. Thiết bị được nâng cấp theo chu kỳ để duy trì hiệu suất phát triển tốt nhất.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm Flutter",
        content:
          "Tối thiểu 2 năm kinh nghiệm phát triển ứng dụng di động với Flutter/Dart, đã tham gia ít nhất một dự án ứng dụng có người dùng thực tế. Hiểu rõ widget tree, state management và cách tổ chức code Flutter theo kiến trúc rõ ràng.",
      },
      {
        label: "Native iOS & Android",
        content:
          "Hiểu biết về native iOS và Android để viết platform channel khi cần tích hợp SDK hoặc API native không có Flutter plugin. Biết cách debug các vấn đề platform-specific và đọc được log lỗi từ Xcode và Android Studio.",
      },
      {
        label: "Publish app",
        content:
          "Có kinh nghiệm submit và publish ứng dụng lên cả App Store và Google Play, bao gồm chuẩn bị metadata, screenshot và xử lý review feedback. Quen thuộc với quy trình release và versioning ứng dụng trong môi trường team.",
      },
      {
        label: "Tiếng Anh đọc hiểu",
        content:
          "Đọc hiểu tài liệu kỹ thuật và Flutter documentation bằng tiếng Anh không cần dịch, theo dõi được các thread kỹ thuật trên GitHub và Stack Overflow. Khả năng viết commit message và comment code rõ ràng bằng tiếng Anh.",
      },
    ],
    slots: 3,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Vận hành Tài xế (Driver Operations Specialist)",
    companyIndex: 13,
    location: "Hà Nội",
    salary: "15tr - 22tr",
    type: "FULL_TIME",
    level: "Junior",
    tags: [
      "Operations",
      "Driver Management",
      "KPI Monitoring",
      "Problem Solving",
      "Data Analysis",
      "Communication",
    ],
    industry: ["Finance"],
    description:
      "Be Group tìm Operations Specialist để quản lý và phát triển mạng lưới tài xế Be trên địa bàn Hà Nội.\n\nYêu cầu:\n- 2+ năm kinh nghiệm operations hoặc field management\n- Kỹ năng phân tích dữ liệu cơ bản\n- Năng động và chịu áp lực tốt",
    benefits: [
      {
        label: "Lương cơ bản + KPI bonus",
        content:
          "Lương cơ bản ổn định cộng thêm KPI bonus hàng tháng khi đạt chỉ tiêu về số lượng tài xế hoạt động và tỷ lệ hoàn thành chuyến. Cơ chế thưởng rõ ràng giúp chuyên viên vận hành tối đa hóa thu nhập dựa trên kết quả thực tế.",
      },
      {
        label: "Be credits",
        content:
          "Được cấp Be credits để di chuyển bằng ứng dụng Be miễn phí, tiết kiệm chi phí đi lại trong công tác hàng ngày. Trải nghiệm sản phẩm trực tiếp giúp hiểu rõ hơn về chất lượng dịch vụ từ góc độ hành khách.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe bao phủ khám chữa bệnh cho nhân viên, đặc biệt quan trọng với công việc thường xuyên di chuyển ngoài thực địa. Bảo hiểm xã hội được đóng đầy đủ từ ngày đầu ký hợp đồng chính thức.",
      },
      {
        label: "Young dynamic team",
        content:
          "Làm việc trong môi trường startup năng động với team trẻ, ít quy trình quan liêu và nhiều cơ hội thể hiện bản thân. Văn hóa Be khuyến khích sự sáng tạo và chấp nhận thử nghiệm ý tưởng mới từ bất kỳ thành viên nào trong team.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm operations/field management",
        content:
          "Tối thiểu 2 năm kinh nghiệm trong vai trò vận hành hoặc quản lý thực địa, đã từng làm việc trực tiếp với đối tác hoặc nhân viên bên ngoài văn phòng. Ưu tiên kinh nghiệm trong ngành ride-hailing, logistics hoặc FMCG field force.",
      },
      {
        label: "Phân tích dữ liệu cơ bản",
        content:
          "Có khả năng đọc dashboard và phân tích số liệu cơ bản về hoạt động tài xế, tỷ lệ chuyến và chỉ số khu vực bằng Excel hoặc công cụ tương tự. Dùng dữ liệu để xác định vấn đề và đề xuất giải pháp cụ thể thay vì chỉ dựa vào cảm tính.",
      },
      {
        label: "Năng động và chịu áp lực",
        content:
          "Khả năng làm việc trong môi trường thay đổi nhanh, xử lý nhiều vấn đề đồng thời và duy trì thái độ tích cực dưới áp lực KPI. Sẵn sàng ra ngoài thực địa, gặp gỡ tài xế và xử lý sự cố ngoài giờ hành chính khi cần thiết.",
      },
    ],
    slots: 5,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Quản lý Marketing Tăng trưởng (Growth Marketing Manager)",
    companyIndex: 13,
    location: "Hà Nội",
    salary: "28tr - 45tr",
    type: "FULL_TIME",
    level: "Manager",
    tags: [
      "Growth Marketing",
      "User Acquisition",
      "Performance Marketing",
      "Budget Management",
      "Analytics",
      "A/B Testing",
    ],
    industry: ["Operations"],
    description:
      "Be tìm Growth Marketing Manager để dẫn dắt chiến lược mở rộng tệp người dùng Be tại Việt Nam.\n\nYêu cầu:\n- 5+ năm kinh nghiệm marketing\n- 2 năm kinh nghiệm quản lý\n- Kinh nghiệm app marketing và ASO",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương Growth Marketing Manager được định vị cạnh tranh trong lĩnh vực ride-hailing và super app, phản ánh trách nhiệm dẫn dắt chiến lược tăng trưởng người dùng quy mô lớn. Thương lượng dựa trên kinh nghiệm và kết quả growth đã đạt được.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên mức độ tăng trưởng user base và các chỉ số marketing quan trọng như CAC, LTV và retention so với đầu năm. Manager đạt được tăng trưởng vượt kế hoạch sẽ nhận thưởng đặc biệt ngoài mức chuẩn.",
      },
      {
        label: "Be credits",
        content:
          "Credits Be không giới hạn hàng tháng để sử dụng tất cả dịch vụ trên ứng dụng Be từ gọi xe, giao đồ ăn đến các tính năng mới. Manager cần hiểu sâu sản phẩm từ góc độ người dùng để đưa ra chiến lược marketing chính xác.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm sức khỏe cao cấp cấp Manager bao phủ toàn diện cho cả gia đình với quyền lợi nổi bật. Bao gồm nội trú không giới hạn và hỗ trợ điều trị tại các bệnh viện chất lượng cao trong thành phố.",
      },
      {
        label: "L&D budget",
        content:
          "Ngân sách học tập hàng năm để tham dự hội nghị growth marketing, mua khóa học chuyên sâu về app marketing và ASO. Be đầu tư vào năng lực Manager để team marketing luôn ở đầu xu hướng tăng trưởng người dùng ứng dụng.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm marketing",
        content:
          "Tối thiểu 5 năm kinh nghiệm trong lĩnh vực marketing, trong đó có kinh nghiệm thực tế dẫn dắt chiến dịch user acquisition và retention cho sản phẩm kỹ thuật số. Đã đạt được kết quả tăng trưởng người dùng đo lường được trong ít nhất một vai trò trước đây.",
      },
      {
        label: "Quản lý team",
        content:
          "Tối thiểu 2 năm kinh nghiệm quản lý team marketing, biết phân bổ ngân sách quảng cáo và xây dựng lộ trình phát triển cho từng thành viên. Có khả năng tuyển dụng, onboard và retain nhân tài marketing giỏi trong thị trường cạnh tranh.",
      },
      {
        label: "App marketing & ASO",
        content:
          "Kinh nghiệm thực tế với app marketing trên mobile, bao gồm quảng cáo trên các kênh social, search và programmatic targeting người dùng ứng dụng mới. Hiểu biết về App Store Optimization để cải thiện visibility và conversion rate trong app store.",
      },
    ],
    slots: 1,
    isHot: true,
    statusVariant: "published_future",
  },

  // ── Agribank (14) ────────────────────────────────────────────────────────────
  {
    title: "Chuyên viên Tín dụng Nông nghiệp",
    companyIndex: 14,
    location: "Hà Nội",
    salary: "16tr - 26tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Agricultural Credit",
      "Loan Appraisal",
      "Risk Assessment",
      "Financial Analysis",
      "Rural Banking",
    ],
    industry: ["Sales"],
    description:
      "Agribank tìm Chuyên viên Tín dụng để thẩm định và quản lý danh mục cho vay lĩnh vực nông nghiệp, nông thôn.\n\nYêu cầu:\n- 2+ năm kinh nghiệm tín dụng ngân hàng\n- Hiểu biết về lĩnh vực nông nghiệp là lợi thế\n- Am hiểu pháp lý về đất đai, tài sản đảm bảo",
    benefits: [
      {
        label: "Lương theo thang bảng lương nhà nước",
        content:
          "Mức lương theo thang bảng lương ngân hàng nhà nước, ổn định và được điều chỉnh theo quy định chung của ngành ngân hàng. Tuy không cao bằng ngân hàng tư nhân nhưng đảm bảo sự ổn định và dự đoán được trong dài hạn.",
      },
      {
        label: "Bảo hiểm đầy đủ",
        content:
          "Được đóng đầy đủ bảo hiểm xã hội, bảo hiểm y tế và bảo hiểm thất nghiệp theo quy định pháp luật từ ngày đầu ký hợp đồng. Thêm vào đó là gói bảo hiểm sức khỏe bổ sung dành riêng cho nhân viên Agribank.",
      },
      {
        label: "Vay ưu đãi nhân viên",
        content:
          "Được tiếp cận các gói vay nông nghiệp và tiêu dùng với lãi suất ưu đãi đặc biệt dành cho nhân viên nội bộ. Đây là lợi ích thiết thực phù hợp với nhu cầu tài chính của nhân viên làm việc tại vùng nông thôn.",
      },
      {
        label: "Môi trường ổn định",
        content:
          "Agribank là ngân hàng nhà nước với lịch sử hoạt động lâu dài và ổn định, ít bị ảnh hưởng bởi biến động kinh tế hơn so với ngân hàng tư nhân. Môi trường làm việc an toàn, có quy trình rõ ràng và cơ hội thăng tiến theo thâm niên.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm tín dụng ngân hàng",
        content:
          "Tối thiểu 2 năm kinh nghiệm thẩm định và quản lý hồ sơ tín dụng tại ngân hàng hoặc tổ chức tín dụng, đã xử lý đa dạng loại hình vay cho cá nhân và hộ kinh doanh. Quen với quy trình phê duyệt tín dụng và quản lý danh mục nợ.",
      },
      {
        label: "Hiểu biết nông nghiệp",
        content:
          "Kiến thức về lĩnh vực nông nghiệp như chu kỳ sản xuất, rủi ro mùa vụ và các chương trình hỗ trợ vay vốn nông nghiệp của nhà nước là lợi thế lớn. Hiểu đặc thù kinh tế hộ gia đình nông thôn giúp thẩm định tín dụng chính xác và chuẩn xác hơn.",
      },
      {
        label: "Pháp lý đất đai và tài sản đảm bảo",
        content:
          "Am hiểu các quy định pháp luật về đất đai, quyền sử dụng đất và quy trình đăng ký tài sản đảm bảo, đặc biệt là đất nông nghiệp. Biết xác định giá trị tài sản đảm bảo và đánh giá rủi ro pháp lý liên quan đến việc nhận thế chấp.",
      },
    ],
    slots: 10,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Giao dịch viên Ngân hàng",
    companyIndex: 14,
    location: "TP. Hồ Chí Minh",
    salary: "12tr - 16tr",
    type: "FULL_TIME",
    level: "Junior",
    tags: [
      "Teller",
      "Cash Management",
      "Customer Service",
      "Banking Products",
      "KYC/AML",
    ],
    industry: ["Marketing"],
    description:
      "Agribank tuyển Giao dịch viên tại các chi nhánh TP.HCM.\n\nYêu cầu:\n- Tốt nghiệp đại học\n- Ngoại hình tốt, giao tiếp linh hoạt\n- Cẩn thận và chịu khó",
    benefits: [
      {
        label: "Lương ổn định",
        content:
          "Mức lương cơ bản ổn định và đều đặn theo tháng, không phụ thuộc nhiều vào biến động thị trường hay doanh số kinh doanh. Đây là sự ổn định tài chính quý giá cho nhân viên mới bắt đầu xây dựng sự nghiệp ngân hàng.",
      },
      {
        label: "Bảo hiểm xã hội",
        content:
          "Được đóng đầy đủ bảo hiểm xã hội, bảo hiểm y tế và bảo hiểm thất nghiệp ngay từ ngày đầu ký hợp đồng chính thức với ngân hàng. Agribank tuân thủ nghiêm túc quy định lao động, đảm bảo quyền lợi an sinh xã hội cho toàn bộ nhân viên.",
      },
      {
        label: "Đào tạo bài bản",
        content:
          "Được đào tạo nghiệp vụ giao dịch viên chuyên nghiệp trước khi chính thức ngồi quầy phục vụ khách hàng. Chương trình đào tạo bao gồm kỹ năng giao tiếp, nghiệp vụ ngân hàng và quy trình kiểm soát nội bộ theo chuẩn Agribank.",
      },
      {
        label: "Môi trường an toàn và ổn định",
        content:
          "Làm việc trong môi trường ngân hàng nhà nước ổn định, ít rủi ro sa thải và có lộ trình nghề nghiệp bền vững theo thâm niên. Đây là môi trường phù hợp cho người ưu tiên sự ổn định và an toàn công việc dài hạn.",
      },
    ],
    requirements: [
      {
        label: "Bằng đại học",
        content:
          "Tốt nghiệp đại học bất kỳ chuyên ngành, ưu tiên Kinh tế, Tài chính, Ngân hàng hoặc các ngành liên quan. Agribank tuyển nhiều vị trí cho người mới ra trường muốn bắt đầu sự nghiệp trong môi trường ngân hàng ổn định.",
      },
      {
        label: "Ngoại hình và giao tiếp",
        content:
          "Ngoại hình gọn gàng, sáng sủa và phong cách chuyên nghiệp phù hợp với hình ảnh ngân hàng nhà nước uy tín. Kỹ năng giao tiếp linh hoạt, kiên nhẫn và lịch sự với mọi đối tượng khách hàng bao gồm cả người lớn tuổi và nông dân.",
      },
      {
        label: "Cẩn thận và chịu khó",
        content:
          "Tính cẩn thận cao trong xử lý tiền mặt và chứng từ, không để xảy ra sai sót ảnh hưởng đến tài sản của khách hàng. Sẵn sàng chịu khó học hỏi nghiệp vụ và thích nghi với môi trường làm việc có quy trình và kỷ luật nghiêm ngặt.",
      },
    ],
    slots: 30,
    isHot: false,
    statusVariant: "closed",
  },
  {
    title: "Chuyên viên Công nghệ Thông tin Ngân hàng",
    companyIndex: 14,
    location: "Hà Nội",
    salary: "20tr - 35tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Java",
      "Spring Boot",
      "Banking System",
      "Oracle",
      "Core Banking",
      "Security",
      "IT Support",
    ],
    industry: ["Marketing"],
    description:
      "Agribank tìm Chuyên viên CNTT để phát triển và vận hành hệ thống ngân hàng lõi.\n\nYêu cầu:\n- 3+ năm kinh nghiệm phát triển phần mềm Java\n- Kinh nghiệm với hệ thống ngân hàng\n- Hiểu biết về bảo mật thông tin",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương IT trong ngân hàng nhà nước được cải thiện đáng kể trong những năm gần đây để cạnh tranh thu hút kỹ sư giỏi. Agribank đang nâng cấp chính sách lương CNTT để giữ chân nhân tài trong bối cảnh cạnh tranh từ ngân hàng tư nhân và fintech.",
      },
      {
        label: "Bảo hiểm đầy đủ",
        content:
          "Bảo hiểm xã hội, y tế và thất nghiệp được đóng đầy đủ theo quy định, cộng thêm gói bảo hiểm sức khỏe bổ sung dành riêng cho nhân viên. Chế độ bảo hiểm toàn diện giúp nhân viên yên tâm tập trung vào công việc kỹ thuật.",
      },
      {
        label: "Vay ưu đãi",
        content:
          "Nhân viên được tiếp cận các gói vay mua nhà và tiêu dùng với lãi suất ưu đãi đặc biệt thấp hơn thị trường. Đây là phúc lợi tài chính thực tế và có giá trị lớn đặc biệt trong bối cảnh lãi suất thị trường biến động.",
      },
      {
        label: "Môi trường ổn định",
        content:
          "Môi trường làm việc ổn định của ngân hàng nhà nước, ít biến động nhân sự và có lộ trình phát triển rõ ràng theo thâm niên. Phù hợp với kỹ sư muốn đi sâu vào hệ thống ngân hàng lõi và xây dựng chuyên môn dài hạn trong một tổ chức.",
      },
      {
        label: "Đào tạo nghiệp vụ",
        content:
          "Được đào tạo nghiệp vụ ngân hàng chuyên sâu để hiểu rõ quy trình nghiệp vụ mà hệ thống IT cần hỗ trợ. Cơ hội tham gia các dự án nâng cấp công nghệ ngân hàng quy mô lớn và học hỏi từ các chuyên gia IT ngân hàng giàu kinh nghiệm.",
      },
    ],
    requirements: [
      {
        label: "Java development",
        content:
          "Tối thiểu 3 năm kinh nghiệm phát triển phần mềm với Java, thành thạo Spring Framework và hiểu biết về các design pattern phổ biến trong enterprise software. Có khả năng đọc hiểu và bảo trì codebase legacy Java là lợi thế trong môi trường ngân hàng.",
      },
      {
        label: "Hệ thống ngân hàng",
        content:
          "Kinh nghiệm hoặc hiểu biết về hệ thống core banking, bao gồm các module tín dụng, tiết kiệm và thanh toán. Hiểu quy trình nghiệp vụ ngân hàng và có khả năng làm việc chặt chẽ với đội ngũ nghiệp vụ để phát triển và maintain hệ thống.",
      },
      {
        label: "Bảo mật thông tin",
        content:
          "Hiểu biết về các nguyên tắc bảo mật thông tin ngân hàng theo yêu cầu NHNN và chuẩn quốc tế. Có kinh nghiệm implement các cơ chế xác thực, mã hóa và kiểm soát truy cập trong ứng dụng xử lý dữ liệu tài chính nhạy cảm.",
      },
    ],
    slots: 5,
    isHot: false,
    statusVariant: "published_near",
  },

  // ── Unilever (15) ────────────────────────────────────────────────────────────
  {
    title: "Quản lý Thương hiệu (Brand Manager)",
    companyIndex: 15,
    location: "TP. Hồ Chí Minh",
    salary: "35tr - 55tr",
    type: "FULL_TIME",
    level: "Manager",
    tags: [
      "Brand Management",
      "FMCG",
      "P&L Management",
      "Consumer Insights",
      "Campaign Planning",
      "Agency Management",
    ],
    industry: ["Marketing"],
    description:
      "Unilever tìm Brand Manager cho một thương hiệu chăm sóc cá nhân đang tăng trưởng mạnh tại Việt Nam.\n\nYêu cầu:\n- 5+ năm kinh nghiệm brand management trong FMCG đa quốc gia\n- Kinh nghiệm P&L management\n- Tiếng Anh thành thạo",
    benefits: [
      {
        label: "Gói lương top FMCG",
        content:
          "Unilever trả lương Brand Manager ở mức top thị trường FMCG Việt Nam, cạnh tranh với Procter & Gamble, Nestlé và các tập đoàn đa quốc gia hàng đầu. Mức lương phản ánh trách nhiệm quản lý thương hiệu có doanh thu hàng trăm tỷ đồng mỗi năm.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên tăng trưởng thị phần, brand equity score và hiệu quả chi tiêu marketing của thương hiệu phụ trách. Brand Manager đưa thương hiệu vượt chỉ tiêu tăng trưởng sẽ nhận thưởng vượt trội so với mức tiêu chuẩn.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm cao cấp toàn diện bao phủ cả gia đình với quyền lợi nổi bật từ Unilever, bao gồm chăm sóc sức khỏe, nha khoa và bảo hiểm nhân thọ. Đây là một trong những gói bảo hiểm tốt nhất trong ngành FMCG tại Việt Nam.",
      },
      {
        label: "Company car",
        content:
          "Được trang bị xe công ty hoặc nhận phụ cấp xe đáng kể cho các chuyến công tác thị trường và gặp gỡ đối tác agency. Hỗ trợ di chuyển thể hiện cam kết của Unilever trong việc tạo điều kiện làm việc tốt nhất cho Brand Manager.",
      },
      {
        label: "MBA sponsorship",
        content:
          "Unilever tài trợ một phần hoặc toàn bộ học phí MBA cho Brand Manager có tiềm năng lãnh đạo sau 3-5 năm làm việc xuất sắc. Đây là khoản đầu tư dài hạn của Unilever vào việc phát triển thế hệ lãnh đạo marketing tiếp theo.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm brand management FMCG",
        content:
          "Tối thiểu 5 năm kinh nghiệm brand management trong công ty FMCG đa quốc gia, đã trực tiếp sở hữu và phát triển ít nhất một thương hiệu từ chiến lược đến thực thi. Hiểu sâu về consumer insights, brand positioning và integrated marketing communications.",
      },
      {
        label: "P&L management",
        content:
          "Kinh nghiệm quản lý P&L thương hiệu, bao gồm lập kế hoạch ngân sách marketing, tối ưu A&P spending và theo dõi brand profitability. Có khả năng đưa ra quyết định đầu tư dựa trên phân tích ROI và bức tranh tài chính thương hiệu tổng thể.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo để làm việc với team regional Unilever, trình bày brand plan và defend investment decision trước ban lãnh đạo quốc tế. Khả năng viết brief cho agency và đọc hiểu consumer research report bằng tiếng Anh chuyên nghiệp.",
      },
    ],
    slots: 1,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Nhân viên Kinh doanh Kênh Phân phối (Key Account Executive)",
    companyIndex: 15,
    location: "TP. Hồ Chí Minh",
    salary: "18tr - 28tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Key Account",
      "FMCG Sales",
      "Modern Trade",
      "Negotiation",
      "Distribution",
      "Trade Marketing",
    ],
    industry: ["Marketing"],
    description:
      "Unilever tìm Key Account Executive phụ trách kênh Modern Trade (siêu thị, chuỗi bán lẻ).\n\nYêu cầu:\n- 2+ năm kinh nghiệm key account hoặc FMCG sales\n- Kinh nghiệm với Modern Trade\n- Kỹ năng đàm phán tốt",
    benefits: [
      {
        label: "Lương + hoa hồng",
        content:
          "Thu nhập gồm lương cơ bản ổn định cộng hoa hồng dựa trên doanh số thực hiện tại các tài khoản Modern Trade phụ trách. Cơ chế hoa hồng khuyến khích tăng trưởng bền vững không chỉ về doanh số mà còn về chất lượng trưng bày và thực thi.",
      },
      {
        label: "Xăng xe",
        content:
          "Chi phí xăng xe được thanh toán theo thực tế hoặc phụ cấp cố định hàng tháng để phục vụ công tác thăm siêu thị và gặp gỡ đối tác bán lẻ. Mức hỗ trợ tính toán phù hợp với địa bàn phụ trách và tần suất thăm điểm bán.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao phủ khám chữa bệnh cho nhân viên tại các bệnh viện chất lượng. Được đóng đầy đủ BHXH từ ngày đầu tiên và tham gia gói bảo hiểm bổ sung của Unilever.",
      },
      {
        label: "Sản phẩm Unilever",
        content:
          "Được nhận giỏ sản phẩm Unilever hàng tháng bao gồm các thương hiệu như Dove, Sunsilk, OMO và nhiều sản phẩm khác để sử dụng cá nhân. Sử dụng sản phẩm hàng ngày giúp Key Account Executive tư vấn cho nhà bán lẻ một cách thuyết phục hơn.",
      },
      {
        label: "Đào tạo chuyên nghiệp",
        content:
          "Được tham gia các chương trình đào tạo chuyên nghiệp của Unilever về kỹ năng bán hàng Modern Trade, trade marketing và thương lượng với nhà bán lẻ. Unilever đầu tư mạnh vào đào tạo để xây dựng đội ngũ sales force đẳng cấp quốc tế.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm key account/FMCG sales",
        content:
          "Tối thiểu 2 năm kinh nghiệm bán hàng trong ngành FMCG, đã trực tiếp làm việc với ít nhất một chuỗi siêu thị hoặc hypermarket lớn. Hiểu quy trình mua hàng của nhà bán lẻ, cách lập kế hoạch trade promotions và đo lường hiệu quả.",
      },
      {
        label: "Kinh nghiệm Modern Trade",
        content:
          "Quen thuộc với cách vận hành và yêu cầu của kênh Modern Trade bao gồm việc listing sản phẩm, đàm phán listing fee và quản lý gondola. Hiểu cơ chế hợp tác thương mại như JBP (Joint Business Plan) với các chuỗi bán lẻ lớn.",
      },
      {
        label: "Kỹ năng đàm phán",
        content:
          "Kỹ năng đàm phán tốt để thương lượng điều khoản trade term, vị trí trưng bày và kế hoạch khuyến mãi với nhà mua hàng của siêu thị. Biết cách tạo ra lợi ích cân bằng cho cả Unilever và nhà bán lẻ trong mọi thỏa thuận thương mại.",
      },
    ],
    slots: 3,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Nhân viên Phát triển Sản phẩm R&D",
    companyIndex: 15,
    location: "TP. Hồ Chí Minh",
    salary: "22tr - 35tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "R&D",
      "Product Development",
      "Food Technology",
      "Consumer Insights",
      "Innovation",
      "Sensory Evaluation",
    ],
    industry: ["Finance"],
    description:
      "Unilever tìm R&D Specialist để nghiên cứu và phát triển công thức sản phẩm mới.\n\nYêu cầu:\n- Bằng Kỹ sư Hóa học, Công nghệ Thực phẩm\n- 3+ năm kinh nghiệm R&D trong FMCG\n- Tiếng Anh thành thạo",
    benefits: [
      {
        label: "Lương cạnh tranh đa quốc gia",
        content:
          "Mức lương R&D Specialist được định vị theo chuẩn đa quốc gia của Unilever, cạnh tranh với các tập đoàn FMCG toàn cầu tại Việt Nam. Phản ánh giá trị của kỹ năng nghiên cứu và phát triển sản phẩm chuyên biệt trong ngành chăm sóc cá nhân.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm cao cấp toàn diện bao phủ cho cả gia đình, bao gồm khám chữa bệnh nội ngoại trú, nha khoa và bảo hiểm nhân thọ. Unilever đảm bảo nhân viên R&D được chăm sóc sức khỏe tốt nhất để tập trung vào công việc nghiên cứu sáng tạo.",
      },
      {
        label: "Lab hiện đại",
        content:
          "Phòng thí nghiệm được trang bị thiết bị phân tích và chế biến hiện đại theo chuẩn Unilever toàn cầu, đảm bảo môi trường làm việc an toàn và chuyên nghiệp. R&D Specialist có đầy đủ công cụ để thực hiện các thí nghiệm phức tạp và đánh giá cảm quan sản phẩm.",
      },
      {
        label: "Đào tạo quốc tế",
        content:
          "Cơ hội tham gia các chương trình đào tạo kỹ thuật do Unilever tổ chức tại các trung tâm R&D quốc tế ở Anh, Singapore hoặc Trung Quốc. Học hỏi từ các chuyên gia R&D hàng đầu thế giới và tiếp cận công nghệ phát triển sản phẩm tiên tiến nhất của tập đoàn.",
      },
    ],
    requirements: [
      {
        label: "Bằng Kỹ sư Hóa học/Thực phẩm",
        content:
          "Tốt nghiệp đại học hoặc cao học chuyên ngành Kỹ thuật Hóa học, Công nghệ Thực phẩm, Hóa mỹ phẩm hoặc ngành liên quan. Nền tảng khoa học vững chắc là điều kiện tiên quyết để có thể hiểu và phát triển các công thức sản phẩm phức tạp.",
      },
      {
        label: "Kinh nghiệm R&D FMCG",
        content:
          "Tối thiểu 3 năm kinh nghiệm trong bộ phận R&D hoặc product development tại công ty FMCG, đã trực tiếp phát triển ít nhất một sản phẩm từ giai đoạn nghiên cứu đến launch thành công. Kinh nghiệm với sản phẩm chăm sóc cá nhân, gia dụng hoặc thực phẩm đều được xem xét.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo để đọc tài liệu kỹ thuật quốc tế, viết technical report và giao tiếp với đội ngũ R&D toàn cầu của Unilever. Khả năng trình bày kết quả thực nghiệm bằng tiếng Anh rõ ràng và chuyên nghiệp trước stakeholder đa quốc gia.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Thực tập sinh Quản trị Kinh doanh (Management Trainee)",
    companyIndex: 15,
    location: "TP. Hồ Chí Minh",
    salary: "10tr - 15tr",
    type: "INTERNSHIP",
    level: "Intern",
    tags: [
      "Management Trainee",
      "Leadership Development",
      "FMCG",
      "Rotation Program",
      "Business Strategy",
    ],
    industry: ["Marketing"],
    description:
      "Chương trình Management Trainee 12 tháng của Unilever cho sinh viên xuất sắc mới tốt nghiệp.\n\nYêu cầu:\n- GPA 3.4+, tốt nghiệp trường top\n- IELTS 7.0+\n- Không quá 26 tuổi",
    benefits: [
      {
        label: "Lương MT cạnh tranh",
        content:
          "Chương trình MT của Unilever trả lương cạnh tranh so với các tập đoàn đa quốc gia khác, ghi nhận rằng MT là nhân lực chiến lược tương lai. Mức lương được thiết kế để thu hút những sinh viên xuất sắc nhất từ các trường hàng đầu.",
      },
      {
        label: "Mentor từ Director",
        content:
          "Mỗi MT được assign một Director làm mentor chính thức trong suốt 12 tháng chương trình, nhận coaching định kỳ về chiến lược và lãnh đạo. Đây là cơ hội học hỏi trực tiếp từ các lãnh đạo cấp cao của một trong những tập đoàn FMCG lớn nhất thế giới.",
      },
      {
        label: "Rotation 4 bộ phận",
        content:
          "Được luân chuyển qua 4 bộ phận khác nhau trong 12 tháng để có cái nhìn toàn diện về hoạt động của Unilever từ marketing, sales, supply chain đến finance. Trải nghiệm đa chiều này giúp MT tự tìm ra lĩnh vực phù hợp nhất với thế mạnh cá nhân.",
      },
      {
        label: "Fast-track promotion",
        content:
          "MT hoàn thành chương trình xuất sắc được thăng tiến lên vị trí Assistant Brand Manager hoặc Senior Analyst ngay sau 12 tháng, bỏ qua nhiều năm ở vị trí junior. Lộ trình lên Manager trong 3-4 năm, nhanh hơn đáng kể so với con đường thông thường.",
      },
      {
        label: "MBA sponsorship sau 3 năm",
        content:
          "Unilever cam kết tài trợ học phí MBA một phần hoặc toàn phần cho MT đạt hiệu suất xuất sắc sau 3 năm làm việc. Đây là khoản đầu tư của tập đoàn vào việc phát triển các lãnh đạo tương lai cấp cao của Unilever khu vực.",
      },
    ],
    requirements: [
      {
        label: "GPA 3.4+ từ trường top",
        content:
          "GPA tối thiểu 3.4/4.0 (hoặc tương đương) tốt nghiệp từ các trường đại học top trong danh sách của Unilever, bao gồm Đại học Ngoại thương, Kinh tế Quốc dân, Bách Khoa và các trường danh tiếng khác. Thành tích học thuật xuất sắc thể hiện khả năng học nhanh và tư duy phân tích.",
      },
      {
        label: "IELTS 7.0+",
        content:
          "Điểm IELTS tối thiểu 7.0 (hoặc tương đương TOEFL 90+) là yêu cầu bắt buộc vì MT làm việc trong môi trường hoàn toàn tiếng Anh và thường xuyên giao tiếp với team quốc tế. Tiếng Anh xuất sắc là nền tảng để thành công trong chương trình rotation toàn cầu của Unilever.",
      },
      {
        label: "Không quá 26 tuổi",
        content:
          "Chương trình MT dành cho ứng viên không quá 26 tuổi vào thời điểm bắt đầu, ưu tiên sinh viên mới tốt nghiệp trong vòng 1 năm. Đây là giới hạn để đảm bảo MT có đủ thời gian phát triển theo lộ trình dài hạn của Unilever.",
      },
    ],
    slots: 10,
    isHot: true,
    statusVariant: "published_near",
  },

  // ── Thế Giới Di Động (16) ────────────────────────────────────────────────────
  {
    title: "Quản lý Cửa hàng (Store Manager)",
    companyIndex: 16,
    location: "TP. Hồ Chí Minh",
    salary: "20tr - 35tr",
    type: "FULL_TIME",
    level: "Manager",
    tags: [
      "Retail Management",
      "Team Leadership",
      "Sales Management",
      "Inventory Control",
      "Customer Experience",
      "KPI",
    ],
    industry: ["Sales"],
    description:
      "TGDĐ tìm Store Manager để quản lý cửa hàng điện máy với doanh thu 2-5 tỷ/tháng.\n\nYêu cầu:\n- 3+ năm kinh nghiệm quản lý bán lẻ\n- Kinh nghiệm quản lý team 10-20 người\n- Chịu áp lực doanh số cao\n- Sẵn sàng làm việc cuối tuần",
    benefits: [
      {
        label: "Lương cơ bản + thưởng doanh số",
        content:
          "Thu nhập gồm lương cơ bản ổn định cộng thưởng doanh số trực tiếp khi cửa hàng đạt và vượt chỉ tiêu doanh thu hàng tháng. Store Manager dẫn dắt cửa hàng tăng trưởng mạnh có thể đạt tổng thu nhập rất hấp dẫn trong ngành bán lẻ.",
      },
      {
        label: "KPI bonus hàng tháng",
        content:
          "Thưởng KPI hàng tháng dựa trên các chỉ số vận hành cửa hàng như tỷ lệ chuyển đổi, upsell, satisfaction score và kiểm soát chi phí. Cơ chế thưởng đa chiều khuyến khích Store Manager tối ưu toàn diện không chỉ tập trung vào doanh số.",
      },
      {
        label: "Bảo hiểm xã hội",
        content:
          "Được đóng đầy đủ bảo hiểm xã hội, y tế và thất nghiệp theo quy định từ ngày đầu ký hợp đồng chính thức. TGDĐ tuân thủ nghiêm túc quy định lao động, đảm bảo quyền lợi an sinh xã hội đầy đủ cho toàn bộ nhân viên quản lý.",
      },
      {
        label: "Lộ trình lên ASM",
        content:
          "Store Manager xuất sắc được xem xét thăng tiến lên Area Sales Manager phụ trách nhiều cửa hàng trong khu vực. Đây là lộ trình thăng tiến rõ ràng và cụ thể trong chuỗi bán lẻ lớn nhất Việt Nam với hơn 2.200 cửa hàng.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm quản lý bán lẻ",
        content:
          "Tối thiểu 3 năm kinh nghiệm quản lý cửa hàng bán lẻ, đã trực tiếp chịu trách nhiệm về doanh thu và vận hành cửa hàng. Ưu tiên kinh nghiệm trong ngành điện máy, điện thoại hoặc các chuỗi bán lẻ hiện đại.",
      },
      {
        label: "Quản lý team 10-20 người",
        content:
          "Kinh nghiệm dẫn dắt đội nhóm từ 10-20 nhân viên bán hàng, bao gồm tuyển dụng, đào tạo và đánh giá hiệu suất. Biết phân công công việc hợp lý theo ca, xây dựng văn hóa cạnh tranh lành mạnh và giữ chân nhân viên tốt.",
      },
      {
        label: "Chịu áp lực doanh số",
        content:
          "Sẵn sàng làm việc trong môi trường KPI rõ ràng và áp lực doanh số cao, đặc biệt trong các thời điểm khuyến mãi lớn như 11/11, Black Friday. Có khả năng duy trì tinh thần đội ngũ và hiệu suất bán hàng ngay cả trong các tháng thị trường khó khăn.",
      },
      {
        label: "Làm việc cuối tuần",
        content:
          "Sẵn sàng làm việc vào cuối tuần và ngày lễ vì đây là thời điểm cửa hàng bận nhất và quan trọng nhất trong tuần. Quản lý lịch làm việc linh hoạt của đội nhóm để đảm bảo luôn có đủ nhân sự trong các khung giờ cao điểm.",
      },
    ],
    slots: 20,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Nhân viên Bán hàng Điện thoại",
    companyIndex: 16,
    location: "Hà Nội",
    salary: "8tr - 15tr",
    type: "FULL_TIME",
    level: "Junior",
    tags: [
      "Retail Sales",
      "Product Knowledge",
      "Customer Service",
      "Communication",
      "Upselling",
    ],
    industry: ["HR"],
    description:
      "TGDĐ tuyển Nhân viên Bán hàng cho các cửa hàng tại Hà Nội. Không yêu cầu kinh nghiệm, được đào tạo hoàn toàn.\n\nYêu cầu:\n- Tốt nghiệp THPT trở lên\n- Ngoại hình gọn gàng\n- Nhiệt tình và chăm chỉ",
    benefits: [
      {
        label: "Lương cơ bản + hoa hồng",
        content:
          "Lương cơ bản được đảm bảo hàng tháng kể cả khi không đạt hoa hồng, cộng thêm hoa hồng bán hàng theo từng sản phẩm đã chốt thành công. Mức hoa hồng được tính minh bạch và chi trả đúng hạn cùng kỳ lương hàng tháng.",
      },
      {
        label: "Thưởng doanh số không giới hạn",
        content:
          "Không có trần giới hạn cho phần thưởng doanh số – nhân viên bán càng nhiều thì hưởng càng nhiều. Đây là cơ hội thu nhập vượt trội cho người có kỹ năng bán hàng tốt và chủ động tiếp cận khách hàng.",
      },
      {
        label: "Đào tạo sản phẩm đầy đủ",
        content:
          "Được đào tạo kiến thức sản phẩm điện thoại, laptop và điện máy bài bản trước khi bắt đầu bán hàng chính thức. Cập nhật thường xuyên về sản phẩm mới và kỹ thuật bán hàng để luôn tự tin tư vấn cho khách.",
      },
      {
        label: "Môi trường trẻ",
        content:
          "Làm việc trong môi trường trẻ trung, năng động với đồng nghiệp cùng lứa tuổi và văn hóa thoải mái, vui vẻ. Thường xuyên có các hoạt động thi đua bán hàng nội bộ với phần thưởng hấp dẫn để tạo động lực cho toàn team.",
      },
    ],
    requirements: [
      {
        label: "Trình độ THPT trở lên",
        content:
          "Tốt nghiệp THPT hoặc cao hơn là đủ điều kiện, không yêu cầu bằng đại học hay kinh nghiệm bán hàng trước đó. TGDĐ tuyển dụng dựa trên thái độ và tiềm năng, không phải bằng cấp – đây là cơ hội tốt cho người mới bắt đầu đi làm.",
      },
      {
        label: "Ngoại hình gọn gàng",
        content:
          "Ngoại hình gọn gàng, sạch sẽ và tác phong chuyên nghiệp khi tiếp xúc với khách hàng tại cửa hàng. Không yêu cầu đặc biệt về chiều cao hay ngoại hình nhưng cần tạo cảm giác tin tưởng cho khách khi được tư vấn sản phẩm giá trị lớn.",
      },
      {
        label: "Nhiệt tình và chăm chỉ",
        content:
          "Thái độ nhiệt tình, chủ động tiếp cận khách hàng và không ngại học hỏi kiến thức sản phẩm mới liên tục. Chăm chỉ đến đúng giờ, hoàn thành ca làm việc đầy đủ và luôn duy trì tinh thần phục vụ tốt nhất cho từng khách hàng.",
      },
    ],
    slots: 50,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Kỹ sư Phần mềm - Hệ thống ERP Nội bộ",
    companyIndex: 16,
    location: "TP. Hồ Chí Minh",
    salary: "20tr - 38tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Java",
      "Spring Boot",
      "ERP",
      "SQL",
      "Microservices",
      "React",
      "Retail Tech",
    ],
    industry: ["Operations"],
    description:
      "TGDĐ tìm Kỹ sư Phần mềm để phát triển hệ thống ERP nội bộ phục vụ 2.200+ cửa hàng trên toàn quốc.\n\nYêu cầu:\n- 3+ năm kinh nghiệm phần mềm\n- Thành thạo Java Spring Boot\n- Kinh nghiệm với hệ thống ERP/POS là lợi thế",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương kỹ sư phần mềm tại TGDĐ được xây dựng cạnh tranh so với thị trường tech trong ngành bán lẻ, phản ánh tầm quan trọng của hệ thống IT với quy mô 2.200+ cửa hàng. Được review hàng năm theo hiệu suất và đóng góp thực tế vào hệ thống.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên kết quả hoạt động kinh doanh của công ty và đóng góp cá nhân trong việc phát triển và ổn định hệ thống ERP. Kỹ sư giải quyết được các vấn đề kỹ thuật quan trọng ảnh hưởng đến vận hành chuỗi sẽ được thưởng đặc biệt.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe bổ sung ngoài BHXH bắt buộc, hỗ trợ chi phí khám chữa bệnh tại các bệnh viện trong mạng lưới. Đóng BHXH đầy đủ từ ngày đầu ký hợp đồng và tham gia gói bảo hiểm sức khỏe nhóm của công ty.",
      },
      {
        label: "MacBook hoặc PC tốt",
        content:
          "Kỹ sư được chọn giữa MacBook hoặc PC cấu hình cao tùy theo sở thích và nhu cầu phát triển. Được trang bị màn hình ngoài và các thiết bị ngoại vi cần thiết để làm việc hiệu quả với hệ thống phức tạp của TGDĐ.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm phần mềm",
        content:
          "Tối thiểu 3 năm kinh nghiệm phát triển phần mềm trong môi trường production, đã làm việc trên hệ thống phục vụ nghiệp vụ thực tế của doanh nghiệp. Quen thuộc với quy trình release phần mềm và quản lý chất lượng code trong team.",
      },
      {
        label: "Java Spring Boot",
        content:
          "Thành thạo Java Spring Boot để phát triển các API và module ERP nội bộ, hiểu rõ Spring Security và Spring Data JPA. Có kinh nghiệm tối ưu query và xử lý transaction phức tạp cho nghiệp vụ bán lẻ quy mô lớn.",
      },
      {
        label: "ERP/POS",
        content:
          "Kinh nghiệm với hệ thống ERP hoặc POS là lợi thế lớn, giúp rút ngắn thời gian onboard và hiểu nhanh nghiệp vụ bán hàng, quản lý tồn kho và thanh toán tại cửa hàng. Ứng viên có kinh nghiệm trong ngành bán lẻ điện tử sẽ được ưu tiên.",
      },
    ],
    slots: 5,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Phân tích Dữ liệu Bán lẻ",
    companyIndex: 16,
    location: "TP. Hồ Chí Minh",
    salary: "18tr - 30tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "SQL",
      "Python",
      "Power BI",
      "Retail Analytics",
      "Inventory Analysis",
      "Sales Forecasting",
      "Excel",
    ],
    industry: ["IT"],
    description:
      "TGDĐ tìm Data Analyst để phân tích dữ liệu bán hàng và tối ưu hóa hoạt động chuỗi bán lẻ.\n\nYêu cầu:\n- 2+ năm kinh nghiệm phân tích dữ liệu\n- Thành thạo SQL, Excel\n- Hiểu biết về retail analytics",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương Data Analyst trong chuỗi bán lẻ lớn nhất Việt Nam, có cơ hội làm việc với dữ liệu thực tế từ hàng triệu giao dịch mỗi ngày. Được xem xét tăng lương theo mức độ phức tạp của phân tích và giá trị insight tạo ra cho doanh nghiệp.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên đóng góp của phân tích vào các quyết định kinh doanh như tối ưu tồn kho, định giá và phân bổ sản phẩm. Analyst có insight được áp dụng và tạo ra cải thiện đo lường được sẽ nhận mức thưởng cao hơn chuẩn.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện cho nhân viên bao phủ chi phí khám chữa bệnh nội ngoại trú. Đóng BHXH và BHYT đầy đủ từ ngày đầu, đảm bảo quyền lợi an sinh xã hội cho toàn bộ nhân viên chính thức.",
      },
      {
        label: "Môi trường phát triển nhanh",
        content:
          "Làm việc trong công ty bán lẻ đang số hóa mạnh mẽ, nơi Data Analyst có nhiều cơ hội thể hiện bản thân và được giao thêm trách nhiệm khi chứng minh được năng lực. Môi trường phát triển nhanh giúp career path của analyst được rút ngắn đáng kể so với doanh nghiệp truyền thống.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm phân tích dữ liệu",
        content:
          "Tối thiểu 2 năm kinh nghiệm phân tích dữ liệu, đã thực hiện được các phân tích từ đầu đến cuối và trình bày kết quả cho người ra quyết định. Ưu tiên kinh nghiệm trong ngành bán lẻ, FMCG hoặc e-commerce với dữ liệu giao dịch.",
      },
      {
        label: "SQL & Excel",
        content:
          "Thành thạo SQL để query dữ liệu bán hàng từ các hệ thống ERP và data warehouse nội bộ của TGDĐ. Excel nâng cao để phân tích và visualize dữ liệu, sử dụng pivot table và Power Query để xử lý dữ liệu bán lẻ phức tạp.",
      },
      {
        label: "Retail analytics",
        content:
          "Hiểu biết về các chỉ số bán lẻ quan trọng như sell-through rate, inventory turnover, basket size và foot traffic conversion. Biết cách phân tích hiệu quả bán hàng theo danh mục, khu vực và thời điểm để đưa ra khuyến nghị tối ưu hóa có giá trị thực tế.",
      },
    ],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },

  // ── PwC (17) ──────────────────────────────────────────────────────────────────
  {
    title: "Senior Associate - Dịch vụ Đảm bảo (Assurance)",
    companyIndex: 17,
    location: "TP. Hồ Chí Minh",
    salary: "22tr - 38tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "Assurance",
      "IFRS",
      "VAS",
      "External Audit",
      "Financial Reporting",
      "Big 4",
      "ACCA",
    ],
    industry: ["Marketing"],
    description:
      "PwC tìm Senior Associate cho dịch vụ Assurance để kiểm toán các tập đoàn và doanh nghiệp niêm yết.\n\nYêu cầu:\n- 3+ năm kinh nghiệm kiểm toán (ưu tiên Big 4)\n- ACCA/CPA đang học hoặc đã có\n- Tiếng Anh thành thạo",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương Senior Associate tại PwC được định vị cạnh tranh trong nhóm Big 4, phản ánh kinh nghiệm và chứng chỉ chuyên môn của ứng viên. Được review định kỳ theo hiệu suất và tiến độ học ACCA/CPA.",
      },
      {
        label: "ACCA study support",
        content:
          "PwC hỗ trợ học phí, ngày nghỉ thi và tài liệu ôn thi ACCA, giúp Senior Associate hoàn thành chứng chỉ nhanh hơn. Môi trường PwC cũng cung cấp nhiều tình huống thực tế để củng cố kiến thức ACCA học trên lớp.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên hiệu suất engagement, chất lượng kiểm toán và đóng góp vào phát triển đội nhóm. Senior Associate hoàn thành nhiều engagement phức tạp và được khách hàng đánh giá tốt sẽ nhận thưởng cao hơn mức chuẩn.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm sức khỏe cao cấp bao phủ toàn diện cho nhân viên, bao gồm nội trú, ngoại trú và nha khoa tại các bệnh viện chất lượng. Đặc biệt có giá trị trong mùa kiểm toán cao điểm khi giờ làm việc kéo dài và áp lực tăng cao.",
      },
      {
        label: "International exposure",
        content:
          "Cơ hội làm việc với các tập đoàn đa quốc gia và đội kiểm toán quốc tế của PwC trong các engagement phức tạp. Trải nghiệm này mở ra cơ hội luân chuyển sang văn phòng PwC nước ngoài cho những nhân viên xuất sắc.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm kiểm toán",
        content:
          "Tối thiểu 3 năm kinh nghiệm kiểm toán báo cáo tài chính, ưu tiên từ Big 4 hoặc các công ty kiểm toán quốc tế có tiếng. Đã độc lập thực hiện kiểm toán từ bước lập kế hoạch đến issue management letter và report to management.",
      },
      {
        label: "ACCA/CPA",
        content:
          "Đang theo học hoặc đã hoàn thành chứng chỉ ACCA hoặc CPA Việt Nam là yêu cầu cần thiết. Ứng viên đã qua nhiều kỳ thi ACCA hoặc đã có chứng chỉ đầy đủ sẽ được ưu tiên trong quá trình tuyển chọn.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo để giao tiếp với khách hàng FDI, viết management letter và trao đổi với đội kiểm toán quốc tế. Kỹ năng trình bày phát hiện kiểm toán bằng tiếng Anh rõ ràng và chuyên nghiệp trước cấp quản lý khách hàng.",
      },
    ],
    slots: 5,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Associate - Tư vấn Giao dịch (Deals Advisory)",
    companyIndex: 17,
    location: "TP. Hồ Chí Minh",
    salary: "18tr - 28tr",
    type: "FULL_TIME",
    level: "Junior",
    tags: [
      "M&A",
      "Due Diligence",
      "Financial Modeling",
      "Valuation",
      "Investment Advisory",
      "Excel",
      "CFA",
    ],
    industry: ["Marketing"],
    description:
      "PwC Deals Advisory tuyển Associate để hỗ trợ các giao dịch M&A và đầu tư.\n\nYêu cầu:\n- Tốt nghiệp Tài chính/Kế toán\n- Hiểu biết về tài chính doanh nghiệp\n- Excel nâng cao\n- IELTS 7.0+",
    benefits: [
      {
        label: "Lương cơ bản tốt",
        content:
          "Mức lương Associate Deals Advisory tốt hơn mức bình quân ngân hàng và tư vấn tài chính, phản ánh tính chuyên biệt và áp lực cao của công việc M&A. Được tăng nhanh theo hiệu suất và mức độ phức tạp của các giao dịch tham gia.",
      },
      {
        label: "CFA support",
        content:
          "PwC hỗ trợ học phí và thời gian ôn thi CFA, chứng chỉ đặc biệt giá trị trong lĩnh vực Deals Advisory và tài chính doanh nghiệp. Môi trường làm việc với financial model và valuation hàng ngày giúp củng cố kiến thức CFA cực kỳ hiệu quả.",
      },
      {
        label: "Exposure giao dịch triệu USD",
        content:
          "Được tham gia trực tiếp vào các giao dịch M&A và đầu tư giá trị từ hàng chục đến hàng trăm triệu USD, trải nghiệm không nơi nào khác có thể cung cấp cho người mới bắt đầu. Đây là vốn kinh nghiệm quý giá cho sự nghiệp tài chính doanh nghiệp về sau.",
      },
      {
        label: "Fast promotion",
        content:
          "Lộ trình thăng tiến nhanh từ Associate lên Senior Associate trong 2 năm nếu đáp ứng tiêu chí hiệu suất và hoàn thiện chứng chỉ. PwC Deals có thị trường tăng trưởng mạnh tại Việt Nam nên cơ hội thăng tiến nhanh hơn các service line khác.",
      },
      {
        label: "Bảo hiểm",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao phủ chi phí khám chữa bệnh tại các bệnh viện chất lượng, được chi trả bởi PwC. Đặc biệt quan trọng trong giai đoạn due diligence marathon với giờ làm việc kéo dài và áp lực cao.",
      },
    ],
    requirements: [
      {
        label: "Bằng Tài chính/Kế toán",
        content:
          "Tốt nghiệp đại học loại Khá trở lên chuyên ngành Tài chính, Kế toán, Kinh tế hoặc ngành liên quan từ trường đại học uy tín. Nền tảng tài chính vững chắc là điều kiện tiên quyết để hiểu và tham gia vào các giao dịch M&A phức tạp.",
      },
      {
        label: "Tài chính doanh nghiệp",
        content:
          "Hiểu biết về các khái niệm cơ bản của tài chính doanh nghiệp như valuation, DCF, comparable transaction analysis và capital structure. Có thể tự đọc và phân tích báo cáo tài chính để hỗ trợ senior trong quá trình due diligence.",
      },
      {
        label: "Excel nâng cao",
        content:
          "Thành thạo Excel nâng cao để xây dựng financial model, VBA cơ bản và pivot table phức tạp phục vụ phân tích giao dịch. Tốc độ và độ chính xác trong Excel là yếu tố quan trọng vì deadline M&A thường rất chặt chẽ.",
      },
      {
        label: "IELTS 7.0+",
        content:
          "Điểm IELTS 7.0 trở lên hoặc tương đương, đủ để làm việc trong môi trường Deals Advisory đa ngôn ngữ và giao tiếp với khách hàng quốc tế. Khả năng đọc và phân tích tài liệu pháp lý và tài chính bằng tiếng Anh là yêu cầu thiết yếu.",
      },
    ],
    slots: 3,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Manager - Tư vấn Thuế Doanh nghiệp",
    companyIndex: 17,
    location: "TP. Hồ Chí Minh",
    salary: "50tr - 80tr",
    type: "FULL_TIME",
    level: "Manager",
    tags: [
      "Tax Management",
      "Transfer Pricing",
      "CIT",
      "VAT",
      "International Tax",
      "Client Management",
      "BEPS",
    ],
    industry: ["Marketing"],
    description:
      "PwC Tax tìm Tax Manager để lãnh đạo nhóm tư vấn thuế doanh nghiệp và FDI.\n\nYêu cầu:\n- 7+ năm kinh nghiệm tư vấn thuế (Big 4)\n- Chuyên sâu về Transfer Pricing\n- Kinh nghiệm quản lý nhóm\n- Tiếng Anh thành thạo",
    benefits: [
      {
        label: "Gói lương Manager Big 4",
        content:
          "Mức lương Tax Manager tại PwC thuộc top thị trường tư vấn thuế Việt Nam, phản ánh kinh nghiệm 7+ năm và trách nhiệm lãnh đạo đội ngũ tư vấn thuế cho các tập đoàn lớn. Được benchmark với thị trường và điều chỉnh cạnh tranh định kỳ.",
      },
      {
        label: "Annual bonus lớn",
        content:
          "Thưởng cuối năm đáng kể dựa trên revenue của practice thuế, chất lượng tư vấn và mức độ hài lòng của khách hàng. Tax Manager đóng góp phát triển khách hàng mới và expand scope với khách hàng hiện tại sẽ nhận thưởng vượt trội.",
      },
      {
        label: "Bảo hiểm VIP",
        content:
          "Gói bảo hiểm VIP cấp Manager với quyền lợi cao nhất bao phủ toàn bộ gia đình, bao gồm điều trị tại bệnh viện quốc tế không giới hạn chi phí. Mức bảo hiểm nhân thọ và tai nạn cũng được nâng lên đáng kể so với cấp bậc thấp hơn.",
      },
      {
        label: "PwC global network",
        content:
          "Được kết nối với mạng lưới chuyên gia thuế toàn cầu của PwC tại 155 quốc gia, tiếp cận các hướng dẫn và precedent về thuế quốc tế từ các chuyên gia hàng đầu. Cơ hội tham gia các chương trình trao đổi quốc tế và hội nghị thuế toàn cầu của PwC.",
      },
      {
        label: "Cơ hội lên Partner",
        content:
          "Tax Manager xuất sắc có lộ trình rõ ràng lên Senior Manager và Partner trong 4-6 năm tiếp theo tại PwC. Đây là đích đến cao nhất trong sự nghiệp tư vấn và mang lại cả uy tín lẫn thu nhập vượt trội trong thị trường tư vấn thuế.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm tư vấn thuế Big 4",
        content:
          "Tối thiểu 7 năm kinh nghiệm tư vấn thuế, trong đó phần lớn tại Big 4 hoặc công ty tư vấn thuế quốc tế uy tín. Đã tự mình lãnh đạo và deliver các engagement thuế phức tạp cho doanh nghiệp đa quốc gia lớn.",
      },
      {
        label: "Transfer Pricing",
        content:
          "Chuyên sâu về Transfer Pricing, đã tư vấn và bảo vệ chính sách giá chuyển nhượng cho khách hàng trong các cuộc thanh tra thuế. Hiểu rõ các phương pháp xác định giá thị trường theo OECD Guidelines và quy định Việt Nam.",
      },
      {
        label: "Quản lý nhóm",
        content:
          "Kinh nghiệm xây dựng và phát triển đội ngũ tư vấn thuế, coaching từ Associate đến Senior Associate về kỹ năng kỹ thuật và tư duy tư vấn. Biết phân bổ nguồn lực hiệu quả giữa nhiều engagement cùng lúc và đảm bảo chất lượng deliverable.",
      },
      {
        label: "Tiếng Anh",
        content:
          "Tiếng Anh thành thạo để lãnh đạo đàm phán và thảo luận với cơ quan thuế bằng tiếng Anh khi làm việc với khách hàng FDI. Khả năng viết Tax Opinion và Tax Planning Memo bằng tiếng Anh chuyên nghiệp và chặt chẽ về mặt pháp lý.",
      },
    ],
    slots: 1,
    isHot: false,
    statusVariant: "published_future",
  },

  // ── Hòa Phát (18) ────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Quy trình Sản xuất Thép",
    companyIndex: 18,
    location: "Hà Nội",
    salary: "22tr - 38tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Metallurgy",
      "Process Engineering",
      "Steel Production",
      "Quality Control",
      "AutoCAD",
      "ISO 9001",
      "Lean Manufacturing",
    ],
    industry: ["Finance"],
    description:
      "Hòa Phát tìm Kỹ sư Quy trình để tối ưu hóa dây chuyền sản xuất thép tại nhà máy.\n\nYêu cầu:\n- Bằng Kỹ sư Vật liệu, Cơ khí hoặc Luyện kim\n- 3+ năm kinh nghiệm sản xuất công nghiệp\n- Kiến thức về quy trình luyện thép\n- Sẵn sàng công tác tại nhà máy",
    benefits: [
      {
        label: "Lương cạnh tranh ngành sản xuất",
        content:
          "Mức lương kỹ sư quy trình tại Hòa Phát được định vị cạnh tranh trong ngành sản xuất thép và công nghiệp nặng Việt Nam. Phụ cấp chuyên môn và thâm niên được cộng thêm vào lương cơ bản, tăng theo từng năm làm việc.",
      },
      {
        label: "Phụ cấp nhà máy",
        content:
          "Nhận phụ cấp nhà máy hàng tháng để bù đắp chi phí sinh hoạt khi công tác tại nhà máy ở khu công nghiệp. Phụ cấp ca, phụ cấp độc hại và phụ cấp trách nhiệm cũng được áp dụng tùy theo vị trí và điều kiện làm việc thực tế.",
      },
      {
        label: "Bảo hiểm tai nạn + sức khỏe",
        content:
          "Gói bảo hiểm đặc biệt bao gồm cả bảo hiểm tai nạn lao động 24/7 và bảo hiểm sức khỏe toàn diện, phù hợp với môi trường làm việc nhà máy có nhiều rủi ro. Mức bảo hiểm tai nạn cao hơn quy định nhà nước để đảm bảo an toàn tài chính cho kỹ sư và gia đình.",
      },
      {
        label: "Xe đưa đón",
        content:
          "Hòa Phát tổ chức xe đưa đón từ các điểm tập kết trong thành phố đến nhà máy, giúp kỹ sư không phải lo lắng về phương tiện di chuyển hàng ngày. Lịch xe cố định và đáng tin cậy, phù hợp với ca làm việc của từng bộ phận sản xuất.",
      },
    ],
    requirements: [
      {
        label: "Bằng Kỹ sư chuyên ngành",
        content:
          "Tốt nghiệp đại học chuyên ngành Kỹ thuật Vật liệu, Cơ khí, Luyện kim hoặc Kỹ thuật Hóa học từ trường đại học kỹ thuật uy tín. Nền tảng khoa học vật liệu và kỹ thuật vững chắc là điều kiện tiên quyết để hiểu và cải thiện quy trình luyện thép.",
      },
      {
        label: "Kinh nghiệm sản xuất công nghiệp",
        content:
          "Tối thiểu 3 năm kinh nghiệm trong vai trò kỹ thuật tại môi trường sản xuất công nghiệp, đã trực tiếp tham gia cải tiến quy trình và giải quyết các vấn đề kỹ thuật trong nhà máy. Quen thuộc với các tiêu chuẩn chất lượng ISO và quy trình kiểm soát sản xuất.",
      },
      {
        label: "Quy trình luyện thép",
        content:
          "Kiến thức về quy trình sản xuất thép từ nguyên liệu thô đến thành phẩm, bao gồm các giai đoạn luyện, cán và xử lý nhiệt. Hiểu mối quan hệ giữa các thông số quy trình và chất lượng sản phẩm để đưa ra điều chỉnh tối ưu.",
      },
      {
        label: "Sẵn sàng công tác nhà máy",
        content:
          "Sẵn sàng làm việc tại nhà máy ở khu công nghiệp, có thể bao gồm ca đêm và cuối tuần khi có sự cố sản xuất cần xử lý. Tính linh hoạt và khả năng chịu đựng điều kiện làm việc nhà máy là yếu tố quan trọng trong môi trường sản xuất 24/7 của Hòa Phát.",
      },
    ],
    slots: 5,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Kinh doanh Thép",
    companyIndex: 18,
    location: "Hà Nội",
    salary: "18tr - 30tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Steel Sales",
      "B2B Sales",
      "Construction Industry",
      "Account Management",
      "Negotiation",
      "Technical Sales",
    ],
    industry: ["Marketing"],
    description:
      "Hòa Phát tìm Chuyên viên Kinh doanh để phát triển thị trường thép xây dựng trên địa bàn Hà Nội và các tỉnh lân cận.\n\nYêu cầu:\n- 2+ năm kinh nghiệm bán hàng B2B\n- Kinh nghiệm ngành vật liệu xây dựng là lợi thế\n- Có xe máy và bằng lái",
    benefits: [
      {
        label: "Lương cơ bản + hoa hồng",
        content:
          "Thu nhập gồm lương cơ bản ổn định cộng hoa hồng theo doanh số bán thép tại khu vực phụ trách. Chuyên viên có mạng lưới khách hàng tốt và chủ động phát triển thị trường mới có thể đạt thu nhập hấp dẫn trong ngành vật liệu xây dựng.",
      },
      {
        label: "Xăng xe",
        content:
          "Chi phí xăng xe được thanh toán theo thực tế hoặc phụ cấp cố định hàng tháng để phục vụ công tác thăm khách hàng và nhà phân phối trong khu vực. Mức hỗ trợ phù hợp với địa bàn và tần suất di chuyển thực tế của từng chuyên viên.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe hỗ trợ chi phí khám chữa bệnh cho nhân viên tại các bệnh viện trong mạng lưới. Bảo hiểm xã hội và y tế được đóng đầy đủ từ ngày ký hợp đồng chính thức với công ty.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên tổng doanh số khu vực đã thực hiện và tỷ lệ phát triển khách hàng mới trong năm. Đây là sự ghi nhận toàn diện cho cả nỗ lực duy trì khách hàng cũ lẫn mở rộng thị trường mới.",
      },
      {
        label: "Đào tạo sản phẩm",
        content:
          "Được đào tạo đầy đủ về thông số kỹ thuật thép, ứng dụng trong xây dựng và sự khác biệt so với sản phẩm cạnh tranh trên thị trường. Kiến thức sản phẩm chuyên sâu giúp chuyên viên tư vấn và thuyết phục khách hàng kỹ thuật hiệu quả hơn.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm bán hàng B2B",
        content:
          "Tối thiểu 2 năm kinh nghiệm bán hàng B2B cho doanh nghiệp, đã trực tiếp tiếp cận, thuyết phục và chốt hợp đồng với các nhà thầu xây dựng hoặc nhà phân phối. Quen thuộc với quy trình mua hàng và ra quyết định của doanh nghiệp vừa và nhỏ trong ngành xây dựng.",
      },
      {
        label: "Ngành vật liệu xây dựng",
        content:
          "Kinh nghiệm bán hàng trong ngành vật liệu xây dựng như thép, xi măng, gạch hoặc thiết bị xây dựng là lợi thế lớn. Hiểu biết về đặc thù chu kỳ mua hàng theo mùa xây dựng và cách tiếp cận tư vấn kỹ thuật cho đội ngũ kỹ sư công trình.",
      },
      {
        label: "Xe máy và bằng lái",
        content:
          "Có xe máy cá nhân và bằng lái xe hợp lệ để di chuyển linh hoạt trong địa bàn Hà Nội và các tỉnh lân cận. Khả năng tự chủ di chuyển là yêu cầu thiết yếu để duy trì tần suất thăm viếng khách hàng và nhà phân phối đủ cao.",
      },
    ],
    slots: 8,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Kế toán Giá thành Sản xuất",
    companyIndex: 18,
    location: "Hà Nội",
    salary: "18tr - 28tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Cost Accounting",
      "Manufacturing Accounting",
      "VAS",
      "SAP",
      "Financial Reporting",
      "Budget Control",
    ],
    industry: ["Finance"],
    description:
      "Hòa Phát tìm Kế toán Giá thành để tính toán và kiểm soát chi phí sản xuất tại các nhà máy.\n\nYêu cầu:\n- 3+ năm kinh nghiệm kế toán giá thành trong sản xuất\n- Thành thạo SAP hoặc phần mềm kế toán ERP\n- Hiểu biết về quy trình sản xuất",
    benefits: [
      {
        label: "Lương theo năng lực",
        content:
          "Mức lương linh hoạt được xây dựng dựa trên kinh nghiệm thực tế và trình độ chuyên môn kế toán giá thành sản xuất. Hòa Phát sẵn sàng trả mức cạnh tranh cho ứng viên có kinh nghiệm SAP và ngành sản xuất công nghiệp nặng.",
      },
      {
        label: "Bảo hiểm đầy đủ",
        content:
          "Bảo hiểm xã hội, y tế và thất nghiệp được đóng đầy đủ theo quy định pháp luật, cộng thêm bảo hiểm sức khỏe bổ sung cho nhân viên. Bảo hiểm tai nạn lao động đặc biệt được bao gồm dù vị trí kế toán ít rủi ro hơn kỹ sư sản xuất.",
      },
      {
        label: "13 tháng lương",
        content:
          "Thưởng tháng 13 cố định được chi trả vào cuối năm như một phần cam kết phúc lợi ổn định của Hòa Phát. Đây là thu nhập bổ sung đáng kể, đặc biệt có giá trị trong môi trường sản xuất nơi lương tháng là nguồn thu chính.",
      },
      {
        label: "Môi trường ổn định lâu dài",
        content:
          "Hòa Phát là tập đoàn công nghiệp hàng đầu Việt Nam với lịch sử phát triển bền vững và ít biến động nhân sự trong bộ phận kế toán. Môi trường làm việc ổn định, có quy trình rõ ràng và phù hợp với người muốn xây dựng sự nghiệp kế toán dài hạn.",
      },
    ],
    requirements: [
      {
        label: "Kế toán giá thành sản xuất",
        content:
          "Tối thiểu 3 năm kinh nghiệm kế toán giá thành trong môi trường sản xuất công nghiệp, đã tự mình tính toán giá thành theo phương pháp phù hợp với quy trình sản xuất. Hiểu rõ các yếu tố cấu thành giá thành sản phẩm công nghiệp và cách phân bổ chi phí gián tiếp.",
      },
      {
        label: "SAP/ERP",
        content:
          "Thành thạo SAP CO (Controlling) hoặc module kế toán của ERP khác để nhập liệu, tính giá thành và xuất báo cáo chi phí. Biết cách khai thác dữ liệu SAP để phân tích biến động chi phí sản xuất và hỗ trợ kiểm soát ngân sách nhà máy.",
      },
      {
        label: "Quy trình sản xuất",
        content:
          "Hiểu biết cơ bản về quy trình sản xuất công nghiệp để nhận diện đúng các trung tâm chi phí và phân bổ chi phí sản xuất chính xác. Biết phối hợp với bộ phận kỹ thuật và vận hành để thu thập dữ liệu đầu vào cho tính giá thành.",
      },
    ],
    slots: 3,
    isHot: false,
    statusVariant: "closed",
  },
  {
    title: "Kỹ sư An toàn Lao động (HSE)",
    companyIndex: 18,
    location: "Hà Nội",
    salary: "18tr - 28tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Health & Safety",
      "Risk Assessment",
      "ISO 45001",
      "Incident Investigation",
      "Safety Training",
      "Industrial Safety",
    ],
    industry: ["Sales"],
    description:
      "Hòa Phát tìm Kỹ sư HSE để đảm bảo an toàn lao động tại môi trường sản xuất thép.\n\nYêu cầu:\n- Chứng chỉ an toàn lao động theo quy định\n- 3+ năm kinh nghiệm HSE trong sản xuất nặng\n- Hiểu biết về ISO 45001",
    benefits: [
      {
        label: "Lương cạnh tranh",
        content:
          "Mức lương HSE Engineer cạnh tranh trong ngành sản xuất công nghiệp nặng, phản ánh tầm quan trọng của công việc an toàn lao động trong môi trường sản xuất có nhiều rủi ro. Được tăng lương theo thâm niên và kết quả kiểm soát an toàn thực tế.",
      },
      {
        label: "Phụ cấp nhà máy",
        content:
          "Phụ cấp làm việc tại nhà máy cộng thêm phụ cấp độc hại và rủi ro phù hợp với điều kiện làm việc tại môi trường sản xuất thép. Tổng phụ cấp bổ sung đáng kể vào lương cơ bản, tăng tổng thu nhập thực tế của kỹ sư HSE.",
      },
      {
        label: "Bảo hiểm tai nạn cao cấp",
        content:
          "Gói bảo hiểm tai nạn lao động cao cấp với mức bồi thường vượt trội hơn quy định nhà nước, phù hợp với mức độ rủi ro trong nhà máy thép. Kỹ sư HSE được bảo vệ toàn diện nhất trong số các nhân viên vì đặc thù công việc tiếp xúc với nguy hiểm thường xuyên.",
      },
      {
        label: "Đào tạo HSE chuyên sâu",
        content:
          "Được tham gia các chương trình đào tạo HSE chuyên sâu do chuyên gia trong nước và quốc tế thực hiện, bao gồm các kỹ thuật đánh giá rủi ro và kiểm soát nguy hiểm tiên tiến. Cơ hội lấy thêm các chứng chỉ HSE quốc tế như NEBOSH do Hòa Phát tài trợ.",
      },
    ],
    requirements: [
      {
        label: "Chứng chỉ an toàn lao động",
        content:
          "Có chứng chỉ an toàn lao động theo quy định của Bộ Lao động Việt Nam, bao gồm chứng chỉ huấn luyện an toàn hạng A hoặc B tùy theo vị trí. Chứng chỉ cần còn hiệu lực và được cấp bởi cơ quan có thẩm quyền được công nhận.",
      },
      {
        label: "Kinh nghiệm HSE sản xuất nặng",
        content:
          "Tối thiểu 3 năm kinh nghiệm HSE trong môi trường sản xuất công nghiệp nặng như thép, xi măng, hóa chất hoặc khai khoáng. Đã thực hiện đánh giá rủi ro, điều tra tai nạn và triển khai các chương trình an toàn có hiệu quả đo lường được.",
      },
      {
        label: "ISO 45001",
        content:
          "Hiểu biết và kinh nghiệm thực hiện hệ thống quản lý an toàn sức khỏe nghề nghiệp theo tiêu chuẩn ISO 45001. Tham gia xây dựng, duy trì và cải tiến hệ thống OHSMS, chuẩn bị cho các cuộc đánh giá nội bộ và chứng nhận bên ngoài.",
      },
    ],
    slots: 4,
    isHot: false,
    statusVariant: "published_near",
  },

  // ── Sacombank (19) ───────────────────────────────────────────────────────────
  {
    title: "Chuyên viên Quan hệ Khách hàng Cá nhân (Personal Banker)",
    companyIndex: 19,
    location: "TP. Hồ Chí Minh",
    salary: "15tr - 28tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "Retail Banking",
      "Financial Planning",
      "Wealth Management",
      "Insurance Cross-sell",
      "KYC",
      "Client Acquisition",
    ],
    industry: ["Operations"],
    description:
      "Sacombank tuyển Personal Banker tại các chi nhánh TP.HCM. Tư vấn toàn diện sản phẩm tài chính từ tài khoản, thẻ, vay, bảo hiểm đến đầu tư.\n\nYêu cầu:\n- 2+ năm kinh nghiệm ngân hàng bán lẻ\n- Kỹ năng tư vấn và chốt sale\n- CFP là lợi thế",
    benefits: [
      {
        label: "Lương cơ bản + hoa hồng",
        content:
          "Thu nhập gồm lương cơ bản ổn định cộng hoa hồng dựa trên doanh số tư vấn sản phẩm và số lượng khách hàng mới mở tài khoản trong tháng. Cơ chế hoa hồng đa sản phẩm cho phép Personal Banker tối đa hóa thu nhập khi biết cross-sell hiệu quả.",
      },
      {
        label: "KPI bonus hàng tháng",
        content:
          "Thưởng KPI hàng tháng dựa trên các chỉ tiêu về số lượng sản phẩm bán ra, chất lượng danh mục và mức độ hài lòng của khách hàng. Cơ chế thưởng rõ ràng và thanh toán đúng hạn, không phải chờ đến cuối năm mới nhận được thành quả.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm sức khỏe cao cấp bao phủ khám chữa bệnh nội ngoại trú và nha khoa cho nhân viên. Sacombank cũng cung cấp bảo hiểm nhân thọ và bảo hiểm tai nạn 24/7 như một phần phúc lợi gắn kết nhân viên dài hạn.",
      },
      {
        label: "Vay ưu đãi nhân viên",
        content:
          "Được tiếp cận các gói vay mua nhà, mua xe và tiêu dùng với lãi suất ưu đãi đặc biệt dành riêng cho nội bộ Sacombank. Thủ tục xét duyệt đơn giản và ưu tiên nhanh, giúp nhân viên sớm hiện thực hóa các mục tiêu tài chính cá nhân.",
      },
      {
        label: "Annual award trip",
        content:
          "Chuyến du lịch thưởng hàng năm đến các điểm đến hấp dẫn trong và ngoài nước dành cho Personal Banker đạt kết quả kinh doanh xuất sắc. Đây là hoạt động ghi nhận đặc biệt và tạo động lực phấn đấu mạnh mẽ trong đội ngũ bán hàng.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm ngân hàng bán lẻ",
        content:
          "Tối thiểu 2 năm kinh nghiệm trong mảng ngân hàng bán lẻ, đã trực tiếp tư vấn và bán sản phẩm tài chính cho khách hàng cá nhân. Quen thuộc với quy trình KYC, mở tài khoản, tư vấn vay và bán bảo hiểm qua ngân hàng.",
      },
      {
        label: "Tư vấn và chốt sale",
        content:
          "Kỹ năng tư vấn chuyên nghiệp để phân tích nhu cầu tài chính của khách hàng và đề xuất giải pháp phù hợp từ portfolio sản phẩm. Khả năng xử lý phản đối và chốt sale khéo léo mà không tạo cảm giác ép buộc cho khách hàng.",
      },
      {
        label: "CFP",
        content:
          "Chứng chỉ Certified Financial Planner (CFP) là lợi thế lớn, thể hiện năng lực lập kế hoạch tài chính toàn diện cho khách hàng. Ứng viên đang theo học CFP hoặc có chứng chỉ tương đương về tư vấn tài chính cá nhân sẽ được ưu tiên.",
      },
    ],
    slots: 15,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Tín dụng Doanh nghiệp Vừa và Nhỏ (SME)",
    companyIndex: 19,
    location: "TP. Hồ Chí Minh",
    salary: "20tr - 35tr",
    type: "FULL_TIME",
    level: "Senior",
    tags: [
      "SME Banking",
      "Credit Analysis",
      "Relationship Management",
      "Loan Structuring",
      "Due Diligence",
    ],
    industry: ["HR"],
    description:
      "Sacombank tìm Chuyên viên Tín dụng SME để phát triển danh mục khách hàng doanh nghiệp nhỏ và vừa.\n\nYêu cầu:\n- 3+ năm kinh nghiệm tín dụng doanh nghiệp\n- Kỹ năng phân tích tài chính tốt\n- Mạng lưới khách hàng SME",
    benefits: [
      {
        label: "Lương cơ bản cao",
        content:
          "Mức lương cơ bản cạnh tranh trong ngành ngân hàng tư nhân, phản ánh trách nhiệm quản lý danh mục tín dụng SME với rủi ro đa dạng. Được điều chỉnh tăng theo kết quả tăng trưởng danh mục và chất lượng nợ hàng năm.",
      },
      {
        label: "Hoa hồng theo danh mục",
        content:
          "Hoa hồng hấp dẫn được tính theo quy mô và chất lượng danh mục tín dụng SME đang quản lý, không chỉ dựa trên dư nợ mới. Cơ chế này khuyến khích chuyên viên duy trì chất lượng danh mục tốt và phát triển bền vững, không chỉ chạy đua dư nợ ngắn hạn.",
      },
      {
        label: "Bảo hiểm cao cấp",
        content:
          "Gói bảo hiểm sức khỏe cao cấp bao phủ toàn diện cho nhân viên và người thân trực tiếp, với quyền lợi nổi trội hơn các ngân hàng cùng phân khúc. Bao gồm nha khoa và hỗ trợ điều trị tại các bệnh viện quốc tế trong trường hợp cần thiết.",
      },
      {
        label: "Vay ưu đãi nhân viên",
        content:
          "Chuyên viên tín dụng được tiếp cận các gói vay mua nhà và vay kinh doanh cá nhân với lãi suất ưu đãi đặc biệt thấp nhất trong danh mục sản phẩm của Sacombank. Đây là lợi ích tài chính thực sự quan trọng, đặc biệt trong bối cảnh lãi suất thị trường biến động.",
      },
      {
        label: "Đào tạo chuyên sâu",
        content:
          "Chương trình đào tạo tín dụng SME chuyên biệt bao gồm phân tích tài chính doanh nghiệp nhỏ, đánh giá rủi ro đặc thù và kỹ thuật quản lý danh mục. Sacombank đầu tư vào năng lực chuyên viên để nâng cao chất lượng cấp tín dụng và giảm thiểu nợ xấu dài hạn.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm tín dụng doanh nghiệp",
        content:
          "Tối thiểu 3 năm kinh nghiệm thẩm định và quản lý tín dụng cho doanh nghiệp nhỏ và vừa tại ngân hàng thương mại. Đã tự mình lập tờ trình cấp tín dụng, thẩm định rủi ro và theo dõi sau giải ngân cho danh mục từ 30-50 khách hàng.",
      },
      {
        label: "Phân tích tài chính",
        content:
          "Kỹ năng phân tích báo cáo tài chính doanh nghiệp SME vững chắc, kể cả trong trường hợp số liệu chưa được kiểm toán và có sai lệch. Biết điều chỉnh số liệu, phát hiện rủi ro ẩn và đánh giá khả năng trả nợ thực tế của doanh nghiệp.",
      },
      {
        label: "Mạng lưới khách hàng SME",
        content:
          "Có mạng lưới quan hệ với chủ doanh nghiệp SME, kế toán và các trung gian giới thiệu khách hàng để dễ dàng phát triển danh mục mới. Mạng lưới này giúp rút ngắn thời gian tìm kiếm và onboard khách hàng mới đáng kể so với tìm kiếm cold.",
      },
    ],
    slots: 8,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Chuyên viên Công nghệ Thông tin - Banking App",
    companyIndex: 19,
    location: "TP. Hồ Chí Minh",
    salary: "22tr - 40tr",
    type: "FULL_TIME",
    level: "Middle",
    tags: [
      "React Native",
      "Mobile Banking",
      "iOS",
      "Android",
      "REST API",
      "Banking Security",
      "Agile",
    ],
    industry: ["Sales"],
    description:
      "Sacombank tìm Mobile Developer để phát triển ứng dụng ngân hàng số Sacombank Pay.\n\nYêu cầu:\n- 3+ năm kinh nghiệm mobile (React Native)\n- Hiểu biết về bảo mật ứng dụng ngân hàng\n- Kinh nghiệm với biometric authentication",
    benefits: [
      {
        label: "Lương cạnh tranh ngân hàng",
        content:
          "Mức lương IT trong ngân hàng tư nhân được cải thiện đáng kể, cạnh tranh với các fintech và công ty công nghệ để thu hút developer giỏi. Sacombank đang tăng tốc đầu tư vào ngân hàng số nên lương IT được ưu tiên nâng cao.",
      },
      {
        label: "Annual bonus",
        content:
          "Thưởng cuối năm dựa trên kết quả kinh doanh của Sacombank và đóng góp của kỹ sư vào chất lượng ứng dụng. Developer cải thiện được app store rating và giảm crash rate sẽ được ghi nhận đặc biệt trong đánh giá năm.",
      },
      {
        label: "Bảo hiểm sức khỏe",
        content:
          "Gói bảo hiểm sức khỏe toàn diện bao phủ khám chữa bệnh nội ngoại trú tại các bệnh viện chất lượng, do Sacombank chi trả hoàn toàn. Bảo hiểm xã hội và y tế được đóng đầy đủ từ ngày đầu ký hợp đồng chính thức với ngân hàng.",
      },
      {
        label: "Vay ưu đãi nhân viên",
        content:
          "Nhân viên IT của Sacombank được tiếp cận các gói vay mua nhà và tiêu dùng với lãi suất ưu đãi đặc biệt thấp hơn lãi suất thị trường. Thủ tục đơn giản và được ưu tiên xét duyệt nhanh hơn khách hàng thông thường.",
      },
      {
        label: "Remote partial",
        content:
          "Chính sách hybrid linh hoạt cho phép developer làm việc từ xa vài ngày mỗi tuần, phù hợp với tính chất công việc phát triển mobile không cần có mặt văn phòng hàng ngày. Lịch remote được thống nhất với team lead dựa trên nhu cầu công việc thực tế.",
      },
    ],
    requirements: [
      {
        label: "Kinh nghiệm React Native",
        content:
          "Tối thiểu 3 năm kinh nghiệm phát triển mobile với React Native, đã tham gia ít nhất một ứng dụng ngân hàng hoặc fintech có lượng người dùng lớn. Hiểu rõ vòng đời phát triển ứng dụng ngân hàng số từ thiết kế đến maintenance và update liên tục.",
      },
      {
        label: "Bảo mật ứng dụng ngân hàng",
        content:
          "Hiểu biết về các yêu cầu bảo mật đặc thù của ứng dụng ngân hàng như certificate pinning, root/jailbreak detection và mã hóa dữ liệu nhạy cảm. Quen thuộc với các tiêu chuẩn bảo mật mobile OWASP MASVS và hướng dẫn bảo mật của NHNN.",
      },
      {
        label: "Biometric authentication",
        content:
          "Kinh nghiệm implement xác thực sinh trắc học như Face ID, Touch ID và Android Biometric API trong ứng dụng di động bảo mật cao. Biết cách xử lý các trường hợp fallback an toàn khi biometric không khả dụng và đảm bảo UX mượt mà.",
      },
    ],
    slots: 3,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Thực tập sinh Ngân hàng (Banking Intern)",
    companyIndex: 19,
    location: "TP. Hồ Chí Minh",
    salary: "5tr - 7tr",
    type: "INTERNSHIP",
    level: "Intern",
    tags: [
      "Banking",
      "Finance",
      "Customer Service",
      "Data Entry",
      "Learning",
      "Teamwork",
    ],
    industry: ["IT"],
    description:
      "Sacombank tuyển thực tập sinh ngân hàng, phù hợp sinh viên năm 3-4 ngành Tài chính, Kinh tế.\n\nYêu cầu:\n- Sinh viên năm 3-4 ngành Tài chính/Kế toán\n- Năng động, cầu tiến\n- Tiếng Anh cơ bản",
    benefits: [
      {
        label: "Thực tập có lương",
        content:
          "Thực tập sinh nhận trợ cấp hàng tháng thể hiện sự tôn trọng thời gian và công sức của sinh viên khi cống hiến cho ngân hàng. Mức trợ cấp hợp lý, giúp sinh viên trang trải một phần chi phí sinh hoạt trong thời gian thực tập.",
      },
      {
        label: "Đào tạo nghiệp vụ ngân hàng",
        content:
          "Được đào tạo bài bản về các nghiệp vụ ngân hàng cơ bản như tín dụng, giao dịch, sản phẩm tài chính và quy trình KYC. Kiến thức thực tiễn này vượt xa những gì học tại trường và là nền tảng vững chắc cho sự nghiệp ngân hàng.",
      },
      {
        label: "Certificate",
        content:
          "Nhận chứng chỉ hoàn thành chương trình thực tập từ Sacombank, có giá trị cao trong hồ sơ xin việc ngân hàng. Chứng chỉ ghi rõ bộ phận thực tập, thời gian và đánh giá kết quả thực tập để nhà tuyển dụng tham khảo.",
      },
      {
        label: "Cơ hội full-time",
        content:
          "Thực tập sinh xuất sắc được xem xét tuyển dụng chính thức sau khi tốt nghiệp, bỏ qua vòng nộp hồ sơ và test đầu vào thông thường. Đây là con đường ngắn nhất để gia nhập Sacombank với kiến thức và mạng lưới đã xây dựng từ thực tập.",
      },
      {
        label: "Mạng lưới ngân hàng",
        content:
          "Xây dựng được mạng lưới quan hệ trong ngành ngân hàng ngay từ khi còn đi học, bao gồm cả mentor nội bộ và các thực tập sinh từ trường khác. Mạng lưới này có giá trị lâu dài trong sự nghiệp tài chính ngân hàng về sau.",
      },
    ],
    requirements: [
      {
        label: "Sinh viên Tài chính/Kế toán năm 3-4",
        content:
          "Đang theo học năm 3 hoặc 4 chuyên ngành Tài chính, Kế toán, Ngân hàng hoặc Kinh tế tại các trường đại học, không yêu cầu GPA tối thiểu nhưng ưu tiên sinh viên có điểm học tập tốt và hoạt động ngoại khóa tích cực.",
      },
      {
        label: "Năng động và cầu tiến",
        content:
          "Thái độ chủ động học hỏi, không ngại đặt câu hỏi và sẵn sàng nhận thêm trách nhiệm khi có cơ hội. Tính cầu tiến và mong muốn xây dựng sự nghiệp trong ngành ngân hàng là yếu tố Sacombank đánh giá cao nhất ở thực tập sinh.",
      },
      {
        label: "Tiếng Anh cơ bản",
        content:
          "Tiếng Anh đủ để đọc tài liệu nghiệp vụ ngân hàng cơ bản và sử dụng các hệ thống có giao diện tiếng Anh. Không cần tiếng Anh thành thạo nhưng khả năng đọc hiểu cơ bản giúp thực tập sinh học hỏi nhanh hơn trong môi trường ngân hàng hiện đại.",
      },
    ],
    slots: 20,
    isHot: false,
    statusVariant: "published_near",
  },

  // ── Extra Contract/Part-time jobs ─────────────────────────────────────────────
  {
    title: "Hợp đồng: Kế toán Dự án (6 tháng)",
    companyIndex: 6,
    location: "TP. Hồ Chí Minh",
    salary: "15tr - 22tr",
    type: "CONTRACT",
    level: "Junior",
    tags: [
      "Accounting",
      "VAS",
      "IFRS",
      "Tax",
      "Excel",
      "Audit Support",
      "Financial Reporting",
    ],
    industry: ["Operations"],
    description:
      "KPMG tuyển Kế toán hợp đồng 6 tháng để hỗ trợ mùa kiểm toán cao điểm.\n\nYêu cầu:\n- Tốt nghiệp Kế toán/Kiểm toán\n- Excel thành thạo\n- Cẩn thận, chịu khó",
    benefits: [
      {
        label: "Lương hấp dẫn cho hợp đồng",
        content:
          "Mức lương hợp đồng 6 tháng tại KPMG được tính cao hơn mức thị trường thông thường để bù đắp cho tính tạm thời của hợp đồng. Đây là cơ hội kiếm thu nhập tốt trong thời gian ngắn đồng thời tích lũy kinh nghiệm Big 4 quý giá.",
      },
      {
        label: "Trải nghiệm Big 4",
        content:
          "Được làm việc trực tiếp trong môi trường KPMG và tiếp cận quy trình kiểm toán chuẩn Big 4 trong thực tế. Trải nghiệm này là tài sản nghề nghiệp có giá trị lớn, giúp ứng viên nổi bật trong các vị trí kế toán tương lai.",
      },
      {
        label: "Mentor từ senior",
        content:
          "Được kèm cặp bởi Senior hoặc Manager có kinh nghiệm để học hỏi cách xử lý công việc kế toán theo chuẩn KPMG. Đây là cơ hội học nhanh trong thời gian ngắn thông qua làm việc trực tiếp với những chuyên gia đầu ngành.",
      },
      {
        label: "Certificate",
        content:
          "Nhận chứng chỉ hoàn thành hợp đồng từ KPMG ghi nhận kinh nghiệm làm việc tại công ty kiểm toán Big 4. Chứng chỉ này có ý nghĩa lớn trong hồ sơ xin việc và có thể là điểm khác biệt quan trọng so với các ứng viên khác.",
      },
      {
        label: "Cơ hội full-time",
        content:
          "Nhân viên hợp đồng có hiệu suất xuất sắc sẽ được xem xét chuyển đổi sang hợp đồng chính thức sau khi kết thúc 6 tháng. Đây là con đường vào KPMG mà không cần cạnh tranh trong quy trình tuyển dụng thông thường vốn rất khắt khe.",
      },
    ],
    requirements: [
      {
        label: "Bằng Kế toán/Kiểm toán",
        content:
          "Tốt nghiệp đại học chuyên ngành Kế toán, Kiểm toán hoặc Tài chính từ trường đại học uy tín. Điểm GPA từ 3.0/4.0 trở lên thể hiện năng lực học tập và khả năng nắm bắt kiến thức chuyên sâu về kế toán kiểm toán.",
      },
      {
        label: "Excel thành thạo",
        content:
          "Thành thạo Excel ở mức có thể xử lý bảng tính lớn, sử dụng hàm tra cứu, pivot table và các công thức tài chính phức tạp không cần tra cứu. Tốc độ và độ chính xác trong Excel là yếu tố quan trọng trong môi trường làm việc có deadline nghiêm ngặt.",
      },
      {
        label: "Cẩn thận và chịu khó",
        content:
          "Tính cẩn thận và chú ý đến chi tiết cao trong xử lý số liệu kế toán, không để xảy ra sai sót ảnh hưởng đến tính chính xác của báo cáo tài chính. Sẵn sàng làm overtime trong mùa kiểm toán cao điểm và duy trì chất lượng công việc ổn định dưới áp lực.",
      },
    ],
    slots: 5,
    isHot: false,
    statusVariant: "published_past",
  },
  {
    title: "Bán thời gian: Chuyên viên Truyền thông Mạng xã hội",
    companyIndex: 9,
    location: "TP. Hồ Chí Minh",
    salary: "8tr - 12tr",
    type: "PART_TIME",
    level: "Junior",
    tags: [
      "Social Media",
      "Content Creation",
      "TikTok",
      "Facebook",
      "Canva",
      "Community Management",
      "Copywriting",
    ],
    industry: ["HR"],
    description:
      "MoMo tuyển Part-time Social Media Specialist. Làm việc 4 tiếng/ngày, linh hoạt giờ giấc.\n\nYêu cầu:\n- Đam mê mạng xã hội, hiểu trend\n- Biết Canva, chỉnh ảnh/video cơ bản\n- Cam kết 4 tiếng/ngày",
    benefits: [
      {
        label: "Lương theo giờ cạnh tranh",
        content:
          "Mức lương theo giờ cạnh tranh so với thị trường freelance social media, được tính và chi trả minh bạch dựa trên số giờ làm việc thực tế. Phù hợp với sinh viên hoặc người muốn có thu nhập phụ trong khi vẫn duy trì lịch học hoặc công việc chính.",
      },
      {
        label: "MoMo vouchers",
        content:
          "Được nhận MoMo vouchers hàng tháng để sử dụng dịch vụ của MoMo, đặt đồ ăn, thanh toán hóa đơn và mua sắm online miễn phí. Nhân viên trải nghiệm trực tiếp sản phẩm giúp tạo nội dung mạng xã hội chân thực và gần gũi với người dùng hơn.",
      },
      {
        label: "Flexible hours",
        content:
          "Linh hoạt chọn 4 tiếng làm việc mỗi ngày theo khung giờ phù hợp với lịch cá nhân, miễn đảm bảo deadline nội dung và phản hồi comment đúng hạn. Không cần có mặt văn phòng, hoàn toàn tự sắp xếp thời gian trong ngày.",
      },
      {
        label: "Work from home option",
        content:
          "Toàn bộ công việc có thể thực hiện từ xa, không yêu cầu đến văn phòng. Chỉ cần laptop và kết nối internet ổn định là đủ để hoàn thành tất cả nhiệm vụ quản lý mạng xã hội MoMo hàng ngày.",
      },
      {
        label: "Cơ hội full-time",
        content:
          "Nhân viên bán thời gian xuất sắc, có đam mê thực sự và kết quả engagement tốt sẽ được xem xét offer vị trí full-time trong team Marketing MoMo. Đây là cách lý tưởng để bắt đầu sự nghiệp trong một trong những ví điện tử lớn nhất Việt Nam.",
      },
    ],
    requirements: [
      {
        label: "Đam mê mạng xã hội và hiểu trend",
        content:
          "Thực sự đam mê mạng xã hội, thường xuyên theo dõi các xu hướng nội dung trên TikTok, Facebook và Instagram. Có khả năng nhận diện trend sớm và áp dụng vào việc tạo nội dung phù hợp với thương hiệu MoMo một cách tự nhiên.",
      },
      {
        label: "Canva và chỉnh ảnh/video cơ bản",
        content:
          "Sử dụng thành thạo Canva để thiết kế visual content theo template và tự tạo graphic đơn giản. Biết chỉnh sửa ảnh cơ bản bằng Lightroom hoặc VSCO và cắt ghép video ngắn bằng CapCut hoặc công cụ tương tự.",
      },
      {
        label: "Cam kết 4 tiếng/ngày",
        content:
          "Cam kết nghiêm túc 4 tiếng làm việc mỗi ngày theo lịch đã thống nhất, không tự ý bỏ ca hoặc giảm giờ làm đột ngột. Tính nhất quán và đáng tin cậy là yếu tố quan trọng nhất vì nội dung mạng xã hội cần được đăng đều đặn theo lịch.",
      },
    ],
    slots: 3,
    isHot: false,
    statusVariant: "published_near",
  },
];

// ─── Recruiter notes templates ────────────────────────────────────────────────
const RECRUITER_NOTES = [
  "Ứng viên có profile ấn tượng, kỹ năng kỹ thuật phù hợp JD. Tuy nhiên qua vòng phỏng vấn, kinh nghiệm thực tế còn hạn chế so với yêu cầu. Đề xuất xem xét cho vị trí thấp hơn một bậc.",
  "Ứng viên trình bày tốt, thái độ chuyên nghiệp, KPI tại công ty cũ đạt 120% liên tục. Salary expectation hợp lý. Đề xuất offer và onboard sớm.",
  "CV tốt nhưng qua phỏng vấn thiếu kinh nghiệm dự án quy mô lớn. Portfolio chủ yếu là side projects cá nhân. Cần cân nhắc thêm.",
  "Salary expectation vượt budget 30%. Đã đàm phán nhưng ứng viên không linh hoạt. Tạm thời hold hồ sơ.",
  "Technical test đạt 65/100, chưa đạt ngưỡng 70 theo quy định. Ứng viên tiếp tục ôn luyện và nộp lại sau 3-6 tháng.",
  "Ứng viên xuất sắc! Vượt qua tất cả vòng phỏng vấn với điểm cao nhất batch này. Tư duy sắc bén, culture fit tốt. Đã gửi offer letter.",
  "Nền tảng kỹ thuật vững, điểm trừ là chưa có kinh nghiệm trong ngành. Team lead đánh giá cần 2-3 tháng onboard. Vẫn đề xuất proceed.",
  "Ứng viên thể hiện tốt về chuyên môn nhưng có dấu hiệu khó tiếp nhận feedback trong case interview. Cần trao đổi thêm với hiring manager.",
  "Ứng viên apply nhầm vị trí – kinh nghiệm không phù hợp. Đã liên hệ và đề xuất ứng viên apply vị trí khác phù hợp hơn.",
  "Rất tiếc phải từ chối vì vị trí đã được chuyển thành internal promotion. Ứng viên sẽ được ưu tiên cho các vị trí tương tự.",
  "Reference check có một số thông tin không khớp. Đang xác minh thêm trước khi ra quyết định cuối.",
  "Background phù hợp, tiếng Anh trôi chảy. Cần thêm 1 buổi gặp trực tiếp với CTO để final decision.",
];

// ─── Cover letter templates ───────────────────────────────────────────────────
const COVER_LETTERS = [
  {
    title: "Thư ứng tuyển – Vị trí Kỹ sư Backend",
    content: `Kính gửi Phòng Nhân sự,\n\nTôi viết thư này để ứng tuyển vào vị trí Kỹ sư Backend tại quý công ty. Với hơn 3 năm kinh nghiệm phát triển hệ thống backend sử dụng Node.js và NestJS, tôi tin rằng mình có thể đóng góp giá trị cho đội ngũ kỹ thuật.\n\nTôi đã tham gia xây dựng hệ thống microservices xử lý hàng triệu request mỗi ngày, tối ưu cơ sở dữ liệu và triển khai caching với Redis. Tôi cũng có kinh nghiệm làm việc trong môi trường Agile và mentoring junior developer.\n\nĐiều khiến tôi quan tâm đến vị trí này là cơ hội được làm việc với công nghệ hiện đại và thách thức kỹ thuật cao. Tôi hy vọng được gặp gỡ và thảo luận thêm.\n\nTrân trọng.`,
  },
  {
    title: "Thư xin việc – Chuyên viên Marketing",
    content: `Kính gửi Ban Tuyển dụng,\n\nTôi là ứng viên ứng tuyển vào vị trí Chuyên viên Digital Marketing. Với 4 năm kinh nghiệm marketing kỹ thuật số, tôi đã xây dựng nhiều chiến dịch marketing thành công với ROAS trung bình 4.5x và tăng organic traffic lên 200% trong 6 tháng.\n\nTôi đặc biệt quan tâm đến cơ hội tại quý công ty vì muốn áp dụng kinh nghiệm vào lĩnh vực mới đầy tiềm năng. Tôi tin sự kết hợp giữa kiến thức marketing kỹ thuật số và hiểu biết về hành vi người tiêu dùng sẽ giúp tôi đóng góp hiệu quả.\n\nTrân trọng.`,
  },
  {
    title: "Thư ứng tuyển – Kế toán Tổng hợp",
    content: `Kính gửi Phòng Nhân sự,\n\nTôi xin gửi hồ sơ ứng tuyển vị trí Kế toán Tổng hợp. Với 6 năm kinh nghiệm kế toán tại doanh nghiệp sản xuất và thương mại, tôi thành thạo xử lý đầy đủ nghiệp vụ kế toán theo chuẩn VAS.\n\nTôi thành thạo MISA và SAP, luôn hoàn thành công việc đúng hạn kể cả trong các kỳ quyết toán áp lực cao. Tôi tin sự cẩn thận và trách nhiệm cao của mình sẽ phù hợp với yêu cầu vị trí.\n\nKính trân trọng.`,
  },
  {
    title: "Thư ứng tuyển – Chuyên viên Phân tích Dữ liệu",
    content: `Kính gửi Phòng Nhân sự,\n\nTôi ứng tuyển vị trí Data Analyst. Với 3 năm kinh nghiệm phân tích dữ liệu trong fintech và e-commerce, tôi thành thạo Python, SQL và Power BI. Tôi đã xây dựng dashboard theo dõi KPI, phân tích cohort retention và mô hình churn prediction đạt accuracy 87%.\n\nTôi bị thu hút bởi cơ hội làm việc với quy mô dữ liệu lớn tại quý công ty để áp dụng các phương pháp phân tích nâng cao hơn.\n\nTrân trọng.`,
  },
  {
    title: "Thư ứng tuyển – Vị trí Kinh doanh",
    content: `Kính gửi Ban Tuyển dụng,\n\nTôi ứng tuyển vào vị trí Sales Executive với 5 năm kinh nghiệm bán hàng B2B trong ngành phần mềm doanh nghiệp. Tôi đã liên tục vượt KPI 3 năm liền với thành tích đàm phán các hợp đồng trị giá trên 500 triệu đồng.\n\nTôi hiểu sâu quy trình bán hàng từ prospecting đến closing và luôn đặt khách hàng làm trung tâm. Tôi mong muốn đóng góp vào sự phát triển của quý công ty.\n\nKính trân trọng.`,
  },
  {
    title: "Cover Letter – HR Business Partner",
    content: `Kính gửi Ban Tuyển dụng,\n\nTôi ứng tuyển vào vị trí HR Business Partner với 5 năm kinh nghiệm HR, trong đó 2 năm HRBP. Tôi đã phối hợp với 3 business unit thiết kế chương trình performance management mới, giúp tăng employee engagement score từ 65% lên 78%.\n\nTôi tin sự kết hợp giữa tư duy business và chuyên môn HR sẽ giúp tôi trở thành đối tác chiến lược đáng tin cậy.\n\nKính trân trọng.`,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
const POST_SEED_DATA = [
  {
    title: "Cách xây dựng CV nổi bật cho sinh viên mới ra trường",
    slug: "cach-xay-dung-cv-noi-bat-cho-sinh-vien-moi-ra-truong",
    category: "Hành trang nghề nghiệp",
    excerpt:
      "Những phần quan trọng cần có trong CV entry-level và cách trình bày kinh nghiệm học tập, dự án, hoạt động ngoại khóa.",
    content:
      "<h2>CV entry-level cần thể hiện điều gì?</h2><p>Nhà tuyển dụng không kỳ vọng ứng viên mới ra trường có lịch sử làm việc dài. Điều họ cần thấy là khả năng học nhanh, tư duy có cấu trúc và mức độ phù hợp với vị trí.</p><h2>Cấu trúc nên dùng</h2><p>Hãy ưu tiên thông tin liên hệ, mục tiêu nghề nghiệp ngắn gọn, học vấn, dự án, kỹ năng và hoạt động nổi bật.</p><h3>Cách viết dự án</h3><p>Mỗi dự án nên có bối cảnh, vai trò của bạn, công cụ sử dụng và kết quả đo được.</p>",
  },
  {
    title: "Checklist chuẩn bị phỏng vấn trong 24 giờ",
    slug: "checklist-chuan-bi-phong-van-trong-24-gio",
    category: "Bí kíp tìm việc",
    excerpt:
      "Một checklist thực tế giúp ứng viên chuẩn bị nhanh trước buổi phỏng vấn mà không bị lan man.",
    content:
      "<h2>Trước buổi phỏng vấn</h2><p>Đọc lại JD, nghiên cứu sản phẩm, chuẩn bị ví dụ theo phương pháp STAR và kiểm tra thiết bị nếu phỏng vấn online.</p><h2>Trong buổi phỏng vấn</h2><p>Trả lời ngắn gọn, đi vào kết quả và chủ động hỏi lại khi câu hỏi chưa rõ.</p><h3>Sau buổi phỏng vấn</h3><p>Gửi email cảm ơn, nhắc lại điểm phù hợp và bổ sung tài liệu nếu được yêu cầu.</p>",
  },
  {
    title: "Deal lương là gì và cách chuẩn bị mức kỳ vọng hợp lý",
    slug: "deal-luong-la-gi-va-cach-chuan-bi-muc-ky-vong-hop-ly",
    category: "Chế độ lương thưởng",
    excerpt:
      "Cách xác định khoảng lương, nói về kỳ vọng thu nhập và đánh giá tổng đãi ngộ khi nhận offer.",
    content:
      "<h2>Deal lương không chỉ là con số</h2><p>Ứng viên nên đánh giá cả lương cứng, thưởng, bảo hiểm, thời gian làm việc, cơ hội học tập và lộ trình tăng trưởng.</p><h2>Cách xác định khoảng lương</h2><p>So sánh mặt bằng thị trường, kinh nghiệm thực tế, độ khó vị trí và ngân sách ngành.</p><h3>Khi nhận offer</h3><p>Hãy phản hồi chuyên nghiệp, nêu cơ sở cho kỳ vọng và để lại khoảng mở để hai bên trao đổi.</p>",
  },
  {
    title: "Ngành IT gồm những vị trí phổ biến nào?",
    slug: "nganh-it-gom-nhung-vi-tri-pho-bien-nao",
    category: "Kiến thức chuyên ngành",
    excerpt:
      "Tổng quan các nhóm vị trí trong ngành IT để ứng viên định hướng lộ trình học tập và ứng tuyển.",
    content:
      "<h2>Nhóm phát triển phần mềm</h2><p>Frontend, Backend, Mobile và Fullstack là các nhóm phổ biến, yêu cầu năng lực lập trình và tư duy giải quyết vấn đề.</p><h2>Nhóm vận hành và dữ liệu</h2><p>DevOps, Data Analyst, Data Engineer và QA giúp sản phẩm ổn định, đo lường được và cải tiến liên tục.</p><h3>Chọn hướng đi</h3><p>Hãy bắt đầu từ điểm mạnh cá nhân, sau đó thử dự án nhỏ để kiểm chứng sự phù hợp.</p>",
  },
  {
    title: "Lộ trình chuyển ngành sang Marketing cho người mới",
    slug: "lo-trinh-chuyen-nganh-sang-marketing-cho-nguoi-moi",
    category: "Định hướng nghề nghiệp",
    excerpt:
      "Các kỹ năng nền tảng và bước thực hành giúp người mới chuyển ngành sang Marketing có định hướng rõ hơn.",
    content:
      "<h2>Hiểu đúng về Marketing</h2><p>Marketing không chỉ là chạy quảng cáo. Công việc còn bao gồm nghiên cứu khách hàng, định vị, nội dung, phân phối và đo lường.</p><h2>Kỹ năng cần ưu tiên</h2><p>Hãy bắt đầu với phân tích khách hàng, viết nội dung, đọc số liệu và tư duy thử nghiệm.</p><h3>Dự án portfolio</h3><p>Một case study nhỏ có mục tiêu, cách làm và kết quả rõ ràng sẽ thuyết phục hơn danh sách khóa học.</p>",
  },
  {
    title: "Xu hướng tuyển dụng hybrid và remote năm 2026",
    slug: "xu-huong-tuyen-dung-hybrid-va-remote-nam-2026",
    category: "Thị trường và xu hướng tuyển dụng",
    excerpt:
      "Các tiêu chí nhà tuyển dụng thường dùng khi đánh giá ứng viên cho môi trường hybrid và remote.",
    content:
      "<h2>Hybrid trở thành tiêu chuẩn mới</h2><p>Nhiều doanh nghiệp duy trì mô hình linh hoạt nhưng yêu cầu khả năng tự quản trị, giao tiếp rõ ràng và trách nhiệm với kết quả.</p><h2>Ứng viên cần chuẩn bị gì?</h2><p>Hãy chứng minh năng lực làm việc độc lập, quản lý thời gian và cập nhật tiến độ minh bạch.</p><h3>Phỏng vấn remote</h3><p>Kiểm tra đường truyền, ánh sáng, micro và chuẩn bị tài liệu trước buổi phỏng vấn.</p>",
  },
  {
    title: "Cách đọc JD để biết công việc có phù hợp không",
    slug: "cach-doc-jd-de-biet-cong-viec-co-phu-hop-khong",
    category: "Bí kíp tìm việc",
    excerpt:
      "Phân tích mô tả công việc theo trách nhiệm, yêu cầu, mức độ ưu tiên và tín hiệu văn hóa.",
    content:
      "<h2>Đừng chỉ đọc tiêu đề</h2><p>Cùng một chức danh có thể khác nhau rất nhiều giữa các công ty. Hãy đọc kỹ phạm vi công việc và kết quả kỳ vọng.</p><h2>Phân loại yêu cầu</h2><p>Tách yêu cầu bắt buộc, yêu cầu cộng điểm và kỹ năng có thể học sau khi vào việc.</p><h3>Tín hiệu cần lưu ý</h3><p>JD quá mơ hồ hoặc gom quá nhiều vai trò có thể là dấu hiệu phạm vi công việc chưa rõ.</p>",
  },
  {
    title: "Những câu hỏi nên hỏi nhà tuyển dụng cuối buổi phỏng vấn",
    slug: "nhung-cau-hoi-nen-hoi-nha-tuyen-dung-cuoi-buoi-phong-van",
    category: "Hành trang nghề nghiệp",
    excerpt:
      "Danh sách câu hỏi giúp ứng viên hiểu rõ kỳ vọng, đội nhóm và cách đánh giá thành công.",
    content:
      "<h2>Hỏi về kỳ vọng</h2><p>Ứng viên nên hỏi ba tháng đầu cần đạt điều gì và tiêu chí đánh giá hiệu quả công việc.</p><h2>Hỏi về đội nhóm</h2><p>Tìm hiểu quy trình phối hợp, phong cách quản lý và các bên liên quan thường làm việc cùng.</p><h3>Hỏi về bước tiếp theo</h3><p>Câu hỏi về timeline tuyển dụng giúp bạn chủ động theo dõi mà không gây áp lực.</p>",
  },
  {
    title: "Phân biệt Gross và Net khi xem offer",
    slug: "phan-biet-gross-va-net-khi-xem-offer",
    category: "Chế độ lương thưởng",
    excerpt:
      "Cách hiểu lương Gross, Net và các khoản khấu trừ cơ bản để tránh nhầm lẫn khi nhận offer.",
    content:
      "<h2>Lương Gross là gì?</h2><p>Gross là tổng thu nhập trước khi trừ các khoản bảo hiểm bắt buộc và thuế thu nhập cá nhân nếu có.</p><h2>Lương Net là gì?</h2><p>Net là số tiền thực nhận sau các khoản khấu trừ. Khi so sánh offer, hãy hỏi rõ công ty đang nói theo Gross hay Net.</p><h3>Điểm cần kiểm tra</h3><p>Đọc kỹ phụ cấp, thưởng, thử việc và các khoản đóng bảo hiểm để tính đúng tổng đãi ngộ.</p>",
  },
  {
    title: "Cách xây dựng thương hiệu cá nhân trên LinkedIn",
    slug: "cach-xay-dung-thuong-hieu-ca-nhan-tren-linkedin",
    category: "Định hướng nghề nghiệp",
    excerpt:
      "Những bước đơn giản để hồ sơ LinkedIn thể hiện năng lực và giúp ứng viên tăng cơ hội được tiếp cận.",
    content:
      "<h2>Hoàn thiện hồ sơ nền tảng</h2><p>Ảnh đại diện, headline, phần giới thiệu và kinh nghiệm nên nhất quán với vị trí bạn đang nhắm tới.</p><h2>Chia sẻ có chọn lọc</h2><p>Đăng case study, bài học nghề nghiệp hoặc góc nhìn chuyên môn giúp nhà tuyển dụng hiểu cách bạn tư duy.</p><h3>Kết nối đúng người</h3><p>Ưu tiên kết nối với recruiter, chuyên gia trong ngành và cộng đồng liên quan tới hướng đi của bạn.</p>",
  },
];

async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu...");

  // ── Dọn dữ liệu cũ ──────────────────────────────────────────────────────────
  await prisma.$transaction([
    prisma.cvAnalysis.deleteMany(),
    prisma.chatMessage.deleteMany(),
    prisma.chatSession.deleteMany(),
    prisma.application.deleteMany(),
    prisma.savedJob.deleteMany(),
    prisma.coverLetter.deleteMany(),
    prisma.cv.deleteMany(),
    prisma.post.deleteMany(),
    prisma.job.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.revokedToken.deleteMany(),
    prisma.user.deleteMany(),
    prisma.company.deleteMany(),
  ]);
  console.log("🗑️  Đã xóa dữ liệu cũ");

  // ── 1. Tạo Companies ─────────────────────────────────────────────────────────
  const companies = [];
  for (const c of COMPANIES_DATA) {
    const company = await prisma.company.create({
      data: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        description: c.description,
        address: c.address,
        mapUrl: c.mapUrl,
        logoUrl: c.logoUrl,
        coverImageUrl: c.coverImageUrl,
        socialLinks: c.socialLinks,
        isVerified: c.isVerified,
        isActive: true,
      },
    });
    companies.push(company);
  }
  console.log(`✅ Đã tạo ${companies.length} công ty`);

  // ── 2. Tạo Admin ─────────────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: "admin@sra.dev",
      password: hash("Admin@123456"),
      role: "ADMIN",
      isVerified: true,
      isActive: true,
      profile: {
        create: {
          fullName: "Quản trị viên Hệ thống",
          phone: "0800000000",
          address: "Quận 1, TP. Hồ Chí Minh",
          bio: "Quản trị viên hệ thống SRA Job Portal. Chịu trách nhiệm vận hành và giám sát toàn bộ nền tảng tuyển dụng.",
          skills: [
            "System Administration",
            "Platform Management",
            "User Support",
            "Content Moderation",
          ],
        },
      },
    },
  });
  console.log("✅ Đã tạo Admin");

  // ── 3. Tạo Recruiters (1 per company) ────────────────────────────────────────
  const recruiters = [];
  for (let i = 0; i < RECRUITERS_DATA.length; i++) {
    const r = RECRUITERS_DATA[i];
    const company = companies[i];
    const user = await prisma.user.create({
      data: {
        email: r.email,
        password: hash("password123"),
        role: "RECRUITER",
        companyId: company.id,
        isVerified: true,
        isActive: true,
        profile: {
          create: {
            fullName: r.fullName,
            phone: r.phone,
            address: r.address,
            bio: r.bio,
            skills: r.skills,
          },
        },
      },
    });
    recruiters.push({ user, company });
  }
  console.log(`✅ Đã tạo ${recruiters.length} nhà tuyển dụng`);

  // ── 4. Tạo Candidates ─────────────────────────────────────────────────────────
  const candidates = [];
  for (const c of CANDIDATES_DATA) {
    const user = await prisma.user.create({
      data: {
        email: c.email,
        password: hash("password123"),
        role: "CANDIDATE",
        isVerified: true,
        isActive: true,
        profile: {
          create: {
            fullName: c.fullName,
            phone: c.phone,
            address: c.address,
            bio: c.bio,
            skills: c.skills,
          },
        },
      },
    });
    candidates.push(user);
  }
  console.log(`✅ Đã tạo ${candidates.length} ứng viên`);

  // ── 5. Tạo Jobs ───────────────────────────────────────────────────────────────
  const createdJobs = [];

  // Helper: xác định status + deadline dựa vào variant
  const resolveJobMeta = (variant) => {
    switch (variant) {
      case "published_future":
        return { status: "PUBLISHED", deadline: futureDeadline() };
      case "published_near":
        return { status: "PUBLISHED", deadline: nearDeadline() };
      case "published_past":
        return { status: "PUBLISHED", deadline: pastDeadline() };
      case "closed":
        return { status: "CLOSED", deadline: pastDeadline() };
      case "draft":
        return {
          status: "DRAFT",
          deadline: new Date(Date.now() + randInt(60, 120) * 86_400_000),
        };
      default:
        return { status: "PUBLISHED", deadline: futureDeadline() };
    }
  };

  for (const jt of JOBS_TEMPLATES) {
    const recruiterData = recruiters[jt.companyIndex];
    const { status, deadline } = resolveJobMeta(jt.statusVariant);

    const job = await prisma.job.create({
      data: {
        title: jt.title,
        companyId: recruiterData.company.id,
        postedById: recruiterData.user.id,
        location: jt.location,
        salary: jt.salary,
        type: jt.type,
        level: jt.level,
        tags: jt.tags,
        industry: jt.industry,
        description: jt.description,
        benefits: jt.benefits,
        requirements: jt.requirements,
        slots: jt.slots,
        deadline: deadline,
        status: status,
        isHot: jt.isHot,
      },
    });
    createdJobs.push(job);
  }
  console.log(`✅ Đã tạo ${createdJobs.length} việc làm`);

  const createdPosts = [];
  for (const [index, post] of POST_SEED_DATA.entries()) {
    const recruiterData = recruiters[index % recruiters.length];
    const createdPost = await prisma.post.create({
      data: {
        ...post,
        coverUrl: post.coverUrl || null,
        authorId: recruiterData.user.id,
        authorName: recruiterData.company.name,
        contentFormat: "HTML",
        isPublished: true,
        createdAt: randDate(90, 1),
      },
    });
    createdPosts.push(createdPost);
  }
  console.log(`✅ Đã tạo ${createdPosts.length} bài viết`);

  // Cập nhật totalJobs cho mỗi company
  for (const company of companies) {
    const count = createdJobs.filter((j) => j.companyId === company.id).length;
    await prisma.company.update({
      where: { id: company.id },
      data: { totalJobs: count },
    });
  }

  // ── 6. Tạo CVs ────────────────────────────────────────────────────────────────
  const candidateCvMap = {};
  for (const candidate of candidates) {
    const cv1 = await prisma.cv.create({
      data: {
        name: "CV Chính",
        fileUrl: `https://storage.sra.dev/cvs/${candidate.id}/main-cv.pdf`,
        isDefault: true,
        userId: candidate.id,
        fileSize: randInt(200_000, 800_000),
        fileType: "pdf",
      },
    });
    const cv2 = await prisma.cv.create({
      data: {
        name: "CV Tiếng Anh",
        fileUrl: `https://storage.sra.dev/cvs/${candidate.id}/english-cv.pdf`,
        isDefault: false,
        userId: candidate.id,
        fileSize: randInt(200_000, 800_000),
        fileType: "pdf",
      },
    });
    candidateCvMap[candidate.id] = [cv1, cv2];
  }
  console.log("✅ Đã tạo CVs cho ứng viên");

  // ── 7. Tạo Cover Letters ──────────────────────────────────────────────────────
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const cl1 = COVER_LETTERS[i % COVER_LETTERS.length];
    const cl2 = COVER_LETTERS[(i + 1) % COVER_LETTERS.length];
    const cl3 = COVER_LETTERS[(i + 2) % COVER_LETTERS.length];
    await prisma.coverLetter.createMany({
      data: [
        { title: cl1.title, content: cl1.content, userId: candidate.id },
        { title: cl2.title, content: cl2.content, userId: candidate.id },
        { title: cl3.title, content: cl3.content, userId: candidate.id },
      ],
    });
  }
  console.log("✅ Đã tạo thư xin việc");

  // ── 8. Tạo Applications ───────────────────────────────────────────────────────
  // Chỉ apply vào PUBLISHED và CLOSED jobs
  const applicableJobs = createdJobs.filter((j) => j.status !== "DRAFT");
  const APP_STATUSES = [
    "PENDING",
    "REVIEWING",
    "INTERVIEW",
    "ACCEPTED",
    "REJECTED",
  ];
  const usedPairs = new Set();
  let appCount = 0;

  for (const candidate of candidates) {
    // Mỗi candidate apply 4-8 jobs
    const numApps = randInt(4, 8);
    const shuffledJobs = [...applicableJobs].sort(() => Math.random() - 0.5);
    let applied = 0;

    for (const job of shuffledJobs) {
      if (applied >= numApps) break;
      const key = `${candidate.id}:${job.id}`;
      if (usedPairs.has(key)) continue;
      usedPairs.add(key);

      const status = pick(APP_STATUSES);
      const hasNote = [
        "REVIEWING",
        "INTERVIEW",
        "ACCEPTED",
        "REJECTED",
      ].includes(status);
      const cvList = candidateCvMap[candidate.id];
      const cv = pick(cvList);

      const appData = {
        userId: candidate.id,
        jobId: job.id,
        companyId: job.companyId,
        status,
        cvUrl: cv.fileUrl,
        cvId: cv.id,
        phone: "09" + String(randInt(10_000_000, 99_999_999)),
        coverLetter:
          "Kính gửi quý công ty, tôi xin ứng tuyển vào vị trí này với mong muốn đóng góp kiến thức và kinh nghiệm của mình. Tôi tin tưởng rằng bản thân có đủ năng lực để hoàn thành tốt các nhiệm vụ được giao và phát triển cùng công ty trong dài hạn.",
        note: hasNote ? pick(RECRUITER_NOTES) : null,
      };

      // Nếu status là INTERVIEW, thêm thông tin phỏng vấn
      if (status === "INTERVIEW") {
        const interviewDate = new Date(
          Date.now() + randInt(3, 14) * 86_400_000,
        );
        appData.interviewDate = interviewDate;
        appData.interviewFormat = pick(["online", "offline"]);
        appData.interviewTime = `${randInt(8, 17)}:${pick(["00", "30"])}`;
        if (appData.interviewFormat === "offline") {
          appData.interviewLocation = job.companyId
            ? "Văn phòng công ty"
            : "TBD";
        }
      }

      // Nếu ACCEPTED, thêm ngày bắt đầu
      if (status === "ACCEPTED") {
        appData.startDate = new Date(Date.now() + randInt(14, 30) * 86_400_000);
        appData.startTime = `${randInt(8, 9)}:00`;
      }

      await prisma.application.create({ data: appData });
      applied++;
      appCount++;
    }
  }

  // Cập nhật totalApplications cho mỗi company
  for (const company of companies) {
    const count = await prisma.application.count({
      where: { companyId: company.id },
    });
    await prisma.company.update({
      where: { id: company.id },
      data: { totalApplications: count },
    });
  }

  console.log(`✅ Đã tạo ${appCount} đơn ứng tuyển`);

  // ── 9. Tạo Saved Jobs ─────────────────────────────────────────────────────────
  const savedPairs = new Set();
  let savedCount = 0;
  for (const candidate of candidates) {
    const numSaved = randInt(5, 10);
    const shuffled = [...createdJobs].sort(() => Math.random() - 0.5);
    let saved = 0;
    for (const job of shuffled) {
      if (saved >= numSaved) break;
      const key = `${candidate.id}:${job.id}`;
      if (savedPairs.has(key)) continue;
      savedPairs.add(key);
      await prisma.savedJob.create({
        data: { userId: candidate.id, jobId: job.id },
      });
      saved++;
      savedCount++;
    }
  }
  console.log(`✅ Đã tạo ${savedCount} việc làm đã lưu`);

  // ── 10. Tạo Chat Sessions ─────────────────────────────────────────────────────
  for (const candidate of candidates.slice(0, 8)) {
    await prisma.chatSession.create({
      data: {
        title: "Tư vấn nghề nghiệp và phân tích CV",
        userId: candidate.id,
        messages: {
          create: [
            {
              role: "USER",
              content:
                "Bạn có thể giúp tôi phân tích CV và tư vấn hướng phát triển nghề nghiệp không?",
              messageType: "TEXT",
            },
            {
              role: "ASSISTANT",
              content:
                "Chào bạn! Tôi rất vui được hỗ trợ. Hãy chia sẻ CV của bạn hoặc mô tả kinh nghiệm và mục tiêu nghề nghiệp, tôi sẽ đưa ra nhận xét và gợi ý phù hợp.",
              messageType: "TEXT",
            },
          ],
        },
      },
    });
  }
  console.log("✅ Đã tạo chat sessions");

  // ── 11. Tạo Permissions ───────────────────────────────────────────────────────
  const PERMISSIONS_DATA = [
    // Job permissions
    {
      name: "job:create",
      group: { value: "job", label: "Quản lý công việc" },
      description:
        "Cho phép tạo tin tuyển dụng mới. Recruiter cần có quyền này để đăng việc làm lên hệ thống và tiếp cận ứng viên phù hợp với vị trí đang tuyển dụng của công ty.",
    },
    {
      name: "job:read:company",
      group: { value: "job", label: "Quản lý công việc" },
      description:
        "Cho phép xem toàn bộ tin tuyển dụng của công ty, bao gồm cả tin do recruiter khác đăng. Thường dành cho quản lý hoặc trưởng nhóm tuyển dụng cần nắm bắt tổng thể hoạt động.",
    },
    {
      name: "job:update:own",
      group: { value: "job", label: "Quản lý công việc" },
      description:
        "Cho phép chỉnh sửa tin tuyển dụng do chính recruiter đó đăng tải. Quyền này đảm bảo mỗi recruiter chỉ có thể cập nhật nội dung mà họ chịu trách nhiệm quản lý.",
    },
    {
      name: "job:update:company",
      group: { value: "job", label: "Quản lý công việc" },
      description:
        "Cho phép chỉnh sửa tin tuyển dụng của bất kỳ recruiter nào trong cùng công ty. Quyền này phù hợp cho trưởng nhóm tuyển dụng cần can thiệp hoặc hỗ trợ đồng nghiệp.",
    },
    {
      name: "job:delete:own",
      group: { value: "job", label: "Quản lý công việc" },
      description:
        "Cho phép xóa tin tuyển dụng do chính recruiter đó tạo ra. Việc xóa sẽ ảnh hưởng đến các đơn ứng tuyển liên quan, cần thận trọng khi sử dụng quyền này.",
    },
    // Post permissions
    {
      name: "post:read:own",
      group: { value: "post", label: "Quản lý bài viết" },
      description:
        "Cho phép recruiter xem danh sách bài viết do chính mình tạo, bao gồm bài viết công khai và bản nháp.",
    },
    {
      name: "post:create",
      group: { value: "post", label: "Quản lý bài viết" },
      description:
        "Cho phép recruiter tạo bài viết blog tuyển dụng mới bằng rich text editor và xuất bản nội dung cho ứng viên.",
    },
    {
      name: "post:update:own",
      group: { value: "post", label: "Quản lý bài viết" },
      description:
        "Cho phép recruiter chỉnh sửa bài viết do chính mình tạo, bao gồm tiêu đề, danh mục, ảnh bìa, trạng thái và nội dung.",
    },
    {
      name: "post:delete:own",
      group: { value: "post", label: "Quản lý bài viết" },
      description:
        "Cho phép recruiter xóa bài viết do chính mình tạo. Quyền này cần được cấp thận trọng vì thao tác xóa ảnh hưởng trực tiếp tới nội dung đã xuất bản.",
    },
    {
      name: "post:read:all",
      group: { value: "post", label: "Quản lý bài viết" },
      description:
        "Cho phép xem toàn bộ bài viết trong hệ thống, bao gồm bài công khai, bản nháp và bài viết của mọi recruiter.",
    },
    {
      name: "post:update:any",
      group: { value: "post", label: "Quản lý bài viết" },
      description:
        "Cho phép chỉnh sửa hoặc thay đổi trạng thái xuất bản của bất kỳ bài viết nào trong hệ thống.",
    },
    {
      name: "post:delete:any",
      group: { value: "post", label: "Quản lý bài viết" },
      description:
        "Cho phép xóa bất kỳ bài viết nào trong hệ thống. Quyền này chỉ nên dùng cho tài khoản quản trị nội dung.",
    },
    // Application permissions
    {
      name: "application:read:company",
      group: { value: "application", label: "Quản lý đơn ứng tuyển" },
      description:
        "Cho phép xem toàn bộ đơn ứng tuyển thuộc công ty, kể cả đơn gửi cho tin của recruiter khác. Phù hợp cho nhà quản lý cần có cái nhìn toàn diện về pipeline tuyển dụng.",
    },
    {
      name: "application:update:status",
      group: { value: "application", label: "Quản lý đơn ứng tuyển" },
      description:
        "Cho phép thay đổi trạng thái đơn ứng tuyển như chuyển sang Đang xem xét, Phỏng vấn, Đã nhận hoặc Từ chối. Đây là quyền cốt lõi trong quy trình xét duyệt hồ sơ ứng viên.",
    },
    // Company permissions
    {
      name: "company:manage",
      group: { value: "company", label: "Quản lý công ty" },
      description:
        "Cho phép chỉnh sửa thông tin công ty như mô tả, logo, địa chỉ và các liên kết mạng xã hội. Quyền này nên được cấp cho người phụ trách thương hiệu nhà tuyển dụng.",
    },
    // Candidate — Application permissions
    {
      name: "application:create",
      group: { value: "application", label: "Quản lý đơn ứng tuyển" },
      description:
        "Cho phép ứng viên nộp đơn ứng tuyển vào vị trí tuyển dụng. Đây là quyền cơ bản nhất của ứng viên trên hệ thống.",
    },
    {
      name: "application:read:own",
      group: { value: "application", label: "Quản lý đơn ứng tuyển" },
      description:
        "Cho phép ứng viên xem lịch sử toàn bộ đơn ứng tuyển của chính mình, bao gồm trạng thái, ghi chú HR và lịch phỏng vấn nếu có.",
    },
    {
      name: "application:delete:own",
      group: { value: "application", label: "Quản lý đơn ứng tuyển" },
      description:
        "Cho phép ứng viên rút lại đơn ứng tuyển đã nộp. Chỉ áp dụng với đơn còn đang ở trạng thái chờ xét duyệt hoặc đang xem xét.",
    },
    // Candidate — Job permissions
    {
      name: "job:save",
      group: { value: "job", label: "Quản lý công việc" },
      description:
        "Cho phép ứng viên lưu tin tuyển dụng yêu thích để xem lại sau. Danh sách việc làm đã lưu được quản lý riêng trong tài khoản của ứng viên.",
    },
    // Candidate — Profile permissions
    {
      name: "profile:manage",
      group: { value: "profile", label: "Hồ sơ cá nhân" },
      description:
        "Cho phép ứng viên chỉnh sửa hồ sơ cá nhân bao gồm ảnh đại diện, thông tin liên hệ, học vấn, kinh nghiệm làm việc và kỹ năng.",
    },
  ];

  const createdPermissions = {};
  for (const perm of PERMISSIONS_DATA) {
    const created = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
    createdPermissions[perm.name] = created.id;
  }
  console.log(`✅ Đã tạo ${PERMISSIONS_DATA.length} permissions`);

  // Gán quyền mặc định cho Role RECRUITER
  const RECRUITER_DEFAULT_PERMISSIONS = [
    "job:create",
    "job:update:own",
    "job:delete:own",
    "post:read:own",
    "post:create",
    "post:update:own",
    "post:delete:own",
    "application:read:company",
    "application:update:status",
  ];

  for (const permName of RECRUITER_DEFAULT_PERMISSIONS) {
    await prisma.rolePermission.upsert({
      where: {
        role_permissionId: {
          role: "RECRUITER",
          permissionId: createdPermissions[permName],
        },
      },
      update: {},
      create: {
        role: "RECRUITER",
        permissionId: createdPermissions[permName],
      },
    });
  }
  console.log(
    `✅ Đã gán ${RECRUITER_DEFAULT_PERMISSIONS.length} quyền mặc định cho RECRUITER`,
  );

  // Gán quyền mặc định cho Role CANDIDATE
  const CANDIDATE_DEFAULT_PERMISSIONS = [
    "application:create", // nộp đơn
    "application:read:own", // xem lịch sử đơn của mình
    "application:delete:own", // rút đơn
    "job:save", // lưu việc làm yêu thích
    "profile:manage", // quản lý hồ sơ cá nhân
  ];

  for (const permName of CANDIDATE_DEFAULT_PERMISSIONS) {
    await prisma.rolePermission.upsert({
      where: {
        role_permissionId: {
          role: "CANDIDATE",
          permissionId: createdPermissions[permName],
        },
      },
      update: {},
      create: {
        role: "CANDIDATE",
        permissionId: createdPermissions[permName],
      },
    });
  }
  console.log(
    `✅ Đã gán ${CANDIDATE_DEFAULT_PERMISSIONS.length} quyền mặc định cho CANDIDATE`,
  );

  // ── UserPermission overrides theo từng recruiter ───────────────────────────────
  // grant  = cấp thêm quyền ngoài default của role
  // revoke = thu hồi quyền default của role (isGranted: false)
  const USER_PERMISSION_OVERRIDES = [
    // ── FPT Software ─────────────────────────────────────────────────────────────
    // Nguyễn Thị Thu Hà — Senior HR Manager: toàn quyền, phụ trách cả công ty
    {
      email: "hr.fpt@fpt-software.com",
      grant: [
        "job:read:company",
        "job:update:company",
        "application:read:company",
        "company:manage",
      ],
      revoke: [],
    },

    // ── Vietcombank ───────────────────────────────────────────────────────────────
    // Trần Văn Minh Đức — HR Lead cấp cao: toàn quyền
    {
      email: "hr.vcb@vietcombank.com.vn",
      grant: [
        "job:read:company",
        "job:update:company",
        "application:read:company",
        "company:manage",
      ],
      revoke: [],
    },

    // ── Shopee ────────────────────────────────────────────────────────────────────
    // Lê Thị Phương Linh — Lead Recruiter: quản lý tuyển dụng toàn công ty, không quản lý profile
    {
      email: "careers.shopee@shopee.com",
      grant: [
        "job:read:company",
        "job:update:company",
        "application:read:company",
      ],
      revoke: [],
    },

    // ── Techcombank ───────────────────────────────────────────────────────────────
    // Phạm Hồng Sơn — HR Manager: phụ trách brand & profile công ty
    {
      email: "recruit.tcb@techcombank.com.vn",
      grant: ["company:manage"],
      revoke: [],
    },

    // ── Vingroup ──────────────────────────────────────────────────────────────────
    // Hoàng Thị Lan — HR Manager: xem toàn bộ đơn ứng tuyển + quản lý profile công ty
    {
      email: "careers.vin@vingroup.net",
      grant: ["application:read:company", "company:manage"],
      revoke: [],
    },

    // ── Masan ─────────────────────────────────────────────────────────────────────
    // Vũ Thị Thanh Tâm — Senior Recruiter: hỗ trợ sửa job của đồng nghiệp khi cần
    {
      email: "hr.masan@masan.com.vn",
      grant: ["job:update:company"],
      revoke: [],
    },

    // ── KPMG ──────────────────────────────────────────────────────────────────────
    // Nguyễn Minh Quân — HR Manager: xem job & app toàn công ty + quản lý profile
    {
      email: "vn.recruit@kpmg.com.vn",
      grant: ["job:read:company", "application:read:company", "company:manage"],
      revoke: [],
    },

    // ── Grab ──────────────────────────────────────────────────────────────────────
    // Bùi Thị Thùy Tiên — Talent Lead: quản lý pipeline tuyển dụng toàn team
    {
      email: "talent.grab@grab.com",
      grant: [
        "job:read:company",
        "job:update:company",
        "application:read:company",
      ],
      revoke: [],
    },

    // ── VNG ───────────────────────────────────────────────────────────────────────
    // Trần Thị Hải Yến — HR Lead: toàn quyền, phụ trách mảng tuyển dụng lớn
    {
      email: "hr.vng@vng.com.vn",
      grant: [
        "job:read:company",
        "job:update:company",
        "application:read:company",
        "company:manage",
      ],
      revoke: [],
    },

    // ── MoMo ──────────────────────────────────────────────────────────────────────
    // Phan Quốc Hưng — Recruiter: xem job & app của cả team để phối hợp
    {
      email: "careers.momo@momo.vn",
      grant: ["job:read:company", "application:read:company"],
      revoke: [],
    },

    // ── Tiki ──────────────────────────────────────────────────────────────────────
    // Lý Thị Kim Ngân — Recruiter: xem toàn bộ đơn ứng tuyển để báo cáo
    {
      email: "talent.tiki@tiki.vn",
      grant: ["application:read:company"],
      revoke: [],
    },

    // ── Lazada ────────────────────────────────────────────────────────────────────
    // Đinh Văn Thắng — Recruiter bị hạn chế: thu hồi quyền xóa job sau sự cố xóa nhầm
    {
      email: "hr.lazada@lazada.vn",
      grant: [],
      revoke: ["job:delete:own"],
    },

    // ── Deloitte ──────────────────────────────────────────────────────────────────
    // Ngô Thị Bích Phượng — HR Consultant: xem đơn ứng tuyển để tư vấn nội bộ
    {
      email: "vn.recruit@deloitte.com",
      grant: ["application:read:company"],
      revoke: [],
    },

    // ── Be Group ──────────────────────────────────────────────────────────────────
    // Cao Minh Tuấn — HR: phụ trách thương hiệu tuyển dụng
    {
      email: "careers.be@be.com.vn",
      grant: ["company:manage"],
      revoke: [],
    },

    // ── Agribank ──────────────────────────────────────────────────────────────────
    // Dương Thị Mai Hương — Junior Recruiter (đang thử việc):
    // Thu hồi job:create (cần phê duyệt cấp trên trước khi đăng) và job:delete:own (chưa được phép xóa)
    {
      email: "tuyendung.agribank@agribank.com.vn",
      grant: [],
      revoke: ["job:create", "job:delete:own"],
    },

    // ── Unilever ──────────────────────────────────────────────────────────────────
    // Hoàng Thị Diệu Linh — HR Lead: toàn quyền quản lý tuyển dụng
    {
      email: "careers.vn@unilever.com",
      grant: [
        "job:read:company",
        "job:update:company",
        "application:read:company",
        "company:manage",
      ],
      revoke: [],
    },

    // ── Thế Giới Di Động ──────────────────────────────────────────────────────────
    // Phùng Văn Đại — Recruiter mới: chưa được phép xóa job
    {
      email: "tuyendung.tgdd@thegioididong.com",
      grant: [],
      revoke: ["job:delete:own"],
    },

    // ── PwC ───────────────────────────────────────────────────────────────────────
    // Từ Thị Mỹ Linh — HR Manager: xem toàn bộ app + quản lý profile
    {
      email: "vn.careers@pwc.com",
      grant: ["application:read:company", "company:manage"],
      revoke: [],
    },

    // ── Hòa Phát ──────────────────────────────────────────────────────────────────
    // Lê Bá Hoàng — Recruiter: xem job toàn công ty để nắm tổng thể
    {
      email: "nhansu.hp@hoaphatteel.com",
      grant: ["job:read:company"],
      revoke: [],
    },

    // ── Sacombank ─────────────────────────────────────────────────────────────────
    // Võ Thị Thanh Thảo — HR: xem job toàn công ty + quản lý profile
    {
      email: "tuyendung.scb@sacombank.com",
      grant: ["job:read:company", "company:manage"],
      revoke: [],
    },
  ];

  let totalUserPermCount = 0;
  for (const override of USER_PERMISSION_OVERRIDES) {
    const user = await prisma.user.findUnique({
      where: { email: override.email },
      select: { id: true },
    });
    if (!user) continue;

    for (const permName of override.grant) {
      const permId = createdPermissions[permName];
      if (!permId) continue;
      await prisma.userPermission.upsert({
        where: {
          userId_permissionId: { userId: user.id, permissionId: permId },
        },
        update: { isGranted: true },
        create: { userId: user.id, permissionId: permId, isGranted: true },
      });
      totalUserPermCount++;
    }

    for (const permName of override.revoke) {
      const permId = createdPermissions[permName];
      if (!permId) continue;
      await prisma.userPermission.upsert({
        where: {
          userId_permissionId: { userId: user.id, permissionId: permId },
        },
        update: { isGranted: false },
        create: { userId: user.id, permissionId: permId, isGranted: false },
      });
      totalUserPermCount++;
    }
  }
  console.log(
    `✅ Đã tạo ${totalUserPermCount} user permission overrides cho ${USER_PERMISSION_OVERRIDES.length} recruiters`,
  );

  // ── Tổng kết ──────────────────────────────────────────────────────────────────
  console.log("\n🎉 Seed hoàn tất!");
  console.log("─".repeat(55));
  console.log("📊 Tóm tắt dữ liệu:");
  console.log(`   🏢 Công ty         : ${companies.length}`);
  console.log(`   👔 Nhà tuyển dụng  : ${recruiters.length}`);
  console.log(`   👤 Ứng viên        : ${candidates.length}`);
  console.log(`   💼 Việc làm        : ${createdJobs.length}`);
  console.log(`   📝 Bài viết        : ${createdPosts.length}`);
  console.log(`   📝 Đơn ứng tuyển   : ${appCount}`);
  console.log(`   🔖 Việc làm đã lưu : ${savedCount}`);
  console.log(
    `   🔐 Permissions     : ${PERMISSIONS_DATA.length} (${RECRUITER_DEFAULT_PERMISSIONS.length} recruiter / ${CANDIDATE_DEFAULT_PERMISSIONS.length} candidate defaults)`,
  );
  console.log(`   🛡️  User Perm overrides: ${totalUserPermCount}`);
  console.log("─".repeat(55));
  console.log("🔑 Tài khoản mặc định:");
  console.log("   Admin   : admin@sra.dev / Admin@123456");
  console.log("   Recruiters & Candidates: password123");
  console.log("─".repeat(55));

  // In danh sách recruiter để tiện tra cứu
  console.log("\n👔 Danh sách Nhà tuyển dụng:");
  recruiters.forEach(({ user, company }, idx) => {
    console.log(`   [${idx}] ${user.email} → ${company.name}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed thất bại:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
