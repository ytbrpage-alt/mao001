'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Plus,
    Search,
    Filter,
    Calendar,
    Clock,
    User,
    Heart,
    Thermometer,
    Droplets,
    Activity,
    ChevronRight,
    X,
    Check,
    Cloud,
    CloudOff,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';

// Tipos
interface Evolution {
    id: string;
    patientId: string;
    patientName: string;
    date: Date;
    type: 'routine' | 'emergency' | 'medication' | 'procedure';
    status: 'synced' | 'pending' | 'draft';
    vitalSigns: {
        bloodPressure?: string;
        heartRate?: number;
        temperature?: number;
        oxygenSaturation?: number;
        glucose?: number;
    };
    observations: string;
    medications?: string[];
    procedures?: string[];
    createdBy: string;
}

// Mock data
const mockEvolutions: Evolution[] = [
    {
        id: '1',
        patientId: '1',
        patientName: 'Maria Silva',
        date: new Date(),
        type: 'routine',
        status: 'synced',
        vitalSigns: {
            bloodPressure: '120/80',
            heartRate: 72,
            temperature: 36.5,
            oxygenSaturation: 97,
            glucose: 110
        },
        observations: 'Paciente estável, sem queixas. Aceitou bem alimentação e medicação.',
        medications: ['Losartana 50mg', 'AAS 100mg'],
        createdBy: 'João Cuidador'
    },
    {
        id: '2',
        patientId: '2',
        patientName: 'João Santos',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'medication',
        status: 'synced',
        vitalSigns: {
            bloodPressure: '140/90',
            heartRate: 85,
            oxygenSaturation: 94
        },
        observations: 'Administrada medicação conforme prescrição. Paciente relatou leve cefaléia.',
        medications: ['Captopril 25mg', 'Omeprazol 20mg'],
        createdBy: 'João Cuidador'
    },
    {
        id: '3',
        patientId: '3',
        patientName: 'Ana Oliveira',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        type: 'emergency',
        status: 'synced',
        vitalSigns: {
            bloodPressure: '100/60',
            heartRate: 110,
            temperature: 38.2,
            oxygenSaturation: 88
        },
        observations: 'Paciente apresentou dispneia intensa. Aumentado O2 para 4L/min. Família notificada.',
        procedures: ['Oxigenoterapia 4L/min', 'Monitorização contínua'],
        createdBy: 'João Cuidador'
    },
    {
        id: '4',
        patientId: '1',
        patientName: 'Maria Silva',
        date: new Date(Date.now() - 48 * 60 * 60 * 1000),
        type: 'procedure',
        status: 'pending',
        vitalSigns: {
            bloodPressure: '125/82',
            heartRate: 75
        },
        observations: 'Realizado curativo em MID. Ferida em bom aspecto de cicatrização.',
        procedures: ['Curativo MID', 'Troca de cobertura'],
        createdBy: 'João Cuidador'
    },
];

// Helpers
const getTypeConfig = (type: Evolution['type']) => {
    switch (type) {
        case 'routine':
            return { label: 'Rotina', color: 'bg-blue-100 text-blue-700' };
        case 'emergency':
            return { label: 'Urgência', color: 'bg-error-100 text-error-700' };
        case 'medication':
            return { label: 'Medicação', color: 'bg-purple-100 text-purple-700' };
        case 'procedure':
            return { label: 'Procedimento', color: 'bg-green-100 text-green-700' };
    }
};

const formatDateTime = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default function EvolucoesPage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<Evolution['type'] | 'all'>('all');
    const [selectedEvolution, setSelectedEvolution] = useState<Evolution | null>(null);
    const [showNewEvolutionModal, setShowNewEvolutionModal] = useState(false);

    const filteredEvolutions = mockEvolutions.filter(evolution => {
        const matchesSearch = evolution.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            evolution.observations.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || evolution.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-4 pb-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-brand-500" />
                        Evoluções
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {mockEvolutions.length} registros
                    </p>
                </div>
                <button
                    onClick={() => setShowNewEvolutionModal(true)}
                    className="btn-primary py-2 px-4"
                >
                    <Plus className="w-5 h-5 mr-1" />
                    Nova
                </button>
            </motion.div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                    type="text"
                    placeholder="Buscar evolução..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-primary pl-10"
                />
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 overflow-x-auto pb-2"
            >
                {[
                    { value: 'all', label: 'Todas' },
                    { value: 'routine', label: 'Rotina' },
                    { value: 'medication', label: 'Medicação' },
                    { value: 'procedure', label: 'Procedimento' },
                    { value: 'emergency', label: 'Urgência' },
                ].map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setTypeFilter(filter.value as typeof typeFilter)}
                        className={cn(
                            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                            typeFilter === filter.value
                                ? 'bg-brand-500 text-white'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </motion.div>

            {/* Evolutions List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredEvolutions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="card text-center py-8"
                        >
                            <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                            <p className="text-neutral-500">Nenhuma evolução encontrada</p>
                        </motion.div>
                    ) : (
                        filteredEvolutions.map((evolution, index) => {
                            const typeConfig = getTypeConfig(evolution.type);

                            return (
                                <motion.div
                                    key={evolution.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedEvolution(evolution)}
                                    className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                                                <User className="w-5 h-5 text-brand-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-neutral-900">
                                                    {evolution.patientName}
                                                </h3>
                                                <p className="text-sm text-neutral-500 flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatDateTime(evolution.date)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                'px-2 py-1 rounded-full text-xs font-medium',
                                                typeConfig.color
                                            )}>
                                                {typeConfig.label}
                                            </span>
                                            {evolution.status === 'synced' ? (
                                                <Cloud className="w-4 h-4 text-success-500" />
                                            ) : (
                                                <CloudOff className="w-4 h-4 text-warning-500" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Vital Signs Summary */}
                                    <div className="flex gap-3 flex-wrap text-sm mb-3">
                                        {evolution.vitalSigns.bloodPressure && (
                                            <span className="flex items-center gap-1 text-neutral-600">
                                                <Heart className="w-4 h-4" />
                                                {evolution.vitalSigns.bloodPressure}
                                            </span>
                                        )}
                                        {evolution.vitalSigns.heartRate && (
                                            <span className="flex items-center gap-1 text-neutral-600">
                                                <Activity className="w-4 h-4" />
                                                {evolution.vitalSigns.heartRate} bpm
                                            </span>
                                        )}
                                        {evolution.vitalSigns.temperature && (
                                            <span className={cn(
                                                'flex items-center gap-1',
                                                evolution.vitalSigns.temperature > 37.5 ? 'text-error-600' : 'text-neutral-600'
                                            )}>
                                                <Thermometer className="w-4 h-4" />
                                                {evolution.vitalSigns.temperature}°C
                                            </span>
                                        )}
                                        {evolution.vitalSigns.oxygenSaturation && (
                                            <span className={cn(
                                                'flex items-center gap-1',
                                                evolution.vitalSigns.oxygenSaturation < 92 ? 'text-error-600' : 'text-neutral-600'
                                            )}>
                                                <Droplets className="w-4 h-4" />
                                                {evolution.vitalSigns.oxygenSaturation}%
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-neutral-600 line-clamp-2">
                                        {evolution.observations}
                                    </p>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* Evolution Detail Modal */}
            <AnimatePresence>
                {selectedEvolution && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-end z-50"
                        onClick={() => setSelectedEvolution(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Evolução Detalhada</h2>
                                <button
                                    onClick={() => setSelectedEvolution(null)}
                                    className="p-2 rounded-full hover:bg-neutral-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Patient & Date */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                                            <User className="w-6 h-6 text-brand-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{selectedEvolution.patientName}</h3>
                                            <p className="text-sm text-neutral-500">
                                                {formatDateTime(selectedEvolution.date)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        'px-3 py-1 rounded-full text-sm font-medium',
                                        getTypeConfig(selectedEvolution.type).color
                                    )}>
                                        {getTypeConfig(selectedEvolution.type).label}
                                    </span>
                                </div>

                                {/* Vital Signs */}
                                <div>
                                    <h4 className="font-medium mb-3">Sinais Vitais</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedEvolution.vitalSigns.bloodPressure && (
                                            <div className="p-3 bg-neutral-50 rounded-xl">
                                                <div className="flex items-center gap-2 text-neutral-500 mb-1">
                                                    <Heart className="w-4 h-4" />
                                                    <span className="text-xs">Pressão Arterial</span>
                                                </div>
                                                <p className="font-semibold">{selectedEvolution.vitalSigns.bloodPressure} mmHg</p>
                                            </div>
                                        )}
                                        {selectedEvolution.vitalSigns.heartRate && (
                                            <div className="p-3 bg-neutral-50 rounded-xl">
                                                <div className="flex items-center gap-2 text-neutral-500 mb-1">
                                                    <Activity className="w-4 h-4" />
                                                    <span className="text-xs">Freq. Cardíaca</span>
                                                </div>
                                                <p className="font-semibold">{selectedEvolution.vitalSigns.heartRate} bpm</p>
                                            </div>
                                        )}
                                        {selectedEvolution.vitalSigns.temperature && (
                                            <div className="p-3 bg-neutral-50 rounded-xl">
                                                <div className="flex items-center gap-2 text-neutral-500 mb-1">
                                                    <Thermometer className="w-4 h-4" />
                                                    <span className="text-xs">Temperatura</span>
                                                </div>
                                                <p className={cn(
                                                    'font-semibold',
                                                    selectedEvolution.vitalSigns.temperature > 37.5 && 'text-error-600'
                                                )}>
                                                    {selectedEvolution.vitalSigns.temperature}°C
                                                </p>
                                            </div>
                                        )}
                                        {selectedEvolution.vitalSigns.oxygenSaturation && (
                                            <div className="p-3 bg-neutral-50 rounded-xl">
                                                <div className="flex items-center gap-2 text-neutral-500 mb-1">
                                                    <Droplets className="w-4 h-4" />
                                                    <span className="text-xs">SpO₂</span>
                                                </div>
                                                <p className={cn(
                                                    'font-semibold',
                                                    selectedEvolution.vitalSigns.oxygenSaturation < 92 && 'text-error-600'
                                                )}>
                                                    {selectedEvolution.vitalSigns.oxygenSaturation}%
                                                </p>
                                            </div>
                                        )}
                                        {selectedEvolution.vitalSigns.glucose && (
                                            <div className="p-3 bg-neutral-50 rounded-xl col-span-2">
                                                <div className="flex items-center gap-2 text-neutral-500 mb-1">
                                                    <Droplets className="w-4 h-4" />
                                                    <span className="text-xs">Glicemia</span>
                                                </div>
                                                <p className="font-semibold">{selectedEvolution.vitalSigns.glucose} mg/dL</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Medications */}
                                {selectedEvolution.medications && selectedEvolution.medications.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-3">Medicações Administradas</h4>
                                        <div className="space-y-2">
                                            {selectedEvolution.medications.map((med, idx) => (
                                                <div key={idx} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                                                    <Check className="w-4 h-4 text-purple-600" />
                                                    <span className="text-sm">{med}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Procedures */}
                                {selectedEvolution.procedures && selectedEvolution.procedures.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-3">Procedimentos Realizados</h4>
                                        <div className="space-y-2">
                                            {selectedEvolution.procedures.map((proc, idx) => (
                                                <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                                    <Check className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm">{proc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Observations */}
                                <div>
                                    <h4 className="font-medium mb-3">Observações</h4>
                                    <p className="text-neutral-700 bg-neutral-50 p-4 rounded-xl">
                                        {selectedEvolution.observations}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="text-sm text-neutral-500 flex items-center justify-between">
                                    <span>Registrado por: {selectedEvolution.createdBy}</span>
                                    <span className="flex items-center gap-1">
                                        {selectedEvolution.status === 'synced' ? (
                                            <>
                                                <Cloud className="w-4 h-4 text-success-500" />
                                                Sincronizado
                                            </>
                                        ) : (
                                            <>
                                                <CloudOff className="w-4 h-4 text-warning-500" />
                                                Pendente
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* New Evolution Modal */}
            <AnimatePresence>
                {showNewEvolutionModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowNewEvolutionModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-md rounded-2xl p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4">Nova Evolução</h2>
                            <p className="text-neutral-500 mb-6">
                                Selecione o paciente para iniciar uma nova evolução de enfermagem.
                            </p>

                            <div className="space-y-3 mb-6">
                                {['Maria Silva', 'João Santos', 'Ana Oliveira', 'Pedro Costa'].map((name) => (
                                    <button
                                        key={name}
                                        className="w-full flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                                            <User className="w-5 h-5 text-brand-600" />
                                        </div>
                                        <span className="font-medium">{name}</span>
                                        <ChevronRight className="w-5 h-5 text-neutral-400 ml-auto" />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowNewEvolutionModal(false)}
                                className="w-full btn-outline"
                            >
                                Cancelar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
