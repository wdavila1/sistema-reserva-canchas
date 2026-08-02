import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check, AlertCircle, Tag } from "lucide-react";

//API
import { getCanchaById, getDisponibilidad } from "@/features/canchas/services/canchas.api";
import type { Cancha } from "@/features/canchas/services/canchas.api";
import { crearReserva } from "@/features/reservas/services/reservas.api";
import type { Reserva } from "@/features/reservas/services/reservas.api";
import { getPromocionesActivas } from "@/features/promociones/services/promociones.api";
import type { Promocion } from "@/features/promociones/services/promociones.api";

//HOOKS
import { useAuth } from "../../auth/hooks/useAuth";

//CONSTANTS
import { HORARIOS } from "../../canchas/constants/horarios";

//UTILS
import { formatCurrency } from "@/shared/utils/formatCurrency";

//COMPONENTS
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";

// Candidatos válidos para "hora fin": de 08:00 a 22:00 (cierre).
const HORAS_FIN_POSIBLES = [...HORARIOS.slice(1), "22:00"];

/** Marcas de hora ("HH:00") contenidas entre inicio (incluido) y fin (excluido). */
function horasContenidas(inicio: string, fin: string): string[] {
  const horas: string[] = [];
  const hIni = parseInt(inicio.split(":")[0], 10);
  const hFin = parseInt(fin.split(":")[0], 10);
  for (let h = hIni; h < hFin; h++) {
    horas.push(`${String(h).padStart(2, "0")}:00`);
  }
  return horas;
}

function hoyISO() {
  const td = new Date();
  const yyyy = td.getFullYear();
  const mm = String(td.getMonth() + 1).padStart(2, "0");
  const dd = String(td.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

//funcion para determinar las horas de reservas, si la fecha es de hoy, paraa evitar reservas en horas que ya pasaron y muestre horas disponibles 1 hora adelante de la actual
function horaMinimaReservable(fecha: string): number {
  if (fecha !== hoyISO()) return 0;
  const ahora = new Date();
  return ahora.getHours() + 1;
}

function ReservasPage() {
  const { courtId } = useParams<{ courtId: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // ---- Datos de la cancha (API real) ----
  const [court, setCourt] = useState<Cancha | null>(null);
  const [loadingCourt, setLoadingCourt] = useState(true);
  const [courtError, setCourtError] = useState("");

  useEffect(() => {
    if (!courtId) return;
    setLoadingCourt(true);
    getCanchaById(courtId)
      .then(setCourt)
      .catch(() => setCourtError("No se pudo cargar la información de la cancha."))
      .finally(() => setLoadingCourt(false));
  }, [courtId]);

  // ---- Promociones activas ----
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  useEffect(() => {
    getPromocionesActivas().then(setPromociones).catch(() => {});
  }, []);

  // Estados para controlar los pasos de la reserva
  const [step, setStep] = useState(1); //proceso actual de la reserva
  const [date, setDate] = useState(hoyISO()); // fecha seleccionada para la reserva
  const [startTime, setStartTime] = useState(""); //hora de inicio
  const [endTime, setEndTime] = useState(""); //hora final
  const [nombre, setNombre] = useState(usuario?.nombre ?? ""); //nombre del ususario
  const [email, setEmail] = useState(usuario?.email ?? ""); /*correo del usuario */
  const [telefono, setTelefono] = useState(usuario?.telefono ?? "");
  const [error, setError] = useState("");

  //  Disponibilidad real de la cancha para la fecha elegida 
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false);

  useEffect(() => {
    if (!courtId || !date) return;
    setLoadingDisponibilidad(true);
    setStartTime("");
    setEndTime("");
    getDisponibilidad(courtId, date)
      .then((res) => setHorasDisponibles(res.horasDisponibles))
      .catch(() => setHorasDisponibles([]))
      .finally(() => setLoadingDisponibilidad(false));
  }, [courtId, date]);

  //  Envío de la reserva al backend 
  const [submitting, setSubmitting] = useState(false);
  const [reservaCreada, setReservaCreada] = useState<Reserva | null>(null);

  if (loadingCourt) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-background text-muted-foreground">
        Cargando cancha...
      </div>
    );
  }

  if (courtError || !court) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-background">
        <div className="border-4 border-primary bg-card p-8 shadow-[8px_8px_0px_0px_#0b1f3a]">
            <p className="font-headline-xl text-3xl uppercase italic text-primary">
              {courtError || "Cancha no encontrada."}
            </p>
        </div>
      </div>
    );
  }

  // tarifa base
  const pph = Number(court.PrecioPorHora);
  const startHour = startTime ? parseInt(startTime.split(":")[0]) : 0;
  const endHour = endTime ? parseInt(endTime.split(":")[0]) : 0;
  const duration = (endTime && startTime && endHour > startHour) ? endHour - startHour : 0;
  
  const subtotalBruto = pph * duration;

  // Lógica de promociones
  let promocionAplicada: Promocion | null = null;
  let montoDescuento = 0;

  if (date && startTime && duration > 0) {
    const sel = new Date(date + "T12:00:00");
    const dow = sel.getDay(); // 0 = Domingo, 6 = Sábado
    
    for (let h = startHour; h < endHour; h++) {
      const horaActualStr = `${String(h).padStart(2, '0')}:00`;

      const aplicables = promociones.filter((p) => {
        // Match día
        if (p.diasemana !== null && p.diasemana !== undefined && p.diasemana !== dow) return false;
        // Match hora
        if (p.horainicio && horaActualStr < p.horainicio.slice(0, 5)) return false;
        if (p.horafin && horaActualStr >= p.horafin.slice(0, 5)) return false;
        return true;
      });

      if (aplicables.length > 0) {
        // Tomar la del mayor descuento para esta hora
        const mejorPromo = aplicables.reduce((prev, current) => 
          (Number(prev.porcentajedescuento) > Number(current.porcentajedescuento)) ? prev : current
        );
        montoDescuento += pph * (Number(mejorPromo.porcentajedescuento) / 100);
        promocionAplicada = mejorPromo; // Guardamos la última aplicada para mostrar el badge
      }
    }
  }

  const subtotal = subtotalBruto - montoDescuento;
  const isv = subtotal * 0.15;
  const total = subtotal + isv;

  const validate = () => {
    if (!date) return "Selecciona una fecha.";
    const sel = new Date(date + "T12:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (sel < today) return "La fecha no puede ser en el pasado.";
    if (!startTime) return "Selecciona una hora de inicio.";
    if (!endTime) return "Selecciona una hora de fin.";
    if (duration <= 0) return "La hora fin debe ser mayor que la hora de inicio.";
    return "";
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validate();
      if (err) { setError(err); return; }
      setError("");
    }
    setStep(step + 1);
  };

  const handleConfirmar = async () => {
    if (!court) return;
    setSubmitting(true);
    setError("");
    try {
      const reserva = await crearReserva([
        { canchaId: court.CanchaID, fecha: date, horaInicio: startTime, horaFin: endTime },
      ]);
      setReservaCreada(reserva);
      setStep(3);
    } catch (err: any) {
      const mensaje = err?.response?.data?.error ?? "No se pudo crear la reserva. Intenta de nuevo.";
      setError(mensaje);
    } finally {
      setSubmitting(false);
    }
  };

  const today = hoyISO();

  // Horas de inicio: la intersección entre el horario de operación fijo, lo
  // que el backend dice que está libre para esa cancha/fecha, y (si la fecha elegida es hoy) que no sea una hora que ya pasó.
  const horaMinima = horaMinimaReservable(date);
  const availableHours = HORARIOS.filter(
    (h) => horasDisponibles.includes(h) && parseInt(h.split(":")[0], 10) >= horaMinima
  );

  // Horas de fin válidas: TODAS las marcas de hora entre inicio y fin
  // deben estar libres (no solo la última), para no dejar reservar sobre un hueco ya ocupado en medio del rango.
  const availableEndHours = startTime
    ? HORAS_FIN_POSIBLES.filter((h) => {
        const sH = parseInt(startTime.split(":")[0]);
        const eH = parseInt(h.split(":")[0]);
        if (eH <= sH) return false;
        return horasContenidas(startTime, h).every((hh) => horasDisponibles.includes(hh));
      })
    : [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 overflow-x-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* PROGRESS STEPS */}
        <div className="flex items-center justify-between mb-12 mt-6 relative z-0">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-border -z-10 -translate-y-1/2"></div>
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-3 bg-background px-2">
              <div className={`w-12 h-12 border-4 flex items-center justify-center font-headline-md text-xl transition-all duration-300 ${
                step > s 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : step === s 
                        ? "bg-secondary border-primary text-secondary-foreground shadow-[4px_4px_0px_0px_#0b1f3a] -translate-y-1" 
                        : "bg-card border-border text-muted-foreground"
              }`}>
                {step > s ? <Check size={24} strokeWidth={3} /> : s}
              </div>
              <span className={`text-sm font-headline-md uppercase tracking-widest ${step === s ? "text-primary" : "text-muted-foreground"}`}>
                {["Fecha y hora", "Resumen", "Confirmar"][s - 1]}
              </span>
            </div>
          ))}
        </div>

        {/* MAIN CARD */}
        <div className="bg-card border-4 border-primary shadow-[12px_12px_0px_0px_#0b1f3a]">
          
          {/* Court Info Header */}
          <div className="bg-primary px-6 py-5 flex items-center gap-5 border-b-4 border-primary">
            <img src={court.ImagenURL ?? undefined} alt={court.NombreCancha} className="w-20 h-20 object-cover border-2 border-primary-foreground flex-shrink-0" />
            <div>
              <p className="text-primary-foreground font-headline-xl text-3xl md:text-4xl italic uppercase leading-none mb-1">
                  {court.NombreCancha}
              </p>
              <p className="text-secondary font-label-sm tracking-widest uppercase text-xs md:text-sm">
                  {court.NombreTipo ?? "Cancha"} // {formatCurrency(pph)}/hr
              </p>
            </div>
          </div>

          <div className="p-6 md:p-10">
            
            {/* STEP 1: FECHA Y HORA */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-headline-xl text-4xl italic uppercase text-foreground border-b-4 border-border pb-2">
                    Elige fecha y hora
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                    label="Fecha de reserva"
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                        label="Hora inicio"
                        value={startTime}
                        onChange={(e) => {setStartTime(e.target.value); setEndTime("");}}
                        disabled={loadingDisponibilidad}
                        >
                        <option value="">--:--</option>
                        {availableHours.map((h) => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                        </Select>
                        <Select
                        label="Hora fin"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        disabled={!startTime}
                        >
                        <option value="">--:--</option>
                        {availableEndHours.map((h) => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                        </Select>
                    </div>
                </div>

                {loadingDisponibilidad && (
                  <p className="text-sm text-muted-foreground">Consultando horarios disponibles...</p>
                )}
                {!loadingDisponibilidad && date && availableHours.length === 0 && (
                  <p className="text-sm text-destructive font-bold">No hay horarios disponibles para esta cancha en la fecha elegida.</p>
                )}

                {/* Resumen en vivo */}
                {date && startTime && endTime && (
                  <div className="bg-secondary border-4 border-primary p-6 shadow-[6px_6px_0px_0px_#0b1f3a] text-secondary-foreground transform rotate-1 mt-8">
                    <p className="font-headline-md uppercase text-lg mb-2">Resumen Rápido</p>
                    <p className="font-data-display text-xl mb-4">
                      {date} // {startTime} – {endTime} // {duration} HR{duration > 1 ? 'S' : ''}
                    </p>
                    <div className="bg-background/20 p-4 border-2 border-primary-foreground/30">
                        {promocionAplicada && (
                          <div className="mb-2 p-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-md">
                            <p className="text-sm font-bold uppercase flex items-center gap-2">
                              <Tag size={16} /> ¡{promocionAplicada.porcentajedescuento}% DE DESCUENTO APLICADO!
                            </p>
                            <p className="text-xs opacity-80">{promocionAplicada.titulo}</p>
                          </div>
                        )}
                        <p className="font-headline-md text-xl uppercase tracking-wider flex justify-between items-center">
                        <span>Total estimado:</span>
                        <span className="font-data-display text-2xl">{formatCurrency(total)}</span>
                        </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-3 bg-destructive text-destructive-foreground border-4 border-primary p-4 shadow-[6px_6px_0px_0px_#0b1f3a] font-headline-md uppercase text-lg mt-4">
                    <AlertCircle size={24} /> {error}
                  </div>
                )}
                
                {/* Botones */}
                <div className="flex gap-4 pt-6">
                  <button onClick={() => navigate(`/canchas/${court.CanchaID}`)} className="flex-1 bg-card border-4 border-border text-foreground font-headline-md uppercase text-lg md:text-xl py-3 flex items-center justify-center gap-2 hover:bg-muted hover:border-primary transition-colors cursor-pointer">
                    <ChevronLeft size={20} /> Volver
                  </button>
                  <button onClick={handleNext} className="flex-1 bg-primary border-4 border-primary text-primary-foreground font-headline-md uppercase text-lg md:text-xl py-3 flex items-center justify-center gap-2 shadow-[6px_6px_0px_0px_#ff6b2b] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all cursor-pointer">
                    Continuar <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CONFIRMACIÓN DE DATOS */}
            {step === 2 && (
              <div className="space-y-8">
                <h2 className="font-headline-xl text-4xl italic uppercase text-foreground border-b-4 border-border pb-2">
                    Tus Datos
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  <Input label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <div className="sm:col-span-2">
                    <Input label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                  </div>
                </div>

                {/* Ticket de Resumen */}
                <div className="bg-card border-4 border-border p-6 md:p-8 shadow-[8px_8px_0px_0px_#e9ebef] space-y-4 relative">
                  <div className="absolute -left-4 top-1/2 w-8 h-8 bg-background border-r-4 border-border rounded-full -translate-y-1/2"></div>
                  <div className="absolute -right-4 top-1/2 w-8 h-8 bg-background border-l-4 border-border rounded-full -translate-y-1/2"></div>
                  
                  <h3 className="font-headline-md text-primary text-2xl uppercase tracking-widest border-b-4 border-border pb-3 mb-4">Detalle Final</h3>
                  
                  {[
                    ["Cancha", court.NombreCancha],
                    ["Fecha", date],
                    ["Horario", `${startTime} – ${endTime} (${duration}h)`],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex flex-col sm:flex-row sm:justify-between sm:items-end text-sm border-b-2 border-dashed border-muted pb-2">
                      <span className="font-headline-md uppercase text-muted-foreground">{k}</span>
                      <span className="font-data-display text-lg text-foreground text-right">{v}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between font-data-display text-sm text-muted-foreground">
                      <span>SUBTOTAL BRUTO ({formatCurrency(pph)} × {duration}h)</span>
                      <span>{formatCurrency(subtotalBruto)}</span>
                    </div>
                    {promocionAplicada && (
                      <div className="flex justify-between font-data-display text-sm text-green-600 font-bold">
                        <span>DESCUENTO ({promocionAplicada.porcentajedescuento}% - {promocionAplicada.titulo})</span>
                        <span>-{formatCurrency(montoDescuento)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-data-display text-sm text-muted-foreground">
                      <span>SUBTOTAL</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-data-display text-sm text-muted-foreground">
                      <span>ISV (15%)</span>
                      <span>{formatCurrency(isv)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end font-bold text-base border-t-4 border-border pt-4 mt-2">
                      <span className="font-headline-md text-xl uppercase">Total a pagar</span>
                      <span className="font-data-display text-4xl text-secondary">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 bg-destructive text-destructive-foreground border-4 border-primary p-4 shadow-[6px_6px_0px_0px_#0b1f3a] font-headline-md uppercase text-lg">
                    <AlertCircle size={24} /> {error}
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(1)} disabled={submitting} className="flex-1 bg-card border-4 border-border text-foreground font-headline-md uppercase text-lg md:text-xl py-3 flex items-center justify-center gap-2 hover:bg-muted hover:border-primary transition-colors cursor-pointer disabled:opacity-50">
                    <ChevronLeft size={20} /> Atrás
                  </button>
                  <button onClick={handleConfirmar} disabled={submitting} className="flex-1 bg-primary border-4 border-primary text-primary-foreground font-headline-md uppercase text-lg md:text-xl py-3 flex items-center justify-center gap-2 shadow-[6px_6px_0px_0px_#ff6b2b] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all cursor-pointer disabled:opacity-50">
                    {submitting ? "Reservando..." : "Confirmar"} <Check size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ÉXITO */}
            {step === 3 && reservaCreada && (
              <div className="text-center py-8 space-y-8">
                
                {/* Icono de éxito agresivo */}
                <div className="w-24 h-24 bg-secondary border-4 border-primary flex items-center justify-center mx-auto shadow-[8px_8px_0px_0px_#0b1f3a] transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <Check size={56} className="text-secondary-foreground" strokeWidth={4} />
                </div>
                
                <div>
                  <h2 className="font-headline-xl text-5xl md:text-7xl italic uppercase text-primary leading-none">
                    ¡RESERVA CONFIRMADA!
                  </h2>
                  <p className="font-body-lg text-muted-foreground mt-4 uppercase tracking-widest text-sm font-bold">
                      Tu cancha ha sido separada exitosamente.
                  </p>
                </div>
                
                <div className="bg-card border-4 border-dashed border-border p-6 text-left space-y-4 max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b-4 border-primary pb-4 mb-4">
                    <span className="font-headline-md uppercase text-muted-foreground">CÓDIGO DE RESERVA</span>
                    <span className="font-data-display text-2xl text-secondary">#{reservaCreada.reservaId}</span>
                  </div>
                  {[
                    ["Cancha", court.NombreCancha],
                    ["Fecha", date],
                    ["Horario", `${startTime} – ${endTime}`],
                    ["Total", formatCurrency(reservaCreada.total)],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between items-end">
                      <span className="font-headline-md uppercase text-muted-foreground text-sm">{k}</span>
                      <span className="font-data-display text-lg">{v}</span>
                    </div>
                  ))}
                </div>
                
                <p className="font-body-md text-sm text-muted-foreground bg-muted p-4 border-l-4 border-primary inline-block">
                  Recibirás instrucciones de acceso al correo <strong>{email}</strong>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button onClick={() => navigate("/mis-reservas")} className="flex-1 bg-card border-4 border-primary text-primary font-headline-md uppercase text-lg py-4 shadow-[4px_4px_0px_0px_#0b1f3a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all cursor-pointer">
                    VER MIS RESERVAS
                  </button>
                  <button onClick={() => navigate("/")} className="flex-1 bg-secondary border-4 border-primary text-secondary-foreground font-headline-md uppercase text-lg py-4 shadow-[4px_4px_0px_0px_#0b1f3a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all cursor-pointer">
                    IR AL INICIO
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservasPage;