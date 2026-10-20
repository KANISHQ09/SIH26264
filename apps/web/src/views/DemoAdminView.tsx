import React, { useState } from 'react';
import {
  RotateCcw,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Info,
  Server
} from 'lucide-react';
import { api } from '../services/api';
import { useDemo } from '../context/DemoContext';

export const DemoAdminView: React.FC = () => {
  const { currentUser, users, setCurrentUser, showToast, triggerRefresh } = useDemo();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (currentUser?.role !== 'admin') {
      showToast('Only System Administrator has permission to reset demo data', 'error');
      return;
    }

    if (!window.confirm('Restore demo database to pristine seed? All transfers, updates and status changes will reset.')) {
      return;
    }

    try {
      setIsResetting(true);
      await api.resetDemoData();
      showToast('System demo data successfully restored to pristine state!', 'success');
      triggerRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to reset demo data', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const permissionsMatrix = [
    {
      capability: 'Executive KPI Dashboard & Trends',
      leadership: true,
      bureau: true,
      handler: false,
      auditor: true,
      admin: true
    },
    {
      capability: 'Search Any Institution & Cases',
      leadership: true,
      bureau: true,
      handler: true,
      auditor: true,
      admin: true
    },
    {
      capability: 'Reassign & Transfer Bureau / Handler',
      leadership: true,
      bureau: true,
      handler: false,
      auditor: false,
      admin: true
    },
    {
      capability: 'Update Status & Enter Closure Summary',
      leadership: true,
      bureau: true,
      handler: true,
      auditor: false,
      admin: true
    },
    {
      capability: 'Review AI Related-Case Candidates',
      leadership: true,
      bureau: true,
      handler: true,
      auditor: false,
      admin: true
    },
    {
      capability: 'View Immutable Audit Trail',
      leadership: true,
      bureau: false,
      handler: false,
      auditor: true,
      admin: true
    },
    {
      capability: 'Reset Demo Dataset (Deterministic Seed)',
      leadership: false,
      bureau: false,
      handler: false,
      auditor: false,
      admin: true
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-nexus-navy">Demo Environment & Administrator Controls</h1>
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full font-mono">
              v1.0.0-sih2026
            </span>
          </div>
          <p className="text-xs text-nexus-navy-muted leading-relaxed">
            Manage demo role identities, inspect backend RBAC authorization matrices, and restore deterministic evaluation state.
          </p>
        </div>

        {/* Reset Button */}
        <div>
          <button
            onClick={handleReset}
            disabled={isResetting || currentUser?.role !== 'admin'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nexus-danger hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-40"
            title={currentUser?.role !== 'admin' ? 'Switch to Admin persona to reset' : ''}
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Restoring Seed State...' : 'Reset Demo Seed Data'}</span>
          </button>
          {currentUser?.role !== 'admin' && (
            <p className="text-[10px] text-slate-400 mt-1 text-right">Requires Admin persona</p>
          )}
        </div>
      </div>

      {/* Demo Personas Grid */}
      <div className="bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card">
        <h3 className="font-bold text-sm text-nexus-navy mb-1">Configured Demo Personas</h3>
        <p className="text-xs text-nexus-navy-muted mb-4">Click any persona to immediately switch context and test role enforcement</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {users.map(u => {
            const isSelected = u.id === currentUser?.id;
            return (
              <div
                key={u.id}
                onClick={() => setCurrentUser(u)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? 'border-nexus-primary bg-nexus-primary-subtle ring-2 ring-nexus-primary/20'
                    : 'border-nexus-border hover:bg-nexus-bg'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    u.role === 'leadership' ? 'bg-purple-100 text-purple-700' :
                    u.role === 'bureau_official' ? 'bg-blue-100 text-blue-700' :
                    u.role === 'case_handler' ? 'bg-emerald-100 text-emerald-700' :
                    u.role === 'auditor' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {u.role.replace('_', ' ')}
                  </span>
                  {isSelected && (
                    <span className="text-[11px] font-bold text-nexus-primary flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <div className="font-bold text-sm text-nexus-navy">{u.display_name}</div>
                <div className="text-xs text-nexus-navy-muted mb-1">{u.designation}</div>
                <div className="text-[11px] text-slate-400 font-mono truncate">{u.demo_email}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RBAC Matrix */}
      <div className="bg-white border border-nexus-border rounded-2xl p-4 sm:p-6 shadow-nexus-card">
        <h3 className="font-bold text-sm text-nexus-navy mb-1">Role-Based Access Control (RBAC) Specification</h3>
        <p className="text-xs text-nexus-navy-muted mb-4">
          Restrictions are verified and enforced by the Express backend API on every mutation request (HTTP 403 Forbidden).
        </p>

        <div className="border border-nexus-border rounded-xl overflow-x-auto shadow-nexus-card">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-nexus-bg border-b border-nexus-border font-semibold text-nexus-navy-muted">
              <tr>
                <th className="px-4 py-3">Operation / Capability</th>
                <th className="px-3 py-3 text-center">Leadership</th>
                <th className="px-3 py-3 text-center">Bureau Head</th>
                <th className="px-3 py-3 text-center">Desk Officer</th>
                <th className="px-3 py-3 text-center">Auditor</th>
                <th className="px-3 py-3 text-center">System Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexus-border bg-white">
              {permissionsMatrix.map(row => (
                <tr key={row.capability} className="hover:bg-nexus-bg/50 transition">
                  <td className="px-4 py-3 font-medium text-nexus-navy">{row.capability}</td>
                  <td className="px-3 py-3 text-center">
                    {row.leadership ? <CheckCircle2 className="w-4 h-4 text-nexus-success mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {row.bureau ? <CheckCircle2 className="w-4 h-4 text-nexus-success mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {row.handler ? <CheckCircle2 className="w-4 h-4 text-nexus-success mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {row.auditor ? <CheckCircle2 className="w-4 h-4 text-nexus-success mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {row.admin ? <CheckCircle2 className="w-4 h-4 text-nexus-success mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
