const prisma = require("@/libs/prisma");

async function getNotifications(req, res) {
  try {
    const userId = req.auth.user.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: +skip,
        take: +limit,
      }),
      prisma.notification.count({
        where: { userId },
      }),
    ]);

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return res.success(200, {
      notifications,
      unreadCount,
      pagination: {
        page: +page,
        limit: +limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.error(500, "Không thể lấy danh sách thông báo: " + error.message);
  }
}

async function markAsRead(req, res) {
  try {
    const userId = req.auth.user.id;
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return res.error(404, "Không tìm thấy thông báo");
    }

    if (notification.userId !== userId) {
      return res.error(403, "Không có quyền thực hiện hành động này");
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.success(200, updated);
  } catch (error) {
    return res.error(500, "Không thể đánh dấu đã đọc: " + error.message);
  }
}

async function markAllAsRead(req, res) {
  try {
    const userId = req.auth.user.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return res.success(200, { message: "Đã đánh dấu đọc tất cả thông báo" });
  } catch (error) {
    return res.error(500, "Không thể đánh dấu đọc tất cả: " + error.message);
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
