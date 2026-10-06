# StudyTask

**Organiza tus tareas. Enfócate en lo importante.**

Una aplicación web para gestión de tareas académicas, diseñada para estudiantes que necesitan organizar sus estudios de manera eficiente.

## Estado actual

✅ **Fase 1 — Frontend COMPLETADA**

La aplicación frontend está completamente funcional con datos mock y localStorage. El backend, base de datos y funcionalidad PWA se implementarán en fases posteriores.

## Tecnologías

- **Vue 3** — Composition API, `<script setup>`
- **TypeScript** — Tipado estricto (strict mode)
- **Vue Router 4** — Navegación SPA
- **Vite** — Build tool y dev server
- **Pinia** — Estado de UI (sidebar, modales)
- **lucide-vue-next** — Iconos SVG
- **date-fns** — Formato de fechas i18n (español)
- **CSS Variables** — Design system personalizado sin dependencias

## Características implementadas

### Vistas principales
- **Dashboard** — Estadísticas resumidas (total, pendientes, completadas, alta prioridad, próximas 7 días) + lista de tareas próximas
- **Lista de tareas** — Con filtros por estado, prioridad, materia y búsqueda en tiempo real
- **Crear tarea** — Formulario validado con validación en tiempo real
- **Editar tarea** — Formulario pre-poblado con datos existentes
- **Detalle de tarea** — Vista completa con acciones (editar, completar/reabrir, eliminar)

### Funcionalidades CRUD
- ✅ Crear tareas con validación (título, materia, fecha obligatorios)
- ✅ Leer tareas (lista paginada y vista detalle)
- ✅ Actualizar tareas (editar campos + cambiar estado pendiente/completado)
- ✅ Eliminar tareas (con diálogo de confirmación accesible)

### UX/UI
- Diseño **responsive mobile-first** (funciona en móvil, tablet, desktop)
- Paleta de colores profesional (verde primario #10B981, neutros oscuros, superficies blancas)
- Iconografía consistente y semántica
- Estados vacíos informativos con call-to-action
- Validación de formularios en tiempo real con mensajes claros
- Accesibilidad básica: ARIA labels, focus visible, labels asociados, navegación por teclado, contraste adecuado
- Sin scroll horizontal accidental, botones táctiles cómodos (44px mínimo)

### Arquitectura
- Separación clara frontend/backend (carpeta `backend/` vacía lista para Fase 2)
- Servicios abstraídos para fácil migración a API REST (`taskService.ts`)
- Composables reactivos para lógica de negocio (`useTasks`, `useTask`, `useDashboard`, `useSubjects`)
- TypeScript en todo el código con interfaces compartidas
- Pinia solo para estado de UI global (sidebar)

## Estructura del proyecto

```
C:\Pwa\AplicativoNotas\
├── frontend/                 # Aplicación Vue
│   ├── src/
│   │   ├── components/       # 9 componentes reutilizables
│   │   ├── views/            # 4 vistas de página
│   │   ├── router/           # Configuración de rutas (7 rutas)
│   │   ├── services/         # Servicios de datos (taskService)
│   │   ├── composables/      # Lógica reactiva (4 composables)
│   │   ├── stores/           # 1 store Pinia (UI state)
│   │   ├── types/            # Interfaces TypeScript
│   │   └── assets/styles/    # Design system CSS
│   ├── public/
│   ├── dist/                 # Build de producción
│   └── package.json
├── backend/                  # Pendiente (Fase 2)
├── PROJECT_STATUS.md         # Seguimiento técnico detallado
└── README.md
```

## Rutas disponibles

| Ruta | Nombre | Descripción |
|------|--------|-------------|
| `/` | Dashboard | Vista principal con estadísticas y tareas próximas |
| `/tasks` | TaskList | Todas las tareas con filtros |
| `/tasks/new` | TaskCreate | Crear nueva tarea |
| `/tasks/:id` | TaskDetail | Ver detalle completo + acciones |
| `/tasks/:id/edit` | TaskEdit | Editar tarea existente |
| `/completed` | CompletedTasks | Solo tareas completadas |
| `/pending` | PendingTasks | Solo tareas pendientes |

## Modelo de datos

```typescript
interface Task {
  id: string              // UUID
  title: string           // Obligatorio, min 3 chars
  description: string     // Opcional, max 500 chars
  subject: string         // Obligatorio (materia académica)
  dueDate: string         // ISO 8601, fecha futura
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'completed'
  createdAt: string       // ISO 8601
  updatedAt: string       // ISO 8601
}
```

## Datos de ejemplo incluidos

12 tareas académicas realistas cubriendo:
- **Materias:** Desarrollo Web, Bases de Datos, Ingeniería de Software, Programación, Sistemas Operativos, Redes, Desarrollo Móvil
- **Estados:** 7 pendientes, 5 completadas
- **Prioridades:** 3 alta, 5 media, 4 baja
- **Fechas:** Distribuidas entre 7 y 25 días

## Cómo ejecutar el frontend

### Prerrequisitos
- Node.js 18+
- npm 9+

### Instalación
```bash
cd frontend
npm install
```

### Desarrollo
```bash
npm run dev
# Abre http://localhost:3000
```

### Build de producción
```bash
npm run build
# Genera carpeta dist/ lista para deploy
```

### Verificación de tipos
```bash
npm run typecheck
# vue-tsc --noEmit (strict mode)
```

### Linting
```bash
npm run lint
```

## Verificación rápida

```bash
cd frontend
npm install      # ~2 min
npm run typecheck  # ✅ Sin errores
npm run build      # ✅ Build exitoso (~3.8s)
npm run dev        # ✅ Servidor en http://localhost:3000
```

## Fases futuras

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Frontend (actual) | ✅ Completada |
| 2 | Backend + API REST | ⏳ Pendiente |
| 3 | Base de datos | ⏳ Pendiente |
| 4 | Integración Frontend + API | ⏳ Pendiente |
| 5 | PWA (Service Worker, Manifest, Offline) | ⏳ Pendiente |
| 6 | Pruebas y entrega | ⏳ Pendiente |

## Repositorio

- **Remoto:** https://github.com/AndrewGranados/StudyTask.git
- **Rama principal:** `main`

## Licencia

Proyecto educativo — StudyTask