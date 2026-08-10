import { Router } from 'express';
import { createWorkOrder, listWorkOrders, getWorkOrder, updateWorkOrder, deleteWorkOrder, exportWorkOrdersExcel, exportWorkOrdersPDF } from '../controllers/workOrderController';
import { validateDto } from '../middleware/validate';
import { WorkOrderDto } from '../dto/WorkOrderDto';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/', authenticateJWT, listWorkOrders);
router.post('/', authenticateJWT, authorizeRoles('Administrador','Supervisor'), validateDto(WorkOrderDto), createWorkOrder);
router.get('/export/excel', authenticateJWT, exportWorkOrdersExcel);
router.get('/export/pdf', authenticateJWT, exportWorkOrdersPDF);
router.get('/:id', authenticateJWT, getWorkOrder);
router.put('/:id', authenticateJWT, authorizeRoles('Administrador','Supervisor','Lubricador'), validateDto(WorkOrderDto), updateWorkOrder);
router.delete('/:id', authenticateJWT, authorizeRoles('Administrador'), deleteWorkOrder);

export default router;
