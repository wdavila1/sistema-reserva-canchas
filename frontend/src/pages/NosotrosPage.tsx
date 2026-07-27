import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

//COMPONENTS
import { Button } from "@/shared/components/ui/Button";

function NosotrosPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="pt-12 pb-8 border-b border-border mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Conócenos</span>
          <h1 className="text-5xl font-black text-foreground mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Sobre Nosotros
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              La idea nació con una visión simple: hacer que reservar una cancha deportiva en Tegucigalpa sea tan fácil como pedir un taxi. Somos el complejo deportivo más moderno de la capital hondureña.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Inaugurado en 2024, nuestras instalaciones cuentan con 6 canchas de primer nivel: fútbol 5, baloncesto, voleibol, tenis y pádel. Todo bajo un mismo techo —o bajo el cielo abierto— en la Colonia Lomas del Guijarro.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Creemos que el deporte une comunidades. Por eso trabajamos para que desde el equipo de amigos que juega los viernes hasta la liga empresarial puedan reservar, jugar y disfrutar sin complicaciones.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden h-72 lg:h-auto bg-muted">
            <img
              src="https://images.unsplash.com/photo-1517747614396-d21a78b850e8?w=800&h=600&fit=crop&auto=format"
              alt="Complejo deportivo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
          {[
            ["6", "Canchas disponibles"],
            ["2024", "Año de fundación"],
            ["350+", "Reservas al mes"],
            ["500+", "Clientes activos"],
          ].map(([n, l]) => (
            <div key={l} className="text-center bg-muted rounded-2xl p-6">
              <p className="text-4xl font-black text-primary" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{n}</p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">{l}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="primary" size="lg" onClick={() => navigate("/canchas")}>
            Ver nuestras canchas <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NosotrosPage;
