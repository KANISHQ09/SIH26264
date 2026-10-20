import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { Case, CaseStatus } from '../types';
import { useDemo } from '../context/DemoContext';

interface StatusModalProps {
  caseItem: Case;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  caseItem,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useDemo();
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus>(caseItem.status);
  const [note, setNote] = useState('');
  const [closureSummary, setClosureSummary] = useState(caseItem.closure_summary || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(caseItem.status);
      setNote('');
      setClosureSummary(caseItem.closure_summary || '');
    }
  }, [isOpen, caseItem]);

  if (!isOpen) return null;

  const statusOptions: CaseStatus[] = [
    'Open',
    'In Review',
    'Awaiting Information',
    'Resolved',
    'Closed'
  ];

  const isTerminal = selectedStatus === 'Resolved' || selectedStatus === 'Closed';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTerminal && !closureSummary.trim()) {
      showToast('A closure summary is mandatory when marking a case Resolved or Closed', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.updateCaseStatus(caseItem.id, {
        status: selectedStatus,
        note,
        closureSummary: isTerminal ? closureSummary : undefined
      });

      showToast(`Status updated to ${selectedStatus}. Event appended to timeline.`, 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to update case status', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-nexus-navy/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-nexus-border rounded-2xl shadow-nexus-elevated w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-nexus-border flex items-center justify-between bg-nexus-bg">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-nexus-navy">Update Case Status</h3>
            <p className="text-xs text-nexus-navy-muted font-mono">{caseItem.case_number}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-nexus-navy mb-1.5">
              Select New Case Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {statusOptions.map(st => (
                <label
                  key={st}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border cursor-pointer text-xs transition ${
                    selectedStatus === st
                      ? 'border-nexus-primary bg-nexus-primary-subtle text-nexus-navy font-semibold ring-1 ring-nexus-primary'
                      : 'border-nexus-border hover:bg-slate-50 text-nexus-navy-muted'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="status"
                      checked={selectedStatus === st}
                      onChange={() => setSelectedStatus(st)}
                      className="text-nexus-primary focus:ring-nexus-primary"
                    />
                    <span>{st}</span>
                  </div>
                  {st === caseItem.status && (
                    <span className="text-[10px] text-slate-400 font-normal">Current</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {isTerminal && (
            <div className="p-3 bg-nexus-warning-light/50 border border-nexus-warning-border rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-nexus-warning-text">
                <AlertTriangle className="w-4 h-4 text-nexus-warning shrink-0" />
                <span>Statutory Closure Summary Required</span>
              </div>
              <textarea
                rows={3}
                value={closureSummary}
                onChange={e => setClosureSummary(e.target.value)}
                placeholder="Detail the official resolution, refund transaction, or Council order issued..."
                className="w-full bg-white text-nexus-navy text-xs rounded-lg border border-nexus-border p-2.5 focus:border-nexus-primary focus:outline-none resize-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-nexus-navy mb-1">
              Transition Note / Explanation
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Reason for state transition or progress milestone..."
              className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border px-3 py-2.5 focus:border-nexus-primary focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 border-t border-nexus-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 sm:py-2 rounded-lg border border-nexus-border text-nexus-navy-muted hover:bg-slate-50 text-xs font-semibold transition text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 rounded-lg bg-nexus-primary hover:bg-nexus-primary-hover text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Updating...' : 'Update Status'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
