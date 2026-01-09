import Link from 'next/link';
import {
    UserCheck,
    Stethoscope,
    Activity,
    Heart,
    Brain,
    Dumbbell,
    Apple,
    MessageCircle,
    ArrowRight,
    CheckCircle,
    Phone,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Serviços',
    description: 'Conheça nossos serviços de home care: cuidadores de idosos, técnicos de enfermagem, enfermeiros, fisioterapia, nutrição e mais.',
};

const SERVICES = [
    {
        icon: UserCheck,
        title: 'Cuidador de Idosos',
        description: 'Profissionais treinados para auxiliar nas atividades diárias, garantindo conforto, segurança e companhia.',
        features: [
            'Auxílio na higiene pessoal',
            'Acompanhamento em atividades',
            'Preparo de alimentação',
            'Administração de medicamentos via oral',
            'Companhia e estímulo cognitivo',
            'Monitoramento geral',
        ],
        color: 'bg-brand-100 text-brand-600',
        bgColor: 'bg-brand-50',
    },
    {
        icon: Stethoscope,
        title: 'Técnico de Enfermagem',
        description: 'Profissionais habilitados para procedimentos que exigem formação técnica em saúde.',
        features: [
            'Administração de medicamentos',
            'Curativos simples e complexos',
            'Monitoramento de sinais vitais',
            'Aplicação de insulina',
            'Cuidados com sondas',
            'Preparo de medicações',
        ],
        color: 'bg-success-100 text-success-600',
        bgColor: 'bg-success-50',
    },
    {
        icon: Activity,
        title: 'Enfermeiro',
        description: 'Profissionais de nível superior para cuidados intensivos e procedimentos de alta complexidade.',
        features: [
            'Gestão de cuidados complexos',
            'Ventilação mecânica',
            'Traqueostomia',
            'Passagem de sondas',
            'Cuidados pós-cirúrgicos',
            'Supervisão de equipe',
        ],
        color: 'bg-purple-100 text-purple-600',
        bgColor: 'bg-purple-50',
    },
    {
        icon: Dumbbell,
        title: 'Fisioterapia',
        description: 'Reabilitação motora e respiratória no conforto do lar.',
        features: [
            'Fisioterapia motora',
            'Fisioterapia respiratória',
            'Reabilitação pós-AVC',
            'Exercícios de fortalecimento',
            'Prevenção de quedas',
            'Alongamentos',
        ],
        color: 'bg-orange-100 text-orange-600',
        bgColor: 'bg-orange-50',
    },
    {
        icon: Apple,
        title: 'Nutrição',
        description: 'Acompanhamento nutricional personalizado para cada necessidade.',
        features: [
            'Avaliação nutricional',
            'Dieta personalizada',
            'Orientação para cuidadores',
            'Suplementação',
            'Dietas para diabetes',
            'Nutrição enteral',
        ],
        color: 'bg-lime-100 text-lime-600',
        bgColor: 'bg-lime-50',
    },
    {
        icon: Brain,
        title: 'Fonoaudiologia',
        description: 'Tratamento de distúrbios de fala, voz e deglutição.',
        features: [
            'Terapia de fala',
            'Tratamento de disfagia',
            'Estimulação cognitiva',
            'Reabilitação vocal',
            'Exercícios orofaciais',
            'Avaliação auditiva',
        ],
        color: 'bg-pink-100 text-pink-600',
        bgColor: 'bg-pink-50',
    },
];

/**
 * Services page listing all available home care services
 */
export default function ServicosPage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-br from-brand-50 to-white py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900">
                            Nossos Serviços
                        </h1>
                        <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
                            Oferecemos uma equipe completa de profissionais de saúde para atender
                            todas as necessidades de cuidado domiciliar. Cada serviço é personalizado
                            de acordo com a avaliação do paciente.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {SERVICES.map((service, index) => (
                            <div
                                key={service.title}
                                className={`p-8 rounded-3xl ${service.bgColor}`}
                            >
                                <div className="grid lg:grid-cols-2 gap-8 items-start">
                                    <div>
                                        <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6`}>
                                            <service.icon className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900">
                                            {service.title}
                                        </h2>
                                        <p className="mt-4 text-lg text-neutral-600 leading-relaxed">
                                            {service.description}
                                        </p>
                                        <Link
                                            href="/site/contato"
                                            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
                                        >
                                            Solicitar Avaliação
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 mb-4">O que inclui:</h3>
                                        <ul className="grid sm:grid-cols-2 gap-3">
                                            {service.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-neutral-700">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 lg:py-24 bg-brand-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Heart className="w-16 h-16 text-brand-200 mx-auto mb-6" />
                    <h2 className="text-3xl lg:text-4xl font-bold text-white">
                        Não sabe qual serviço escolher?
                    </h2>
                    <p className="mt-4 text-lg text-brand-100">
                        Nossa equipe faz uma avaliação gratuita para identificar o cuidado ideal para o seu familiar.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/site/contato"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-600 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
                        >
                            Agendar Avaliação Gratuita
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
