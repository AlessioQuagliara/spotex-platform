/**
 * @fileoverview Logger Utility
 * @principle KISS - Simple, consistent logging across all services
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
  [key: string]: any;
}

/**
 * Simple Logger class for consistent logging
 */
export class Logger {
  private serviceName: string;
  private minLevel: LogLevel;

  constructor(serviceName: string, minLevel: LogLevel = 'info') {
    this.serviceName = serviceName;
    this.minLevel = minLevel;
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.log('warn', message, metadata);
  }

  error(message: string, error?: Error | unknown, metadata?: LogMetadata): void {
    const errorMetadata = error instanceof Error 
      ? { error: error.message, stack: error.stack, ...metadata }
      : { error: String(error), ...metadata };
    
    this.log('error', message, errorMetadata);
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      service: this.serviceName,
      message,
      ...metadata,
    };

    const logMethod = level === 'error' ? console.error : console.log;
    logMethod(JSON.stringify(logData));
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const levelIndex = levels.indexOf(level);
    const minLevelIndex = levels.indexOf(this.minLevel);
    return levelIndex >= minLevelIndex;
  }
}

/**
 * Create logger instance for a service
 */
export function createLogger(serviceName: string): Logger {
  const minLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  return new Logger(serviceName, minLevel);
}
