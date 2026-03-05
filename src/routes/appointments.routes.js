const router = require("express").Router();
const { z } = require("zod");
const prisma = require("../utils/prisma");
const auth = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/requireAdmin.middleware");

router.use(auth);

const createSchema = z.object({
  patientId: z.string().min(5),
  doctorId: z.string().min(5),
  dateTime: z.string().datetime(),
  notes: z.string().optional()
});

router.get("/", async (req, res, next) => {
  try {
    const items = await prisma.appointment.findMany({
      orderBy: { dateTime: "asc" },
      include: {
        patient: true,
        doctor: true
      }
    });

    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }

    const { patientId, doctorId, dateTime, notes } = parsed.data;

    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({ where: { id: patientId } }),
      prisma.doctor.findUnique({ where: { id: doctorId } })
    ]);

    if (!patient) {
      return res.status(404).json({ error: "patient_not_found" });
    }

    if (!doctor) {
      return res.status(404).json({ error: "doctor_not_found" });
    }

    const created = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        dateTime: new Date(dateTime),
        notes: notes || null
      },
      include: {
        patient: true,
        doctor: true
      }
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id/cancel", requireAdmin, async (req, res, next) => {
  try {
    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: "cancelled" }
    });

    res.json(updated);
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "not_found" });
    }

    next(e);
  }
});

module.exports = router;