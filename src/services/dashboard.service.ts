/**
 * Servicio de dashboard — replica GET /api/dashboard/stats de Nuxt.
 * Ejecuta las 6 queries en paralelo (aquí en un solo pase) y devuelve el agregado.
 */
import { getDB } from "./db";
import { delay } from "./_utils";

function startOfMonth(): number {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
}

function todayStart(): number {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export async function getDashboardStats() {
  await delay(300);
  const db = getDB();

  const appointments = [...db.appointments];
  const monthStart = startOfMonth();
  const dayStart = todayStart();

  const appointmentsMonth = appointments.filter((a) => new Date(a.dateTime).getTime() >= monthStart).length;
  const appointmentsToday = appointments.filter((a) => new Date(a.dateTime).getTime() >= dayStart).length;

  const revenueMonth = appointments
    .filter((a) => a.status === "completada" && new Date(a.dateTime).getTime() >= monthStart)
    .reduce((s, a) => s + a.price, 0);

  const lowStockCount = db.inventory.filter((i) => i.stock <= i.minStock).length;

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    .slice(0, 5)
    .map((a) => ({
      ...a,
      client: a.clientId ? (db.clients.find((c) => c._id === a.clientId) ?? null) : null,
    }));

  return {
    stats: {
      totalClients: db.clients.length,
      appointmentsMonth,
      appointmentsToday,
      revenueMonth,
      lowStockCount,
    },
    recentAppointments,
  };
}