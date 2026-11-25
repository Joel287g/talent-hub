//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

@Injectable()
export class FindUserByAliasUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Busca un usuario por el alias de su perfil personal. Un alias vacío equivale a no tener alias.
   */
  public async execute(alias?: string, throwIfNotFound?: true): Promise<UserEntity>;
  public async execute(alias?: string, throwIfNotFound?: false): Promise<UserEntity | null>;
  public async execute(alias?: string, throwIfNotFound = true): Promise<UserEntity | null> {
    const ALIAS = alias?.trim();
    const USER = ALIAS ? await this.usersRepository.findByAlias(ALIAS) : null;

    if (!USER && throwIfNotFound) {
      throw UserErrors.notFound('USER-APP-USE-FIND_USER_BY_ALIA-001');
    }

    return USER;
  }
}
