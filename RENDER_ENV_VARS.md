# Variables de entorno necesarias para Render (backend)

Coloca estas variables en Render → Service → Environment → Environment Variables.

- `NODE_ENV` = `production`
- `PORT` = `4000`
- `JWT_SECRET` = `TU_SECRETO_FUERTE`
- `USE_SQLITE` = `false`    # usar true sólo para dev
- `DATABASE_URL` = `postgres://USER:PASS@HOST:5432/DBNAME`  # URL completa de Postgres
- `UPLOAD_DIR` = `/tmp/uploads`  # carpeta usada para almacenar archivos si aplica

Variables opcionales / recomendadas:
- `EMAIL_SMTP_HOST`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASS` (si envías emails)
- `SENTRY_DSN` (si usas Sentry)

URL para `VITE_API_BASE` cuando Render esté publicado:

```text
https://permoda-backend.onrender.com/api
```

Reemplaza `permoda-backend` por el `name` exacto del servicio en Render si lo cambias.
