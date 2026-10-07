# StudyTask — Estado del Proyecto

## Estado actual

**Fase 1 — Frontend: COMPLETADA ✅**
**Fase 2 — Backend + API REST + SQLite: COMPLETADA ✅**
**Fase 3 — Integración Frontend + API REST + SQLite: COMPLETADA ✅**
**Corrección Fase 3 (Bug Fixes & UX): COMPLETADA ✅**
**Corrección Final Fase 3 (CREATE Bug + Sync + Materias): COMPLETADA ✅**

- Vue 3 + TypeScript + Vue Router funcionando (Fase 1)
- Node.js + SQLite + API REST funcionando (Fase 2)
- Frontend integrado con API REST real (Fase 3)
- SQLite como fuente de verdad única
- CRUD completo funcionando end-to-end
- Diseño responsive implementado
- Build de producción exitoso en ambos
- **Bug CREATE corregido** (loading state "Guardando..." se quedaba bloqueado)
- **Feedback visual añadido** (toasts de éxito/error para CRUD)
- **Sincronización pending/completed corregida** (reactividad reactiva con arrays inmutables)
- **Materias de ejemplo restauradas** (10 materias académicas en selector)
- **Datos seed eliminados** y auto-seed desactivado

## Fases del proyecto

### Fase 1 — Frontend
**Estado:** Completada ✅
**Porcentaje:** 100%
**Qué se implementó:**
- Inicialización del proyecto Vue 3 + TypeScript + Vue Router + Vite
- Estructura de carpetas frontend/backend
- Configuración de Vite, TypeScript (strict mode), ESLint
- Modelo de datos Task con TypeScript (interfaces tipadas)
- Servicio de tareas con mock data (12 tareas académicas realistas) y persistencia localStorage
- Composables reactivos para gestión de estado (useTasks, useTask, useDashboard, useSubjects)
- Router con rutas: /, /tasks, /tasks/new, /tasks/:id, /tasks/:id/edit, /completed, /pending
- Componentes base reutilizables: StatCard, TaskCard, TaskPriorityBadge, TaskStatusBadge, EmptyState, ConfirmDialog, TaskForm, AppHeader, AppSidebar
- Vistas completas: DashboardView, TaskListView, TaskDetailView, TaskFormView
- Diseño responsive mobile-first con CSS Variables y design system personalizado
- Iconografía consistente con lucide-vue-next
- Validación de formularios en tiempo real con mensajes de error claros
- Estados vacíos informativos con call-to-action
- Diálogo de confirmación para eliminación
- Accesibilidad básica (ARIA labels, focus visible, labels asociados, navegación por teclado)
- Arquitectura preparada para API REST (servicios abstraídos)

**Qué falta:** Nada - Fase 1 completada

### Fase 2 — Backend + API REST + SQLite
**Estado:** Completada ✅
**Porcentaje:** 100%
**Qué se implementó:**
- Servidor HTTP nativo Node.js (puerto 3001) sin Express
- Base de datos SQLite en `backend/data/studytask.sqlite` con auto-creación
- Tabla `tasks` con campos: id, title, description, subject, due_date, priority, status, created_at, updated_at
- Constraints CHECK para priority (low/medium/high) y status (pending/completed)
- Seeding automático de 12 tareas iniciales si la tabla está vacía (solo primera ejecución)
- API REST completa:
  - GET /api/health - Health check
  - GET / - Info de la API
  - GET /api/tasks - Lista con filtros opcionales (status, priority, subject)
  - GET /api/tasks/:id - Obtener una tarea
  - POST /api/tasks - Crear tarea (validación completa)
  - PUT /api/tasks/:id - Actualizar tarea (validación completa)
  - PATCH /api/tasks/:id/status - Toggle pending ↔ completed
  - DELETE /api/tasks/:id - Eliminar tarea
- Respuestas JSON consistentes con formato `{ success: true, data: ... }` o `{ success: false, error: { message } }`
- Códigos HTTP apropiados: 200, 201, 204, 400, 404, 500
- Validación backend: title, subject, dueDate obligatorios; priority y status válidos
- CORS configurado para `http://localhost:3000` (frontend)
- Manejo de errores centralizado sin stack traces en respuestas
- Persistencia garantizada tras reinicio del servidor
- Dependencia única: `sqlite3` (prebuilt binaries para Windows)

**Qué falta:** Nada - Fase 2 completada

### Fase 3 — Integración Frontend + API REST + SQLite
**Estado:** Completada ✅
**Porcentaje:** 100%
**Qué se implementó:**
- Servicio central de API: `frontend/src/services/api.ts` con `fetch()` nativo
- Reemplazo de `taskService.ts` mock/localStorage por llamadas reales a la API REST
- Variables de entorno: `VITE_API_BASE_URL` configurable (default `http://localhost:3001/api`)
- Tipado TypeScript para `ImportMeta.env` en `vite-env.d.ts`
- Integración transparente: composables (`useTasks`, `useTask`, `useDashboard`, `useSubjects`) sin cambios en su interfaz
- Eliminación de mock/localStorage como fuente principal de datos
- SQLite como única fuente de verdad
- Manejo de errores HTTP: 400, 404, 500, errores de conexión
- Validación backend propagada al frontend
- Filtros funcionando via query parameters en API (`?status=`, `?priority=`, `?subject=`)
- Dashboard calculando estadísticas desde datos reales de SQLite
- CORS funcionando correctamente (`http://localhost:3000` → `http://localhost:3001`)
- Persistencia real verificada: tareas sobreviven a reinicio de Node.js

**Archivos creados/modificados:**
- `frontend/src/services/api.ts` — Servicio centralizado con `fetch()`
- `frontend/src/services/taskService.ts` — Refactorizado para usar API real
- `frontend/src/vite-env.d.ts` — Tipos para variables de entorno
- `frontend/src/services/taskService.ts` — Eliminado mock/localStorage, usa API

**Pruebas realizadas:**
- ✅ CREATE: POST /api/tasks → 201, tarea creada en SQLite
- ✅ READ: GET /api/tasks → 200, lista completa desde SQLite
- ✅ READ ONE: GET /api/tasks/:id → 200, tarea individual
- ✅ UPDATE: PUT /api/tasks/:id → 200, cambios persistidos
- ✅ STATUS TOGGLE: PATCH /api/tasks/:id/status → 200, pending ↔ completed
- ✅ DELETE: DELETE /api/tasks/:id → 204, eliminada de SQLite
- ✅ FILTROS: `?status=pending`, `?priority=high`, `?subject=...` funcionando
- ✅ VALIDACIÓN: 400 para datos inválidos (title corto, priority inválido, campos faltantes)
- ✅ 404: ID inexistente, rutas no encontradas
- ✅ CORS: Headers correctos para `Origin: http://localhost:3000`
- ✅ PERSISTENCIA: Tarea creada → reinicio Node.js → tarea presente en GET /api/tasks
- ✅ TYPECHECK: `npm run typecheck` → 0 errores
- ✅ BUILD: `npm run build` → éxito en 3.7s

**Corrección Fase 3 (Bug Fixes & UX) - COMPLETADA ✅:**
- **Bug CREATE corregido**: El estado "Guardando..." se quedaba bloqueado permanentemente. Causa: `TaskForm.vue` tenía su propio estado `submitting` que nunca se reseteaba porque el padre manejaba la llamada async. Solución: Eliminado estado local en `TaskForm.vue`, ahora recibe `submitting` y `submitError` como props del padre (`TaskFormView.vue`).
- **Feedback visual añadido**: Sistema de toasts/notificaciones (`Toast.vue` + `useToast.ts`) con mensajes de éxito/error para CREATE, UPDATE, DELETE, STATUS TOGGLE. Auto-desaparición a 4s, diseño integrado con la paleta de colores.
- **Datos seed eliminados**: Eliminados 7 registros seed/mock de la BD SQLite (`DELETE FROM tasks`). La BD queda vacía para que el usuario cree sus propias tareas.
- **Auto-seed desactivado**: Modificado `backend/src/database.js` para NO insertar datos seed automáticamente al iniciar. Ahora solo crea la tabla si no existe y loggea si está vacía.
- **Feedback en TaskDetailView**: Toasts para toggle status y delete.
- **Feedback en TaskListView**: Toasts para delete y toggle status.
- **Feedback en TaskFormView**: Toasts para create/update success/error.

**Archivos creados/modificados en corrección:**
- `frontend/src/components/Toast.vue` — Componente toast/notificación
- `frontend/src/composables/useToast.ts` — Composable para gestión de toasts
- `frontend/src/components/TaskForm.vue` — Eliminado estado `submitting`/`submitError` local, usa props
- `frontend/src/views/TaskFormView.vue` — Añadido `useToast`, muestra toasts de éxito/error
- `frontend/src/views/TaskDetailView.vue` — Añadido `useToast`, toasts para status toggle y delete
- `frontend/src/views/TaskListView.vue` — Añadido `useToast`, toasts para delete y toggle
- `backend/src/database.js` — Auto-seed desactivado

**Pruebas realizadas en corrección:**
- ✅ CREATE: POST /api/tasks → 201, toast "Tarea creada correctamente", navegación a lista
- ✅ READ: GET /api/tasks → 200, lista completa desde SQLite
- ✅ READ ONE: GET /api/tasks/:id → 200, tarea individual
- ✅ UPDATE: PUT /api/tasks/:id → 200, toast "Tarea actualizada correctamente", navegación a lista
- ✅ STATUS TOGGLE: PATCH /api/tasks/:id/status → 200, toast "Tarea marcada como completada/pendiente"
- ✅ DELETE: DELETE /api/tasks/:id → 204, toast "Tarea eliminada correctamente"
- ✅ FILTROS: `?status=pending`, `?priority=high`, `?subject=...` funcionando
- ✅ VALIDACIÓN: 400 para datos inválidos (title corto, priority inválido, campos faltantes) con toast de error
- ✅ 404: ID inexistente, rutas no encontradas
- ✅ CORS: Headers correctos para `Origin: http://localhost:3000`
- ✅ PERSISTENCIA: Tarea creada → reinicio Node.js → tarea presente en GET /api/tasks
- ✅ BASE LIMPIA: BD vacía al inicio, sin datos seed
- ✅ TYPECHECK: `npm run typecheck` → 0 errores
- ✅ BUILD: `npm run build` → éxito en 5.1s

**Corrección Final Fase 3 (Sincronización + Botón Estado + Bug Description) - COMPLETADA ✅:**

- **Sincronización entre vistas corregida**: Al navegar entre `/pending`, `/completed`, `/tasks`, `/` las vistas ahora reflejan el estado real del backend SIN Ctrl+R. Causa: `TaskListView.vue` no recargaba tareas al cambiar de ruta. Solución: Añadido watcher en `route.name` que actualiza filtros y recarga tareas (`TaskListView.vue` líneas 33-47).

- **Control visual de estado rediseñado**: Botón de cambio de estado en `TaskCard.vue` rediseñado visualmente.
  - **Pendiente**: Cuadrado con borde (checkbox vacío) → representa "marcar como completada"
  - **Completada**: Círculo verde con check (✓) en color verde principal de StudyTask → representa "completada"
  - Usa iconos `Square` (pendiente) y `CheckCircle2` (completada) de lucide-vue-next
  - Color verde principal (`text-success`) para estado completado
  - Mantiene accesibilidad (aria-label), tooltip, interacción teclado, hover/focus, responsive

- **Bug Description al cambiar estado CORREGIDO**: La descripción se borraba al cambiar estado (pending ↔ completed). Causa: `toggleStatus` en store llamaba a `updateTask` (PUT `/api/tasks/:id`) enviando solo `status`, pero backend `sanitizeInput` rellenaba campos faltantes con strings vacíos, borrando `description`. Solución:
  1. Añadido `toggleTaskStatus` en `taskService.ts` usando PATCH `/api/tasks/:id/status`
  2. `toggleStatus` en store ahora usa `taskService.toggleTaskStatus` (PATCH) en vez de `updateTask` (PUT)
  3. Backend PATCH `/api/tasks/:id/status` solo actualiza `status` y `updated_at`

**Archivos creados/modificados en corrección final:**
- `frontend/src/services/taskService.ts` — Añadido `toggleTaskStatus` usando PATCH `/api/tasks/:id/status`
- `frontend/src/stores/tasks.ts` — `toggleStatus` usa `taskService.toggleTaskStatus` (PATCH) en vez de `updateTask` (PUT)
- `frontend/src/components/TaskCard.vue` — Botón estado rediseñado: `Square` (pendiente) / `CheckCircle2` verde (completada)
- `frontend/src/views/TaskListView.vue` — Watcher en `route.name` para recargar tareas al navegar

**Pruebas realizadas en corrección final:**
- ✅ CREATE: POST /api/tasks → 201, toast "Tarea creada correctamente", navegación a lista
- ✅ READ: GET /api/tasks → 200, lista completa desde SQLite
- ✅ READ ONE: GET /api/tasks/:id → 200, tarea individual
- ✅ UPDATE: PUT /api/tasks/:id → 200, toast "Tarea actualizada correctamente", navegación a lista
- ✅ STATUS TOGGLE: PATCH /api/tasks/:id/status → 200, toast "Tarea marcada como completada/pendiente"
- ✅ DELETE: DELETE /api/tasks/:id → 204, toast "Tarea eliminada correctamente"
- ✅ FILTROS: `?status=pending`, `?priority=high`, `?subject=...` funcionando
- ✅ VALIDACIÓN: 400 para datos inválidos (title corto, priority inválido, campos faltantes) con toast de error
- ✅ 404: ID inexistente, rutas no encontradas
- ✅ CORS: Headers correctos para `Origin: http://localhost:3000`
- ✅ PERSISTENCIA: Tarea creada → reinicio Node.js → tarea presente en GET /api/tasks
- ✅ SYNC PENDING/COMPLETED: Cambio pending→completed → desaparece de /pending, aparece en /completed SIN Ctrl+R
- ✅ SYNC INVERSO: Cambio completed→pending → desaparece de /completed, aparece en /pending SIN Ctrl+R
- ✅ MATERIAS: Selector muestra 10 materias académicas, NO "Test"
- ✅ TYPECHECK: `npm run typecheck` → 0 errores
- ✅ BUILD: `npm run build` → éxito en 3.5s
- ✅ DESCRIPTION PERSISTE: Cambio pending→completed→pending → descripción se mantiene exactamente igual en SQLite

### Fase 4 — PWA
**Estado:** Pendiente

### Fase 5 — Pruebas y entrega
**Estado:** Pendiente

## Arquitectura actual

```
C:\Pwa\AplicativoNotas\
├── frontend/
│   ├── src/
│   │   ├── components/       # 10 componentes reutilizables (+ Toast)
│   │   ├── views/            # 4 vistas de página
│   │   ├── router/           # Configuración de Vue Router (7 rutas)
│   │   ├── services/         # api.ts + taskService.ts (API real)
│   │   ├── composables/      # 5 composables reactivos (+ useToast)
│   │   ├── stores/           # 1 store Pinia (UI state)
│   │   ├── types/            # Interfaces TypeScript
│   │   └── assets/styles/    # Design system CSS (main.css)
│   ├── dist/                 # Build de producción
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── server.js         # Servidor HTTP nativo + CORS
│   │   ├── database.js       # SQLite + repository (sin auto-seed)
│   │   ├── routes/
│   │   │   └── tasks.js      # Rutas + parsing + CORS
│   │   └── controllers/
│   │       └── tasksController.js  # Lógica de negocio + validación
│   ├── data/
│   │   └── studytask.sqlite  # Base de datos SQLite (limpia, sin seed)
│   ├── package.json
│   └── README.md
├── PROJECT_STATUS.md
├── README.md
└── .gitignore
```

## Tecnologías utilizadas

### Frontend
- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript** (strict mode, tipado completo)
- **Vue Router 4** (SPA navigation)
- **Vite** (build tool + dev server)
- **Pinia** (state management para UI)
- **lucide-vue-next** (iconos SVG)
- **date-fns** (formato de fechas i18n)
- **CSS Variables** (design system sin dependencias)
- **fetch() nativo** (API REST)

### Backend
- **Node.js** (HTTP nativo `node:http`, sin Express)
- **SQLite** via `sqlite3` (prebuilt binaries Windows)
- **JavaScript** (ES Modules, async/await)
- **CORS** nativo para `http://localhost:3000`

## Decisiones técnicas

1. **Node.js HTTP nativo**: Sin Express, solo `node:http`. Simplicidad académica.
2. **SQLite con sqlite3**: Prebuilt binaries para Windows, sin Python/build tools extra.
3. **Auto-inicialización DB**: Carpeta `data/`, archivo `.sqlite`, tabla `tasks` (sin auto-seed).
4. **Validación dual**: Frontend (UX) + Backend (seguridad). Constraints CHECK en SQL.
5. **CORS restringido**: Solo `http://localhost:3000`, no wildcard.
6. **JSON consistente**: `{ success: true, data }` / `{ success: false, error: { message } }`.
7. **Sin ORM**: SQL directo para transparencia académica (fácil de explicar al profesor).
8. **Integración transparente**: Composables sin cambios, solo taskService.ts actualizado.
9. **Feedback UX**: Sistema de toasts centralizado para feedback de operaciones CRUD.

## Archivos principales (Backend)

- `backend/src/server.js` — Entry point, servidor HTTP, CORS, router
- `backend/src/database.js` — Conexión SQLite, repository (sin auto-seed)
- `backend/src/routes/tasks.js` — Rutas, parsing query/body, CORS preflight
- `backend/src/controllers/tasksController.js` — Validación, sanitización, lógica CRUD
- `backend/data/studytask.sqlite` — Base de datos persistente (limpia)
- `backend/package.json` — Scripts: `npm start`, `npm run dev`

## Archivos principales (Frontend - Integración + Corrección)

- `frontend/src/services/api.ts` — Servicio centralizado con `fetch()` nativo
- `frontend/src/services/taskService.ts` — Adaptador a API real (misma interfaz)
- `frontend/src/vite-env.d.ts` — Tipos para `import.meta.env.VITE_API_BASE_URL`
- `frontend/src/composables/useTasks.ts` — Sin cambios, usa taskService
- `frontend/src/composables/useToast.ts` — Composable para toasts
- `frontend/src/components/Toast.vue` — Componente toast/notificación
- `frontend/src/components/TaskForm.vue` — Sin estado local submitting/error
- `frontend/src/views/TaskFormView.vue` — Controla submitting/error + toasts
- `frontend/src/views/TaskDetailView.vue` — Toasts para status/delete
- `frontend/src/views/TaskListView.vue` — Toasts para delete/toggle

## Problemas conocidos resueltos

1. ✅ **better-sqlite3 build error** — Cambiado a `sqlite3` con prebuilt binaries Windows
2. ✅ **Missing await en controladores** — Corregido todas las llamadas al repository
3. ✅ **CORS preflight** — OPTIONS manejado antes del router con headers correctos
4. ✅ **Persistencia** — Verificada tras reinicio de Node.js
5. ✅ **Validación backend** — 400 con detalles para datos inválidos
6. ✅ **Frontend sin regresiones** — `npm run typecheck` y `npm run build` OK
7. ✅ **Integración API** — Mock/localStorage eliminado, API real funcionando
8. ✅ **Bug CREATE loading state** — Estado "Guardando..." bloqueado, corregido moviendo estado al padre
8. ✅ **Feedback UX** — Sistema de toasts para éxito/error en todas las operaciones CRUD
9. ✅ **Datos seed** — Eliminados, auto-seed desactivado, BD limpia

## Próximos pasos (Fase 4+)

1. PWA: Service Worker, Manifest, Offline support
2. Tests unitarios (Vitest) y E2E (Playwright)
3. Despliegue

---

**Última actualización:** 2026-10-07
**Commits:**
- `4297beb` — feat(frontend): implement complete StudyTask frontend
- `7c35162` — feat(backend): implement REST API with SQLite
- `c7c8da5` — feat(integration): connect frontend with REST API and SQLite
- `fix(integration): stabilize CRUD flow, add toast feedback, clean seed data`
- `fix(integration): fix create bug, sync state, restore subjects`
- `fix(integration): fix status sync, status button UI, description bug`
**Builds:** ✅ Frontend + Backend funcionando