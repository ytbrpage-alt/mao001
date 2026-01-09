'use client';

import { motion } from 'framer-motion';
import {
    Heart,
    Shield,
    Users,
    Award,
    MapPin,
    Calendar,
    Star,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const VALUES = [
    {
        icon: Heart,
        title: 'Humanização',
        description: 'Tratamos cada idoso como gostaríamos que nossos próprios familiares fossem tratados.',
        color: 'bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
    },
    {
        icon: Shield,
        title: 'Segurança',
        description: 'Protocolos rigorosos e equipe treinada para garantir o bem-estar completo.',
        color: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    },
    {
        icon: Award,
        title: 'Excelência',
        description: 'Buscamos constantemente a melhoria contínua em todos os nossos serviços.',
        color: 'bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    },
    {
        icon: Users,
        title: 'Respeito',
        description: 'Valorizamos a dignidade, autonomia e individualidade de cada pessoa.',
        color: 'bg-brand-100 text-brand-600 group-hover:bg-brand-600 group-hover:text-white',
    },
];

const TEAM = [
    {
        name: 'Maria Silva',
        role: 'Diretora e Fundadora',
        specialty: 'Enfermeira com 20 anos de experiência em geriatria',
        initials: 'MS',
        color: 'from-brand-400 to-emerald-500',
    },
    {
        name: 'João Santos',
        role: 'Coordenador de Equipe',
        specialty: 'Fisioterapeuta especializado em reabilitação geriátrica',
        initials: 'JS',
        color: 'from-blue-400 to-cyan-500',
    },
    {
        name: 'Ana Costa',
        role: 'Gestora de Qualidade',
        specialty: 'Psicóloga com foco em idosos e familiares',
        initials: 'AC',
        color: 'from-purple-400 to-pink-500',
    },
];

const STATS = [
    { value: '15+', label: 'Anos de história', icon: Calendar },
    { value: '500+', label: 'Famílias atendidas', icon: Users },
    { value: '100+', label: 'Profissionais', icon: Award },
    { value: 'Toledo', label: 'Paraná', icon: MapPin },
];

/**
 * About section with company history, values, and team
 * Features:
 * - Story narrative with stats
 * - Values grid with icons and hover effects
 * - Team members with gradient avatars
 * - Framer Motion animations
 */
export function AboutSection() {
    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Our Story */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                            Nossa História
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
                            15 Anos Cuidando com <span className="text-brand-600">Amor</span>
                        </h2>
                        <div className="space-y-4 text-neutral-600 leading-relaxed">
                            <p>
                                A <strong className="text-neutral-900">Mãos Amigas</strong> nasceu em 2011, em Toledo-PR,
                                do sonho de transformar o cuidado de idosos em nossa região. Fundada por
                                Maria Silva, enfermeira com vasta experiência em geriatria, começamos
                                atendendo apenas 3 famílias.
                            </p>
                            <p>
                                Hoje, somos referência em cuidado domiciliar, com uma equipe de mais
                                de 100 profissionais qualificados, atendendo mais de 500 famílias no
                                Oeste do Paraná. Nossa jornada é guiada pelo compromisso inabalável
                                com a <strong className="text-neutral-900">humanização, segurança e excelência</strong> no cuidado.
                            </p>
                            <p className="text-brand-600 font-medium italic">
                                "Cada idoso que atendemos não é apenas um cliente, é parte da nossa
                                grande família Mãos Amigas."
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* Image placeholder with gradient */}
                        <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-brand-100 via-brand-200 to-emerald-200 flex items-center justify-center">
                            <Heart className="w-32 h-32 text-brand-500/30" />
                        </div>

                        {/* Stats overlay */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border border-neutral-100"
                        >
                            <div className="text-4xl font-bold text-brand-600 mb-1">500+</div>
                            <div className="text-neutral-600 font-medium">Famílias Atendidas</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-neutral-100"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-neutral-900 font-bold">4.9</span>
                            </div>
                            <div className="text-neutral-500 text-sm mt-1">Google Reviews</div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Mission & Values */}
                <div className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                            Missão e Valores
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                            O Que Nos Guia
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                            Nossos valores fundamentam cada decisão e ação em nosso trabalho diário
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map((value, index) => {
                            const Icon = value.icon;

                            return (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="text-center group cursor-default"
                                >
                                    <div className={cn(
                                        'inline-flex p-4 rounded-2xl mb-4 transition-all duration-300',
                                        'group-hover:scale-110 group-hover:shadow-lg',
                                        value.color
                                    )}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed">
                                        {value.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Our Team */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                            Nossa Equipe
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                            Profissionais Dedicados
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                            Conheça alguns dos profissionais que lideram nossa missão de cuidar com excelência
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {TEAM.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group"
                            >
                                {/* Avatar placeholder */}
                                <div className={cn(
                                    'relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg',
                                    'group-hover:shadow-2xl transition-shadow duration-300',
                                    `bg-gradient-to-br ${member.color}`
                                )}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-6xl font-bold text-white/60">
                                            {member.initials}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-brand-600 font-semibold mb-2">
                                    {member.role}
                                </p>
                                <p className="text-neutral-600 text-sm">
                                    {member.specialty}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
