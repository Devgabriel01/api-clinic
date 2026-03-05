const router = require("express").Router();
const { z } = require("zod");
const prisma = require("../utils/prisma");
const auth = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/requireAdmin.middleware");

const schema = z.object({
  name: z.string().min(2),
  specialty: z.string().min(2)
});

router.use(auth);

router.get("/", async (req, res, next) => {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(doctors);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id }
    });

    if (!doctor) {
      return res.status(404).json({ error: "not_found" });
    }

    res.json(doctor);
  } catch (e) {
    next(e);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }

    const created = await prisma.doctor.create({
      data: parsed.data
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await prisma.doctor.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "not_found" });
    }

    next(e);
  }
});

module.exports = router;