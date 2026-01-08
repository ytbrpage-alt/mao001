// src/components/ui/Switch.tsx
// Mobile-first toggle switch component

'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    description?: string;
    onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
    ({ label, description, checked, onCheckedChange, disabled, className, id, ...props }, ref) => {
        const switchId = id || `switch-${Math.random().toString(36).slice(2, 9)}`;

        return (
            <label
                htmlFor={switchId}
                className={cn(
                    'flex items-center justify-between gap-3 min-h-[48px] cursor-pointer',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
            >
                {(label || description) && (
                    <div className="flex-1">
                        {label && (
                            <span className="block text-sm font-medium text-neutral-900">{label}</span>
                        )}
                        {description && (
                            <span className="block text-sm text-neutral-500">{description}</span>
                        )}
                    </div>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        id={switchId}
                        checked={checked}
                        onChange={(e) => onCheckedChange?.(e.target.checked)}
                        disabled={disabled}
                        className="sr-only peer"
                        {...props}
                    />
                    <div
                        className={cn(
                            'w-12 h-7 rounded-full transition-colors duration-200',
                            'peer-focus:ring-2 peer-focus:ring-brand-500 peer-focus:ring-offset-2',
                            checked ? 'bg-brand-500' : 'bg-neutral-300'
                        )}
                    />
                    <div
                        className={cn(
                            'absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200',
                            checked ? 'translate-x-6' : 'translate-x-1'
                        )}
                    />
                </div>
            </label>
        );
    }
);

Switch.displayName = 'Switch';
