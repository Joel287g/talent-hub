//? Imports de codigo
import { APP_FILTER } from '@nestjs/core';
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

//? Imports de usuario

//* Module
import { LoggerModule } from '@logger/logger.module';
import { SnifferModule } from '@sniffer/sniffer.module';

//* Middlewares
import { SnifferMiddleware } from '@common/infrastructure/middlewares';

//* Filters
import {
  DomainExceptionFilter,
  GeneralExceptionsFilter,
  HttpExceptionFilter,
  MongooseExceptionFilter,
} from '@common/infrastructure/filters';

@Global()
@Module({
  imports: [
    //? Modules
    LoggerModule,
    SnifferModule,
  ],

  controllers: [],

  providers: [
    //? Errors

    //? Filters
    {
      provide: APP_FILTER,
      useClass: GeneralExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongooseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class MiddlewaresModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    //* Se ejecuta antes que los guards: registra todas las peticiones, incluidas las rechazadas
    consumer.apply(SnifferMiddleware).forRoutes('{*splat}');
  }
}
