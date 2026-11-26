//? Imports de codigo
import { Injectable, NestMiddleware } from '@nestjs/common';

//? Imports de usuario
import { MethodsHttp } from '@common/domain/enums';
import { extractHeaders, redactSensitive } from '@common/infrastructure/helpers';

import { CreateSnifferUseCase } from '@sniffer/application/use-cases';
import { CreateSnifferType } from '@sniffer/domain/entities';

import { LoggerService } from '@logger/application/services';
import { LoggerTypes, LoggerLevel, LoggerSniffer } from '@logger/domain/enums';

//* Es un middleware (y no un interceptor) para registrar también lo que rechazan los guards
@Injectable()
export class SnifferMiddleware implements NestMiddleware {
  private readonly CONTEXT = SnifferMiddleware.name;

  constructor(
    private readonly createSnifferUseCase: CreateSnifferUseCase,
    private readonly loggerService: LoggerService,
  ) {}

  use(request: any, response: any, next: () => void): void {
    const NOW = Date.now();

    //? 1. Extracción de datos
    const HEADERS = request.headers;
    const [USER_AGENT, IP, IP_2, REFERER, APP_VERSION, AUTHORIZATION] = extractHeaders(request, [
      'user-agent',
      'client-ip',
      'x-forwarded-for',
      'referer',
      'app-version',
      'authorization',
    ]);

    const METHOD: MethodsHttp = request.method;
    const CONTENT = METHOD === MethodsHttp.GET ? 'query' : 'body';
    const BODY = request[CONTENT];

    //? 2. Atrapar el cuerpo de la respuesta (exitosa o de error) sin modificarlo
    let responseData: any = null;

    for (const SENDER of ['json', 'send']) {
      const ORIGINAL = response[SENDER].bind(response);

      response[SENDER] = (body?: any) => {
        //? `json` llama internamente a `send` con el texto: se conserva el primer valor
        responseData ??= body;
        return ORIGINAL(body);
      };
    }

    //? 3. Construcción inicial del registro (Sin statusCode ni processingTime aún)
    const SNIFFER: CreateSnifferType = {
      auth: AUTHORIZATION,
      url: request.originalUrl,
      ip: IP || IP_2 || request.ip || 'unknown',
      request: BODY,
      response: null,
      headers: HEADERS,
      method: METHOD,
      statusCode: 200,
      processingTime: 0,
      userAgent: USER_AGENT,
      referer: REFERER,
      appVersion: APP_VERSION || 'unknown',
    };

    //? 4. Escuchar el final real del ciclo de vida HTTP
    response.on('finish', () => {
      //? Usuario que la JwtStrategy adjunta tras validar el token (rutas protegidas)
      SNIFFER.userId = request.user?.id;
      SNIFFER.statusCode = response.statusCode;
      SNIFFER.processingTime = Date.now() - NOW;
      SNIFFER.response = redactSensitive(responseData);

      const IS_SUCCESS = response.statusCode >= 200 && response.statusCode < 400;

      //! Nunca registrar el original: contiene el token de sesión y la API key
      this.handleTelemetry(IS_SUCCESS, redactSensitive(SNIFFER));
    });

    next();
  }

  private handleTelemetry(isSuccess: boolean, sniffer: CreateSnifferType): void {
    const MESSAGE = isSuccess ? LoggerSniffer.SUCCESS : LoggerSniffer.FAILURE;
    const LOGGER_LEVEL = isSuccess
      ? String(LoggerLevel.LOG).toLowerCase()
      : String(LoggerLevel.ERROR).toLowerCase();

    //? 1. Guardar log (si falla el guardado no debe caer el servidor)
    this.loggerService[LOGGER_LEVEL](
      {
        type: LoggerTypes.SNIFFER,
        message: MESSAGE,
        data: sniffer,
      },
      this.CONTEXT,
    ).catch(() => undefined);

    //? 2. Guardar en BD
    this.createSnifferUseCase
      .execute(sniffer)
      .catch((ERROR) =>
        this.loggerService.error(
          {
            type: LoggerTypes.SNIFFER,
            message: LoggerSniffer.ERROR,
            data: { error: ERROR, sniffer },
          },
          this.CONTEXT,
        ),
      )
      .catch(() => undefined);
  }
}
