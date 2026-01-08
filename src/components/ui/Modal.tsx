// src/components/ui/Modal.tsx
// Mobile-first modal/dialog component

'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: ModalSize;
    closeOnOverlayClick?: boolean;
    showCloseButton?: boolean;
    children: ReactNode;
    footer?: ReactNode;
}

const sizeStyles: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    closeOnOverlayClick = true,
    showCloseButton = true,
    children,
    footer,
}: ModalProps) {
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

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const content = (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 animate-fade-in"
                onClick={closeOnOverlayClick ? onClose : undefined}
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative w-full bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up',
                    'max-h-[90vh] flex flex-col',
                    sizeStyles[size]
                )}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-start justify-between p-4 border-b border-neutral-100">
                        <div>
                            {title && (
                                <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
                            )}
                            {description && (
                                <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
                            )}
                        </div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 rounded-lg hover:bg-neutral-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-neutral-500" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 border-t border-neutral-100 bg-neutral-50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    if (typeof window === 'undefined') return null;
    return createPortal(content, document.body);
}
