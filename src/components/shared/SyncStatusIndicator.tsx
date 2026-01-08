// src/components/shared/SyncStatusIndicator.tsx
// Visual indicator for sync status

'use client';

import { useSyncStatus } from '@/hooks/useSyncStatus';
import { Cloud, CloudOff, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SyncStatusIndicatorProps {
    className?: string;
    showLabel?: boolean;
}

export function SyncStatusIndicator({ className, showLabel = true }: SyncStatusIndicatorProps) {
    const { status, isOnline, pendingCount, lastSyncAt, forceSync, hasPendingChanges } = useSyncStatus();

    const getStatusIcon = () => {
        if (!isOnline) {
            return <CloudOff className="w-4 h-4" />;
        }

        switch (status) {
            case 'syncing':
                return <RefreshCw className="w-4 h-4 animate-spin" />;
            case 'error':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return hasPendingChanges ? (
                    <Cloud className="w-4 h-4" />
                ) : (
                    <Check className="w-4 h-4" />
                );
        }
    };

    const getStatusColor = () => {
        if (!isOnline) return 'text-neutral-500 bg-neutral-100';
        switch (status) {
            case 'syncing':
                return 'text-brand-600 bg-brand-50';
            case 'error':
                return 'text-danger-600 bg-danger-50';
            default:
                return hasPendingChanges
                    ? 'text-warning-600 bg-warning-50'
                    : 'text-success-600 bg-success-50';
        }
    };

    const getStatusText = () => {
        if (!isOnline) return 'Offline';
        switch (status) {
            case 'syncing':
                return 'Sincronizando...';
            case 'error':
                return 'Erro de sincronização';
            default:
                if (hasPendingChanges) {
                    return `${pendingCount} pendente${pendingCount > 1 ? 's' : ''}`;
                }
                return 'Sincronizado';
        }
    };

    const formatLastSync = () => {
        if (!lastSyncAt) return null;
        const diff = Date.now() - lastSyncAt.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'agora mesmo';
        if (minutes < 60) return `há ${minutes}min`;
        const hours = Math.floor(minutes / 60);
        return `há ${hours}h`;
    };

    return (
        <button
            onClick={() => isOnline && forceSync()}
            disabled={!isOnline || status === 'syncing'}
            className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                getStatusColor(),
                isOnline && status !== 'syncing' && 'hover:opacity-80 cursor-pointer',
                !isOnline && 'cursor-not-allowed',
                className
            )}
            title={
                !isOnline
                    ? 'Você está offline. Os dados serão sincronizados quando a conexão voltar.'
                    : status === 'syncing'
                        ? 'Sincronizando dados...'
                        : 'Clique para sincronizar agora'
            }
        >
            {getStatusIcon()}
            {showLabel && (
                <span>
                    {getStatusText()}
                    {lastSyncAt && status !== 'syncing' && !hasPendingChanges && (
                        <span className="text-xs opacity-70 ml-1">
                            ({formatLastSync()})
                        </span>
                    )}
                </span>
            )}
        </button>
    );
}

// Compact version for header
export function SyncStatusBadge({ className }: { className?: string }) {
    const { status, isOnline, hasPendingChanges } = useSyncStatus();

    const getBadgeColor = () => {
        if (!isOnline) return 'bg-neutral-400';
        switch (status) {
            case 'syncing':
                return 'bg-brand-500 animate-pulse';
            case 'error':
                return 'bg-danger-500';
            default:
                return hasPendingChanges ? 'bg-warning-500' : 'bg-success-500';
        }
    };

    return (
        <span
            className={cn(
                'inline-block w-2 h-2 rounded-full',
                getBadgeColor(),
                className
            )}
            title={!isOnline ? 'Offline' : hasPendingChanges ? 'Pendente' : 'Sincronizado'}
        />
    );
}
