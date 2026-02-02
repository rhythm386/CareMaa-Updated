const express = require("express");
const router = express.Router();

const {
  addDoctor,
  getDoctorByDisease
} = require("../controllers/doctorController");

router.post("/add", addDoctor);
router.get("/disease/:disease", getDoctorByDisease);

module.exports = router;
