const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Registration route
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      bloodType,
      location,
      phone,
      contactPublic,
      isPaidDonor,
      chargeAmount,
      userType,
      locationCoords,
    } = req.body;

    if (!fullName || !email || !password || !location || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (userType === "donor" && !bloodType) {
      return res
        .status(400)
        .json({ success: false, message: "Blood type is required for donors" });
    }
    if (userType === "need" && !bloodType) {
      return res.status(400).json({
        success: false,
        message: "Blood type is required for recipients",
      });
    }
    if (
      userType === "donor" &&
      isPaidDonor &&
      (!chargeAmount || chargeAmount < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Charge amount required for paid donors",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isDonor = userType === "donor" || userType === "both";
    const isNeedy = userType === "need" || userType === "both";

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      bloodType: bloodType || undefined,
      location,
      phone,
      contactPublic: isDonor ? !!contactPublic : false,
      isPaidDonor: isDonor ? !!isPaidDonor : false,
      chargeAmount: isDonor && isPaidDonor ? chargeAmount : 0,
      isDonor,
      isNeedy,
      locationCoords: locationCoords || undefined,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        bloodType: user.bloodType,
        location: user.location,
        phone: user.phone,
        contactPublic: user.contactPublic,
        isPaidDonor: user.isPaidDonor,
        chargeAmount: user.chargeAmount,
        isDonor: user.isDonor,
        isNeedy: user.isNeedy,
        locationCoords: user.locationCoords,
        totalDonations: user.totalDonations,
        lastDonationDate: user.lastDonationDate,
        isAvailable: user.isAvailable,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        bloodType: user.bloodType,
        location: user.location,
        phone: user.phone,
        totalDonations: user.totalDonations,
        lastDonationDate: user.lastDonationDate,
        isAvailable: user.isAvailable,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get current user profile (protected route)
router.get("/profile", auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update user profile (protected route)
router.put("/profile", auth, async (req, res) => {
  try {
    const { fullName, location, phone, emergencyContact, preferences } =
      req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName,
        location,
        phone,
        emergencyContact,
        preferences,
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Logout route (client-side token removal)
router.post("/logout", auth, async (req, res) => {
  try {
    // In a more advanced setup, you might want to blacklist the token
    // For now, we'll just return success and let the client remove the token
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get available donors (public or protected)
router.get("/users/available", auth, async (req, res) => {
  try {
    const { bloodType, location } = req.query;
    const query = { isAvailable: true, isDonor: true, contactPublic: true };
    if (bloodType) query.bloodType = bloodType;
    if (location) query.location = { $regex: location, $options: "i" };
    const users = await User.find(query).select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update donor availability status (protected route)
router.put("/availability", auth, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    if (typeof isAvailable !== "boolean") {
      return res
        .status(400)
        .json({ success: false, message: "isAvailable must be boolean" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { isAvailable },
      { new: true, runValidators: true }
    ).select("-password");
    res.json({
      success: true,
      message: "Availability updated",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
