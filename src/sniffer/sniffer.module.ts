//? Imports de codigo
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//? Imports de usuario
import { SNIFFER_REPOSITORY } from '@sniffer/domain/repositories';
import { Sniffer, SnifferSchema } from '@sniffer/infrastructure/persistence/schemas';
import { MongoDBSnifferRepository } from '@sniffer/infrastructure/persistence';
import * as snifferUseCases from '@sniffer/application/use-cases';

@Module({
  imports: [MongooseModule.forFeature([{ name: Sniffer.name, schema: SnifferSchema }])],
  providers: [
    //? Use cases
    ...Object.values(snifferUseCases),

    {
      provide: SNIFFER_REPOSITORY,
      useClass: MongoDBSnifferRepository,
    },
  ],
  exports: [SNIFFER_REPOSITORY, ...Object.values(snifferUseCases)],
})
export class SnifferModule {}
