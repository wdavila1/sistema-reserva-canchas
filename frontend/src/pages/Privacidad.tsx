import { Shield, Lock, Eye, Mail, FileText, UserCheck, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Privacidad() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pt-24 pb-stack-lg relative overflow-hidden">

            <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-6xl mx-auto px-margin-mobile lg:px-margin-desktop">

                <div className="relative mb-stack-lg flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                    <div className="relative">
                        <div className="absolute -top-4 left-0 font-headline-xl text-8xl lg:text-[11rem] font-black text-secondary/5 select-none tracking-tighter">
                            PRIV
                        </div>

                        <h1 className="relative font-headline-xl text-6xl lg:text-8xl font-extrabold uppercase tracking-tight leading-none text-primary pt-4">
                            Política de <br />
                            <span className="text-secondary">Privacidad</span>
                        </h1>

                    </div>

                    <div className="flex items-center gap-3 bg-primary/5 px-6 py-4 rounded-sm border-l-4 border-secondary relative">
                        <Shield className="w-6 h-6 text-secondary" />
                        <p className="font-label-sm text-sm text-foreground max-w-[200px] lg:max-w-[250px]">
                            Tus datos están seguros. <span className="text-secondary font-bold">Solo los usamos para mejorar tu experiencia.</span>
                        </p>
                    </div>
                </div>

                <section className="mb-stack-lg p-8 bg-card border border-border/30 shadow-sm relative group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/5 rounded-sm">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="font-headline-lg text-2xl font-bold uppercase text-primary">Introducción</h2>
                    </div>
                    <p className="font-body-md text-muted-foreground leading-relaxed max-w-3xl">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil eveniet labore, delectus odit quibusdam amet incidunt libero veniam aliquid eaque sapiente vitae, laudantium perferendis maiores fuga, corporis dolores fugit quod.
                    </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-stack-lg">

                    <div className="bg-card p-8 border border-border/30 shadow-sm relative flex flex-col h-full group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute top-0 right-0 w-2 h-full bg-secondary group-hover:h-1/2 transition-all duration-300" />
                        <div className="flex items-center gap-3 mb-4">
                            <Eye className="w-5 h-5 text-secondary" />
                            <h3 className="font-headline-md text-xl font-bold uppercase text-primary">Información recopilada</h3>
                        </div>
                        <ul className="font-body-md text-muted-foreground space-y-3 text-sm list-disc pl-5 marker:text-secondary flex-1">

                        </ul>
                    </div>

                    <div className="bg-card p-8 border border-border/30 shadow-sm relative flex flex-col h-full group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute top-0 right-0 w-2 h-full bg-primary group-hover:h-1/2 transition-all duration-300" />
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-5 h-5 text-primary" />
                            <h3 className="font-headline-md text-xl font-bold uppercase text-primary">Uso de tus datos</h3>
                        </div>
                        <ul className="font-body-md text-muted-foreground space-y-3 text-sm list-disc pl-5 marker:text-primary flex-1">

                        </ul>
                    </div>
                </div>

                {/* Veremos si dejamos esta parte */}
                <section className="mb-stack-lg relative p-8 lg:p-12 bg-primary text-white rounded-sm shadow-lg overflow-hidden">
                    {/* Fondo decorativo */}
                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-secondary/10 rounded-full blur-2xl" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-white/10 pr-0 lg:pr-8 pb-6 lg:pb-0">
                            <h2 className="font-headline-lg text-3xl font-bold uppercase text-white flex items-center gap-2">
                                <UserCheck className="w-6 h-6 text-secondary" />
                                Tus derechos
                            </h2>
                            <p className="font-body-md text-white/70 text-sm mt-2">
                                Tienes el control total sobre tu información personal.
                            </p>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: CheckCircle, title: "Acceso", desc: "Puedes solicitar una copia de los datos que tenemos sobre ti." },
                                { icon: CheckCircle, title: "Rectificación", desc: "Puedes corregir cualquier información inexacta o incompleta." },
                                { icon: CheckCircle, title: "Cancelación", desc: "Puedes solicitar que eliminemos tus datos personales." },
                                { icon: CheckCircle, title: "Oposición", desc: "Puedes oponerte al procesamiento de tus datos en ciertos casos." },
                            ].map((item) => (
                                <div key={item.title} className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <item.icon className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <h4 className="font-headline-md text-base font-bold text-white uppercase">{item.title}</h4>
                                        <p className="font-body-md text-white/70 text-xs">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Aqui ponemos lo de que hacemos con los datos y como los aseguramos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-stack-lg">
                    <div className="bg-card p-8 border-l-4 border-secondary shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-5 h-5 text-secondary" />
                            <h3 className="font-headline-md text-xl font-bold uppercase text-primary">Seguridad de datos</h3>
                        </div>
                        <p className="font-body-md text-muted-foreground text-sm leading-relaxed">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi inventore illo quae adipisci, fugiat asperiores esse mollitia, voluptatibus repellendus consequuntur doloribus maiores recusandae architecto doloremque non nam labore, nostrum tenetur?
                        </p>
                    </div>
                </div>

                <div className="text-center relative py-10">
                    <div className="absolute inset-0 bg-secondary/5 -skew-y-2 rounded-sm" />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <p className="font-body-md text-muted-foreground text-sm max-w-md">
                            Reserva tu cancha favorita con la tranquilidad de saber que tus datos están protegidos.
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-primary text-primary-foreground font-headline-md font-bold uppercase px-8 py-4 border-b-4 border-secondary shadow-lg hover:brightness-110 hover:-translate-y-1 active:scale-95 transition-all inline-flex items-center gap-2"
                        >
                            Volver al inicio <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Privacidad;