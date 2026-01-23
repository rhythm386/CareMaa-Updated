const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // ✅ FIXED: Only ONE declaration
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/caremaa')
  .then(() => console.log('✅ CareMaa MongoDB Connected!'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// SCHEMAS - Defined BEFORE use ✅
const UserSchema = new mongoose.Schema({
  name: String, 
  email: { type: String, unique: true, required: true },
  password: String, 
  role: { type: String, default: 'user' },
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
  createdAt: { type: Date, expires: 3600, default: Date.now } // 1 hour expiry
});

// MODELS - Created AFTER schemas ✅
const User = mongoose.model('User', UserSchema);
const Vaccination = mongoose.model('Vaccination', VaccinationSchema);
const ResetToken = mongoose.model('ResetToken', ResetTokenSchema);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running ✅", timestamp: new Date() });
});

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPw = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPw });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey');
    res.json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey');
      res.json({ token, user: { id: user._id, name: user.name, email } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

// Profile (Protected) ✅ FIXED: Now works correctly
app.get('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Forgot Password ✅ FIXED: Works without real email
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    await ResetToken.create({ email, token });

    // Console log reset URL (real email setup later)
    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    console.log(`🔗 PASSWORD RESET: ${resetUrl}`);
    
    res.json({ message: 'Reset link generated! Check console (email setup pending)' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate reset link' });
  }
});

// Reset Password
app.post('/api/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) return res.status(400).json({ error: 'Invalid token' });

    const user = await User.findOne({ email: resetToken.email });
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await ResetToken.deleteOne({ token });

    res.json({ message: 'Password reset successful! Please login.' });
  } catch (error) {
    res.status(500).json({ error: 'Reset failed' });
  }
});

// AI Risk Prediction
app.post('/api/risk-prediction', async (req, res) => {
  const { age, bp, glucose, weight, height } = req.body.healthData || {};
  let risks = [];
  const bmi = weight ? weight / ((height/100)**2) : 0;
  
  if (bp && (bp.includes('140/90') || bp.includes('high'))) risks.push('Preeclampsia risk');
  if (glucose > 140) risks.push('Gestational Diabetes');
  if (bmi > 25 || age > 35) risks.push('Anemia/High-risk');
  
  res.json({ 
    risks, 
    riskScore: risks.length * 25, 
    recommendations: risks.length ? 'Consult doctor immediately' : 'All good!' 
  });
});

// Vaccination QR & Reminder ✅ FIXED: Complete route
app.post('/api/vaccination', async (req, res) => {
  try {
    const { userId, vaccineName, date } = req.body;
    const qrData = `Vaccine:${vaccineName}|Date:${date}|User:${userId}`;
    const qrCode = await QRCode.toDataURL(qrData);
    
    const vaccination = new Vaccination({ 
      userId, 
      vaccines: [{ name: vaccineName, date: new Date(date), qrCode }] 
    });
    await vaccination.save();
    
    res.json({ qrCode, message: 'Vaccination recorded successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save vaccination' });
  }
});

// Save user tracker data
app.post('/api/save-data/:type', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    
    const user = await User.findById(decoded.id);
    user[`${req.params.type}Data`] = req.body.data;
    await user.save();
    
    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(frontendPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CareMaa Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
