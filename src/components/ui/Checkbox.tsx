// src/components/ui/Checkbox.tsx
// Mobile-first checkbox component

'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    description?: string;
    error?: string;
    onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, description, error, checked, onCheckedChange, disabled, className, id, ...props }, ref) => {
        const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;
        const hasError = !!error;

        return (
            <div className={cn('flex items-start gap-3 min-h-[44px]', className)}>
                <div className="relative flex items-center justify-center pt-0.5">
                    <input
                        ref={ref}
                        type="checkbox"
                        id={checkboxId}
                        checked={checked}
                        onChange={(e) => onCheckedChange?.(e.target.checked)}
                        disabled={disabled}
                        className="peer sr-only"
                        {...props}
                    />
                    <div
                        className={cn(
                            'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200',
                            'peer-focus:ring-2 peer-focus:ring-brand-500 peer-focus:ring-offset-2',
                            checked
                                ? 'bg-brand-500 border-brand-500'
                                : hasError
                                    ? 'border-danger-500 bg-white'
                                    : 'border-neutral-300 bg-white',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                    </div>
                </div>
                <label
                    htmlFor={checkboxId}
                    className={cn(
                        'flex-1 cursor-pointer select-none',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <span className="block text-sm font-medium text-neutral-900">{label}</span>
                    {description && (
                        <span className="block text-sm text-neutral-500 mt-0.5">{description}</span>
                    )}
                    {error && <span className="block text-sm text-danger-600 mt-0.5">{error}</span>}
                </label>
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

// CheckboxGroup component
interface CheckboxGroupProps {
    label?: string;
    options: { id: string; label: string; description?: string }[];
    values: string[];
    onValuesChange: (values: string[]) => void;
    error?: string;
}

export function CheckboxGroup({ label, options, values, onValuesChange, error }: CheckboxGroupProps) {
    const handleToggle = (id: string, checked: boolean) => {
        if (checked) {
            onValuesChange([...values, id]);
        } else {
            onValuesChange(values.filter((v) => v !== id));
        }
    };

    return (
        <div className="space-y-2">
            {label && <p className="text-sm font-medium text-neutral-700">{label}</p>}
            <div className="space-y-1">
                {options.map((option) => (
                    <Checkbox
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        description={option.description}
                        checked={values.includes(option.id)}
                        onCheckedChange={(checked) => handleToggle(option.id, checked)}
                    />
                ))}
            </div>
            {error && <p className="text-sm text-danger-600">{error}</p>}
        </div>
    );
}
