import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check, CheckCircle, AlertCircle } from "lucide-react";

//MOCKS
import { CANCHAS } from "../mocks/courts";
import { HORARIOS } from "../mocks/horarios";

//UTILS
import { formatCurrency } from "../utils/formatCurrency";
import { isWeekend, addHr } from "../utils/horariosUtils";

//COMPONENTS
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

function ReservasPage() {
  const { courtId } = useParams<{ courtId: string }>();
  const navigate = useNavigate();

  // TODO: cuando conectemos el backend, reemplazar por services/canchas.api.ts -> getCanchaById(courtId)
  const court = CANCHAS.find((c) => c.id === Number(courtId));

  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [nombre, setNombre] = useState("Carlos Mejía");
  const [email, setEmail] = useState("cmejia@gmail.com");
  const [telefono, setTelefono] = useState("+504 9876-5432");
  const [error, setError] = useState("");
  const [reservaId] = useState(`RES-2026-${String(Math.floor(Math.random() * 900) + 100)}`);

  if (!court) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 text-muted-foreground">
        Cancha no encontrada.
      </div>
    );
  }

  const finde = date ? isWeekend(date) : false;
  const pph = finde ? court.precioFinde : court.precio;
  const subtotal = pph * duration;
  const isv = subtotal * 0.15;
  const total = subtotal + isv;
  const endTime = startTime ? addHr(startTime, duration) : "";

  const validate = () => {
    if (!date) return "Selecciona una fecha.";
    const sel = new Date(date + "T12:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (sel < today) return "La fecha no puede ser en el pasado.";
    if (!startTime) return "Selecciona una hora de inicio.";
    const endHour = parseInt(startTime.split(":")[0]) + duration;
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
    return hh + duration <= 22;
  });

  return (
    <div className="min-h-screen bg-muted/30 pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Steps */}
        <div className="flex items-center gap-0 mb-10 mt-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > s ? "bg-primary text-white" : step === s ? "bg-primary text-white ring-4 ring-primary/20" : "bg-muted border-2 border-border text-muted-foreground"
              }`}>
                {step > s ? <Check size={14} /> : s}
              </div>
              <span className={`text-xs font-medium ${step === s ? "text-primary" : "text-muted-foreground"}`}>
                {["Fecha y hora", "Resumen", "Confirmación"][s - 1]}
              </span>
              {s < 3 && <div className={`absolute w-1/3 h-px translate-x-16 translate-y-4 ${step > s ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Court info strip */}
          <div className="bg-primary px-6 py-4 flex items-center gap-4">
            <img src={court.imagen} alt={court.nombre} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
            <div>
              <p className="text-white font-bold leading-tight">{court.nombre}</p>
              <p className="text-white/70 text-sm">{court.deporte} · {court.superficie}</p>
            </div>
          </div>

          <div className="p-6">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Elige fecha y hora</h2>
                <Input
                  label="Fecha de reserva"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <Select
                  label="Hora de inicio"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  <option value="">Seleccionar hora</option>
                  {availableHours.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </Select>
                <Select
                  label="Duración"
                  value={String(duration)}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  {[1, 2, 3, 4].map((h) => (
                    <option key={h} value={h}>{h} hora{h > 1 ? "s" : ""}</option>
                  ))}
                </Select>
                {date && startTime && (
                  <div className="bg-secondary rounded-xl p-4 text-sm">
                    <p className="text-muted-foreground">Resumen rápido</p>
                    <p className="font-semibold text-foreground mt-1">
                      {date} · {startTime} – {endTime} · {duration}h
                    </p>
                    <p className="text-primary font-bold mt-1">
                      {formatCurrency(pph)}/hr × {duration}h = {formatCurrency(subtotal)} + ISV = <strong>{formatCurrency(total)}</strong>
                    </p>
                    {finde && <p className="text-amber-600 text-xs mt-1">⚡ Tarifa de fin de semana aplicada</p>}
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <AlertCircle size={15} /> {error}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button variant="ghost" onClick={() => navigate(`/canchas/${court.id}`)} className="flex-1">
                    <ChevronLeft size={16} /> Volver
                  </Button>
                  <Button variant="accent" onClick={handleNext} className="flex-1">
                    Continuar <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Confirma tu reserva</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  <Input label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Input label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="sm:col-span-2" />
                </div>

                {/* Summary */}
                <div className="bg-muted rounded-2xl p-5 space-y-3">
                  <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Detalle de la reserva</h3>
                  {[
                    ["Cancha", court.nombre],
                    ["Fecha", date],
                    ["Horario", `${startTime} – ${endTime} (${duration}h)`],
                    ["Tipo de tarifa", finde ? "Fin de semana" : "Entre semana"],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({formatCurrency(pph)} × {duration}h)</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ISV (15%)</span>
                      <span>{formatCurrency(isv)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                      <span>Total a pagar</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
                    <ChevronLeft size={16} /> Atrás
                  </Button>
                  <Button variant="accent" onClick={handleNext} className="flex-1">
                    Confirmar reserva <Check size={16} />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="text-center py-6 space-y-5">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle size={40} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    ¡RESERVA CONFIRMADA!
                  </h2>
                  <p className="text-muted-foreground mt-1">Tu cancha ha sido reservada exitosamente.</p>
                </div>
                <div className="bg-muted rounded-2xl p-5 text-left space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">No. de reserva</span>
                    <span className="font-bold font-mono text-primary">{reservaId}</span>
                  </div>
                  {[
                    ["Cancha", court.nombre],
                    ["Fecha", date],
                    ["Horario", `${startTime} – ${endTime}`],
                    ["Total pagado", formatCurrency(total)],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Recibirás un correo de confirmación a <strong>{email}</strong>
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => navigate("/mis-reservas")} className="flex-1">
                    Ver mis reservas
                  </Button>
                  <Button variant="primary" onClick={() => navigate("/")} className="flex-1">
                    Ir al inicio
                  </Button>
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
