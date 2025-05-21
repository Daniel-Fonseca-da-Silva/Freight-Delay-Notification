import { createLogger, format, transports, Logger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

// Logger class is a singleton class that is used to log messages to the console and to a file
// It is used to log messages to the console and to a file
// It is also used to set the context for the logger
// It is used to log messages to the console and to a file
class LoggerInstance {
  private static instance: LoggerInstance;
  private logger: Logger;
  private context?: string;

  private constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
      defaultMeta: { service: 'freight-delay-notification' },
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ timestamp, level, message, context, ...meta }) => {
              return `${timestamp} [${level}] ${context ? `[${context}] ` : ''}${message} ${
                Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
              }`;
            }),
          ),
        }),
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
        }),
        new DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  // Get the instance of the logger
  public static getInstance(): LoggerInstance {
    if (!LoggerInstance.instance) {
      LoggerInstance.instance = new LoggerInstance();
    }
    return LoggerInstance.instance;
  }

  public setContext(context: string): void {
    this.context = context;
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, {
      context: this.context,
      ...meta,
    });
  }

  public error(message: string, trace?: string, meta?: any): void {
    this.logger.error(message, {
      context: this.context,
      trace,
      ...meta,
    });
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, {
      context: this.context,
      ...meta,
    });
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, {
      context: this.context,
      ...meta,
    });
  }

  public verbose(message: string, meta?: any): void {
    this.logger.verbose(message, {
      context: this.context,
      ...meta,
    });
  }
}

export const logger = LoggerInstance.getInstance(); 