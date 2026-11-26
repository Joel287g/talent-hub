//? Imports de usuario
import { LoggerLevel, LoggerMessage, LoggerTypes } from '@logger/domain/enums';

export interface LoggerInterface {
  type: LoggerTypes;
  level: LoggerLevel;
  message: LoggerMessage;
  //* Contexto libre del registro: cada origen (sniffer, JWT, ...) guarda los datos que necesita
  data: Record<string, unknown>;
}

export type CreateLoggerType = LoggerInterface;

//* Lo que reciben los métodos de `LoggerService`: el nivel lo fija el método invocado (`error`, `log`, ...)
export type CreateLoggerPayloadType = Omit<CreateLoggerType, 'level'>;

export class LoggerEntity {
  private constructor(public readonly props: LoggerInterface) {}

  public static create(payload: CreateLoggerType): LoggerEntity {
    return new LoggerEntity({
      data: payload.data,
      level: payload.level,
      message: payload.message,
      type: payload.type,
    });
  }
}
