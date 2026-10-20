import { db } from '../../db/connection.js';
import { Institution, CaseWithRelations } from '../../types/index.js';

export const institutionsService = {
  list(search?: string) {
    if (!search || !search.trim()) {
      return db.prepare(`
        SELECT 
          i.*,
          COUNT(c.id) as case_count,
          SUM(CASE WHEN c.status NOT IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) as open_case_count,
          SUM(CASE WHEN c.due_at IS NOT NULL AND c.due_at < datetime('now') AND c.status NOT IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) as overdue_case_count
        FROM institutions i
        LEFT JOIN cases c ON i.id = c.institution_id
        GROUP BY i.id
        ORDER BY i.name ASC
      `).all();
    }

    const term = `%${search.trim()}%`;
    return db.prepare(`
      SELECT 
        i.*,
        COUNT(c.id) as case_count,
        SUM(CASE WHEN c.status NOT IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) as open_case_count,
        SUM(CASE WHEN c.due_at IS NOT NULL AND c.due_at < datetime('now') AND c.status NOT IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) as overdue_case_count
      FROM institutions i
      LEFT JOIN cases c ON i.id = c.institution_id
      WHERE i.name LIKE ? OR i.institution_code LIKE ? OR i.city LIKE ? OR i.state LIKE ?
      GROUP BY i.id
      ORDER BY i.name ASC
    `).all(term, term, term, term);
  },

  getById(id: string) {
    const institution = db.prepare(`
      SELECT 
        i.*,
        COUNT(c.id) as case_count,
        SUM(CASE WHEN c.status NOT IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) as open_case_count,
        SUM(CASE WHEN c.due_at IS NOT NULL AND c.due_at < datetime('now') AND c.status NOT IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) as overdue_case_count
      FROM institutions i
      LEFT JOIN cases c ON i.id = c.institution_id
      WHERE i.id = ? OR i.institution_code = ?
      GROUP BY i.id
    `).get(id, id) as any;

    return institution || null;
  },

  getCases(institutionId: string): CaseWithRelations[] {
    return db.prepare(`
      SELECT 
        c.*,
        i.name as institution_name,
        i.institution_code,
        b.name as bureau_name,
        b.code as bureau_code,
        u.display_name as owner_name,
        CASE 
          WHEN c.due_at IS NOT NULL AND c.due_at < datetime('now') AND c.status NOT IN ('Resolved', 'Closed') THEN 1 
          ELSE 0 
        END as is_overdue,
        CASE 
          WHEN c.due_at IS NOT NULL AND c.due_at >= datetime('now') AND c.due_at <= datetime('now', '+48 hours') AND c.status NOT IN ('Resolved', 'Closed') THEN 1 
          ELSE 0 
        END as is_due_soon
      FROM cases c
      JOIN institutions i ON c.institution_id = i.id
      JOIN bureaus b ON c.current_bureau_id = b.id
      LEFT JOIN users u ON c.current_owner_id = u.id
      WHERE c.institution_id = ? OR i.institution_code = ?
      ORDER BY c.created_at DESC
    `).all(institutionId, institutionId) as CaseWithRelations[];
  }
};
