import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastOptions {
  type?: ToastType;
  durationMs?: number;
}

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  durationMs: number;
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => number;
  dismissToast: (id: number) => void;
}

const DEFAULT_TOAST_DURATIONS: Record<ToastType, number> = {
  success: 3000,
  info: 3000,
  error: 5000,
};

const TOAST_STYLES: Record<
  ToastType,
  {
    shell: string;
    icon: string;
    Icon: typeof CheckCircle2;
    label: string;
  }
> = {
  success: {
    shell: 'border-success-200 bg-success-100 text-success-500',
    icon: 'text-success-500',
    Icon: CheckCircle2,
    label: 'Succès',
  },
  error: {
    shell: 'border-alert-200 bg-alert-100 text-alert-500',
    icon: 'text-alert-500',
    Icon: AlertCircle,
    label: 'Erreur',
  },
  info: {
    shell: 'border-primary-200 bg-primary-100 text-primary-500',
    icon: 'text-primary-500',
    Icon: Info,
    label: 'Information',
  },
};

const ToastContext = createContext<ToastContextValue | null>(null);

function ToastMessage({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const styles = TOAST_STYLES[toast.type];
  const Icon = styles.Icon;

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      onDismiss(toast.id);
    }, toast.durationMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [onDismiss, toast.durationMs, toast.id]);

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-atomic="true"
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-card border p-4 text-sm shadow-card ${styles.shell}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${styles.icon}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <span className="sr-only">{styles.label} : </span>
        <p className="break-words font-medium leading-normal">{toast.message}</p>
      </div>
      <button
        type="button"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-current transition-colors hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
        aria-label="Fermer la notification"
        onClick={() => onDismiss(toast.id)}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    const type = options.type ?? 'info';
    const id = Date.now() + Math.floor(Math.random() * 100000);
    const durationMs = options.durationMs ?? DEFAULT_TOAST_DURATIONS[type];

    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        message,
        type,
        durationMs,
      },
    ]);

    return id;
  }, []);

  const portalRoot = typeof document === 'undefined' ? null : document.body;

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {portalRoot &&
        createPortal(
          <div
            className="pointer-events-none fixed left-0 right-0 top-20 z-[100] mx-auto flex w-full max-w-md flex-col gap-3 px-4 sm:right-4 sm:left-auto sm:mx-0"
            aria-live="polite"
          >
            {toasts.map((toast) => (
              <ToastMessage key={toast.id} toast={toast} onDismiss={dismissToast} />
            ))}
          </div>,
          portalRoot
        )}
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
