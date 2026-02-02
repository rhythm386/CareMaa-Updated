const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  doctor_id: String,
  name: String,
  specialist: String,
  hospital: {
    name: String,
    location: String
  },
  diseases_treated: [String],
  medicines: [String],
  availability: {
    days: [String],
    time_slots: [String]
  },
  verified: Boolean,
  proxy_contact: String
});

module.exports = mongoose.model("Doctor", doctorSchema);
