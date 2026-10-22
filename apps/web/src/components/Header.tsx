import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck,
  ChevronDown,
  Plus,
  AlertTriangle,
  ShieldAlert,
  Briefcase,
  Menu
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { NexusLogo } from './NexusLogo';

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
    setIsNewCaseModalOpen,
    setIsSignInModalOpen
  } = useDemo();

  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (personaRef.current && !personaRef.current.contains(event.target as Node)) {
        setIsPersonaOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const canCreateCase = currentUser?.role === 'leadership' ||
    currentUser?.role === 'bureau_official' ||
    currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-nexus-card border-b border-nexus-border shadow-sm">

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

          <div
            className="cursor-pointer select-none hover:opacity-90 transition-opacity"
            onClick={() => setCurrentTab('landing')}
            title="Return to Public Landing Page"
          >
            <NexusLogo
              variant="light"
              size="sm"
              subtitle="Consolidated Institution Oversight & Grievance Coordination"
            />
          </div>
        </div>

        {/* Action Controls & Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">

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
                    currentUser?.role === 'student' ? 'bg-amber-100 text-amber-800' :
                    currentUser?.role === 'institution' ? 'bg-teal-100 text-teal-800' :
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
                <div className="p-3 bg-nexus-bg border-b border-nexus-border flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-nexus-navy">Select Demo Persona (8 Roles)</div>
                    <div className="text-[10px] text-nexus-navy-muted">
                      Switch identities to test role-based coordination & RBAC
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsPersonaOpen(false);
                      setIsSignInModalOpen(true);
                    }}
                    className="text-[11px] font-semibold text-nexus-primary hover:underline"
                  >
                    All Personas
                  </button>
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-nexus-navy truncate">{u.display_name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${
                              u.role === 'leadership' ? 'bg-purple-100 text-purple-700' :
                              u.role === 'bureau_official' ? 'bg-blue-100 text-blue-700' :
                              u.role === 'case_handler' ? 'bg-emerald-100 text-emerald-700' :
                              u.role === 'auditor' ? 'bg-amber-100 text-amber-700' :
                              u.role === 'student' ? 'bg-amber-100 text-amber-800' :
                              u.role === 'institution' ? 'bg-teal-100 text-teal-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {u.role.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-[11px] text-nexus-navy-muted truncate">{u.designation}</div>
                          {u.bureau_name && (
                            <div className="text-[10px] text-nexus-primary font-medium flex items-center gap-1 mt-0.5 truncate">
                              <Briefcase className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{u.bureau_name}</span>
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
