const mongoose = require("mongoose");

const VaccinationSchema = new mongoose.Schema({
  childName: String,
  vaccineName: String,
  dueDate: Date,
  taken: { type: Boolean, default: false }
});

module.exports = mongoose.model("Vaccination", VaccinationSchema);
