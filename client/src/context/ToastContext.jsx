/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ToastViewport } from "../components/common/ToastViewport";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((payload) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const nextToast = {
      id,
      title: payload.title || "Notice",
      message: payload.message || "",
      tone: payload.tone || "info",
    };

    setToasts((current) => [...current, nextToast]);
    window.setTimeout(() => dismissToast(id), payload.duration || 3200);
  }, [dismissToast]);

  const value = useMemo(() => ({ showToast, dismissToast }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within ToastProvider");
  }
  return context;
};
