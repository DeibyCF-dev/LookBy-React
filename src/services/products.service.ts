/**
 * Servicio de productos — replica /api/products/* de Nuxt.
 */
import { getDB, saveDB, uid } from "./db";
import { ApiError, delay, requireString, requireNumber } from "./_utils";

const DEFAULT_IMG = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop";

/** GET /api/products?q=&categoria= */
export async function listProducts(params: { q?: string; categoria?: string } = {}) {
  await delay(200);
  const db = getDB();
  let items = [...db.products];
  if (params.q && params.q.trim()) {
    const q = params.q.trim().toLowerCase();
    items = items.filter((p) => `${p.nombre} ${p.descripcion}`.toLowerCase().includes(q));
  }
  if (params.categoria && params.categoria !== "Todos") {
    items = items.filter((p) => p.categoria === params.categoria);
  }
  return items;
}

/** POST /api/products — requiere nombre y precio (>=0). */
export async function createProduct(input: { nombre: string; descripcion?: string; precio: number; imagen?: string; categoria?: string }) {
  await delay(220);
  const db = getDB();
  const nombre = requireString(input.nombre, "nombre");
  const precio = requireNumber(input.precio, "precio");
  const product = {
    _id: uid("p"),
    nombre,
    descripcion: input.descripcion ?? "",
    precio,
    imagen: input.imagen ?? DEFAULT_IMG,
    categoria: input.categoria ?? "General",
  };
  db.products.push(product);
  saveDB();
  return { success: true, product };
}