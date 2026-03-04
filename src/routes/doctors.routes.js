const router = require("express").Router();
const { z } = require("zod");
const prisma = require("../utils/prisma");
const auth = require("../middlewares/auth.middleware");

const schema = z.object({
  name: z.string().min(2),
  specialty: z.string().min(2),
});

router.use(auth);

// listar médicos
router.get("/", async (req, res, next) => {
  try {
    const doctors = await prisma.doctor.findMany({ orderBy: { createdAt: "desc" } });
    res.json(doctors);
  } catch (e) {
    next(e);
  }
});

// buscar por id
router.get("/:id", async (req, res, next) => {
  try {
    const d = await prisma.doctor.findUnique({ where: { id: req.params.id } });
    if (!d) return res.status(404).json({ error: "not_found" });
    res.json(d);
  } catch (e) {
    next(e);
  }
});

// criar médico
router.post("/", async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });

    const created = await prisma.doctor.create({ data: parsed.data });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// deletar médico
router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.doctor.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === "P2025") return res.status(404).json({ error: "not_found" });
    next(e);
  }
});

module.exports = router;