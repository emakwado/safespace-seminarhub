import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../middleware/errorHandler';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  verifyEmailSchema,
} from '../validators/auth.validator';
import { validate } from '../middleware/validation';

export const authController = {
  register: [
    validate(registerSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await AuthService.register(req.body);
      res.status(201).json({ success: true, data: result });
    }),
  ],

  login: [
    validate(loginSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await AuthService.login(req.body.email, req.body.password);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  logout: [
    asyncHandler(async (req: Request, res: Response) => {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      const result = await AuthService.logout(userId);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  refreshToken: [
    validate(refreshTokenSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await AuthService.refreshToken(req.body.refreshToken);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  verifyEmail: [
    validate(verifyEmailSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await AuthService.verifyEmail(req.query.token as string);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  forgotPassword: [
    validate(forgotPasswordSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await AuthService.forgotPassword(req.body.email);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  resetPassword: [
    validate(resetPasswordSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await AuthService.resetPassword(req.body.token, req.body.password);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getProfile: [
    asyncHandler(async (req: Request, res: Response) => {
      const userId = req.user!.id;
      const result = await AuthService.getProfile(userId);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  updateProfile: [
    asyncHandler(async (req: Request, res: Response) => {
      const userId = req.user!.id;
      const result = await AuthService.updateProfile(userId, req.body);
      res.status(200).json({ success: true, data: result });
    }),
  ],
};
