const router = require("express").Router();
const { z } = require("zod");
const prisma = require("../utils/prisma");
const auth = require("../middlewares/auth.middleware");

router.use(auth);

const createSchema = z.object({
  patientId: z.string().min(5),
  doctorId: z.string().min(5),
  dateTime: z.string().datetime(), // ISO string
  notes: z.string().optional(),
});

// listar agendamentos (com patient e doctor)
router.get("/", async (req, res, next) => {
  try {
    const items = await prisma.appointment.findMany({
      orderBy: { dateTime: "asc" },
      include: { patient: true, doctor: true },
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// criar agendamento
router.post("/", async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });

    const { patientId, doctorId, dateTime, notes } = parsed.data;

    // (opcional) valida existência de patient/doctor
    const [p, d] = await Promise.all([
      prisma.patient.findUnique({ where: { id: patientId } }),
      prisma.doctor.findUnique({ where: { id: doctorId } }),
    ]);
    if (!p) return res.status(404).json({ error: "patient_not_found" });
    if (!d) return res.status(404).json({ error: "doctor_not_found" });

    const created = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        dateTime: new Date(dateTime),
        notes: notes || null,
      },
      include: { patient: true, doctor: true },
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// cancelar
router.patch("/:id/cancel", async (req, res, next) => {
  try {
    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: "cancelled" },
    });
    res.json(updated);
  } catch (e) {
    if (e.code === "P2025") return res.status(404).json({ error: "not_found" });
    next(e);
  }
});

module.exports = router;