import { createContext, useState, useMemo, useEffect, type ReactNode } from "react";
import type { UserAccount } from "../types/UserAccount";
import * as authApi from "../services/auth.api";
import { setAccessToken, setOnAuthFailure } from "@/shared/services/axiosClient";

export interface AuthContextValue {
  usuario: UserAccount | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** true mientras se intenta restaurar la sesión al cargar la app (ver useEffect abajo).
   * Los guards de rutas (ProtectedRoute/AdminRoute) esperan a que esto termine antes
   * de decidir si redirigen, para no mandar a /login por un instante a alguien que sí
   * tenía sesión válida. */
  isLoading: boolean;
  login: (usuario: UserAccount, accessToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (usuarioData: UserAccount, accessToken: string) => {
    setAccessToken(accessToken);
    setUsuario(usuarioData);
  };

  const logout = () => {
    setAccessToken(null);
    setUsuario(null);
    // Best-effort: le avisamos al backend que borre la cookie del refresh token.
    // No bloqueamos el logout local si esta llamada falla (ej. sin internet).
    authApi.logout().catch(() => {});
  };

  // Al montar la app: intenta restaurar la sesión con la cookie httpOnly del
  // refresh token (el usuario refrescó la página o volvió a abrir la pestaña).
  // Si no hay cookie válida, el backend responde 401 y simplemente nos quedamos
  // deslogueados — es el flujo normal de un visitante sin sesión.
  useEffect(() => {
    authApi
      .refresh()
      .then(({ usuario: usuarioData, accessToken }) => {
        setAccessToken(accessToken);
        setUsuario(usuarioData);
      })
      .catch(() => {
        setAccessToken(null);
        setUsuario(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Si en medio de la sesión el refresh automático del interceptor también
  // falla (ej. el refresh token expiró de verdad, 7 días), axiosClient nos
  // avisa aquí para reflejarlo en el estado de React.
  useEffect(() => {
    setOnAuthFailure(() => {
      setUsuario(null);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      isAuthenticated: usuario !== null,
      isAdmin: usuario?.rol === "admin",
      isLoading,
      login,
      logout,
    }),
    [usuario, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
