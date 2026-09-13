//? Imports de codigo
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export class CorsSecurityConfig {
  private corsOptions: CorsOptions;

  constructor() {
    this.corsOptions = {
      //? Specifies the allowed origins for making requests. You can specify a single origin or an array of origins.
      origin: [],

      //? Defines the HTTP methods allowed for all routes. You can specify a single method or an array of methods.
      methods: 'GET,HEAD,PUT,PATCH,POST',

      //? Indicates whether the server should send a 204 (No Content) response after a preflight OPTIONS request.
      preflightContinue: false,

      //? The HTTP status code that should be sent in response to an OPTIONS request.
      optionsSuccessStatus: 204,

      //? Defines the request headers allowed in all routes. You can specify a single value or an array of strings.
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
      ],

      //? Indicates whether credentials (such as cookies with HttpOnly and Authorization headers) are allowed.
      credentials: true,
    };
  }

  run(): any {
    return this.corsOptions;
  }
}
