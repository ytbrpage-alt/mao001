// src/components/ui/BottomSheet.tsx
// Mobile-first bottom sheet component

'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    snapPoints?: number[]; // Percentages: [0.3, 0.6, 0.9]
    initialSnap?: number;
}

export function BottomSheet({
    isOpen,
    onClose,
    title,
    children,
}: BottomSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const content = (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 animate-fade-in"
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                ref={sheetRef}
                className={cn(
                    'fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl',
                    'max-h-[85vh] flex flex-col animate-slide-up'
                )}
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
                </div>

                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-4 pb-3 border-b border-neutral-100">
                        <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 rounded-lg hover:bg-neutral-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-neutral-500" />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 pb-safe">
                    {children}
                </div>
            </div>
        </div>
    );

    if (typeof window === 'undefined') return null;
    return createPortal(content, document.body);
}
