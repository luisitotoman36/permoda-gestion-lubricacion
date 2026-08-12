import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { Role } from './entity/Role';
import { hashPassword, comparePassword } from './utils/hash';
import authRoutes from './routes/auth';
import assetRoutes from './routes/assets';
import path from 'path';
import fs from 'fs';
import uploadRoutes from './routes/uploads';
import pointsRoutes from './routes/points';
import lubricantsRoutes from './routes/lubricants';
import workordersRoutes from './routes/workorders';
import dashboardRoutes from './routes/dashboard';
import auditMiddleware from './middleware/audit';

dotenv.config();

const app = express();

// Configurar CORS para múltiples orígenes
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4000',
      process.env.FRONTEND_URL || 'https://permoda-gestion-lubricacion.vercel.app'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use((req, _res, next) => {
  const contentType = req.headers['content-type'] || '';
  const isJsonLike = req.method !== 'GET' && req.method !== 'DELETE' && contentType.includes('application/json');
  if (isJsonLike) {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} content-type=${contentType}`);
  }
  next();
});
app.use(express.json({ limit: '2mb' }));
app.use(auditMiddleware);
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const uploadPath = path.join(__dirname, '..', UPLOAD_DIR);
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
app.use('/uploads', express.static(uploadPath));

app.use('/api/auth', authRoutes);
app.use('/api/activos', assetRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/puntos', pointsRoutes);
app.use('/api/lubricantes', lubricantsRoutes);
app.use('/api/ordenes', workordersRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err && err.type === 'entity.parse.failed') {
    console.error('[JSON_PARSE] Invalid JSON payload received:', req.method, req.originalUrl, req.headers['content-type']);
    return res.status(400).json({ message: 'JSON inválido en la petición' });
  }
  console.error('[UNHANDLED_ERROR] ', req.method, req.originalUrl, err);
  return res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 4000;

async function ensureAdminUser() {
  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);

  let role = await roleRepo.findOneBy({ name: 'Administrador' });
  if (!role) {
    role = roleRepo.create({ name: 'Administrador' });
    await roleRepo.save(role);
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@permoda.local';
  const defaultPassword = process.env.SEED_ADMIN_PASSWORD || '123456';
  const existingAdmin = await userRepo.findOneBy({ email: adminEmail });
  if (!existingAdmin) {
    const adminUser = userRepo.create({
      email: adminEmail,
      password: await hashPassword(defaultPassword),
      fullName: 'Admin Permoda',
      role
    });
    await userRepo.save(adminUser);
    console.log('Created default admin user:', adminUser.email);
  } else {
    const isSame = await comparePassword(defaultPassword, existingAdmin.password);
    if (!isSame) {
      existingAdmin.password = await hashPassword(defaultPassword);
      await userRepo.save(existingAdmin);
      console.log('Updated default admin password for:', existingAdmin.email);
    }
  }
}

AppDataSource.initialize()
  .then(async () => {
    // Asegurar admin user en todos los entornos
    await ensureAdminUser();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error inicializando base de datos', err);
    process.exit(1);
  });
