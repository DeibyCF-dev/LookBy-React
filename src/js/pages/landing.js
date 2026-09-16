/**
 * LookBy - Lógica de la Página Principal (Landing Page)
 */
import { CATEGORIES, SALONS, PRODUCTS } from "../data.js";
import { getCart, addToCart, updateCartQty, clearCart, addCita, addReview } from "../db.js";
import { formatPrice, showToast } from "../utils.js";

let currentCategory = "all";
let currentProductFilter = "all";
let selectedBookingSalon = null;
let selectedReviewSalon = null;
let reviewRating = 5;

export function initLanding() {
  renderCategories();
  renderSalons();
  renderProducts();
  renderCart();

  setupCartDrawer();
  setupBookingModal();
  setupReviewModal();

  window.addEventListener("lookby:cart-updated", renderCart);
}

function renderCategories() {
  const container = document.getElementById("categories-grid");
  if (!container) return;

  container.innerHTML = CATEGORIES.map((cat) => `
    <div class="category-card ${currentCategory === cat.id ? 'active' : ''}" data-cat-id="${cat.id}">
      <img src="${cat.img}" alt="${cat.label}" loading="lazy" />
      <div class="category-card-overlay"></div>
      <span class="category-card-label">${cat.label}</span>
    </div>
  `).join("");

  container.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      const catId = card.getAttribute("data-cat-id");
      currentCategory = currentCategory === catId ? "all" : catId;
      renderCategories();
      renderSalons();
    });
  });
}

function renderSalons() {
  const container = document.getElementById("salons-grid");
  if (!container) return;

  const filtered = currentCategory === "all"
    ? SALONS
    : SALONS.filter((s) => {
        const catObj = CATEGORIES.find(c => c.id === currentCategory);
        return catObj && s.tipoCatalogo.toLowerCase().includes(catObj.label.toLowerCase().split(" ")[0]);
      });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--fg-dim);">
        <p>No se encontraron salones para esta categoría.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((salon) => `
    <div class="salon-card">
      <div class="salon-card-media">
        <img src="${salon.img}" alt="${salon.nombreLocal}" loading="lazy" />
        ${salon.badge ? `<span class="badge badge-gold salon-card-badge">${salon.badge}</span>` : ''}
      </div>
      <div class="salon-card-body">
        <div class="flex items-center justify-between" style="margin-bottom: 0.35rem;">
          <h3 class="salon-card-title">${salon.nombreLocal}</h3>
          <span class="badge badge-neutral">${salon.tipoCatalogo}</span>
        </div>
        <div class="salon-card-info">
          <div class="stars-container">
            ${[1, 2, 3, 4, 5].map(i => `
              <svg class="star-icon ${i <= Math.round(salon.calificacionPromedio) ? 'filled' : ''}" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            `).join("")}
          </div>
          <span>${salon.calificacionPromedio} (${salon.reviews} reseñas)</span>
        </div>
        <p class="salon-card-address">
          <svg style="width:14px;height:14px;flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          ${salon.address}
        </p>
        <div class="salon-card-footer">
          <span style="font-size: 12px; color: var(--fg-dim);">${salon.horario}</span>
          <div class="flex gap-2">
            <button class="btn btn-outline-gold btn-sm" data-action="open-review" data-salon-id="${salon.idLocal}">Calificar</button>
            <button class="btn btn-gold btn-sm" data-action="open-booking" data-salon-id="${salon.idLocal}">Agendar Cita</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");

  container.querySelectorAll("[data-action='open-booking']").forEach(btn => {
    btn.addEventListener("click", () => {
      openBookingModal(btn.getAttribute("data-salon-id"));
    });
  });

  container.querySelectorAll("[data-action='open-review']").forEach(btn => {
    btn.addEventListener("click", () => {
      openReviewModal(btn.getAttribute("data-salon-id"));
    });
  });
}

function renderProducts() {
  const container = document.getElementById("products-grid");
  const filterContainer = document.getElementById("product-filters");
  if (!container) return;

  const categories = ["all", ...new Set(PRODUCTS.map(p => p.categoria))];

  if (filterContainer) {
    filterContainer.innerHTML = categories.map(cat => `
      <button class="filter-pill ${currentProductFilter === cat ? 'active' : ''}" data-filter="${cat}">
        ${cat === 'all' ? 'Todos los Productos' : cat}
      </button>
    `).join("");

    filterContainer.querySelectorAll(".filter-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        currentProductFilter = btn.getAttribute("data-filter");
        renderProducts();
      });
    });
  }

  const filtered = currentProductFilter === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.categoria === currentProductFilter);

  container.innerHTML = filtered.map(prod => `
    <div class="product-card">
      <div class="product-card-media">
        <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy" />
      </div>
      <div class="product-card-body">
        <span class="product-card-category">${prod.categoria}</span>
        <h3 class="product-card-title">${prod.nombre}</h3>
        <p class="product-card-desc">${prod.descripcion}</p>
        <div class="product-card-footer">
          <span class="product-card-price">${formatPrice(prod.precio)}</span>
          <button class="btn btn-outline-gold btn-sm" data-action="add-to-cart" data-prod-id="${prod.idProducto}">
            + Agregar
          </button>
        </div>
      </div>
    </div>
  `).join("");

  container.querySelectorAll("[data-action='add-to-cart']").forEach(btn => {
    btn.addEventListener("click", () => {
      const prodId = btn.getAttribute("data-prod-id");
      const product = PRODUCTS.find(p => p.idProducto === prodId);
      if (product) {
        addToCart(product);
        showToast(`Agregado al carrito: ${product.nombre}`, "success");
        openCartDrawer();
      }
    });
  });
}

function setupCartDrawer() {
  const openBtns = document.querySelectorAll("[data-action='open-cart']");
  const closeBtn = document.getElementById("close-cart-btn");
  const backdrop = document.getElementById("cart-drawer-backdrop");
  const checkoutBtn = document.getElementById("checkout-btn");

  openBtns.forEach(b => b.addEventListener("click", openCartDrawer));
  if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeCartDrawer();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        showToast("Tu carrito está vacío", "warning");
        return;
      }
      showToast("¡Pedido realizado con éxito! En breve recibirás la confirmación.", "success");
      clearCart();
      closeCartDrawer();
    });
  }
}

export function openCartDrawer() {
  const backdrop = document.getElementById("cart-drawer-backdrop");
  if (backdrop) backdrop.classList.add("active");
}

export function closeCartDrawer() {
  const backdrop = document.getElementById("cart-drawer-backdrop");
  if (backdrop) backdrop.classList.remove("active");
}

function renderCart() {
  const cart = getCart();
  const listContainer = document.getElementById("cart-items-list");
  const badge = document.getElementById("cart-badge-count");
  const totalEl = document.getElementById("cart-total-price");

  const totalCount = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.precio * i.qty, 0);

  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? "inline-flex" : "none";
  }

  if (totalEl) {
    totalEl.textContent = formatPrice(totalPrice);
  }

  if (!listContainer) return;

  if (cart.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--fg-dim);">
        <p>Tu carrito está vacío</p>
        <span style="font-size: 11px; margin-top: 0.5rem; display: block;">Explora nuestros productos de alta gama</span>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img" />
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.nombre}</h4>
        <span class="cart-item-price">${formatPrice(item.precio)}</span>
        <div class="cart-qty-ctrls">
          <button class="cart-qty-btn" data-action="cart-minus" data-id="${item.idProducto}">−</button>
          <span style="font-size: 12px; font-weight: 600; min-width: 16px; text-align: center;">${item.qty}</span>
          <button class="cart-qty-btn" data-action="cart-plus" data-id="${item.idProducto}">+</button>
        </div>
      </div>
    </div>
  `).join("");

  listContainer.querySelectorAll("[data-action='cart-minus']").forEach(btn => {
    btn.addEventListener("click", () => updateCartQty(btn.getAttribute("data-id"), -1));
  });

  listContainer.querySelectorAll("[data-action='cart-plus']").forEach(btn => {
    btn.addEventListener("click", () => updateCartQty(btn.getAttribute("data-id"), 1));
  });
}

function setupBookingModal() {
  const modal = document.getElementById("booking-modal-backdrop");
  const closeBtn = document.getElementById("close-booking-modal");
  const form = document.getElementById("booking-form");

  if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const service = form.querySelector("#booking-service").value;
      const date = form.querySelector("#booking-date").value;
      const hour = form.querySelector("#booking-hour").value;

      if (!selectedBookingSalon || !service || !date || !hour) {
        showToast("Por favor completa todos los campos", "warning");
        return;
      }

      addCita({
        idLocal: selectedBookingSalon.idLocal,
        nombreLocal: selectedBookingSalon.nombreLocal,
        servicio: service,
        fecha: date,
        hora: hour,
        precio: selectedBookingSalon.precioMin || 25000
      });

      showToast(`¡Cita agendada con éxito en ${selectedBookingSalon.nombreLocal}!`, "success");
      modal.classList.remove("active");
      form.reset();
    });
  }
}

function openBookingModal(salonId) {
  const salon = SALONS.find(s => s.idLocal === salonId);
  if (!salon) return;
  selectedBookingSalon = salon;

  const modal = document.getElementById("booking-modal-backdrop");
  const salonTitle = document.getElementById("booking-salon-title");
  const serviceSelect = document.getElementById("booking-service");

  if (salonTitle) salonTitle.textContent = salon.nombreLocal;
  if (serviceSelect) {
    serviceSelect.innerHTML = `
      <option value="">Selecciona un servicio...</option>
      ${salon.servicios.map(s => `<option value="${s}">${s}</option>`).join("")}
    `;
  }

  if (modal) modal.classList.add("active");
}

function setupReviewModal() {
  const modal = document.getElementById("review-modal-backdrop");
  const closeBtn = document.getElementById("close-review-modal");
  const form = document.getElementById("review-form");
  const starsContainer = document.getElementById("review-stars-interactive");

  if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }

  if (starsContainer) {
    starsContainer.querySelectorAll(".star-interactive").forEach((star, idx) => {
      star.addEventListener("click", () => {
        reviewRating = idx + 1;
        updateInteractiveStars();
      });
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const comment = form.querySelector("#review-comment").value.trim();
      if (!comment) {
        showToast("Por favor escribe tu reseña", "warning");
        return;
      }

      addReview({
        idLocal: selectedReviewSalon ? selectedReviewSalon.idLocal : "loc-01",
        nombreLocal: selectedReviewSalon ? selectedReviewSalon.nombreLocal : "Atelier Doré",
        comentario: comment,
        puntuacion: reviewRating
      });

      showToast("¡Gracias por compartir tu reseña!", "success");
      modal.classList.remove("active");
      form.reset();
    });
  }
}

function updateInteractiveStars() {
  const starsContainer = document.getElementById("review-stars-interactive");
  if (!starsContainer) return;
  starsContainer.querySelectorAll(".star-interactive").forEach((star, idx) => {
    if (idx < reviewRating) {
      star.classList.add("filled");
    } else {
      star.classList.remove("filled");
    }
  });
}

function openReviewModal(salonId) {
  const salon = SALONS.find(s => s.idLocal === salonId);
  if (!salon) return;
  selectedReviewSalon = salon;

  const modal = document.getElementById("review-modal-backdrop");
  const title = document.getElementById("review-salon-title");
  if (title) title.textContent = salon.nombreLocal;

  reviewRating = 5;
  updateInteractiveStars();
  if (modal) modal.classList.add("active");
}
