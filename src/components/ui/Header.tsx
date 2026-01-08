// src/components/ui/Header.tsx
// Mobile-first header component with safe area

'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronLeft, MoreVertical } from 'lucide-react';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    leftAction?: {
        icon?: ReactNode;
        label?: string;
        onClick: () => void;
    };
    rightAction?: {
        icon?: ReactNode;
        label?: string;
        onClick: () => void;
    };
    rightActions?: {
        icon: ReactNode;
        onClick: () => void;
    }[];
    transparent?: boolean;
    sticky?: boolean;
    className?: string;
}

export function Header({
    title,
    subtitle,
    leftAction,
    rightAction,
    rightActions,
    transparent = false,
    sticky = true,
    className,
}: HeaderProps) {
    return (
        <header
            className={cn(
                'pt-safe px-4 pb-3',
                sticky && 'sticky top-0 z-40',
                transparent ? 'bg-transparent' : 'bg-white border-b border-neutral-100',
                className
            )}
        >
            <div className="flex items-center justify-between min-h-[48px]">
                {/* Left Action */}
                <div className="flex-shrink-0 w-12">
                    {leftAction && (
                        <button
                            onClick={leftAction.onClick}
                            className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors"
                        >
                            {leftAction.icon || <ChevronLeft className="w-6 h-6 text-neutral-700" />}
                        </button>
                    )}
                </div>

                {/* Title */}
                <div className="flex-1 text-center min-w-0 px-2">
                    {title && (
                        <h1 className="font-semibold text-neutral-900 truncate">{title}</h1>
                    )}
                    {subtitle && (
                        <p className="text-xs text-neutral-500 truncate">{subtitle}</p>
                    )}
                </div>

                {/* Right Actions */}
                <div className="flex-shrink-0 w-12 flex justify-end">
                    {rightAction && (
                        <button
                            onClick={rightAction.onClick}
                            className="p-2 -mr-2 rounded-lg hover:bg-neutral-100 transition-colors"
                        >
                            {rightAction.icon || <MoreVertical className="w-6 h-6 text-neutral-700" />}
                        </button>
                    )}
                    {rightActions && (
                        <div className="flex items-center">
                            {rightActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.onClick}
                                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                                >
                                    {action.icon}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
