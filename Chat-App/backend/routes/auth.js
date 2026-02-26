// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user")
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const {username, email, password} = req.body;

    const existname = await User.findOne({username});
    if (existname) return res.status(400).json({message : "Username Already Taken"});

    const existemail = await User.findOne({email});
    if (existemail) return res.status(400).send({message : "Email is already accosiated with an existing account"});

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({username, email, password: hashed});

    res.status(201).json({message:"User Created!", userId: user._id,})
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});

    if (!user) return res.status(400).json({message:"User Not Found"});
    if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({message:"Invalid Password For this Username"});

    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
    );

    res.json({token});
})

router.get("/me", require("../middleware/auth"), async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
