//? Imports de usuario
import { BaseErrorsEnum } from '@common/infrastructure/enums';

/**
 * Declaración global para la capacidad de capturar el rastro de pila de errores.
 */
declare global {
  /**
   * Extiende la interfaz de ErrorConstructor para incluir el método captureStackTrace.
   * @param {object} targetObject - El objeto de destino para el rastro de pila.
   * @param {Function} constructorOpt - Constructor opcional para excluir de la traza de pila.
   * @returns {void}
   */
  interface ErrorConstructor {
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
  }
}

/**
 * Clase base de error que hereda nativamente de Error.
 * Mantiene el Dominio agnóstico a NestJS o cualquier framework HTTP.
 *
 * @param {string} message - Mensaje de error.
 * @param {number} statusCode - Código de estado HTTP.
 * @param {string} code - Código de error personalizado.
 * @param {Error | unknown} cause - Causa del error (opcional).
 * @param {Record<string, any>} metadata - Información adicional sobre el error (opcional).
 * @returns {void}
 */
export class BaseException extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly cause?: Error | unknown;
  public readonly metadata?: Record<string, any>;

  constructor(
    message: BaseErrorsEnum,
    statusCode: number,
    code: string,
    cause?: Error | unknown,
    metadata?: Record<string, any>,
  ) {
    super(message, { cause });

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.metadata = metadata;
    this.code = code;
    this.cause = cause;

    Error.captureStackTrace(this, this.constructor);
  }
}
