import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  Search,
  Building2,
  Clock,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Users,
  Send,
  Sparkles,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Layers,
  FileCheck,
  Check,
  X,
  Sliders,
  Activity,
  FileText,
  RefreshCw,
  Zap,
  Lock,
  FileBadge,
  Play,
  Share2,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { DemoRole } from '../types';
import { api } from '../services/api';

interface LandingPageViewProps {
  onEnterPortal: (role?: DemoRole, targetTab?: string) => void;
  onOpenSignIn: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterPortal,
  onOpenSignIn
}) => {
  const { switchRole } = useDemo();

  // Public Case Tracker State
  const [trackerQuery, setTrackerQuery] = useState('');
  const [trackedCase, setTrackedCase] = useState<any>(null);
  const [isSearchingTracker, setIsSearchingTracker] = useState(false);
  const [trackerError, setTrackerError] = useState('');

  // Interactive Product Showcase State (Stripe-Style Tabbed Engine)
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'overlap' | 'sla' | 'risk' | 'transfer'>('overlap');

  // Tab 1: Overlap Simulator
  const [overlapSimulated, setOverlapSimulated] = useState(true);

  // Tab 2: SLA Escalation Simulator
  const [slaState, setSlaState] = useState<'normal' | 'duesoon' | 'breached'>('duesoon');

  // Tab 3: Compliance Risk Score Calculator Simulator
  const [calcOverdue, setCalcOverdue] = useState<number>(1);
  const [calcRbCases, setCalcRbCases] = useState<number>(2);
  const [calcPgrcCases, setCalcPgrcCases] = useState<number>(2);

  // Computed Risk Score
  const calculatedScore = Math.max(10, 100 - (calcOverdue * 15) - (calcRbCases * 10) - (calcPgrcCases * 5));
  const calculatedRiskTier =
    calculatedScore >= 85 ? { label: 'Low Risk', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' } :
    calculatedScore >= 60 ? { label: 'Moderate Risk', color: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' } :
    { label: 'High Risk · Scrutiny Flagged', color: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-500' };

  // Tab 4: Handshake & Audit Ledger Simulator
  const [transferTargetBureau, setTransferTargetBureau] = useState('Approval Bureau (AB)');
  const [transferReason, setTransferReason] = useState('Re-inspection required under AICTE Approval Process Handbook (APH 2026-27 Clause 7.3)');
  const [transferHandshakeExecuted, setTransferHandshakeExecuted] = useState(false);
  const [handshakeHash, setHandshakeHash] = useState('0x8f2a...c4b1');

  // Persona Grid Filter
  const [personaFilter, setPersonaFilter] = useState<'all' | 'aicte' | 'stakeholder'>('all');

  const handleTrackCase = async (e?: React.FormEvent, presetQuery?: string) => {
    if (e) e.preventDefault();
    const query = presetQuery || trackerQuery;
    if (!query.trim()) return;

    setIsSearchingTracker(true);
    setTrackerError('');
    setTrackedCase(null);

    try {
      const res = await api.getCases({ q: query.trim(), pageSize: 1 });
      if (res.data && res.data.length > 0) {
        setTrackedCase(res.data[0]);
      } else {
        setTrackerError(`No records found matching "${query}". Try searching CASE-2026-0101 or CASE-2026-0104.`);
      }
    } catch {
      setTrackerError('Failed to query public case registry.');
    } finally {
      setIsSearchingTracker(false);
    }
  };

  const handleSelectQuickTag = (tag: string) => {
    setTrackerQuery(tag);
    handleTrackCase(undefined, tag);
  };

  const handleExecuteHandshake = () => {
    setTransferHandshakeExecuted(true);
    const mockHash = '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setHandshakeHash(mockHash);
  };

  const personas = [
    {
      id: 'leadership' as DemoRole,
      name: 'Dr. Anil Sahasrabudhe',
      title: 'Chairman / Member Secretary',
      category: 'aicte',
      badge: 'National Governance',
      desc: '360° pan-India visibility, cross-bureau overlap telemetry, and high-level policy enforcement.',
      capabilities: ['National Overlap Intelligence', 'Systemic Bottlenecks', 'Escalation Oversight'],
      color: 'border-blue-200 hover:border-blue-500'
    },
    {
      id: 'bureau_official' as DemoRole,
      name: 'Dr. M. S. Manna',
      title: 'Regulation Bureau (RB) Head',
      category: 'aicte',
      badge: 'Regulatory Directorate',
      desc: 'Statutory compliance, unapproved course expansion inquiries, and Level 2 SLA approvals.',
      capabilities: ['Regulatory Queue Management', 'SLA Level 2 Reviews', 'Norms Verification'],
      color: 'border-indigo-200 hover:border-indigo-500'
    },
    {
      id: 'bureau_official' as DemoRole,
      name: 'Prof. Rajive Kumar',
      title: 'PGRC Bureau Incharge',
      category: 'aicte',
      badge: 'Grievance Directorate',
      desc: 'Student rights, fee refund mandates, and anti-harassment cell coordination.',
      capabilities: ['Grievance Fast-Tracking', 'Inter-Bureau Handshakes', 'SLA Enforcements'],
      color: 'border-sky-200 hover:border-sky-500'
    },
    {
      id: 'case_handler' as DemoRole,
      name: 'Er. Neha Sharma',
      title: 'Senior Desk Officer',
      category: 'aicte',
      badge: 'Field Operations',
      desc: 'Active case investigations, ATR verification, evidence appraisal, and transfer requests.',
      capabilities: ['Daily Investigation Queue', 'ATR Document Review', 'Mandatory Handshakes'],
      color: 'border-cyan-200 hover:border-cyan-500'
    },
    {
      id: 'auditor' as DemoRole,
      name: 'Sunil Verma',
      title: 'Vigilance & Compliance Auditor',
      category: 'aicte',
      badge: 'Legal & Ethics',
      desc: 'High-risk institutional reviews, severe regulatory breach inquiries, and court compliance.',
      capabilities: ['Strict Scrutiny Flagging', 'Legal Interventions', 'Confidential Audits'],
      color: 'border-purple-200 hover:border-purple-500'
    },
    {
      id: 'institution' as DemoRole,
      name: 'Dr. Meenakshi Sundaram',
      title: 'Institutional Liaison (Registrar)',
      category: 'stakeholder',
      badge: 'College Portal',
      desc: 'RGPV Institute Compliance Desk: submit formal Action Taken Reports (ATRs) and review dossier.',
      capabilities: ['Institutional Dossier Access', 'ATR Submission Desk', 'Notice Responses'],
      color: 'border-amber-200 hover:border-amber-500'
    },
    {
      id: 'student' as DemoRole,
      name: 'Aarav Sharma (Final Year B.Tech)',
      title: 'Student Complainant',
      category: 'stakeholder',
      badge: 'Citizen Access',
      desc: 'Public Grievance Portal: file structured complaints and track real-time milestone stepper.',
      capabilities: ['Grievance Filing Wizard', 'Live Milestone Stepper', 'Resolution Acknowledgement'],
      color: 'border-emerald-200 hover:border-emerald-500'
    },
    {
      id: 'admin' as DemoRole,
      name: 'Amit Patel',
      title: 'System Administrator',
      category: 'stakeholder',
      badge: 'System Admin',
      desc: 'SLA rule parameters, escalation timeouts, category routing, and 1-click pristine seed reset.',
      capabilities: ['SLA Rule Configuration', 'Bureaus & Routing Admin', 'Pristine Database Reset'],
      color: 'border-slate-300 hover:border-slate-600'
    }
  ];

  const filteredPersonas = personas.filter(p => {
    if (personaFilter === 'aicte') return p.category === 'aicte';
    if (personaFilter === 'stakeholder') return p.category === 'stakeholder';
    return true;
  });

  const comparisonRows = [
    {
      feature: '1. Complaint Routing',
      existing: 'Manual departmental sorting, physical forwarding, and disconnected bureau queues.',
      proposed: 'Configurable category- and priority-based routing to Regulation Bureau & PGRC.'
    },
    {
      feature: '2. SLA Monitoring',
      existing: 'Passive intake timestamping; capabilities vary widely by individual cell portal.',
      proposed: 'Deterministic live countdown timer with automated breach alert (< 48 hrs / Overdue).'
    },
    {
      feature: '3. Escalation Ladder',
      existing: 'Depends on ad-hoc manual follow-ups without automated system intervention.',
      proposed: 'Automated multi-tier escalation hierarchy: Desk Officer ➔ Bureau Head ➔ Member Secretary.'
    },
    {
      feature: '4. Centralized Visibility',
      existing: 'Fragmented silos: approval records detached from student grievances & vigilance inquiries.',
      proposed: 'Consolidated Institution OneView: single 360° dossier across all AICTE Bureaus.'
    },
    {
      feature: '5. Overlap Detection',
      existing: 'No mechanism to detect when RB and PGRC concurrently investigate the same college.',
      proposed: 'Mandatory warning: "Potential Overlapping Cases – Coordination Required" with link review.'
    },
    {
      feature: '6. Accountability & Handshakes',
      existing: 'Informal forwarding between offices; loss of ownership during case transfer.',
      proposed: 'Mandatory transfer justification, receiving officer selection, and immutable audit logging.'
    },
    {
      feature: '7. Decision Support',
      existing: 'Focused on individual complaint disposal without broader institutional health scoring.',
      proposed: 'Explainable Institutional Risk Scorecard, bottleneck heatmaps, and ageing analytics.'
    },
    {
      feature: '8. Technology Architecture',
      existing: 'Legacy disparate systems with varying database schemas and no unified API.',
      proposed: 'High-performance React 18, TypeScript, Node.js, Express, and PostgreSQL/SQLite stack.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-nexus-navy flex flex-col font-sans selection:bg-nexus-primary selection:text-white">
      {/* =========================================================================
          STRIPE-INSPIRED ANGLED AURORA GRADIENT CANVAS
          ========================================================================= */}
      <div className="relative overflow-hidden bg-slate-900 text-white pb-32 pt-2">
        {/* Angled background skew */}
        <div
          className="absolute -top-40 -left-40 -right-40 h-[720px] pointer-events-none transform -skew-y-6 origin-top-left overflow-hidden z-0"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 35%, #0284c7 70%, #0d9488 100%)'
          }}
        >
          {/* Layered glowing blurs mimicking Stripe's vivid color orbs */}
          <div className="absolute top-10 left-1/4 w-[600px] h-[400px] bg-gradient-to-tr from-fuchsia-600/30 via-indigo-500/40 to-blue-400/40 rounded-full blur-3xl transform rotate-12" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-cyan-400/30 via-sky-500/30 to-amber-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[300px] bg-blue-600/20 blur-3xl rounded-full" />
        </div>

        {/* Floating Top Navigation */}
        <header className="relative z-20 border-b border-white/10 bg-slate-900/60 backdrop-blur-md sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white">AICTE OneView</span>
                  <span className="text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    PS 26264
                  </span>
                </div>
                <span className="text-[10px] text-slate-300 hidden sm:block">
                  Regulation Bureau & PGRC Inter-Directorate Engine
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-200">
              <a href="#interactive-showcase" className="hover:text-cyan-300 transition flex items-center gap-1">
                <span>Interactive Engine</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </a>
              <a href="#personas" className="hover:text-cyan-300 transition">8 Personas</a>
              <a href="#differentiators" className="hover:text-cyan-300 transition">Differentiators</a>
              <a href="#comparison" className="hover:text-cyan-300 transition">Architecture Matrix</a>
              <a href="#tracker" className="hover:text-cyan-300 transition">Public Tracker</a>
            </nav>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenSignIn}
                className="text-xs font-semibold text-slate-200 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/10 transition border border-white/10"
              >
                Sign In
              </button>
              <button
                onClick={() => onEnterPortal('leadership')}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md shadow-blue-500/25 transition group hover:shadow-lg"
              >
                <span>Launch Portal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>
        </header>

        {/* HERO CONTENT */}
        <section className="relative z-10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Stripe-style Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-slate-200 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-300 font-mono">SIH 2026 · PS 26264</span>
              <span className="text-white/40">•</span>
              <span className="text-white">Smart Automation for All Bureaus</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Consolidated Intelligence for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-200">
                AICTE Governance
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto font-normal">
              Eliminate inter-bureau blindspots. Detect simultaneous inquiries, enforce strict SLA countdowns, and maintain an immutable audit trail across <strong>Regulation Bureau (RB)</strong> and <strong>PGRC</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => onEnterPortal('leadership')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition group"
              >
                <span>Launch Operations Console</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
              <a
                href="#interactive-showcase"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md text-sm font-semibold px-5 py-3.5 rounded-xl shadow-sm transition"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Test Interactive Features</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
              <div className="bg-white/10 border border-white/15 rounded-xl p-3 backdrop-blur-md">
                <div className="text-2xl font-black text-cyan-300">8 Personas</div>
                <div className="text-[11px] text-slate-300 font-medium">From Student to Chairman</div>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-xl p-3 backdrop-blur-md">
                <div className="text-2xl font-black text-emerald-300">0 Overlaps</div>
                <div className="text-[11px] text-slate-300 font-medium">Unflagged Collisions</div>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-xl p-3 backdrop-blur-md">
                <div className="text-2xl font-black text-amber-300">&lt; 48 hrs</div>
                <div className="text-[11px] text-slate-300 font-medium">Automated Level 2 Breach Alert</div>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-xl p-3 backdrop-blur-md">
                <div className="text-2xl font-black text-blue-300">100% Audit</div>
                <div className="text-[11px] text-slate-300 font-medium">Immutable Handshake Ledger</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          STRIPE-GRADE INTERACTIVE PRODUCT SHOWCASE (LIVE SIMULATOR)
          ========================================================================= */}
      <section id="interactive-showcase" className="relative z-20 -mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-20">
        <div className="bg-white rounded-3xl border border-nexus-border shadow-2xl shadow-blue-900/10 overflow-hidden">
          {/* Showcase Navigation Bar */}
          <div className="bg-slate-50 border-b border-nexus-border px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs font-semibold text-slate-500 ml-2">
                aicte-oneview-engine://interactive-simulator
              </span>
            </div>

            {/* 4 Interactive Feature Selector Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveShowcaseTab('overlap')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeShowcaseTab === 'overlap'
                    ? 'bg-white text-nexus-navy shadow-sm'
                    : 'text-slate-600 hover:text-nexus-navy'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>1. Overlap Detection</span>
              </button>
              <button
                onClick={() => setActiveShowcaseTab('sla')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeShowcaseTab === 'sla'
                    ? 'bg-white text-nexus-navy shadow-sm'
                    : 'text-slate-600 hover:text-nexus-navy'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>2. SLA Escalation</span>
              </button>
              <button
                onClick={() => setActiveShowcaseTab('risk')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeShowcaseTab === 'risk'
                    ? 'bg-white text-nexus-navy shadow-sm'
                    : 'text-slate-600 hover:text-nexus-navy'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                <span>3. Compliance Score</span>
              </button>
              <button
                onClick={() => setActiveShowcaseTab('transfer')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeShowcaseTab === 'transfer'
                    ? 'bg-white text-nexus-navy shadow-sm'
                    : 'text-slate-600 hover:text-nexus-navy'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>4. Transfer Handshake</span>
              </button>
            </div>
          </div>

          {/* TAB 1: OVERLAP DETECTION SIMULATOR */}
          {activeShowcaseTab === 'overlap' && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Problem Statement 26264 Core Mandate
                    </span>
                    <span className="text-xs font-mono text-slate-500">Target: RGPV Institute (ID: 1-3321458291)</span>
                  </div>
                  <h3 className="text-lg font-bold text-nexus-navy mt-1">
                    Multi-Bureau Concurrent Investigation Detector
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Toggle concurrent inquiries between Regulation Bureau (RB) and PGRC to test automated collision flagging.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-slate-700">Simulate Concurrency:</span>
                  <button
                    onClick={() => setOverlapSimulated(!overlapSimulated)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      overlapSimulated ? 'bg-amber-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        overlapSimulated ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Overlap Result Display */}
              {overlapSimulated ? (
                <div className="space-y-4">
                  {/* The mandated banner */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 border-l-4 border-l-amber-600 p-4 rounded-xl shadow-xs">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-extrabold text-amber-950 text-sm">
                            ⚠️ Potential Overlapping Cases – Coordination Required
                          </span>
                          <span className="bg-amber-200/80 text-amber-900 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                            2 Active Bureaus Colliding
                          </span>
                        </div>
                        <p className="text-amber-900/90 mt-1.5 leading-relaxed">
                          AICTE OneView automatically detected concurrent open complaints filed against this institution across <strong>Regulation Bureau (RB)</strong> and <strong>Public Grievance Redressal Cell (PGRC)</strong>. Independent conflicting directives are locked until cross-bureau coordination is certified.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2 Colliding Cases Mock Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-blue-900">CASE-2026-0101</span>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Regulation Bureau (RB)
                        </span>
                      </div>
                      <div className="text-xs font-bold text-nexus-navy">
                        Inquiry into unapproved intake expansion in B.Tech AI & Data Science
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                        <span>Assigned Officer: Er. Neha Sharma</span>
                        <span className="text-emerald-700 font-semibold">Priority: High</span>
                      </div>
                    </div>

                    <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-sky-900">CASE-2026-0104</span>
                        <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                          PGRC Bureau
                        </span>
                      </div>
                      <div className="text-xs font-bold text-nexus-navy">
                        Denial of fee refund & withholding of original student marksheets
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                        <span>Assigned Officer: Prof. Rajive Kumar</span>
                        <span className="text-amber-700 font-semibold">Priority: Urgent</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-nexus-border rounded-xl p-8 text-center text-xs text-slate-500 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <div className="font-semibold text-nexus-navy">No Overlaps Detected</div>
                  <p>Inquiries are currently isolated to a single bureau queue. Switch the toggle above to simulate concurrent bureau collisions.</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-nexus-border text-xs">
                <span className="text-slate-500">Live API Endpoint: <code className="font-mono text-nexus-primary">GET /institutions/:id/overlap</code></span>
                <button
                  onClick={() => onEnterPortal('leadership', 'institutions')}
                  className="font-semibold text-nexus-primary hover:text-nexus-primary-hover flex items-center gap-1"
                >
                  <span>Open Full Institution Dossier in Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PROACTIVE SLA MONITOR & ESCALATION SIMULATOR */}
          {activeShowcaseTab === 'sla' && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Deterministic Countdown Engine
                    </span>
                    <span className="text-xs font-mono text-slate-500">SLA Standard: 14 Days</span>
                  </div>
                  <h3 className="text-lg font-bold text-nexus-navy mt-1">
                    Multi-Tier Escalation Ladder Simulator
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Observe how time remaining deterministically changes state and auto-escalates to higher governance tiers.
                  </p>
                </div>

                {/* 3 SLA Stage Switches */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setSlaState('normal')}
                    className={`px-3 py-1 rounded-lg transition ${
                      slaState === 'normal' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    On Track (7d)
                  </button>
                  <button
                    onClick={() => setSlaState('duesoon')}
                    className={`px-3 py-1 rounded-lg transition ${
                      slaState === 'duesoon' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Due Soon (18h)
                  </button>
                  <button
                    onClick={() => setSlaState('breached')}
                    className={`px-3 py-1 rounded-lg transition ${
                      slaState === 'breached' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Overdue Breach!
                  </button>
                </div>
              </div>

              {/* Dynamic SLA Card */}
              <div className="bg-slate-50 border border-nexus-border rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-nexus-primary">CASE-2026-0104 · Public Grievance</span>
                    <h4 className="text-sm font-bold text-nexus-navy mt-0.5">
                      Withholding of original marksheets & unrefunded deposit
                    </h4>
                  </div>

                  {/* Dynamic Badge */}
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    slaState === 'normal' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    slaState === 'duesoon' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                    'bg-rose-100 text-rose-900 border-rose-300'
                  }`}>
                    {slaState === 'normal' ? '● SLA: 7 Days Remaining (On Track)' :
                     slaState === 'duesoon' ? '⏳ SLA: 18h Remaining (< 48h Warning)' :
                     '🚨 SLA Breached: Overdue by 4 Days (Level 2 Escalated)'}
                  </span>
                </div>

                {/* Simulated Escalation Ladder Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Active Accountability Tier:</span>
                    <span className="font-bold text-nexus-navy">
                      {slaState === 'normal' ? 'Tier 1: Desk Officer (Er. Neha Sharma)' :
                       slaState === 'duesoon' ? 'Tier 1: Desk Officer (High-Priority Alert Dispatched)' :
                       'Tier 2: Bureau Head (Dr. Ramesh Unnikrishnan) — Level 2 Active'}
                    </span>
                  </div>

                  {/* 3 Step Bar */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Tier 1 · Desk Officer
                    </div>
                    <div className={`p-2 rounded-lg border transition ${
                      slaState === 'breached'
                        ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                        : slaState === 'duesoon'
                        ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      Tier 2 · Bureau Head
                    </div>
                    <div className={`p-2 rounded-lg border transition ${
                      slaState === 'breached' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-200 text-slate-500'
                    }`}>
                      Tier 3 · Member Secretary
                    </div>
                  </div>
                </div>

                {slaState === 'breached' && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Level 2 Escalation Auto-Triggered</span>
                    </div>
                    <p className="leading-relaxed">
                      Because the 14-day SLA deadline passed with no Action Taken Report, this case was automatically elevated to the Bureau Head's priority console. Weekly penalty calculation initiated on institution.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-nexus-border text-xs">
                <span className="text-slate-500">Live Calculation: <code className="font-mono text-nexus-primary">due_at - Date.now()</code></span>
                <button
                  onClick={() => onEnterPortal('bureau_official', 'cases')}
                  className="font-semibold text-nexus-primary hover:text-nexus-primary-hover flex items-center gap-1"
                >
                  <span>Review SLA Queues in Bureau Head Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: INSTITUTIONAL COMPLIANCE CALCULATOR */}
          {activeShowcaseTab === 'risk' && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      Transparent & Explainable Metrics
                    </span>
                    <span className="text-xs font-mono text-slate-500">Formula-Driven Math</span>
                  </div>
                  <h3 className="text-lg font-bold text-nexus-navy mt-1">
                    Institutional Risk & Compliance Scorecard Simulator
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Adjust case parameters below to watch the explainable risk score compute in real-time.
                  </p>
                </div>

                <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${calculatedRiskTier.color}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${calculatedRiskTier.dot}`} />
                  <span className="font-bold text-sm tabular-nums">{calculatedScore} / 100</span>
                  <span className="text-xs font-bold">({calculatedRiskTier.label})</span>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-2xl border border-nexus-border">
                {/* Slider 1: Overdue Cases */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Overdue Cases (-15 pts each):</span>
                    <span className="font-bold text-rose-600 font-mono">{calcOverdue}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={calcOverdue}
                    onChange={e => setCalcOverdue(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-500">Deduction: -{calcOverdue * 15} pts</div>
                </div>

                {/* Slider 2: Active RB Cases */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Active Regulation Bureau (-10 pts):</span>
                    <span className="font-bold text-blue-600 font-mono">{calcRbCases}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={calcRbCases}
                    onChange={e => setCalcRbCases(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-500">Deduction: -{calcRbCases * 10} pts</div>
                </div>

                {/* Slider 3: Active PGRC Cases */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Active PGRC Grievances (-5 pts):</span>
                    <span className="font-bold text-sky-600 font-mono">{calcPgrcCases}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={calcPgrcCases}
                    onChange={e => setCalcPgrcCases(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-500">Deduction: -{calcPgrcCases * 5} pts</div>
                </div>
              </div>

              {/* Explainable Formula Card */}
              <div className="bg-white border border-nexus-border rounded-xl p-4 text-xs space-y-2">
                <div className="font-bold text-nexus-navy flex items-center gap-2">
                  <Scale className="w-4 h-4 text-nexus-primary" />
                  <span>Explainable Mathematical Formula Breakdown</span>
                </div>
                <div className="font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 text-[11px]">
                  Score = 100 - ({calcOverdue} × 15) - ({calcRbCases} × 10) - ({calcPgrcCases} × 5) = <strong className="text-nexus-primary">{calculatedScore} / 100</strong>
                </div>
                <div className="text-[11px] text-slate-400 italic">
                  * DEMO COMPLIANCE METRIC — ILLUSTRATIVE FORMULA, NOT AN OFFICIAL AICTE RATING.
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-nexus-border text-xs">
                <span className="text-slate-500">Live API Endpoint: <code className="font-mono text-nexus-primary">GET /institutions/:id/risk-score</code></span>
                <button
                  onClick={() => onEnterPortal('leadership', 'institutions')}
                  className="font-semibold text-nexus-primary hover:text-nexus-primary-hover flex items-center gap-1"
                >
                  <span>Inspect All Institutional Health Scores</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: INTER-BUREAU TRANSFER HANDSHAKE SIMULATOR */}
          {activeShowcaseTab === 'transfer' && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Cross-Bureau Handshake Protocol
                    </span>
                    <span className="text-xs font-mono text-slate-500">Immutable Audit Event</span>
                  </div>
                  <h3 className="text-lg font-bold text-nexus-navy mt-1">
                    Formal Handover with Mandatory Justification
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Prevent cases from being lost in administrative limbo. Test how an inter-bureau transfer writes an immutable audit record.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                    Audit Logging Active
                  </span>
                </div>
              </div>

              {/* Handshake Form Simulation */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-nexus-border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-nexus-navy mb-1">Target Receiving Bureau:</label>
                    <select
                      value={transferTargetBureau}
                      onChange={e => setTransferTargetBureau(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-nexus-border rounded-xl focus:outline-none focus:border-nexus-primary font-medium"
                    >
                      <option value="Approval Bureau (AB)">Approval Bureau (AB) — Affiliation Review</option>
                      <option value="Regulation Bureau (RB)">Regulation Bureau (RB) — Course Scrutiny</option>
                      <option value="Vigilance Cell">Vigilance Cell — Severe Misconduct Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-nexus-navy mb-1">Originating Case:</label>
                    <input
                      type="text"
                      disabled
                      value="CASE-2026-0104 · Withholding Marksheets & Fee Refund"
                      className="w-full text-xs p-2.5 bg-slate-200/60 border border-slate-300 rounded-xl text-slate-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-nexus-navy mb-1">Mandatory Administrative Justification:</label>
                  <input
                    type="text"
                    value={transferReason}
                    onChange={e => setTransferReason(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-nexus-border rounded-xl focus:outline-none focus:border-nexus-primary font-medium"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleExecuteHandshake}
                    className="flex items-center gap-2 bg-nexus-primary hover:bg-nexus-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Execute Formal Handshake</span>
                  </button>

                  {transferHandshakeExecuted && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Transferred to {transferTargetBureau} with Audit Stamp!</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Real Immutable Audit Block */}
              {transferHandshakeExecuted && (
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>IMMUTABLE AUDIT LOG ENTRY GENERATED</span>
                    </span>
                    <span className="text-emerald-400">STATUS: COMMITTED</span>
                  </div>
                  <div className="text-[11px] leading-relaxed text-slate-300">
                    <div><strong>EVENT_TYPE:</strong> CASE_BUREAU_TRANSFER_HANDSHAKE</div>
                    <div><strong>TIMESTAMP:</strong> {new Date().toISOString()}</div>
                    <div><strong>INITIATING_OFFICER:</strong> Er. Neha Sharma (Desk Officer)</div>
                    <div><strong>TARGET_BUREAU:</strong> {transferTargetBureau}</div>
                    <div><strong>REASON:</strong> {transferReason}</div>
                    <div><strong>AUDIT_DIGEST_SHA256:</strong> <span className="text-cyan-300">{handshakeHash}</span></div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-nexus-border text-xs">
                <span className="text-slate-500">Live API Endpoint: <code className="font-mono text-nexus-primary">POST /cases/:id/transfer</code></span>
                <button
                  onClick={() => onEnterPortal('auditor', 'audit')}
                  className="font-semibold text-nexus-primary hover:text-nexus-primary-hover flex items-center gap-1"
                >
                  <span>Inspect Audit Ledger as External Auditor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          THE 8 GOVERNANCE PERSONAS (INTERACTIVE QUICK LAUNCH)
          ========================================================================= */}
      <section id="personas" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-nexus-primary bg-nexus-primary/10 px-3 py-1 rounded-full">
            Exact 8 Personas Implemented
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-nexus-navy tracking-tight">
            Role-Based Consoles for Every Governance Tier
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            From national AICTE executives to students and registrars, each stakeholder has a dedicated, tailored console with strict permissions and live mock data.
          </p>

          {/* Persona Filter Tabs */}
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => setPersonaFilter('all')}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition ${
                personaFilter === 'all'
                  ? 'bg-nexus-primary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All 8 Personas
            </button>
            <button
              onClick={() => setPersonaFilter('aicte')}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition ${
                personaFilter === 'aicte'
                  ? 'bg-nexus-primary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              AICTE Internal Officials (5)
            </button>
            <button
              onClick={() => setPersonaFilter('stakeholder')}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition ${
                personaFilter === 'stakeholder'
                  ? 'bg-nexus-primary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Colleges, Students & Audit (3)
            </button>
          </div>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPersonas.map(persona => (
            <div
              key={persona.id}
              className={`bg-white border rounded-2xl p-5 shadow-nexus-card hover:shadow-nexus-elevated transition-all flex flex-col justify-between group ${persona.color}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                    {persona.badge}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                <div>
                  <h3 className="font-bold text-sm text-nexus-navy group-hover:text-nexus-primary transition">
                    {persona.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">{persona.title}</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {persona.desc}
                </p>

                <div className="space-y-1 pt-1 border-t border-nexus-border">
                  {persona.capabilities.map((cap, i) => (
                    <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-nexus-primary shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-nexus-border">
                <button
                  onClick={() => onEnterPortal(persona.id)}
                  className="w-full flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-nexus-primary hover:text-white text-nexus-navy text-xs font-semibold py-2 rounded-xl transition group/btn"
                >
                  <span>Launch Console</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          BUREAU ECOSYSTEM RIBBON
          ========================================================================= */}
      <section id="bureaus" className="border-y border-nexus-border bg-slate-50/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
            Connecting All AICTE Regulatory & Academic Directorates in One Intelligence Grid
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center text-xs font-semibold text-slate-800">
            <div className="bg-white p-3.5 rounded-xl border border-nexus-border shadow-xs flex flex-col items-center gap-1.5">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">RB</span>
              <span>Regulation Bureau</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-nexus-border shadow-xs flex flex-col items-center gap-1.5">
              <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs">PGRC</span>
              <span>Public Grievances Cell</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-nexus-border shadow-xs flex flex-col items-center gap-1.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">AB</span>
              <span>Approval Bureau</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-nexus-border shadow-xs flex flex-col items-center gap-1.5">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">ACAD</span>
              <span>Policy & Academic</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-nexus-border shadow-xs flex flex-col items-center gap-1.5 col-span-2 sm:col-span-1">
              <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">FDW</span>
              <span>Faculty Development</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 3 CORE DIFFERENTIATORS
          ========================================================================= */}
      <section id="differentiators" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-nexus-primary bg-nexus-primary/10 px-3 py-1 rounded-full">
            Key Differentiators for SIH
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-nexus-navy tracking-tight">
            The 3 Strongest Differentiators
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Unlike traditional platforms that act as passive complaint mailboxes, our engine is built for proactive enforcement, institutional accountability, and automated escalation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Differentiator 1 */}
          <div className="bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card hover:border-nexus-primary transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-200">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Differentiator 1</span>
              <h3 className="text-base font-bold text-nexus-navy mt-1">
                Proactive SLA Monitoring & Multi-Tier Escalation
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Traditional portals passively record intake dates. Our engine calculates deterministic countdowns, turns Amber at &lt;48h, and triggers automated escalation (Desk ➔ Bureau Head ➔ Member Secretary) upon timeout.
            </p>
            <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200 text-[11px] font-mono text-rose-900">
              ✓ Automated timeout detection<br />
              ✓ Escalation ladder to Competent Authority
            </div>
          </div>

          {/* Differentiator 2 */}
          <div className="bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card hover:border-nexus-primary transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Differentiator 2</span>
              <h3 className="text-base font-bold text-nexus-navy mt-1">
                Unified Cross-Bureau Institution OneView
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eliminates departmental blindspots. Search any college by AICTE Permanent ID to see affiliation approvals, faculty salary disputes, and student grievances in one unified institutional dossier.
            </p>
            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-[11px] font-mono text-blue-900">
              ✓ Mandatory overlap collision banner<br />
              ✓ Cross-bureau dossier consolidation
            </div>
          </div>

          {/* Differentiator 3 */}
          <div className="bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card hover:border-nexus-primary transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-200">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Differentiator 3</span>
              <h3 className="text-base font-bold text-nexus-navy mt-1">
                Accountability Analytics & Zero Auto-Merge AI
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connects complaint histories to explainable risk scores. Semantic AI flags duplicate and related complaints with transparent matching rationales, strictly requiring human officer sign-off.
            </p>
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-[11px] font-mono text-emerald-900">
              ✓ Immutable append-only audit trail<br />
              ✓ Human-in-the-loop review policy
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE COMPARISON MATRIX (EXISTING VS PROPOSED)
          ========================================================================= */}
      <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-nexus-border">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Head-to-Head Architectural Breakdown
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-nexus-navy tracking-tight">
            Existing Systems vs. Our AICTE Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The biggest difference is that existing portals primarily facilitate complaint handling, while our solution emphasizes centralized monitoring, deadline enforcement, and administrative accountability.
          </p>
        </div>

        <div className="border border-nexus-border rounded-2xl overflow-x-auto shadow-nexus-card bg-white">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-nexus-border font-bold text-nexus-navy">
              <tr>
                <th className="px-5 py-4 w-44">Key Feature</th>
                <th className="px-5 py-4 w-1/2 text-slate-600">Existing Grievance Systems</th>
                <th className="px-5 py-4 w-1/2 bg-blue-50/50 text-nexus-primary">Our Proposed Solution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexus-border">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5 font-bold text-nexus-navy whitespace-nowrap">
                    {row.feature}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 leading-relaxed">
                    {row.existing}
                  </td>
                  <td className="px-5 py-3.5 bg-blue-50/30 text-nexus-navy font-medium leading-relaxed">
                    <span className="flex items-start gap-1.5">
                      <Check className="w-4 h-4 text-nexus-primary shrink-0 mt-0.5" />
                      <span>{row.proposed}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================================
          PUBLIC CITIZEN & COLLEGE QUICK-TRACKER WIDGET
          ========================================================================= */}
      <section id="tracker" className="py-20 px-4 sm:px-6 lg:px-8 bg-nexus-bg border-t border-nexus-border">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-nexus-primary">
              Public Stakeholder Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-nexus-navy">
              Track Grievance or Institution Status
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Students, faculty, and institutions can check real milestone progress without signing in.
            </p>

            {/* Quick Demo Search Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
              <span className="text-slate-400">Try quick demos:</span>
              <button
                type="button"
                onClick={() => handleSelectQuickTag('CASE-2026-0101')}
                className="font-mono bg-white border border-nexus-border hover:border-nexus-primary px-2.5 py-1 rounded-lg text-nexus-primary font-semibold transition"
              >
                CASE-2026-0101 (RB)
              </button>
              <button
                type="button"
                onClick={() => handleSelectQuickTag('CASE-2026-0104')}
                className="font-mono bg-white border border-nexus-border hover:border-nexus-primary px-2.5 py-1 rounded-lg text-nexus-primary font-semibold transition"
              >
                CASE-2026-0104 (PGRC)
              </button>
              <button
                type="button"
                onClick={() => handleSelectQuickTag('CASE-2026-0107')}
                className="font-mono bg-white border border-nexus-border hover:border-nexus-primary px-2.5 py-1 rounded-lg text-nexus-primary font-semibold transition"
              >
                CASE-2026-0107 (Overdue)
              </button>
              <button
                type="button"
                onClick={() => handleSelectQuickTag('1-3321458291')}
                className="font-mono bg-white border border-nexus-border hover:border-nexus-primary px-2.5 py-1 rounded-lg text-nexus-navy font-semibold transition"
              >
                RGPV ID (1-3321458291)
              </button>
            </div>
          </div>

          <form onSubmit={e => handleTrackCase(e)} className="flex gap-2 bg-white p-2 rounded-2xl border border-nexus-border shadow-nexus-card">
            <div className="flex items-center gap-2 px-3 flex-1">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={trackerQuery}
                onChange={e => setTrackerQuery(e.target.value)}
                placeholder="Enter Case ID (e.g. CASE-2026-0101) or AICTE ID (1-3321458291)..."
                className="w-full text-xs py-2 focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isSearchingTracker}
              className="px-5 py-2.5 bg-nexus-primary hover:bg-nexus-primary-hover text-white text-xs font-semibold rounded-xl transition shadow-xs shrink-0"
            >
              {isSearchingTracker ? 'Searching...' : 'Track Status'}
            </button>
          </form>

          {trackerError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 text-center">
              {trackerError}
            </div>
          )}

          {/* Tracked Case Result Card */}
          {trackedCase && (
            <div className="bg-white border border-nexus-border rounded-2xl p-5 shadow-nexus-card space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-nexus-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-nexus-primary bg-nexus-primary-subtle px-2.5 py-1 rounded text-xs">
                    {trackedCase.case_number}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{trackedCase.category}</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  trackedCase.status === 'Resolved' || trackedCase.status === 'Disposed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {trackedCase.status}
                </span>
              </div>

              <div>
                <div className="text-xs font-semibold text-nexus-navy">{trackedCase.institution_name}</div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {trackedCase.summary}
                </p>
              </div>

              {/* Milestone Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>1. Registered</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>2. Under Review</span>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-800 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>3. Action In Progress</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-100 text-slate-400 flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border border-slate-300" />
                  <span>4. Resolved</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-nexus-border">
                <span>Handling Directorate: <strong>{trackedCase.bureau_name}</strong></span>
                <span>Expected SLA Target: <strong>{trackedCase.due_at ? new Date(trackedCase.due_at).toLocaleDateString() : 'Active'}</strong></span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          STRIPE-STYLE CALL TO ACTION SECTION
          ========================================================================= */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Experience the AICTE Complaint Monitoring Engine?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Test the live 5-step evaluation flow: Institution Search ➔ Overlap Trigger ➔ SLA Escalation ➔ Transfer Handshake ➔ Action Taken Report (ATR) Loop.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onEnterPortal('leadership')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition group"
            >
              <span>Start Interactive Demo (Chairman Console)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
            <button
              onClick={onOpenSignIn}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition"
            >
              <span>Explore All 8 Personas</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />
      </section>

      {/* STRIPE-STYLE FOOTER */}
      <footer className="border-t border-nexus-border py-10 px-4 sm:px-6 lg:px-8 bg-white mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-nexus-primary flex items-center justify-center text-white font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-nexus-navy">Nexus 0 — AICTE OneView Prototype</div>
              <div className="text-[11px]">Smart India Hackathon 2026 · Problem Statement 26264</div>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] space-y-1">
            <p>Target Organization: All India Council for Technical Education (Regulation Bureau & PGRC)</p>
            <p className="font-mono text-slate-400">DEMO ENVIRONMENT — ALL TRANSACTIONS RECORDED TO IMMUTABLE AUDIT TRAIL</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
