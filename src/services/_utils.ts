/** Utilidades compartidas de la capa de servicios mock. */

export function delay(ms = 200): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(`El campo "${field}" es requerido.`);
  }
  return value.trim();
}

export function requireNumber(value: unknown, field: string, min = 0): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < min) {
    throw new ApiError(`El campo "${field}" debe ser un número mayor o igual a ${min}.`);
  }
  return n;
}

export function isValidEmail(value: string): boolean {
  return typeof value === "string" && value.includes("@");
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function toISO(dayLike: string): Date {
  // acepta "YYYY-MM-DD" o ISO
  return new Date(dayLike.length === 10 ? `${dayLike}T00:00:00` : dayLike);
}