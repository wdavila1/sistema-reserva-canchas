import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";
import { env } from "../../config/env.js";

const cookieOpts = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 1 * 24 * 60 * 60 * 1000, // 1 día, debe calzar con JWT_REFRESH_EXPIRES_IN
  path: "/api/auth", //El navegador solo envia lo cokoe a esta ruta /api/auth/refresh
};

export const registrar = asyncHandler(async (req, res) => {
  const { usuario, accessToken, refreshToken } = await authService.registrar(req.body);
  res.cookie("refreshToken", refreshToken, cookieOpts);
  res.status(201).json({ usuario, accessToken });
});

export const login = asyncHandler(async (req, res) => {
  const { identificador, contrasena } = req.body;
  const { usuario, accessToken, refreshToken } = await authService.login({ identificador, contrasena });
  res.cookie("refreshToken", refreshToken, cookieOpts);
  res.json({ usuario, accessToken });
});

export const refresh = asyncHandler(async (req, res) => {
  const { usuario, accessToken } = await authService.refrescarToken(req.cookies?.refreshToken);
  res.json({ usuario, accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.status(204).send();
});

export const me = asyncHandler(async (req, res) => {
  const usuario = await authService.obtenerPerfil(req.user.usuarioId);
  res.json({ usuario });
});
