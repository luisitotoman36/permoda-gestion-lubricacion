import { Router } from 'express';
import { metrics } from '../controllers/dashboardController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/metrics', authenticateJWT, metrics);

export default router;
