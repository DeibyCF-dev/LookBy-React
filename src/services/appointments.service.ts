/**
 * Servicio de citas — replica los endpoints /api/appointments/* de Nuxt.
 * Incluye reglas de negocio: auto-creación de CLIENTE por teléfono e incremento
 * de totalVisits al completarse la cita.
 */
import type { AppointmentStatus, IAppointment } from "@/models";
import { APPOINTMENT_STATUSES } from "@/models";
import { getDB, saveDB, uid, now } from "./db";
import { ApiError, delay, requireString, requireNumber, toISO } from "./_utils";

function attachRelations(a: IAppointment) {
  const db = getDB();
  const client = a.clientId ? (db.clients.find((c) => c._id === a.clientId) ?? null) : null;
  const serviceService = a.serviceId ? (db.services.find((s) => s._id === a.serviceId) ?? null) : null;
  const staff = a.staffId ? (db.users.find((u) => u._id === a.staffId) ?? null) : null;
  return { ...a, client, service: serviceService ?? null, staff: staff ?? null };
}

/** GET /api/appointments?status=&staffId=&date=&from=&to= — ordenadas por fecha asc. */
export async function listAppointments(params: {
  status?: AppointmentStatus;
  staffId?: string;
  date?: string;
  from?: string;
  to?: string;
} = {}) {
  await delay(250);
  const db = getDB();
  let items = [...db.appointments];

  if (params.status) {
    items = items.filter((a) => a.status === params.status);
  }
  if (params.staffId) {
    items = items.filter((a) => a.staffId === params.staffId);
  }
  if (params.date) {
    const d = toISO(params.date);
    const start = d.getTime();
    const end = start + 24 * 60 * 60 * 1000;
    items = items.filter((a) => {
      const t = new Date(a.dateTime).getTime();
      return t >= start && t < end;
    });
  } else if (params.from && params.to) {
    const f = new Date(params.from).getTime();
    const t = new Date(params.to).getTime();
    items = items.filter((a) => {
      const at = new Date(a.dateTime).getTime();
      return at >= f && at <= t;
    });
  }

  return items.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()).map(attachRelations);
}

/** POST /api/appointments — crea cita y auto-crea CLIENTE si el teléfono no existe. */
export async function createAppointment(input: {
  clientName: string;
  clientPhone: string;
  serviceId?: string;
  staffId?: string;
  dateTime: string;
  notes?: string;
}) {
  await delay(300);
  const db = getDB();
  const clientName = requireString(input.clientName, "clientName");
  const clientPhone = requireString(input.clientPhone, "clientPhone");
  const dateTime = new Date(input.dateTime);
  if (Number.isNaN(dateTime.getTime())) throw new ApiError("Fecha inválida.");

  let serviceName = "";
  let price = 0;
  let duration = 30;
  if (input.serviceId) {
    const service = db.services.find((s) => s._id === input.serviceId);
    if (service) {
      serviceName = service.name;
      price = service.price;
      duration = service.duration;
    }
  }

  let client = db.clients.find((c) => c.phone === clientPhone);
  if (!client) {
    client = {
      _id: uid("cli"),
      name: clientName,
      phone: clientPhone,
      email: "",
      notes: "",
      totalVisits: 0,
    };
    db.clients.push(client);
  }

  const appointment: IAppointment = {
    _id: uid("CIT"),
    clientId: client._id,
    serviceId: input.serviceId ?? null,
    staffId: input.staffId ?? null,
    clientName,
    clientPhone,
    serviceName,
    price,
    dateTime: dateTime.toISOString(),
    duration,
    status: "pendiente",
    notes: input.notes ?? "",
  };
  db.appointments.push(appointment);
  saveDB();
  return { success: true, appointment: attachRelations(appointment) };
}

/** PUT /api/appointments/:id — si pasa a "completada" incrementa totalVisits del CLIENTE. */
export async function updateAppointment(id: string, patch: Partial<IAppointment>) {
  await delay(250);
  const db = getDB();
  const appointment = db.appointments.find((a) => a._id === id);
  if (!appointment) throw new ApiError("Cita no encontrada.", 404);

  if (patch.status !== undefined && !APPOINTMENT_STATUSES.includes(patch.status)) {
    throw new ApiError("Estado inválido de cita.");
  }
  if (patch.dateTime !== undefined && Number.isNaN(new Date(patch.dateTime).getTime())) {
    throw new ApiError("Fecha inválida.");
  }
  if (patch.duration !== undefined) appointment.duration = requireNumber(patch.duration, "duration", 5);
  if (patch.price !== undefined) appointment.price = requireNumber(patch.price, "price");
  if (patch.notes !== undefined) appointment.notes = patch.notes;
  if (patch.staffId !== undefined) appointment.staffId = patch.staffId;
  if (patch.dateTime !== undefined) appointment.dateTime = new Date(patch.dateTime).toISOString();

  const wasCompleted = appointment.status === "completada";
  if (patch.status !== undefined) appointment.status = patch.status;
  if (!wasCompleted && appointment.status === "completada" && appointment.clientId) {
    const client = db.clients.find((c) => c._id === appointment.clientId);
    if (client) client.totalVisits += 1;
  }

  saveDB();
  return { success: true, appointment: attachRelations(appointment) };
}

/** DELETE /api/appointments/:id */
export async function deleteAppointment(id: string) {
  await delay(250);
  const db = getDB();
  const idx = db.appointments.findIndex((a) => a._id === id);
  if (idx === -1) throw new ApiError("Cita no encontrada.", 404);
  db.appointments.splice(idx, 1);
  saveDB();
  return { success: true };
}

/** GET /api/appointments/occupied-slots?date= — horas ocupadas (excluye canceladas). */
export async function getOccupiedSlots(date: string) {
  await delay(200);
  const db = getDB();
  const d = toISO(date);
  const start = d.getTime();
  const end = start + 24 * 60 * 60 * 1000;
  return db.appointments
    .filter((a) => {
      if (a.status === "cancelada") return false;
      const t = new Date(a.dateTime).getTime();
      return t >= start && t < end;
    })
    .map((a) => {
      const dt = new Date(a.dateTime);
      return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
    });
}

/** GET /api/client/my-appointments — citas del cliente logueado (por teléfono/correo/nombre). */
export async function getMyAppointments(user: { telefono: string; correo: string; nombre: string }) {
  await delay(250);
  const db = getDB();
  const haystack = [user.telefono, user.correo, user.nombre].map((v) => v.toLowerCase());
  const clientIds = db.clients
    .filter((c) => haystack.includes(c.phone.toLowerCase()) || haystack.includes(c.email.toLowerCase()))
    .map((c) => c._id);
  const items = db.appointments.filter((a) => {
    if (haystack.includes(a.clientName.toLowerCase()) || haystack.includes(a.clientPhone.toLowerCase())) return true;
    return a.clientId != null && clientIds.includes(a.clientId);
  });
  return items.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()).map(attachRelations);
}