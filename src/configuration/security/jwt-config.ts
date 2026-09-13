//? Imports de codigo
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

import { StringValue } from 'ms';

//? Imports de usuario
import { environmentsConfig } from '@configuration/env';

export class JwtConfigService implements JwtOptionsFactory {
  constructor(
    @Inject(environmentsConfig.KEY)
    private readonly configService: ConfigType<typeof environmentsConfig>,
  ) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      //? Indicates whether the module should be globally accessible through the app or not
      global: false,

      signOptions: {
        //? Algorithm used
        algorithm: 'HS256',

        //? Token lifetime
        expiresIn: this.configService.security.jwt
          .expiration_time as StringValue,

        //? Token recipient
        audience: this.configService.security.jwt.audience,

        //? The token header contains information about the signature type and algorithm used
        header: {
          typ: 'JWT',
          alg: 'HS256',
        },
      },

      verifyOptions: {
        //? Token lifetime
        algorithms: ['HS256'],

        //? Allows a tolerance in seconds for time verification in the token
        clockTolerance: 60,
      },

      //? Provides the security key used to sign and verify JWT tokens
      secret: this.configService.security.jwt.secret,

      //? Can be shared and used by anyone to encrypt information
      publicKey: this.configService.security.jwt.public_key,

      //? Used to decrypt encrypted information
      privateKey: this.configService.security.jwt.private_key,
    };
  }
}
