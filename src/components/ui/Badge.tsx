// src/components/ui/Badge.tsx
// Mobile-first badge component

'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    outlined?: boolean;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; outlined: string }> = {
    success: {
        bg: 'bg-success-100 text-success-700',
        outlined: 'border-success-500 text-success-700 bg-success-50',
    },
    warning: {
        bg: 'bg-warning-100 text-warning-700',
        outlined: 'border-warning-500 text-warning-700 bg-warning-50',
    },
    danger: {
        bg: 'bg-danger-100 text-danger-700',
        outlined: 'border-danger-500 text-danger-700 bg-danger-50',
    },
    info: {
        bg: 'bg-brand-100 text-brand-700',
        outlined: 'border-brand-500 text-brand-700 bg-brand-50',
    },
    neutral: {
        bg: 'bg-neutral-100 text-neutral-700',
        outlined: 'border-neutral-400 text-neutral-700 bg-neutral-50',
    },
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
};

export function Badge({
    variant = 'neutral',
    size = 'md',
    outlined = false,
    icon,
    children,
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 font-medium rounded-full',
                outlined ? 'border' : '',
                outlined ? variantStyles[variant].outlined : variantStyles[variant].bg,
                sizeStyles[size],
                className
            )}
        >
            {icon}
            {children}
        </span>
    );
}
