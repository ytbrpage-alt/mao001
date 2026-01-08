// src/components/ui/MaskedInput.tsx
// Input component with mask support

'use client';

import { useState, useEffect, useCallback, forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import {
    applyMask,
    removeMask,
    formatCPF,
    formatPhone,
    formatCEP,
    formatRG,
    formatName,
    validateCPF,
    validatePhone,
    validateCEP,
    validateName,
    MASKS,
} from '@/lib/utils/masks';
import { Check, X, AlertCircle } from 'lucide-react';

type MaskType = 'cpf' | 'phone' | 'cep' | 'rg' | 'name' | 'custom';

interface MaskedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    mask?: MaskType;
    customMask?: string;
    value: string;
    onChange: (value: string, rawValue: string) => void;
    showValidation?: boolean;
    errorMessage?: string;
    helperText?: string;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
    (
        {
            label,
            mask = 'custom',
            customMask,
            value,
            onChange,
            showValidation = true,
            errorMessage,
            helperText,
            className,
            ...props
        },
        ref
    ) => {
        const [isValid, setIsValid] = useState<boolean | null>(null);
        const [isTouched, setIsTouched] = useState(false);

        const formatValue = useCallback(
            (val: string): string => {
                switch (mask) {
                    case 'cpf':
                        return formatCPF(val);
                    case 'phone':
                        return formatPhone(val);
                    case 'cep':
                        return formatCEP(val);
                    case 'rg':
                        return formatRG(val);
                    case 'name':
                        return formatName(val);
                    case 'custom':
                        return customMask ? applyMask(val, customMask) : val;
                    default:
                        return val;
                }
            },
            [mask, customMask]
        );

        const validateValue = useCallback(
            (val: string): boolean => {
                const raw = removeMask(val);
                switch (mask) {
                    case 'cpf':
                        return validateCPF(val);
                    case 'phone':
                        return validatePhone(val);
                    case 'cep':
                        return validateCEP(val);
                    case 'name':
                        return validateName(val);
                    default:
                        return true;
                }
            },
            [mask]
        );

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let newValue = e.target.value;

            // For name input, don't apply mask but format on blur
            if (mask === 'name') {
                onChange(newValue, newValue);
                return;
            }

            // Apply mask
            const formatted = formatValue(newValue);
            const raw = removeMask(formatted);
            onChange(formatted, raw);
        };

        const handleBlur = () => {
            setIsTouched(true);
            if (showValidation && value) {
                setIsValid(validateValue(value));
            }

            // Format name on blur
            if (mask === 'name' && value) {
                const formatted = formatName(value);
                onChange(formatted, formatted);
            }
        };

        useEffect(() => {
            if (isTouched && showValidation && value) {
                setIsValid(validateValue(value));
            }
        }, [value, isTouched, showValidation, validateValue]);

        const showError = isTouched && isValid === false;
        const showSuccess = isTouched && isValid === true && value;

        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-neutral-700">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        type="text"
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={cn(
                            'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors',
                            showError
                                ? 'border-danger-500 focus:ring-danger-500 pr-10'
                                : showSuccess
                                    ? 'border-success-500 focus:ring-success-500 pr-10'
                                    : 'border-neutral-300 focus:ring-brand-500',
                            className
                        )}
                        {...props}
                    />
                    {showValidation && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {showSuccess && <Check className="w-5 h-5 text-success-500" />}
                            {showError && <X className="w-5 h-5 text-danger-500" />}
                        </div>
                    )}
                </div>
                {showError && errorMessage && (
                    <p className="text-sm text-danger-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errorMessage}
                    </p>
                )}
                {helperText && !showError && (
                    <p className="text-sm text-neutral-500">{helperText}</p>
                )}
            </div>
        );
    }
);

MaskedInput.displayName = 'MaskedInput';
