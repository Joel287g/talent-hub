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

  //#region Mappers
  /**
   * Implementación requerida por el BaseRepository (Lectura)
   */
  protected mapToDomain(user: Users): UserEntity {
    return UserMapper.toDomain(user);
  }

  /**
   * Implementación requerida por el BaseRepository (Escritura)
   */
  protected mapToDb(user: UserEntity): any {
    return UserMapper.toPersistence(user);
  }
  //#endregion

  //#region GET
  async findByUid(uid: string): Promise<UserEntity | null> {
    const USER = await this.usersModel.findOne({ uid });
    return this.mapToDomain(USER);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const USER = await this.usersModel.findOne({ email });
    return this.mapToDomain(USER);
  }

  async findByPhone(phone: {
    cca2: string;
    code: string;
    number: string;
  }): Promise<UserEntity | null> {
    const USER = await this.usersModel.findOne({
      'phone.cca2': phone.cca2,
      'phone.code': phone.code,
      'phone.number': phone.number,
    });
    return this.mapToDomain(USER);
  }
  //#endregion
}
