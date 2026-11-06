//? Imports de codigo
import { Request } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

//? Imports de usuario
import { FilterException } from '../interfaces';

@Catch()
export class GeneralExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const { httpAdapter: HTTP_ADAPTER } = this.httpAdapterHost;
    const CTX = host.switchToHttp();
    const REQUEST = CTX.getRequest<Request>();
    const RESPONSE = CTX.getResponse();

    //! Evitar respuestas dobles
    if (HTTP_ADAPTER.isHeadersSent(RESPONSE)) return;

    //* Este cajón de sastre siempre responderá 500
    const STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
    const { url: URL, method: METHOD } = REQUEST;

    //* Extracción defensiva asumiendo un objeto genérico o desconocido
    const ERROR = exception as Record<string, any>;
    const MESSAGE = ERROR?.message ?? 'Ocurrió un error inesperado en el servidor';
    const NAME = ERROR?.name ?? 'InternalServerError';
    const STACK = ERROR?.stack;
    const CAUSE = ERROR?.cause;

    //* Generación estricta de la estructura de error
    const BODY: FilterException = {
      message: MESSAGE,
      name: NAME,
      statusCode: STATUS_CODE,
      method: METHOD,
      url: URL,
      timestamp: new Date().toISOString(),
    };

    //! Solo adjuntamos contexto técnico en modo desarrollo
    if (process.env.NODE_ENV !== 'production') {
      if (STACK) BODY.stack = STACK;
      if (CAUSE) BODY.cause = CAUSE;
    }

    HTTP_ADAPTER.reply(RESPONSE, BODY, STATUS_CODE);
  }
}