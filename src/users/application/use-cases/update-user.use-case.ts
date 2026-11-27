//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { UpdateUserDto } from '@users/application/dtos';
import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Aplica los cambios a los datos base del usuario mediante la entidad y los persiste.
   *
   * @param {UserEntity} user - Usuario autenticado.
   * @param {UpdateUserDto} payload - Campos a cambiar, validados y saneados.
   * @returns {Promise<UserEntity>} Usuario actualizado.
   * @throws {BaseException} 400 si no hay cambios; 404 si el usuario ya no existe.
   */
  public async execute(user: UserEntity, payload: UpdateUserDto): Promise<UserEntity> {
    user.update(payload);

    const UPDATED_USER = await this.usersRepository.updateBaseData(user);

    if (!UPDATED_USER) {
      throw UserErrors.notFound('USER-APP-USE-UPDA_USER-001');
    }

    return UPDATED_USER;
  }
}
