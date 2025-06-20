const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bloodType: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    isDonor: { type: Boolean, default: true },
    lastDonationDate: { type: Date },
    totalDonations: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    contactPublic: { type: Boolean, default: false },
    isPaidDonor: { type: Boolean, default: false },
    chargeAmount: { type: Number, default: 0 },
    locationCoords: {
      lat: { type: Number },
      lng: { type: Number },
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        isActive: Boolean,
      },
    ],
    preferences: {
      notifications: { type: Boolean, default: true },
      emailUpdates: { type: Boolean, default: true },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
