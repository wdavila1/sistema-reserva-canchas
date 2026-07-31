import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { X, Menu, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { navLinks } from "@/shared/config/navigation";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isAdmin, logout, usuario } = useAuth();

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 16);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

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
                    {navLinks.map((l) => (
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
                                Mis reservas
                            </Button>

                            {/* Avatar con dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen((o) => !o)}
                                    className="flex items-center gap-2 px-3 py-1.5 border-2 border-primary hover:bg-muted transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {usuario?.fotoPerfilURL ? (
                                            <img src={usuario.fotoPerfilURL} alt="Avatar"
                                                className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={14} className="text-primary" />
                                        )}
                                    </div>
                                    <span className="text-xs font-semibold text-primary hidden sm:block max-w-[100px] truncate"
                                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        {usuario?.nombre?.split(" ")[0] ?? "Usuario"}
                                    </span>
                                    <ChevronDown size={13} className={`text-primary transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                                </button>

                                {userMenuOpen && (
                                    <>
                                        {/* Overlay para cerrar */}
                                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-primary shadow-[6px_6px_0px_0px_#0b1f3a] z-50">
                                            <button
                                                onClick={() => { goTo("/mi-perfil"); setUserMenuOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                                            >
                                                <User size={15} className="text-muted-foreground" />
                                                Mi perfil
                                            </button>
                                            <div className="border-t border-border" />
                                            <button
                                                onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={15} />
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
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
                    {navLinks.map((l) => (
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
                                    Mis reservas
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => goTo("/mi-perfil")}>
                                    <User size={14} /> Mi perfil
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