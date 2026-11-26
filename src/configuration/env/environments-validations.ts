//? Imports de codigo
import * as joi from 'joi';

//? Imports de usuario
import { Environments } from '@common/domain/enums';

//* Con el emulador de Firebase Auth las credenciales de la cuenta de servicio no son necesarias
//? Solo se usa "otherwise" (sin "then") para no crear objetos thenable (oxlint: unicorn/no-thenable)
const FIREBASE_CREDENTIAL_RULE = {
  is: joi.exist(),
  otherwise: joi.required(),
};

export const environmentsValidations = joi.object({
  //? NODE_ENV
  NODE_ENV: joi.string().valid('development'),

  //? PORT
  PORT: joi.number().required(),

  //? SECURITY
  API_KEY: joi.string().required(),

  //? DATABASE
  DB_NAME: joi.string().required(),
  DB_USER: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_CLUSTER: joi.string().required(),
  DB_URI: joi.string().required(),

  //? JWT
  JWT_EXPIRATION_TIME: joi.string().required(),
  JWT_AUDIENCE: joi.string().required(),
  JWT_SECRET: joi.string().min(32).required(),

  //? FIREBASE
  FIREBASE_PROJECT_ID: joi.string().required(),

  //! El emulador acepta tokens sin firmar: prohibido en producción y si NODE_ENV no está definido
  FIREBASE_AUTH_EMULATOR_HOST: joi
    .string()
    .pattern(/^[\w.-]+:\d+$/)
    .when('NODE_ENV', { not: Environments.PRODUCTION, otherwise: joi.forbidden() }),

  FIREBASE_CLIENT_EMAIL: joi
    .string()
    .email()
    .when('FIREBASE_AUTH_EMULATOR_HOST', FIREBASE_CREDENTIAL_RULE),

  FIREBASE_PRIVATE_KEY: joi
    .string()
    .pattern(/-----BEGIN PRIVATE KEY-----/)
    .when('FIREBASE_AUTH_EMULATOR_HOST', FIREBASE_CREDENTIAL_RULE),
});
