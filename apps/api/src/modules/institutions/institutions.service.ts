import { db } from '../../db/connection.js';
import { Institution, CaseWithRelations } from '../../types/index.js';

export const institutionsService = {
  list(search?: string) {
    if (!search || !search.trim()) {
      return db.prepare(`
        SELECT 
          i.*,
          COUNT(c.id) as case_count,
          SUM(CASE WHEN c.status NOT IN ('Resolved', 'Closed', 'Disposed') THEN 1 ELSE 0 END) as open_case_count,
          SUM(CASE WHEN c.due_at IS NOT NULL AND c.due_at < datetime('now') AND c.status NOT IN ('Resolved', 'Closed', 'Disposed') THEN 1 ELSE 0 END) as overdue_case_count
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
        SUM(CASE WHEN c.status NOT IN ('Resolved', 'Closed', 'Disposed') THEN 1 ELSE 0 END) as open_case_count,
        SUM(CASE WHEN c.due_at IS NOT NULL AND c.due_at < datetime('now') AND c.status NOT IN ('Resolved', 'Closed', 'Disposed') THEN 1 ELSE 0 END) as overdue_case_count
      FROM institutions i
      LEFT JOIN cases c ON i.id = c.institution_id
      WHERE i.name LIKE ? OR i.institution_code LIKE ? OR i.aicte_permanent_id LIKE ? OR i.city LIKE ? OR i.state LIKE ? OR i.region LIKE ?
      GROUP BY i.id
      ORDER BY i.name ASC
    `).all(term, term, term, term, term, term);
  },

  getById(id: string) {
    const institution = db.prepare(`
      SELECT 
        i.*,
        COUNT(c.id) as case_count,
        SUM(CASE WHEN c.status NOT IN ('Resolved', 'Closed', 'Disposed') THEN 1 ELSE 0 END) as open_case_count,
        SUM(CASE WHEN c.due_at IS NOT NULL AND c.due_at < datetime('now') AND c.status NOT IN ('Resolved', 'Closed', 'Disposed') THEN 1 ELSE 0 END) as overdue_case_count
      FROM institutions i
      LEFT JOIN cases c ON i.id = c.institution_id
      WHERE i.id = ? OR i.institution_code = ? OR i.aicte_permanent_id = ?
      GROUP BY i.id
    `).get(id, id, id) as any;

    if (!institution) return null;

    // Attach computed overlap status and explainable risk score
    const overlap = this.getOverlapStatus(institution.id);
    const riskScore = this.getRiskScore(institution.id);

    return {
      ...institution,
      overlap,
      riskScore
    };
  },

  getOverlapStatus(institutionId: string) {
    // Find all distinct active bureaus handling complaints for this institution
    const bureauRows = db.prepare(`
      SELECT 
        b.id,
        b.name,
        b.code,
        COUNT(c.id) as active_count
      FROM cases c
      JOIN bureaus b ON c.current_bureau_id = b.id
      JOIN institutions i ON c.institution_id = i.id
      WHERE (c.institution_id = ? OR i.institution_code = ? OR i.aicte_permanent_id = ?)
        AND c.status NOT IN ('Resolved', 'Closed', 'Disposed')
      GROUP BY b.id
    `).all(institutionId, institutionId, institutionId) as any[];

    const hasRB = bureauRows.some(b => b.code === 'BUR-RB');
    const hasPGRC = bureauRows.some(b => b.code === 'BUR-PGRC');
    const multipleBureaus = bureauRows.length >= 2;

    const hasOverlap = (hasRB && hasPGRC) || multipleBureaus;

    const overlappingCases = hasOverlap ? db.prepare(`
      SELECT 
        c.id,
        c.case_number,
        c.category,
        c.priority,
        c.status,
        c.summary,
        c.due_at,
        b.name as bureau_name,
        b.code as bureau_code,
        u.display_name as owner_name
      FROM cases c
      JOIN bureaus b ON c.current_bureau_id = b.id
      JOIN institutions i ON c.institution_id = i.id
      LEFT JOIN users u ON c.current_owner_id = u.id
      WHERE (c.institution_id = ? OR i.institution_code = ? OR i.aicte_permanent_id = ?)
        AND c.status NOT IN ('Resolved', 'Closed', 'Disposed')
      ORDER BY b.code ASC, c.created_at DESC
    `).all(institutionId, institutionId, institutionId) : [];

    return {
      has_overlap: hasOverlap,
      banner_text: 'Potential Overlapping Cases – Coordination Required',
      has_rb_and_pgrc: hasRB && hasPGRC,
      bureaus_involved: bureauRows,
      overlapping_cases: overlappingCases
    };
  },

  getRiskScore(institutionId: string) {
    // Explicit, transparent, explainable formula:
    // Base 100
    // - 15 points per overdue case
    // - 10 points per open Regulation Bureau (RB) inquiry
    // - 5 points per open Public Grievance (PGRC) case
    const metrics = db.prepare(`
      SELECT 
        SUM(CASE WHEN c.due_at IS NOT NULL AND c.due_at < datetime('now') AND c.status NOT IN ('Resolved', 'Closed', 'Disposed') THEN 1 ELSE 0 END) as overdue_count,
        SUM(CASE WHEN b.code = 'BUR-RB' AND c.status NOT IN ('Resolved', 'Closed', 'Disposed') THEN 1 ELSE 0 END) as rb_count,
        SUM(CASE WHEN b.code = 'BUR-PGRC' AND c.status NOT IN ('Resolved', 'Closed', 'Disposed') THEN 1 ELSE 0 END) as pgrc_count,
        COUNT(c.id) as total_cases
      FROM cases c
      JOIN bureaus b ON c.current_bureau_id = b.id
      JOIN institutions i ON c.institution_id = i.id
      WHERE (c.institution_id = ? OR i.institution_code = ? OR i.aicte_permanent_id = ?)
    `).get(institutionId, institutionId, institutionId) as any;

    const overdueCount = metrics?.overdue_count || 0;
    const rbCount = metrics?.rb_count || 0;
    const pgrcCount = metrics?.pgrc_count || 0;

    const overdueDeduction = overdueCount * 15;
    const rbDeduction = rbCount * 10;
    const pgrcDeduction = pgrcCount * 5;
    const totalDeductions = overdueDeduction + rbDeduction + pgrcDeduction;

    const rawScore = Math.max(10, 100 - totalDeductions);

    let riskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
    if (rawScore < 60) riskLevel = 'High';
    else if (rawScore < 85) riskLevel = 'Moderate';

    return {
      score: rawScore,
      level: riskLevel,
      breakdown: {
        baseScore: 100,
        overdueCount,
        overdueDeduction,
        rbCount,
        rbDeduction,
        pgrcCount,
        pgrcDeduction,
        totalDeductions
      },
      disclaimer: 'DEMO COMPLIANCE METRIC — ILLUSTRATIVE FORMULA, NOT AN OFFICIAL AICTE RATING'
    };
  },

  getCases(institutionId: string): CaseWithRelations[] {
    return db.prepare(`
      SELECT 
        c.*,
        i.name as institution_name,
        i.institution_code,
        i.aicte_permanent_id,
        i.city as institution_city,
        i.state as institution_state,
        i.region,
        b.name as bureau_name,
        b.code as bureau_code,
        u.display_name as owner_name,
        CASE 
          WHEN c.due_at IS NOT NULL AND c.due_at < datetime('now') AND c.status NOT IN ('Resolved', 'Closed', 'Disposed') THEN 1 
          ELSE 0 
        END as is_overdue,
        CASE 
          WHEN c.due_at IS NOT NULL AND c.due_at >= datetime('now') AND c.due_at <= datetime('now', '+48 hours') AND c.status NOT IN ('Resolved', 'Closed', 'Disposed') THEN 1 
          ELSE 0 
        END as is_due_soon
      FROM cases c
      JOIN institutions i ON c.institution_id = i.id
      JOIN bureaus b ON c.current_bureau_id = b.id
      LEFT JOIN users u ON c.current_owner_id = u.id
      WHERE c.institution_id = ? OR i.institution_code = ? OR i.aicte_permanent_id = ?
      ORDER BY c.created_at DESC
    `).all(institutionId, institutionId, institutionId) as CaseWithRelations[];
  }
};
