import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Notification, NotificationType, NotificationPriority } from '@/types/notifications';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;

    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'deliveredVia'>) => string;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;

    getNotificationsByType: (type: NotificationType) => Notification[];
    getUnreadNotifications: () => Notification[];
    getNotificationsByPriority: (priority: NotificationPriority) => Notification[];

    removeExpired: () => number;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,

            addNotification: (notification) => {
                const id = uuidv4();
                const now = new Date();

                const newNotification: Notification = {
                    ...notification,
                    id,
                    createdAt: now,
                    read: false,
                    deliveredVia: ['in_app'],
                };

                set((state) => ({
                    notifications: [newNotification, ...state.notifications].slice(0, 100),
                    unreadCount: state.unreadCount + 1,
                }));

                return id;
            },

            markAsRead: (id) => {
                set((state) => {
                    const notification = state.notifications.find((n) => n.id === id);
                    if (!notification || notification.read) return state;

                    return {
                        notifications: state.notifications.map((n) =>
                            n.id === id ? { ...n, read: true, readAt: new Date() } : n
                        ),
                        unreadCount: Math.max(0, state.unreadCount - 1),
                    };
                });
            },

            markAllAsRead: () => {
                const now = new Date();
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.read ? n : { ...n, read: true, readAt: now }
                    ),
                    unreadCount: 0,
                }));
            },

            deleteNotification: (id) => {
                set((state) => {
                    const notification = state.notifications.find((n) => n.id === id);
                    return {
                        notifications: state.notifications.filter((n) => n.id !== id),
                        unreadCount: notification && !notification.read
                            ? Math.max(0, state.unreadCount - 1)
                            : state.unreadCount,
                    };
                });
            },

            clearAll: () => {
                set({ notifications: [], unreadCount: 0 });
            },

            getNotificationsByType: (type) => {
                return get().notifications.filter((n) => n.type === type);
            },

            getUnreadNotifications: () => {
                return get().notifications.filter((n) => !n.read);
            },

            getNotificationsByPriority: (priority) => {
                return get().notifications.filter((n) => n.priority === priority);
            },

            removeExpired: () => {
                const now = new Date();
                const { notifications } = get();
                const validNotifications = notifications.filter(
                    (n) => !n.expiresAt || new Date(n.expiresAt) > now
                );
                const removedCount = notifications.length - validNotifications.length;

                if (removedCount > 0) {
                    const unreadRemoved = notifications.filter(
                        (n) => n.expiresAt && new Date(n.expiresAt) <= now && !n.read
                    ).length;

                    set((state) => ({
                        notifications: validNotifications,
                        unreadCount: Math.max(0, state.unreadCount - unreadRemoved),
                    }));
                }

                return removedCount;
            },
        }),
        {
            name: 'maos-amigas-notifications',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
