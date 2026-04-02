const mailService = require("@/services/mail.service");

async function sendAcceptedEmail(payload) {
  await mailService.sendAcceptedEmail(payload);
}

module.exports = sendAcceptedEmail;
