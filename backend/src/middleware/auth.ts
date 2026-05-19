import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
import { AppError, asyncHandler } from './errorHandler';
import { config } from '../config/env';

interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token required', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new AppError('User not found', 401);
      }

      if (user.status === 'suspended') {
        throw new AppError('Account suspended', 403);
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expired', 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token', 401);
      }
      throw error;
    }
  }
);

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  };
};

export const optionalAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: decoded.userId },
      });

      if (user && user.status !== 'suspended') {
        req.user = user;
      }
    } catch {
      // Silently fail for optional auth
    }

    next();
  }
);
