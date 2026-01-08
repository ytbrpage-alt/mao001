// src/components/dashboard/SimpleChart.tsx
// Simple CSS-based charts (no external dependencies)

'use client';

import { cn } from '@/lib/utils/cn';

// Bar Chart
interface BarChartProps {
    data: { label: string; value: number; color?: string }[];
    maxHeight?: number;
    className?: string;
}

export function BarChart({ data, maxHeight = 150, className }: BarChartProps) {
    const maxValue = Math.max(...data.map((d) => d.value), 1);

    return (
        <div className={cn('flex items-end gap-2 justify-around', className)} style={{ height: maxHeight }}>
            {data.map((item, index) => {
                const height = (item.value / maxValue) * maxHeight;
                return (
                    <div key={index} className="flex flex-col items-center gap-1 flex-1 max-w-16">
                        <span className="text-xs font-medium text-neutral-700">{item.value}</span>
                        <div
                            className={cn(
                                'w-full rounded-t-md transition-all duration-300 min-h-[4px]',
                                item.color || 'bg-brand-500'
                            )}
                            style={{ height: Math.max(height, 4) }}
                        />
                        <span className="text-xs text-neutral-500 truncate w-full text-center">
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// Donut Chart
interface DonutChartProps {
    data: { label: string; value: number; color: string }[];
    size?: number;
    thickness?: number;
    className?: string;
}

export function DonutChart({ data, size = 120, thickness = 20, className }: DonutChartProps) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;

    let offset = 0;

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {data.map((item, index) => {
                    const percentage = total > 0 ? item.value / total : 0;
                    const strokeLength = percentage * circumference;
                    const currentOffset = offset;
                    offset += strokeLength;

                    return (
                        <circle
                            key={index}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={item.color}
                            strokeWidth={thickness}
                            strokeDasharray={`${strokeLength} ${circumference}`}
                            strokeDashoffset={-currentOffset}
                            transform={`rotate(-90 ${size / 2} ${size / 2})`}
                            className="transition-all duration-500"
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-neutral-900">{total}</span>
                <span className="text-xs text-neutral-500">Total</span>
            </div>
        </div>
    );
}

// Progress Bar
interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    color?: string;
    showValue?: boolean;
    className?: string;
}

export function ProgressBar({
    value,
    max = 100,
    label,
    color = 'bg-brand-500',
    showValue = true,
    className,
}: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className={className}>
            {(label || showValue) && (
                <div className="flex justify-between text-sm mb-1">
                    {label && <span className="text-neutral-700">{label}</span>}
                    {showValue && <span className="text-neutral-500">{value.toFixed(0)}%</span>}
                </div>
            )}
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                    className={cn('h-full rounded-full transition-all duration-500', color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// Sparkline
interface SparklineProps {
    data: number[];
    color?: string;
    height?: number;
    className?: string;
}

export function Sparkline({ data, color = '#1E8AAD', height = 40, className }: SparklineProps) {
    if (data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100;
    const points = data
        .map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * (height - 4) - 2;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className={className}
        >
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
}

// Simple line list for small data
interface MiniListProps {
    items: { label: string; value: string | number; color?: string }[];
    className?: string;
}

export function MiniList({ items, className }: MiniListProps) {
    return (
        <ul className={cn('space-y-2', className)}>
            {items.map((item, index) => (
                <li key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        {item.color && (
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                        )}
                        <span className="text-neutral-700">{item.label}</span>
                    </div>
                    <span className="font-medium text-neutral-900">{item.value}</span>
                </li>
            ))}
        </ul>
    );
}
