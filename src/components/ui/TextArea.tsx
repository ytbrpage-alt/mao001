// src/components/ui/TextArea.tsx
// Mobile-first textarea component

'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    helperText?: string;
    error?: string;
    fullWidth?: boolean;
    autoResize?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            label,
            helperText,
            error,
            fullWidth = true,
            autoResize = false,
            className,
            id,
            rows = 3,
            ...props
        },
        ref
    ) => {
        const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
        const hasError = !!error;

        const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
            if (autoResize) {
                const target = e.currentTarget;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
            }
        };

        return (
            <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-neutral-700"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={rows}
                    onInput={handleInput}
                    className={cn(
                        'w-full px-4 py-3 rounded-xl border bg-white text-neutral-900',
                        'placeholder:text-neutral-400',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500',
                        'resize-none touch-manipulation',
                        hasError
                            ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
                            : 'border-neutral-300 focus:ring-brand-500 focus:border-brand-500',
                        autoResize && 'overflow-hidden',
                        className
                    )}
                    {...props}
                />
                {(helperText || error) && (
                    <p className={cn('text-sm', hasError ? 'text-danger-600' : 'text-neutral-500')}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';
