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
    "http://localhost:5175",
    "https://careedmind.io.vn",
    "https://www.careedmind.io.vn",
    "https://admin.careedmind.io.vn",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
};

app.get("/pong-render", (req, res) => {
  return res.send("pong");
});

app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(express.static("public"));

// Middlewares
app.use(responseFormat);

app.use("/api", apiRateLimiter);
app.use("/sra", router);

// 404 và Error handlers
app.use(handleMulterError);
app.use(notFoundHandler);
app.use(exceptionHandler);

const http = require("http");
const { initSocket } = require("@/libs/socket");

const port = process.env.PORT || 3000;
const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
