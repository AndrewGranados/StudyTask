# StudyTask Backend

API REST para StudyTask construida con Node.js nativo y SQLite.

## Características

- **Node.js HTTP nativo** — Sin Express, solo `node:http`
- **SQLite** — Base de datos embebida, archivo único (`data/studytask.sqlite`)
- **API REST completa** — CRUD + toggle status + filtros
- **CORS** — Configurado para `http://localhost:3000` (frontend)
- **Validación** — Backend + constraints SQL
- **Auto-inicialización** — Crea carpeta, BD, tabla y seed si vacío
- **Persistencia** — Datos sobreviven a reinicios

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
cd backend
npm install
```

## Ejecución

```bash
# Producción
npm start

# Desarrollo (watch mode)
npm run dev
```

El servidor escucha en: **http://localhost:3001**

## Estructura

```
backend/
├── src/
│   ├── server.js              # Entry point, HTTP server, CORS, router
│   ├── database.js            # SQLite connection, repository, seed
│   ├── routes/
│   │   └── tasks.js           # Routes, query/body parsing, CORS preflight
│   └── controllers/
│       └── tasksController.js # Validation, sanitization, CRUD logic
├── data/
│   └── studytask.sqlite       # SQLite database (auto-created)
├── package.json
└── README.md
```

## Endpoints

### Health & Info

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/` | API info |

### Tasks

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/tasks` | Listar tareas (con filtros opcionales) |
| GET | `/api/tasks/:id` | Obtener tarea por ID |
| POST | `/api/tasks` | Crear nueva tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea completa |
| PATCH | `/api/tasks/:id/status` | Toggle pending ↔ completed |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

### Filtros (GET /api/tasks)

| Parámetro | Valores | Ejemplo |
|-----------|---------|---------|
| `status` | `pending`, `completed` | `?status=pending` |
| `priority` | `low`, `medium`, `high` | `?priority=high` |
| `subject` | string | `?subject=Programación` |

Combinables: `?status=pending&priority=high`

## Modelo de datos

```json
{
  "id": 1,
  "title": "Investigar PWA",
  "description": "Investigar Service Workers...",
  "subject": "Desarrollo Web",
  "dueDate": "2026-10-10",
  "priority": "high",
  "status": "pending",
  "createdAt": "2026-10-06T04:50:02.371Z",
  "updatedAt": "2026-10-06T04:50:02.371Z"
}
```

### Constraints

- `priority`: `low` | `medium` | `high`
- `status`: `pending` | `completed`
- `title`: requerido, min 3 chars
- `subject`: requerido
- `dueDate`: requerido, formato YYYY-MM-DD

## Respuestas JSON

### Éxito

```json
// Colección
{ "success": true, "data": [...] }

// Un recurso
{ "success": true, "data": { ... } }

// 204 No Content (DELETE)
```

### Error

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": ["title is required...", "priority must be..."]
  }
}
```

### Códigos HTTP

| Código | Uso |
|--------|-----|
| 200 | OK (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (validación) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Base de datos

- **Ubicación**: `backend/data/studytask.sqlite`
- **Tabla**: `tasks`
- **Auto-creación**: Al iniciar el servidor
- **Seed**: 12 tareas académicas si tabla vacía (solo 1ra vez)
- **Persistencia**: Archivo físico, sobrevive a reinicios

### Esquema SQL

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  due_date TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## Pruebas rápidas

```bash
# Health check
curl http://localhost:3001/api/health

# Listar todas
curl http://localhost:3001/api/tasks

# Filtrar pendientes
curl "http://localhost:3001/api/tasks?status=pending"

# Obtener una
curl http://localhost:3001/api/tasks/1

# Crear
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","subject":"Test","dueDate":"2026-10-20","priority":"medium"}'

# Toggle status
curl -X PATCH http://localhost:3001/api/tasks/1/status

# Eliminar
curl -X DELETE http://localhost:3001/api/tasks/1
```

## CORS

Configurado exclusivamente para: `http://localhost:3000`

Headers permitidos:
- `Access-Control-Allow-Origin: http://localhost:3000`
- `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- `Access-Control-Allow-Credentials: true`

## Detener el servidor

```bash
Ctrl+C
```

El servidor cierra la conexión SQLite correctamente.

## Notas de desarrollo

- **Sin Express**: Usa `node:http` nativo para simplicidad académica
- **Sin ORM**: SQL directo para transparencia
- **sqlite3**: Prebuilt binaries para Windows (no requiere Python/build tools)
- **ES Modules**: `"type": "module"` en package.json
- **Watch mode**: `npm run dev` usa `node --watch` (Node 18+)