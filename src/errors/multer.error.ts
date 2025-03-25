import { CustomError } from './custom.error';
export type MulterErrorCode = {
  LIMIT_FILE_SIZE: '413';
};

export class CustomMulterError extends CustomError {
  readonly statusCode = 413;
  readonly errorCode = 'MULTER_ERROR';

  constructor(
    public readonly multerCode?: MulterErrorCode,
    public readonly error?: string
  ) {
    super('Error en la carga de archivo', {
      ...(multerCode && { code: multerCode }),
      ...(error && { error }),
    });
  }
}
