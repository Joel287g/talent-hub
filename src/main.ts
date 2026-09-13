//? Imports de codigo
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

//? Imports de usuario
import { AppModule } from '@main/app.module';
import {
  HelmetSecurityConfig,
  CorsSecurityConfig,
} from '@configuration/security';
import { SwaggerRunner } from '@configuration/documentation/swagger-config';

async function main() {
  const app = await NestFactory.create(AppModule);

  //? Global configurations
  app.setGlobalPrefix('api');

  //? Helmet
  app.use(new HelmetSecurityConfig().run());

  //? Cors
  app.enableCors(new CorsSecurityConfig().run());

  //? Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      //? Permite solo un error por propiedad del DTO
      stopAtFirstError: false,

      //? Elimina los campos que no estan en el DTO
      whitelist: true,

      //? Lanza un error si se envia un campo que no esta en el DTO
      forbidNonWhitelisted: false,

      //?La validacion fallara por las propiedades que no estan en el DTO
      skipMissingProperties: false,

      //? Deshabilita los mensajes de error predeterminados
      disableErrorMessages: false,

      //? transforma los objetos JSON a objetos de tipo DTO
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //? Documentation
  if (process.env.NODE_ENV !== 'production') new SwaggerRunner(app).run();

  await app.listen(process.env.PORT);
}
main();
