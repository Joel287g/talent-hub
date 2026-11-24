//? Imports de codigo
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

//? Imports de usuario
import { JwtConfigService } from '@configuration/security';

import { AuthErrors } from '@auth/domain/exceptions';
import { JwtPayload } from '@auth/domain/interfaces';

import { UserEntity } from '@users/domain/entities';
import { USERS_REPOSITORY, UsersRepository } from '@users/domain/repositories';

//* Cabecera HTTP de la que se extrae el token (sin prefijo `Bearer`)
export const JWT_AUTHORIZATION_HEADER = 'authorization';

//* Nombre con el que Passport registra la estrategia (lo consume el JwtAuthGuard)
export const JWT_STRATEGY = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(
    jwtConfigService: JwtConfigService,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {
    const { secret, verifyOptions } = jwtConfigService.createJwtOptions();

    super({
      secretOrKey: secret as string,
      jwtFromRequest: ExtractJwt.fromHeader(JWT_AUTHORIZATION_HEADER),

      //! passport-jwt ignora estos dos valores si solo van dentro de jsonWebTokenOptions
      algorithms: verifyOptions.algorithms,
      audience: verifyOptions.audience as string,

      jsonWebTokenOptions: verifyOptions,
    });
  }

  /**
   * Se ejecuta solo si la firma, expiración y audiencia del token son válidas.
   * Verifica la integridad del usuario en cada petición; lo que retorna se adjunta en `request.user`.
   */
  public async validate({ id }: JwtPayload): Promise<UserEntity> {
    const USER = await this.usersRepository.findById(id);

    if (!USER) throw AuthErrors.invalidSession('AUTH-INF-STR-JWT-001');

    if (!USER.isActive()) throw AuthErrors.inactiveUser('AUTH-INF-STR-JWT-002');

    return USER;
  }
}
