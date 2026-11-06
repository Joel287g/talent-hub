//? Imports de usuario
import { BaseException } from '@common/domain/exceptions/base-exception';
import { BaseErrorsInterface } from '@common/domain/exceptions/base-errors.interface';

/**
 * Fábrica abstracta de errores predeterminados.
 * Las clases hijas heredarán todos estos métodos cumpliendo el contrato.
 */
export abstract class BaseErrors implements BaseErrorsInterface {
 public badRequestException(message: string = 'La petición no es válida.', code: string = 'COMM-DOM-EXC-BASE_ERRO-001', cause?: Error | unknown): BaseException {
  return new BaseException(message, 400, code, cause);
 }

 public unauthorizedException(message: string = 'No está autorizado para realizar esta acción.', code: string = 'COMM-DOM-EXC-BASE_ERRO-002', cause?: Error | unknown): BaseException {
  return new BaseException(message, 401, code, cause);
 }

 public forbiddenException(message: string = 'Acceso denegado a este recurso.', code: string = 'COMM-DOM-EXC-BASE_ERRO-003', cause?: Error | unknown): BaseException {
  return new BaseException(message, 403, code, cause);
 }

 public notFoundException(message: string = 'El recurso solicitado no fue encontrado.', code: string = 'COMM-DOM-EXC-BASE_ERRO-004', cause?: Error | unknown): BaseException {
  return new BaseException(message, 404, code, cause);
 }

 public methodNotAllowedException(message: string = 'Método no permitido.', code: string = 'COMM-DOM-EXC-BASE_ERRO-005', cause?: Error | unknown): BaseException {
  return new BaseException(message, 405, code, cause);
 }

 public notAcceptableException(message: string = 'La petición no es aceptable.', code: string = 'COMM-DOM-EXC-BASE_ERRO-006', cause?: Error | unknown): BaseException {
  return new BaseException(message, 406, code, cause);
 }

 public requestTimeoutException(message: string = 'Tiempo de espera agotado para la petición.', code: string = 'COMM-DOM-EXC-BASE_ERRO-007', cause?: Error | unknown): BaseException {
  return new BaseException(message, 408, code, cause);
 }

 public conflictException(message: string = 'Existe un conflicto con el estado actual del recurso.', code: string = 'COMM-DOM-EXC-BASE_ERRO-008', cause?: Error | unknown): BaseException {
  return new BaseException(message, 409, code, cause);
 }

 public goneException(message: string = 'El recurso ya no está disponible.', code: string = 'COMM-DOM-EXC-BASE_ERRO-009', cause?: Error | unknown): BaseException {
  return new BaseException(message, 410, code, cause);
 }

 public preconditionFailedException(message: string = 'Fallo en la precondición.', code: string = 'COMM-DOM-EXC-BASE_ERRO-010', cause?: Error | unknown): BaseException {
  return new BaseException(message, 412, code, cause);
 }

 public payloadTooLargeException(message: string = 'La carga útil de la petición es demasiado grande.', code: string = 'COMM-DOM-EXC-BASE_ERRO-011', cause?: Error | unknown): BaseException {
  return new BaseException(message, 413, code, cause);
 }

 public unsupportedMediaTypeException(message: string = 'Tipo de medio no soportado.', code: string = 'COMM-DOM-EXC-BASE_ERRO-012', cause?: Error | unknown): BaseException {
  return new BaseException(message, 415, code, cause);
 }

 public imATeapotException(message: string = 'Soy una tetera.', code: string = 'COMM-DOM-EXC-BASE_ERRO-013', cause?: Error | unknown): BaseException {
  return new BaseException(message, 418, code, cause);
 }

 public misdirectedException(message: string = 'Petición mal dirigida.', code: string = 'COMM-DOM-EXC-BASE_ERRO-014', cause?: Error | unknown): BaseException {
  return new BaseException(message, 421, code, cause);
 }

 public unprocessableEntityException(message: string = 'No se pudo procesar la entidad.', code: string = 'COMM-DOM-EXC-BASE_ERRO-015', cause?: Error | unknown): BaseException {
  return new BaseException(message, 422, code, cause);
 }

 public internalServerErrorException(message: string = 'Error interno del servidor.', code: string = 'COMM-DOM-EXC-BASE_ERRO-016', cause?: Error | unknown): BaseException {
  return new BaseException(message, 500, code, cause);
 }

 public notImplementedException(message: string = 'Funcionalidad no implementada.', code: string = 'COMM-DOM-EXC-BASE_ERRO-017', cause?: Error | unknown): BaseException {
  return new BaseException(message, 501, code, cause);
 }

 public badGatewayException(message: string = 'Puerta de enlace no válida.', code: string = 'COMM-DOM-EXC-BASE_ERRO-018', cause?: Error | unknown): BaseException {
  return new BaseException(message, 502, code, cause);
 }

 public serviceUnavailableException(message: string = 'Servicio no disponible.', code: string = 'COMM-DOM-EXC-BASE_ERRO-019', cause?: Error | unknown): BaseException {
  return new BaseException(message, 503, code, cause);
 }

 public gatewayTimeoutException(message: string = 'Tiempo de espera agotado en la puerta de enlace.', code: string = 'COMM-DOM-EXC-BASE_ERRO-020', cause?: Error | unknown): BaseException {
  return new BaseException(message, 504, code, cause);
 }

 public httpVersionNotSupportedException(message: string = 'Versión HTTP no soportada.', code: string = 'COMM-DOM-EXC-BASE_ERRO-021', cause?: Error | unknown): BaseException {
  return new BaseException(message, 505, code, cause);
 }
}