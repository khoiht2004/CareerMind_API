require("dotenv").config();
require("module-alias/register");

const { CronJob } = require("cron");
const backupDB = require("@/schedules/backupDB");
const cleanupExpiredTokens = require("@/schedules/cleanupExpiredTokens");
const cleanupQueueTasks = require("@/schedules/cleanupQueueTasks");

// Backup database at 3:00 AM every day
new CronJob("0 3 * * *", backupDB).start();

// Cleanup expired tokens at 1:00 AM every day
new CronJob("0 1 * * *", cleanupExpiredTokens).start();

// Cleanup queue tasks at 1:30 AM every day
new CronJob("30 1 * * *", cleanupQueueTasks).start();
