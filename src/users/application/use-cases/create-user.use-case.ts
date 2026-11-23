//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { CreateUserDto } from '@users/application/dtos';
import { UserEntity } from '@users/domain/entities';
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
   * @param {CreateUserDto} payload - Datos validados y saneados para el registro del usuario y su perfil inicial.
   * @returns {Promise<UserEntity>} Entidad de dominio del usuario recién creado y persistido.
   * @throws {BaseException} Si los datos del perfil inicial no coinciden con el contexto activo seleccionado.
   */
  public async execute(payload: CreateUserDto): Promise<UserEntity> {
    const USER = UserEntity.create({
      uid: payload.uid,
      name: payload.name,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone ?? null,
      activeProfileType: payload.activeProfileType,
      personalProfile: payload.personalProfile ?? null,
      businessProfiles: payload.businessProfiles ?? [],
    });

    return await this.usersRepository.create(USER);
  }
}
