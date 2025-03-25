import { CustomError } from './custom.error';

export class ForbiddenError extends CustomError {
  readonly statusCode = 403;
  readonly errorCode = 'FORBIDDEN';

  constructor(msg: string) {
    super(msg);
  }
}
