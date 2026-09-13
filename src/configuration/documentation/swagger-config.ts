//? Imports de codigo
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

//? Imports de usuario
import { name, description, author, version } from '../../../package.json';

export class SwaggerRunner {
  private config: DocumentBuilder;
  private app: INestApplication;

  constructor(app: INestApplication<any>) {
    this.app = app;
    this.config = new DocumentBuilder();
  }

  run() {
    this.createDocument();
  }

  private setup() {
    return this.config
      .setTitle(`${name} - ${process.env.NODE_ENV}`)
      .setDescription(description)
      .setVersion('1.0')
      .setContact('Joel', author, null)
      .addGlobalParameters(
        {
          name: 'app-version',
          description: 'Version for API',
          in: 'header',
          required: true,
          allowEmptyValue: false,
          schema: {
            type: 'string',
            default: version,
          },
        },
        {
          name: 'x-api-key',
          description: 'Enter API key',
          in: 'header',
          required: true,
          allowEmptyValue: false,
          schema: {
            type: 'string',
            default:
              process.env.NODE_ENV !== 'production'
                ? process.env.API_KEY
                : null,
          },
        },
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'authorization',
          in: 'header',
        },
        'authorization',
      )
      .build();
  }

  private createDocument() {
    const document = SwaggerModule.createDocument(this.app, this.setup());
    SwaggerModule.setup('/api/docs', this.app, document);
  }
}
