const jwt = require("jsonwebtoken");
const Message = require("./models/message");
const Chat = require("./models/Chat");
const User = require("./models/user");

module.exports = function setupSocket(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", socket => {
    socket.join(`user:${socket.userId}`);

    socket.on("join-chat", chatId => {
      socket.join(chatId);
    });

    socket.on("leave-chat", chatId => {
      socket.leave(chatId);
    });

    socket.on("typing", ({ chatId }) => {
      socket.to(chatId).emit("typing", {
        chatId,
        userId: socket.userId,
      });
    });

    socket.on("stop-typing", ({ chatId }) => {
      socket.to(chatId).emit("stop-typing", {
        chatId,
        userId: socket.userId,
      });
    });

    socket.on("send-message", async ({ chatId, text }) => {
      
      console.log("SEND MESSAGE HIT", chatId, text);
      if (!chatId || !text) return;

      const chat = await Chat.findById(chatId).populate("participants");
      if (!chat) return;

      const sender = await User.findById(socket.userId);
      if (!sender) return;

      const receiver = chat.participants.find(
        u => u._id.toString() !== socket.userId
      );
      if (!receiver) return;

      if (
        sender.blockedUsers.includes(receiver._id) ||
        receiver.blockedUsers.includes(sender._id)
      ) {
        return;
      }

      const msg = await Message.create({
        chat: chatId,
        sender: socket.userId,
        text,
      });

      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: msg._id,
        updatedAt: new Date(),
      });

      io.to(chatId).emit("receive-message", msg);
        chat.participants.forEach(p => {
          if (p._id.toString() !== socket.userId) {
            io.to(`user:${p._id}`).emit("message-delivered", {
              chatId,
              messageId: msg._id,
            });
          }
        });

      chat.participants.forEach(p => {
        io.to(`user:${p._id}`).emit("chat-updated", {
          chatId,
          lastMessage: msg,
        });
      });
    });
  });
};
