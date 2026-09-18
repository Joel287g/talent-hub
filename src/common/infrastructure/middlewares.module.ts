//? Imports de codigo
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Global, Module } from '@nestjs/common';

//? Imports de usuario

//* Module
import { LoggerModule } from '@logger/logger.module';
import { SnifferModule } from '@sniffer/sniffer.module';

//* Interceptors
import { SnifferInterceptor } from '@common/infrastructure/interceptors';

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
    SnifferModule,
  ],

  controllers: [],

  providers: [
    //? Errors

    //? Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: SnifferInterceptor,
    },

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
