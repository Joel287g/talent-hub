/**
 * Enumeración de errores de autenticación para la aplicación.
 * Cada valor representa un motivo por el que una sesión (JWT) es rechazada.
 * Esta enumeración se utiliza para estandarizar los mensajes de error y facilitar la gestión de excepciones.
 *
 * @enum {string}
 * @readonly
 */

const PREFIX = 'AUTH-';

export enum AuthErrorsEnum {
  INVALID_TOKEN = `${PREFIX}INVALID_TOKEN`,
  INVALID_SESSION = `${PREFIX}INVALID_SESSION`,
  INACTIVE_USER = `${PREFIX}INACTIVE_USER`,
}
