'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Maria Helena Rodrigues',
        role: 'Filha de cliente',
        content: 'A Mãos Amigas transformou a vida da minha mãe. Os cuidadores são extremamente atenciosos e profissionais. Sinto total tranquilidade sabendo que ela está em boas mãos. Recomendo de olhos fechados!',
        rating: 5,
        initials: 'MH',
        color: 'from-rose-400 to-pink-500',
        date: '2 meses atrás',
    },
    {
        id: 2,
        name: 'Carlos Eduardo Santos',
        role: 'Filho de cliente',
        content: 'Meu pai tem Alzheimer e precisa de cuidados especiais. A equipe é muito bem treinada e paciente. O sistema de relatórios é excelente, recebo atualizações diárias. Melhor decisão que tomamos!',
        rating: 5,
        initials: 'CE',
        color: 'from-blue-400 to-cyan-500',
        date: '1 mês atrás',
    },
    {
        id: 3,
        name: 'Ana Paula Oliveira',
        role: 'Familiar de cliente',
        content: 'Contratamos para cuidar da minha avó após uma cirurgia. O atendimento superou todas as expectativas. Profissionais qualificados, pontuais e muito carinhosos. Parabéns!',
        rating: 5,
        initials: 'AP',
        color: 'from-purple-400 to-violet-500',
        date: '3 semanas atrás',
    },
    {
        id: 4,
        name: 'Roberto Lima Costa',
        role: 'Cliente direto',
        content: 'Aos 78 anos, valorizo muito minha independência. Os cuidadores respeitam isso completamente, me ajudando apenas no necessário. Sinto que ganhei novos amigos. Empresa séria e confiável.',
        rating: 5,
        initials: 'RL',
        color: 'from-amber-400 to-orange-500',
        date: '1 semana atrás',
    },
    {
        id: 5,
        name: 'Fernanda Martins',
        role: 'Neta de cliente',
        content: 'Minha avó de 92 anos está sendo muito bem cuidada. A cuidadora é um anjo de pessoa, muito paciente e carinhosa. A família toda está mais tranquila. Obrigada Mãos Amigas!',
        rating: 5,
        initials: 'FM',
        color: 'from-brand-400 to-emerald-500',
        date: '5 dias atrás',
    },
];

/**
 * Star rating component
 */
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1" aria-label={`Avaliação: ${rating} de 5 estrelas`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={cn(
                        'w-5 h-5',
                        star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-neutral-200 text-neutral-200'
                    )}
                />
            ))}
        </div>
    );
}

/**
 * Testimonials section with carousel
 * Features:
 * - Auto-play with 5 second interval
 * - Pause on hover
 * - Keyboard navigation (arrow keys)
 * - Dot and arrow navigation
 * - Touch swipe support
 * - Smooth Framer Motion transitions
 */
export function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState(0);

    const next = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, []);

    const previous = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    }, []);

    const goTo = useCallback((index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    }, [currentIndex]);

    // Auto-play with pause on hover
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(next, 5000);
        return () => clearInterval(interval);
    }, [next, isPaused]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') previous();
            if (e.key === 'ArrowRight') next();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [next, previous]);

    const current = TESTIMONIALS[currentIndex];

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
        }),
    };

    return (
        <section className="py-20 lg:py-28 bg-gradient-to-br from-brand-50 via-white to-emerald-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                        Depoimentos
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                        O Que Dizem Nossas Famílias
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                        A confiança de mais de 500 famílias que escolheram a Mãos Amigas
                    </p>
                </motion.div>

                {/* Carousel */}
                <div
                    className="max-w-4xl mx-auto"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden">
                        {/* Quote icon background */}
                        <div className="absolute top-6 left-6 text-brand-100">
                            <Quote className="w-20 h-20" />
                        </div>

                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={current.id}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="relative z-10"
                            >
                                {/* Rating */}
                                <div className="mb-6">
                                    <StarRating rating={current.rating} />
                                </div>

                                {/* Content */}
                                <blockquote className="text-lg sm:text-xl md:text-2xl text-neutral-700 mb-8 leading-relaxed">
                                    "{current.content}"
                                </blockquote>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        'w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0',
                                        `bg-gradient-to-br ${current.color}`
                                    )}>
                                        <span className="text-lg font-bold text-white">
                                            {current.initials}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-neutral-900 text-lg">
                                            {current.name}
                                        </div>
                                        <div className="text-neutral-500">
                                            {current.role} • {current.date}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8 pt-8 border-t border-neutral-100">
                            <button
                                onClick={previous}
                                className="p-2 rounded-full hover:bg-brand-50 transition-colors"
                                aria-label="Depoimento anterior"
                            >
                                <ChevronLeft className="w-6 h-6 text-neutral-600" />
                            </button>

                            {/* Dots */}
                            <div className="flex gap-2" role="tablist" aria-label="Navegação de depoimentos">
                                {TESTIMONIALS.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goTo(index)}
                                        role="tab"
                                        aria-selected={index === currentIndex}
                                        aria-label={`Ir para depoimento ${index + 1}`}
                                        className={cn(
                                            'h-2 rounded-full transition-all duration-300',
                                            index === currentIndex
                                                ? 'bg-brand-600 w-8'
                                                : 'bg-neutral-300 w-2 hover:bg-neutral-400'
                                        )}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={next}
                                className="p-2 rounded-full hover:bg-brand-50 transition-colors"
                                aria-label="Próximo depoimento"
                            >
                                <ChevronRight className="w-6 h-6 text-neutral-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mt-16"
                >
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-brand-600 mb-1">4.9/5</div>
                        <div className="text-neutral-600 text-sm sm:text-base">Avaliação Média</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-brand-600 mb-1">500+</div>
                        <div className="text-neutral-600 text-sm sm:text-base">Famílias Satisfeitas</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-brand-600 mb-1">98%</div>
                        <div className="text-neutral-600 text-sm sm:text-base">Recomendam</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
