//? Imports de codigo
import { Injectable } from '@nestjs/common';

//? Imports de usuario
import { UpdatePersonalProfileDto } from '@users/application/dtos';
import { FindUserByAliasUseCase, UpdatePersonalProfileUseCase } from '@users/application/use-cases';

import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';

@Injectable()
export class UpdatePersonalProfileService {
  constructor(
    private readonly findUserByAliasUseCase: FindUserByAliasUseCase,
    private readonly updatePersonalProfileUseCase: UpdatePersonalProfileUseCase,
  ) {}

  /**
   * Edita el perfil personal del usuario tras comprobar que lo tiene y que el nuevo alias no esté en uso.
   *
   * @param {UserEntity} user - Usuario autenticado (cargado por la `JwtStrategy`).
   * @param {UpdatePersonalProfileDto} payload - Campos a cambiar recibidos en el body.
   * @returns {Promise<UserEntity>} Usuario actualizado.
   * @throws {BaseException} 404 si no tiene perfil personal; 409 si el alias es de otro usuario.
   */
  public async execute(user: UserEntity, payload: UpdatePersonalProfileDto): Promise<UserEntity> {
    if (!user.hasPersonalProfile()) {
      throw UserErrors.personalProfileNotFound('USER-APP-SER-UPDA_PERS_PROF-001');
    }

    //* El propio alias no cuenta como duplicado (ej. cambiar "vale" por "Vale")
    const EXISTING_USER_BY_ALIAS = await this.findUserByAliasUseCase.execute(payload.alias, false);

    if (EXISTING_USER_BY_ALIAS && EXISTING_USER_BY_ALIAS.id !== user.id) {
      throw UserErrors.aliasAlreadyExists('USER-APP-SER-UPDA_PERS_PROF-002');
    }

    return await this.updatePersonalProfileUseCase.execute(user, payload);
  }
}
