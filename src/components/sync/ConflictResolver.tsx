'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GitMerge, Clock, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { SyncConflict } from '@/types/sync';
import { useSyncStore } from '@/stores/syncStore';

interface ConflictResolverProps {
    conflict: SyncConflict;
    onResolved?: () => void;
}

export function ConflictResolver({ conflict, onResolved }: ConflictResolverProps) {
    const { resolveConflict } = useSyncStore();
    const [isResolving, setIsResolving] = useState(false);

    const handleResolve = async (resolution: 'local' | 'remote') => {
        setIsResolving(true);
        await resolveConflict(conflict.id, resolution);
        setIsResolving(false);
        onResolved?.();
    };

    const formatValue = (value: unknown): string => {
        if (value === null || value === undefined) return '—';
        if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
        if (Array.isArray(value)) return value.join(', ') || '—';
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    // Find differences between local and remote
    const findDifferences = () => {
        const diffs: { key: string; local: unknown; remote: unknown }[] = [];
        const allKeys = new Set([
            ...Object.keys(conflict.localData || {}),
            ...Object.keys(conflict.remoteData || {}),
        ]);

        allKeys.forEach((key) => {
            if (['id', 'createdAt'].includes(key)) return;
            const localVal = conflict.localData[key];
            const remoteVal = conflict.remoteData[key];
            if (JSON.stringify(localVal) !== JSON.stringify(remoteVal)) {
                diffs.push({ key, local: localVal, remote: remoteVal });
            }
        });

        return diffs;
    };

    const differences = findDifferences();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-warning-200 p-4"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center">
                    <GitMerge className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                    <h3 className="font-medium text-neutral-900">Conflito Detectado</h3>
                    <p className="text-sm text-neutral-500">
                        {conflict.entityType === 'evaluation' ? 'Avaliação' : 'Usuário'} modificada em dois locais
                    </p>
                </div>
            </div>

            {/* Timestamps */}
            <div className="flex items-center gap-4 mb-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Local: {format(new Date(conflict.localTimestamp), 'dd/MM HH:mm', { locale: ptBR })}
                </span>
                <ArrowRight className="w-3 h-3" />
                <span>
                    Servidor: {format(new Date(conflict.remoteTimestamp), 'dd/MM HH:mm', { locale: ptBR })}
                </span>
            </div>

            {/* Differences */}
            {differences.length > 0 && (
                <div className="mb-4 space-y-2">
                    <p className="text-xs font-medium text-neutral-500">Diferenças encontradas:</p>
                    {differences.slice(0, 5).map((diff) => (
                        <div key={diff.key} className="grid grid-cols-3 gap-2 text-xs">
                            <span className="font-medium text-neutral-700 truncate">{diff.key}</span>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded truncate">
                                {formatValue(diff.local)}
                            </span>
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded truncate">
                                {formatValue(diff.remote)}
                            </span>
                        </div>
                    ))}
                    {differences.length > 5 && (
                        <p className="text-xs text-neutral-400">+{differences.length - 5} mais campos</p>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={() => handleResolve('local')}
                    disabled={isResolving}
                    className={cn(
                        'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                        'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    )}
                >
                    Manter local
                </button>
                <button
                    onClick={() => handleResolve('remote')}
                    disabled={isResolving}
                    className={cn(
                        'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                        'bg-green-100 text-green-700 hover:bg-green-200'
                    )}
                >
                    Usar servidor
                </button>
            </div>
        </motion.div>
    );
}

interface ConflictListProps {
    conflicts: SyncConflict[];
}

export function ConflictList({ conflicts }: ConflictListProps) {
    const unresolvedConflicts = conflicts.filter((c) => !c.resolvedAt);

    if (unresolvedConflicts.length === 0) {
        return (
            <div className="text-center py-8">
                <Check className="w-12 h-12 text-success-300 mx-auto mb-3" />
                <p className="text-neutral-500">Nenhum conflito pendente</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {unresolvedConflicts.map((conflict) => (
                <ConflictResolver key={conflict.id} conflict={conflict} />
            ))}
        </div>
    );
}
