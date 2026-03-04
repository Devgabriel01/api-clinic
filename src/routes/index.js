const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to Clinic API" });
});

router.use("/docs", require("./docs.routes"));
router.use("/patients", require("./patients.routes"));
router.use("/auth", require("./auth.routes"));

module.exports = router;