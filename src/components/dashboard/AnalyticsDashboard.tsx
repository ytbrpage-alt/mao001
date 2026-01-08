// src/components/dashboard/AnalyticsDashboard.tsx
// Main analytics dashboard component

'use client';

import { useState, useMemo } from 'react';
import { StatCard } from './StatCard';
import { BarChart, DonutChart, ProgressBar, MiniList } from './SimpleChart';
import {
    calculateMetrics,
    formatMonth,
    formatProfessional,
    type MetricFilter,
} from '@/lib/analytics/metricsService';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { formatDate, formatRelativeDate } from '@/lib/utils/formatters';
import {
    FileText,
    CheckCircle,
    Clock,
    Edit3,
    TrendingUp,
    Users,
    Calendar,
    Download,
    Filter,
    RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DateRangeOption {
    label: string;
    value: string;
    startDate: Date;
    endDate: Date;
}

function getDateRangeOptions(): DateRangeOption[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return [
        {
            label: 'Últimos 7 dias',
            value: '7d',
            startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
            endDate: now,
        },
        {
            label: 'Últimos 30 dias',
            value: '30d',
            startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
            endDate: now,
        },
        {
            label: 'Este mês',
            value: 'month',
            startDate: new Date(now.getFullYear(), now.getMonth(), 1),
            endDate: now,
        },
        {
            label: 'Este ano',
            value: 'year',
            startDate: new Date(now.getFullYear(), 0, 1),
            endDate: now,
        },
        {
            label: 'Todo o período',
            value: 'all',
            startDate: new Date(2000, 0, 1),
            endDate: now,
        },
    ];
}

export function AnalyticsDashboard() {
    const { getAllEvaluations } = useEvaluationStore();
    const evaluations = getAllEvaluations();
    const [dateRange, setDateRange] = useState('30d');
    const [isLoading, setIsLoading] = useState(false);

    const dateRangeOptions = useMemo(() => getDateRangeOptions(), []);
    const selectedRange = dateRangeOptions.find((o) => o.value === dateRange);

    const filter: MetricFilter = useMemo(() => ({
        startDate: selectedRange?.startDate,
        endDate: selectedRange?.endDate,
    }), [selectedRange]);

    const metrics = useMemo(() => {
        return calculateMetrics(evaluations, filter);
    }, [evaluations, filter]);

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
    };

    const statusChartData = [
        { label: 'Concluídas', value: metrics.completed, color: '#16A34A' },
        { label: 'Pendentes', value: metrics.pending, color: '#EAB308' },
        { label: 'Rascunho', value: metrics.draft, color: '#9CA3AF' },
    ];

    const professionalChartData = metrics.byProfessional.slice(0, 5).map((item, i) => ({
        label: formatProfessional(item.professional),
        value: item.count,
        color: ['#1E8AAD', '#16A34A', '#EAB308', '#EF4444', '#8B5CF6'][i] || '#9CA3AF',
    }));

    const monthChartData = metrics.byMonth.slice(-6).map((item) => ({
        label: formatMonth(item.month),
        value: item.count,
        color: 'bg-brand-500',
    }));

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
                    <p className="text-neutral-500 text-sm mt-1">
                        Visão geral das avaliações
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        {dateRangeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        <RefreshCw className={cn('w-5 h-5', isLoading && 'animate-spin')} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total de Avaliações"
                    value={metrics.total}
                    subtitle={selectedRange?.label}
                    icon={<FileText className="w-5 h-5" />}
                    color="brand"
                />
                <StatCard
                    title="Concluídas"
                    value={metrics.completed}
                    subtitle={`${metrics.completionRate.toFixed(0)}% do total`}
                    icon={<CheckCircle className="w-5 h-5" />}
                    color="success"
                />
                <StatCard
                    title="Pendentes"
                    value={metrics.pending}
                    subtitle="Aguardando revisão"
                    icon={<Clock className="w-5 h-5" />}
                    color="warning"
                />
                <StatCard
                    title="Rascunhos"
                    value={metrics.draft}
                    subtitle="Em andamento"
                    icon={<Edit3 className="w-5 h-5" />}
                    color="neutral"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Distribution */}
                <div className="bg-white rounded-xl border border-neutral-200 p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4">Status das Avaliações</h3>
                    <div className="flex items-center justify-center py-4">
                        <DonutChart data={statusChartData} size={140} />
                    </div>
                    <MiniList
                        items={statusChartData.map((d) => ({
                            label: d.label,
                            value: d.value,
                            color: d.color,
                        }))}
                        className="mt-4"
                    />
                </div>

                {/* Monthly Trend */}
                <div className="bg-white rounded-xl border border-neutral-200 p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4">Avaliações por Mês</h3>
                    <div className="py-4">
                        <BarChart data={monthChartData} maxHeight={120} />
                    </div>
                </div>

                {/* Professionals */}
                <div className="bg-white rounded-xl border border-neutral-200 p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4">Profissionais Indicados</h3>
                    {professionalChartData.length > 0 ? (
                        <MiniList
                            items={professionalChartData.map((d) => ({
                                label: d.label,
                                value: d.value,
                                color: d.color,
                            }))}
                        />
                    ) : (
                        <p className="text-neutral-500 text-sm text-center py-8">
                            Sem dados disponíveis
                        </p>
                    )}
                </div>
            </div>

            {/* Scores and Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Average Scores */}
                <div className="bg-white rounded-xl border border-neutral-200 p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4">Pontuações Médias</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-neutral-700">ABEMID</span>
                                <span className="font-medium">{metrics.averageAbemidScore.toFixed(1)}</span>
                            </div>
                            <ProgressBar
                                value={metrics.averageAbemidScore}
                                max={30}
                                showValue={false}
                                color="bg-brand-500"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-neutral-700">KATZ</span>
                                <span className="font-medium">{metrics.averageKatzScore.toFixed(1)}</span>
                            </div>
                            <ProgressBar
                                value={metrics.averageKatzScore}
                                max={6}
                                showValue={false}
                                color="bg-success-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Recent Evaluations */}
                <div className="bg-white rounded-xl border border-neutral-200 p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4">Avaliações Recentes</h3>
                    {metrics.recentEvaluations.length > 0 ? (
                        <ul className="space-y-3">
                            {metrics.recentEvaluations.map((evalItem) => (
                                <li
                                    key={evalItem.id}
                                    className="flex items-center justify-between text-sm py-2 border-b border-neutral-100 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-neutral-900">{evalItem.patientName}</p>
                                        <p className="text-neutral-500 text-xs">
                                            {formatRelativeDate(evalItem.date)}
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            'px-2 py-1 rounded-full text-xs font-medium',
                                            evalItem.status === 'completed' && 'bg-success-100 text-success-800',
                                            evalItem.status === 'pending' && 'bg-warning-100 text-warning-800',
                                            evalItem.status === 'draft' && 'bg-neutral-100 text-neutral-800'
                                        )}
                                    >
                                        {evalItem.status === 'completed' ? 'Concluída' :
                                            evalItem.status === 'pending' ? 'Pendente' : 'Rascunho'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-neutral-500 text-sm text-center py-8">
                            Nenhuma avaliação encontrada
                        </p>
                    )}
                </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neutral-900">Taxa de Conclusão</h3>
                    <span className="text-2xl font-bold text-brand-600">
                        {metrics.completionRate.toFixed(0)}%
                    </span>
                </div>
                <ProgressBar
                    value={metrics.completionRate}
                    max={100}
                    showValue={false}
                    color="bg-brand-500"
                />
                <p className="text-neutral-500 text-sm mt-2">
                    {metrics.completed} de {metrics.total} avaliações completadas
                </p>
            </div>
        </div>
    );
}
