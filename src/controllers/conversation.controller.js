const prisma = require("@/libs/prisma");
const { getIO, sendToUser } = require("@/libs/socket");

// 1. Tạo hoặc lấy phòng chat 1-1
async function createOrGetConversation(req, res) {
  const userId = req.auth.user.id;
  const { partnerId } = req.body;

  if (!partnerId) {
    return res.error(400, "partnerId là bắt buộc");
  }

  if (userId === partnerId) {
    return res.error(400, "Không thể tự trò chuyện với chính mình");
  }

  // Kiểm tra partner có tồn tại không
  const partnerUser = await prisma.user.findUnique({
    where: { id: partnerId },
    include: { profile: true },
  });

  if (!partnerUser) {
    return res.error(404, "Không tìm thấy người dùng này");
  }

  // Sắp xếp theo bảng chữ cái để tạo khóa unique
  const userOneId = userId < partnerId ? userId : partnerId;
  const userTwoId = userId > partnerId ? userId : partnerId;

  try {
    const conversation = await prisma.conversation.upsert({
      where: {
        userOneId_userTwoId: { userOneId, userTwoId },
      },
      create: {
        userOneId,
        userTwoId,
      },
      update: {},
      include: {
        userOne: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
                bio: true,
              },
            },
            company: {
              select: {
                name: true,
              },
            },
          },
        },
        userTwo: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
                bio: true,
              },
            },
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const partner =
      conversation.userOneId === userId
        ? conversation.userTwo
        : conversation.userOne;

    const formatted = {
      id: conversation.id,
      partner: {
        id: partner.id,
        name: partner.profile?.fullName || partner.email,
        role:
          partner.profile?.bio ||
          (partner.role === "RECRUITER" ? "Nhà tuyển dụng" : "Ứng viên"),
        company: partner.company?.name || null,
        avatar: partner.profile?.avatarUrl || null,
        isActive: true,
        lastActive: null,
      },
    };

    return res.success(200, formatted);
  } catch (error) {
    return res.error(500, "Lỗi khi tạo phòng chat: " + error.message);
  }
}

// 2. Lấy danh sách phòng chat kèm tin nhắn cuối và số tin nhắn chưa đọc
async function getConversations(req, res) {
  const userId = req.auth.user.id;

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ userOneId: userId }, { userTwoId: userId }],
      },
      include: {
        userOne: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
                bio: true,
              },
            },
            company: {
              select: {
                name: true,
              },
            },
          },
        },
        userTwo: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
                bio: true,
              },
            },
            company: {
              select: {
                name: true,
              },
            },
          },
        },
        messages: {
          select: {
            id: true,
            content: true,
            messageType: true,
            createdAt: true,
            senderId: true,
            isRead: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const formatted = await Promise.all(
      conversations.map(async (c) => {
        const partner = c.userOneId === userId ? c.userTwo : c.userOne;
        const lastMessage = c.messages[0] || null;

        // Đếm số tin nhắn chưa đọc từ phía đối phương gửi
        const unreadCount = await prisma.conversationMessage.count({
          where: {
            conversationId: c.id,
            senderId: { not: userId },
            isRead: false,
          },
        });

        return {
          id: c.id,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          title: partner.profile?.fullName || partner.email,
          partner: {
            id: partner.id,
            name: partner.profile?.fullName || partner.email,
            role:
              partner.profile?.bio ||
              (partner.role === "RECRUITER" ? "Nhà tuyển dụng" : "Ứng viên"),
            company: partner.company?.name || null,
            avatar: partner.profile?.avatarUrl || null,
            isActive: true,
            lastActive: null,
          },
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                attachments: null,
                messageType: lastMessage.messageType,
                createdAt: lastMessage.createdAt,
                senderId: lastMessage.senderId,
                isRead: lastMessage.isRead,
              }
            : null,
          unreadCount,
        };
      }),
    );

    return res.success(200, formatted);
  } catch (error) {
    return res.error(500, "Lỗi khi lấy danh sách phòng chat: " + error.message);
  }
}

// 3. Lấy toàn bộ tin nhắn thuộc phòng chat & Đánh dấu đã đọc
async function getMessages(req, res) {
  const userId = req.auth.user.id;
  const { id } = req.params;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (
      !conversation ||
      (conversation.userOneId !== userId && conversation.userTwoId !== userId)
    ) {
      return res.error(
        404,
        "Không tìm thấy phòng chat hoặc bạn không tham gia",
      );
    }

    // Đánh dấu tất cả tin nhắn từ partner gửi là đã đọc
    await prisma.conversationMessage.updateMany({
      where: {
        conversationId: id,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    const messages = await prisma.conversationMessage.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "asc" },
    });

    // Format role tương thích FE (USER cho người đang đăng nhập, BOT cho partner)
    const formatted = messages.map((msg) => ({
      id: msg.id,
      role: msg.senderId === userId ? "USER" : "BOT",
      content: msg.content,
      attachments: msg.attachments,
      messageType: msg.messageType,
      createdAt: msg.createdAt,
      senderId: msg.senderId,
      isRead: msg.isRead,
    }));

    return res.success(200, formatted);
  } catch (error) {
    return res.error(500, "Lỗi khi lấy lịch sử tin nhắn: " + error.message);
  }
}

// 4. Gửi tin nhắn mới & Bắn realtime socket
async function sendMessage(req, res) {
  const userId = req.auth.user.id;
  const { id } = req.params;
  const { content, attachments, messageType } = req.body;

  if (!content?.trim() && (!attachments || attachments.length === 0)) {
    return res.error(400, "Không thể gửi tin nhắn trống");
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (
      !conversation ||
      (conversation.userOneId !== userId && conversation.userTwoId !== userId)
    ) {
      return res.error(404, "Không tìm thấy phòng chat");
    }

    // Tạo tin nhắn mới
    const message = await prisma.conversationMessage.create({
      data: {
        conversationId: id,
        senderId: userId,
        content: content || "",
        attachments: attachments || null,
        messageType: messageType || "TEXT",
        isRead: false,
      },
    });

    // Cập nhật updatedAt của Conversation để xếp đầu danh sách sidebar
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    const recipientId =
      conversation.userOneId === userId
        ? conversation.userTwoId
        : conversation.userOneId;

    // Bắn socket realtime tới phòng chat (để người nhận trong phòng nhận tức thì)
    const io = getIO();
    io.to(`chat_room:${id}`).emit("chat:message_received", {
      id: message.id,
      conversationId: id,
      content: message.content,
      attachments: message.attachments,
      messageType: message.messageType,
      createdAt: message.createdAt,
      senderId: message.senderId,
      isRead: message.isRead,
    });

    // Bắn socket tới kênh cá nhân của recipient (để cập nhật chấm đỏ / thông báo chưa đọc toàn cục)
    sendToUser(recipientId, "chat:new_message", {
      conversationId: id,
      message: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        senderId: message.senderId,
        attachments: message.attachments,
      },
    });

    // Format trả về cho chính sender hiển thị
    const formatted = {
      id: message.id,
      role: "USER",
      content: message.content,
      attachments: message.attachments,
      messageType: message.messageType,
      createdAt: message.createdAt,
      senderId: message.senderId,
      isRead: message.isRead,
    };

    return res.success(201, formatted);
  } catch (error) {
    return res.error(500, "Lỗi khi gửi tin nhắn: " + error.message);
  }
}

// 5. Đánh dấu đã đọc phòng chat thủ công
async function markAsRead(req, res) {
  const userId = req.auth.user.id;
  const { id } = req.params;

  try {
    await prisma.conversationMessage.updateMany({
      where: {
        conversationId: id,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return res.success(200, { success: true });
  } catch (error) {
    return res.error(500, "Lỗi khi đánh dấu đã đọc: " + error.message);
  }
}

// 6. Lấy tổng số tin nhắn chưa đọc toàn cục
async function getUnreadCount(req, res) {
  const userId = req.auth.user.id;

  try {
    const unreadCount = await prisma.conversationMessage.count({
      where: {
        conversation: {
          OR: [{ userOneId: userId }, { userTwoId: userId }],
        },
        senderId: { not: userId },
        isRead: false,
      },
    });

    return res.success(200, { unreadCount });
  } catch (error) {
    return res.error(500, "Lỗi khi đếm tin nhắn chưa đọc: " + error.message);
  }
}

module.exports = {
  createOrGetConversation,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  getUnreadCount,
};
