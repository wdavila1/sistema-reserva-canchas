import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

/** Exige que haya un usuario logueado (de cualquier rol). Si no, manda a /login. */
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mientras se intenta restaurar la sesión (refresh con la cookie httpOnly),
  // no decidimos nada todavía — si no, alguien con sesión válida vería un
  // parpadeo hacia /login justo al refrescar la página.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Cargando…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
