//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

@Injectable()
export class FindUserByContactUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}
  public async execute(
    email?: string,
    phone?: { cca2: string; code: string; number: string },
    throwIfNotFound?: true,
  ): Promise<UserEntity>;
  public async execute(
    email?: string,
    phone?: { cca2: string; code: string; number: string },
    throwIfNotFound?: false,
  ): Promise<UserEntity | null>;
  public async execute(
    email?: string,
    phone?: { cca2: string; code: string; number: string },
    throwIfNotFound = true,
  ): Promise<UserEntity | null> {
    const USER = email
      ? await this.usersRepository.findByEmail(email)
      : await this.usersRepository.findByPhone(phone);

    if (!USER && throwIfNotFound) {
      throw UserErrors.notFound('USER-APP-USE-FIND_USER_BY_CONT-001');
    }

    return USER;
  }
}
