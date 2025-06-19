const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get user's donation history
router.get("/history", auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id })
      .sort({ donationDate: -1 })
      .limit(20);

    res.json({
      success: true,
      donations,
    });
  } catch (err) {
    console.error("Get donation history error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create new donation record
router.post("/", auth, async (req, res) => {
  try {
    const {
      donationDate,
      bloodType,
      location,
      hospital,
      notes,
      hemoglobinLevel,
      bloodPressure,
      temperature,
      weight,
    } = req.body;

    const donation = new Donation({
      donorId: req.user._id,
      donationDate,
      bloodType: bloodType || req.user.bloodType,
      location,
      hospital,
      notes,
      hemoglobinLevel,
      bloodPressure,
      temperature,
      weight,
      status: "Completed",
    });

    await donation.save();

    // Update user's donation stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalDonations: 1 },
      lastDonationDate: donationDate,
    });

    res.json({
      success: true,
      message: "Donation recorded successfully",
      donation,
    });
  } catch (err) {
    console.error("Create donation error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get donation statistics
router.get("/stats", auth, async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({
      donorId: req.user._id,
      status: "Completed",
    });

    const lastDonation = await Donation.findOne({
      donorId: req.user._id,
      status: "Completed",
    }).sort({ donationDate: -1 });

    const monthlyDonations = await Donation.countDocuments({
      donorId: req.user._id,
      status: "Completed",
      donationDate: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    res.json({
      success: true,
      stats: {
        totalDonations,
        lastDonation: lastDonation?.donationDate || null,
        monthlyDonations,
      },
    });
  } catch (err) {
    console.error("Get donation stats error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
