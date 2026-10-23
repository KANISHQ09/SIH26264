import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Clock,
  Activity,
  Share2,
  CheckCircle2,
  Lock,
  Building2,
  Scale,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { DemoRole } from '../types';

interface InteractiveWorkflowsShowcaseProps {
  onEnterPortal: (role?: DemoRole, targetTab?: string) => void;
}

type TabType = 'overlap' | 'sla' | 'risk' | 'transfer';

interface FeatureDef {
  id: TabType;
  num: string;
  tag: string;
  title: string;
  shortDesc: string;
  headline: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeColor: string;
  progressGradient: string;
}

const FEATURES: FeatureDef[] = [
  {
    id: 'overlap',
    num: '01',
    tag: 'Overlap Lock',
    title: 'Overlap Detection',
    shortDesc: 'Blocks conflicting orders',
    headline: 'Multi-Bureau Collision Detector',
    subtitle: 'Prevents independent AICTE bureaus from issuing contradictory or duplicate orders to the same college.',
    icon: AlertTriangle,
    accentColor: 'amber',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    progressGradient: 'bg-amber-500'
  },
  {
    id: 'sla',
    num: '02',
    tag: 'SLA Ladder',
    title: 'SLA Escalation',
    shortDesc: 'Auto-escalates before deadlines',
    headline: 'Statutory SLA Escalation Ladder',
    subtitle: 'Automated 14-day countdown timers that systematically escalate unresolved grievances from Desk to Bureau Head.',
    icon: Clock,
    accentColor: 'rose',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    progressGradient: 'bg-rose-500'
  },
  {
    id: 'risk',
    num: '03',
    tag: 'Explainable Math',
    title: 'Risk Scorecard',
    shortDesc: 'Transparent 0–100 compliance rating',
    headline: 'Explainable Institutional Risk Scorecard',
    subtitle: 'Computes college compliance health using 100% visible, non-hallucinating arithmetic backed by documented case files.',
    icon: Activity,
    accentColor: 'blue',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    progressGradient: 'bg-blue-600'
  },
  {
    id: 'transfer',
    num: '04',
    tag: 'Custody Seal',
    title: 'Transfer Handshake',
    shortDesc: 'Cryptographic SHA-256 handover',
    headline: 'Cryptographic Custody Handshake',
    subtitle: 'Formal case transfer between bureaus sealed with an immutable SHA-256 audit digest to eliminate lost administrative files.',
    icon: Share2,
    accentColor: 'emerald',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    progressGradient: 'bg-emerald-600'
  }
];

export const InteractiveWorkflowsShowcase: React.FC<InteractiveWorkflowsShowcaseProps> = ({
  onEnterPortal
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overlap');
  const [progress, setProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const CYCLE_DURATION = 7000; // 7 seconds per feature
  const TICK_MS = 50;

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
  const [transferTargetBureau] = useState('Approval Bureau (AB)');
  const [transferReason] = useState('Re-inspection required under AICTE Approval Process Handbook (APH 2026-27 Clause 7.3)');
  const [transferHandshakeExecuted, setTransferHandshakeExecuted] = useState(false);
  const [handshakeHash, setHandshakeHash] = useState('0x8f2a...c4b1');

  const handleExecuteHandshake = () => {
    setTransferHandshakeExecuted(true);
    const mockHash = '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setHandshakeHash(mockHash);
  };

  // Main Auto-Play Loop Effect
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = (TICK_MS / CYCLE_DURATION) * 100;
        if (prev + increment >= 100) {
          setActiveTab(current => {
            const currentIndex = FEATURES.findIndex(f => f.id === current);
            const nextIndex = (currentIndex + 1) % FEATURES.length;
            return FEATURES[nextIndex].id;
          });
          return 0;
        }
        return prev + increment;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered]);

  // Synchronized in-demo progression
  useEffect(() => {
    if (!isAutoPlaying) return;

    if (activeTab === 'overlap') {
      setOverlapSimulated(true);
    } else if (activeTab === 'sla') {
      if (progress < 40) {
        setSlaState('normal');
      } else if (progress < 75) {
        setSlaState('duesoon');
      } else {
        setSlaState('breached');
      }
    } else if (activeTab === 'risk') {
      if (progress < 50) {
        setCalcOverdue(1);
        setCalcRbCases(2);
        setCalcPgrcCases(1);
      } else {
        setCalcOverdue(3);
        setCalcRbCases(3);
        setCalcPgrcCases(2);
      }
    } else if (activeTab === 'transfer') {
      if (progress < 35) {
        setTransferHandshakeExecuted(false);
      } else if (progress >= 35 && !transferHandshakeExecuted) {
        handleExecuteHandshake();
      }
    }
  }, [progress, activeTab, isAutoPlaying]);

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    setProgress(0);
  };

  const handleNextTab = () => {
    const currentIndex = FEATURES.findIndex(f => f.id === activeTab);
    const nextIndex = (currentIndex + 1) % FEATURES.length;
    setActiveTab(FEATURES[nextIndex].id);
    setProgress(0);
  };

  const activeIndex = FEATURES.findIndex(f => f.id === activeTab);
  const currentFeature = FEATURES[activeIndex];

  return (
    <section id="interactive-showcase" className="relative z-20 pt-8 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 bg-nexus-primary/10 border border-nexus-primary/25 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-nexus-primary shadow-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="uppercase tracking-wider">Live Architecture Workflows · AICTE OneView</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-nexus-navy tracking-tight">
          How Nexus Solves Inter-Bureau Blindspots
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
          Traditional portals act as passive mailboxes. Nexus actively coordinates bureaus. Watch the core workflows run one by one in the automated loop below:
        </p>
      </div>

      {/* Segmented Timeline Progress Tabs (Top Horizontal Bar) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        {FEATURES.map((feat, idx) => {
          const isActive = activeTab === feat.id;
          const isPassed = idx < activeIndex;
          const Icon = feat.icon;

          return (
            <button
              key={feat.id}
              type="button"
              onClick={() => handleSelectTab(feat.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isActive
                  ? 'bg-white border-slate-300 shadow-md ring-1 ring-slate-300/50'
                  : 'bg-white/70 hover:bg-white border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[11px] font-bold font-mono px-1.5 py-0.2 rounded ${
                  isActive ? feat.badgeColor : 'bg-slate-100 text-slate-500'
                }`}>
                  {feat.num}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-nexus-navy' : 'text-slate-400'}`} />
              </div>

              <div className={`text-xs font-bold truncate ${isActive ? 'text-nexus-navy' : 'text-slate-700'}`}>
                {feat.title}
              </div>

              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {feat.shortDesc}
              </div>

              {/* Progress Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                <div
                  className={`h-full ${feat.progressGradient} transition-all duration-75 ease-linear`}
                  style={{
                    width: isActive ? `${progress}%` : isPassed ? '100%' : '0%'
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Single Animated Feature Stage Console */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-white rounded-2xl sm:rounded-3xl border border-nexus-border shadow-xl shadow-slate-900/5 overflow-hidden transition-all"
      >
        {/* Console Header Bar */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-xs font-semibold text-slate-300 ml-2">
              nexus://workflows/{activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
              {isHovered ? '❚❚ Paused on Hover' : isAutoPlaying ? `Feature ${activeIndex + 1} of 4` : 'Paused'}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title={isAutoPlaying ? 'Pause Auto-Loop' : 'Resume Auto-Loop'}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleNextTab}
                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Next Workflow Demo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Demo
            </span>
          </div>
        </div>

        {/* Feature Display Stage (Animated on loop transition) */}
        <div key={activeTab} className="p-5 sm:p-7 space-y-5 animate-in fade-in duration-300">
          {/* =========================================================================
              FEATURE 1: OVERLAP DETECTION
              ========================================================================= */}
          {activeTab === 'overlap' && (
            <div className="space-y-5">
              {/* Feature Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-nexus-border pb-4">
                <div>
                  <h3 className="text-lg font-bold text-nexus-navy">
                    {currentFeature.headline}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentFeature.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-nexus-border shrink-0 text-xs">
                  <span className="text-slate-600 font-medium">Simulate Overlap:</span>
                  <button
                    type="button"
                    onClick={() => setOverlapSimulated(!overlapSimulated)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                      overlapSimulated ? 'bg-amber-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        overlapSimulated ? 'translate-x-4' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`font-bold ${overlapSimulated ? 'text-amber-700' : 'text-slate-400'}`}>
                    {overlapSimulated ? 'Active' : 'Off'}
                  </span>
                </div>
              </div>

              {/* Simulation Canvas */}
              {overlapSimulated ? (
                <div className="space-y-3.5">
                  <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-amber-950">
                        Simultaneous Inquiries Detected on RGPV Institute
                      </div>
                      <div className="text-amber-900/80">
                        Regulation Bureau and Grievance Cell both opened inquiries on the same college. Unilateral penalty orders are automatically frozen.
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                      <div className="bg-slate-800/80 border border-blue-500/30 rounded-lg p-3 space-y-1">
                        <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded">
                          Regulation Bureau (RB)
                        </span>
                        <div className="text-xs font-semibold text-white">Intake expansion inquiry</div>
                        <div className="text-[11px] text-slate-400">Target: RGPV Institute</div>
                      </div>

                      <div className="flex flex-col items-center justify-center p-2 text-center space-y-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                          <Lock className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="font-bold text-xs text-cyan-300">Coordination Lock</div>
                        <div className="text-[10px] text-slate-400">Contradictory orders blocked</div>
                      </div>

                      <div className="bg-slate-800/80 border border-sky-500/30 rounded-lg p-3 space-y-1">
                        <span className="text-[10px] font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded">
                          Grievance Cell (PGRC)
                        </span>
                        <div className="text-xs font-semibold text-white">Fee refund dispute</div>
                        <div className="text-[11px] text-slate-400">Target: RGPV Institute</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-xs space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                  <div className="font-bold text-slate-700">No Conflicting Inquiries Detected</div>
                  <div className="text-slate-500">Bureaus operate without overlapping institutional directives.</div>
                </div>
              )}

              {/* Outcome Callout */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                <span className="text-emerald-900 font-medium">
                  ✓ <strong>Outcome:</strong> Bureau officers collaborate in a single joint dossier instead of penalizing the college twice.
                </span>
                <button
                  type="button"
                  onClick={() => onEnterPortal('leadership', 'institutions')}
                  className="text-nexus-primary font-bold hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>View in Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              FEATURE 2: SLA ESCALATION LADDER
              ========================================================================= */}
          {activeTab === 'sla' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-nexus-border pb-4">
                <div>
                  <h3 className="text-lg font-bold text-nexus-navy">
                    {currentFeature.headline}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentFeature.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium shrink-0">
                  <button
                    type="button"
                    onClick={() => setSlaState('normal')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      slaState === 'normal' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    On Track
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlaState('duesoon')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      slaState === 'duesoon' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Due Soon
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlaState('breached')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      slaState === 'breached' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Breached
                  </button>
                </div>
              </div>

              {/* Countdown Banner */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                slaState === 'normal' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' :
                slaState === 'duesoon' ? 'bg-amber-50 border-amber-300 text-amber-950' :
                'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    slaState === 'normal' ? 'bg-emerald-600 text-white' :
                    slaState === 'duesoon' ? 'bg-amber-500 text-white' :
                    'bg-rose-600 text-white'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide opacity-80">
                      Statutory SLA Countdown (14 Days Target)
                    </div>
                    <div className="text-lg font-black tabular-nums">
                      {slaState === 'normal' ? '7 Days 14 Hours Remaining' :
                       slaState === 'duesoon' ? `18 Hours ${secondsTick}s (Priority Warning)` :
                       'BREACH OVERDUE (+2 Days Elapsed)'}
                    </div>
                  </div>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${
                  slaState === 'normal' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  slaState === 'duesoon' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-rose-100 text-rose-800 border-rose-300'
                }`}>
                  {slaState === 'normal' ? '● On Track' :
                   slaState === 'duesoon' ? '⚠️ Due in <48h' :
                   '🚨 Auto-Escalated'}
                </span>
              </div>

              {/* 3 Escalation Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-3.5 rounded-xl border text-xs transition ${
                  slaState === 'normal'
                    ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-300/30'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Tier 1 · Desk Officer</div>
                  <div className="font-bold text-nexus-navy mt-1">Er. Neha Sharma</div>
                  <div className="text-slate-500 mt-0.5">Handling Case (Days 1–12)</div>
                </div>

                <div className={`p-3.5 rounded-xl border text-xs transition ${
                  slaState === 'duesoon' || slaState === 'breached'
                    ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-between">
                    <span>Tier 2 · Bureau Head</span>
                    {(slaState === 'duesoon' || slaState === 'breached') && (
                      <span className="text-amber-700 font-bold">● Alert Sent</span>
                    )}
                  </div>
                  <div className="font-bold text-nexus-navy mt-1">Dr. M. S. Manna</div>
                  <div className="text-slate-500 mt-0.5">Supervisory Review (Day 12–14)</div>
                </div>

                <div className={`p-3.5 rounded-xl border text-xs transition ${
                  slaState === 'breached'
                    ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-400/30'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-between">
                    <span>Tier 3 · Council Head</span>
                    {slaState === 'breached' && <span className="text-rose-700 font-bold">● Action Required</span>}
                  </div>
                  <div className="font-bold text-nexus-navy mt-1">Dr. Anil Sahasrabudhe</div>
                  <div className="text-slate-500 mt-0.5">Member Secretary Console</div>
                </div>
              </div>

              {/* Outcome Callout */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                <span className="text-emerald-900 font-medium">
                  ✓ <strong>Outcome:</strong> Deadlines are systematically enforced by code; cases cannot be quietly forgotten.
                </span>
                <button
                  type="button"
                  onClick={() => onEnterPortal('bureau_official', 'cases')}
                  className="text-nexus-primary font-bold hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>View in Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              FEATURE 3: RISK SCORECARD
              ========================================================================= */}
          {activeTab === 'risk' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-nexus-border pb-4">
                <div>
                  <h3 className="text-lg font-bold text-nexus-navy">
                    {currentFeature.headline}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentFeature.subtitle}
                  </p>
                </div>

                <div className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 ${calculatedRiskTier.color} shrink-0 text-xs font-bold`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${calculatedRiskTier.dot} animate-pulse`} />
                  <span className="text-base tabular-nums font-black">{calculatedScore} / 100</span>
                  <span>({calculatedRiskTier.label})</span>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Overdue Cases (-15 pts):</span>
                    <span className="font-bold text-rose-600 font-mono">{calcOverdue}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={calcOverdue}
                    onChange={e => setCalcOverdue(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                  <div className="text-[11px] text-slate-500 text-right font-medium">
                    -{calcOverdue * 15} pts deduction
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Regulation Cases (-10 pts):</span>
                    <span className="font-bold text-blue-600 font-mono">{calcRbCases}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={calcRbCases}
                    onChange={e => setCalcRbCases(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                  <div className="text-[11px] text-slate-500 text-right font-medium">
                    -{calcRbCases * 10} pts deduction
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Grievances (-5 pts):</span>
                    <span className="font-bold text-sky-600 font-mono">{calcPgrcCases}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={calcPgrcCases}
                    onChange={e => setCalcPgrcCases(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                  <div className="text-[11px] text-slate-500 text-right font-medium">
                    -{calcPgrcCases * 5} pts deduction
                  </div>
                </div>
              </div>

              {/* Transparent Formula Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-nexus-primary" />
                  <span>Deterministic Arithmetic:</span>
                </span>
                <code className="font-mono text-slate-800 text-xs bg-slate-100 px-2.5 py-1 rounded-md">
                  100 - ({calcOverdue} × 15) - ({calcRbCases} × 10) - ({calcPgrcCases} × 5) = <strong className="text-nexus-primary">{calculatedScore} / 100</strong>
                </code>
              </div>

              {/* Outcome Callout */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                <span className="text-emerald-900 font-medium">
                  ✓ <strong>Outcome:</strong> Zero black-box AI. Every point lost is mathematically tied to active records on file.
                </span>
                <button
                  type="button"
                  onClick={() => onEnterPortal('leadership', 'institutions')}
                  className="text-nexus-primary font-bold hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>View in Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              FEATURE 4: TRANSFER HANDSHAKE
              ========================================================================= */}
          {activeTab === 'transfer' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-nexus-border pb-4">
                <div>
                  <h3 className="text-lg font-bold text-nexus-navy">
                    {currentFeature.headline}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentFeature.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Audit Ledger Active</span>
                  </span>
                </div>
              </div>

              {/* Transfer Details Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-800">Transfer Route:</div>
                    <div className="text-slate-600 mt-0.5">
                      <strong>Regulation Bureau</strong> ➔ <strong>{transferTargetBureau}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExecuteHandshake}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition shadow-xs text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{transferHandshakeExecuted ? 'Re-Sign Handshake' : 'Execute Handshake'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500">
                  <strong>Justification:</strong> {transferReason}
                </div>
              </div>

              {/* Cryptographic Seal Box */}
              <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>IMMUTABLE AUDIT LOG ENTRY</span>
                  </span>
                  <span className="text-emerald-400 font-bold">STATUS: SEALED</span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div><strong>EVENT:</strong> CASE_BUREAU_TRANSFER_HANDSHAKE</div>
                  <div><strong>OFFICER:</strong> Er. Neha Sharma (Desk Officer)</div>
                  <div><strong>DIGEST_SHA256:</strong> <span className="text-cyan-300 font-bold">{handshakeHash}</span></div>
                </div>
              </div>

              {/* Outcome Callout */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                <span className="text-emerald-900 font-medium">
                  ✓ <strong>Outcome:</strong> Eliminates lost files in administrative transit; custody is permanently sealed.
                </span>
                <button
                  type="button"
                  onClick={() => onEnterPortal('auditor', 'audit')}
                  className="text-nexus-primary font-bold hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>View in Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
