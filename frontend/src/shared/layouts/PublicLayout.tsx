import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MenuAccesibilidad from "../components/layout/MenuAccesibilidad";

/** Layout de las páginas públicas (todo excepto /admin). Navbar y Footer ya
 * no reciben page/setPage por props: leen la ruta actual con useLocation()
 * y navegan con useNavigate()/<Link>. */
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MenuAccesibilidad />
    </div>
  );
}

export default PublicLayout;
