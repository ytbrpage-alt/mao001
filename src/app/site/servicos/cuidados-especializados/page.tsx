import { Metadata } from 'next';
import Link from 'next/link';
import { Brain, Heart, AlertTriangle, Syringe, CheckCircle, ArrowRight, Phone, Activity } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Cuidados Especializados | Mãos Amigas Home Care',
    description: 'Cuidados especializados para pacientes com demência, Alzheimer, Parkinson, AVC e outras condições. Equipe treinada para casos complexos.',
};

const FEATURES = [
    'Cuidados para pacientes com Alzheimer',
    'Acompanhamento de Parkinson',
    'Reabilitação pós-AVC',
    'Cuidados paliativos',
    'Pacientes acamados',
    'Sondas e ostomias',
    'Oxigenoterapia domiciliar',
    'Cuidados oncológicos',
];

const INCLUDES = [
    { icon: Brain, title: 'Demências', description: 'Cuidadores especializados em Alzheimer e demências' },
    { icon: Activity, title: 'Reabilitação', description: 'Acompanhamento de pacientes em recuperação' },
    { icon: Heart, title: 'Paliativos', description: 'Cuidados com conforto e dignidade' },
    { icon: Syringe, title: 'Procedimentos', description: 'Equipe capacitada para procedimentos técnicos' },
];

export default function CuidadosEspecializadosPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-purple-200 mb-4">
                            <Link href="/site/servicos" className="hover:text-white transition-colors">Serviços</Link>
                            <span>/</span>
                            <span>Cuidados Especializados</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            Cuidados Especializados
                        </h1>
                        <p className="text-xl text-purple-100 mb-8">
                            Atendimento especializado para condições que exigem conhecimento técnico,
                            paciência e dedicação. Nossa equipe é capacitada para os casos mais complexos.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/site/contato"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                Avaliação Especializada
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">
                                Expertise em Casos Complexos
                            </h2>
                            <p className="text-lg text-slate-600 mb-8">
                                Alguns pacientes necessitam de cuidados que vão além do convencional.
                                Nossa equipe é treinada para lidar com as situações mais desafiadoras com
                                competência e humanidade.
                            </p>
                            <ul className="space-y-4">
                                {FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                        <span className="text-slate-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {INCLUDES.map((item) => (
                                <div key={item.title} className="p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                                        <item.icon className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-600">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-purple-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Precisa de cuidados especiais?
                    </h2>
                    <p className="text-xl text-purple-100 mb-8">
                        Nossa equipe está preparada para avaliar e criar um plano personalizado.
                    </p>
                    <Link
                        href="/site/contato"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-colors"
                    >
                        Solicitar Avaliação
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
