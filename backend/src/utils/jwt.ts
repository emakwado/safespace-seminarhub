import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UserRole } from '../entities/User';

interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = (payload: TokenPayload): TokenPair => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiration,
  });

  const refreshToken = jwt.sign(
    { userId: payload.userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiration }
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
};
