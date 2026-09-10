/**
 * Servicio de proveedores — replica /api/suppliers/* de Nuxt.
 * Incluye publicación/actualización de ofertas mayoristas (DET_PROD_PROV, upsert).
 */
import { getDB, saveDB, uid } from "./db";
import { ApiError, delay, requireString, requireNumber } from "./_utils";

/** GET /api/suppliers — proveedores con sus productos ofrecidos populados. */
export async function listSuppliers() {
  await delay(220);
  const db = getDB();
  return db.suppliers.map((s) => ({
    ...s,
    products: db.supplierProductDetails
      .filter((d) => d.idProveedor === s._id)
      .map((d) => ({
        ...d,
        product: db.products.find((p) => p._id === d.idProducto) ?? null,
      })),
  }));
}

/** POST /api/suppliers — crea perfil proveedor asociado al usuario logueado. */
export async function createSupplier(input: { razonSocial: string; contacto: string; direccion?: string; nit?: string }, userId: string) {
  await delay(220);
  const db = getDB();
  const razonSocial = requireString(input.razonSocial, "razonSocial");
  const contacto = requireString(input.contacto, "contacto");
  const supplier = {
    _id: uid("prov"),
    razonSocial,
    contacto,
    userId,
    direccion: input.direccion ?? "",
    nit: input.nit ?? "",
  };
  db.suppliers.push(supplier);
  saveDB();
  return { success: true, supplier };
}

/** POST /api/suppliers/supply-items — publica/actualiza oferta mayorista (upsert). */
export async function upsertSupplyItem(input: {
  idProveedor: string;
  idProducto: string;
  precioMayoreo: number;
  stockProveedor?: number;
  tiempoEntrega?: string;
}) {
  await delay(220);
  const db = getDB();
  const supplier = db.suppliers.find((s) => s._id === input.idProveedor);
  if (!supplier) throw new ApiError("Proveedor no encontrado.", 404);
  const product = db.products.find((p) => p._id === input.idProducto);
  if (!product) throw new ApiError("Producto no encontrado.", 404);
  const precioMayoreo = requireNumber(input.precioMayoreo, "precioMayoreo");

  let detail = db.supplierProductDetails.find(
    (d) => d.idProveedor === input.idProveedor && d.idProducto === input.idProducto,
  );
  if (!detail) {
    detail = {
      _id: uid("dpp"),
      idProveedor: input.idProveedor,
      idProducto: input.idProducto,
      precioMayoreo,
      stockProveedor: requireNumber(input.stockProveedor ?? 100, "stockProveedor"),
      tiempoEntrega: input.tiempoEntrega ?? "24 a 48 horas",
    };
    db.supplierProductDetails.push(detail);
  } else {
    detail.precioMayoreo = precioMayoreo;
    if (input.stockProveedor !== undefined) detail.stockProveedor = requireNumber(input.stockProveedor, "stockProveedor");
    if (input.tiempoEntrega !== undefined) detail.tiempoEntrega = input.tiempoEntrega;
  }
  saveDB();
  return { success: true, detail };
}