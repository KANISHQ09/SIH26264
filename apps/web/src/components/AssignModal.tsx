import React, { useState, useEffect } from 'react';
import { X, Send, ArrowRight, AlertCircle, Building2, User as UserIcon } from 'lucide-react';
import { api } from '../services/api';
import { Case, Bureau, User } from '../types';
import { useDemo } from '../context/DemoContext';

interface AssignModalProps {
  caseItem: Case;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignModal: React.FC<AssignModalProps> = ({
  caseItem,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useDemo();
  const [bureaus, setBureaus] = useState<Bureau[]>([]);
  const [officials, setOfficials] = useState<User[]>([]);
  const [selectedBureauId, setSelectedBureauId] = useState(caseItem.current_bureau_id);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>(caseItem.current_owner_id || '');
  const [transferReason, setTransferReason] = useState('');
  const [handoffNote, setHandoffNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedBureauId(caseItem.current_bureau_id);
      setSelectedOwnerId(caseItem.current_owner_id || '');
      setTransferReason('');
      setHandoffNote('');

      api.getBureaus().then(res => setBureaus(res.data));
      api.getDemoUsers().then(res => setOfficials(res.data));
    }
  }, [isOpen, caseItem]);

  if (!isOpen) return null;

  const filteredOfficials = officials.filter(u =>
    u.bureau_id === selectedBureauId || u.role === 'leadership' || u.role === 'admin'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBureauId) {
      showToast('Please select a target Bureau/Cell', 'error');
      return;
    }

    if (!transferReason.trim()) {
      showToast('A transfer / assignment reason is mandatory for regulatory audit compliance', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.assignCase(caseItem.id, {
        bureauId: selectedBureauId,
        ownerId: selectedOwnerId ? selectedOwnerId : null,
        transferReason,
        handoffNote
      });

      showToast(`Case ${caseItem.case_number} transferred successfully! Event logged in audit trail.`, 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to reassign case', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-navy/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-nexus-border rounded-2xl shadow-nexus-elevated w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-nexus-border flex items-center justify-between bg-nexus-bg">
          <div>
            <h3 className="font-bold text-base text-nexus-navy">Assign / Transfer Case</h3>
            <p className="text-xs text-nexus-navy-muted font-mono">{caseItem.case_number} • {caseItem.institution_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Summary */}
        <div className="px-6 py-3 bg-slate-50 border-b border-nexus-border text-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-nexus-navy-muted">
            <span className="font-semibold text-nexus-navy">Current:</span>
            <span>{caseItem.bureau_name}</span>
            <span>•</span>
            <span>{caseItem.owner_name || 'Unassigned'}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-nexus-primary" />
          <span className="text-nexus-primary font-semibold">New Assignment</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Bureau */}
          <div>
            <label className="block text-xs font-semibold text-nexus-navy mb-1">
              Receiving AICTE Bureau / Cell <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedBureauId}
              onChange={e => {
                setSelectedBureauId(e.target.value);
                setSelectedOwnerId('');
              }}
              className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border px-3 py-2.5 focus:border-nexus-primary focus:bg-white focus:outline-none"
              required
            >
              {bureaus.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* Target Officer */}
          <div>
            <label className="block text-xs font-semibold text-nexus-navy mb-1">
              Assigned Desk Handler / Officer
            </label>
            <select
              value={selectedOwnerId}
              onChange={e => setSelectedOwnerId(e.target.value)}
              className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border px-3 py-2.5 focus:border-nexus-primary focus:bg-white focus:outline-none"
            >
              <option value="">Leave Unassigned (Desk Queue)</option>
              {filteredOfficials.map(u => (
                <option key={u.id} value={u.id}>
                  {u.display_name} — {u.designation} ({u.role.replace('_', ' ')})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-nexus-navy-light mt-1">
              Official assigned to review, inspect documentation, and propose resolution.
            </p>
          </div>

          {/* Transfer Reason */}
          <div>
            <label className="block text-xs font-semibold text-nexus-navy mb-1">
              Transfer Reason <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={transferReason}
              onChange={e => setTransferReason(e.target.value)}
              placeholder="e.g. Subject-matter inspection required by Approvals Bureau"
              className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border px-3 py-2.5 focus:border-nexus-primary focus:bg-white focus:outline-none"
              required
            />
          </div>

          {/* Handoff Note */}
          <div>
            <label className="block text-xs font-semibold text-nexus-navy mb-1">
              Handoff Note / Context for Receiving Officer
            </label>
            <textarea
              rows={3}
              value={handoffNote}
              onChange={e => setHandoffNote(e.target.value)}
              placeholder="Provide specific points, document references, or inspection directives..."
              className="w-full bg-nexus-bg text-nexus-navy text-xs rounded-lg border border-nexus-border p-3 focus:border-nexus-primary focus:bg-white focus:outline-none resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-nexus-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-nexus-border text-nexus-navy-muted hover:bg-slate-50 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-nexus-primary hover:bg-nexus-primary-hover text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transferring...' : 'Confirm Assignment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
