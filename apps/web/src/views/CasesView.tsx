import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Building2,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Briefcase,
  User as UserIcon,
  Download
} from 'lucide-react';
import { api } from '../services/api';
import { Case, Bureau } from '../types';
import { useDemo } from '../context/DemoContext';

interface CasesViewProps {
  initialFilter?: {
    dueState?: string;
    unassigned?: boolean;
    status?: string;
  };
}

export const CasesView: React.FC<CasesViewProps> = ({ initialFilter }) => {
  const { setActiveCaseId, setIsNewCaseModalOpen, refreshKey, currentUser, showToast } = useDemo();
  const [cases, setCases] = useState<Case[]>([]);
  const [bureaus, setBureaus] = useState<Bureau[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(initialFilter?.status || 'all');
  const [bureauId, setBureauId] = useState('all');
  const [priority, setPriority] = useState('all');
  const [dueState, setDueState] = useState(initialFilter?.dueState || 'all');
  const [unassigned, setUnassigned] = useState(initialFilter?.unassigned || false);

  // Sorting
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  useEffect(() => {
    api.getBureaus().then(res => setBureaus(res.data));
  }, []);

  useEffect(() => {
    if (initialFilter?.dueState) setDueState(initialFilter.dueState);
    if (initialFilter?.unassigned !== undefined) setUnassigned(initialFilter.unassigned);
    if (initialFilter?.status) setStatus(initialFilter.status);
  }, [initialFilter]);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCases({
        q: search,
        status: status !== 'all' ? status : undefined,
        bureauId: bureauId !== 'all' ? bureauId : undefined,
        priority: priority !== 'all' ? priority : undefined,
        dueState: dueState !== 'all' ? dueState : undefined,
        unassigned: unassigned ? 'true' : undefined,
        sortBy,
        sortOrder,
        page,
        pageSize
      });
      setCases(res.data);
      setTotal(res.meta.total);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to load cases', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [search, status, bureauId, priority, dueState, unassigned, sortBy, sortOrder, page, refreshKey]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(o => (o === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(field);
      setSortOrder('DESC');
    }
  };

  const handleExportCsv = () => {
    window.open('/api/v1/reports/export.csv', '_blank');
    showToast('Cases exported to CSV. Event recorded in audit trail.', 'info');
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  const canCreateCase = currentUser?.role === 'leadership' ||
    currentUser?.role === 'bureau_official' ||
    currentUser?.role === 'admin';

  return (
    <div className="space-y-4 pb-12">
      {/* Top Controls Bar */}
      <div className="bg-white border border-nexus-border rounded-2xl p-4 sm:p-5 shadow-nexus-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-nexus-navy">Central Case Coordination Workspace</h1>
            <p className="text-xs text-nexus-navy-muted">
              Filter, triage, transfer, and update status across AICTE Bureaus & Cells
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-nexus-border text-xs font-semibold text-nexus-navy hover:bg-nexus-bg transition shadow-sm"
              title="Export filtered records and create audit log"
            >
              <Download className="w-3.5 h-3.5 text-nexus-navy-muted" />
              <span>Export CSV</span>
            </button>

            {canCreateCase && (
              <button
                onClick={() => setIsNewCaseModalOpen(true)}
                className="flex items-center gap-1.5 bg-nexus-primary hover:bg-nexus-primary-hover text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Case</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Multi-Filters Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-nexus-border/60">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-nexus-navy-light absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search case ID, college..."
              className="w-full bg-nexus-bg text-nexus-navy text-xs pl-8 pr-3 py-2 rounded-lg border border-nexus-border focus:border-nexus-primary focus:bg-white focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={e => { setStatus(e.target.value); setPage(1); }}
              className="w-full bg-nexus-bg text-nexus-navy text-xs px-3 py-2 rounded-lg border border-nexus-border focus:border-nexus-primary focus:bg-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="Awaiting Information">Awaiting Information</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Bureau Filter */}
          <div>
            <select
              value={bureauId}
              onChange={e => { setBureauId(e.target.value); setPage(1); }}
              className="w-full bg-nexus-bg text-nexus-navy text-xs px-3 py-2 rounded-lg border border-nexus-border focus:border-nexus-primary focus:bg-white focus:outline-none"
            >
              <option value="all">All Bureaus / Cells</option>
              {bureaus.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due State Filter */}
          <div>
            <select
              value={dueState}
              onChange={e => { setDueState(e.target.value); setPage(1); }}
              className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none font-medium ${
                dueState === 'overdue' ? 'bg-nexus-danger-light text-nexus-danger-text border-nexus-danger-border' :
                dueState === 'due_soon' ? 'bg-nexus-warning-light text-nexus-warning-text border-nexus-warning-border' :
                'bg-nexus-bg text-nexus-navy border-nexus-border'
              }`}
            >
              <option value="all">All SLA States</option>
              <option value="overdue">Overdue Only</option>
              <option value="due_soon">Due Soon (Next 48h)</option>
              <option value="on_track">On Track (&gt; 48h)</option>
              <option value="no_due_date">No Due Date</option>
            </select>
          </div>

          {/* Unassigned Checkbox & Clear */}
          <div className="flex items-center justify-between px-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-nexus-navy">
              <input
                type="checkbox"
                checked={unassigned}
                onChange={e => { setUnassigned(e.target.checked); setPage(1); }}
                className="rounded border-nexus-border text-nexus-primary focus:ring-nexus-primary"
              />
              <span>Unassigned Only</span>
            </label>

            {(status !== 'all' || bureauId !== 'all' || dueState !== 'all' || unassigned || search) && (
              <button
                onClick={() => {
                  setStatus('all');
                  setBureauId('all');
                  setPriority('all');
                  setDueState('all');
                  setUnassigned(false);
                  setSearch('');
                  setPage(1);
                }}
                className="text-[11px] text-nexus-primary hover:underline font-semibold"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-nexus-border rounded-2xl shadow-nexus-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-nexus-bg border-b border-nexus-border font-semibold text-nexus-navy-muted">
              <tr>
                <th
                  onClick={() => toggleSort('case_number')}
                  className="px-4 py-3 cursor-pointer hover:text-nexus-navy whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Case Number</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3">Institution & Location</th>
                <th className="px-4 py-3">Category & Summary</th>
                <th className="px-4 py-3">Current Bureau</th>
                <th className="px-4 py-3">Assigned Handler</th>
                <th
                  onClick={() => toggleSort('status')}
                  className="px-4 py-3 cursor-pointer hover:text-nexus-navy whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('due_at')}
                  className="px-4 py-3 cursor-pointer hover:text-nexus-navy whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>SLA Due Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexus-border bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-xs text-nexus-navy-muted">
                    <div className="w-6 h-6 border-2 border-nexus-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Fetching case records...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-xs text-nexus-navy-muted">
                    No cases match the active filter criteria.
                  </td>
                </tr>
              ) : (
                cases.map(c => {
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setActiveCaseId(c.id)}
                      className="hover:bg-nexus-bg/50 cursor-pointer transition group"
                    >
                      {/* Case Number */}
                      <td className="px-4 py-3 font-mono font-bold text-nexus-primary whitespace-nowrap">
                        <div>{c.case_number}</div>
                        {c.source_case_id && (
                          <div className="text-[10px] text-slate-400 font-normal">
                            {c.source_case_id}
                          </div>
                        )}
                      </td>

                      {/* Institution */}
                      <td className="px-4 py-3 max-w-[200px]">
                        <div className="font-semibold text-nexus-navy truncate">{c.institution_name}</div>
                        <div className="text-[11px] text-nexus-navy-light font-mono truncate">
                          {c.institution_code} • {c.institution_city}
                        </div>
                      </td>

                      {/* Category & Summary */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-semibold text-nexus-navy text-[11px]">{c.category}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            c.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                            c.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {c.priority}
                          </span>
                        </div>
                        <p className="text-nexus-navy-muted line-clamp-1 text-[11px]">{c.summary}</p>
                      </td>

                      {/* Bureau */}
                      <td className="px-4 py-3 text-nexus-navy whitespace-nowrap">
                        <div className="font-medium truncate max-w-[150px]">{c.bureau_name}</div>
                      </td>

                      {/* Assigned Handler */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {c.owner_name ? (
                          <div className="font-medium text-nexus-navy flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{c.owner_name}</span>
                          </div>
                        ) : (
                          <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          c.status === 'Resolved' || c.status === 'Closed'
                            ? 'bg-nexus-success-light text-nexus-success-text border border-nexus-success-border'
                            : c.is_overdue
                            ? 'bg-nexus-danger-light text-nexus-danger-text border border-nexus-danger-border'
                            : c.is_due_soon
                            ? 'bg-nexus-warning-light text-nexus-warning-text border border-nexus-warning-border'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {c.status}
                        </span>
                      </td>

                      {/* SLA Due Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {c.due_at ? (
                          <div className="space-y-0.5">
                            <div className="font-mono text-nexus-navy">
                              {new Date(c.due_at).toLocaleDateString()}
                            </div>
                            {c.is_overdue ? (
                              <div className="text-[10px] font-bold text-nexus-danger flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>OVERDUE</span>
                              </div>
                            ) : c.is_due_soon ? (
                              <div className="text-[10px] font-bold text-nexus-warning flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Due in &lt;48h</span>
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-400">On Track</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No Due Date</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setActiveCaseId(c.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-nexus-border text-nexus-primary hover:bg-nexus-primary hover:text-white hover:border-nexus-primary text-xs font-semibold bg-white transition shadow-sm active:scale-95"
                        >
                          <span>Workspace</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 sm:px-6 py-3 bg-nexus-bg border-t border-nexus-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-nexus-navy-muted">
          <div>
            Showing <strong className="text-nexus-navy">{cases.length}</strong> of{' '}
            <strong className="text-nexus-navy">{total}</strong> total cases
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1 rounded-lg border border-nexus-border bg-white hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-nexus-navy">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1 rounded-lg border border-nexus-border bg-white hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
