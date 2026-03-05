require("dotenv").config();

const prisma = require("../src/utils/prisma");
const bcrypt = require("bcryptjs");

async function main() {
  // 1) Admin
  const adminEmail = "admin@clinic.com";
  const adminPassword = "Admin123@";

  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminExists) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: { name: "Admin Clinic", email: adminEmail, password: hash, role: "admin" },
    });
    console.log("✅ Admin created:", adminEmail);
  } else {
    console.log("ℹ️ Admin already exists:", adminEmail);
  }

  // 2) Demo user
  const demoEmail = "demo@clinic.com";
  const demoPassword = "Demo123@";

  const demoExists = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!demoExists) {
    const hash = await bcrypt.hash(demoPassword, 10);
    await prisma.user.create({
      data: { name: "Demo User", email: demoEmail, password: hash, role: "user" },
    });
    console.log("✅ Demo user created:", demoEmail);
  } else {
    console.log("ℹ️ Demo user already exists:", demoEmail);
  }

  // 3) Doctors
  const doctorsToCreate = [
    { name: "Dra. Ana", specialty: "Cardiologia" },
    { name: "Dr. Bruno", specialty: "Clínico Geral" },
  ];

  for (const d of doctorsToCreate) {
    const exists = await prisma.doctor.findFirst({ where: { name: d.name, specialty: d.specialty } });
    if (!exists) await prisma.doctor.create({ data: d });
  }

  const doctors = await prisma.doctor.findMany();
  console.log(`✅ Doctors ready: ${doctors.length}`);

  // 4) Patients
  const patientsToCreate = [
    { name: "João Silva", phone: "98999-0000" },
    { name: "Maria Souza", phone: "11999-1111" },
  ];

  for (const p of patientsToCreate) {
    const exists = await prisma.patient.findFirst({ where: { name: p.name, phone: p.phone } });
    if (!exists) await prisma.patient.create({ data: p });
  }

  const patients = await prisma.patient.findMany();
  console.log(`✅ Patients ready: ${patients.length}`);

  // 5) Appointments (2 consultas próximas)
  const [doc1, doc2] = doctors;
  const [pat1, pat2] = patients;

  const now = new Date();
  const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const apptsToCreate = [
    { patientId: pat1.id, doctorId: doc1.id, dateTime: in2Hours, notes: "Retorno" },
    { patientId: pat2.id, doctorId: doc2.id, dateTime: tomorrow, notes: "Primeira consulta" },
  ];

  for (const a of apptsToCreate) {
    const exists = await prisma.appointment.findFirst({
      where: { patientId: a.patientId, doctorId: a.doctorId, dateTime: a.dateTime },
    });
    if (!exists) await prisma.appointment.create({ data: a });
  }

  const appointments = await prisma.appointment.findMany();
  console.log(`✅ Appointments ready: ${appointments.length}`);

  console.log("\n=== DEMO CREDENTIALS ===");
  console.log("ADMIN:", adminEmail, adminPassword);
  console.log("DEMO :", demoEmail, demoPassword);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => prisma.$disconnect());