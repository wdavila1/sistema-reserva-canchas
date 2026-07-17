import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

function Home() {
    const navigate = useNavigate();

    return (
        <main className="mt-20">
            {/* HERO SECTION (Editorial Split) */}
            <section className="min-h-[80vh] flex flex-col md:flex-row border-b-4 border-border bg-background overflow-hidden">
                
                {/* Izquierda */}
                <div className="w-full md:w-[60%] px-6 sm:px-margin-mobile py-12 md:px-margin-desktop md:py-24 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 chalk-texture opacity-5 pointer-events-none"></div>
                    <h1 className="font-headline-xl text-[60px] sm:text-[60px] md:text-[100px] lg:text-[130px] leading-[0.85] uppercase italic font-extrabold tracking-tighter text-primary relative z-10">
                        RESERVA TU<br />
                        <span className="text-secondary inline-block scale-y-110 origin-left pr-4">CANCHA</span><br />
                        HOY
                    </h1>
                    <div className="mt-stack-lg flex flex-col xl:flex-row items-start xl:items-center gap-gutter z-10">
                        <button 
                            onClick={() => navigate('/canchas')}
                            className="bg-secondary text-secondary-foreground font-headline-lg text-2xl sm:text-3xl md:text-5xl px-8 py-5 md:px-16 md:py-8 border-4 border-primary shadow-[8px_8px_0px_0px_#0b1f3a] md:shadow-[12px_12px_0px_0px_#0b1f3a] hover:translate-x-3 hover:translate-y-3 hover:shadow-none transition-all cursor-pointer"
                        >
                            RESERVAR AHORA
                        </button>
                        <div className="px-4 py-3 border-2 border-primary bg-card/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#0b1f3a] transform -rotate-1 mt-4 xl:mt-0">
                            <span className="font-label-sm tracking-widest text-primary flex items-center gap-2 uppercase">
                                <MapPin size={18} />
                                TEGUCIGALPA, HN
                            </span>
                        </div>
                        
                    </div>
                    <div className="field-line bottom-[10%] opacity-10 bg-primary absolute w-full h-2"></div>
                </div>

                {/*Imagen*/}
                <div className="w-full md:w-[40%] min-h-[400px] md:min-h-full border-t-4 md:border-t-0 md:border-l-4 border-border overflow-hidden">
                    <img 
                        alt="Cancha de fútbol profesional de noche con iluminación" 
                        className="w-full h-full object-cover grayscale-[40%] contrast-125 hover:grayscale-0 transition-all duration-700" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6kdE-7Od6AKFCOCHkR9EeQasMpyGG30T0-uDoKEZ5grN8gJHFG8tU2g1hDUFn0qr-GabYgFNgMhtGSQqxmIvfy4MOEJhlsD1pbphn9MvqK2Ai_iIkM0nKUsjb2zPMaslgZNJrqhHcMBJoPxY-SiQBpml0dH0rB34Lrswk26uPnKHA_EncoSBXAeAK6UI_eXollCoLgQgGTctln0jGJ6Y9IhkqBkwpkAAYc1u8LCE4y15fooqA_TCiUrTUgSzOt4ncsmmqgSrqcGHu" 
                    />
                </div>
            </section>
            {/* ¿POR QUÉ ELEGIRNOS? (Scoreboard Asymmetric) */}

            <section className="bg-primary text-primary-foreground py-stack-lg px-margin-mobile md:px-margin-desktop relative overflow-hidden">
                <div className="turf-overlay absolute inset-0 pointer-events-none"></div>
                
                <div className="max-w-[1200px] mx-auto relative z-10">
                    
                    {/* TÍTULO*/}
                    <h2 className="font-headline-xl text-4xl md:text-6xl lg:text-7xl text-primary-foreground mb-stack-lg border-b-2 border-primary-foreground/20 pb-4 italic uppercase">
                        ¿POR QUÉ ELEGIRNOS?
                    </h2>
                    
                    {/* GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        
                        {/* Feature 1*/}
                          <div className="lg:col-span-8 bg-primary border-4 border-secondary p-8 md:p-12 shadow-[8px_8px_0px_0px_#ff6b2b] md:shadow-[12px_12px_0px_0px_#ff6b2b] relative group overflow-hidden mr-2 md:mr-3 mb-2 md:mb-3">
                            <div className="absolute -right-4 -top-4 md:-top-8 font-data-display text-[120px] md:text-[180px] text-primary-foreground/5 select-none transition-transform group-hover:scale-110">
                                01
                            </div>
                            <span className="font-data-display text-xl md:text-2xl text-secondary mb-4 block relative z-10">
                                DISPONIBILIDAD TOTAL
                            </span>
                            <h3 className="font-headline-lg text-3xl md:text-5xl lg:text-6xl text-primary-foreground mb-6 italic uppercase relative z-10 leading-tight">
                                Iluminación Nivel Profesional
                            </h3>
                            <p className="font-body-lg text-base md:text-lg text-primary-foreground/90 max-w-xl relative z-10">
                                Nuestras canchas cuentan con tecnología LED de última generación que garantiza visibilidad perfecta de 07:00 a 22:00. Sin sombras, sin excusas.
                            </p>
                            <div className="mt-8 font-data-display text-lg md:text-xl bg-secondary text-secondary-foreground inline-block px-8 py-4 relative z-10">
                                L 350.00 / HR
                            </div>
                        </div>

                        {/* Features 2 y 3 */}
                        <div className="lg:col-span-4 flex flex-col gap-8 lg:gap-12">
                            
                            {/* Feature 2: Cuadrado Blanco */}
                            <div className="flex-1 bg-card text-card-foreground p-8 md:p-10 border-4 border-border shadow-[8px_8px_0px_0px_#ff6b2b] flex flex-col justify-center mr-2 mb-2">
                                <span className="font-data-display text-3xl text-secondary mb-3 block">02</span>
                                <h3 className="font-headline-md text-2xl uppercase mb-3">Reserva en Línea</h3>
                                <p className="font-body-md text-base text-muted-foreground">
                                    Paga y reserva en menos de 60 segundos desde tu móvil.
                                </p>
                            </div>
                            
                            {/* Feature 3: Cuadrado Anaranjado */}
                            {/* Eliminado el 'transform md:translate-x-4' que te rompía la vista responsiva */}
                            <div className="flex-1 bg-secondary text-secondary-foreground p-8 md:p-10 border-4 border-card shadow-[8px_8px_0px_0px_#1a1c1e] flex flex-col justify-center mr-2 mb-2">
                                <span className="font-data-display text-3xl text-primary-foreground mb-3 block">03</span>
                                <h3 className="font-headline-md text-2xl uppercase mb-3">Confirmación SMS</h3>
                                <p className="font-body-md text-base text-secondary-foreground/90">
                                    Recibe tu código de acceso y confirmación al instante por WhatsApp/SMS.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* COURTS SECTION */}
            <section className="bg-background py-stack-lg relative overflow-hidden">
                
                {/* Encabezado */}
                <div className="px-margin-mobile md:px-margin-desktop mb-stack-lg">
                    <div className="flex items-end justify-between border-b-8 border-primary pb-4">
                        <h2 className="font-headline-xl text-4xl md:text-6xl lg:text-7xl leading-none italic uppercase text-primary">
                            NUESTRAS CANCHAS
                        </h2>
                        <span className="font-label-sm text-sm uppercase hidden md:block text-muted-foreground tracking-widest">
                            Selecciona tu disciplina para ver horarios
                        </span>
                    </div>
                </div>
                
                {/* Lista de Canchas */}
                <div className="flex flex-col gap-0 border-y-4 border-primary">
                    
                    {/* Row 1: Fútbol */}
                    <div onClick={() => navigate('/canchas?deporte=futbol')} className="grid grid-cols-1 md:grid-cols-2 hover:bg-primary group transition-colors duration-300 cursor-pointer border-b-2 border-border">
                        <div className="p-6 md:p-8 flex items-center gap-4 md:gap-8">
                            <span className="font-data-display text-3xl md:text-5xl text-primary group-hover:text-secondary transition-colors">01</span>
                            <h3 className="font-headline-xl text-4xl md:text-[60px] lg:text-[80px] text-foreground group-hover:text-primary-foreground italic uppercase transition-colors">FÚTBOL</h3>
                        </div>
                        <div className="px-6 pb-6 md:p-8 md:pb-8 flex items-center md:justify-end gap-4">
                            <span className="bg-secondary text-secondary-foreground px-4 py-2 font-label-sm tracking-widest">GRAMA SINTÉTICA FIFA</span>
                            <span className="font-data-display text-2xl md:text-3xl text-primary group-hover:text-primary-foreground transition-colors ml-auto md:ml-0">L 450.00</span>
                        </div>
                    </div>

                    {/* Row 2: Baloncesto */}
                    <div onClick={() => navigate('/canchas?deporte=baloncesto')} className="grid grid-cols-1 md:grid-cols-2 hover:bg-primary group transition-colors duration-300 cursor-pointer border-b-2 border-border">
                        <div className="p-6 md:p-8 flex items-center gap-4 md:gap-8">
                            <span className="font-data-display text-3xl md:text-5xl text-primary group-hover:text-secondary transition-colors">02</span>
                            <h3 className="font-headline-xl text-4xl md:text-[60px] lg:text-[80px] text-foreground group-hover:text-primary-foreground italic uppercase transition-colors">BALONCESTO</h3>
                        </div>
                        <div className="px-6 pb-6 md:p-8 md:pb-8 flex items-center md:justify-end gap-4">
                            {/* Cambié este badge a color 'card' (blanco) para que no se pierda cuando el usuario pase el mouse y el fondo se vuelva azul */}
                            <span className="bg-card text-card-foreground border-2 border-primary group-hover:border-transparent px-4 py-2 font-label-sm tracking-widest">TABLONCILLO PROFESIONAL</span>
                            <span className="font-data-display text-2xl md:text-3xl text-primary group-hover:text-primary-foreground transition-colors ml-auto md:ml-0">L 350.00</span>
                        </div>
                    </div>

                    {/* Row 3: Tenis / Pádel */}
                    <div onClick={() => navigate('/canchas?deporte=tenis,padel')} className="grid grid-cols-1 md:grid-cols-2 hover:bg-primary group transition-colors duration-300 cursor-pointer border-b-2 border-border">
                        <div className="p-6 md:p-8 flex items-center gap-4 md:gap-8">
                            <span className="font-data-display text-3xl md:text-5xl text-primary group-hover:text-secondary transition-colors">03</span>
                            <h3 className="font-headline-xl text-4xl md:text-[60px] lg:text-[80px] text-foreground group-hover:text-primary-foreground italic uppercase transition-colors">TENIS / PÁDEL</h3>
                        </div>
                        <div className="px-6 pb-6 md:p-8 md:pb-8 flex items-center md:justify-end gap-4">
                            <span className="bg-secondary text-secondary-foreground px-4 py-2 font-label-sm tracking-widest">HARD COURT</span>
                            <span className="font-data-display text-2xl md:text-3xl text-primary group-hover:text-primary-foreground transition-colors ml-auto md:ml-0">L 500.00</span>
                        </div>
                    </div>

                </div>
            </section>
            <section>
                {/* Scoreboard Ticker */}
                <div className="bg-primary text-on-primary py-8 overflow-hidden relative border-t-4 border-secondary">
                    <div className="horizontal-ticker flex animate-marquee whitespace-nowrap">
                        {/*  supuesta animación, en realidad es una repetición */}
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center gap-12 px-12">
                                <span className="font-headline-lg text-headline-lg text-secondary italic">6 CANCHAS DISPONIBLES</span>
                                <span className="w-4 h-4 bg-white rounded-full"></span>
                                <span className="font-headline-lg text-headline-lg text-popover italic">350+ RESERVAS ESTE MES</span>
                                <span className="w-4 h-4 bg-white rounded-full"></span>
                                <span className="font-headline-lg text-headline-lg text-secondary italic">HORARIO: 07:00 - 22:00</span>
                                <span className="w-4 h-4 bg-white rounded-full"></span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;