//? Imports de codigo
import { Request } from 'express';

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

//? Imports de usuario
import { Environments } from '@common/infrastructure/enums';
import { FilterException } from '@common/infrastructure/interfaces';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter: HTTP_ADAPTER } = this.httpAdapterHost;
    const CTX = host.switchToHttp();
    const REQUEST = CTX.getRequest<Request>();
    const RESPONSE = CTX.getResponse();

    //! Si la respuesta ya ha sido enviada, abortamos el filtro
    if (HTTP_ADAPTER.isHeadersSent(RESPONSE)) return;

    //* Extracción del estado y de los datos de la petición
    const STATUS_CODE = exception.getStatus();
    const { url: URL, method: METHOD } = REQUEST;

    //* Separamos propiedades base de la excepción de NestJS
    const { message: MESSAGE, name: NAME, stack: STACK, cause: CAUSE, ...additionalException } = exception;

    //* Construcción del body bajo el estándar
    const BODY: FilterException = {
      message: MESSAGE,
      name: NAME,
      statusCode: STATUS_CODE,
      method: METHOD,
      url: URL,
      timestamp: new Date().toISOString(),
      additionalException,
    };

    //! Entorno seguro: inyectamos telemetría técnica solo fuera de producción
    if (process.env.NODE_ENV !== Environments.PRODUCTION) {
      if (STACK) BODY.stack = STACK;
      if (CAUSE) BODY.cause = CAUSE;
    }

    return HTTP_ADAPTER.reply(RESPONSE, BODY, STATUS_CODE);
  }
}