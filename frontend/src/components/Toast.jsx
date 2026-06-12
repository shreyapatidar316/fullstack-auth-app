import React, { useState, useEffect, useCallback } from 'react';

let toastIdCounter = 0;

// ── Toast Container (renders all active toasts) ──
export const ToastContainer = ({ toasts, removeToast }) => (
  <div className="toast-container" role="status" aria-live="polite">
    {toasts.map((t) => (
      <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
    ))}
  </div>
);

// ── Single Toast Component ───────────────────────
const Toast = ({ toast, onClose }) => {
  const [exiting, setExiting] = useState(false);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(handleClose, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [handleClose, toast.duration]);

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <div className={`toast toast-${toast.type}${exiting ? ' toast-exit' : ''}`}>
      <span className="toast-icon">{icons[toast.type] || 'ℹ️'}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={handleClose} aria-label="Close notification">✕</button>
    </div>
  );
};

// ── useToast Hook ────────────────────────────────
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error:   (msg, dur) => addToast(msg, 'error',   dur),
    info:    (msg, dur) => addToast(msg, 'info',    dur),
  };

  return { toasts, removeToast, toast };
};

export default Toast;
