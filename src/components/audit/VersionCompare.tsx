'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
    GitCompare,
    Clock,
    Plus,
    Minus,
    RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { AuditChange } from '@/types/audit';
import { useAuditStore } from '@/stores/auditStore';

interface VersionCompareProps {
    entityId: string;
    entityType: 'evaluation' | 'user';
}

export function VersionCompare({ entityId, entityType }: VersionCompareProps) {
    const { getSnapshots, compareVersions } = useAuditStore();

    const snapshots = getSnapshots(entityType, entityId);
    const [versionA, setVersionA] = useState<number | null>(
        snapshots.length >= 2 ? snapshots[snapshots.length - 2].version : null
    );
    const [versionB, setVersionB] = useState<number | null>(
        snapshots.length >= 1 ? snapshots[snapshots.length - 1].version : null
    );

    const diff = useMemo(() => {
        if (versionA === null || versionB === null) return null;
        return compareVersions(entityId, versionA, versionB);
    }, [entityId, versionA, versionB, compareVersions]);

    if (snapshots.length < 2) {
        return (
            <div className="text-center py-12">
                <GitCompare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500">
                    É necessário ter pelo menos 2 versões para comparar
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                    Versões disponíveis: {snapshots.length}
                </p>
            </div>
        );
    }

    const formatValue = (value: unknown): string => {
        if (value === null || value === undefined) return '—';
        if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
        if (Array.isArray(value)) return value.join(', ') || '—';
        if (value instanceof Date) return format(value, 'dd/MM/yyyy HH:mm');
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    return (
        <div className="space-y-6">
            {/* Seletores de versão */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex-1">
                    <label className="label">Versão anterior</label>
                    <select
                        value={versionA || ''}
                        onChange={(e) => setVersionA(Number(e.target.value))}
                        className="input-base"
                    >
                        {snapshots.slice(0, -1).map((s) => (
                            <option key={s.id} value={s.version}>
                                Versão {s.version} - {format(new Date(s.timestamp), 'dd/MM HH:mm')}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-center">
                    <GitCompare className="w-6 h-6 text-neutral-400" />
                </div>

                <div className="flex-1">
                    <label className="label">Versão atual</label>
                    <select
                        value={versionB || ''}
                        onChange={(e) => setVersionB(Number(e.target.value))}
                        className="input-base"
                    >
                        {snapshots.slice(1).map((s) => (
                            <option key={s.id} value={s.version}>
                                Versão {s.version} - {format(new Date(s.timestamp), 'dd/MM HH:mm')}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Resumo da comparação */}
            {diff && (
                <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-neutral-400" />
                            <span className="text-neutral-600">
                                {format(new Date(diff.previousTimestamp), "dd/MM 'às' HH:mm")} →{' '}
                                {format(new Date(diff.currentTimestamp), "dd/MM 'às' HH:mm")}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-neutral-400" />
                            <span className="text-neutral-600">
                                {diff.changes.length} alteração{diff.changes.length !== 1 ? 'ões' : ''}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de alterações */}
            {diff && diff.changes.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-medium text-neutral-900">Alterações detectadas</h3>

                    <div className="divide-y divide-neutral-100">
                        {diff.changes.map((change, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="py-3"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {change.changeType === 'added' && (
                                        <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <Plus className="w-3 h-3 text-green-600" />
                                        </span>
                                    )}
                                    {change.changeType === 'removed' && (
                                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                            <Minus className="w-3 h-3 text-red-600" />
                                        </span>
                                    )}
                                    {change.changeType === 'modified' && (
                                        <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                            <RefreshCw className="w-3 h-3 text-blue-600" />
                                        </span>
                                    )}
                                    <span className="font-medium text-neutral-800">
                                        {change.fieldLabel}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 ml-7">
                                    {change.changeType !== 'added' && (
                                        <div className="p-2 bg-red-50 rounded text-sm">
                                            <p className="text-xs text-red-600 font-medium mb-1">Antes</p>
                                            <p className="text-red-700 break-words">
                                                {formatValue(change.previousValue)}
                                            </p>
                                        </div>
                                    )}
                                    {change.changeType !== 'removed' && (
                                        <div className={cn(
                                            'p-2 bg-green-50 rounded text-sm',
                                            change.changeType === 'added' && 'col-span-2'
                                        )}>
                                            <p className="text-xs text-green-600 font-medium mb-1">Depois</p>
                                            <p className="text-green-700 break-words">
                                                {formatValue(change.newValue)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {diff && diff.changes.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-neutral-500">Nenhuma diferença encontrada entre as versões</p>
                </div>
            )}
        </div>
    );
}
