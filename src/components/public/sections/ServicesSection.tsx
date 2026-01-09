'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Heart,
    Stethoscope,
    Calendar,
    Brain,
    ArrowRight,
    CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const SERVICES = [
    {
        id: 'cuidado-domiciliar',
        title: 'Cuidado Domiciliar 24h',
        description: 'Assistência completa no conforto do lar, com profissionais qualificados disponíveis 24 horas por dia.',
        icon: Heart,
        features: [
            'Higiene e cuidados pessoais',
            'Preparo de refeições',
            'Administração de medicamentos',
            'Mobilidade e transferências',
            'Companhia e suporte emocional',
        ],
        gradient: 'from-brand-500 to-emerald-500',
        iconBg: 'bg-brand-100 text-brand-600',
        accentColor: 'text-brand-600',
    },
    {
        id: 'acompanhamento-medico',
        title: 'Acompanhamento Médico',
        description: 'Acompanhamento em consultas, exames e procedimentos médicos com registro completo.',
        icon: Stethoscope,
        features: [
            'Transporte para consultas',
            'Registro de histórico médico',
            'Comunicação com médicos',
            'Gestão de medicamentos',
            'Relatórios detalhados',
        ],
        gradient: 'from-blue-500 to-cyan-500',
        iconBg: 'bg-blue-100 text-blue-600',
        accentColor: 'text-blue-600',
    },
    {
        id: 'atividades-diarias',
        title: 'Atividades Diárias',
        description: 'Estímulo cognitivo e físico através de atividades personalizadas e terapias ocupacionais.',
        icon: Calendar,
        features: [
            'Exercícios físicos adaptados',
            'Estimulação cognitiva',
            'Atividades recreativas',
            'Passeios e socialização',
            'Terapia ocupacional',
        ],
        gradient: 'from-purple-500 to-pink-500',
        iconBg: 'bg-purple-100 text-purple-600',
        accentColor: 'text-purple-600',
    },
    {
        id: 'cuidados-especializados',
        title: 'Cuidados Especializados',
        description: 'Equipe treinada para cuidados específicos de Alzheimer, Parkinson e outras condições.',
        icon: Brain,
        features: [
            'Cuidadores especializados',
            'Protocolos específicos',
            'Ambiente seguro e adaptado',
            'Estimulação adequada',
            'Suporte familiar',
        ],
        gradient: 'from-orange-500 to-red-500',
        iconBg: 'bg-orange-100 text-orange-600',
        accentColor: 'text-orange-600',
    },
];

/**
 * Services section showcasing the main service offerings
 * Features:
 * - Animated cards with Framer Motion
 * - Gradient accents unique to each service
 * - Feature lists with checkmarks
 * - Hover effects with scale and shadow
 * - Responsive 2-column grid
 */
export function ServicesSection() {
    return (
        <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-neutral-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                        Nossos Serviços
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                        Cuidado Completo e Personalizado
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                        Oferecemos uma gama completa de serviços profissionais,
                        adaptados às necessidades específicas de cada família.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {SERVICES.map((service, index) => {
                        const Icon = service.icon;

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className={cn(
                                    'h-full bg-white rounded-2xl overflow-hidden',
                                    'border border-neutral-200 shadow-sm',
                                    'hover:shadow-2xl hover:border-neutral-300 hover:-translate-y-1',
                                    'transition-all duration-300 group'
                                )}>
                                    {/* Gradient Top Bar */}
                                    <div className={`h-1.5 bg-gradient-to-r ${service.gradient}`} />

                                    <div className="p-6 lg:p-8">
                                        {/* Header */}
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className={cn(
                                                'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
                                                'bg-gradient-to-br shadow-lg',
                                                service.gradient,
                                                'group-hover:scale-110 transition-transform duration-300'
                                            )}>
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 mb-2 group-hover:text-brand-600 transition-colors">
                                                    {service.title}
                                                </h3>
                                                <p className="text-neutral-600 leading-relaxed">
                                                    {service.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Features List */}
                                        <ul className="space-y-3 mb-6">
                                            {service.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-3">
                                                    <CheckCircle className={cn(
                                                        'w-5 h-5 flex-shrink-0 mt-0.5',
                                                        service.accentColor
                                                    )} />
                                                    <span className="text-neutral-700">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Link */}
                                        <Link
                                            href={`/servicos#${service.id}`}
                                            className={cn(
                                                'inline-flex items-center gap-2 font-semibold',
                                                service.accentColor,
                                                'hover:gap-3 transition-all'
                                            )}
                                        >
                                            Saiba mais
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center"
                >
                    <Link
                        href="/contato"
                        className={cn(
                            'inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg',
                            'bg-gradient-to-r from-brand-600 to-emerald-600 text-white',
                            'shadow-xl shadow-brand-500/25',
                            'hover:shadow-2xl hover:shadow-brand-500/40 hover:scale-105',
                            'active:scale-95 transition-all duration-300'
                        )}
                    >
                        Agendar Avaliação Gratuita
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
