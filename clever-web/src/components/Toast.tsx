"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./Toast.module.css";

type ToastVariant = "info" | "success" | "danger";

type ToastState = {
  id: string;
  message: string;
  variant: ToastVariant;
  visible: boolean;
};

type ToastApi = {
  show: (
    message: string,
    opts?: { variant?: ToastVariant; durationMs?: number },
  ) => void;
  info: (message: string, durationMs?: number) => void;
  success: (message: string, durationMs?: number) => void;
  danger: (message: string, durationMs?: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const hideTimerRef = useRef<number | null>(null);
  const cleanupTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    if (cleanupTimerRef.current) window.clearTimeout(cleanupTimerRef.current);
    hideTimerRef.current = null;
    cleanupTimerRef.current = null;
  }, []);

  const show = useCallback(
    (
      message: string,
      opts?: { variant?: ToastVariant; durationMs?: number },
    ) => {
      const variant = opts?.variant ?? "info";
      const durationMs = opts?.durationMs ?? 3000;

      clearTimers();

      const id = uid();
      setToast({ id, message, variant, visible: true });

      hideTimerRef.current = window.setTimeout(() => {
        setToast((t) => (t ? { ...t, visible: false } : null));
      }, durationMs);

      cleanupTimerRef.current = window.setTimeout(() => {
        setToast(null);
      }, durationMs + 220);
    },
    [clearTimers],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      info: (m, d) => show(m, { variant: "info", durationMs: d ?? 3000 }),
      success: (m, d) => show(m, { variant: "success", durationMs: d ?? 3000 }),
      danger: (m, d) => show(m, { variant: "danger", durationMs: d ?? 3000 }),
    }),
    [show],
  );

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      {toast && (
        <div
          className={[
            styles.toast,
            toast.visible ? styles.toastIn : styles.toastOut,
            toast.variant === "success"
              ? styles.toastSuccess
              : toast.variant === "danger"
                ? styles.toastDanger
                : styles.toastInfo,
          ].join(" ")}
          role="status"
          aria-live="polite"
          key={toast.id}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider />");
  }
  return ctx;
}
