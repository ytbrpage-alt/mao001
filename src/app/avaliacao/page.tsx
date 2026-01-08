'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { formatRelativeDate } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

type StatusFilter = 'all' | 'draft' | 'in_progress' | 'completed' | 'cancelled';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'draft', label: 'Rascunhos' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'completed', label: 'Concluídas' },
    { value: 'cancelled', label: 'Canceladas' },
];

export default function AvaliacaoListPage() {
    const router = useRouter();
    const { evaluations, createEvaluation } = useEvaluationStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    const evaluationsList = useMemo(() => {
        let list = Object.values(evaluations);

        // Filtrar por status
        if (statusFilter !== 'all') {
            list = list.filter(e => e.status === statusFilter);
        }

        // Filtrar por busca
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            list = list.filter(e =>
                e.patient.fullName.toLowerCase().includes(search) ||
                e.patient.preferredName?.toLowerCase().includes(search)
            );
        }

        // Ordenar por data de atualização
        return list.sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }, [evaluations, statusFilter, searchTerm]);

    const handleNewEvaluation = () => {
        const id = createEvaluation('evaluator-1');
        router.push(`/avaliacao/${id}`);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'draft':
                return <Clock className="w-4 h-4 text-warning-500" />;
            case 'in_progress':
                return <Clock className="w-4 h-4 text-brand-500" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-success-500" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-danger-500" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <span className="badge-warning">Rascunho</span>;
            case 'in_progress':
                return <span className="badge-info">Em Andamento</span>;
            case 'completed':
                return <span className="badge-success">Concluída</span>;
            case 'cancelled':
                return <span className="badge bg-neutral-200 text-neutral-600">Cancelada</span>;
            default:
                return null;
        }
    };

    return (
        <div className="container-mobile min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 bg-white z-10 pt-4 pb-4 -mx-4 px-4 border-b border-neutral-100">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => router.push('/')} className="p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-semibold text-neutral-900">Avaliações</h1>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome do paciente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>

                {/* Status Tabs */}
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hidden">
                    {STATUS_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setStatusFilter(option.value)}
                            className={cn(
                                'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                                statusFilter === option.value
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* New Evaluation Button */}
            <section className="py-6">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNewEvaluation}
                    className="w-full btn-primary gap-3"
                >
                    <Plus className="w-5 h-5" />
                    Nova Avaliação
                </motion.button>
            </section>

            {/* Evaluation List */}
            <section>
                {evaluationsList.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card text-center py-12"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                            <Filter className="w-8 h-8 text-neutral-400" />
                        </div>
                        <p className="text-neutral-500 font-medium">Nenhuma avaliação encontrada</p>
                        <p className="text-sm text-neutral-400 mt-1">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Tente ajustar os filtros'
                                : 'Clique em "Nova Avaliação" para começar'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
                        {evaluationsList.map((evaluation, idx) => (
                            <motion.button
                                key={evaluation.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => router.push(`/avaliacao/${evaluation.id}`)}
                                className="card w-full text-left touch-feedback"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold flex-shrink-0">
                                        {(evaluation.patient.preferredName || evaluation.patient.fullName || 'P')[0].toUpperCase()}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="font-medium text-neutral-900 truncate">
                                                    {evaluation.patient.fullName || 'Paciente não informado'}
                                                </p>
                                                {evaluation.patient.preferredName && (
                                                    <p className="text-sm text-neutral-500 truncate">
                                                        &quot;{evaluation.patient.preferredName}&quot;
                                                    </p>
                                                )}
                                            </div>
                                            {getStatusBadge(evaluation.status)}
                                        </div>

                                        <div className="flex items-center gap-3 mt-2 text-sm text-neutral-500">
                                            <span>{formatRelativeDate(evaluation.updatedAt)}</span>
                                            {evaluation.results?.indicatedProfessional && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                                                    <span>
                                                        {evaluation.results.indicatedProfessional === 'caregiver' ? 'Cuidador' : 'Enfermeiro'}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
