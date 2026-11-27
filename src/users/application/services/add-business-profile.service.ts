//? Imports de codigo
import { Injectable } from '@nestjs/common';

//? Imports de usuario
import { CreateBusinessProfileDto } from '@users/application/dtos';
import {
  AddBusinessProfileUseCase,
  FindUserByBusinessContactUseCase,
} from '@users/application/use-cases';

import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';

@Injectable()
export class AddBusinessProfileService {
  constructor(
    private readonly findUserByBusinessContactUseCase: FindUserByBusinessContactUseCase,
    private readonly addBusinessProfileUseCase: AddBusinessProfileUseCase,
  ) {}

  /**
   * Añade una cuenta de empresa al usuario autenticado tras comprobar que su email y su teléfono
   * no estén en uso por ninguna empresa (incluidas las del propio usuario).
   *
   * @param {UserEntity} user - Usuario autenticado (cargado por la `JwtStrategy`).
   * @param {CreateBusinessProfileDto} payload - Datos de la cuenta de empresa recibidos en el body.
   * @returns {Promise<UserEntity>} Usuario actualizado.
   * @throws {BaseException} 409 si el email o el teléfono de la empresa ya existen.
   */
  public async execute(user: UserEntity, payload: CreateBusinessProfileDto): Promise<UserEntity> {
    const EXISTING_USER_BY_BUSINESS = await this.findUserByBusinessContactUseCase.execute(
      payload.email,
      payload.phone,
      false,
    );

    if (EXISTING_USER_BY_BUSINESS) {
      throw UserErrors.businessAlreadyExists('USER-APP-SER-ADD_BUSI_PROF-001');
    }

    return await this.addBusinessProfileUseCase.execute(user, payload);
  }
}
