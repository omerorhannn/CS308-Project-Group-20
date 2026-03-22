import { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

export default function Toast() {
  const { toast, clearToast } = useToast();
  const ref = useRef(null);

  useEffect(() => {
    if (!toast.message) return;
    requestAnimationFrame(() => {
      if (ref.current) ref.current.classList.add('show');
    });
    const timer = setTimeout(() => {
      if (ref.current) ref.current.classList.remove('show');
      setTimeout(() => clearToast(), 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.message, clearToast]);

  if (!toast.message) return null;

  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle' };

  return (
    <div className={`toast toast-${toast.type}`} ref={ref} role="alert" aria-live="polite">
      <i className={`fas ${icons[toast.type] || icons.success}`} />
      <span>{toast.message}</span>
      <button className="toast-close" onClick={() => { if (ref.current) ref.current.classList.remove('show'); setTimeout(() => clearToast(), 400); }} aria-label="Dismiss">
        <i className="fas fa-xmark" />
      </button>
    </div>
  );
}
