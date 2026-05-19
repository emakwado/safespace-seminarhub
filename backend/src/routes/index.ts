import { Router } from 'express';
import authRoutes from './auth.routes';
import seminarRoutes from './seminar.routes';
import registrationRoutes from './registration.routes';
import attendanceRoutes from './attendance.routes';
import feedbackRoutes from './feedback.routes';
import recommendationRoutes from './recommendation.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/seminars', seminarRoutes);
router.use('/registrations', registrationRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
