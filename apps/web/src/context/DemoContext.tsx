import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DemoRole } from '../types';
import { api, setApiDemoIdentity } from '../services/api';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface DemoContextType {
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User) => void;
  switchRole: (role: DemoRole) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  activeCaseId: string | null;
  setActiveCaseId: (id: string | null) => void;
  activeInstitutionId: string | null;
  setActiveInstitutionId: (id: string | null) => void;
  isNewCaseModalOpen: boolean;
  setIsNewCaseModalOpen: (open: boolean) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [activeInstitutionId, setActiveInstitutionId] = useState<string | null>(null);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(k => k + 1);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    setApiDemoIdentity(user.id, user.role);
    localStorage.setItem('nexus_demo_user_id', user.id);
    showToast(`Switched active persona to ${user.display_name} (${user.designation})`, 'info');
  };

  const switchRole = (role: DemoRole) => {
    const matched = users.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    }
  };

  useEffect(() => {
    api.getDemoUsers()
      .then(res => {
        setUsers(res.data);
        const savedUserId = localStorage.getItem('nexus_demo_user_id');
        const defaultUser = res.data.find(u => u.id === savedUserId) ||
          res.data.find(u => u.role === 'leadership') ||
          res.data[0];

        if (defaultUser) {
          setCurrentUserState(defaultUser);
          setApiDemoIdentity(defaultUser.id, defaultUser.role);
        }
      })
      .catch(err => {
        console.error('Failed to load demo personas', err);
      });
  }, []);

  return (
    <DemoContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        switchRole,
        toasts,
        showToast,
        removeToast,
        activeCaseId,
        setActiveCaseId,
        activeInstitutionId,
        setActiveInstitutionId,
        isNewCaseModalOpen,
        setIsNewCaseModalOpen,
        refreshKey,
        triggerRefresh
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
