import { Router } from 'express';
import { attendanceController } from '../controllers/attendance.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

router.post('/checkin', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...attendanceController.checkIn);
router.post('/checkout', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...attendanceController.checkOut);
router.get('/stats', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...attendanceController.getStats);
router.get('/seminar/:seminarId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...attendanceController.getSeminarAttendance);
router.get('/my-attendance', authenticate, ...attendanceController.getMyAttendance);

export default router;
