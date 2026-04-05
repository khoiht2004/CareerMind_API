require("module-alias/register");
require("dotenv").config();

require("./queue");
require("./schedule");

const cors = require("cors");
const express = require("express");
const {
  notFoundHandler,
  exceptionHandler,
  responseFormat,
} = require("@/middlewares");
const { apiRateLimiter } = require("@/middlewares/rateLimiter");
const router = require("@/routes");

const app = express();

// Cấu hình CORS
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://khoiht2004.github.io",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
};

app.use(cors());
app.use(express.json());

app.get("/pong-render", (req, res) => {
  return res.send("pong");
});

// Middlewares
app.use(responseFormat);

// app.use("/api", apiRateLimiter);
app.use("/sra", router);

// 404 và Error handlers cuối cùng
app.use(notFoundHandler);
app.use(exceptionHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
