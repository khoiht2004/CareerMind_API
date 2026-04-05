const profileModel = require("@/models/profile.model");
const jobModel = require("@/models/job.model");

async function _getMatchingJobs(userId) {
  const profile = await profileModel.getProfile(userId);
  const skills = _parseSkills(profile?.skills);

  const keywords = [
    ...skills,
    ...(profile?.bio
      ? profile.bio
          .split(/[\s,\.]+/)
          .filter((w) => w.length > 3)
          .slice(0, 5)
      : []),
  ];

  return jobModel.getJobsForUser(keywords, 10);
}

function _parseSkills(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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
    .map((job, i) => {
      const typeLabel = JOB_TYPE_LABELS[job.type];
      return `${i + 1}. ${job.title} - ${job.company} | ${job.location} | ${job.salary || "Thỏa thuận"} | ${typeLabel}`;
    })
    .join("\n");
}

module.exports = {
  _getMatchingJobs,
  _parseSkills,
  _formatJobs,
};
