import { LoggerCreateDto } from '@logger/application/dtos';
import { LoggerLevel, LoggerTypes } from '@logger/domain/enums';

export interface LoggerMetadata {
  url: string;
  ip: string;
  request: Record<string, any>;
  headers: Record<string, string>;
  method: string;
  userAgent: string;
  referer: string;
  appVersion: string;
  apiKey: string;
  error?: Record<string, any>;
}

export interface LoggerInterface {
  type: LoggerTypes;
  level: LoggerLevel;
  message: string;
  data: LoggerMetadata;
}

export class LoggerEntity {
  private constructor(public readonly props: LoggerInterface) {}

  public static create(payload: LoggerCreateDto): LoggerEntity {
    return new LoggerEntity({
      data: payload.data,
      level: payload.level,
      message: payload.message,
      type: payload.type
    });
  }
}
