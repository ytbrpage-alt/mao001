import { Metadata } from 'next';
import Link from 'next/link';
import { Lock, Shield, Eye, UserCheck, Database, FileCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'LGPD - Lei Geral de Proteção de Dados | Mãos Amigas Home Care',
    description: 'Saiba como a Mãos Amigas Home Care está em conformidade com a LGPD e protege seus dados pessoais.',
};

const RIGHTS = [
    { icon: Eye, title: 'Acesso', description: 'Confirmar e acessar seus dados pessoais' },
    { icon: FileCheck, title: 'Correção', description: 'Corrigir dados incompletos ou desatualizados' },
    { icon: Lock, title: 'Anonimização', description: 'Solicitar anonimização ou bloqueio de dados' },
    { icon: Database, title: 'Portabilidade', description: 'Transferir seus dados para outro serviço' },
    { icon: UserCheck, title: 'Consentimento', description: 'Revogar consentimento a qualquer momento' },
    { icon: Shield, title: 'Eliminação', description: 'Solicitar exclusão de dados pessoais' },
];

export default function LGPDPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-16 lg:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-brand-400" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                        LGPD - Proteção de Dados
                    </h1>
                    <p className="text-slate-400">
                        Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Intro */}
                    <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 mb-12">
                        <div className="flex gap-4">
                            <AlertCircle className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-brand-900 mb-2">Nosso Compromisso</h3>
                                <p className="text-brand-700">
                                    A Mãos Amigas Home Care está comprometida com a proteção dos dados
                                    pessoais de seus clientes, pacientes e colaboradores, em conformidade
                                    com a Lei Geral de Proteção de Dados (LGPD).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Rights Grid */}
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Seus Direitos como Titular</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                        {RIGHTS.map((right) => (
                            <div key={right.title} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center mb-3">
                                    <right.icon className="w-5 h-5 text-brand-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-1">{right.title}</h3>
                                <p className="text-sm text-slate-600">{right.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="prose prose-slate max-w-none">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Base Legal para Tratamento</h2>
                        <p className="text-slate-600 mb-6">
                            Tratamos seus dados pessoais com base nas seguintes hipóteses legais:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                            <li><strong>Execução de contrato:</strong> para prestar os serviços contratados</li>
                            <li><strong>Obrigação legal:</strong> cumprimento de exigências regulatórias</li>
                            <li><strong>Tutela da saúde:</strong> proteção da vida e da saúde do paciente</li>
                            <li><strong>Legítimo interesse:</strong> melhoria contínua dos serviços</li>
                            <li><strong>Consentimento:</strong> quando aplicável e necessário</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Dados Sensíveis</h2>
                        <p className="text-slate-600 mb-6">
                            Por sermos uma empresa de saúde, tratamos dados sensíveis como
                            informações de saúde. Esses dados recebem proteção reforçada e
                            são tratados apenas para finalidades relacionadas à prestação
                            de cuidados de saúde.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Medidas de Segurança</h2>
                        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                            <li>Criptografia de dados em trânsito e em repouso</li>
                            <li>Controle de acesso baseado em perfis</li>
                            <li>Autenticação com PIN seguro</li>
                            <li>Logs de auditoria de acesso</li>
                            <li>Treinamento contínuo da equipe</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Como Exercer seus Direitos</h2>
                        <p className="text-slate-600 mb-4">
                            Para exercer qualquer um dos seus direitos como titular de dados,
                            entre em contato com nosso Encarregado de Proteção de Dados (DPO):
                        </p>
                        <div className="bg-slate-100 rounded-xl p-6 mb-6">
                            <p className="text-slate-700">
                                <strong>Encarregado (DPO):</strong> Departamento de Privacidade<br />
                                <strong>E-mail:</strong> lgpd@maosamigas.com.br<br />
                                <strong>Telefone:</strong> (45) 99999-9999<br />
                                <strong>Prazo de resposta:</strong> até 15 dias úteis
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap gap-4">
                        <Link href="/site/privacidade" className="text-brand-600 hover:text-brand-700 font-medium">
                            Política de Privacidade →
                        </Link>
                        <Link href="/site/termos" className="text-brand-600 hover:text-brand-700 font-medium">
                            Termos de Uso →
                        </Link>
                        <Link href="/site" className="text-slate-500 hover:text-slate-700 font-medium">
                            ← Voltar ao início
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
