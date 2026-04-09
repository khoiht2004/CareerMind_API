const db = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  url: process.env.DATABASE_URL,

  // Backup DB
  backupLocalDir: process.env.DB_BACKUP_LOCAL_DIR,
  backupRemote: process.env.DB_BACKUP_REMOTE,
  backupRemoteDir: process.env.DB_BACKUP_REMOTE_DIR,
};

module.exports = db;
