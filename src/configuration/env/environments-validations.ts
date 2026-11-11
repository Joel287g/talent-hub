//? Imports de codigo
import * as joi from 'joi';

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
  JWT_SECRET: joi.string().required(),
  JWT_PRIVATE: joi.string().required(),
  JWT_PUBLIC: joi.string().required(),
});
