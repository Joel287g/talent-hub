//? Imports de codigo
import helmet from 'helmet';

export class HelmetSecurityConfig {
  private helmetInstance: any;

  constructor() {
    this.helmetInstance = helmet({
      //? Defines security policies for resources, limiting trusted sources.
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
        },
      },

      //? Allows sharing content with other origins.
      crossOriginEmbedderPolicy: false,

      //? Controls how windows are opened from other origins.
      crossOriginOpenerPolicy: {
        policy: 'unsafe-none',
      },

      //? Prevents malicious framing by blocking content loading in iframes.
      frameguard: { action: 'deny' },

      //? Controls the referrer information sent to other sites.
      referrerPolicy: {
        policy: [
          'strict-origin-when-cross-origin',
          'no-referrer-when-downgrade',
        ],
      },

      //? Hides server information about the powering web application.
      hidePoweredBy: true,

      //? Prevents the browser from changing content types.
      noSniff: true,

      //? Applies a filter against cross-site scripting (XSS) injection.
      xssFilter: true,
    });
  }

  run(): any {
    return this.helmetInstance;
  }
}
