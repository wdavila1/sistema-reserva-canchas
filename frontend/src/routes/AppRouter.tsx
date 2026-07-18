import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

// Route guards
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Páginas públicas
import HomePage from "../pages/Home";
import CanchasPage from "../pages/CanchasPage";
import CanchaDetailPage from "../pages/CanchaDetailPage";
import LoginPage from "../pages/LoginPage";
import RegistroPage from "../pages/RegistroPage";
import NosotrosPage from "../pages/NosotrosPage";
import ContactoPage from "../pages/ContactoPage";

// Páginas protegidas (requieren login)
import ReservasPage from "../pages/ReservasPage";
import MisReservasPage from "../pages/MisReservasPage";

// Páginas de administración
import AdminDashboardPage from "../pages/admin/DashboardPage";
import AdminCanchasPage from "../pages/admin/AdminCanchasPage";
import AdminReservas from "../pages/admin/AdminReservas";
import AdminPagosPage from "../pages/admin/AdminPagosPage";
import AdminReportesPage from "../pages/admin/AdminReportesPage";
import AdminUsuariosPage from "../pages/admin/AdminUsuariosPage";
import CanchaFormPage from "../pages/admin/canchas/nueva/CanchaFormPage";

function AppRouter() {
  return (
    <Routes>
      {/* ---------- Sitio público ---------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/canchas" element={<CanchasPage />} />
        <Route path="/canchas/:id" element={<CanchaDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/contacto" element={<ContactoPage />} />

        {/* ---------- Requiere estar logueado ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/reservar/:courtId" element={<ReservasPage />} />
          <Route path="/mis-reservas" element={<MisReservasPage />} />
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
        </Route>
      </Route>

      {/* ---------- 404 ---------- */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-muted-foreground">
            Página no encontrada.
          </div>
        }
      />
    </Routes>

  );
}

export default AppRouter;
