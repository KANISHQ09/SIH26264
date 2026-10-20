import { db } from '../../db/connection.js';

export const reportsService = {
  getSummary() {
    const ageBuckets = db.prepare(`
      SELECT 
        CASE 
          WHEN (julianday('now') - julianday(created_at)) <= 7 THEN '< 7 Days'
          WHEN (julianday('now') - julianday(created_at)) <= 15 THEN '8 - 15 Days'
          WHEN (julianday('now') - julianday(created_at)) <= 30 THEN '16 - 30 Days'
          ELSE '> 30 Days'
        END as bucket,
        COUNT(*) as count
      FROM cases
      WHERE status NOT IN ('Resolved', 'Closed')
      GROUP BY bucket
      ORDER BY count DESC
    `).all();

    const bureauPerformance = db.prepare(`
      SELECT 
        b.name as bureau_name,
        COUNT(c.id) as total_assigned,
        SUM(CASE WHEN c.status IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) as resolved_count,
        SUM(CASE WHEN c.due_at IS NOT NULL AND c.due_at < datetime('now') AND c.status NOT IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) as overdue_count
      FROM bureaus b
      LEFT JOIN cases c ON b.id = c.current_bureau_id
      GROUP BY b.id
    `).all();

    const priorityBreakdown = db.prepare(`
      SELECT priority, COUNT(*) as count
      FROM cases
      GROUP BY priority
      ORDER BY count DESC
    `).all();

    return {
      ageBuckets,
      bureauPerformance,
      priorityBreakdown
    };
  },

  exportCsv(actor: { id: string; display_name: string; role: string }, filters: any = {}) {
    const rows = db.prepare(`
      SELECT 
        c.case_number,
        c.source_case_id,
        i.name as institution_name,
        i.institution_code,
        c.category,
        c.priority,
        c.status,
        b.name as bureau_name,
        u.display_name as current_owner,
        c.created_at,
        c.due_at,
        c.next_action,
        c.closed_at
      FROM cases c
      JOIN institutions i ON c.institution_id = i.id
      JOIN bureaus b ON c.current_bureau_id = b.id
      LEFT JOIN users u ON c.current_owner_id = u.id
      ORDER BY c.created_at DESC
    `).all() as any[];

    // Build CSV
    const headers = [
      'Case Number',
      'Source Ref ID',
      'Institution Name',
      'Institution Code',
      'Category',
      'Priority',
      'Status',
      'Responsible Bureau',
      'Assigned Handler',
      'Created At',
      'Due At',
      'Next Action',
      'Closed At'
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvLines = [headers.join(',')];
    for (const r of rows) {
      csvLines.push([
        escapeCsv(r.case_number),
        escapeCsv(r.source_case_id || 'N/A'),
        escapeCsv(r.institution_name),
        escapeCsv(r.institution_code),
        escapeCsv(r.category),
        escapeCsv(r.priority),
        escapeCsv(r.status),
        escapeCsv(r.bureau_name),
        escapeCsv(r.current_owner || 'Unassigned'),
        escapeCsv(r.created_at),
        escapeCsv(r.due_at || 'No Due Date'),
        escapeCsv(r.next_action || 'N/A'),
        escapeCsv(r.closed_at || 'Open')
      ].join(','));
    }

    // Log export audit event
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO audit_events (
        id, actor_id, actor_name, role, action, target_type, target_id, result, created_at, metadata
      ) VALUES (?, ?, ?, ?, 'EXPORT_REPORT_CSV', 'report', 'cases_dataset', 'SUCCESS', ?, ?)
    `).run(
      'aud-' + Date.now(),
      actor.id,
      actor.display_name,
      actor.role,
      now,
      JSON.stringify({ rowCount: rows.length, filters })
    );

    return csvLines.join('\n');
  }
};
