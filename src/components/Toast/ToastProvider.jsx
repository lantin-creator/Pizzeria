import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContext } from "./ToastContext";
import "./toast.css";

let nextId = 1;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (text, options = {}) => {
      const { type = "success", duration = 3500, action } = options;
      const id = nextId++;

      setToasts((list) => [...list.slice(-2), { id, text, type, action }]);

      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismissToast(id), duration)
        );
      }

      return id;
    },
    [dismissToast]
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((timer) => clearTimeout(timer));
  }, []);

  const value = useMemo(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            role="status"
          >
            <span className="toast-icon">
              {toast.type === "error" ? "!" : "✓"}
            </span>

            <span className="toast-text">{toast.text}</span>

            {toast.action && (
              <button
                type="button"
                className="toast-action"
                onClick={() => {
                  toast.action.onClick();
                  dismissToast(toast.id);
                }}
              >
                {toast.action.label}
              </button>
            )}

            <button
              type="button"
              className="toast-close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}