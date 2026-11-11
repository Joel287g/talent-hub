//? Imports de usuario
import { BaseException } from '@common/domain/exceptions/base-exception';

export interface BaseErrorsInterface {
  badRequestException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  unauthorizedException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  notFoundException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  forbiddenException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  methodNotAllowedException(
    code?: string,
    message?: string,
    cause?: Error | unknown,
  ): BaseException;
  notAcceptableException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  requestTimeoutException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  conflictException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  goneException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  preconditionFailedException(
    code?: string,
    message?: string,
    cause?: Error | unknown,
  ): BaseException;
  payloadTooLargeException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  unsupportedMediaTypeException(
    code?: string,
    message?: string,
    cause?: Error | unknown,
  ): BaseException;
  imATeapotException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  misdirectedException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  unprocessableEntityException(
    code?: string,
    message?: string,
    cause?: Error | unknown,
  ): BaseException;
  internalServerErrorException(
    code?: string,
    message?: string,
    cause?: Error | unknown,
  ): BaseException;
  notImplementedException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  badGatewayException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  serviceUnavailableException(
    code?: string,
    message?: string,
    cause?: Error | unknown,
  ): BaseException;
  gatewayTimeoutException(code?: string, message?: string, cause?: Error | unknown): BaseException;
  httpVersionNotSupportedException(
    code?: string,
    message?: string,
    cause?: Error | unknown,
  ): BaseException;
}
