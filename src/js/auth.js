/**
 * LookBy - Sistema de Autenticación y Control de Sesión
 */
import { getDb, saveDb } from "./db.js";
import { uid, now } from "./utils.js";

const SESSION_KEY = "lookby_session_user";

/**
 * Retorna el usuario actualmente autenticado o null
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Inicia sesión con correo y contraseña
 * @param {string} email
 * @param {string} password
 * @returns {object} Usuario autenticado
 */
export function login(email, password) {
  const db = getDb();
  const user = db.users.find(
    (u) => u.correo.toLowerCase() === email.toLowerCase() && u.contrasena === password
  );

  if (!user) {
    throw new Error("Credenciales inválidas. Por favor verifica tu correo y contraseña.");
  }

  // Guardar usuario en sesión (sin contraseña)
  const sessionUser = { ...user };
  delete sessionUser.contrasena;

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

/**
 * Registra un nuevo usuario en el sistema
 * @param {object} payload
 * @returns {object} Usuario registrado
 */
export function register(payload) {
  const db = getDb();
  const existing = db.users.find(
    (u) => u.correo.toLowerCase() === payload.correo.toLowerCase()
  );

  if (existing) {
    throw new Error("Ya existe un usuario registrado con este correo electrónico.");
  }

  const newUser = {
    _id: uid("u"),
    nombre: payload.nombre,
    correo: payload.correo,
    telefono: payload.telefono || "",
    tipoUsuario: payload.tipoUsuario || "cliente",
    documento: payload.documento || "Sin documento",
    contrasena: payload.contrasena,
    direccion: payload.direccion || "",
    createdAt: now()
  };

  db.users.push(newUser);
  saveDb(db);

  const sessionUser = { ...newUser };
  delete sessionUser.contrasena;

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

/**
 * Cierra la sesión activa
 */
export function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "login.html";
}

/**
 * Obtiene la ruta principal correspondiente a un rol
 * @param {string} role
 * @returns {string}
 */
export function getRoleHomeRoute(role) {
  switch (role) {
    case "admin":
      return "superadmin.html";
    case "profesional":
      return "negocio.html";
    case "proveedor":
      return "proveedor.html";
    case "cliente":
    default:
      return "cliente.html";
  }
}

/**
 * Guardia para rutas protegidas: Si no hay sesión o no coincide el rol, redirige
 * @param {string[]} allowedRoles
 */
export function requireAuth(allowedRoles = []) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
    return null;
  }

  if (allowedRoles.length > 0 && user.tipoUsuario !== "admin" && !allowedRoles.includes(user.tipoUsuario)) {
    window.location.href = getRoleHomeRoute(user.tipoUsuario);
    return null;
  }

  return user;
}

/**
 * Guardia para páginas de login o registro: Si ya hay sesión, redirige al portal
 */
export function guestOnly() {
  const user = getCurrentUser();
  if (user) {
    window.location.href = getRoleHomeRoute(user.tipoUsuario);
    return false;
  }
  return true;
}

/**
 * Solicita recuperación de contraseña
 * @param {string} email
 * @returns {object}
 */
export function requestPasswordRecovery(email) {
  const db = getDb();
  const user = db.users.find((u) => u.correo.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error("No existe una cuenta asociada a este correo electrónico.");
  }
  const token = uid("token");
  return {
    success: true,
    token,
    devLink: `reset-password.html?token=${token}`
  };
}
