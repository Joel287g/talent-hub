//? Imports de usuario
import { BaseException, BaseErrors } from '@common/domain/exceptions';

import { AuthErrorsEnum } from '@auth/domain/exceptions/enums';

class AuthErrorsFactory extends BaseErrors {
  //? Token ausente, mal formado, expirado o con firma inválida
  public invalidToken(
    code: string = 'AUTH-DOM-EXC-AUTH_ERRO-001',
    cause?: Error | unknown,
  ): BaseException<AuthErrorsEnum> {
    return new BaseException<AuthErrorsEnum>(AuthErrorsEnum.INVALID_TOKEN, 401, code, cause);
  }

  //? El token es válido pero el usuario al que apunta ya no existe
  public invalidSession(
    code: string = 'AUTH-DOM-EXC-AUTH_ERRO-002',
  ): BaseException<AuthErrorsEnum> {
    return new BaseException<AuthErrorsEnum>(AuthErrorsEnum.INVALID_SESSION, 401, code);
  }

  //? El token es válido pero la cuenta del usuario está inactiva
  public inactiveUser(code: string = 'AUTH-DOM-EXC-AUTH_ERRO-003'): BaseException<AuthErrorsEnum> {
    return new BaseException<AuthErrorsEnum>(AuthErrorsEnum.INACTIVE_USER, 401, code);
  }

  //? Token del proveedor de identidad ausente, mal formado, expirado, revocado o de una cuenta deshabilitada
  public invalidIdentityToken(
    code: string = 'AUTH-DOM-EXC-AUTH_ERRO-004',
    cause?: Error | unknown,
  ): BaseException<AuthErrorsEnum> {
    return new BaseException<AuthErrorsEnum>(
      AuthErrorsEnum.INVALID_IDENTITY_TOKEN,
      401,
      code,
      cause,
    );
  }

  //? El token es válido pero se obtuvo con un método de inicio de sesión no admitido
  public unsupportedSignInProvider(
    code: string = 'AUTH-DOM-EXC-AUTH_ERRO-005',
  ): BaseException<AuthErrorsEnum> {
    return new BaseException<AuthErrorsEnum>(
      AuthErrorsEnum.UNSUPPORTED_SIGN_IN_PROVIDER,
      403,
      code,
    );
  }

  //? El proveedor de identidad no responde o falla al verificar (red, permisos, error interno)
  public identityProviderUnavailable(
    code: string = 'AUTH-DOM-EXC-AUTH_ERRO-006',
    cause?: Error | unknown,
  ): BaseException<AuthErrorsEnum> {
    return new BaseException<AuthErrorsEnum>(
      AuthErrorsEnum.IDENTITY_PROVIDER_UNAVAILABLE,
      503,
      code,
      cause,
    );
  }
}

//* Solo se exporta la instancia, nunca la clase
export const AuthErrors = new AuthErrorsFactory();
