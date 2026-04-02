const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = "";
  if (hours > 0) {
    result += `${hours} giờ `;
  }
  if (minutes > 0) {
    result += `${minutes} phút`;
  }

  return result.trim() || "0 phút";
};

const getDateStringYmdHis = () => {
  const now = new Date();
  const pad = (num) => String(num).padStart(2, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};

const toJsonString = (val) => {
  if (!val) return "[]";
  if (Array.isArray(val)) return JSON.stringify(val);
  try {
    JSON.parse(val);
    return val;
  } catch {
    return "[]";
  }
};

const formatVN = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

module.exports = {
  formatTime,
  getDateStringYmdHis,
  toJsonString,
  formatVN,
};
