//* Sesión que se entrega al cliente tras canjear el token del proveedor de identidad
export interface AuthSession {
  //? JWT propio del backend: se envía en la cabecera `authorization` (sin prefijo Bearer)
  accessToken: string;
}
