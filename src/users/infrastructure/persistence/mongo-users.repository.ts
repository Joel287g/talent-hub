//? Imports de codigo
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

//? Imports de usuario
import { BaseRepository } from '@common/repositories';
import { UsersRepository } from '@users/domain/repositories';
import { ALIAS_COLLATION, Users } from '@users/infrastructure/persistence/schemas';
import { BusinessProfileEntity, PersonalProfileEntity, UserEntity } from '@users/domain/entities';
import { BusinessProfileMapper } from '@users/infrastructure/persistence/business-profile.mapper';
import { PersonalProfileMapper } from '@users/infrastructure/persistence/personal-profile.mapper';
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

  async findByAlias(alias: string): Promise<UserEntity | null> {
    //* Misma collation que el índice único: "Vale" y "vale" son el mismo alias
    const USER = await this.usersModel
      .findOne({ 'personalProfile.alias': alias })
      .collation(ALIAS_COLLATION);
    return this.mapToDomain(USER);
  }

  async findByBusinessEmail(email: string): Promise<UserEntity | null> {
    const USER = await this.usersModel.findOne({ 'businessProfiles.email': email });
    return this.mapToDomain(USER);
  }

  async findByBusinessPhone(phone: {
    cca2: string;
    code: string;
    number: string;
  }): Promise<UserEntity | null> {
    const USER = await this.usersModel.findOne({
      businessProfiles: {
        $elemMatch: {
          'phone.cca2': phone.cca2,
          'phone.code': phone.code,
          'phone.number': phone.number,
        },
      },
    });
    return this.mapToDomain(USER);
  }
  //#endregion

  //#region UPDATE
  async addPersonalProfile(id: string, profile: PersonalProfileEntity): Promise<UserEntity | null> {
    const USER = await this.usersModel.findByIdAndUpdate(
      id,
      { $set: { personalProfile: PersonalProfileMapper.toPersistence(profile) } },
      { returnDocument: 'after', runValidators: true },
    );
    return this.mapToDomain(USER);
  }

  async addBusinessProfile(id: string, profile: BusinessProfileEntity): Promise<UserEntity | null> {
    //* `$push` no reescribe las demás empresas (ni sus marcas de tiempo)
    const USER = await this.usersModel.findByIdAndUpdate(
      id,
      { $push: { businessProfiles: BusinessProfileMapper.toPersistence(profile) } },
      { returnDocument: 'after', runValidators: true },
    );
    return this.mapToDomain(USER);
  }
  //#endregion
}
