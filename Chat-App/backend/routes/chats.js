// routes/chats.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const Chat = require("../models/Chat");
const User = require("../models/user")

router.get("/", auth, async (req, res) => {
  const chats = await Chat.find({
    participants: req.user.id,
  })
    .populate("participants", "_id username profilePic about blockedUsers")
    .populate("lastMessage")
    .lean();

  const enriched = chats.map(chat => {
    const lastRead = chat.lastRead?.[req.user.id];
    let unreadCount = 0;

    if (chat.lastMessage && lastRead) {
      unreadCount = chat.lastMessage.createdAt > lastRead ? 1 : 0;
    } else if (chat.lastMessage) {
      unreadCount = 1;
    }

    return { ...chat, unreadCount };
  });

  res.json(enriched);
});

router.post("/", auth, async (req, res) => {
  const { userId } = req.body;

  if (userId === req.user.id) {
    return res
      .status(400)
      .json({ message: "You cannot start a chat with yourself" });
  }

  let chat = await Chat.findOne({
    participants: { $all: [req.user.id, userId] },
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [req.user.id, userId],
    });
  }

  const populatedChat = await chat.populate(
    "participants",
    "_id username profilePic about"
  );

  res.json(populatedChat);
});

module.exports = router;
