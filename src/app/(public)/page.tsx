import Link from 'next/link';
import {
    Heart,
    Shield,
    Clock,
    Users,
    Award,
    Phone,
    ArrowRight,
    Star,
    Stethoscope,
    UserCheck,
    Activity,
} from 'lucide-react';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/public/sections';

export const metadata: Metadata = {
    title: 'Cuidado Humanizado para Quem Você Ama',
    description: 'Mãos Amigas Home Care oferece cuidadores, técnicos de enfermagem e enfermeiros 24h em Toledo-PR. Avaliação gratuita e atendimento personalizado.',
};

const SERVICES = [
    {
        icon: UserCheck,
        title: 'Cuidador de Idosos',
        description: 'Profissionais treinados para acompanhamento, higiene pessoal, alimentação e atividades diárias.',
        color: 'bg-brand-100 text-brand-600',
    },
    {
        icon: Stethoscope,
        title: 'Técnico de Enfermagem',
        description: 'Administração de medicamentos, curativos simples e monitoramento de sinais vitais.',
        color: 'bg-success-100 text-success-600',
    },
    {
        icon: Activity,
        title: 'Enfermeiro',
        description: 'Procedimentos complexos, sondas, ventilação mecânica e cuidados intensivos.',
        color: 'bg-purple-100 text-purple-600',
    },
];

const BENEFITS = [
    { icon: Shield, text: 'Profissionais verificados e treinados' },
    { icon: Clock, text: 'Atendimento 24 horas' },
    { icon: Users, text: 'Equipe multidisciplinar' },
    { icon: Award, text: 'Mais de 15 anos de experiência' },
];

const STATS = [
    { value: '15+', label: 'Anos de experiência' },
    { value: '500+', label: 'Famílias atendidas' },
    { value: '100+', label: 'Profissionais' },
    { value: '98%', label: 'Satisfação' },
];

/**
 * Landing page / Home for public institutional area
 * Server component with hero, services, benefits and CTA sections
 */
export default function HomePage() {
    return (
        <>
            {/* Hero Section - Animated */}
            <HeroSection />

            {/* Stats Section */}
            <section className="bg-brand-600 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {STATS.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-3xl lg:text-4xl font-bold text-white">{stat.value}</p>
                                <p className="text-brand-200 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900">
                            Nossos Serviços
                        </h2>
                        <p className="mt-4 text-lg text-neutral-600">
                            Oferecemos uma equipe completa de profissionais para cuidar de quem você ama
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {SERVICES.map((service) => (
                            <div
                                key={service.title}
                                className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-xl hover:border-brand-200 transition-all group"
                            >
                                <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <service.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-brand-600 transition-colors">
                                    {service.title}
                                </h3>
                                <p className="mt-3 text-neutral-600 leading-relaxed">
                                    {service.description}
                                </p>
                                <Link
                                    href="/servicos"
                                    className="inline-flex items-center gap-1 mt-4 text-brand-600 font-medium hover:gap-2 transition-all"
                                >
                                    Saiba mais <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link
                            href="/servicos"
                            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-600 text-brand-600 rounded-xl font-semibold hover:bg-brand-50 transition-colors"
                        >
                            Ver todos os serviços
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 lg:py-24 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900">
                                Por que escolher a Mãos Amigas?
                            </h2>
                            <p className="mt-4 text-lg text-neutral-600">
                                Há mais de 10 anos cuidando de famílias com excelência,
                                profissionalismo e muito carinho.
                            </p>
                            <div className="mt-8 space-y-4">
                                {BENEFITS.map((benefit) => (
                                    <div key={benefit.text} className="flex items-start gap-4 p-4 bg-white rounded-xl">
                                        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <benefit.icon className="w-5 h-5 text-brand-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-900">{benefit.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-brand-100 to-brand-200 rounded-3xl aspect-square flex items-center justify-center">
                            <Shield className="w-48 h-48 text-brand-500 opacity-50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Preview */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900">
                            O que nossos clientes dizem
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-neutral-50 p-6 rounded-2xl">
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-neutral-700 leading-relaxed">
                                    "Excelente serviço! A equipe é muito profissional e atenciosa.
                                    Minha mãe está muito bem cuidada e nossa família está muito mais tranquila."
                                </p>
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-200 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-neutral-900">Maria Silva</p>
                                        <p className="text-sm text-neutral-500">São Paulo, SP</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link
                            href="/depoimentos"
                            className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:gap-3 transition-all"
                        >
                            Ver mais depoimentos <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24 bg-brand-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white">
                        Pronto para cuidar de quem você ama?
                    </h2>
                    <p className="mt-4 text-lg text-brand-100">
                        Solicite uma avaliação gratuita e receba uma proposta personalizada em até 24 horas.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contato"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-600 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
                        >
                            Solicitar Avaliação Gratuita
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="tel:+5511999999999"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                            (11) 99999-9999
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
