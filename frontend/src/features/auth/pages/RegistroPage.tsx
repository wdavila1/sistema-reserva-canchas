import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

//COMPONENTS
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

//HOOKS
import { useAuth } from "../hooks/useAuth";

//API
import * as authApi from "../services/auth.api";

// ─── Política de contraseña y validaciones de formato ───────────────────────────
// (deben espejarse con backend/auth.service.js)
const MIN_PW = 12;
const PW_RULES = [
  { label: `Mínimo ${MIN_PW} caracteres`,    test: (pw: string) => pw.length >= MIN_PW },
  { label: "Al menos una mayúscula (A–Z)",   test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "Al menos una minúscula (a–z)",   test: (pw: string) => /[a-z]/.test(pw) },
  { label: "Al menos un número (0–9)",       test: (pw: string) => /\d/.test(pw) },
  { label: "Al menos un símbolo (!@#$%...)", test: (pw: string) => /[!@#$%^&*()\-_=+\[\]{};:'",.<>?/\\|`~]/.test(pw) },
];

const REGEX_CORREO       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_NOMBRE       = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-]+$/;
const REGEX_USUARIO      = /^[a-zA-Z0-9_\-]{3,50}$/;
const REGEX_TELEFONO     = /^\+?[\d\s\-]{8,15}$/;
const REGEX_IDENTIDAD_HN = /^\d{13}$/;
const REGEX_RTN_HN       = /^\d{14}$/;

function calcularFuerza(pw: string): number {
  if (!pw) return 0;
  return PW_RULES.filter((r) => r.test(pw)).length;
}

function etiquetaFuerza(score: number): { texto: string; color: string } {
  if (score <= 1) return { texto: "Muy débil",   color: "#ef4444" };
  if (score === 2) return { texto: "Débil",        color: "#f97316" };
  if (score === 3) return { texto: "Regular",      color: "#eab308" };
  if (score === 4) return { texto: "Fuerte",       color: "#22c55e" };
  return           { texto: "Muy fuerte",          color: "#16a34a" };
}

// ─── Componente principal ─────────────────────────────────────────────────────
// El formulario sigue el modelo de Personas/Usuarios de db.sql.
function RegistroPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    correo: "",
    telefono: "",
    nombreUsuario: "",
    numeroIdentidad: "",
    rtn: "",
    direccion: "",
    pw: "",
    pw2: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // Fuerza de contraseña calculada reactivamente
  const pwScore  = useMemo(() => calcularFuerza(form.pw), [form.pw]);
  const pwLabel  = useMemo(() => etiquetaFuerza(pwScore), [pwScore]);
  const pwErrors = useMemo(() => PW_RULES.filter((r) => !r.test(form.pw)), [form.pw]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Trim de todos los campos antes de validar ─────────────────────────────
    const f = {
      primerNombre:    form.primerNombre.trim(),
      segundoNombre:   form.segundoNombre.trim(),
      primerApellido:  form.primerApellido.trim(),
      segundoApellido: form.segundoApellido.trim(),
      correo:          form.correo.trim().toLowerCase(),
      telefono:        form.telefono.trim(),
      nombreUsuario:   form.nombreUsuario.trim(),
      numeroIdentidad: form.numeroIdentidad.trim(),
      rtn:             form.rtn.trim(),
      direccion:       form.direccion.trim(),
      pw:              form.pw,
      pw2:             form.pw2,
    };

    // ── Campos obligatorios ────────────────────────────────────────────────
    if (!f.primerNombre || !f.primerApellido || !f.correo || !f.telefono ||
        !f.nombreUsuario || !f.pw || !f.numeroIdentidad) {
      setError("Por favor completa todos los campos obligatorios."); return;
    }

    // ── Formato de nombres ─────────────────────────────────────────────────
    if (!REGEX_NOMBRE.test(f.primerNombre))   { setError("El primer nombre solo puede contener letras y espacios."); return; }
    if (!REGEX_NOMBRE.test(f.primerApellido)) { setError("El primer apellido solo puede contener letras y espacios."); return; }
    if (f.segundoNombre   && !REGEX_NOMBRE.test(f.segundoNombre))  { setError("El segundo nombre solo puede contener letras y espacios."); return; }
    if (f.segundoApellido && !REGEX_NOMBRE.test(f.segundoApellido)) { setError("El segundo apellido solo puede contener letras y espacios."); return; }

    // ── Correo ────────────────────────────────────────────────────────────
    if (!REGEX_CORREO.test(f.correo)) { setError("El formato del correo electrónico no es válido."); return; }

    // ── Nombre de usuario ────────────────────────────────────────────────
    if (!REGEX_USUARIO.test(f.nombreUsuario)) {
      setError("El nombre de usuario solo permite letras, números, - y _ (mín. 3 caracteres, sin espacios)."); return;
    }

    // ── Teléfono ─────────────────────────────────────────────────────────
    if (!REGEX_TELEFONO.test(f.telefono)) { setError("El teléfono no tiene un formato válido (mínimo 8 dígitos)."); return; }

    // ── Identidad hondureña ───────────────────────────────────────────────
    if (!REGEX_IDENTIDAD_HN.test(f.numeroIdentidad)) {
      setError("La identidad debe ser exactamente 13 dígitos sin guiones ni espacios."); return;
    }

    // ── RTN hondureño ────────────────────────────────────────────────────
    if (f.rtn && !REGEX_RTN_HN.test(f.rtn)) {
      setError("El RTN debe ser exactamente 14 dígitos sin guiones ni espacios."); return;
    }

    // ── Contraseña ────────────────────────────────────────────────────────
    if (f.pw !== f.pw2) { setError("Las contraseñas no coinciden."); return; }
    if (pwScore < PW_RULES.length) {
      setError("La contraseña no cumple con la política de seguridad requerida."); return;
    }

    setError("");
    setLoading(true);
    try {
      const { usuario, accessToken } = await authApi.registro({
        primerNombre:    f.primerNombre,
        segundoNombre:   f.segundoNombre   || undefined,
        primerApellido:  f.primerApellido,
        segundoApellido: f.segundoApellido || undefined,
        correo:          f.correo,
        telefono:        f.telefono,
        nombreUsuario:   f.nombreUsuario,
        contrasena:      f.pw,
        numeroIdentidad: f.numeroIdentidad || undefined,
        rtn:             f.rtn             || undefined,
        direccion:       f.direccion       || undefined,
      });
      login(usuario, accessToken);
      navigate("/mis-reservas");
    } catch (err: any) {
      const mensaje = err?.response?.data?.error ?? "No se pudo completar el registro. Intenta de nuevo.";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg mx-auto mb-4">
            CP
          </div>
          <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Crea tu cuenta
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Regístrate y reserva en segundos</p>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ── Nombres ── */}
            <div className="grid grid-cols-2 gap-3">
              <Input label="Primer nombre *"   placeholder="Carlos"     value={form.primerNombre}   onChange={set("primerNombre")} />
              <Input label="Segundo nombre"    placeholder="(opcional)" value={form.segundoNombre}  onChange={set("segundoNombre")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Primer apellido *" placeholder="Mejía"      value={form.primerApellido} onChange={set("primerApellido")} />
              <Input label="Segundo apellido"  placeholder="(opcional)" value={form.segundoApellido} onChange={set("segundoApellido")} />
            </div>

            {/* ── Contacto ── */}
            <Input label="Correo electrónico *" type="email" placeholder="tu@correo.com"       value={form.correo}        onChange={set("correo")} />
            <Input label="Nombre de usuario *"              placeholder="Min. 3 caracteres (sin espacios)"  value={form.nombreUsuario} onChange={set("nombreUsuario")} />
            <Input label="Teléfono *"           type="tel"  placeholder="+50400000000"       value={form.telefono}      onChange={set("telefono")} />

            {/* ── Identidad / Fiscal ── */}
            <div className="border-t border-dashed border-border pt-4 mt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Datos de identidad
              </p>
              <Input
                label="Número de identidad *"
                placeholder="Ej: 0801199900001 (13 dígitos)"
                value={form.numeroIdentidad}
                onChange={set("numeroIdentidad")}
                inputMode="numeric"
              />
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Input label="RTN"       placeholder="14 dígitos (opcional)" value={form.rtn}      onChange={set("rtn")} inputMode="numeric" />
                <Input label="Dirección" placeholder="(opcional)"             value={form.direccion} onChange={set("direccion")} />
              </div>
            </div>

            {/* ── Contraseña ── */}
            <div className="border-t border-dashed border-border pt-4 mt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Contraseña
              </p>
              <Input
                label="Contraseña *"
                type="password"
                placeholder={`Mínimo ${MIN_PW} caracteres`}
                value={form.pw}
                onChange={(e) => { set("pw")(e); setPwTouched(true); }}
              />

              {/* Indicador de fuerza */}
              {pwTouched && form.pw.length > 0 && (
                <div className="mt-2 space-y-1">
                  {/* Barra de progreso */}
                  <div className="flex gap-1">
                    {PW_RULES.map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i < pwScore ? pwLabel.color : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-semibold" style={{ color: pwLabel.color }}>
                    {pwLabel.texto}
                  </p>
                  {/* Reglas pendientes */}
                  {pwErrors.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {PW_RULES.map((rule) => {
                        const ok = rule.test(form.pw);
                        return (
                          <li key={rule.label} className="flex items-center gap-1.5 text-xs">
                            {ok
                              ? <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                              : <XCircle      size={12} className="text-red-400 shrink-0" />
                            }
                            <span className={ok ? "text-green-700" : "text-muted-foreground"}>
                              {rule.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

              <div className="mt-3">
                <Input
                  label="Confirmar contraseña *"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={form.pw2}
                  onChange={set("pw2")}
                />
                {form.pw2 && form.pw !== form.pw2 && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <XCircle size={12} /> Las contraseñas no coinciden
                  </p>
                )}
                {form.pw2 && form.pw === form.pw2 && form.pw2.length > 0 && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Las contraseñas coinciden
                  </p>
                )}
              </div>
            </div>

            {/* ── Error global ── */}
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? "Creando cuenta…" : "Crear cuenta"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            ¿Ya tienes cuenta?{" "}
            <button onClick={() => navigate("/login")} className="text-primary font-semibold hover:underline">
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistroPage;
