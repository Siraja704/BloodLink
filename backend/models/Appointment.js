const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    appointmentType: {
      type: String,
      enum: ["Blood Donation", "Blood Test", "Consultation"],
      default: "Blood Donation",
    },
    bloodType: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    location: {
      type: String,
      required: true,
    },
    hospital: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Confirmed", "Completed", "Cancelled", "No-Show"],
      default: "Scheduled",
    },
    notes: String,
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
