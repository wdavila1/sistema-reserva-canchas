import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { footerLinks } from "@/shared/config/navigation";

function Footer() {
  return (
    <footer className="bg-primary border-t-4 border-border pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-headline-lg text-[40px] leading-none text-white uppercase tracking-tighter">
              PROYECTO <span className="text-secondary">EXPERTOS</span>
            </span>
          </div>
          <p className="font-body-md text-white/80 max-w-sm mt-4">
            El complejo deportivo más moderno de Tegucigalpa. Instalaciones de primer nivel para atletas de alto rendimiento.
          </p>
        </div>

        <div>
          <h4 className="font-label-sm text-label-sm text-secondary uppercase mb-6">Navegación</h4>
          <ul className="grid grid-cols-2 gap-4">
            {footerLinks.map((l) => (
              <li key={l.path}>
                <Link to={l.path} className="font-body-md text-white/80 hover:text-secondary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-label-sm text-label-sm text-secondary uppercase mb-6">Contacto</h4>
          <ul className="space-y-4 font-body-md text-white/80">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-secondary shrink-0 mt-1" />
              <span>Av. Juan Lindo, Edificio Stadium, Tegucigalpa.</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="text-secondary shrink-0" />
              <span>+504 2234-5678</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-secondary shrink-0" />
              <span>contacto@proyectoexpertos.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <span className="font-body-md text-sm text-white/50">
          © 2026 PROYECTO EXPERTOS. Todos los derechos reservados.
        </span>
        <span className="font-label-sm text-xs text-white/50 uppercase">
          Tegucigalpa, Honduras
        </span>
      </div>
    </footer>
  );
}

export default Footer;