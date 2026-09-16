/**
 * LookBy - Lógica de Autenticación y Formularios
 */
import { login, register, requestPasswordRecovery, getRoleHomeRoute } from "../auth.js";
import { DEMO_ACCOUNTS } from "../data.js";
import { showToast } from "../utils.js";

export function initAuthPage() {
  setupLoginForm();
  setupRegisterForm();
  setupRecoveryForm();
  setupResetPasswordForm();
  renderDemoAccountCards();
}

function renderDemoAccountCards() {
  const container = document.getElementById("demo-accounts-grid");
  if (!container) return;

  container.innerHTML = DEMO_ACCOUNTS.map(d => `
    <div class="demo-account-card" data-email="${d.email}" data-pass="${d.password}">
      <p class="demo-account-role">${d.label}</p>
      <p class="demo-account-email">${d.email}</p>
    </div>
  `).join("");

  container.querySelectorAll(".demo-account-card").forEach(card => {
    card.addEventListener("click", () => {
      const email = card.getAttribute("data-email");
      const pass = card.getAttribute("data-pass");
      const emailInput = document.getElementById("login-email");
      const passInput = document.getElementById("login-password");
      if (emailInput && passInput) {
        emailInput.value = email;
        passInput.value = pass;
        showToast(`Credenciales cargadas para ${card.querySelector('.demo-account-role').textContent}`, "info");
      }
    });
  });
}

function setupLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.querySelector("#login-email").value.trim();
    const password = form.querySelector("#login-password").value;
    const errorEl = document.getElementById("login-error");

    if (errorEl) errorEl.style.display = "none";

    try {
      const user = login(email, password);
      showToast(`¡Bienvenido de nuevo, ${user.nombre}!`, "success");
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect");
      window.location.href = redirect ? decodeURIComponent(redirect) : getRoleHomeRoute(user.tipoUsuario);
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = err.message;
        errorEl.style.display = "block";
      } else {
        showToast(err.message, "danger");
      }
    }
  });
}

function setupRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;

  const roleSelect = form.querySelector("#register-role");
  const adminCodeGroup = document.getElementById("admin-code-group");

  if (roleSelect && adminCodeGroup) {
    roleSelect.addEventListener("change", () => {
      adminCodeGroup.style.display = roleSelect.value === "admin" ? "block" : "none";
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = form.querySelector("#register-name").value.trim();
    const correo = form.querySelector("#register-email").value.trim();
    const telefono = form.querySelector("#register-phone").value.trim();
    const tipoUsuario = form.querySelector("#register-role").value;
    const contrasena = form.querySelector("#register-password").value;
    const confirmar = form.querySelector("#register-confirm-password").value;
    const adminCode = form.querySelector("#register-admin-code")?.value.trim();
    const errorEl = document.getElementById("register-error");

    if (errorEl) errorEl.style.display = "none";

    if (contrasena !== confirmar) {
      const msg = "Las contraseñas no coinciden.";
      if (errorEl) { errorEl.textContent = msg; errorEl.style.display = "block"; }
      else { showToast(msg, "warning"); }
      return;
    }

    if (tipoUsuario === "admin" && adminCode !== "LOOKBY_ADMIN_2026") {
      const msg = "Código de administrador incorrecto. Use: LOOKBY_ADMIN_2026";
      if (errorEl) { errorEl.textContent = msg; errorEl.style.display = "block"; }
      else { showToast(msg, "danger"); }
      return;
    }

    try {
      const user = register({
        nombre,
        correo,
        telefono,
        tipoUsuario,
        contrasena
      });
      showToast(`Cuenta creada exitosamente. ¡Bienvenido ${user.nombre}!`, "success");
      setTimeout(() => {
        window.location.href = getRoleHomeRoute(user.tipoUsuario);
      }, 600);
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = err.message;
        errorEl.style.display = "block";
      } else {
        showToast(err.message, "danger");
      }
    }
  });
}

function setupRecoveryForm() {
  const form = document.getElementById("recovery-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.querySelector("#recovery-email").value.trim();
    const resultBox = document.getElementById("recovery-result");
    const devLinkEl = document.getElementById("recovery-dev-link");
    const errorEl = document.getElementById("recovery-error");

    if (errorEl) errorEl.style.display = "none";
    if (resultBox) resultBox.style.display = "none";

    try {
      const res = requestPasswordRecovery(email);
      if (resultBox) resultBox.style.display = "block";
      if (devLinkEl) {
        devLinkEl.href = res.devLink;
        devLinkEl.textContent = window.location.origin + "/" + res.devLink;
      }
      showToast("Enlace de recuperación generado", "success");
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = err.message;
        errorEl.style.display = "block";
      } else {
        showToast(err.message, "danger");
      }
    }
  });
}

function setupResetPasswordForm() {
  const form = document.getElementById("reset-password-form");
  if (!form) return;

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const successBox = document.getElementById("reset-success-box");
  const formBox = document.getElementById("reset-form-box");
  const errorEl = document.getElementById("reset-error");

  if (!token) {
    if (errorEl) {
      errorEl.textContent = "Token de recuperación no válido o ausente.";
      errorEl.style.display = "block";
    }
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = form.querySelector("#new-password").value;
    const confirm = form.querySelector("#confirm-new-password").value;

    if (pass !== confirm) {
      if (errorEl) {
        errorEl.textContent = "Las contraseñas no coinciden.";
        errorEl.style.display = "block";
      }
      return;
    }

    if (formBox) formBox.style.display = "none";
    if (successBox) successBox.style.display = "block";
    showToast("Contraseña restablecida exitosamente", "success");
  });
}
