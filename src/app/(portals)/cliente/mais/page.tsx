'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Users,
    FileText,
    CreditCard,
    Settings,
    HelpCircle,
    ChevronRight,
    Shield,
    Bell,
    Moon,
    LogOut,
    MessageCircle,
    Phone,
    Mail,
    ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';

const mainLinks = [
    { href: '/cliente/profissionais', icon: Users, label: 'Profissionais', description: 'Equipe de cuidado' },
    { href: '/cliente/documentos', icon: FileText, label: 'Documentos', description: 'Contratos e receitas' },
    { href: '/cliente/financeiro', icon: CreditCard, label: 'Financeiro', description: 'Faturas e pagamentos' },
];

const secondaryLinks = [
    { href: '/cliente/configuracoes', icon: Settings, label: 'Configurações' },
    { href: '/cliente/ajuda', icon: HelpCircle, label: 'Central de Ajuda' },
];

const legalLinks = [
    { href: '/termos', label: 'Termos de Uso' },
    { href: '/privacidade', label: 'Política de Privacidade' },
];

export default function ClientMorePage() {
    const { user, logout } = useAuth();

    return (
        <div className="space-y-6 pb-20">
            {/* User Profile */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
            >
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 text-xl font-bold">
                        {user?.fullName?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'U'}
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                            {user?.fullName || 'Usuário'}
                        </h2>
                        <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                            {user?.email || 'email@exemplo.com'}
                        </p>
                        <span className="badge text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-600 mt-1">
                            Familiar
                        </span>
                    </div>
                    <Link href="/cliente/configuracoes" className="p-2">
                        <ChevronRight className="w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                    </Link>
                </div>
            </motion.div>

            {/* Main Links */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
            >
                {mainLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                        <div className="card flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                                <link.icon className="w-6 h-6 text-brand-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                                    {link.label}
                                </p>
                                <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                    {link.description}
                                </p>
                            </div>
                            <ChevronRight className="w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                        </div>
                    </Link>
                ))}
            </motion.div>

            {/* Secondary Links */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card space-y-1"
            >
                {secondaryLinks.map((link, index) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            'flex items-center justify-between py-3',
                            index !== secondaryLinks.length - 1 && 'border-b border-neutral-100 dark:border-neutral-700'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <link.icon className="w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                            <span style={{ color: 'rgb(var(--color-text))' }}>{link.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                    </Link>
                ))}
            </motion.div>

            {/* Contact */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="card"
            >
                <h3 className="font-medium mb-3" style={{ color: 'rgb(var(--color-text))' }}>
                    Precisa de ajuda?
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    <a
                        href="tel:+554532251234"
                        className="flex flex-col items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                        <Phone className="w-5 h-5 text-brand-600" />
                        <span className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>Ligar</span>
                    </a>
                    <a
                        href="https://wa.me/554532251234"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                        <MessageCircle className="w-5 h-5 text-success-600" />
                        <span className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>WhatsApp</span>
                    </a>
                    <a
                        href="mailto:contato@maosamigashomecare.com.br"
                        className="flex flex-col items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                        <Mail className="w-5 h-5 text-brand-600" />
                        <span className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>E-mail</span>
                    </a>
                </div>
            </motion.div>

            {/* Legal */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-4 text-sm"
            >
                {legalLinks.map((link, index) => (
                    <span key={link.href} className="flex items-center gap-4">
                        <Link href={link.href} className="text-brand-600 hover:underline">
                            {link.label}
                        </Link>
                        {index !== legalLinks.length - 1 && (
                            <span style={{ color: 'rgb(var(--color-text-secondary))' }}>•</span>
                        )}
                    </span>
                ))}
            </motion.div>

            {/* Logout */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
            >
                <button
                    onClick={() => logout()}
                    className="w-full card flex items-center justify-center gap-2 py-4 text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sair da Conta</span>
                </button>
            </motion.div>

            {/* Version */}
            <p className="text-center text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                Mãos Amigas v2.0.0
            </p>
        </div>
    );
}
