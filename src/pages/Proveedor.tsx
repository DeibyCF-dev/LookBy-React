import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Badge, StatCard, Sidebar, PageShell, TopNav, MainContent, TableWrapper, Th, Td, SectionHeader, Modal, Input, Select, ThemeToggle } from "@/components/ui";
import { useAuth } from "@/store/auth";

// ─── Seed data mapped to DER ──────────────────────────────────────────────────

// PROVEEDOR
const PROVEEDOR = { idProveedor: "prov-01", razonSocial: "Distribuidora Andina S.A.", contacto: "ventas@andina.cl", rut: "72.345.678-9" };

// DET_PROD_PROV (productos que el proveedor ofrece a negocios)
const DET_PROD_PROV_DATA = [
  { idDetalleProv: "dpp-01", idProveedor: "prov-01", idProducto: "p-01", nombre: "Sérum Lumière Doré 30ml", categoria: "Tratamiento Facial", imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=300&h=300&fit=crop", precioMayoreo: 52000, precioRetail: 89900, stockProveedor: 840, tiempoEntrega: "2–3 días hábiles", moq: 6 },
  { idDetalleProv: "dpp-02", idProveedor: "prov-01", idProducto: "p-02", nombre: "Kit Renovación Profunda", categoria: "Capilar", imagen: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?w=300&h=300&fit=crop", precioMayoreo: 74000, precioRetail: 124500, stockProveedor: 320, tiempoEntrega: "1–2 días hábiles", moq: 4 },
  { idDetalleProv: "dpp-03", idProveedor: "prov-01", idProducto: "p-03", nombre: "Mascarilla Oro 24K 250ml", categoria: "Tratamiento Facial", imagen: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=300&h=300&fit=crop", precioMayoreo: 31500, precioRetail: 54900, stockProveedor: 195, tiempoEntrega: "3–5 días hábiles", moq: 12 },
  { idDetalleProv: "dpp-04", idProveedor: "prov-01", idProducto: "p-04", nombre: "Óleo Reparador Premium", categoria: "Capilar", imagen: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&h=300&fit=crop", precioMayoreo: 22800, precioRetail: 39900, stockProveedor: 612, tiempoEntrega: "2–3 días hábiles", moq: 10 },
  { idDetalleProv: "dpp-05", idProveedor: "prov-01", idProducto: "p-05", nombre: "Paleta Editorial Nude", categoria: "Maquillaje", imagen: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop", precioMayoreo: 39500, precioRetail: 67800, stockProveedor: 48, tiempoEntrega: "4–6 días hábiles", moq: 3 },
  { idDetalleProv: "dpp-06", idProveedor: "prov-01", idProducto: "p-06", nombre: "Contorno Perfeccionador", categoria: "Maquillaje", imagen: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=300&h=300&fit=crop", precioMayoreo: 26200, precioRetail: 45200, stockProveedor: 134, tiempoEntrega: "2–4 días hábiles", moq: 6 },
  { idDetalleProv: "dpp-07", idProveedor: "prov-01", idProducto: "p-07", nombre: "Shampoo Hidratación 500ml", categoria: "Capilar", imagen: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=300&h=300&fit=crop", precioMayoreo: 16800, precioRetail: 28900, stockProveedor: 0, tiempoEntrega: "5–7 días hábiles", moq: 24 },
  { idDetalleProv: "dpp-08", idProveedor: "prov-01", idProducto: "p-08", nombre: "Crema Regenerativa Noche", categoria: "Tratamiento Facial", imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=300&h=300&fit=crop", precioMayoreo: 44500, precioRetail: 76500, stockProveedor: 280, tiempoEntrega: "2–3 días hábiles", moq: 6 },
];

// Órdenes de negocios al proveedor
const ORDENES = [
  { id: "ORD-001", negocio: "Atelier Doré", productos: "Sérum Lumière × 12 · Mascarilla Oro × 24", fecha: "01 sep 2026", total: 1380000, estado: "Enviado" },
  { id: "ORD-002", negocio: "Studio Makeover Pro", productos: "Paleta Editorial × 6 · Contorno × 12", fecha: "29 ago 2026", total: 551400, estado: "Procesando" },
  { id: "ORD-003", negocio: "Noir & Or Barbería", productos: "Shampoo Hidratación × 48", fecha: "27 ago 2026", total: 806400, estado: "Recibido" },
  { id: "ORD-004", negocio: "Velvet Spa & Wellness", productos: "Óleo Reparador × 20 · Crema Regen × 12", fecha: "25 ago 2026", total: 990000, estado: "Enviado" },
];

const ESTADO_ORDEN: Record<string, "success" | "warning" | "info" | "neutral"> = { Recibido: "success", Enviado: "info", Procesando: "warning" };

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard Mayorista", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { key: "catalogo", label: "Catálogo Mayorista", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { key: "ordenes", label: "Órdenes de Negocios", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { key: "perfil", label: "Perfil Proveedor", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
];

export default function Proveedor() {
  const [tab, setTab] = useState("dashboard");
  const [filter, setFilter] = useState("Todos");
  const [quantities, setQuantities] = useState<Record<string, number>>(Object.fromEntries(DET_PROD_PROV_DATA.map((d) => [d.idDetalleProv, d.moq])));
  const [newProdModal, setNewProdModal] = useState(false);
  const [detProdProv, setDetProdProv] = useState(DET_PROD_PROV_DATA);
  const { user, logout } = useAuth();

  const categories = ["Todos", ...Array.from(new Set(DET_PROD_PROV_DATA.map((d) => d.categoria)))];
  const filtered = filter === "Todos" ? detProdProv : detProdProv.filter((d) => d.categoria === filter);
  const savings = (d: (typeof DET_PROD_PROV_DATA)[0]) => Math.round(((d.precioRetail - d.precioMayoreo) / d.precioRetail) * 100);

  function updateQty(id: string, delta: number) {
    const moq = DET_PROD_PROV_DATA.find((d) => d.idDetalleProv === id)!.moq;
    setQuantities((prev) => ({ ...prev, [id]: Math.max(moq, prev[id] + delta) }));
  }

  function updateStock(id: string, val: string) {
    setDetProdProv((prev) => prev.map((d) => d.idDetalleProv === id ? { ...d, stockProveedor: parseInt(val) || 0 } : d));
  }

  function updatePrice(id: string, val: string) {
    setDetProdProv((prev) => prev.map((d) => d.idDetalleProv === id ? { ...d, precioMayoreo: parseInt(val) || d.precioMayoreo } : d));
  }

  const totalStock = detProdProv.reduce((s, d) => s + d.stockProveedor, 0);
  const ingresos = ORDENES.reduce((s, o) => s + o.total, 0);

  return (
    <PageShell
      nav={
        <TopNav
          logo={<Link to="/"><Logo height={40} /></Link>}
          center={
            <div className="flex items-center gap-2 text-[11px] text-ghost">
              <span className="tracking-[0.25em] uppercase">Portal Proveedor</span>
              <span className="text-[#2A2A2A]">·</span>
              <span className="text-dim">{PROVEEDOR.razonSocial}</span>
            </div>
          }
          right={
            <>
              {user && <span className="text-[11px] text-dim">{user.nombre}</span>}
              {user && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500/50 to-sky-800/50 border border-sky-500/30 flex items-center justify-center text-theme text-xs font-bold">
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
      <Sidebar items={NAV_ITEMS} active={tab} onSelect={setTab} title={PROVEEDOR.razonSocial} subtitle={PROVEEDOR.contacto} avatarLetter="D" badge={<Badge variant="info">PROVEEDOR</Badge>} />

      <MainContent>
        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            <SectionHeader eyebrow="PROVEEDOR · DET_PROD_PROV · Agosto 2026" title="Dashboard Mayorista" />
            <div className="grid grid-cols-4 gap-5 mb-10">
              <StatCard label="Productos en catálogo" value={String(detProdProv.length)} sub={`${categories.length - 1} categorías`} icon="20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              <StatCard label="Stock total disponible" value={totalStock.toLocaleString()} sub="Todas las referencias" icon="4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" trend="up" />
              <StatCard label="Ingresos periodo" value={`$${(ingresos / 1000000).toFixed(1)}M`} sub="CLP · agosto 2026" icon="12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" trend="up" />
              <StatCard label="Órdenes activas" value={String(ORDENES.filter((o) => o.estado !== "Recibido").length)} sub="2 en proceso" icon="9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" trend="neutral" />
            </div>

            {/* Stock alerts */}
            <div className="grid grid-cols-2 gap-5">
              <div className="card-luxury overflow-hidden">
                <div className="px-5 py-4 border-b border-[rgba(212,175,55,0.1)]">
                  <p className="text-[10px] tracking-widest uppercase text-dim">Alertas de Stock · DET_PROD_PROV</p>
                </div>
                {detProdProv.filter((d) => d.stockProveedor < 100).map((d) => (
                  <div key={d.idDetalleProv} className="flex items-center gap-4 px-5 py-3.5 border-b border-[rgba(128,128,128,0.07)] last:border-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${d.stockProveedor === 0 ? "bg-rose-400" : "bg-amber-400"}`} />
                    <div className="flex-1">
                      <p className="text-[13px] text-theme">{d.nombre}</p>
                      <p className="text-[11px] text-ghost">stockProveedor: {d.stockProveedor} unidades</p>
                    </div>
                    <Badge variant={d.stockProveedor === 0 ? "danger" : "warning"}>{d.stockProveedor === 0 ? "Agotado" : "Stock bajo"}</Badge>
                  </div>
                ))}
              </div>
              <div className="card-luxury overflow-hidden">
                <div className="px-5 py-4 border-b border-[rgba(212,175,55,0.1)]">
                  <p className="text-[10px] tracking-widest uppercase text-dim">Órdenes Recientes</p>
                </div>
                {ORDENES.slice(0, 4).map((o) => (
                  <div key={o.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-[rgba(128,128,128,0.07)] last:border-0">
                    <div className="flex-1">
                      <p className="text-[13px] text-theme">{o.negocio}</p>
                      <p className="text-[11px] text-ghost">{o.id} · {o.fecha}</p>
                    </div>
                    <p className="text-gold-warm font-medium text-[13px]">${o.total.toLocaleString("es-CL")}</p>
                    <Badge variant={ESTADO_ORDEN[o.estado] ?? "neutral"}>{o.estado}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CATÁLOGO DET_PROD_PROV ── */}
        {tab === "catalogo" && (
          <div>
            <SectionHeader eyebrow="DET_PROD_PROV · precioMayoreo · stockProveedor · tiempoEntrega" title="Catálogo Mayorista" action={<button onClick={() => setNewProdModal(true)} className="btn-gold px-5 py-2.5 text-sm">+ Nuevo Producto</button>} />

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6">
              {categories.map((c) => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all ${filter === c ? "border-[#D4AF37] text-gold bg-[rgba(212,175,55,0.1)]" : "border-[rgba(212,175,55,0.15)] text-dim hover:border-[rgba(212,175,55,0.35)] hover:text-muted"}`}>
                  {c}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-5">
              {filtered.map((d) => (
                <div key={d.idDetalleProv} className="card-luxury overflow-hidden">
                  <div className="relative h-40 bg-theme-mid overflow-hidden">
                    <img src={d.imagen} alt={d.nombre} className="w-full h-full object-cover opacity-75" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F]/60 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="text-[10px] bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.35)] text-gold px-2.5 py-1 rounded-full tracking-wider uppercase">{d.categoria}</span>
                      <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full font-semibold">-{savings(d)}%</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-ghost font-mono mb-1">{d.idProducto}</p>
                    <h3 className="text-theme text-[14px] font-medium mb-3 leading-snug">{d.nombre}</h3>

                    {/* Precios editables */}
                    <div className="bg-theme-mid rounded-xl p-3 mb-3 border border-[rgba(212,175,55,0.1)]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-ghost">Precio retail</span>
                        <span className="text-ghost text-sm line-through">${d.precioRetail.toLocaleString("es-CL")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gold-warm font-medium">precioMayoreo</span>
                        <div className="flex items-center gap-1">
                          <span className="text-ghost text-sm">$</span>
                          <input
                            type="number"
                            value={d.precioMayoreo}
                            onChange={(e) => updatePrice(d.idDetalleProv, e.target.value)}
                            className="w-24 bg-transparent border-b border-[rgba(212,175,55,0.3)] px-1 py-0.5 text-gold font-semibold text-[15px] outline-none focus:border-[#D4AF37] text-right"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stock editable */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${d.stockProveedor === 0 ? "bg-rose-400" : d.stockProveedor < 100 ? "bg-amber-400" : "bg-emerald-400"}`} />
                        <span className="text-[11px] text-dim">stockProveedor:</span>
                        <input
                          type="number"
                          value={d.stockProveedor}
                          onChange={(e) => updateStock(d.idDetalleProv, e.target.value)}
                          className="w-16 bg-theme-mid border border-[rgba(212,175,55,0.15)] rounded-lg px-2 py-1 text-sm text-theme outline-none focus:border-[#D4AF37] transition-colors"
                        />
                      </div>
                      <span className="text-[11px] text-ghost flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {d.tiempoEntrega}
                      </span>
                    </div>

                    {/* Cantidad y cotizar */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-theme-mid border border-[rgba(212,175,55,0.2)] rounded-xl overflow-hidden flex-1">
                        <button onClick={() => updateQty(d.idDetalleProv, -d.moq)} className="px-3 py-2 text-dim hover:text-gold transition-colors text-sm">−</button>
                        <span className="flex-1 text-center text-sm text-theme">{quantities[d.idDetalleProv]}</span>
                        <button onClick={() => updateQty(d.idDetalleProv, d.moq)} className="px-3 py-2 text-dim hover:text-gold transition-colors text-sm">+</button>
                      </div>
                      <button className="btn-gold px-4 py-2.5 text-[12px] whitespace-nowrap flex-shrink-0">Cotizar →</button>
                    </div>
                    <p className="text-[10px] text-ghost mt-1.5 text-center">MOQ: {d.moq} unidades</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ÓRDENES ── */}
        {tab === "ordenes" && (
          <div>
            <SectionHeader eyebrow="Órdenes de Negocios → PROVEEDOR" title="Gestión de Órdenes" />
            <TableWrapper>
              <thead>
                <tr>{["Orden", "Negocio / Local", "Productos", "Fecha", "Total", "Estado", "Acción"].map((h) => <Th key={h}>{h}</Th>)}</tr>
              </thead>
              <tbody>
                {ORDENES.map((o) => (
                  <tr key={o.id} className="hover:bg-[rgba(212,175,55,0.02)] transition-colors">
                    <Td className="text-gold font-medium">{o.id}</Td>
                    <Td className="text-theme">{o.negocio}</Td>
                    <Td className="text-dim text-[12px] max-w-[200px] truncate">{o.productos}</Td>
                    <Td className="text-dim text-[12px]">{o.fecha}</Td>
                    <Td className="text-gold-warm font-medium">${o.total.toLocaleString("es-CL")}</Td>
                    <Td><Badge variant={ESTADO_ORDEN[o.estado] ?? "neutral"}>{o.estado}</Badge></Td>
                    <Td>
                      <div className="flex gap-2">
                        <button className="text-[11px] btn-outline-gold px-3 py-1.5 rounded-xl">Detalles</button>
                        {o.estado === "Procesando" && <button className="text-[11px] px-3 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors">Marcar Enviado</button>}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrapper>

            {/* Resumen financiero */}
            <div className="mt-8 card-luxury p-6">
              <p className="text-[10px] tracking-widest uppercase text-dim mb-5">Resumen Financiero · Periodo</p>
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: "Total facturado", val: `$${ingresos.toLocaleString("es-CL")}`, color: "text-gold" },
                  { label: "Órdenes procesadas", val: String(ORDENES.length), color: "text-theme" },
                  { label: "Promedio por orden", val: `$${Math.round(ingresos / ORDENES.length).toLocaleString("es-CL")}`, color: "text-gold-warm" },
                  { label: "Negocios atendidos", val: String(new Set(ORDENES.map((o) => o.negocio)).size), color: "text-theme" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className={`font-serif text-3xl mb-1 ${s.color}`}>{s.val}</p>
                    <p className="text-[11px] text-ghost">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PERFIL PROVEEDOR ── */}
        {tab === "perfil" && (
          <div>
            <SectionHeader eyebrow="PROVEEDOR · razonSocial · contacto" title="Perfil del Proveedor" />
            <div className="grid grid-cols-3 gap-6">
              <div className="card-luxury p-6 col-span-1 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500/30 to-sky-800/30 border border-sky-500/25 flex items-center justify-center font-serif text-4xl text-sky-400 mb-4">D</div>
                <h3 className="font-serif text-lg text-theme">{PROVEEDOR.razonSocial}</h3>
                <p className="text-dim text-sm">{PROVEEDOR.contacto}</p>
                <div className="mt-3"><Badge variant="info">PROVEEDOR</Badge></div>
                <div className="w-full mt-6 space-y-3">
                  <div className="flex justify-between text-sm border-b border-[rgba(128,128,128,0.07)] pb-3">
                    <span className="text-ghost">RUT</span><span className="text-theme font-mono text-[12px]">{PROVEEDOR.rut}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-[rgba(128,128,128,0.07)] pb-3">
                    <span className="text-ghost">Productos</span><span className="text-gold">{detProdProv.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ghost">Stock total</span><span className="text-gold-warm">{totalStock.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <div className="card-luxury p-6">
                  <p className="text-[10px] tracking-widest uppercase text-ghost mb-5">Datos del Negocio</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Razón Social" defaultValue={PROVEEDOR.razonSocial} />
                    <Input label="RUT" defaultValue={PROVEEDOR.rut} />
                    <Input label="Correo de contacto" type="email" defaultValue={PROVEEDOR.contacto} />
                    <Input label="Teléfono" defaultValue="+56 2 2345 6789" />
                    <div className="col-span-2">
                      <Input label="Dirección comercial" defaultValue="Av. Providencia 1234, Santiago" />
                    </div>
                  </div>
                  <button className="btn-gold px-6 py-3 text-sm mt-5">Guardar Cambios</button>
                </div>
                <div className="card-luxury p-6">
                  <p className="text-[10px] tracking-widest uppercase text-ghost mb-4">Configuración de Entrega</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Zona de cobertura">
                      <option className="bg-[var(--bg-card)] text-[var(--fg)]">Región Metropolitana</option>
                      <option className="bg-[var(--bg-card)] text-[var(--fg)]">Todo Chile</option>
                    </Select>
                    <Input label="Tiempo de entrega base" defaultValue="2–3 días hábiles" />
                  </div>
                  <button className="btn-outline-gold px-6 py-3 text-sm mt-4">Actualizar Configuración</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </MainContent>

      {/* Modal nuevo producto */}
      <Modal open={newProdModal} onClose={() => setNewProdModal(false)} title="Agregar Producto al Catálogo">
        <div className="space-y-4">
          <p className="text-[11px] text-dim uppercase tracking-widest">DET_PROD_PROV · Nuevo Registro</p>
          <Input label="Nombre del Producto (PRODUCTO.nombre)" placeholder="Nombre del producto" />
          <Select label="Categoría">
            {["Tratamiento Facial", "Capilar", "Maquillaje", "Corporal"].map((c) => <option key={c} className="bg-[var(--bg-card)] text-[var(--fg)]">{c}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio Mayoreo" type="number" placeholder="0" />
            <Input label="Stock Disponible" type="number" placeholder="0" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tiempo de Entrega" placeholder="ej. 2–3 días hábiles" />
            <Input label="MOQ (Mínimo de Orden)" type="number" placeholder="ej. 6" />
          </div>
          <button onClick={() => setNewProdModal(false)} className="w-full btn-gold py-3 text-sm">Publicar en Catálogo</button>
        </div>
      </Modal>
    </PageShell>
  );
}
