'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Download,
    ArrowLeft,
    Printer,
    Share2,
    CheckCircle,
    Loader2,
    User,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Heart,
    Activity,
    DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function EvaluationPDFPage() {
    const params = useParams();
    const router = useRouter();
    const evaluationId = params.id as string;
    const { evaluations, getEvaluation } = useEvaluationStore();

    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const evaluation = getEvaluation(evaluationId);

    const handleGeneratePDF = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            // Simular geração de PDF
            await new Promise(resolve => setTimeout(resolve, 2000));

            setIsGenerated(true);

            // Em produção, aqui seria feito o download real do PDF
            // window.open(`/api/evaluations/${evaluationId}/pdf`, '_blank');
        } catch (err) {
            setError('Erro ao gerar PDF. Tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        // Simular download
        const link = document.createElement('a');
        link.href = '#'; // Em produção: URL real do PDF
        link.download = `avaliacao-${evaluationId}.pdf`;
        // link.click();
        alert('PDF baixado com sucesso! (simulação)');
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Avaliação Mãos Amigas',
                    text: `Avaliação de ${evaluation?.patient.fullName || 'Paciente'}`,
                    url: window.location.href,
                });
            } catch (err) {
                // Usuário cancelou o compartilhamento
            }
        } else {
            // Fallback: copiar link
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado para a área de transferência!');
        }
    };

    if (!evaluation) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--color-bg))' }}>
                <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                    <h2 className="text-lg font-semibold mb-2" style={{ color: 'rgb(var(--color-text))' }}>
                        Avaliação não encontrada
                    </h2>
                    <p className="mb-4" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                        A avaliação solicitada não existe ou foi removida.
                    </p>
                    <Link href="/avaliacao" className="btn-primary">
                        Voltar às avaliações
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24" style={{ backgroundColor: 'rgb(var(--color-bg))' }}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container-mobile py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                <ArrowLeft className="w-5 h-5" style={{ color: 'rgb(var(--color-text))' }} />
                            </button>
                            <div>
                                <h1 className="font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                                    Gerar PDF
                                </h1>
                                <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                    Avaliação #{evaluationId.slice(0, 8)}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleShare}
                                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                <Share2 className="w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                            </button>
                            <button
                                onClick={handlePrint}
                                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                <Printer className="w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-mobile py-6 space-y-6">
                {/* Preview Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card print:shadow-none"
                >
                    {/* Document Header */}
                    <div className="flex items-center gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                        <div className="w-16 h-16 bg-brand-500 rounded-xl flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">MA</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: 'rgb(var(--color-text))' }}>
                                Mãos Amigas Home Care
                            </h2>
                            <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                Relatório de Avaliação Domiciliar
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                Gerado em {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </p>
                        </div>
                    </div>

                    {/* Patient Info */}
                    <div className="py-4 border-b border-neutral-200 dark:border-neutral-700">
                        <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
                            <User className="w-5 h-5 text-brand-500" />
                            Dados do Paciente
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-wide" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                    Nome Completo
                                </p>
                                <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                                    {evaluation.patient.fullName || 'Não informado'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                    Data de Nascimento
                                </p>
                                <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                                    {evaluation.patient.birthDate
                                        ? format(new Date(evaluation.patient.birthDate), 'dd/MM/yyyy')
                                        : 'Não informado'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                    CPF
                                </p>
                                <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                                    {evaluation.patient.cpf || 'Não informado'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                    Gênero
                                </p>
                                <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                                    {evaluation.patient.gender === 'male' ? 'Masculino' :
                                        evaluation.patient.gender === 'female' ? 'Feminino' : 'Não informado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Health Info */}
                    <div className="py-4 border-b border-neutral-200 dark:border-neutral-700">
                        <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
                            <Heart className="w-5 h-5 text-error-500" />
                            Informações de Saúde
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-wide" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                    Score KATZ
                                </p>
                                <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                                    {evaluation.katzScore ?? 'Não calculado'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                    Score ABEMID
                                </p>
                                <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                                    {evaluation.abemidScore ?? 'Não calculado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="pt-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
                            <Activity className="w-5 h-5 text-brand-500" />
                            Status da Avaliação
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                'badge',
                                evaluation.status === 'completed' ? 'bg-success-100 text-success-700' :
                                    evaluation.status === 'in_progress' ? 'bg-warning-100 text-warning-700' :
                                        'bg-neutral-100 text-neutral-600'
                            )}>
                                {evaluation.status === 'completed' ? 'Concluída' :
                                    evaluation.status === 'in_progress' ? 'Em Andamento' : 'Rascunho'}
                            </span>
                            <span className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                Atualizado em {format(new Date(evaluation.updatedAt), "dd/MM/yyyy 'às' HH:mm")}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Generate Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                >
                    {!isGenerated ? (
                        <button
                            onClick={handleGeneratePDF}
                            disabled={isGenerating}
                            className="w-full btn-primary py-4 text-lg"
                        >
                            {isGenerating ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Gerando PDF...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Gerar PDF da Avaliação
                                </span>
                            )}
                        </button>
                    ) : (
                        <>
                            <div className="card bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-success-600" />
                                    <div>
                                        <p className="font-medium text-success-700 dark:text-success-400">
                                            PDF gerado com sucesso!
                                        </p>
                                        <p className="text-sm text-success-600 dark:text-success-500">
                                            O documento está pronto para download.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleDownload}
                                className="w-full btn-primary py-4 text-lg"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Baixar PDF
                            </button>

                            <button
                                onClick={() => setIsGenerated(false)}
                                className="w-full btn-secondary"
                            >
                                Gerar novamente
                            </button>
                        </>
                    )}

                    {error && (
                        <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl">
                            <p className="text-error-700 dark:text-error-400">{error}</p>
                        </div>
                    )}
                </motion.div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-sm"
                    style={{ color: 'rgb(var(--color-text-secondary))' }}
                >
                    <p>
                        O PDF inclui todas as informações do paciente, escalas de avaliação,
                        proposta financeira e contrato.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
