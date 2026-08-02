import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

// UTILS
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { sportColor } from "@/shared/utils/sportColor";

// COMPONENTS
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";



// API
import { getCanchas, updateCanchaStatus, deleteCancha } from "@/features/canchas/services/canchas.api";
import type { Cancha } from "@/features/canchas/services/canchas.api";
import { useNavigate } from "react-router-dom";

function AdminCanchas() {
  const navigate = useNavigate();
  const [courts, setCourts] = useState<Cancha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canchaToDelete, setCanchaToDelete] = useState<{ id: number; nombre: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setIsLoading(true);
        const data = await getCanchas();
        setCourts(data);
      } catch (error) {
        console.error("Error cargando canchas", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourts();
  }, []);

  const toggle = async (id: number, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'Disponible' ? 'Mantenimiento' : 'Disponible';
    
    try {
      await updateCanchaStatus(id, nuevoEstado);
      setCourts((cs) => cs.map((c) => c.CanchaID === id ? { ...c, Estado: nuevoEstado } : c));
    } catch (error) {
      alert("Hubo un error al actualizar el estado de la cancha en la BD.");
    }
  };

  const handleDeleteClick = (id: number, nombre: string) => {
    setCanchaToDelete({ id, nombre });
  };

  const confirmDelete = async () => {
    if (!canchaToDelete) return;
    try {
      setIsDeleting(true);
      await deleteCancha(canchaToDelete.id);
      setCourts((cs) => cs.filter(c => c.CanchaID !== canchaToDelete.id));
      setCanchaToDelete(null);
    } catch (error: any) {
      alert(error.response?.data?.mensaje || "Error al comunicarse con el servidor.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Gestión de Canchas
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isLoading ? "Cargando..." : `${courts.length} canchas registradas en la base de datos`}
          </p>
        </div>
        <Button variant="primary" onClick= {() => navigate('/admin/canchas/nueva')}>
          <Plus size={16} /> Nueva cancha
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {/* 100% DATOS REALES DE SQL */}
                {["Cancha", "Deporte", "Capacidad", "Precio x Hora", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Sincronizando con PostgreSQL...</td></tr>
              ) : courts.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No hay canchas registradas.</td></tr>
              ) : (
                courts.map((c) => {
                  const deporte = c.NombreTipo || "Fútbol 5";
                  const estaDisponible = c.Estado === 'Disponible';
                  
                  return (
                    <tr key={c.CanchaID} className="border-t border-border hover:bg-muted/20 transition-colors">
                      {/* CANCHA*/}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={c.ImagenURL || "https://placehold.co/100x100"} alt={c.NombreCancha} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <span className="font-medium text-foreground whitespace-nowrap">{c.NombreCancha}</span>
                        </div>
                      </td>
                      
                      {/* DEPORTE */}
                      <td className="px-5 py-4">
                        <Badge className={sportColor[deporte] || sportColor[""]}> {deporte}</Badge>
                      </td>

                      {/* CAPACIDAD */}
                      <td className="px-5 py-4 text-muted-foreground text-sm">
                        {c.Capacidad} pers.
                      </td>
                      
                      {/* PRECIO POR HORA */}
                      <td className="px-5 py-4 font-mono text-sm font-semibold text-primary">
                        {formatCurrency(Number(c.PrecioPorHora))}
                      </td>
                      
                      {/* ESTADO */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggle(c.CanchaID, c.Estado)}
                          className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                            estaDisponible ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {estaDisponible ? "Disponible" : "Mantenimiento"}
                        </button>
                      </td>
                      
                      {/* ACCIONES (Editar/Eliminar) */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => navigate(`/admin/canchas/editar/${c.CanchaID}`)}
                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors" title="Editar">
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(c.CanchaID, c.NombreCancha)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors" title="Eliminar">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!canchaToDelete}
        onClose={() => setCanchaToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar Cancha"
        message={`¿Estás seguro de que deseas eliminar permanentemente la cancha "${canchaToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default AdminCanchas;