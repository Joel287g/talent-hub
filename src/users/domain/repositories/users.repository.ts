//? Imports de usuario
import { BaseRepositoryInterface } from '@common/repositories';
import { UserEntity } from '@users/domain/entities';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface UsersRepository extends BaseRepositoryInterface<UserEntity> {
  findById(id: string): Promise<UserEntity | null>;
  findByUid(uid: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByPhone(phone: { cca2: string; code: string; number: string }): Promise<UserEntity | null>;
  create(entity: UserEntity): Promise<UserEntity>;
  exists(id: string): Promise<boolean>;
}
