const mailService = require("@/services/mail.service");

async function sendInterviewEmail(payload) {
  await mailService.sendInterviewEmail(payload);
}

module.exports = sendInterviewEmail;
