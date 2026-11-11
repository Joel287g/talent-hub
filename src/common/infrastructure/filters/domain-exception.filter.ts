//? Imports de codigo
import { Request } from 'express';

import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

//? Imports de usuario
import { Environments } from '@common/infrastructure/enums';
import { BaseException } from '@common/domain/exceptions';
import { FilterException } from '@common/infrastructure/interfaces/filters-exceptions.interfaces';

@Catch(BaseException)
export class DomainExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: BaseException, host: ArgumentsHost) {
    const { httpAdapter: HTTP_ADAPTER } = this.httpAdapterHost;
    const CTX = host.switchToHttp();
    const REQUEST = CTX.getRequest<Request>();
    const RESPONSE = CTX.getResponse();

    //! Si la respuesta ya ha sido enviada, evitamos colisiones
    if (HTTP_ADAPTER.isHeadersSent(RESPONSE)) return;

    console.log('DomainExceptionFilter', exception);

    //* Extracción de propiedades nativas y de dominio
    const STATUS_CODE = exception.statusCode || 500;
    const { url: URL, method: METHOD } = REQUEST;

    //* Construcción del contrato estricto FilterException
    const BODY: FilterException = {
      message: exception.message,
      name: exception.name,
      statusCode: STATUS_CODE,
      method: METHOD,
      url: URL,
      timestamp: new Date().toISOString(),
      additionalException: {
        code: exception.code,
        metadata: exception.metadata || null,
      },
    };

    //! Por motivos de seguridad, stack y cause solo se exponen en desarrollo
    if (process.env.NODE_ENV !== Environments.PRODUCTION) {
      if (exception.stack) BODY.stack = exception.stack;
      if (exception.cause) BODY.cause = exception.cause;
    }

    return HTTP_ADAPTER.reply(RESPONSE, BODY, STATUS_CODE);
  }
}