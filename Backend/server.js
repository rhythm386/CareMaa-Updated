// =======================
// IMPORTS
// =======================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const crypto = require("crypto");
require("dotenv").config();

// =======================
// APP INIT
// =======================
const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// MONGODB CONNECTION
// =======================
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/caremaa")
  .then(() => console.log("✅ CareMaa MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// =======================
// SCHEMAS
// =======================
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  role: { type: String, default: "user" },
  healthData: {
    age: Number,
    weight: Number,
    height: Number,
    bp: String,
    glucose: Number
  },
  pregnancyData: {
    lmpDate: String,
    weeksPregnant: Number,
    weightData: [Object]
  },
  vaccinationData: [Object],
  periodData: [Object]
});

const VaccinationSchema = new mongoose.Schema({
  userId: String,
  vaccines: [{ name: String, date: Date, qrCode: String }],
  reminders: Boolean
});

const ResetTokenSchema = new mongoose.Schema({
  email: String,
  token: String,
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now
  }
});

// =======================
// MODELS
// =======================
const User = mongoose.model("User", UserSchema);
const Vaccination = mongoose.model("Vaccination", VaccinationSchema);
const ResetToken = mongoose.model("ResetToken", ResetTokenSchema);

// =======================
// ROUTES
// =======================

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "Backend is running ✅",
    timestamp: new Date()
  });
});

// ✅ DISEASE ROUTES (ONLY ONCE)
const diseaseRoutes = require("./routes/diseaseRoutes");
app.use("/api/diseases", diseaseRoutes);

// =======================
// AUTH ROUTES
// =======================

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPw = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPw });
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey"
    );

    res.json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey"
    );

    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch {
    res.status(400).json({ error: "Login failed" });
  }
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;
const doctorRoutes = require("./routes/doctorRoutes");
app.use("/api/doctors", doctorRoutes);

app.listen(PORT, () => {
  console.log(`🚀 CareMaa Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
