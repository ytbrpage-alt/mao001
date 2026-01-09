import { Metadata } from 'next';
import Link from 'next/link';
import { Activity, Dumbbell, PersonStanding, Footprints, CheckCircle, ArrowRight, Phone, Heart } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Fisioterapia Domiciliar | Mãos Amigas Home Care',
    description: 'Fisioterapia em domicílio para reabilitação, fortalecimento e manutenção da mobilidade. Fisioterapeutas especializados em atendimento home care.',
};

const FEATURES = [
    'Fisioterapia motora e respiratória',
    'Reabilitação pós-cirúrgica',
    'Fortalecimento muscular',
    'Prevenção de quedas',
    'Exercícios de equilíbrio',
    'Alongamento e flexibilidade',
    'Fisioterapia neurológica',
    'Estimulação funcional',
];

const INCLUDES = [
    { icon: Dumbbell, title: 'Fortalecimento', description: 'Exercícios para manter força e mobilidade' },
    { icon: PersonStanding, title: 'Equilíbrio', description: 'Treino para prevenção de quedas' },
    { icon: Activity, title: 'Reabilitação', description: 'Recuperação de cirurgias e lesões' },
    { icon: Heart, title: 'Qualidade de Vida', description: 'Manutenção da independência funcional' },
];

export default function FisioterapiaPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-sky-500 to-sky-700 text-white py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-sky-200 mb-4">
                            <Link href="/site/servicos" className="hover:text-white transition-colors">Serviços</Link>
                            <span>/</span>
                            <span>Fisioterapia</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            Fisioterapia Domiciliar
                        </h1>
                        <p className="text-xl text-sky-100 mb-8">
                            Fisioterapeutas especializados levam o tratamento até sua casa,
                            promovendo recuperação, fortalecimento e qualidade de vida no conforto do lar.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/site/contato"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-700 font-semibold rounded-xl hover:bg-sky-50 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                Agendar Avaliação
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
                                Movimento é Vida
                            </h2>
                            <p className="text-lg text-slate-600 mb-8">
                                A fisioterapia domiciliar é essencial para manter e recuperar a
                                mobilidade do paciente, evitando complicações do repouso prolongado
                                e promovendo mais autonomia nas atividades diárias.
                            </p>
                            <ul className="space-y-4">
                                {FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                                        <span className="text-slate-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {INCLUDES.map((item) => (
                                <div key={item.title} className="p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
                                    <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center mb-4">
                                        <item.icon className="w-6 h-6 text-sky-600" />
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
            <section className="py-16 bg-sky-500">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Recupere a mobilidade
                    </h2>
                    <p className="text-xl text-sky-100 mb-8">
                        Nossos fisioterapeutas criam programas personalizados para cada paciente.
                    </p>
                    <Link
                        href="/site/contato"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-700 font-semibold rounded-xl hover:bg-sky-50 transition-colors"
                    >
                        Iniciar Tratamento
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
