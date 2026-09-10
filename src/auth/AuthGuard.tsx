/**
 * Guards de ruta — replican los middlewares Nuxt `app/middleware/admin-auth.ts`
 * (protege rutas autenticadas) y `admin-guest.ts` (protege login/registro).
 *
 * Reglas del middleware original:
 *  - Sin sesión → redirige a /login.
 *  - cliente → solo /cliente; proveedor → no /admin ni /negocio;
 *    profesional → no /admin; admin → puede acceder a TODO.
 */
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, getRoleHomeRoute } from "@/store/auth";
import Logo from "@/components/Logo";

function LoadingScreen() {
  return (
    <div className="min-h-full bg-theme text-theme flex flex-col items-center justify-center gap-6">
      <Logo height={56} />
      <div className="flex items-center gap-2 text-dim text-[12px]">
        <span className="w-4 h-4 rounded-full border-2 border-[rgba(212,175,55,0.3)] border-t-[#D4AF37] animate-spin" />
        Verificando sesión…
      </div>
    </div>
  );
}

/** Protege rutas autenticadas. roles = lista de roles permitidos; admin siempre puede. */
export function RequireAuth({ roles, children }: { roles?: string[]; children: ReactNode }) {
  const { user, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) return <LoadingScreen />;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  const role = user.tipoUsuario;
  const allowed = role === "admin" || !roles || roles.includes(role);
  if (!allowed) {
    return <Navigate to={getRoleHomeRoute(role)} replace />;
  }
  return <>{children}</>;
}

/** Protege rutas públicas: si ya hay sesión, redirige a la home del rol. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) return <LoadingScreen />;
  if (user) {
    // si venía de una ruta protegida, volver allá; si no, a su home
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from && !from.startsWith("/login") ? from : getRoleHomeRoute(user.tipoUsuario)} replace />;
  }
  return <>{children}</>;
}