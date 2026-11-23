//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

@Injectable()
export class FindUserByUidUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Busca un usuario por su UID y lanza una excepción de dominio si no se encuentra registrado.
   *
   * @param {string} uid - Identificador único del usuario proveniente del proveedor de autenticación.
   * @param {true} [throwIfNotFound=true] - Indica que debe lanzarse una excepción si el usuario no existe.
   * @param {false} throwIfNotFound - Indica que debe retornarse `null` si el usuario no existe.
   * @param {boolean} [throwIfNotFound=true] - Controla si se lanza una excepción cuando no hay coincidencias.
   * @returns {Promise<UserEntity | null>} Entidad del usuario encontrado o `null`.
   * @throws {BaseException} Si el usuario no existe en la base de datos.
   */
  public async execute(uid: string, throwIfNotFound?: true): Promise<UserEntity>;
  public async execute(uid: string, throwIfNotFound: false): Promise<UserEntity | null>;
  public async execute(uid: string, throwIfNotFound = true): Promise<UserEntity | null> {
    const USER = await this.usersRepository.findByUid(uid);

    if (!USER && throwIfNotFound) {
      throw UserErrors.notFound('USER-APP-USE-FIND_USER_BY_UID-001');
    }

    return USER;
  }
}
