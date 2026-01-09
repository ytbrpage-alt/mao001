'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, Phone, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const TRUST_BADGES = [
    { icon: CheckCircle, text: 'Sem compromisso' },
    { icon: CheckCircle, text: '100% gratuito' },
    { icon: CheckCircle, text: 'Resposta em 2h' },
];

/**
 * Call-to-action section for conversions
 * Features:
 * - Gradient background with decorative elements
 * - Dual CTAs (primary + secondary)
 * - Trust badges
 * - Framer Motion animations
 */
export function CTASection() {
    return (
        <section className="py-20 lg:py-28 bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-700 relative overflow-hidden">
            {/* Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Floating decorative elements */}
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-20 left-[10%] w-32 h-32 bg-white/5 rounded-full blur-2xl"
            />
            <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                className="absolute bottom-20 right-[10%] w-48 h-48 bg-white/5 rounded-full blur-3xl"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                        Pronto para Começar?
                    </h2>
                    <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed">
                        Agende uma avaliação gratuita e descubra como podemos cuidar
                        de quem você ama com profissionalismo e carinho.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                        <Link
                            href="/contato"
                            className={cn(
                                'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg',
                                'bg-white text-brand-600 shadow-2xl shadow-black/20',
                                'hover:bg-neutral-100 hover:scale-105',
                                'active:scale-95 transition-all duration-300'
                            )}
                        >
                            <Calendar className="w-5 h-5" />
                            Agendar Avaliação Gratuita
                            <ArrowRight className="w-5 h-5" />
                        </Link>

                        <a
                            href="https://wa.me/554599999999"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg',
                                'bg-green-500 text-white shadow-lg shadow-green-600/30',
                                'hover:bg-green-400 hover:scale-105',
                                'active:scale-95 transition-all duration-300'
                            )}
                        >
                            <Phone className="w-5 h-5" />
                            Falar no WhatsApp
                        </a>
                    </div>

                    {/* Trust badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-6 text-white/90 text-sm"
                    >
                        {TRUST_BADGES.map((badge) => (
                            <div key={badge.text} className="flex items-center gap-2">
                                <badge.icon className="w-4 h-4 text-yellow-300" />
                                <span>{badge.text}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
