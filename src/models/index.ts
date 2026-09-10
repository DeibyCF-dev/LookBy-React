/**
 * Modelos de datos de LookBy.
 * Replican 1:1 los esquemas Mongoose del backend Nuxt original (server/models/)
 * conservando el naming del DER: campos en español con los lowkeys en inglés.
 */

export type UserRole =
  | "admin"
  | "profesional"
  | "proveedor"
  | "cliente"
  | "staff"
  | "receptionist";

export const USER_ROLES: UserRole[] = [
  "admin",
  "profesional",
  "proveedor",
  "cliente",
  "staff",
  "receptionist",
];

export const REGISTERABLE_ROLES: UserRole[] = ["admin", "profesional", "proveedor", "cliente"];

// ─── USUARIO (server/models/user.ts) ──────────────────────────────────────────

export interface IUser {
  _id: string;
  nombre: string;
  documento: string;
  correo: string;
  direccion: string;
  ubicacionGPS: string;
  contrasena: string;
  telefono: string;
  tipoUsuario: UserRole;
  businessName: string;
  specialty: string;
  resetPasswordToken: string | null;
  resetPasswordExpires: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Forma pública del usuario (sin contraseña ni tokens) — equivale al toJSON del modelo */
export type PublicUser = Omit<
  IUser,
  "contrasena" | "resetPasswordToken" | "resetPasswordExpires"
>;

// ─── ROL / USUARIO_ROL (RBAC) ─────────────────────────────────────────────────

export interface IRole {
  _id: string;
  nombre: string;
  descripcion: string;
}

export interface IUserRole {
  _id: string;
  idUsuario: string;
  idRol: string;
  descripcion: string;
}

// ─── LOCAL_BELLEZA ────────────────────────────────────────────────────────────

export interface IBeautySalon {
  _id: string;
  nombreLocal: string;
  horario: string;
  calificacionPromedio: number;
  totalCalificaciones: number;
  ownerId: string | null;
  direccion: string;
  telefono: string;
  imagen: string;
  descripcion: string;
}

// ─── PRODUCTO ─────────────────────────────────────────────────────────────────

export interface IProduct {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
}

// ─── CATALOGO / DETALLE DE CATÁLOGO ───────────────────────────────────────────

export interface ICatalog {
  _id: string;
  idLocal: string;
  tipoCatalogo: string;
  descripcion: string;
}

export interface ICatalogProductDetail {
  _id: string;
  idCatalogo: string;
  idProducto: string;
  stockDisponible: number;
  precioLocal: number;
  disponibilidad: boolean;
}

// ─── PROVEEDOR / OFERTA MAYORISTA ─────────────────────────────────────────────

export interface ISupplier {
  _id: string;
  razonSocial: string;
  contacto: string;
  userId: string | null;
  direccion: string;
  nit: string;
}

export interface ISupplierProductDetail {
  _id: string;
  idProveedor: string;
  idProducto: string;
  precioMayoreo: number;
  stockProveedor: number;
  tiempoEntrega: string;
}

// ─── PEDIDO / DETALLE DE PEDIDO ───────────────────────────────────────────────

export type OrderStatus = "Pendiente" | "En Preparación" | "Completado" | "Cancelado";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pendiente",
  "En Preparación",
  "Completado",
  "Cancelado",
];

export interface IOrder {
  _id: string;
  idUsuario: string;
  idLocal: string | null;
  fecha: string;
  estado: OrderStatus;
  montoTotal: number;
  direccionEntrega: string;
  notas: string;
}

export interface IOrderDetail {
  _id: string;
  idPedido: string;
  idProducto: string;
  cantidad: number;
  precioUnitario: number;
  subTotal: number;
}

// ─── CITA ─────────────────────────────────────────────────────────────────────

export type AppointmentStatus = "pendiente" | "confirmada" | "completada" | "cancelada";

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "pendiente",
  "confirmada",
  "completada",
  "cancelada",
];

export interface IAppointment {
  _id: string;
  clientId: string | null;
  serviceId: string | null;
  staffId: string | null;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  price: number;
  dateTime: string;
  duration: number;
  status: AppointmentStatus;
  notes: string;
}

// ─── SERVICIO ─────────────────────────────────────────────────────────────────

export interface IService {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  active: boolean;
}

// ─── CLIENTE ──────────────────────────────────────────────────────────────────

export interface IClient {
  _id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  totalVisits: number;
}

// ─── INVENTARIO ───────────────────────────────────────────────────────────────

export interface IInventoryItem {
  _id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  costPrice: number;
  salePrice: number;
}

// ─── CALIFICACION / REVIEW ────────────────────────────────────────────────────

export interface IReview {
  _id: string;
  idSalon: string;
  idUsuario: string;
  comentario: string;
  puntuacion: number;
  usuario?: PublicUser;
  fecha: string;
}

// ─── Payload JWT (equivale a server/utils/auth.ts) ────────────────────────────

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

// ─── Payload de registro (app/stores/auth.ts) ─────────────────────────────────

export interface RegisterPayload {
  nombre?: string;
  name?: string;
  documento?: string;
  correo?: string;
  email?: string;
  direccion?: string;
  ubicacionGPS?: string;
  contrasena?: string;
  password?: string;
  telefono?: string;
  phone?: string;
  tipoUsuario?: UserRole;
  role?: UserRole;
  businessName?: string;
  specialty?: string;
  adminCode?: string;
}