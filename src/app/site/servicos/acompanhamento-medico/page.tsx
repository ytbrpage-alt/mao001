import { Metadata } from 'next';
import Link from 'next/link';
import { Stethoscope, Clock, Shield, Heart, Activity, CheckCircle, ArrowRight, Phone } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Acompanhamento Médico | Mãos Amigas Home Care',
    description: 'Acompanhamento médico domiciliar com equipe de enfermagem. Monitoramento de sinais vitais, administração de medicamentos e procedimentos em casa.',
};

const FEATURES = [
    'Visitas médicas domiciliares',
    'Monitoramento de sinais vitais',
    'Administração de medicamentos injetáveis',
    'Curativos e procedimentos',
    'Coleta de exames em domicílio',
    'Acompanhamento pós-operatório',
    'Gestão de doenças crônicas',
    'Relatórios para médico assistente',
];

const INCLUDES = [
    { icon: Stethoscope, title: 'Equipe Especializada', description: 'Médicos e enfermeiros com experiência em home care' },
    { icon: Activity, title: 'Monitoramento Contínuo', description: 'Acompanhamento de sinais vitais e evolução' },
    { icon: Shield, title: 'Protocolos Clínicos', description: 'Seguimos diretrizes médicas rigorosas' },
    { icon: Heart, title: 'Atendimento Humanizado', description: 'Cuidado com empatia e respeito' },
];

export default function AcompanhamentoMedicoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-emerald-200 mb-4">
                            <Link href="/site/servicos" className="hover:text-white transition-colors">Serviços</Link>
                            <span>/</span>
                            <span>Acompanhamento Médico</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            Acompanhamento Médico Domiciliar
                        </h1>
                        <p className="text-xl text-emerald-100 mb-8">
                            Equipe médica e de enfermagem especializada para cuidar da saúde
                            do seu familiar com toda a estrutura necessária no conforto do lar.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/site/contato"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                Solicitar Avaliação
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
                                Serviços Médicos em Casa
                            </h2>
                            <p className="text-lg text-slate-600 mb-8">
                                Oferecemos atendimento médico completo no domicílio, evitando
                                deslocamentos desnecessários e proporcionando mais conforto ao paciente.
                            </p>
                            <ul className="space-y-4">
                                {FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                        <span className="text-slate-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {INCLUDES.map((item) => (
                                <div key={item.title} className="p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                                        <item.icon className="w-6 h-6 text-emerald-600" />
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
            <section className="py-16 bg-emerald-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Precisa de acompanhamento médico?
                    </h2>
                    <p className="text-xl text-emerald-100 mb-8">
                        Entre em contato e nossa equipe irá avaliar as necessidades do paciente.
                    </p>
                    <Link
                        href="/site/contato"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
                    >
                        Falar com Especialista
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
