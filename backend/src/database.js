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
    console.log('[INFO] Database is empty, ready for user data (auto-seed disabled)');
  } else {
    console.log('[INFO] Database already has', row.count, 'tasks');
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