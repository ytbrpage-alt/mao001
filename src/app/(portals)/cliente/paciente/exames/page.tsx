'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    FileText,
    ArrowLeft,
    Plus,
    Calendar,
    Clock,
    Download,
    Eye,
    Upload,
    AlertCircle,
    CheckCircle,
    Search,
    Filter,
    Image as ImageIcon,
    File,
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils/cn';

interface Exam {
    id: string;
    name: string;
    type: 'blood' | 'imaging' | 'other';
    date: Date;
    status: 'pending' | 'completed' | 'scheduled';
    resultUrl?: string;
    laboratory?: string;
    doctor?: string;
    notes?: string;
    expiresAt?: Date;
}

const mockExams: Exam[] = [
    {
        id: '1',
        name: 'Hemograma Completo',
        type: 'blood',
        date: subDays(new Date(), 5),
        status: 'completed',
        resultUrl: '/exams/hemograma.pdf',
        laboratory: 'Laboratório São Lucas',
        doctor: 'Dr. João Oliveira',
    },
    {
        id: '2',
        name: 'Glicemia em Jejum',
        type: 'blood',
        date: subDays(new Date(), 5),
        status: 'completed',
        resultUrl: '/exams/glicemia.pdf',
        laboratory: 'Laboratório São Lucas',
        doctor: 'Dr. João Oliveira',
        notes: 'Resultado: 128 mg/dL - Dentro da meta',
    },
    {
        id: '3',
        name: 'Ressonância Magnética Crânio',
        type: 'imaging',
        date: subDays(new Date(), 30),
        status: 'completed',
        resultUrl: '/exams/rm-cranio.pdf',
        laboratory: 'Clínica de Imagem Central',
        doctor: 'Dra. Patricia Souza',
    },
    {
        id: '4',
        name: 'Função Renal',
        type: 'blood',
        date: addDays(new Date(), 7),
        status: 'scheduled',
        laboratory: 'Laboratório São Lucas',
        doctor: 'Dr. João Oliveira',
    },
    {
        id: '5',
        name: 'Eletrocardiograma',
        type: 'other',
        date: addDays(new Date(), 14),
        status: 'pending',
        doctor: 'Dr. Carlos Mendes',
        expiresAt: addDays(new Date(), 30),
    },
];

const getTypeConfig = (type: Exam['type']) => {
    switch (type) {
        case 'blood':
            return { label: 'Sangue', color: 'text-error-600', bg: 'bg-error-100 dark:bg-error-900/30' };
        case 'imaging':
            return { label: 'Imagem', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' };
        default:
            return { label: 'Outro', color: 'text-brand-600', bg: 'bg-brand-100 dark:bg-brand-900/30' };
    }
};

const getStatusConfig = (status: Exam['status']) => {
    switch (status) {
        case 'completed':
            return { label: 'Concluído', icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-100 dark:bg-success-900/30' };
        case 'scheduled':
            return { label: 'Agendado', icon: Calendar, color: 'text-brand-600', bg: 'bg-brand-100 dark:bg-brand-900/30' };
        case 'pending':
            return { label: 'Pendente', icon: AlertCircle, color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30' };
    }
};

export default function PatientExamsPage() {
    const [filter, setFilter] = useState<'all' | 'completed' | 'scheduled' | 'pending'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const filteredExams = mockExams.filter(exam => {
        const matchesFilter = filter === 'all' || exam.status === filter;
        const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: mockExams.length,
        completed: mockExams.filter(e => e.status === 'completed').length,
        pending: mockExams.filter(e => e.status === 'pending' || e.status === 'scheduled').length,
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/cliente/paciente" className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <ArrowLeft className="w-5 h-5" style={{ color: 'rgb(var(--color-text))' }} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                            Exames
                        </h1>
                        <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                            Resultados e laudos
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                >
                    <Upload className="w-5 h-5" />
                </button>
            </div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-3 gap-3"
            >
                <div className="card text-center py-4">
                    <p className="text-2xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>{stats.total}</p>
                    <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>Total</p>
                </div>
                <div className="card text-center py-4">
                    <p className="text-2xl font-bold text-success-600">{stats.completed}</p>
                    <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>Concluídos</p>
                </div>
                <div className="card text-center py-4">
                    <p className="text-2xl font-bold text-warning-600">{stats.pending}</p>
                    <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>Pendentes</p>
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
                        placeholder="Buscar exames..."
                        className="input-base pl-10"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {(['all', 'completed', 'scheduled', 'pending'] as const).map((f) => (
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
                                f === 'completed' ? 'Concluídos' :
                                    f === 'scheduled' ? 'Agendados' : 'Pendentes'}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Exams List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="space-y-3"
            >
                <AnimatePresence mode="popLayout">
                    {filteredExams.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="card text-center py-12"
                        >
                            <FileText className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
                            <p style={{ color: 'rgb(var(--color-text-secondary))' }}>Nenhum exame encontrado</p>
                        </motion.div>
                    ) : (
                        filteredExams.map((exam, index) => {
                            const typeConfig = getTypeConfig(exam.type);
                            const statusConfig = getStatusConfig(exam.status);
                            const StatusIcon = statusConfig.icon;

                            return (
                                <motion.div
                                    key={exam.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedExam(exam)}
                                    className="card cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', typeConfig.bg)}>
                                                {exam.type === 'imaging' ? (
                                                    <ImageIcon className={cn('w-5 h-5', typeConfig.color)} />
                                                ) : (
                                                    <File className={cn('w-5 h-5', typeConfig.color)} />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                                                    {exam.name}
                                                </h3>
                                                <span className={cn('badge text-xs', typeConfig.bg, typeConfig.color)}>
                                                    {typeConfig.label}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={cn('badge text-xs flex items-center gap-1', statusConfig.bg, statusConfig.color)}>
                                            <StatusIcon className="w-3 h-3" />
                                            {statusConfig.label}
                                        </span>
                                    </div>

                                    {exam.notes && (
                                        <p className="text-sm mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                            {exam.notes}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{format(exam.date, "dd/MM/yyyy", { locale: ptBR })}</span>
                                        </div>
                                        {exam.laboratory && (
                                            <span>{exam.laboratory}</span>
                                        )}
                                    </div>

                                    {exam.status === 'completed' && exam.resultUrl && (
                                        <div className="flex gap-2 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); }}
                                                className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Visualizar
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); }}
                                                className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1"
                                            >
                                                <Download className="w-4 h-4" />
                                                Baixar
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setShowUploadModal(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6"
                        >
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />

                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>
                                Enviar Exame
                            </h2>

                            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl p-8 text-center mb-4">
                                <Upload className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
                                <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                                    Arraste ou clique para enviar
                                </p>
                                <p className="text-sm mt-1" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                    PDF, JPG ou PNG (máx. 10MB)
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button className="flex-1 btn-primary">
                                    Enviar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedExam && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setSelectedExam(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />

                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>
                                {selectedExam.name}
                            </h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                                    <span style={{ color: 'rgb(var(--color-text-secondary))' }}>Status</span>
                                    <span className={cn('badge', getStatusConfig(selectedExam.status).bg, getStatusConfig(selectedExam.status).color)}>
                                        {getStatusConfig(selectedExam.status).label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                                    <span style={{ color: 'rgb(var(--color-text-secondary))' }}>Data</span>
                                    <span style={{ color: 'rgb(var(--color-text))' }}>
                                        {format(selectedExam.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </span>
                                </div>
                                {selectedExam.laboratory && (
                                    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                                        <span style={{ color: 'rgb(var(--color-text-secondary))' }}>Laboratório</span>
                                        <span style={{ color: 'rgb(var(--color-text))' }}>{selectedExam.laboratory}</span>
                                    </div>
                                )}
                                {selectedExam.doctor && (
                                    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                                        <span style={{ color: 'rgb(var(--color-text-secondary))' }}>Médico</span>
                                        <span style={{ color: 'rgb(var(--color-text))' }}>{selectedExam.doctor}</span>
                                    </div>
                                )}
                            </div>

                            {selectedExam.notes && (
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl mb-4">
                                    <p className="text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Observações</p>
                                    <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{selectedExam.notes}</p>
                                </div>
                            )}

                            <button
                                onClick={() => setSelectedExam(null)}
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
