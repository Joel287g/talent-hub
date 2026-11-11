//? Imports de codigo
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

//? Imports de usuario
import { extractHeaders } from '@common/infrastructure/helpers';

import { CreateSnifferUseCase } from '@sniffer/application/use-cases';
import { CreateSnifferDto } from '@sniffer/application/dtos';

import { LoggerService } from '@logger/application/services';
import { LoggerTypes, LoggerLevel, LoggerSniffer } from '@logger/domain/enums';

@Injectable()
export class SnifferInterceptor implements NestInterceptor {
  private readonly CONTEXT = SnifferInterceptor.name;

  constructor(
    private readonly createSnifferUseCase: CreateSnifferUseCase,
    private readonly loggerService: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const NOW = Date.now();
    const CTX = context.switchToHttp();
    const REQUEST = CTX.getRequest();
    const RESPONSE = CTX.getResponse();

    //? 1. Extracción de datos
    const HEADERS = REQUEST.headers;
    const [USER_AGENT, IP, IP_2, REFERER, APP_VERSION, AUTHORIZATION] = extractHeaders(REQUEST, [
      'user-agent',
      'client-ip',
      'x-forwarded-for',
      'referer',
      'app-version',
      'authorization',
    ]);

    const METHOD = REQUEST.method;
    const CONTENT = METHOD === 'GET' ? 'query' : 'body';
    const BODY = REQUEST[CONTENT];

    //? Variables temporales para atrapar la respuesta o el error del flujo RxJS
    let responseData: any = null;
    let errorData: any = null;

    //? 2. Construcción inicial del DTO (Sin statusCode ni processingTime aún)
    const SNIFFER: CreateSnifferDto = {
      auth: AUTHORIZATION,
      url: [REQUEST.url, REQUEST.baseUrl].join(''),
      ip: IP || IP_2 || REQUEST.ip || 'unknown',
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

    //? 3. Escuchar el final real del ciclo de vida HTTP
    RESPONSE.on('finish', () => {
      SNIFFER.statusCode = RESPONSE.statusCode;
      SNIFFER.processingTime = Date.now() - NOW;
      SNIFFER.response = errorData || responseData;

      const IS_SUCCESS = RESPONSE.statusCode >= 200 && RESPONSE.statusCode < 400;

      this.handleTelemetry(IS_SUCCESS, SNIFFER);
    });

    //? 4. Manejo del flujo asíncrono con RxJS (Solo atrapa datos, no loguea)
    return next.handle().pipe(
      tap((RESPONSE_BODY) => {
        responseData = RESPONSE_BODY;
      }),
      catchError((ERROR) => {
        errorData = ERROR;
        return throwError(() => ERROR);
      }),
    );
  }

  private handleTelemetry(isSuccess: boolean, sniffer: CreateSnifferDto): void {
    const MESSAGE = isSuccess ? LoggerSniffer.SUCCESS : LoggerSniffer.FAILURE;
    const LOGGER_LEVEL = isSuccess
      ? String(LoggerLevel.LOG).toLowerCase()
      : String(LoggerLevel.ERROR).toLowerCase();

    //? 1. Guardar log
    this.loggerService[LOGGER_LEVEL](
      {
        type: LoggerTypes.SNIFFER,
        message: MESSAGE,
        data: sniffer,
      },
      this.CONTEXT,
    );

    //? 2. Guardar en BD
    this.createSnifferUseCase.execute(sniffer).catch((ERROR) => {
      this.loggerService.error(
        {
          type: LoggerTypes.SNIFFER,
          message: LoggerSniffer.ERROR,
          data: { error: ERROR, sniffer },
        },
        this.CONTEXT,
      );
    });
  }
}
