import { TrendingUp, TrendingDown, Flame, Lightbulb, Trophy, Zap, CheckCircle2, AlertTriangle } from "lucide-react";
import { usePatronesAltaDemanda, useSugerenciasPromociones } from "@/features/experto/hooks/useExperto";
import { crearPromocion } from "@/features/promociones/services/promociones.api";
import { useState } from "react";

// Mapa día semana (0=Dom … 6=Sáb)
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function SistemExpertoPage() {
  const { patrones, total: totalPico, loading: loadingPico } = usePatronesAltaDemanda();
  const { sugerencias, total: totalSugs, loading: loadingSugs, refetch } = useSugerenciasPromociones();
  const [creando, setCreando] = useState<number | null>(null);
  const [exito, setExito] = useState<number | null>(null);

  const handleCrearPromocion = async (idx: number, sug: typeof sugerencias[0]) => {
    setCreando(idx);
    try {
      await crearPromocion({
        titulo: sug.promocionSugerida.titulo,
        descripcion: `Promoción automática generada por el sistema experto para los ${DIAS[sug.diaSemana]} a las ${sug.horaInicio}.`,
        porcentajeDescuento: sug.descuentoSugerido,
        diaSemana: sug.diaSemana,
        horaInicio: sug.horaInicio,
      });
      setExito(idx);
      setTimeout(() => { setExito(null); refetch(); }, 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setCreando(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-4 border-primary pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-secondary flex items-center justify-center border-2 border-primary shadow-[3px_3px_0px_0px_#0b1f3a]">
            <Zap size={20} className="text-white" />
          </div>
          <h1 className="font-headline-lg text-[32px] text-primary uppercase italic leading-none">
            Sistema Experto
          </h1>
        </div>
        <p className="text-muted-foreground text-sm ml-13 pl-1">
          Análisis inteligente basado en historial de reservas · últimos 60 días
        </p>
      </div>

      {/* ── Sección 1: Horarios Pico ─────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Flame size={20} className="text-red-500" />
          <h2 className="font-bold text-xl text-foreground uppercase tracking-wide">
            Horarios de Alta Demanda
          </h2>
          {!loadingPico && (
            <span className="ml-2 px-3 py-0.5 bg-red-100 text-red-700 text-xs font-bold border border-red-300 rounded-full">
              {totalPico} {totalPico === 1 ? "horario pico" : "horarios pico"}
            </span>
          )}
        </div>

        {loadingPico ? (
          <div className="h-32 bg-muted animate-pulse rounded-lg border border-border" />
        ) : patrones.length === 0 ? (
          <div className="flex items-center gap-3 p-5 bg-green-50 border-2 border-green-200 rounded-xl">
            <TrendingUp size={20} className="text-green-600" />
            <p className="text-green-700 font-medium text-sm">
              No se detectaron horarios de alta demanda en los últimos 60 días. ¡Todo bajo control!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {patrones.map((p, i) => (
              <div
                key={i}
                className={`relative p-5 border-2 rounded-xl shadow-sm overflow-hidden ${
                  p.nivel === "critico"
                    ? "bg-red-50 border-red-400"
                    : "bg-orange-50 border-orange-300"
                }`}
              >
                {/* Icono de nivel */}
                <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full border ${
                  p.nivel === "critico"
                    ? "bg-red-100 text-red-700 border-red-300"
                    : "bg-orange-100 text-orange-700 border-orange-300"
                }`}>
                  {p.nivel === "critico" ? "🔥 Crítico" : "⚠️ Alto"}
                </div>
                <p className="font-bold text-lg text-foreground">
                  {p.nombreDia}
                </p>
                <p className="text-2xl font-black text-primary mt-0.5">
                  {p.horaInicio}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className={`flex-1 h-2 rounded-full bg-gray-200 overflow-hidden`}>
                    <div
                      className={`h-full rounded-full transition-all ${
                        p.nivel === "critico" ? "bg-red-500" : "bg-orange-400"
                      }`}
                      style={{ width: `${Math.min(p.porcentajeOcupacion, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">
                    {p.porcentajeOcupacion}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {p.totalReservas} reservas sobre {p.totalCanchas} canchas
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Sección 2: Sugerencias de Promoción ──────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb size={20} className="text-yellow-500" />
          <h2 className="font-bold text-xl text-foreground uppercase tracking-wide">
            Sugerencias de Promociones
          </h2>
          {!loadingSugs && (
            <span className="ml-2 px-3 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-300 rounded-full">
              {totalSugs} {totalSugs === 1 ? "sugerencia" : "sugerencias"}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Horarios con ocupación ≤ 30% en los últimos 60 días. El sistema recomienda crear una promoción para reactivarlos.
        </p>

        {loadingSugs ? (
          <div className="h-40 bg-muted animate-pulse rounded-lg border border-border" />
        ) : sugerencias.length === 0 ? (
          <div className="flex items-center gap-3 p-5 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <Trophy size={20} className="text-blue-600" />
            <p className="text-blue-700 font-medium text-sm">
              No hay horarios de baja ocupación detectados. ¡Todos los turnos tienen buena demanda!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sugerencias.map((s, idx) => (
              <div
                key={idx}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-2 rounded-xl transition-all ${
                  s.yaTienePromocion
                    ? "bg-green-50 border-green-300 opacity-70"
                    : "bg-white border-yellow-300 hover:border-yellow-400 hover:shadow-md"
                }`}
              >
                {/* Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center rounded-lg flex-shrink-0">
                    <TrendingDown size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {s.nombreDia} · {s.horaInicio}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">{s.mensaje}</p>
                    {s.yaTienePromocion && (
                      <span className="inline-flex items-center gap-1 mt-1 text-xs text-green-700 font-semibold">
                        <CheckCircle2 size={13} /> Ya tiene promoción activa
                      </span>
                    )}
                  </div>
                </div>

                {/* Descuento sugerido + Botón */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-center px-4 py-2 bg-primary text-white border-2 border-primary shadow-[3px_3px_0px_0px_#0b1f3a]">
                    <p className="text-2xl font-black leading-none">{s.descuentoSugerido}%</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/70">sugerido</p>
                  </div>

                  {!s.yaTienePromocion && (
                    <button
                      onClick={() => handleCrearPromocion(idx, s)}
                      disabled={creando === idx || exito === idx}
                      className={`px-4 py-3 text-sm font-bold border-2 uppercase tracking-wide transition-all active:scale-95 whitespace-nowrap ${
                        exito === idx
                          ? "bg-green-500 border-green-500 text-white shadow-none"
                          : "bg-secondary border-secondary text-white hover:bg-secondary/90 shadow-[3px_3px_0px_0px_#0b1f3a] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                      }`}
                    >
                      {creando === idx
                        ? "Creando..."
                        : exito === idx
                        ? "✓ ¡Creada!"
                        : "Crear Promoción"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Nota informativa ──────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 bg-muted/40 border border-border rounded-lg">
        <AlertTriangle size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>¿Cómo funciona?</strong> El sistema analiza el historial de reservas de los últimos 60 días.
          Un horario es "pico" si su tasa de ocupación supera el 70%. Si cae por debajo del 30%, el sistema sugiere
          crear una promoción. Al hacer clic en "Crear Promoción", se crea automáticamente y el descuento se aplica
          a las siguientes reservas en ese horario.
        </p>
      </div>
    </div>
  );
}

export default SistemExpertoPage;
