"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ToastItem, useToastStore } from "@/store/toast";

interface ToastProps {
  toast: ToastItem;
}

export default function Toast({ toast }: ToastProps) {
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const bgColor = {
    success: "bg-dark",
    error: "bg-red",
    info: "bg-dark",
  }[toast.type];

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 border-3 border-dark shadow-md flex items-center justify-between gap-4 min-w-[280px] max-w-[400px] toast-enter`}
      style={{ boxShadow: "4px 4px 0px var(--color-yellow)" }}
    >
      <span className="text-sm font-bold">{toast.message}</span>
      <div className="flex items-center gap-2">
        {toast.action && (
          <Link
            href={toast.action.href}
            className="text-yellow font-heading text-sm uppercase hover:underline whitespace-nowrap"
          >
            {toast.action.label}
          </Link>
        )}
        <button
          onClick={() => removeToast(toast.id)}
          className="text-gray-400 hover:text-white ml-1"
          aria-label="Sluiten"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
