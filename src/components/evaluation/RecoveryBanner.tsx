// src/components/evaluation/RecoveryBanner.tsx
// Banner showing option to continue a previously started evaluation

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEvaluationRecovery } from '@/hooks/useEvaluationRecovery';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { AlertCircle, X, ArrowRight, RotateCcw } from 'lucide-react';

const STEP_NAMES = [
    'Descoberta',
    'Dados do Paciente',
    'Histórico de Saúde',
    'ABEMID',
    'KATZ',
    'Lawton',
    'Checklist de Segurança',
];

export function RecoveryBanner() {
    const router = useRouter();
    const { hasRecovery, currentStep, patientName, isHydrated } = useEvaluationRecovery();
    const { reset, goToStep, currentEvaluationId } = useEvaluationStore();
    const [showBanner, setShowBanner] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    // Show banner only after hydration and if there's a recovery
    useEffect(() => {
        if (isHydrated && hasRecovery && !dismissed) {
            setShowBanner(true);
        }
    }, [isHydrated, hasRecovery, dismissed]);

    if (!showBanner) return null;

    const stepName = STEP_NAMES[currentStep] || `Passo ${currentStep + 1}`;

    const handleContinue = () => {
        setShowBanner(false);
        router.push(`/avaliacao/${currentEvaluationId}`);
    };

    const handleStartNew = () => {
        if (confirm('Tem certeza? A avaliação em andamento será mantida, mas você iniciará uma nova.')) {
            setDismissed(true);
            setShowBanner(false);
        }
    };

    const handleDiscard = () => {
        if (confirm('Tem certeza? Isso apagará todo o progresso da avaliação atual.')) {
            reset();
            setShowBanner(false);
        }
    };

    return (
        <div className="bg-warning-50 border-l-4 border-warning-500 p-4 mb-4 rounded-r-lg shadow-sm animate-in slide-in-from-top duration-300">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning-600 mt-0.5 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-warning-800">
                        Avaliação em andamento encontrada
                    </h3>
                    <p className="text-sm text-warning-700 mt-1">
                        {patientName ? (
                            <>Paciente: <strong>{patientName}</strong> • </>
                        ) : null}
                        Você parou em: <strong>{stepName}</strong>
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                        <button
                            onClick={handleContinue}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warning-600 text-white text-sm font-medium rounded-lg hover:bg-warning-700 transition-colors"
                        >
                            Continuar
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleStartNew}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-warning-600 text-warning-700 text-sm font-medium rounded-lg hover:bg-warning-100 transition-colors"
                        >
                            Iniciar nova
                        </button>

                        <button
                            onClick={handleDiscard}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-warning-600 text-sm font-medium hover:text-warning-800 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Descartar
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setDismissed(true);
                        setShowBanner(false);
                    }}
                    className="text-warning-500 hover:text-warning-700 transition-colors flex-shrink-0"
                    aria-label="Fechar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
