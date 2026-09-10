/**
 * Servicio de catálogos — replica /api/catalogs/* de Nuxt.
 */
import { getDB, saveDB, uid } from "./db";
import { ApiError, delay, requireString, requireNumber } from "./_utils";

/** GET /api/catalogs?localId= — con itemCount por catálogo. */
export async function listCatalogs(params: { localId?: string } = {}) {
  await delay(200);
  const db = getDB();
  let items = [...db.catalogs];
  if (params.localId) {
    items = items.filter((c) => c.idLocal === params.localId);
  }
  return items.map((c) => ({
    ...c,
    local: db.salons.find((s) => s._id === c.idLocal) ?? null,
    itemCount: db.catalogProductDetails.filter((d) => d.idCatalogo === c._id).length,
  }));
}

/** POST /api/catalogs — requiere idLocal (debe existir) y tipoCatalogo. */
export async function createCatalog(input: { idLocal: string; tipoCatalogo: string; descripcion?: string }) {
  await delay(200);
  const db = getDB();
  const idLocal = requireString(input.idLocal, "idLocal");
  if (!db.salons.some((s) => s._id === idLocal)) {
    throw new ApiError("El local no existe.", 404);
  }
  const tipoCatalogo = requireString(input.tipoCatalogo, "tipoCatalogo");
  const catalog = {
    _id: uid("cat"),
    idLocal,
    tipoCatalogo,
    descripcion: input.descripcion ?? "",
  };
  db.catalogs.push(catalog);
  saveDB();
  return { success: true, catalog };
}

/** GET /api/catalogs/:id/items — DET_PROD_CAT con producto populado. */
export async function getCatalogItems(catalogId: string) {
  await delay(200);
  const db = getDB();
  return db.catalogProductDetails
    .filter((d) => d.idCatalogo === catalogId)
    .map((d) => ({
      ...d,
      product: db.products.find((p) => p._id === d.idProducto) ?? null,
    }));
}

/** POST /api/catalogs/:id/items — agrega/actualiza producto en catálogo (upsert). */
export async function addCatalogItem(
  catalogId: string,
  input: { idProducto: string; precioLocal: number; stockDisponible?: number; disponibilidad?: boolean },
) {
  await delay(200);
  const db = getDB();
  const catalog = db.catalogs.find((c) => c._id === catalogId);
  if (!catalog) throw new ApiError("Catálogo no encontrado.", 404);
  const product = db.products.find((p) => p._id === input.idProducto);
  if (!product) throw new ApiError("Producto no encontrado.", 404);
  const precioLocal = requireNumber(input.precioLocal, "precioLocal");

  let detail = db.catalogProductDetails.find(
    (d) => d.idCatalogo === catalogId && d.idProducto === input.idProducto,
  );
  if (!detail) {
    detail = {
      _id: uid("dpc"),
      idCatalogo: catalogId,
      idProducto: input.idProducto,
      stockDisponible: input.stockDisponible ?? 10,
      precioLocal,
      disponibilidad: input.disponibilidad ?? true,
    };
    db.catalogProductDetails.push(detail);
  } else {
    detail.precioLocal = precioLocal;
    if (input.stockDisponible !== undefined) detail.stockDisponible = requireNumber(input.stockDisponible, "stockDisponible");
    if (input.disponibilidad !== undefined) detail.disponibilidad = input.disponibilidad;
  }
  saveDB();
  return { success: true, detail };
}