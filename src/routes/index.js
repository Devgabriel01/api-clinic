const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to Clinic API" });
});

router.use("/docs", require("./docs.routes"));
router.use("/auth", require("./auth.routes"));
router.use("/patients", require("./patients.routes"));
router.use("/doctors", require("./doctors.routes"));
router.use("/appointments", require("./appointments.routes"));
router.use("/dashboard", require("./dashboard.routes"));

module.exports = router;