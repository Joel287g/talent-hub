//? Imports de codigo
import { HttpStatus } from '@nestjs/common';

//? Imports de usuario
import { MethodsHttp } from '@common/infrastructure/enums';
import { CreateSnifferDto } from '@sniffer/application/dtos';

export interface SnifferInterface {
  id?: string | null;
  auth?: string;
  userId?: string;
  url: string;
  ip: string;
  request: any;
  response?: any;
  headers?: any;
  method: MethodsHttp;
  statusCode: HttpStatus;
  processingTime: number;
  userAgent?: string;
  referer?: string;
  appVersion: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SnifferEntity {
  private readonly _id?: string | null;
  private readonly _auth?: string;
  private readonly _userId?: string;
  private readonly _url: string;
  private readonly _ip: string;
  private readonly _request: any;
  private readonly _response?: any;
  private readonly _headers?: any;
  private readonly _method: MethodsHttp;
  private readonly _statusCode: number;
  private readonly _processingTime: number;
  private readonly _userAgent?: string;
  private readonly _referer?: string;
  private readonly _appVersion: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(sniffer: SnifferInterface) {
    this._auth = sniffer.auth;
    this._userId = sniffer.userId;
    this._url = sniffer.url;
    this._ip = sniffer.ip;
    this._request = sniffer.request;
    this._response = sniffer.response;
    this._headers = sniffer.headers;
    this._method = sniffer.method;
    this._statusCode = sniffer.statusCode;
    this._processingTime = sniffer.processingTime;
    this._userAgent = sniffer.userAgent;
    this._referer = sniffer.referer;
    this._appVersion = sniffer.appVersion;
    this._createdAt = sniffer.createdAt ?? new Date();
    this._updatedAt = sniffer.updatedAt ?? new Date();
  }

  //? Getters
  public get id(): string | null | undefined {
    return this._id;
  }
  public get auth(): string | undefined {
    return this._auth;
  }
  public get userId(): string | undefined {
    return this._userId;
  }
  public get url(): string {
    return this._url;
  }
  public get ip(): string {
    return this._ip;
  }
  public get request(): any {
    return this._request;
  }
  public get response(): any | undefined {
    return this._response;
  }
  public get headers(): any | undefined {
    return this._headers;
  }
  public get method(): MethodsHttp {
    return this._method;
  }
  public get statusCode(): number {
    return this._statusCode;
  }
  public get processingTime(): number {
    return this._processingTime;
  }
  public get userAgent(): string | undefined {
    return this._userAgent;
  }
  public get referer(): string | undefined {
    return this._referer;
  }
  public get appVersion(): string {
    return this._appVersion;
  }
  public get createdAt(): Date | undefined {
    return this._createdAt;
  }
  public get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  //? Methods static
  public static create(sniffer: CreateSnifferDto): SnifferEntity {
    return new SnifferEntity({
      auth: sniffer.auth,
      userId: sniffer.userId,
      url: sniffer.url,
      ip: sniffer.ip,
      request: sniffer.request,
      response: sniffer.response,
      headers: sniffer.headers,
      method: sniffer.method,
      statusCode: sniffer.statusCode,
      processingTime: sniffer.processingTime,
      userAgent: sniffer.userAgent,
      referer: sniffer.referer,
      appVersion: sniffer.appVersion,
    });
  }
}
