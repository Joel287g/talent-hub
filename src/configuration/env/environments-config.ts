//? Imports de codigo
import { registerAs } from '@nestjs/config';

const environments = process.env;

export default registerAs('config', () => {
  return {
    //? Configuration
    configuration: {
      node_env: environments.NODE_ENV,
      port: +environments.PORT,
    },

    //? Security
    security: {
      apiKey: environments.API_KEY,

      jwt: {
        expiration_time: environments.JWT_EXPIRATION_TIME,
        audience: environments.JWT_AUDIENCE,
        secret: environments.JWT_SECRET,
      },

      firebase: {
        project_id: environments.FIREBASE_PROJECT_ID,
        client_email: environments.FIREBASE_CLIENT_EMAIL,

        //? En el .env la clave llega en una sola línea con "\n" escritos como texto
        private_key: environments.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),

        //? Si existe, firebase-admin verifica los tokens contra el emulador local
        auth_emulator_host: environments.FIREBASE_AUTH_EMULATOR_HOST,
      },
    },

    //? Database
    database: {
      name: environments.DB_NAME,
      uri: environments.DB_URI,
    },
  };
});
