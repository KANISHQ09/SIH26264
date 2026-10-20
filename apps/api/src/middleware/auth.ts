import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { User, DemoRole } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function demoAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userIdHeader = req.headers['x-demo-user-id'] as string;
  const roleHeader = req.headers['x-demo-role'] as string;

  let user: User | undefined;

  if (userIdHeader) {
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(userIdHeader) as User | undefined;
  } else if (roleHeader) {
    user = db.prepare('SELECT * FROM users WHERE role = ? AND active = 1 LIMIT 1').get(roleHeader) as User | undefined;
  } else {
    // Default fallback to leadership for demo exploration
    user = db.prepare("SELECT * FROM users WHERE role = 'leadership' LIMIT 1").get() as User | undefined;
  }

  if (user) {
    req.user = user;
  }

  next();
}

export function requireRole(allowedRoles: DemoRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'No demo identity established.'
        }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Record denied audit
      try {
        db.prepare(`
          INSERT INTO audit_events (id, actor_id, actor_name, role, action, target_type, target_id, result, created_at, metadata)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          'aud-' + Date.now(),
          req.user.id,
          req.user.display_name,
          req.user.role,
          req.method + ' ' + req.originalUrl,
          'endpoint',
          null,
          'DENIED',
          new Date().toISOString(),
          JSON.stringify({ requiredRoles: allowedRoles })
        );
      } catch (e) {
        // non-blocking
      }

      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Role '${req.user.role}' is not authorized to perform this operation. Required: ${allowedRoles.join(', ')}`
        }
      });
    }

    next();
  };
}
