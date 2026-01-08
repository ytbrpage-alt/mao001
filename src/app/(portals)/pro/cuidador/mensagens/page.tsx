'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Video, MoreVertical, MessageCircle, Users } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { useAuth } from '@/contexts/AuthContext';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { cn } from '@/lib/utils/cn';

export default function CaregiverMessagesPage() {
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const { getConversation, setActiveConversation, activeConversationId } = useChatStore();

    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
        searchParams.get('conversation') || activeConversationId
    );
    const [showMobileChat, setShowMobileChat] = useState(false);

    const selectedConversation = selectedConversationId
        ? getConversation(selectedConversationId)
        : null;

    // Atualizar conversa ativa
    useEffect(() => {
        if (selectedConversationId) {
            setActiveConversation(selectedConversationId);
        }
    }, [selectedConversationId, setActiveConversation]);

    const handleSelectConversation = (id: string) => {
        setSelectedConversationId(id);
        setShowMobileChat(true);
    };

    const handleBack = () => {
        setShowMobileChat(false);
    };

    // Nome do outro participante (para conversas diretas)
    const getOtherParticipantName = () => {
        if (!selectedConversation || !user) return '';

        if (selectedConversation.type === 'patient_care') {
            return `Grupo: ${selectedConversation.patientName}`;
        }

        const other = selectedConversation.participants.find(p => p.userId !== user.id);
        return other?.userName || 'Conversa';
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] overflow-hidden -mx-4 -my-4">
            {/* Lista de conversas */}
            <div className={cn(
                'w-full lg:w-80 xl:w-96 border-r flex-shrink-0',
                'border-neutral-200 dark:border-neutral-700',
                showMobileChat && 'hidden lg:block'
            )}>
                <ConversationList
                    onSelectConversation={handleSelectConversation}
                    selectedId={selectedConversationId}
                />
            </div>

            {/* Área do chat */}
            <div className={cn(
                'flex-1 flex flex-col',
                'bg-white dark:bg-neutral-900',
                !showMobileChat && 'hidden lg:flex'
            )}>
                {selectedConversation ? (
                    <>
                        {/* Header do chat */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                {/* Voltar (mobile) */}
                                <button
                                    onClick={handleBack}
                                    className="lg:hidden p-2 -ml-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                                >
                                    <ArrowLeft className="w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                                </button>

                                {/* Avatar */}
                                <div className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                                    selectedConversation.type === 'patient_care'
                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                        : 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                                )}>
                                    {selectedConversation.type === 'patient_care' ? (
                                        <Users className="w-5 h-5" />
                                    ) : (
                                        getOtherParticipantName().split(' ').map(n => n[0]).slice(0, 2).join('')
                                    )}
                                </div>

                                {/* Info */}
                                <div>
                                    <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                                        {getOtherParticipantName()}
                                    </p>
                                    <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                        {selectedConversation.participants.length} participantes
                                    </p>
                                </div>
                            </div>

                            {/* Ações */}
                            <div className="flex items-center gap-1">
                                <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
                                    <Phone className="w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                                </button>
                                <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
                                    <Video className="w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                                </button>
                                <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
                                    <MoreVertical className="w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                                </button>
                            </div>
                        </div>

                        {/* Chat */}
                        <ChatInterface conversationId={selectedConversationId!} />
                    </>
                ) : (
                    // Estado vazio
                    <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--color-bg-secondary))' }}>
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-10 h-10 text-neutral-400" />
                            </div>
                            <p className="font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                Selecione uma conversa para começar
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
