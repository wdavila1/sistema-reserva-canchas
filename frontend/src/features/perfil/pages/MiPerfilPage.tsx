import { useState, useRef, useEffect } from "react";
import { Camera, User, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, CalendarDays, Hash, Trash2 } from "lucide-react";
import { useMiPerfil } from "@/features/perfil/hooks/useMiPerfil";
import { Button } from "@/shared/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";

// ── Helpers ───────────────────────────────────────────────────────────────────
function Initials({ nombre }: { nombre: string }) {
  const parts = nombre.trim().split(" ");
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
  return <>{initials}</>;
}

function Alert({ type, msg }: { type: "success" | "error"; msg: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm px-4 py-3 border rounded-xl ${
      type === "success"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-red-50 text-destructive border-red-200"
    }`}>
      {type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
      {msg}
    </div>
  );
}

// ── Sección: Información Personal ────────────────────────────────────────────
function SeccionDatos({ perfil, guardarDatos, savingData, saveError, saveSuccess, setSaveSuccess }: any) {
  const [form, setForm] = useState({
    primerNombre:    perfil.PrimerNombre,
    segundoNombre:   perfil.SegundoNombre ?? "",
    primerApellido:  perfil.PrimerApellido,
    segundoApellido: perfil.SegundoApellido ?? "",
    correo:          perfil.Correo,
    telefono:        perfil.Telefono,
    direccion:       perfil.Direccion ?? "",
    numeroIdentidad: perfil.NumeroIdentidad ?? "",
    rtn:             perfil.RTN ?? "",
  });

  // Limpiar éxito tras 4 segundos
  useEffect(() => {
    if (!saveSuccess) return;
    const t = setTimeout(() => setSaveSuccess(false), 4000);
    return () => clearTimeout(t);
  }, [saveSuccess, setSaveSuccess]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    guardarDatos({
      primerNombre:    form.primerNombre,
      segundoNombre:   form.segundoNombre || undefined,
      primerApellido:  form.primerApellido,
      segundoApellido: form.segundoApellido || undefined,
      correo:          form.correo,
      telefono:        form.telefono,
      direccion:       form.direccion || undefined,
      numeroIdentidad: form.numeroIdentidad || undefined,
      rtn:             form.rtn || undefined,
    });
  };

  const inputCls = "w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none transition-colors text-sm";
  const labelCls = "block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1";

  return (
    <form onSubmit={submit} className="space-y-5">
      {saveError  && <Alert type="error"   msg={saveError} />}
      {saveSuccess && <Alert type="success" msg="Datos actualizados correctamente." />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Primer nombre *</label>
          <input required name="primerNombre" value={form.primerNombre} onChange={handle}
            className={inputCls} placeholder="Carlos"
            pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-]+$" maxLength={50} />
        </div>
        <div>
          <label className={labelCls}>Segundo nombre</label>
          <input name="segundoNombre" value={form.segundoNombre} onChange={handle}
            className={inputCls} placeholder="(opcional)"
            pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-]+$" maxLength={50} />
        </div>
        <div>
          <label className={labelCls}>Primer apellido *</label>
          <input required name="primerApellido" value={form.primerApellido} onChange={handle}
            className={inputCls} placeholder="Mejía"
            pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-]+$" maxLength={50} />
        </div>
        <div>
          <label className={labelCls}>Segundo apellido</label>
          <input name="segundoApellido" value={form.segundoApellido} onChange={handle}
            className={inputCls} placeholder="(opcional)"
            pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-]+$" maxLength={50} />
        </div>
        <div>
          <label className={labelCls}>Correo electrónico *</label>
          <input required type="email" name="correo" value={form.correo} onChange={handle}
            className={inputCls} placeholder="tu@correo.com" />
        </div>
        <div>
          <label className={labelCls}>Teléfono *</label>
          <input required type="tel" name="telefono" value={form.telefono} onChange={handle}
            className={inputCls} placeholder="+504 0000-0000"
            pattern="^\+?[\d\s\-]{8,15}$" />
        </div>
        <div>
          <label className={labelCls}>Número de identidad</label>
          <input name="numeroIdentidad" value={form.numeroIdentidad} onChange={handle}
            className={inputCls} placeholder="13 dígitos sin guiones"
            pattern="^\d{13}$" maxLength={13} minLength={13} />
        </div>
        <div>
          <label className={labelCls}>RTN</label>
          <input name="rtn" value={form.rtn} onChange={handle}
            className={inputCls} placeholder="14 dígitos sin guiones"
            pattern="^\d{14}$" maxLength={14} minLength={14} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Dirección</label>
        <textarea name="direccion" value={form.direccion} onChange={handle}
          rows={2} maxLength={200}
          className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none resize-none text-sm transition-colors"
          placeholder="(opcional)" />
      </div>

      <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={savingData}>
        {savingData ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}

// ── Sección: Cambiar Contraseña ───────────────────────────────────────────────
function SeccionContrasena({ guardarContrasena, savingPass, passError, passSuccess, setPassSuccess }: any) {
  const [form, setForm] = useState({ contrasenaActual: "", contrasenaNueva: "", confirmarContrasena: "" });
  const [show, setShow] = useState({ actual: false, nueva: false, confirmar: false });

  useEffect(() => {
    if (!passSuccess) return;
    const t = setTimeout(() => {
      setPassSuccess(false);
      setForm({ contrasenaActual: "", contrasenaNueva: "", confirmarContrasena: "" });
    }, 4000);
    return () => clearTimeout(t);
  }, [passSuccess, setPassSuccess]);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    guardarContrasena(form);
  };

  const inputCls = "w-full pl-4 pr-11 py-3 bg-input border-2 border-border focus:border-primary outline-none transition-colors text-sm";
  const labelCls = "block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1";

  return (
    <form onSubmit={submit} className="space-y-5">
      {passError   && <Alert type="error"   msg={passError} />}
      {passSuccess  && <Alert type="success" msg="Contraseña cambiada correctamente." />}

      <div className="space-y-4">
        <div>
          <label className={labelCls}>Contraseña actual *</label>
          <div className="relative">
            <input
              required type={show.actual ? "text" : "password"}
              name="contrasenaActual" value={form.contrasenaActual} onChange={handle}
              className={inputCls} placeholder="••••••••••••" />
            <button type="button" tabIndex={-1} onClick={() => setShow(s => ({...s, actual: !s.actual}))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {show.actual ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelCls}>Nueva contraseña *</label>
          <div className="relative">
            <input
              required type={show.nueva ? "text" : "password"}
              name="contrasenaNueva" value={form.contrasenaNueva} onChange={handle}
              className={inputCls} placeholder="••••••••••••" />
            <button type="button" tabIndex={-1} onClick={() => setShow(s => ({...s, nueva: !s.nueva}))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {show.nueva ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelCls}>Confirmar contraseña *</label>
          <div className="relative">
            <input
              required type={show.confirmar ? "text" : "password"}
              name="confirmarContrasena" value={form.confirmarContrasena} onChange={handle}
              className={inputCls} placeholder="••••••••••••" />
            <button type="button" tabIndex={-1} onClick={() => setShow(s => ({...s, confirmar: !s.confirmar}))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {show.confirmar ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground bg-muted px-4 py-3 rounded-xl">
        La contraseña debe tener al menos 12 caracteres con mayúsculas, minúsculas, números y símbolos.
      </p>

      <Button type="submit" variant="outline" className="w-full sm:w-auto" disabled={savingPass}>
        {savingPass ? "Cambiando..." : "Cambiar contraseña"}
      </Button>
    </form>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
function MiPerfilPage() {
  const { usuario } = useAuth();
  const {
    perfil, loading, error,
    guardarDatos, savingData, saveError, saveSuccess, setSaveSuccess,
    guardarContrasena, savingPass, passError, passSuccess, setPassSuccess,
    subirFoto, uploadingFoto, fotoError, eliminarFoto, deletingFoto,
  } = useMiPerfil();

  const [tab, setTab] = useState<"datos" | "password">("datos");
  const fileRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) subirFoto(file);
    e.target.value = "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="min-h-screen bg-muted/30 pt-20 flex items-center justify-center">
        <div className="bg-red-50 text-destructive border border-red-200 rounded-xl px-6 py-4 text-sm">
          {error ?? "No se pudo cargar el perfil."}
        </div>
      </div>
    );
  }

  const nombreCompleto = `${perfil.PrimerNombre} ${perfil.PrimerApellido}`;
  const esAdmin = usuario?.rol === "admin";

  return (
    <div className="min-h-screen bg-muted/30 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="py-8">
          <h1
            className="text-4xl font-black text-foreground uppercase italic"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Mi Perfil
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestiona tu información personal y credenciales
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

          {/* ─── Card lateral: Avatar + datos resumidos ─────────────────── */}
          <div className="space-y-4">

            {/* Avatar */}
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full border-4 border-secondary overflow-hidden bg-secondary flex items-center justify-center">
                  {perfil.FotoPerfilURL ? (
                    <img src={perfil.FotoPerfilURL} alt="Foto de perfil"
                      className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary font-black text-3xl"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      <Initials nombre={nombreCompleto} />
                    </span>
                  )}
                </div>

                {/* Botón cambiar foto */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingFoto}
                  className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-[4px_4px_0px_0px_#ff6b2b] hover:bg-secondary transition-colors disabled:opacity-60"
                  title="Cambiar foto de perfil"
                >
                  <Camera size={15} />
                </button>

                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </div>
              
              {perfil.FotoPerfilURL && (
                <button
                  type="button"
                  onClick={eliminarFoto}
                  disabled={deletingFoto}
                  className="flex items-center gap-1 text-xs text-destructive hover:underline disabled:opacity-50 mt-1"
                >
                  <Trash2 size={13} /> {deletingFoto ? "Eliminando..." : "Eliminar foto"}
                </button>
              )}

              {uploadingFoto && (
                <p className="text-xs text-muted-foreground animate-pulse">Subiendo foto...</p>
              )}
              {fotoError && <Alert type="error" msg={fotoError} />}

              <div className="text-center">
                <p className="font-black text-xl text-foreground"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {nombreCompleto}
                </p>
                <p className="text-sm text-muted-foreground">@{perfil.NombreUsuario}</p>
                <span className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  esAdmin
                    ? "bg-primary text-white"
                    : "bg-secondary text-primary"
                }`}>
                  {perfil.NombreRol}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white border border-border rounded-2xl shadow-sm divide-y divide-border">
              <div className="px-5 py-4 flex items-center gap-3">
                <CalendarDays size={16} className="text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Miembro desde</p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(perfil.FechaCreacion).toLocaleDateString("es-HN", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="px-5 py-4 flex items-center gap-3">
                <Hash size={16} className="text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total reservas</p>
                  <p className="text-sm font-semibold text-foreground">{perfil.TotalReservas}</p>
                </div>
              </div>
              {perfil.Correo && (
                <div className="px-5 py-4 flex items-center gap-3">
                  <User size={16} className="text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Correo</p>
                    <p className="text-sm font-semibold text-foreground truncate">{perfil.Correo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Panel principal: tabs ──────────────────────────────────── */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b-4 border-primary">
              <button
                onClick={() => setTab("datos")}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold uppercase tracking-wide transition-colors ${
                  tab === "datos"
                    ? "bg-secondary text-primary shadow-[inset_0_-4px_0_0_#0b1f3a]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                <User size={16} /> Información personal
              </button>
              <button
                onClick={() => setTab("password")}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold uppercase tracking-wide transition-colors ${
                  tab === "password"
                    ? "bg-secondary text-primary shadow-[inset_0_-4px_0_0_#0b1f3a]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                <Lock size={16} /> Seguridad
              </button>
            </div>

            {/* Contenido del tab */}
            <div className="p-6 sm:p-8">
              {tab === "datos" ? (
                <SeccionDatos
                  perfil={perfil}
                  guardarDatos={guardarDatos}
                  savingData={savingData}
                  saveError={saveError}
                  saveSuccess={saveSuccess}
                  setSaveSuccess={setSaveSuccess}
                />
              ) : (
                <SeccionContrasena
                  guardarContrasena={guardarContrasena}
                  savingPass={savingPass}
                  passError={passError}
                  passSuccess={passSuccess}
                  setPassSuccess={setPassSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiPerfilPage;
