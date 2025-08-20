import { createContext, useState, type ReactNode, useMemo, useCallback } from "react";
import type { Toast, ToastContextType } from "../types/toast";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissById = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(
    (toast: Omit<Toast, "id"> & { id?: string }) => {
      const id = toast.id || Math.random().toString(36).substr(2, 9);
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration || 3000,
        variant: toast.variant || "default",
      };

      setToasts(prev => [...prev, newToast]);

      // Auto dismiss
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => dismissById(id), newToast.duration);
      }
    },
    [dismissById]
  );

  const dismiss = useCallback(
    (toastId: string) => {
      dismissById(toastId);
    },
    [dismissById]
  );

  const contextValue = useMemo(
    () => ({
      toasts,
      toast,
      dismiss,
    }),
    [toasts, toast, dismiss]
  );

  return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>;
}

export { ToastContext };
