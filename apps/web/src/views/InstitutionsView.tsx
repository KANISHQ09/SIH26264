import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  MapPin,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { api } from '../services/api';
import { Institution } from '../types';
import { useDemo } from '../context/DemoContext';

export const InstitutionsView: React.FC = () => {
  const { setActiveInstitutionId, refreshKey } = useDemo();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getInstitutions(search)
      .then(res => setInstitutions(res.data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [search, refreshKey]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Principle Callout */}
      <div className="bg-white border border-nexus-border rounded-2xl p-6 shadow-nexus-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-nexus-navy">Institution Coordination Directory</h1>
            <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              AICTE OneView Core
            </span>
          </div>
          <p className="text-xs text-nexus-navy-muted leading-relaxed">
            *One institution. One consolidated case view.* Select any college to inspect all past and active grievances registered across every Bureau and Cell.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-nexus-navy-light absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by college name, code, or city..."
            className="w-full bg-nexus-bg text-nexus-navy placeholder-nexus-navy-light text-xs pl-9 pr-4 py-2.5 rounded-xl border border-nexus-border focus:border-nexus-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexus-primary/20 transition"
          />
        </div>
      </div>

      {/* Grid of Institution Cards */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-nexus-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-nexus-navy-muted">Loading institution directory...</p>
        </div>
      ) : institutions.length === 0 ? (
        <div className="py-16 text-center text-xs text-nexus-navy-muted bg-white rounded-2xl border border-nexus-border p-8">
          No institutions found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {institutions.map(inst => (
            <div
              key={inst.id}
              onClick={() => setActiveInstitutionId(inst.id)}
              className="bg-white border border-nexus-border rounded-2xl p-5 shadow-nexus-card hover:border-nexus-primary hover:shadow-nexus-elevated transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-nexus-primary-subtle text-nexus-primary flex items-center justify-center font-bold shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {inst.institution_code}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-nexus-navy group-hover:text-nexus-primary transition leading-snug mb-1">
                  {inst.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-nexus-navy-muted mb-3 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-nexus-navy-light shrink-0" />
                  <span>{inst.city}, {inst.state}</span>
                  <span>•</span>
                  <span className="text-nexus-navy-light truncate">{inst.institution_type}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-nexus-border/60 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <div>
                    <span className="text-nexus-navy-muted">Cases: </span>
                    <strong className="text-nexus-navy">{inst.case_count || 0}</strong>
                  </div>
                  {(inst.overdue_case_count ?? 0) > 0 && (
                    <div className="text-nexus-danger font-semibold flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{inst.overdue_case_count} overdue</span>
                    </div>
                  )}
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-semibold text-nexus-primary group-hover:translate-x-0.5 transition">
                  <span>OneView</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
