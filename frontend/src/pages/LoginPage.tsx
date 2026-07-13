import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

//COMPONENTS
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input";

//HOOKS
import { useAuth } from "../hooks/useAuth";

//API
import * as authApi from "../services/auth.api";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identificador, setIdentificador] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identificador || !pw) { setError("Por favor completa todos los campos."); return; }

    setError("");
    setLoading(true);
    try {
      const { usuario, accessToken } = await authApi.login({ identificador, contrasena: pw });
      login(usuario, accessToken);
      navigate(usuario.rol === "admin" ? "/admin" : "/mis-reservas");
    } catch (err: any) {
      const mensaje = err?.response?.data?.error ?? "No se pudo iniciar sesión. Intenta de nuevo.";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg mx-auto mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            CP
          </div>
          <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Bienvenido de vuelta
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Ingresa a tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Correo o usuario"
              type="text"
              placeholder="tu@correo.com o tu_usuario"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Contraseña</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={15} /> {error}
              </div>
            )}
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? "Ingresando…" : "Iniciar sesión"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes cuenta?{" "}
            <button onClick={() => navigate("/registro")} className="text-primary font-semibold hover:underline">
              Regístrate gratis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
