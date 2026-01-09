import Link from 'next/link';
import {
    Heart,
    Target,
    Eye,
    Award,
    Users,
    Clock,
    Shield,
    ArrowRight,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sobre Nós',
    description: 'Conheça a história, missão e valores da Mãos Amigas Home Care. Há mais de 10 anos cuidando de famílias com excelência.',
};

const VALUES = [
    {
        icon: Heart,
        title: 'Humanização',
        description: 'Tratamos cada paciente como se fosse nossa própria família.',
    },
    {
        icon: Shield,
        title: 'Segurança',
        description: 'Profissionais verificados, treinados e supervisionados.',
    },
    {
        icon: Award,
        title: 'Excelência',
        description: 'Busca constante pela qualidade em todos os serviços.',
    },
    {
        icon: Users,
        title: 'Transparência',
        description: 'Comunicação clara e honesta com as famílias.',
    },
];

const TIMELINE = [
    { year: '2014', title: 'Fundação', description: 'Início das atividades com foco em cuidadores de idosos.' },
    { year: '2016', title: 'Expansão', description: 'Inclusão de técnicos de enfermagem e enfermeiros.' },
    { year: '2018', title: 'Multidisciplinar', description: 'Equipe ampliada com fisioterapeutas e nutricionistas.' },
    { year: '2020', title: 'Tecnologia', description: 'Lançamento do portal do cliente para gestão de cuidados.' },
    { year: '2024', title: 'Referência', description: 'Reconhecida como referência em home care humanizado.' },
];

/**
 * About page with company history, mission, vision and values
 */
export default function SobrePage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-br from-brand-50 to-white py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900">
                                Sobre a Mãos Amigas
                            </h1>
                            <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
                                Há mais de 10 anos, a Mãos Amigas Home Care transforma a vida de famílias
                                oferecendo cuidado domiciliar de excelência. Nossa missão é proporcionar
                                qualidade de vida, segurança e tranquilidade para pacientes e familiares.
                            </p>
                            <div className="mt-8 flex gap-8">
                                <div>
                                    <p className="text-4xl font-bold text-brand-600">10+</p>
                                    <p className="text-neutral-600">Anos</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-bold text-brand-600">5.000+</p>
                                    <p className="text-neutral-600">Famílias</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-bold text-brand-600">500+</p>
                                    <p className="text-neutral-600">Profissionais</p>
                                </div>
                            </div>
                        </div>
                        <div className="aspect-square bg-gradient-to-br from-brand-100 to-brand-200 rounded-3xl flex items-center justify-center">
                            <Heart className="w-48 h-48 text-brand-500 opacity-50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-brand-50 p-8 rounded-2xl">
                            <Target className="w-12 h-12 text-brand-600 mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900 mb-3">Missão</h3>
                            <p className="text-neutral-600">
                                Proporcionar cuidado domiciliar humanizado e de excelência,
                                promovendo qualidade de vida e bem-estar para pacientes e famílias.
                            </p>
                        </div>
                        <div className="bg-success-50 p-8 rounded-2xl">
                            <Eye className="w-12 h-12 text-success-600 mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900 mb-3">Visão</h3>
                            <p className="text-neutral-600">
                                Ser a principal referência em home care no Brasil, reconhecida
                                pela excelência no cuidado e inovação em serviços de saúde domiciliar.
                            </p>
                        </div>
                        <div className="bg-purple-50 p-8 rounded-2xl">
                            <Award className="w-12 h-12 text-purple-600 mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900 mb-3">Compromisso</h3>
                            <p className="text-neutral-600">
                                Cada paciente é único e merece um plano de cuidados personalizado,
                                com profissionais dedicados e acompanhamento contínuo.
                            </p>
                        </div>
                    </div>

                    {/* Values */}
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">
                        Nossos Valores
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map((value) => (
                            <div key={value.title} className="text-center p-6">
                                <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <value.icon className="w-8 h-8 text-brand-600" />
                                </div>
                                <h4 className="font-bold text-neutral-900 mb-2">{value.title}</h4>
                                <p className="text-neutral-600 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 lg:py-24 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">
                        Nossa História
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        {TIMELINE.map((item, index) => (
                            <div key={item.year} className="flex gap-6 mb-8 last:mb-0">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {item.year}
                                    </div>
                                    {index < TIMELINE.length - 1 && (
                                        <div className="w-0.5 flex-1 bg-brand-200 mt-2" />
                                    )}
                                </div>
                                <div className="pb-8">
                                    <h4 className="font-bold text-neutral-900">{item.title}</h4>
                                    <p className="text-neutral-600 mt-1">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 lg:py-24 bg-brand-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white">
                        Faça parte dessa história
                    </h2>
                    <p className="mt-4 text-lg text-brand-100">
                        Entre em contato e descubra como podemos ajudar sua família.
                    </p>
                    <Link
                        href="/contato"
                        className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-brand-600 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
                    >
                        Falar com a Equipe
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </>
    );
}
