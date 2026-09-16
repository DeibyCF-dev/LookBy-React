/**
 * LookBy - Funciones de Utilidad y Formateo
 */

/**
 * Formatea un número como moneda chilena ($ CLP)
 * @param {number} amount
 * @returns {string}
 */
export function formatPrice(amount) {
  if (amount == null || isNaN(amount)) return "$0";
  return "$" + Number(amount).toLocaleString("es-CL");
}

/**
 * Formatea una fecha ISO o string
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Genera un identificador único con prefijo
 * @param {string} prefix
 * @returns {string}
 */
export function uid(prefix = "id") {
  const rand = (Math.random().toString(36) + Date.now().toString(36)).slice(2, 7);
  return `${prefix}-${rand}`;
}

/**
 * Retorna fecha y hora actual en formato estándar
 * @returns {string}
 */
export function now() {
  return new Date().toISOString();
}

/**
 * Muestra una notificación tipo Toast emergente
 * @param {string} message
 * @param {'success'|'warning'|'danger'|'info'} type
 */
export function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  const bg = type === "success" ? "rgba(52, 211, 153, 0.95)" :
             type === "danger" ? "rgba(251, 113, 133, 0.95)" :
             type === "warning" ? "rgba(251, 191, 36, 0.95)" : "rgba(56, 189, 248, 0.95)";
  const color = "#0A0A0A";

  toast.style.cssText = `
    background: ${bg};
    color: ${color};
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.25s ease;
    pointer-events: auto;
  `;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}
