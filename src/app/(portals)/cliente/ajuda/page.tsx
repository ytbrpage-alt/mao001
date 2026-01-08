'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    HelpCircle,
    Search,
    ChevronRight,
    ChevronDown,
    Phone,
    Mail,
    MessageCircle,
    BookOpen,
    FileText,
    Video,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const FAQ_ITEMS = [
    {
        question: 'Como adicionar um novo medicamento?',
        answer: 'Vá em Paciente > Medicamentos e clique no botão "+" para adicionar um novo medicamento à lista.',
    },
    {
        question: 'Como entro em contato com a equipe?',
        answer: 'Use a aba "Mensagens" para enviar uma mensagem direta para os profissionais da sua equipe de cuidado.',
    },
    {
        question: 'Como baixo os documentos do paciente?',
        answer: 'Acesse a seção "Documentos" e clique no ícone de download ao lado de cada documento.',
    },
    {
        question: 'Como altero a forma de pagamento?',
        answer: 'Vá em Financeiro > Formas de Pagamento para cadastrar ou alterar seu método de pagamento.',
    },
    {
        question: 'O que fazer em caso de emergência?',
        answer: 'Em caso de emergência médica, ligue para o SAMU (192) ou vá ao pronto-socorro mais próximo.',
    },
];

const CATEGORIES = [
    { icon: BookOpen, label: 'Guia de Uso', description: 'Aprenda a usar o app' },
    { icon: FileText, label: 'Documentação', description: 'Termos e políticas' },
    { icon: Video, label: 'Tutoriais', description: 'Vídeos explicativos' },
];

export default function AjudaPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const filteredFaq = FAQ_ITEMS.filter(
        (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-24" style={{ backgroundColor: 'rgb(var(--color-bg))' }}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container-mobile py-4">
                    <h1 className="text-xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>
                        Central de Ajuda
                    </h1>
                </div>
            </div>

            <div className="container-mobile py-6 space-y-6">
                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Buscar ajuda..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        style={{ color: 'rgb(var(--color-text))' }}
                    />
                </motion.div>

                {/* Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-3 gap-3"
                >
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.label}
                            className="card p-4 text-center hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                        >
                            <cat.icon className="w-8 h-8 mx-auto mb-2 text-brand-500" />
                            <p className="font-medium text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                {cat.label}
                            </p>
                        </button>
                    ))}
                </motion.div>

                {/* FAQ */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>
                        Perguntas Frequentes
                    </h2>
                    <div className="space-y-3">
                        {filteredFaq.map((item, index) => (
                            <div
                                key={index}
                                className="card overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-4"
                                >
                                    <span className="font-medium text-left" style={{ color: 'rgb(var(--color-text))' }}>
                                        {item.question}
                                    </span>
                                    {expandedFaq === index ? (
                                        <ChevronDown className="w-5 h-5 text-brand-500" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                                    )}
                                </button>
                                {expandedFaq === index && (
                                    <div className="px-4 pb-4">
                                        <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                            {item.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Contact Options */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>
                        Fale Conosco
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        <a
                            href="tel:+5511999999999"
                            className="card p-4 flex items-center gap-4 hover:border-brand-300 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                                <Phone className="w-6 h-6 text-success-600" />
                            </div>
                            <div>
                                <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>Telefone</p>
                                <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>(11) 99999-9999</p>
                            </div>
                        </a>
                        <a
                            href="mailto:suporte@maosamigashomecare.com.br"
                            className="card p-4 flex items-center gap-4 hover:border-brand-300 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-brand-600" />
                            </div>
                            <div>
                                <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>E-mail</p>
                                <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>suporte@maosamigashomecare.com.br</p>
                            </div>
                        </a>
                        <Link
                            href="/cliente/mensagens"
                            className="card p-4 flex items-center gap-4 hover:border-brand-300 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full bg-info-100 dark:bg-info-900/30 flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-info-600" />
                            </div>
                            <div>
                                <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>Chat</p>
                                <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>Converse pelo app</p>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
