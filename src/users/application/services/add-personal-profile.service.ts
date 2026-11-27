//? Imports de codigo
import { Injectable } from '@nestjs/common';

//? Imports de usuario
import { CreatePersonalProfileDto } from '@users/application/dtos';
import { AddPersonalProfileUseCase, FindUserByAliasUseCase } from '@users/application/use-cases';

import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';

@Injectable()
export class AddPersonalProfileService {
  constructor(
    private readonly findUserByAliasUseCase: FindUserByAliasUseCase,
    private readonly addPersonalProfileUseCase: AddPersonalProfileUseCase,
  ) {}

  /**
   * Añade el perfil personal a un usuario registrado con su cuenta de empresa, tras comprobar
   * que no tenga ya uno y que su alias no esté en uso.
   *
   * @param {UserEntity} user - Usuario autenticado (cargado por la `JwtStrategy`).
   * @param {CreatePersonalProfileDto} payload - Datos del perfil personal recibidos en el body.
   * @returns {Promise<UserEntity>} Usuario actualizado.
   * @throws {BaseException} 409 si ya tiene un perfil personal o si el alias ya existe.
   */
  public async execute(user: UserEntity, payload: CreatePersonalProfileDto): Promise<UserEntity> {
    //* Se anticipa antes de consultar el alias: la entidad lo vuelve a comprobar como invariante
    if (user.hasPersonalProfile()) {
      throw UserErrors.personalProfileAlreadyExists('USER-APP-SER-ADD_PERS_PROF-001');
    }

    const EXISTING_USER_BY_ALIAS = await this.findUserByAliasUseCase.execute(payload.alias, false);

    if (EXISTING_USER_BY_ALIAS) {
      throw UserErrors.aliasAlreadyExists('USER-APP-SER-ADD_PERS_PROF-002');
    }

    return await this.addPersonalProfileUseCase.execute(user, payload);
  }
}
