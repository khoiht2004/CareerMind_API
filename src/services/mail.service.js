const { transporter } = require("@/libs/nodemailer");
const mailConfig = require("@/config/mail.config");
const { formatVN } = require("@/utils/helper");
const ejs = require("ejs");
const path = require("path");

class MailService {
  getTemplatePath(template) {
    return path.resolve(
      __dirname,
      "../templates/mail",
      `${template.replace(".ejs", "")}.ejs`,
    );
  }

  async send(options) {
    const { template, templateData, ...restOptions } = options;
    const templatePath = this.getTemplatePath(template);
    const html = await ejs.renderFile(templatePath, templateData);
    return transporter.sendMail({ ...restOptions, html });
  }

  async sendVerificationEmail({ email, code }) {
    const { fromAddress } = mailConfig;
    return this.send({
      template: "auth/verificationEmail",
      templateData: { code },
      from: `Smart Recruit Assistant <${fromAddress}>`,
      to: email,
      subject: "Mã xác thực email của bạn",
    });
  }

  async sendPasswordChangeEmail({ email }) {
    const { fromAddress } = mailConfig;
    const changedAt = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    return this.send({
      template: "auth/changePasswordEmail",
      templateData: { changedAt },
      from: `Smart Recruit Assistant <${fromAddress}>`,
      to: email,
      subject: "Mật khẩu của bạn đã được thay đổi",
    });
  }

  async sendBackupDatabaseEmail({ email }) {
    const { fromAddress } = mailConfig;
    const backupTime = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    return this.send({
      template: "toast/backupDatabaseEmail",
      templateData: { backupTime },
      from: `Smart Recruit Assistant <${fromAddress}>`,
      to: email,
      subject: "Sao lưu cơ sở dữ liệu thành công",
    });
  }

  async sendApplyEmail({ email, applicantName, jobTitle, company }) {
    const { fromAddress } = mailConfig;
    return this.send({
      template: "job/applyEmail",
      templateData: { applicantName, jobTitle, company },
      from: `Smart Recruit Assistant <${fromAddress}>`,
      to: email,
      subject: `Ứng tuyển vị trí ${jobTitle} thành công`,
    });
  }

  async sendInterviewEmail({
    email,
    applicantName,
    jobTitle,
    company,
    interviewDate,
    interviewTime,
    interviewFormat,
    interviewLocation,
    confirmDeadline,
  }) {
    const { fromAddress } = mailConfig;
    const interviewDateFormat = formatVN(interviewDate);
    const confirmDeadlineFormat = formatVN(confirmDeadline);
    const formatInterview =
      interviewFormat === "DIRECT" ? "Trực tiếp " : "Online";
    return this.send({
      template: "job/interviewEmail",
      templateData: {
        applicantName,
        jobTitle,
        company,
        interviewDateFormat,
        interviewTime,
        formatInterview,
        interviewLocation,
        confirmDeadlineFormat,
      },
      from: `Smart Recruit Assistant <${fromAddress}>`,
      to: email,
      subject: `Lịch phỏng vấn vị trí ${jobTitle}`,
    });
  }

  async sendAcceptedEmail({
    email,
    applicantName,
    jobTitle,
    company,
    startDate,
    startTime,
    officeAddress,
  }) {
    const { fromAddress } = mailConfig;
    const startDateFormat = formatVN(startDate);
    return this.send({
      template: "job/acceptedEmail",
      templateData: {
        applicantName,
        jobTitle,
        company,
        startDateFormat,
        startTime,
        officeAddress,
      },
      from: `Smart Recruit Assistant <${fromAddress}>`,
      to: email,
      subject: `Kết quả ứng tuyển vị trí ${jobTitle} tại ${company}`,
    });
  }

  async sendRejectedEmail({ email, applicantName, jobTitle, company }) {
    const { fromAddress } = mailConfig;
    return this.send({
      template: "job/rejectedEmail",
      templateData: {
        applicantName,
        jobTitle,
        company,
      },
      from: `Smart Recruit Assistant <${fromAddress}>`,
      to: email,
      subject: `Kết quả ứng tuyển vị trí ${jobTitle} tại ${company}`,
    });
  }
}

module.exports = new MailService();
