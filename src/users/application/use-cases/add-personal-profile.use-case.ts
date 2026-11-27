//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { CreatePersonalProfileDto } from '@users/application/dtos';
import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

@Injectable()
export class AddPersonalProfileUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Añade el perfil personal al usuario validando las invariantes de la entidad y lo persiste.
   *
   * @param {UserEntity} user - Usuario autenticado.
   * @param {CreatePersonalProfileDto} payload - Datos validados y saneados del perfil personal.
   * @returns {Promise<UserEntity>} Usuario actualizado con su perfil personal.
   * @throws {BaseException} 409 si el usuario ya tiene un perfil personal; 404 si ya no existe.
   */
  public async execute(user: UserEntity, payload: CreatePersonalProfileDto): Promise<UserEntity> {
    const PERSONAL_PROFILE = user.addPersonalProfile(payload);
    const UPDATED_USER = await this.usersRepository.savePersonalProfile(user.id, PERSONAL_PROFILE);

    if (!UPDATED_USER) {
      throw UserErrors.notFound('USER-APP-USE-ADD_PERS_PROF-001');
    }

    return UPDATED_USER;
  }
}
