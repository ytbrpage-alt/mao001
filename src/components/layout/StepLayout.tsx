'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ProgressHeader } from './ProgressHeader';

interface StepLayoutProps {
    children: React.ReactNode;
    stepNumber: number;
    totalSteps: number;
    stepName: string;
    patientName?: string;
    onNext?: () => void;
    onPrev?: () => void;
    canGoNext?: boolean;
    canGoPrev?: boolean;
    nextLabel?: string;
    isLastStep?: boolean;
}

export function StepLayout({
    children,
    stepNumber,
    totalSteps,
    stepName,
    patientName,
    onNext,
    onPrev,
    canGoNext = true,
    canGoPrev = true,
    nextLabel = 'Próximo',
    isLastStep = false,
}: StepLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            {/* Header */}
            <ProgressHeader
                stepNumber={stepNumber}
                totalSteps={totalSteps}
                stepName={stepName}
                patientName={patientName}
            />

            {/* Content */}
            <main className="flex-1 overflow-y-auto pb-24">
                <div className="container-mobile py-4">
                    {children}
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-medium">
                <div className="container-mobile py-3 flex items-center justify-between gap-3">
                    <button
                        onClick={onPrev}
                        disabled={!canGoPrev}
                        className={cn(
                            'flex items-center gap-2 px-4 py-3 rounded-lg font-medium',
                            'text-neutral-600 hover:bg-neutral-100',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'transition-colors min-h-touch'
                        )}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Voltar</span>
                    </button>

                    <button
                        onClick={onNext}
                        disabled={!canGoNext}
                        className={cn(
                            'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold',
                            isLastStep
                                ? 'bg-success-500 hover:bg-success-600 text-white'
                                : 'bg-brand-500 hover:bg-brand-600 text-white',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'transition-colors min-h-touch'
                        )}
                    >
                        <span>{nextLabel}</span>
                        {!isLastStep && <ArrowRight className="w-5 h-5" />}
                    </button>
                </div>
            </nav>
        </div>
    );
}
