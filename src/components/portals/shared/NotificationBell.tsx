'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotificationStore } from '@/stores/notificationStore';
import { cn } from '@/lib/utils/cn';

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const recentNotifications = notifications.slice(0, 10);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'border-l-danger-500';
            case 'high': return 'border-l-warning-500';
            case 'medium': return 'border-l-brand-500';
            default: return 'border-l-neutral-300';
        }
    };

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
            >
                <Bell className="w-5 h-5 text-neutral-600" />

                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-strong border border-neutral-200 overflow-hidden z-50"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                            <h3 className="font-semibold text-neutral-900">Notificações</h3>

                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    Marcar todas como lidas
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {recentNotifications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Bell className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                                    <p className="text-neutral-500">Nenhuma notificação</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-neutral-100">
                                    {recentNotifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            layout
                                            className={cn(
                                                'px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer',
                                                'border-l-4',
                                                getPriorityColor(notification.priority),
                                                !notification.read && 'bg-brand-50/30'
                                            )}
                                            onClick={() => {
                                                markAsRead(notification.id);
                                                if (notification.actionUrl) {
                                                    window.location.href = notification.actionUrl;
                                                }
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn('text-sm', !notification.read && 'font-medium')}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-neutral-500 mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-neutral-400 mt-1">
                                                        {formatDistanceToNow(new Date(notification.createdAt), {
                                                            locale: ptBR,
                                                            addSuffix: true,
                                                        })}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(notification.id);
                                                    }}
                                                    className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {notifications.length > 10 && (
                            <div className="px-4 py-2 border-t border-neutral-100 text-center">
                                <a href="/notificacoes" className="text-sm text-brand-600 hover:text-brand-700">
                                    Ver todas as notificações
                                </a>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
