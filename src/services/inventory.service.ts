/**
 * Servicio de inventario — replica /api/inventory/* de Nuxt.
 */
import { getDB, saveDB, uid } from "./db";
import { ApiError, delay, requireString, requireNumber } from "./_utils";

/** GET /api/inventory?category=&lowStock= */
export async function listInventory(params: { category?: string; lowStock?: boolean } = {}) {
  await delay(220);
  const db = getDB();
  let items = [...db.inventory];
  if (params.category && params.category !== "Todos") {
    items = items.filter((i) => i.category === params.category);
  }
  if (params.lowStock) {
    items = items.filter((i) => i.stock <= i.minStock);
  }
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

/** POST /api/inventory — requiere name; stock default 0, minStock default 5, unit default "unidades". */
export async function createInventoryItem(input: {
  name: string;
  sku?: string;
  category?: string;
  stock?: number;
  minStock?: number;
  unit?: string;
  costPrice?: number;
  salePrice?: number;
}) {
  await delay(220);
  const db = getDB();
  const name = requireString(input.name, "name");
  const item = {
    _id: uid("inv"),
    name,
    sku: input.sku ?? "",
    category: input.category ?? "General",
    stock: requireNumber(input.stock ?? 0, "stock"),
    minStock: requireNumber(input.minStock ?? 5, "minStock"),
    unit: input.unit ?? "unidades",
    costPrice: requireNumber(input.costPrice ?? 0, "costPrice"),
    salePrice: requireNumber(input.salePrice ?? 0, "salePrice"),
  };
  db.inventory.push(item);
  saveDB();
  return { success: true, item };
}

/** PUT /api/inventory/:id */
export async function updateInventoryItem(
  id: string,
  patch: Partial<{ name: string; sku: string; category: string; stock: number; minStock: number; unit: string; costPrice: number; salePrice: number }>,
) {
  await delay(200);
  const db = getDB();
  const item = db.inventory.find((i) => i._id === id);
  if (!item) throw new ApiError("Item no encontrado.", 404);
  if (patch.name !== undefined) item.name = requireString(patch.name, "name");
  if (patch.sku !== undefined) item.sku = patch.sku;
  if (patch.category !== undefined) item.category = patch.category;
  if (patch.stock !== undefined) item.stock = requireNumber(patch.stock, "stock");
  if (patch.minStock !== undefined) item.minStock = requireNumber(patch.minStock, "minStock");
  if (patch.unit !== undefined) item.unit = patch.unit;
  if (patch.costPrice !== undefined) item.costPrice = requireNumber(patch.costPrice, "costPrice");
  if (patch.salePrice !== undefined) item.salePrice = requireNumber(patch.salePrice, "salePrice");
  saveDB();
  return { success: true, item };
}

/** DELETE /api/inventory/:id */
export async function deleteInventoryItem(id: string) {
  await delay(200);
  const db = getDB();
  const idx = db.inventory.findIndex((i) => i._id === id);
  if (idx === -1) throw new ApiError("Item no encontrado.", 404);
  db.inventory.splice(idx, 1);
  saveDB();
  return { success: true };
}