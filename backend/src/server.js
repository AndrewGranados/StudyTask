import { createServer } from 'node:http';
import { registerRoutes } from './routes/tasks.js';
import { closeDatabase } from './database.js';

const PORT = 3001;
const ALLOWED_ORIGIN = 'http://localhost:3000';

function corsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
  return headers;
}

function handleCORS(req, res) {
  const origin = req.headers.origin || '';
  if (origin === ALLOWED_ORIGIN) {
    Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
}

const router = {
  routes: {
    GET: [],
    POST: [],
    PUT: [],
    PATCH: [],
    DELETE: [],
    OPTIONS: [],
  },

  get(path, handler) {
    this.routes.GET.push({ path: pathToRegex(path), handler, originalPath: path });
  },
  post(path, handler) {
    this.routes.POST.push({ path: pathToRegex(path), handler, originalPath: path });
  },
  put(path, handler) {
    this.routes.PUT.push({ path: pathToRegex(path), handler, originalPath: path });
  },
  patch(path, handler) {
    this.routes.PATCH.push({ path: pathToRegex(path), handler, originalPath: path });
  },
  delete(path, handler) {
    this.routes.DELETE.push({ path: pathToRegex(path), handler, originalPath: path });
  },
  options(path, handler) {
    this.routes.OPTIONS.push({ path: pathToRegex(path), handler, originalPath: path });
  },

  handle(req, res) {
    if (handleCORS(req, res)) return;

    const method = req.method;
    const url = req.url;

    const routeList = this.routes[method] || [];
    for (const route of routeList) {
      const match = url.match(route.path);
      if (match) {
        req.params = match.groups || {};
        return route.handler(req, res);
      }
    }

    if (method === 'GET' && url === '/') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ name: 'StudyTask API', status: 'running' }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: { message: 'Route not found' } }));
  },
};

function pathToRegex(path) {
  const regexStr = path
    .replace(/:(\w+)/g, '(?<$1>\\d+)')
    .replace(/\//g, '\\/');
  return new RegExp(`^${regexStr}(\\?.*)?$`);
}

registerRoutes(router);

const server = createServer((req, res) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  router.handle(req, res);

  const duration = Date.now() - start;
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
});

server.listen(PORT, () => {
  console.log(`[INFO] StudyTask API server running on http://localhost:${PORT}`);
  console.log(`[INFO] CORS enabled for ${ALLOWED_ORIGIN}`);
});

process.on('SIGINT', () => {
  console.log('\n[INFO] Shutting down server...');
  closeDatabase();
  server.close(() => {
    console.log('[INFO] Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n[INFO] Shutting down server...');
  closeDatabase();
  server.close(() => {
    console.log('[INFO] Server closed');
    process.exit(0);
  });
});