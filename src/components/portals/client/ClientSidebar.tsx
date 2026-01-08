'use client';

import Link from 'next/link';
import { Home, User, Calendar, Users, FileText, MessageCircle, CreditCard, Settings, HelpCircle } from 'lucide-react';
import { PortalNavItem } from '../shared/PortalNavItem';
import { useNotificationStore } from '@/stores/notificationStore';

const navItems = [
    { href: '/cliente', icon: Home, label: 'Início' },
    { href: '/cliente/paciente', icon: User, label: 'Paciente' },
    { href: '/cliente/agenda', icon: Calendar, label: 'Agenda' },
    { href: '/cliente/profissionais', icon: Users, label: 'Profissionais' },
    { href: '/cliente/documentos', icon: FileText, label: 'Documentos' },
    { href: '/cliente/mensagens', icon: MessageCircle, label: 'Mensagens' },
    { href: '/cliente/financeiro', icon: CreditCard, label: 'Financeiro' },
];

const secondaryItems = [
    { href: '/cliente/configuracoes', icon: Settings, label: 'Configurações' },
    { href: '/cliente/ajuda', icon: HelpCircle, label: 'Ajuda' },
];

export function ClientSidebar() {
    const { unreadCount } = useNotificationStore();

    return (
        <nav className="h-full flex flex-col p-4">
            <div className="mb-6">
                <Link href="/cliente" className="flex items-center gap-2">
                    <span className="text-2xl">🤝</span>
                    <span className="font-bold text-lg text-neutral-900">Mãos Amigas</span>
                </Link>
            </div>

            <div className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <PortalNavItem
                        key={item.href}
                        href={item.href}
                        icon={<item.icon className="w-5 h-5" />}
                        label={item.label}
                        badge={item.href === '/cliente/mensagens' ? unreadCount : undefined}
                    />
                ))}
            </div>

            <div className="my-4 border-t border-neutral-200" />

            <div className="space-y-1">
                {secondaryItems.map((item) => (
                    <PortalNavItem
                        key={item.href}
                        href={item.href}
                        icon={<item.icon className="w-5 h-5" />}
                        label={item.label}
                    />
                ))}
            </div>
        </nav>
    );
}
