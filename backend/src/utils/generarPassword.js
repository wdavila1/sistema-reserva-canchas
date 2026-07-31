import crypto from "crypto";

/** Genera una contraseña temporal legible (para cuando un admin crea un
 * usuario o resetea una contraseña). Nunca se guarda en texto plano en
 * ningún lado: se hashea de inmediato con bcrypt antes de persistirla. */
export function generarPasswordTemporal() {
  // Evita caracteres ambiguos (0/O, 1/l/I) para que sea fácil de transcribir a mano
  const alfabeto = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(10);
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += alfabeto[bytes[i] % alfabeto.length];
  }
  return password;
}