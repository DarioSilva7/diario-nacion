import { CustomError } from './custom.error';

export class ConflictError extends CustomError {
  readonly statusCode = 409;
  readonly errorCode = 'CONCLICT';

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}
