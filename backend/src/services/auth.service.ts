import { AppDataSource } from '../config/database';
import { User, UserRole, UserStatus } from '../entities/User';
import { AppError } from '../middleware/errorHandler';
import {
  generateTokens,
  hashPassword,
  comparePassword,
  generateUniqueSlug,
} from '../utils';
import { sendMail } from '../config/mail';
import {
  getVerificationEmailTemplate,
  getPasswordResetTemplate,
} from '../utils/emailTemplates';
import { logger } from '../config/logger';
import { config } from '../config/env';
import crypto from 'crypto';

const userRepository = () => AppDataSource.getRepository(User);

export class AuthService {
  static async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const existingUser = await userRepository().findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await hashPassword(data.password);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = userRepository().create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      emailVerificationToken: verificationToken,
      status: UserStatus.PENDING_VERIFICATION,
    });

    await userRepository().save(user);

    // Send verification email
    const { subject, html } = getVerificationEmailTemplate(
      data.firstName,
      verificationToken
    );
    await sendMail({ to: data.email, subject, html });

    logger.info(`New user registered: ${data.email}`);

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user.id,
    };
  }

  static async login(email: string, password: string) {
    const user = await userRepository().findOne({ where: { email } });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.status === UserStatus.PENDING_VERIFICATION) {
      throw new AppError('Please verify your email before logging in', 403);
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new AppError('Account suspended', 403);
    }

    const isPasswordValid = await comparePassword(password, user.password || '');

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    user.lastLoginAt = new Date();
    await userRepository().save(user);

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    await userRepository().save(user);

    logger.info(`User logged in: ${email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
      },
      ...tokens,
    };
  }

  static async logout(userId: string) {
    const user = await userRepository().findOne({ where: { id: userId } });
    if (user) {
      user.refreshToken = '';
      await userRepository().save(user);
    }
    logger.info(`User logged out: ${userId}`);
    return { message: 'Logged out successfully' };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const { verifyRefreshToken } = await import('../utils/jwt');
      const decoded = verifyRefreshToken(refreshToken);

      const user = await userRepository().findOne({
        where: { id: decoded.userId, refreshToken },
      });

      if (!user) {
        throw new AppError('Invalid refresh token', 401);
      }

      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      user.refreshToken = tokens.refreshToken;
      await userRepository().save(user);

      return tokens;
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  static async verifyEmail(token: string) {
    const user = await userRepository().findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.status = UserStatus.ACTIVE;
    await userRepository().save(user);

    logger.info(`Email verified: ${user.email}`);

    return { message: 'Email verified successfully' };
  }

  static async forgotPassword(email: string) {
    const user = await userRepository().findOne({ where: { email } });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If an account exists, a reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await userRepository().save(user);

    const { subject, html } = getPasswordResetTemplate(user.firstName, resetToken);
    await sendMail({ to: email, subject, html });

    logger.info(`Password reset requested: ${email}`);

    return { message: 'If an account exists, a reset link has been sent' };
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await userRepository().findOne({
      where: { passwordResetToken: token },
    });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await userRepository().save(user);

    logger.info(`Password reset completed: ${user.email}`);

    return { message: 'Password reset successfully' };
  }

  static async getProfile(userId: string) {
    const user = await userRepository().findOne({
      where: { id: userId },
      relations: ['registrations', 'registrations.seminar'],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar,
      status: user.status,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      registrations: user.registrations,
    };
  }

  static async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; avatar?: string }
  ) {
    const user = await userRepository().findOne({ where: { id: userId } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.firstName) user.firstName = data.firstName;
    if (data.lastName) user.lastName = data.lastName;
    if (data.avatar) user.avatar = data.avatar;

    await userRepository().save(user);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      avatar: user.avatar,
    };
  }
}
