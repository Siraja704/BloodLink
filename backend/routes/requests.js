const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest");
const auth = require("../middleware/auth");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const Appointment = require("../models/Appointment");

// Configure Nodemailer transporter (update with your real credentials in .env)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g. smtp.gmail.com
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

// Create a new blood request
router.post("/", auth, async (req, res) => {
  try {
    const {
      patientName,
      bloodType,
      unitsRequired,
      hospitalName,
      hospitalAddress,
      contactPerson,
      contactPhone,
      urgency,
      notes,
    } = req.body;

    const request = new BloodRequest({
      requesterId: req.user._id,
      patientName,
      bloodType,
      unitsRequired,
      hospitalName,
      hospitalAddress,
      contactPerson,
      contactPhone,
      urgency,
      notes,
    });

    await request.save();

    // Send email to requester (confirmation)
    const requester = await User.findById(req.user._id);
    if (requester && requester.email) {
      transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: requester.email,
        subject: "Blood Request Submitted - Confirmation",
        text: `Dear ${requester.fullName},\n\nYour blood request for ${patientName} (${bloodType}, ${unitsRequired} unit(s)) at ${hospitalName} has been submitted. We will notify available donors.\n\nThank you for using BloodLink!`,
      });
    }

    // Notify available donors with matching blood type
    const availableDonors = await User.find({
      isAvailable: true,
      isDonor: true,
      bloodType: bloodType,
    });

    for (const donor of availableDonors) {
      if (donor.email) {
        transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: donor.email,
          subject: `Urgent Blood Request: ${bloodType}`,
          text: `Dear ${donor.fullName},\n\nAn urgent request for ${bloodType} blood has been made for a patient at ${hospitalName}. If you are able to donate, please check the app for details.\n\nThank you for being a hero!`,
        });
      }
    }

    res
      .status(201)
      .json({ success: true, message: "Request created", request });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all open blood requests
router.get("/", auth, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: "Open" })
      .populate("requesterId", "fullName email")
      .populate("applicants")
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get requests for the logged-in user
router.get("/my-requests", auth, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ requesterId: req.user._id })
      .populate(
        "applicants",
        "fullName email bloodType isPaidDonor chargeAmount"
      )
      .populate("fulfilledBy", "fullName email")
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get a single blood request by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate("requesterId", "fullName email")
      .populate("applicants", "fullName email bloodType");

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Apply to a blood request
router.post("/:id/apply", auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (request.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "Request is not open for applications",
      });
    }

    // Check if user has already applied
    if (request.applicants.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this request",
      });
    }

    // Check if requester is trying to apply to their own request
    if (request.requesterId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own request",
      });
    }

    request.applicants.push(req.user._id);
    await request.save();

    res.json({ success: true, message: "Applied successfully", request });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Select an applicant
router.post("/:id/select/:applicantId", auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (request.requesterId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (request.status !== "Open") {
      return res
        .status(400)
        .json({ success: false, message: "Request is not open" });
    }

    const applicantId = req.params.applicantId;
    if (!request.applicants.includes(applicantId)) {
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    }

    request.status = "Fulfilled";
    request.fulfilledBy = applicantId;
    await request.save();

    // Create appointment for both donor and requester
    const appointmentDate = new Date(); // Default to now, can be updated later
    const appointment = new Appointment({
      requestId: request._id,
      donorId: applicantId,
      requesterId: request.requesterId,
      userId: applicantId, // For donor's view
      appointmentDate,
      appointmentTime: "To be scheduled",
      appointmentType: "Blood Donation",
      bloodType: request.bloodType,
      location: request.hospitalAddress,
      hospital: request.hospitalName,
      status: "Scheduled",
      notes: `Auto-created when donor selected for request ${request._id}`,
    });
    await appointment.save();

    // Optionally, create a mirrored appointment for the requester (if needed in UI)
    // const requesterAppointment = new Appointment({ ... });
    // await requesterAppointment.save();

    res.json({
      success: true,
      message: "Applicant selected and appointment created",
      request,
      appointment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Withdraw a blood request
router.patch("/:id/withdraw", auth, async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res
        .status(400)
        .json({ success: false, message: "Withdrawal reason is required" });
    }
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (request.requesterId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (request.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "Only open requests can be withdrawn",
      });
    }

    request.status = "Withdrawn";
    request.withdrawalReason = reason;
    await request.save();

    res.json({ success: true, message: "Request withdrawn", request });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update a blood request (e.g., to change status)
router.put("/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    // Ensure only the requester can update the status
    if (request.requesterId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    request.status = status;
    await request.save();

    res.json({ success: true, message: "Request updated", request });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
