//? Imports de usuario
import { BaseException, BaseErrors } from '@common/domain/exceptions';

import { UserErrorsEnum } from '@users/domain/exceptions/enums';

class UserErrorsFactory extends BaseErrors {
  public notFound(code: string = 'USER-DOM-EXC-USER_ERRO-001'): BaseException<UserErrorsEnum> {
    return new BaseException<UserErrorsEnum>(UserErrorsEnum.NOT_FOUND, 404, code);
  }

  public alreadyExists(code: string = 'USER-DOM-EXC-USER_ERRO-002'): BaseException<UserErrorsEnum> {
    return new BaseException<UserErrorsEnum>(UserErrorsEnum.ALREADY_EXISTS, 409, code);
  }

  public invalidInitialProfile(
    code: string = 'USER-DOM-EXC-USER_ERRO-003',
  ): BaseException<UserErrorsEnum> {
    return new BaseException<UserErrorsEnum>(UserErrorsEnum.INVALID_INITIAL_PROFILE, 400, code);
  }

  public aliasAlreadyExists(
    code: string = 'USER-DOM-EXC-USER_ERRO-004',
  ): BaseException<UserErrorsEnum> {
    return new BaseException<UserErrorsEnum>(UserErrorsEnum.ALIAS_ALREADY_EXISTS, 409, code);
  }

  public businessAlreadyExists(
    code: string = 'USER-DOM-EXC-USER_ERRO-005',
  ): BaseException<UserErrorsEnum> {
    return new BaseException<UserErrorsEnum>(UserErrorsEnum.BUSINESS_ALREADY_EXISTS, 409, code);
  }

  public personalProfileAlreadyExists(
    code: string = 'USER-DOM-EXC-USER_ERRO-006',
  ): BaseException<UserErrorsEnum> {
    return new BaseException<UserErrorsEnum>(
      UserErrorsEnum.PERSONAL_PROFILE_ALREADY_EXISTS,
      409,
      code,
    );
  }
}

export const UserErrors = new UserErrorsFactory();
