//? Imports de codigo
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

//? Imports de usuario
import { environmentsConfig } from '@configuration/env';

import { JwtPayload } from '@auth/domain/interfaces';
import { ValidateUserSessionUseCase } from '@auth/application/use-cases';

import { UserEntity } from '@users/domain/entities';

//* Cabecera HTTP de la que se extrae el token (sin prefijo `Bearer`)
export const JWT_AUTHORIZATION_HEADER = 'authorization';

//* Nombre con el que Passport registra la estrategia (lo consume el JwtAuthGuard)
export const JWT_STRATEGY = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(
    @Inject(environmentsConfig.KEY)
    configService: ConfigType<typeof environmentsConfig>,
    private readonly validateUserSessionUseCase: ValidateUserSessionUseCase,
  ) {
    super({
      secretOrKey: configService.security.jwt.secret,
      jwtFromRequest: ExtractJwt.fromHeader(JWT_AUTHORIZATION_HEADER),
      ignoreExpiration: false,
      algorithms: ['HS256'],
      audience: configService.security.jwt.audience,
      jsonWebTokenOptions: {
        //? Tolerancia en segundos para la verificación de tiempos (igual que JwtConfigService)
        clockTolerance: 60,
      },
    });
  }

  /**
   * Se ejecuta solo si la firma, expiración y audiencia del token son válidas.
   * Verifica la integridad del usuario en cada petición; lo que retorna se adjunta en `request.user`.
   */
  public async validate({ id }: JwtPayload): Promise<UserEntity> {
    return await this.validateUserSessionUseCase.execute(id);
  }
}
