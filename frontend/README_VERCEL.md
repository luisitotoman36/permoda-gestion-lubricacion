# Despliegue en Vercel (Frontend)

Instrucciones para desplegar el frontend en Vercel desde este repositorio.

Pasos recomendados:

1. Conecta tu repositorio a Vercel (https://vercel.com) y crea un nuevo proyecto.
   - Selecciona la carpeta `frontend` como root del proyecto (monorepo).

2. Ajustes de build (Vercel suele detectarlos automáticamente):
   - Framework: `Other` o detectará Vite.
   - Build command: `npm run build`
   - Output directory: `dist`

3. Variables de entorno (añade en Settings → Environment Variables):
   - `VITE_API_BASE` = URL base de tu backend (ej: `https://mi-backend.example.com/api`)

4. Despliegue via CLI (opcional):
   - Instala la CLI: `npm i -g vercel`
   - Desde la raíz del repositorio ejecuta:

```bash
cd frontend
vercel --prod
```

5. Post-despliegue
   - Vercel proveerá una URL pública (`https://mi-proyecto.vercel.app`).
   - Comprueba que la variable `VITE_API_BASE` apunta al backend público y que el backend permite CORS desde el dominio de Vercel.

Notas:
- El archivo `vercel.json` incluido configura la build estática y una ruta de fallback para SPA.
- Si quieres desplegar también el backend en Vercel necesitaríamos adaptarlo (TypeORM y DB) o desplegar el backend en otro servicio (Railway, Render, Heroku) y apuntar `VITE_API_BASE` a ese URL.
