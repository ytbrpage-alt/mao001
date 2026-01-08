'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Users, User, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useChatStore } from '@/stores/chatStore';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';
import type { Conversation } from '@/types/chat';

interface ConversationListProps {
    onSelectConversation: (conversationId: string) => void;
    selectedId?: string | null;
}

function ConversationItem({
    conversation,
    currentUserId,
    isSelected,
    onClick,
}: {
    conversation: Conversation;
    currentUserId: string;
    isSelected: boolean;
    onClick: () => void;
}) {
    // Nome da conversa
    const getDisplayName = () => {
        if (conversation.type === 'patient_care') {
            return `Grupo: ${conversation.patientName}`;
        }
        if (conversation.type === 'direct') {
            const other = conversation.participants.find(p => p.userId !== currentUserId);
            return other?.userName || 'Conversa';
        }
        return 'Grupo';
    };

    // Avatar
    const getAvatar = () => {
        if (conversation.type === 'patient_care') {
            return <Users className="w-5 h-5" />;
        }
        if (conversation.type === 'direct') {
            const other = conversation.participants.find(p => p.userId !== currentUserId);
            if (other?.userAvatar) {
                return <img src={other.userAvatar} alt="" className="w-full h-full rounded-full object-cover" />;
            }
            return other?.userName.split(' ').map(n => n[0]).slice(0, 2).join('') || '?';
        }
        return <Users className="w-5 h-5" />;
    };

    // Contagem não lida (para este usuário)
    const unreadCount = conversation.unreadCount;

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                'w-full flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors',
                isSelected && 'bg-brand-50'
            )}
        >
            {/* Avatar */}
            <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                conversation.type === 'patient_care'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-brand-100 text-brand-600',
                'text-sm font-medium'
            )}>
                {getAvatar()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                        'font-medium truncate',
                        unreadCount > 0 ? 'text-neutral-900' : 'text-neutral-700'
                    )}>
                        {getDisplayName()}
                    </p>
                    {conversation.lastMessage && (
                        <span className="text-xs text-neutral-400 flex-shrink-0">
                            {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), {
                                locale: ptBR,
                                addSuffix: false,
                            })}
                        </span>
                    )}
                </div>

                {conversation.lastMessage && (
                    <p className={cn(
                        'text-sm truncate mt-0.5',
                        unreadCount > 0 ? 'text-neutral-700 font-medium' : 'text-neutral-500'
                    )}>
                        {conversation.lastMessage.senderName.split(' ')[0]}: {conversation.lastMessage.content}
                    </p>
                )}
            </div>

            {/* Badge não lidas */}
            {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </motion.button>
    );
}

export function ConversationList({ onSelectConversation, selectedId }: ConversationListProps) {
    const { user } = useAuth();
    const { getConversationsForUser } = useChatStore();
    const [searchQuery, setSearchQuery] = useState('');

    const conversations = user ? getConversationsForUser(user.id) : [];

    const filteredConversations = conversations.filter(c => {
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();

        // Buscar no nome do paciente
        if (c.patientName?.toLowerCase().includes(query)) return true;

        // Buscar nos participantes
        if (c.participants.some(p => p.userName.toLowerCase().includes(query))) return true;

        // Buscar na última mensagem
        if (c.lastMessage?.content.toLowerCase().includes(query)) return true;

        return false;
    });

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-neutral-900">Mensagens</h2>
                    <button className="p-2 bg-brand-500 text-white rounded-full hover:bg-brand-600">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* Busca */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar conversas..."
                        className="w-full pl-9 pr-4 py-2 bg-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500 p-8">
                        <MessageCircle className="w-12 h-12 mb-3 text-neutral-300" />
                        <p className="text-center">
                            {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {filteredConversations.map(conversation => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                currentUserId={user?.id || ''}
                                isSelected={selectedId === conversation.id}
                                onClick={() => onSelectConversation(conversation.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
