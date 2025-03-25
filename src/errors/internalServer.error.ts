import { CustomError } from './custom.error';

export class InternalServerError extends CustomError {
  readonly statusCode = 500;
  readonly errorCode = 'INTERNAL_ERROR';

  constructor(message: string = 'Error interno del servidor') {
    super(message);
  }
}
