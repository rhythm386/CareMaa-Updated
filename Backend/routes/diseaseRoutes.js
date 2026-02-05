const express = require("express");
const Disease = require("../models/Disease");

const router = express.Router();

// ✅ GET ALL DISEASES
router.get("/", async (req, res) => {
  const diseases = await Disease.find({});
  res.json(diseases);
});

// ✅ GET DISEASE BY NAME (FIXED)
router.get("/:name", async (req, res) => {
  try {
    const disease = await Disease.findOne({
      disease_name: { $regex: new RegExp(`^${req.params.name}$`, "i") }
    });

    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }

    res.json(disease);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;