import { Plus, Edit2, Trash2, KeyRound, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// HOOKS
import { useUsuarios } from "@/features/usuarios/hooks/useUsuarios";
import { useAuth } from "@/features/auth/hooks/useAuth";

// API
import { updateUsuarioEstado, deleteUsuario, resetPasswordUsuario } from "@/features/usuarios/services/usuarios.api";

// COMPONENTS
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

function AdminUsuarios() {
  const navigate = useNavigate();
  const { usuario: usuarioActual } = useAuth();
  const {
    usuarios, loading, error, pagination,
    rolId, setRolId, busqueda, setBusqueda,
    nextPage, prevPage, refetch,
  } = useUsuarios(1, 10);

  const toggleEstado = async (id: number, estadoActual: boolean) => {
    try {
      await updateUsuarioEstado(id, !estadoActual);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || "Hubo un error al actualizar el estado del usuario.");
    }
  };

  const handleResetPassword = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Generar una contraseña temporal nueva para "${nombre}"?`)) return;
    try {
      const { passwordTemporal } = await resetPasswordUsuario(id);
      alert(`Contraseña temporal generada para ${nombre}:\n\n${passwordTemporal}\n\nCópiala ahora — no se volverá a mostrar.`);
    } catch (err: any) {
      alert(err.response?.data?.error || "Error al comunicarse con el servidor.");
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente a "${nombre}"?`)) {
      try {
        await deleteUsuario(id);
        refetch();
      } catch (err: any) {
        alert(err.response?.data?.error || "Error al comunicarse con el servidor.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Usuarios
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {loading ? "Cargando..." : `${pagination.totalItems} usuarios registrados`}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate("/admin/usuarios/nueva")}>
          <Plus size={16} /> Nuevo usuario
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-border p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Buscar por nombre, correo o usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>
        <select
          value={rolId ?? ""}
          onChange={(e) => setRolId(e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2.5 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        >
          <option value="">Todos los roles</option>
          <option value={1}>Administrador</option>
          <option value={2}>Cliente</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">
          Hubo un error al cargar los usuarios.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Usuario", "Correo", "Teléfono", "Rol", "Registro", "Reservas", "Estado", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">Sincronizando con PostgreSQL...</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No hay usuarios registrados.</td></tr>
              ) : (
                usuarios.map((u) => {
                  const esUnoMismo = usuarioActual?.id === u.UsuarioID;
                  const nombreCompleto = `${u.PrimerNombre} ${u.PrimerApellido}`;
                  return (
                    <tr key={u.UsuarioID} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                            {nombreCompleto.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <span className="font-medium text-foreground block">{nombreCompleto}</span>
                            <span className="text-xs text-muted-foreground">@{u.NombreUsuario}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{u.Correo}</td>
                      <td className="px-5 py-4 text-muted-foreground">{u.Telefono}</td>
                      <td className="px-5 py-4">
                        <Badge className={u.NombreRol === "Administrador" ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-secondary text-primary border-primary/20"}>
                          {u.NombreRol}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs">
                        {new Date(u.FechaCreacion).toLocaleDateString("es-HN")}
                      </td>
                      <td className="px-5 py-4 text-center font-semibold">{u.TotalReservas ?? 0}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleEstado(u.UsuarioID, u.EstadoUsuario)}
                          disabled={esUnoMismo && u.EstadoUsuario}
                          title={esUnoMismo ? "No puedes desactivar tu propia cuenta" : ""}
                          className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            u.EstadoUsuario ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {u.EstadoUsuario ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/admin/usuarios/editar/${u.UsuarioID}`)}
                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors" title="Editar">
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleResetPassword(u.UsuarioID, nombreCompleto)}
                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors" title="Resetear contraseña">
                            <KeyRound size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(u.UsuarioID, nombreCompleto)}
                            disabled={esUnoMismo}
                            title={esUnoMismo ? "No puedes eliminar tu propia cuenta" : "Eliminar"}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={!pagination.hasPreviousPage} onClick={prevPage}>
                Anterior
              </Button>
              <Button size="sm" variant="outline" disabled={!pagination.hasNextPage} onClick={nextPage}>
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsuarios;