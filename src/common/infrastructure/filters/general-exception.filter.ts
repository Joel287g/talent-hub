//? Imports de codigo
import { Request, Response } from 'express';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

//? Imports de usuario
import { FilterException } from '@common/infrastructure/interfaces';

@Catch()
export class GeneralExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const { httpAdapter: HTTP_ADAPTER } = this.httpAdapterHost;

    const CTX = host.switchToHttp();
    const REQUEST = CTX.getRequest<Request>();
    const RESPONSE = CTX.getResponse<Response>();

    //? Si la respuesta ya ha sido enviada, no hacemos nada en el filtro
    if (RESPONSE.headersSent) return;

    const STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
    const { url: URL, method: METHOD } = REQUEST;

    //? Extracción directa con fallbacks seguros por defecto
    const ERROR = exception as Record<string, any>;
    const MESSAGE =
      ERROR?.message ?? 'Ocurrió un error inesperado en el servidor';
    const NAME = ERROR?.name ?? 'InternalServerError';
    const STACK = ERROR?.stack;
    const CAUSE = ERROR?.cause;

    //? Respuesta limpia y segura para el cliente
    const BODY: FilterException = {
      message: MESSAGE,
      name: NAME,
      statusCode: STATUS_CODE,
      method: METHOD,
      url: URL,
      timestamp: new Date().toISOString(),
    };

    //? Agregar valores para desarrollo y debugging, si existen
    if (process.env.NODE_ENV !== 'production') {
      if (STACK) BODY.stack = STACK;
      if (CAUSE) BODY.cause = CAUSE;
    }

    HTTP_ADAPTER.reply(RESPONSE, BODY, STATUS_CODE);
  }
}
