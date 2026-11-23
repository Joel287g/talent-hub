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
}

//* Solo se exporta la instancia, nunca la clase
export const AuthErrors = new AuthErrorsFactory();
