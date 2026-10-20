import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  Briefcase,
  Activity,
  Filter,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { api } from '../services/api';
import { DashboardSummary } from '../types';
import { useDemo } from '../context/DemoContext';

interface DashboardViewProps {
  onNavigateToCases: (filter?: { dueState?: string; unassigned?: boolean; status?: string }) => void;
  onNavigateToInstitutions: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToCases,
  onNavigateToInstitutions
}) => {
  const { setActiveCaseId, refreshKey, currentUser } = useDemo();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    api.getDashboardSummary()
      .then(res => setSummary(res.data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  if (isLoading || !summary) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-nexus-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-nexus-navy-muted">Compiling consolidated bureau metrics...</p>
      </div>
    );
  }

  const { kpis, bureauWorkload, intakeTrends, recentActivity } = summary;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Welcome */}
      <div className="bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-nexus-navy">Central Coordination Console</h1>
            <span className="text-[11px] font-semibold bg-nexus-primary-subtle text-nexus-primary px-2.5 py-0.5 rounded-full border border-nexus-primary-border">
              SIH 2026 · PS 26264
            </span>
          </div>
          <p className="text-xs text-nexus-navy-muted leading-relaxed max-w-2xl">
            Real-time multi-bureau visibility across AICTE institutions. One consolidated view for approvals, academic policies, faculty welfare, student grievances, and vigilance.
          </p>
        </div>

        {/* Quick Filter Jump Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateToCases({ dueState: 'overdue' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nexus-danger-light text-nexus-danger-text border border-nexus-danger-border text-xs font-semibold hover:bg-red-100 transition shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-nexus-danger" />
            <span>Overdue ({kpis.overdueCases})</span>
          </button>
          <button
            onClick={() => onNavigateToCases({ dueState: 'due_soon' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nexus-warning-light text-nexus-warning-text border border-nexus-warning-border text-xs font-semibold hover:bg-amber-100 transition shadow-sm"
          >
            <Clock className="w-3.5 h-3.5 text-nexus-warning" />
            <span>Due Soon ({kpis.dueSoonCases})</span>
          </button>
          <button
            onClick={() => onNavigateToCases({ unassigned: true })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold hover:bg-slate-200 transition shadow-sm"
          >
            <Users className="w-3.5 h-3.5 text-slate-600" />
            <span>Unassigned ({kpis.unassignedCases})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Cases */}
        <div
          onClick={() => onNavigateToCases()}
          className="bg-white border border-nexus-border rounded-xl p-4 shadow-nexus-card hover:border-nexus-primary/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-nexus-navy-muted mb-2">
            <span>Total Intake</span>
            <FileSpreadsheet className="w-4 h-4 text-nexus-navy-light" />
          </div>
          <div className="text-2xl font-bold text-nexus-navy tabular-nums">{kpis.totalCases}</div>
          <div className="text-[11px] text-nexus-navy-light mt-1">Across 8 Institutions</div>
        </div>

        {/* Active Cases */}
        <div
          onClick={() => onNavigateToCases({ status: 'In Review' })}
          className="bg-white border border-nexus-border rounded-xl p-4 shadow-nexus-card hover:border-nexus-primary/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-nexus-navy-muted mb-2">
            <span>Active / In Review</span>
            <Activity className="w-4 h-4 text-nexus-primary" />
          </div>
          <div className="text-2xl font-bold text-nexus-primary tabular-nums">{kpis.activeCases}</div>
          <div className="text-[11px] text-nexus-navy-light mt-1">In official workflow</div>
        </div>

        {/* Overdue Cases */}
        <div
          onClick={() => onNavigateToCases({ dueState: 'overdue' })}
          className="bg-white border border-nexus-danger-border rounded-xl p-4 shadow-nexus-card hover:bg-nexus-danger-light/30 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-nexus-danger font-semibold mb-2">
            <span>SLA Overdue</span>
            <AlertTriangle className="w-4 h-4 text-nexus-danger" />
          </div>
          <div className="text-2xl font-bold text-nexus-danger tabular-nums">{kpis.overdueCases}</div>
          <div className="text-[11px] text-nexus-danger-text mt-1">Immediate action needed</div>
        </div>

        {/* Due in 48 Hours */}
        <div
          onClick={() => onNavigateToCases({ dueState: 'due_soon' })}
          className="bg-white border border-nexus-warning-border rounded-xl p-4 shadow-nexus-card hover:bg-nexus-warning-light/30 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-nexus-warning font-semibold mb-2">
            <span>Due Next 48h</span>
            <Clock className="w-4 h-4 text-nexus-warning" />
          </div>
          <div className="text-2xl font-bold text-nexus-warning tabular-nums">{kpis.dueSoonCases}</div>
          <div className="text-[11px] text-nexus-warning-text mt-1">Close to escalation</div>
        </div>

        {/* Unassigned */}
        <div
          onClick={() => onNavigateToCases({ unassigned: true })}
          className="bg-white border border-nexus-border rounded-xl p-4 shadow-nexus-card hover:border-nexus-primary/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-nexus-navy-muted mb-2">
            <span>Unassigned</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-700 tabular-nums">{kpis.unassignedCases}</div>
          <div className="text-[11px] text-nexus-navy-light mt-1">Pending officer triage</div>
        </div>

        {/* Resolved */}
        <div
          onClick={() => onNavigateToCases({ status: 'Resolved' })}
          className="bg-white border border-nexus-border rounded-xl p-4 shadow-nexus-card hover:border-nexus-success/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-nexus-success font-semibold mb-2">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-nexus-success" />
          </div>
          <div className="text-2xl font-bold text-nexus-success tabular-nums">{kpis.resolvedCases}</div>
          <div className="text-[11px] text-nexus-navy-light mt-1">Closure order issued</div>
        </div>
      </div>

      {/* Analytics & Workload Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intake vs Resolution Trends Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-nexus-navy">Monthly Intake vs Resolution Trends</h3>
              <p className="text-xs text-nexus-navy-muted">Case volume received compared with successful resolutions</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-nexus-navy-muted">
                <span className="w-2.5 h-2.5 rounded bg-nexus-primary" />
                Received
              </span>
              <span className="flex items-center gap-1.5 text-nexus-navy-muted">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                Resolved
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intakeTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2457D6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2457D6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF3" vertical={false} />
                <XAxis dataKey="month" stroke="#8392A7" fontSize={11} tickLine={false} />
                <YAxis stroke="#8392A7" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E4EAF3',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="received" stroke="#2457D6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRec)" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workload Distribution By Bureau (1 col) */}
        <div className="bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-nexus-navy">Workload by Bureau</h3>
                <p className="text-xs text-nexus-navy-muted">Active load across Cells</p>
              </div>
              <Briefcase className="w-4 h-4 text-nexus-navy-light" />
            </div>

            <div className="space-y-3.5">
              {bureauWorkload.map(b => {
                const total = b.total || 0;
                const overdue = b.overdue || 0;
                const pct = Math.min(100, Math.round((b.open / (kpis.activeCases || 1)) * 100));

                return (
                  <div key={b.bureauId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-nexus-navy truncate max-w-[180px]">{b.bureauName}</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-nexus-navy font-bold">{b.open} active</span>
                        {overdue > 0 && (
                          <span className="text-nexus-danger text-[10px] font-bold bg-red-50 px-1.5 py-0.2 rounded">
                            {overdue} overdue
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          overdue > 0 ? 'bg-amber-500' : 'bg-nexus-primary'
                        }`}
                        style={{ width: `${Math.max(10, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateToCases()}
            className="w-full mt-4 py-2 border border-nexus-border rounded-xl text-xs font-semibold text-nexus-navy hover:bg-nexus-bg flex items-center justify-center gap-1.5 transition"
          >
            <span>View All Bureau Queues</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Case Activity Panel */}
      <div className="bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-nexus-navy">Recent Multi-Bureau Activity Stream</h3>
            <p className="text-xs text-nexus-navy-muted">Real-time event feed of transfers, assignments, and status updates</p>
          </div>
          <button
            onClick={() => onNavigateToCases()}
            className="text-xs text-nexus-primary hover:underline font-semibold flex items-center gap-1"
          >
            <span>Explore All Cases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-nexus-border/60">
          {recentActivity.slice(0, 5).map((act, i) => (
            <div
              key={act.id || i}
              onClick={() => setActiveCaseId(act.case_id)}
              className="py-3 flex items-start justify-between gap-4 hover:bg-nexus-bg/50 px-2 rounded-lg cursor-pointer transition"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-nexus-primary">{act.case_number}</span>
                  <span className="text-xs font-semibold text-nexus-navy">{act.event_type.replace('_', ' ')}</span>
                  {act.to_value && (
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                      {act.to_value}
                    </span>
                  )}
                </div>
                {act.note && (
                  <p className="text-xs text-nexus-navy-muted line-clamp-1">{act.note}</p>
                )}
                <div className="text-[11px] text-nexus-navy-light flex items-center gap-2">
                  <span>By {act.actor_name}</span>
                  <span>•</span>
                  <span>{act.actor_role?.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-400 shrink-0 mt-0.5">
                {new Date(act.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
