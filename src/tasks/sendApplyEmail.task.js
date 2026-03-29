const mailService = require("@/services/mail.service");

async function sendApplyEmail(payload) {
  await mailService.sendApplyEmail(payload);
}

module.exports = sendApplyEmail;
