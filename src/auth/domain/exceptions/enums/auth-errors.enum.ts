/**
 * Enumeración de errores de autenticación para la aplicación.
 * Cada valor representa un motivo por el que se rechaza una sesión (JWT) o un token del proveedor de identidad.
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

  //? Proveedor de identidad (Firebase)
  INVALID_IDENTITY_TOKEN = `${PREFIX}INVALID_IDENTITY_TOKEN`,
  UNSUPPORTED_SIGN_IN_PROVIDER = `${PREFIX}UNSUPPORTED_SIGN_IN_PROVIDER`,
  IDENTITY_PROVIDER_UNAVAILABLE = `${PREFIX}IDENTITY_PROVIDER_UNAVAILABLE`,
}
