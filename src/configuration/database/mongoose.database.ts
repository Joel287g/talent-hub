//? Imports de codigo
import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { MongooseError } from 'mongoose';

//? Imports de usuario
import { environmentsConfig } from '@configuration/env';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(
    @Inject(environmentsConfig.KEY)
    private readonly configService: ConfigType<typeof environmentsConfig>,
  ) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      dbName: this.configService.database.name,
      uri: this.configService.database.uri,
      retryAttempts: 3,
      retryDelay: 3000,
      lazyConnection: true,
      verboseRetryLog: true,

      //? Connection succesfully
      connectionFactory: (connection: any) => {
        return connection;
      },

      //? Connection failure
      connectionErrorFactory: (error: MongooseError) => {
        throw new ServiceUnavailableException(error);
      },
    };
  }
}
