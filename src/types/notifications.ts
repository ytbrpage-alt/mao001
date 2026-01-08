/**
 * Sistema de notificações unificado para todos os portais
 */

// Tipo de notificação
export type NotificationType =
    | 'schedule_reminder'
    | 'schedule_change'
    | 'schedule_cancellation'
    | 'new_assignment'
    | 'new_message'
    | 'message_reply'
    | 'document_ready'
    | 'document_expiring'
    | 'contract_pending'
    | 'report_available'
    | 'invoice_generated'
    | 'payment_received'
    | 'payment_due'
    | 'payment_overdue'
    | 'patient_update'
    | 'care_plan_update'
    | 'health_alert'
    | 'system_update'
    | 'maintenance'
    | 'security_alert';

// Prioridade da notificação
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// Canal de entrega
export type NotificationChannel = 'push' | 'email' | 'sms' | 'whatsapp' | 'in_app';

// Notificação
export interface Notification {
    id: string;
    userId: string;
    userType: string;
    type: NotificationType;
    title: string;
    message: string;
    imageUrl?: string;
    priority: NotificationPriority;
    read: boolean;
    readAt?: Date;
    actionUrl?: string;
    actionLabel?: string;
    actionData?: Record<string, unknown>;
    channels: NotificationChannel[];
    deliveredVia: NotificationChannel[];
    groupId?: string;
    groupType?: string;
    expiresAt?: Date;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}

// Template de notificação
export interface NotificationTemplate {
    id: string;
    type: NotificationType;
    content: {
        [locale: string]: {
            title: string;
            message: string;
            actionLabel?: string;
        };
    };
    defaultPriority: NotificationPriority;
    defaultChannels: NotificationChannel[];
    expirationHours?: number;
    canBeMuted: boolean;
    groupable: boolean;
}

// Preferências de notificação por tipo
export interface NotificationTypePreference {
    type: NotificationType;
    enabled: boolean;
    channels: NotificationChannel[];
    priority: NotificationPriority;
}
