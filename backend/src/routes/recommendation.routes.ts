import { Router } from 'express';
import { recommendationController } from '../controllers/recommendation.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

router.post('/', authenticate, ...recommendationController.create);
router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...recommendationController.findAll);
router.get('/stats', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ORGANIZER), ...recommendationController.getStats);
router.get('/my-recommendations', authenticate, ...recommendationController.getMyRecommendations);
router.get('/track/:code', ...recommendationController.trackClick);

export default router;
