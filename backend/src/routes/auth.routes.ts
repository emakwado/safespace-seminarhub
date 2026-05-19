import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/register', ...authController.register);
router.post('/login', ...authController.login);
router.post('/logout', authenticate, ...authController.logout);
router.post('/refresh', ...authController.refreshToken);
router.get('/verify-email', ...authController.verifyEmail);
router.post('/forgot-password', ...authController.forgotPassword);
router.post('/reset-password', ...authController.resetPassword);
router.get('/profile', authenticate, ...authController.getProfile);
router.patch('/profile', authenticate, ...authController.updateProfile);

export default router;
