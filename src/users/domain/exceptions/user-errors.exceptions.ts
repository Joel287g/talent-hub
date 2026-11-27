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

  public personalProfileNotFound(
    code: string = 'USER-DOM-EXC-USER_ERRO-007',
  ): BaseException<UserErrorsEnum> {
    return new BaseException<UserErrorsEnum>(UserErrorsEnum.PERSONAL_PROFILE_NOT_FOUND, 404, code);
  }

  public businessProfileNotFound(
    code: string = 'USER-DOM-EXC-USER_ERRO-008',
  ): BaseException<UserErrorsEnum> {
    return new BaseException<UserErrorsEnum>(UserErrorsEnum.BUSINESS_PROFILE_NOT_FOUND, 404, code);
  }

  public profileAlreadyActive(
    code: string = 'USER-DOM-EXC-USER_ERRO-009',
  ): BaseException<UserErrorsEnum> {
    return new BaseException<UserErrorsEnum>(UserErrorsEnum.PROFILE_ALREADY_ACTIVE, 409, code);
  }

  public invalidProfileSwitch(
    code: string = 'USER-DOM-EXC-USER_ERRO-010',
  ): BaseException<UserErrorsEnum> {
    return new BaseException<UserErrorsEnum>(UserErrorsEnum.INVALID_PROFILE_SWITCH, 400, code);
  }
}

export const UserErrors = new UserErrorsFactory();
