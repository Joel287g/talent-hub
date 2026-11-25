//? Imports de codigo
import { Injectable } from '@nestjs/common';

//? Imports de usuario
import { CreateUserDto } from '@users/application/dtos';
import {
  CreateUserUseCase,
  FindUserByUidUseCase,
  FindUserByContactUseCase,
  FindUserByAliasUseCase,
  FindUserByBusinessContactUseCase,
} from '@users/application/use-cases';

import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly findUserByUidUseCase: FindUserByUidUseCase,
    private readonly finsUserByContact: FindUserByContactUseCase,
    private readonly findUserByAliasUseCase: FindUserByAliasUseCase,
    private readonly findUserByBusinessContactUseCase: FindUserByBusinessContactUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  public async execute(payload: CreateUserDto): Promise<UserEntity> {
    const EXISTING_USER_BY_UID = await this.findUserByUidUseCase.execute(payload.uid, false);
    const EXISTING_USER_BY_CONTACT = await this.finsUserByContact.execute(
      payload.email,
      payload.phone,
      false,
    );

    if (EXISTING_USER_BY_UID || EXISTING_USER_BY_CONTACT) {
      throw UserErrors.alreadyExists('USER-APP-SER-CREA_USER-001');
    }

    const EXISTING_USER_BY_ALIAS = await this.findUserByAliasUseCase.execute(
      payload.personalProfile?.alias,
      false,
    );

    if (EXISTING_USER_BY_ALIAS) {
      throw UserErrors.aliasAlreadyExists('USER-APP-SER-CREA_USER-002');
    }

    for (const BUSINESS of payload.businessProfiles ?? []) {
      const EXISTING_USER_BY_BUSINESS = await this.findUserByBusinessContactUseCase.execute(
        BUSINESS.email,
        BUSINESS.phone,
        false,
      );

      if (EXISTING_USER_BY_BUSINESS) {
        throw UserErrors.businessAlreadyExists('USER-APP-SER-CREA_USER-003');
      }
    }

    return await this.createUserUseCase.execute(payload);
  }
}
