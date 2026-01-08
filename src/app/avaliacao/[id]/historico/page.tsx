'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    History,
    GitCompare,
    Download,
} from 'lucide-react';
import { useAuditStore } from '@/stores/auditStore';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { AuditTimeline } from '@/components/audit/AuditTimeline';
import { VersionCompare } from '@/components/audit/VersionCompare';
import { cn } from '@/lib/utils/cn';

type ViewMode = 'timeline' | 'compare';

export default function EvaluationHistoryPage() {
    const params = useParams();
    const router = useRouter();
    const evaluationId = params.id as string;

    const { getEntriesByEntity, exportLogs } = useAuditStore();
    const { getEvaluationById } = useEvaluationStore();

    const [viewMode, setViewMode] = useState<ViewMode>('timeline');
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const evaluation = getEvaluationById(evaluationId);
    const entries = getEntriesByEntity('evaluation', evaluationId);

    const paginatedEntries = entries.slice(0, page * pageSize);
    const hasMore = entries.length > paginatedEntries.length;

    const handleExport = () => {
        const data = exportLogs({ entityId: evaluationId });
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historico-avaliacao-${evaluationId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!evaluation) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500">Avaliação não encontrada</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
                <div className="container-mobile py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        <div className="flex-1">
                            <h1 className="text-lg font-bold text-neutral-900">
                                Histórico de Alterações
                            </h1>
                            <p className="text-sm text-neutral-500">
                                {evaluation.patient.fullName || 'Paciente não informado'}
                            </p>
                        </div>

                        <button
                            onClick={handleExport}
                            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                            title="Exportar histórico"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={cn(
                                'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors',
                                viewMode === 'timeline'
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            )}
                        >
                            <History className="w-4 h-4" />
                            Timeline
                        </button>
                        <button
                            onClick={() => setViewMode('compare')}
                            className={cn(
                                'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors',
                                viewMode === 'compare'
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            )}
                        >
                            <GitCompare className="w-4 h-4" />
                            Comparar
                        </button>
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="container-mobile py-6">
                {viewMode === 'timeline' ? (
                    <AuditTimeline
                        entries={paginatedEntries}
                        hasMore={hasMore}
                        onLoadMore={() => setPage((p) => p + 1)}
                    />
                ) : (
                    <VersionCompare
                        entityId={evaluationId}
                        entityType="evaluation"
                    />
                )}
            </div>
        </div>
    );
}
