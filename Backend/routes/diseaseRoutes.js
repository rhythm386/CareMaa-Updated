const express = require("express");
const router = express.Router();

const {
  addDisease,
  getDiseaseInfo
} = require("../controllers/diseaseController")


router.post("/add", addDisease);
router.get("/:diseaseName", getDiseaseInfo);

module.exports = router;
