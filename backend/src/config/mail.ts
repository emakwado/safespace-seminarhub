import nodemailer from 'nodemailer';
import { config } from './env';
import { logger } from './logger';

export const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const verifyMailConnection = async (): Promise<void> => {
  try {
    await transporter.verify();
    logger.info('✅ SMTP connection established');
  } catch (error) {
    logger.error('❌ SMTP connection failed:', error);
  }
};

interface MailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

export const sendMail = async (options: MailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: config.smtp.from,
      ...options,
    });
    logger.info(`📧 Email sent to ${options.to}`);
  } catch (error) {
    logger.error('❌ Failed to send email:', error);
    throw error;
  }
};
