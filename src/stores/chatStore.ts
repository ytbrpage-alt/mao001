import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
    Message,
    Conversation,
    ConversationType,
    MessageType,
    MessageStatus,
    ConversationParticipant,
    ChatState
} from '@/types/chat';

interface ChatStore extends ChatState {
    // Conversas
    createConversation: (
        type: ConversationType,
        participants: Omit<ConversationParticipant, 'joinedAt'>[],
        patientId?: string,
        patientName?: string
    ) => string;

    getOrCreateDirectConversation: (
        currentUserId: string,
        currentUserName: string,
        currentUserRole: string,
        otherUserId: string,
        otherUserName: string,
        otherUserRole: string
    ) => string;

    archiveConversation: (conversationId: string) => void;
    unarchiveConversation: (conversationId: string) => void;
    muteConversation: (conversationId: string, until?: Date) => void;
    unmuteConversation: (conversationId: string) => void;

    // Mensagens
    sendMessage: (
        conversationId: string,
        senderId: string,
        senderName: string,
        senderRole: string,
        content: string,
        type?: MessageType,
        replyTo?: Message
    ) => string;

    updateMessageStatus: (
        conversationId: string,
        messageId: string,
        status: MessageStatus
    ) => void;

    markAsRead: (conversationId: string, userId: string) => void;
    markAllAsRead: (userId: string) => void;

    deleteMessage: (conversationId: string, messageId: string) => void;

    // Typing indicators
    setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;

    // Navegação
    setActiveConversation: (conversationId: string | null) => void;

    // Queries
    getConversation: (conversationId: string) => Conversation | null;
    getMessages: (conversationId: string) => Message[];
    getUnreadTotal: (userId: string) => number;
    getConversationsForUser: (userId: string) => Conversation[];
    getPatientCareConversation: (patientId: string) => Conversation | null;

    // Busca
    searchMessages: (query: string, conversationId?: string) => Message[];
}

export const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            conversations: {},
            messages: {},
            activeConversationId: null,
            isLoading: false,
            isTyping: {},

            createConversation: (type, participants, patientId, patientName) => {
                const id = uuidv4();
                const now = new Date();

                const conversation: Conversation = {
                    id,
                    type,
                    patientId,
                    patientName,
                    participants: participants.map(p => ({
                        ...p,
                        joinedAt: now,
                        isAdmin: p.isAdmin ?? false,
                        canSendMessages: p.canSendMessages ?? true,
                        notifications: p.notifications ?? true,
                    })),
                    unreadCount: 0,
                    totalMessages: 0,
                    isArchived: false,
                    isMuted: false,
                    createdAt: now,
                    updatedAt: now,
                };

                set(state => ({
                    conversations: { ...state.conversations, [id]: conversation },
                    messages: { ...state.messages, [id]: [] },
                }));

                return id;
            },

            getOrCreateDirectConversation: (
                currentUserId, currentUserName, currentUserRole,
                otherUserId, otherUserName, otherUserRole
            ) => {
                const { conversations } = get();

                // Buscar conversa existente
                const existing = Object.values(conversations).find(c =>
                    c.type === 'direct' &&
                    c.participants.length === 2 &&
                    c.participants.some(p => p.userId === currentUserId) &&
                    c.participants.some(p => p.userId === otherUserId)
                );

                if (existing) return existing.id;

                // Criar nova
                return get().createConversation('direct', [
                    {
                        userId: currentUserId,
                        userName: currentUserName,
                        userRole: currentUserRole,
                        isAdmin: false,
                        canSendMessages: true,
                        notifications: true,
                    },
                    {
                        userId: otherUserId,
                        userName: otherUserName,
                        userRole: otherUserRole,
                        isAdmin: false,
                        canSendMessages: true,
                        notifications: true,
                    },
                ]);
            },

            archiveConversation: (conversationId) => {
                set(state => ({
                    conversations: {
                        ...state.conversations,
                        [conversationId]: {
                            ...state.conversations[conversationId],
                            isArchived: true,
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            unarchiveConversation: (conversationId) => {
                set(state => ({
                    conversations: {
                        ...state.conversations,
                        [conversationId]: {
                            ...state.conversations[conversationId],
                            isArchived: false,
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            muteConversation: (conversationId, until) => {
                set(state => ({
                    conversations: {
                        ...state.conversations,
                        [conversationId]: {
                            ...state.conversations[conversationId],
                            isMuted: true,
                            mutedUntil: until,
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            unmuteConversation: (conversationId) => {
                set(state => ({
                    conversations: {
                        ...state.conversations,
                        [conversationId]: {
                            ...state.conversations[conversationId],
                            isMuted: false,
                            mutedUntil: undefined,
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            sendMessage: (conversationId, senderId, senderName, senderRole, content, type = 'text', replyTo) => {
                const id = uuidv4();
                const now = new Date();

                const message: Message = {
                    id,
                    conversationId,
                    senderId,
                    senderName,
                    senderRole,
                    type,
                    content,
                    status: 'sent',
                    readBy: [{ userId: senderId, readAt: now }],
                    replyTo: replyTo ? {
                        messageId: replyTo.id,
                        content: replyTo.content.substring(0, 100),
                        senderName: replyTo.senderName,
                    } : undefined,
                    createdAt: now,
                    updatedAt: now,
                };

                set(state => {
                    const conversationMessages = state.messages[conversationId] || [];
                    const conversation = state.conversations[conversationId];

                    return {
                        messages: {
                            ...state.messages,
                            [conversationId]: [...conversationMessages, message],
                        },
                        conversations: {
                            ...state.conversations,
                            [conversationId]: {
                                ...conversation,
                                lastMessage: {
                                    content: type === 'text' ? content : `[${type}]`,
                                    senderName,
                                    timestamp: now,
                                    type,
                                },
                                totalMessages: conversation.totalMessages + 1,
                                unreadCount: conversation.unreadCount + (conversation.participants.length - 1),
                                updatedAt: now,
                            },
                        },
                    };
                });

                return id;
            },

            updateMessageStatus: (conversationId, messageId, status) => {
                set(state => ({
                    messages: {
                        ...state.messages,
                        [conversationId]: state.messages[conversationId]?.map(m =>
                            m.id === messageId ? { ...m, status, updatedAt: new Date() } : m
                        ) || [],
                    },
                }));
            },

            markAsRead: (conversationId, userId) => {
                const now = new Date();

                set(state => {
                    const messages = state.messages[conversationId] || [];
                    const conversation = state.conversations[conversationId];

                    if (!conversation) return state;

                    // Marcar mensagens como lidas
                    const updatedMessages = messages.map(m => {
                        if (m.senderId !== userId && !m.readBy.some(r => r.userId === userId)) {
                            return {
                                ...m,
                                readBy: [...m.readBy, { userId, readAt: now }],
                                status: 'read' as MessageStatus,
                            };
                        }
                        return m;
                    });

                    // Atualizar lastReadAt do participante
                    const updatedParticipants = conversation.participants.map(p =>
                        p.userId === userId ? { ...p, lastReadAt: now, lastSeenAt: now } : p
                    );

                    // Calcular unread
                    const unreadForOthers = updatedMessages.filter(m =>
                        m.senderId !== userId &&
                        m.readBy.length < conversation.participants.length
                    ).length;

                    return {
                        messages: {
                            ...state.messages,
                            [conversationId]: updatedMessages,
                        },
                        conversations: {
                            ...state.conversations,
                            [conversationId]: {
                                ...conversation,
                                participants: updatedParticipants,
                                unreadCount: unreadForOthers,
                            },
                        },
                    };
                });
            },

            markAllAsRead: (userId) => {
                const { conversations } = get();
                Object.keys(conversations).forEach(id => {
                    get().markAsRead(id, userId);
                });
            },

            deleteMessage: (conversationId, messageId) => {
                set(state => ({
                    messages: {
                        ...state.messages,
                        [conversationId]: state.messages[conversationId]?.map(m =>
                            m.id === messageId ? { ...m, deletedAt: new Date(), content: '[Mensagem removida]' } : m
                        ) || [],
                    },
                }));
            },

            setTyping: (conversationId, userId, isTyping) => {
                set(state => {
                    const current = state.isTyping[conversationId] || [];
                    const updated = isTyping
                        ? [...new Set([...current, userId])]
                        : current.filter(id => id !== userId);

                    return {
                        isTyping: {
                            ...state.isTyping,
                            [conversationId]: updated,
                        },
                    };
                });
            },

            setActiveConversation: (conversationId) => {
                set({ activeConversationId: conversationId });
            },

            getConversation: (conversationId) => {
                return get().conversations[conversationId] || null;
            },

            getMessages: (conversationId) => {
                return get().messages[conversationId] || [];
            },

            getUnreadTotal: (userId) => {
                const { conversations } = get();
                return Object.values(conversations)
                    .filter(c => c.participants.some(p => p.userId === userId))
                    .reduce((sum, c) => sum + c.unreadCount, 0);
            },

            getConversationsForUser: (userId) => {
                const { conversations } = get();
                return Object.values(conversations)
                    .filter(c => c.participants.some(p => p.userId === userId) && !c.isArchived)
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            },

            getPatientCareConversation: (patientId) => {
                const { conversations } = get();
                return Object.values(conversations).find(c =>
                    c.type === 'patient_care' && c.patientId === patientId
                ) || null;
            },

            searchMessages: (query, conversationId) => {
                const { messages } = get();
                const lowerQuery = query.toLowerCase();

                const allMessages = conversationId
                    ? messages[conversationId] || []
                    : Object.values(messages).flat();

                return allMessages.filter(m =>
                    m.content.toLowerCase().includes(lowerQuery) &&
                    !m.deletedAt
                );
            },
        }),
        {
            name: 'maos-amigas-chat',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                conversations: state.conversations,
                messages: state.messages,
            }),
        }
    )
);
