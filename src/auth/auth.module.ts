//? Imports de codigo
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

//? Imports de usuario
import { FIREBASE_AUTH, FirebaseConfigService, JwtConfigService } from '@configuration/security';

import { LoggerModule } from '@logger/logger.module';
import { UsersModule } from '@users/users.module';

import { AuthService } from '@auth/application/services';
import { JwtStrategy, JWT_STRATEGY } from '@auth/infrastructure/strategies';
import { JwtAuthGuard } from '@auth/infrastructure/guards';

@Module({
  imports: [
    //? Modules (UsersModule exporta USERS_REPOSITORY, que consume la JwtStrategy)
    LoggerModule,
    UsersModule,

    //? Security
    PassportModule.register({ defaultStrategy: JWT_STRATEGY }),
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  providers: [
    //? Services
    AuthService,

    //? Strategies
    JwtConfigService,
    JwtStrategy,

    //? Firebase Admin (verificación de los ID tokens de Firebase)
    FirebaseConfigService,
    {
      provide: FIREBASE_AUTH,
      useFactory: (firebaseConfigService: FirebaseConfigService) =>
        firebaseConfigService.createAuth(),
      inject: [FirebaseConfigService],
    },

    //* Guard global: toda ruta exige JWT salvo las marcadas con @PublicJwt()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],

  //? AuthService firma el token
  exports: [AuthService],
})
export class AuthModule {}
