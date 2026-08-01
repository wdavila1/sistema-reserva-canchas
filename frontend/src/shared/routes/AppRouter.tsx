import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "@/features/admin/layouts/AdminLayout";

// Route guards
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Páginas públicas
import Home from "@/pages/Home";
import CanchasPage from "@/features/canchas/pages/CanchasPage";
import CanchaDetailPage from "@/features/canchas/pages/CanchaDetailPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegistroPage from "@/features/auth/pages/RegistroPage";
import PromocionesPublicPage from "@/features/promociones/pages/PromocionesPublicPage";
import NosotrosPage from "@/pages/NosotrosPage";
import ContactoPage from "@/pages/ContactoPage";
import Terminos from "@/pages/Terminos";
import Privacidad from "@/pages/Privacidad";

// Páginas protegidas (requieren login)
import ReservasPage from "@/features/reservas/pages/ReservasPage";
import MisReservasPage from "@/features/reservas/pages/MisReservasPage";
import MiPerfilPage from "@/features/perfil/pages/MiPerfilPage";

// Páginas de administración
import AdminDashboardPage from "@/features/admin/pages/DashboardPage";
import AdminCanchasPage from "@/features/admin/pages/AdminCanchasPage";
import AdminReservas from "@/features/admin/pages/AdminReservas";
import AdminPagosPage from "@/features/admin/pages/AdminPagosPage";
import AdminReportesPage from "@/features/admin/pages/AdminReportesPage";
import AdminUsuariosPage from "@/features/admin/pages/AdminUsuariosPage";
import CanchaFormPage from "@/features/canchas/pages/CanchaFormPage";
import UsuarioFormPage from "@/features/usuarios/pages/UsuarioFormPage";
import SistemaExpertoPage from "@/features/admin/pages/SistemaExpertoPage";
import AdminPromocionesPage from "@/features/admin/pages/AdminPromocionesPage";

//Pagina para Error 404
import PageNotFound from "@/pages/PageNotFound";

function AppRouter() {
  return (
    <Routes>
      {/* ---------- Sitio público ---------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/canchas" element={<CanchasPage />} />
        <Route path="/canchas/:id" element={<CanchaDetailPage />} />
        <Route path="/promociones" element={<PromocionesPublicPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/terminos" element={<Terminos/>}/>
        <Route path="/privacidad" element={<Privacidad/>}/>

        {/* ---------- Requiere estar logueado ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/reservar/:courtId" element={<ReservasPage />} />
          <Route path="/mis-reservas" element={<MisReservasPage />} />
          <Route path="/mi-perfil" element={<MiPerfilPage />} />
        </Route>
      </Route>

      {/* ---------- Panel de administración (requiere rol admin) ---------- */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="canchas" element={<AdminCanchasPage />} />
          <Route path="canchas/nueva" element={<CanchaFormPage />} />
          <Route path="canchas/editar/:id" element={<CanchaFormPage />} />
          <Route path="reservas" element={<AdminReservas />} />
          <Route path="pagos" element={<AdminPagosPage />} />
          <Route path="reportes" element={<AdminReportesPage />} />
          <Route path="usuarios" element={<AdminUsuariosPage />} />
          <Route path="usuarios/nueva" element={<UsuarioFormPage />} />
          <Route path="usuarios/editar/:id" element={<UsuarioFormPage />} />
          <Route path="promociones" element={<AdminPromocionesPage />} />
          <Route path="sistema-experto" element={<SistemaExpertoPage />} />
        </Route>
      </Route>

      {/* ---------- 404 ---------- */}
      <Route path="*" element={<PageNotFound/>}/>
    </Routes>

  );
}

export default AppRouter;
