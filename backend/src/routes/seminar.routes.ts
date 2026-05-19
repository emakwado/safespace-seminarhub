import { Router } from 'express';
import { seminarController } from '../controllers/seminar.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/', ...seminarController.findAll);
router.get('/stats', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...seminarController.getStats);
router.get('/slug/:slug', ...seminarController.findBySlug);
router.get('/:id', ...seminarController.findById);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...seminarController.create);
router.put('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...seminarController.update);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...seminarController.delete);
router.patch('/:id/publish', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...seminarController.publish);
router.patch('/:id/unpublish', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...seminarController.unpublish);

export default router;
