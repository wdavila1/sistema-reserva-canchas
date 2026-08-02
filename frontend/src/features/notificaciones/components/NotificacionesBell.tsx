import { useState, useRef, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { useNotificaciones } from "../hooks/useNotificaciones";

function tiempoRelativo(fecha: string): string {
  const diff = Date.now() - new Date(fecha).getTime();
  const minutos = Math.floor(diff / 60_000);
  if (minutos < 1) return "ahora";
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `hace ${dias} d`;
}

function NotificationBell() {
  const { notificaciones, noLeidas, isLoading, marcarLeida } = useNotificaciones();
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra el dropdown al hacer click afuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    if (abierto) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [abierto]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setAbierto((a) => !a)}
        className="relative p-2 rounded-lg hover:bg-secondary text-foreground transition-colors"
        aria-label="Notificaciones"
      >
        <Bell size={18} />
        {noLeidas > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-border shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-bold text-sm">Notificaciones</h3>
            {noLeidas > 0 && (
              <span className="text-xs text-muted-foreground">{noLeidas} sin leer</span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Cargando...</div>
            ) : notificaciones.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No tenés notificaciones.
              </div>
            ) : (
              notificaciones.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer ${
                    !n.leido ? "bg-blue-50/50" : ""
                  }`}
                  onClick={() => !n.leido && marcarLeida(n.id)}
                >
                  <div className="flex items-start gap-2">
                    {!n.leido && <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{n.mensaje}</p>
                      <p className="text-xs text-muted-foreground mt-1">{tiempoRelativo(n.fechaCreacion)}</p>
                    </div>
                    {n.leido && <Check size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;