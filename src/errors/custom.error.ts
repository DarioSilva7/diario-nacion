export abstract class CustomError extends Error {
  abstract readonly statusCode: number;
  abstract readonly errorCode: string;
  details?: Record<string, any>;

  constructor(message: string, details?: Record<string, any>) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serialize() {
    return {
      errorCode: this.errorCode,
      message: this.message,
      ...(this.details && { details: this.details }),
    };
  }
}
