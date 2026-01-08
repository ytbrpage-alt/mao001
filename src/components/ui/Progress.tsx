// src/components/ui/Progress.tsx
// Mobile-first progress component (linear and circular)

'use client';

import { cn } from '@/lib/utils/cn';

interface LinearProgressProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    color?: 'brand' | 'success' | 'warning' | 'danger';
    showValue?: boolean;
    label?: string;
    className?: string;
}

interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    color?: 'brand' | 'success' | 'warning' | 'danger';
    showValue?: boolean;
    label?: string;
    className?: string;
}

const colorStyles = {
    brand: 'bg-brand-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
};

const strokeColors = {
    brand: '#3B82F6',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
};

const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
};

export function LinearProgress({
    value,
    max = 100,
    size = 'md',
    color = 'brand',
    showValue = false,
    label,
    className,
}: LinearProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={cn('space-y-1', className)}>
            {(label || showValue) && (
                <div className="flex items-center justify-between text-sm">
                    {label && <span className="text-neutral-700 font-medium">{label}</span>}
                    {showValue && <span className="text-neutral-500">{Math.round(percentage)}%</span>}
                </div>
            )}
            <div className={cn('w-full bg-neutral-200 rounded-full overflow-hidden', sizeStyles[size])}>
                <div
                    className={cn('h-full rounded-full transition-all duration-300', colorStyles[color])}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export function CircularProgress({
    value,
    max = 100,
    size = 80,
    strokeWidth = 8,
    color = 'brand',
    showValue = true,
    label,
    className,
}: CircularProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={cn('inline-flex flex-col items-center gap-1', className)}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={strokeColors[color]}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-300"
                    />
                </svg>
                {showValue && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-neutral-900">
                            {Math.round(percentage)}%
                        </span>
                    </div>
                )}
            </div>
            {label && <span className="text-sm text-neutral-600">{label}</span>}
        </div>
    );
}
