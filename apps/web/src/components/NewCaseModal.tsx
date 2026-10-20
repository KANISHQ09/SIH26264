import React, { useState, useEffect } from 'react';
import { X, Plus, Building2, Briefcase } from 'lucide-react';
import { api } from '../services/api';
import { Institution, Bureau } from '../types';
import { useDemo } from '../context/DemoContext';

export const NewCaseModal: React.FC = () => {
  const { isNewCaseModalOpen, setIsNewCaseModalOpen, showToast, triggerRefresh, setActiveCaseId } = useDemo();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [bureaus, setBureaus] = useState<Bureau[]>([]);

  const [institutionId, setInstitutionId] = useState('');
  const [currentBureauId, setCurrentBureauId] = useState('');
  const [category, setCategory] = useState('Approvals');
  const [priority, setPriority] = useState('Medium');
  const [summary, setSummary] = useState('');
  const [sourceCaseId, setSourceCaseId] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [dueDays, setDueDays] = useState('14');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isNewCaseModalOpen) {
      api.getInstitutions().then(res => {
        setInstitutions(res.data);
        if (res.data[0]) setInstitutionId(res.data[0].id);
      });
      api.getBureaus().then(res => {
        setBureaus(res.data);
        if (res.data[0]) setCurrentBureauId(res.data[0].id);
      });
      setSummary('');
      setSourceCaseId('');
      setNextAction('');
    }
  }, [isNewCaseModalOpen]);

  if (!isNewCaseModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionId || !currentBureauId || !summary.trim()) {
      showToast('Please fill in all mandatory fields', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const dueAt = new Date(Date.now() + parseInt(dueDays, 10) * 86400000).toISOString();

      const res = await api.createCase({
        institutionId,
        currentBureauId,
        category,
        priority,
        summary,
        sourceCaseId: sourceCaseId.trim() || undefined,
        nextAction: nextAction.trim() || undefined,
        dueAt
      });

      showToast(`Case ${res.data.case_number} logged successfully! Event committed to audit trail.`, 'success');
      setIsNewCaseModalOpen(false);
      triggerRefresh();
      setActiveCaseId(res.data.id);
    } catch (err: any) {
      showToast(err.message || 'Failed to create case', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-navy/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-nexus-border rounded-2xl shadow-nexus-elevated w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-nexus-border flex items-center justify-between bg-nexus-bg">
          <div>
            <h3 className="font-bold text-base text-nexus-navy">Log New Institution Grievance / Case</h3>
            <p className="text-xs text-nexus-navy-muted">Enter case details to initiate coordinated workflow tracking</p>
          </div>
          <button
            onClick={() => setIsNewCaseModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Institution */}
          <div>
            <label className="block text-xs font-semibold text-nexus-navy mb-1">
              Select Institution <span className="text-red-500">*</span>
            </label>
            <select
              value={institutionId}
              onChange={e => setInstitutionId(e.target.value)}
              className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border px-3 py-2.5 focus:border-nexus-primary focus:bg-white focus:outline-none"
              required
            >
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.institution_code}) — {inst.city}
                </option>
              ))}
            </select>
          </div>

          {/* Bureau & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-nexus-navy mb-1">
                Responsible Bureau <span className="text-red-500">*</span>
              </label>
              <select
                value={currentBureauId}
                onChange={e => setCurrentBureauId(e.target.value)}
                className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border px-3 py-2.5 focus:border-nexus-primary focus:bg-white focus:outline-none"
                required
              >
                {bureaus.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-nexus-navy mb-1">
                Grievance Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border px-3 py-2.5 focus:border-nexus-primary focus:bg-white focus:outline-none"
              >
                <option value="Approvals">Approvals</option>
                <option value="Academic">Academic</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Examination">Examination</option>
                <option value="Faculty & Staff">Faculty & Staff</option>
                <option value="Fee & Admissions">Fee & Admissions</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Priority & Source Case ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-nexus-navy mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border px-3 py-2.5 focus:border-nexus-primary focus:bg-white focus:outline-none"
              >
                <option value="Urgent">Urgent (48 Hour SLA)</option>
                <option value="High">High (7 Day SLA)</option>
                <option value="Medium">Medium (14 Day SLA)</option>
                <option value="Low">Low (30 Day SLA)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-nexus-navy mb-1">
                External Portal Ref ID (e.g. CPGRAMS)
              </label>
              <input
                type="text"
                value={sourceCaseId}
                onChange={e => setSourceCaseId(e.target.value)}
                placeholder="CPGRAMS/2026/XXXX"
                className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border px-3 py-2.5 focus:border-nexus-primary focus:bg-white focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-nexus-navy mb-1">
              Grievance / Investigation Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="State the core issue, non-compliance allegation, or regulatory petition..."
              className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border p-3 focus:border-nexus-primary focus:bg-white focus:outline-none resize-none"
              required
            />
          </div>

          {/* Next Action */}
          <div>
            <label className="block text-xs font-semibold text-nexus-navy mb-1">
              Initial Next Action
            </label>
            <input
              type="text"
              value={nextAction}
              onChange={e => setNextAction(e.target.value)}
              placeholder="e.g. Issue clarification directive to college management"
              className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border px-3 py-2.5 focus:border-nexus-primary focus:bg-white focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-nexus-border">
            <button
              type="button"
              onClick={() => setIsNewCaseModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-nexus-border text-nexus-navy-muted hover:bg-slate-50 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-nexus-primary hover:bg-nexus-primary-hover text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Logging...' : 'Create Case Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
