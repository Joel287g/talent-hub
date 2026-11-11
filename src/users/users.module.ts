//? Imports de codigo
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//? Imports de usuario
import { USERS_REPOSITORY } from '@users/domain/repositories';

import { Users, UsersSchema } from '@users/infrastructure/persistence/schemas';
import { MongoDBUsersRepository } from '@users/infrastructure/persistence';
import { UsersController } from '@users/infrastructure/controllers';

import * as usersUseCases from '@users/application/use-cases';

@Module({
  imports: [MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
  controllers: [UsersController],
  providers: [
    //? Use cases
    ...Object.values(usersUseCases),

    {
      provide: USERS_REPOSITORY,
      useClass: MongoDBUsersRepository,
    },
  ],
  exports: [USERS_REPOSITORY],
})
export class UsersModule {}
