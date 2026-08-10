# Despliegue completo (Frontend en Vercel + Backend externo)

Archivos añadidos:
- `vercel.json` (raíz) — configura Vercel para construir la carpeta `frontend` y reescribir las llamadas `/api/*` al backend público.
- `frontend/vercel.json` — configuración alternativa por si despliegas solo la carpeta `frontend` en Vercel.
- `frontend/README_VERCEL.md` — pasos rápidos para desplegar el `frontend` desde la carpeta.

Estructura final mínima que debes subir al repositorio (raíz del repo):

```
./
├─ vercel.json
├─ DEPLOY_VERCEL.md
├─ frontend/
│  ├─ package.json
│  ├─ vercel.json
│  ├─ src/
│  └─ ...
└─ src/ (backend source)
```

Variables de entorno a configurar en Vercel (Project Settings → Environment Variables):

- `BACKEND_URL` = dominio público del backend (sin protocolo), ejemplo: `api.misitio.com`
- `VITE_API_BASE` = URL completa del backend API (ej: `https://api.misitio.com/api`) — usada en el frontend build.

Variables de entorno recomendadas para el backend (si despliegas en otro servicio):
- `DATABASE_URL` o variables `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` (según tu proveedor)
- `JWT_SECRET` = clave secreta JWT
- `NODE_ENV=production`

Comandos exactos para publicar (pasos copy/paste):

1) Preparar frontend localmente (opcional, validar build):

```bash
cd frontend
npm install
npm run build
# Opcional: previsualizar
npm run preview -- --port 5173
```

2) Subir repo a GitHub (si aún no está):

```bash
# desde la raíz del proyecto
git add .
git commit -m "Prepare for Vercel deploy"
git push origin main
```

3) Desplegar frontend en Vercel (desde la UI):

- En Vercel: "New Project" → Import from Git → seleccionar este repo.
- En "Root Directory" establece `frontend` (monorepo).
- En Build Settings: Build command `npm run build`, Output Directory `dist`.
- En Environment Variables añade `VITE_API_BASE` = `https://<your-backend-domain>/api` y `BACKEND_URL` = `<your-backend-domain>`.

4) Desplegar frontend en Vercel (CLI):

```bash
npm i -g vercel
cd frontend
vercel --prod
# Si solicita Project Directory, elige la carpeta actual (frontend)
# Tras el deploy, obtendrás la URL pública: https://<project>.vercel.app
```

5) Desplegar backend (opcional, ejemplo con Render):

```bash
# Opción rápida: usar Render (https://render.com) o Railway/Heroku
# Ejemplo Render (sin Docker):
#  - Crea servicio Web Service en Render y conecta el repo
#  - Build command: npm install && npm run build
#  - Start command: npm start
#  - Añade variables: JWT_SECRET, DATABASE_URL, etc.
```

Pasos mínimos para obtener la URL pública:

1. Asegúrate de que el backend tenga un dominio accesible (por ejemplo `api.misitio.com`) y soporte CORS desde el dominio de Vercel.
2. En Vercel Project Settings → Environment Variables añade `VITE_API_BASE=https://api.misitio.com/api` y `BACKEND_URL=api.misitio.com`.
3. Despliega el proyecto en Vercel; la URL pública sale en el panel de Deployment.

Correcciones necesarias para producción (lista directa):

- Asegurar que el backend use una base de datos gestionada (Postgres) y no `SQLite` en producción.
- Configurar `JWT_SECRET` en el entorno de producción.
- Permitir CORS en el backend para el dominio de Vercel (ej: `https://<tu-proyecto>.vercel.app`).
- En el frontend `VITE_API_BASE` debe contener la ruta completa al API: `https://api.misitio.com/api`.

Fin. Copia los archivos y comandos tal como están arriba.
