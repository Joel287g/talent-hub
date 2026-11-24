//? Imports de codigo
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

//? Imports de usuario
import { GuardsDecorators } from '@common/domain/enums';
import { extractHeader } from '@common/infrastructure/helpers';

import { LoggerService } from '@logger/application/services';
import { LoggerJwt, LoggerTypes } from '@logger/domain/enums';

import { AuthErrors } from '@auth/domain/exceptions';
import { JWT_AUTHORIZATION_HEADER, JWT_STRATEGY } from '@auth/infrastructure/strategies';

//? Código único que recibe el cliente según el motivo del rechazo
const JWT_ERROR_CODES: Partial<Record<LoggerJwt, string>> = {
  [LoggerJwt.NOT_FOUND]: 'AUTH-INF-GUA-JWT_AUTH-001',
  [LoggerJwt.EXPIRED]: 'AUTH-INF-GUA-JWT_AUTH-002',
  [LoggerJwt.NOT_BEFORE]: 'AUTH-INF-GUA-JWT_AUTH-003',
  [LoggerJwt.MALFORMED]: 'AUTH-INF-GUA-JWT_AUTH-004',
  [LoggerJwt.INVALID_SIGNATURE]: 'AUTH-INF-GUA-JWT_AUTH-005',
  [LoggerJwt.JSON_WEB_TOKEN]: 'AUTH-INF-GUA-JWT_AUTH-006',
  [LoggerJwt.ANOTHER]: 'AUTH-INF-GUA-JWT_AUTH-007',
};

//? Mensajes de jsonwebtoken para los subtipos de JsonWebTokenError
const JWT_ERROR_MESSAGES: Record<string, LoggerJwt> = {
  'invalid signature': LoggerJwt.INVALID_SIGNATURE,
  'jwt malformed': LoggerJwt.MALFORMED,
};

//? Motivos que se registran como error, el resto como warning
const ERROR_LOGS = [LoggerJwt.JSON_WEB_TOKEN, LoggerJwt.INVALID_SIGNATURE, LoggerJwt.ANOTHER];

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGY) {
  private readonly CONTEXT = JwtAuthGuard.name;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  public canActivate(context: ExecutionContext) {
    //? Comprueba si la ruta es pública
    const IS_PUBLIC = this.reflector.getAllAndOverride<boolean>(GuardsDecorators.IS_PUBLIC_JWT, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (IS_PUBLIC) return true;

    //* Ejecuta la JwtStrategy, que verifica el token y valida al usuario
    return super.canActivate(context);
  }

  /**
   * Recibe el resultado de la JwtStrategy; lo que retorna se adjunta en `request.user`.
   */
  public handleRequest<TUser>(
    err: Error | null,
    user: TUser | false,
    info: Error | undefined,
    context: ExecutionContext,
  ): TUser {
    //? Error lanzado en validate(): usuario inexistente o inactivo, o fallo de la base de datos
    if (err) throw err;

    if (user) return user;

    //? Token rechazado por passport-jwt
    const REQUEST = context.switchToHttp().getRequest();
    const MESSAGE = this.resolveMessage(info, extractHeader(REQUEST, JWT_AUTHORIZATION_HEADER));

    this.log(REQUEST, info, MESSAGE);

    throw AuthErrors.invalidToken(JWT_ERROR_CODES[MESSAGE], info);
  }

  //? Traduce el error de jsonwebtoken al mensaje de log correspondiente
  private resolveMessage(error: Error | undefined, token?: string): LoggerJwt {
    if (!token) return LoggerJwt.NOT_FOUND;

    switch (error?.name) {
      case TokenExpiredError.name:
        return LoggerJwt.EXPIRED;
      case NotBeforeError.name:
        return LoggerJwt.NOT_BEFORE;
      case JsonWebTokenError.name:
        return JWT_ERROR_MESSAGES[error.message] ?? LoggerJwt.JSON_WEB_TOKEN;
      default:
        return LoggerJwt.ANOTHER;
    }
  }

  //! No se registran las cabeceras: contienen el token y la API key
  private log(request: any, error: Error | undefined, message: LoggerJwt): void {
    const LEVEL = ERROR_LOGS.includes(message) ? 'error' : 'warning';

    this.loggerService[LEVEL](
      {
        type: LoggerTypes.JWT,
        message,
        data: {
          url: request.url,
          method: request.method,
          ip: request.ip,
          userAgent: extractHeader(request, 'user-agent'),
          error: { name: error?.name, message: error?.message },
        },
      },
      this.CONTEXT,
    ).catch(() => undefined); //* Si falla el guardado del log no debe caer el servidor
  }
}
