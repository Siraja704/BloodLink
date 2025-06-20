const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const MONGO_URI = process.env.MONGO_URI;

async function createUser() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const password = "admin";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    fullName: "Siraj Ahmed",
    email: "siraj1704@hello.com",
    password: hashedPassword,
    bloodType: "A+",
    location: "Sukkur",
    phone: "+92 315 5031961",
    role: "admin",
  });

  try {
    await user.save();
    console.log("User created successfully!");
  } catch (err) {
    console.error("Error creating user:", err.message);
  } finally {
    mongoose.connection.close();
  }
}

createUser();
