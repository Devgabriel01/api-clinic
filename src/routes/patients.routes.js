const router = require("express").Router();
const { z } = require("zod");
const prisma = require("../utils/prisma");

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8)
});

router.get("/", async (req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(patients);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id }
    });

    if (!patient) {
      return res.status(404).json({ error: "not_found" });
    }

    res.json(patient);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }

    const created = await prisma.patient.create({
      data: parsed.data
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.patient.delete({
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