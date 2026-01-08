'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cloud,
    CloudOff,
    RefreshCw,
    AlertTriangle,
    Check,
    X,
    Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSyncStore } from '@/stores/syncStore';
import { useOffline } from '@/contexts/OfflineContext';
import { cn } from '@/lib/utils/cn';

interface SyncIndicatorProps {
    minimal?: boolean;
}

export function SyncIndicator({ minimal = false }: SyncIndicatorProps) {
    const {
        lastSyncAt,
        isSyncing,
        pendingCount,
        conflictCount,
        errorCount,
        progress,
        sync,
    } = useSyncStore();
    const { isOnline } = useOffline();

    const [showDetails, setShowDetails] = useState(false);

    const getStatusInfo = () => {
        if (!isOnline) {
            return { icon: CloudOff, color: 'text-neutral-400', bg: 'bg-neutral-100', label: 'Offline' };
        }
        if (isSyncing) {
            return { icon: Loader2, color: 'text-brand-500', bg: 'bg-brand-50', label: 'Sincronizando...', animate: true };
        }
        if (conflictCount > 0) {
            return { icon: AlertTriangle, color: 'text-warning-500', bg: 'bg-warning-50', label: `${conflictCount} conflito(s)` };
        }
        if (errorCount > 0) {
            return { icon: X, color: 'text-danger-500', bg: 'bg-danger-50', label: `${errorCount} erro(s)` };
        }
        if (pendingCount > 0) {
            return { icon: Cloud, color: 'text-brand-500', bg: 'bg-brand-50', label: `${pendingCount} pendente(s)` };
        }
        return { icon: Check, color: 'text-success-500', bg: 'bg-success-50', label: 'Sincronizado' };
    };

    const status = getStatusInfo();
    const Icon = status.icon;

    const handleSync = async () => {
        if (isSyncing || !isOnline) return;
        await sync();
    };

    if (minimal) {
        return (
            <button
                onClick={handleSync}
                disabled={isSyncing || !isOnline}
                className={cn('p-2 rounded-full transition-colors', status.bg, status.color)}
                title={status.label}
            >
                <Icon className={cn('w-5 h-5', status.animate && 'animate-spin')} />
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowDetails(!showDetails)}
                className={cn('flex items-center gap-2 px-3 py-2 rounded-lg transition-colors', status.bg, status.color)}
            >
                <Icon className={cn('w-4 h-4', status.animate && 'animate-spin')} />
                <span className="text-sm font-medium">{status.label}</span>
            </button>

            <AnimatePresence>
                {showDetails && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-strong border border-neutral-200 p-4 z-50"
                    >
                        <h3 className="font-medium text-neutral-900 mb-3">Status de Sincronização</h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Conexão</span>
                                <span className={cn('flex items-center gap-1', isOnline ? 'text-success-600' : 'text-neutral-400')}>
                                    {isOnline ? <><Check className="w-4 h-4" /> Online</> : <><CloudOff className="w-4 h-4" /> Offline</>}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Última sync</span>
                                <span className="text-neutral-700">
                                    {lastSyncAt ? formatDistanceToNow(new Date(lastSyncAt), { locale: ptBR, addSuffix: true }) : 'Nunca'}
                                </span>
                            </div>

                            {pendingCount > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-500">Pendentes</span>
                                    <span className="text-brand-600 font-medium">{pendingCount}</span>
                                </div>
                            )}

                            {isSyncing && (
                                <div className="pt-2">
                                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-brand-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            )}

                            <button onClick={handleSync} disabled={isSyncing || !isOnline} className="w-full mt-2 btn-primary text-sm">
                                {isSyncing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sincronizando...</> : <><RefreshCw className="w-4 h-4 mr-2" />Sincronizar agora</>}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
