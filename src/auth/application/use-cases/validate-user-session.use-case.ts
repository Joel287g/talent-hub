//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { AuthErrors } from '@auth/domain/exceptions';

import { UserEntity } from '@users/domain/entities';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

@Injectable()
export class ValidateUserSessionUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Verifica la integridad del usuario asociado a una sesión (JWT) en cada petición.
   *
   * @param {string} id - Identificador interno del usuario contenido en el payload del token.
   * @returns {Promise<UserEntity>} Entidad del usuario autenticado.
   * @throws {BaseException} 401 si el usuario ya no existe o si su cuenta está inactiva.
   */
  public async execute(id: string): Promise<UserEntity> {
    const USER = await this.usersRepository.findById(id);

    if (!USER) {
      throw AuthErrors.invalidSession('AUTH-APP-USE-VALIDATE_USER_SESSION-001');
    }

    if (!USER.isActive()) {
      throw AuthErrors.inactiveUser('AUTH-APP-USE-VALIDATE_USER_SESSION-002');
    }

    return USER;
  }
}
