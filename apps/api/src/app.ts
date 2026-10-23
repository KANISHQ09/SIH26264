import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { apiRouter } from './routes.js';
import { demoAuthMiddleware } from './middleware/auth.js';
import { db, initSchema } from './db/connection.js';
import { runSeed } from './db/seed.js';

export function createApp() {
  // Ensure tables and indexes are ready
  initSchema();

  // Auto-seed mock data if empty (e.g. fresh deployment)
  try {
    const caseRow = db.prepare('SELECT COUNT(*) as count FROM cases').get() as { count: number } | undefined;
    const userRow = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number } | undefined;
    if (!caseRow || caseRow.count === 0 || !userRow || userRow.count === 0) {
      console.log('Fresh or empty database detected on startup. Automatically seeding mock data...');
      runSeed();
    }
  } catch (err) {
    console.warn('Auto-seed check triggered seeding:', err);
    try {
      runSeed();
    } catch (e) {
      console.error('Failed to auto-seed:', e);
    }
  }

  const app = express();

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-user-id', 'x-demo-role']
  }));

  app.use(express.json());

  // Demo identity extraction middleware
  app.use(demoAuthMiddleware);

  // Mount API v1 and health / keep-alive ping (for Render & UptimeRobot)
  app.use('/api/v1', apiRouter);

  app.get(['/health', '/ping'], (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      service: 'Nexus - AICTE OneView API'
    });
  });

  // Serve static frontend files if built
  const distCandidates = [
    path.resolve(process.cwd(), '../web/dist'),
    path.resolve(process.cwd(), 'apps/web/dist'),
    path.resolve(process.cwd(), 'dist/web')
  ];

  const targetDist = distCandidates.find(p => fs.existsSync(p));

  if (targetDist) {
    app.use(express.static(targetDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/ping')) {
        return next();
      }
      res.sendFile(path.join(targetDist, 'index.html'));
    });
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled API Error:', err);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'An unexpected server error occurred'
      }
    });
  });

  return app;
}
