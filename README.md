# API Clinic 🏥

Backend de um sistema de clínica com autenticação JWT, RBAC (admin), Prisma + SQLite, agendamentos e dashboard.

## ✨ Features
- ✅ Auth: register/login com JWT
- ✅ RBAC: rotas restritas para admin
- ✅ Patients / Doctors / Appointments
- ✅ Dashboard: métricas (today / month)
- ✅ Swagger UI em `/api/docs`
- ✅ Seeds: admin + demo + dados de exemplo

## 🧰 Tech Stack
- Node.js + Express
- Prisma ORM + SQLite
- JWT + bcryptjs
- Swagger UI

## ▶️ Rodar localmente
```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run seed:demo
npm run dev