import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export const axiosClient = axios.create({
  baseURL,
  withCredentials: true, // necesario para mandar/recibir la cookie httpOnly del refresh token
});

// ────────────────────────────────────────────────────────────
// Access token en memoria
// AuthContext es el dueño real del token (vive en su estado de React).
// Aquí solo guardamos una referencia para que el interceptor pueda leerla
// sin que cada servicio tenga que pasar el token a mano.
// ────────────────────────────────────────────────────────────
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

axiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ────────────────────────────────────────────────────────────
// Refresh automático ante un 401
// Si el access token venció, intentamos refrescarlo UNA vez con la cookie
// httpOnly (POST /auth/refresh) y reintentamos la petición original.
// Si el refresh también falla, avisamos a AuthContext para que deslogue.
// ────────────────────────────────────────────────────────────
let onAuthFailure: (() => void) | null = null;

export function setOnAuthFailure(callback: () => void) {
  onAuthFailure = callback;
}

let refreshPromise: Promise<string | null> | null = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const esLlamadaDeRefresh = original?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && esLlamadaDeRefresh) {
      // El refresh token también venció/es inválido: no hay nada más que intentar.
      setAccessToken(null);
      onAuthFailure?.();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = axiosClient
            .post("/auth/refresh")
            .then((res) => {
              const nuevoToken = res.data.accessToken as string;
              setAccessToken(nuevoToken);
              return nuevoToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }
        const nuevoToken = await refreshPromise;
        if (nuevoToken) {
          original.headers.Authorization = `Bearer ${nuevoToken}`;
          return axiosClient(original);
        }
      } catch {
        setAccessToken(null);
        onAuthFailure?.();
      }
    }

    return Promise.reject(error);
  }
);
