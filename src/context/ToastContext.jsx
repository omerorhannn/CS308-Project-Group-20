import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', type: 'success', id: 0 });
  const idRef = useRef(0);

  const showToast = useCallback((message, type = 'success') => {
    idRef.current += 1;
    setToast({ message, type, id: idRef.current });
  }, []);

  const clearToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: '' }));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, clearToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
