//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

import { Auth, AuthErrorCode, DecodedIdToken, FirebaseAuthError } from 'firebase-admin/auth';

//? Imports de usuario
import { BaseException } from '@common/domain/exceptions';

import { FIREBASE_AUTH } from '@configuration/security';

import { SignInProviderEnum } from '@auth/domain/enums';
import { AuthErrors } from '@auth/domain/exceptions';
import { VerifiedIdentity } from '@auth/domain/interfaces';
import { IdentityProvider } from '@auth/domain/ports';

//* Además de la firma, comprueba en Firebase que la sesión no esté revocada ni la cuenta deshabilitada
const CHECK_REVOKED = true;

//? firebase-admin antepone este prefijo a los AuthErrorCode (ej. "auth/id-token-expired")
const FIREBASE_AUTH_ERROR_PREFIX = 'auth/';

//? Valores de `firebase.sign_in_provider` admitidos por el sistema
const SIGN_IN_PROVIDERS = new Map<string, SignInProviderEnum>([
  ['password', SignInProviderEnum.EMAIL_PASSWORD],
  ['google.com', SignInProviderEnum.GOOGLE],
]);

//? Código único que recibe el cliente según el motivo por el que Firebase rechaza el token
const TOKEN_ERROR_CODES: Partial<Record<AuthErrorCode, string>> = {
  [AuthErrorCode.INVALID_ARGUMENT]: 'AUTH-INF-PRO-FIRE_IDEN-002',
  [AuthErrorCode.INVALID_ID_TOKEN]: 'AUTH-INF-PRO-FIRE_IDEN-002',
  [AuthErrorCode.ID_TOKEN_EXPIRED]: 'AUTH-INF-PRO-FIRE_IDEN-003',
  [AuthErrorCode.ID_TOKEN_REVOKED]: 'AUTH-INF-PRO-FIRE_IDEN-004',
  [AuthErrorCode.USER_DISABLED]: 'AUTH-INF-PRO-FIRE_IDEN-005',
  [AuthErrorCode.USER_NOT_FOUND]: 'AUTH-INF-PRO-FIRE_IDEN-006',
};

@Injectable()
export class FirebaseIdentityProvider implements IdentityProvider {
  constructor(
    @Inject(FIREBASE_AUTH)
    private readonly firebaseAuth: Auth,
  ) {}

  public async verifyToken(token: string): Promise<VerifiedIdentity> {
    //* Se ataja antes de llamar a Firebase
    if (!token?.trim()) {
      throw AuthErrors.invalidIdentityToken('AUTH-INF-PRO-FIRE_IDEN-001');
    }

    const DECODED_TOKEN = await this.decode(token);

    return this.toIdentity(DECODED_TOKEN);
  }

  //? Verifica firma, expiración, audiencia (FIREBASE_PROJECT_ID) y revocación del ID token
  private async decode(token: string): Promise<DecodedIdToken> {
    try {
      return await this.firebaseAuth.verifyIdToken(token, CHECK_REVOKED);
    } catch (error) {
      throw this.translateError(error);
    }
  }

  //* Adaptador: traduce los errores de firebase-admin al catálogo de errores del dominio
  private translateError(error: unknown): BaseException {
    const FIREBASE_CODE =
      error instanceof FirebaseAuthError
        ? (error.code.replace(FIREBASE_AUTH_ERROR_PREFIX, '') as AuthErrorCode)
        : undefined;

    const TOKEN_ERROR_CODE = FIREBASE_CODE && TOKEN_ERROR_CODES[FIREBASE_CODE];

    if (TOKEN_ERROR_CODE) {
      return AuthErrors.invalidIdentityToken(TOKEN_ERROR_CODE, error);
    }

    //! El fallo no es del token: red, permisos de la cuenta de servicio o error interno de Firebase
    return AuthErrors.identityProviderUnavailable('AUTH-INF-PRO-FIRE_IDEN-009', error);
  }

  private toIdentity(decodedToken: DecodedIdToken): VerifiedIdentity {
    const PROVIDER = SIGN_IN_PROVIDERS.get(decodedToken.firebase.sign_in_provider);

    if (!PROVIDER) {
      throw AuthErrors.unsupportedSignInProvider('AUTH-INF-PRO-FIRE_IDEN-007');
    }

    //* Correo/contraseña y Google siempre incluyen el email: sin él la identidad está incompleta
    if (!decodedToken.email) {
      throw AuthErrors.invalidIdentityToken('AUTH-INF-PRO-FIRE_IDEN-008');
    }

    return {
      uid: decodedToken.uid,
      email: decodedToken.email.toLowerCase(),
      emailVerified: decodedToken.email_verified === true,
      provider: PROVIDER,
    };
  }
}
