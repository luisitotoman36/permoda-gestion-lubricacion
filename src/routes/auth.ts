import { Router } from 'express';
import { register, login, changePassword, requestPasswordReset, resetPassword } from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/request-reset', requestPasswordReset);
router.post('/reset', resetPassword);
router.post('/change-password', authenticateJWT, changePassword);

export default router;
