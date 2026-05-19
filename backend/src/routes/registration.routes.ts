import { Router } from 'express';
import { registrationController } from '../controllers/registration.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

router.post('/', authenticate, ...registrationController.create);
router.get('/', authenticate, ...registrationController.findAll);
router.get('/my-registrations', authenticate, ...registrationController.getMyRegistrations);
router.get('/export/:seminarId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...registrationController.exportAttendees);
router.get('/:id', authenticate, ...registrationController.findById);
router.patch('/:id/status', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...registrationController.updateStatus);
router.delete('/:id/cancel', authenticate, ...registrationController.cancel);

export default router;
