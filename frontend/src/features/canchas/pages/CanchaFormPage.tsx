import { ChevronLeft} from "lucide-react";
import { useCanchaForm } from "@/features/canchas/hooks/useCanchaForm";
import { Button } from "@/shared/components/ui/Button";

function CanchaFormPage() {
  // Conectamos la vista a nuestro hook
  const { formData, handleChange, handleSubmit, isLoading, error, navigate, isEditMode } = useCanchaForm();

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
        
        {/* Botón regresar */}
        <button type="button" onClick={() => navigate("/admin")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft size={16} /> Volver a administración
        </button>

        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
          <h1 className="text-3xl font-black text-foreground mb-6 uppercase italic">
            {isEditMode ? "Editar Cancha" : "Crear Nueva Cancha"}
          </h1>

          {/* Alerta de Error*/}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nombre de la Cancha *</label>
                <input required maxLength={50} name="nombreCancha" value={formData.nombreCancha} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="Cancha Los Pinos" />
                <p className="text-[10px] text-muted-foreground text-right">{formData.nombreCancha.length}/50</p>
              </div>

              {/* Selector de tipo*/}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Deporte *</label>
                <select name="tipoCanchaId" value={formData.tipoCanchaId} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none">
                  <option value={1}>Fútbol 5</option>
                  <option value={2}>Baloncesto</option>
                  <option value={3}>Voleibol</option>
                  <option value={4}>Tenis</option>
                  <option value={5}>Pádel</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Precio por Hora (Lps) *</label>
                <input required type="number" min="0" name="precioPorHora" value={formData.precioPorHora} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Capacidad (Personas) *</label>
                <input required type="number" min="1" name="capacidad" value={formData.capacidad} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">URL de la Imagen</label>
              <input name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none" placeholder="https://ejemplo.com/foto.jpg" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Descripción</label>
              <textarea maxLength={200} name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-input border-2 border-border focus:border-primary outline-none resize-none" placeholder="Cancha con grama sintética..." />
              <p className="text-[10px] text-muted-foreground text-right">
                {formData.descripcion.length}/200
              </p>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? "Guardando..." : (isEditMode ? "Actualizar Cancha" : "Guardar Cancha")}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default CanchaFormPage;