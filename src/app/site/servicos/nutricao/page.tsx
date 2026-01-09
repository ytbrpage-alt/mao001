import { Metadata } from 'next';
import Link from 'next/link';
import { Apple, Utensils, Scale, Salad, CheckCircle, ArrowRight, Phone, Heart } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Nutrição Domiciliar | Mãos Amigas Home Care',
    description: 'Acompanhamento nutricional especializado em domicílio. Planos alimentares personalizados para idosos, diabéticos e pacientes com necessidades especiais.',
};

const FEATURES = [
    'Avaliação nutricional completa',
    'Planos alimentares personalizados',
    'Dietas para diabéticos',
    'Nutrição enteral',
    'Cardápios especiais',
    'Acompanhamento de peso',
    'Orientação a cuidadores',
    'Suplementação orientada',
];

const INCLUDES = [
    { icon: Apple, title: 'Avaliação Nutricional', description: 'Diagnóstico completo do estado nutricional' },
    { icon: Salad, title: 'Cardápios Especiais', description: 'Dietas adaptadas às necessidades' },
    { icon: Scale, title: 'Monitoramento', description: 'Acompanhamento contínuo da evolução' },
    { icon: Heart, title: 'Qualidade de Vida', description: 'Nutrição como base da saúde' },
];

export default function NutricaoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-green-500 to-green-700 text-white py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-green-200 mb-4">
                            <Link href="/site/servicos" className="hover:text-white transition-colors">Serviços</Link>
                            <span>/</span>
                            <span>Nutrição</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            Nutrição Domiciliar
                        </h1>
                        <p className="text-xl text-green-100 mb-8">
                            Nutricionistas especializados desenvolvem planos alimentares
                            personalizados para cada paciente, considerando suas condições de saúde
                            e preferências alimentares.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/site/contato"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                Agendar Consulta
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
                                Alimentação como Tratamento
                            </h2>
                            <p className="text-lg text-slate-600 mb-8">
                                A nutrição adequada é fundamental para a recuperação e manutenção
                                da saúde. Nossos nutricionistas criam dietas balanceadas que respeitam
                                as restrições médicas e o paladar do paciente.
                            </p>
                            <ul className="space-y-4">
                                {FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {INCLUDES.map((item) => (
                                <div key={item.title} className="p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                                        <item.icon className="w-6 h-6 text-green-600" />
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
            <section className="py-16 bg-green-500">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Cuide da alimentação
                    </h2>
                    <p className="text-xl text-green-100 mb-8">
                        Agende uma consulta nutricional e transforme a saúde através da alimentação.
                    </p>
                    <Link
                        href="/site/contato"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors"
                    >
                        Começar Acompanhamento
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
