import { db } from '../../db/connection.js';
import { runSeed } from '../../db/seed.js';

export const demoService = {
  getUsers() {
    return db.prepare(`
      SELECT 
        u.*,
        b.name as bureau_name,
        b.code as bureau_code
      FROM users u
      LEFT JOIN bureaus b ON u.bureau_id = b.id
      ORDER BY u.role ASC
    `).all();
  },

  getBureaus() {
    return db.prepare('SELECT * FROM bureaus WHERE active = 1 ORDER BY name ASC').all();
  },

  resetDemo(actor: { id: string; display_name: string; role: string }) {
    runSeed();

    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO audit_events (
        id, actor_id, actor_name, role, action, target_type, target_id, result, created_at, metadata
      ) VALUES (?, ?, ?, ?, 'DEMO_DATA_RESET', 'demo', 'entire_system', 'SUCCESS', ?, ?)
    `).run(
      'aud-' + Date.now(),
      actor.id,
      actor.display_name,
      actor.role,
      now,
      JSON.stringify({ trigger: 'User clicked Reset Demo Data', timestamp: now })
    );

    return { success: true, message: 'Demo seed data successfully restored to pristine state.' };
  }
};
