import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createUsuario, getUsuarioById, updateUsuario, getRoles } from "../services/usuarios.api";
import type { Rol } from "../services/usuarios.api";

export function useUsuarioForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [passwordTemporal, setPasswordTemporal] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    numeroIdentidad: "",
    rtn: "",
    correo: "",
    telefono: "",
    direccion: "",
    nombreUsuario: "",
    rolId: 0,
  });

  // Catálogo de roles para el <select> — al terminar de cargar, si estamos
  // creando (no editando), le ponemos "Cliente" como valor por defecto.
  useEffect(() => {
    getRoles()
      .then((data) => {
        setRoles(data);
        if (!isEditMode) {
          const cliente = data.find((r) => r.NombreRol === "Cliente");
          setFormData((prev) => ({ ...prev, rolId: cliente?.RolID ?? data[0]?.RolID ?? 0 }));
        }
      })
      .catch(() => setRoles([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si estamos en modo edición, descargar los datos del usuario al cargar la página
  useEffect(() => {
    if (isEditMode) {
      const fetchUsuario = async () => {
        try {
          setIsLoading(true);
          const usuario = await getUsuarioById(id);
          setFormData({
            primerNombre: usuario.PrimerNombre,
            segundoNombre: usuario.SegundoNombre || "",
            primerApellido: usuario.PrimerApellido,
            segundoApellido: usuario.SegundoApellido || "",
            numeroIdentidad: usuario.NumeroIdentidad || "",
            rtn: usuario.RTN || "",
            correo: usuario.Correo,
            telefono: usuario.Telefono,
            direccion: usuario.Direccion || "",
            nombreUsuario: usuario.NombreUsuario,
            rolId: usuario.RolID,
          });
        } catch (err) {
          console.error(err);
          setError("Error al cargar los datos del usuario para editar.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchUsuario();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rolId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateUsuario(id, formData);
        navigate("/admin/usuarios");
      } else {
        const { passwordTemporal } = await createUsuario(formData);
        // No navegamos todavía: primero se muestra la contraseña temporal en pantalla.
        setPasswordTemporal(passwordTemporal);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Hubo un error al guardar el usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData, handleChange, handleSubmit, isLoading, error,
    navigate, isEditMode, roles, passwordTemporal,
  };
}