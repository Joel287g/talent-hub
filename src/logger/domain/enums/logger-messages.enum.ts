export enum LoggerSniffer {
  ERROR = 'ERROR_SNIFFER_REQUEST',
  SUCCESS = 'Request received success result',
  FAILURE = 'Request received failed result',
}

export enum LoggerApiKey {
  ERROR = 'ERROR_API-KEY_REQUEST',
  NOT_FOUND = 'Request received without api key',
  INVALID = 'Request received with incorrect API key',
}

export enum LoggerJwt {
  NOT_FOUND = 'JWT not found in the request',
  EXPIRED = 'Expired JWT token',
  NOT_BEFORE = 'JWT token not yet reached its start date',
  JSON_WEB_TOKEN = 'Error processing the JWT token',
  MALFORMED = 'Malformed JWT token',
  ANOTHER = 'Another type of error with the JWT token',
  INVALID_SIGNATURE = 'Has an invalid signature',
}

//* Cualquier mensaje admitido en el registro (el schema de `logger` solo acepta estos valores)
export type LoggerMessage = LoggerSniffer | LoggerApiKey | LoggerJwt;
