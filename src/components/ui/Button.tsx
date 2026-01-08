// src/components/ui/Button.tsx
// Mobile-first button component with variants

'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300',
    ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700',
    success: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700',
    outline: 'bg-transparent border-2 border-brand-500 text-brand-600 hover:bg-brand-50',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]', // 44px for mobile touch targets
    lg: 'px-6 py-3.5 text-lg min-h-[52px]',
    icon: 'p-2.5 min-h-[44px] min-w-[44px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            loading = false,
            fullWidth = false,
            icon,
            iconPosition = 'left',
            disabled,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'touch-manipulation select-none', // Mobile optimizations
                    variantStyles[variant],
                    sizeStyles[size],
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        {icon && iconPosition === 'left' && icon}
                        {children}
                        {icon && iconPosition === 'right' && icon}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';
