const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const auth = require("../middleware/auth");

// Get user's appointments
router.get("/", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id }).sort({
      appointmentDate: 1,
    });

    res.json({
      success: true,
      appointments,
    });
  } catch (err) {
    console.error("Get appointments error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create new appointment
router.post("/", auth, async (req, res) => {
  try {
    const {
      appointmentDate,
      appointmentTime,
      appointmentType,
      bloodType,
      location,
      hospital,
      notes,
    } = req.body;

    const appointment = new Appointment({
      userId: req.user._id,
      appointmentDate,
      appointmentTime,
      appointmentType,
      bloodType: bloodType || req.user.bloodType,
      location,
      hospital,
      notes,
    });

    await appointment.save();

    res.json({
      success: true,
      message: "Appointment scheduled successfully",
      appointment,
    });
  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update appointment
router.put("/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (err) {
    console.error("Update appointment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Cancel appointment
router.delete("/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: "Cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (err) {
    console.error("Cancel appointment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get upcoming appointments
router.get("/upcoming", auth, async (req, res) => {
  try {
    const upcomingAppointments = await Appointment.find({
      userId: req.user._id,
      appointmentDate: { $gte: new Date() },
      status: { $in: ["Scheduled", "Confirmed"] },
    }).sort({ appointmentDate: 1 });

    res.json({
      success: true,
      appointments: upcomingAppointments,
    });
  } catch (err) {
    console.error("Get upcoming appointments error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
