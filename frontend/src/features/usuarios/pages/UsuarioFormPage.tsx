import { ChevronLeft, Copy } from "lucide-react";
import { useUsuarioForm } from "@/features/usuarios/hooks/useUsuarioForm";
import { Button } from "@/shared/components/ui/Button";

function UsuarioFormPage() {
  const {
    formData, handleChange, handleSubmit, isLoading, error,
    navigate, isEditMode, roles, passwordTemporal,
  } = useUsuarioForm();

  // Pantalla de "contraseña temporal generada" tras crear un usuario nuevo.
  if (passwordTemporal) {
    return (
      <div className="min-h-screen bg-muted/30 pt-20 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm max-w-md w-full text-center">
          <h1 className="text-2xl font-black text-foreground mb-2">Usuario creado</h1>
          <p className="text-muted-foreground text-sm mb-5">
            Copia esta contraseña temporal y pásasela a la persona — no se podrá volver a ver.
          </p>
          <div className="flex items-center justify-between gap-3 bg-muted rounded-xl px-4 py-3 mb-6">
            <code className="font-mono text-lg font-bold text-primary">{passwordTemporal}</code>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(passwordTemporal)}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
              title="Copiar"
            >
              <Copy size={16} />
            </button>
          </div>
          <Button variant="primary" className="w-full" onClick={() => navigate("/admin/usuarios")}>
            Listo, ir al listado
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
        <button type="button" onClick={() => navigate("/admin/usuarios")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft size={16} /> Volver a usuarios
        </button>

        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
          <h1 className="text-3xl font-black text-foreground mb-6 uppercase italic">
            {isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Primer nombre *</label>
                <input required maxLength={50} name="primerNombre" value={formData.primerNombre} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="Carlos" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Segundo nombre</label>
                <input maxLength={50} name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="(opcional)" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Primer apellido *</label>
                <input required maxLength={50} name="primerApellido" value={formData.primerApellido} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="Mejía" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Segundo apellido</label>
                <input maxLength={50} name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="(opcional)" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Correo electrónico *</label>
                <input required type="email" name="correo" value={formData.correo} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="tu@correo.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nombre de usuario *</label>
                <input required maxLength={50} name="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="para iniciar sesión" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Teléfono *</label>
                <input required type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="+504 0000-0000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Rol *</label>
                <select required name="rolId" value={formData.rolId} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none">
                  {roles.map((r) => (
                    <option key={r.RolID} value={r.RolID}>{r.NombreRol}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Número de identidad</label>
                <input maxLength={13} name="numeroIdentidad" value={formData.numeroIdentidad} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="(opcional)" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">RTN</label>
                <input maxLength={40} name="rtn" value={formData.rtn} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="(opcional, para factura con RTN)" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Dirección</label>
              <textarea maxLength={200} name="direccion" value={formData.direccion} onChange={handleChange} rows={2} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none resize-none" placeholder="(opcional)" />
            </div>

            {!isEditMode && (
              <p className="text-xs text-muted-foreground bg-muted rounded-xl px-4 py-3">
                Al crear el usuario se genera una contraseña temporal automáticamente — se mostrará una sola vez después de guardar.
              </p>
            )}

            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? "Guardando..." : (isEditMode ? "Actualizar Usuario" : "Crear Usuario")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UsuarioFormPage;