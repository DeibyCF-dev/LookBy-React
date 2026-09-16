/**
 * LookBy - Portal del Proveedor Mayorista
 */
import { requireAuth, logout } from "../auth.js";
import { getDb, saveDb } from "../db.js";
import { formatPrice, showToast, uid } from "../utils.js";

let currentUser = null;

export function initProveedorPage() {
  currentUser = requireAuth(["proveedor"]);
  if (!currentUser) return;

  setupUserProfile();
  setupTabs();
  renderWholesaleMetrics();
  renderWholesaleCatalog();
  renderWholesaleOrders();
  setupWholesaleModals();

  const logoutBtn = document.getElementById("proveedor-logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
}

function setupUserProfile() {
  document.querySelectorAll(".user-name-display").forEach(el => el.textContent = currentUser.nombre);
  document.querySelectorAll(".user-business-display").forEach(el => el.textContent = currentUser.businessName || "Distribuidora Andina S.A.");
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

function renderWholesaleMetrics() {
  const db = getDb();
  const totalStock = (db.wholesaleProducts || []).reduce((s, p) => s + p.stockProveedor, 0);
  const totalOrders = (db.wholesaleOrders || []).length;
  const totalSales = (db.wholesaleOrders || []).reduce((s, o) => s + o.total, 0);

  const stockEl = document.getElementById("metric-total-stock");
  const ordersEl = document.getElementById("metric-wholesale-orders");
  const salesEl = document.getElementById("metric-wholesale-sales");

  if (stockEl) stockEl.textContent = totalStock.toLocaleString("es-CL") + " un.";
  if (ordersEl) ordersEl.textContent = totalOrders;
  if (salesEl) salesEl.textContent = formatPrice(totalSales);
}

function renderWholesaleCatalog() {
  const db = getDb();
  const container = document.getElementById("proveedor-products-grid");
  if (!container) return;

  const prods = db.wholesaleProducts || [];
  container.innerHTML = prods.map(p => `
    <div class="product-card">
      <div class="product-card-media">
        <img src="${p.imagen}" alt="${p.nombre}" />
      </div>
      <div class="product-card-body">
        <span class="product-card-category">${p.categoria}</span>
        <h3 class="product-card-title">${p.nombre}</h3>
        <div style="margin-bottom: 0.75rem; font-size: 12px; color: var(--fg-dim);">
          <p>Precio Mayoreo: <strong class="text-gold font-bold">${formatPrice(p.precioMayoreo)}</strong></p>
          <p>Precio Retail ref: <span>${formatPrice(p.precioRetail)}</span></p>
          <p>Stock disponible: <strong>${p.stockProveedor} un.</strong></p>
          <p>Entrega: ${p.tiempoEntrega}</p>
        </div>
        <div class="product-card-footer">
          <span class="badge badge-gold">MOQ: ${p.moq} un.</span>
          <button class="btn btn-outline-gold btn-sm" data-action="edit-stock" data-id="${p.idDetalleProv}">Actualizar Stock</button>
        </div>
      </div>
    </div>
  `).join("");

  container.querySelectorAll("[data-action='edit-stock']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const prod = prods.find(p => p.idDetalleProv === id);
      if (prod) {
        const newStock = prompt(`Actualizar stock disponible para ${prod.nombre}:`, prod.stockProveedor);
        if (newStock !== null && !isNaN(Number(newStock))) {
          prod.stockProveedor = Number(newStock);
          saveDb(db);
          renderWholesaleCatalog();
          renderWholesaleMetrics();
          showToast("Stock actualizado correctamente", "success");
        }
      }
    });
  });
}

function renderWholesaleOrders() {
  const db = getDb();
  const container = document.getElementById("proveedor-orders-tbody");
  if (!container) return;

  const orders = db.wholesaleOrders || [];
  container.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td><strong>${o.negocio}</strong></td>
      <td style="max-width: 250px; font-size: 12.5px;">${o.productos}</td>
      <td>${o.fecha}</td>
      <td class="text-gold font-bold">${formatPrice(o.total)}</td>
      <td>
        <span class="badge ${o.estado === 'Recibido' ? 'badge-success' : o.estado === 'Enviado' ? 'badge-info' : 'badge-warning'}">${o.estado}</span>
      </td>
    </tr>
  `).join("");
}

function setupWholesaleModals() {
  const modal = document.getElementById("proveedor-product-modal-backdrop");
  const openBtn = document.getElementById("open-wholesale-modal");
  const closeBtn = document.getElementById("close-wholesale-modal");
  const form = document.getElementById("proveedor-product-form");

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
      const nombre = form.querySelector("#ws-prod-name").value.trim();
      const categoria = form.querySelector("#ws-prod-cat").value;
      const precioMayoreo = Number(form.querySelector("#ws-prod-price").value);
      const precioRetail = Number(form.querySelector("#ws-prod-retail").value);
      const stock = Number(form.querySelector("#ws-prod-stock").value);
      const moq = Number(form.querySelector("#ws-prod-moq").value) || 6;

      const db = getDb();
      db.wholesaleProducts.push({
        idDetalleProv: uid("dpp"),
        idProducto: uid("p"),
        nombre,
        categoria,
        precioMayoreo,
        precioRetail,
        stockProveedor: stock,
        tiempoEntrega: "2–3 días hábiles",
        moq,
        imagen: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&h=300&fit=crop"
      });
      saveDb(db);

      showToast(`Oferta mayorista "${nombre}" publicada exitosamente`, "success");
      modal.classList.remove("active");
      form.reset();
      renderWholesaleCatalog();
      renderWholesaleMetrics();
    });
  }
}
