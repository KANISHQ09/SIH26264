import React, { useState, useEffect } from 'react';
import { X, Target, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { Case } from '../types';
import { useDemo } from '../context/DemoContext';

interface NextActionModalProps {
  caseItem: Case;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NextActionModal: React.FC<NextActionModalProps> = ({
  caseItem,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useDemo();
  const [nextAction, setNextAction] = useState(caseItem.next_action || '');
  const [nextActionDue, setNextActionDue] = useState(
    caseItem.next_action_due ? caseItem.next_action_due.slice(0, 10) : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNextAction(caseItem.next_action || '');
      setNextActionDue(caseItem.next_action_due ? caseItem.next_action_due.slice(0, 10) : '');
    }
  }, [isOpen, caseItem]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nextAction.trim()) {
      showToast('Next action description cannot be empty', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.updateCaseNextAction(caseItem.id, {
        nextAction,
        nextActionDue: nextActionDue ? new Date(nextActionDue).toISOString() : null
      });

      showToast('Next action updated successfully!', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to update next action', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-navy/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-nexus-border rounded-2xl shadow-nexus-elevated w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-nexus-border flex items-center justify-between bg-nexus-bg">
          <div>
            <h3 className="font-bold text-base text-nexus-navy">Set Next Operational Action</h3>
            <p className="text-xs text-nexus-navy-muted font-mono">{caseItem.case_number}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-nexus-navy mb-1">
              Required Next Action <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={nextAction}
              onChange={e => setNextAction(e.target.value)}
              placeholder="e.g. Schedule virtual inspection committee hearing with institute principal..."
              className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border p-3 focus:border-nexus-primary focus:bg-white focus:outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-nexus-navy mb-1">
              Target Milestone Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={nextActionDue}
                onChange={e => setNextActionDue(e.target.value)}
                className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border px-3 py-2.5 focus:border-nexus-primary focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-nexus-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-nexus-border text-nexus-navy-muted hover:bg-slate-50 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-nexus-primary hover:bg-nexus-primary-hover text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <Target className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Save Next Action'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
