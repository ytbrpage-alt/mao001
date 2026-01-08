'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { generateContract, generateContractHTML, type ContractData } from '@/lib/calculations/contractGenerator';
import { formatCurrency } from '@/lib/calculations/pricingCalculator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Download, Printer, Check } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';

export default function ContractPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { loadEvaluation, getCurrentEvaluation } = useEvaluationStore();
    const [contract, setContract] = useState<ContractData | null>(null);
    const [clientInfo, setClientInfo] = useState({
        name: '',
        cpf: '',
        address: '',
    });
    const [witnesses, setWitnesses] = useState({
        witness1Name: '',
        witness1Cpf: '',
        witness2Name: '',
        witness2Cpf: '',
    });
    const [isSigned, setIsSigned] = useState(false);

    useEffect(() => {
        if (id) {
            loadEvaluation(id);
        }
    }, [id, loadEvaluation]);

    const evaluation = getCurrentEvaluation();

    useEffect(() => {
        if (evaluation) {
            setContract(generateContract(evaluation));
        }
    }, [evaluation]);

    if (!evaluation || !contract) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <p className="text-neutral-500">Carregando contrato...</p>
            </div>
        );
    }

    const handlePrint = () => {
        const html = generateContractHTML(contract, clientInfo, witnesses);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handleDownload = () => {
        const html = generateContractHTML(contract, clientInfo, witnesses);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contrato-${contract.contractNumber}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSign = () => {
        setIsSigned(true);
        // Em produção, salvaria no banco de dados
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-soft">
                <div className="container-mobile py-3 flex items-center justify-between">
                    <button
                        onClick={() => router.push(`/avaliacao/${id}/proposta`)}
                        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Voltar</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
                            title="Imprimir"
                        >
                            <Printer className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
                            title="Download"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="container-mobile py-6 space-y-6">
                {/* Contrato Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-brand-600">MÃOS AMIGAS</h1>
                    <p className="text-neutral-500">Serviços de Cuidadores Domiciliares</p>
                    <p className="text-sm text-neutral-400 mt-2">
                        Contrato nº {contract.contractNumber}
                    </p>
                </div>

                <div className="card">
                    <h2 className="text-lg font-bold text-center mb-4">
                        CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CUIDADOR DOMICILIAR
                    </h2>

                    {/* Dados do Contratante */}
                    <div className="bg-brand-50 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-brand-700 mb-3">
                            Dados do Contratante (preencher)
                        </h3>
                        <div className="space-y-3">
                            <Input
                                label="Nome completo do responsável"
                                value={clientInfo.name}
                                onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                                placeholder="Nome do contratante"
                            />
                            <Input
                                label="CPF"
                                value={clientInfo.cpf}
                                onChange={(e) => setClientInfo({ ...clientInfo, cpf: e.target.value })}
                                placeholder="000.000.000-00"
                            />
                            <Input
                                label="Endereço completo"
                                value={clientInfo.address}
                                onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                                placeholder="Rua, número, bairro, cidade/UF"
                            />
                        </div>
                    </div>

                    {/* Resumo do Contrato */}
                    <div className="bg-neutral-50 p-4 rounded-lg mb-6 space-y-3">
                        <h3 className="font-semibold text-neutral-700">Resumo do Serviço</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-neutral-500">Paciente:</span>
                                <p className="font-medium">{contract.patientName}</p>
                            </div>
                            <div>
                                <span className="text-neutral-500">Idade:</span>
                                <p className="font-medium">{contract.patientAge} anos</p>
                            </div>
                            <div>
                                <span className="text-neutral-500">Profissional:</span>
                                <p className="font-medium">{contract.professionalType}</p>
                            </div>
                            <div>
                                <span className="text-neutral-500">Plantões/mês:</span>
                                <p className="font-medium">{contract.schedule.shiftsPerMonth}</p>
                            </div>
                            <div>
                                <span className="text-neutral-500">Dias:</span>
                                <p className="font-medium">{contract.schedule.days}</p>
                            </div>
                            <div>
                                <span className="text-neutral-500">Horário:</span>
                                <p className="font-medium">{contract.schedule.hours}</p>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-neutral-200">
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-500">Valor por plantão:</span>
                                <span className="font-bold text-lg">{formatCurrency(contract.shiftValue)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-500">Valor mensal estimado:</span>
                                <span className="font-bold text-xl text-brand-600">{formatCurrency(contract.monthlyValue)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Cláusulas */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-neutral-700">Cláusulas Contratuais</h3>
                        {contract.clauses.map((clause) => (
                            <div key={clause.number} className="border-b border-neutral-100 pb-4">
                                <h4 className="font-medium text-neutral-800 mb-2">
                                    CLÁUSULA {clause.number} - {clause.title}
                                </h4>
                                <p className="text-sm text-neutral-600 whitespace-pre-line">
                                    {clause.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Responsabilidades */}
                    {contract.responsibilities.length > 0 && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-700 mb-2">Responsabilidades Definidas</h3>
                            <ul className="text-sm text-blue-600 space-y-1">
                                {contract.responsibilities.map((resp, i) => (
                                    <li key={i}>• {resp}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Riscos (se houver) */}
                    {contract.riskAssumption && contract.risks.length > 0 && (
                        <div className="mt-6 p-4 bg-danger-50 rounded-lg">
                            <h3 className="font-semibold text-danger-700 mb-2">⚠️ Assunção de Riscos</h3>
                            <p className="text-sm text-danger-600 mb-2">
                                O contratante declara estar ciente dos seguintes riscos ambientais identificados:
                            </p>
                            <ul className="text-sm text-danger-600 space-y-1">
                                {contract.risks.map((risk, i) => (
                                    <li key={i}>• {risk}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Data e Local */}
                    <div className="mt-6 text-center text-neutral-600">
                        <p>{format(contract.generatedAt, "'Cidade, 'dd' de 'MMMM' de 'yyyy", { locale: ptBR })}</p>
                    </div>

                    {/* Assinaturas */}
                    <div className="mt-8 grid grid-cols-2 gap-6">
                        <div className="text-center">
                            <div className="h-16 border-b border-neutral-400 mb-2"></div>
                            <p className="text-sm font-medium">CONTRATANTE</p>
                            <p className="text-xs text-neutral-500">{clientInfo.name || 'Nome'}</p>
                        </div>
                        <div className="text-center">
                            <div className="h-16 border-b border-neutral-400 mb-2"></div>
                            <p className="text-sm font-medium">CONTRATADA</p>
                            <p className="text-xs text-neutral-500">Mãos Amigas</p>
                        </div>
                    </div>

                    {/* Testemunhas */}
                    <div className="mt-6 bg-neutral-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-neutral-700 mb-3">
                            Testemunhas (preencher)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-neutral-600">Testemunha 1</p>
                                <Input
                                    label="Nome completo"
                                    value={witnesses.witness1Name}
                                    onChange={(e) => setWitnesses({ ...witnesses, witness1Name: e.target.value })}
                                    placeholder="Nome da testemunha 1"
                                />
                                <Input
                                    label="CPF"
                                    value={witnesses.witness1Cpf}
                                    onChange={(e) => setWitnesses({ ...witnesses, witness1Cpf: e.target.value })}
                                    placeholder="000.000.000-00"
                                />
                            </div>
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-neutral-600">Testemunha 2</p>
                                <Input
                                    label="Nome completo"
                                    value={witnesses.witness2Name}
                                    onChange={(e) => setWitnesses({ ...witnesses, witness2Name: e.target.value })}
                                    placeholder="Nome da testemunha 2"
                                />
                                <Input
                                    label="CPF"
                                    value={witnesses.witness2Cpf}
                                    onChange={(e) => setWitnesses({ ...witnesses, witness2Cpf: e.target.value })}
                                    placeholder="000.000.000-00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Espaço para assinaturas das testemunhas */}
                    <div className="mt-6 grid grid-cols-2 gap-6">
                        <div className="text-center">
                            <div className="h-12 border-b border-neutral-300 mb-2"></div>
                            <p className="text-sm font-medium">Testemunha 1</p>
                            <p className="text-xs text-neutral-500">{witnesses.witness1Name || 'Nome'}</p>
                            <p className="text-xs text-neutral-400">{witnesses.witness1Cpf || 'CPF'}</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 border-b border-neutral-300 mb-2"></div>
                            <p className="text-sm font-medium">Testemunha 2</p>
                            <p className="text-xs text-neutral-500">{witnesses.witness2Name || 'Nome'}</p>
                            <p className="text-xs text-neutral-400">{witnesses.witness2Cpf || 'CPF'}</p>
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl border-2 border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
                    >
                        <Printer className="w-5 h-5" />
                        Imprimir
                    </button>
                    <button
                        onClick={handleSign}
                        disabled={isSigned || !clientInfo.name}
                        className={cn(
                            'flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold transition-colors',
                            isSigned
                                ? 'bg-success-100 text-success-700'
                                : 'bg-success-500 text-white hover:bg-success-600 disabled:opacity-50'
                        )}
                    >
                        {isSigned ? (
                            <>
                                <Check className="w-5 h-5" />
                                Aprovado
                            </>
                        ) : (
                            'Aprovar Contrato'
                        )}
                    </button>
                </div>

                {isSigned && (
                    <div className="bg-success-50 p-4 rounded-xl text-center">
                        <p className="text-success-700 font-medium">
                            ✅ Contrato aprovado com sucesso!
                        </p>
                        <p className="text-sm text-success-600 mt-1">
                            O serviço pode ser iniciado em até 48 horas.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
