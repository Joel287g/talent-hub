//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { UpdatePersonalProfileDto } from '@users/application/dtos';
import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

@Injectable()
export class UpdatePersonalProfileUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Aplica los cambios al perfil personal del usuario mediante la entidad y lo persiste.
   *
   * @param {UserEntity} user - Usuario autenticado.
   * @param {UpdatePersonalProfileDto} payload - Campos a cambiar, validados y saneados.
   * @returns {Promise<UserEntity>} Usuario actualizado.
   * @throws {BaseException} 400 si no hay cambios; 404 si no tiene perfil personal o ya no existe.
   */
  public async execute(user: UserEntity, payload: UpdatePersonalProfileDto): Promise<UserEntity> {
    const PERSONAL_PROFILE = user.updatePersonalProfile(payload);
    const UPDATED_USER = await this.usersRepository.updatePersonalProfile(
      user.id,
      PERSONAL_PROFILE,
    );

    if (!UPDATED_USER) {
      throw UserErrors.notFound('USER-APP-USE-UPDA_PERS_PROF-001');
    }

    return UPDATED_USER;
  }
}
