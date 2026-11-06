//? Imports de codigo
import { Request } from 'express';
import { mongo } from 'mongoose';

import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

//? Imports de usuario
import { Environments } from '@common/infrastructure/enums';
import { FilterException } from '../interfaces';

@Catch(mongo.MongoServerError)
export class MongooseExceptionFilter implements ExceptionFilter<mongo.MongoServerError> {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: mongo.MongoServerError, host: ArgumentsHost) {
    const { httpAdapter: HTTP_ADAPTER } = this.httpAdapterHost;
    const CTX = host.switchToHttp();
    const REQUEST = CTX.getRequest<Request>();
    const RESPONSE = CTX.getResponse();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    //! Prevenir fallos si la cabecera ya se mandó al cliente
    if (HTTP_ADAPTER.isHeadersSent(RESPONSE)) return;

    //* Extraemos contexto HTTP y propiedades del driver nativo
    const { url: URL, method: METHOD } = REQUEST;
    const { message: MESSAGE, name: NAME, stack: STACK, cause: CAUSE, ...additionalException } = exception;

    //* Traducción de códigos crudos de Mongo a HTTP Status semánticos
    switch (exception.code) {
      case 11000:
      case 11001:
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 2:
        statusCode = HttpStatus.NOT_FOUND;
        break;
      case 11007:
        statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        break;
      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    //* Armado del contrato final de respuesta
    const BODY: FilterException = {
      message: MESSAGE,
      name: NAME,
      statusCode: statusCode,
      method: METHOD,
      url: URL,
      timestamp: new Date().toISOString(),
      additionalException,
    };

    //! Filtrado de stack trace para proteger infraestructura
    if (process.env.NODE_ENV !== Environments.PRODUCTION) {
      if (STACK) BODY.stack = STACK;
      if (CAUSE) BODY.cause = CAUSE;
    }

    return HTTP_ADAPTER.reply(RESPONSE, BODY, statusCode);
  }
}