//? Imports de codigo
import { Request, Response } from 'express';
import { mongo } from 'mongoose';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

//? Imports de usuario
import { FilterException } from '@common/infrastructure/interfaces';

@Catch(mongo.MongoServerError)
export class MongooseExceptionFilter implements ExceptionFilter<mongo.MongoServerError> {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: mongo.MongoServerError, host: ArgumentsHost) {
    const { httpAdapter: HTTP_ADAPTER } = this.httpAdapterHost;

    const CTX = host.switchToHttp();
    const REQUEST = CTX.getRequest<Request>();
    const RESPONSE = CTX.getResponse<Response>();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

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

    const BODY: FilterException = {
      message: MESSAGE,
      name: NAME,
      statusCode: statusCode,
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

    return HTTP_ADAPTER.reply(RESPONSE, BODY, statusCode);
  }
}
