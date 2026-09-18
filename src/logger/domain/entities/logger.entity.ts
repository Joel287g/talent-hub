import { LoggerTypes, LoggerLevel } from '../enums';

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

export interface LoggerProps {
  type: LoggerTypes;
  level: LoggerLevel;
  message: string;
  data: LoggerMetadata;
}

export class LoggerEntity {
  private constructor(public readonly props: LoggerProps) {}
  
  public static create(props: LoggerProps): LoggerEntity {
    return new LoggerEntity(props);
  }
}