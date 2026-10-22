import React, { useState } from 'react';
import {
  ArrowRight,
  Search,
  Building2,
  Clock,
  Scale,
  Sparkles,
  Check
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { DemoRole } from '../types';
import { NexusLogo } from '../components/NexusLogo';
import { InteractiveWorkflowsShowcase } from '../components/InteractiveWorkflowsShowcase';

interface LandingPageViewProps {
  onEnterPortal: (role?: DemoRole, targetTab?: string) => void;
  onOpenSignIn: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterPortal,
  onOpenSignIn
}) => {
  const { switchRole } = useDemo();

  // Persona Grid Filter
  const [personaFilter, setPersonaFilter] = useState<'all' | 'aicte' | 'stakeholder'>('all');

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
    <div className="min-h-screen bg-white text-nexus-navy flex flex-col font-sans selection:bg-nexus-primary selection:text-white scroll-smooth">
      {/* =========================================================================
          TOP FLOATING GLASSMORPHIC NAVIGATION BAR
          ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-xl shadow-lg shadow-slate-950/20 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            className="cursor-pointer transition-transform hover:opacity-95"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <NexusLogo
              variant="dark"
              size="md"
              subtitle="Regulation Bureau & PGRC Inter-Directorate Engine"
            />
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={onOpenSignIn}
              className="text-xs font-semibold text-slate-200 hover:text-white px-3 sm:px-3.5 py-2 rounded-lg hover:bg-white/10 transition border border-white/15"
            >
              Sign In
            </button>
            <button
              onClick={() => onEnterPortal('leadership')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs font-bold px-3.5 sm:px-4 py-2 rounded-lg shadow-md shadow-blue-500/25 transition group hover:shadow-cyan-500/20 hover:shadow-lg"
            >
              <span>Launch Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          STRIPE-INSPIRED ANGLED AURORA GRADIENT CANVAS
          ========================================================================= */}
      <div className="relative overflow-hidden bg-slate-900 text-white pb-32">
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

        {/* HERO CONTENT */}
        <section className="relative z-10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto space-y-6">
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
          INTERACTIVE ARCHITECTURAL WORKFLOWS SHOWCASE (LIVE SIMULATOR & STEPPERS)
          ========================================================================= */}
      <InteractiveWorkflowsShowcase onEnterPortal={onEnterPortal} />

      {/* =========================================================================
          THE 8 GOVERNANCE PERSONAS (INTERACTIVE QUICK LAUNCH)
          ========================================================================= */}
      <section id="personas" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
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
      <section id="differentiators" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-nexus-primary bg-nexus-primary/10 px-3 py-1 rounded-full">
            Key Architectural Differentiators
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
      <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-nexus-border scroll-mt-20">
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
            <NexusLogo
              variant="light"
              size="sm"
              subtitle="Central Governance & Institutional Compliance Engine"
            />
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
