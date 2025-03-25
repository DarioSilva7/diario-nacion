import { Request, Response, NextFunction } from 'express';
import { validate as uuidValidate } from 'uuid';
import { ErrorFactory } from '../errors';

export const validateParam = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.info('🚀 ~ return ~ paramName:', paramName);
    console.info('🚀 ~ return ~ req.params[paramName]:', req.params[paramName]);
    const paramValue = req.params[paramName];

    if (!paramValue) {
      const error = ErrorFactory.create('BAD_REQUEST', {
        message: `El parámetro ${paramName} es requerido`,
        resource: 'validateParam',
      });
      return next(error);
    }

    switch (paramName) {
      case 'id':
        if (!uuidValidate(paramValue)) {
          const error = ErrorFactory.create('BAD_REQUEST', {
            message: `El parámetro ${paramName} no es un UUID válido`,
            resource: 'validateParam',
          });
          return next(error);
        }
        break;
    }

    next();
  };
};
