import React, { useState } from 'react';
import { DemoProvider, useDemo } from './context/DemoContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { CaseDetailModal } from './components/CaseDetailModal';
import { InstitutionDetailModal } from './components/InstitutionDetailModal';
import { NewCaseModal } from './components/NewCaseModal';

import { DashboardView } from './views/DashboardView';
import { InstitutionsView } from './views/InstitutionsView';
import { CasesView } from './views/CasesView';
import { ReportsView } from './views/ReportsView';
import { AuditTrailView } from './views/AuditTrailView';
import { DemoAdminView } from './views/DemoAdminView';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [casesFilter, setCasesFilter] = useState<any>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { activeCaseId, setActiveCaseId, activeInstitutionId, setActiveInstitutionId } = useDemo();

  const handleNavigateToCases = (filter?: any) => {
    setCasesFilter(filter);
    setCurrentTab('cases');
  };

  const handleNavigateToInstitutions = () => {
    setCurrentTab('institutions');
  };

  return (
    <div className="min-h-screen bg-nexus-bg text-nexus-navy flex flex-col font-sans">
      {/* Top Navigation & Role Bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Left Operations Rail */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            if (tab === 'cases') setCasesFilter(undefined);
            setCurrentTab(tab);
          }}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic View Canvas */}
        <main className="flex-1 min-w-0">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigateToCases={handleNavigateToCases}
              onNavigateToInstitutions={handleNavigateToInstitutions}
            />
          )}

          {currentTab === 'institutions' && <InstitutionsView />}

          {currentTab === 'cases' && <CasesView initialFilter={casesFilter} />}

          {currentTab === 'reports' && <ReportsView />}

          {currentTab === 'audit' && <AuditTrailView />}

          {currentTab === 'admin' && <DemoAdminView />}
        </main>
      </div>

      {/* Global Modals & Workspace Drawers */}
      <CaseDetailModal
        caseId={activeCaseId}
        onClose={() => setActiveCaseId(null)}
      />

      <InstitutionDetailModal
        institutionId={activeInstitutionId}
        onClose={() => setActiveInstitutionId(null)}
      />

      <NewCaseModal />

      {/* Global Toast Stack */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <DemoProvider>
      <MainLayout />
    </DemoProvider>
  );
}

export default App;
