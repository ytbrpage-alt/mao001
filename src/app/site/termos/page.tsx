import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Termos de Uso | Mãos Amigas Home Care',
    description: 'Termos e condições de uso dos serviços e plataforma digital da Mãos Amigas Home Care.',
};

export default function TermosPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-16 lg:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-8 h-8 text-brand-400" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                        Termos de Uso
                    </h1>
                    <p className="text-slate-400">
                        Última atualização: Janeiro de 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-slate max-w-none">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Aceitação dos Termos</h2>
                        <p className="text-slate-600 mb-6">
                            Ao utilizar os serviços da Mãos Amigas Home Care, você concorda com
                            estes Termos de Uso. Caso não concorde com algum aspecto,
                            por favor não utilize nossos serviços.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Descrição dos Serviços</h2>
                        <p className="text-slate-600 mb-6">
                            A Mãos Amigas Home Care oferece serviços de cuidado domiciliar,
                            incluindo cuidadores, técnicos de enfermagem, enfermeiros e
                            profissionais de saúde especializados para atendimento em domicílio.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Cadastro e Acesso</h2>
                        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                            <li>Você é responsável por manter a confidencialidade do seu PIN de acesso</li>
                            <li>Todas as atividades realizadas com suas credenciais são de sua responsabilidade</li>
                            <li>Notifique-nos imediatamente em caso de uso não autorizado</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Obrigações do Cliente</h2>
                        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                            <li>Fornecer informações verdadeiras e atualizadas</li>
                            <li>Garantir ambiente seguro para os profissionais</li>
                            <li>Comunicar qualquer alteração no estado de saúde do paciente</li>
                            <li>Efetuar pagamentos conforme acordado em contrato</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Obrigações da Empresa</h2>
                        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                            <li>Disponibilizar profissionais qualificados e treinados</li>
                            <li>Supervisionar a prestação dos serviços</li>
                            <li>Manter sigilo das informações do paciente</li>
                            <li>Fornecer canais de comunicação para suporte</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cancelamento e Rescisão</h2>
                        <p className="text-slate-600 mb-6">
                            O cliente pode cancelar os serviços com aviso prévio de 30 dias.
                            A empresa reserva-se o direito de rescindir o contrato em caso de
                            inadimplência ou violação destes termos.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitação de Responsabilidade</h2>
                        <p className="text-slate-600 mb-6">
                            A Mãos Amigas não se responsabiliza por danos decorrentes de
                            informações incorretas fornecidas pelo cliente ou por eventos
                            fora do nosso controle razoável.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Legislação Aplicável</h2>
                        <p className="text-slate-600 mb-6">
                            Estes termos são regidos pelas leis brasileiras. Qualquer disputa
                            será resolvida no foro da comarca de Toledo-PR.
                        </p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200">
                        <Link href="/site" className="text-brand-600 hover:text-brand-700 font-medium">
                            ← Voltar para o início
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
