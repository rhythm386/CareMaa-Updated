// =======================
// IMPORTS
// =======================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// =======================
// APP INIT
// =======================
const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// =======================
// MONGODB CONNECTION
// =======================
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/caremaa")
  .then(() => console.log("✅ CareMaa MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// =======================
// MODELS
// =======================
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }
});

const User = mongoose.model("User", UserSchema);

// =======================
// ROUTES
// =======================

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "Backend is running ✅",
    time: new Date()
  });
});

// =======================
// AUTH ROUTES
// =======================

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// =======================
// DISEASE ROUTES  ✅ MOVED ABOVE listen()
// =======================
const diseaseRoutes = require("./routes/diseaseRoutes");
app.use("/api/diseases", diseaseRoutes);

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CareMaa Backend running at http://localhost:${PORT}`);
});