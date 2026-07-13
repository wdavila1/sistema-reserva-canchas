import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-foreground text-white/80 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">CP</span>
            <span className="text-white font-bold text-xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Nombre<span className="text-accent">Inventado</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            El complejo deportivo más moderno de Tegucigalpa. Canchas de primera calidad, reserva online en minutos.
          </p>
          <div className="flex gap-3 mt-5">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Icon size={16} className="text-white" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navegación</h4>
          <ul className="space-y-2 text-sm">
            {[
              ["Inicio", "/"],
              ["Canchas", "/canchas"],
              ["Nosotros", "/nosotros"],
              ["Contacto", "/contacto"],
            ].map(([label, path]) => (
              <li key={path}>
                <Link to={path} className="hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contacto</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="text-primary mt-0.5 shrink-0" />
              Col. Lomas del Guijarro, Tegucigalpa, Honduras
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-primary shrink-0" />
              +504 2221-3344
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-primary shrink-0" />
              info@correoinventado.hn
            </li>
            <li className="flex items-start gap-2">
              <Clock size={15} className="text-primary mt-0.5 shrink-0" />
              Lun–Dom 7:00 AM – 10:00 PM
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40">
        <span>© 2026 Nombre Inventado HN. Todos los derechos reservados.</span>
        <span>RTN: 08011993000000 · Tegucigalpa, Honduras</span>
      </div>
    </footer>
  );
}

export default Footer;
