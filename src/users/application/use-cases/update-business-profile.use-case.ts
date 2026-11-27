//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { UpdateBusinessProfileDto } from '@users/application/dtos';
import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

@Injectable()
export class UpdateBusinessProfileUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Aplica los cambios a una de las empresas del usuario mediante la entidad y la persiste.
   *
   * @param {UserEntity} user - Usuario autenticado.
   * @param {string} businessProfileId - Id de la empresa a editar.
   * @param {UpdateBusinessProfileDto} payload - Campos a cambiar, validados y saneados.
   * @returns {Promise<UserEntity>} Usuario actualizado.
   * @throws {BaseException} 400 si no hay cambios; 404 si la empresa no es del usuario o ya no existe.
   */
  public async execute(
    user: UserEntity,
    businessProfileId: string,
    payload: UpdateBusinessProfileDto,
  ): Promise<UserEntity> {
    const BUSINESS_PROFILE = user.updateBusinessProfile(businessProfileId, payload);
    const UPDATED_USER = await this.usersRepository.updateBusinessProfile(
      user.id,
      BUSINESS_PROFILE,
    );

    if (!UPDATED_USER) {
      throw UserErrors.businessProfileNotFound('USER-APP-USE-UPDA_BUSI_PROF-001');
    }

    return UPDATED_USER;
  }
}
