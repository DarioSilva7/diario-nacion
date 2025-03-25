import { CustomError } from './custom.error';

export class BadRequestError extends CustomError {
  readonly statusCode = 400;
  readonly errorCode = 'BAD_REQUEST';

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}
