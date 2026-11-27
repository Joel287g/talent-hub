//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { CreateBusinessProfileDto } from '@users/application/dtos';
import { UserEntity } from '@users/domain/entities';
import { UserErrors } from '@users/domain/exceptions';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

@Injectable()
export class AddBusinessProfileUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Añade una cuenta de empresa al usuario y la persiste.
   *
   * @param {UserEntity} user - Usuario autenticado.
   * @param {CreateBusinessProfileDto} payload - Datos validados y saneados de la cuenta de empresa.
   * @returns {Promise<UserEntity>} Usuario actualizado con la nueva cuenta de empresa.
   * @throws {BaseException} 404 si el usuario ya no existe.
   */
  public async execute(user: UserEntity, payload: CreateBusinessProfileDto): Promise<UserEntity> {
    const BUSINESS_PROFILE = user.addBusinessProfile(payload);
    const UPDATED_USER = await this.usersRepository.addBusinessProfile(user.id, BUSINESS_PROFILE);

    if (!UPDATED_USER) {
      throw UserErrors.notFound('USER-APP-USE-ADD_BUSI_PROF-001');
    }

    return UPDATED_USER;
  }
}
