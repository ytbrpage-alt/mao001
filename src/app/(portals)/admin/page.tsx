'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Users,
    ClipboardList,
    UserCheck,
    TrendingUp,
    Calendar,
    Activity,
    ChevronRight,
    Plus,
    BarChart3,
    Clock,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';

// Dados simulados para o dashboard
const mockStats = {
    totalUsers: 156,
    activeUsers: 128,
    totalEvaluations: 342,
    pendingEvaluations: 18,
    activeProfessionals: 45,
    totalPatients: 89,
};

const mockRecentActivity = [
    { id: '1', type: 'evaluation', message: 'Nova avaliação iniciada por Carlos Silva', time: '5 min atrás', icon: ClipboardList },
    { id: '2', type: 'user', message: 'Usuário Maria Santos ativado', time: '15 min atrás', icon: UserCheck },
    { id: '3', type: 'alert', message: 'Avaliação #342 pendente de revisão', time: '1 hora atrás', icon: AlertCircle },
    { id: '4', type: 'complete', message: 'Avaliação #339 concluída', time: '2 horas atrás', icon: CheckCircle },
];

const mockPendingTasks = [
    { id: '1', title: 'Aprovar cadastro de enfermeiro', priority: 'high' },
    { id: '2', title: 'Revisar avaliação #340', priority: 'medium' },
    { id: '3', title: 'Atualizar tabela de preços', priority: 'low' },
];

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>
                        Dashboard Administrativo
                    </h1>
                    <p style={{ color: 'rgb(var(--color-text-secondary))' }}>
                        Bem-vindo, {user?.fullName?.split(' ')[0] || 'Admin'}
                    </p>
                </div>

                {/* Period Selector */}
                <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 rounded-xl p-1 shadow-soft">
                    {(['today', 'week', 'month'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={cn(
                                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                period === p
                                    ? 'bg-brand-500 text-white'
                                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                            )}
                            style={{ color: period === p ? undefined : 'rgb(var(--color-text-secondary))' }}
                        >
                            {p === 'today' ? 'Hoje' : p === 'week' ? 'Semana' : 'Mês'}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {/* Total Usuários */}
                <motion.div variants={itemVariants} className="card">
                    <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                            <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                        </div>
                        <span className="text-xs font-medium text-success-600 bg-success-100 dark:bg-success-900/30 px-2 py-1 rounded-full">
                            +12%
                        </span>
                    </div>
                    <p className="text-3xl font-bold mt-3" style={{ color: 'rgb(var(--color-text))' }}>
                        {mockStats.totalUsers}
                    </p>
                    <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                        Usuários cadastrados
                    </p>
                </motion.div>

                {/* Avaliações */}
                <motion.div variants={itemVariants} className="card">
                    <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <ClipboardList className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-xs font-medium text-success-600 bg-success-100 dark:bg-success-900/30 px-2 py-1 rounded-full">
                            +8%
                        </span>
                    </div>
                    <p className="text-3xl font-bold mt-3" style={{ color: 'rgb(var(--color-text))' }}>
                        {mockStats.totalEvaluations}
                    </p>
                    <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                        Total de avaliações
                    </p>
                </motion.div>

                {/* Profissionais Ativos */}
                <motion.div variants={itemVariants} className="card">
                    <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-success-600 dark:text-success-400" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold mt-3" style={{ color: 'rgb(var(--color-text))' }}>
                        {mockStats.activeProfessionals}
                    </p>
                    <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                        Profissionais ativos
                    </p>
                </motion.div>

                {/* Pacientes */}
                <motion.div variants={itemVariants} className="card">
                    <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-warning-600 dark:text-warning-400" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold mt-3" style={{ color: 'rgb(var(--color-text))' }}>
                        {mockStats.totalPatients}
                    </p>
                    <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                        Pacientes ativos
                    </p>
                </motion.div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick Actions + Pending Tasks */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 space-y-6"
                >
                    {/* Quick Actions */}
                    <div className="card">
                        <h2 className="font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>
                            Ações Rápidas
                        </h2>
                        <div className="space-y-2">
                            <Link
                                href="/usuarios"
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                    </div>
                                    <span style={{ color: 'rgb(var(--color-text))' }}>Novo Usuário</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
                            </Link>

                            <Link
                                href="/avaliacao"
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <ClipboardList className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span style={{ color: 'rgb(var(--color-text))' }}>Ver Avaliações</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
                            </Link>

                            <button
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                                        <BarChart3 className="w-5 h-5 text-success-600 dark:text-success-400" />
                                    </div>
                                    <span style={{ color: 'rgb(var(--color-text))' }}>Gerar Relatório</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
                            </button>
                        </div>
                    </div>

                    {/* Pending Tasks */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                                Tarefas Pendentes
                            </h2>
                            <span className="text-xs font-medium bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 px-2 py-1 rounded-full">
                                {mockPendingTasks.length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {mockPendingTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
                                >
                                    <div className={cn(
                                        'w-2 h-2 rounded-full',
                                        task.priority === 'high' ? 'bg-error-500' :
                                            task.priority === 'medium' ? 'bg-warning-500' : 'bg-neutral-400'
                                    )} />
                                    <span className="flex-1 text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                        {task.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 card"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                            Atividade Recente
                        </h2>
                        <button className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
                            Ver tudo
                        </button>
                    </div>

                    <div className="space-y-4">
                        {mockRecentActivity.map((activity, index) => {
                            const Icon = activity.icon;
                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-700 last:border-0 last:pb-0"
                                >
                                    <div className={cn(
                                        'w-10 h-10 rounded-xl flex items-center justify-center',
                                        activity.type === 'evaluation' ? 'bg-purple-100 dark:bg-purple-900/30' :
                                            activity.type === 'user' ? 'bg-brand-100 dark:bg-brand-900/30' :
                                                activity.type === 'alert' ? 'bg-warning-100 dark:bg-warning-900/30' :
                                                    'bg-success-100 dark:bg-success-900/30'
                                    )}>
                                        <Icon className={cn(
                                            'w-5 h-5',
                                            activity.type === 'evaluation' ? 'text-purple-600 dark:text-purple-400' :
                                                activity.type === 'user' ? 'text-brand-600 dark:text-brand-400' :
                                                    activity.type === 'alert' ? 'text-warning-600 dark:text-warning-400' :
                                                        'text-success-600 dark:text-success-400'
                                        )} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                            {activity.message}
                                        </p>
                                        <p className="text-xs mt-1" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
