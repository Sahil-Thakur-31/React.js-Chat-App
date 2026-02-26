// routes/messages.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const Message = require("../models/message");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");

router.get("/:chatId", auth, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.user.id;

    const seenAt = new Date();

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { [`lastRead.${userId}`]: seenAt },
      { new: true }
    ).populate("participants");

    // ✅ EMIT SEEN TO OTHER USER
    chat.participants.forEach(p => {
      if (p._id.toString() !== userId) {
        req.io.to(`user:${p._id}`).emit("messages-seen", {
          chatId,
          seenBy: userId,
          seenAt: new Date(),
        });
      }
    });

    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("FETCH MESSAGES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

router.delete("/chat/:chatId", auth, async (req, res) => {
  try {
    await Message.deleteMany({
      chat: req.params.chatId,
    });

    res.json({ message: "Chat cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear chat" });
  }
});

module.exports = router;
