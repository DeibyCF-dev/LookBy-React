/**
 * Servicio de autenticación — replica los endpoints /api/auth/* del backend Nuxt
 * (server/api/auth/{login,register,logout,me,recover,reset-password}.ts).
 */
import type { PublicUser, RegisterPayload, UserRole } from "@/models";
import { REGISTERABLE_ROLES } from "@/models";
import {
  getDB,
  saveDB,
  hashPassword,
  verifyPassword,
  getSessionUserId,
  setSessionUserId,
  uid,
  now,
} from "./db";
import { ApiError, delay, isValidEmail, normalizeEmail, requireString } from "./_utils";

const ADMIN_REGISTRATION_CODE = "admin123";

export interface LoginResult {
  success: boolean;
  message: string;
  user: PublicUser | null;
}

export function toPublicUser(user: {
  _id: string;
  nombre: string;
  documento: string;
  correo: string;
  direccion: string;
  ubicacionGPS: string;
  telefono: string;
  tipoUsuario: UserRole;
  businessName: string;
  specialty: string;
  createdAt: string;
  updatedAt: string;
}): PublicUser {
  const { documento, direccion, ubicacionGPS } = user;
  return { ...user, documento, direccion, ubicacionGPS };
}

/** GET /api/auth/me — lee la "cookie de sesión" simulada y devuelve el usuario público. */
export async function fetchCurrentUser(): Promise<{ success: boolean; user: PublicUser | null }> {
  await delay(220);
  const db = getDB();
  const sessionId = getSessionUserId();
  if (!sessionId) return { success: false, user: null };
  const user = db.users.find((u) => u._id === sessionId);
  if (!user) return { success: false, user: null };
  return { success: true, user: toPublicUser(user) };
}

/** POST /api/auth/login — valida credenciales, abre sesión y devuelve el usuario. */
export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  await delay(350);
  const db = getDB();
  const correo = normalizeEmail(email);
  const user = db.users.find((u) => u.correo.toLowerCase() === correo);
  if (!user || !verifyPassword(password, user.contrasena)) {
    throw new ApiError("Credenciales incorrectas.", 401);
  }
  setSessionUserId(user._id);
  return { success: true, message: "Sesión iniciada.", user: toPublicUser(user) };
}

/** POST /api/auth/register — valida, crea USUARIO + ROL + USUARIO_ROL y abre sesión. */
export async function register(payload: RegisterPayload): Promise<LoginResult> {
  await delay(350);
  const db = getDB();

  const nombre = requireString(payload.nombre ?? payload.name, "nombre");
  const correo = normalizeEmail(requireString(payload.correo ?? payload.email, "correo"));
  const contrasena = (payload.contrasena ?? payload.password ?? "") as string;
  const rol = (payload.tipoUsuario ?? payload.role ?? "cliente") as UserRole;

  if (!isValidEmail(correo)) throw new ApiError("El correo debe ser un email válido.");
  if (contrasena.length < 6) throw new ApiError("La contraseña debe tener al menos 6 caracteres.");
  if (!REGISTERABLE_ROLES.includes(rol)) {
    throw new ApiError("El rol no es válido para registro.");
  }
  if (rol === "admin" && (payload.adminCode ?? "") !== ADMIN_REGISTRATION_CODE) {
    throw new ApiError("Código de administrador inválido.");
  }
  if (db.users.some((u) => u.correo.toLowerCase() === correo)) {
    throw new ApiError("Ya existe un usuario con ese correo.", 409);
  }

  const user = {
    _id: uid("u"),
    nombre,
    documento: payload.documento ?? "",
    correo,
    direccion: payload.direccion ?? "",
    ubicacionGPS: payload.ubicacionGPS ?? "",
    contrasena: hashPassword(contrasena),
    telefono: payload.telefono ?? payload.phone ?? "",
    tipoUsuario: rol,
    businessName: payload.businessName ?? "",
    specialty: payload.specialty ?? "",
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: now(),
    updatedAt: now(),
  };
  db.users.push(user);

  let rolRecord = db.roles.find((r) => r.nombre === rol);
  if (!rolRecord) {
    rolRecord = { _id: uid("rol"), nombre: rol, descripcion: "" };
    db.roles.push(rolRecord);
  }
  db.userRoles.push({ _id: uid("ur"), idUsuario: user._id, idRol: rolRecord._id, descripcion: "" });

  saveDB();
  setSessionUserId(user._id);

  return { success: true, message: "Cuenta creada.", user: toPublicUser(user) };
}

/** POST /api/auth/logout — cierra la sesión (equivale a limpiar la cookie). */
export async function logout(): Promise<{ success: boolean }> {
  await delay(120);
  setSessionUserId(null);
  return { success: true };
}

/** POST /api/auth/recover — genera token de recuperación (expiración 1 hora). */
export async function recover(
  email: string,
): Promise<{ success: boolean; message: string; devLink?: string }> {
  await delay(300);
  const db = getDB();
  const user = db.users.find((u) => u.correo.toLowerCase() === normalizeEmail(email));
  if (!user) {
    // mensaje genérico por seguridad (igual que Nuxt)
    return { success: true, message: "Si el correo existe, recibirás un enlace de recuperación." };
  }
  const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  saveDB();
  // En dev el backend Nuxt devuelve el link; aquí hacemos lo mismo para el demo.
  return {
    success: true,
    message: "Si el correo existe, recibirás un enlace de recuperación.",
    devLink: `${window.location.origin}/reset-password?token=${token}`,
  };
}

/** POST /api/auth/reset-password — valida token no expirado y actualiza la contraseña. */
export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
  await delay(300);
  if (newPassword.length < 6) {
    throw new ApiError("La contraseña debe tener al menos 6 caracteres.");
  }
  const db = getDB();
  const user = db.users.find((u) => u.resetPasswordToken === token);
  if (!user || !user.resetPasswordExpires || new Date(user.resetPasswordExpires).getTime() < Date.now()) {
    throw new ApiError("El token es inválido o ha expirado.", 401);
  }
  user.contrasena = hashPassword(newPassword);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  user.updatedAt = now();
  saveDB();
  return { success: true };
}