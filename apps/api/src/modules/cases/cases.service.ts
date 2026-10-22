import { db } from '../../db/connection.js';
import { CaseWithRelations, CaseStatus, CaseEvent, Assignment } from '../../types/index.js';

export interface CaseFilterOptions {
  q?: string;
  institutionId?: string;
  bureauId?: string;
  ownerId?: string;
  status?: string;
  category?: string;
  priority?: string;
  dueState?: 'all' | 'overdue' | 'due_soon' | 'on_track' | 'no_due_date';
  unassigned?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const casesService = {
  list(options: CaseFilterOptions = {}) {
    const {
      q,
      institutionId,
      bureauId,
      ownerId,
      status,
      category,
      priority,
      dueState,
      unassigned,
      page = 1,
      pageSize = 20,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    const whereClauses: string[] = ['1=1'];
    const params: any[] = [];
    const nowIso = new Date().toISOString();
    const dueSoonIso = new Date(Date.now() + 48 * 3600 * 1000).toISOString();

    if (q) {
      whereClauses.push(`(
        c.case_number LIKE ? OR
        c.summary LIKE ? OR
        i.name LIKE ? OR
        i.institution_code LIKE ? OR
        c.source_case_id LIKE ?
      )`);
      const searchParam = `%${q}%`;
      params.push(searchParam, searchParam, searchParam, searchParam, searchParam);
    }

    if (institutionId) {
      whereClauses.push('c.institution_id = ?');
      params.push(institutionId);
    }

    if (bureauId) {
      whereClauses.push('c.current_bureau_id = ?');
      params.push(bureauId);
    }

    if (ownerId) {
      whereClauses.push('c.current_owner_id = ?');
      params.push(ownerId);
    }

    if (status) {
      whereClauses.push('c.status = ?');
      params.push(status);
    }

    if (category) {
      whereClauses.push('c.category = ?');
      params.push(category);
    }

    if (priority) {
      whereClauses.push('c.priority = ?');
      params.push(priority);
    }

    if (unassigned) {
      whereClauses.push('c.current_owner_id IS NULL');
    }

    if (dueState === 'overdue') {
      whereClauses.push("c.due_at IS NOT NULL AND c.due_at < ? AND c.status NOT IN ('Resolved', 'Closed')");
      params.push(nowIso);
    } else if (dueState === 'due_soon') {
      whereClauses.push("c.due_at IS NOT NULL AND c.due_at >= ? AND c.due_at <= ? AND c.status NOT IN ('Resolved', 'Closed')");
      params.push(nowIso, dueSoonIso);
    } else if (dueState === 'on_track') {
      whereClauses.push("(c.due_at IS NULL OR c.due_at > ? OR c.status IN ('Resolved', 'Closed'))");
      params.push(dueSoonIso);
    } else if (dueState === 'no_due_date') {
      whereClauses.push('c.due_at IS NULL');
    }

    const allowedSortFields = ['created_at', 'updated_at', 'due_at', 'priority', 'status', 'case_number'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countQuery = `
      SELECT COUNT(*) as total
      FROM cases c
      JOIN institutions i ON c.institution_id = i.id
      JOIN bureaus b ON c.current_bureau_id = b.id
      LEFT JOIN users u ON c.current_owner_id = u.id
      WHERE ${whereClauses.join(' AND ')}
    `;

    const totalRow = db.prepare(countQuery).get(...params) as { total: number };
    const total = totalRow.total;

    const offset = (page - 1) * pageSize;
    const selectQuery = `
      SELECT 
        c.*,
        i.name as institution_name,
        i.institution_code,
        i.city as institution_city,
        i.state as institution_state,
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
      WHERE ${whereClauses.join(' AND ')}
      ORDER BY c.${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `;

    const cases = db.prepare(selectQuery).all(...params, pageSize, offset) as CaseWithRelations[];

    return {
      data: cases,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  },

  getById(id: string) {
    const query = `
      SELECT 
        c.*,
        i.name as institution_name,
        i.institution_code,
        i.city as institution_city,
        i.state as institution_state,
        i.institution_type,
        b.name as bureau_name,
        b.code as bureau_code,
        u.display_name as owner_name,
        u.demo_email as owner_email,
        u.designation as owner_designation,
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
      WHERE c.id = ? OR c.case_number = ?
    `;

    const foundCase = db.prepare(query).get(id, id) as any;
    if (!foundCase) return null;

    // Get active assignment
    const activeAssignment = db.prepare(`
      SELECT a.*, b.name as bureau_name, u.display_name as owner_name, ab.display_name as assigned_by_name
      FROM assignments a
      JOIN bureaus b ON a.bureau_id = b.id
      LEFT JOIN users u ON a.owner_id = u.id
      LEFT JOIN users ab ON a.assigned_by = ab.id
      WHERE a.case_id = ? AND a.ended_at IS NULL
      LIMIT 1
    `).get(foundCase.id) as Assignment | undefined;

    // Get assignment history
    const assignmentHistory = db.prepare(`
      SELECT a.*, b.name as bureau_name, u.display_name as owner_name, ab.display_name as assigned_by_name
      FROM assignments a
      JOIN bureaus b ON a.bureau_id = b.id
      LEFT JOIN users u ON a.owner_id = u.id
      LEFT JOIN users ab ON a.assigned_by = ab.id
      WHERE a.case_id = ?
      ORDER BY a.started_at DESC
    `).all(foundCase.id) as Assignment[];

    // Count pending related cases
    const pendingRelated = db.prepare(`
      SELECT COUNT(*) as count FROM related_case_reviews WHERE case_id = ? AND review_status = 'pending'
    `).get(foundCase.id) as { count: number };

    // Get Action Taken Reports
    const atrs = db.prepare(`
      SELECT * FROM action_taken_reports WHERE case_id = ? ORDER BY created_at DESC
    `).all(foundCase.id);

    return {
      ...foundCase,
      activeAssignment,
      assignmentHistory,
      pendingRelatedCount: pendingRelated.count,
      atrs
    };
  },

  getTimeline(caseId: string) {
    const query = `
      SELECT 
        e.*,
        u.display_name as actor_name,
        u.role as actor_role,
        u.designation as actor_designation
      FROM case_events e
      JOIN users u ON e.actor_id = u.id
      WHERE e.case_id = ?
      ORDER BY e.created_at ASC
    `;
    return db.prepare(query).all(caseId) as CaseEvent[];
  },

  assign(caseId: string, payload: {
    bureauId: string;
    ownerId?: string | null;
    transferReason?: string;
    handoffNote?: string;
    actor: { id: string; display_name: string; role: string };
  }) {
    const { bureauId, ownerId = null, transferReason, handoffNote, actor } = payload;

    const foundCase = db.prepare('SELECT * FROM cases WHERE id = ?').get(caseId) as any;
    if (!foundCase) {
      throw new Error('Case not found');
    }

    const bureau = db.prepare('SELECT * FROM bureaus WHERE id = ?').get(bureauId) as any;
    if (!bureau) {
      throw new Error('Target Bureau does not exist');
    }

    let ownerName = 'Unassigned';
    if (ownerId) {
      const owner = db.prepare('SELECT * FROM users WHERE id = ?').get(ownerId) as any;
      if (!owner) throw new Error('Target owner does not exist');
      ownerName = owner.display_name;
    }

    const now = new Date().toISOString();
    const assignmentId = 'asg-' + Date.now();
    const eventId = 'evt-' + Date.now();
    const auditId = 'aud-' + Date.now();

    const isTransfer = foundCase.current_bureau_id !== bureauId || foundCase.current_owner_id !== ownerId;

    // Transaction execution
    const transaction = db.transaction(() => {
      // 1. Mark existing active assignment as ended
      db.prepare(`
        UPDATE assignments 
        SET ended_at = ? 
        WHERE case_id = ? AND ended_at IS NULL
      `).run(now, caseId);

      // 2. Insert new assignment
      db.prepare(`
        INSERT INTO assignments (
          id, case_id, bureau_id, owner_id, assigned_by, started_at, ended_at, transfer_reason, handoff_note
        ) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)
      `).run(
        assignmentId,
        caseId,
        bureauId,
        ownerId,
        actor.id,
        now,
        transferReason || 'Ownership reassignment',
        handoffNote || null
      );

      // 3. Update case current fields
      db.prepare(`
        UPDATE cases 
        SET current_bureau_id = ?, current_owner_id = ?, updated_at = ?
        WHERE id = ?
      `).run(bureauId, ownerId, now, caseId);

      // 4. Append case event
      const eventType = isTransfer ? 'TRANSFERRED' : 'ASSIGNED';
      const note = transferReason ? `${transferReason}. Note: ${handoffNote || 'None'}` : handoffNote || null;

      db.prepare(`
        INSERT INTO case_events (
          id, case_id, actor_id, event_type, from_value, to_value, note, created_at, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        eventId,
        caseId,
        actor.id,
        eventType,
        foundCase.current_owner_id || 'Unassigned',
        ownerName,
        note,
        now,
        JSON.stringify({ bureauId, bureauName: bureau.name, previousBureau: foundCase.current_bureau_id })
      );

      // 5. Append audit event
      db.prepare(`
        INSERT INTO audit_events (
          id, actor_id, actor_name, role, action, target_type, target_id, result, created_at, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        auditId,
        actor.id,
        actor.display_name,
        actor.role,
        eventType,
        'case',
        foundCase.case_number,
        'SUCCESS',
        now,
        JSON.stringify({
          caseId,
          fromBureau: foundCase.current_bureau_id,
          toBureau: bureauId,
          toOwner: ownerName,
          transferReason
        })
      );
    });

    transaction();
    return this.getById(caseId);
  },

  updateStatus(caseId: string, payload: {
    status: CaseStatus;
    note?: string;
    closureSummary?: string;
    actor: { id: string; display_name: string; role: string };
  }) {
    const { status, note, closureSummary, actor } = payload;

    const foundCase = db.prepare('SELECT * FROM cases WHERE id = ?').get(caseId) as any;
    if (!foundCase) {
      throw new Error('Case not found');
    }

    if ((status === 'Resolved' || status === 'Closed') && !closureSummary && !foundCase.closure_summary) {
      throw new Error('A closure summary is required when resolving or closing a case.');
    }

    const now = new Date().toISOString();
    const eventId = 'evt-' + Date.now();
    const auditId = 'aud-' + Date.now();

    const isClosing = status === 'Resolved' || status === 'Closed';
    const closedAt = isClosing ? now : null;

    const transaction = db.transaction(() => {
      db.prepare(`
        UPDATE cases 
        SET status = ?, 
            closure_summary = COALESCE(?, closure_summary),
            closed_at = ?,
            updated_at = ?
        WHERE id = ?
      `).run(status, closureSummary || null, closedAt, now, caseId);

      db.prepare(`
        INSERT INTO case_events (
          id, case_id, actor_id, event_type, from_value, to_value, note, created_at, metadata
        ) VALUES (?, ?, ?, 'STATUS_CHANGE', ?, ?, ?, ?, ?)
      `).run(
        eventId,
        caseId,
        actor.id,
        foundCase.status,
        status,
        note || (closureSummary ? `Closure: ${closureSummary}` : null),
        now,
        JSON.stringify({ closureSummary })
      );

      db.prepare(`
        INSERT INTO audit_events (
          id, actor_id, actor_name, role, action, target_type, target_id, result, created_at, metadata
        ) VALUES (?, ?, ?, ?, 'STATUS_UPDATE', 'case', ?, 'SUCCESS', ?, ?)
      `).run(
        auditId,
        actor.id,
        actor.display_name,
        actor.role,
        foundCase.case_number,
        now,
        JSON.stringify({ from: foundCase.status, to: status, note, closureSummary })
      );
    });

    transaction();
    return this.getById(caseId);
  },

  updateNextAction(caseId: string, payload: {
    nextAction: string;
    nextActionDue?: string | null;
    actor: { id: string; display_name: string; role: string };
  }) {
    const { nextAction, nextActionDue, actor } = payload;
    const foundCase = db.prepare('SELECT * FROM cases WHERE id = ?').get(caseId) as any;
    if (!foundCase) throw new Error('Case not found');

    const now = new Date().toISOString();
    const eventId = 'evt-' + Date.now();

    const transaction = db.transaction(() => {
      db.prepare(`
        UPDATE cases 
        SET next_action = ?, next_action_due = ?, updated_at = ?
        WHERE id = ?
      `).run(nextAction, nextActionDue || null, now, caseId);

      db.prepare(`
        INSERT INTO case_events (
          id, case_id, actor_id, event_type, from_value, to_value, note, created_at, metadata
        ) VALUES (?, ?, ?, 'NEXT_ACTION_UPDATE', ?, ?, ?, ?, ?)
      `).run(
        eventId,
        caseId,
        actor.id,
        foundCase.next_action,
        nextAction,
        nextActionDue ? `Target due: ${new Date(nextActionDue).toLocaleDateString()}` : null,
        now,
        JSON.stringify({ nextActionDue })
      );
    });

    transaction();
    return this.getById(caseId);
  },

  create(payload: {
    institutionId: string;
    category: string;
    priority?: string;
    summary: string;
    sourceCaseId?: string;
    currentBureauId: string;
    dueAt?: string | null;
    nextAction?: string | null;
    complainantName?: string | null;
    complainantEmail?: string | null;
    isAnonymous?: boolean;
    actor: { id: string; display_name: string; role: string };
  }) {
    const {
      institutionId,
      category,
      priority = 'Medium',
      summary,
      sourceCaseId,
      currentBureauId,
      dueAt,
      nextAction,
      complainantName,
      complainantEmail,
      isAnonymous = false,
      actor
    } = payload;

    const countRow = db.prepare('SELECT COUNT(*) as count FROM cases').get() as { count: number };
    const caseNumber = `CASE-2026-${String(countRow.count + 101).padStart(4, '0')}`;
    const id = 'case-' + Date.now();
    const now = new Date().toISOString();
    // Default 15 days SLA if dueAt not provided
    const computedDueAt = dueAt || new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString();

    const transaction = db.transaction(() => {
      db.prepare(`
        INSERT INTO cases (
          id, case_number, source_case_id, institution_id, category, priority, summary, status,
          current_bureau_id, current_owner_id, complainant_name, complainant_email, is_anonymous,
          created_at, updated_at, due_at, next_action, source_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        caseNumber,
        sourceCaseId || null,
        institutionId,
        category,
        priority,
        summary,
        currentBureauId,
        complainantName || actor.display_name,
        complainantEmail || null,
        isAnonymous ? 1 : 0,
        now,
        now,
        computedDueAt,
        nextAction || 'Preliminary scrutiny and officer assignment',
        actor.role === 'student' ? 'Student Grievance Redressal Portal' : 'AICTE Central Inward'
      );

      db.prepare(`
        INSERT INTO assignments (
          id, case_id, bureau_id, owner_id, assigned_by, started_at, transfer_reason
        ) VALUES (?, ?, ?, NULL, ?, ?, 'Initial registration and bureau dispatch')
      `).run('asg-' + Date.now(), id, currentBureauId, actor.id, now);

      db.prepare(`
        INSERT INTO case_events (
          id, case_id, actor_id, event_type, to_value, note, created_at
        ) VALUES (?, ?, ?, 'CREATED', 'Pending', 'Case registered in AICTE OneView tracking system', ?)
      `).run('evt-' + Date.now(), id, actor.id, now);

      db.prepare(`
        INSERT INTO audit_events (
          id, actor_id, actor_name, role, action, target_type, target_id, result, created_at
        ) VALUES (?, ?, ?, ?, 'CREATE_CASE', 'case', ?, 'SUCCESS', ?)
      `).run('aud-' + Date.now(), actor.id, actor.display_name, actor.role, caseNumber, now);
    });

    transaction();
    return this.getById(id);
  },

  getAtrs(caseId: string) {
    return db.prepare(`
      SELECT * FROM action_taken_reports WHERE case_id = ? ORDER BY created_at DESC
    `).all(caseId);
  },

  submitAtr(caseId: string, payload: {
    institutionId: string;
    submittedByName: string;
    submittedByRole?: string;
    submissionText: string;
    actionTakenDate: string;
    evidenceFiles?: string[];
    actor: { id: string; display_name: string; role: string };
  }) {
    const { institutionId, submittedByName, submittedByRole = 'institution', submissionText, actionTakenDate, evidenceFiles = [], actor } = payload;
    const foundCase = db.prepare('SELECT * FROM cases WHERE id = ?').get(caseId) as any;
    if (!foundCase) throw new Error('Case not found');

    const id = 'atr-' + Date.now();
    const now = new Date().toISOString();

    const transaction = db.transaction(() => {
      db.prepare(`
        INSERT INTO action_taken_reports (
          id, case_id, institution_id, submitted_by_name, submitted_by_role, submission_text, action_taken_date, evidence_files, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        caseId,
        institutionId,
        submittedByName,
        submittedByRole,
        submissionText,
        actionTakenDate || now,
        JSON.stringify(evidenceFiles),
        now
      );

      // Add timeline event
      db.prepare(`
        INSERT INTO case_events (
          id, case_id, actor_id, event_type, from_value, to_value, note, created_at, metadata
        ) VALUES (?, ?, ?, 'ATR_SUBMITTED', ?, 'Action Taken Report (ATR)', ?, ?, ?)
      `).run(
        'evt-' + Date.now(),
        caseId,
        actor.id,
        foundCase.status,
        `Action Taken Report submitted by ${submittedByName}`,
        now,
        JSON.stringify({ atrId: id, evidenceCount: evidenceFiles.length })
      );

      // Add audit event
      db.prepare(`
        INSERT INTO audit_events (
          id, actor_id, actor_name, role, action, target_type, target_id, result, created_at, metadata
        ) VALUES (?, ?, ?, ?, 'ATR_SUBMISSION', 'case', ?, 'SUCCESS', ?, ?)
      `).run(
        'aud-' + Date.now(),
        actor.id,
        actor.display_name,
        actor.role,
        foundCase.case_number,
        now,
        JSON.stringify({ atrId: id, submittedBy: submittedByName, institutionId })
      );
    });

    transaction();
    return this.getById(caseId);
  }
};
