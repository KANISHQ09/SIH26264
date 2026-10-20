import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PieChart as PieIcon,
  Briefcase
} from 'lucide-react';
import { api } from '../services/api';
import { useDemo } from '../context/DemoContext';

export const ReportsView: React.FC = () => {
  const { showToast, currentUser } = useDemo();
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getReportsSummary()
      .then(res => setReportData(res.data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleExportCsv = () => {
    window.open('/api/v1/reports/export.csv', '_blank');
    showToast('Filtered records exported as CSV. Regulatory audit entry created.', 'success');
  };

  if (isLoading || !reportData) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-nexus-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-nexus-navy-muted">Compiling statistical reports...</p>
      </div>
    );
  }

  const { ageBuckets, bureauPerformance, priorityBreakdown } = reportData;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-nexus-navy">Reports & SLA Compliance Analytics</h1>
            <span className="text-[11px] font-semibold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
              Leadership & Auditor Scope
            </span>
          </div>
          <p className="text-xs text-nexus-navy-muted leading-relaxed">
            Statutory turnaround analysis, grievance aging brackets, and Bureau SLA performance compliance.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nexus-primary hover:bg-nexus-primary-hover text-white text-xs font-semibold shadow-sm transition active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          <span>Export Compliance CSV</span>
        </button>
      </div>

      {/* Case Aging Brackets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ageBuckets.map((b: any) => (
          <div key={b.bucket} className="bg-white border border-nexus-border rounded-xl p-4 shadow-nexus-card">
            <div className="flex items-center justify-between text-xs text-nexus-navy-muted mb-2">
              <span className="font-semibold">{b.bucket}</span>
              <Clock className="w-4 h-4 text-nexus-navy-light" />
            </div>
            <div className="text-2xl font-bold text-nexus-navy tabular-nums">{b.count} cases</div>
            <p className="text-[11px] text-nexus-navy-light mt-1">Pending resolution</p>
          </div>
        ))}
      </div>

      {/* Bureau Performance Table */}
      <div className="bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-nexus-navy">Bureau Performance & Turnaround</h3>
            <p className="text-xs text-nexus-navy-muted">Aggregated throughput and SLA breaches per regulatory division</p>
          </div>
          <Briefcase className="w-4 h-4 text-nexus-navy-light" />
        </div>

        <div className="border border-nexus-border rounded-xl overflow-hidden shadow-nexus-card">
          <table className="w-full text-left text-xs">
            <thead className="bg-nexus-bg border-b border-nexus-border font-semibold text-nexus-navy-muted">
              <tr>
                <th className="px-4 py-3">Bureau / Cell</th>
                <th className="px-4 py-3">Total Assigned</th>
                <th className="px-4 py-3">Successfully Resolved</th>
                <th className="px-4 py-3">SLA Overdue</th>
                <th className="px-4 py-3">Compliance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexus-border bg-white">
              {bureauPerformance.map((bp: any) => {
                const total = bp.total_assigned || 0;
                const overdue = bp.overdue_count || 0;
                const resolved = bp.resolved_count || 0;
                const compliancePct = total > 0 ? Math.round(((total - overdue) / total) * 100) : 100;

                return (
                  <tr key={bp.bureau_name} className="hover:bg-nexus-bg/50 transition">
                    <td className="px-4 py-3 font-semibold text-nexus-navy">{bp.bureau_name}</td>
                    <td className="px-4 py-3 tabular-nums font-medium">{total}</td>
                    <td className="px-4 py-3 tabular-nums text-nexus-success font-semibold">{resolved}</td>
                    <td className="px-4 py-3 tabular-nums font-semibold">
                      {overdue > 0 ? (
                        <span className="text-nexus-danger bg-red-50 px-2 py-0.5 rounded font-mono">
                          {overdue}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              compliancePct >= 80 ? 'bg-nexus-success' : 'bg-amber-500'
                            }`}
                            style={{ width: `${compliancePct}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold">{compliancePct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
