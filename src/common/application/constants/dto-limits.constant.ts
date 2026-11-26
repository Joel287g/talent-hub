/**
 * Longitud máxima de cada texto libre recibido en los DTOs.
 * Evita guardar textos desproporcionados, sobre todo en los endpoints públicos.
 */
export const TEXT_MAX_LENGTH = {
  UID: 128, //* Máximo que admite Firebase Authentication
  EMAIL: 254, //* Máximo de una dirección de correo (RFC 5321)
  NAME: 100,
  ALIAS: 50,
  HEADLINE: 150,
  LONG_TEXT: 1000,
  CITY: 100,
  STREET: 150,
  FILE_NAME: 255,
  STORAGE_KEY: 1024,
  URL: 2048,
} as const;

//* Tamaño máximo de un avatar: 10 MB
export const AVATAR_MAX_SIZE = 10 * 1024 * 1024;

//* Solo URLs absolutas y cifradas (descarta `http://`, `ftp://` y rutas sin protocolo)
export const HTTPS_URL_OPTIONS = { protocols: ['https'], require_protocol: true };
