import winston from 'winston';
import { ILogger, LogMetadata } from '../shared/interfaces/logger.interface';
import { envs } from './envs';

export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: envs.is_dev ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              return `${timestamp} [${level}]: ${message} ${JSON.stringify(
                meta
              )}`;
            })
          ),
        }),
      ],
    });
  }

  error(message: string, metadata?: LogMetadata): void {
    this.logger.error(message, metadata);
  }
}
