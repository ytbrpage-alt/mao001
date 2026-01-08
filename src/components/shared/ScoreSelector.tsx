// src/components/shared/ScoreSelector.tsx
// Score selection component for clinical scales

'use client';

import { cn } from '@/lib/utils/cn';

interface ScoreOption {
    value: number;
    label: string;
    description?: string;
}

interface ScoreSelectorProps {
    title: string;
    description?: string;
    options: ScoreOption[];
    value: number;
    onChange: (value: number) => void;
    orientation?: 'horizontal' | 'vertical';
    showValue?: boolean;
}

export function ScoreSelector({
    title,
    description,
    options,
    value,
    onChange,
    orientation = 'vertical',
    showValue = true,
}: ScoreSelectorProps) {
    const getColorByValue = (optionValue: number, maxValue: number) => {
        const ratio = optionValue / maxValue;
        if (ratio === 0) return { bg: 'bg-success-100', border: 'border-success-500', text: 'text-success-700' };
        if (ratio <= 0.33) return { bg: 'bg-success-50', border: 'border-success-400', text: 'text-success-600' };
        if (ratio <= 0.66) return { bg: 'bg-warning-50', border: 'border-warning-400', text: 'text-warning-600' };
        return { bg: 'bg-danger-50', border: 'border-danger-400', text: 'text-danger-600' };
    };

    const maxValue = Math.max(...options.map((o) => o.value));

    return (
        <div className="space-y-3">
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="text-sm font-semibold text-neutral-900">{title}</h4>
                    {description && (
                        <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
                    )}
                </div>
                {showValue && (
                    <span
                        className={cn(
                            'px-2 py-1 rounded-lg text-sm font-bold',
                            getColorByValue(value, maxValue).bg,
                            getColorByValue(value, maxValue).text
                        )}
                    >
                        {value}
                    </span>
                )}
            </div>

            <div
                className={cn(
                    orientation === 'horizontal'
                        ? 'flex flex-wrap gap-2'
                        : 'space-y-2'
                )}
            >
                {options.map((option) => {
                    const isSelected = value === option.value;
                    const colors = getColorByValue(option.value, maxValue);

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={cn(
                                'w-full text-left p-3 rounded-xl border-2 transition-all',
                                orientation === 'horizontal' && 'flex-1 min-w-[120px]',
                                isSelected
                                    ? `${colors.bg} ${colors.border}`
                                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                            )}
                        >
                            <div className="flex items-start gap-2">
                                <span
                                    className={cn(
                                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                                        isSelected ? `${colors.bg} ${colors.text}` : 'bg-neutral-100 text-neutral-500'
                                    )}
                                >
                                    {option.value}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={cn(
                                            'text-sm font-medium',
                                            isSelected ? colors.text : 'text-neutral-700'
                                        )}
                                    >
                                        {option.label}
                                    </p>
                                    {option.description && (
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            {option.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
