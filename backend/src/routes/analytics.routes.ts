import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/dashboard', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...analyticsController.getDashboardStats);
router.get('/users', authenticate, authorize(UserRole.SUPER_ADMIN), ...analyticsController.getUserAnalytics);
router.get('/seminars', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...analyticsController.getSeminarAnalytics);
router.get('/attendance', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...analyticsController.getAttendanceAnalytics);

export default router;
