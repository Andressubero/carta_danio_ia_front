// src/config.ts

export const API_URL = import.meta.env.VITE_RUTA_BACKEND_LOCAL;

if (!API_URL) {
  console.warn("⚠️ VITE_RUTA_BACKEND_LOCAL no está definida en el archivo .env");
}
