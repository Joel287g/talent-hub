//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { CreateUserDto } from '@users/application/dtos';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';
import { UserEntity } from '@users/domain/entities';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(payload: CreateUserDto): Promise<UserEntity> {
    const USER = UserEntity.create(payload);
    return await this.usersRepository.create(USER);
  }
}
