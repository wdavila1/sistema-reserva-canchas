import { useState } from "react";
import { Plus, Edit2, Trash2, } from "lucide-react";


//MOCKS
import { USUARIOS } from "@/shared/mocks/usuarios";

//COMPONENTS
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

function AdminUsuarios() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Usuarios
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">{USUARIOS.length} usuarios registrados</p>
        </div>
        <Button variant="primary">
          <Plus size={16} /> Nuevo usuario
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Usuario", "Correo", "Teléfono", "Rol", "Registro", "Reservas", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {USUARIOS.map((u) => (
                <tr key={u.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {u.nombre.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                      </div>
                      <span className="font-medium text-foreground">{u.nombre}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-4 text-muted-foreground">{u.telefono}</td>
                  <td className="px-5 py-4">
                    <Badge className={u.rol === "admin" ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-secondary text-primary border-primary/20"}>
                      {u.rol === "admin" ? "Administrador" : "Cliente"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">{u.fechaRegistro}</td>
                  <td className="px-5 py-4 text-center font-semibold">{u.totalReservas}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsuarios;