//? Imports de usuario
import { BaseRepositoryInterface } from '@common/repositories/base-repository.interface';
import { SnifferEntity } from '@sniffer/domain/entities';

export const SNIFFER_REPOSITORY = Symbol('SNIFFER_REPOSITORY');

export interface SnifferRepository extends BaseRepositoryInterface<SnifferEntity> {
  create(entity: SnifferEntity): Promise<SnifferEntity>;
}
