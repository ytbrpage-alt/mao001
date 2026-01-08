// src/components/ui/Select.tsx
// Mobile-optimized native select component

'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    helperText?: string;
    error?: string;
    fullWidth?: boolean;
    onValueChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            options,
            placeholder = 'Selecione...',
            helperText,
            error,
            fullWidth = true,
            onValueChange,
            className,
            id,
            value,
            ...props
        },
        ref
    ) => {
        const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;
        const hasError = !!error;

        return (
            <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-neutral-700"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        value={value}
                        onChange={(e) => onValueChange?.(e.target.value)}
                        className={cn(
                            'w-full px-4 py-3 min-h-[48px] rounded-xl border bg-white text-neutral-900',
                            'appearance-none cursor-pointer',
                            'transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500',
                            'touch-manipulation',
                            hasError
                                ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
                                : 'border-neutral-300 focus:ring-brand-500 focus:border-brand-500',
                            !value && 'text-neutral-400',
                            className
                        )}
                        {...props}
                    >
                        <option value="" disabled>
                            {placeholder}
                        </option>
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                </div>
                {(helperText || error) && (
                    <p className={cn('text-sm', hasError ? 'text-danger-600' : 'text-neutral-500')}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
