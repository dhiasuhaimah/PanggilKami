import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast" style={{
            borderLeft: `4px solid ${
              toast.type === 'success' ? '#10B981' : 
              toast.type === 'error' ? '#EF4444' : '#0284C7'
            }`
          }}>
            {toast.type === 'success' && <CheckCircle2 size={20} style={{ color: '#10B981', flexShrink: 0 }} />}
            {toast.type === 'error' && <AlertCircle size={20} style={{ color: '#EF4444', flexShrink: 0 }} />}
            {toast.type === 'info' && <Info size={20} style={{ color: '#0284C7', flexShrink: 0 }} />}
            <span style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 500, flex: 1 }}>
              {toast.message}
            </span>
            <button 
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              aria-label="Tutup notifikasi"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
