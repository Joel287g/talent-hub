//? Imports de codigo
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//? Imports de usuario
import { LoggerRepository } from '@logger/application/ports/logger.repository.port';
import { LoggerEntity } from '@logger/domain/entities/logger.entity';

import { Logger } from '@logger/infrastructure/adapters/schemas';

@Injectable()
export class MongoLoggerRepository implements LoggerRepository {
  constructor(
    @InjectModel(Logger.name)
    private readonly loggerModel: Model<Logger>,
  ) {}

  async save(loggerEntity: LoggerEntity): Promise<void> {
    const { props } = loggerEntity;

    const logger = new this.loggerModel({
      _id: new Types.ObjectId(),
      type: props.type,
      level: props.level,
      message: props.message,
      data: props.data,
    });

    await logger.save();
  }
}
