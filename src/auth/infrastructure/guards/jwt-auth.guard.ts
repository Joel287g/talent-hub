//? Imports de codigo
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

//? Imports de usuario
import { GuardsDecorators } from '@common/domain/enums';
import { BaseException } from '@common/domain/exceptions';
import { extractHeader } from '@common/infrastructure/helpers';

import { LoggerService } from '@logger/application/services';
import { LoggerJwt, LoggerTypes } from '@logger/domain/enums';

import { AuthErrors } from '@auth/domain/exceptions';
import { JWT_AUTHORIZATION_HEADER, JWT_STRATEGY } from '@auth/infrastructure/strategies';

//* Mensajes de jsonwebtoken para los subtipos de JsonWebTokenError
const JWT_ERROR_MESSAGES: Record<string, LoggerJwt> = {
  'invalid signature': LoggerJwt.INVALID_SIGNATURE,
  'jwt malformed': LoggerJwt.MALFORMED,
};

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGY) {
  private readonly CONTEXT = JwtAuthGuard.name;

  constructor(
    private readonly reflector: Reflector,
    private readonly loggerService: LoggerService,
  ) {
    super();
  }

  public canActivate(context: ExecutionContext) {
    const IS_PUBLIC = this.reflector.getAllAndOverride<boolean>(GuardsDecorators.IS_PUBLIC_JWT, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (IS_PUBLIC) return true;

    return super.canActivate(context);
  }

  public handleRequest<TUser>(
    err: unknown,
    user: TUser | false,
    info: Error | undefined,
    context: ExecutionContext,
  ): TUser {
    //* Errores de negocio lanzados en JwtStrategy.validate() (usuario inexistente o inactivo)
    if (err instanceof BaseException) throw err;

    if (err || !user) {
      const REQUEST = context.switchToHttp().getRequest();
      const MESSAGE = this.resolveMessage(info, !!extractHeader(REQUEST, JWT_AUTHORIZATION_HEADER));

      this.loggerService.warning(
        {
          type: LoggerTypes.JWT,
          message: MESSAGE,
          data: { url: REQUEST.url, method: REQUEST.method, error: (err as Error) ?? info },
        },
        this.CONTEXT,
      );

      throw AuthErrors.invalidToken('AUTH-INF-GUA-JWT_AUTH-001', err ?? info);
    }

    return user;
  }

  //? Traduce el error de passport-jwt / jsonwebtoken al mensaje de log correspondiente
  private resolveMessage(info: Error | undefined, hasToken: boolean): LoggerJwt {
    if (!hasToken) return LoggerJwt.NOT_FOUND;

    switch (info?.name) {
      case TokenExpiredError.name:
        return LoggerJwt.EXPIRED;
      case NotBeforeError.name:
        return LoggerJwt.NOT_BEFORE;
      case JsonWebTokenError.name:
        return JWT_ERROR_MESSAGES[info.message] ?? LoggerJwt.JSON_WEB_TOKEN;
      default:
        return LoggerJwt.ANOTHER;
    }
  }
}
