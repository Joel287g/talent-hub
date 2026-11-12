//? Imports de usuario
import { BaseException } from '@common/domain/exceptions/base-exception';
import { BaseErrorsInterface } from '@common/domain/exceptions/base-errors.interface';
import { BaseErrorsEnum } from '@common/infrastructure/enums';

/**
 * Fábrica abstracta de errores predeterminados.
 * Las clases hijas heredarán todos estos métodos cumpliendo el contrato.
 */
export abstract class BaseErrors implements BaseErrorsInterface {
  public badRequestException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-001',
    message: BaseErrorsEnum = BaseErrorsEnum.BAD_REQUEST,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 400, code, cause);
  }

  public unauthorizedException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-002',
    message: BaseErrorsEnum = BaseErrorsEnum.UNAUTHORIZED,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 401, code, cause);
  }

  public forbiddenException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-003',
    message: BaseErrorsEnum = BaseErrorsEnum.FORBIDDEN,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 403, code, cause);
  }

  public notFoundException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-004',
    message: BaseErrorsEnum = BaseErrorsEnum.NOT_FOUND,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 404, code, cause);
  }

  public methodNotAllowedException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-005',
    message: BaseErrorsEnum = BaseErrorsEnum.METHOD_NOT_ALLOWED,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 405, code, cause);
  }

  public notAcceptableException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-006',
    message: BaseErrorsEnum = BaseErrorsEnum.NOT_ACCEPTABLE,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 406, code, cause);
  }

  public requestTimeoutException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-007',
    message: BaseErrorsEnum = BaseErrorsEnum.REQUEST_TIMEOUT,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 408, code, cause);
  }

  public conflictException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-008',
    message: BaseErrorsEnum = BaseErrorsEnum.CONFLICT,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 409, code, cause);
  }

  public goneException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-009',
    message: BaseErrorsEnum = BaseErrorsEnum.GONE,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 410, code, cause);
  }

  public preconditionFailedException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-010',
    message: BaseErrorsEnum = BaseErrorsEnum.PRECONDITION_FAILED,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 412, code, cause);
  }

  public payloadTooLargeException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-011',
    message: BaseErrorsEnum = BaseErrorsEnum.PAYLOAD_TOO_LARGE,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 413, code, cause);
  }

  public unsupportedMediaTypeException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-012',
    message: BaseErrorsEnum = BaseErrorsEnum.UNSUPPORTED_MEDIA_TYPE,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 415, code, cause);
  }

  public imATeapotException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-013',
    message: BaseErrorsEnum = BaseErrorsEnum.IM_A_TEAPOT,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 418, code, cause);
  }

  public misdirectedException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-014',
    message: BaseErrorsEnum = BaseErrorsEnum.MIS_DIRECTED_REQUEST,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 421, code, cause);
  }

  public unprocessableEntityException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-015',
    message: BaseErrorsEnum = BaseErrorsEnum.UNPROCESSABLE_ENTITY,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 422, code, cause);
  }

  public internalServerErrorException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-016',
    message: BaseErrorsEnum = BaseErrorsEnum.INTERNAL_SERVER_ERROR,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 500, code, cause);
  }

  public notImplementedException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-017',
    message: BaseErrorsEnum = BaseErrorsEnum.NOT_IMPLEMENTED,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 501, code, cause);
  }

  public badGatewayException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-018',
    message: BaseErrorsEnum = BaseErrorsEnum.BAD_GATEWAY,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 502, code, cause);
  }

  public serviceUnavailableException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-019',
    message: BaseErrorsEnum = BaseErrorsEnum.SERVICE_UNAVAILABLE,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 503, code, cause);
  }

  public gatewayTimeoutException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-020',
    message: BaseErrorsEnum = BaseErrorsEnum.GATEWAY_TIMEOUT,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 504, code, cause);
  }

  public httpVersionNotSupportedException(
    code: string = 'COMM-DOM-EXC-BASE_ERRO-021',
    message: BaseErrorsEnum = BaseErrorsEnum.HTTP_VERSION_NOT_SUPPORTED,
    cause?: Error | unknown,
  ): BaseException {
    return new BaseException(message, 505, code, cause);
  }
}
