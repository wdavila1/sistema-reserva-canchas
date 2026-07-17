import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { X, Menu, ArrowRight } from "lucide-react";

import adminNav from "../features/admin/const/adminNav";

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
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary border-r-4 border-secondary flex flex-col transition-transform duration-300 shadow-[12px_0_0_0_rgba(11,31,58,0.1)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b-2 border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-headline-lg text-[28px] font-bold text-white tracking-tighter uppercase italic leading-none">
              PROYECTO <span className="text-secondary">EXPERTOS</span>
            </span>
            <span className="font-label-sm text-secondary uppercase tracking-widest text-[10px]">
              Admin Panel
            </span>
          </div>
          <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {adminNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => goTo(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 font-headline-md uppercase text-[18px] transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-secondary text-white shadow-[4px_4px_0px_0px_#ffffff]"
                    : "text-white/60 hover:text-white hover:bg-white/10 hover:translate-x-1"
                }`}
              >
                <span className={isActive ? "text-white" : "text-white/50"}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t-2 border-white/10">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 text-white/60 hover:text-secondary font-label-sm uppercase transition-colors py-3 hover:bg-white/5"
          >
            <ArrowRight size={18} className="rotate-180" /> Volver al sitio
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        
        {/* Top bar Brutalista */}
        <header className="bg-surface border-b-4 border-primary px-4 sm:px-8 h-20 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-none border-2 border-primary text-primary hover:bg-secondary hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <h1 className="font-headline-lg text-[32px] text-primary uppercase italic leading-none hidden sm:block">
              {currentLabel}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-primary shadow-[4px_4px_0px_0px_#0b1f3a]">
              <div className="w-8 h-8 bg-secondary flex items-center justify-center text-white font-headline-md text-[18px]">
                A
              </div>
              <span className="font-label-sm uppercase text-primary font-bold hidden sm:block">
                Administrador
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;