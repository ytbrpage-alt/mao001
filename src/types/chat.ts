/**
 * Sistema de Chat - Tipos
 * 
 * Funcionalidades:
 * - Conversas 1:1 e em grupo
 * - Mensagens texto, áudio, imagem
 * - Status de leitura
 * - Notificações
 * - Histórico persistente
 */

export type MessageType = 'text' | 'image' | 'audio' | 'file' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type ConversationType = 'direct' | 'group' | 'patient_care';

export interface Message {
    id: string;
    conversationId: string;

    // Remetente
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    senderRole: string;

    // Conteúdo
    type: MessageType;
    content: string;
    mediaUrl?: string;
    mediaType?: string;
    mediaThumbnail?: string;

    // Metadados
    status: MessageStatus;
    readBy: { userId: string; readAt: Date }[];

    // Reply
    replyTo?: {
        messageId: string;
        content: string;
        senderName: string;
    };

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface Conversation {
    id: string;
    type: ConversationType;

    // Para conversas de paciente
    patientId?: string;
    patientName?: string;

    // Participantes
    participants: ConversationParticipant[];

    // Última mensagem
    lastMessage?: {
        content: string;
        senderName: string;
        timestamp: Date;
        type: MessageType;
    };

    // Contadores
    unreadCount: number;
    totalMessages: number;

    // Config
    isArchived: boolean;
    isMuted: boolean;
    mutedUntil?: Date;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface ConversationParticipant {
    userId: string;
    userName: string;
    userAvatar?: string;
    userRole: string;

    joinedAt: Date;
    lastReadAt?: Date;
    lastSeenAt?: Date;

    isAdmin: boolean;
    canSendMessages: boolean;
    notifications: boolean;
}

export interface ChatState {
    conversations: Record<string, Conversation>;
    messages: Record<string, Message[]>; // por conversationId
    activeConversationId: string | null;
    isLoading: boolean;
    isTyping: Record<string, string[]>; // conversationId -> userIds typing
}
