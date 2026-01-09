'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    MessageCircle,
    CheckCircle,
    Loader2,
} from 'lucide-react';
import type { ContactForm } from '@/types/public.types';

/**
 * Contact page with form and contact information
 * Client component for form handling
 */
export default function ContatoPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (isSubmitted) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center py-16">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-success-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                        Mensagem Enviada!
                    </h2>
                    <p className="text-neutral-600 mb-6">
                        Obrigado pelo contato! Nossa equipe entrará em contato em até 24 horas úteis.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
                    >
                        Voltar ao Início
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-br from-brand-50 to-white py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900">
                            Entre em Contato
                        </h1>
                        <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
                            Estamos prontos para ajudar você e sua família. Preencha o formulário
                            ou entre em contato pelos nossos canais de atendimento.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900 mb-8">
                                Canais de Atendimento
                            </h2>
                            <div className="space-y-6">
                                <a
                                    href="tel:+5511999999999"
                                    className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-brand-50 transition-colors group"
                                >
                                    <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-success-200 transition-colors">
                                        <Phone className="w-6 h-6 text-success-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-900">Telefone</p>
                                        <p className="text-brand-600 font-medium">(11) 99999-9999</p>
                                        <p className="text-sm text-neutral-500">Atendimento 24 horas</p>
                                    </div>
                                </a>
                                <a
                                    href="https://wa.me/5511999999999"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-brand-50 transition-colors group"
                                >
                                    <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-success-200 transition-colors">
                                        <MessageCircle className="w-6 h-6 text-success-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-900">WhatsApp</p>
                                        <p className="text-brand-600 font-medium">(11) 99999-9999</p>
                                        <p className="text-sm text-neutral-500">Resposta rápida</p>
                                    </div>
                                </a>
                                <a
                                    href="mailto:contato@maosamigashomecare.com.br"
                                    className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-brand-50 transition-colors group"
                                >
                                    <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-200 transition-colors">
                                        <Mail className="w-6 h-6 text-brand-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-900">E-mail</p>
                                        <p className="text-brand-600 font-medium">contato@maosamigashomecare.com.br</p>
                                        <p className="text-sm text-neutral-500">Resposta em até 24h</p>
                                    </div>
                                </a>
                                <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-900">Endereço</p>
                                        <p className="text-neutral-600">São Paulo - SP</p>
                                        <p className="text-sm text-neutral-500">Atendemos toda Grande SP</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-900">Horário</p>
                                        <p className="text-neutral-600">Atendimento 24 horas</p>
                                        <p className="text-sm text-neutral-500">7 dias por semana</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-neutral-50 p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                                Solicite uma Avaliação Gratuita
                            </h2>
                            <p className="text-neutral-600 mb-6">
                                Preencha o formulário e entraremos em contato rapidamente.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Nome completo *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                                            E-mail *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Telefone *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                            placeholder="(11) 99999-9999"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Assunto *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="avaliacao">Solicitar avaliação gratuita</option>
                                        <option value="orcamento">Solicitar orçamento</option>
                                        <option value="duvidas">Tirar dúvidas</option>
                                        <option value="trabalhe">Trabalhe conosco</option>
                                        <option value="outro">Outro assunto</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Mensagem *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                                        placeholder="Conte-nos sobre sua necessidade..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Enviar Mensagem
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
