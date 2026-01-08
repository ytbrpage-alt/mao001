'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, ClipboardList, Clock, CheckCircle, ChevronRight, User } from 'lucide-react';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { formatRelativeDate } from '@/lib/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
    const router = useRouter();
    const { user } = useAuth();
    const { evaluations, createEvaluation } = useEvaluationStore();

    const evaluationsList = Object.values(evaluations);
    const recentEvaluations = evaluationsList
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    const stats = {
        total: evaluationsList.length,
        pending: evaluationsList.filter(e => e.status === 'in_progress' || e.status === 'draft').length,
        completed: evaluationsList.filter(e => e.status === 'completed').length,
    };

    const handleNewEvaluation = () => {
        const id = createEvaluation('evaluator-1');
        router.push(`/avaliacao/${id}`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <span className="badge-warning">Rascunho</span>;
            case 'in_progress':
                return <span className="badge-info">Em Andamento</span>;
            case 'completed':
                return <span className="badge-success">Concluída</span>;
            default:
                return null;
        }
    };

    return (
        <main className="container-mobile min-h-screen pb-24 lg:pb-12">
            {/* Header */}
            <header className="pt-6 pb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center">
                            <span className="text-white text-xl font-bold">MA</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900">Mãos Amigas</h1>
                            <p className="text-sm text-neutral-500">Sistema de Avaliação</p>
                        </div>
                    </div>

                    {/* User badge - visible on larger screens */}
                    <div className="hidden sm:flex items-center gap-3 bg-white rounded-full pl-4 pr-2 py-2 shadow-soft">
                        <span className="text-sm text-neutral-600">
                            Olá, <span className="font-medium" suppressHydrationWarning>{user?.fullName?.split(' ')[0] || 'Avaliador'}</span>
                        </span>
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-brand-600" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content - responsive grid */}
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                {/* Left column - Action & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Quick Actions */}
                    <section>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNewEvaluation}
                            className="w-full btn-primary gap-3 text-lg py-4"
                        >
                            <Plus className="w-6 h-6" />
                            Nova Avaliação
                        </motion.button>
                    </section>

                    {/* Stats */}
                    <section className="grid grid-cols-3 gap-3">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card text-center"
                        >
                            <div className="w-10 h-10 mx-auto mb-2 bg-brand-100 rounded-full flex items-center justify-center">
                                <ClipboardList className="w-5 h-5 text-brand-600" />
                            </div>
                            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
                            <p className="text-xs text-neutral-500">Total</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card text-center"
                        >
                            <div className="w-10 h-10 mx-auto mb-2 bg-warning-100 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-warning-600" />
                            </div>
                            <p className="text-2xl font-bold text-neutral-900">{stats.pending}</p>
                            <p className="text-xs text-neutral-500">Pendentes</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="card text-center"
                        >
                            <div className="w-10 h-10 mx-auto mb-2 bg-success-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-success-600" />
                            </div>
                            <p className="text-2xl font-bold text-neutral-900">{stats.completed}</p>
                            <p className="text-xs text-neutral-500">Concluídas</p>
                        </motion.div>
                    </section>

                    {/* View all button - visible on desktop */}
                    <button
                        onClick={() => router.push('/avaliacao')}
                        className="hidden lg:flex w-full btn-secondary gap-2"
                    >
                        <ClipboardList className="w-5 h-5" />
                        Ver Todas as Avaliações
                    </button>
                </div>

                {/* Right column - Recent Evaluations */}
                <section className="lg:col-span-2 mt-8 lg:mt-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-neutral-900">Avaliações Recentes</h2>
                        <button
                            onClick={() => router.push('/avaliacao')}
                            className="text-sm text-brand-600 hover:text-brand-700 font-medium lg:hidden"
                        >
                            Ver todas
                        </button>
                    </div>

                    {recentEvaluations.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card text-center py-12 lg:py-16"
                        >
                            <ClipboardList className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                            <p className="text-neutral-500 font-medium">Nenhuma avaliação ainda</p>
                            <p className="text-sm text-neutral-400 mt-1">
                                Clique em &quot;Nova Avaliação&quot; para começar
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                            {recentEvaluations.map((evaluation, idx) => (
                                <motion.button
                                    key={evaluation.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ scale: 1.01 }}
                                    onClick={() => router.push(`/avaliacao/${evaluation.id}`)}
                                    className="card w-full text-left touch-feedback hover:shadow-medium transition-shadow"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold flex-shrink-0">
                                            {(evaluation.patient.preferredName || evaluation.patient.fullName || 'P')[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-medium text-neutral-900 truncate">
                                                    {evaluation.patient.fullName || 'Paciente não informado'}
                                                </p>
                                                {getStatusBadge(evaluation.status)}
                                            </div>
                                            <p className="text-sm text-neutral-500 mt-0.5">
                                                {formatRelativeDate(evaluation.updatedAt)}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-neutral-300 flex-shrink-0 hidden sm:block" />
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
