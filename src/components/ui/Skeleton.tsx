// src/components/ui/Skeleton.tsx
// Mobile-first skeleton loading component

'use client';

import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
    className,
    variant = 'text',
    width,
    height,
    animation = 'pulse',
}: SkeletonProps) {
    const variantStyles = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        rounded: 'rounded-xl',
    };

    const animationStyles = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]',
        none: '',
    };

    return (
        <div
            className={cn(
                'bg-neutral-200',
                variantStyles[variant],
                animationStyles[animation],
                className
            )}
            style={{ width, height }}
        />
    );
}

// Pre-built skeleton patterns
export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1 space-y-2">
                    <Skeleton width="60%" height={16} />
                    <Skeleton width="40%" height={12} />
                </div>
            </div>
            <Skeleton height={80} variant="rounded" />
            <div className="flex gap-2">
                <Skeleton width={80} height={32} variant="rounded" />
                <Skeleton width={80} height={32} variant="rounded" />
            </div>
        </div>
    );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200">
                    <Skeleton variant="circular" width={40} height={40} />
                    <div className="flex-1 space-y-2">
                        <Skeleton width="70%" height={14} />
                        <Skeleton width="50%" height={12} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonForm() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton width={100} height={14} />
                    <Skeleton height={48} variant="rounded" />
                </div>
            ))}
            <Skeleton height={48} variant="rounded" />
        </div>
    );
}
