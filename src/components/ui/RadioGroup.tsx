// src/components/ui/RadioGroup.tsx
// Mobile-first radio group component

'use client';

import { cn } from '@/lib/utils/cn';

interface RadioOption {
    value: string;
    label: string;
    description?: string;
    badge?: string;
    badgeColor?: 'success' | 'warning' | 'danger' | 'info';
    disabled?: boolean;
}

interface RadioGroupProps {
    label?: string;
    options: RadioOption[];
    value: string;
    onValueChange: (value: string) => void;
    orientation?: 'horizontal' | 'vertical';
    error?: string;
    disabled?: boolean;
}

const badgeColors = {
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    danger: 'bg-danger-100 text-danger-700',
    info: 'bg-brand-100 text-brand-700',
};

export function RadioGroup({
    label,
    options,
    value,
    onValueChange,
    orientation = 'vertical',
    error,
    disabled = false,
}: RadioGroupProps) {
    return (
        <div className="space-y-2">
            {label && <p className="text-sm font-medium text-neutral-700">{label}</p>}
            <div
                className={cn(
                    orientation === 'horizontal' ? 'flex flex-wrap gap-2' : 'space-y-1'
                )}
            >
                {options.map((option) => {
                    const isSelected = value === option.value;
                    const isDisabled = disabled || option.disabled;

                    return (
                        <label
                            key={option.value}
                            className={cn(
                                'flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all min-h-[48px]',
                                isSelected
                                    ? 'border-brand-500 bg-brand-50'
                                    : 'border-neutral-200 hover:border-neutral-300',
                                isDisabled && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            <div className="relative flex items-center justify-center pt-0.5">
                                <input
                                    type="radio"
                                    value={option.value}
                                    checked={isSelected}
                                    onChange={() => !isDisabled && onValueChange(option.value)}
                                    disabled={isDisabled}
                                    className="sr-only"
                                />
                                <div
                                    className={cn(
                                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                                        isSelected
                                            ? 'border-brand-500 bg-brand-500'
                                            : 'border-neutral-300 bg-white'
                                    )}
                                >
                                    {isSelected && (
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-neutral-900">
                                        {option.label}
                                    </span>
                                    {option.badge && (
                                        <span
                                            className={cn(
                                                'px-2 py-0.5 text-xs font-medium rounded-full',
                                                badgeColors[option.badgeColor || 'info']
                                            )}
                                        >
                                            {option.badge}
                                        </span>
                                    )}
                                </div>
                                {option.description && (
                                    <span className="block text-sm text-neutral-500 mt-0.5">
                                        {option.description}
                                    </span>
                                )}
                            </div>
                        </label>
                    );
                })}
            </div>
            {error && <p className="text-sm text-danger-600">{error}</p>}
        </div>
    );
}
