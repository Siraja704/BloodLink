const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Registration route
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, bloodType, location, phone } = req.body;
    if (!fullName || !email || !password || !bloodType || !location || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      bloodType,
      location,
      phone,
    });
    await user.save();
    res.json({ success: true, message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Real login route (only allow login for users in DB)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    return res.json({
      success: true,
      message: "Login successful",
      user: { email },
    });
  }
  return res
    .status(401)
    .json({ success: false, message: "Invalid credentials" });
});

module.exports = router;
