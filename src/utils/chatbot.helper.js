const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const XLSX = require("xlsx");
const { Buffer } = require("node:buffer");

const jobModel = require("@/models/job.model");

async function _getMatchingJobs(profile, limit = 20) {
  if (!profile) return jobModel.getJobsForUser([], limit);

  const keywords = [
    ...(profile?.skills || []),
    ...(profile?.bio
      ? profile.bio
        .split(/[\s,\.]+/)
        .filter((w) => w.length > 3)
        .slice(0, 5)
      : []),
  ];

  return jobModel.getJobsForUser(keywords, limit);
}

function _formatJobs(jobs) {
  if (!jobs?.length) return "Hiện chưa có job phù hợp.";

  const JOB_TYPE_LABELS = {
    FULL_TIME: "Toàn thời gian",
    PART_TIME: "Bán thời gian",
    REMOTE: "Remote",
    INTERNSHIP: "Thực tập",
    CONTRACT: "Hợp đồng",
  };

  return jobs
    .map((job) => {
      const typeLabel = JOB_TYPE_LABELS[job.type] || job.type;
      return `[ID:${job.id}] ${job.title}
      - Công ty: ${job.company?.name || "Ẩn danh"}
      - Địa điểm: ${job.location}
      - Mức lương: ${job.salary || "Thỏa thuận"}
      - Loại hình công việc: ${typeLabel}`;
    })
    .join("\n");
}


const MAX_FILE_TEXT_CHARS = 8000;

async function extractFileText(file) {
  try {
    const buffer = Buffer.from(file.data, "base64");
    let text = "";

    if (file.mediaType === "application/pdf") {
      const result = await pdfParse(buffer);
      text = result.text?.trim() || "";
    } else if (
      file.mediaType === "application/msword" ||
      file.mediaType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value?.trim() || "";
    } else if (
      file.mediaType === "application/vnd.ms-excel" ||
      file.mediaType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      text = workbook.SheetNames.map((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        return `[Sheet: ${sheetName}]\n${XLSX.utils.sheet_to_csv(sheet)}`;
      })
        .join("\n\n")
        .trim();
    }

    if (text.length > MAX_FILE_TEXT_CHARS) {
      text = text.slice(0, MAX_FILE_TEXT_CHARS) + "\n...[nội dung bị cắt bớt]";
    }
    return text;
  } catch (err) {
    console.error(`[chatbot] extractFileText failed for "${file.name}":`, err.message);
    return "";
  }
}

module.exports = {
  _getMatchingJobs,
  _formatJobs,
  extractFileText
};
