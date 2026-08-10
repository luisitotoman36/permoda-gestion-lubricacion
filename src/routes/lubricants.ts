import { Router } from 'express';
import { createLubricant, listLubricants, getLubricant, updateLubricant, deleteLubricant, exportLubricantsExcel, exportLubricantsPDF } from '../controllers/lubricantController';
import { validateDto } from '../middleware/validate';
import { LubricantDto } from '../dto/LubricantDto';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/', authenticateJWT, listLubricants);
router.post('/', authenticateJWT, authorizeRoles('Administrador','Supervisor'), validateDto(LubricantDto), createLubricant);
router.get('/export/excel', authenticateJWT, exportLubricantsExcel);
router.get('/export/pdf', authenticateJWT, exportLubricantsPDF);
router.get('/:id', authenticateJWT, getLubricant);
router.put('/:id', authenticateJWT, authorizeRoles('Administrador','Supervisor'), validateDto(LubricantDto), updateLubricant);
router.delete('/:id', authenticateJWT, authorizeRoles('Administrador'), deleteLubricant);

export default router;
