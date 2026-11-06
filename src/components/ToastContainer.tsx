import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-blue-500 shrink-0" />;
        let borderClass = 'border-slate-200';
        let bgClass = 'bg-white';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
          borderClass = 'border-emerald-200';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
          borderClass = 'border-rose-200';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
          borderClass = 'border-amber-200';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border ${borderClass} ${bgClass} shadow-lg flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-150`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-xs font-bold text-slate-900 leading-none mb-0.5">
                  {toast.title}
                </p>
              )}
              <p className="text-xs text-slate-600 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
