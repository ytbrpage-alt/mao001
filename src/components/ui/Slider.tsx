// src/components/ui/Slider.tsx
// Mobile-first range slider component

'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    valueFormatter?: (value: number) => string;
    marks?: { value: number; label: string }[];
    minLabel?: string;
    maxLabel?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
    (
        {
            label,
            value,
            onValueChange,
            min = 0,
            max = 100,
            step = 1,
            showValue = true,
            valueFormatter = (v) => v.toString(),
            marks,
            minLabel,
            maxLabel,
            disabled,
            className,
            id,
            ...props
        },
        ref
    ) => {
        const sliderId = id || `slider-${Math.random().toString(36).slice(2, 9)}`;
        const percentage = ((value - min) / (max - min)) * 100;

        return (
            <div className={cn('space-y-2', className)}>
                {(label || showValue) && (
                    <div className="flex items-center justify-between">
                        {label && (
                            <label htmlFor={sliderId} className="text-sm font-medium text-neutral-700">
                                {label}
                            </label>
                        )}
                        {showValue && (
                            <span className="text-sm font-semibold text-brand-600">
                                {valueFormatter(value)}
                            </span>
                        )}
                    </div>
                )}
                <div className="relative pt-1 pb-4">
                    <input
                        ref={ref}
                        type="range"
                        id={sliderId}
                        value={value}
                        onChange={(e) => onValueChange(Number(e.target.value))}
                        min={min}
                        max={max}
                        step={step}
                        disabled={disabled}
                        className={cn(
                            'w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer',
                            'focus:outline-none',
                            '[&::-webkit-slider-thumb]:appearance-none',
                            '[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6',
                            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500',
                            '[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}
                        {...props}
                    />
                    {(minLabel || maxLabel || marks) && (
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                            {marks ? (
                                marks.map((mark) => (
                                    <span key={mark.value} className="text-xs text-neutral-500">
                                        {mark.label}
                                    </span>
                                ))
                            ) : (
                                <>
                                    <span className="text-xs text-neutral-500">{minLabel || min}</span>
                                    <span className="text-xs text-neutral-500">{maxLabel || max}</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

Slider.displayName = 'Slider';

