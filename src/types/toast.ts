import type { ReactNode } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  duration?: number;
  variant?: "default" | "destructive";
}

export interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id"> & { id?: string }) => void;
  dismiss: (toastId: string) => void;
}
