const router = require("express").Router();
const Vaccination = require("../models/Vaccination");

router.post("/add", async (req, res) => {
  const vaccine = await Vaccination.create(req.body);
  res.json(vaccine);
});

router.get("/due", async (req, res) => {
  const today = new Date();
  const due = await Vaccination.find({
    dueDate: { $lte: today },
    taken: false
  });
  res.json(due);
});

module.exports = router;