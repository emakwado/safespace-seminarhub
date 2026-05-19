import { Router } from 'express';
import { feedbackController } from '../controllers/feedback.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

router.post('/', optionalAuth, ...feedbackController.create);
router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...feedbackController.findAll);
router.get('/stats', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...feedbackController.getStats);
router.get('/seminar/:seminarId', ...feedbackController.getSeminarFeedback);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...feedbackController.findById);
router.patch('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...feedbackController.update);

export default router;
