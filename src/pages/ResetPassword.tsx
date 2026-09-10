import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Logo from "@/components/Logo";
import { Input, ThemeToggle } from "@/components/ui";
import { resetPassword } from "@/services/auth.service";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al restablecer la contraseña.");
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
            <p className="text-[10px] tracking-[0.3em] text-gold-warm uppercase mb-2">Nueva contraseña</p>
            <h1 className="font-serif text-4xl text-theme">Restablecer Contraseña</h1>
          </div>

          {done ? (
            <div className="card-luxury p-7 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-theme text-sm">Contraseña actualizada correctamente.</p>
              <Link to="/login" className="btn-gold w-full py-3 text-sm block">Ir a Iniciar Sesión →</Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="card-luxury p-7 space-y-4">
              <Input label="Nueva contraseña" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" autoFocus />
              <Input label="Confirmar contraseña" type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} placeholder="••••••••" />

              {error && <p className="text-[12px] text-rose-400 bg-rose-400/10 border border-rose-400/25 rounded-xl px-4 py-2.5">{error}</p>}

              <button type="submit" disabled={loading} className="w-full btn-gold py-3 text-sm">
                {loading ? "Guardando…" : "Guardar Nueva Contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}