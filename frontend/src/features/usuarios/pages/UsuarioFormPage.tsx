import { ChevronLeft } from "lucide-react";
import { useUsuarioForm } from "@/features/usuarios/hooks/useUsuarioForm";
import { Button } from "@/shared/components/ui/Button";
import { PasswordTemporalModal } from "@/features/usuarios/components/PasswordTemporalModal";

function UsuarioFormPage() {
  const {
    formData, handleChange, handleSubmit, isLoading, error,
    navigate, isEditMode, roles, passwordTemporal,
  } = useUsuarioForm();

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
                <input required maxLength={50} name="primerNombre" value={formData.primerNombre} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="Carlos" pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-]+$" title="El nombre solo puede contener letras y espacios." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Segundo nombre</label>
                <input maxLength={50} name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="(opcional)" pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-]+$" title="El nombre solo puede contener letras y espacios." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Primer apellido *</label>
                <input required maxLength={50} name="primerApellido" value={formData.primerApellido} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="Mejía" pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-]+$" title="El apellido solo puede contener letras y espacios." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Segundo apellido</label>
                <input maxLength={50} name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="(opcional)" pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-]+$" title="El apellido solo puede contener letras y espacios." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Correo electrónico *</label>
                <input required type="email" name="correo" value={formData.correo} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="tu@correo.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nombre de usuario *</label>
                <input required minLength={3} maxLength={50} name="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="para iniciar sesión" pattern="^[a-zA-Z0-9_\-]{3,50}$" title="El nombre de usuario solo permite letras, números, guiones y guiones bajos (mín. 3 caracteres, sin espacios)." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Teléfono *</label>
                <input required type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="+504 0000-0000" pattern="^\+?[\d\s\-]{8,15}$" title="Ingrese un número de teléfono válido (mínimo 8 dígitos)" />
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
                <input name="numeroIdentidad" value={formData.numeroIdentidad} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="Ej: 0801199012345 (13 dígitos sin guiones)" pattern="^\d{13}$" maxLength={13} minLength={13} title="El número de identidad debe tener exactamente 13 dígitos numéricos sin guiones ni espacios." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">RTN</label>
                <input name="rtn" value={formData.rtn} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="Ej: 08011990123456 (14 dígitos sin guiones)" pattern="^\d{14}$" maxLength={14} minLength={14} title="El RTN debe tener exactamente 14 dígitos numéricos sin guiones ni espacios." />
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

      {passwordTemporal && (
        <PasswordTemporalModal
          isOpen={!!passwordTemporal}
          onClose={() => navigate("/admin/usuarios")}
          passwordTemporal={passwordTemporal}
        />
      )}
    </div>
  );
}

export default UsuarioFormPage;