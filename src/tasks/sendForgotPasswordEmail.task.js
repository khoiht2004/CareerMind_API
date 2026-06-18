const mailService = require("@/services/mail.service");

async function sendForgotPasswordEmail(payload) {
  await mailService.sendForgotPasswordEmail(payload);
}

module.exports = sendForgotPasswordEmail;
