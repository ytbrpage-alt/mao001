'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Calendar,
    ChevronRight,
    Filter,
    Download,
    Clock,
    User,
    CheckCircle,
    AlertCircle,
    Search,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';
import { format, subDays, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Report {
    id: string;
    date: Date;
    patientName: string;
    type: 'daily' | 'weekly' | 'incident';
    status: 'submitted' | 'pending' | 'approved';
    summary: string;
}

// Mock data
const generateMockReports = (): Report[] => {
    const today = new Date();
    return [
        {
            id: '1',
            date: today,
            patientName: 'Maria Silva',
            type: 'daily',
            status: 'submitted',
            summary: 'Paciente estável. Realizadas todas as atividades previstas.',
        },
        {
            id: '2',
            date: subDays(today, 1),
            patientName: 'Maria Silva',
            type: 'daily',
            status: 'approved',
            summary: 'Dia tranquilo. Paciente alimentou-se bem.',
        },
        {
            id: '3',
            date: subDays(today, 2),
            patientName: 'João Santos',
            type: 'weekly',
            status: 'approved',
            summary: 'Relatório semanal com evolução positiva.',
        },
        {
            id: '4',
            date: subDays(today, 3),
            patientName: 'Maria Silva',
            type: 'incident',
            status: 'pending',
            summary: 'Paciente apresentou queda de pressão às 15h.',
        },
        {
            id: '5',
            date: subDays(today, 5),
            patientName: 'Ana Oliveira',
            type: 'daily',
            status: 'approved',
            summary: 'Acompanhamento regular sem intercorrências.',
        },
    ];
};

const mockReports = generateMockReports();

const getTypeConfig = (type: Report['type']) => {
    switch (type) {
        case 'daily':
            return { label: 'Diário', color: 'text-brand-600', bg: 'bg-brand-100' };
        case 'weekly':
            return { label: 'Semanal', color: 'text-purple-600', bg: 'bg-purple-100' };
        case 'incident':
            return { label: 'Ocorrência', color: 'text-warning-600', bg: 'bg-warning-100' };
    }
};

const getStatusConfig = (status: Report['status']) => {
    switch (status) {
        case 'submitted':
            return { label: 'Enviado', icon: Clock, color: 'text-brand-600', bg: 'bg-brand-100' };
        case 'pending':
            return { label: 'Pendente', icon: AlertCircle, color: 'text-warning-600', bg: 'bg-warning-100' };
        case 'approved':
            return { label: 'Aprovado', icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-100' };
    }
};

export default function CaregiverReportsPage() {
    const { user } = useAuth();
    const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'incident'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const filteredReports = mockReports.filter(report => {
        const matchesFilter = filter === 'all' || report.type === filter;
        const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.summary.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Stats
    const stats = {
        total: mockReports.length,
        pending: mockReports.filter(r => r.status === 'pending').length,
        thisWeek: mockReports.filter(r =>
            isWithinInterval(r.date, { start: subDays(new Date(), 7), end: new Date() })
        ).length,
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-brand-500" />
                    Meus Relatórios
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Acompanhe seus relatórios e evoluções
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-3"
            >
                <div className="card text-center py-4">
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.total}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Total</p>
                </div>
                <div className="card text-center py-4">
                    <p className="text-2xl font-bold text-warning-600">{stats.pending}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Pendentes</p>
                </div>
                <div className="card text-center py-4">
                    <p className="text-2xl font-bold text-brand-600">{stats.thisWeek}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Esta semana</p>
                </div>
            </motion.div>

            {/* Search & Filter */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-3"
            >
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar relatórios..."
                        className="input-base pl-10"
                    />
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {(['all', 'daily', 'weekly', 'incident'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                                filter === f
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                            )}
                        >
                            {f === 'all' ? 'Todos' :
                                f === 'daily' ? 'Diários' :
                                    f === 'weekly' ? 'Semanais' : 'Ocorrências'}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* New Report Button */}
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary py-3"
            >
                <FileText className="w-5 h-5 mr-2" />
                Novo Relatório
            </motion.button>

            {/* Reports List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="space-y-3"
            >
                <AnimatePresence mode="popLayout">
                    {filteredReports.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="card text-center py-12"
                        >
                            <FileText className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
                            <p className="text-neutral-500 dark:text-neutral-400">Nenhum relatório encontrado</p>
                        </motion.div>
                    ) : (
                        filteredReports.map((report, index) => {
                            const typeConfig = getTypeConfig(report.type);
                            const statusConfig = getStatusConfig(report.status);
                            const StatusIcon = statusConfig.icon;

                            return (
                                <motion.div
                                    key={report.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedReport(report)}
                                    className="card cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                                                <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                                                    {report.patientName}
                                                </h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {format(report.date, "dd 'de' MMMM", { locale: ptBR })}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                                    </div>

                                    <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 mb-3">
                                        {report.summary}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <span className={cn('badge text-xs', typeConfig.bg, typeConfig.color)}>
                                            {typeConfig.label}
                                        </span>
                                        <span className={cn('badge text-xs flex items-center gap-1', statusConfig.bg, statusConfig.color)}>
                                            <StatusIcon className="w-3 h-3" />
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Report Detail Modal */}
            <AnimatePresence>
                {selectedReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setSelectedReport(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                                    <User className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                        {selectedReport.patientName}
                                    </h2>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        {format(selectedReport.date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <span className={cn('badge', getTypeConfig(selectedReport.type).bg, getTypeConfig(selectedReport.type).color)}>
                                    {getTypeConfig(selectedReport.type).label}
                                </span>
                                <span className={cn('badge flex items-center gap-1', getStatusConfig(selectedReport.status).bg, getStatusConfig(selectedReport.status).color)}>
                                    {(() => { const Icon = getStatusConfig(selectedReport.status).icon; return <Icon className="w-3 h-3" />; })()}
                                    {getStatusConfig(selectedReport.status).label}
                                </span>
                            </div>

                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl mb-4">
                                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">Resumo</h3>
                                <p className="text-neutral-600 dark:text-neutral-300">
                                    {selectedReport.summary}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Baixar PDF
                                </button>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="flex-1 btn-primary"
                                >
                                    Fechar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
