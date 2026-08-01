import { CalendarDays, BarChart2, CreditCard, Users, Home, Layers, Zap } from "lucide-react";

const adminNav = [
  { path: "/admin", label: "Dashboard", icon: <Home size={17} /> },
  { path: "/admin/canchas", label: "Canchas", icon: <Layers size={17} /> },
  { path: "/admin/reservas", label: "Reservas", icon: <CalendarDays size={17} /> },
  { path: "/admin/pagos", label: "Pagos & Facturación", icon: <CreditCard size={17} /> },
  { path: "/admin/reportes", label: "Reportes", icon: <BarChart2 size={17} /> },
  { path: "/admin/usuarios", label: "Usuarios", icon: <Users size={17} /> },
  { path: "/admin/sistema-experto", label: "Sistema Experto", icon: <Zap size={17} /> },
];

export default adminNav;
