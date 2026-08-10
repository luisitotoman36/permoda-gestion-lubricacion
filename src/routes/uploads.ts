import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFile } from '../controllers/uploadController';

const router = Router();
const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });

router.post('/file', upload.single('file'), uploadFile);

export default router;
