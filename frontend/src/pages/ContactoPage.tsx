import { useState } from "react";
import { Clock, MapPin, Phone, Mail, CheckCircle } from "lucide-react";

//COMPONENTS
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";


function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-muted/30 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Contáctanos</span>
          <h1 className="text-5xl font-black text-foreground mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Estamos aquí para ayudarte
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {[
              { icon: <MapPin size={20} className="text-primary" />, title: "Dirección", body: "Col. Lomas del Guijarro, Tegucigalpa, Francisco Morazán, Honduras" },
              { icon: <Phone size={20} className="text-primary" />, title: "Teléfono", body: "+504 2221-3344\n+504 9876-0001" },
              { icon: <Mail size={20} className="text-primary" />, title: "Correo electrónico", body: "info@correoinventado.hn\nreservas@correoinventado.hn" },
              { icon: <Clock size={20} className="text-primary" />, title: "Horario de atención", body: "Lunes a Domingo\n7:00 AM – 10:00 PM" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-white rounded-2xl border border-border p-5">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-muted-foreground text-sm mt-0.5 whitespace-pre-line">{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-border p-8">
            {sent ? (
              <div className="text-center py-10">
                <CheckCircle size={48} className="text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold">¡Mensaje enviado!</h3>
                <p className="text-muted-foreground mt-2 text-sm">Nos pondremos en contacto contigo pronto.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-foreground mb-1">Envíanos un mensaje</h3>
                <Input label="Nombre" placeholder="Tu nombre" value={form.nombre} onChange={set("nombre")} />
                <Input label="Correo electrónico" type="email" placeholder="tu@correo.com" value={form.email} onChange={set("email")} />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground">Mensaje</label>
                  <textarea
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                    rows={5}
                    placeholder="¿En qué podemos ayudarte?"
                    value={form.mensaje}
                    onChange={set("mensaje")}
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Enviar mensaje
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactoPage;