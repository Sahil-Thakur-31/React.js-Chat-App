// routes/users.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/user");

router.get("/", auth, async (req, res) => {
  const { username } = req.query;
  const me = await User.findById(req.user.id);
  const query = {
    _id: { $nin: me.blockedUsers },
    ...(username && {
      username: new RegExp(username, "i"),
    }),
  };

  const users = await User.find(query).select("_id username profilePic about");
  res.json(users);
});

router.put("/:id/profile", async (req, res) => {
  const { about, profilePic } = req.body;

  await User.findByIdAndUpdate(req.params.id, {
    about,
    profilePic,
  });

  res.json({ message: "Profile updated" });
});

router.post("/:id/block", auth, async (req, res) => {
  try {
    const blockerId = req.user.id;
    const blockedId = req.params.id;

    const user = await User.findById(blockerId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.blockedUsers.includes(blockedId)) {
      return res.status(400).json({
        message: "User already blocked",
      });
    }

    user.blockedUsers.push(blockedId);
    await user.save();

    return res.json({
      message: "User blocked successfully",
    });
  } catch (err) {
    console.error("BLOCK USER ERROR:", err);
    res.status(500).json({
      message: "Failed to block user",
    });
  }
});

router.post("/:id/unblock", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.blockedUsers = user.blockedUsers.filter(
      u => u.toString() !== req.params.id
    );

    await user.save();

    res.json({ message: "User unblocked" });
  } catch (err) {
    console.error("UNBLOCK ERROR:", err);
    res.status(500).json({ message: "Failed to unblock user" });
  }
});


module.exports = router;
