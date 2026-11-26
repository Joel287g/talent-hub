//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { CreateUserDto } from '@users/application/dtos';
import { UserEntity, UserIdentityType } from '@users/domain/entities';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Construye la entidad `UserEntity` validando las invariantes de negocio y la persiste en el repositorio.
   *
   * @param {UserIdentityType} identity - `uid` y `email` del token verificado del proveedor de identidad.
   * @param {CreateUserDto} payload - Datos validados y saneados para el registro del usuario y su perfil inicial.
   * @returns {Promise<UserEntity>} Entidad de dominio del usuario recién creado y persistido.
   * @throws {BaseException} Si los datos del perfil inicial no coinciden con el contexto activo seleccionado.
   */
  public async execute(identity: UserIdentityType, payload: CreateUserDto): Promise<UserEntity> {
    const USER = UserEntity.create({
      uid: identity.uid,
      name: payload.name,
      lastName: payload.lastName,
      email: identity.email,
      phone: payload.phone ?? null,
      activeProfileType: payload.activeProfileType,
      personalProfile: payload.personalProfile ?? null,
      businessProfiles: payload.businessProfiles ?? [],
    });

    return await this.usersRepository.create(USER);
  }
}
