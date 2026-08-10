import { Request, Response } from 'express';
import path from 'path';

export function uploadFile(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ message: 'Archivo requerido' });
  const filePath = path.join((process.env.UPLOAD_DIR || 'uploads'), req.file.filename);
  return res.status(201).json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
}
