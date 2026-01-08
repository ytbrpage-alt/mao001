'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils/cn';

interface ProgressHeaderProps {
    stepNumber: number;
    totalSteps: number;
    stepName: string;
    patientName?: string;
}

export function ProgressHeader({
    stepNumber,
    totalSteps,
    stepName,
    patientName,
}: ProgressHeaderProps) {
    const progress = (stepNumber / totalSteps) * 100;

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-soft">
            <div className="container-mobile py-3">
                {/* Step info */}
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-lg font-bold text-neutral-900">{stepName}</h1>
                        {patientName && (
                            <p className="text-sm text-neutral-500">
                                Paciente: {patientName}
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-medium text-brand-600">
                            Etapa {stepNumber}/{totalSteps}
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <ProgressPrimitive.Root
                    value={progress}
                    className="h-2 w-full overflow-hidden rounded-full bg-neutral-200"
                >
                    <ProgressPrimitive.Indicator
                        className={cn(
                            'h-full bg-brand-500 transition-all duration-300 ease-out'
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </ProgressPrimitive.Root>
            </div>
        </header>
    );
}
