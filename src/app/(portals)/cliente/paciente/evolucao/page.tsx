'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Activity,
    ArrowLeft,
    Plus,
    Calendar,
    Clock,
    User,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Minus,
    Filter,
    Search,
    Heart,
    Thermometer,
    Droplet,
} from 'lucide-react';
import { format, subDays, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils/cn';

interface EvolutionRecord {
    id: string;
    date: Date;
    type: 'daily' | 'vitals' | 'incident' | 'observation';
    title: string;
    description: string;
    professionalName: string;
    professionalRole: string;
    vitals?: {
        bloodPressure?: string;
        heartRate?: number;
        temperature?: number;
        oxygenSaturation?: number;
        glucose?: number;
        weight?: number;
    };
    trend?: 'up' | 'down' | 'stable';
}

const mockEvolutionRecords: EvolutionRecord[] = [
    {
        id: '1',
        date: subHours(new Date(), 2),
        type: 'vitals',
        title: 'Aferição de Sinais Vitais',
        description: 'Paciente estável, sinais vitais dentro dos parâmetros esperados.',
        professionalName: 'Ana Paula Costa',
        professionalRole: 'Cuidadora',
        vitals: {
            bloodPressure: '120/80',
            heartRate: 72,
            temperature: 36.5,
            oxygenSaturation: 98,
        },
        trend: 'stable',
    },
    {
        id: '2',
        date: subHours(new Date(), 6),
        type: 'daily',
        title: 'Relatório Diário - Manhã',
        description: 'Paciente acordou bem disposta. Realizou todas as refeições. Caminhada assistida de 15 minutos no corredor.',
        professionalName: 'Ana Paula Costa',
        professionalRole: 'Cuidadora',
        trend: 'up',
    },
    {
        id: '3',
        date: subDays(new Date(), 1),
        type: 'observation',
        title: 'Observação Comportamental',
        description: 'Paciente apresentou leve confusão mental no período da tarde, com melhora após descanso.',
        professionalName: 'Maria Santos',
        professionalRole: 'Enfermeira',
        trend: 'down',
    },
    {
        id: '4',
        date: subDays(new Date(), 2),
        type: 'vitals',
        title: 'Aferição de Glicemia',
        description: 'Glicemia capilar em jejum. Valor dentro da meta terapêutica.',
        professionalName: 'Maria Santos',
        professionalRole: 'Enfermeira',
        vitals: {
            glucose: 128,
        },
        trend: 'stable',
    },
    {
        id: '5',
        date: subDays(new Date(), 3),
        type: 'incident',
        title: 'Ocorrência Registrada',
        description: 'Paciente apresentou queda de pressão às 15h (100/60). Permaneceu em repouso, estabilizou em 30 minutos.',
        professionalName: 'Ana Paula Costa',
        professionalRole: 'Cuidadora',
        trend: 'down',
    },
];

const getTypeConfig = (type: EvolutionRecord['type']) => {
    switch (type) {
        case 'daily':
            return { label: 'Diário', color: 'text-brand-600', bg: 'bg-brand-100 dark:bg-brand-900/30', icon: Activity };
        case 'vitals':
            return { label: 'Sinais Vitais', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: Heart };
        case 'incident':
            return { label: 'Ocorrência', color: 'text-error-600', bg: 'bg-error-100 dark:bg-error-900/30', icon: Activity };
        case 'observation':
            return { label: 'Observação', color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30', icon: Activity };
        default:
            return { label: 'Outro', color: 'text-neutral-600', bg: 'bg-neutral-100 dark:bg-neutral-800', icon: Activity };
    }
};

const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
        case 'up':
            return { icon: TrendingUp, color: 'text-success-500' };
        case 'down':
            return { icon: TrendingDown, color: 'text-error-500' };
        default:
            return { icon: Minus, color: 'text-neutral-400' };
    }
};

export default function PatientEvolutionPage() {
    const [filter, setFilter] = useState<'all' | 'daily' | 'vitals' | 'incident'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<EvolutionRecord | null>(null);

    const filteredRecords = mockEvolutionRecords.filter(record => {
        const matchesFilter = filter === 'all' || record.type === filter;
        const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/cliente/paciente" className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <ArrowLeft className="w-5 h-5" style={{ color: 'rgb(var(--color-text))' }} />
                </Link>
                <div>
                    <h1 className="text-xl font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                        Evolução do Paciente
                    </h1>
                    <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                        Acompanhamento e registros
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-3 gap-3"
            >
                <div className="card text-center py-4">
                    <p className="text-2xl font-bold text-brand-600">{mockEvolutionRecords.length}</p>
                    <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>Esta semana</p>
                </div>
                <div className="card text-center py-4">
                    <p className="text-2xl font-bold text-success-600">3</p>
                    <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>Tendência ↑</p>
                </div>
                <div className="card text-center py-4">
                    <p className="text-2xl font-bold text-purple-600">2</p>
                    <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>Sinais vitais</p>
                </div>
            </motion.div>

            {/* Search & Filter */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar registros..."
                        className="input-base pl-10"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {(['all', 'daily', 'vitals', 'incident'] as const).map((f) => (
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
                                f === 'daily' ? 'Diários' :
                                    f === 'vitals' ? 'Sinais Vitais' : 'Ocorrências'}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="space-y-4"
            >
                <AnimatePresence mode="popLayout">
                    {filteredRecords.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="card text-center py-12"
                        >
                            <Activity className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
                            <p style={{ color: 'rgb(var(--color-text-secondary))' }}>Nenhum registro encontrado</p>
                        </motion.div>
                    ) : (
                        filteredRecords.map((record, index) => {
                            const typeConfig = getTypeConfig(record.type);
                            const trendConfig = getTrendIcon(record.trend);
                            const TypeIcon = typeConfig.icon;
                            const TrendIcon = trendConfig.icon;

                            return (
                                <motion.div
                                    key={record.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedRecord(record)}
                                    className="card cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', typeConfig.bg)}>
                                            <TypeIcon className={cn('w-5 h-5', typeConfig.color)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                                                        {record.title}
                                                    </h3>
                                                    <span className={cn('badge text-xs mt-1', typeConfig.bg, typeConfig.color)}>
                                                        {typeConfig.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <TrendIcon className={cn('w-4 h-4', trendConfig.color)} />
                                                </div>
                                            </div>

                                            <p className="text-sm mt-2 line-clamp-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                                {record.description}
                                            </p>

                                            {record.vitals && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {record.vitals.bloodPressure && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                            PA: {record.vitals.bloodPressure}
                                                        </span>
                                                    )}
                                                    {record.vitals.heartRate && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                            FC: {record.vitals.heartRate}
                                                        </span>
                                                    )}
                                                    {record.vitals.glucose && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                            Glicemia: {record.vitals.glucose}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700">
                                                <div className="flex items-center gap-2 text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                                    <User className="w-3 h-3" />
                                                    <span>{record.professionalName}</span>
                                                </div>
                                                <span className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                                    {format(record.date, "dd/MM 'às' HH:mm", { locale: ptBR })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedRecord && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setSelectedRecord(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
                        >
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />

                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', getTypeConfig(selectedRecord.type).bg)}>
                                    {(() => { const Icon = getTypeConfig(selectedRecord.type).icon; return <Icon className={cn('w-6 h-6', getTypeConfig(selectedRecord.type).color)} />; })()}
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                                        {selectedRecord.title}
                                    </h2>
                                    <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                        {format(selectedRecord.date, "EEEE, dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl mb-4">
                                <p style={{ color: 'rgb(var(--color-text))' }}>{selectedRecord.description}</p>
                            </div>

                            {selectedRecord.vitals && Object.keys(selectedRecord.vitals).length > 0 && (
                                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl mb-4">
                                    <h3 className="text-sm font-medium mb-3" style={{ color: 'rgb(var(--color-text))' }}>
                                        Sinais Vitais
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedRecord.vitals.bloodPressure && (
                                            <div className="flex items-center gap-2">
                                                <Heart className="w-4 h-4 text-error-500" />
                                                <span className="text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                                    PA: {selectedRecord.vitals.bloodPressure}
                                                </span>
                                            </div>
                                        )}
                                        {selectedRecord.vitals.heartRate && (
                                            <div className="flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-brand-500" />
                                                <span className="text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                                    FC: {selectedRecord.vitals.heartRate} bpm
                                                </span>
                                            </div>
                                        )}
                                        {selectedRecord.vitals.temperature && (
                                            <div className="flex items-center gap-2">
                                                <Thermometer className="w-4 h-4 text-warning-500" />
                                                <span className="text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                                    Temp: {selectedRecord.vitals.temperature}°C
                                                </span>
                                            </div>
                                        )}
                                        {selectedRecord.vitals.oxygenSaturation && (
                                            <div className="flex items-center gap-2">
                                                <Droplet className="w-4 h-4 text-blue-500" />
                                                <span className="text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                                    SpO2: {selectedRecord.vitals.oxygenSaturation}%
                                                </span>
                                            </div>
                                        )}
                                        {selectedRecord.vitals.glucose && (
                                            <div className="flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-purple-500" />
                                                <span className="text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                                    Glicemia: {selectedRecord.vitals.glucose} mg/dL
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl mb-4">
                                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                                    <User className="w-5 h-5 text-brand-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                                        {selectedRecord.professionalName}
                                    </p>
                                    <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                        {selectedRecord.professionalRole}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedRecord(null)}
                                className="w-full btn-primary"
                            >
                                Fechar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
