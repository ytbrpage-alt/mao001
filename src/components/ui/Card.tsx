// src/components/ui/Card.tsx
// Mobile-first card component

'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
    footer?: ReactNode;
    padding?: CardPadding;
    variant?: 'default' | 'outlined' | 'elevated';
    interactive?: boolean;
}

const paddingStyles: Record<CardPadding, string> = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            title,
            subtitle,
            icon,
            footer,
            padding = 'md',
            variant = 'default',
            interactive = false,
            className,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'bg-white rounded-2xl overflow-hidden',
                    variant === 'default' && 'border border-neutral-200',
                    variant === 'outlined' && 'border-2 border-neutral-300',
                    variant === 'elevated' && 'shadow-lg border border-neutral-100',
                    interactive && 'cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]',
                    className
                )}
                {...props}
            >
                {(title || subtitle || icon) && (
                    <div className={cn('flex items-start gap-3', paddingStyles[padding], 'pb-0')}>
                        {icon && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600">
                                {icon}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            {title && (
                                <h3 className="font-semibold text-neutral-900 truncate">{title}</h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
                            )}
                        </div>
                    </div>
                )}
                <div className={paddingStyles[padding]}>{children}</div>
                {footer && (
                    <div
                        className={cn(
                            'border-t border-neutral-100 bg-neutral-50',
                            paddingStyles[padding]
                        )}
                    >
                        {footer}
                    </div>
                )}
            </div>
        );
    }
);

Card.displayName = 'Card';
