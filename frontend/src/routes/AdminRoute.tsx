import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/** Exige usuario logueado Y con rol admin. Si no está logueado -> /login.
 * Si está logueado pero no es admin -> /  (no tiene permiso). */
function AdminRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Cargando…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
