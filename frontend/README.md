# Membranas Echesortu - Frontend SPA 🚀

Este directorio contiene la Single Page Application (SPA) para el sistema de Membranas Echesortu. Está diseñado con React 18, empaquetado y optimizado con Vite, y estructurado bajo los principios de **Feature-Sliced Design**.

## 🛠️ Stack Tecnológico

- **Framework:** React 18
- **Build Tool:** Vite
- **Data Fetching & State:** TanStack Query (React Query v5)
- **Estilos:** Tailwind CSS
- **Validación y Formularios:** React Hook Form / Zod (según aplique)
- **Testing:** Playwright (End-to-End Tests)

## 📁 Estructura del Proyecto (Feature-Sliced Design)

La arquitectura promueve la modularidad estricta para asegurar que el sistema escale sin convertirse en código espagueti.

- `src/app/`: Configuración global (Proveedores, React Query, Router).
- `src/modules/`: Reglas de negocio agrupadas por dominio (ej. `auth`, `products`, `sales`, `galleries`). Cada módulo contiene sus propios hooks, vistas, componentes y llamadas API.
- `src/shared/`: Componentes universales agnósticos al negocio (Botones genéricos, Layouts base, utilidades).
- `src/services/`: Clientes principales (Axios interceptores, Auth wrapper).

## 🚀 Inicio Rápido (Local)

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno:
   Copiar `.env.example` a `.env` y configurar el puerto base de `VITE_API_BASE_URL` apuntando al backend en ejecución.

3. Correr el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🐳 Docker (Producción)

El *build* de producción se realiza a través de un Multi-Stage Dockerfile (ubicado en esta misma carpeta).
La imagen final utiliza `nginx:alpine` para servir la SPA de manera estática y resolver limpliamente las URL de React Router. Para levantar el frontend (y su API remota) usar los perfiles de `docker-compose.yml` en la raíz.

## 🧪 Testing

Mantenemos un pipeline exigente. Para correr los tests E2E:
```bash
npx playwright test
```
Los reportes se generan en `/playwright-report` (excluido en control de versiones).
