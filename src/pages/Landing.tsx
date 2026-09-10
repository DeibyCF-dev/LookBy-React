import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Stars } from "@/components/ui";
import { ThemeToggle } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "salon", label: "Salón de Belleza", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01", img: "https://images.unsplash.com/photo-1764475501545-d5cc9719af1a?w=500&h=360&fit=crop" },
  { id: "barberia", label: "Barbería Premium", icon: "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z", img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=360&fit=crop" },
  { id: "spa", label: "Spa & Bienestar", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", img: "https://images.unsplash.com/photo-1770819372114-139fdf280a13?w=500&h=360&fit=crop" },
  { id: "makeup", label: "Estudio Makeup", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z", img: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=500&h=360&fit=crop" },
  { id: "depilacion", label: "Depilación & Skin", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", img: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=500&h=360&fit=crop" },
  { id: "corporal", label: "Cuidado Corporal", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z", img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&h=360&fit=crop" },
];

const LOCALS = [
  { idLocal: "loc-01", nombreLocal: "Atelier Doré", tipoCatalogo: "Salón de Belleza", horario: "09:00 – 20:00", calificacionPromedio: 4.9, reviews: 312, address: "Av. Providencia 2350, Santiago", img: "https://images.unsplash.com/photo-1764475501545-d5cc9719af1a?w=640&h=420&fit=crop", badge: "Top Local" },
  { idLocal: "loc-02", nombreLocal: "Noir & Or Barbería", tipoCatalogo: "Barbería Premium", horario: "10:00 – 21:00", calificacionPromedio: 4.8, reviews: 198, address: "Los Leones 175, Providencia", img: "https://images.unsplash.com/photo-1621645582931-d1d3e6564943?w=640&h=420&fit=crop", badge: null },
  { idLocal: "loc-03", nombreLocal: "Velvet Spa & Wellness", tipoCatalogo: "Spa & Bienestar", horario: "08:00 – 22:00", calificacionPromedio: 5.0, reviews: 87, address: "El Golf 40, Las Condes", img: "https://images.unsplash.com/photo-1784704161960-26770b684595?w=640&h=420&fit=crop", badge: "Nuevo" },
  { idLocal: "loc-04", nombreLocal: "Studio Makeover Pro", tipoCatalogo: "Estudio Makeup", horario: "10:00 – 19:00", calificacionPromedio: 4.7, reviews: 142, address: "Loreto 150, Ñuñoa", img: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=640&h=420&fit=crop", badge: null },
  { idLocal: "loc-05", nombreLocal: "Barbería Clásica 1920", tipoCatalogo: "Barbería Premium", horario: "09:00 – 19:00", calificacionPromedio: 4.6, reviews: 231, address: "Merced 82, Santiago Centro", img: "https://images.unsplash.com/photo-1536520002442-39764a41e987?w=640&h=420&fit=crop", badge: null },
  { idLocal: "loc-06", nombreLocal: "Lumière Skin Studio", tipoCatalogo: "Depilación & Skin", horario: "09:30 – 20:30", calificacionPromedio: 4.9, reviews: 405, address: "Av. Vitacura 3600", img: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=640&h=420&fit=crop", badge: "Top Local" },
];

const PRODUCTS = [
  { idProducto: "p-01", nombre: "Sérum Lumière Doré 30ml", descripcion: "Vitamina C + Niacinamida", precio: 89900, imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=400&h=400&fit=crop", categoria: "Tratamiento Facial" },
  { idProducto: "p-02", nombre: "Kit Renovación Profunda", descripcion: "Keratina + Óleo reparador", precio: 124500, imagen: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?w=400&h=400&fit=crop", categoria: "Capilar" },
  { idProducto: "p-03", nombre: "Mascarilla Oro 24K 250ml", descripcion: "Hidratación intensiva", precio: 54900, imagen: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=400&fit=crop", categoria: "Facial" },
  { idProducto: "p-04", nombre: "Óleo Reparador Premium", descripcion: "Argan + Aceite de Rosa", precio: 39900, imagen: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop", categoria: "Capilar" },
  { idProducto: "p-05", nombre: "Paleta Editorial Nude", descripcion: "12 tonos mate y satinado", precio: 67800, imagen: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop", categoria: "Maquillaje" },
  { idProducto: "p-06", nombre: "Contorno Perfeccionador", descripcion: "Fórmula buildable", precio: 45200, imagen: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=400&h=400&fit=crop", categoria: "Maquillaje" },
  { idProducto: "p-07", nombre: "Shampoo Hidratación 500ml", descripcion: "Sin sulfatos · pH balanceado", precio: 28900, imagen: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=400&fit=crop", categoria: "Capilar" },
  { idProducto: "p-08", nombre: "Crema Regenerativa Noche", descripcion: "Retinol + Péptidos", precio: 76500, imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=400&h=400&fit=crop", categoria: "Tratamiento Facial" },
];

type CartItem = { idProducto: string; nombre: string; precio: number; qty: number; imagen: string };

// ─── Component ────────────────────────────────────────────────────────────────

export default function Landing() {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState("salon");
  const [productFilter, setProductFilter] = useState("Todos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [bookingService, setBookingService] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingLocal, setBookingLocal] = useState("");
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(5);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.precio * i.qty, 0);
  const productCategories = ["Todos", ...Array.from(new Set(PRODUCTS.map((p) => p.categoria)))];
  const filteredProducts = productFilter === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.categoria === productFilter);
  const filteredLocals = activeCategory === "salon" ? LOCALS : LOCALS.filter((l) => l.tipoCatalogo === CATEGORIES.find(c => c.id === activeCategory)?.label);

  function addToCart(p: (typeof PRODUCTS)[0]) {
    setCart((prev) => {
      const ex = prev.find((i) => i.idProducto === p.idProducto);
      if (ex) return prev.map((i) => i.idProducto === p.idProducto ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { idProducto: p.idProducto, nombre: p.nombre, precio: p.precio, qty: 1, imagen: p.imagen }];
    });
    setCartOpen(true);
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) => prev.flatMap((i) => {
      if (i.idProducto !== id) return [i];
      const qty = i.qty + delta;
      return qty <= 0 ? [] : [{ ...i, qty }];
    }));
  }

  return (
    <div className="min-h-full bg-theme text-theme transition-colors duration-300">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 nav-bar">
        <Link to="/"><Logo height={40} ground={theme === "light" ? "light" : "dark"} /></Link>
        <div className="flex items-center gap-7 text-[13px] text-muted">
          <a href="#categorias" className="hover:text-gold transition-colors">Categorías</a>
          <a href="#locales" className="hover:text-gold transition-colors">Locales</a>
          <a href="#productos" className="hover:text-gold transition-colors">Catálogo</a>
          <Link to="/negocio" className="hover:text-gold transition-colors">Para Negocios</Link>
          <Link to="/proveedor" className="hover:text-gold transition-colors">Mayoristas</Link>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCartOpen(true)} className="relative p-2.5 btn-outline-gold text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0A0A0A] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>}
          </button>
          <ThemeToggle />
          <Link to="/login" className="text-xs btn-gold px-4 py-2.5">Ingresar</Link>
          {/* Role pills */}
          <div className="flex items-center gap-1 bg-theme-mid border border-[rgba(212,175,55,0.15)] rounded-xl px-1 py-1">
            {[
              { to: "/superadmin", label: "Admin" },
              { to: "/cliente", label: "Cliente" },
              { to: "/negocio", label: "Negocio" },
              { to: "/proveedor", label: "Proveedor" },
            ].map((r) => (
              <Link key={r.to} to={r.to} className="px-3 py-1.5 rounded-lg text-xs text-dim hover:text-gold hover:bg-[rgba(212,175,55,0.08)] transition-all">
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1773904215697-e6c21fc27ac2?w=1440&h=900&fit=crop" alt="Luxury salon" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 px-10 max-w-[700px]">
          <p className="text-[11px] tracking-[0.35em] text-gold-warm uppercase mb-5 font-medium">Estética Personal · Plataforma Premium</p>
          <h1 className="font-serif text-[62px] leading-[1.03] mb-6 text-theme">
            Tu bienestar,<br />
            <em className="not-italic text-gold">sin límites.</em>
          </h1>
          <p className="text-muted text-[17px] leading-relaxed mb-10 max-w-[520px]">
            Salones, barberías, spas, estudios de maquillaje y centros de estética. Reserva, compra y vive la experiencia premium.
          </p>

          {/* Booking bar */}
          <div className="flex items-stretch bg-theme-card border border-[rgba(212,175,55,0.22)] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex-1 px-5 py-4 border-r border-[rgba(212,175,55,0.1)]">
              <p className="text-[9px] tracking-[0.25em] uppercase text-gold-warm mb-1.5">Categoría</p>
              <select value={bookingService} onChange={(e) => setBookingService(e.target.value)} className="bg-transparent text-sm text-theme w-full outline-none cursor-pointer">
                <option value="" className="bg-theme-card">Elige un servicio...</option>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id} className="bg-theme-card">{c.label}</option>)}
              </select>
            </div>
            <div className="flex-1 px-5 py-4 border-r border-[rgba(212,175,55,0.1)]">
              <p className="text-[9px] tracking-[0.25em] uppercase text-gold-warm mb-1.5">Fecha</p>
              <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="bg-transparent text-sm text-theme w-full outline-none [color-scheme:dark]" />
            </div>
            <div className="flex-1 px-5 py-4 border-r border-[rgba(212,175,55,0.1)]">
              <p className="text-[9px] tracking-[0.25em] uppercase text-gold-warm mb-1.5">Local</p>
              <select value={bookingLocal} onChange={(e) => setBookingLocal(e.target.value)} className="bg-transparent text-sm text-theme w-full outline-none cursor-pointer">
                <option value="" className="bg-theme-card">Selecciona...</option>
                {LOCALS.map((l) => <option key={l.idLocal} value={l.idLocal} className="bg-theme-card">{l.nombreLocal}</option>)}
              </select>
            </div>
            <button className="btn-gold px-8 rounded-none text-[13px] font-semibold">Reservar →</button>
          </div>
        </div>

        {/* Floating KPIs */}
        <div className="absolute bottom-10 right-10 flex gap-8">
          {[{ v: "48", l: "Locales" }, { v: "2.4K+", l: "Citas/mes" }, { v: "4.9★", l: "Calificación" }, { v: "120+", l: "Productos" }].map((k) => (
            <div key={k.l} className="text-right">
              <p className="font-serif text-2xl text-gold">{k.v}</p>
              <p className="text-[11px] text-ghost mt-0.5">{k.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <section id="categorias" className="px-10 py-20 bg-theme-mid border-y border-[rgba(212,175,55,0.08)]">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-gold-warm uppercase mb-2">Explora por tipo</p>
            <h2 className="font-serif text-4xl text-theme">Categorías de Estética</h2>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => { setActiveCategory(cat.id); document.getElementById("locales")?.scrollIntoView({ behavior: "smooth" }); }}
              className={`group relative overflow-hidden rounded-2xl aspect-[3/4] transition-all duration-300 ${activeCategory === cat.id ? "ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#0D0D0D]" : "hover:ring-1 hover:ring-[rgba(212,175,55,0.5)]"}`}>
              <img src={cat.img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                <div className={`w-8 h-8 rounded-full mb-2 flex items-center justify-center transition-colors ${activeCategory === cat.id ? "bg-[#D4AF37]" : "bg-[rgba(212,175,55,0.2)]"}`}>
                  <svg className={`w-4 h-4 ${activeCategory === cat.id ? "text-[#0A0A0A]" : "text-gold"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} /></svg>
                </div>
                <p className="text-white text-[11px] font-medium text-center leading-tight">{cat.label}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── LOCAL_BELLEZA ── */}
      <section id="locales" className="px-10 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-gold-warm uppercase mb-2">LOCAL_BELLEZA · Selección Premium</p>
            <h2 className="font-serif text-4xl text-theme">Locales Destacados</h2>
          </div>
          <div className="flex gap-2">
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => setActiveCategory(c.id)}
                className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all ${activeCategory === c.id ? "border-[#D4AF37] text-gold bg-[rgba(212,175,55,0.1)]" : "border-[rgba(212,175,55,0.15)] text-dim hover:border-[rgba(212,175,55,0.35)] hover:text-[#AAA]"}`}>
                {c.label.split(" ")[0]}
              </button>
            ))}
            <button onClick={() => setActiveCategory("salon")} className="text-[11px] px-3.5 py-1.5 rounded-full border border-[rgba(212,175,55,0.15)] text-dim hover:text-gold hover:border-gold transition-all">Todos</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {(filteredLocals.length ? filteredLocals : LOCALS).slice(0, 6).map((local) => (
            <div key={local.idLocal} className="card-luxury overflow-hidden group cursor-pointer">
              <div className="relative h-52 bg-theme-mid overflow-hidden">
                <img src={local.img} alt={local.nombreLocal} className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="text-[10px] bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.35)] text-gold px-2.5 py-1 rounded-full uppercase tracking-wider">{local.tipoCatalogo}</span>
                  {local.badge && <span className="text-[10px] bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#E6CA65] px-2.5 py-1 rounded-full uppercase tracking-wider">{local.badge}</span>}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-xl text-theme leading-tight">{local.nombreLocal}</h3>
                  <div className="text-right ml-2 flex-shrink-0">
                    <span className="text-gold font-semibold text-lg">{local.calificacionPromedio}</span>
                    <div className="flex justify-end mt-0.5"><Stars rating={local.calificacionPromedio} /></div>
                  </div>
                </div>
                <p className="text-[12px] text-dim mb-0.5 flex items-center gap-1.5">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {local.address}
                </p>
                <p className="text-[12px] text-ghost mb-5 flex items-center gap-1.5">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {local.horario} · {local.reviews} reseñas
                </p>
                <div className="flex gap-2">
                  <Link to="/cliente" className="flex-1 btn-gold py-2.5 text-[13px] text-center">Reservar cita</Link>
                  <button onClick={() => setReviewModal(local.idLocal)} className="px-4 py-2.5 btn-outline-gold text-[13px]">Calificar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTOS (CATALOGO) ── */}
      <section id="productos" className="px-10 py-20 bg-theme-mid border-t border-[rgba(212,175,55,0.08)]">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-gold-warm uppercase mb-2">PRODUCTO · DET_PROD_CAT</p>
            <h2 className="font-serif text-4xl text-theme">Catálogo Premium</h2>
          </div>
          <div className="flex gap-2">
            {productCategories.map((cat) => (
              <button key={cat} onClick={() => setProductFilter(cat)}
                className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all ${productFilter === cat ? "border-[#D4AF37] text-gold bg-[rgba(212,175,55,0.1)]" : "border-[rgba(212,175,55,0.15)] text-dim hover:border-[rgba(212,175,55,0.35)] hover:text-[#AAA]"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <div key={p.idProducto} className="card-luxury overflow-hidden group cursor-pointer">
              <div className="relative h-44 bg-theme-mid overflow-hidden">
                <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <p className="text-[10px] tracking-widest text-gold-warm uppercase mb-1">{p.categoria}</p>
                <h4 className="font-serif text-[15px] text-theme mb-0.5 leading-snug">{p.nombre}</h4>
                <p className="text-[12px] text-ghost mb-3">{p.descripcion}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gold font-semibold text-lg">${p.precio.toLocaleString("es-CL")}</span>
                  <button onClick={() => addToCart(p)} className="btn-gold px-3.5 py-2 text-[12px] flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACCESO POR ROL ── */}
      <section className="px-10 py-20">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.3em] text-gold-warm uppercase mb-2">Acceso por Rol</p>
          <h2 className="font-serif text-4xl text-theme">¿Cuál es tu perfil?</h2>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {[
            { to: "/superadmin", label: "Superadmin", desc: "Control global del sistema, usuarios y auditoría", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "from-purple-500/20 to-purple-500/5" },
            { to: "/cliente", label: "Cliente", desc: "Explora, reserva citas y compra productos cosméticos", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", color: "from-[rgba(212,175,55,0.2)] to-[rgba(212,175,55,0.05)]" },
            { to: "/negocio", label: "Negocio / Local", desc: "Administra tu establecimiento, catálogo y citas", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", color: "from-emerald-500/20 to-emerald-500/5" },
            { to: "/proveedor", label: "Proveedor", desc: "Gestiona suministros mayoristas y precios de mayoreo", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "from-sky-500/20 to-sky-500/5" },
          ].map((r) => (
            <Link key={r.to} to={r.to} className={`card-luxury p-6 bg-gradient-to-b ${r.color} hover:scale-[1.02] transition-transform cursor-pointer block`}>
              <div className="w-12 h-12 rounded-2xl bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={r.icon} /></svg>
              </div>
              <h3 className="font-serif text-xl text-theme mb-2">{r.label}</h3>
              <p className="text-[13px] text-dim leading-relaxed">{r.desc}</p>
              <p className="text-gold text-[13px] mt-4">Acceder →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-10 py-14 border-t border-[rgba(212,175,55,0.1)]">
        <div className="flex items-start justify-between mb-10">
          <div>
            <Logo height={52} ground="dark" />
            <p className="text-ghost text-[13px] mt-3 max-w-xs leading-relaxed">La plataforma integral de estética personal para quienes exigen lo mejor.</p>
          </div>
          <div className="flex gap-16 text-[13px]">
            <div>
              <p className="text-theme font-medium mb-4">Plataforma</p>
              {["Locales", "Catálogo", "Citas", "Calificaciones"].map((l) => <p key={l} className="text-ghost mb-2 hover:text-gold-warm cursor-pointer transition-colors">{l}</p>)}
            </div>
            <div>
              <p className="text-theme font-medium mb-4">Roles</p>
              {["Superadmin", "Cliente", "Negocio", "Proveedor"].map((l) => <p key={l} className="text-ghost mb-2 hover:text-gold-warm cursor-pointer transition-colors">{l}</p>)}
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-[rgba(212,175,55,0.07)] flex justify-between text-[11px] text-ghost">
          <span>© 2026 LookBy · Todos los derechos reservados.</span>
          <span>Modelo entidad-relación: USUARIO · ROL · LOCAL_BELLEZA · PRODUCTO · PEDIDO</span>
        </div>
      </footer>

      {/* ── MODAL CALIFICACIÓN ── */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setReviewModal(null)} />
          <div className="relative bg-theme-mid border border-[rgba(212,175,55,0.25)] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl text-theme">Calificar Local</h3>
              <button onClick={() => setReviewModal(null)} className="text-dim hover:text-theme transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-[11px] text-dim uppercase tracking-widest mb-3">CALIFICACION · puntuacion</p>
            <div className="flex gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setReviewStars(s)}>
                  <svg className={`w-7 h-7 transition-colors ${s <= reviewStars ? "text-[#D4AF37]" : "text-ghost"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            <label className="block text-[10px] tracking-widest uppercase text-dim mb-2">Comentario</label>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={3} placeholder="Describe tu experiencia..." className="w-full bg-theme border border-[rgba(212,175,55,0.2)] rounded-xl px-4 py-3 text-sm text-theme placeholder-[#333] outline-none focus:border-[#D4AF37] resize-none transition-colors" />
            <button onClick={() => { setReviewModal(null); setReviewText(""); setReviewStars(5); }} className="w-full btn-gold py-3 text-sm mt-4">Enviar Calificación</button>
          </div>
        </div>
      )}

      {/* ── CART SIDEBAR ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative w-[420px] bg-theme-card border-l border-[rgba(212,175,55,0.2)] flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(212,175,55,0.12)]">
              <div>
                <h3 className="font-serif text-xl text-theme">Carrito</h3>
                <p className="text-[11px] text-dim mt-0.5">PEDIDO · {cartCount} {cartCount === 1 ? "ítem" : "ítems"}</p>
              </div>
              <button onClick={() => setCartOpen(false)} className="text-dim hover:text-theme transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-14 h-14 rounded-full border border-[rgba(212,175,55,0.2)] flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-ghost" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <p className="text-ghost text-sm">Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.idProducto} className="flex items-center gap-4 py-4 border-b border-[rgba(255,255,255,0.04)]">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-theme-card flex-shrink-0">
                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-theme font-medium truncate">{item.nombre}</p>
                        <p className="text-gold text-[13px] font-semibold">${item.precio.toLocaleString("es-CL")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.idProducto, -1)} className="w-6 h-6 rounded-full border border-[rgba(212,175,55,0.3)] text-gold text-sm flex items-center justify-center hover:border-gold transition-colors">−</button>
                        <span className="w-4 text-center text-sm text-theme">{item.qty}</span>
                        <button onClick={() => updateQty(item.idProducto, 1)} className="w-6 h-6 rounded-full border border-[rgba(212,175,55,0.3)] text-gold text-sm flex items-center justify-center hover:border-gold transition-colors">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="px-6 py-6 border-t border-[rgba(212,175,55,0.12)]">
                <div className="flex justify-between text-[13px] text-dim mb-2"><span>Subtotal</span><span>${total.toLocaleString("es-CL")}</span></div>
                <div className="flex justify-between text-[13px] text-dim mb-4"><span>Envío</span><span className="text-gold">Gratis</span></div>
                <div className="flex justify-between text-lg font-semibold text-theme mb-5"><span>Total</span><span className="text-gold">${total.toLocaleString("es-CL")}</span></div>
                <Link to="/cliente" className="block w-full btn-gold py-3.5 text-[13px] text-center" onClick={() => setCartOpen(false)}>Ir al Checkout →</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
