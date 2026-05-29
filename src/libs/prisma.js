const { PrismaClient } = require("../../generated/prisma");
const { databaseConfig } = require("@/config");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { uuidv7 } = require("uuidv7");

const adapter = new PrismaMariaDb({
  host: databaseConfig.host,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
  port: databaseConfig.port,
});

const basePrisma = new PrismaClient({ adapter });

// Tạo extension tự động điền UUID v7 cho các model có ID dạng String (không phải Queue)
const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async create({ model, operation, args, query }) {
        if (model !== "Queue") {
          if (!args.data) args.data = {};
          if (!args.data.id) {
            args.data.id = uuidv7();
          }
        }
        return query(args);
      },
      async createMany({ model, operation, args, query }) {
        if (model !== "Queue") {
          if (Array.isArray(args.data)) {
            for (const item of args.data) {
              if (item && !item.id) {
                item.id = uuidv7();
              }
            }
          } else if (args.data && !args.data.id) {
            args.data.id = uuidv7();
          }
        }
        return query(args);
      },
    },
  },
});

module.exports = prisma;
