'use client';

import { motion } from 'framer-motion';
import {
    Phone,
    Calendar,
    FileText,
    UserCheck,
    Heart,
    CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const STEPS = [
    {
        icon: Phone,
        title: 'Entre em Contato',
        description: 'Ligue, envie WhatsApp ou preencha o formulário. Respondemos em até 2h.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Calendar,
        title: 'Avaliação Gratuita',
        description: 'Visitamos sua casa para entender as necessidades específicas.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: FileText,
        title: 'Plano Personalizado',
        description: 'Criamos um plano de cuidados sob medida, com cronograma e valores.',
        color: 'from-amber-500 to-orange-500',
    },
    {
        icon: UserCheck,
        title: 'Seleção do Cuidador',
        description: 'Escolhemos o profissional ideal baseado no perfil e necessidades.',
        color: 'from-brand-500 to-emerald-500',
    },
    {
        icon: Heart,
        title: 'Início do Cuidado',
        description: 'Cuidador inicia o atendimento conforme o cronograma acordado.',
        color: 'from-rose-500 to-pink-500',
    },
    {
        icon: CheckCircle2,
        title: 'Acompanhamento',
        description: 'Relatórios diários e suporte contínuo da nossa equipe.',
        color: 'from-teal-500 to-cyan-500',
    },
];

/**
 * Process section showing how the service works
 * Features:
 * - 6-step visual timeline
 * - Connecting line on desktop
 * - Animated icons
 * - Responsive grid
 */
export function ProcessSection() {
    return (
        <section className="py-20 lg:py-28 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                        Como Funciona
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                        Processo Simples e Transparente
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                        Do primeiro contato ao cuidado contínuo, acompanhamos você em cada etapa
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connecting line - visible on lg screens */}
                    <div className="hidden lg:block absolute top-16 left-[8%] right-[8%] h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-rose-500 rounded-full opacity-20" />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="text-center group"
                                >
                                    {/* Step number */}
                                    <div className="relative inline-block mb-4">
                                        <div className={cn(
                                            'w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg',
                                            'bg-gradient-to-br text-white',
                                            'group-hover:scale-110 transition-transform duration-300',
                                            step.color
                                        )}>
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center">
                                            <span className="text-sm font-bold text-neutral-700">
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-neutral-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
