'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Paperclip,
    X,
    Reply,
    Check,
    CheckCheck,
    Clock,
    AlertCircle,
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useChatStore } from '@/stores/chatStore';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';
import type { Message, MessageStatus } from '@/types/chat';

interface ChatInterfaceProps {
    conversationId: string;
}

// Componente de bolha de mensagem
function MessageBubble({
    message,
    isOwn,
    showAvatar,
    onReply,
}: {
    message: Message;
    isOwn: boolean;
    showAvatar: boolean;
    onReply: (message: Message) => void;
}) {
    const getStatusIcon = (status: MessageStatus) => {
        switch (status) {
            case 'sending': return <Clock className="w-3 h-3" />;
            case 'sent': return <Check className="w-3 h-3" />;
            case 'delivered': return <CheckCheck className="w-3 h-3" />;
            case 'read': return <CheckCheck className="w-3 h-3 text-blue-400" />;
            case 'failed': return <AlertCircle className="w-3 h-3 text-red-400" />;
        }
    };

    const formatTime = (date: Date) => {
        return format(new Date(date), 'HH:mm');
    };

    if (message.deletedAt) {
        return (
            <div className={cn('flex mb-2', isOwn ? 'justify-end' : 'justify-start')}>
                <div className="italic text-neutral-400 text-sm px-4 py-2">
                    Mensagem removida
                </div>
            </div>
        );
    }

    return (
        <div className={cn('flex gap-2 mb-2 group', isOwn ? 'flex-row-reverse' : 'flex-row')}>
            {/* Avatar */}
            {showAvatar && !isOwn ? (
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-medium flex-shrink-0">
                    {message.senderAvatar ? (
                        <img src={message.senderAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        message.senderName.split(' ').map(n => n[0]).slice(0, 2).join('')
                    )}
                </div>
            ) : (
                <div className="w-8 flex-shrink-0" />
            )}

            {/* Bolha */}
            <div className={cn(
                'max-w-[75%] rounded-2xl px-4 py-2 relative',
                isOwn
                    ? 'bg-brand-500 text-white rounded-br-md'
                    : 'bg-white text-neutral-900 rounded-bl-md shadow-soft'
            )}>
                {/* Nome do remetente (grupos) */}
                {showAvatar && !isOwn && (
                    <p className="text-xs font-medium text-brand-600 mb-1">
                        {message.senderName}
                    </p>
                )}

                {/* Reply preview */}
                {message.replyTo && (
                    <div className={cn(
                        'text-xs p-2 rounded-t-lg border-l-2 mb-1',
                        isOwn
                            ? 'bg-brand-600 border-white/50 text-white/80'
                            : 'bg-neutral-100 border-neutral-400 text-neutral-600'
                    )}>
                        <p className="font-medium">{message.replyTo.senderName}</p>
                        <p className="truncate">{message.replyTo.content}</p>
                    </div>
                )}

                {/* Conteúdo */}
                <div>
                    {/* Texto */}
                    {message.type === 'text' && (
                        <p className="break-words whitespace-pre-wrap">{message.content}</p>
                    )}

                    {/* Imagem */}
                    {message.type === 'image' && message.mediaUrl && (
                        <img src={message.mediaUrl} alt="" className="rounded-lg max-w-full" />
                    )}

                    {/* Rodapé */}
                    <div className="flex items-center justify-end gap-1 mt-1">
                        <span className={cn(
                            'text-xs',
                            isOwn ? 'text-white/70' : 'text-neutral-400'
                        )}>
                            {formatTime(message.createdAt)}
                        </span>
                        {isOwn && getStatusIcon(message.status)}
                    </div>
                </div>

                {/* Menu de ações (hover) */}
                <div className="absolute -top-2 right-0 hidden group-hover:block">
                    <button
                        onClick={() => onReply(message)}
                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-neutral-50"
                        title="Responder"
                    >
                        <Reply className="w-3 h-3 text-neutral-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Separador de data
function DateSeparator({ date }: { date: Date }) {
    const formatDate = (d: Date) => {
        if (isToday(d)) return 'Hoje';
        if (isYesterday(d)) return 'Ontem';
        return format(d, "dd 'de' MMMM", { locale: ptBR });
    };

    return (
        <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-500 font-medium">
                {formatDate(date)}
            </span>
            <div className="flex-1 h-px bg-neutral-200" />
        </div>
    );
}

// Indicador de digitando
function TypingIndicator({ names }: { names: string[] }) {
    if (names.length === 0) return null;

    const text = names.length === 1
        ? `${names[0]} está digitando...`
        : names.length === 2
            ? `${names[0]} e ${names[1]} estão digitando...`
            : `${names[0]} e mais ${names.length - 1} estão digitando...`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-neutral-500 px-4 py-2"
        >
            <div className="flex gap-1">
                <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-neutral-400 rounded-full"
                />
                <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-neutral-400 rounded-full"
                />
                <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-neutral-400 rounded-full"
                />
            </div>
            <span>{text}</span>
        </motion.div>
    );
}

// Componente principal
export function ChatInterface({ conversationId }: ChatInterfaceProps) {
    const { user } = useAuth();
    const {
        getConversation,
        getMessages,
        sendMessage,
        markAsRead,
        setTyping,
        isTyping,
    } = useChatStore();

    const [inputValue, setInputValue] = useState('');
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    const conversation = getConversation(conversationId);
    const messages = getMessages(conversationId);
    const typingUsers = isTyping[conversationId] || [];

    // Scroll para o final
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Marcar como lido ao abrir
    useEffect(() => {
        if (user?.id && conversationId) {
            markAsRead(conversationId, user.id);
        }
    }, [conversationId, user?.id, markAsRead]);

    // Scroll quando novas mensagens
    useEffect(() => {
        scrollToBottom();
    }, [messages.length, scrollToBottom]);

    // Indicador de digitando
    const handleTyping = useCallback(() => {
        if (!user?.id) return;

        setTyping(conversationId, user.id, true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setTyping(conversationId, user.id, false);
        }, 2000);
    }, [conversationId, user?.id, setTyping]);

    // Enviar mensagem
    const handleSend = useCallback(() => {
        if (!inputValue.trim() || !user) return;

        sendMessage(
            conversationId,
            user.id,
            user.fullName,
            user.role || 'user',
            inputValue.trim(),
            'text',
            replyingTo || undefined
        );

        setInputValue('');
        setReplyingTo(null);
        setTyping(conversationId, user.id, false);

        inputRef.current?.focus();
    }, [inputValue, user, conversationId, replyingTo, sendMessage, setTyping]);

    // Enter para enviar
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Agrupar mensagens por data
    const groupedMessages = messages.reduce((groups, message) => {
        const date = format(new Date(message.createdAt), 'yyyy-MM-dd');
        if (!groups[date]) groups[date] = [];
        groups[date].push(message);
        return groups;
    }, {} as Record<string, Message[]>);

    // Nomes dos usuários digitando
    const typingNames = typingUsers
        .filter(id => id !== user?.id)
        .map(id => {
            const participant = conversation?.participants.find(p => p.userId === id);
            return participant?.userName.split(' ')[0] || 'Alguém';
        });

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center text-neutral-500">
                Conversa não encontrada
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Área de mensagens */}
            <div className="flex-1 overflow-y-auto p-4 bg-neutral-50">
                {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                    <div key={date}>
                        <DateSeparator date={new Date(date)} />

                        {dayMessages.map((message, idx) => {
                            const prevMessage = dayMessages[idx - 1];
                            const showAvatar = !prevMessage ||
                                prevMessage.senderId !== message.senderId ||
                                new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 60000;

                            return (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isOwn={message.senderId === user?.id}
                                    showAvatar={showAvatar}
                                    onReply={setReplyingTo}
                                />
                            );
                        })}
                    </div>
                ))}

                <AnimatePresence>
                    {typingNames.length > 0 && (
                        <TypingIndicator names={typingNames} />
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* Reply preview */}
            <AnimatePresence>
                {replyingTo && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-brand-50 border-t border-brand-100"
                    >
                        <div className="flex items-center gap-3 p-3">
                            <div className="flex-1 border-l-2 border-brand-500 pl-3">
                                <div className="flex items-center gap-2">
                                    <Reply className="w-4 h-4 text-brand-500" />
                                    <span className="text-sm font-medium text-brand-600">
                                        Respondendo a {replyingTo.senderName}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-600 truncate mt-0.5">
                                    {replyingTo.content}
                                </p>
                            </div>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="p-1 hover:bg-brand-100 rounded"
                            >
                                <X className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-4 bg-white border-t border-neutral-200">
                <div className="flex items-end gap-2">
                    {/* Anexos */}
                    <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full">
                        <Paperclip className="w-5 h-5" />
                    </button>

                    {/* Campo de texto */}
                    <div className="flex-1">
                        <textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                handleTyping();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Digite uma mensagem..."
                            className="w-full px-4 py-2 bg-neutral-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 max-h-32"
                            rows={1}
                        />
                    </div>

                    {/* Botão enviar */}
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="p-2 bg-brand-500 text-white rounded-full hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
