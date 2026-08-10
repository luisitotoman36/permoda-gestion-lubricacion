import { EventEmitter } from 'events';
import { AppDataSource } from '../data-source';
import auditMiddleware from '../middleware/audit';
import { AuditLog } from '../entity/AuditLog';

describe('audit middleware', () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  it('creates an audit entry for requests', async () => {
    const req: any = {
      method: 'GET',
      originalUrl: '/ping',
      params: {},
      query: {},
      body: {},
    };

    const res: any = new EventEmitter();
    res.statusCode = 200;
    res.on = res.addListener.bind(res);

    // Call middleware
    await new Promise<void>((resolve) => {
      auditMiddleware(req, res, () => {
        // simulate route handler finishing immediately
        setImmediate(() => {
          res.emit('finish');
        });
      });

      // wait a bit for the audit handler to run and persist
      setTimeout(async () => {
        resolve();
      }, 200);
    });

    const repo = AppDataSource.getRepository(AuditLog);
    const logs = await repo.find({ order: { fecha: 'DESC' }, take: 5 });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].accion).toMatch(/GET \/ping 200/);
  }, 10000);
});
