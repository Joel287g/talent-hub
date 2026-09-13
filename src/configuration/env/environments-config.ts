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
        public_key: environments.JWT_PUBLIC,
        private_key: environments.JWT_PRIVATE,
      },
    },

    //? Database
    database: {
      name: environments.DB_NAME,
      uri: environments.DB_URI,
    },
  };
});
