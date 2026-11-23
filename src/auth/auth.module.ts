//? Imports de codigo
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

//? Imports de usuario
import { JwtConfigService } from '@configuration/security';

import { LoggerModule } from '@logger/logger.module';
import { UsersModule } from '@users/users.module';

import { ValidateUserSessionUseCase } from '@auth/application/use-cases';
import { JwtStrategy, JWT_STRATEGY } from '@auth/infrastructure/strategies';
import { JwtAuthGuard } from '@auth/infrastructure/guards';

@Module({
  imports: [
    //? Modules
    LoggerModule,
    UsersModule,

    //? Security
    PassportModule.register({ defaultStrategy: JWT_STRATEGY }),
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  providers: [
    //? Use cases (consume USERS_REPOSITORY exportado por UsersModule)
    ValidateUserSessionUseCase,

    //? Strategies
    JwtStrategy,

    //* Guard global: toda ruta exige JWT salvo las marcadas con @PublicJwt()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],

  //? JwtModule se exporta para firmar el token en el futuro flujo de login
  exports: [JwtModule],
})
export class AuthModule {}
