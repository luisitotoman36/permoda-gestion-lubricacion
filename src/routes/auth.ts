import { Router } from 'express';
import { register, login, changePassword, requestPasswordReset, resetPassword, listUsers, toggleUserStatus, deleteUser } from '../controllers/authController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/users', authenticateJWT, authorizeRoles('Administrador'), listUsers);
router.patch('/users/:id/toggle-active', authenticateJWT, authorizeRoles('Administrador'), toggleUserStatus);
router.delete('/users/:id', authenticateJWT, authorizeRoles('Administrador'), deleteUser);
router.post('/register', register);
router.post('/login', login);
router.post('/request-reset', requestPasswordReset);
router.post('/reset', resetPassword);
router.post('/change-password', authenticateJWT, changePassword);

export default router;
