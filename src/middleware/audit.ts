import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../entity/AuditLog';
import { AppDataSource } from '../data-source';

export interface ReqWithUser extends Request {
  user?: any;
}

export function auditMiddleware(req: ReqWithUser, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', async () => {
    try {
      if (!AppDataSource.isInitialized) return;
      const repo = AppDataSource.getRepository(AuditLog);
      const usuario = req.user?.username || req.user?.email || 'anon';
      const accion = `${req.method} ${req.originalUrl} ${res.statusCode}`;
      const detalleObj: any = { params: req.params, query: req.query };
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) detalleObj.body = req.body;
      detalleObj.durationMs = Date.now() - start;
      const detalle = JSON.stringify(detalleObj);
      const entry = repo.create({ usuario, accion, detalle });
      await repo.save(entry);
    } catch (err) {
      console.error('Audit middleware error:', err);
    }
  });
  next();
}

export default auditMiddleware;
