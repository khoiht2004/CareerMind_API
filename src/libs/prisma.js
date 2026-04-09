const { PrismaClient } = require("../../generated/prisma");
const { databaseConfig } = require("@/config");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const adapter = new PrismaMariaDb({
  host: databaseConfig.host,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
  port: databaseConfig.port,
});
const prisma = new PrismaClient({ adapter });

// const { PrismaTiDBCloud } = require("@tidbcloud/prisma-adapter");
// const connectionString = databaseConfig.url;
// const adapter = new PrismaTiDBCloud({ url: connectionString });
// const prisma = new PrismaClient({ adapter });

module.exports = prisma;
