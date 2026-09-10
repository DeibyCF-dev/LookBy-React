import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Cliente from "./pages/Cliente";
import Negocio from "./pages/Negocio";
import Proveedor from "./pages/Proveedor";
import Superadmin from "./pages/Superadmin";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Recuperar from "./pages/Recuperar";
import ResetPassword from "./pages/ResetPassword";
import { RequireAuth, GuestOnly } from "./auth/AuthGuard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/registro" element={<GuestOnly><Registro /></GuestOnly>} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Portales por rol — réplica de app/middleware/admin-auth.ts */}
        <Route path="/superadmin" element={<RequireAuth roles={["admin"]}><Superadmin /></RequireAuth>} />
        <Route path="/cliente" element={<RequireAuth roles={["cliente"]}><Cliente /></RequireAuth>} />
        <Route path="/negocio" element={<RequireAuth roles={["profesional"]}><Negocio /></RequireAuth>} />
        <Route path="/proveedor" element={<RequireAuth roles={["proveedor"]}><Proveedor /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}