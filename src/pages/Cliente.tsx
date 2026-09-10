import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Badge, StatCard, Stars, Sidebar, PageShell, TopNav, MainContent, TableWrapper, Th, Td, SectionHeader, Modal, Input, Select, ThemeToggle } from "@/components/ui";
import { useAuth } from "@/store/auth";

// ─── Seed data ────────────────────────────────────────────────────────────────

const LOCALES_EXPLORE = [
  { idLocal: "loc-01", nombreLocal: "Atelier Doré", tipo: "Salón de Belleza", horario: "09:00–20:00", calificacionPromedio: 4.9, reviews: 312, address: "Av. Providencia 2350", img: "https://images.unsplash.com/photo-1764475501545-d5cc9719af1a?w=500&h=340&fit=crop", servicios: ["Colorimetría", "Corte", "Keratina", "Tratamiento"], precioMin: 18000 },
  { idLocal: "loc-02", nombreLocal: "Noir & Or Barbería", tipo: "Barbería Premium", horario: "10:00–21:00", calificacionPromedio: 4.8, reviews: 198, address: "Los Leones 175", img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=340&fit=crop", servicios: ["Corte Clásico", "Afeitado", "Barba", "Tratamiento capilar"], precioMin: 12000 },
  { idLocal: "loc-03", nombreLocal: "Velvet Spa & Wellness", tipo: "Spa & Bienestar", horario: "08:00–22:00", calificacionPromedio: 5.0, reviews: 87, address: "El Golf 40, Las Condes", img: "https://images.unsplash.com/photo-1784704161960-26770b684595?w=500&h=340&fit=crop", servicios: ["Masaje relajante", "Sauna", "Facial", "Aromaterapia"], precioMin: 35000 },
  { idLocal: "loc-04", nombreLocal: "Studio Makeover Pro", tipo: "Estudio Makeup", horario: "10:00–19:00", calificacionPromedio: 4.7, reviews: 142, address: "Loreto 150, Ñuñoa", img: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=500&h=340&fit=crop", servicios: ["Maquillaje social", "Novia", "Airbrush", "Cejas"], precioMin: 25000 },
];

const PEDIDOS = [
  { idPedido: "PED-20481", fecha: "28 ago 2026", estado: "Completado", montoTotal: 144800, detalles: [{ nombre: "Sérum Lumière Doré", cantidad: 1, precioUnitario: 89900, subTotal: 89900 }, { nombre: "Mascarilla Oro 24K", cantidad: 1, precioUnitario: 54900, subTotal: 54900 }] },
  { idPedido: "PED-20365", fecha: "14 ago 2026", estado: "En Preparación", montoTotal: 124500, detalles: [{ nombre: "Kit Renovación Profunda", cantidad: 1, precioUnitario: 124500, subTotal: 124500 }] },
  { idPedido: "PED-20201", fecha: "02 ago 2026", estado: "Pendiente", montoTotal: 107700, detalles: [{ nombre: "Paleta Editorial Nude", cantidad: 1, precioUnitario: 67800, subTotal: 67800 }, { nombre: "Óleo Reparador Premium", cantidad: 1, precioUnitario: 39900, subTotal: 39900 }] },
];

const CALIFICACIONES = [
  { idCalificacion: "cal-01", idLocal: "loc-01", nombreLocal: "Atelier Doré", comentario: "Excelente atención, quedé encantada con la colorimetría. Valentina es increíble.", puntuacion: 5, fecha: "25 ago 2026" },
  { idCalificacion: "cal-02", idLocal: "loc-02", nombreLocal: "Noir & Or Barbería", comentario: "El corte quedó perfecto. Ambiente muy premium.", puntuacion: 4, fecha: "10 ago 2026" },
];

const CITAS = [
  { id: "CIT-001", idLocal: "loc-01", nombreLocal: "Atelier Doré", servicio: "Colorimetría Completa", fecha: "05 sep 2026", hora: "10:30", profesional: "Valentina Reyes", estado: "Confirmada", precio: 38000 },
  { id: "CIT-002", idLocal: "loc-03", nombreLocal: "Velvet Spa & Wellness", servicio: "Masaje Relajante 60min", fecha: "12 sep 2026", hora: "14:00", profesional: "Camila Muñoz", estado: "Pendiente", precio: 45000 },
  { id: "CIT-003", idLocal: "loc-04", nombreLocal: "Studio Makeover Pro", servicio: "Maquillaje Social", fecha: "18 sep 2026", hora: "11:00", profesional: "Andrea Silva", estado: "Confirmada", precio: 28000 },
];

const ESTADO_V: Record<string, "success" | "warning" | "neutral"> = { Completado: "success", Confirmada: "success", "En Preparación": "warning", Pendiente: "neutral" };

const NAV_ITEMS = [
  { key: "explorar", label: "Explorar Locales", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { key: "citas", label: "Mis Citas", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { key: "pedidos", label: "Mis Pedidos", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
  { key: "calificaciones", label: "Mis Calificaciones", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  { key: "perfil", label: "Mi Perfil", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

export default function Cliente() {
  const [tab, setTab] = useState("explorar");
  const [filterTipo, setFilterTipo] = useState("Todos");
  const [bookModal, setBookModal] = useState<string | null>(null);
  const [pedidoDetail, setPedidoDetail] = useState<string | null>(null);
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [bookDate, setBookDate] = useState("");
  const [bookHour, setBookHour] = useState("");
  const [bookService, setBookService] = useState("");
  const { user, logout } = useAuth();

  const tipos = ["Todos", ...Array.from(new Set(LOCALES_EXPLORE.map((l) => l.tipo)))];
  const filtered = filterTipo === "Todos" ? LOCALES_EXPLORE : LOCALES_EXPLORE.filter((l) => l.tipo === filterTipo);
  const selectedLocal = bookModal ? LOCALES_EXPLORE.find((l) => l.idLocal === bookModal) : null;
  const selectedPedido = pedidoDetail ? PEDIDOS.find((p) => p.idPedido === pedidoDetail) : null;

  return (
    <PageShell
      nav={
        <TopNav
          logo={<Link to="/"><Logo height={40} /></Link>}
          center={<span className="text-[11px] tracking-[0.25em] uppercase text-ghost">Panel Cliente</span>}
          right={
            <>
              {user && <span className="text-[11px] text-dim">{user.nombre}</span>}
              {user && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/50 to-[#C89D7C]/50 border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-theme text-xs font-bold">
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
      <Sidebar items={NAV_ITEMS} active={tab} onSelect={setTab} title={user?.nombre ?? "Sofía Alarcón"} subtitle={user?.correo ?? "sofia@email.cl"} avatarLetter={user?.nombre.charAt(0) ?? "S"} badge={<Badge variant="gold">CLIENTE</Badge>} />

      <MainContent>
        {/* ── EXPLORAR LOCAL_BELLEZA ── */}
        {tab === "explorar" && (
          <div>
            <SectionHeader eyebrow="LOCAL_BELLEZA · Explora y Reserva" title="Locales de Estética" />

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <StatCard label="Citas agendadas" value="3" icon="8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              <StatCard label="Pedidos activos" value="2" sub="1 en preparación" icon="16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              <StatCard label="Gasto total" value="$376.500" icon="12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <StatCard label="Calificaciones" value="2" sub="Promedio: 4.5 ★" icon="11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11px] text-ghost mr-2">Filtrar por:</span>
              {tipos.map((t) => (
                <button key={t} onClick={() => setFilterTipo(t)}
                  className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all ${filterTipo === t ? "border-[#D4AF37] text-gold bg-[rgba(212,175,55,0.1)]" : "border-[rgba(212,175,55,0.15)] text-dim hover:border-[rgba(212,175,55,0.35)] hover:text-muted"}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-5">
              {filtered.map((l) => (
                <div key={l.idLocal} className="card-luxury overflow-hidden group">
                  <div className="relative h-44 bg-theme-mid overflow-hidden">
                    <img src={l.img} alt={l.nombreLocal} className="w-full h-full object-cover opacity-75 transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-[#1F1F1F]/20 to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.35)] text-gold px-2.5 py-1 rounded-full uppercase tracking-wider">{l.tipo}</span>
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <p className="font-serif text-xl text-theme">{l.nombreLocal}</p>
                        <p className="text-[11px] text-muted">{l.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex justify-end"><Stars rating={l.calificacionPromedio} /></div>
                        <p className="text-gold text-sm font-semibold">{l.calificacionPromedio} <span className="text-dim text-[10px] font-normal">({l.reviews})</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {l.servicios.slice(0, 4).map((s) => (
                        <span key={s} className="text-[10px] px-2.5 py-1 bg-theme-mid border border-[rgba(212,175,55,0.1)] text-dim rounded-lg">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-ghost">Desde</p>
                        <p className="text-gold font-semibold">${l.precioMin.toLocaleString("es-CL")}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setReviewModal(l.idLocal)} className="btn-outline-gold px-3.5 py-2 text-[12px]">Calificar</button>
                        <button onClick={() => setBookModal(l.idLocal)} className="btn-gold px-4 py-2 text-[12px]">Reservar →</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CITAS ── */}
        {tab === "citas" && (
          <div>
            <SectionHeader eyebrow="Reservas Agendadas" title="Mis Citas" action={<button onClick={() => setTab("explorar")} className="btn-gold px-5 py-2.5 text-sm">+ Nueva Cita</button>} />
            <div className="space-y-4">
              {CITAS.map((c) => (
                <div key={c.id} className="card-luxury p-6 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)] flex flex-col items-center justify-center flex-shrink-0">
                    <span className="font-serif text-2xl text-gold leading-none">{c.fecha.split(" ")[0]}</span>
                    <span className="text-[9px] text-gold-warm uppercase tracking-wider">{c.fecha.split(" ")[1]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-serif text-xl text-theme">{c.servicio}</h3>
                      <Badge variant={ESTADO_V[c.estado] ?? "neutral"}>{c.estado}</Badge>
                    </div>
                    <p className="text-[13px] text-muted">{c.nombreLocal}</p>
                    <p className="text-[12px] text-ghost mt-0.5">Con {c.profesional} · {c.hora} hrs</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gold font-semibold text-lg">${c.precio.toLocaleString("es-CL")}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="btn-outline-gold px-3.5 py-2 text-[12px]">Reagendar</button>
                      <button className="px-3.5 py-2 text-[12px] rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors">Cancelar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PEDIDOS (PEDIDO + DET_PEDIDO) ── */}
        {tab === "pedidos" && (
          <div>
            <SectionHeader eyebrow="PEDIDO · DET_PEDIDO" title="Mis Pedidos" />
            <div className="space-y-4">
              {PEDIDOS.map((p) => (
                <div key={p.idPedido} className="card-luxury overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(212,175,55,0.08)]">
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-lg text-theme">{p.idPedido}</span>
                      <Badge variant={ESTADO_V[p.estado] ?? "neutral"}>{p.estado}</Badge>
                      <span className="text-[12px] text-ghost">{p.fecha}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gold font-semibold text-lg">${p.montoTotal.toLocaleString("es-CL")}</span>
                      <button onClick={() => setPedidoDetail(p.idPedido === pedidoDetail ? null : p.idPedido)} className="btn-outline-gold px-3.5 py-2 text-[12px]">
                        {pedidoDetail === p.idPedido ? "Ocultar" : "Ver detalle"}
                      </button>
                    </div>
                  </div>
                  {pedidoDetail === p.idPedido && (
                    <div className="px-6 py-5">
                      <p className="text-[10px] tracking-widest uppercase text-ghost mb-4">DET_PEDIDO · Desglose</p>
                      <TableWrapper>
                        <thead><tr><Th>Producto</Th><Th>Cantidad</Th><Th>Precio Unitario</Th><Th>Sub Total</Th></tr></thead>
                        <tbody>
                          {p.detalles.map((d, i) => (
                            <tr key={i} className="hover:bg-[rgba(212,175,55,0.02)]">
                              <Td className="text-theme">{d.nombre}</Td>
                              <Td className="text-muted">{d.cantidad}</Td>
                              <Td className="text-muted">${d.precioUnitario.toLocaleString("es-CL")}</Td>
                              <Td className="text-gold font-medium">${d.subTotal.toLocaleString("es-CL")}</Td>
                            </tr>
                          ))}
                        </tbody>
                      </TableWrapper>
                      <div className="flex justify-end mt-4 pt-4 border-t border-[rgba(128,128,128,0.07)]">
                        <div className="text-right">
                          <p className="text-[11px] text-ghost mb-1">montoTotal</p>
                          <p className="font-serif text-2xl text-gold">${p.montoTotal.toLocaleString("es-CL")}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CALIFICACIONES ── */}
        {tab === "calificaciones" && (
          <div>
            <SectionHeader eyebrow="CALIFICACION · comentario · puntuacion" title="Mis Calificaciones" action={<button onClick={() => setTab("explorar")} className="btn-gold px-5 py-2.5 text-sm">+ Nueva Reseña</button>} />
            <div className="space-y-4 mb-8">
              {CALIFICACIONES.map((c) => (
                <div key={c.idCalificacion} className="card-luxury p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-serif text-xl text-theme">{c.nombreLocal}</h3>
                      <p className="text-[12px] text-ghost mt-0.5">{c.fecha}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stars rating={c.puntuacion} size="md" />
                      <span className="text-gold font-semibold text-lg">{c.puntuacion}/5</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-muted italic border-l-2 border-[rgba(212,175,55,0.25)] pl-4">"{c.comentario}"</p>
                  <div className="flex gap-2 mt-4">
                    <button className="btn-outline-gold px-3.5 py-2 text-[12px]">Editar</button>
                    <button className="px-3.5 py-2 text-[12px] rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
            {/* Form nueva calificación */}
            <div className="card-luxury p-6">
              <p className="text-[10px] tracking-widest uppercase text-dim mb-4">Nueva CALIFICACION</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Select label="Local (LOCAL_BELLEZA)">
                  {LOCALES_EXPLORE.map((l) => <option key={l.idLocal} className="bg-[var(--bg-card)] text-[var(--fg)]">{l.nombreLocal}</option>)}
                </Select>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-dim mb-2">Puntuación</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setReviewStars(s)}>
                        <svg className={`w-7 h-7 transition-colors ${s <= reviewStars ? "text-[#D4AF37]" : "text-ghost"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <label className="block text-[10px] tracking-widest uppercase text-dim mb-2">Comentario</label>
              <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={3} placeholder="Describe tu experiencia..." className="w-full bg-theme border border-[rgba(212,175,55,0.2)] rounded-xl px-4 py-3 text-sm text-theme placeholder-[#333] outline-none focus:border-[#D4AF37] resize-none transition-colors mb-4" />
              <button className="btn-gold px-6 py-3 text-sm">Publicar Calificación</button>
            </div>
          </div>
        )}

        {/* ── PERFIL (USUARIO) ── */}
        {tab === "perfil" && (
          <div>
            <SectionHeader eyebrow="USUARIO · tipoUsuario: Cliente" title="Mi Perfil" />
            <div className="grid grid-cols-3 gap-6">
              <div className="card-luxury p-6 col-span-1 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37]/60 to-[#C89D7C]/60 border-2 border-[rgba(212,175,55,0.4)] flex items-center justify-center font-serif text-4xl text-gold mb-4">S</div>
                <h3 className="font-serif text-xl text-theme">Sofía Alarcón</h3>
                <p className="text-dim text-sm">sofia@email.cl</p>
                <div className="mt-4 w-full"><Badge variant="gold">CLIENTE</Badge></div>
                <button className="btn-gold w-full py-2.5 text-sm mt-5">Editar Foto</button>
              </div>
              <div className="col-span-2 space-y-4">
                <div className="card-luxury p-6">
                  <p className="text-[10px] tracking-widest uppercase text-ghost mb-5">Datos personales · USUARIO</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Nombre completo" defaultValue="Sofía Alarcón" />
                    <Input label="Documento" defaultValue="18.234.567-8" />
                    <Input label="Correo" type="email" defaultValue="sofia@email.cl" />
                    <Input label="Teléfono" defaultValue="+56 9 8765 4321" />
                    <div className="col-span-2">
                      <Input label="Dirección" defaultValue="Las Flores 234, Providencia" />
                    </div>
                    <div className="col-span-2">
                      <Input label="Ubicación GPS" defaultValue="-33.4372, -70.6506" />
                    </div>
                  </div>
                  <button className="btn-gold px-6 py-3 text-sm mt-5">Guardar Cambios</button>
                </div>
                <div className="card-luxury p-6">
                  <p className="text-[10px] tracking-widest uppercase text-ghost mb-5">Seguridad</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Nueva contraseña" type="password" placeholder="••••••••" />
                    <Input label="Confirmar contraseña" type="password" placeholder="••••••••" />
                  </div>
                  <button className="btn-outline-gold px-6 py-3 text-sm mt-4">Cambiar Contraseña</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </MainContent>

      {/* ── MODAL RESERVA ── */}
      <Modal open={!!bookModal} onClose={() => setBookModal(null)} title={`Reservar en ${selectedLocal?.nombreLocal ?? ""}`}>
        <div className="space-y-4">
          <p className="text-[11px] text-dim uppercase tracking-widest">LOCAL_BELLEZA · Agendar Cita</p>
          <Select label="Servicio (CATALOGO)" value={bookService} onChange={(e) => setBookService(e.target.value)}>
            <option value="" className="bg-[var(--bg-card)] text-[var(--fg)]">Selecciona un servicio...</option>
            {(selectedLocal?.servicios ?? []).map((s) => <option key={s} className="bg-[var(--bg-card)] text-[var(--fg)]">{s}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fecha" type="date" value={bookDate} onChange={(e) => setBookDate(e.target.value)} />
            <Select label="Hora disponible" value={bookHour} onChange={(e) => setBookHour(e.target.value)}>
              {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((h) => <option key={h} className="bg-[var(--bg-card)] text-[var(--fg)]">{h}</option>)}
            </Select>
          </div>
          <div className="bg-theme rounded-xl p-4 border border-[rgba(212,175,55,0.1)]">
            <p className="text-[11px] text-ghost mb-2">Horario del local: <span className="text-muted">{selectedLocal?.horario}</span></p>
            <p className="text-[11px] text-ghost">calificacionPromedio: <span className="text-gold">{selectedLocal?.calificacionPromedio} ★</span></p>
          </div>
          <button onClick={() => setBookModal(null)} className="w-full btn-gold py-3 text-sm">Confirmar Reserva</button>
        </div>
      </Modal>

      {/* ── MODAL CALIFICAR ── */}
      <Modal open={!!reviewModal} onClose={() => setReviewModal(null)} title="Calificar Local">
        <div className="space-y-4">
          <p className="text-[11px] text-dim uppercase tracking-widest">CALIFICACION · puntuacion + comentario</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setReviewStars(s)}>
                <svg className={`w-8 h-8 transition-colors ${s <= reviewStars ? "text-[#D4AF37]" : "text-ghost"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </button>
            ))}
          </div>
          <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={3} placeholder="Describe tu experiencia..." className="w-full bg-theme border border-[rgba(212,175,55,0.2)] rounded-xl px-4 py-3 text-sm text-theme placeholder-[#333] outline-none focus:border-[#D4AF37] resize-none transition-colors" />
          <button onClick={() => { setReviewModal(null); setReviewText(""); setReviewStars(5); }} className="w-full btn-gold py-3 text-sm">Publicar Reseña</button>
        </div>
      </Modal>
    </PageShell>
  );
}
