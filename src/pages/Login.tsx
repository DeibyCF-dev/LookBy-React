import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Input, ThemeToggle } from "@/components/ui";
import { useAuth, DEMO_ACCOUNTS } from "@/store/auth";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    }
  }

  async function quickLogin(demo: (typeof DEMO_ACCOUNTS)[number]) {
    setError("");
    try {
      await login(demo.email, demo.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
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
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-[10px] tracking-[0.3em] text-gold-warm uppercase mb-2">Acceso a la plataforma</p>
            <h1 className="font-serif text-4xl text-theme">Iniciar Sesión</h1>
            <p className="text-dim text-sm mt-3">USUARIO · tipoUsuario define tu panel de acceso</p>
          </div>

          <form onSubmit={onSubmit} className="card-luxury p-7 space-y-4">
            <Input label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@email.cl" autoFocus />
            <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

            <div className="flex items-center justify-between text-[12px]">
              <label className="flex items-center gap-2 text-dim cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-[#D4AF37]" /> Recordarme
              </label>
              <Link to="/recuperar" className="text-gold-warm hover:text-gold transition-colors">¿Olvidaste tu contraseña?</Link>
            </div>

            {error && <p className="text-[12px] text-rose-400 bg-rose-400/10 border border-rose-400/25 rounded-xl px-4 py-2.5">{error}</p>}

            <button type="submit" disabled={loading} className="w-full btn-gold py-3 text-sm flex items-center justify-center gap-2">
              {loading && <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A]/80 animate-spin" />}
              {loading ? "Validando…" : "Ingresar al Panel →"}
            </button>

            <p className="text-center text-[12px] text-dim mt-2">
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="text-gold hover:text-gold-light transition-colors">Regístrate</Link>
            </p>
          </form>

          {/* Acceso rápido demo (cuentas del seeder Nuxt) */}
          <div className="mt-6">
            <p className="text-[10px] tracking-[0.25em] uppercase text-ghost text-center mb-3">Acceso rápido demo · Seeder</p>
            <div className="grid grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.map((d) => (
                <button
                  key={d.role}
                  onClick={() => quickLogin(d)}
                  className="card-luxury p-3.5 text-left hover:border-gold transition-colors"
                >
                  <p className="text-theme text-sm font-medium">{d.label}</p>
                  <p className="text-[10px] text-ghost mt-0.5">{d.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}