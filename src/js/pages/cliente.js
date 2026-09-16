/**
 * LookBy - Portal del Cliente
 */
import { requireAuth, logout } from "../auth.js";
import { getDb, addCita, addReview } from "../db.js";
import { formatPrice, showToast } from "../utils.js";

let currentUser = null;
let currentTab = "explorar";
let selectedSalonForBooking = null;

export function initClientePage() {
  currentUser = requireAuth(["cliente"]);
  if (!currentUser) return;

  setupUserProfile();
  setupTabs();
  renderExplorarSalons();
  renderCitas();
  renderPedidos();
  renderCalificaciones();
  setupClientModals();

  const logoutBtn = document.getElementById("client-logout-btn");
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
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll(".sidebar-link[data-tab]").forEach(link => {
    if (link.getAttribute("data-tab") === tabName) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  document.querySelectorAll(".tab-pane").forEach(pane => {
    if (pane.id === `tab-${tabName}`) {
      pane.classList.add("active");
    } else {
      pane.classList.remove("active");
    }
  });
}

function renderExplorarSalons() {
  const db = getDb();
  const container = document.getElementById("client-salons-grid");
  if (!container) return;

  container.innerHTML = db.salons.map(salon => `
    <div class="salon-card">
      <div class="salon-card-media">
        <img src="${salon.img}" alt="${salon.nombreLocal}" />
        <span class="badge badge-gold salon-card-badge">${salon.tipoCatalogo}</span>
      </div>
      <div class="salon-card-body">
        <h3 class="salon-card-title">${salon.nombreLocal}</h3>
        <p class="salon-card-address">${salon.address}</p>
        <div style="margin-bottom: 1rem;">
          <span style="font-size: 11px; color: var(--fg-dim);">Servicios populares:</span>
          <div class="flex gap-1" style="flex-wrap: wrap; margin-top: 0.35rem;">
            ${(salon.servicios || ["Corte", "Tratamiento"]).map(s => `<span class="badge badge-neutral">${s}</span>`).join("")}
          </div>
        </div>
        <div class="salon-card-footer">
          <span style="font-size: 12px; font-weight: 600; color: var(--gold-primary);">Desde ${formatPrice(salon.precioMin || 18000)}</span>
          <button class="btn btn-gold btn-sm" data-action="client-book" data-id="${salon.idLocal}">Reservar Cita</button>
        </div>
      </div>
    </div>
  `).join("");

  container.querySelectorAll("[data-action='client-book']").forEach(btn => {
    btn.addEventListener("click", () => {
      openClientBookingModal(btn.getAttribute("data-id"));
    });
  });
}

function renderCitas() {
  const db = getDb();
  const listContainer = document.getElementById("client-citas-list");
  if (!listContainer) return;

  const citas = db.citas || [];
  if (citas.length === 0) {
    listContainer.innerHTML = `<div class="card-luxury" style="text-align: center; padding: 3rem; color: var(--fg-dim);">No tienes citas agendadas actualmente.</div>`;
    return;
  }

  listContainer.innerHTML = `
    <div class="table-wrapper">
      <table class="table-luxury">
        <thead>
          <tr>
            <th>Local de Belleza</th>
            <th>Servicio</th>
            <th>Fecha & Hora</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${citas.map(c => `
            <tr>
              <td><strong>${c.nombreLocal}</strong></td>
              <td>${c.servicio}</td>
              <td>${c.fecha} · ${c.hora}</td>
              <td class="text-gold font-bold">${formatPrice(c.precio)}</td>
              <td>
                <span class="badge ${c.estado === 'Confirmada' || c.estado === 'Completada' ? 'badge-success' : 'badge-warning'}">${c.estado}</span>
              </td>
              <td>
                <button class="btn btn-outline-gold btn-sm" data-action="calificar-cita" data-salon="${c.idLocal}" data-localname="${c.nombreLocal}">Calificar</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  listContainer.querySelectorAll("[data-action='calificar-cita']").forEach(btn => {
    btn.addEventListener("click", () => {
      openClientReviewModal(btn.getAttribute("data-salon"), btn.getAttribute("data-localname"));
    });
  });
}

function renderPedidos() {
  const db = getDb();
  const listContainer = document.getElementById("client-pedidos-list");
  if (!listContainer) return;

  const pedidos = db.pedidos || [];
  listContainer.innerHTML = `
    <div class="table-wrapper">
      <table class="table-luxury">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Fecha</th>
            <th>Monto Total</th>
            <th>Estado</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          ${pedidos.map(p => `
            <tr>
              <td><strong>${p.idPedido}</strong></td>
              <td>${p.fecha}</td>
              <td class="text-gold font-bold">${formatPrice(p.montoTotal)}</td>
              <td>
                <span class="badge ${p.estado === 'Completado' ? 'badge-success' : p.estado === 'En Preparación' ? 'badge-warning' : 'badge-neutral'}">${p.estado}</span>
              </td>
              <td>
                <button class="btn btn-ghost btn-sm" data-action="ver-pedido" data-id="${p.idPedido}">Ver Productos</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  listContainer.querySelectorAll("[data-action='ver-pedido']").forEach(btn => {
    btn.addEventListener("click", () => {
      const pedido = pedidos.find(p => p.idPedido === btn.getAttribute("data-id"));
      if (pedido) openOrderDetailModal(pedido);
    });
  });
}

function renderCalificaciones() {
  const db = getDb();
  const listContainer = document.getElementById("client-reviews-list");
  if (!listContainer) return;

  const reviews = db.reviews || [];
  listContainer.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${reviews.map(r => `
        <div class="card-luxury" style="padding: 1.25rem;">
          <div class="flex items-center justify-between" style="margin-bottom: 0.5rem;">
            <h4 style="font-family: var(--font-serif);">${r.nombreLocal}</h4>
            <div class="stars-container">
              ${[1, 2, 3, 4, 5].map(i => `
                <svg class="star-icon ${i <= r.puntuacion ? 'filled' : ''}" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              `).join("")}
            </div>
          </div>
          <p style="font-size: 13.5px; color: var(--fg-muted);">${r.comentario}</p>
          <span style="font-size: 11px; color: var(--fg-dim); margin-top: 0.5rem; display: block;">${r.fecha}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function setupClientModals() {
  const modalBooking = document.getElementById("client-booking-modal-backdrop");
  const modalDetail = document.getElementById("client-order-modal-backdrop");
  const modalReview = document.getElementById("client-review-modal-backdrop");

  document.querySelectorAll(".modal-close, [data-action='close-modal']").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("active"));
    });
  });

  const formBooking = document.getElementById("client-booking-form");
  if (formBooking) {
    formBooking.addEventListener("submit", (e) => {
      e.preventDefault();
      const service = formBooking.querySelector("#client-book-service").value;
      const date = formBooking.querySelector("#client-book-date").value;
      const hour = formBooking.querySelector("#client-book-hour").value;

      addCita({
        idLocal: selectedSalonForBooking.idLocal,
        nombreLocal: selectedSalonForBooking.nombreLocal,
        servicio: service,
        fecha: date,
        hora: hour,
        precio: selectedSalonForBooking.precioMin || 25000
      });

      showToast("¡Cita agendada con éxito!", "success");
      modalBooking.classList.remove("active");
      renderCitas();
      switchTab("citas");
    });
  }

  const formReview = document.getElementById("client-review-form");
  if (formReview) {
    formReview.addEventListener("submit", (e) => {
      e.preventDefault();
      const salonId = formReview.getAttribute("data-salon-id");
      const salonName = formReview.getAttribute("data-salon-name");
      const comment = formReview.querySelector("#client-review-comment").value.trim();
      const rating = Number(formReview.querySelector("#client-review-rating").value);

      addReview({
        idLocal: salonId,
        nombreLocal: salonName,
        comentario: comment,
        puntuacion: rating
      });

      showToast("¡Calificación enviada!", "success");
      modalReview.classList.remove("active");
      renderCalificaciones();
      switchTab("calificaciones");
    });
  }
}

function openClientBookingModal(salonId) {
  const db = getDb();
  const salon = db.salons.find(s => s.idLocal === salonId);
  if (!salon) return;
  selectedSalonForBooking = salon;

  const modal = document.getElementById("client-booking-modal-backdrop");
  const title = document.getElementById("client-booking-salon-title");
  const serviceSelect = document.getElementById("client-book-service");

  if (title) title.textContent = salon.nombreLocal;
  if (serviceSelect) {
    serviceSelect.innerHTML = (salon.servicios || ["Corte", "Tratamiento"]).map(s => `<option value="${s}">${s}</option>`).join("");
  }
  if (modal) modal.classList.add("active");
}

function openOrderDetailModal(pedido) {
  const modal = document.getElementById("client-order-modal-backdrop");
  const title = document.getElementById("client-order-modal-title");
  const body = document.getElementById("client-order-modal-body");

  if (title) title.textContent = `Detalle del Pedido ${pedido.idPedido}`;
  if (body) {
    body.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <span class="badge ${pedido.estado === 'Completado' ? 'badge-success' : 'badge-warning'}">${pedido.estado}</span>
        <span style="font-size: 12px; color: var(--fg-dim); margin-left: 0.5rem;">${pedido.fecha}</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
        ${pedido.detalles.map(d => `
          <div class="flex items-center justify-between" style="padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-subtle);">
            <div>
              <p style="font-size: 13.5px; font-weight: 500;">${d.nombre}</p>
              <span style="font-size: 11px; color: var(--fg-dim);">Cantidad: ${d.cantidad}</span>
            </div>
            <span class="text-gold font-bold">${formatPrice(d.subTotal)}</span>
          </div>
        `).join("")}
      </div>
      <div class="flex items-center justify-between" style="font-size: 1.1rem; font-weight: 600;">
        <span>Total Pagado</span>
        <span class="text-gold">${formatPrice(pedido.montoTotal)}</span>
      </div>
    `;
  }
  if (modal) modal.classList.add("active");
}

function openClientReviewModal(salonId, salonName) {
  const modal = document.getElementById("client-review-modal-backdrop");
  const title = document.getElementById("client-review-modal-title");
  const form = document.getElementById("client-review-form");

  if (title) title.textContent = `Calificar ${salonName}`;
  if (form) {
    form.setAttribute("data-salon-id", salonId);
    form.setAttribute("data-salon-name", salonName);
    form.reset();
  }
  if (modal) modal.classList.add("active");
}
