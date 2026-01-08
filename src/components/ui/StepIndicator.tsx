// src/components/ui/StepIndicator.tsx
// Mobile-first step indicator/progress component

'use client';

import { cn } from '@/lib/utils/cn';
import { Check } from 'lucide-react';

interface Step {
    id: string;
    label: string;
    description?: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    variant?: 'dots' | 'numbers' | 'detailed';
    className?: string;
}

export function StepIndicator({
    steps,
    currentStep,
    variant = 'dots',
    className,
}: StepIndicatorProps) {
    if (variant === 'dots') {
        return (
            <div className={cn('flex items-center justify-center gap-2', className)}>
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    return (
                        <div
                            key={step.id}
                            className={cn(
                                'w-2 h-2 rounded-full transition-all duration-300',
                                isCompleted
                                    ? 'bg-success-500'
                                    : isCurrent
                                        ? 'bg-brand-500 w-6'
                                        : 'bg-neutral-300'
                            )}
                        />
                    );
                })}
            </div>
        );
    }

    if (variant === 'numbers') {
        return (
            <div className={cn('flex items-center justify-center', className)}>
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={step.id} className="flex items-center">
                            <div
                                className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                                    isCompleted
                                        ? 'bg-success-500 text-white'
                                        : isCurrent
                                            ? 'bg-brand-500 text-white ring-4 ring-brand-100'
                                            : 'bg-neutral-200 text-neutral-500'
                                )}
                            >
                                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                            </div>
                            {!isLast && (
                                <div
                                    className={cn(
                                        'w-8 h-0.5 mx-1',
                                        isCompleted ? 'bg-success-500' : 'bg-neutral-200'
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    // Detailed variant
    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-neutral-900">
                    Etapa {currentStep + 1} de {steps.length}
                </span>
                <span className="text-neutral-500">{steps[currentStep]?.label}</span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
            </div>
        </div>
    );
}
