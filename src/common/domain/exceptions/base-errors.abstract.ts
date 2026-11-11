//? Imports de usuario
import { BaseException } from '@common/domain/exceptions/base-exception';
import { BaseErrorsInterface } from '@common/domain/exceptions/base-errors.interface';

/**
 * Fábrica abstracta de errores predeterminados.
 * Las clases hijas heredarán todos estos métodos cumpliendo el contrato.
 */
export abstract class BaseErrors implements BaseErrorsInterface {
  public badRequestException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-001',
    message: string = 'La petición no es válida.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 400, code, cause);
  }

  public unauthorizedException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-002',
    message: string = 'No está autorizado para realizar esta acción.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 401, code, cause);
  }

  public forbiddenException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-003',
    message: string = 'Acceso denegado a este recurso.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 403, code, cause);
  }

  public notFoundException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-004',
    message: string = 'El recurso solicitado no fue encontrado.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 404, code, cause);
  }

  public methodNotAllowedException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-005',
    message: string = 'Método no permitido.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 405, code, cause);
  }

  public notAcceptableException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-006',
    message: string = 'La petición no es aceptable.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 406, code, cause);
  }

  public requestTimeoutException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-007',
    message: string = 'Tiempo de espera agotado para la petición.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 408, code, cause);
  }

  public conflictException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-008',
    message: string = 'Existe un conflicto con el estado actual del recurso.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 409, code, cause);
  }

  public goneException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-009',
    message: string = 'El recurso ya no está disponible.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 410, code, cause);
  }

  public preconditionFailedException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-010',
    message: string = 'Fallo en la precondición.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 412, code, cause);
  }

  public payloadTooLargeException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-011',
    message: string = 'La carga útil de la petición es demasiado grande.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 413, code, cause);
  }

  public unsupportedMediaTypeException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-012',
    message: string = 'Tipo de medio no soportado.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 415, code, cause);
  }

  public imATeapotException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-013',
    message: string = 'Soy una tetera.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 418, code, cause);
  }

  public misdirectedException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-014',
    message: string = 'Petición mal dirigida.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 421, code, cause);
  }

  public unprocessableEntityException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-015',
    message: string = 'No se pudo procesar la entidad.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 422, code, cause);
  }

  public internalServerErrorException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-016',
    message: string = 'Error interno del servidor.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 500, code, cause);
  }

  public notImplementedException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-017',
    message: string = 'Funcionalidad no implementada.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 501, code, cause);
  }

  public badGatewayException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-018',
    message: string = 'Puerta de enlace no válida.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 502, code, cause);
  }

  public serviceUnavailableException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-019',
    message: string = 'Servicio no disponible.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 503, code, cause);
  }

  public gatewayTimeoutException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-020',
    message: string = 'Tiempo de espera agotado en la puerta de enlace.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 504, code, cause);
  }

  public httpVersionNotSupportedException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-021',
    message: string = 'Versión HTTP no soportada.',
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 505, code, cause);
  }
}
