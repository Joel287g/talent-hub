//? Imports de codigo
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Global, Module } from '@nestjs/common';

//? Imports de usuario

//* Module
import { LoggerModule } from '@logger/logger.module';

//* Interceptors

//* Guards

//* Filters
import {
  GeneralExceptionsFilter,
  HttpExceptionFilter,
  MongooseExceptionFilter,
} from '@common/infrastructure/filters';

@Global()
@Module({
  imports: [
    //? Modules
    LoggerModule,
  ],

  controllers: [],

  providers: [
    //? Errors

    //? Interceptors

    //? Guards

    //? Filters
    {
      provide: APP_FILTER,
      useClass: GeneralExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongooseExceptionFilter,
    },
  ],
})
export class MiddlewaresModule {}
