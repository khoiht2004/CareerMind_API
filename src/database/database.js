const mysql = require("mysql2/promise");
const { databaseConfig } = require("@/config");
const fs = require("fs");

const db = mysql.createPool({
  host: databaseConfig.host,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
  port: databaseConfig.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: fs.readFileSync(__dirname + "/isrgrootx1.pem"),
    rejectUnauthorized: true,
  },
});

module.exports = db;
