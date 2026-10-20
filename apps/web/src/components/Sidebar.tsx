import React from 'react';
import {
  LayoutDashboard,
  Building2,
  FileSpreadsheet,
  BarChart3,
  ShieldCheck,
  Settings2,
  Sparkles,
  X
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  caseCount?: number;
  overdueCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  caseCount = 20,
  overdueCount = 6,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const { currentUser } = useDemo();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview, KPIs & intake trends'
    },
    {
      id: 'institutions',
      label: 'Institutions',
      icon: Building2,
      badge: 'OneView',
      description: 'Consolidated cases per college'
    },
    {
      id: 'cases',
      label: 'Cases & Grievances',
      icon: FileSpreadsheet,
      badge: overdueCount > 0 ? `${overdueCount} Overdue` : `${caseCount}`,
      badgeColor: overdueCount > 0 ? 'bg-nexus-danger-light text-nexus-danger-text' : 'bg-slate-100 text-slate-700',
      description: 'Workflow, assignment & status'
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      description: 'SLA metrics, age bands & CSV export'
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: ShieldCheck,
      description: 'Immutable event logs & compliance'
    },
    {
      id: 'admin',
      label: 'Demo Controls',
      icon: Settings2,
      description: 'Role permissions & state reset'
    }
  ];

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-nexus-navy-muted flex items-center justify-between">
          <span>Operations Rail</span>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition group ${
                isActive
                  ? 'bg-nexus-primary text-white font-medium shadow-sm shadow-nexus-primary/20'
                  : 'text-nexus-navy-muted hover:text-nexus-navy hover:bg-nexus-bg'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-nexus-navy-light group-hover:text-nexus-primary'}`} />
                <span className="text-sm truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Role Context & Regulatory Badge at Bottom */}
      <div className="p-3 border-t border-nexus-border bg-slate-50/60">
        <div className="p-2.5 rounded-lg border border-nexus-border bg-white space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-nexus-primary" />
            <span className="text-xs font-semibold text-nexus-navy">Smart Automation</span>
          </div>
          <p className="text-[11px] text-nexus-navy-muted leading-relaxed">
            Consolidating multi-bureau workflows for AICTE Regulation Bureau.
          </p>
          <div className="pt-1.5 border-t border-nexus-border/60 flex items-center justify-between text-[10px] text-nexus-navy-light">
            <span>Role Scope</span>
            <span className="font-semibold text-nexus-navy uppercase">{currentUser?.role?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (Visible on lg+) */}
      <aside className="hidden lg:flex w-64 bg-nexus-card border-r border-nexus-border flex-col justify-between shrink-0 h-[calc(100vh-6rem)] sticky top-24 rounded-2xl shadow-nexus-card overflow-hidden">
        {navContent}
      </aside>

      {/* Mobile Slide-in Drawer (Visible on < lg when isMobileOpen) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-nexus-navy/50 backdrop-blur-sm transition-opacity duration-200"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
