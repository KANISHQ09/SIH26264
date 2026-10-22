import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Clock,
  Activity,
  Share2,
  CheckCircle2,
  Lock,
  Shield,
  Building2,
  Scale,
  ArrowRight,
  Zap,
  Sparkles
} from 'lucide-react';
import { DemoRole } from '../types';

interface InteractiveWorkflowsShowcaseProps {
  onEnterPortal: (role?: DemoRole, targetTab?: string) => void;
}

export const InteractiveWorkflowsShowcase: React.FC<InteractiveWorkflowsShowcaseProps> = ({
  onEnterPortal
}) => {
  const [activeTab, setActiveTab] = useState<'overlap' | 'sla' | 'risk' | 'transfer'>('overlap');

  // Feature 1: Overlap State
  const [overlapSimulated, setOverlapSimulated] = useState(true);

  // Feature 2: SLA Escalation State
  const [slaState, setSlaState] = useState<'normal' | 'duesoon' | 'breached'>('duesoon');
  const [secondsTick, setSecondsTick] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsTick(prev => (prev > 0 ? prev - 1 : 59));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Feature 3: Risk Scorecard State
  const [calcOverdue, setCalcOverdue] = useState<number>(1);
  const [calcRbCases, setCalcRbCases] = useState<number>(2);
  const [calcPgrcCases, setCalcPgrcCases] = useState<number>(2);

  const calculatedScore = Math.max(10, 100 - (calcOverdue * 15) - (calcRbCases * 10) - (calcPgrcCases * 5));
  const calculatedRiskTier =
    calculatedScore >= 85 ? { label: 'Low Risk', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' } :
    calculatedScore >= 60 ? { label: 'Moderate Risk', color: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' } :
    { label: 'High Risk · Scrutiny Flagged', color: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-500' };

  // Feature 4: Transfer Handshake State
  const [transferTargetBureau, setTransferTargetBureau] = useState('Approval Bureau (AB)');
  const [transferReason, setTransferReason] = useState('Re-inspection required under AICTE Approval Process Handbook (APH 2026-27 Clause 7.3)');
  const [transferHandshakeExecuted, setTransferHandshakeExecuted] = useState(false);
  const [handshakeHash, setHandshakeHash] = useState('0x8f2a...c4b1');

  const handleExecuteHandshake = () => {
    setTransferHandshakeExecuted(true);
    const mockHash = '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setHandshakeHash(mockHash);
  };

  return (
    <section id="interactive-showcase" className="relative z-20 pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 bg-nexus-primary/10 border border-nexus-primary/25 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-nexus-primary shadow-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="uppercase tracking-wider">Live Architecture Workflows · AICTE OneView</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-nexus-navy tracking-tight">
          How Nexus 0 Solves Inter-Bureau Blindspots
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
          Traditional portals act as passive, isolated mailboxes. Nexus 0 operates as a proactive, automated coordination grid. Select any core workflow below to inspect its animated end-to-end pipeline in action:
        </p>
      </div>

      {/* 4 Feature Cards as the Interactive Workflow Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {/* Feature 1 */}
        <button
          type="button"
          onClick={() => setActiveTab('overlap')}
          className={`text-left p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer ${
            activeTab === 'overlap'
              ? 'bg-white border-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/25'
              : 'bg-white/90 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
              activeTab === 'overlap' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-600'
            }`}>
              01 · Collision Lock
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              activeTab === 'overlap' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'bg-amber-50 text-amber-600 border border-amber-200'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-bold text-sm text-nexus-navy group-hover:text-amber-900 transition">
            Overlap Detection
          </div>
          <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
            Auto-correlates multi-bureau cases & locks conflicting directives.
          </div>
          {activeTab === 'overlap' && (
            <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
          )}
        </button>

        {/* Feature 2 */}
        <button
          type="button"
          onClick={() => setActiveTab('sla')}
          className={`text-left p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer ${
            activeTab === 'sla'
              ? 'bg-white border-rose-400 shadow-xl shadow-rose-500/10 ring-2 ring-rose-400/25'
              : 'bg-white/90 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
              activeTab === 'sla' ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-slate-100 text-slate-600'
            }`}>
              02 · Statutory Timer
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              activeTab === 'sla' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' : 'bg-rose-50 text-rose-600 border border-rose-200'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-bold text-sm text-nexus-navy group-hover:text-rose-900 transition">
            SLA Escalation Ladder
          </div>
          <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
            Deterministic countdowns that auto-escalate from Desk to Bureau Head.
          </div>
          {activeTab === 'sla' && (
            <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-rose-500 to-red-600 rounded-full" />
          )}
        </button>

        {/* Feature 3 */}
        <button
          type="button"
          onClick={() => setActiveTab('risk')}
          className={`text-left p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer ${
            activeTab === 'risk'
              ? 'bg-white border-blue-400 shadow-xl shadow-blue-500/10 ring-2 ring-blue-400/25'
              : 'bg-white/90 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
              activeTab === 'risk' ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-slate-100 text-slate-600'
            }`}>
              03 · Deductive Math
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              activeTab === 'risk' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-blue-50 text-blue-600 border border-blue-200'
            }`}>
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="font-bold text-sm text-nexus-navy group-hover:text-blue-900 transition">
            Health & Risk Scorecard
          </div>
          <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
            Explainable 0–100 compliance rating calculated with 100% transparent math.
          </div>
          {activeTab === 'risk' && (
            <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
          )}
        </button>

        {/* Feature 4 */}
        <button
          type="button"
          onClick={() => setActiveTab('transfer')}
          className={`text-left p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer ${
            activeTab === 'transfer'
              ? 'bg-white border-emerald-400 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-400/25'
              : 'bg-white/90 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
              activeTab === 'transfer' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-600'
            }`}>
              04 · Tamper-Proof Audit
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              activeTab === 'transfer' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}>
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-bold text-sm text-nexus-navy group-hover:text-emerald-900 transition">
            Transfer Handshake
          </div>
          <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
            Cryptographic SHA-256 custody transfer with dual-signoff and audit log.
          </div>
          {activeTab === 'transfer' && (
            <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Main Interactive Showcase Console Window */}
      <div className="bg-white rounded-3xl border border-nexus-border shadow-2xl shadow-blue-900/10 overflow-hidden">
        {/* Console Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-xs font-semibold text-slate-300 ml-2">
              nexus-0://workflows/{activeTab}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Engine Simulation
            </span>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: MULTI-BUREAU OVERLAP COLLISION DETECTION WORKFLOW
            ========================================================================= */}
        {activeTab === 'overlap' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            {/* Feature Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-border pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Mandatory Core Requirement · Mutual Coordination Lock
                  </span>
                  <span className="text-xs font-mono text-slate-500">Target Institute: RGPV Institute (PID: 1-3321458291)</span>
                </div>
                <h3 className="text-xl font-extrabold text-nexus-navy mt-1.5">
                  Multi-Bureau Concurrent Investigation Detector & Collision Lock
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  Prevents independent AICTE bureaus from issuing contradictory or duplicate orders to the same institution. When concurrent inquiries exist across Regulation Bureau (RB) and PGRC, Nexus 0 immediately activates a mutual coordination lock.
                </p>
              </div>

              {/* Interactive Toggle Control */}
              <div className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-nexus-border shrink-0">
                <span className="text-xs font-bold text-slate-700">Simulate Concurrency:</span>
                <button
                  type="button"
                  onClick={() => setOverlapSimulated(!overlapSimulated)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    overlapSimulated ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      overlapSimulated ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-[11px] font-bold ${overlapSimulated ? 'text-amber-700' : 'text-slate-500'}`}>
                  {overlapSimulated ? 'Active' : 'Cleared'}
                </span>
              </div>
            </div>

            {/* Visual 4-Step Workflow Pipeline Diagram */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>The Automated Overlap Resolution Workflow</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 relative">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>STEP 01</span>
                    <Building2 className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Independent Filing</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Student files fee dispute in PGRC; RB opens intake inspection.
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 relative">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>STEP 02</span>
                    <Zap className="w-3.5 h-3.5 text-cyan-500" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">PID Correlation Engine</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Engine matches Permanent ID <code className="font-mono text-[10px] text-nexus-primary">1-3321458291</code> in real-time.
                  </div>
                </div>

                <div className={`rounded-xl p-3 border transition-all ${
                  overlapSimulated ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300/40' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span className={overlapSimulated ? 'text-amber-800' : ''}>STEP 03</span>
                    <AlertTriangle className={`w-3.5 h-3.5 ${overlapSimulated ? 'text-amber-600 animate-bounce' : 'text-slate-400'}`} />
                  </div>
                  <div className={`font-bold text-xs ${overlapSimulated ? 'text-amber-950 font-extrabold' : 'text-nexus-navy'}`}>
                    Collision Alert & Directive Lock
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Dispatches immediate alert to both officers; unilateral decisions locked.
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>STEP 04</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Synchronized Clearance</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Unified institutional dossier prevents contradictory penalty orders.
                  </div>
                </div>
              </div>
            </div>

            {/* Live Interactive Visualization Canvas */}
            {overlapSimulated ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Mandated AICTE Overlap Alert Banner */}
                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300 border-l-4 border-l-amber-600 p-4 sm:p-5 rounded-2xl shadow-sm animate-pulse-glow">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="flex-1 text-xs space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-extrabold text-amber-950 text-sm tracking-tight flex items-center gap-2">
                          <span>⚠️ Potential Overlapping Cases — Joint Coordination Mandatory</span>
                        </span>
                        <span className="bg-amber-200/90 text-amber-900 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                          2 Active Bureaus Colliding
                        </span>
                      </div>
                      <p className="text-amber-950/90 leading-relaxed">
                        Nexus 0 detected simultaneous open inquiries against <strong>RGPV Institute of Technology</strong> across <strong>Regulation Bureau (RB)</strong> and <strong>Public Grievance Redressal Cell (PGRC)</strong>. Unilateral conflicting orders are frozen until joint clearance is recorded.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual Node Connection Architecture */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span>INTER-DIRECTORATE TOPOLOGY ENGINE</span>
                    </div>
                    <span className="text-amber-400 font-bold font-mono">STATUS: MUTUAL LOCK ACTIVE</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Left: Bureau 1 */}
                    <div className="bg-slate-800/80 border border-blue-500/40 rounded-xl p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded">
                          Regulation Bureau (RB)
                        </span>
                        <span className="text-xs font-mono text-cyan-300 font-bold">CASE-2026-0101</span>
                      </div>
                      <div className="text-xs font-bold text-white">Unapproved intake expansion in B.Tech AI</div>
                      <div className="text-[11px] text-slate-300">Officer: Er. Neha Sharma · Priority: High</div>
                    </div>

                    {/* Middle: Nexus 0 Correlation Core */}
                    <div className="flex flex-col items-center justify-center p-3 text-center space-y-2 relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/30">
                        <Lock className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="font-extrabold text-xs text-cyan-300">Nexus 0 Correlation Hub</div>
                      <div className="text-[10px] text-slate-400 font-mono">PID: 1-3321458291 · RGPV Institute</div>
                    </div>

                    {/* Right: Bureau 2 */}
                    <div className="bg-slate-800/80 border border-sky-500/40 rounded-xl p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded">
                          PGRC Grievance Cell
                        </span>
                        <span className="text-xs font-mono text-sky-300 font-bold">CASE-2026-0104</span>
                      </div>
                      <div className="text-xs font-bold text-white">Denial of fee refund & marksheet withholding</div>
                      <div className="text-[11px] text-slate-300">Officer: Prof. Rajive Kumar · Priority: Urgent</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-emerald-200 rounded-2xl p-8 text-center text-xs text-slate-600 space-y-2 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-sm text-nexus-navy">Single Bureau Stream · No Collisions Detected</div>
                <p className="max-w-md mx-auto text-slate-500">
                  Cases are currently isolated in separate queues without contradictory institutional inquiries. Toggle <strong>Simulate Concurrency</strong> above to watch Nexus 0 catch collisions in real-time.
                </p>
              </div>
            )}

            {/* Bottom API & Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-nexus-border text-xs">
              <span className="text-slate-500">
                Live REST Endpoint: <code className="font-mono text-nexus-primary bg-nexus-primary-subtle px-2 py-0.5 rounded">GET /institutions/:id/overlap</code>
              </span>
              <button
                type="button"
                onClick={() => onEnterPortal('leadership', 'institutions')}
                className="font-bold text-nexus-primary hover:text-nexus-primary-hover flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Open Full Institutional Dossier in Operations Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PROACTIVE SLA COUNTDOWN & MULTI-TIER ESCALATION WORKFLOW
            ========================================================================= */}
        {activeTab === 'sla' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            {/* Feature Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-border pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    Deterministic Countdown Engine
                  </span>
                  <span className="text-xs font-mono text-slate-500">Statutory SLA Target: 14 Days</span>
                </div>
                <h3 className="text-xl font-extrabold text-nexus-navy mt-1.5">
                  Multi-Tier Escalation Ladder & Automated Countdown Protocol
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  Traditional complaint portals passively log arrival dates without enforcement. Nexus 0 computes deterministic countdowns, raises early warnings at &lt;48h, and triggers automated escalation up the governance hierarchy upon timeout.
                </p>
              </div>

              {/* 3 SLA Stage Switches */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => setSlaState('normal')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    slaState === 'normal' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  On Track (7d)
                </button>
                <button
                  type="button"
                  onClick={() => setSlaState('duesoon')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    slaState === 'duesoon' ? 'bg-amber-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Due Soon (18h)
                </button>
                <button
                  type="button"
                  onClick={() => setSlaState('breached')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    slaState === 'breached' ? 'bg-rose-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Breach Overdue!
                </button>
              </div>
            </div>

            {/* Visual 4-Stage SLA Workflow Pipeline */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>The Automated Escalation Lifecycle</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                <div className={`rounded-xl p-3 border transition-all ${
                  slaState === 'normal' ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300/40' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>PHASE 01</span>
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Day 0–12: Normal Desk Queue</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Assigned to Desk Officer (Er. Neha Sharma); statutory timer runs deterministically.
                  </div>
                </div>

                <div className={`rounded-xl p-3 border transition-all ${
                  slaState === 'duesoon' ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300/40' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>PHASE 02</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">&lt; 48h Amber Warning</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Automated priority SMS/Email dispatched to officer before statutory breach occurs.
                  </div>
                </div>

                <div className={`rounded-xl p-3 border transition-all ${
                  slaState === 'breached' ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-300/40' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>PHASE 03</span>
                    <Shield className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Timeout ➔ Bureau Head</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Zero human delay: automatically escalates to Bureau Head (Dr. M. S. Manna).
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>PHASE 04</span>
                    <Scale className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Member Secretary Review</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Sustained breaches flagged to National Leadership for mandatory accountability hearing.
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Live SLA Card with Ticking Clock */}
            <div className="bg-slate-50 border border-nexus-border rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs font-bold text-nexus-primary">CASE-2026-0104 · Public Grievance</span>
                  <h4 className="text-base font-bold text-nexus-navy mt-0.5">
                    Withholding of original student marksheets & unrefunded deposit
                  </h4>
                </div>

                {/* Animated Ticking Countdown Badge */}
                <div className={`px-4 py-2 rounded-xl border flex items-center gap-2.5 font-mono ${
                  slaState === 'normal' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                  slaState === 'duesoon' ? 'bg-amber-50 text-amber-900 border-amber-300 animate-pulse' :
                  'bg-rose-50 text-rose-900 border-rose-300'
                }`}>
                  <Clock className={`w-4 h-4 ${slaState === 'breached' ? 'text-rose-600 animate-spin' : ''}`} />
                  <span className="font-bold text-xs sm:text-sm">
                    {slaState === 'normal' && `7 Days 14h ${secondsTick}s (On Track)`}
                    {slaState === 'duesoon' && `18h 35m ${secondsTick}s (< 48h Impending Breach)`}
                    {slaState === 'breached' && `BREACHED · Overdue by 42h (Level 2 Escalated)`}
                  </span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Statutory 14-Day Timeline</span>
                  <span>
                    {slaState === 'normal' ? '50% Elapsed' : slaState === 'duesoon' ? '88% Elapsed (Urgent)' : '100% Expired'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      slaState === 'normal' ? 'w-1/2 bg-emerald-500' :
                      slaState === 'duesoon' ? 'w-[88%] bg-amber-500 animate-pulse' :
                      'w-full bg-rose-600'
                    }`}
                  />
                </div>
              </div>

              {/* 3-Tier Escalation Hierarchy Ladder */}
              <div className="bg-white border border-nexus-border rounded-xl p-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Multi-Tier Governance Escalation Ladder
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className={`p-3 rounded-xl border text-xs transition-all ${
                    slaState === 'normal'
                      ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-400/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between font-bold text-slate-500 text-[10px]">
                      <span>TIER 1 (DAYS 0–12)</span>
                      {slaState === 'normal' && <span className="text-blue-700 font-bold">● Active Desk</span>}
                    </div>
                    <div className="font-bold text-nexus-navy mt-1">Er. Neha Sharma</div>
                    <div className="text-[11px] text-slate-500">Senior Desk Officer (PGRC)</div>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs transition-all ${
                    slaState === 'duesoon' || slaState === 'breached'
                      ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between font-bold text-slate-500 text-[10px]">
                      <span>TIER 2 (DAY 12–14 / BREACH)</span>
                      {slaState === 'breached' && <span className="text-rose-700 font-bold">● Auto-Escalated</span>}
                    </div>
                    <div className="font-bold text-nexus-navy mt-1">Dr. M. S. Manna</div>
                    <div className="text-[11px] text-slate-500">Bureau Head & Supervisory Officer</div>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs transition-all ${
                    slaState === 'breached'
                      ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-400/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between font-bold text-slate-500 text-[10px]">
                      <span>TIER 3 (STATUTORY BREACH)</span>
                      {slaState === 'breached' && <span className="text-rose-700 font-bold">● Alerted</span>}
                    </div>
                    <div className="font-bold text-nexus-navy mt-1">Dr. Anil Sahasrabudhe</div>
                    <div className="text-[11px] text-slate-500">Member Secretary / Chairman Console</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom API & Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-nexus-border text-xs">
              <span className="text-slate-500">
                Live REST Endpoint: <code className="font-mono text-nexus-primary bg-nexus-primary-subtle px-2 py-0.5 rounded">GET /cases/:id/sla-status</code>
              </span>
              <button
                type="button"
                onClick={() => onEnterPortal('bureau_official', 'cases')}
                className="font-bold text-nexus-primary hover:text-nexus-primary-hover flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Inspect Escalated Cases in Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: EXPLAINABLE INSTITUTIONAL RISK & HEALTH SCORECARD WORKFLOW
            ========================================================================= */}
        {activeTab === 'risk' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            {/* Feature Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-border pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Transparent & Explainable Metrics
                  </span>
                  <span className="text-xs font-mono text-slate-500">Zero Hallucinating Black-Box AI</span>
                </div>
                <h3 className="text-xl font-extrabold text-nexus-navy mt-1.5">
                  Institutional Risk Scorecard & Deductive Math Simulator
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  AICTE leadership needs instant, explainable insight into chronic offenders vs. compliant colleges. Nexus 0 computes deterministic health ratings with live arithmetic deductions. Adjust the parameters below to see the score calculate in real-time:
                </p>
              </div>

              {/* Score Chip */}
              <div className={`px-4 py-2 rounded-xl border flex items-center gap-2.5 ${calculatedRiskTier.color} shrink-0`}>
                <span className={`w-3 h-3 rounded-full ${calculatedRiskTier.dot} animate-pulse`} />
                <span className="font-extrabold text-base tabular-nums">{calculatedScore} / 100</span>
                <span className="text-xs font-bold">({calculatedRiskTier.label})</span>
              </div>
            </div>

            {/* Visual 4-Stage Scorecard Workflow */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>The Explainable Risk Scoring Workflow</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>STEP 01</span>
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Cross-Bureau Ingestion</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Pulls active notices from Regulation, Approval & PGRC in real-time.
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>STEP 02</span>
                    <Scale className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Deterministic Deductions</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Fixed formula: -15 pts per Overdue, -10 pts per RB case, -5 per PGRC.
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>STEP 03</span>
                    <Activity className="w-3.5 h-3.5 text-cyan-600" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Dynamic Tier Placement</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Low Risk (85+), Moderate Risk (60–84), High Scrutiny Watchlist (&lt;60).
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>STEP 04</span>
                    <Shield className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Automated Inspection Trigger</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Sub-60 score triggers mandatory surprise inspection notice under AICTE norms.
                  </div>
                </div>
              </div>
            </div>

            {/* Sliders Grid & Live Gauge Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-nexus-border">
              {/* 3 Interactive Sliders */}
              <div className="lg:col-span-2 space-y-4">
                <div className="text-xs font-bold text-nexus-navy uppercase tracking-wider">
                  Interactive Metric Knobs (Simulate College Parameters)
                </div>

                {/* Slider 1 */}
                <div className="bg-white p-4 rounded-xl border border-nexus-border space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Overdue Unresolved Cases (-15 pts each):</span>
                    <span className="font-bold text-rose-600 font-mono text-sm">{calcOverdue}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={calcOverdue}
                    onChange={e => setCalcOverdue(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>0 overdue</span>
                    <span className="font-semibold text-rose-700">Deduction: -{calcOverdue * 15} pts</span>
                    <span>4 overdue</span>
                  </div>
                </div>

                {/* Slider 2 */}
                <div className="bg-white p-4 rounded-xl border border-nexus-border space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Active Regulation Bureau Violations (-10 pts each):</span>
                    <span className="font-bold text-blue-600 font-mono text-sm">{calcRbCases}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={calcRbCases}
                    onChange={e => setCalcRbCases(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>0 active</span>
                    <span className="font-semibold text-blue-700">Deduction: -{calcRbCases * 10} pts</span>
                    <span>5 active</span>
                  </div>
                </div>

                {/* Slider 3 */}
                <div className="bg-white p-4 rounded-xl border border-nexus-border space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Open PGRC Grievances (-5 pts each):</span>
                    <span className="font-bold text-sky-600 font-mono text-sm">{calcPgrcCases}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={calcPgrcCases}
                    onChange={e => setCalcPgrcCases(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>0 grievances</span>
                    <span className="font-semibold text-sky-700">Deduction: -{calcPgrcCases * 5} pts</span>
                    <span>5 grievances</span>
                  </div>
                </div>
              </div>

              {/* Animated Circular Health Gauge */}
              <div className="bg-white p-5 rounded-xl border border-nexus-border flex flex-col items-center justify-center text-center space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Computed Health Gauge
                </div>

                {/* SVG Gauge */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#E2E8F0"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    {/* Animated Foreground Ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={calculatedScore >= 85 ? '#10B981' : calculatedScore >= 60 ? '#F59E0B' : '#EF4444'}
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * calculatedScore) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-nexus-navy tabular-nums">{calculatedScore}</span>
                    <span className="text-[10px] font-bold text-slate-400">OUT OF 100</span>
                  </div>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${calculatedRiskTier.color}`}>
                  {calculatedRiskTier.label}
                </span>

                <div className="text-[11px] text-slate-500 leading-tight">
                  {calculatedScore < 60
                    ? '⚠️ Recommends priority scrutiny & automated inspection notice.'
                    : '✓ Compliant with AICTE Affiliation Standards.'}
                </div>
              </div>
            </div>

            {/* Explainable Formula Card */}
            <div className="bg-white border border-nexus-border rounded-xl p-4 text-xs space-y-2">
              <div className="font-bold text-nexus-navy flex items-center gap-2">
                <Scale className="w-4 h-4 text-nexus-primary" />
                <span>Explainable Mathematical Formula Breakdown</span>
              </div>
              <div className="font-mono bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800 text-[11px] leading-relaxed flex flex-wrap items-center gap-2">
                <span>Score = 100 - ({calcOverdue} × 15) - ({calcRbCases} × 10) - ({calcPgrcCases} × 5) =</span>
                <span className="font-bold text-sm text-nexus-primary bg-nexus-primary-subtle px-2 py-0.5 rounded">
                  {calculatedScore} / 100
                </span>
                <span className="text-slate-400">({calculatedRiskTier.label})</span>
              </div>
            </div>

            {/* Bottom API & Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-nexus-border text-xs">
              <span className="text-slate-500">
                Live REST Endpoint: <code className="font-mono text-nexus-primary bg-nexus-primary-subtle px-2 py-0.5 rounded">GET /institutions/:id/risk-score</code>
              </span>
              <button
                type="button"
                onClick={() => onEnterPortal('leadership', 'institutions')}
                className="font-bold text-nexus-primary hover:text-nexus-primary-hover flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Inspect All Institutional Scores in Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: INTER-BUREAU TRANSFER HANDSHAKE WITH IMMUTABLE AUDIT LOG
            ========================================================================= */}
        {activeTab === 'transfer' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            {/* Feature Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-border pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Cross-Bureau Handshake Protocol
                  </span>
                  <span className="text-xs font-mono text-slate-500">Immutable Audit Event</span>
                </div>
                <h3 className="text-xl font-extrabold text-nexus-navy mt-1.5">
                  Formal Custody Handover with Mandatory Justification & SHA-256 Digest
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  Prevent cases from being "lost in administrative transit" between departments. Every transfer writes a cryptographically verifiable transaction to the immutable audit trail.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Audit Ledger Active</span>
                </span>
              </div>
            </div>

            {/* Visual 4-Stage Handshake Workflow */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>The Immutable Custody Handshake Workflow</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>STEP 01</span>
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Transfer Request</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Desk officer initiates transfer with mandatory regulatory justification.
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>STEP 02</span>
                    <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Cryptographic Signing</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Engine computes SHA-256 digest binding officer ID, timestamp & target bureau.
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>STEP 03</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Receiving Queue Credit</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Zero lost cases: immediately credited to target bureau inbox with countdown reset.
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>STEP 04</span>
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div className="font-bold text-xs text-nexus-navy">Immutable Ledger Sealed</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Permanent audit record sealed into append-only log for vigilance review.
                  </div>
                </div>
              </div>
            </div>

            {/* Handshake Form Simulation */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-nexus-border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-nexus-navy mb-1.5">Target Receiving Bureau:</label>
                  <select
                    value={transferTargetBureau}
                    onChange={e => setTransferTargetBureau(e.target.value)}
                    className="w-full text-xs p-3 bg-white border border-nexus-border rounded-xl focus:outline-none focus:border-nexus-primary font-medium shadow-xs cursor-pointer"
                  >
                    <option value="Approval Bureau (AB)">Approval Bureau (AB) — Affiliation Review</option>
                    <option value="Regulation Bureau (RB)">Regulation Bureau (RB) — Course Scrutiny</option>
                    <option value="Vigilance Cell">Vigilance Cell — Severe Misconduct Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-nexus-navy mb-1.5">Originating Case:</label>
                  <input
                    type="text"
                    disabled
                    value="CASE-2026-0104 · Withholding Marksheets & Fee Refund"
                    className="w-full text-xs p-3 bg-slate-200/60 border border-slate-300 rounded-xl text-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-nexus-navy mb-1.5">Mandatory Administrative Justification:</label>
                <input
                  type="text"
                  value={transferReason}
                  onChange={e => setTransferReason(e.target.value)}
                  className="w-full text-xs p-3 bg-white border border-nexus-border rounded-xl focus:outline-none focus:border-nexus-primary font-medium shadow-xs"
                />
                {/* Preset Quick Chips */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[11px] text-slate-400">Quick presets:</span>
                  <button
                    type="button"
                    onClick={() => setTransferReason('Re-inspection required under AICTE Approval Process Handbook (APH 2026-27 Clause 7.3)')}
                    className="text-[10px] font-semibold bg-white border border-slate-200 hover:border-nexus-primary px-2.5 py-1 rounded-lg text-slate-600 transition cursor-pointer"
                  >
                    APH Clause 7.3
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferReason('Unapproved faculty intake discrepancy requires Academic Directorate verification')}
                    className="text-[10px] font-semibold bg-white border border-slate-200 hover:border-nexus-primary px-2.5 py-1 rounded-lg text-slate-600 transition cursor-pointer"
                  >
                    Faculty Discrepancy
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleExecuteHandshake}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-emerald-600/20 transition group cursor-pointer"
                >
                  <Share2 className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  <span>Execute Formal Handshake</span>
                </button>

                {transferHandshakeExecuted && (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Transferred to {transferTargetBureau} with Cryptographic Audit Stamp!</span>
                  </span>
                )}
              </div>
            </div>

            {/* Real Immutable Audit Block */}
            {transferHandshakeExecuted && (
              <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 font-mono text-xs space-y-3 animate-in fade-in shadow-xl">
                <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2.5">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>IMMUTABLE AUDIT LOG ENTRY GENERATED</span>
                  </span>
                  <span className="text-emerald-400 font-bold">STATUS: COMMITTED & SEALED</span>
                </div>
                <div className="text-[11px] leading-relaxed text-slate-300 space-y-1">
                  <div><strong>EVENT_TYPE:</strong> CASE_BUREAU_TRANSFER_HANDSHAKE</div>
                  <div><strong>TIMESTAMP:</strong> {new Date().toISOString()}</div>
                  <div><strong>INITIATING_OFFICER:</strong> Er. Neha Sharma (Desk Officer)</div>
                  <div><strong>TARGET_BUREAU:</strong> {transferTargetBureau}</div>
                  <div><strong>REASON:</strong> {transferReason}</div>
                  <div><strong>AUDIT_DIGEST_SHA256:</strong> <span className="text-cyan-300">{handshakeHash}</span></div>
                </div>
              </div>
            )}

            {/* Bottom API & Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-nexus-border text-xs">
              <span className="text-slate-500">
                Live REST Endpoint: <code className="font-mono text-nexus-primary bg-nexus-primary-subtle px-2 py-0.5 rounded">POST /cases/:id/transfer</code>
              </span>
              <button
                type="button"
                onClick={() => onEnterPortal('auditor', 'audit')}
                className="font-bold text-nexus-primary hover:text-nexus-primary-hover flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Inspect Immutable Audit Ledger as Vigilance Auditor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
