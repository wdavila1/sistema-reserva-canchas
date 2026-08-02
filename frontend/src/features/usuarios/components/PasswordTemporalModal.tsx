import { useState } from "react";
import { Copy, Check, KeyRound } from "lucide-react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";

interface PasswordTemporalModalProps {
  isOpen: boolean;
  onClose: () => void;
  passwordTemporal: string;
  nombre?: string;
}

/** Modal que muestra una contraseña temporal recién generada (al crear un
 * usuario o al resetear la de uno existente) con botón de copiar. Se usa en
 * ambos flujos para que se vea idéntico sin importar de dónde vino. */
export function PasswordTemporalModal({ isOpen, onClose, passwordTemporal, nombre }: PasswordTemporalModalProps) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    await navigator.clipboard.writeText(passwordTemporal);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-primary">
          <KeyRound size={26} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">
            {nombre ? `Contraseña temporal para ${nombre}` : "Contraseña temporal generada"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Cópiala ahora y pásasela a la persona — no se podrá volver a ver.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 bg-muted rounded-xl px-4 py-3 w-full">
          <code className="font-mono text-lg font-bold text-primary">{passwordTemporal}</code>
          <button
            type="button"
            onClick={copiar}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
            title="Copiar"
          >
            {copiado ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          </button>
        </div>
        {copiado && <span className="text-xs text-green-600 font-medium -mt-2">¡Copiado!</span>}

        <Button variant="primary" className="w-full" onClick={onClose}>
          Listo
        </Button>
      </div>
    </Modal>
  );
}