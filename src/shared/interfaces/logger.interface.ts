export interface ILogger {
  error(message: string, metadata?: LogMetadata): void;
}

export interface LogMetadata {
  errorCode?: string;
  path?: string;
  method?: string;
  details?: Record<string, unknown>;
  stack?: string;
}
