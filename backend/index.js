const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const donationRoutes = require("./routes/donations");
const appointmentRoutes = require("./routes/appointments");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected to BloodLink database"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "BloodLink API is working and connected to MongoDB!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/appointments", appointmentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`BloodLink server running on port ${PORT}`);
});
