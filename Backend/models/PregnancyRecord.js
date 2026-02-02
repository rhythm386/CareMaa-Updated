const mongoose = require("mongoose");

const PregnancyRecordSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  week: Number,
  bloodPressure: Number,
  sugarLevel: Number,
  hemoglobin: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PregnancyRecord", PregnancyRecordSchema);