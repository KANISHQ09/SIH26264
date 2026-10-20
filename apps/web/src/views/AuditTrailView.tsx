import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileCode,
  Clock,
  User as UserIcon
} from 'lucide-react';
import { api } from '../services/api';
import { AuditEvent } from '../types';
import { useDemo } from '../context/DemoContext';

export const AuditTrailView: React.FC = () => {
  const { refreshKey, showToast } = useDemo();
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [search, setSearch] = useState('');
  const [targetType, setTargetType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getAuditEvents(100)
      .then(res => setEvents(res.data))
      .catch(err => {
        console.error(err);
        showToast(err.message || 'Failed to fetch audit log', 'error');
      })
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  const filteredEvents = events.filter(e => {
    const matchesSearch = !search ||
      e.actor_name.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      (e.target_id && e.target_id.toLowerCase().includes(search.toLowerCase()));

    const matchesType = targetType === 'all' || e.target_type === targetType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-nexus-navy">Immutable Regulatory Audit Trail</h1>
            <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Compliance & Vigilance Log
            </span>
          </div>
          <p className="text-xs text-nexus-navy-muted leading-relaxed">
            Append-only security log recording every case transfer, status transition, related-case decision, export, and administrative action.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-nexus-navy-light absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search actor, case ID..."
              className="bg-nexus-bg text-nexus-navy text-xs pl-8 pr-3 py-2 rounded-lg border border-nexus-border focus:border-nexus-primary focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={targetType}
            onChange={e => setTargetType(e.target.value)}
            className="bg-nexus-bg text-nexus-navy text-xs px-3 py-2 rounded-lg border border-nexus-border focus:border-nexus-primary focus:bg-white focus:outline-none"
          >
            <option value="all">All Targets</option>
            <option value="case">Cases</option>
            <option value="report">Reports / Exports</option>
            <option value="demo">System & Demo</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-nexus-border rounded-2xl shadow-nexus-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nexus-bg border-b border-nexus-border font-semibold text-nexus-navy-muted">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor & Role</th>
                <th className="px-4 py-3">Action Executed</th>
                <th className="px-4 py-3">Target Resource</th>
                <th className="px-4 py-3">Outcome</th>
                <th className="px-4 py-3">Audit Details / Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexus-border bg-white font-mono text-[11px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-nexus-navy-muted font-sans">
                    <div className="w-6 h-6 border-2 border-nexus-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-nexus-navy-muted font-sans">
                    No audit records match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map(evt => (
                  <tr key={evt.id} className="hover:bg-nexus-bg/50 transition">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(evt.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-sans">
                      <div className="font-semibold text-nexus-navy">{evt.actor_name}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{evt.role.replace('_', ' ')}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-nexus-navy">
                      {evt.action}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-nexus-primary">
                      {evt.target_id || evt.target_type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        evt.result === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                        evt.result === 'DENIED' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {evt.result === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{evt.result}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs text-slate-600 truncate">
                      {evt.metadata || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
