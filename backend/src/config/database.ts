import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.database.url,
  synchronize: config.nodeEnv === 'development',
  logging: config.nodeEnv === 'development',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  extra: {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};
