import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { X, Menu, User, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isAdmin, logout } = useAuth();

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 16);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const links: { label: string; path: string }[] = [
        { label: "Inicio", path: "/" },
        { label: "Canchas", path: "/canchas" },
        { label: "Nosotros", path: "/nosotros" },
        { label: "Contacto", path: "/contacto" },
    ];

    const goTo = (path: string) => {
        navigate(path);
        setMobileOpen(false);
        if (!path.startsWith("/admin")) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header
            //Reemplazamos el "shadow-sm" por el "shadow-[0_4px_0px_0px_#ff6b2b]" naranja
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-border ${
                scrolled ? "bg-white backdrop-blur shadow-[0_4px_0px_0px_#ff6b2b]" : "bg-white"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
                {/* Logo */}
                <button
                    onClick={() => goTo("/")}
                    className="flex items-center gap-3 flex-shrink-0 group outline-none"
                >
                    <span className="w-12 h-12 bg-primary flex items-center justify-center text-primary-foreground font-headline-md text-xl border-2 border-primary group-hover:bg-secondary group-hover:border-secondary transition-colors">
                        Logo
                    </span>
                    <span className="font-headline-md text-foreground text-2xl uppercase tracking-tight hidden sm:block">
                        Proyecto<span className="text-primary group-hover:text-secondary transition-colors"> Expertos</span>
                    </span>
                </button>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {links.map((l) => (
                        <button
                            key={l.path}
                            onClick={() => goTo(l.path)}
                            className={`px-6 py-4 rounded-lg text-md font-large transition-colors ${location.pathname === l.path
                                ? "text-primary bg-secondary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                        >
                            {l.label}
                        </button>
                    ))}
                </nav>

                {/* Auth actions */}
                <div className="hidden md:flex items-center gap-2">
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Button size="sm" variant="ghost" onClick={() => goTo("/admin")}>
                                    Panel admin
                                </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => goTo("/mis-reservas")}>
                                <User size={15} /> Mis reservas
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleLogout}>
                                <LogOut size={14} /> Salir
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button size="sm" variant="ghost" onClick={() => goTo("/login")}>
                                Iniciar sesión
                            </Button>
                            <Button size="sm" variant="primary" onClick={() => goTo("/registro")}>
                                Registrarse
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-2">
                    {links.map((l) => (
                        <button
                            key={l.path}
                            onClick={() => goTo(l.path)}
                            className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === l.path ? "text-primary bg-secondary" : "text-foreground hover:bg-muted"
                                }`}
                        >
                            {l.label}
                        </button>
                    ))}
                    <div className="pt-2 border-t border-border flex flex-col gap-2">
                        {isAuthenticated ? (
                            <>
                                <Button size="sm" variant="ghost" onClick={() => goTo("/mis-reservas")}>
                                    <User size={14} /> Mis reservas
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                                    <LogOut size={14} /> Salir
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button size="sm" variant="outline" onClick={() => goTo("/login")}>
                                    Iniciar sesión
                                </Button>
                                <Button size="sm" variant="primary" onClick={() => goTo("/registro")}>
                                    Registrarse
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;