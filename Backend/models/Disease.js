const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Girl Child", "Periods", "Pregnancy"],
    required: true
  },
  disease_name: {
    type: String,
    required: true
  },
  symptoms: [String],
  common_medicines: [String],
  recommended_specialist: String,
  severity: {
    type: String,
    enum: ["Mild", "Moderate", "Serious"]
  }
});

module.exports = mongoose.model("Disease", diseaseSchema);
