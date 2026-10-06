import sqlite3 from 'sqlite3';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'data');
const DB_PATH = join(DATA_DIR, 'studytask.sqlite');

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
  console.log('[INFO] Created data directory:', DATA_DIR);
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('[ERROR] Failed to connect to SQLite:', err.message);
  } else {
    console.log('[INFO] Connected to SQLite database:', DB_PATH);
  }
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastInsertRowid: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS tasks (
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
  `);

  const row = await get('SELECT COUNT(*) as count FROM tasks');
  if (row.count === 0) {
    console.log('[INFO] Database is empty, seeding initial tasks...');
    const insert = db.prepare(`
      INSERT INTO tasks (title, description, subject, due_date, priority, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    const tasks = [
      { title: 'Investigar PWA', description: 'Investigar Service Workers, Cache API y Web App Manifest para el proyecto final.', subject: 'Desarrollo Web', dueDate: '2026-10-10', priority: 'high', status: 'pending', createdAt: now, updatedAt: now },
      { title: 'Diseñar esquema ER', description: 'Crear diagrama entidad-relación para el sistema de gestión académica.', subject: 'Bases de Datos', dueDate: '2026-10-12', priority: 'high', status: 'pending', createdAt: now, updatedAt: now },
      { title: 'Patrones de diseño', description: 'Estudiar Factory, Singleton, Observer y Strategy para el examen parcial.', subject: 'Ingeniería de Software', dueDate: '2026-10-08', priority: 'medium', status: 'pending', createdAt: now, updatedAt: now },
      { title: 'Algoritmos de ordenamiento', description: 'Implementar QuickSort, MergeSort y HeapSort en Python.', subject: 'Programación', dueDate: '2026-10-15', priority: 'medium', status: 'completed', createdAt: now, updatedAt: now },
      { title: 'Planificación de procesos', description: 'Resolver ejercicios de FCFS, SJF, Round Robin y Prioridad.', subject: 'Sistemas Operativos', dueDate: '2026-10-20', priority: 'low', status: 'pending', createdAt: now, updatedAt: now },
      { title: 'Configurar VLANs', description: 'Practicar configuración de VLANs, trunking y routing inter-VLAN en Packet Tracer.', subject: 'Redes', dueDate: '2026-10-18', priority: 'medium', status: 'completed', createdAt: now, updatedAt: now },
      { title: 'App React Native básica', description: 'Crear aplicación de lista de tareas con navegación y estado global.', subject: 'Desarrollo Móvil', dueDate: '2026-10-25', priority: 'high', status: 'pending', createdAt: now, updatedAt: now },
      { title: 'Normalización 3FN', description: 'Ejercicios de normalización hasta tercera forma normal.', subject: 'Bases de Datos', dueDate: '2026-10-07', priority: 'low', status: 'completed', createdAt: now, updatedAt: now },
      { title: 'Testing unitario con Vitest', description: 'Escribir pruebas para componentes Vue y composables.', subject: 'Desarrollo Web', dueDate: '2026-10-22', priority: 'medium', status: 'pending', createdAt: now, updatedAt: now },
      { title: 'Arquitectura limpia', description: 'Leer capítulos 1-5 y hacer resumen de Clean Architecture.', subject: 'Ingeniería de Software', dueDate: '2026-10-30', priority: 'low', status: 'pending', createdAt: now, updatedAt: now },
      { title: 'Memoria virtual y paginación', description: 'Entender TLB, page fault, algoritmos de reemplazo de página.', subject: 'Sistemas Operativos', dueDate: '2026-10-14', priority: 'high', status: 'pending', createdAt: now, updatedAt: now },
      { title: 'Protocolo HTTP/2 y HTTP/3', description: 'Comparar características, multiplexación, server push, QUIC.', subject: 'Redes', dueDate: '2026-10-16', priority: 'medium', status: 'completed', createdAt: now, updatedAt: now },
    ];

    for (const task of tasks) {
      await run(
        'INSERT INTO tasks (title, description, subject, due_date, priority, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [task.title, task.description, task.subject, task.dueDate, task.priority, task.status, task.createdAt, task.updatedAt]
      );
    }
    console.log(`[INFO] Seeded ${tasks.length} initial tasks`);
  } else {
    console.log('[INFO] Database already has', row.count, 'tasks, skipping seed');
  }
}

function mapTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    subject: row.subject,
    dueDate: row.due_date,
    priority: row.priority,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const taskRepository = {
  async getAll(filters = {}) {
    let sql = 'SELECT * FROM tasks';
    const params = [];
    const conditions = [];

    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }
    if (filters.priority) {
      conditions.push('priority = ?');
      params.push(filters.priority);
    }
    if (filters.subject) {
      conditions.push('subject = ?');
      params.push(filters.subject);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await all(sql, params);
    return rows.map(mapTask);
  },

  async getById(id) {
    const row = await get('SELECT * FROM tasks WHERE id = ?', [id]);
    return row ? mapTask(row) : null;
  },

  async create(data) {
    const now = new Date().toISOString();
    const result = await run(
      'INSERT INTO tasks (title, description, subject, due_date, priority, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.title, data.description, data.subject, data.dueDate, data.priority, 'pending', now, now]
    );
    return this.getById(result.lastInsertRowid);
  },

  async update(id, data) {
    const now = new Date().toISOString();
    const fields = [];
    const params = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      params.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      params.push(data.description);
    }
    if (data.subject !== undefined) {
      fields.push('subject = ?');
      params.push(data.subject);
    }
    if (data.dueDate !== undefined) {
      fields.push('due_date = ?');
      params.push(data.dueDate);
    }
    if (data.priority !== undefined) {
      fields.push('priority = ?');
      params.push(data.priority);
    }
    if (data.status !== undefined) {
      fields.push('status = ?');
      params.push(data.status);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    fields.push('updated_at = ?');
    params.push(now);
    params.push(id);

    const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
    await run(sql, params);
    return this.getById(id);
  },

  async delete(id) {
    const result = await run('DELETE FROM tasks WHERE id = ?', [id]);
    return result.changes > 0;
  },

  async toggleStatus(id) {
    const task = await this.getById(id);
    if (!task) return null;

    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    return this.update(id, { status: newStatus });
  },
};

export function closeDatabase() {
  return new Promise((resolve) => {
    db.close((err) => {
      if (err) console.error('[ERROR] Closing database:', err.message);
      else console.log('[INFO] Database connection closed');
      resolve();
    });
  });
}

await initializeDatabase();