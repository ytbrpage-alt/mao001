// src/components/dashboard/StatCard.tsx
// Stat card component for dashboard metrics

'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: ReactNode;
    trend?: {
        value: number;
        label?: string;
    };
    color?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
    className?: string;
}

const colorVariants = {
    brand: 'bg-brand-50 border-brand-200 text-brand-700',
    success: 'bg-success-50 border-success-200 text-success-700',
    warning: 'bg-warning-50 border-warning-200 text-warning-700',
    danger: 'bg-danger-50 border-danger-200 text-danger-700',
    neutral: 'bg-neutral-50 border-neutral-200 text-neutral-700',
};

const iconBgVariants = {
    brand: 'bg-brand-100',
    success: 'bg-success-100',
    warning: 'bg-warning-100',
    danger: 'bg-danger-100',
    neutral: 'bg-neutral-100',
};

export function StatCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    color = 'neutral',
    className,
}: StatCardProps) {
    const getTrendIcon = () => {
        if (!trend) return null;
        if (trend.value > 0) return <TrendingUp className="w-4 h-4 text-success-600" />;
        if (trend.value < 0) return <TrendingDown className="w-4 h-4 text-danger-600" />;
        return <Minus className="w-4 h-4 text-neutral-400" />;
    };

    const getTrendColor = () => {
        if (!trend) return '';
        if (trend.value > 0) return 'text-success-600';
        if (trend.value < 0) return 'text-danger-600';
        return 'text-neutral-500';
    };

    return (
        <div
            className={cn(
                'rounded-xl border p-4 transition-shadow hover:shadow-md',
                colorVariants[color],
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium opacity-80">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs opacity-60 mt-1">{subtitle}</p>
                    )}
                </div>
                {icon && (
                    <div className={cn('p-2 rounded-lg', iconBgVariants[color])}>
                        {icon}
                    </div>
                )}
            </div>
            {trend && (
                <div className="flex items-center gap-1 mt-3 text-sm">
                    {getTrendIcon()}
                    <span className={getTrendColor()}>
                        {trend.value > 0 ? '+' : ''}
                        {trend.value.toFixed(1)}%
                    </span>
                    {trend.label && (
                        <span className="text-neutral-500 ml-1">{trend.label}</span>
                    )}
                </div>
            )}
        </div>
    );
}
