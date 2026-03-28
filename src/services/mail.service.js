const { transporter } = require("@/libs/nodemailer");
const mailConfig = require("@/config/mail.config");
const ejs = require("ejs");
const path = require("path");
const { formatTime } = require("@/utils/helper");

class MailService {
  getTemplatePath(template) {
    return path.resolve(__dirname, "../templates/mail", `${template.replace(".ejs", "")}.ejs`);
  }

  async send(options) {
    const { template, templateData, ...restOptions } = options;
    const templatePath = this.getTemplatePath(template);
    const html = await ejs.renderFile(templatePath, templateData);
    return transporter.sendMail({ ...restOptions, html });
  }

  async sendVerificationEmail({ email, code }) {
    const { fromAddress } = mailConfig;
    return transporter.sendMail({
      from: `Smart Recruit Assistant <${fromAddress}>`,
      to: email,
      subject: "Mã xác thực email của bạn",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb">
          <div style="text-align:center;margin-bottom:24px">
            <div style="display:inline-block;background:#111;color:#fff;font-weight:700;padding:8px 16px;border-radius:8px;font-size:14px">SRA</div>
          </div>
          <h2 style="font-size:20px;font-weight:700;margin:0 0 8px">Xác thực địa chỉ email</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 24px">Nhập mã bên dưới để xác thực tài khoản Smart Recruit Assistant của bạn.</p>
          <div style="text-align:center;background:#f9fafb;border-radius:10px;padding:24px;margin:0 0 24px">
            <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#111">${code}</span>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:0">Mã có hiệu lực trong <strong>10 phút</strong>. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
        </div>
      `,
    });
  }

  async sendPasswordChangeEmail({ email }) {
    const { fromAddress } = mailConfig;
    const changedAt = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    return transporter.sendMail({
      from: `Smart Recruit Assistant <${fromAddress}>`,
      to: email,
      subject: "Mật khẩu của bạn đã được thay đổi",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb">
          <h2 style="font-size:20px;font-weight:700;margin:0 0 8px">Mật khẩu đã thay đổi</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 16px">Mật khẩu tài khoản của bạn đã được thay đổi lúc <strong>${changedAt}</strong>.</p>
          <p style="color:#6b7280;font-size:13px;margin:0">Nếu bạn không thực hiện thao tác này, vui lòng liên hệ hỗ trợ ngay.</p>
        </div>
      `,
    });
  }

  async sendBackupDatabaseEmail({ email }) {
    const { fromAddress } = mailConfig;
    const backupTime = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    return transporter.sendMail({
      from: `Smart Recruit Assistant <${fromAddress}>`,
      to: email,
      subject: "Sao lưu cơ sở dữ liệu thành công",
      html: `<p>Sao lưu hoàn tất lúc <strong>${backupTime}</strong>.</p>`,
    });
  }
}

module.exports = new MailService();
