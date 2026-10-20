import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ExternalLink
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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-nexus-navy/40 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white border border-nexus-border rounded-2xl shadow-nexus-elevated w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 cursor-default"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-nexus-border flex items-center justify-between bg-nexus-bg shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-nexus-primary-subtle text-nexus-primary flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-nexus-navy">{institution?.name || 'Loading...'}</h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  AICTE Approved
                </span>
              </div>
              <div className="text-xs text-nexus-navy-muted flex items-center gap-2 mt-0.5 font-mono">
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Bureau Summary Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-nexus-border shrink-0 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-nexus-navy-muted">Consolidated Cases: </span>
              <strong className="text-nexus-navy text-sm">{cases.length}</strong>
            </div>
            <div>
              <span className="text-nexus-navy-muted">Active Inquiries: </span>
              <strong className="text-blue-600 text-sm">
                {cases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length}
              </strong>
            </div>
            <div>
              <span className="text-nexus-navy-muted">Overdue: </span>
              <strong className="text-nexus-danger text-sm">
                {cases.filter(c => c.is_overdue).length}
              </strong>
            </div>
          </div>

          <div className="text-xs text-slate-500 italic">
            *One institution. One consolidated case view across all AICTE Bureaus & Cells.*
          </div>
        </div>

        {/* Scrollable Cases Table */}
        <div className="p-6 overflow-y-auto flex-1">
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
            <div className="space-y-3">
              <div className="text-xs font-bold text-nexus-navy uppercase tracking-wider text-slate-500 mb-2">
                All Linked Grievances & Bureau Inquiries ({cases.length})
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
                          {c.bureau_name}
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
                            c.status === 'Resolved' || c.status === 'Closed'
                              ? 'bg-nexus-success-light text-nexus-success-text border border-nexus-success-border'
                              : c.is_overdue
                              ? 'bg-nexus-danger-light text-nexus-danger-text border border-nexus-danger-border'
                              : 'bg-nexus-warning-light text-nexus-warning-text border border-nexus-warning-border'
                          }`}>
                            {c.status}
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
