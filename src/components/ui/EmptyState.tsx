// src/components/ui/EmptyState.tsx
// Mobile-first empty state component

'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    variant?: 'default' | 'compact' | 'card';
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    variant = 'default',
    className,
}: EmptyStateProps) {
    if (variant === 'compact') {
        return (
            <div className={cn('flex items-center gap-3 p-4 text-center', className)}>
                <div className="text-neutral-400">
                    {icon || <Inbox className="w-6 h-6" />}
                </div>
                <p className="text-sm text-neutral-500">{title}</p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-12 px-4 text-center',
                variant === 'card' && 'bg-neutral-50 rounded-2xl border border-neutral-200',
                className
            )}
        >
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
                {icon || <Inbox className="w-8 h-8 text-neutral-400" />}
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-neutral-500 max-w-[280px] mb-6">{description}</p>
            )}
            {action && (
                <Button onClick={action.onClick} size="md">
                    {action.label}
                </Button>
            )}
        </div>
    );
}
