import { db } from '../../db/connection.js';

export const auditService = {
  list(options: { limit?: number; targetType?: string; actorId?: string } = {}) {
    const { limit = 50, targetType, actorId } = options;
    const whereClauses: string[] = ['1=1'];
    const params: any[] = [];

    if (targetType) {
      whereClauses.push('target_type = ?');
      params.push(targetType);
    }

    if (actorId) {
      whereClauses.push('actor_id = ?');
      params.push(actorId);
    }

    const query = `
      SELECT *
      FROM audit_events
      WHERE ${whereClauses.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT ?
    `;

    return db.prepare(query).all(...params, limit);
  }
};
