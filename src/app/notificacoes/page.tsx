'use client';

import { motion } from 'framer-motion';
import {
    Bell,
    CheckCircle,
    AlertCircle,
    Info,
    Calendar,
    CreditCard,
    FileText,
    MessageCircle,
    Trash2,
    Check,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { formatRelativeDate } from '@/lib/utils/formatters';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'message' | 'reminder' | 'payment';
    title: string;
    description: string;
    date: Date;
    read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'reminder',
        title: 'Lembrete de medicação',
        description: 'Hora de administrar Losartana 50mg',
        date: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
    },
    {
        id: '2',
        type: 'message',
        title: 'Nova mensagem',
        description: 'Maria Silva enviou uma mensagem',
        date: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: false,
    },
    {
        id: '3',
        type: 'payment',
        title: 'Fatura disponível',
        description: 'Sua fatura de Janeiro está pronta',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: true,
    },
    {
        id: '4',
        type: 'success',
        title: 'Evolução registrada',
        description: 'Nova evolução do paciente foi adicionada',
        date: new Date(Date.now() - 1000 * 60 * 60 * 48),
        read: true,
    },
];

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'info': return Info;
        case 'success': return CheckCircle;
        case 'warning': return AlertCircle;
        case 'message': return MessageCircle;
        case 'reminder': return Calendar;
        case 'payment': return CreditCard;
        default: return Bell;
    }
};

const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
        case 'info': return 'bg-info-100 text-info-600 dark:bg-info-900/30 dark:text-info-400';
        case 'success': return 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400';
        case 'warning': return 'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400';
        case 'message': return 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400';
        case 'reminder': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
        case 'payment': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
        default: return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';
    }
};

export default function NotificacoesPage() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    return (
        <div className="min-h-screen pb-24" style={{ backgroundColor: 'rgb(var(--color-bg))' }}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container-mobile py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>
                            Notificações
                        </h1>
                        {unreadCount > 0 && (
                            <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                        >
                            Marcar todas como lidas
                        </button>
                    )}
                </div>
            </div>

            <div className="container-mobile py-6">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                        <h2 className="text-lg font-semibold mb-2" style={{ color: 'rgb(var(--color-text))' }}>
                            Nenhuma notificação
                        </h2>
                        <p style={{ color: 'rgb(var(--color-text-secondary))' }}>
                            Você está em dia!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification, index) => {
                            const Icon = getNotificationIcon(notification.type);
                            return (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        'card p-4 relative',
                                        !notification.read && 'border-l-4 border-l-brand-500'
                                    )}
                                >
                                    <div className="flex gap-4">
                                        <div className={cn(
                                            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                                            getNotificationColor(notification.type)
                                        )}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className={cn(
                                                    'font-medium',
                                                    !notification.read && 'font-semibold'
                                                )} style={{ color: 'rgb(var(--color-text))' }}>
                                                    {notification.title}
                                                </h3>
                                                <span className="text-xs whitespace-nowrap" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                                    {formatRelativeDate(notification.date)}
                                                </span>
                                            </div>
                                            <p className="text-sm mt-1" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                                {notification.description}
                                            </p>
                                            <div className="flex gap-3 mt-3">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Marcar como lida
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="text-xs text-neutral-500 hover:text-error-600 flex items-center gap-1"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
