import type { Toast } from "../types/toast";
import { useToast } from "../hooks/useToast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map((toast: Toast) => (
        <ToastComponent key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  );
}

interface ToastComponentProps {
  readonly toast: Toast;
  readonly onDismiss: () => void;
}

function ToastComponent({ toast, onDismiss }: ToastComponentProps) {
  return (
    <div
      className={`
        flex w-full max-w-sm items-center space-x-4 overflow-hidden rounded-lg border p-6 pr-8 shadow-lg
        ${
          toast.variant === "destructive"
            ? "border-red-500 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50"
            : "border-border bg-background text-foreground"
        }
      `}
    >
      <div className="grid gap-1">
        {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
        {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
      </div>
      {toast.action}
      <button
        onClick={onDismiss}
        className="absolute top-1 right-1 p-1 text-sm hover:opacity-70"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
