import { Router } from 'express';
import { createAsset, listAssets, getAsset, updateAsset, deleteAsset, exportAssetsExcel, exportAssetsPDF } from '../controllers/assetController';
import { validateDto } from '../middleware/validate';
import { AssetDto } from '../dto/AssetDto';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/', authenticateJWT, listAssets);
router.post('/', authenticateJWT, authorizeRoles('Administrador','Supervisor'), validateDto(AssetDto), createAsset);
router.get('/export/excel', authenticateJWT, exportAssetsExcel);
router.get('/export/pdf', authenticateJWT, exportAssetsPDF);
router.get('/:id', authenticateJWT, getAsset);
router.put('/:id', authenticateJWT, authorizeRoles('Administrador','Supervisor'), validateDto(AssetDto), updateAsset);
router.delete('/:id', authenticateJWT, authorizeRoles('Administrador'), deleteAsset);

export default router;
