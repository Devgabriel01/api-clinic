const router = require("express").Router();
const { z } = require("zod");

let patients = [
  { id: 1, name: "Maria Silva", phone: "99999-0000" }
];

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8)
});

router.get("/", (req, res) => res.json(patients));

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = patients.find(x => x.id === id);
  if (!p) return res.status(404).json({ error: "not_found" });
  res.json(p);
});

router.post("/", (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });

  const newPatient = { id: Date.now(), ...parsed.data };
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  patients = patients.filter(x => x.id !== id);
  res.status(204).send();
});

module.exports = router;