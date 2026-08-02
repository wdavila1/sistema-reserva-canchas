import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, PowerOff, Power, Tag, Clock, Calendar } from "lucide-react";

import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Badge } from "@/shared/components/ui/Badge";

import {
  getPromociones,
  crearPromocion,
  actualizarPromocion,
  eliminarPromocion,
} from "@/features/promociones/services/promociones.api";
import type { Promocion, PromocionInput } from "@/features/promociones/services/promociones.api";

// ── Helpers ──────────────────────────────────────────────────────────────────
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const DIAS_OPTS = [
  { value: "", label: "Todos los días" },
  ...DIAS.map((d, i) => ({ value: String(i), label: d })),
];

const FORM_INICIAL: PromocionInput = {
  titulo: "",
  descripcion: "",
  porcentajeDescuento: 10,
  diaSemana: null,
  horaInicio: null,
  horaFin: null,
  estado: true,
};

// ── Componente de formulario ──────────────────────────────────────────────────
function PromocionForm({
  inicial,
  onGuardar,
  onCancelar,
  cargando,
}: {
  inicial: PromocionInput;
  onGuardar: (d: PromocionInput) => void;
  onCancelar: () => void;
  cargando: boolean;
}) {
  const [form, setForm] = useState<PromocionInput>(inicial);
  const set = (k: keyof PromocionInput, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({
      ...form,
      diaSemana: form.diaSemana === null || form.diaSemana === undefined ? null : Number(form.diaSemana),
      horaInicio: form.horaInicio || null,
      horaFin: form.horaFin || null,
    });
  };

  const inputClass =
    "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white";
  const labelClass = "block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Título */}
      <div>
        <label className={labelClass}>Título *</label>
        <input
          id="promo-titulo"
          required
          value={form.titulo}
          onChange={(e) => set("titulo", e.target.value)}
          placeholder="Ej. Promo Lunes"
          className={inputClass}
        />
      </div>

      {/* Descripción */}
      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          id="promo-descripcion"
          value={form.descripcion ?? ""}
          onChange={(e) => set("descripcion", e.target.value)}
          placeholder="Descripción opcional"
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Porcentaje */}
      <div>
        <label className={labelClass}>Descuento (%) *</label>
        <div className="relative">
          <input
            id="promo-porcentaje"
            required
            type="number"
            min={1}
            max={100}
            value={form.porcentajeDescuento}
            onChange={(e) => set("porcentajeDescuento", Number(e.target.value))}
            className={`${inputClass} pr-8`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
        </div>
      </div>

      {/* Día semana */}
      <div>
        <label className={labelClass}>Día de la semana</label>
        <select
          id="promo-dia"
          value={form.diaSemana === null || form.diaSemana === undefined ? "" : String(form.diaSemana)}
          onChange={(e) => set("diaSemana", e.target.value === "" ? null : Number(e.target.value))}
          className={inputClass}
        >
          {DIAS_OPTS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <p className="text-[11px] text-muted-foreground mt-1">
          Si dejas "Todos los días", la promoción aplica cualquier día.
        </p>
      </div>

      {/* Rango horario */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Hora inicio</label>
          <input
            id="promo-hora-inicio"
            type="time"
            value={form.horaInicio ?? ""}
            onChange={(e) => set("horaInicio", e.target.value || null)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Hora fin</label>
          <input
            id="promo-hora-fin"
            type="time"
            value={form.horaFin ?? ""}
            onChange={(e) => set("horaFin", e.target.value || null)}
            className={inputClass}
          />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground -mt-2">
        Si dejas vacías las horas, la promoción aplica a cualquier horario del día seleccionado.
      </p>

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-2 border-t border-border">
        <Button type="button" variant="outline" size="sm" onClick={onCancelar} disabled={cargando}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={cargando}>
          {cargando ? "Guardando..." : "Guardar promoción"}
        </Button>
      </div>
    </form>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
function AdminPromocionesPage() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal crear
  const [modalCrear, setModalCrear] = useState(false);
  // Modal editar
  const [modalEditar, setModalEditar] = useState<Promocion | null>(null);

  // Filtro
  const [filtro, setFiltro] = useState<"todas" | "activas" | "inactivas">("todas");
  const [filtroDia, setFiltroDia] = useState<string>("todos");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);

  // Resetear página al cambiar filtros o cantidad de items
  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, filtroDia, itemsPorPagina]);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPromociones();
      setPromociones(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar las promociones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleCrear = async (datos: PromocionInput) => {
    setGuardando(true);
    try {
      await crearPromocion(datos);
      setModalCrear(false);
      cargar();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { mensaje?: string } } };
      alert(err.response?.data?.mensaje ?? "Error al crear la promoción.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = async (datos: PromocionInput) => {
    if (!modalEditar) return;
    setGuardando(true);
    try {
      await actualizarPromocion(modalEditar.promocionid, datos);
      setModalEditar(null);
      cargar();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { mensaje?: string } } };
      alert(err.response?.data?.mensaje ?? "Error al actualizar la promoción.");
    } finally {
      setGuardando(false);
    }
  };

  const handleToggleEstado = async (p: Promocion) => {
    const accion = p.estado ? "desactivar" : "activar";
    if (!window.confirm(`¿Deseas ${accion} la promoción "${p.titulo}"?`)) return;
    try {
      await actualizarPromocion(p.promocionid, { estado: !p.estado });
      cargar();
    } catch {
      alert("Error al cambiar el estado.");
    }
  };

  const handleEliminar = async (p: Promocion) => {
    if (!window.confirm(`¿Deseas desactivar permanentemente "${p.titulo}"?`)) return;
    try {
      await eliminarPromocion(p.promocionid);
      cargar();
    } catch {
      alert("Error al eliminar la promoción.");
    }
  };

  const activas = promociones.filter((p) => p.estado).length;
  const inactivas = promociones.length - activas;

  const promocionesFiltradas = promociones.filter(p => {
    // Filtro por estado
    if (filtro === "activas" && !p.estado) return false;
    if (filtro === "inactivas" && p.estado) return false;

    // Filtro por día
    if (filtroDia !== "todos") {
      if (filtroDia === "null") {
        if (p.diasemana !== null && p.diasemana !== undefined) return false;
      } else {
        if (p.diasemana !== Number(filtroDia)) return false;
      }
    }

    return true;
  });

  // Cálculo de paginación
  const totalPaginas = Math.ceil(promocionesFiltradas.length / itemsPorPagina);
  const indexUltimo = paginaActual * itemsPorPagina;
  const indexPrimero = indexUltimo - itemsPorPagina;
  const promocionesPaginadas = promocionesFiltradas.slice(indexPrimero, indexUltimo);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Gestión de Promociones
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {loading
              ? "Cargando..."
              : `${promociones.length} registradas · ${activas} activas · ${inactivas} inactivas`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Filtro Día */}
          <select 
            value={filtroDia} 
            onChange={(e) => setFiltroDia(e.target.value)}
            className="border-2 border-border rounded-lg px-3 py-2 text-sm font-semibold text-foreground bg-white cursor-pointer hover:border-primary/50 transition-colors focus:outline-none"
          >
            <option value="todos">Cualquier día</option>
            <option value="null">Todos los días (Global)</option>
            {DIAS.map((d, i) => (
              <option key={i} value={String(i)}>{d}</option>
            ))}
          </select>

          {/* Filtro Estado */}
          <select 
            value={filtro} 
            onChange={(e) => setFiltro(e.target.value as "todas" | "activas" | "inactivas")}
            className="border-2 border-border rounded-lg px-3 py-2 text-sm font-semibold text-foreground bg-white cursor-pointer hover:border-primary/50 transition-colors focus:outline-none"
          >
            <option value="todas">Estado: Todas ({promociones.length})</option>
            <option value="activas">Solo Activas ({activas})</option>
            <option value="inactivas">Solo Inactivas ({inactivas})</option>
          </select>
          
          <Button id="btn-nueva-promo" variant="primary" onClick={() => setModalCrear(true)}>
            <Plus size={16} /> Nueva promoción
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Promoción", "Descuento", "Aplica día", "Rango horario", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    Sincronizando con la base de datos...
                  </td>
                </tr>
              ) : promociones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Tag size={32} className="text-muted-foreground/40" />
                      <p>No hay promociones registradas.</p>
                      <p className="text-xs">Crea una nueva o espera que el Sistema Experto sugiera una.</p>
                    </div>
                  </td>
                </tr>
              ) : promocionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    No hay promociones que coincidan con el filtro actual.
                  </td>
                </tr>
              ) : (
                promocionesPaginadas.map((p) => (
                  <tr key={p.promocionid} className={`border-t border-border hover:bg-muted/20 transition-colors ${!p.estado ? "opacity-50" : ""}`}>
                    {/* Título + descripción */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Tag size={15} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{p.titulo}</p>
                          {p.descripcion && (
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{p.descripcion}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Descuento */}
                    <td className="px-5 py-4">
                      <span className="text-2xl font-black text-primary leading-none">
                        {Number(p.porcentajedescuento)}%
                      </span>
                    </td>

                    {/* Día */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar size={13} />
                        <span className="text-sm">
                          {p.diasemana === null || p.diasemana === undefined
                            ? "Todos los días"
                            : DIAS[p.diasemana]}
                        </span>
                      </div>
                    </td>

                    {/* Rango horario */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock size={13} />
                        <span className="text-sm font-mono">
                          {p.horainicio && p.horafin
                            ? `${p.horainicio.slice(0, 5)} – ${p.horafin.slice(0, 5)}`
                            : "Cualquier hora"}
                        </span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-4">
                      <Badge
                        variant={p.estado ? "success" : "default"}
                        className={p.estado
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"}
                      >
                        {p.estado ? "Activa" : "Inactiva"}
                      </Badge>
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {/* Editar */}
                        <button
                          id={`btn-editar-promo-${p.promocionid}`}
                          onClick={() => setModalEditar(p)}
                          className="p-1.5 rounded-lg hover:bg-secondary/10 text-muted-foreground hover:text-primary transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* Toggle activo/inactivo */}
                        <button
                          id={`btn-toggle-promo-${p.promocionid}`}
                          onClick={() => handleToggleEstado(p)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.estado
                              ? "hover:bg-orange-50 text-muted-foreground hover:text-orange-500"
                              : "hover:bg-emerald-50 text-muted-foreground hover:text-emerald-600"
                          }`}
                          title={p.estado ? "Desactivar" : "Activar"}
                        >
                          {p.estado ? <PowerOff size={14} /> : <Power size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Controles de Paginación ───────────────────────────────────── */}
      {promocionesFiltradas.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 bg-white p-4 rounded-xl border border-border">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-sm text-muted-foreground font-medium">
              Mostrando <span className="text-foreground font-bold">{indexPrimero + 1}</span> a <span className="text-foreground font-bold">{Math.min(indexUltimo, promocionesFiltradas.length)}</span> de <span className="text-foreground font-bold">{promocionesFiltradas.length}</span> promociones
            </p>
            
            <div className="flex items-center gap-2 border-l border-border pl-4">
              <span className="text-sm text-muted-foreground">Mostrar:</span>
              <select
                value={itemsPorPagina}
                onChange={(e) => setItemsPorPagina(Number(e.target.value))}
                className="border border-border rounded-lg px-2 py-1 text-sm bg-white focus:outline-none hover:border-primary/50 transition-colors cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {totalPaginas > 1 && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                className="px-3"
              >
                Anterior
              </Button>
              <div className="px-3 py-1 bg-muted rounded-md text-sm font-semibold text-foreground">
                Página {paginaActual} de {totalPaginas}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas}
                className="px-3"
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      )}
      {/* ── Modal: Crear ──────────────────────────────────────────────── */}
      <Modal isOpen={modalCrear} onClose={() => setModalCrear(false)} title="Nueva promoción" maxWidth="max-w-lg">
        <PromocionForm
          inicial={FORM_INICIAL}
          onGuardar={handleCrear}
          onCancelar={() => setModalCrear(false)}
          cargando={guardando}
        />
      </Modal>

      {/* ── Modal: Editar ─────────────────────────────────────────────── */}
      <Modal
        isOpen={!!modalEditar}
        onClose={() => setModalEditar(null)}
        title={`Editar: ${modalEditar?.titulo ?? ""}`}
        maxWidth="max-w-lg"
      >
        {modalEditar && (
          <PromocionForm
            inicial={{
              titulo: modalEditar.titulo,
              descripcion: modalEditar.descripcion ?? "",
              porcentajeDescuento: Number(modalEditar.porcentajedescuento),
              diaSemana: modalEditar.diasemana,
              horaInicio: modalEditar.horainicio,
              horaFin: modalEditar.horafin,
              estado: modalEditar.estado,
            }}
            onGuardar={handleEditar}
            onCancelar={() => setModalEditar(null)}
            cargando={guardando}
          />
        )}
      </Modal>
    </div>
  );
}

export default AdminPromocionesPage;
