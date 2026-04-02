const mailService = require("@/services/mail.service");

async function sendRejectedEmail(payload) {
  await mailService.sendRejectedEmail(payload);
}

module.exports = sendRejectedEmail;
