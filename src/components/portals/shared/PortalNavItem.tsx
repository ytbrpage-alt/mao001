'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface PortalNavItemProps {
    href: string;
    icon: ReactNode;
    label: string;
    badge?: number;
    collapsed?: boolean;
    onClick?: () => void;
}

export function PortalNavItem({
    href,
    icon,
    label,
    badge,
    collapsed = false,
    onClick,
}: PortalNavItemProps) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-neutral-100',
                isActive && 'bg-brand-50 text-brand-600 font-medium',
                !isActive && 'text-neutral-600',
                collapsed && 'justify-center px-2'
            )}
        >
            <span className={cn('flex-shrink-0 w-5 h-5', isActive && 'text-brand-500')}>
                {icon}
            </span>

            {!collapsed && (
                <>
                    <span className="flex-1 truncate">{label}</span>

                    {badge !== undefined && badge > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={cn(
                                'flex-shrink-0 min-w-5 h-5 px-1.5 rounded-full text-xs font-medium',
                                'flex items-center justify-center',
                                isActive
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-neutral-200 text-neutral-600'
                            )}
                        >
                            {badge > 99 ? '99+' : badge}
                        </motion.span>
                    )}
                </>
            )}

            {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {label}
                    {badge !== undefined && badge > 0 && ` (${badge})`}
                </div>
            )}
        </Link>
    );
}
