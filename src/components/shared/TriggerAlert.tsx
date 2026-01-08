// src/components/shared/TriggerAlert.tsx
// Alert component for clinical triggers and warnings

'use client';

import { cn } from '@/lib/utils/cn';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Stethoscope } from 'lucide-react';

type AlertLevel = 'info' | 'warning' | 'danger' | 'success' | 'nursing';

interface TriggerAlertProps {
    level: AlertLevel;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const alertStyles: Record<AlertLevel, { bg: string; border: string; icon: string; title: string }> = {
    info: {
        bg: 'bg-brand-50',
        border: 'border-brand-200',
        icon: 'text-brand-500',
        title: 'text-brand-800',
    },
    warning: {
        bg: 'bg-warning-50',
        border: 'border-warning-200',
        icon: 'text-warning-500',
        title: 'text-warning-800',
    },
    danger: {
        bg: 'bg-danger-50',
        border: 'border-danger-200',
        icon: 'text-danger-500',
        title: 'text-danger-800',
    },
    success: {
        bg: 'bg-success-50',
        border: 'border-success-200',
        icon: 'text-success-500',
        title: 'text-success-800',
    },
    nursing: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-500',
        title: 'text-purple-800',
    },
};

const defaultIcons: Record<AlertLevel, React.ReactNode> = {
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    danger: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    nursing: <Stethoscope className="w-5 h-5" />,
};

export function TriggerAlert({
    level,
    title,
    description,
    icon,
    action,
    className,
}: TriggerAlertProps) {
    const styles = alertStyles[level];

    return (
        <div
            className={cn(
                'flex gap-3 p-4 rounded-xl border',
                styles.bg,
                styles.border,
                className
            )}
        >
            <div className={cn('shrink-0 mt-0.5', styles.icon)}>
                {icon || defaultIcons[level]}
            </div>
            <div className="flex-1 min-w-0">
                <p className={cn('font-semibold', styles.title)}>{title}</p>
                {description && (
                    <p className="text-sm text-neutral-600 mt-1">{description}</p>
                )}
                {action && (
                    <button
                        onClick={action.onClick}
                        className={cn(
                            'mt-2 text-sm font-medium underline',
                            styles.title
                        )}
                    >
                        {action.label}
                    </button>
                )}
            </div>
        </div>
    );
}

// Pre-configured nursing trigger alert
export function NursingTriggerAlert({
    triggers,
    className,
}: {
    triggers: string[];
    className?: string;
}) {
    if (triggers.length === 0) return null;

    return (
        <TriggerAlert
            level="nursing"
            title="Gatilho para Enfermagem Detectado"
            description={`Este paciente requer acompanhamento de técnico de enfermagem devido a: ${triggers.join(', ')}.`}
            className={className}
        />
    );
}

// Risk level alert
export function RiskLevelAlert({
    level,
    score,
    className,
}: {
    level: 'low' | 'medium' | 'high' | 'critical';
    score: number;
    className?: string;
}) {
    const levelConfig = {
        low: { alert: 'success' as AlertLevel, title: 'Risco Baixo' },
        medium: { alert: 'warning' as AlertLevel, title: 'Risco Moderado' },
        high: { alert: 'danger' as AlertLevel, title: 'Risco Alto' },
        critical: { alert: 'danger' as AlertLevel, title: 'Risco Crítico' },
    };

    const config = levelConfig[level];

    return (
        <TriggerAlert
            level={config.alert}
            title={`${config.title} (Score: ${score})`}
            description={
                level === 'critical'
                    ? 'Requer atenção imediata e profissional especializado.'
                    : level === 'high'
                        ? 'Requer acompanhamento frequente e monitoramento.'
                        : level === 'medium'
                            ? 'Manter vigilância e reavaliação periódica.'
                            : 'Continuar com acompanhamento padrão.'
            }
            className={className}
        />
    );
}
