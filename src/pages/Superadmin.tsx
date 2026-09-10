import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Badge, StatCard, Stars, Sidebar, PageShell, TopNav, MainContent, TableWrapper, Th, Td, SectionHeader, Modal, Input, Select, ThemeToggle } from "@/components/ui";
import { useAuth } from "@/store/auth";

// ─── Seed data ────────────────────────────────────────────────────────────────

const ROLES = [
  { idRol: "rol-01", nombre: "Superadmin", descripcion: "Control total del sistema" },
  { idRol: "rol-02", nombre: "Cliente", descripcion: "Usuario final de la plataforma" },
  { idRol: "rol-03", nombre: "Profesional", descripcion: "Propietario o gestor de local" },
  { idRol: "rol-04", nombre: "Proveedor", descripcion: "Proveedor mayorista de productos" },
];

const USUARIOS = [
  { idUsuario: "u-01", nombre: "Sofía Alarcón", correo: "sofia@email.cl", telefono: "+56 9 8765 4321", tipoUsuario: "Cliente", documento: "18.234.567-8", rol: "Cliente", estado: "Activo" },
  { idUsuario: "u-02", nombre: "Valentina Reyes", correo: "val@atelier.cl", telefono: "+56 9 7654 3210", tipoUsuario: "Profesional", documento: "17.123.456-7", rol: "Profesional", estado: "Activo" },
  { idUsuario: "u-03", nombre: "Distribuidora Andina S.A.", correo: "ventas@andina.cl", telefono: "+56 2 2345 6789", tipoUsuario: "Proveedor", documento: "72.345.678-9", rol: "Proveedor", estado: "Activo" },
  { idUsuario: "u-04", nombre: "Camila Torres", correo: "cami@email.cl", telefono: "+56 9 6543 2109", tipoUsuario: "Cliente", documento: "20.987.654-3", rol: "Cliente", estado: "Inactivo" },
  { idUsuario: "u-05", nombre: "Marcos Vidal", correo: "marcos@noirorstudio.cl", telefono: "+56 9 5432 1098", tipoUsuario: "Profesional", documento: "15.876.543-2", rol: "Profesional", estado: "Activo" },
  { idUsuario: "u-06", nombre: "María José Ríos", correo: "mj@email.cl", telefono: "+56 9 4321 0987", tipoUsuario: "Cliente", documento: "22.456.789-1", rol: "Cliente", estado: "Pendiente" },
];

const LOCALES = [
  { idLocal: "loc-01", nombreLocal: "Atelier Doré", horario: "09:00–20:00", calificacionPromedio: 4.9, tipo: "Salón de Belleza", propietario: "Valentina Reyes", pedidos: 48, estado: "Activo" },
  { idLocal: "loc-02", nombreLocal: "Noir & Or Barbería", horario: "10:00–21:00", calificacionPromedio: 4.8, tipo: "Barbería Premium", propietario: "Marcos Vidal", pedidos: 31, estado: "Activo" },
  { idLocal: "loc-03", nombreLocal: "Velvet Spa & Wellness", horario: "08:00–22:00", calificacionPromedio: 5.0, tipo: "Spa & Bienestar", propietario: "Andrea Silva", pedidos: 22, estado: "Revisión" },
  { idLocal: "loc-04", nombreLocal: "Studio Makeover Pro", horario: "10:00–19:00", calificacionPromedio: 4.7, tipo: "Estudio Makeup", propietario: "Nicole Bravo", pedidos: 17, estado: "Activo" },
];

const PROVEEDORES = [
  { idProveedor: "prov-01", razonSocial: "Distribuidora Andina S.A.", contacto: "ventas@andina.cl", productos: 38, stockTotal: 4200, estado: "Activo" },
  { idProveedor: "prov-02", razonSocial: "Cosméticos del Sur Ltda.", contacto: "info@cosmsur.cl", productos: 22, stockTotal: 1850, estado: "Activo" },
  { idProveedor: "prov-03", razonSocial: "BioBeauty Chile SpA", contacto: "hola@biobeauty.cl", productos: 15, stockTotal: 920, estado: "Pendiente" },
];

const AUDIT_LOG = [
  { id: 1, accion: "Usuario creado", entidad: "USUARIO", detalle: "sofia@email.cl registrada como Cliente", fecha: "03 sep 2026 · 14:32", actor: "Sistema", nivel: "info" },
  { id: 2, accion: "Estado modificado", entidad: "LOCAL_BELLEZA", detalle: "Velvet Spa → estado: Revisión", fecha: "03 sep 2026 · 11:15", actor: "Admin", nivel: "warning" },
  { id: 3, accion: "Rol asignado", entidad: "USUARIO_ROL", detalle: "Marcos Vidal → Profesional", fecha: "02 sep 2026 · 09:40", actor: "Admin", nivel: "info" },
  { id: 4, accion: "Proveedor suspendido", entidad: "PROVEEDOR", detalle: "BioBeauty Chile → Pendiente verificación", fecha: "01 sep 2026 · 17:20", actor: "Admin", nivel: "danger" },
  { id: 5, accion: "Pedido completado", entidad: "PEDIDO", detalle: "#LB-20481 · $144.800 · Sofía Alarcón", fecha: "28 ago 2026 · 16:55", actor: "Sistema", nivel: "success" },
];

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard Global", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { key: "usuarios", label: "Usuarios & Roles", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { key: "locales", label: "Locales de Estética", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { key: "proveedores", label: "Proveedores", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { key: "auditoria", label: "Auditoría del Sistema", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
];

const ESTADO_VARIANTS: Record<string, "success" | "warning" | "danger" | "info" | "neutral" | "gold"> = {
  Activo: "success", Inactivo: "danger", Pendiente: "warning", Revisión: "warning",
};

export default function Superadmin() {
  const [tab, setTab] = useState("dashboard");
  const [newUserModal, setNewUserModal] = useState(false);
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>(
    Object.fromEntries(USUARIOS.map((u) => [u.idUsuario, u.estado]))
  );
  const { user, logout } = useAuth();

  return (
    <PageShell
      nav={
        <TopNav
          logo={<Link to="/"><Logo height={40} /></Link>}
          center={<span className="text-[11px] tracking-[0.25em] uppercase text-ghost">Panel Superadmin</span>}
          right={
            <>
              {user && <span className="text-[11px] text-dim">{user.nombre}</span>}
              {user && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center text-theme text-xs font-bold">
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
      <Sidebar items={NAV_ITEMS} active={tab} onSelect={setTab} title="Superadmin" subtitle={user?.correo ?? "Control global del sistema"} avatarLetter={user?.nombre.charAt(0) ?? "A"} badge={<Badge variant="gold">ADMIN</Badge>} />

      <MainContent>
        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            <SectionHeader eyebrow="Sistema LookBy · Agosto 2026" title="Panel de Control Global" />
            <div className="grid grid-cols-4 gap-5 mb-10">
              <StatCard label="Usuarios registrados" value="1,284" sub="+42 esta semana" icon="17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" trend="up" />
              <StatCard label="Locales activos" value="48" sub="4 en revisión" icon="19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" trend="up" />
              <StatCard label="Ingresos plataforma" value="$28.4M" sub="CLP · agosto 2026" icon="12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" trend="up" />
              <StatCard label="Proveedores" value="12" sub="3 en verificación" icon="20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" trend="neutral" />
            </div>

            {/* Distribución de roles */}
            <div className="grid grid-cols-3 gap-5 mb-10">
              <div className="card-luxury p-5 col-span-1">
                <p className="text-[10px] tracking-widest uppercase text-dim mb-5">ROL · Distribución</p>
                <div className="space-y-4">
                  {[
                    { rol: "Cliente", count: 1102, pct: 86, color: "#D4AF37" },
                    { rol: "Profesional", count: 142, pct: 11, color: "#C89D7C" },
                    { rol: "Proveedor", count: 28, pct: 2, color: "#9B7DCC" },
                    { rol: "Superadmin", count: 12, pct: 1, color: "#6B8E9F" },
                  ].map((r) => (
                    <div key={r.rol}>
                      <div className="flex justify-between text-[12px] mb-1.5">
                        <span className="text-muted">{r.rol}</span>
                        <span className="text-theme font-medium">{r.count.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-theme-mid rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${r.pct}%`, background: r.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-luxury p-5 col-span-2">
                <p className="text-[10px] tracking-widest uppercase text-dim mb-5">LOCAL_BELLEZA · Métricas Rápidas</p>
                <div className="space-y-3">
                  {LOCALES.map((l) => (
                    <div key={l.idLocal} className="flex items-center gap-5 py-3 border-b border-[rgba(128,128,128,0.07)] last:border-0">
                      <div className="flex-1">
                        <p className="text-sm text-theme">{l.nombreLocal}</p>
                        <p className="text-[11px] text-ghost">{l.tipo} · {l.propietario}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Stars rating={l.calificacionPromedio} />
                        <span className="text-gold text-sm font-medium">{l.calificacionPromedio}</span>
                      </div>
                      <span className="text-[11px] text-dim">{l.pedidos} pedidos</span>
                      <Badge variant={ESTADO_VARIANTS[l.estado] ?? "neutral"}>{l.estado}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit preview */}
            <div className="card-luxury overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(212,175,55,0.1)]">
                <p className="text-[10px] tracking-widest uppercase text-dim">Auditoría Reciente</p>
                <button onClick={() => setTab("auditoria")} className="text-[11px] text-gold-warm hover:text-gold transition-colors">Ver todo →</button>
              </div>
              {AUDIT_LOG.slice(0, 3).map((log) => (
                <div key={log.id} className="flex items-center gap-5 px-5 py-4 border-b border-[rgba(128,128,128,0.07)] last:border-0 hover:bg-[rgba(212,175,55,0.02)] transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.nivel === "success" ? "bg-emerald-400" : log.nivel === "warning" ? "bg-amber-400" : log.nivel === "danger" ? "bg-rose-400" : "bg-sky-400"}`} />
                  <div className="flex-1">
                    <span className="text-sm text-theme">{log.accion}</span>
                    <span className="text-dim text-xs ml-2">· {log.detalle}</span>
                  </div>
                  <span className="text-[11px] text-ghost">{log.fecha}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── USUARIOS ── */}
        {tab === "usuarios" && (
          <div>
            <SectionHeader
              eyebrow="USUARIO · USUARIO_ROL · ROL"
              title="Gestión de Usuarios"
              action={
                <button onClick={() => setNewUserModal(true)} className="btn-gold px-5 py-2.5 text-sm">+ Nuevo Usuario</button>
              }
            />

            {/* ROL cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {ROLES.map((r) => (
                <div key={r.idRol} className="card-luxury p-4">
                  <p className="font-serif text-lg text-theme mb-1">{r.nombre}</p>
                  <p className="text-[12px] text-ghost">{r.descripcion}</p>
                  <p className="text-[10px] text-ghost mt-2 font-mono">{r.idRol}</p>
                </div>
              ))}
            </div>

            {/* USUARIO table */}
            <TableWrapper>
              <thead>
                <tr>{["Usuario", "Correo", "Teléfono", "Documento", "Rol (USUARIO_ROL)", "Estado", "Acciones"].map((h) => <Th key={h}>{h}</Th>)}</tr>
              </thead>
              <tbody>
                {USUARIOS.map((u) => (
                  <tr key={u.idUsuario} className="hover:bg-[rgba(212,175,55,0.02)] transition-colors">
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/40 to-[#C89D7C]/40 border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-[11px] font-semibold text-gold flex-shrink-0">
                          {u.nombre.charAt(0)}
                        </div>
                        <span className="text-theme">{u.nombre}</span>
                      </div>
                    </Td>
                    <Td className="text-muted">{u.correo}</Td>
                    <Td className="text-dim">{u.telefono}</Td>
                    <Td className="text-dim font-mono text-[11px]">{u.documento}</Td>
                    <Td>
                      <Badge variant={u.rol === "Superadmin" ? "gold" : u.rol === "Profesional" ? "success" : u.rol === "Proveedor" ? "info" : "neutral"}>{u.rol}</Badge>
                    </Td>
                    <Td>
                      <select
                        value={userStatuses[u.idUsuario]}
                        onChange={(e) => setUserStatuses((p) => ({ ...p, [u.idUsuario]: e.target.value }))}
                        className="bg-transparent text-[11px] font-semibold outline-none cursor-pointer rounded-full px-2 py-1 border"
                        style={{ color: userStatuses[u.idUsuario] === "Activo" ? "#34d399" : userStatuses[u.idUsuario] === "Inactivo" ? "#fb7185" : "#fbbf24" }}
                      >
                        {["Activo", "Inactivo", "Pendiente"].map((s) => <option key={s} className="bg-[var(--bg-card)] text-[var(--fg)]">{s}</option>)}
                      </select>
                    </Td>
                    <Td>
                      <div className="flex gap-2">
                        <button className="text-[11px] btn-outline-gold px-3 py-1.5 rounded-xl">Editar</button>
                        <button className="text-[11px] px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors">Revocar</button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrapper>
          </div>
        )}

        {/* ── LOCALES ── */}
        {tab === "locales" && (
          <div>
            <SectionHeader eyebrow="LOCAL_BELLEZA · CATALOGO" title="Locales de Estética" action={<button className="btn-gold px-5 py-2.5 text-sm">+ Agregar Local</button>} />
            <div className="grid grid-cols-2 gap-5">
              {LOCALES.map((l) => (
                <div key={l.idLocal} className="card-luxury p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-xl text-theme">{l.nombreLocal}</h3>
                      <p className="text-[12px] text-dim mt-0.5">{l.tipo} · Propietario: {l.propietario}</p>
                    </div>
                    <Badge variant={ESTADO_VARIANTS[l.estado] ?? "neutral"}>{l.estado}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-5 py-4 border-y border-[rgba(128,128,128,0.07)]">
                    <div>
                      <p className="text-[10px] text-ghost uppercase tracking-wider mb-1">Horario</p>
                      <p className="text-sm text-theme">{l.horario}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-ghost uppercase tracking-wider mb-1">Calificación</p>
                      <div className="flex items-center gap-1.5"><Stars rating={l.calificacionPromedio} /><span className="text-gold text-sm font-medium">{l.calificacionPromedio}</span></div>
                    </div>
                    <div>
                      <p className="text-[10px] text-ghost uppercase tracking-wider mb-1">Pedidos</p>
                      <p className="text-sm text-theme">{l.pedidos}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 btn-outline-gold py-2 text-[12px]">Ver Catálogo</button>
                    <button className="flex-1 btn-outline-gold py-2 text-[12px]">Ver Citas</button>
                    <button className="px-4 py-2 text-[12px] rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors">Suspender</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROVEEDORES ── */}
        {tab === "proveedores" && (
          <div>
            <SectionHeader eyebrow="PROVEEDOR · DET_PROD_PROV" title="Gestión de Proveedores" action={<button className="btn-gold px-5 py-2.5 text-sm">+ Nuevo Proveedor</button>} />
            <TableWrapper>
              <thead>
                <tr>{["Razón Social", "Contacto", "Productos", "Stock Total", "Estado", "Acciones"].map((h) => <Th key={h}>{h}</Th>)}</tr>
              </thead>
              <tbody>
                {PROVEEDORES.map((p) => (
                  <tr key={p.idProveedor} className="hover:bg-[rgba(212,175,55,0.02)] transition-colors">
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-[10px] font-bold text-gold">{p.razonSocial.charAt(0)}</div>
                        <span className="text-theme">{p.razonSocial}</span>
                      </div>
                    </Td>
                    <Td className="text-muted">{p.contacto}</Td>
                    <Td className="text-theme">{p.productos}</Td>
                    <Td className="text-gold-warm">{p.stockTotal.toLocaleString()} unid.</Td>
                    <Td><Badge variant={ESTADO_VARIANTS[p.estado] ?? "neutral"}>{p.estado}</Badge></Td>
                    <Td>
                      <div className="flex gap-2">
                        <button className="text-[11px] btn-outline-gold px-3 py-1.5 rounded-xl">Verificar</button>
                        <button className="text-[11px] px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors">Suspender</button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrapper>
          </div>
        )}

        {/* ── AUDITORÍA ── */}
        {tab === "auditoria" && (
          <div>
            <SectionHeader eyebrow="Log del Sistema" title="Auditoría General" />
            <div className="card-luxury overflow-hidden">
              <div className="px-5 py-3 border-b border-[rgba(212,175,55,0.1)] flex items-center gap-3">
                {[{ k: "Todos", v: "info" }, { k: "Info", v: "info" }, { k: "Warning", v: "warning" }, { k: "Error", v: "danger" }].map((f) => (
                  <span key={f.k} className="text-[11px] px-3 py-1.5 rounded-full border border-[rgba(212,175,55,0.15)] text-dim cursor-pointer hover:border-gold hover:text-gold transition-colors">{f.k}</span>
                ))}
              </div>
              {AUDIT_LOG.map((log) => (
                <div key={log.id} className="flex items-center gap-5 px-5 py-4 border-b border-[rgba(128,128,128,0.07)] last:border-0 hover:bg-[rgba(212,175,55,0.02)] transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.nivel === "success" ? "bg-emerald-400" : log.nivel === "warning" ? "bg-amber-400" : log.nivel === "danger" ? "bg-rose-400" : "bg-sky-400"}`} />
                  <div className="flex-shrink-0 w-28">
                    <Badge variant={log.nivel === "success" ? "success" : log.nivel === "warning" ? "warning" : log.nivel === "danger" ? "danger" : "info"}>{log.entidad}</Badge>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-theme font-medium">{log.accion}</span>
                    <span className="text-dim text-xs ml-2">— {log.detalle}</span>
                  </div>
                  <span className="text-[11px] text-ghost flex-shrink-0">{log.actor}</span>
                  <span className="text-[11px] text-ghost flex-shrink-0">{log.fecha}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </MainContent>

      {/* Modal nuevo usuario */}
      <Modal open={newUserModal} onClose={() => setNewUserModal(false)} title="Crear Nuevo Usuario">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre completo" placeholder="Nombre Apellido" />
            <Input label="Documento" placeholder="12.345.678-9" />
          </div>
          <Input label="Correo electrónico" type="email" placeholder="usuario@email.cl" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Teléfono" placeholder="+56 9 XXXX XXXX" />
            <Select label="Rol (ROL)">
              {ROLES.map((r) => <option key={r.idRol} className="bg-[var(--bg-card)] text-[var(--fg)]">{r.nombre}</option>)}
            </Select>
          </div>
          <Input label="Dirección" placeholder="Av. Principal 123" />
          <button className="w-full btn-gold py-3 text-sm mt-2" onClick={() => setNewUserModal(false)}>Crear Usuario</button>
        </div>
      </Modal>
    </PageShell>
  );
}
