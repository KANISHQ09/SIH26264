import React, { useState, useEffect } from 'react';
import {
  Building2,
  FileCheck,
  AlertTriangle,
  Scale,
  Clock,
  ArrowRight,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { Institution, Case } from '../types';
import { useDemo } from '../context/DemoContext';
import { SubmitAtrModal } from '../components/SubmitAtrModal';

export const InstitutionDashboardView: React.FC = () => {
  const { currentUser, setActiveCaseId, refreshKey } = useDemo();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCaseForAtr, setSelectedCaseForAtr] = useState<Case | null>(null);
  const [showFormulaBreakdown, setShowFormulaBreakdown] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Find RGPV Demonstration Institute
    api.getInstitutions('RGPV')
      .then(res => {
        const inst = res.data[0];
        if (inst) {
          setInstitution(inst);
          return Promise.all([
            api.getInstitutionById(inst.id),
            api.getInstitutionCases(inst.id)
          ]);
        }
        return Promise.reject('No institution found');
      })
      .then(([fullInstRes, casesRes]) => {
        setInstitution(fullInstRes.data);
        setCases(casesRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  const riskScore = institution?.riskScore;
  const activeCases = cases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed' && c.status !== 'Disposed');

  return (
    <div className="space-y-6">
      {/* College Header */}
      <div className="bg-white border border-nexus-border rounded-2xl p-5 sm:p-6 shadow-nexus-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-nexus-primary-subtle text-nexus-primary flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-nexus-navy">
                  {institution?.name || 'RGPV Demonstration Institute of Engineering & Technology'}
                </h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
                  AICTE Approved
                </span>
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">
                  EoA 2026-27: Conditional Scrutiny
                </span>
              </div>

              <div className="text-xs text-nexus-navy-muted flex flex-wrap items-center gap-2 mt-1.5 font-mono">
                <span className="font-semibold text-nexus-navy">
                  AICTE Permanent ID: {institution?.aicte_permanent_id || '1-3321458291'}
                </span>
                <span>•</span>
                <span>Code: {institution?.institution_code}</span>
                <span>•</span>
                <span className="font-sans font-medium text-slate-700">Region: WRO (Pune)</span>
                <span>•</span>
                <span className="font-sans text-nexus-navy-light">{institution?.city}, {institution?.state}</span>
              </div>
            </div>
          </div>

          <div className="text-xs bg-slate-50 border border-slate-200 p-3 rounded-xl lg:max-w-xs space-y-1">
            <span className="text-slate-500 block">Logged In Representative:</span>
            <strong className="text-nexus-navy block font-semibold">
              {currentUser?.display_name || 'Dr. Meenakshi Sundaram'}
            </strong>
            <span className="text-[11px] text-slate-600 block">
              {currentUser?.designation || 'Principal & Member Secretary (GRC)'}
            </span>
          </div>
        </div>
      </div>

      {/* Institutional Compliance Health & Explainable Risk Score */}
      {riskScore && (
        <div className="bg-white border border-nexus-border rounded-2xl p-5 sm:p-6 shadow-nexus-card space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-nexus-border pb-3">
            <div className="flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-nexus-primary" />
              <div>
                <h3 className="font-bold text-sm sm:text-base text-nexus-navy">
                  Institutional Compliance Health Scorecard
                </h3>
                <p className="text-xs text-nexus-navy-muted">
                  Deterministic compliance metric derived from unresolved grievances and active regulatory inquiries.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${
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
                className="text-xs text-nexus-primary hover:underline flex items-center gap-0.5 font-medium"
              >
                <span>{showFormulaBreakdown ? 'Hide Breakdown' : 'Show Calculation'}</span>
                {showFormulaBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Breakdown Drawer */}
          {showFormulaBreakdown && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-950 flex items-center gap-1">
                  <Info className="w-4 h-4 text-amber-700" />
                  <span>Explainable Mathematical Deductions:</span>
                </span>
                <span className="text-[11px] text-amber-800 italic">
                  {riskScore.disclaimer}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
                <div className="bg-white p-2.5 rounded border border-amber-200">
                  <span className="text-slate-500 block">Baseline:</span>
                  <strong className="text-slate-900 text-xs font-bold">100 Pts</strong>
                </div>
                <div className="bg-white p-2.5 rounded border border-amber-200">
                  <span className="text-slate-500 block">Overdue Inquiries:</span>
                  <strong className="text-rose-700 text-xs font-bold">-{riskScore.breakdown.overdueDeduction} pts</strong>
                </div>
                <div className="bg-white p-2.5 rounded border border-amber-200">
                  <span className="text-slate-500 block">Regulation Bureau (RB):</span>
                  <strong className="text-amber-800 text-xs font-bold">-{riskScore.breakdown.rbDeduction} pts</strong>
                </div>
                <div className="bg-white p-2.5 rounded border border-amber-200">
                  <span className="text-slate-500 block">PGRC Complaints:</span>
                  <strong className="text-blue-800 text-xs font-bold">-{riskScore.breakdown.pgrcDeduction} pts</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Taken Report (ATR) Submission Desk (Demo Step 5) */}
      <div className="bg-white border border-nexus-border rounded-2xl p-5 sm:p-6 shadow-nexus-card space-y-4">
        <div className="flex items-center justify-between border-b border-nexus-border pb-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-nexus-navy">
              AICTE Show-Cause Notices & Action Taken Report (ATR) Desk
            </h3>
            <p className="text-xs text-nexus-navy-muted">
              Submit compliance affidavits, refund vouchers, and GRC resolutions to resolve active AICTE notices.
            </p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">
            {activeCases.length} Active Notice{activeCases.length !== 1 ? 's' : ''}
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-nexus-navy-muted">
            <div className="w-7 h-7 border-2 border-nexus-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading pending institution notices...
          </div>
        ) : activeCases.length === 0 ? (
          <div className="py-12 text-center text-xs text-emerald-700 font-semibold bg-emerald-50 rounded-xl border border-emerald-200">
            ✓ No outstanding show-cause notices. College is in good standing across all AICTE Bureaus.
          </div>
        ) : (
          <div className="space-y-4">
            {activeCases.map(c => (
              <div
                key={c.id}
                className="border border-nexus-border rounded-xl p-4 sm:p-5 hover:border-nexus-primary-border transition bg-slate-50/40 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-nexus-primary bg-nexus-primary-subtle px-2.5 py-0.5 rounded border border-nexus-primary-border">
                        {c.case_number}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                        {c.bureau_name}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {c.category}
                      </span>
                      {c.is_overdue && (
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded uppercase">
                          Overdue Notice
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-nexus-navy font-semibold mt-1">
                      Notice: {c.summary}
                    </div>
                  </div>

                  {/* Submit ATR Action Button (Demo Step 5) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCaseForAtr(c)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Submit Action Taken Report (ATR)</span>
                    </button>
                    <button
                      onClick={() => setActiveCaseId(c.id)}
                      className="p-2 text-slate-400 hover:text-nexus-primary hover:bg-white rounded-lg border border-nexus-border transition"
                      title="Inspect full case record"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-nexus-border text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="text-slate-600">
                    <span className="font-semibold text-nexus-navy">Mandatory Operational Requirement: </span>
                    <span>{c.next_action || 'Submit written compliance affidavit.'}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Target Due Date: <strong>{c.due_at ? new Date(c.due_at).toLocaleDateString() : 'Immediate'}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ATR Submission Modal */}
      <SubmitAtrModal
        caseData={selectedCaseForAtr}
        isOpen={!!selectedCaseForAtr}
        onClose={() => setSelectedCaseForAtr(null)}
        onSuccess={() => {
          setSelectedCaseForAtr(null);
        }}
      />
    </div>
  );
};
