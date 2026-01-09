'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Phone, Star, Heart, Shield, Clock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const TRUST_BADGES = [
    { value: '15+', label: 'Anos de Experiência', icon: Clock },
    { value: '500+', label: 'Famílias Atendidas', icon: Heart },
    { value: '98%', label: 'Satisfação', icon: Star },
];

/**
 * Hero section for landing page
 * Features:
 * - Full viewport height with gradient background
 * - Animated content with Framer Motion
 * - Dual CTAs (primary + WhatsApp)
 * - Trust badges with stats
 * - Scroll indicator
 * - Decorative floating elements
 */
export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-800" />

            {/* Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
                {/* Animated Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-white text-sm font-medium mb-8"
                >
                    <Shield className="w-4 h-4" />
                    <span>Referência em Home Care na região de Toledo-PR</span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                >
                    Cuidado Profissional e
                    <br />
                    <span className="text-yellow-300">Humanizado</span> para
                    <br />
                    Seus Entes Queridos
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
                >
                    Equipe qualificada de cuidadores em Toledo-PR.
                    Atendimento 24h, planos personalizados e total transparência.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                >
                    <Link
                        href="/site/contato"
                        className={cn(
                            'inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg',
                            'bg-white text-brand-600 shadow-2xl shadow-black/20',
                            'hover:bg-neutral-100 hover:scale-105 hover:shadow-3xl',
                            'active:scale-95 transition-all duration-300'
                        )}
                    >
                        Agendar Avaliação Gratuita
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <Link
                        href="/site/servicos"
                        className={cn(
                            'inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg',
                            'bg-white/10 backdrop-blur-sm text-white border-2 border-white/30',
                            'hover:bg-white/20 hover:border-white/50',
                            'active:scale-95 transition-all duration-300'
                        )}
                    >
                        Conhecer Nossos Serviços
                    </Link>

                    <a
                        href="https://wa.me/554599999999"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            'inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg',
                            'bg-green-500 text-white shadow-lg shadow-green-600/30',
                            'hover:bg-green-400 hover:scale-105 hover:shadow-xl',
                            'active:scale-95 transition-all duration-300'
                        )}
                    >
                        <Phone className="w-5 h-5" />
                        WhatsApp
                    </a>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
                >
                    {TRUST_BADGES.map((badge, index) => (
                        <motion.div
                            key={badge.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                            className="text-center"
                        >
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                <badge.icon className="w-6 h-6 text-yellow-300" />
                            </div>
                            <div className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-1">
                                {badge.value}
                            </div>
                            <div className="text-white/80 text-xs sm:text-sm">
                                {badge.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="w-7 h-12 border-2 border-white/40 rounded-full flex justify-center pt-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1.5 h-3 bg-white/60 rounded-full"
                        />
                    </div>
                    <span className="block text-white/50 text-xs mt-2">Role para baixo</span>
                </motion.div>
            </div>

            {/* Decorative Floating Elements */}
            <motion.div
                animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-32 left-[10%] w-24 h-24 bg-white/5 rounded-full blur-2xl"
            />
            <motion.div
                animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-32 right-[10%] w-40 h-40 bg-white/5 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute top-1/3 right-[20%] w-16 h-16 bg-yellow-400/10 rounded-full blur-xl"
            />

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>
    );
}
