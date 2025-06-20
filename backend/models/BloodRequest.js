const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    unitsRequired: {
      type: Number,
      required: true,
      default: 1,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    hospitalAddress: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ["Urgent", "Within 24 hours", "Within 3 days"],
      default: "Urgent",
    },
    status: {
      type: String,
      enum: ["Open", "Fulfilled", "Closed", "Withdrawn"],
      default: "Open",
    },
    fulfilledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    withdrawalReason: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
