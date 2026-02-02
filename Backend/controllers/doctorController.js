const Doctor = require("../models/Doctor");

const addDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorByDisease = async (req, res) => {
  try {
    const { disease } = req.params;

    const doctors = await Doctor.find({
      diseases_treated: { $regex: disease, $options: "i" }
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 THIS MUST EXIST EXACTLY LIKE THIS
module.exports = {
  addDoctor,
  getDoctorByDisease
};
