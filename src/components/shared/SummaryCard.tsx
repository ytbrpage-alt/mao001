'use client';

import { cn } from '@/lib/utils/cn';

interface SummaryItem {
    label: string;
    value: string;
    highlight?: boolean;
    color?: 'default' | 'warning' | 'danger' | 'success';
}

interface SummaryCardProps {
    title: string;
    items: SummaryItem[];
    tip?: string;
    className?: string;
}

const colorStyles = {
    default: 'text-neutral-900',
    warning: 'text-warning-600',
    danger: 'text-danger-600',
    success: 'text-success-600',
};

export function SummaryCard({
    title,
    items,
    tip,
    className,
}: SummaryCardProps) {
    return (
        <div className={cn('bg-neutral-100 rounded-xl p-4', className)}>
            <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
                📊 {title}
            </h4>
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start gap-2">
                        <span className="text-sm text-neutral-600">{item.label}:</span>
                        <span
                            className={cn(
                                'text-sm font-medium text-right',
                                colorStyles[item.color || 'default'],
                                item.highlight && 'font-bold'
                            )}
                        >
                            {item.value === '' ? '—' : item.value}
                        </span>
                    </div>
                ))}
            </div>
            {tip && (
                <div className="mt-3 pt-3 border-t border-neutral-200">
                    <p className="text-xs text-neutral-500">
                        💡 <span className="font-medium">Dica:</span> {tip}
                    </p>
                </div>
            )}
        </div>
    );
}
