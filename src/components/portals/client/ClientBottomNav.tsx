'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Calendar, MessageCircle, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const navItems = [
    { href: '/cliente', icon: Home, label: 'Início' },
    { href: '/cliente/paciente', icon: User, label: 'Paciente' },
    { href: '/cliente/agenda', icon: Calendar, label: 'Agenda' },
    { href: '/cliente/mensagens', icon: MessageCircle, label: 'Mensagens' },
    { href: '/cliente/mais', icon: Menu, label: 'Mais' },
];

export function ClientBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bg-white border-t border-neutral-200 pb-safe-bottom">
            <div className="flex items-center justify-around py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/cliente' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors min-w-[64px]',
                                isActive
                                    ? 'text-brand-600'
                                    : 'text-neutral-500 hover:text-neutral-700'
                            )}
                        >
                            <div className="relative">
                                <item.icon className={cn('w-6 h-6', isActive && 'text-brand-500')} />
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-500 rounded-full"
                                    />
                                )}
                            </div>
                            <span className={cn('text-xs', isActive && 'font-medium')}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
