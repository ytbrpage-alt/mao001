// src/components/ui/LoadingStates.tsx
// Beautiful loading state components

'use client';

import { cn } from '@/lib/utils/cn';

// Skeleton loader for text/content
interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({ className, width, height, rounded = 'md' }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]',
                rounded === 'sm' && 'rounded',
                rounded === 'md' && 'rounded-md',
                rounded === 'lg' && 'rounded-lg',
                rounded === 'full' && 'rounded-full',
                className
            )}
            style={{ width, height }}
        />
    );
}

// Skeleton card
export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn('p-4 border border-neutral-200 rounded-xl space-y-3', className)}>
            <Skeleton height={20} width="60%" />
            <Skeleton height={16} width="80%" />
            <Skeleton height={16} width="40%" />
        </div>
    );
}

// Skeleton list
export function SkeletonList({ count = 3, className }: { count?: number; className?: string }) {
    return (
        <div className={cn('space-y-3', className)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton width={40} height={40} rounded="full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton height={16} width="70%" />
                        <Skeleton height={12} width="40%" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Spinner
interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'brand' | 'white' | 'neutral';
    className?: string;
}

const spinnerSizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
};

const spinnerColors = {
    brand: 'border-brand-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    neutral: 'border-neutral-400 border-t-transparent',
};

export function Spinner({ size = 'md', color = 'brand', className }: SpinnerProps) {
    return (
        <div
            className={cn(
                'rounded-full animate-spin',
                spinnerSizes[size],
                spinnerColors[color],
                className
            )}
        />
    );
}

// Loading overlay
interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
    children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, message, children }: LoadingOverlayProps) {
    return (
        <div className="relative">
            {children}
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner size="lg" />
                        {message && (
                            <p className="text-sm text-neutral-600">{message}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Button loading state
export function ButtonSpinner({ className }: { className?: string }) {
    return (
        <Spinner size="sm" color="white" className={className} />
    );
}

// Pulse dot indicator
export function PulseDot({ color = 'brand' }: { color?: 'brand' | 'success' | 'warning' | 'danger' }) {
    const colors = {
        brand: 'bg-brand-500',
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        danger: 'bg-danger-500',
    };

    return (
        <span className="relative flex h-3 w-3">
            <span
                className={cn(
                    'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                    colors[color]
                )}
            />
            <span
                className={cn(
                    'relative inline-flex rounded-full h-3 w-3',
                    colors[color]
                )}
            />
        </span>
    );
}

// Progress dots (for multi-step loading)
export function ProgressDots({ count = 3, className }: { count?: number; className?: string }) {
    return (
        <div className={cn('flex items-center gap-1', className)}>
            {Array.from({ length: count }).map((_, i) => (
                <span
                    key={i}
                    className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    );
}

// Full page loader
export function PageLoader({ message = 'Carregando...' }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-brand-200 rounded-full" />
                    <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-neutral-600 font-medium">{message}</p>
            </div>
        </div>
    );
}
