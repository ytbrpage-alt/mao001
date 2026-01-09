import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Política de Privacidade | Mãos Amigas Home Care',
    description: 'Saiba como a Mãos Amigas Home Care coleta, utiliza e protege seus dados pessoais.',
};

export default function PrivacidadePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-16 lg:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-brand-400" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                        Política de Privacidade
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
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introdução</h2>
                        <p className="text-slate-600 mb-6">
                            A Mãos Amigas Home Care Ltda. ("nós", "nosso" ou "empresa") está comprometida
                            em proteger sua privacidade. Esta Política de Privacidade explica como
                            coletamos, usamos, divulgamos e protegemos suas informações pessoais.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Informações que Coletamos</h2>
                        <p className="text-slate-600 mb-4">Podemos coletar os seguintes tipos de informações:</p>
                        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                            <li><strong>Dados de identificação:</strong> nome, CPF, RG, data de nascimento</li>
                            <li><strong>Dados de contato:</strong> endereço, telefone, e-mail</li>
                            <li><strong>Dados de saúde:</strong> histórico médico, diagnósticos, tratamentos</li>
                            <li><strong>Dados de navegação:</strong> cookies, IP, páginas visitadas</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Como Utilizamos suas Informações</h2>
                        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                            <li>Prestação de serviços de home care</li>
                            <li>Comunicação sobre agendamentos e atualizações</li>
                            <li>Faturamento e cobrança</li>
                            <li>Cumprimento de obrigações legais</li>
                            <li>Melhoria contínua dos nossos serviços</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Compartilhamento de Dados</h2>
                        <p className="text-slate-600 mb-6">
                            Não vendemos ou alugamos suas informações pessoais. Podemos compartilhar
                            dados apenas com: profissionais de saúde envolvidos no cuidado,
                            órgãos reguladores quando exigido por lei, e parceiros tecnológicos
                            que suportam nossos sistemas (com proteções contratuais adequadas).
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Segurança dos Dados</h2>
                        <p className="text-slate-600 mb-6">
                            Implementamos medidas técnicas e organizacionais para proteger suas
                            informações, incluindo criptografia, controle de acesso e
                            monitoramento contínuo de nossos sistemas.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Seus Direitos</h2>
                        <p className="text-slate-600 mb-4">Você tem o direito de:</p>
                        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                            <li>Acessar seus dados pessoais</li>
                            <li>Solicitar correção de dados incorretos</li>
                            <li>Solicitar exclusão de dados (quando aplicável)</li>
                            <li>Revogar consentimento</li>
                            <li>Solicitar portabilidade dos dados</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Contato</h2>
                        <p className="text-slate-600 mb-6">
                            Para exercer seus direitos ou esclarecer dúvidas sobre esta política,
                            entre em contato com nosso Encarregado de Proteção de Dados:<br />
                            <strong>E-mail:</strong> privacidade@maosamigas.com.br<br />
                            <strong>Telefone:</strong> (45) 99999-9999
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
