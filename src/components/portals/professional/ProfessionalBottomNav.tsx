'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, FileText, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';

export function ProfessionalBottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();

    // Determine base URL by professional type
    const getBaseUrl = () => {
        switch (user?.role) {
            case 'admin': return '/pro/cuidador';
            case 'caregiver': return '/pro/cuidador';
            case 'nurse': return '/pro/enfermeiro';
            case 'nurse_tech': return '/pro/tecnico';
            default: return '/pro';
        }
    };

    const baseUrl = getBaseUrl();

    const navItems = [
        { href: baseUrl, icon: Home, label: 'Início' },
        { href: `${baseUrl}/agenda`, icon: Calendar, label: 'Agenda' },
        { href: `${baseUrl}/pacientes`, icon: Users, label: 'Pacientes' },
        { href: `${baseUrl}/evolucoes`, icon: FileText, label: 'Evoluções' },
        { href: `${baseUrl}/perfil`, icon: User, label: 'Perfil' },
    ];

    return (
        <nav
            className="pb-safe-bottom transition-colors duration-200"
            style={{
                backgroundColor: 'rgb(var(--color-bg-elevated))',
                borderTop: '1px solid rgb(var(--color-border))'
            }}
        >
            <div className="flex items-center justify-around py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[60px]',
                                isActive
                                    ? 'text-brand-500'
                                    : ''
                            )}
                            style={{
                                color: isActive ? undefined : 'rgb(var(--color-text-tertiary))',
                                backgroundColor: isActive ? 'rgba(30, 138, 173, 0.1)' : 'transparent'
                            }}
                        >
                            <item.icon className={cn(
                                'w-6 h-6 transition-colors',
                                isActive && 'text-brand-500'
                            )} />
                            <span className={cn(
                                'text-xs transition-colors',
                                isActive && 'font-medium'
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
