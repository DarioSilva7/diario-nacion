import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  BadRequestError,
  InternalServerError,
  CustomError,
} from './';
import { PostgresErrorCode } from '../database/postgres.error';
import { ConflictError } from './conflict.error';
import { CustomMulterError, MulterErrorCode } from './multer.error';
import { ForbiddenError } from './forbidden.error';

type ErrorType =
  | 'CONCLICT'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'DATABASE'
  | 'BAD_REQUEST'
  | 'INTERNAL'
  | 'MULTER'
  | 'FORBIDDEN';

type ErrorContext = {
  resource?: string;
  id?: string | number;
  fieldErrors?: Record<string, string[]>;
  pgCode?: PostgresErrorCode;
  multerCode?: MulterErrorCode;
  query?: string;
  message?: string;
};

export class ErrorFactory {
  static create(type: ErrorType, context: ErrorContext = {}): CustomError {
    switch (type) {
      case 'NOT_FOUND':
        if (!context.resource)
          throw new Error("Falta 'resource' para NotFoundError");
        return new NotFoundError(context.resource, context.id);

      case 'VALIDATION':
        if (!context.fieldErrors)
          throw new Error("Falta 'fieldErrors' para ValidationError");
        return new ValidationError(context.fieldErrors);

      case 'DATABASE':
        return new DatabaseError(context.pgCode, context.query);

      case 'MULTER':
        return new CustomMulterError(context.multerCode, context.query);

      case 'BAD_REQUEST':
        if (!context.message)
          throw new Error("Falta 'message' para BadRequestError");
        return new BadRequestError(context.message, context);

      case 'CONCLICT':
        if (!context.message)
          throw new Error("Falta 'message' para ConflictError");
        return new ConflictError(context.message, context);

      case 'FORBIDDEN':
        if (!context.message)
          throw new Error("Falta 'message' para ForbiddenError");
        return new ForbiddenError(context.message);

      case 'INTERNAL':
        return new InternalServerError(context.message);

      default:
        return new InternalServerError();
    }
  }
}
