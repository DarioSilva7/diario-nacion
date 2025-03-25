import { CustomError } from './custom.error';

export class ValidationError extends CustomError {
  readonly statusCode = 400;
  readonly errorCode = 'VALIDATION_ERROR';

  constructor(fieldErrors: Record<string, string[]>) {
    super('Error de validación en los datos de entrada', {
      fields: fieldErrors,
    });
  }
}
