import { Metadata } from 'next';
import Link from 'next/link';
import { Home, Clock, Shield, Heart, Users, CheckCircle, ArrowRight, Phone } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Cuidado Domiciliar 24h | Mãos Amigas Home Care',
    description: 'Cuidado profissional e humanizado 24 horas por dia, 7 dias por semana. Cuidadores treinados para auxiliar em todas as atividades do dia a dia.',
};

const FEATURES = [
    'Cuidadores treinados e certificados',
    'Acompanhamento 24 horas',
    'Auxílio em atividades diárias',
    'Administração de medicamentos',
    'Higiene e conforto',
    'Companhia e socialização',
    'Relatórios diários para família',
    'Supervisão de enfermagem',
];

const INCLUDES = [
    { icon: Clock, title: 'Plantões 12h ou 24h', description: 'Flexibilidade de horários conforme sua necessidade' },
    { icon: Shield, title: 'Profissionais Verificados', description: 'Todos passam por rigorosa seleção e treinamento' },
    { icon: Heart, title: 'Cuidado Humanizado', description: 'Tratamos cada paciente como família' },
    { icon: Users, title: 'Equipe de Apoio', description: 'Supervisão contínua por enfermeiros' },
];

export default function CuidadoDomiciliarPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-brand-200 mb-4">
                            <Link href="/site/servicos" className="hover:text-white transition-colors">Serviços</Link>
                            <span>/</span>
                            <span>Cuidado Domiciliar</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            Cuidado Domiciliar 24 Horas
                        </h1>
                        <p className="text-xl text-brand-100 mb-8">
                            Cuidadores profissionais dedicados a proporcionar conforto, segurança
                            e qualidade de vida para seus entes queridos no ambiente mais acolhedor: o lar.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/site/contato"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                Solicitar Avaliação Gratuita
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
                                O que está incluído
                            </h2>
                            <p className="text-lg text-slate-600 mb-8">
                                Nosso serviço de cuidado domiciliar é completo e personalizado para
                                atender às necessidades específicas de cada paciente e família.
                            </p>
                            <ul className="space-y-4">
                                {FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
                                        <span className="text-slate-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {INCLUDES.map((item) => (
                                <div key={item.title} className="p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
                                    <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                                        <item.icon className="w-6 h-6 text-brand-600" />
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
            <section className="py-16 bg-brand-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Pronto para começar?
                    </h2>
                    <p className="text-xl text-brand-100 mb-8">
                        Agende uma avaliação gratuita e sem compromisso. Nossa equipe vai até você.
                    </p>
                    <Link
                        href="/site/contato"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors"
                    >
                        Agendar Avaliação
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
