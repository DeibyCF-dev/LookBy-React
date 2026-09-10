/**
 * Store de autenticación — replica el store Pinia `app/stores/auth.ts` de Nuxt.
 * Mantiene el usuario de sesión y expone login/register/logout/fetchUser además de
 * los computed de rol y la ruta home de cada rol.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { PublicUser, RegisterPayload } from "@/models";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  fetchCurrentUser,
} from "@/services/auth.service";

/** Cuentas semilla para acceso rápido en pantalla de login (mismas del seeder Nuxt). */
export const DEMO_ACCOUNTS: Array<{
  role: "admin" | "profesional" | "proveedor" | "cliente";
  label: string;
  email: string;
  password: string;
}> = [
  { role: "admin", label: "Superadmin", email: "admin@lookby.com", password: "admin123" },
  { role: "profesional", label: "Negocio", email: "profesional@lookby.com", password: "prof123" },
  { role: "proveedor", label: "Proveedor", email: "proveedor@lookby.com", password: "prov123" },
  { role: "cliente", label: "Cliente", email: "sofia@email.cl", password: "cliente123" },
];

/** Ruta home por rol — espejo de getRoleHomeRoute del store Pinia (admin usa /superadmin). */
export function getRoleHomeRoute(role: string): string {
  if (role === "admin") return "/superadmin";
  if (role === "profesional") return "/negocio";
  if (role === "proveedor") return "/proveedor";
  return "/cliente";
}

interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  initialized: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isProfesional: boolean;
  isProveedor: boolean;
  isCliente: boolean;
  login: (email: string, password: string) => Promise<PublicUser | null>;
  register: (payload: RegisterPayload) => Promise<PublicUser | null>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  homeRoute: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  async function fetchUser() {
    try {
      const res = await fetchCurrentUser();
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setInitialized(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchUser();
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload: RegisterPayload) {
    setLoading(true);
    try {
      const res = await apiRegister(payload);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const role = user?.tipoUsuario;
  const homeRoute = getRoleHomeRoute(role ?? "cliente");

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        isAuthenticated: !!user,
        isAdmin: role === "admin",
        isProfesional: role === "profesional",
        isProveedor: role === "proveedor",
        isCliente: role === "cliente",
        login,
        register,
        logout,
        fetchUser,
        homeRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
  return ctx;
}