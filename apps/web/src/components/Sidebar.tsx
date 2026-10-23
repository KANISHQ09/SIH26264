import React from 'react';
import {
  LayoutDashboard,
  Building2,
  FileSpreadsheet,
  BarChart3,
  ShieldCheck,
  GraduationCap,
  FileCheck,
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

  const isStudent = currentUser?.role === 'student';
  const isInstitution = currentUser?.role === 'institution';

  let navItems: any[] = [];

  if (isStudent) {
    navItems = [
      {
        id: 'student_dashboard',
        label: 'My Grievances',
        icon: GraduationCap,
        description: 'File & track personal complaints'
      },
      {
        id: 'institutions',
        label: 'AICTE Colleges',
        icon: Building2,
        badge: 'OneView',
        description: 'Search approved technical colleges'
      },
      {
        id: 'cases',
        label: 'Public Grievance Registry',
        icon: FileSpreadsheet,
        description: 'Disposed & active case milestones'
      }
    ];
  } else if (isInstitution) {
    navItems = [
      {
        id: 'institution_dashboard',
        label: 'Compliance & ATR Desk',
        icon: FileCheck,
        badge: 'Action Required',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        description: 'Submit Action Taken Reports'
      },
      {
        id: 'institutions',
        label: 'College Dossier',
        icon: Building2,
        badge: 'OneView',
        description: 'Cross-bureau inquiry history'
      },
      {
        id: 'cases',
        label: 'Active Notices',
        icon: FileSpreadsheet,
        badge: overdueCount > 0 ? `${overdueCount} Overdue` : undefined,
        badgeColor: 'bg-rose-100 text-rose-800',
        description: 'Show-cause notices & scrutiny'
      },
      {
        id: 'reports',
        label: 'Annual Reports',
        icon: BarChart3,
        description: 'Disposal rate & compliance history'
      }
    ];
  } else {
    navItems = [
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
      }
    ];
  }

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


    </div>
  );

  return (
    <>
      {/* Desktop Sticky Rail */}
      <aside className="hidden lg:block w-64 bg-nexus-card border border-nexus-border rounded-2xl shadow-nexus-card overflow-hidden shrink-0 self-start sticky top-20">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-nexus-navy/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-nexus-card shadow-xl z-50 overflow-y-auto">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
