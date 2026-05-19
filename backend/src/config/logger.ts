import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from './env';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  if (stack) {
    msg += `\n${stack}`;
  }
  return msg;
});

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      customFormat
    ),
  }),
];

if (config.nodeEnv === 'production') {
  transports.push(
    new DailyRotateFile({
      filename: 'src/logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: combine(timestamp(), json()),
    })
  );
  transports.push(
    new DailyRotateFile({
      filename: 'src/logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: combine(timestamp(), json()),
    })
  );
}

export const logger = winston.createLogger({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  defaultMeta: { service: 'safespace-seminarhub' },
  transports,
  exitOnError: false,
});

export const auditLogger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new DailyRotateFile({
      filename: 'src/audit/audit-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '90d',
    }),
  ],
});
