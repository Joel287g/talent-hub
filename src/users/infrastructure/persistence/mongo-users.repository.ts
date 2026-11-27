//? Imports de codigo
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//? Imports de usuario
import { BaseRepository } from '@common/repositories';
import { UsersRepository } from '@users/domain/repositories';
import { ALIAS_COLLATION, Users } from '@users/infrastructure/persistence/schemas';
import { BusinessProfileEntity, PersonalProfileEntity, UserEntity } from '@users/domain/entities';
import { ProfileTypeEnum } from '@users/domain/enums';
import { BusinessProfileMapper } from '@users/infrastructure/persistence/business-profile.mapper';
import { PersonalProfileMapper } from '@users/infrastructure/persistence/personal-profile.mapper';
import { UserMapper } from '@users/infrastructure/persistence/user.mapper';

//? Campos de un subdocumento que una edición nunca reescribe
const IMMUTABLE_FIELDS = ['_id', 'createdAt'];

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
  //* Alta: el perfil aún no existe (`null`), así que se escribe el subdocumento completo
  async addPersonalProfile(id: string, profile: PersonalProfileEntity): Promise<UserEntity | null> {
    const USER = await this.usersModel.findByIdAndUpdate(
      id,
      { $set: { personalProfile: PersonalProfileMapper.toPersistence(profile) } },
      { returnDocument: 'after', runValidators: true },
    );
    return this.mapToDomain(USER);
  }

  async updatePersonalProfile(
    id: string,
    profile: PersonalProfileEntity,
  ): Promise<UserEntity | null> {
    const USER = await this.usersModel.findByIdAndUpdate(
      id,
      {
        $set: MongoDBUsersRepository.toFieldsSet(
          'personalProfile',
          PersonalProfileMapper.toPersistence(profile),
        ),
      },
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

  async updateBusinessProfile(
    id: string,
    profile: BusinessProfileEntity,
  ): Promise<UserEntity | null> {
    //* `$` apunta solo a la empresa que coincide con el filtro, sin tocar las demás
    const USER = await this.usersModel.findOneAndUpdate(
      { _id: id, 'businessProfiles._id': new Types.ObjectId(profile.id) },
      {
        $set: MongoDBUsersRepository.toFieldsSet(
          'businessProfiles.$',
          BusinessProfileMapper.toPersistence(profile),
        ),
      },
      { returnDocument: 'after', runValidators: true },
    );
    return this.mapToDomain(USER);
  }

  async updateActiveProfile(
    id: string,
    activeProfileType: ProfileTypeEnum,
    activeBusinessProfileId: string | null,
  ): Promise<UserEntity | null> {
    const USER = await this.usersModel.findByIdAndUpdate(
      id,
      {
        $set: {
          activeProfileType,
          activeBusinessProfileId: activeBusinessProfileId
            ? new Types.ObjectId(activeBusinessProfileId)
            : null,
        },
      },
      { returnDocument: 'after', runValidators: true },
    );
    return this.mapToDomain(USER);
  }
  //#endregion

  //#region Helpers
  /**
   * Convierte un subdocumento en un `$set` campo a campo (`personalProfile.headline`, ...).
   *
   * //! Reemplazar el subdocumento entero no sirve en una edición: con `timestamps`, Mongoose vuelve a
   * //! sellar su `createdAt` o añade `<ruta>.updatedAt` al mismo `$set` (conflicto, error 40 de Mongo).
   * //! `_id` y `createdAt` nunca se reescriben; `updatedAt` llega ya actualizado desde la entidad.
   */
  private static toFieldsSet(path: string, document: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(document)
        .filter(([key]) => !IMMUTABLE_FIELDS.includes(key))
        .map(([key, value]) => [`${path}.${key}`, value]),
    );
  }
  //#endregion
}
