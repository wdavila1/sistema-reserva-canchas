import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCancha, getCanchaById, updateCancha } from "../services/canchas.api";

export function useCanchaForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombreCancha: "",
    tipoCanchaId: 1, 
    capacidad: 10,
    precioPorHora: 500,
    descripcion: "",
    imagenUrl: "",
    estado: "Disponible"
  });

  // Si estamos en modo edición, descargar los datos de la cancha al cargar la página
  useEffect(() => {
    if (isEditMode) {
      const fetchCancha = async () => {
        try {
          setIsLoading(true);
          const cancha = await getCanchaById(id);
          setFormData({
            nombreCancha: cancha.NombreCancha,
            tipoCanchaId: cancha.TipoCanchaID,
            capacidad: cancha.Capacidad,
            precioPorHora: cancha.PrecioPorHora,
            descripcion: cancha.Descripcion || "",
            imagenUrl: cancha.ImagenURL || "",
            estado: cancha.Estado
          });
        } catch (err) {
          console.error(err);
          setError("Error al cargar los datos de la cancha para editar.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCancha();
    }
  }, [id, isEditMode]);

  // Función que se ejecuta cada vez que el usuario teclea algo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === "tipoCanchaId" || name === "capacidad" || name === "precioPorHora") 
              ? Number(value) 
              : value
    }));
  };

  // Función que se ejecuta al apretar "Guardar"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateCancha(id, formData);
      } else {
        await createCancha(formData);
      }
      navigate("/admin");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.mensaje || "Hubo un error al guardar la cancha");
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, isLoading, error, navigate, isEditMode };
}