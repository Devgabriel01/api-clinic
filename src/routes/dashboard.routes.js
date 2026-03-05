const router = require("express").Router();
const prisma = require("../utils/prisma");
const auth = require("../middlewares/auth.middleware");

router.use(auth);

function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function startOfNextDay(date = new Date()) {
  const d = startOfDay(date);
  d.setDate(d.getDate() + 1);
  return d;
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function startOfNextMonth(date = new Date()) {
  const d = startOfMonth(date);
  d.setMonth(d.getMonth() + 1);
  return d;
}

router.get("/stats", async (req, res, next) => {
  try {
    const now = new Date();

    const todayStart = startOfDay(now);
    const tomorrowStart = startOfNextDay(now);
    const monthStart = startOfMonth(now);
    const nextMonthStart = startOfNextMonth(now);

    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      appointmentsToday,
      appointmentsThisMonth,
      cancelledThisMonth
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          dateTime: {
            gte: todayStart,
            lt: tomorrowStart
          }
        }
      }),
      prisma.appointment.count({
        where: {
          dateTime: {
            gte: monthStart,
            lt: nextMonthStart
          }
        }
      }),
      prisma.appointment.count({
        where: {
          status: "cancelled",
          dateTime: {
            gte: monthStart,
            lt: nextMonthStart
          }
        }
      })
    ]);

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      appointmentsToday,
      appointmentsThisMonth,
      cancelledThisMonth,
      period: {
        todayStart: todayStart.toISOString(),
        tomorrowStart: tomorrowStart.toISOString(),
        monthStart: monthStart.toISOString(),
        nextMonthStart: nextMonthStart.toISOString()
      }
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;