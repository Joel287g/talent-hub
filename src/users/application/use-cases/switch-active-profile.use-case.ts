//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { SwitchActiveProfileDto } from '@users/application/dtos';
import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

@Injectable()
export class SwitchActiveProfileUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Cambia el perfil activo del usuario (personal o una de sus empresas) y lo persiste.
   *
   * @param {UserEntity} user - Usuario autenticado.
   * @param {SwitchActiveProfileDto} payload - Perfil a activar y, opcionalmente, la empresa.
   * @returns {Promise<UserEntity>} Usuario actualizado.
   * @throws {BaseException} 404 si el usuario no tiene ese perfil o esa empresa, o si ya no existe.
   */
  public async execute(user: UserEntity, payload: SwitchActiveProfileDto): Promise<UserEntity> {
    user.switchActiveProfile(payload.activeProfileType, payload.businessProfileId);

    const UPDATED_USER = await this.usersRepository.updateActiveProfile(
      user.id,
      user.activeProfileType,
      user.activeBusinessProfileId,
    );

    if (!UPDATED_USER) {
      throw UserErrors.notFound('USER-APP-USE-SWIT_ACTI_PROF-001');
    }

    return UPDATED_USER;
  }
}
