import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Calendar,
  Clock,
  User as UserIcon,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Link2,
  FileText,
  RotateCw,
  Target,
  Send,
  History,
  ShieldCheck,
  Check,
  Ban
} from 'lucide-react';
import { api } from '../services/api';
import { Case, CaseEvent, RelatedCaseCandidate } from '../types';
import { useDemo } from '../context/DemoContext';
import { AssignModal } from './AssignModal';
import { StatusModal } from './StatusModal';
import { NextActionModal } from './NextActionModal';

interface CaseDetailModalProps {
  caseId: string | null;
  onClose: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ caseId, onClose }) => {
  const { currentUser, setActiveInstitutionId, setActiveCaseId, showToast, triggerRefresh } = useDemo();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [timeline, setTimeline] = useState<CaseEvent[]>([]);
  const [relatedCandidates, setRelatedCandidates] = useState<RelatedCaseCandidate[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'related' | 'assignments'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Sub-modals
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  // Review note modal or inline state
  const [reviewingCandidateId, setReviewingCandidateId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const loadData = async () => {
    if (!caseId) return;
    setIsLoading(true);
    try {
      const [caseRes, timelineRes, relatedRes] = await Promise.all([
        api.getCaseById(caseId),
        api.getCaseTimeline(caseId),
        api.getRelatedCandidates(caseId)
      ]);
      setCaseData(caseRes.data);
      setTimeline(timelineRes.data);
      setRelatedCandidates(relatedRes.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load case details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [caseId]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleReviewDecision = async (candidateId: string, status: 'confirmed_related' | 'rejected') => {
    if (!caseId) return;
    try {
      await api.reviewRelatedCandidate(caseId, candidateId, {
        status,
        reviewNote: reviewNote || (status === 'confirmed_related' ? 'Confirmed by human reviewer' : 'Rejected after inspection')
      });
      showToast(`Review decision '${status}' recorded. Event logged in audit trail.`, 'success');
      setReviewingCandidateId(null);
      setReviewNote('');
      loadData();
      triggerRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to record review decision', 'error');
    }
  };

  const canAssign = currentUser?.role === 'leadership' ||
    currentUser?.role === 'bureau_official' ||
    currentUser?.role === 'admin';

  const canUpdateStatus = currentUser?.role === 'leadership' ||
    currentUser?.role === 'bureau_official' ||
    currentUser?.role === 'case_handler' ||
    currentUser?.role === 'admin';

  const canReviewRelated = currentUser?.role === 'leadership' ||
    currentUser?.role === 'bureau_official' ||
    currentUser?.role === 'case_handler' ||
    currentUser?.role === 'admin';

  if (!caseId) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-nexus-navy/40 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white border border-nexus-border rounded-2xl shadow-nexus-elevated w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 cursor-default"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-nexus-border flex items-center justify-between bg-nexus-bg/70 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-nexus-primary bg-nexus-primary-subtle px-2.5 py-1 rounded-md border border-nexus-primary-border">
              {caseData?.case_number || 'Loading...'}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              caseData?.status === 'Resolved' || caseData?.status === 'Closed'
                ? 'bg-nexus-success-light text-nexus-success-text border border-nexus-success-border'
                : caseData?.is_overdue
                ? 'bg-nexus-danger-light text-nexus-danger-text border border-nexus-danger-border animate-pulse'
                : caseData?.is_due_soon
                ? 'bg-nexus-warning-light text-nexus-warning-text border border-nexus-warning-border'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {caseData?.status}
            </span>
            {caseData?.priority && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                caseData.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                caseData.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {caseData.priority} Priority
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Case Header Details & Action Toolbar */}
        {caseData && (
          <div className="px-6 py-3.5 bg-white border-b border-nexus-border shrink-0 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div
                onClick={() => {
                  if (caseData.institution_id) {
                    setActiveInstitutionId(caseData.institution_id);
                  }
                }}
                className="text-xs font-semibold text-nexus-primary hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{caseData.institution_name}</span>
                <span className="font-mono text-nexus-navy-light text-[11px]">({caseData.institution_code})</span>
              </div>
              <div className="text-xs text-nexus-navy-muted flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-nexus-navy-light" />
                  <span>{caseData.bureau_name}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5 text-nexus-navy-light" />
                  <span className={caseData.owner_name ? 'text-nexus-navy font-medium' : 'text-amber-600 font-semibold'}>
                    {caseData.owner_name || 'Unassigned (Action Required)'}
                  </span>
                </span>
                {caseData.source_case_id && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      Ref: {caseData.source_case_id}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {canAssign && (
                <button
                  onClick={() => setIsAssignOpen(true)}
                  className="flex items-center gap-1.5 bg-nexus-bg hover:bg-nexus-primary-subtle text-nexus-primary border border-nexus-primary-border text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transfer / Assign</span>
                </button>
              )}

              {canUpdateStatus && (
                <button
                  onClick={() => setIsStatusOpen(true)}
                  className="flex items-center gap-1.5 bg-nexus-primary hover:bg-nexus-primary-hover text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Update Status</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 border-b border-nexus-border bg-nexus-bg/50 shrink-0 flex items-center gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-nexus-primary text-nexus-primary'
                : 'border-transparent text-nexus-navy-muted hover:text-nexus-navy'
            }`}
          >
            Overview & Details
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'timeline'
                ? 'border-nexus-primary text-nexus-primary'
                : 'border-transparent text-nexus-navy-muted hover:text-nexus-navy'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Timeline ({timeline.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('related')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'related'
                ? 'border-nexus-primary text-nexus-primary'
                : 'border-transparent text-nexus-navy-muted hover:text-nexus-navy'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-nexus-primary" />
            <span>Related Cases AI ({relatedCandidates.length})</span>
            {relatedCandidates.some(c => c.review_status === 'pending') && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'assignments'
                ? 'border-nexus-primary text-nexus-primary'
                : 'border-transparent text-nexus-navy-muted hover:text-nexus-navy'
            }`}
          >
            Assignment Chain ({caseData?.assignmentHistory?.length || 0})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-nexus-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-nexus-navy-muted">Loading case details...</p>
            </div>
          ) : !caseData ? (
            <div className="text-center py-12 text-sm text-nexus-navy-muted">
              Case record not found.
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Next Action Callout Card */}
                  <div className="p-4 rounded-xl border border-nexus-primary-border bg-nexus-primary-subtle/50 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-nexus-primary">
                        <Target className="w-4 h-4" />
                        <span>Current Operational Next Action</span>
                      </div>
                      <p className="text-xs font-medium text-nexus-navy leading-relaxed">
                        {caseData.next_action || 'No next action defined yet. Please set a milestone.'}
                      </p>
                      {caseData.next_action_due && (
                        <div className="text-[11px] text-nexus-navy-muted flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-nexus-navy-light" />
                          <span>Milestone target: {new Date(caseData.next_action_due).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setIsNextActionOpen(true)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-nexus-border rounded-lg text-xs font-semibold text-nexus-navy shadow-sm shrink-0 transition"
                    >
                      Update Milestone
                    </button>
                  </div>

                  {/* Summary Box */}
                  <div>
                    <h4 className="text-xs font-bold text-nexus-navy mb-2 uppercase tracking-wider text-slate-500">
                      Grievance / Inquiry Summary
                    </h4>
                    <div className="p-4 rounded-xl border border-nexus-border bg-nexus-bg text-sm text-nexus-navy leading-relaxed">
                      {caseData.summary}
                    </div>
                  </div>

                  {/* Closure Summary if resolved */}
                  {caseData.closure_summary && (
                    <div className="p-4 rounded-xl border border-nexus-success-border bg-nexus-success-light text-xs text-nexus-success-text space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-nexus-success" />
                        <span>Official Resolution Summary</span>
                        {caseData.closed_at && (
                          <span className="font-normal text-[11px] text-slate-500">
                            (Closed on {new Date(caseData.closed_at).toLocaleDateString()})
                          </span>
                        )}
                      </div>
                      <p className="leading-relaxed">{caseData.closure_summary}</p>
                    </div>
                  )}

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl border border-nexus-border bg-white space-y-2">
                      <div className="text-xs font-bold text-nexus-navy">SLA & Due Date Tracking</div>
                      <div className="space-y-1.5 text-xs text-nexus-navy-muted">
                        <div className="flex justify-between">
                          <span>Created Date:</span>
                          <span className="font-medium text-nexus-navy">
                            {new Date(caseData.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>SLA Due Date:</span>
                          <span className={`font-semibold ${
                            caseData.is_overdue ? 'text-nexus-danger' :
                            caseData.is_due_soon ? 'text-nexus-warning' : 'text-nexus-navy'
                          }`}>
                            {caseData.due_at ? new Date(caseData.due_at).toLocaleDateString() : 'No Due Date'}
                            {caseData.is_overdue ? ' (OVERDUE)' : caseData.is_due_soon ? ' (Due Soon)' : ''}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Activity:</span>
                          <span className="font-medium text-nexus-navy">
                            {new Date(caseData.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-nexus-border bg-white space-y-2">
                      <div className="text-xs font-bold text-nexus-navy">Origin & Source Channels</div>
                      <div className="space-y-1.5 text-xs text-nexus-navy-muted">
                        <div className="flex justify-between">
                          <span>Ingestion Channel:</span>
                          <span className="font-medium text-nexus-navy">{caseData.source_name || 'Central Portal'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>External Reference:</span>
                          <span className="font-mono font-medium text-nexus-navy">
                            {caseData.source_case_id || 'Direct Filing'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Category:</span>
                          <span className="font-medium text-nexus-navy">{caseData.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CHRONOLOGICAL TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="text-xs text-nexus-navy-muted mb-2">
                    Every status transition, officer assignment, and handoff note is permanently recorded for regulatory auditability.
                  </div>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-nexus-border">
                    {timeline.map((evt, idx) => (
                      <div key={evt.id || idx} className="relative group">
                        {/* Bullet */}
                        <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-nexus-primary flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary" />
                        </div>

                        <div className="p-3.5 rounded-xl border border-nexus-border bg-white shadow-nexus-card space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-nexus-navy">{evt.event_type.replace('_', ' ')}</span>
                              {evt.to_value && (
                                <span className="text-[10px] bg-slate-100 font-mono text-slate-700 px-2 py-0.5 rounded">
                                  {evt.from_value ? `${evt.from_value} → ` : ''}{evt.to_value}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-nexus-navy-light font-mono">
                              {new Date(evt.created_at).toLocaleString()}
                            </span>
                          </div>

                          {evt.note && (
                            <p className="text-xs text-nexus-navy leading-relaxed bg-nexus-bg p-2.5 rounded-lg border border-nexus-border/60">
                              {evt.note}
                            </p>
                          )}

                          <div className="text-[11px] text-nexus-navy-muted flex items-center gap-1.5 pt-1">
                            <span className="font-medium text-nexus-navy">{evt.actor_name}</span>
                            <span>•</span>
                            <span className="text-slate-500">{evt.actor_role?.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: RELATED CASES & DEDUPLICATION */}
              {activeTab === 'related' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl border border-nexus-primary-border bg-nexus-primary-subtle/40 text-xs text-nexus-navy space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-nexus-primary">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Deduplication & Cross-Bureau Correlation</span>
                    </div>
                    <p className="leading-relaxed text-nexus-navy-muted">
                      Nexus 0 flags possible related or duplicate cases based on institution matching and grievance category similarity.
                      <strong className="text-nexus-navy"> Core Rule: Automatic merging is prohibited.</strong> A human reviewer must confirm, reject, or link each candidate.
                    </p>
                  </div>

                  {relatedCandidates.length === 0 ? (
                    <div className="py-12 text-center text-xs text-nexus-navy-muted">
                      No related case candidates flagged for this complaint.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {relatedCandidates.map(c => {
                        const scorePct = Math.round(c.similarity_score * 100);
                        return (
                          <div
                            key={c.id}
                            className={`p-4 rounded-xl border transition ${
                              c.review_status === 'confirmed_related'
                                ? 'border-nexus-success-border bg-nexus-success-light/30'
                                : c.review_status === 'rejected'
                                ? 'border-slate-200 bg-slate-50/60 opacity-70'
                                : 'border-nexus-border bg-white shadow-nexus-card'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span
                                    onClick={() => setActiveCaseId(c.candidate_case_id)}
                                    className="font-mono text-xs font-bold text-nexus-primary hover:underline cursor-pointer"
                                  >
                                    {c.candidate_case_number}
                                  </span>
                                  <span className="text-xs text-nexus-navy-muted font-medium">
                                    ({c.candidate_bureau})
                                  </span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                    c.review_status === 'confirmed_related'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : c.review_status === 'rejected'
                                      ? 'bg-slate-200 text-slate-700'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {c.review_status.replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="text-xs text-nexus-navy font-medium mt-1">
                                  {c.candidate_summary}
                                </p>
                              </div>

                              <div className="text-right shrink-0">
                                <div className="text-xs font-mono font-bold text-nexus-primary">
                                  {scorePct}% Match
                                </div>
                                <span className="text-[10px] text-slate-400">Advisory Score</span>
                              </div>
                            </div>

                            {/* Match Reasons */}
                            <div className="space-y-1 mb-3">
                              <div className="text-[11px] font-semibold text-slate-500">Correlation Reasons:</div>
                              <ul className="text-xs text-nexus-navy-muted list-disc list-inside space-y-0.5">
                                {c.match_reasons.map((r, i) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Reviewer Note if already reviewed */}
                            {c.review_note && (
                              <div className="p-2.5 rounded-lg bg-white border border-nexus-border/80 text-xs text-nexus-navy mb-3">
                                <span className="font-semibold">Reviewer ({c.reviewer_name || 'Official'}): </span>
                                <span>{c.review_note}</span>
                              </div>
                            )}

                            {/* Review Actions if pending and user is authorized */}
                            {c.review_status === 'pending' && canReviewRelated && (
                              <div className="pt-2 border-t border-nexus-border/60 flex items-center justify-between">
                                <span className="text-[11px] text-amber-700 font-medium">
                                  Action Required: Verify whether these cases should be consolidated
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleReviewDecision(c.id, 'rejected')}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                    <span>Reject Relation</span>
                                  </button>
                                  <button
                                    onClick={() => handleReviewDecision(c.id, 'confirmed_related')}
                                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-nexus-primary hover:bg-nexus-primary-hover text-white text-xs font-semibold shadow-sm transition"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Confirm Related Link</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ASSIGNMENT CHAIN */}
              {activeTab === 'assignments' && (
                <div className="space-y-4">
                  <div className="text-xs text-nexus-navy-muted">
                    Full audit record of every bureau handoff, transfer reason, and receiving officer note.
                  </div>

                  <div className="space-y-3">
                    {caseData.assignmentHistory?.map(asg => (
                      <div
                        key={asg.id}
                        className={`p-3.5 rounded-xl border ${
                          !asg.ended_at
                            ? 'border-nexus-primary bg-nexus-primary-subtle/30 ring-1 ring-nexus-primary/30'
                            : 'border-nexus-border bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-nexus-navy">{asg.bureau_name}</span>
                            {!asg.ended_at && (
                              <span className="text-[10px] font-bold bg-nexus-primary text-white px-2 py-0.5 rounded-full">
                                Active Current Bureau
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {new Date(asg.started_at).toLocaleDateString()}
                            {asg.ended_at ? ` to ${new Date(asg.ended_at).toLocaleDateString()}` : ' - Present'}
                          </span>
                        </div>

                        <div className="text-xs text-nexus-navy-muted flex items-center gap-4 mb-2">
                          <span>Handler: <strong className="text-nexus-navy">{asg.owner_name || 'Unassigned'}</strong></span>
                          <span>•</span>
                          <span>Assigned By: <strong className="text-nexus-navy">{asg.assigned_by_name || 'System'}</strong></span>
                        </div>

                        {asg.transfer_reason && (
                          <div className="text-xs text-nexus-navy bg-white p-2.5 rounded-lg border border-nexus-border/60">
                            <div className="font-semibold text-[11px] text-slate-500 mb-0.5">Transfer Reason:</div>
                            <p>{asg.transfer_reason}</p>
                            {asg.handoff_note && (
                              <div className="mt-1 text-slate-600 italic">
                                Note: {asg.handoff_note}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sub-modals */}
      {caseData && (
        <>
          <AssignModal
            caseItem={caseData}
            isOpen={isAssignOpen}
            onClose={() => setIsAssignOpen(false)}
            onSuccess={() => {
              loadData();
              triggerRefresh();
            }}
          />
          <StatusModal
            caseItem={caseData}
            isOpen={isStatusOpen}
            onClose={() => setIsStatusOpen(false)}
            onSuccess={() => {
              loadData();
              triggerRefresh();
            }}
          />
          <NextActionModal
            caseItem={caseData}
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            onSuccess={() => {
              loadData();
              triggerRefresh();
            }}
          />
        </>
      )}
    </div>
  );
};
