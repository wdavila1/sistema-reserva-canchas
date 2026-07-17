import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check, AlertCircle } from "lucide-react";

//MOCKS
import { CANCHAS } from "../mocks/courts";
import { HORARIOS } from "../mocks/horarios";

//UTILS
import { formatCurrency } from "../utils/formatCurrency";
import { isWeekend, addHr } from "../utils/horariosUtils";

//COMPONENTS
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

function ReservasPage() {
  const { courtId } = useParams<{ courtId: string }>();
  const navigate = useNavigate();

  // TODO: cuando conectemos el backend, reemplazar por services/canchas.api.ts -> getCanchaById(courtId)
  const court = CANCHAS.find((c) => c.id === Number(courtId));

  const [step, setStep] = useState(1);
  const [date, setDate] = useState(() =>
    {
      const td = new Date();
      const yyyy = td.getFullYear();
      const mm = String(td.getMonth() + 1).padStart(2, "0");
      const dd = String(td.getDate()).padStart(2, "0");

      return `${yyyy}-${mm}-${dd}`;
    }
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [nombre, setNombre] = useState("Carlos Mejía");
  const [email, setEmail] = useState("cmejia@gmail.com");
  const [telefono, setTelefono] = useState("+504 9876-5432");
  const [error, setError] = useState("");
  const [reservaId] = useState(`RES-2026-${String(Math.floor(Math.random() * 900) + 100)}`);

  if (!court) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-background">
        <div className="border-4 border-primary bg-card p-8 shadow-[8px_8px_0px_0px_#0b1f3a]">
            <p className="font-headline-xl text-3xl uppercase italic text-primary">Cancha no encontrada.</p>
        </div>
      </div>
    );
  }

  const finde = date ? isWeekend(date) : false;
  const pph = finde ? court.precioFinde : court.precio;
  const startHour = startTime ? parseInt(startTime.split(":")[0]) : 0;
  const endHour = endTime ? parseInt(endTime.split(":")[0]) : 0;
  const duration = (endTime && startTime && endHour > startHour) ? endHour - startHour : 0;
  const subtotal = pph * duration;
  const isv = subtotal * 0.15;
  const total = subtotal + isv;

  const validate = () => {
    if (!date) return "Selecciona una fecha.";
    const sel = new Date(date + "T12:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (sel < today) return "La fecha no puede ser en el pasado.";
    if (!startTime) return "Selecciona una hora de inicio.";
    if(!endTime) return "Selecciona una hora de fin.";
    if (duration <= 0) return "La hora fin debe ser mayor que la hora de inicio.";
    if (endHour > 22) return "El horario excede las 22:00. Reduce la duración o elige una hora más temprana.";
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

  const today = new Date().toISOString().split("T")[0];
  const availableHours = HORARIOS.filter((h) => {
    const hh = parseInt(h.split(":")[0]);
    return hh <= 21;
  });

  const availableEndHours = HORARIOS.filter((h) => {
    if (!startTime) return false;
    const sH = parseInt(startTime.split(":")[0]);
    const eH = parseInt(h.split(":")[0]);
    return eH > sH && eH <= 22 ;
  });

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
            <img src={court.imagen} alt={court.nombre} className="w-20 h-20 object-cover border-2 border-primary-foreground flex-shrink-0" />
            <div>
              <p className="text-primary-foreground font-headline-xl text-3xl md:text-4xl italic uppercase leading-none mb-1">
                  {court.nombre}
              </p>
              <p className="text-secondary font-label-sm tracking-widest uppercase text-xs md:text-sm">
                  {court.deporte} // {court.superficie}
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
                        disabled = {!startTime}
                        >
                        <option value="">--:--</option>
                        {availableEndHours.map((h) => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                        </Select>
                    </div>
                </div>

                {/* Resumen en vivo */}
                {date && startTime && (
                  <div className="bg-secondary border-4 border-primary p-6 shadow-[6px_6px_0px_0px_#0b1f3a] text-secondary-foreground transform rotate-1 mt-8">
                    <p className="font-headline-md uppercase text-lg mb-2">Resumen Rápido</p>
                    <p className="font-data-display text-xl mb-4">
                      {date} // {startTime} – {endTime} // {duration} HR{duration > 1 ? 'S' : ''}
                    </p>
                    <div className="bg-background/20 p-4 border-2 border-primary-foreground/30">
                        <p className="font-headline-md text-xl uppercase tracking-wider flex justify-between items-center">
                        <span>Total estimado:</span>
                        <span className="font-data-display text-2xl">{formatCurrency(total)}</span>
                        </p>
                        {finde && <p className="text-primary-foreground font-body-sm mt-2 font-bold uppercase text-xs">⚡ Tarifa de fin de semana aplicada</p>}
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
                  <button onClick={() => navigate(`/canchas/${court.id}`)} className="flex-1 bg-card border-4 border-border text-foreground font-headline-md uppercase text-lg md:text-xl py-3 flex items-center justify-center gap-2 hover:bg-muted hover:border-primary transition-colors cursor-pointer">
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
                    ["Cancha", court.nombre],
                    ["Fecha", date],
                    ["Horario", `${startTime} – ${endTime} (${duration}h)`],
                    ["Tarifa", finde ? "FIN DE SEMANA" : "REGULAR"],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex flex-col sm:flex-row sm:justify-between sm:items-end text-sm border-b-2 border-dashed border-muted pb-2">
                      <span className="font-headline-md uppercase text-muted-foreground">{k}</span>
                      <span className="font-data-display text-lg text-foreground text-right">{v}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between font-data-display text-sm text-muted-foreground">
                      <span>SUBTOTAL ({formatCurrency(pph)} × {duration}h)</span>
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

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(1)} className="flex-1 bg-card border-4 border-border text-foreground font-headline-md uppercase text-lg md:text-xl py-3 flex items-center justify-center gap-2 hover:bg-muted hover:border-primary transition-colors cursor-pointer">
                    <ChevronLeft size={20} /> Atrás
                  </button>
                  <button onClick={handleNext} className="flex-1 bg-primary border-4 border-primary text-primary-foreground font-headline-md uppercase text-lg md:text-xl py-3 flex items-center justify-center gap-2 shadow-[6px_6px_0px_0px_#ff6b2b] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all cursor-pointer">
                    Confirmar <Check size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ÉXITO */}
            {step === 3 && (
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
                    <span className="font-data-display text-2xl text-secondary">{reservaId}</span>
                  </div>
                  {[
                    ["Cancha", court.nombre],
                    ["Fecha", date],
                    ["Horario", `${startTime} – ${endTime}`],
                    ["Total", formatCurrency(total)],
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