'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Bell,
    Moon,
    Globe,
    Lock,
    Smartphone,
    ChevronRight,
    ToggleLeft,
    ToggleRight,
    User,
    Shield,
    HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SettingItemProps {
    icon: typeof Settings;
    label: string;
    description?: string;
    onClick?: () => void;
    toggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
}

function SettingItem({ icon: Icon, label, description, onClick, toggle, toggleValue, onToggle }: SettingItemProps) {
    return (
        <button
            onClick={toggle ? () => onToggle?.(!toggleValue) : onClick}
            className="w-full flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="flex-1 text-left">
                <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{label}</p>
                {description && (
                    <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{description}</p>
                )}
            </div>
            {toggle ? (
                toggleValue ? (
                    <ToggleRight className="w-6 h-6 text-brand-500" />
                ) : (
                    <ToggleLeft className="w-6 h-6 text-neutral-400" />
                )
            ) : (
                <ChevronRight className="w-5 h-5 text-neutral-400" />
            )}
        </button>
    );
}

export default function ConfiguracoesPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [biometric, setBiometric] = useState(false);

    return (
        <div className="min-h-screen pb-24" style={{ backgroundColor: 'rgb(var(--color-bg))' }}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container-mobile py-4">
                    <h1 className="text-xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>
                        Configurações
                    </h1>
                </div>
            </div>

            <div className="container-mobile py-6 space-y-6">
                {/* Conta */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-0 overflow-hidden"
                >
                    <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                        <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                            Conta
                        </h2>
                    </div>
                    <SettingItem icon={User} label="Perfil" description="Alterar dados pessoais" />
                    <SettingItem icon={Lock} label="Segurança" description="Senha e autenticação" />
                    <SettingItem icon={Shield} label="Privacidade" description="Gerenciar dados" />
                </motion.div>

                {/* Preferências */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-0 overflow-hidden"
                >
                    <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                        <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                            Preferências
                        </h2>
                    </div>
                    <SettingItem
                        icon={Moon}
                        label="Modo escuro"
                        description="Ativar tema escuro"
                        toggle
                        toggleValue={darkMode}
                        onToggle={setDarkMode}
                    />
                    <SettingItem
                        icon={Bell}
                        label="Notificações"
                        description="Receber alertas"
                        toggle
                        toggleValue={notifications}
                        onToggle={setNotifications}
                    />
                    <SettingItem icon={Globe} label="Idioma" description="Português (BR)" />
                </motion.div>

                {/* Dispositivo */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-0 overflow-hidden"
                >
                    <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                        <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                            Dispositivo
                        </h2>
                    </div>
                    <SettingItem
                        icon={Smartphone}
                        label="Biometria"
                        description="Login com digital/Face ID"
                        toggle
                        toggleValue={biometric}
                        onToggle={setBiometric}
                    />
                </motion.div>

                {/* Suporte */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-0 overflow-hidden"
                >
                    <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                        <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                            Suporte
                        </h2>
                    </div>
                    <SettingItem icon={HelpCircle} label="Central de Ajuda" description="FAQ e tutoriais" />
                </motion.div>

                {/* Versão */}
                <div className="text-center pt-4">
                    <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                        Mãos Amigas v2.0.0
                    </p>
                </div>
            </div>
        </div>
    );
}
