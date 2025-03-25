import { CustomError } from './custom.error';
import { PostgresErrorCode } from '../database/postgres.error';

export class DatabaseError extends CustomError {
  readonly statusCode = 500;
  readonly errorCode = 'DATABASE_ERROR';

  constructor(
    public readonly pgCode?: PostgresErrorCode,
    public readonly error?: string
  ) {
    super('Error en la operación de base de datos', {
      ...(pgCode && { code: pgCode }),
      ...(error && { error }),
    });
  }
}
