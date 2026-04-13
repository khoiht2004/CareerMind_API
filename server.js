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
  handleMulterError,
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
    "https://sra-fe-demo.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
};

app.get("/pong-render", (req, res) => {
  return res.send("pong");
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

// Middlewares
app.use(responseFormat);

app.use("/api", apiRateLimiter);
app.use("/sra", router);

// 404 và Error handlers
app.use(handleMulterError);
app.use(notFoundHandler);
app.use(exceptionHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
