//? Imports de codigo
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

//? Imports de usuario
import { BaseRepository } from '@common/repositories';
import { SnifferRepository } from '@sniffer/domain/repositories';
import { Sniffer } from '@sniffer/infrastructure/persistence/schemas';
import { SnifferEntity } from '@sniffer/domain/entities';
import { SnifferMapper } from '@sniffer/infrastructure/persistence/sniffer.mapper';

@Injectable()
export class MongoDBSnifferRepository
  extends BaseRepository<SnifferEntity, Sniffer>
  implements SnifferRepository
{
  constructor(
    @InjectModel(Sniffer.name)
    private readonly snifferModel: Model<Sniffer>,
  ) {
    super(snifferModel);
  }

  /**
   * Implementación requerida por el BaseRepository (Lectura)
   */
  protected mapToDomain(document: Sniffer): SnifferEntity {
    return SnifferMapper.toDomain(document);
  }

  /**
   * Implementación requerida por el BaseRepository (Escritura)
   */
  protected mapToDb(entity: SnifferEntity): any {
    return SnifferMapper.toPersistence(entity);
  }
}
