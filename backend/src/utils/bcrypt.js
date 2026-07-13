import bcrypt from "bcryptjs";
import { env } from "../config/env.js";

export const hashPassword = (plainPassword) =>
  bcrypt.hash(plainPassword, env.BCRYPT_SALT_ROUNDS);

export const compararPassword = (plainPassword, hash) =>
  bcrypt.compare(plainPassword, hash);
