import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "warning";
}

interface ToastCtx {
  toasts: Toast[];
  show: (msg: string, type?: Toast["type"]) => void;
  hide: (id: number) => void;
}

const ToastContext = createContext<ToastCtx | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((msg: string, type: Toast["type"] = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message: msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);
  const hide = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return (
    <ToastContext.Provider value={{ toasts, show, hide }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-charcoal text-ivory px-5 py-3 rounded-full shadow-elevated text-sm font-medium animate-in slide-in-from-right-4 fade-in duration-300"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast outside provider");
  return ctx;
}
