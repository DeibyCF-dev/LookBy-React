/**
 * Servicio de locales de belleza — replica /api/beauty-salons/* de Nuxt.
 * Incluye recálculo de calificacionPromedio al recibir una CALIFICACION.
 */
import { getDB, saveDB, uid, now } from "./db";
import { ApiError, delay, requireString, requireNumber } from "./_utils";
import { toPublicUser } from "./auth.service";

/** GET /api/beauty-salons?q= — ordenados por calificación descendente. */
export async function listSalons(params: { q?: string } = {}) {
  await delay(220);
  const db = getDB();
  let items = [...db.salons];
  if (params.q && params.q.trim()) {
    const q = params.q.trim().toLowerCase();
    items = items.filter((s) =>
      [s.nombreLocal, s.direccion, s.descripcion].join(" ").toLowerCase().includes(q),
    );
  }
  return items.sort((a, b) => b.calificacionPromedio - a.calificacionPromedio);
}

/** POST /api/beauty-salons — requiere nombreLocal; ownerId = usuario que abre sesión. */
export async function createSalon(input: { nombreLocal: string; horario?: string; direccion?: string; telefono?: string; descripcion?: string }, userId: string) {
  await delay(220);
  const db = getDB();
  const nombreLocal = requireString(input.nombreLocal, "nombreLocal");
  const salon = {
    _id: uid("loc"),
    nombreLocal,
    horario: input.horario ?? "Lunes a Sábado: 8:00 AM - 7:00 PM",
    calificacionPromedio: 5.0,
    totalCalificaciones: 0,
    ownerId: userId,
    direccion: input.direccion ?? "",
    telefono: input.telefono ?? "",
    imagen: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=640&h=420&fit=crop",
    descripcion: input.descripcion ?? "",
  };
  db.salons.push(salon);
  saveDB();
  return { success: true, salon };
}

/** GET /api/beauty-salons/:id — detalle + catálogos (con productos) + calificaciones (con usuario). */
export async function getSalonDetail(id: string) {
  await delay(220);
  const db = getDB();
  const salon = db.salons.find((s) => s._id === id);
  if (!salon) throw new ApiError("Local no encontrado.", 404);

  const catalogs = db.catalogs
    .filter((c) => c.idLocal === id)
    .map((c) => ({
      ...c,
      items: db.catalogProductDetails
        .filter((d) => d.idCatalogo === c._id)
        .map((d) => ({
          ...d,
          product: db.products.find((p) => p._id === d.idProducto) ?? null,
        })),
    }));

  const reviews = db.reviews
    .filter((r) => r.idSalon === id)
    .map((r) => ({
      ...r,
      usuario: db.users.find((u) => u._id === r.idUsuario) ?? null,
    }))
    .map((r) => ({ ...r, usuario: r.usuario ? toPublicUser(r.usuario) : null }));

  return { salon, catalogs, reviews };
}

/** POST /api/beauty-salons/:id/reviews — crea CALIFICACION y recalcula promedio del local. */
export async function addReview(
  salonId: string,
  input: { comentario: string; puntuacion: number },
  userId: string,
) {
  await delay(260);
  const db = getDB();
  const salon = db.salons.find((s) => s._id === salonId);
  if (!salon) throw new ApiError("Local no encontrado.", 404);

  const comentario = requireString(input.comentario, "comentario");
  const puntuacion = requireNumber(input.puntuacion, "puntuacion", 1);
  if (puntuacion > 5) throw new ApiError("La puntuación máxima es 5.");

  const review = {
    _id: uid("cal"),
    idSalon: salonId,
    idUsuario: userId,
    comentario,
    puntuacion,
    fecha: now(),
  };
  db.reviews.push(review);

  const prevTotal = salon.calificacionPromedio * salon.totalCalificaciones;
  salon.totalCalificaciones += 1;
  salon.calificacionPromedio = Math.round(((prevTotal + puntuacion) / salon.totalCalificaciones) * 10) / 10;

  saveDB();
  return { success: true, review, calificacionPromedio: salon.calificacionPromedio };
}