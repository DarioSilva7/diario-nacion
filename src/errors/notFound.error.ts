import { CustomError } from './custom.error';

export class NotFoundError extends CustomError {
  readonly statusCode = 404;
  readonly errorCode = 'NOT_FOUND';

  constructor(resource: string, termino?: string | number) {
    super(
      `${resource}${termino ? ` con termino ${termino}` : ''} no encontrado`,
      {
        resource,
        ...(termino && { termino }),
      }
    );
  }
}
