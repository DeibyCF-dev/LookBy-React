/**
 * LookBy - Portal del Superadministrador
 */
import { requireAuth, logout } from "../auth.js";
import { getDb, saveDb } from "../db.js";
import { formatPrice, showToast, uid, now } from "../utils.js";

let currentUser = null;

export function initSuperadminPage() {
  currentUser = requireAuth(["admin"]);
  if (!currentUser) return;

  setupUserProfile();
  setupTabs();
  renderGlobalMetrics();
  renderUsersTable();
  renderSalonsTable();
  renderSuppliersTable();
  renderAuditLogs();
  setupSuperadminModals();

  const logoutBtn = document.getElementById("superadmin-logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
}

function setupUserProfile() {
  document.querySelectorAll(".user-name-display").forEach(el => el.textContent = currentUser.nombre);
  document.querySelectorAll(".user-email-display").forEach(el => el.textContent = currentUser.correo);
  document.querySelectorAll(".user-avatar-letter").forEach(el => el.textContent = currentUser.nombre.charAt(0));
}

function setupTabs() {
  document.querySelectorAll(".sidebar-link[data-tab]").forEach(link => {
    link.addEventListener("click", () => {
      const tabName = link.getAttribute("data-tab");
      document.querySelectorAll(".sidebar-link[data-tab]").forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      document.querySelectorAll(".tab-pane").forEach(pane => {
        if (pane.id === `tab-${tabName}`) {
          pane.classList.add("active");
        } else {
          pane.classList.remove("active");
        }
      });
    });
  });
}

function renderGlobalMetrics() {
  const db = getDb();
  const usersCount = (db.users || []).length;
  const salonsCount = (db.salons || []).length;
  const ordersCount = (db.pedidos || []).length;
  const totalVolume = (db.pedidos || []).reduce((s, p) => s + p.montoTotal, 0);

  const usersEl = document.getElementById("metric-total-users");
  const salonsEl = document.getElementById("metric-total-salons");
  const ordersEl = document.getElementById("metric-total-orders");
  const volumeEl = document.getElementById("metric-total-volume");

  if (usersEl) usersEl.textContent = usersCount;
  if (salonsEl) salonsEl.textContent = salonsCount;
  if (ordersEl) ordersEl.textContent = ordersCount;
  if (volumeEl) volumeEl.textContent = formatPrice(totalVolume);
}

function renderUsersTable() {
  const db = getDb();
  const container = document.getElementById("superadmin-users-tbody");
  if (!container) return;

  const users = db.users || [];
  container.innerHTML = users.map(u => `
    <tr>
      <td>
        <strong>${u.nombre}</strong>
        <span style="font-size:11px;color:var(--fg-dim);display:block;">${u.correo}</span>
      </td>
      <td>${u.documento || "—"}</td>
      <td>
        <span class="badge ${u.tipoUsuario === 'admin' ? 'badge-gold' : u.tipoUsuario === 'profesional' ? 'badge-info' : u.tipoUsuario === 'proveedor' ? 'badge-warning' : 'badge-neutral'}">
          ${u.tipoUsuario}
        </span>
      </td>
      <td>${u.telefono || "—"}</td>
      <td>
        <span class="badge badge-success">Activo</span>
      </td>
    </tr>
  `).join("");
}

function renderSalonsTable() {
  const db = getDb();
  const container = document.getElementById("superadmin-salons-tbody");
  if (!container) return;

  const salons = db.salons || [];
  container.innerHTML = salons.map(s => `
    <tr>
      <td>
        <strong>${s.nombreLocal}</strong>
        <span style="font-size:11px;color:var(--fg-dim);display:block;">${s.address}</span>
      </td>
      <td>${s.tipoCatalogo}</td>
      <td>${s.horario}</td>
      <td class="text-gold font-bold">${s.calificacionPromedio} ★</td>
      <td>
        <span class="badge badge-success">Operativo</span>
      </td>
    </tr>
  `).join("");
}

function renderSuppliersTable() {
  const container = document.getElementById("superadmin-suppliers-tbody");
  if (!container) return;

  const suppliers = [
    { razonSocial: "Distribuidora Andina S.A.", contacto: "ventas@andina.cl", rut: "72.345.678-9", productos: 38, estado: "Activo" },
    { razonSocial: "Cosméticos del Sur Ltda.", contacto: "info@cosmsur.cl", rut: "76.123.456-7", productos: 22, estado: "Activo" },
    { razonSocial: "BioBeauty Chile SpA", contacto: "hola@biobeauty.cl", rut: "77.987.654-3", productos: 15, estado: "Revisión" }
  ];

  container.innerHTML = suppliers.map(s => `
    <tr>
      <td>
        <strong>${s.razonSocial}</strong>
        <span style="font-size:11px;color:var(--fg-dim);display:block;">${s.contacto}</span>
      </td>
      <td>${s.rut}</td>
      <td>${s.productos} productos</td>
      <td>
        <span class="badge ${s.estado === 'Activo' ? 'badge-success' : 'badge-warning'}">${s.estado}</span>
      </td>
    </tr>
  `).join("");
}

function renderAuditLogs() {
  const db = getDb();
  const container = document.getElementById("superadmin-audit-tbody");
  if (!container) return;

  const logs = db.auditLog || [];
  container.innerHTML = logs.map(l => `
    <tr>
      <td>
        <span class="badge ${l.nivel === 'info' ? 'badge-info' : l.nivel === 'warning' ? 'badge-warning' : 'badge-danger'}">
          ${l.nivel}
        </span>
      </td>
      <td><strong>${l.accion}</strong></td>
      <td>${l.entidad}</td>
      <td style="font-size:12.5px;color:var(--fg-muted);">${l.detalle}</td>
      <td>${l.actor}</td>
      <td style="font-size:11px;color:var(--fg-dim);">${l.fecha}</td>
    </tr>
  `).join("");
}

function setupSuperadminModals() {
  const modal = document.getElementById("superadmin-user-modal-backdrop");
  const openBtn = document.getElementById("open-new-user-modal");
  const closeBtn = document.getElementById("close-new-user-modal");
  const form = document.getElementById("superadmin-user-form");

  if (openBtn && modal) openBtn.addEventListener("click", () => modal.classList.add("active"));
  if (closeBtn && modal) closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = form.querySelector("#usr-name").value.trim();
      const correo = form.querySelector("#usr-email").value.trim();
      const tipoUsuario = form.querySelector("#usr-role").value;
      const telefono = form.querySelector("#usr-phone").value.trim();
      const documento = form.querySelector("#usr-doc").value.trim();

      const db = getDb();
      db.users.push({
        _id: uid("u"),
        nombre,
        correo,
        tipoUsuario,
        telefono,
        documento,
        contrasena: "pass123",
        createdAt: now()
      });

      db.auditLog.unshift({
        id: db.auditLog.length + 1,
        accion: "Usuario creado",
        entidad: "USUARIO",
        detalle: `${correo} registrado con rol ${tipoUsuario}`,
        fecha: new Date().toLocaleDateString("es-CL"),
        actor: currentUser.nombre,
        nivel: "info"
      });

      saveDb(db);

      showToast(`Usuario "${nombre}" registrado exitosamente`, "success");
      modal.classList.remove("active");
      form.reset();
      renderUsersTable();
      renderAuditLogs();
      renderGlobalMetrics();
    });
  }
}
