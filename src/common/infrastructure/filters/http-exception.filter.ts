//? Imports de codigo
import { Request, Response } from 'express';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

//? Imports de usuario
import { FilterException } from '@common/infrastructure/interfaces';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter: HTTP_ADAPTER } = this.httpAdapterHost;

    const CTX = host.switchToHttp();
    const REQUEST = CTX.getRequest<Request>();
    const RESPONSE = CTX.getResponse<Response>();
    const STATUS_CODE = exception.getStatus();

    //? Si la respuesta ya ha sido enviada, no hacemos nada en el filtro
    if (RESPONSE.headersSent) return;

    const { url: URL, method: METHOD } = REQUEST;
    const {
      message: MESSAGE,
      name: NAME,
      stack: STACK,
      cause: CAUSE,
      ...additionalException
    } = exception;

    const BODY: FilterException = {
      message: MESSAGE,
      name: NAME,
      statusCode: STATUS_CODE,
      cause: CAUSE,
      method: METHOD,
      url: URL,
      timestamp: new Date().toISOString(),
      additionalException,
    };

    //? Agregar valores para desarrollo y debugging, si existen
    if (process.env.NODE_ENV !== 'production') {
      if (STACK) BODY.stack = STACK;
      if (CAUSE) BODY.cause = CAUSE;
    }

    return HTTP_ADAPTER.reply(RESPONSE, BODY, STATUS_CODE);
  }
}
