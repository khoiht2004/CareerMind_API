const { Server } = require("socket.io");
const AuthService = require("@/services/auth.service");
const authModel = require("@/models/auth.model");
const revokedTokenModel = require("@/models/revokedToken.model");

let io = null;
const onlineUsers = new Map(); // Key: userId, Value: Set of socket IDs

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://careedmind.io.vn",
        "https://www.careedmind.io.vn",
        "https://admin.careedmind.io.vn",
      ],
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    },
  });

  // 1. Handshake Middleware Authentication (JWT)
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "").trim();
      const internalKey = socket.handshake.auth?.internalKey;

      // Cho phép kết nối nội bộ bằng Secret Key (dành cho schedule)
      if (internalKey && internalKey === process.env.INTERNAL_SOCKET_KEY) {
        socket.isInternal = true;
        return next();
      }

      if (!token) return next(new Error("Authentication error: Token missing"));

      // Giải mã & xác thực token
      const payload = await AuthService.verifyAccessToken(token);
      const isRevoked = await revokedTokenModel.isRevoked(token);

      if (isRevoked || payload.exp < Date.now() / 1000) {
        return next(
          new Error("Authentication error: Token invalid or expired"),
        );
      }

      const user = await authModel.getUserById(payload.sub);
      if (!user) return next(new Error("Authentication error: User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: " + err.message));
    }
  });

  // 2. Lắng nghe các kết nối
  io.on("connection", (socket) => {
    if (socket.isInternal) {
      console.log("⚡ [Socket] Tiến trình chạy ngầm đã kết nối.");

      socket.on("internal:notify_admin", (notification) => {
        io.to("role:ADMIN").emit("notification:admin_new", notification);
        console.log("📢 [Socket] Đã bắn thông báo log tới tất cả Admin.");
      });
      return;
    }

    const userId = socket.user.id;
    const userRole = socket.user.role; // CANDIDATE, RECRUITER, ADMIN

    console.log(`🔌 [Socket] User ${userId} (${userRole}) đã kết nối.`);
    
    // Quản lý trạng thái online
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
      io.emit("user_status_changed", { userId, status: "online" });
    }
    onlineUsers.get(userId).add(socket.id);

    // Join vào room cá nhân để nhận thông báo realtime
    socket.join(`user:${userId}`);

    // Nếu là ADMIN, join vào room admin để nhận thông báo hệ thống
    if (userRole === "ADMIN") {
      socket.join("role:ADMIN");
    }

    // Chat 1-1 realtime (Candidate <-> Recruiter)
    socket.on("chat:join_room", ({ roomId }) => {
      socket.join(`chat_room:${roomId}`);
      console.log(`💬 User ${userId} tham gia phòng chat: chat_room:${roomId}`);
    });

    socket.on("chat:send_message", ({ roomId, message }) => {
      socket.to(`chat_room:${roomId}`).emit("chat:message_received", message);
    });

    socket.on("disconnect", () => {
      console.log(`❌ [Socket] User ${userId} đã ngắt kết nối.`);
      if (onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          io.emit("user_status_changed", { userId, status: "offline" });
        }
      }
    });

    socket.on("check_users_status", (userIds, callback) => {
      if (Array.isArray(userIds) && typeof callback === "function") {
        const statuses = {};
        userIds.forEach((id) => {
          statuses[id] = onlineUsers.has(id) ? "online" : "offline";
        });
        callback(statuses);
      }
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket.io chưa được khởi tạo!");
  return io;
};

// Hàm gửi thông báo realtime đích danh
const sendToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  sendToUser,
};
