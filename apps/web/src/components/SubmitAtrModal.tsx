import React, { useState } from 'react';
import { X, Send, FileCheck, Upload, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { Case } from '../types';
import { useDemo } from '../context/DemoContext';

interface SubmitAtrModalProps {
  caseData: Case | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubmitAtrModal: React.FC<SubmitAtrModalProps> = ({
  caseData,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, showToast, triggerRefresh } = useDemo();
  const [submissionText, setSubmissionText] = useState('');
  const [actionDate, setActionDate] = useState(new Date().toISOString().split('T')[0]);
  const [evidenceName, setEvidenceName] = useState('Compliance_Proof_Resolution.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !caseData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim() || submissionText.length < 15) {
      showToast('Please provide a substantive Action Taken explanation (minimum 15 characters).', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitCaseAtr(caseData.id, {
        institutionId: caseData.institution_id,
        submittedByName: currentUser?.display_name || 'Dr. Meenakshi Sundaram',
        submittedByRole: currentUser?.role || 'institution',
        submissionText: submissionText.trim(),
        actionTakenDate: actionDate,
        evidenceFiles: [evidenceName, 'Official_Affidavit_Stamp.pdf']
      });

      showToast('Action Taken Report (ATR) submitted successfully. Recorded in audit trail.', 'success');
      onSuccess();
      onClose();
      triggerRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit ATR', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-nexus-navy/40 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white border border-nexus-border rounded-2xl shadow-nexus-elevated w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 cursor-default"
      >
        <div className="px-5 py-4 border-b border-nexus-border flex items-center justify-between bg-nexus-bg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-nexus-navy">Submit Action Taken Report (ATR)</h3>
              <p className="text-[11px] text-nexus-navy-muted font-mono">{caseData.case_number} • {caseData.institution_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-900 leading-relaxed">
            <span className="font-semibold block mb-0.5">Official Institution Response</span>
            Submitting this ATR places formal compliance evidence on record. It will immediately notify the assigned AICTE Desk Officer and be immutably stamped in the regulatory audit trail.
          </div>

          <div>
            <label className="block text-xs font-semibold text-nexus-navy mb-1.5">
              Action Taken & Remedial Measures <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={submissionText}
              onChange={e => setSubmissionText(e.target.value)}
              placeholder="State the specific remedial actions taken by the institution (e.g. fees refunded, original certificates released, GRC committee resolution number)..."
              className="w-full text-xs p-3 rounded-xl border border-nexus-border focus:outline-none focus:ring-2 focus:ring-nexus-primary/20 focus:border-nexus-primary resize-none leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-nexus-navy mb-1.5">
                Date Action Executed
              </label>
              <input
                type="date"
                value={actionDate}
                onChange={e => setActionDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-nexus-border focus:outline-none focus:border-nexus-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-nexus-navy mb-1.5">
                Upload Proof / Affidavit
              </label>
              <div className="flex items-center gap-2 p-2 border border-nexus-border rounded-lg bg-slate-50 text-xs">
                <Upload className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <input
                  type="text"
                  value={evidenceName}
                  onChange={e => setEvidenceName(e.target.value)}
                  className="bg-transparent w-full text-[11px] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-nexus-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-nexus-navy-muted hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Recording ATR...' : 'Submit Official ATR'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
