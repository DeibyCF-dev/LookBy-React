/**
 * Servicio de clientes — replica /api/clients/* de Nuxt.
 */
import { getDB, saveDB, uid } from "./db";
import { ApiError, delay, requireString } from "./_utils";

/** GET /api/clients?q= — lista clientes (búsqueda por nombre/teléfono/email). */
export async function listClients(params: { q?: string } = {}) {
  await delay(250);
  const db = getDB();
  let items = [...db.clients];
  if (params.q && params.q.trim()) {
    const q = params.q.trim().toLowerCase();
    items = items.filter((c) => [c.name, c.phone, c.email].join(" ").toLowerCase().includes(q));
  }
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

/** POST /api/clients — requiere name y phone. */
export async function createClient(input: { name: string; phone: string; email?: string; notes?: string }) {
  await delay(260);
  const db = getDB();
  const name = requireString(input.name, "name");
  const phone = requireString(input.phone, "phone");
  if (db.clients.some((c) => c.phone === phone)) {
    throw new ApiError("Ya existe un cliente con ese teléfono.", 409);
  }
  const client = {
    _id: uid("cli"),
    name,
    phone,
    email: input.email ?? "",
    notes: input.notes ?? "",
    totalVisits: 0,
  };
  db.clients.push(client);
  saveDB();
  return { success: true, client };
}

/** PUT /api/clients/:id */
export async function updateClient(
  id: string,
  patch: Partial<{ name: string; phone: string; email: string; notes: string; totalVisits: number }>,
) {
  await delay(200);
  const db = getDB();
  const client = db.clients.find((c) => c._id === id);
  if (!client) throw new ApiError("Cliente no encontrado.", 404);
  if (patch.name !== undefined) client.name = requireString(patch.name, "name");
  if (patch.phone !== undefined) client.phone = requireString(patch.phone, "phone");
  if (patch.email !== undefined) client.email = patch.email;
  if (patch.notes !== undefined) client.notes = patch.notes;
  if (patch.totalVisits !== undefined) client.totalVisits = patch.totalVisits;
  saveDB();
  return { success: true, client };
}

/** DELETE /api/clients/:id */
export async function deleteClient(id: string) {
  await delay(200);
  const db = getDB();
  const idx = db.clients.findIndex((c) => c._id === id);
  if (idx === -1) throw new ApiError("Cliente no encontrado.", 404);
  db.clients.splice(idx, 1);
  saveDB();
  return { success: true };
}