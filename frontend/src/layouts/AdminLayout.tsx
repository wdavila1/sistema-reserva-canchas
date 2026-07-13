import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { X, Menu, ArrowRight } from "lucide-react";

import adminNav from "../features/admin/const/adminNav";

/** Layout del panel de administración. Ya no recibe page/setPage por props:
 * usa <Outlet/> de react-router para renderizar la sub-ruta activa
 * (definida en routes/AppRouter.tsx dentro de /admin). */
function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const goTo = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const currentLabel = adminNav.find((n) => n.path === location.pathname)?.label ?? "Dashboard";

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              CP
            </span>
            <span className="text-white font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Nombre <span className="text-accent"> Inventado </span>
            </span>
          </div>
          <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="px-3 py-2 border-b border-sidebar-border">
          <span className="text-white/40 text-xs px-2 uppercase tracking-widest font-semibold">Panel Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {adminNav.map((item) => (
            <button
              key={item.path}
              onClick={() => goTo(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "text-white/60 hover:text-white hover:bg-sidebar-accent"
              }`}
            >
              <span className={location.pathname === item.path ? "text-white" : "text-white/50"}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors py-2 px-3 rounded-xl hover:bg-sidebar-accent"
          >
            <ArrowRight size={15} className="rotate-180" /> Volver al sitio
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <span className="text-sm font-semibold text-foreground hidden sm:block">
              {currentLabel}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <span className="hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content (sub-ruta activa de /admin) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
