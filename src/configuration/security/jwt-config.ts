//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory, JwtSignOptions } from '@nestjs/jwt';

import { StringValue } from 'ms';

//? Imports de usuario
import { environmentsConfig } from '@configuration/env';

//? Algorithm used to sign and verify
const JWT_ALGORITHM: JwtSignOptions['algorithm'] = 'HS256';

//* Única fuente de configuración del JWT: la usan JwtModule (firma) y JwtStrategy (verificación)
@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(
    @Inject(environmentsConfig.KEY)
    private readonly configService: ConfigType<typeof environmentsConfig>,
  ) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      signOptions: {
        //? Algorithm used
        algorithm: JWT_ALGORITHM,

        //? Token lifetime
        expiresIn: this.configService.security.jwt.expiration_time as StringValue,

        //? Token recipient
        audience: this.configService.security.jwt.audience,
      },

      verifyOptions: {
        //? Algorithms accepted
        algorithms: [JWT_ALGORITHM],

        //? Token recipient must match the one used when signing
        audience: this.configService.security.jwt.audience,

        //? Allows a tolerance in seconds for time verification in the token
        clockTolerance: 60,
      },

      //? Provides the security key used to sign and verify JWT tokens
      secret: this.configService.security.jwt.secret,
    };
  }
}
