//? Imports de usuario
import { BaseException } from '@common/domain/exceptions/base-exception';

export interface BaseErrorsInterface {
  badRequestException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  unauthorizedException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  notFoundException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  forbiddenException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  methodNotAllowedException(
    message?: string,
    code?: string,
    cause?: Error | unknown,
  ): BaseException;
  notAcceptableException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  requestTimeoutException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  conflictException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  goneException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  preconditionFailedException(
    message?: string,
    code?: string,
    cause?: Error | unknown,
  ): BaseException;
  payloadTooLargeException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  unsupportedMediaTypeException(
    message?: string,
    code?: string,
    cause?: Error | unknown,
  ): BaseException;
  imATeapotException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  misdirectedException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  unprocessableEntityException(
    message?: string,
    code?: string,
    cause?: Error | unknown,
  ): BaseException;
  internalServerErrorException(
    message?: string,
    code?: string,
    cause?: Error | unknown,
  ): BaseException;
  notImplementedException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  badGatewayException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  serviceUnavailableException(
    message?: string,
    code?: string,
    cause?: Error | unknown,
  ): BaseException;
  gatewayTimeoutException(message?: string, code?: string, cause?: Error | unknown): BaseException;
  httpVersionNotSupportedException(
    message?: string,
    code?: string,
    cause?: Error | unknown,
  ): BaseException;
}
