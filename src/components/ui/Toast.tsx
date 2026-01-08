// src/components/ui/Toast.tsx
// Mobile-first toast/notification component

'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

const icons: Record<ToastType, typeof CheckCircle> = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const styles: Record<ToastType, string> = {
    success: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-danger-50 border-danger-200 text-danger-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-brand-50 border-brand-200 text-brand-800',
};

const iconStyles: Record<ToastType, string> = {
    success: 'text-success-500',
    error: 'text-danger-500',
    warning: 'text-warning-500',
    info: 'text-brand-500',
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const Icon = icons[toast.type];

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-in',
                styles[toast.type]
            )}
        >
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconStyles[toast.type])} />
            <div className="flex-1 min-w-0">
                <p className="font-semibold">{toast.title}</p>
                {toast.message && <p className="text-sm opacity-80 mt-0.5">{toast.message}</p>}
            </div>
            <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-black/5 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).slice(2, 9);
        const newToast = { ...toast, id };
        setToasts((prev) => [...prev, newToast]);

        const duration = toast.duration ?? 5000;
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="fixed bottom-20 left-4 right-4 z-50 space-y-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useSuccessToast() {
    const { addToast } = useToast();
    return (title: string, message?: string) => addToast({ type: 'success', title, message });
}

export function useErrorToast() {
    const { addToast } = useToast();
    return (title: string, message?: string) => addToast({ type: 'error', title, message });
}
