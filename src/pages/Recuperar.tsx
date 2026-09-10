import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Input, ThemeToggle } from "@/components/ui";
import { recover } from "@/services/auth.service";

export default function Recuperar() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devLink, setDevLink] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevLink(null);
    setLoading(true);
    try {
      const res = await recover(email);
      setMessage(res.message);
      // En dev el backend Nuxt devuelve el link; aquí lo mostramos igual (demo).
      if (res.devLink) setDevLink(res.devLink);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al solicitar recuperación.");
    } finally {
      setLoading(false);
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
            <p className="text-[10px] tracking-[0.3em] text-gold-warm uppercase mb-2">Recuperación de cuenta</p>
            <h1 className="font-serif text-4xl text-theme">Recuperar Contraseña</h1>
            <p className="text-dim text-sm mt-3">Te enviamos un enlace con token (expira en 1 hora)</p>
          </div>

          <form onSubmit={onSubmit} className="card-luxury p-7 space-y-4">
            <Input label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@email.cl" autoFocus />

            {message && (
              <div className="space-y-2">
                <p className="text-[12px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 rounded-xl px-4 py-2.5">{message}</p>
                {devLink && (
                  <div className="text-[12px] text-dim bg-theme-mid border border-[rgba(212,175,55,0.2)] rounded-xl px-4 py-2.5">
                    <p className="text-ghost mb-1 uppercase tracking-wider text-[10px]">Debug (solo dev)</p>
                    <Link to={devLink} className="text-gold break-all">{devLink}</Link>
                  </div>
                )}
              </div>
            )}
            {error && <p className="text-[12px] text-rose-400 bg-rose-400/10 border border-rose-400/25 rounded-xl px-4 py-2.5">{error}</p>}

            <button type="submit" disabled={loading} className="w-full btn-gold py-3 text-sm">
              {loading ? "Enviando…" : "Enviar Enlace de Recuperación"}
            </button>

            <p className="text-center text-[12px] text-dim">
              <Link to="/login" className="text-gold hover:text-gold-light transition-colors">← Volver a Iniciar Sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}