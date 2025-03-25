import 'dotenv/config';
import * as joi from 'joi';

interface IEnvVars {
  PORT: number;
  NODE_ENV: string;
  DB_USER: string;
  DB_NAME: string;
  DB_PASS: string;
  DB_PORT: number;
  DB_HOST: string;
  REDIS_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().port().required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    DB_USER: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_PASS: joi.string().required(),
    DB_PORT: joi.number().port().required(),
    DB_HOST: joi.string().hostname().required(),
    REDIS_URL: joi.string().required(),
  })
  .unknown(true);

const { value, error } = envsSchema.validate(process.env);
const envVars: IEnvVars = value;

if (error) {
  if (error) {
    throw new Error(
      `Config validation error: ${error.details
        .map((detail) => detail.message)
        .join(', ')}`
    );
  }
}
export const envs = {
  port: envVars.PORT,
  node_env: envVars.NODE_ENV,
  is_dev: envVars.NODE_ENV === 'development',
  redis_url: envVars.REDIS_URL,
  db: {
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    name: envVars.DB_NAME,
    pass: envVars.DB_PASS,
    port: envVars.DB_PORT,
  },
};
