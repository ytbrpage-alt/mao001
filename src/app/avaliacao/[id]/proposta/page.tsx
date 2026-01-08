'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { ProposalView } from '@/components/proposal/ProposalView';
import { ArrowLeft } from 'lucide-react';

export default function ProposalPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { loadEvaluation, getCurrentEvaluation } = useEvaluationStore();

    // Carregar avaliação se necessário
    if (!getCurrentEvaluation()?.id && id) {
        loadEvaluation(id);
    }

    const evaluation = getCurrentEvaluation();

    if (!evaluation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <p className="text-neutral-500">Carregando proposta...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Botão voltar */}
            <button
                onClick={() => router.push(`/avaliacao/${id}`)}
                className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-medium text-neutral-600 hover:bg-neutral-50"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Editar</span>
            </button>

            <ProposalView evaluationId={id} />
        </div>
    );
}
