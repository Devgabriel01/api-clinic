require("dotenv").config();

const prisma = require("../src/utils/prisma");
const bcrypt = require("bcryptjs");

async function main() {
  const email = "admin@clinic.com";
  const password = "Admin123@";
  const name = "Admin Clinic";

  const exists = await prisma.user.findUnique({
    where: { email }
  });

  if (exists) {
    console.log("Admin already exists:", email);
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      role: "admin"
    }
  });

  console.log("✅ Admin created");
  console.log("email:", email);
  console.log("password:", password);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });