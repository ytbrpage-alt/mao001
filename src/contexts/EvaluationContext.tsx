'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useEvaluationStore } from '@/stores/evaluationStore';
import type { Evaluation } from '@/types';

interface EvaluationContextValue {
    // Estado
    currentEvaluation: Evaluation | null;
    currentStep: number;
    totalSteps: number;
    isLoading: boolean;

    // Navegação
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
    canGoNext: boolean;
    canGoPrev: boolean;

    // Progresso
    progress: number;
    stepName: string;

    // Ações
    startNewEvaluation: () => string;
    saveAndContinue: () => void;
}

const EvaluationContext = createContext<EvaluationContextValue | null>(null);

const STEP_NAMES = [
    'Descoberta',
    'Perfil do Paciente',
    'Histórico de Saúde',
    'Avaliação Clínica (ABEMID)',
    'Independência (Katz)',
    'Responsabilidades',
    'Frequência e Horário',
    'Proposta',
];

export function EvaluationProvider({ children }: { children: ReactNode }) {
    const store = useEvaluationStore();

    const currentEvaluation = store.getCurrentEvaluation();

    const progress = ((store.currentStep + 1) / store.totalSteps) * 100;
    const stepName = STEP_NAMES[store.currentStep] || '';

    const canGoNext = store.currentStep < store.totalSteps - 1;
    const canGoPrev = store.currentStep > 0;

    const startNewEvaluation = useCallback(() => {
        // TODO: Pegar evaluatorId do contexto de auth
        return store.createEvaluation('evaluator-1');
    }, [store]);

    const saveAndContinue = useCallback(() => {
        // Salvar é automático com Zustand persist
        // Apenas avançar
        store.nextStep();
    }, [store]);

    const value: EvaluationContextValue = {
        currentEvaluation,
        currentStep: store.currentStep,
        totalSteps: store.totalSteps,
        isLoading: false,

        nextStep: store.nextStep,
        prevStep: store.prevStep,
        goToStep: store.goToStep,
        canGoNext,
        canGoPrev,

        progress,
        stepName,

        startNewEvaluation,
        saveAndContinue,
    };

    return (
        <EvaluationContext.Provider value={value}>
            {children}
        </EvaluationContext.Provider>
    );
}

export function useEvaluation() {
    const context = useContext(EvaluationContext);
    if (!context) {
        throw new Error('useEvaluation deve ser usado dentro de EvaluationProvider');
    }
    return context;
}
