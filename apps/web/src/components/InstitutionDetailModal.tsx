import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  MapPin,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  Scale,
  Users
} from 'lucide-react';
import { api } from '../services/api';
import { Institution, Case } from '../types';
import { useDemo } from '../context/DemoContext';

interface InstitutionDetailModalProps {
  institutionId: string | null;
  onClose: () => void;
}

export const InstitutionDetailModal: React.FC<InstitutionDetailModalProps> = ({
  institutionId,
  onClose
}) => {
  const { setActiveCaseId } = useDemo();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFormulaBreakdown, setShowFormulaBreakdown] = useState(false);

  useEffect(() => {
    if (!institutionId) return;

    setIsLoading(true);
    Promise.all([
      api.getInstitutionById(institutionId),
      api.getInstitutionCases(institutionId)
    ])
      .then(([instRes, casesRes]) => {
        setInstitution(instRes.data);
        setCases(casesRes.data);
      })
      .catch(err => {
        console.error('Failed to load institution profile', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [institutionId]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!institutionId) return null;

  const overlap = institution?.overlap;
  const riskScore = institution?.riskScore;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-nexus-navy/40 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white border border-nexus-border rounded-2xl shadow-nexus-elevated w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 cursor-default"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-nexus-border flex items-center justify-between bg-nexus-bg shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-nexus-primary-subtle text-nexus-primary flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-nexus-navy">{institution?.name || 'Loading...'}</h3>
                <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  AICTE Approved
                </span>
                {institution?.region && (
                  <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full font-mono">
                    Region: {institution.region}
                  </span>
                )}
              </div>
              <div className="text-[11px] sm:text-xs text-nexus-navy-muted flex flex-wrap items-center gap-2 mt-1 font-mono">
                {institution?.aicte_permanent_id && (
                  <span className="font-semibold text-nexus-navy">
                    AICTE Permanent ID: {institution.aicte_permanent_id}
                  </span>
                )}
                <span>•</span>
                <span>Code: {institution?.institution_code}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-sans">
                  <MapPin className="w-3 h-3 text-nexus-navy-light" />
                  <span>{institution?.city}, {institution?.state}</span>
                </span>
                <span>•</span>
                <span className="font-sans text-nexus-navy-light">{institution?.institution_type}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainable Institutional Risk Score Card */}
        {riskScore && (
          <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-nexus-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-nexus-navy-muted" />
                <span className="text-xs font-semibold text-nexus-navy">Institutional Compliance Health:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  riskScore.level === 'High'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : riskScore.level === 'Moderate'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  Score: {riskScore.score}/100 • {riskScore.level} Risk
                </span>
                <button
                  type="button"
                  onClick={() => setShowFormulaBreakdown(prev => !prev)}
                  className="text-[11px] text-nexus-primary hover:underline flex items-center gap-0.5 font-medium"
                >
                  <span>{showFormulaBreakdown ? 'Hide Formula' : 'Why this score?'}</span>
                  {showFormulaBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 italic">
              {riskScore.disclaimer}
            </div>
          </div>
        )}

        {/* Formula Breakdown Drawer */}
        {showFormulaBreakdown && riskScore && (
          <div className="px-4 sm:px-6 py-3 bg-amber-50/70 border-b border-amber-200 text-xs text-amber-950 animate-in slide-in-from-top-2 duration-150">
            <div className="font-semibold text-xs text-amber-900 mb-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>Transparent Demonstration Calculation:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono mt-1.5">
              <div className="bg-white p-2 rounded border border-amber-200">
                <span className="text-slate-500 block">Base Metric:</span>
                <strong className="text-slate-800 text-xs">100 Pts</strong>
              </div>
              <div className="bg-white p-2 rounded border border-amber-200">
                <span className="text-slate-500 block">Overdue Inquiries:</span>
                <strong className="text-rose-700 text-xs">-{riskScore.breakdown.overdueDeduction} pts ({riskScore.breakdown.overdueCount} cases)</strong>
              </div>
              <div className="bg-white p-2 rounded border border-amber-200">
                <span className="text-slate-500 block">Regulation Bureau Cases:</span>
                <strong className="text-amber-800 text-xs">-{riskScore.breakdown.rbDeduction} pts ({riskScore.breakdown.rbCount} cases)</strong>
              </div>
              <div className="bg-white p-2 rounded border border-amber-200">
                <span className="text-slate-500 block">PGRC Grievance Cases:</span>
                <strong className="text-blue-800 text-xs">-{riskScore.breakdown.pgrcDeduction} pts ({riskScore.breakdown.pgrcCount} cases)</strong>
              </div>
            </div>
          </div>
        )}

        {/* Multi-Bureau Summary Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-nexus-border shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div>
              <span className="text-nexus-navy-muted">Consolidated Cases: </span>
              <strong className="text-nexus-navy text-sm font-mono">{cases.length}</strong>
            </div>
            <div>
              <span className="text-nexus-navy-muted">Active Inquiries: </span>
              <strong className="text-blue-600 text-sm font-mono">
                {cases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed' && c.status !== 'Disposed').length}
              </strong>
            </div>
            <div>
              <span className="text-nexus-navy-muted">Overdue SLA: </span>
              <strong className="text-rose-600 text-sm font-mono">
                {cases.filter(c => c.is_overdue).length}
              </strong>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            *Consolidated dossier spanning Regulation Bureau, PGRC & Approvals.*
          </div>
        </div>

        {/* Scrollable Content Canvas */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* MANDATED OVERLAP ALERT BANNER (Inter-Bureau Lock) */}
          {overlap?.has_overlap && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 border-l-4 border-l-amber-600 p-4 rounded-xl shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-bold text-amber-950 text-sm tracking-wide">
                      {overlap.banner_text}
                    </h4>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded uppercase">
                      Mandatory Inter-Bureau Coordination
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/90 mt-1.5 leading-relaxed">
                    AICTE Central Engine has detected concurrent active proceedings regarding this institution across multiple Bureaus/Cells. 
                    {overlap.has_rb_and_pgrc && (
                      <span className="font-semibold ml-1">
                        Specifically, both the Regulation Bureau (RB) and Public Grievance Redressal Cell (PGRC) have active investigations.
                      </span>
                    )}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-amber-950">Involved Bureaus:</span>
                    {overlap.bureaus_involved.map(b => (
                      <span key={b.id} className="text-[11px] bg-white text-slate-800 font-medium px-2.5 py-1 rounded-md border border-amber-200 shadow-xs">
                        {b.name} ({b.active_count} active)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cases Table */}
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-nexus-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-nexus-navy-muted">Aggregating cross-bureau records...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="py-12 text-center text-xs text-nexus-navy-muted">
              No registered complaint records for this institution.
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-nexus-navy uppercase tracking-wider text-slate-500">
                  Consolidated Bureau Inquiries ({cases.length})
                </div>
                <div className="text-[11px] text-nexus-navy-muted">
                  Click any case to inspect SLA timer & investigation details
                </div>
              </div>

              <div className="border border-nexus-border rounded-xl overflow-x-auto shadow-nexus-card">
                <table className="w-full min-w-[700px] text-left text-xs">
                  <thead className="bg-nexus-bg border-b border-nexus-border font-semibold text-nexus-navy-muted">
                    <tr>
                      <th className="px-4 py-3 w-32">Case ID</th>
                      <th className="px-4 py-3 min-w-[200px]">Subject & Summary</th>
                      <th className="px-4 py-3 min-w-[170px]">Responsible Bureau</th>
                      <th className="px-4 py-3 min-w-[130px]">Assigned Officer</th>
                      <th className="px-4 py-3 w-28">Status</th>
                      <th className="px-4 py-3 w-24 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nexus-border bg-white">
                    {cases.map(c => (
                      <tr
                        key={c.id}
                        onClick={() => {
                          onClose();
                          setActiveCaseId(c.id);
                        }}
                        className="hover:bg-nexus-bg/60 cursor-pointer transition group"
                      >
                        <td className="px-4 py-3 font-mono font-semibold text-nexus-primary whitespace-nowrap">
                          {c.case_number}
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="font-medium text-nexus-navy line-clamp-1">{c.summary}</div>
                          <div className="text-[11px] text-nexus-navy-muted">{c.category} • {c.priority}</div>
                        </td>
                        <td className="px-4 py-3 text-nexus-navy whitespace-nowrap">
                          <span className="font-medium">{c.bureau_name}</span>
                        </td>
                        <td className="px-4 py-3 text-nexus-navy-muted whitespace-nowrap">
                          {c.owner_name ? (
                            <span className="font-medium text-nexus-navy">{c.owner_name}</span>
                          ) : (
                            <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            c.status === 'Resolved' || c.status === 'Closed' || c.status === 'Disposed'
                              ? 'bg-nexus-success-light text-nexus-success-text border border-nexus-success-border'
                              : c.is_overdue
                              ? 'bg-nexus-danger-light text-nexus-danger-text border border-nexus-danger-border'
                              : c.is_due_soon
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-nexus-warning-light text-nexus-warning-text border border-nexus-warning-border'
                          }`}>
                            {c.status}
                            {c.is_overdue && ' (Overdue)'}
                            {c.is_due_soon && ' (Due Soon)'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-nexus-primary group-hover:text-nexus-primary-hover font-semibold text-xs transition">
                            <span>Open</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
