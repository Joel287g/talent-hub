//? Imports de usuario
import { VerifiedIdentity } from '@auth/domain/interfaces';

export const IDENTITY_PROVIDER = Symbol('IDENTITY_PROVIDER');

//* Puerto del proveedor de identidad externo (ej. Firebase Authentication)
export interface IdentityProvider {
  /**
   * Verifica el token emitido por el proveedor de identidad y devuelve la identidad del usuario.
   *
   * @param {string} token - Token de identidad recibido del cliente (ej. ID token de Firebase).
   * @returns {Promise<VerifiedIdentity>} Identidad verificada del usuario.
   * @throws {BaseException} 401 si el token no es válido, 403 si el método de inicio de sesión no está admitido
   * o 503 si el proveedor no está disponible.
   */
  verifyToken(token: string): Promise<VerifiedIdentity>;
}
