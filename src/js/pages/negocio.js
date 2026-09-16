/**
 * LookBy - Portal del Negocio (Salón / Barbería / Spa)
 */
import { requireAuth, logout } from "../auth.js";
import { getDb, saveDb } from "../db.js";
import { formatPrice, showToast, uid } from "../utils.js";

let currentUser = null;

export function initNegocioPage() {
  currentUser = requireAuth(["profesional"]);
  if (!currentUser) return;

  setupUserProfile();
  setupTabs();
  renderDashboardMetrics();
  renderInventoryTable();
  renderOrdersTable();
  renderAgendaList();
  renderReviewsList();
  setupBusinessModals();

  const logoutBtn = document.getElementById("negocio-logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
}

function setupUserProfile() {
  document.querySelectorAll(".user-name-display").forEach(el => el.textContent = currentUser.nombre);
  document.querySelectorAll(".user-business-display").forEach(el => el.textContent = currentUser.businessName || "Atelier Doré");
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

function renderDashboardMetrics() {
  const db = getDb();
  const totalCitas = (db.citas || []).length;
  const totalIngresos = (db.pedidos || []).reduce((s, p) => s + p.montoTotal, 0);

  const citasCountEl = document.getElementById("metric-citas-count");
  const ingresosEl = document.getElementById("metric-ingresos-total");
  const stockCountEl = document.getElementById("metric-stock-count");

  if (citasCountEl) citasCountEl.textContent = totalCitas;
  if (ingresosEl) ingresosEl.textContent = formatPrice(totalIngresos);
  if (stockCountEl) stockCountEl.textContent = (db.businessInventory || []).length;
}

function renderInventoryTable() {
  const db = getDb();
  const container = document.getElementById("negocio-inventory-tbody");
  if (!container) return;

  const items = db.businessInventory || [];
  container.innerHTML = items.map(item => `
    <tr>
      <td>
        <div class="flex items-center gap-3">
          <img src="${item.imagen}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;" />
          <div>
            <strong>${item.nombre}</strong>
            <span style="font-size:11px;color:var(--fg-dim);display:block;">${item.catalogo}</span>
          </div>
        </div>
      </td>
      <td>
        <input type="number" class="input-base input-sm" style="width:110px;padding:0.35rem 0.65rem;" value="${item.precioLocal}" data-action="edit-price" data-id="${item.idDetalleCat}" />
      </td>
      <td><strong>${item.stockDisponible} un.</strong></td>
      <td>
        <span class="badge ${item.disponibilidad ? 'badge-success' : 'badge-danger'}">
          ${item.disponibilidad ? 'Disponible' : 'Agotado'}
        </span>
      </td>
      <td>
        <button class="btn btn-outline-gold btn-sm" data-action="toggle-disp" data-id="${item.idDetalleCat}">
          ${item.disponibilidad ? 'Desactivar' : 'Activar'}
        </button>
      </td>
    </tr>
  `).join("");

  container.querySelectorAll("[data-action='toggle-disp']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const it = items.find(i => i.idDetalleCat === id);
      if (it) {
        it.disponibilidad = !it.disponibilidad;
        saveDb(db);
        renderInventoryTable();
        showToast("Disponibilidad actualizada", "success");
      }
    });
  });

  container.querySelectorAll("[data-action='edit-price']").forEach(input => {
    input.addEventListener("change", () => {
      const id = input.getAttribute("data-id");
      const val = Number(input.value);
      const it = items.find(i => i.idDetalleCat === id);
      if (it && !isNaN(val)) {
        it.precioLocal = val;
        saveDb(db);
        showToast("Precio local guardado", "success");
      }
    });
  });
}

function renderOrdersTable() {
  const db = getDb();
  const container = document.getElementById("negocio-orders-tbody");
  if (!container) return;

  const pedidos = [
    { idPedido: "PED-20481", cliente: "Sofía Alarcón", fecha: "28 ago 2026", estado: "Completado", montoTotal: 144800, items: "Sérum Lumière + Mascarilla" },
    { idPedido: "PED-20480", cliente: "Camila Torres", fecha: "28 ago 2026", estado: "En Preparación", montoTotal: 124500, items: "Kit Renovación Profunda" },
    { idPedido: "PED-20479", cliente: "María José Ríos", fecha: "27 ago 2026", estado: "Pendiente", montoTotal: 107700, items: "Paleta + Óleo Reparador" }
  ];

  container.innerHTML = pedidos.map(p => `
    <tr>
      <td><strong>${p.idPedido}</strong></td>
      <td>${p.cliente}</td>
      <td>${p.items}</td>
      <td class="text-gold font-bold">${formatPrice(p.montoTotal)}</td>
      <td>
        <select class="input-base input-sm" style="padding:0.25rem 0.5rem;" data-action="change-order-status" data-id="${p.idPedido}">
          <option value="Pendiente" ${p.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
          <option value="En Preparación" ${p.estado === 'En Preparación' ? 'selected' : ''}>En Preparación</option>
          <option value="Completado" ${p.estado === 'Completado' ? 'selected' : ''}>Completado</option>
        </select>
      </td>
    </tr>
  `).join("");

  container.querySelectorAll("[data-action='change-order-status']").forEach(select => {
    select.addEventListener("change", () => {
      showToast(`Estado de pedido actualizado a ${select.value}`, "success");
    });
  });
}

function renderAgendaList() {
  const container = document.getElementById("negocio-agenda-list");
  if (!container) return;

  const agenda = [
    { hora: "09:00", cliente: "Martina López", servicio: "Colorimetría Completa", profesional: "Valentina R.", estado: "Completada", precio: 38000 },
    { hora: "10:30", cliente: "Sofía Alarcón", servicio: "Keratina Brasileña", profesional: "Camila M.", estado: "En curso", precio: 52000 },
    { hora: "12:00", cliente: "Javiera Pinto", servicio: "Corte & Peinado", profesional: "Andrea S.", estado: "Confirmada", precio: 22000 },
    { hora: "14:30", cliente: "Constanza Vega", servicio: "Manicura Premium", profesional: "Nicole B.", estado: "Confirmada", precio: 18000 }
  ];

  container.innerHTML = agenda.map(a => `
    <div class="timeline-item">
      <div class="flex items-center gap-4">
        <span class="text-gold" style="font-size:1.25rem;font-weight:700;font-family:var(--font-serif);">${a.hora}</span>
        <div>
          <h4 style="font-size:14px;margin-bottom:0.15rem;">${a.cliente}</h4>
          <span style="font-size:12px;color:var(--fg-dim);">${a.servicio} · ${a.profesional}</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-gold font-bold">${formatPrice(a.precio)}</span>
        <span class="badge ${a.estado === 'Completada' ? 'badge-success' : a.estado === 'En curso' ? 'badge-gold' : 'badge-warning'}">${a.estado}</span>
      </div>
    </div>
  `).join("");
}

function renderReviewsList() {
  const container = document.getElementById("negocio-reviews-list");
  if (!container) return;

  const db = getDb();
  container.innerHTML = (db.reviews || []).map(r => `
    <div class="card-luxury" style="padding:1.25rem;">
      <div class="flex items-center justify-between" style="margin-bottom:0.5rem;">
        <strong>${r.nombreLocal}</strong>
        <div class="stars-container">
          ${[1, 2, 3, 4, 5].map(i => `
            <svg class="star-icon ${i <= r.puntuacion ? 'filled' : ''}" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          `).join("")}
        </div>
      </div>
      <p style="font-size:13.5px;color:var(--fg-muted);">${r.comentario}</p>
      <span style="font-size:11px;color:var(--fg-dim);margin-top:0.35rem;display:block;">${r.fecha}</span>
    </div>
  `).join("");
}

function setupBusinessModals() {
  const modal = document.getElementById("negocio-product-modal-backdrop");
  const openBtn = document.getElementById("open-new-product-modal");
  const closeBtn = document.getElementById("close-new-product-modal");
  const form = document.getElementById("negocio-product-form");

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
      const nombre = form.querySelector("#prod-name").value.trim();
      const catalogo = form.querySelector("#prod-catalogo").value;
      const precio = Number(form.querySelector("#prod-price").value);
      const stock = Number(form.querySelector("#prod-stock").value);

      const db = getDb();
      db.businessInventory.push({
        idDetalleCat: uid("dpc"),
        idProducto: uid("p"),
        nombre,
        catalogo,
        precioLocal: precio,
        stockDisponible: stock,
        disponibilidad: stock > 0,
        imagen: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=200&h=200&fit=crop"
      });
      saveDb(db);

      showToast(`Producto "${nombre}" agregado al inventario`, "success");
      modal.classList.remove("active");
      form.reset();
      renderInventoryTable();
    });
  }
}
