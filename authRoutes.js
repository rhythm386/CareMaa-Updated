const router = require("express").Router();

router.post("/login", (req, res) => {
  res.json({ message: "Login success (demo)" });
});

router.post("/register", (req, res) => {
  res.json({ message: "User registered (demo)" });
});

module.exports = router;
