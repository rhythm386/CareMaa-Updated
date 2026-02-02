const Disease = require("../models/Disease");
const Doctor = require("../models/Doctor");

const addDisease = async (req, res) => {
  try {
    const disease = await Disease.create(req.body);
    res.status(201).json(disease);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDiseaseInfo = async (req, res) => {
  try {
    const { diseaseName } = req.params;

    const disease = await Disease.findOne({
      disease_name: { $regex: diseaseName, $options: "i" }
    });

    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }

    const doctor = await Doctor.findOne({
      specialist: disease.recommended_specialist
    });

    res.json({
      disease: disease.disease_name,
      medicines: disease.common_medicines,
      recommended_doctor: doctor
        ? {
            name: doctor.name,
            specialist: doctor.specialist
          }
        : "No doctor found"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addDisease,
  getDiseaseInfo
};
