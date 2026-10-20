import { db } from '../../db/connection.js';

export const relatedService = {
  getCandidates(caseId: string) {
    const query = `
      SELECT 
        r.*,
        c.case_number as candidate_case_number,
        c.summary as candidate_summary,
        c.status as candidate_status,
        c.category as candidate_category,
        b.name as candidate_bureau,
        u.display_name as reviewer_name
      FROM related_case_reviews r
      JOIN cases c ON r.candidate_case_id = c.id
      JOIN bureaus b ON c.current_bureau_id = b.id
      LEFT JOIN users u ON r.reviewed_by = u.id
      WHERE r.case_id = ?
      ORDER BY r.similarity_score DESC
    `;

    const candidates = db.prepare(query).all(caseId) as any[];
    return candidates.map(c => ({
      ...c,
      match_reasons: JSON.parse(c.match_reasons || '[]')
    }));
  },

  reviewCandidate(caseId: string, candidateId: string, payload: {
    status: 'confirmed_related' | 'rejected';
    reviewNote?: string;
    actor: { id: string; display_name: string; role: string };
  }) {
    const { status, reviewNote, actor } = payload;
    const now = new Date().toISOString();

    const targetReview = db.prepare(`
      SELECT * FROM related_case_reviews 
      WHERE case_id = ? AND (candidate_case_id = ? OR id = ?)
    `).get(caseId, candidateId, candidateId) as any;

    if (!targetReview) {
      throw new Error('Candidate related case review record not found.');
    }

    const parentCase = db.prepare('SELECT case_number FROM cases WHERE id = ?').get(caseId) as any;
    const candidateCase = db.prepare('SELECT case_number FROM cases WHERE id = ?').get(targetReview.candidate_case_id) as any;

    const transaction = db.transaction(() => {
      db.prepare(`
        UPDATE related_case_reviews
        SET review_status = ?,
            reviewed_by = ?,
            reviewed_at = ?,
            review_note = ?
        WHERE id = ?
      `).run(status, actor.id, now, reviewNote || null, targetReview.id);

      // Also record reciprocal link if desired or add case event
      const eventId = 'evt-' + Date.now();
      const eventNote = `Candidate ${candidateCase?.case_number || ''} was marked as '${status}' by reviewer. Note: ${reviewNote || 'None'}`;

      db.prepare(`
        INSERT INTO case_events (
          id, case_id, actor_id, event_type, from_value, to_value, note, created_at, metadata
        ) VALUES (?, ?, ?, 'RELATED_REVIEW', 'pending', ?, ?, ?, ?)
      `).run(
        eventId,
        caseId,
        actor.id,
        status,
        eventNote,
        now,
        JSON.stringify({ candidateCaseId: targetReview.candidate_case_id, score: targetReview.similarity_score })
      );

      // Audit event
      db.prepare(`
        INSERT INTO audit_events (
          id, actor_id, actor_name, role, action, target_type, target_id, result, created_at, metadata
        ) VALUES (?, ?, ?, ?, 'REVIEW_RELATED_CASE', 'case', ?, 'SUCCESS', ?, ?)
      `).run(
        'aud-' + Date.now(),
        actor.id,
        actor.display_name,
        actor.role,
        parentCase?.case_number || caseId,
        now,
        JSON.stringify({
          candidateCaseNumber: candidateCase?.case_number,
          decision: status,
          reviewNote
        })
      );
    });

    transaction();
    return this.getCandidates(caseId);
  }
};
