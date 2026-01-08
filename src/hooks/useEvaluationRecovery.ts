// src/hooks/useEvaluationRecovery.ts
// Hook for recovering evaluation state after page reload

'use client';

import { useEffect, useState } from 'react';
import { useEvaluationStore } from '@/stores/evaluationStore';

interface RecoveryState {
    hasRecovery: boolean;
    evaluationId: string | null;
    currentStep: number;
    patientName: string | null;
    isHydrated: boolean;
}

export function useEvaluationRecovery(): RecoveryState {
    const [isHydrated, setIsHydrated] = useState(false);

    const store = useEvaluationStore();

    // Wait for Zustand to hydrate from localStorage
    useEffect(() => {
        // Give Zustand time to rehydrate
        const timer = setTimeout(() => {
            setIsHydrated(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Get current evaluation after hydration
    const currentEvaluation = store.getCurrentEvaluation();

    const hasRecovery = isHydrated &&
        !!store.currentEvaluationId &&
        !!currentEvaluation &&
        currentEvaluation.status === 'draft' &&
        store.currentStep > 0;

    return {
        hasRecovery,
        evaluationId: store.currentEvaluationId,
        currentStep: store.currentStep,
        patientName: currentEvaluation?.patient?.fullName || null,
        isHydrated,
    };
}

// Hook for checking if store is hydrated
export function useStoreHydration(): boolean {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return isHydrated;
}
