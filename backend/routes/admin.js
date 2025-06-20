const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");
const Donation = require("../models/Donation");

// Admin Dashboard Stats
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ isDonor: true });
    const totalRequests = await BloodRequest.countDocuments();
    const openRequests = await BloodRequest.countDocuments({ status: "Open" });
    const totalDonations = await Donation.countDocuments({
      status: "Completed",
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        totalRequests,
        openRequests,
        totalDonations,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all users (for admin management)
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update user role or status (example)
router.put("/users/:id", adminAuth, async (req, res) => {
  try {
    const { role, isAvailable } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isAvailable },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all blood requests
router.get("/requests", adminAuth, async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate("requesterId", "fullName email")
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update a blood request status
router.put("/requests/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }
    res.json({ success: true, message: "Request status updated", request });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
