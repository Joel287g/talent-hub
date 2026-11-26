/**
 * Métodos de inicio de sesión admitidos por el sistema.
 * Son agnósticos al proveedor de identidad: cada adaptador traduce sus propios valores a este enum.
 *
 * @enum {string}
 * @readonly
 */
export enum SignInProviderEnum {
  EMAIL_PASSWORD = 'EMAIL_PASSWORD',
  GOOGLE = 'GOOGLE',
}
