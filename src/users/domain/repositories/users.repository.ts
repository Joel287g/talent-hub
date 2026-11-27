//? Imports de usuario
import { BaseRepositoryInterface } from '@common/repositories';
import { BusinessProfileEntity, PersonalProfileEntity, UserEntity } from '@users/domain/entities';
import { ProfileTypeEnum } from '@users/domain/enums';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface UsersRepository extends BaseRepositoryInterface<UserEntity> {
  findById(id: string): Promise<UserEntity | null>;
  findByUid(uid: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByPhone(phone: { cca2: string; code: string; number: string }): Promise<UserEntity | null>;
  findByAlias(alias: string): Promise<UserEntity | null>;
  findByBusinessEmail(email: string): Promise<UserEntity | null>;
  findByBusinessPhone(phone: {
    cca2: string;
    code: string;
    number: string;
  }): Promise<UserEntity | null>;
  create(entity: UserEntity): Promise<UserEntity>;
  updateBaseData(user: UserEntity): Promise<UserEntity | null>;
  addPersonalProfile(id: string, profile: PersonalProfileEntity): Promise<UserEntity | null>;
  updatePersonalProfile(id: string, profile: PersonalProfileEntity): Promise<UserEntity | null>;
  addBusinessProfile(id: string, profile: BusinessProfileEntity): Promise<UserEntity | null>;
  updateBusinessProfile(id: string, profile: BusinessProfileEntity): Promise<UserEntity | null>;
  updateActiveProfile(
    id: string,
    activeProfileType: ProfileTypeEnum,
    activeBusinessProfileId: string | null,
  ): Promise<UserEntity | null>;
  exists(id: string): Promise<boolean>;
}
