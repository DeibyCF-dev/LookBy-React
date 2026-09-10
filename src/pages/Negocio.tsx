import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Badge, StatCard, Stars, Sidebar, PageShell, TopNav, MainContent, TableWrapper, Th, Td, SectionHeader, Modal, Input, Select, ThemeToggle } from "@/components/ui";
import { useAuth } from "@/store/auth";

// ─── Seed data mapped to DER ──────────────────────────────────────────────────

// LOCAL_BELLEZA
const LOCAL = { idLocal: "loc-01", nombreLocal: "Atelier Doré", horario: "09:00–20:00", calificacionPromedio: 4.9, tipo: "Salón de Belleza", address: "Av. Providencia 2350" };

// CATALOGO del local
const CATALOGOS = [
  { idCatalogo: "cat-01", idLocal: "loc-01", tipoCatalogo: "Productos Capilares", descripcion: "Shampoos, acondicionadores y tratamientos" },
  { idCatalogo: "cat-02", idLocal: "loc-01", tipoCatalogo: "Servicios Faciales", descripcion: "Sérums, mascarillas y cremas premium" },
  { idCatalogo: "cat-03", idLocal: "loc-01", tipoCatalogo: "Maquillaje Profesional", descripcion: "Paletas, contorno y acabados" },
];

// DET_PROD_CAT (productos vinculados al catálogo con precio local y stock)
const DET_PROD_CAT = [
  { idDetalleCat: "dpc-01", idCatalogo: "cat-01", idProducto: "p-01", nombre: "Sérum Lumière Doré 30ml", imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=200&h=200&fit=crop", stockDisponible: 14, precioLocal: 89900, disponibilidad: true, catalogo: "Productos Capilares" },
  { idDetalleCat: "dpc-02", idCatalogo: "cat-01", idProducto: "p-02", nombre: "Kit Renovación Profunda", imagen: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?w=200&h=200&fit=crop", stockDisponible: 7, precioLocal: 124500, disponibilidad: true, catalogo: "Productos Capilares" },
  { idDetalleCat: "dpc-03", idCatalogo: "cat-02", idProducto: "p-03", nombre: "Mascarilla Oro 24K 250ml", imagen: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=200&h=200&fit=crop", stockDisponible: 22, precioLocal: 54900, disponibilidad: true, catalogo: "Servicios Faciales" },
  { idDetalleCat: "dpc-04", idCatalogo: "cat-02", idProducto: "p-08", nombre: "Crema Regenerativa Noche", imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=200&h=200&fit=crop", stockDisponible: 3, precioLocal: 76500, disponibilidad: false, catalogo: "Servicios Faciales" },
  { idDetalleCat: "dpc-05", idCatalogo: "cat-03", idProducto: "p-05", nombre: "Paleta Editorial Nude", imagen: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop", stockDisponible: 18, precioLocal: 67800, disponibilidad: true, catalogo: "Maquillaje Profesional" },
  { idDetalleCat: "dpc-06", idCatalogo: "cat-03", idProducto: "p-06", nombre: "Contorno Perfeccionador", imagen: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=200&h=200&fit=crop", stockDisponible: 0, precioLocal: 45200, disponibilidad: false, catalogo: "Maquillaje Profesional" },
];

// PEDIDO de clientes
const PEDIDOS = [
  { idPedido: "PED-20481", idUsuario: "u-01", cliente: "Sofía Alarcón", fecha: "28 ago 2026", estado: "Completado", montoTotal: 144800, items: "Sérum Lumière + Mascarilla" },
  { idPedido: "PED-20480", idUsuario: "u-04", cliente: "Camila Torres", fecha: "28 ago 2026", estado: "En Preparación", montoTotal: 124500, items: "Kit Renovación Profunda" },
  { idPedido: "PED-20479", idUsuario: "u-06", cliente: "María José Ríos", fecha: "27 ago 2026", estado: "Pendiente", montoTotal: 107700, items: "Paleta + Óleo Reparador" },
  { idPedido: "PED-20478", idUsuario: "u-01", cliente: "Valentina Pino", fecha: "27 ago 2026", estado: "Completado", montoTotal: 45200, items: "Contorno Perfeccionador" },
  { idPedido: "PED-20477", idUsuario: "u-04", cliente: "Isadora Muñoz", fecha: "26 ago 2026", estado: "En Preparación", montoTotal: 89900, items: "Sérum Lumière Doré" },
];

// CALIFICACION recibidas
const CALIFICACIONES_RECIBIDAS = [
  { idCalificacion: "cal-01", cliente: "Sofía A.", comentario: "Excelente atención, quedé encantada con la colorimetría.", puntuacion: 5, fecha: "25 ago 2026" },
  { idCalificacion: "cal-02", cliente: "Camila T.", comentario: "El servicio de keratina fue increíble. Lo repetiré.", puntuacion: 5, fecha: "15 ago 2026" },
  { idCalificacion: "cal-03", cliente: "Valentina P.", comentario: "Muy buena experiencia, aunque el tiempo de espera fue largo.", puntuacion: 4, fecha: "10 ago 2026" },
  { idCalificacion: "cal-04", cliente: "Isadora M.", comentario: "Ambiente premium, atención personalizada. Top!", puntuacion: 5, fecha: "05 ago 2026" },
];

// Agenda del día
const AGENDA = [
  { hora: "09:00", cliente: "Martina López", servicio: "Colorimetría Completa", profesional: "Valentina R.", estado: "Completada", precio: 38000 },
  { hora: "10:30", cliente: "Sofía Alarcón", servicio: "Keratina Brasileña", profesional: "Camila M.", estado: "En curso", precio: 52000 },
  { hora: "12:00", cliente: "Javiera Pinto", servicio: "Corte & Peinado", profesional: "Andrea S.", estado: "En curso", precio: 22000 },
  { hora: "14:30", cliente: "Constanza Vega", servicio: "Manicura Premium", profesional: "Nicole B.", estado: "Confirmada", precio: 18000 },
  { hora: "16:00", cliente: "Isadora Muñoz", servicio: "Facial Hidratante", profesional: "Valentina R.", estado: "Confirmada", precio: 35000 },
  { hora: "18:30", cliente: "Fernanda Cruz", servicio: "Tratamiento Capilar", profesional: "Camila M.", estado: "Confirmada", precio: 28000 },
];

const ESTADO_V: Record<string, "success" | "warning" | "neutral" | "gold"> = { Completado: "success", Completada: "success", "En Preparación": "warning", Pendiente: "neutral", "En curso": "gold", Confirmada: "neutral" };
const STATUS_OPTS = ["Pendiente", "En Preparación", "Completado"];

const NAV_ITEMS = [
  { key: "dashboard", label: "Resumen del Local", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { key: "catalogo", label: "Catálogos", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
  { key: "inventario", label: "Inventario (DET_PROD_CAT)", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { key: "pedidos", label: "Pedidos Clientes", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { key: "agenda", label: "Agenda del Día", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { key: "calificaciones", label: "Calificaciones", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
];

export default function Negocio() {
  const [tab, setTab] = useState("dashboard");
  const [statuses, setStatuses] = useState<Record<string, string>>(Object.fromEntries(PEDIDOS.map((p) => [p.idPedido, p.estado])));
  const [detProdCat, setDetProdCat] = useState(DET_PROD_CAT);
  const [newProdModal, setNewProdModal] = useState(false);
  const { user, logout } = useAuth();

  function updateStatus(id: string, val: string) {
    setStatuses((prev) => ({ ...prev, [id]: val }));
  }

  function toggleDisponibilidad(id: string) {
    setDetProdCat((prev) => prev.map((d) => d.idDetalleCat === id ? { ...d, disponibilidad: !d.disponibilidad } : d));
  }

  function updatePrecioLocal(id: string, val: string) {
    setDetProdCat((prev) => prev.map((d) => d.idDetalleCat === id ? { ...d, precioLocal: parseInt(val) || d.precioLocal } : d));
  }

  const totalIngresos = PEDIDOS.filter((p) => statuses[p.idPedido] === "Completado").reduce((s, p) => s + p.montoTotal, 0);
  const agendaHoy = AGENDA.filter((a) => a.estado !== "Completada").length;

  return (
    <PageShell
      nav={
        <TopNav
          logo={<Link to="/"><Logo height={40} /></Link>}
          center={
            <div className="flex items-center gap-2 text-[11px] text-ghost">
              <span className="tracking-[0.25em] uppercase">Panel Negocio</span>
              <span className="text-[#2A2A2A]">·</span>
              <span className="text-dim">{LOCAL.nombreLocal}</span>
            </div>
          }
          right={
            <>
              {user && <span className="text-[11px] text-dim">{user.nombre}</span>}
              {user && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/50 to-emerald-800/50 border border-emerald-500/30 flex items-center justify-center text-theme text-xs font-bold">
                  {user.nombre.charAt(0)}
                </div>
              )}
              <ThemeToggle />
              <button onClick={() => void logout()} className="text-xs btn-outline-gold px-4 py-2">Cerrar sesión</button>
              <Link to="/" className="text-xs btn-outline-gold px-4 py-2">← Inicio</Link>
            </>
          }
        />
      }
    >
      <Sidebar
        items={NAV_ITEMS}
        active={tab}
        onSelect={setTab}
        title={LOCAL.nombreLocal}
        subtitle={LOCAL.address}
        avatarImg="https://images.unsplash.com/photo-1764475501545-d5cc9719af1a?w=200&h=200&fit=crop"
        badge={<Badge variant="success">{LOCAL.tipo}</Badge>}
      />

      <MainContent>
        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            <SectionHeader eyebrow="LOCAL_BELLEZA · Agosto 2026" title="Resumen del Local" />
            <div className="grid grid-cols-4 gap-5 mb-10">
              <StatCard label="Ingresos del mes" value={`$${totalIngresos.toLocaleString("es-CL")}`} sub="+18% vs julio" icon="12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" trend="up" />
              <StatCard label="Citas pendientes hoy" value={String(agendaHoy)} sub="6 en agenda total" icon="8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" trend="up" />
              <StatCard label="Calificación promedio" value={`${LOCAL.calificacionPromedio} ★`} sub="Basado en 312 reseñas" icon="11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" trend="up" />
              <StatCard label="Pedidos entrantes" value="7" sub="3 requieren atención" icon="16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" trend="neutral" />
            </div>

            {/* Agenda preview */}
            <div className="grid grid-cols-5 gap-5">
              <div className="col-span-3 card-luxury overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(212,175,55,0.1)]">
                  <p className="text-[10px] tracking-widest uppercase text-dim">Agenda de Hoy — 3 Sep 2026</p>
                  <button onClick={() => setTab("agenda")} className="text-[11px] text-gold-warm hover:text-gold transition-colors">Ver todo →</button>
                </div>
                {AGENDA.slice(0, 4).map((a, i) => (
                  <div key={i} className="flex items-center gap-5 px-5 py-3.5 border-b border-[rgba(128,128,128,0.07)] last:border-0 hover:bg-[rgba(212,175,55,0.02)] transition-colors">
                    <span className="text-gold font-medium text-sm w-12 flex-shrink-0">{a.hora}</span>
                    <div className="flex-1">
                      <p className="text-sm text-theme">{a.cliente}</p>
                      <p className="text-[11px] text-dim">{a.servicio} · {a.profesional}</p>
                    </div>
                    <span className="text-gold-warm text-sm font-medium flex-shrink-0">${a.precio.toLocaleString("es-CL")}</span>
                    <Badge variant={ESTADO_V[a.estado] ?? "neutral"}>{a.estado}</Badge>
                  </div>
                ))}
              </div>
              <div className="col-span-2 card-luxury p-5">
                <p className="text-[10px] tracking-widest uppercase text-dim mb-5">CALIFICACION · Recientes</p>
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[rgba(212,175,55,0.08)]">
                  <div className="flex flex-col items-center">
                    <span className="font-serif text-4xl text-gold">{LOCAL.calificacionPromedio}</span>
                    <Stars rating={LOCAL.calificacionPromedio} size="md" />
                    <span className="text-[10px] text-ghost mt-1">312 reseñas</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((s) => {
                      const pct = s === 5 ? 78 : s === 4 ? 16 : s === 3 ? 4 : s === 2 ? 1 : 1;
                      return (
                        <div key={s} className="flex items-center gap-2">
                          <span className="text-[10px] text-ghost w-2">{s}</span>
                          <div className="flex-1 h-1.5 bg-theme-mid rounded-full overflow-hidden">
                            <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {CALIFICACIONES_RECIBIDAS.slice(0, 2).map((c) => (
                  <div key={c.idCalificacion} className="mb-4 pb-4 border-b border-[rgba(128,128,128,0.07)] last:border-0 last:mb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-theme">{c.cliente}</span>
                      <Stars rating={c.puntuacion} />
                    </div>
                    <p className="text-[11px] text-dim italic">"{c.comentario.slice(0, 60)}..."</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CATÁLOGOS ── */}
        {tab === "catalogo" && (
          <div>
            <SectionHeader eyebrow="CATALOGO · tipoCatalogo" title="Catálogos del Local" action={<button className="btn-gold px-5 py-2.5 text-sm">+ Nuevo Catálogo</button>} />
            <div className="grid grid-cols-3 gap-5">
              {CATALOGOS.map((cat) => {
                const prods = detProdCat.filter((d) => d.idCatalogo === cat.idCatalogo);
                return (
                  <div key={cat.idCatalogo} className="card-luxury p-5">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    </div>
                    <h3 className="font-serif text-xl text-theme mb-1">{cat.tipoCatalogo}</h3>
                    <p className="text-[12px] text-dim mb-4">{cat.descripcion}</p>
                    <div className="flex items-center justify-between py-3 border-t border-[rgba(212,175,55,0.08)]">
                      <div>
                        <p className="text-[10px] text-ghost uppercase tracking-wider">Productos</p>
                        <p className="font-serif text-2xl text-theme">{prods.length}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-ghost uppercase tracking-wider">Stock total</p>
                        <p className="font-serif text-2xl text-gold">{prods.reduce((s, d) => s + d.stockDisponible, 0)}</p>
                      </div>
                      <button onClick={() => setTab("inventario")} className="btn-outline-gold px-3.5 py-2 text-[12px]">Ver →</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── INVENTARIO DET_PROD_CAT ── */}
        {tab === "inventario" && (
          <div>
            <SectionHeader eyebrow="DET_PROD_CAT · stockDisponible · precioLocal · disponibilidad" title="Inventario del Catálogo" action={<button onClick={() => setNewProdModal(true)} className="btn-gold px-5 py-2.5 text-sm">+ Vincular Producto</button>} />
            <div className="grid grid-cols-2 gap-5">
              {detProdCat.map((d) => (
                <div key={d.idDetalleCat} className="card-luxury p-5 flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-theme-mid flex-shrink-0">
                    <img src={d.imagen} alt={d.nombre} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gold-warm uppercase tracking-widest mb-0.5">{d.catalogo}</p>
                    <h4 className="text-theme text-[14px] font-medium mb-2 leading-snug">{d.nombre}</h4>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-ghost">$</span>
                        <input
                          type="number"
                          value={d.precioLocal}
                          onChange={(e) => updatePrecioLocal(d.idDetalleCat, e.target.value)}
                          className="w-24 bg-theme-mid border border-[rgba(212,175,55,0.2)] rounded-lg px-2.5 py-1.5 text-sm text-theme outline-none focus:border-[#D4AF37] transition-colors"
                        />
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${d.stockDisponible === 0 ? "text-rose-400 bg-rose-400/10 border-rose-400/20" : d.stockDisponible < 10 ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-dim bg-theme-surface border-[rgba(128,128,128,0.1)]"}`}>
                        Stock: {d.stockDisponible}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleDisponibilidad(d.idDetalleCat)}
                        className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-xl border transition-colors ${d.disponibilidad ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" : "border-rose-500/30 text-rose-400 hover:bg-rose-500/10"}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${d.disponibilidad ? "bg-emerald-400" : "bg-rose-400"}`} />
                        {d.disponibilidad ? "Disponible" : "No disponible"}
                      </button>
                      <button className="text-[11px] btn-outline-gold px-3 py-1.5 rounded-xl">Editar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PEDIDOS ── */}
        {tab === "pedidos" && (
          <div>
            <SectionHeader eyebrow="PEDIDO · estado · montoTotal" title="Pedidos de Clientes" />
            <TableWrapper>
              <thead>
                <tr>{["Pedido", "Cliente", "Productos", "Fecha", "Monto Total", "Estado", "Acción"].map((h) => <Th key={h}>{h}</Th>)}</tr>
              </thead>
              <tbody>
                {PEDIDOS.map((p) => (
                  <tr key={p.idPedido} className="hover:bg-[rgba(212,175,55,0.02)] transition-colors">
                    <Td className="text-gold font-medium">{p.idPedido}</Td>
                    <Td className="text-theme">{p.cliente}</Td>
                    <Td className="text-dim max-w-[160px] truncate text-[12px]">{p.items}</Td>
                    <Td className="text-dim text-[12px]">{p.fecha}</Td>
                    <Td className="text-gold-warm font-medium">${p.montoTotal.toLocaleString("es-CL")}</Td>
                    <Td><Badge variant={ESTADO_V[statuses[p.idPedido]] ?? "neutral"}>{statuses[p.idPedido]}</Badge></Td>
                    <Td>
                      <select
                        value={statuses[p.idPedido]}
                        onChange={(e) => updateStatus(p.idPedido, e.target.value)}
                        className="bg-theme-mid border border-[rgba(212,175,55,0.2)] rounded-xl px-3 py-1.5 text-[12px] text-theme outline-none cursor-pointer"
                      >
                        {STATUS_OPTS.map((s) => <option key={s} className="bg-[var(--bg-card)] text-[var(--fg)]">{s}</option>)}
                      </select>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrapper>
          </div>
        )}

        {/* ── AGENDA ── */}
        {tab === "agenda" && (
          <div>
            <SectionHeader eyebrow="Citas del Local · 03 Sep 2026" title="Agenda del Día" action={<button className="btn-gold px-5 py-2.5 text-sm">+ Agendar Cita</button>} />
            <div className="grid grid-cols-1 gap-3">
              {AGENDA.map((a, i) => (
                <div key={i} className="card-luxury px-6 py-4 flex items-center gap-6">
                  <div className="w-16 flex-shrink-0">
                    <p className="font-serif text-xl text-gold">{a.hora}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-theme font-medium">{a.cliente}</p>
                    <p className="text-[12px] text-dim">{a.servicio} · {a.profesional}</p>
                  </div>
                  <p className="text-gold-warm font-medium flex-shrink-0">${a.precio.toLocaleString("es-CL")}</p>
                  <Badge variant={ESTADO_V[a.estado] ?? "neutral"}>{a.estado}</Badge>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="text-[11px] btn-outline-gold px-3 py-1.5 rounded-xl">Editar</button>
                    <button className="text-[11px] px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors">Cancelar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CALIFICACIONES ── */}
        {tab === "calificaciones" && (
          <div>
            <SectionHeader eyebrow="CALIFICACION · puntuacion · comentario" title="Reseñas Recibidas" />
            <div className="grid grid-cols-5 gap-6 mb-8">
              <div className="col-span-2 card-luxury p-6 flex flex-col items-center justify-center text-center">
                <span className="font-serif text-6xl text-gold mb-2">{LOCAL.calificacionPromedio}</span>
                <Stars rating={LOCAL.calificacionPromedio} size="md" />
                <p className="text-ghost text-sm mt-3">312 calificaciones totales</p>
                <div className="w-full mt-6 space-y-2">
                  {[5, 4, 3, 2, 1].map((s) => {
                    const pct = s === 5 ? 78 : s === 4 ? 16 : s === 3 ? 4 : 1;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <span className="text-[11px] text-ghost w-3">{s}</span>
                        <div className="flex-1 h-2 bg-theme-mid rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C89D7C] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[11px] text-ghost w-6">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-3 space-y-4">
                {CALIFICACIONES_RECIBIDAS.map((c) => (
                  <div key={c.idCalificacion} className="card-luxury p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37]/40 to-[#C89D7C]/40 border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-[12px] font-semibold text-gold">{c.cliente.charAt(0)}</div>
                        <div>
                          <p className="text-theme text-sm font-medium">{c.cliente}</p>
                          <p className="text-[11px] text-ghost">{c.fecha}</p>
                        </div>
                      </div>
                      <Stars rating={c.puntuacion} size="md" />
                    </div>
                    <p className="text-[13px] text-muted italic border-l-2 border-[rgba(212,175,55,0.2)] pl-4">"{c.comentario}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </MainContent>

      {/* Modal nuevo producto */}
      <Modal open={newProdModal} onClose={() => setNewProdModal(false)} title="Vincular Producto al Catálogo">
        <div className="space-y-4">
          <p className="text-[11px] text-dim uppercase tracking-widest">DET_PROD_CAT · Nuevo vínculo</p>
          <Select label="Catálogo (CATALOGO)">
            {CATALOGOS.map((c) => <option key={c.idCatalogo} className="bg-[var(--bg-card)] text-[var(--fg)]">{c.tipoCatalogo}</option>)}
          </Select>
          <Input label="Nombre del Producto (PRODUCTO)" placeholder="Nombre del producto" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio Local (precioLocal)" type="number" placeholder="0" />
            <Input label="Stock Disponible" type="number" placeholder="0" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="disp" defaultChecked className="w-4 h-4 rounded border-[rgba(212,175,55,0.3)] accent-[#D4AF37]" />
            <label htmlFor="disp" className="text-sm text-muted">disponibilidad: true</label>
          </div>
          <button onClick={() => setNewProdModal(false)} className="w-full btn-gold py-3 text-sm">Vincular al Catálogo</button>
        </div>
      </Modal>
    </PageShell>
  );
}
