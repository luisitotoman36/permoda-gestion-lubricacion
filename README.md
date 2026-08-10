# PERMODA - Plataforma de Gestión de Lubricación (Backend)

Este repositorio contiene el backend en Node.js + TypeScript + Express + TypeORM para la plataforma PERMODA.

Requisitos:
- Node.js 18+
- Docker (opcional para PostgreSQL)

Instalación rápida:

```bash
cp .env.example .env
npm install
docker compose up -d
npm run dev
```

Endpoints principales:
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login (devuelve JWT)
- `POST /api/auth/request-reset` - Solicitar token de recuperación
- `POST /api/auth/reset` - Resetear contraseña
- `GET /api/activos` - Listar activos (auth)
- `POST /api/activos` - Crear activo (Administrador, Supervisor)

SQLite fallback (desarrollo):

Si no tienes Docker/PostgreSQL instalado, el backend detectará automáticamente y usará SQLite para desarrollo.

Para forzar SQLite, añade en `.env`:

```
USE_SQLITE=true
SQLITE_DATABASE=./data/dev.sqlite
```

Para usar PostgreSQL en producción asegúrate de configurar `DATABASE_HOST` y demás variables en `.env`.

Notas:
- Configurar `JWT_SECRET` en `.env`.
- Los archivos subidos se sirven desde la carpeta indicada por `UPLOAD_DIR`.
