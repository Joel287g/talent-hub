//? Imports de usuario
import { SignInProviderEnum } from '@auth/domain/enums';

//* Identidad del usuario tras verificar el token del proveedor de identidad (ej. Firebase)
export interface VerifiedIdentity {
  //? UID del usuario en el proveedor de identidad (UserEntity.uid)
  uid: string;

  //? Email autenticado por el proveedor, siempre en minúsculas
  email: string;

  //? El proveedor confirma que el usuario es el dueño del email
  emailVerified: boolean;

  //? Método con el que inició sesión
  provider: SignInProviderEnum;
}
