// src/components/ui/BottomNavigation.tsx
// Mobile-first bottom navigation component

'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface NavItem {
    id: string;
    icon: ReactNode;
    activeIcon?: ReactNode;
    label: string;
    badge?: number;
}

interface BottomNavigationProps {
    items: NavItem[];
    activeId: string;
    onNavigate: (id: string) => void;
    className?: string;
}

export function BottomNavigation({
    items,
    activeId,
    onNavigate,
    className,
}: BottomNavigationProps) {
    return (
        <nav
            className={cn(
                'fixed bottom-0 left-0 right-0 z-40',
                'bg-white border-t border-neutral-100 pb-safe',
                className
            )}
        >
            <div className="flex items-stretch justify-around h-16">
                {items.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={cn(
                                'flex-1 flex flex-col items-center justify-center gap-1 transition-colors',
                                'min-w-0 px-2',
                                isActive ? 'text-brand-600' : 'text-neutral-500'
                            )}
                        >
                            <div className="relative">
                                {isActive && item.activeIcon ? item.activeIcon : item.icon}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium truncate max-w-full">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
