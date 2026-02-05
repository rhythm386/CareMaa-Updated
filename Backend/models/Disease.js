const mongoose = require("mongoose");

const DiseaseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

  description: String,

  symptoms: [String],

  causes: [String],

  precautions: [String],

  treatment: String,

  medicines: [
    {
      name: String,
      dosage: String,
      notes: String
    }
  ],

  doctors: [
    {
      name: String,
      specialization: String,
      hospital: String,
      contact: String
    }
  ]
});

module.exports = mongoose.model("Disease", DiseaseSchema);