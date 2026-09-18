//? Imports de codigo
import { Document, Model } from 'mongoose';

//? Imports de usuario
import { BaseRepositoryInterface } from '@common/repositories';

export abstract class BaseRepository<
  T,
  D extends Document,
> implements BaseRepositoryInterface<T> {
  constructor(protected readonly model: Model<D>) {}

  protected abstract mapToDomain(document: D): T;
  protected abstract mapToDb(entity: T): any;

  async findById(id: string): Promise<T | null> {
    const DOCUMENT = await this.model.findById(id);
    return this.mapToDomain(DOCUMENT);
  }

  async exists(id: string): Promise<boolean> {
    return !!(await this.model.exists({ _id: id }).exec());
  }

  async create(entity: T): Promise<T> {
    const DB_ENTITY = this.mapToDb(entity);
    const ENTITY = new this.model(DB_ENTITY);

    return (await ENTITY.save()) as unknown as T;
  }
}
