import { AlertTriangle, HelpCircle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  isLoading?: boolean;
}

/** Reemplaza window.confirm() con un diálogo que respeta el estilo de la app.
 * Reutilizable en cualquier módulo (canchas, reservas, usuarios...). */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  const isDanger = variant === "danger";

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${
            isDanger ? "bg-red-50 text-destructive" : "bg-secondary text-primary"
          }`}
        >
          {isDanger ? <AlertTriangle size={26} /> : <HelpCircle size={26} />}
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          {isDanger ? (
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 uppercase px-6 py-2 text-headline-md font-headline-md
                         bg-destructive text-destructive-foreground border-4 border-destructive
                         shadow-[8px_8px_0px_0px_#7a1010] transition-all duration-150 cursor-pointer
                         hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#7a1010]
                         active:translate-x-2 active:translate-y-2 active:shadow-none
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Procesando..." : confirmLabel}
            </button>
          ) : (
            <Button variant="primary" className="flex-1" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? "Procesando..." : confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}