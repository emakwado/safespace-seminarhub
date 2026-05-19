import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().email().default('noreply@safespace-seminarhub.com'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
  MAX_FILE_SIZE: z.string().default('5242880'),
  UPLOAD_DIR: z.string().default('uploads'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const config = {
  port: parseInt(parsed.data.PORT, 10),
  nodeEnv: parsed.data.NODE_ENV,
  database: {
    url: parsed.data.DATABASE_URL,
  },
  jwt: {
    secret: parsed.data.JWT_SECRET,
    refreshSecret: parsed.data.JWT_REFRESH_SECRET,
    accessExpiration: parsed.data.JWT_ACCESS_EXPIRATION,
    refreshExpiration: parsed.data.JWT_REFRESH_EXPIRATION,
  },
  smtp: {
    host: parsed.data.SMTP_HOST,
    port: parseInt(parsed.data.SMTP_PORT, 10),
    user: parsed.data.SMTP_USER,
    pass: parsed.data.SMTP_PASS,
    from: parsed.data.SMTP_FROM,
  },
  client: {
    url: parsed.data.CLIENT_URL,
  },
  upload: {
    maxFileSize: parseInt(parsed.data.MAX_FILE_SIZE, 10),
    dir: parsed.data.UPLOAD_DIR,
  },
  rateLimit: {
    windowMs: parseInt(parsed.data.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(parsed.data.RATE_LIMIT_MAX_REQUESTS, 10),
  },
} as const;
