export interface FilterException {
  message: string;
  name: string;
  statusCode: number;
  method: string;
  url: string;
  timestamp: string;
  additionalException?: unknown;
  stack?: string;
  cause?: unknown;
}
