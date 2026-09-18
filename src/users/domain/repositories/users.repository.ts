//? Imports de usuario
import { BaseRepositoryInterface } from '@common/repositories/base-repository.interface';
import { UserEntity } from '@users/domain/entities';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface UsersRepository extends BaseRepositoryInterface<UserEntity> {
  findById(id: string): Promise<UserEntity | null>;
  create(entity: UserEntity): Promise<UserEntity>;
  exists(id: string): Promise<boolean>;
}
