import { taskRepository } from '../database.js';

function validateTaskInput(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate || data.title !== undefined) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('title is required and must be a non-empty string');
    } else if (data.title.trim().length < 3) {
      errors.push('title must be at least 3 characters long');
    }
  }

  if (!isUpdate || data.subject !== undefined) {
    if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length === 0) {
      errors.push('subject is required and must be a non-empty string');
    }
  }

  if (!isUpdate || data.dueDate !== undefined) {
    if (!data.dueDate || typeof data.dueDate !== 'string') {
      errors.push('dueDate is required and must be a string (YYYY-MM-DD)');
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.dueDate)) {
        errors.push('dueDate must be in YYYY-MM-DD format');
      }
    }
  }

  if (!isUpdate || data.priority !== undefined) {
    if (!data.priority || !['low', 'medium', 'high'].includes(data.priority)) {
      errors.push('priority must be one of: low, medium, high');
    }
  }

  if (data.status !== undefined) {
    if (!['pending', 'completed'].includes(data.status)) {
      errors.push('status must be one of: pending, completed');
    }
  }

  return errors;
}

function sanitizeInput(data, isUpdate = false) {
  const result = {
    title: data.title?.trim(),
    subject: data.subject?.trim(),
    dueDate: data.dueDate,
    priority: data.priority,
    status: data.status,
  };

  // Only include description if explicitly provided (not undefined)
  if (data.description !== undefined) {
    result.description = data.description?.trim() || '';
  }

  // For updates, only include fields that are explicitly provided
  if (isUpdate) {
    const resultFiltered = {};
    for (const [key, value] of Object.entries(result)) {
      if (value !== undefined) {
        resultFiltered[key] = value;
      }
    }
    return resultFiltered;
  }

  return result;
}

export const tasksController = {
  async getAll(req, res, queryParams) {
    try {
      const filters = {};
      if (queryParams.status) filters.status = queryParams.status;
      if (queryParams.priority) filters.priority = queryParams.priority;
      if (queryParams.subject) filters.subject = queryParams.subject;

      const tasks = await taskRepository.getAll(filters);
      sendJSON(res, 200, { success: true, data: tasks });
    } catch (error) {
      console.error('[ERROR] Get all tasks:', error);
      sendJSON(res, 500, { success: false, error: { message: 'Internal server error' } });
    }
  },

  async getById(req, res, id) {
    try {
      const taskId = parseInt(id, 10);
      if (isNaN(taskId)) {
        return sendJSON(res, 400, { success: false, error: { message: 'Invalid task ID' } });
      }

      const task = await taskRepository.getById(taskId);
      if (!task) {
        return sendJSON(res, 404, { success: false, error: { message: 'Task not found' } });
      }

      sendJSON(res, 200, { success: true, data: task });
    } catch (error) {
      console.error('[ERROR] Get task by ID:', error);
      sendJSON(res, 500, { success: false, error: { message: 'Internal server error' } });
    }
  },

  async create(req, res, body) {
    try {
      const errors = validateTaskInput(body, false);
      if (errors.length > 0) {
        return sendJSON(res, 400, { success: false, error: { message: 'Validation failed', details: errors } });
      }

      const data = sanitizeInput(body, false);
      const task = await taskRepository.create(data);
      sendJSON(res, 201, { success: true, data: task });
    } catch (error) {
      console.error('[ERROR] Create task:', error);
      sendJSON(res, 500, { success: false, error: { message: 'Internal server error' } });
    }
  },

  async update(req, res, id, body) {
    try {
      const taskId = parseInt(id, 10);
      if (isNaN(taskId)) {
        return sendJSON(res, 400, { success: false, error: { message: 'Invalid task ID' } });
      }

      const errors = validateTaskInput(body, true);
      if (errors.length > 0) {
        return sendJSON(res, 400, { success: false, error: { message: 'Validation failed', details: errors } });
      }

      const existingTask = await taskRepository.getById(taskId);
      if (!existingTask) {
        return sendJSON(res, 404, { success: false, error: { message: 'Task not found' } });
      }

      const data = sanitizeInput(body, true);
      const task = await taskRepository.update(taskId, data);
      sendJSON(res, 200, { success: true, data: task });
    } catch (error) {
      console.error('[ERROR] Update task:', error);
      sendJSON(res, 500, { success: false, error: { message: 'Internal server error' } });
    }
  },

  async delete(req, res, id) {
    try {
      const taskId = parseInt(id, 10);
      if (isNaN(taskId)) {
        return sendJSON(res, 400, { success: false, error: { message: 'Invalid task ID' } });
      }

      const existingTask = await taskRepository.getById(taskId);
      if (!existingTask) {
        return sendJSON(res, 404, { success: false, error: { message: 'Task not found' } });
      }

      const deleted = await taskRepository.delete(taskId);
      if (deleted) {
        sendJSON(res, 204, null);
      } else {
        sendJSON(res, 500, { success: false, error: { message: 'Failed to delete task' } });
      }
    } catch (error) {
      console.error('[ERROR] Delete task:', error);
      sendJSON(res, 500, { success: false, error: { message: 'Internal server error' } });
    }
  },

  async toggleStatus(req, res, id) {
    try {
      const taskId = parseInt(id, 10);
      if (isNaN(taskId)) {
        return sendJSON(res, 400, { success: false, error: { message: 'Invalid task ID' } });
      }

      const existingTask = await taskRepository.getById(taskId);
      if (!existingTask) {
        return sendJSON(res, 404, { success: false, error: { message: 'Task not found' } });
      }

      const task = await taskRepository.toggleStatus(taskId);
      sendJSON(res, 200, { success: true, data: task });
    } catch (error) {
      console.error('[ERROR] Toggle task status:', error);
      sendJSON(res, 500, { success: false, error: { message: 'Internal server error' } });
    }
  },
};

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  if (data !== null) {
    res.end(JSON.stringify(data));
  } else {
    res.end();
  }
}