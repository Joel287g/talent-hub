//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

@Injectable()
export class FindUserByBusinessContactUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Busca un usuario que tenga una empresa con ese email o, si no hay coincidencia, con ese teléfono.
   */
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
    const USER_BY_EMAIL = email ? await this.usersRepository.findByBusinessEmail(email) : null;
    const USER =
      USER_BY_EMAIL ?? (phone ? await this.usersRepository.findByBusinessPhone(phone) : null);

    if (!USER && throwIfNotFound) {
      throw UserErrors.notFound('USER-APP-USE-FIND_USER_BY_BUSI-001');
    }

    return USER;
  }
}
