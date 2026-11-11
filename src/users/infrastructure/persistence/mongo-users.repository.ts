//? Imports de codigo
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

//? Imports de usuario
import { BaseRepository } from '@common/repositories';
import { UsersRepository } from '@users/domain/repositories';
import { Users } from '@users/infrastructure/persistence/schemas';
import { UserEntity } from '@users/domain/entities';
import { UserMapper } from '@users/infrastructure/persistence/user.mapper';

@Injectable()
export class MongoDBUsersRepository
  extends BaseRepository<UserEntity, Users>
  implements UsersRepository
{
  constructor(
    @InjectModel(Users.name)
    private readonly usersModel: Model<Users>,
  ) {
    super(usersModel);
  }

  /**
   * Implementación requerida por el BaseRepository (Lectura)
   */
  protected mapToDomain(document: Users): UserEntity {
    return UserMapper.toDomain(document);
  }

  /**
   * Implementación requerida por el BaseRepository (Escritura)
   */
  protected mapToDb(entity: UserEntity): any {
    return UserMapper.toPersistence(entity);
  }
}
