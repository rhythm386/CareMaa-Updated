const router = require("express").Router();
const PregnancyRecord = require("../models/PregnancyRecord");

router.post("/add", async (req, res) => {
  const record = await PregnancyRecord.create(req.body);
  res.json(record);
});

router.get("/:userId", async (req, res) => {
  const data = await PregnancyRecord.find({ userId: req.params.userId });
  res.json(data);
});

module.exports = router;
