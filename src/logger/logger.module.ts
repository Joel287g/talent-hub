//? Imports de codigo
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//? Imports de usuario
import { LOGGER_REPOSITORY } from '@logger/application/ports';
import { LoggerService } from '@logger/application/services';

import { Logger, LoggerSchema } from '@logger/infrastructure/adapters/schemas';
import { MongoLoggerRepository } from '@logger/infrastructure/adapters';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Logger.name, schema: LoggerSchema }]),
  ],
  providers: [
    LoggerService,
    {
      provide: LOGGER_REPOSITORY,
      useClass: MongoLoggerRepository,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
