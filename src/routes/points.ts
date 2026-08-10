import { Router } from 'express';
import { createPoint, listPoints, getPoint, updatePoint, deletePoint, exportPointsExcel, exportPointsPDF } from '../controllers/pointController';
import { validateDto } from '../middleware/validate';
import { PointDto } from '../dto/PointDto';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/', authenticateJWT, listPoints);
router.post('/', authenticateJWT, authorizeRoles('Administrador','Supervisor'), validateDto(PointDto), createPoint);
router.get('/export/excel', authenticateJWT, exportPointsExcel);
router.get('/export/pdf', authenticateJWT, exportPointsPDF);
router.get('/:id', authenticateJWT, getPoint);
router.put('/:id', authenticateJWT, authorizeRoles('Administrador','Supervisor'), validateDto(PointDto), updatePoint);
router.delete('/:id', authenticateJWT, authorizeRoles('Administrador'), deletePoint);

export default router;
