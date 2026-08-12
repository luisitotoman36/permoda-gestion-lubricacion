# 🚀 Configuración Completada - Railway + Vercel

## ✅ Cambios Realizados

### 1. Backend - CORS Actualizado
- Archivo: `src/index.ts`
- Se agregó soporte para múltiples orígenes
- Ahora acepta requests desde:
  - ✓ Frontend Vercel (automático)
  - ✓ Localhost (desarrollo)
  - ✓ Railway interno

### 2. Vercel - URLs del Backend Configuradas
- Archivo: `vercel.json` y `frontend/vercel.json`
- URL de Railway agregada:
  ```
  https://permoda-gestion-lubricacion-production.up.railway.app
  ```
- Todos los requests `/api/*` se reescriben al backend

---

## 📋 Últimos Pasos en Railway

### **PASO 1: Agregar Variable de Entorno**
1. Ve a Railway → Tu Proyecto → Servicio `permoda-gestion-lubricacion`
2. Abre la pestaña **"Variables"**
3. Haz clic en **"+ New Variable"** o **"Add Variable"**
4. Añade:
   ```
   FRONTEND_URL = https://permoda-gestion-lubricacion.vercel.app
   ```
5. **Guarda/Confirma**

### **PASO 2: Trigger Redeploy**
1. Ve a **"Deployments"**
2. Busca el último despliegue (debería estar CRASHED)
3. Haz clic en los **3 puntos (...)**
4. Selecciona **"Redeploy"** o **"Retry"**
5. Espera 3-5 minutos a que se despliegue

### **PASO 3: Verificar en Vercel**
1. Ve a Vercel → Tu Proyecto → **"Settings"**
2. En **"Environment Variables"** asegúrate de tener:
   ```
   VITE_API_BASE = https://permoda-gestion-lubricacion-production.up.railway.app/api
   ```
3. Si no está, añádelo
4. Redeploy en Vercel

---

## 🧪 Testear

Después de que ambos estén desplegados:

1. **Abre tu app en Vercel:**
   ```
   https://permoda-gestion-lubricacion.vercel.app
   ```

2. **Intenta hacer login:**
   - Email: `admin@permoda.local`
   - Contraseña: `123456`

3. **Si ves la pantalla de login, funciona!** ✓

4. **Si ves 404 o error de API:**
   - Abre DevTools (F12) → Console
   - Comprueba si hay errores CORS
   - Verifica URLs en Network tab

---

## 🔗 URLs Finales

| Componente | URL |
|-----------|-----|
| **Frontend** | https://permoda-gestion-lubricacion.vercel.app |
| **Backend** | https://permoda-gestion-lubricacion-production.up.railway.app |
| **API Docs** | https://permoda-gestion-lubricacion-production.up.railway.app/api/* |

---

## 📚 Archivos Modificados

- ✅ `src/index.ts` — CORS actualizado
- ✅ `vercel.json` — URL de Railway agregada
- ✅ `frontend/vercel.json` — URL de Railway agregada
- ✅ `RAILWAY_CONFIG.md` — Este archivo

Todos los cambios ya están en **GitHub (main branch)** y Railway se redeploy automáticamente.
