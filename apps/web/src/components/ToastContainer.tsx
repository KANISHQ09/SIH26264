import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useDemo } from '../context/DemoContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDemo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-nexus-elevated transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
            t.type === 'success'
              ? 'bg-white border-nexus-success-border text-nexus-navy'
              : t.type === 'error'
              ? 'bg-white border-nexus-danger-border text-nexus-navy'
              : 'bg-white border-nexus-primary-border text-nexus-navy'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-nexus-success" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-nexus-danger" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-nexus-primary" />}
          </div>
          <div className="flex-1 text-xs font-medium leading-relaxed">
            {t.message}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-slate-600 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
