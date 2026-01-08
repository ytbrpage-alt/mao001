// src/components/ui/EmptyStates.tsx
// Beautiful empty state components

'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import {
    FileText,
    Search,
    Users,
    Calendar,
    FolderOpen,
    Inbox,
    ClipboardList,
    AlertCircle,
    Wifi,
    WifiOff,
} from 'lucide-react';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizes = {
    sm: {
        container: 'py-6',
        icon: 'w-10 h-10',
        title: 'text-base',
        description: 'text-sm',
    },
    md: {
        container: 'py-12',
        icon: 'w-16 h-16',
        title: 'text-lg',
        description: 'text-base',
    },
    lg: {
        container: 'py-16',
        icon: 'w-20 h-20',
        title: 'text-xl',
        description: 'text-base',
    },
};

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
    size = 'md',
}: EmptyStateProps) {
    const sizeStyles = sizes[size];

    return (
        <div className={cn('flex flex-col items-center justify-center text-center', sizeStyles.container, className)}>
            {icon && (
                <div className={cn('text-neutral-300 mb-4', sizeStyles.icon)}>
                    {icon}
                </div>
            )}
            <h3 className={cn('font-semibold text-neutral-700', sizeStyles.title)}>
                {title}
            </h3>
            {description && (
                <p className={cn('text-neutral-500 mt-2 max-w-md', sizeStyles.description)}>
                    {description}
                </p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

// Pre-built empty states for common scenarios
export function NoEvaluationsEmpty({ onAction }: { onAction?: () => void }) {
    return (
        <EmptyState
            icon={<ClipboardList className="w-full h-full" />}
            title="Nenhuma avaliação ainda"
            description="Comece criando sua primeira avaliação para ver os dados aqui."
            action={
                onAction && (
                    <button
                        onClick={onAction}
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium"
                    >
                        Nova Avaliação
                    </button>
                )
            }
        />
    );
}

export function NoSearchResultsEmpty({ searchTerm }: { searchTerm?: string }) {
    return (
        <EmptyState
            icon={<Search className="w-full h-full" />}
            title="Nenhum resultado encontrado"
            description={
                searchTerm
                    ? `Não encontramos resultados para "${searchTerm}". Tente outros termos.`
                    : 'Tente ajustar seus filtros ou termos de busca.'
            }
        />
    );
}

export function NoDataEmpty() {
    return (
        <EmptyState
            icon={<FolderOpen className="w-full h-full" />}
            title="Sem dados"
            description="Não há dados para exibir no momento."
            size="sm"
        />
    );
}

export function InboxEmpty() {
    return (
        <EmptyState
            icon={<Inbox className="w-full h-full" />}
            title="Caixa vazia"
            description="Você está em dia! Não há pendências."
        />
    );
}

export function ErrorEmpty({ message, onRetry }: { message?: string; onRetry?: () => void }) {
    return (
        <EmptyState
            icon={<AlertCircle className="w-full h-full text-danger-300" />}
            title="Algo deu errado"
            description={message || 'Ocorreu um erro ao carregar os dados. Tente novamente.'}
            action={
                onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
                    >
                        Tentar novamente
                    </button>
                )
            }
        />
    );
}

export function OfflineEmpty() {
    return (
        <EmptyState
            icon={<WifiOff className="w-full h-full text-warning-300" />}
            title="Você está offline"
            description="Verifique sua conexão com a internet e tente novamente."
        />
    );
}

// Illustration-based empty state
export function IllustratedEmptyState({
    illustration,
    title,
    description,
    action,
    className,
}: {
    illustration: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex flex-col items-center justify-center text-center py-12', className)}>
            <div className="mb-6">{illustration}</div>
            <h3 className="text-lg font-semibold text-neutral-700">{title}</h3>
            {description && (
                <p className="text-neutral-500 mt-2 max-w-md">{description}</p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
