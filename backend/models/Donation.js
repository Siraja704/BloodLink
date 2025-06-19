const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donationDate: {
      type: Date,
      required: true,
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
      enum: ["Scheduled", "Completed", "Cancelled", "No-Show"],
      default: "Scheduled",
    },
    notes: String,
    hemoglobinLevel: Number,
    bloodPressure: String,
    temperature: Number,
    weight: Number,
    isEligible: {
      type: Boolean,
      default: true,
    },
    rejectionReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
