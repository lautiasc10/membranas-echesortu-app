# Membranas Echesortu 🏗️

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC292B?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Membranas Echesortu es un robusto sistema integral de gestión (ERP/E-Commerce) diseñado para la administración de inventario, ventas, cotizaciones, ofertas y exhibición de proyectos (Galería). Construido para escalabilidad y alto rendimiento, el proyecto utiliza **Clean Architecture** en el backend y un diseño basado en módulos (**Feature-Sliced Design**) en el frontend.

---

## ✨ Características Principales

*   **🛒 Gestión de Ventas y Cotizaciones:** Procesamiento completo de ventas con control estricto de concurrencia y stock (Optimistic Locking).
*   **📦 Inventario Dinámico:** Base de datos relacional para control de productos, variantes múltiples, marcas y categorías.
*   **🎁 Ofertas y Descuentos:** Motor customizado para lanzar promociones y precios promocionales programados.
*   **🖼️ Galería de Proyectos:** Módulo interactivo "Antes/Después" para mostrar el trabajo finalizado de la empresa.
*   **🔐 Autenticación y Seguridad:** JWT rotativo (con Refresh Tokens silenciosos), Rate Limiting contra ataques de fuerza bruta y Password Hashing fuerte.
*   **⚡ Caché en Memoria:** Uso inteligente de `IMemoryCache` para una carga instantánea del catálogo reduciendo latencia y coste de recursos SQL.

---

## 🛠️ Stack Tecnológico

### Backend (.NET 8)
*   **Core:** C# 12, ASP.NET Core Web API, **Clean Architecture**.
*   **Datos:** Entity Framework Core 8, SQL Server 2022.
*   **Validaciones y Logging:** FluentValidation, Serilog.
*   **Testing:** xUnit (Pruebas Unitarias), Moq.

### Frontend (React)
*   **Core:** React 18, Vite.
*   **Estado y Fetching:** TanStack Query (React Query) para caching local e invalidación mutativa.
*   **Estilos y UI:** Tailwind CSS.
*   **Testing:** Playwright (End-to-End Tests).

### DevOps & Infraestructura
*   **Contenedores:** Docker, Docker Compose (Multi-stage builds optimizados).
*   **Servidor Web Integrado:** Nginx (SPA Route Handler & Reverse Proxy API).
*   **CI/CD:** Servido por GitHub Actions (Pipelines de Test paralelos).

---

## 🚀 Despliegue Local (Docker Compose)

El proyecto entero está completamente "Dockerizado" para correr con un solo comando en cualquier entorno Cloud o Local. No necesitas instalar base de datos localmente.

### Pre-requisitos
*   [Docker](https://www.docker.com/products/docker-desktop) instalado y funcionando.

### Pasos
1. Clona el repositorio.
2. Abre la terminal en la raíz del proyecto.
3. Ejecuta el entorno de pruebas/producción:
   ```bash
   docker compose up --build
   ```

Esto levantará los siguientes servicios automáticamente:
- **Base de Datos:** SQL Server 2022 en el puerto `1433`.
- **Backend API:** Expuesto en `http://localhost:8080`.
- **Frontend SPA:** Expuesto en `http://localhost:80` (Cargado en tu navegador instantáneamente vía Nginx).

---

## 🏗️ Ejecución Manual (Desarrollo)

Si deseas modificar código sin Docker, puedes lanzar ambos servidores por separado:

**Backend:**
1. Ve a `/backend` e inicia la base de datos necesaria o ajusta la conexión en tu `.env`.
2. Restaura y ejecuta:
```bash
cd backend/src/Web
dotnet run
```

**Frontend:**
1. Corre la instalación e inicia el dev-server:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Pruebas y CI/CD

El proyecto incluye Pipelines en `.github/workflows` que evalúan la integridad del código en cada commit a la rama maestra:
- **Unitarias (C#):** Ubicadas en `backend/tests/Application.Tests`, validan la lógica de negocio sin depender de bases de datos.
- **End-to-End (React):** Ubicadas en `frontend/tests`, simulan acciones reales de usuario como navegación, login y creación de recursos con `npx playwright test`.
