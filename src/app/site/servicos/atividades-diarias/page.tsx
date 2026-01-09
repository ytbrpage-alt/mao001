import { Metadata } from 'next';
import Link from 'next/link';
import { Coffee, Sun, Bath, Utensils, CheckCircle, ArrowRight, Phone, Smile } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Atividades Diárias | Mãos Amigas Home Care',
    description: 'Auxílio completo nas atividades diárias: higiene, alimentação, mobilidade e lazer. Promovemos autonomia e qualidade de vida.',
};

const FEATURES = [
    'Auxílio na higiene pessoal',
    'Banho assistido',
    'Troca de fraldas geriátricas',
    'Auxílio na alimentação',
    'Preparo de refeições especiais',
    'Estímulo à mobilidade',
    'Atividades de lazer e socialização',
    'Acompanhamento em passeios',
];

const INCLUDES = [
    { icon: Bath, title: 'Higiene Pessoal', description: 'Cuidados com banho, troca de roupas e higiene íntima' },
    { icon: Utensils, title: 'Alimentação', description: 'Preparo de refeições e auxílio para comer' },
    { icon: Sun, title: 'Rotina Diária', description: 'Organização de medicamentos e atividades' },
    { icon: Smile, title: 'Bem-Estar', description: 'Atividades de lazer e estímulo cognitivo' },
];

export default function AtividadesDiariasPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-amber-500 to-orange-600 text-white py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-amber-100 mb-4">
                            <Link href="/site/servicos" className="hover:text-white transition-colors">Serviços</Link>
                            <span>/</span>
                            <span>Atividades Diárias</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            Auxílio nas Atividades Diárias
                        </h1>
                        <p className="text-xl text-amber-100 mb-8">
                            Cuidadores dedicados a auxiliar em todas as atividades do cotidiano,
                            promovendo independência, dignidade e qualidade de vida.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/site/contato"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors"
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
                                Cuidado em Cada Momento
                            </h2>
                            <p className="text-lg text-slate-600 mb-8">
                                Nossos cuidadores são treinados para auxiliar com carinho e
                                paciência em todas as atividades do dia a dia, respeitando
                                o ritmo e as preferências de cada paciente.
                            </p>
                            <ul className="space-y-4">
                                {FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                        <span className="text-slate-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {INCLUDES.map((item) => (
                                <div key={item.title} className="p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
                                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                                        <item.icon className="w-6 h-6 text-amber-600" />
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
            <section className="py-16 bg-amber-500">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Seu familiar precisa de ajuda?
                    </h2>
                    <p className="text-xl text-amber-100 mb-8">
                        Nossos cuidadores estão prontos para proporcionar mais qualidade de vida.
                    </p>
                    <Link
                        href="/site/contato"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors"
                    >
                        Conhecer Serviço
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
