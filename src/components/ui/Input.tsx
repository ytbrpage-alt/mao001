// src/components/ui/Input.tsx
// Mobile-first input component

'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { AlertCircle, Check } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: string;
    success?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            error,
            success,
            leftIcon,
            rightIcon,
            fullWidth = true,
            className,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
        const hasError = !!error;
        const hasSuccess = success && !hasError;

        return (
            <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-neutral-700"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'w-full px-4 py-3 min-h-[48px] rounded-xl border bg-white text-neutral-900',
                            'placeholder:text-neutral-400',
                            'transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500',
                            'touch-manipulation', // Mobile optimization
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            hasError
                                ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
                                : hasSuccess
                                    ? 'border-success-500 focus:ring-success-500 focus:border-success-500'
                                    : 'border-neutral-300 focus:ring-brand-500 focus:border-brand-500',
                            className
                        )}
                        {...props}
                    />
                    {(rightIcon || hasError || hasSuccess) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {hasError ? (
                                <AlertCircle className="w-5 h-5 text-danger-500" />
                            ) : hasSuccess ? (
                                <Check className="w-5 h-5 text-success-500" />
                            ) : (
                                rightIcon
                            )}
                        </div>
                    )}
                </div>
                {(helperText || error) && (
                    <p
                        className={cn(
                            'text-sm',
                            hasError ? 'text-danger-600' : 'text-neutral-500'
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
