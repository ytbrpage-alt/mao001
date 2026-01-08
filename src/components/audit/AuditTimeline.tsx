'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Clock,
    User,
    FileText,
    Shield,
    Settings,
    ChevronDown,
    ChevronRight,
    Info,
    AlertTriangle,
    AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type {
    AuditLogEntry,
    AuditCategory,
    AuditSeverity,
    AuditChange,
} from '@/types/audit';
import { AUDIT_EVENT_LABELS, AUDIT_CATEGORY_LABELS } from '@/types/audit';

interface AuditTimelineProps {
    entries: AuditLogEntry[];
    showFilters?: boolean;
    maxItems?: number;
    onLoadMore?: () => void;
    hasMore?: boolean;
}

const CATEGORY_ICONS: Record<AuditCategory, typeof Clock> = {
    evaluation: FileText,
    user: User,
    authentication: Shield,
    system: Settings,
    document: FileText,
};

const SEVERITY_STYLES: Record<AuditSeverity, { bg: string; icon: typeof Info; color: string }> = {
    info: { bg: 'bg-blue-100', icon: Info, color: 'text-blue-600' },
    warning: { bg: 'bg-yellow-100', icon: AlertTriangle, color: 'text-yellow-600' },
    critical: { bg: 'bg-red-100', icon: AlertCircle, color: 'text-red-600' },
};

// Componente para exibir uma mudança
function ChangeItem({ change }: { change: AuditChange }) {
    const formatValue = (value: unknown): string => {
        if (value === null || value === undefined) return '(vazio)';
        if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
        if (Array.isArray(value)) return value.join(', ') || '(vazio)';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm py-1">
            <span className="font-medium text-neutral-700">{change.fieldLabel}:</span>
            <div className="flex items-center gap-2">
                {change.changeType !== 'added' && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded line-through text-xs">
                        {formatValue(change.previousValue)}
                    </span>
                )}
                {change.changeType !== 'removed' && (
                    <>
                        {change.changeType === 'modified' && (
                            <ChevronRight className="w-3 h-3 text-neutral-400" />
                        )}
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-xs">
                            {formatValue(change.newValue)}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}

// Item da timeline
function TimelineItem({ entry, isLast }: { entry: AuditLogEntry; isLast: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const CategoryIcon = CATEGORY_ICONS[entry.category];
    const severityStyle = SEVERITY_STYLES[entry.severity];
    const SeverityIcon = severityStyle.icon;

    const hasChanges = entry.changes && entry.changes.length > 0;

    return (
        <div className="relative flex gap-4">
            {/* Linha vertical */}
            {!isLast && (
                <div className="absolute left-5 top-10 w-0.5 h-full bg-neutral-200" />
            )}

            {/* Ícone */}
            <div className={cn(
                'relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                severityStyle.bg
            )}>
                <SeverityIcon className={cn('w-5 h-5', severityStyle.color)} />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 pb-6">
                <motion.div
                    className={cn(
                        'bg-white rounded-lg border border-neutral-200 p-4',
                        hasChanges && 'cursor-pointer hover:border-neutral-300'
                    )}
                    onClick={() => hasChanges && setIsExpanded(!isExpanded)}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <p className="font-medium text-neutral-900">
                                {AUDIT_EVENT_LABELS[entry.eventType]}
                            </p>
                            <p className="text-sm text-neutral-500 mt-0.5">
                                {entry.description}
                            </p>
                        </div>

                        {hasChanges && (
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                className="text-neutral-400"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </motion.div>
                        )}
                    </div>

                    {/* Metadados */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(entry.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                        <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {entry.userName}
                        </span>
                        <span className="flex items-center gap-1">
                            <CategoryIcon className="w-3 h-3" />
                            {AUDIT_CATEGORY_LABELS[entry.category]}
                        </span>
                    </div>

                    {/* Alterações expandidas */}
                    <AnimatePresence>
                        {isExpanded && hasChanges && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 pt-4 border-t border-neutral-100 overflow-hidden"
                            >
                                <p className="text-xs font-medium text-neutral-500 mb-2">
                                    Alterações realizadas:
                                </p>
                                <div className="space-y-1">
                                    {entry.changes!.map((change, idx) => (
                                        <ChangeItem key={idx} change={change} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

export function AuditTimeline({
    entries,
    maxItems,
    onLoadMore,
    hasMore = false,
}: AuditTimelineProps) {
    // Agrupar por data
    const groupedEntries = useMemo(() => {
        const groups = new Map<string, AuditLogEntry[]>();

        const displayEntries = maxItems ? entries.slice(0, maxItems) : entries;

        displayEntries.forEach((entry) => {
            const date = format(new Date(entry.timestamp), 'yyyy-MM-dd');
            if (!groups.has(date)) {
                groups.set(date, []);
            }
            groups.get(date)!.push(entry);
        });

        return Array.from(groups.entries()).map(([date, items]) => ({
            date,
            label: format(new Date(date), "EEEE, dd 'de' MMMM", { locale: ptBR }),
            entries: items,
        }));
    }, [entries, maxItems]);

    if (entries.length === 0) {
        return (
            <div className="text-center py-12">
                <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500">Nenhum registro encontrado</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {groupedEntries.map((group) => (
                <div key={group.date}>
                    {/* Data */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 bg-neutral-200" />
                        <span className="text-sm font-medium text-neutral-500 capitalize">
                            {group.label}
                        </span>
                        <div className="h-px flex-1 bg-neutral-200" />
                    </div>

                    {/* Entries do dia */}
                    <div>
                        {group.entries.map((entry, idx) => (
                            <TimelineItem
                                key={entry.id}
                                entry={entry}
                                isLast={idx === group.entries.length - 1}
                            />
                        ))}
                    </div>
                </div>
            ))}

            {/* Carregar mais */}
            {hasMore && onLoadMore && (
                <div className="text-center pt-4">
                    <button
                        onClick={onLoadMore}
                        className="btn-secondary"
                    >
                        Carregar mais
                    </button>
                </div>
            )}
        </div>
    );
}
