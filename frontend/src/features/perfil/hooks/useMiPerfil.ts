import { useState, useEffect, useCallback } from "react";
import {
  getMiPerfil, updateMiPerfil, changePassword, uploadFotoPerfil, deleteFotoPerfil
} from "@/features/perfil/services/perfil.api";
import type { Perfil, UpdatePerfilPayload, ChangePasswordPayload } from "@/features/perfil/services/perfil.api";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useMiPerfil() {
  const { actualizarPerfil } = useAuth();

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Carga inicial ─────────────────────────────────────────────────────────
  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMiPerfil();
      setPerfil(data);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "No se pudo cargar el perfil.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // ── Editar datos personales ────────────────────────────────────────────────
  const [savingData, setSavingData] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const guardarDatos = async (payload: UpdatePerfilPayload) => {
    try {
      setSavingData(true);
      setSaveError(null);
      setSaveSuccess(false);
      const actualizado = await updateMiPerfil(payload);
      setPerfil(actualizado);
      // Sincronizar nombre en el contexto global (aparece en la navbar)
      actualizarPerfil({
        nombre: `${actualizado.PrimerNombre} ${actualizado.PrimerApellido}`,
        email: actualizado.Correo,
        fotoPerfilURL: actualizado.FotoPerfilURL,
        nombreUsuario: actualizado.NombreUsuario,
      });
      setSaveSuccess(true);
    } catch (err: any) {
      setSaveError(err?.response?.data?.error ?? "No se pudo guardar los cambios.");
    } finally {
      setSavingData(false);
    }
  };

  // ── Cambiar contraseña ────────────────────────────────────────────────────
  const [savingPass, setSavingPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState(false);

  const guardarContrasena = async (payload: ChangePasswordPayload) => {
    try {
      setSavingPass(true);
      setPassError(null);
      setPassSuccess(false);
      await changePassword(payload);
      setPassSuccess(true);
    } catch (err: any) {
      setPassError(err?.response?.data?.error ?? "No se pudo cambiar la contraseña.");
    } finally {
      setSavingPass(false);
    }
  };

  // ── Upload de foto ────────────────────────────────────────────────────────
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [fotoError, setFotoError] = useState<string | null>(null);
  const [deletingFoto, setDeletingFoto] = useState(false);

  const subirFoto = async (file: File) => {
    try {
      setUploadingFoto(true);
      setFotoError(null);
      const { fotoPerfilURL } = await uploadFotoPerfil(file);
      setPerfil((prev) => prev ? { ...prev, FotoPerfilURL: fotoPerfilURL } : prev);
      // Sincronizar foto en la navbar
      actualizarPerfil({ fotoPerfilURL });
    } catch (err: any) {
      setFotoError(err?.response?.data?.error ?? "No se pudo subir la foto.");
    } finally {
      setUploadingFoto(false);
    }
  };

  const eliminarFoto = async () => {
    try {
      setDeletingFoto(true);
      setFotoError(null);
      await deleteFotoPerfil();
      setPerfil((prev) => prev ? { ...prev, FotoPerfilURL: null } : prev);
      // Sincronizar foto nula en la navbar
      actualizarPerfil({ fotoPerfilURL: null });
    } catch (err: any) {
      setFotoError(err?.response?.data?.error ?? "No se pudo eliminar la foto.");
    } finally {
      setDeletingFoto(false);
    }
  };

  return {
    perfil, loading, error, refetch: cargar,
    // Datos personales
    guardarDatos, savingData, saveError, saveSuccess, setSaveSuccess,
    // Contraseña
    guardarContrasena, savingPass, passError, passSuccess, setPassSuccess,
    // Foto
    subirFoto, uploadingFoto, fotoError, eliminarFoto, deletingFoto,
  };
}
