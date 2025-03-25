import { Request, Response, NextFunction } from 'express';
import { QueryFailedError } from 'typeorm';
import { CustomError } from '../../errors/custom.error';
import { ErrorFactory } from '../../errors/error.factory';
import { WinstonLogger } from '../../config/winston.logger';
import multer from 'multer';

const logger = new WinstonLogger();

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: CustomError;
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      throw ErrorFactory.create('MULTER', { multerCode: (err as any).code });
    }
  }
  if (err instanceof QueryFailedError) {
    throw ErrorFactory.create('DATABASE', {
      pgCode: (err as any).code,
      query: err.query,
    });
  } else if (!(err instanceof CustomError)) {
    error = ErrorFactory.create('INTERNAL');
  } else {
    error = err;
  }

  logger.error(error.message, {
    errorCode: error.errorCode,
    path: req.path,
    method: req.method,
    details: error.details,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });

  res.status(error.statusCode).json({
    success: false,
    ...error.serialize(),
  });
};
