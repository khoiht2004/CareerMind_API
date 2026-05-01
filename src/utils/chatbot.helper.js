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

module.exports = {
  _getMatchingJobs,
  _formatJobs,
};
