/**
 * Base de datos en localStorage de la app React.
 * Replica el rol del backend Nuxt (server/plugins/mongodb.ts + server/utils/seeder.ts):
 * persistencia + datos semilla iniciales.
 *
 * ATENCIÓN: capa mock para demo/presentación. El `hashPassword` es una codificación
 * simulada (NUNCA usar en producción; en Nuxt se usa bcryptjs real).
 */
import type {
  IUser,
  IRole,
  IUserRole,
  IBeautySalon,
  IProduct,
  ICatalog,
  ICatalogProductDetail,
  ISupplier,
  ISupplierProductDetail,
  IOrder,
  IOrderDetail,
  IAppointment,
  IService,
  IClient,
  IInventoryItem,
  IReview,
} from "@/models";

export interface DBShape {
  users: IUser[];
  roles: IRole[];
  userRoles: IUserRole[];
  salons: IBeautySalon[];
  products: IProduct[];
  catalogs: ICatalog[];
  catalogProductDetails: ICatalogProductDetail[];
  suppliers: ISupplier[];
  supplierProductDetails: ISupplierProductDetail[];
  orders: IOrder[];
  orderDetails: IOrderDetail[];
  appointments: IAppointment[];
  services: IService[];
  clients: IClient[];
  inventory: IInventoryItem[];
  reviews: IReview[];
}

const DB_KEY = "lookby_db_v1";

// ─── Helpers globales ─────────────────────────────────────────────────────────

let counter = 0;

/** Genera IDs al estilo del DER ("u-07", "loc-03"...). */
export function uid(prefix: string): string {
  counter += 1;
  const rand = (Math.random().toString(36) + Date.now().toString(36)).slice(2, 7);
  return `${prefix}-${rand}${counter}`;
}

export function now(): string {
  return new Date().toISOString();
}

/** Hash simulado (fiel a la firma api de bcryptjs, pero NO seguro). */
export function hashPassword(password: string): string {
  return `mock$${btoa(unescape(encodeURIComponent(password)))}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  if (!hash.startsWith("mock$")) return false;
  const decoded = atob(hash.slice("mock$".length));
  return decoded === password;
}

// ─── DB vacía / semilla ───────────────────────────────────────────────────────

function createEmptyDB(): DBShape {
  return {
    users: [],
    roles: [],
    userRoles: [],
    salons: [],
    products: [],
    catalogs: [],
    catalogProductDetails: [],
    suppliers: [],
    supplierProductDetails: [],
    orders: [],
    orderDetails: [],
    appointments: [],
    services: [],
    clients: [],
    inventory: [],
    reviews: [],
  };
}

function seedDatabase(): DBShape {
  const db = createEmptyDB();
  const t = now();

  // ── Roles (seed de Nuxt) ──
  db.roles = ["admin", "profesional", "proveedor", "cliente"].map((r, i) => ({
    _id: `rol-0${i + 1}`,
    nombre: r,
    descripcion:
      r === "admin"
        ? "Control total del sistema"
        : r === "profesional"
          ? "Propietario o gestor de local"
          : r === "proveedor"
            ? "Proveedor mayorista de productos"
            : "Usuario final de la plataforma",
  }));

  // ── Usuarios (seed de Nuxt: admin@lookby.com, profesional@lookby.com, proveedor@lookby.com) ──
  const admin: IUser = {
    _id: "u-01",
    nombre: "Administrador Principal",
    documento: "12.345.678-9",
    correo: "admin@lookby.com",
    direccion: "Av. Providencia 1234, Santiago",
    ubicacionGPS: "-33.4254,-70.6122",
    contrasena: hashPassword("admin123"),
    telefono: "+56 2 2345 6789",
    tipoUsuario: "admin",
    businessName: "LookBy",
    specialty: "",
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: t,
    updatedAt: t,
  };

  const profesional: IUser = {
    _id: "u-02",
    nombre: "Valentina Reyes",
    documento: "17.123.456-7",
    correo: "profesional@lookby.com",
    direccion: "Av. Providencia 2350, Providencia",
    ubicacionGPS: "-33.4254,-70.6122",
    contrasena: hashPassword("prof123"),
    telefono: "+56 9 7654 3210",
    tipoUsuario: "profesional",
    businessName: "Atelier Doré",
    specialty: "Colorimetría",
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: t,
    updatedAt: t,
  };

  const proveedor: IUser = {
    _id: "u-03",
    nombre: "ProHair Global S.A.S.",
    documento: "72.345.678-9",
    correo: "proveedor@lookby.com",
    direccion: "Industria 450, Santiago",
    ubicacionGPS: "-33.4489,-70.6693",
    contrasena: hashPassword("prov123"),
    telefono: "+56 2 2345 0000",
    tipoUsuario: "proveedor",
    businessName: "Distribuidora Andina S.A.",
    specialty: "",
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: t,
    updatedAt: t,
  };

  const cliente: IUser = {
    _id: "u-04",
    nombre: "Sofía Alarcón",
    documento: "18.234.567-8",
    correo: "sofia@email.cl",
    direccion: "Las Flores 234, Providencia",
    ubicacionGPS: "-33.4372,-70.6506",
    contrasena: hashPassword("cliente123"),
    telefono: "+56 9 8765 4321",
    tipoUsuario: "cliente",
    businessName: "",
    specialty: "",
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: t,
    updatedAt: t,
  };

  db.users = [admin, profesional, proveedor, cliente];
  db.userRoles = db.users.map((u, i) => ({
    _id: `ur-0${i + 1}`,
    idUsuario: u._id,
    idRol: `rol-0${["admin", "profesional", "proveedor", "cliente"].indexOf(u.tipoUsuario) + 1}`,
    descripcion: "",
  }));

  // ── Locales de belleza (LOCAL_BELLEZA) ──
  db.salons = [
    {
      _id: "loc-01",
      nombreLocal: "Atelier Doré",
      horario: "09:00–20:00",
      calificacionPromedio: 4.9,
      totalCalificaciones: 312,
      ownerId: profesional._id,
      direccion: "Av. Providencia 2350",
      telefono: "+56 2 2245 8890",
      imagen: "https://images.unsplash.com/photo-1764475501545-d5cc9719af1a?w=640&h=420&fit=crop",
      descripcion: "Salón de belleza premium especializado en colorimetría y tratamientos capilares.",
    },
    {
      _id: "loc-02",
      nombreLocal: "Noir & Or Barbería",
      horario: "10:00–21:00",
      calificacionPromedio: 4.8,
      totalCalificaciones: 198,
      ownerId: null,
      direccion: "Los Leones 175",
      telefono: "+56 2 2233 1122",
      imagen: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=640&h=420&fit=crop",
      descripcion: "Barbería premium con cortes clásicos y productos de grooming de alta gama.",
    },
    {
      _id: "loc-03",
      nombreLocal: "Velvet Spa & Wellness",
      horario: "08:00–22:00",
      calificacionPromedio: 5.0,
      totalCalificaciones: 87,
      ownerId: null,
      direccion: "El Golf 40, Las Condes",
      telefono: "+56 2 2224 5566",
      imagen: "https://images.unsplash.com/photo-1784704161960-26770b684595?w=640&h=420&fit=crop",
      descripcion: "Spa & bienestar: masajes, sauna y tratamientos faciales personalizados.",
    },
    {
      _id: "loc-04",
      nombreLocal: "Studio Makeover Pro",
      horario: "10:00–19:00",
      calificacionPromedio: 4.7,
      totalCalificaciones: 142,
      ownerId: null,
      direccion: "Loreto 150, Ñuñoa",
      telefono: "+56 2 2277 8899",
      imagen: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=640&h=420&fit=crop",
      descripcion: "Estudio de maquillaje profesional y academia de belleza.",
    },
  ];

  // ── Productos (PRODUCTO) ──
  db.products = [
    { _id: "p-01", nombre: "Sérum Lumière Doré 30ml", descripcion: "Vitamina C + Niacinamida", precio: 89900, imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=400&h=400&fit=crop", categoria: "Tratamiento Facial" },
    { _id: "p-02", nombre: "Kit Renovación Profunda", descripcion: "Keratina + Óleo reparador", precio: 124500, imagen: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?w=400&h=400&fit=crop", categoria: "Capilar" },
    { _id: "p-03", nombre: "Mascarilla Oro 24K 250ml", descripcion: "Hidratación intensiva", precio: 54900, imagen: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=400&fit=crop", categoria: "Tratamiento Facial" },
    { _id: "p-04", nombre: "Óleo Reparador Premium", descripcion: "Argan + Aceite de Rosa", precio: 39900, imagen: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop", categoria: "Capilar" },
    { _id: "p-05", nombre: "Paleta Editorial Nude", descripcion: "12 tonos mate y satinado", precio: 67800, imagen: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop", categoria: "Maquillaje" },
    { _id: "p-06", nombre: "Contorno Perfeccionador", descripcion: "Fórmula buildable", precio: 45200, imagen: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=400&h=400&fit=crop", categoria: "Maquillaje" },
    { _id: "p-07", nombre: "Shampoo Hidratación 500ml", descripcion: "Sin sulfatos · pH balanceado", precio: 28900, imagen: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=400&fit=crop", categoria: "Capilar" },
    { _id: "p-08", nombre: "Crema Regenerativa Noche", descripcion: "Retinol + Péptidos", precio: 76500, imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=400&h=400&fit=crop", categoria: "Tratamiento Facial" },
  ];

  // ── Catálogos (CATALOGO) + detalles (DET_PROD_CAT) ──
  db.catalogs = [
    { _id: "cat-01", idLocal: "loc-01", tipoCatalogo: "Productos Capilares", descripcion: "Shampoos, acondicionadores y tratamientos" },
    { _id: "cat-02", idLocal: "loc-01", tipoCatalogo: "Servicios Faciales", descripcion: "Sérums, mascarillas y cremas premium" },
    { _id: "cat-03", idLocal: "loc-01", tipoCatalogo: "Maquillaje Profesional", descripcion: "Paletas, contorno y acabados" },
  ];
  db.catalogProductDetails = [
    { _id: "dpc-01", idCatalogo: "cat-01", idProducto: "p-01", stockDisponible: 14, precioLocal: 89900, disponibilidad: true },
    { _id: "dpc-02", idCatalogo: "cat-01", idProducto: "p-02", stockDisponible: 7, precioLocal: 124500, disponibilidad: true },
    { _id: "dpc-03", idCatalogo: "cat-02", idProducto: "p-03", stockDisponible: 22, precioLocal: 54900, disponibilidad: true },
    { _id: "dpc-04", idCatalogo: "cat-02", idProducto: "p-08", stockDisponible: 3, precioLocal: 76500, disponibilidad: false },
    { _id: "dpc-05", idCatalogo: "cat-03", idProducto: "p-05", stockDisponible: 18, precioLocal: 67800, disponibilidad: true },
    { _id: "dpc-06", idCatalogo: "cat-03", idProducto: "p-06", stockDisponible: 0, precioLocal: 45200, disponibilidad: false },
  ];

  // ── Proveedor + ofertas mayoristas (DET_PROD_PROV) ──
  db.suppliers = [
    {
      _id: "prov-01",
      razonSocial: "Distribuidora Andina S.A.",
      contacto: "ventas@andina.cl",
      userId: proveedor._id,
      direccion: "Camino a Melipilla 8900",
      nit: "76.123.456-7",
    },
  ];
  const supDiscount: Record<string, number> = { "p-01": 52000, "p-02": 74000, "p-03": 31500, "p-04": 22800, "p-05": 39500, "p-06": 26200, "p-07": 16800, "p-08": 44500 };
  const supStock: Record<string, number> = { "p-01": 840, "p-02": 320, "p-03": 195, "p-04": 612, "p-05": 48, "p-06": 134, "p-07": 0, "p-08": 280 };
  db.supplierProductDetails = db.products.map((p) => ({
    _id: `dpp-${p._id.replace("p-", "")}`,
    idProveedor: "prov-01",
    idProducto: p._id,
    precioMayoreo: supDiscount[p._id] ?? Math.round(p.precio * 0.6),
    stockProveedor: supStock[p._id] ?? 100,
    tiempoEntrega: "2–3 días hábiles",
  }));

  // ── Pedidos (PEDIDO + DET_PEDIDO) ──
  const pedidos: Array<[string, string, number, number, string, string[], number[]]> = [
    ["PED-20481", "u-04", 89900, 1, "Completado", ["p-01", "p-03"], [89900, 54900]],
    ["PED-20365", "u-04", 124500, 1, "En Preparación", ["p-02"], [124500]],
    ["PED-20201", "u-04", 67800, 1, "Pendiente", ["p-05", "p-04"], [67800, 39900]],
  ];
  db.orders = pedidos.map(([id, idUsuario, , , estado], i) => ({
    _id: id,
    idUsuario,
    idLocal: "loc-01",
    fecha: new Date(2026, 7, 28 - i * 14, 10, 30).toISOString(),
    estado: estado as IOrder["estado"],
    montoTotal: 0,
    direccionEntrega: "Las Flores 234, Providencia",
    notas: "",
  }));
  db.orderDetails = pedidos.flatMap(([, , , , , prods, prices], i) =>
    prods.map((p, j) => ({
      _id: `od-${i}-${j}`,
      idPedido: pedidos[i][0],
      idProducto: p,
      cantidad: 1,
      precioUnitario: prices[j],
      subTotal: prices[j],
    })),
  );
  db.orders = db.orders.map((o) => {
    const subs = db.orderDetails.filter((d) => d.idPedido === o._id).reduce((s, d) => s + d.subTotal, 0);
    return { ...o, montoTotal: subs };
  });

  // ── Servicios (SERVICE) ──
  db.services = [
    { _id: "srv-01", name: "Colorimetría Completa", description: "Tratamiento de color por un profesional certificado.", price: 38000, duration: 90, category: "Cabello", active: true },
    { _id: "srv-02", name: "Corte & Peinado", description: "Corte personalizado con acabado premium.", price: 22000, duration: 45, category: "Cabello", active: true },
    { _id: "srv-03", name: "Keratina Brasileña", description: "Alisado con keratina de larga duración.", price: 52000, duration: 120, category: "Cabello", active: true },
    { _id: "srv-04", name: "Manicura Premium", description: "Manicura completa con gel polish.", price: 18000, duration: 40, category: "Uñas", active: true },
    { _id: "srv-05", name: "Facial Hidratante", description: "Limpieza profunda e hidratación intensiva.", price: 35000, duration: 60, category: "Facial", active: true },
    { _id: "srv-06", name: "Tratamiento Capilar", description: "Tratamiento reconstructor de puntas al cuero cabelludo.", price: 28000, duration: 50, category: "Cabello", active: true },
  ];

  // ── Clientes (CLIENTE) ──
  db.clients = [
    { _id: "cli-01", name: "Sofía Alarcón", phone: "+56 9 8765 4321", email: "sofia@email.cl", notes: "Cliente frecuente de colorimetría.", totalVisits: 12 },
    { _id: "cli-02", name: "Martina López", phone: "+56 9 1111 2222", email: "", notes: "", totalVisits: 3 },
    { _id: "cli-03", name: "Camila Torres", phone: "+56 9 6543 2109", email: "cami@email.cl", notes: "Prefiere atención en tarde.", totalVisits: 7 },
    { _id: "cli-04", name: "Javiera Pinto", phone: "+56 9 3333 4444", email: "", notes: "", totalVisits: 1 },
  ];

  // ── Citas (APPOINTMENT) ──
  db.appointments = [
    { _id: "CIT-001", clientId: "cli-01", serviceId: "srv-01", staffId: "u-02", clientName: "Sofía Alarcón", clientPhone: "+56 9 8765 4321", serviceName: "Colorimetría Completa", price: 38000, dateTime: new Date(2026, 8, 5, 10, 30).toISOString(), duration: 90, status: "confirmada", notes: "" },
    { _id: "CIT-002", clientId: "cli-03", serviceId: "srv-05", staffId: null, clientName: "Camila Torres", clientPhone: "+56 9 6543 2109", serviceName: "Facial Hidratante", price: 35000, dateTime: new Date(2026, 8, 9, 14, 0).toISOString(), duration: 60, status: "pendiente", notes: "" },
    { _id: "CIT-003", clientId: "cli-02", serviceId: "srv-02", staffId: null, clientName: "Martina López", clientPhone: "+56 9 1111 2222", serviceName: "Corte & Peinado", price: 22000, dateTime: new Date(2026, 8, 11, 11, 0).toISOString(), duration: 45, status: "confirmada", notes: "" },
  ];

  // ── Inventario (INVENTORY) ──
  db.inventory = [
    { _id: "inv-01", name: "Sérum Lumière Doré 30ml", sku: "SER-001", category: "Tratamiento Facial", stock: 14, minStock: 5, unit: "unidades", costPrice: 45000, salePrice: 89900 },
    { _id: "inv-02", name: "Kit Renovación Profunda", sku: "KIT-002", category: "Capilar", stock: 7, minStock: 8, unit: "unidades", costPrice: 74000, salePrice: 124500 },
    { _id: "inv-03", name: "Mascarilla Oro 24K 250ml", sku: "MAS-003", category: "Tratamiento Facial", stock: 22, minStock: 5, unit: "unidades", costPrice: 31500, salePrice: 54900 },
    { _id: "inv-04", name: "Paleta Editorial Nude", sku: "PAL-004", category: "Maquillaje", stock: 2, minStock: 6, unit: "unidades", costPrice: 39500, salePrice: 67800 },
  ];

  // ── Calificaciones (CALIFICACION / REVIEW) ──
  db.reviews = [
    { _id: "cal-01", idSalon: "loc-01", idUsuario: "u-04", comentario: "Excelente atención, quedé encantada con la colorimetría. Valentina es increíble.", puntuacion: 5, fecha: new Date(2026, 7, 25).toISOString() },
    { _id: "cal-02", idSalon: "loc-02", idUsuario: "u-04", comentario: "El corte quedó perfecto. Ambiente muy premium.", puntuacion: 4, fecha: new Date(2026, 7, 10).toISOString() },
  ];

  return db;
}

// ─── Acceso a la DB ───────────────────────────────────────────────────────────

function loadRaw(): DBShape | null {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DBShape;
  } catch {
    return null;
  }
}

function persist(db: DBShape) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

let cached: DBShape | null = null;

/** Devuelve la DB actual (la siembra la primera vez). Es la instancia viva. */
export function getDB(): DBShape {
  if (cached) return cached;
  let db = loadRaw();
  if (!db) {
    db = seedDatabase();
    persist(db);
  }
  cached = db;
  return cached;
}

/** Persiste los cambios de la instancia devuelta por getDB(). */
export function saveDB() {
  if (cached) persist(cached);
}

/** Reinicia el mock a sus datos semilla originales. */
export function resetDB(): DBShape {
  cached = seedDatabase();
  persist(cached);
  return cached;
}

/** Borra TODOS los datos del mock (equivale a limpiar MongoDB). */
export function dropDB() {
  cached = null;
  localStorage.removeItem(DB_KEY);
}

// token de sesión simulada (equivale a la cookie httpOnly lookby_auth_token)
const SESSION_KEY = "lookby_session";

export function getSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionUserId(userId: string | null) {
  if (userId === null) {
    localStorage.removeItem(SESSION_KEY);
  } else {
    localStorage.setItem(SESSION_KEY, userId);
  }
}