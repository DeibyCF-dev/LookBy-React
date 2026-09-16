/**
 * LookBy - Controlador de Tema (Día / Noche)
 */

const THEME_STORAGE_KEY = "lookby_theme";

/**
 * Inicializa el tema leyendo el valor de localStorage o por defecto 'dark'
 */
export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "dark";
  applyTheme(savedTheme);

  // Escuchar botones de toggle en el DOM
  document.querySelectorAll(".theme-toggle-btn, [data-action='toggle-theme']").forEach((btn) => {
    btn.addEventListener("click", toggleTheme);
  });
}

/**
 * Aplica el tema al documento HTML
 * @param {'dark'|'light'} theme
 */
export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.add("light");
  } else {
    root.classList.remove("light");
  }
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  updateToggleButtons(theme);
}

/**
 * Alterna entre modo oscuro y claro
 */
export function toggleTheme() {
  const isLight = document.documentElement.classList.contains("light");
  const nextTheme = isLight ? "dark" : "light";
  applyTheme(nextTheme);
}

/**
 * Actualiza los textos o íconos de los botones de cambio de tema
 * @param {'dark'|'light'} theme
 */
function updateToggleButtons(theme) {
  document.querySelectorAll(".theme-toggle-btn, [data-action='toggle-theme']").forEach((btn) => {
    const textSpan = btn.querySelector(".theme-text");
    const iconSpan = btn.querySelector(".theme-icon");
    if (textSpan) {
      textSpan.textContent = theme === "dark" ? "Día" : "Noche";
    }
    if (iconSpan) {
      iconSpan.textContent = theme === "dark" ? "🌙" : "☀️";
    }
    btn.setAttribute("title", theme === "dark" ? "Activar modo día" : "Activar modo noche");
    btn.setAttribute("aria-label", theme === "dark" ? "Activar modo día" : "Activar modo noche");
  });
}

// Inicialización automática si el script se carga en el navegador
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", initTheme);
}
