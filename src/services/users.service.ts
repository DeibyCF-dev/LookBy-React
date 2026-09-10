/**
 * Servicio de administración de usuarios — replica /api/admin/users/* de Nuxt.
 */
import type { PublicUser, UserRole } from "@/models";
import { getDB, saveDB, getSessionUserId, now } from "./db";
import { toPublicUser } from "./auth.service";
import { ApiError, delay, requireString } from "./_utils";

export interface RoleCounts {
  [key: string]: number;
}

/** GET /api/admin/users?role=&q= — lista con filtros y conteo por rol. */
export async function listUsers(params: { role?: string; q?: string } = {}) {
  await delay(250);
  const db = getDB();
  let users = [...db.users];

  if (params.role && params.role !== "Todos") {
    const roleName = params.role.toLowerCase();
    users = users.filter((u) => u.tipoUsuario === roleName);
  }
  if (params.q && params.q.trim()) {
    const q = params.q.trim().toLowerCase();
    users = users.filter((u) =>
      [u.nombre, u.correo, u.telefono, u.documento, u.businessName]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }

  const roleCounts: RoleCounts = {
    admin: 0,
    profesional: 0,
    proveedor: 0,
    cliente: 0,
  };
  for (const u of db.users) {
    roleCounts[u.tipoUsuario] = (roleCounts[u.tipoUsuario] ?? 0) + 1;
  }

  return { users: users.map(toPublicUser), roleCounts };
}

/** GET /api/admin/roles — roles con conteo de usuarios asociados (vía USUARIO_ROL). */
export async function listRoles() {
  await delay(200);
  const db = getDB();
  return db.roles.map((r) => ({
    ...r,
    userCount: db.userRoles.filter((ur) => ur.idRol === r._id).length,
  }));
}

/** POST /api/admin/roles/assign — asigna rol a un usuario (crea ROL/USUARIO_ROL si hace falta). */
export async function assignRole(idUsuario: string, roleName: string) {
  await delay(250);
  const db = getDB();
  const user = db.users.find((u) => u._id === idUsuario);
  if (!user) throw new ApiError("Usuario no encontrado.", 404);

  const rol = roleName.toLowerCase() as UserRole;
  let roleRecord = db.roles.find((r) => r.nombre === rol);
  if (!roleRecord) {
    roleRecord = { _id: `rol-${rol}`, nombre: rol, descripcion: "" };
    db.roles.push(roleRecord);
  }

  user.tipoUsuario = rol;
  user.updatedAt = now();

  const existing = db.userRoles.find((ur) => ur.idUsuario === idUsuario && ur.idRol === roleRecord!._id);
  if (!existing) {
    db.userRoles.push({ _id: `ur-${idUsuario}-${roleRecord._id}`, idUsuario, idRol: roleRecord._id, descripcion: "" });
  }
  saveDB();
  return { success: true, user: toPublicUser(user) };
}

/** PUT /api/admin/users/:id — actualiza los datos del usuario (tipoUsuario y role juntos). */
export async function updateUser(
  id: string,
  patch: Partial<Pick<PublicUser, "nombre" | "documento" | "correo" | "telefono" | "direccion" | "ubicacionGPS" | "businessName">> & { tipoUsuario?: UserRole },
) {
  await delay(250);
  const db = getDB();
  const user = db.users.find((u) => u._id === id);
  if (!user) throw new ApiError("Usuario no encontrado.", 404);

  if (patch.nombre !== undefined) user.nombre = requireString(patch.nombre, "nombre");
  if (patch.documento !== undefined) user.documento = patch.documento;
  if (patch.correo !== undefined) user.correo = patch.correo.toLowerCase();
  if (patch.telefono !== undefined) user.telefono = patch.telefono;
  if (patch.direccion !== undefined) user.direccion = patch.direccion;
  if (patch.ubicacionGPS !== undefined) user.ubicacionGPS = patch.ubicacionGPS;
  if (patch.businessName !== undefined) user.businessName = patch.businessName;
  if (patch.tipoUsuario !== undefined) {
    user.tipoUsuario = patch.tipoUsuario;
    const roleRecord = db.roles.find((r) => r.nombre === patch.tipoUsuario);
    if (roleRecord) {
      const link = db.userRoles.find((ur) => ur.idUsuario === id);
      if (link) link.idRol = roleRecord._id;
    }
  }
  user.updatedAt = now();
  saveDB();
  return { success: true, user: toPublicUser(user) };
}

/** DELETE /api/admin/users/:id — elimina un usuario (no permite autoeliminarse). */
export async function deleteUser(id: string) {
  await delay(250);
  const db = getDB();
  if (getSessionUserId() === id) {
    throw new ApiError("No puedes eliminar tu propia cuenta.", 403);
  }
  const idx = db.users.findIndex((u) => u._id === id);
  if (idx === -1) throw new ApiError("Usuario no encontrado.", 404);
  db.users.splice(idx, 1);
  db.userRoles = db.userRoles.filter((ur) => ur.idUsuario !== id);
  saveDB();
  return { success: true };
}