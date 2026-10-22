import React from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  UserCheck,
  Briefcase,
  GraduationCap,
  Scale,
  Settings,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { DemoRole } from '../types';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: DemoRole) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSelectRole
}) => {
  const { users } = useDemo();

  if (!isOpen) return null;

  const personas = [
    {
      role: 'leadership' as DemoRole,
      title: 'Executive Leadership',
      name: 'Dr. Anil Sahasrabudhe',
      designation: 'Chairman / Member Secretary',
      icon: Scale,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      description: 'System-wide KPI oversight, national overdue heatmap, inter-bureau escalation authority.'
    },
    {
      role: 'bureau_official' as DemoRole,
      title: 'Regulation Bureau (RB) Head',
      name: 'Dr. M. S. Manna',
      designation: 'Director, Regulation Bureau',
      icon: Briefcase,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      description: 'Regulatory case queue, statutory compliance triage, show-cause dispatch & hearing management.'
    },
    {
      role: 'bureau_official' as DemoRole,
      title: 'PGRC Bureau Incharge',
      name: 'Prof. Rajive Kumar',
      designation: 'Incharge, Public Grievance Redressal Cell',
      icon: UserCheck,
      color: 'bg-sky-50 border-sky-200 text-sky-700',
      description: 'Student & faculty grievance queues, fee refund inquiries, overlap resolution with Regulation Bureau.'
    },
    {
      role: 'case_handler' as DemoRole,
      title: 'Senior Desk Officer',
      name: 'Er. Neha Sharma',
      designation: 'Senior Technical Officer (RB)',
      icon: Briefcase,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      description: 'Active case investigation workspace, evidence scrutiny, transfer handshakes & closure drafting.'
    },
    {
      role: 'auditor' as DemoRole,
      title: 'Vigilance & Compliance Auditor',
      name: 'Sunil Verma',
      designation: 'Vigilance & Compliance Officer',
      icon: ShieldCheck,
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      description: 'Read-only tamper-evident audit trail, SLA breach forensics, verification of transfer logs.'
    },
    {
      role: 'admin' as DemoRole,
      title: 'System Administrator',
      name: 'Amit Patel',
      designation: 'System Administrator',
      icon: Settings,
      color: 'bg-slate-50 border-slate-300 text-slate-700',
      description: 'SLA rule parameters, escalation timeouts, category routing, and 1-click pristine seed reset.'
    },
    {
      role: 'student' as DemoRole,
      title: 'Student / Complainant',
      name: 'Aarav Sharma',
      designation: '3rd Year B.Tech Student (Complainant)',
      icon: GraduationCap,
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      description: 'File complaints against colleges, track milestone progression, inspect transparent SLA timers.'
    },
    {
      role: 'institution' as DemoRole,
      title: 'Institution Representative',
      name: 'Dr. Meenakshi Sundaram',
      designation: 'Principal & Registrar, RGPV Demo Institute',
      icon: Building2,
      color: 'bg-teal-50 border-teal-200 text-teal-700',
      description: 'Institutional Compliance Health Scorecard, show-cause inbox, Action Taken Report (ATR) desk.'
    }
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-nexus-navy/50 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white border border-nexus-border rounded-2xl shadow-nexus-elevated w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 cursor-default"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-nexus-border flex items-center justify-between bg-nexus-bg shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-nexus-primary/10 text-nexus-primary px-2 py-0.5 rounded">
                SIH 2026 PS 26264
              </span>
              <span className="text-xs text-slate-500 font-mono">• 8 Verified Demo Personas</span>
            </div>
            <h3 className="text-base font-bold text-nexus-navy mt-0.5">
              Select Governance Persona / Sign In
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Track 1: AICTE Internal Operations */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-nexus-primary" />
                <span>Track 1: AICTE Internal Operations Consoles (6 Roles)</span>
              </span>
              <span className="text-[11px] text-slate-400">Deterministic Permissions & Role-Gated Views</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {personas.slice(0, 6).map((p, idx) => {
                const Icon = p.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectRole(p.role);
                      onClose();
                    }}
                    className="text-left p-3.5 rounded-xl border border-nexus-border hover:border-nexus-primary hover:shadow-nexus-card transition group bg-white flex items-start gap-3"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${p.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-nexus-navy group-hover:text-nexus-primary transition truncate">
                          {p.title}
                        </h4>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-nexus-primary group-hover:translate-x-0.5 transition shrink-0" />
                      </div>
                      <div className="text-[11px] text-nexus-navy font-semibold mt-0.5">{p.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{p.designation}</div>
                      <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Track 2: External Stakeholders & Complainants */}
          <div>
            <div className="flex items-center justify-between mb-3 border-t border-nexus-border pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Track 2: External Stakeholder & Complainant Portals (2 Roles)</span>
              </span>
              <span className="text-[11px] text-slate-400">Citizen Transparency & Compliance ATR Desk</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {personas.slice(6, 8).map((p, idx) => {
                const Icon = p.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectRole(p.role);
                      onClose();
                    }}
                    className="text-left p-3.5 rounded-xl border border-nexus-border hover:border-emerald-500 hover:shadow-nexus-card transition group bg-white flex items-start gap-3"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${p.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-nexus-navy group-hover:text-emerald-700 transition truncate">
                          {p.title}
                        </h4>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition shrink-0" />
                      </div>
                      <div className="text-[11px] text-nexus-navy font-semibold mt-0.5">{p.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{p.designation}</div>
                      <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-nexus-border bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Passwordless Instant Access for Evaluator Pitch</span>
          <span className="font-mono text-[11px]">DEMO ENVIRONMENT — SAMPLE DATA ONLY</span>
        </div>
      </div>
    </div>
  );
};
