import { useNavigate } from "react-router-dom";
import type { Court } from "../types/sports/Court";
import { CalendarDays, MapPin, ChevronRight, Shield, Zap, ArrowRight } from "lucide-react";
import { CANCHAS } from "../mocks/courts";
import { Button } from "../components/ui/Button"
import { CourtCard } from "../components/ui/CourtCard";

function HomePage() {
  const navigate = useNavigate();
  const goToCourt = (c: Court) => navigate(`/canchas/${c.id}`);

  const features = [
    {
      icon: <CalendarDays size={28} className="text-primary" />,
      title: "Consulta disponibilidad",
      desc: "Revisa en tiempo real qué canchas están libres en la fecha y hora que necesitas.",
    },
    {
      icon: <Zap size={28} className="text-primary" />,
      title: "Reserva en línea",
      desc: "Elige, reserva y paga desde tu teléfono o computadora en menos de 3 minutos.",
    },
    {
      icon: <Shield size={28} className="text-primary" />,
      title: "Confirmación inmediata",
      desc: "Recibe tu comprobante al instante. Sin llamadas, sin esperas, sin complicaciones.",
    },
  ];

  const featured = CANCHAS.filter((c) => c.destacada).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=1800&h=1000&fit=crop&auto=format"
          alt="Cancha de fútbol"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#072914]/90 via-[#0d7a3e]/70 to-[#072914]/80" />
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white/90 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            <MapPin size={12} /> Tegucigalpa, Honduras
          </span>
          <h1
            className="text-white text-5xl sm:text-7xl md:text-8xl font-black leading-none mb-6 tracking-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            RESERVA TU<br />
            <span className="text-accent">CANCHA</span> HOY
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-xl mx-auto mb-10 font-light">
            El complejo deportivo más moderno de Tegucigalpa. Fútbol, baloncesto, voleibol, tenis y pádel — todo en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" onClick={() => navigate("/canchas")}>
              Reservar ahora <ArrowRight size={18} />
            </Button>
            <button
              onClick={() => navigate("/canchas")}
              className="px-8 py-3.5 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-colors text-base"
            >
              Ver canchas
            </button>
          </div>
        </div>
        {/* Quick stats */}
        <div className="absolute bottom-0 inset-x-0">
          <div className="max-w-3xl mx-auto px-6 pb-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl grid grid-cols-3 divide-x divide-white/20 text-center">
              {[["6", "Canchas disponibles"], ["350+", "Reservas por mes"], ["7:00 – 22:00", "Horario diario"]].map(([num, label]) => (
                <div key={label} className="py-4 px-3">
                  <p className="text-2xl font-black text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{num}</p>
                  <p className="text-white/70 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">¿Por qué elegirnos?</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              La forma más fácil de reservar
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-muted border border-border hover:border-primary/20 transition-colors group">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Court preview */}
      <section className="py-20 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Nuestras instalaciones</span>
              <h2 className="text-3xl sm:text-4xl font-black mt-1 text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Canchas destacadas
              </h2>
            </div>
            <Button variant="outline" onClick={() => navigate("/canchas")}>
              Ver todas las canchas <ChevronRight size={16} />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((c) => (
              <CourtCard key={c.id} court={c} onClick={() => goToCourt(c)} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            ¿LISTO PARA JUGAR?
          </h2>
          <p className="text-white/80 text-lg mb-8">Reserva tu cancha favorita en minutos. Sin filas, sin llamadas.</p>
          <Button variant="accent" size="lg" onClick={() => navigate("/canchas")}>
            Reservar ahora <ArrowRight size={18} />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
