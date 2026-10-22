import React, { useState, useEffect } from 'react';
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowRight,
  ShieldCheck,
  Send,
  Upload,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { Case, Institution } from '../types';
import { useDemo } from '../context/DemoContext';

export const StudentDashboardView: React.FC = () => {
  const { currentUser, setActiveCaseId, showToast, triggerRefresh, refreshKey } = useDemo();
  const [myCases, setMyCases] = useState<Case[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilingForm, setShowFilingForm] = useState(false);

  // Filing form state
  const [selectedInstId, setSelectedInstId] = useState('');
  const [category, setCategory] = useState('Student Grievance');
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('High');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.getCases({ q: 'Aarav', pageSize: 10 }),
      api.getInstitutions()
    ])
      .then(([casesRes, instRes]) => {
        // If query by name returns results, use them, otherwise list student grievance cases
        if (casesRes.data.length > 0) {
          setMyCases(casesRes.data);
        } else {
          api.getCases({ category: 'Student Grievance', pageSize: 5 }).then(fallback => {
            setMyCases(fallback.data);
          });
        }
        setInstitutions(instRes.data);
        if (instRes.data.length > 0) {
          setSelectedInstId(instRes.data[0].id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  const handleFileGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim() || summary.length < 20) {
      showToast('Please provide a descriptive explanation of your grievance (min 20 characters).', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Find PGRC bureau
      const bureausRes = await api.getBureaus();
      const pgrcBureau = bureausRes.data.find(b => b.code === 'BUR-PGRC') || bureausRes.data[0];

      const newCase = await api.createCase({
        institutionId: selectedInstId,
        category,
        priority,
        summary: summary.trim(),
        currentBureauId: pgrcBureau.id,
        complainantName: isAnonymous ? 'Anonymous Student (Protected)' : currentUser?.display_name || 'Aarav Sharma',
        complainantEmail: isAnonymous ? null : currentUser?.demo_email || 'aarav.sharma@student.demo',
        isAnonymous
      });

      showToast(`Grievance registered successfully! Case Tracking ID: ${newCase.data.case_number}`, 'success');
      setSummary('');
      setShowFilingForm(false);
      triggerRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to file grievance', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-500/30 text-blue-200 px-2.5 py-0.5 rounded-full border border-blue-400/30">
              Student Grievance Redressal Portal
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold">
            Welcome, {currentUser?.display_name || 'Aarav Sharma'}
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            {currentUser?.designation || '3rd Year B.Tech Student, Computer Science'} • Roll No: 2023CS041
          </p>
        </div>

        <button
          onClick={() => setShowFilingForm(prev => !prev)}
          className="flex items-center gap-2 bg-nexus-primary hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showFilingForm ? 'View My Complaints' : 'File New Grievance'}</span>
        </button>
      </div>

      {/* Grievance Filing Wizard */}
      {showFilingForm && (
        <div className="bg-white border border-nexus-border rounded-2xl p-5 sm:p-6 shadow-nexus-card animate-in fade-in duration-150">
          <div className="border-b border-nexus-border pb-3 mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-nexus-navy">Register Institutional Grievance</h3>
              <p className="text-xs text-nexus-navy-muted">
                Directly submitted to the AICTE Public Grievance Redressal Cell (PGRC) under Citizen Charter SLA rules.
              </p>
            </div>
          </div>

          <form onSubmit={handleFileGrievance} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-nexus-navy mb-1.5">
                  Target Technical Institution <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedInstId}
                  onChange={e => setSelectedInstId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-nexus-border focus:border-nexus-primary bg-white"
                  required
                >
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.institution_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-nexus-navy mb-1.5">
                  Grievance Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-nexus-border focus:border-nexus-primary bg-white"
                >
                  <option value="Student Grievance">Student Grievance (General)</option>
                  <option value="Fee & Admissions">Refusal of Fee Refund / Capitation Fee</option>
                  <option value="Regulation Violation">Denial / Withholding of Original Certificates</option>
                  <option value="Academic">Faculty Unavailability & Cadre Ratio Deficiency</option>
                  <option value="Infrastructure">Laboratory & Hostel Safety Deficiency</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-nexus-navy mb-1.5">
                Detailed Statement of Grievance <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="State the facts clearly, including date of admission, receipts held, and formal representations submitted to the college administration..."
                className="w-full text-xs p-3 rounded-xl border border-nexus-border focus:outline-none focus:ring-2 focus:ring-nexus-primary/20 focus:border-nexus-primary leading-relaxed resize-none"
                required
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-nexus-navy select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-nexus-primary focus:ring-nexus-primary border-slate-300"
                />
                <span className="font-medium">File as Whistleblower (Hide my name and roll number from the college)</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilingForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-nexus-navy-muted hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2 bg-nexus-primary hover:bg-nexus-primary-hover text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Registering...' : 'Submit Grievance to AICTE'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Active Complaints List */}
      <div className="bg-white border border-nexus-border rounded-2xl p-5 sm:p-6 shadow-nexus-card space-y-4">
        <div className="flex items-center justify-between border-b border-nexus-border pb-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-nexus-navy">My Registered Grievance Petitions</h3>
            <p className="text-xs text-nexus-navy-muted">Real-time status tracking with transparent SLA deadline enforcement.</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
            {myCases.length} Registered Case{myCases.length !== 1 ? 's' : ''}
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-nexus-navy-muted">
            <div className="w-7 h-7 border-2 border-nexus-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading your grievance records...
          </div>
        ) : myCases.length === 0 ? (
          <div className="py-12 text-center text-xs text-nexus-navy-muted">
            You do not have any pending grievances on file.
          </div>
        ) : (
          <div className="space-y-4">
            {myCases.map(c => (
              <div
                key={c.id}
                className="border border-nexus-border rounded-xl p-4 sm:p-5 hover:border-nexus-primary-border transition bg-slate-50/50 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-nexus-primary bg-nexus-primary-subtle px-2.5 py-0.5 rounded border border-nexus-primary-border">
                        {c.case_number}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {c.category}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        c.status === 'Resolved' || c.status === 'Closed' || c.status === 'Disposed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        Status: {c.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-nexus-navy flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{c.institution_name}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveCaseId(c.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-nexus-primary hover:text-nexus-primary-hover bg-white px-3 py-1.5 rounded-lg border border-nexus-border shadow-xs transition"
                  >
                    <span>Inspect Investigation Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {c.summary}
                </p>

                {/* Milestone Stepper */}
                <div className="bg-white p-3.5 rounded-xl border border-nexus-border space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Milestone Progress Stepper
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>1. Registered</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>2. Assigned to PGRC</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700 font-medium">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>3. Notice to College</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                      <span>4. Resolved</span>
                    </div>
                  </div>
                </div>

                {/* SLA Countdown Card */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-nexus-primary" />
                    <span>AICTE Citizen Charter SLA: Target Resolution within 15 Days</span>
                  </span>
                  <span className="font-semibold text-nexus-navy">
                    Expected Disposal: {c.due_at ? new Date(c.due_at).toLocaleDateString() : 'Active Review'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
