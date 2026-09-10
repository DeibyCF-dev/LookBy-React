import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Input, Select, ThemeToggle } from "@/components/ui";
import { useAuth } from "@/store/auth";
import type { RegisterPayload, UserRole } from "@/models";
import { REGISTERABLE_ROLES } from "@/models";

export default function Registro() {
  const { register, loading } = useAuth();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [telefono, setTelefono] = useState("");
  const [role, setRole] = useState<UserRole>("cliente");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (contrasena !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    const payload: RegisterPayload = {
      nombre,
      correo,
      contrasena,
      telefono,
      tipoUsuario: role,
    };
    if (role === "admin") payload.adminCode = adminCode;
    try {
      await register(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta.");
    }
  }

  return (
    <div className="min-h-full bg-theme text-theme transition-colors duration-300">
      <nav className="flex items-center justify-between px-8 py-4 nav-bar">
        <Link to="/"><Logo height={40} /></Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/" className="text-xs btn-outline-gold px-4 py-2">← Inicio</Link>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center px-6 py-14 min-h-[calc(100%-73px)]">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <p className="text-[10px] tracking-[0.3em] text-gold-warm uppercase mb-2">Crea tu cuenta</p>
            <h1 className="font-serif text-4xl text-theme">Registro</h1>
            <p className="text-dim text-sm mt-3">USUARIO + USUARIO_ROL · el rol define tu panel</p>
          </div>

          <form onSubmit={onSubmit} className="card-luxury p-7 space-y-4">
            <Input label="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre Apellido" autoFocus />
            <Input label="Correo electrónico" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="usuario@email.cl" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+56 9 XXXX XXXX" />
              <Select label="Rol (USUARIO_ROL)" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                {REGISTERABLE_ROLES.filter((r) => r !== "admin").map((r) => (
                  <option key={r} value={r} className="bg-[var(--bg-card)] text-[var(--fg)] capitalize">{r}</option>
                ))}
                <option value="admin" className="bg-[var(--bg-card)] text-[var(--fg)]">admin (requiere código)</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Contraseña" type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Mínimo 6 caracteres" />
              <Input label="Confirmar contraseña" type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} placeholder="••••••••" />
            </div>
            {role === "admin" && (
              <Input label="Código de administrador" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} placeholder="ADMIN_REGISTRATION_CODE" />
            )}

            {error && <p className="text-[12px] text-rose-400 bg-rose-400/10 border border-rose-400/25 rounded-xl px-4 py-2.5">{error}</p>}

            <button type="submit" disabled={loading} className="w-full btn-gold py-3 text-sm flex items-center justify-center gap-2">
              {loading && <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A]/80 animate-spin" />}
              {loading ? "Creando cuenta…" : "Crear Cuenta →"}
            </button>

            <p className="text-center text-[12px] text-dim">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-gold hover:text-gold-light transition-colors">Inicia sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}