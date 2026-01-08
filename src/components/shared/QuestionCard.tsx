'use client';

import { MessageCircle, Target } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface QuestionCardProps {
    number?: number;
    title: string;
    script?: string;
    objective?: string;
    children: React.ReactNode;
    className?: string;
}

export function QuestionCard({
    number,
    title,
    script,
    objective,
    children,
    className,
}: QuestionCardProps) {
    return (
        <div className={cn('card space-y-4', className)}>
            {/* Header */}
            <div className="border-b border-neutral-100 pb-3">
                <h3 className="text-base font-semibold text-neutral-900">
                    {number && <span className="text-brand-500 mr-2">{number}.</span>}
                    {title}
                </h3>
            </div>

            {/* Script de conversa */}
            {script && (
                <div className="flex gap-3 p-3 bg-brand-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-medium text-brand-700 uppercase mb-1">
                            Roteiro de Conversa
                        </p>
                        <p className="text-sm text-brand-800 italic">"{script}"</p>
                    </div>
                </div>
            )}

            {/* Objetivo */}
            {objective && (
                <div className="flex gap-2 items-start">
                    <Target className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-neutral-500">
                        <span className="font-medium">Objetivo:</span> {objective}
                    </p>
                </div>
            )}

            {/* Content */}
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}
