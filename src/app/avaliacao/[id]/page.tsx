'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { StepLayout } from '@/components/layout/StepLayout';
import { Step1Discovery } from '@/components/evaluation/Step1Discovery';
import { Step2Patient } from '@/components/evaluation/Step2Patient';
import { Step3Health } from '@/components/evaluation/Step3Health';
import { Step4Abemid } from '@/components/evaluation/Step4Abemid';
import { Step5Katz } from '@/components/evaluation/Step5Katz';
import { Step6Responsibilities } from '@/components/evaluation/Step6Responsibilities';
import { Step7Proposal } from '@/components/evaluation/Step7Proposal';
import { Step8Evaluator } from '@/components/evaluation/Step8Evaluator';
import { Step9KYC } from '@/components/evaluation/Step9KYC';

const STEP_CONFIG = [
    { name: 'Descoberta', component: Step1Discovery },
    { name: 'Paciente', component: Step2Patient },
    { name: 'Saúde', component: Step3Health },
    { name: 'ABEMID', component: Step4Abemid },
    { name: 'KATZ', component: Step5Katz },
    { name: 'Responsabilidades', component: Step6Responsibilities },
    { name: 'Proposta', component: Step7Proposal },
    { name: 'Avaliador', component: Step8Evaluator },
    { name: 'Documentos', component: Step9KYC },
];


export default function EvaluationPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const {
        currentStep,
        loadEvaluation,
        nextStep,
        prevStep,
        getCurrentEvaluation,
    } = useEvaluationStore();

    const evaluation = getCurrentEvaluation();

    useEffect(() => {
        if (id) {
            loadEvaluation(id);
        }
    }, [id, loadEvaluation]);

    if (!evaluation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center">
                    <p className="text-neutral-500 mb-4">Avaliação não encontrada</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    const currentStepConfig = STEP_CONFIG[currentStep];
    const StepComponent = currentStepConfig?.component || Step1Discovery;
    const isLastStep = currentStep === STEP_CONFIG.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            // Navegar para a visualização da proposta
            router.push(`/avaliacao/${id}/proposta`);
        } else {
            nextStep();
            // Scroll para o topo da página
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentStep === 0) {
            router.push('/');
        } else {
            prevStep();
            // Scroll para o topo da página
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <StepLayout
            stepNumber={currentStep + 1}
            totalSteps={STEP_CONFIG.length}
            stepName={currentStepConfig?.name || 'Avaliação'}
            patientName={evaluation.patient?.preferredName || evaluation.patient?.fullName}
            onNext={handleNext}
            onPrev={handlePrev}
            canGoNext={true}
            canGoPrev={true}
            nextLabel={isLastStep ? 'Apresentar Proposta' : 'Próximo'}
            isLastStep={isLastStep}
        >
            <StepComponent />
        </StepLayout>
    );
}
