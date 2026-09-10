/**
 * Servicio de servicios — replica /api/services/* de Nuxt.
 */
import { getDB, saveDB, uid } from "./db";
import { ApiError, delay, requireString, requireNumber } from "./_utils";

/** GET /api/services?category=&active= */
export async function listServices(params: { category?: string; active?: boolean } = {}) {
  await delay(220);
  const db = getDB();
  let items = [...db.services];
  if (params.category && params.category !== "Todos") {
    items = items.filter((s) => s.category === params.category);
  }
  if (params.active !== undefined) {
    items = items.filter((s) => s.active === params.active);
  }
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

/** POST /api/services — requiere name y price (>=0); duration default 30, category default "General". */
export async function createService(input: {
  name: string;
  description?: string;
  price: number;
  duration?: number;
  category?: string;
}) {
  await delay(220);
  const db = getDB();
  const name = requireString(input.name, "name");
  const price = requireNumber(input.price, "price");
  const service = {
    _id: uid("srv"),
    name,
    description: input.description ?? "",
    price,
    duration: requireNumber(input.duration ?? 30, "duration", 5),
    category: input.category ?? "General",
    active: true,
  };
  db.services.push(service);
  saveDB();
  return { success: true, service };
}

/** PUT /api/services/:id */
export async function updateService(
  id: string,
  patch: Partial<{ name: string; description: string; price: number; duration: number; category: string; active: boolean }>,
) {
  await delay(200);
  const db = getDB();
  const service = db.services.find((s) => s._id === id);
  if (!service) throw new ApiError("Servicio no encontrado.", 404);
  if (patch.name !== undefined) service.name = requireString(patch.name, "name");
  if (patch.description !== undefined) service.description = patch.description;
  if (patch.price !== undefined) service.price = requireNumber(patch.price, "price");
  if (patch.duration !== undefined) service.duration = requireNumber(patch.duration, "duration", 5);
  if (patch.category !== undefined) service.category = patch.category;
  if (patch.active !== undefined) service.active = patch.active;
  saveDB();
  return { success: true, service };
}

/** DELETE /api/services/:id */
export async function deleteService(id: string) {
  await delay(200);
  const db = getDB();
  const idx = db.services.findIndex((s) => s._id === id);
  if (idx === -1) throw new ApiError("Servicio no encontrado.", 404);
  db.services.splice(idx, 1);
  saveDB();
  return { success: true };
}