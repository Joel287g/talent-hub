/**
 * Enumeración de errores de usuarios para la aplicación.
 * Cada valor representa un tipo de error común que puede ocurrir en la aplicación.
 * Esta enumeración se utiliza para estandarizar los mensajes de error y facilitar la gestión de excepciones.
 *
 * @enum {string}
 * @readonly
 */

const PREFIX = 'USER-';

export enum UserErrorsEnum {
  NOT_FOUND = `${PREFIX}NOT_FOUND`,
  ALREADY_EXISTS = `${PREFIX}ALREADY_EXISTS`,
  ALIAS_ALREADY_EXISTS = `${PREFIX}ALIAS_ALREADY_EXISTS`,
  BUSINESS_ALREADY_EXISTS = `${PREFIX}BUSINESS_ALREADY_EXISTS`,
  INVALID_INITIAL_PROFILE = `${PREFIX}INVALID_INITIAL_PROFILE`,
  PERSONAL_PROFILE_ALREADY_EXISTS = `${PREFIX}PERSONAL_PROFILE_ALREADY_EXISTS`,
  PERSONAL_PROFILE_NOT_FOUND = `${PREFIX}PERSONAL_PROFILE_NOT_FOUND`,
  BUSINESS_PROFILE_NOT_FOUND = `${PREFIX}BUSINESS_PROFILE_NOT_FOUND`,
  PROFILE_ALREADY_ACTIVE = `${PREFIX}PROFILE_ALREADY_ACTIVE`,
  INVALID_PROFILE_SWITCH = `${PREFIX}INVALID_PROFILE_SWITCH`,
  NOTHING_TO_UPDATE = `${PREFIX}NOTHING_TO_UPDATE`,
}
