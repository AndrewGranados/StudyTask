# StudyTask

**Organiza tus tareas. Enfócate en lo importante.**

Una aplicación web para gestión de tareas académicas, diseñada para estudiantes que necesitan organizar sus estudios de manera eficiente.

## Estado actual

✅ **Fase 1 — Frontend COMPLETADA**
✅ **Fase 2 — Backend + API REST + SQLite COMPLETADA**

La aplicación frontend está completamente funcional. El backend provee una API REST con SQLite. La integración frontend + API será la Fase 3.

## Tecnologías

### Frontend
- **Vue 3** — Composition API, `<script setup>`
- **TypeScript** — Tipado estricto (strict mode)
- **Vue Router 4** — Navegación SPA
- **Vite** — Build tool y dev server
- **Pinia** — Estado de UI (sidebar, modales)
- **lucide-vue-next** — Iconos SVG
- **date-fns** — Formato de fechas i18n (español)
- **CSS Variables** — Design system personalizado sin dependencias

### Backend
- **Node.js** — HTTP nativo (`node:http`), sin Express
- **SQLite** — Base de datos embebida via `sqlite3`
- **JavaScript** — ES Modules, async/await
- **CORS nativo** — Para `http://localhost:3000`

## Características implementadas

### Frontend (Fase 1)
- **Dashboard** — Estadísticas + tareas próximas
- **Lista de tareas** — Filtros por estado, prioridad, materia, búsqueda
- **Crear/Editar tarea** — Formulario validado en tiempo real
- **Detalle de tarea** — Vista completa + acciones (editar, completar, eliminar)
- **CRUD visual completo** con datos mock + localStorage
- **Responsive mobile-first** (móvil, tablet, desktop)
- **Accesibilidad básica** (ARIA, focus visible, teclado)

### Backend (Fase 2)
- **API REST completa** en `http://localhost:3001`
- **SQLite** en `backend/data/studytask.sqlite` (auto-creación)
- **Endpoints**: GET/POST/PUT/PATCH/DELETE `/api/tasks`
- **Filtros**: `?status=`, `?priority=`, `?subject=`
- **Validación backend** + constraints SQL
- **CORS** para `http://localhost:3000`
- **Seed automático** (12 tareas si BD vacía)
- **Persistencia real** tras reinicio

## Estructura del proyecto

```
C:\Pwa\AplicativoNotas\
├── frontend/                 # Aplicación Vue (Fase 1)
│   ├── src/
│   │   ├── components/       # 9 componentes reutilizables
│   │   ├── views/            # 4 vistas de página
│   │   ├── router/           # 7 rutas
│   │   ├── services/         # taskService.ts (mock + localStorage)
│   │   ├── composables/      # 4 composables reactivos
│   │   ├── stores/           # 1 store Pinia
│   │   ├── types/            # Interfaces TypeScript
│   │   └── assets/styles/    # Design system CSS
│   ├── dist/                 # Build producción
│   └── package.json
├── backend/                  # API REST + SQLite (Fase 2)
│   ├── src/
│   │   ├── server.js         # HTTP nativo + CORS
│   │   ├── database.js       # SQLite + repository + seed
│   │   ├── routes/tasks.js   # Rutas + parsing
│   │   └── controllers/tasksController.js  # Validación + CRUD
│   ├── data/studytask.sqlite # BD SQLite
│   └── package.json
├── PROJECT_STATUS.md         # Seguimiento técnico
├── README.md
└── .gitignore
```

## Rutas disponibles (Frontend)

| Ruta | Nombre | Descripción |
|------|--------|-------------|
| `/` | Dashboard | Stats + próximas tareas |
| `/tasks` | TaskList | Todas con filtros |
| `/tasks/new` | TaskCreate | Crear tarea |
| `/tasks/:id` | TaskDetail | Detalle + acciones |
| `/tasks/:id/edit` | TaskEdit | Editar tarea |
| `/completed` | CompletedTasks | Solo completadas |
| `/pending` | PendingTasks | Solo pendientes |

## Endpoints API (Backend)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | Listar (filtros: status, priority, subject) |
| GET | `/api/tasks/:id` | Obtener una |
| POST | `/api/tasks` | Crear |
| PUT | `/api/tasks/:id` | Actualizar |
| PATCH | `/api/tasks/:id/status` | Toggle pending ↔ completed |
| DELETE | `/api/tasks/:id` | Eliminar |

## Modelo de datos

```typescript
interface Task {
  id: number
  title: string
  description: string
  subject: string
  dueDate: string      // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'completed'
  createdAt: string    // ISO 8601
  updatedAt: string    // ISO 8601
}
```

## Cómo ejecutar

### Prerrequisitos
- Node.js 18+
- npm 9+

### Frontend (puerto 3000)
```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run build      # Build producción
npm run typecheck  # Verificación tipos
```

### Backend (puerto 3001)
```bash
cd backend
npm install
npm start          # http://localhost:3001
npm run dev        # Watch mode (Node 18+)
```

### Verificación completa
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev

# Probar API
curl http://localhost:3001/api/health
curl http://localhost:3001/api/tasks
```

## Fases del proyecto

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Frontend (Vue 3 + TS) | ✅ Completada |
| 2 | Backend + API REST + SQLite | ✅ Completada |
| 3 | Integración Frontend + API | ⏳ Pendiente |
| 4 | PWA (Service Worker, Offline) | ⏳ Pendiente |
| 5 | Pruebas y entrega | ⏳ Pendiente |

## Repositorio

- **Remoto:** https://github.com/AndrewGranados/StudyTask.git
- **Rama principal:** `main`

## Licencia

Proyecto educativo — StudyTask