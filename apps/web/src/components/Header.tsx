import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  UserCheck,
  ChevronDown,
  Building2,
  FileText,
  Plus,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Briefcase,
  Menu
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { Institution, Case } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onToggleMobileMenu }) => {
  const {
    currentUser,
    users,
    setCurrentUser,
    setActiveCaseId,
    setActiveInstitutionId,
    setIsNewCaseModalOpen,
    showToast,
    triggerRefresh
  } = useDemo();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ institutions: Institution[]; cases: Case[] }>({
    institutions: [],
    cases: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (personaRef.current && !personaRef.current.contains(event.target as Node)) {
        setIsPersonaOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global search autocomplete
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults({ institutions: [], cases: [] });
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [instRes, casesRes] = await Promise.all([
          api.getInstitutions(searchQuery),
          api.getCases({ q: searchQuery, pageSize: 5 })
        ]);
        setSearchResults({
          institutions: instRes.data.slice(0, 4),
          cases: casesRes.data.slice(0, 5)
        });
        setIsSearchOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResetData = async () => {
    if (!window.confirm('Reset/seed demo dataset with 8 institutions and 20 sample cases?')) {
      return;
    }

    try {
      setIsResetting(true);
      await api.resetDemoData();
      showToast('Demo dataset successfully populated and restored to seed state!', 'success');
      triggerRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to reset demo data', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const canCreateCase = currentUser?.role === 'leadership' ||
    currentUser?.role === 'bureau_official' ||
    currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-nexus-card border-b border-nexus-border shadow-sm">
      {/* Top Demo Disclaimer Banner */}
      <div className="bg-gradient-to-r from-nexus-navy to-slate-900 text-white text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2 font-medium">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="bg-nexus-danger/90 text-white text-[9px] sm:text-[10px] font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded shrink-0">
            DEMO ENVIRONMENT
          </span>
          <span className="text-slate-300 hidden md:inline truncate">
            Sample data only · Non-production simulation for Smart Automation (SIH PS 26264)
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-slate-300 text-[10px] sm:text-[11px] shrink-0">
          <span className="hidden lg:inline">AICTE Regulation Bureau</span>
          <span className="text-slate-500 hidden lg:inline">•</span>
          <span className="font-mono text-slate-400 hidden sm:inline">Demo Clock: Oct 2026</span>
          <button
            onClick={handleResetData}
            disabled={isResetting}
            className="flex items-center gap-1 text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition text-[10px] sm:text-[11px]"
            title="Populate or restore original seed data"
          >
            <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Seeding...' : 'Reset / Seed Data'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Hamburger & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 rounded-lg text-nexus-navy hover:bg-nexus-bg transition"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-nexus-navy" />
            </button>
          )}

          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-nexus-primary flex items-center justify-center text-white shadow-md shadow-nexus-primary/25 shrink-0">
              <span className="font-bold text-base sm:text-lg tracking-tight">N0</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-base sm:text-lg text-nexus-navy tracking-tight">Nexus 0</span>
                <span className="text-[10px] sm:text-xs bg-nexus-primary-subtle text-nexus-primary font-semibold px-1.5 sm:px-2 py-0.5 rounded-full border border-nexus-primary-border">
                  AICTE OneView
                </span>
              </div>
              <p className="text-[11px] text-nexus-navy-muted leading-tight hidden lg:block">
                Consolidated Institution Oversight & Grievance Coordination
              </p>
            </div>
          </div>
        </div>

        {/* Global Institution & Case Search */}
        <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-lg relative" ref={searchRef}>
          <div className="relative">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-nexus-navy-light absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchResults.institutions.length || searchResults.cases.length) setIsSearchOpen(true); }}
              placeholder="Search institutions or cases..."
              className="w-full bg-nexus-bg text-nexus-navy placeholder-nexus-navy-light text-xs sm:text-sm pl-7 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 rounded-lg border border-nexus-border focus:border-nexus-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexus-primary/20 transition"
            />
            {isSearching && (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-nexus-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && (searchResults.institutions.length > 0 || searchResults.cases.length > 0) && (
            <div className="absolute left-0 right-0 mt-2 bg-nexus-card border border-nexus-border rounded-xl shadow-nexus-dropdown overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              {searchResults.institutions.length > 0 && (
                <div className="p-2 border-b border-nexus-border">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-nexus-navy-muted px-2 py-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-nexus-primary" />
                    <span>Institutions (OneView Profiles)</span>
                  </div>
                  {searchResults.institutions.map(inst => (
                    <div
                      key={inst.id}
                      onClick={() => {
                        setActiveInstitutionId(inst.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="px-2.5 py-2 hover:bg-nexus-bg rounded-lg cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-nexus-navy">{inst.name}</div>
                        <div className="text-xs text-nexus-navy-muted font-mono">{inst.institution_code} • {inst.city}, {inst.state}</div>
                      </div>
                      <span className="text-[11px] font-medium bg-nexus-primary-subtle text-nexus-primary px-2 py-0.5 rounded-full">
                        {inst.case_count || 0} linked cases
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.cases.length > 0 && (
                <div className="p-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-nexus-navy-muted px-2 py-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-nexus-primary" />
                    <span>Cases & Grievances</span>
                  </div>
                  {searchResults.cases.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setActiveCaseId(c.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="px-2.5 py-2 hover:bg-nexus-bg rounded-lg cursor-pointer transition flex items-center justify-between"
                    >
                      <div className="truncate mr-3">
                        <div className="text-sm font-medium text-nexus-navy flex items-center gap-2">
                          <span className="font-mono text-nexus-primary font-semibold">{c.case_number}</span>
                          <span className="text-xs text-nexus-navy-muted truncate">{c.summary}</span>
                        </div>
                        <div className="text-xs text-nexus-navy-light">{c.institution_name} • {c.category}</div>
                      </div>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        c.status === 'Resolved' || c.status === 'Closed'
                          ? 'bg-nexus-success-light text-nexus-success-text'
                          : c.is_overdue
                          ? 'bg-nexus-danger-light text-nexus-danger-text'
                          : 'bg-nexus-warning-light text-nexus-warning-text'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls & Persona Switcher */}
        <div className="flex items-center gap-3">
          {canCreateCase && (
            <button
              onClick={() => setIsNewCaseModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 bg-nexus-primary hover:bg-nexus-primary-hover text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm shadow-nexus-primary/25 transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Log Case</span>
            </button>
          )}

          {/* Interactive Persona Switcher Dropdown */}
          <div className="relative" ref={personaRef}>
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl border border-nexus-border bg-white hover:border-nexus-primary/50 transition shadow-sm text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-nexus-primary-subtle text-nexus-primary flex items-center justify-center font-bold text-xs">
                {currentUser?.display_name?.slice(0, 2).toUpperCase() || 'US'}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-nexus-navy leading-tight flex items-center gap-1.5">
                  <span>{currentUser?.display_name || 'Loading...'}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    currentUser?.role === 'leadership' ? 'bg-purple-100 text-purple-700' :
                    currentUser?.role === 'bureau_official' ? 'bg-blue-100 text-blue-700' :
                    currentUser?.role === 'case_handler' ? 'bg-emerald-100 text-emerald-700' :
                    currentUser?.role === 'auditor' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {currentUser?.role?.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-nexus-navy-muted leading-tight">
                  {currentUser?.designation || 'Demo Official'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-nexus-navy-light" />
            </button>

            {/* Persona Switcher Menu */}
            {isPersonaOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-nexus-card border border-nexus-border rounded-xl shadow-nexus-dropdown overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-3 bg-nexus-bg border-b border-nexus-border">
                  <div className="text-xs font-bold text-nexus-navy">Select Demo Persona</div>
                  <div className="text-[11px] text-nexus-navy-muted">
                    Switch identities to test role-based coordination & backend RBAC
                  </div>
                </div>

                <div className="p-1.5 max-h-96 overflow-y-auto divide-y divide-nexus-border/50">
                  {users.map(u => {
                    const isSelected = u.id === currentUser?.id;
                    return (
                      <div
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setIsPersonaOpen(false);
                        }}
                        className={`p-2.5 rounded-lg cursor-pointer transition flex items-start gap-2.5 ${
                          isSelected ? 'bg-nexus-primary-subtle/70' : 'hover:bg-nexus-bg'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs mt-0.5 ${
                          isSelected ? 'bg-nexus-primary text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {u.display_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-nexus-navy">{u.display_name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              u.role === 'leadership' ? 'bg-purple-100 text-purple-700' :
                              u.role === 'bureau_official' ? 'bg-blue-100 text-blue-700' :
                              u.role === 'case_handler' ? 'bg-emerald-100 text-emerald-700' :
                              u.role === 'auditor' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {u.role.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-[11px] text-nexus-navy-muted">{u.designation}</div>
                          {u.bureau_name && (
                            <div className="text-[10px] text-nexus-primary font-medium flex items-center gap-1 mt-0.5">
                              <Briefcase className="w-2.5 h-2.5" />
                              <span>{u.bureau_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-nexus-border text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Simulated Session</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live RBAC Active
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
