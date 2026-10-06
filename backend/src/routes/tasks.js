import { tasksController } from '../controllers/tasksController.js';

export function registerRoutes(router) {
  router.get('/api/health', (req, res) => {
    sendJSON(res, 200, { success: true, message: 'StudyTask API is running' });
  });

  router.get('/api/tasks', (req, res) => {
    const queryParams = parseQuery(req.url);
    tasksController.getAll(req, res, queryParams);
  });

  router.get('/api/tasks/:id', (req, res) => {
    const id = extractId(req.url);
    tasksController.getById(req, res, id);
  });

  router.post('/api/tasks', (req, res) => {
    readBody(req).then(body => {
      tasksController.create(req, res, body);
    }).catch(() => {
      sendJSON(res, 400, { success: false, error: { message: 'Invalid JSON body' } });
    });
  });

  router.put('/api/tasks/:id', (req, res) => {
    const id = extractId(req.url);
    readBody(req).then(body => {
      tasksController.update(req, res, id, body);
    }).catch(() => {
      sendJSON(res, 400, { success: false, error: { message: 'Invalid JSON body' } });
    });
  });

  router.patch('/api/tasks/:id/status', (req, res) => {
    const id = extractId(req.url);
    tasksController.toggleStatus(req, res, id);
  });

  router.delete('/api/tasks/:id', (req, res) => {
    const id = extractId(req.url);
    tasksController.delete(req, res, id);
  });
}

function extractId(url) {
  const match = url.match(/\/api\/tasks\/(\d+)/);
  return match ? match[1] : null;
}

function parseQuery(url) {
  const queryString = url.split('?')[1] || '';
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  if (data !== null) {
    res.end(JSON.stringify(data));
  } else {
    res.end();
  }
}