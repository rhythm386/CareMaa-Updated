const router = require("express").Router();

router.post("/predict", (req, res) => {
  const { bloodPressure, sugarLevel, hemoglobin } = req.body;

  let risks = [];

  if (bloodPressure > 140) risks.push("Preeclampsia Risk");
  if (sugarLevel > 140) risks.push("Gestational Diabetes Risk");
  if (hemoglobin < 11) risks.push("Anemia Risk");

  res.json({
    status: risks.length ? "Risk Detected" : "Normal",
    risks
  });
});

module.exports = router;
