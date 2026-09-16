/**
 * LookBy - Motor de Base de Datos en localStorage
 */
import { SALONS, PRODUCTS, DEMO_ACCOUNTS, INITIAL_CITAS, INITIAL_PEDIDOS, INITIAL_REVIEWS } from "./data.js";
import { uid, now } from "./utils.js";

const DB_KEY = "lookby_db_v1";

const INITIAL_DB = {
  users: [
    {
      _id: "u-01",
      nombre: "Sofía Alarcón",
      correo: "sofia@email.cl",
      telefono: "+56 9 8765 4321",
      tipoUsuario: "cliente",
      documento: "18.234.567-8",
      contrasena: "cliente123",
      direccion: "Av. Providencia 1200",
      createdAt: "2026-08-01T10:00:00.000Z"
    },
    {
      _id: "u-02",
      nombre: "Valentina Reyes",
      correo: "profesional@lookby.com",
      telefono: "+56 9 7654 3210",
      tipoUsuario: "profesional",
      documento: "17.123.456-7",
      contrasena: "prof123",
      businessName: "Atelier Doré",
      specialty: "Colorimetría y Estilismo",
      direccion: "Av. Providencia 2350",
      createdAt: "2026-08-01T10:00:00.000Z"
    },
    {
      _id: "u-03",
      nombre: "Distribuidora Andina S.A.",
      correo: "proveedor@lookby.com",
      telefono: "+56 2 2345 6789",
      tipoUsuario: "proveedor",
      documento: "72.345.678-9",
      contrasena: "prov123",
      businessName: "Distribuidora Andina S.A.",
      direccion: "Camino a Melipilla 4500",
      createdAt: "2026-08-01T10:00:00.000Z"
    },
    {
      _id: "u-admin",
      nombre: "Administrador Global",
      correo: "admin@lookby.com",
      telefono: "+56 2 9999 8888",
      tipoUsuario: "admin",
      documento: "11.111.111-1",
      contrasena: "admin123",
      direccion: "Oficinas Centrales LookBy",
      createdAt: "2026-08-01T10:00:00.000Z"
    }
  ],
  salons: SALONS,
  products: PRODUCTS,
  citas: INITIAL_CITAS,
  pedidos: INITIAL_PEDIDOS,
  reviews: INITIAL_REVIEWS,
  cart: [],
  wholesaleProducts: [
    { idDetalleProv: "dpp-01", idProducto: "p-01", nombre: "Sérum Lumière Doré 30ml", categoria: "Tratamiento Facial", imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=300&h=300&fit=crop", precioMayoreo: 52000, precioRetail: 89900, stockProveedor: 840, tiempoEntrega: "2–3 días hábiles", moq: 6 },
    { idDetalleProv: "dpp-02", idProducto: "p-02", nombre: "Kit Renovación Profunda", categoria: "Capilar", imagen: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?w=300&h=300&fit=crop", precioMayoreo: 74000, precioRetail: 124500, stockProveedor: 320, tiempoEntrega: "1–2 días hábiles", moq: 4 },
    { idDetalleProv: "dpp-03", idProducto: "p-03", nombre: "Mascarilla Oro 24K 250ml", categoria: "Tratamiento Facial", imagen: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=300&h=300&fit=crop", precioMayoreo: 31500, precioRetail: 54900, stockProveedor: 195, tiempoEntrega: "3–5 días hábiles", moq: 12 },
    { idDetalleProv: "dpp-04", idProducto: "p-04", nombre: "Óleo Reparador Premium", categoria: "Capilar", imagen: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&h=300&fit=crop", precioMayoreo: 22800, precioRetail: 39900, stockProveedor: 612, tiempoEntrega: "2–3 días hábiles", moq: 10 }
  ],
  wholesaleOrders: [
    { id: "ORD-001", negocio: "Atelier Doré", productos: "Sérum Lumière × 12 · Mascarilla Oro × 24", fecha: "01 sep 2026", total: 1380000, estado: "Enviado" },
    { id: "ORD-002", negocio: "Studio Makeover Pro", productos: "Paleta Editorial × 6 · Contorno × 12", fecha: "29 ago 2026", total: 551400, estado: "Procesando" },
    { id: "ORD-003", negocio: "Noir & Or Barbería", productos: "Shampoo Hidratación × 48", fecha: "27 ago 2026", total: 806400, estado: "Recibido" }
  ],
  businessInventory: [
    { idDetalleCat: "dpc-01", idProducto: "p-01", nombre: "Sérum Lumière Doré 30ml", imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=200&h=200&fit=crop", stockDisponible: 14, precioLocal: 89900, disponibilidad: true, catalogo: "Productos Capilares" },
    { idDetalleCat: "dpc-02", idProducto: "p-02", nombre: "Kit Renovación Profunda", imagen: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?w=200&h=200&fit=crop", stockDisponible: 7, precioLocal: 124500, disponibilidad: true, catalogo: "Productos Capilares" },
    { idDetalleCat: "dpc-03", idProducto: "p-03", nombre: "Mascarilla Oro 24K 250ml", imagen: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=200&h=200&fit=crop", stockDisponible: 22, precioLocal: 54900, disponibilidad: true, catalogo: "Servicios Faciales" },
    { idDetalleCat: "dpc-04", idProducto: "p-08", nombre: "Crema Regenerativa Noche", imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=200&h=200&fit=crop", stockDisponible: 3, precioLocal: 76500, disponibilidad: false, catalogo: "Servicios Faciales" }
  ],
  auditLog: [
    { id: 1, accion: "Usuario creado", entidad: "USUARIO", detalle: "sofia@email.cl registrada como Cliente", fecha: "03 sep 2026 · 14:32", actor: "Sistema", nivel: "info" },
    { id: 2, accion: "Estado modificado", entidad: "LOCAL_BELLEZA", detalle: "Velvet Spa → estado: Revisión", fecha: "03 sep 2026 · 11:15", actor: "Admin", nivel: "warning" },
    { id: 3, accion: "Rol asignado", entidad: "USUARIO_ROL", detalle: "Marcos Vidal → Profesional", fecha: "02 sep 2026 · 09:40", actor: "Admin", nivel: "info" }
  ]
};

/**
 * Obtiene la base de datos completa de localStorage
 */
export function getDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      saveDb(INITIAL_DB);
      return JSON.parse(JSON.stringify(INITIAL_DB));
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error al leer base de datos:", e);
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }
}

/**
 * Guarda la base de datos completa en localStorage
 * @param {object} db
 */
export function saveDb(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Error al guardar base de datos:", e);
  }
}

/**
 * Resetea la base de datos a sus valores iniciales
 */
export function resetDb() {
  saveDb(INITIAL_DB);
  return INITIAL_DB;
}

// ─── Helpers de Carrito ───────────────────────────────────────────────────────

export function getCart() {
  const db = getDb();
  return db.cart || [];
}

export function addToCart(product) {
  const db = getDb();
  const cart = db.cart || [];
  const existing = cart.find((i) => i.idProducto === product.idProducto);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      idProducto: product.idProducto,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      qty: 1
    });
  }
  db.cart = cart;
  saveDb(db);
  window.dispatchEvent(new CustomEvent("lookby:cart-updated"));
}

export function updateCartQty(idProducto, delta) {
  const db = getDb();
  let cart = db.cart || [];
  const item = cart.find((i) => i.idProducto === idProducto);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.idProducto !== idProducto);
  }
  db.cart = cart;
  saveDb(db);
  window.dispatchEvent(new CustomEvent("lookby:cart-updated"));
}

export function clearCart() {
  const db = getDb();
  db.cart = [];
  saveDb(db);
  window.dispatchEvent(new CustomEvent("lookby:cart-updated"));
}

// ─── Helpers de Citas ─────────────────────────────────────────────────────────

export function addCita(citaData) {
  const db = getDb();
  const nuevaCita = {
    id: uid("CIT"),
    ...citaData,
    estado: "Confirmada",
    createdAt: now()
  };
  db.citas = [nuevaCita, ...(db.citas || [])];
  saveDb(db);
  return nuevaCita;
}

// ─── Helpers de Reseñas ───────────────────────────────────────────────────────

export function addReview(reviewData) {
  const db = getDb();
  const nuevaReview = {
    idCalificacion: uid("cal"),
    fecha: formatDate(new Date()),
    ...reviewData
  };
  db.reviews = [nuevaReview, ...(db.reviews || [])];
  saveDb(db);
  return nuevaReview;
}
