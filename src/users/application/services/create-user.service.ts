//? Imports de codigo
import { Injectable } from '@nestjs/common';

//? Imports de usuario
import { CreateUserDto } from '@users/application/dtos';
import {
  CreateUserUseCase,
  FindUserByUidUseCase,
  FindUserByContactUseCase,
} from '@users/application/use-cases';

import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly findUserByUidUseCase: FindUserByUidUseCase,
    private readonly finsUserByContact: FindUserByContactUseCase,
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

    return await this.createUserUseCase.execute(payload);
  }
}
