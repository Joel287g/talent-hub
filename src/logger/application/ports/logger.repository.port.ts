//? Imports de usuario
import { LoggerEntity } from '@logger/domain/entities';

export const LOGGER_REPOSITORY = Symbol('LOGGER_REPOSITORY');

export interface LoggerRepository {
  save(logger: LoggerEntity): Promise<void>;
}
