# 🔧 GUÍA RÁPIDA: Configurar Vercel Después del Fix

## ✅ Qué se Arregló
Se añadieron los archivos `vercel.json` faltantes que causaban el error 404. Ahora Vercel puede:
- ✓ Construir correctamente el frontend Vite
- ✓ Servir los archivos estáticos
- ✓ Reescribir `/api/*` al backend

---

## 📋 Próximos Pasos en Vercel Dashboard

### 1️⃣ Actualiza el Despliegue
1. Ve a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto `permoda-gestion-lubricacion`
3. Ve a **Settings** → **Git**
4. Haz clic en "Redeploy" o espera a que GitHub trigger una redeploy automáticamente

### 2️⃣ Configura Variables de Entorno
Ve a **Settings** → **Environment Variables** y añade:

| Variable | Valor | Ejemplo |
|----------|-------|---------|
| `BACKEND_URL` | URL pública del backend (sin protocolo) | `api.misitio.com` |
| `VITE_API_BASE` | URL completa del backend API | `https://api.misitio.com/api` |
| `NODE_ENV` | production | `production` |

**Ejemplo para desarrollo local en Render:**
- `BACKEND_URL` = `permoda-api.onrender.com`
- `VITE_API_BASE` = `https://permoda-api.onrender.com/api`

### 3️⃣ Configura Build Settings (si es necesario)
En **Settings** → **Build & Development Settings**:
- **Framework Preset**: Vite
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`

### 4️⃣ Redeploy el Proyecto
1. Ve a **Deployments**
2. Selecciona el último despliegue fallido
3. Haz clic en los **3 puntos** → **Redeploy**

---

## 🎯 Pasos MÍNIMOS para Producción

### Si despliegas SOLO el frontend en Vercel:
```bash
# 1. Desde la raíz del repo
git push origin main

# 2. En Vercel Dashboard:
# - New Project → Import from Git
# - Root Directory: frontend (deja en blanco si está en raíz)
# - Build: npm run build
# - Output: dist
# - Add env vars: VITE_API_BASE y BACKEND_URL
```

### Si despliegas backend en RENDER:
```bash
# 1. Crea un Web Service en Render
# 2. Conecta el repo
# 3. Build command: npm install && npm run build
# 4. Start command: npm start
# 5. Añade env vars: JWT_SECRET, DATABASE_URL, etc.
# 6. Copia la URL pública: https://permoda-api.onrender.com
# 7. Actualiza VITE_API_BASE en Vercel a esa URL
```

---

## ❓ ¿Aún ves 404?

Si después de redeploy sigue fallando:

1. **Verifica el log de build en Vercel** (Deployments → Ver logs)
2. **Asegúrate que VITE_API_BASE está correcta** (sin `/api` al final en algunas configs)
3. **Comprueba que el backend está corriendo** y accessible
4. **CORS**: El backend debe permitir requests desde tu dominio Vercel:
   ```typescript
   // En src/index.ts
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'https://tu-proyecto.vercel.app'
   }));
   ```

---

## 📝 Archivos Creados

```
✓ vercel.json (raíz) — Configuración para monorepo
✓ frontend/vercel.json — Configuración alternativa para frontend
```

Ambos contienen la misma lógica: reescribir `/api/*` al backend y servir SPA.

---

## 🚀 ¿Listo?

Ya puedes hacer push y Vercel debería construir correctamente:
```bash
git push origin main
```

El despliegue debería completarse en 2-5 minutos. ✨
