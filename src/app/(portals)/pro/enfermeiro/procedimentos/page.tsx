'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Stethoscope,
    Pill,
    Activity,
    Thermometer,
    Heart,
    Droplet,
    Plus,
    Search,
    Filter,
    Calendar,
    Clock,
    User,
    ChevronRight,
    CheckCircle,
    AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';
import { format, subDays, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Procedure {
    id: string;
    patientName: string;
    patientId: string;
    type: 'medication' | 'vitals' | 'wound_care' | 'catheter' | 'injection' | 'other';
    title: string;
    description: string;
    performedAt: Date;
    status: 'completed' | 'pending' | 'cancelled';
    values?: {
        bloodPressure?: string;
        heartRate?: number;
        temperature?: number;
        oxygenSaturation?: number;
        glucose?: number;
    };
}

// Mock data
const generateMockProcedures = (): Procedure[] => {
    const now = new Date();
    return [
        {
            id: '1',
            patientName: 'Maria Silva',
            patientId: 'p1',
            type: 'vitals',
            title: 'Aferição de Sinais Vitais',
            description: 'Aferição completa de sinais vitais de rotina',
            performedAt: subHours(now, 1),
            status: 'completed',
            values: {
                bloodPressure: '120/80',
                heartRate: 72,
                temperature: 36.5,
                oxygenSaturation: 98,
            },
        },
        {
            id: '2',
            patientName: 'Maria Silva',
            patientId: 'p1',
            type: 'medication',
            title: 'Administração de Medicamento',
            description: 'Losartana 50mg - Via oral',
            performedAt: subHours(now, 2),
            status: 'completed',
        },
        {
            id: '3',
            patientName: 'João Santos',
            patientId: 'p2',
            type: 'wound_care',
            title: 'Curativo',
            description: 'Troca de curativo em úlcera de pressão região sacral',
            performedAt: subHours(now, 3),
            status: 'completed',
        },
        {
            id: '4',
            patientName: 'Maria Silva',
            patientId: 'p1',
            type: 'vitals',
            title: 'Glicemia Capilar',
            description: 'Mensuração de glicemia capilar pré-refeição',
            performedAt: subHours(now, 4),
            status: 'completed',
            values: {
                glucose: 142,
            },
        },
        {
            id: '5',
            patientName: 'Ana Oliveira',
            patientId: 'p3',
            type: 'injection',
            title: 'Aplicação de Insulina',
            description: 'Insulina NPH 20 UI - SC região abdominal',
            performedAt: subDays(now, 1),
            status: 'completed',
        },
        {
            id: '6',
            patientName: 'Maria Silva',
            patientId: 'p1',
            type: 'medication',
            title: 'Administração de Medicamento',
            description: 'Metformina 850mg - Via oral',
            performedAt: new Date(),
            status: 'pending',
        },
    ];
};

const mockProcedures = generateMockProcedures();

const getTypeConfig = (type: Procedure['type']) => {
    switch (type) {
        case 'medication':
            return { label: 'Medicação', icon: Pill, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' };
        case 'vitals':
            return { label: 'Sinais Vitais', icon: Activity, color: 'text-brand-600', bg: 'bg-brand-100 dark:bg-brand-900/30' };
        case 'wound_care':
            return { label: 'Curativo', icon: Heart, color: 'text-error-600', bg: 'bg-error-100 dark:bg-error-900/30' };
        case 'catheter':
            return { label: 'Sonda', icon: Droplet, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' };
        case 'injection':
            return { label: 'Injeção', icon: Stethoscope, color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30' };
        default:
            return { label: 'Outro', icon: Stethoscope, color: 'text-neutral-600', bg: 'bg-neutral-100 dark:bg-neutral-800' };
    }
};

const getStatusConfig = (status: Procedure['status']) => {
    switch (status) {
        case 'completed':
            return { label: 'Realizado', icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-100 dark:bg-success-900/30' };
        case 'pending':
            return { label: 'Pendente', icon: Clock, color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30' };
        case 'cancelled':
            return { label: 'Cancelado', icon: AlertTriangle, color: 'text-error-600', bg: 'bg-error-100 dark:bg-error-900/30' };
    }
};

export default function NurseProceduresPage() {
    const { user } = useAuth();
    const [filter, setFilter] = useState<'all' | 'medication' | 'vitals' | 'wound_care'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);

    const filteredProcedures = mockProcedures.filter(proc => {
        const matchesFilter = filter === 'all' || proc.type === filter;
        const matchesSearch = proc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proc.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Stats
    const stats = {
        total: mockProcedures.filter(p => p.status === 'completed').length,
        pending: mockProcedures.filter(p => p.status === 'pending').length,
        today: mockProcedures.filter(p => {
            const today = new Date();
            return p.performedAt.toDateString() === today.toDateString();
        }).length,
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
                    <Stethoscope className="w-6 h-6 text-brand-500" />
                    Procedimentos
                </h1>
                <p className="text-sm mt-1" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                    Registro e acompanhamento de procedimentos técnicos
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
                    <p className="text-2xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>{stats.today}</p>
                    <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>Hoje</p>
                </div>
                <div className="card text-center py-4">
                    <p className="text-2xl font-bold text-warning-600">{stats.pending}</p>
                    <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>Pendentes</p>
                </div>
                <div className="card text-center py-4">
                    <p className="text-2xl font-bold text-success-600">{stats.total}</p>
                    <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>Realizados</p>
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
                        placeholder="Buscar procedimentos..."
                        className="input-base pl-10"
                    />
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {(['all', 'vitals', 'medication', 'wound_care'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                                filter === f
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-neutral-100 dark:bg-neutral-800'
                            )}
                            style={{ color: filter === f ? undefined : 'rgb(var(--color-text-secondary))' }}
                        >
                            {f === 'all' ? 'Todos' :
                                f === 'vitals' ? 'Sinais Vitais' :
                                    f === 'medication' ? 'Medicações' : 'Curativos'}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* New Procedure Button */}
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary py-3"
            >
                <Plus className="w-5 h-5 mr-2" />
                Registrar Procedimento
            </motion.button>

            {/* Procedures List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="space-y-3"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProcedures.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="card text-center py-12"
                        >
                            <Stethoscope className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
                            <p style={{ color: 'rgb(var(--color-text-secondary))' }}>Nenhum procedimento encontrado</p>
                        </motion.div>
                    ) : (
                        filteredProcedures.map((procedure, index) => {
                            const typeConfig = getTypeConfig(procedure.type);
                            const statusConfig = getStatusConfig(procedure.status);
                            const TypeIcon = typeConfig.icon;
                            const StatusIcon = statusConfig.icon;

                            return (
                                <motion.div
                                    key={procedure.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedProcedure(procedure)}
                                    className="card cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', typeConfig.bg)}>
                                                <TypeIcon className={cn('w-5 h-5', typeConfig.color)} />
                                            </div>
                                            <div>
                                                <h3 className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                                                    {procedure.title}
                                                </h3>
                                                <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                                    {procedure.patientName}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                                    </div>

                                    <p className="text-sm line-clamp-1 mb-3" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                        {procedure.description}
                                    </p>

                                    {/* Vitals Values */}
                                    {procedure.values && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {procedure.values.bloodPressure && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                    PA: {procedure.values.bloodPressure}
                                                </span>
                                            )}
                                            {procedure.values.heartRate && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                    FC: {procedure.values.heartRate} bpm
                                                </span>
                                            )}
                                            {procedure.values.temperature && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                    Temp: {procedure.values.temperature}°C
                                                </span>
                                            )}
                                            {procedure.values.oxygenSaturation && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                    SpO2: {procedure.values.oxygenSaturation}%
                                                </span>
                                            )}
                                            {procedure.values.glucose && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                    Glicemia: {procedure.values.glucose} mg/dL
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={cn('badge text-xs flex items-center gap-1', statusConfig.bg, statusConfig.color)}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                        <span className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                            {format(procedure.performedAt, "dd/MM 'às' HH:mm", { locale: ptBR })}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Procedure Detail Modal */}
            <AnimatePresence>
                {selectedProcedure && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setSelectedProcedure(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
                        >
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />

                            {(() => {
                                const typeConfig = getTypeConfig(selectedProcedure.type);
                                const TypeIcon = typeConfig.icon;

                                return (
                                    <>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', typeConfig.bg)}>
                                                <TypeIcon className={cn('w-6 h-6', typeConfig.color)} />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                                                    {selectedProcedure.title}
                                                </h2>
                                                <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                                    {selectedProcedure.patientName}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mb-4">
                                            <span className={cn('badge', typeConfig.bg, typeConfig.color)}>
                                                {typeConfig.label}
                                            </span>
                                            {(() => {
                                                const statusConfig = getStatusConfig(selectedProcedure.status);
                                                const StatusIcon = statusConfig.icon;
                                                return (
                                                    <span className={cn('badge flex items-center gap-1', statusConfig.bg, statusConfig.color)}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {statusConfig.label}
                                                    </span>
                                                );
                                            })()}
                                        </div>

                                        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl mb-4">
                                            <h3 className="text-sm font-medium mb-2" style={{ color: 'rgb(var(--color-text))' }}>
                                                Descrição
                                            </h3>
                                            <p style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                                {selectedProcedure.description}
                                            </p>
                                        </div>

                                        {selectedProcedure.values && (
                                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl mb-4">
                                                <h3 className="text-sm font-medium mb-3" style={{ color: 'rgb(var(--color-text))' }}>
                                                    Valores Registrados
                                                </h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {selectedProcedure.values.bloodPressure && (
                                                        <div className="flex items-center gap-2">
                                                            <Heart className="w-4 h-4 text-error-500" />
                                                            <span className="text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                                                PA: {selectedProcedure.values.bloodPressure} mmHg
                                                            </span>
                                                        </div>
                                                    )}
                                                    {selectedProcedure.values.heartRate && (
                                                        <div className="flex items-center gap-2">
                                                            <Activity className="w-4 h-4 text-brand-500" />
                                                            <span className="text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                                                FC: {selectedProcedure.values.heartRate} bpm
                                                            </span>
                                                        </div>
                                                    )}
                                                    {selectedProcedure.values.temperature && (
                                                        <div className="flex items-center gap-2">
                                                            <Thermometer className="w-4 h-4 text-warning-500" />
                                                            <span className="text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                                                Temp: {selectedProcedure.values.temperature}°C
                                                            </span>
                                                        </div>
                                                    )}
                                                    {selectedProcedure.values.oxygenSaturation && (
                                                        <div className="flex items-center gap-2">
                                                            <Droplet className="w-4 h-4 text-blue-500" />
                                                            <span className="text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                                                SpO2: {selectedProcedure.values.oxygenSaturation}%
                                                            </span>
                                                        </div>
                                                    )}
                                                    {selectedProcedure.values.glucose && (
                                                        <div className="flex items-center gap-2 col-span-2">
                                                            <Activity className="w-4 h-4 text-purple-500" />
                                                            <span className="text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                                                Glicemia: {selectedProcedure.values.glucose} mg/dL
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {format(selectedProcedure.performedAt, "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => setSelectedProcedure(null)}
                                            className="w-full btn-primary"
                                        >
                                            Fechar
                                        </button>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
