'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Plus,
    Search,
    User,
    Clock,
    Heart,
    Activity,
    Thermometer,
    Droplets,
    Pill,
    Stethoscope,
    Check,
    Cloud,
    CloudOff,
    X,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Tipos
interface NursingEvolution {
    id: string;
    patientId: string;
    patientName: string;
    room: string;
    date: Date;
    shift: 'morning' | 'afternoon' | 'night';
    nurseId: string;
    nurseName: string;
    type: 'admission' | 'evolution' | 'discharge' | 'transfer';
    status: 'synced' | 'pending' | 'draft';
    vitalSigns: {
        bloodPressure: string;
        heartRate: number;
        temperature: number;
        oxygenSaturation: number;
        respiratoryRate: number;
        glucose?: number;
        pain?: number;
    };
    generalState: string;
    consciousness: string;
    skin: string;
    diet: string;
    elimination: string;
    mobility: string;
    medications: { name: string; dose: string; route: string; time: string }[];
    procedures: { name: string; notes?: string }[];
    observations: string;
    nursingDiagnoses: string[];
    interventions: string[];
}

// Mock data
const mockEvolutions: NursingEvolution[] = [
    {
        id: '1',
        patientId: '1',
        patientName: 'Maria Silva',
        room: '501-A',
        date: new Date(),
        shift: 'morning',
        nurseId: 'nurse-1',
        nurseName: 'Enf. Ana Paula',
        type: 'evolution',
        status: 'synced',
        vitalSigns: {
            bloodPressure: '120/80',
            heartRate: 72,
            temperature: 36.5,
            oxygenSaturation: 97,
            respiratoryRate: 16,
            pain: 0
        },
        generalState: 'Bom',
        consciousness: 'Lúcida e orientada',
        skin: 'Íntegra, hidratada',
        diet: 'Aceita bem via oral',
        elimination: 'Diurese espontânea, evacuação presente',
        mobility: 'Deambula com auxílio',
        medications: [
            { name: 'Donepezila', dose: '10mg', route: 'VO', time: '08:00' },
            { name: 'Losartana', dose: '50mg', route: 'VO', time: '08:00' }
        ],
        procedures: [],
        observations: 'Paciente estável, sem intercorrências. Mantida orientação familiar.',
        nursingDiagnoses: ['Risco de queda', 'Memória prejudicada'],
        interventions: ['Manter grades elevadas', 'Orientar quanto ao ambiente']
    },
    {
        id: '2',
        patientId: '3',
        patientName: 'Ana Oliveira',
        room: '503-A',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        shift: 'morning',
        nurseId: 'nurse-1',
        nurseName: 'Enf. Ana Paula',
        type: 'evolution',
        status: 'synced',
        vitalSigns: {
            bloodPressure: '130/85',
            heartRate: 98,
            temperature: 37.4,
            oxygenSaturation: 88,
            respiratoryRate: 24,
            pain: 3
        },
        generalState: 'Regular',
        consciousness: 'Lúcida, dispneica',
        skin: 'Corada, úmida',
        diet: 'Aceitação parcial',
        elimination: 'Diurese via SVD',
        mobility: 'Restrito ao leito',
        medications: [
            { name: 'Prednisona', dose: '40mg', route: 'VO', time: '08:00' },
            { name: 'Salbutamol', dose: '100mcg 2 puffs', route: 'Inalatória', time: '06:00' }
        ],
        procedures: [
            { name: 'Oxigenoterapia', notes: 'O2 via CN 4L/min' },
            { name: 'Monitorização contínua' }
        ],
        observations: 'Paciente mantém dispneia aos mínimos esforços. SpO2 baixa. Médico notificado.',
        nursingDiagnoses: ['Troca de gases prejudicada', 'Intolerância à atividade'],
        interventions: ['Manter O2 conforme prescrição', 'Cabeceira elevada 45°', 'Avaliar padrão respiratório']
    },
    {
        id: '3',
        patientId: '2',
        patientName: 'João Santos',
        room: '502-B',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        shift: 'night',
        nurseId: 'nurse-2',
        nurseName: 'Enf. Carlos',
        type: 'evolution',
        status: 'synced',
        vitalSigns: {
            bloodPressure: '145/95',
            heartRate: 88,
            temperature: 36.8,
            oxygenSaturation: 94,
            respiratoryRate: 18,
            pain: 2
        },
        generalState: 'Regular',
        consciousness: 'Lúcido, hemiparesia E',
        skin: 'Íntegra',
        diet: 'Aceita dieta pastosa',
        elimination: 'Diurese espontânea',
        mobility: 'Cadeira de rodas',
        medications: [
            { name: 'Clopidogrel', dose: '75mg', route: 'VO', time: '22:00' },
            { name: 'Sinvastatina', dose: '40mg', route: 'VO', time: '22:00' }
        ],
        procedures: [
            { name: 'Fisioterapia passiva' }
        ],
        observations: 'PA elevada no período. Monitorizado. Sem outras intercorrências.',
        nursingDiagnoses: ['Mobilidade física prejudicada', 'Risco de AVC'],
        interventions: ['Monitorar PA', 'Auxiliar em AVDs', 'Prevenção de UPP']
    },
];

// Helpers
const getShiftLabel = (shift: NursingEvolution['shift']) => {
    switch (shift) {
        case 'morning': return 'Manhã (07h-13h)';
        case 'afternoon': return 'Tarde (13h-19h)';
        case 'night': return 'Noite (19h-07h)';
    }
};

const getTypeConfig = (type: NursingEvolution['type']) => {
    switch (type) {
        case 'admission': return { label: 'Admissão', color: 'bg-blue-100 text-blue-700' };
        case 'evolution': return { label: 'Evolução', color: 'bg-green-100 text-green-700' };
        case 'discharge': return { label: 'Alta', color: 'bg-purple-100 text-purple-700' };
        case 'transfer': return { label: 'Transferência', color: 'bg-orange-100 text-orange-700' };
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

export default function EnfermeiroEvolucoesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvolution, setSelectedEvolution] = useState<NursingEvolution | null>(null);
    const [showNewModal, setShowNewModal] = useState(false);

    const filteredEvolutions = mockEvolutions.filter(evo =>
        evo.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evo.room.includes(searchQuery)
    );

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
                        Evoluções de Enfermagem
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {mockEvolutions.length} registros hoje
                    </p>
                </div>
                <button
                    onClick={() => setShowNewModal(true)}
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
                    placeholder="Buscar por paciente ou quarto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-primary pl-10"
                />
            </motion.div>

            {/* Evolutions List */}
            <div className="space-y-3">
                {filteredEvolutions.map((evo, index) => {
                    const typeConfig = getTypeConfig(evo.type);

                    return (
                        <motion.div
                            key={evo.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedEvolution(evo)}
                            className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                                        <User className="w-5 h-5 text-brand-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-neutral-900">
                                            {evo.patientName}
                                        </h3>
                                        <p className="text-sm text-neutral-500">
                                            Q{evo.room} • {getShiftLabel(evo.shift)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', typeConfig.color)}>
                                        {typeConfig.label}
                                    </span>
                                    {evo.status === 'synced' ? (
                                        <Cloud className="w-4 h-4 text-success-500" />
                                    ) : (
                                        <CloudOff className="w-4 h-4 text-warning-500" />
                                    )}
                                </div>
                            </div>

                            {/* Vital Signs Summary */}
                            <div className="flex flex-wrap gap-3 text-sm mb-3">
                                <span className="flex items-center gap-1 text-neutral-600">
                                    <Heart className="w-4 h-4" />
                                    {evo.vitalSigns.bloodPressure}
                                </span>
                                <span className="flex items-center gap-1 text-neutral-600">
                                    <Activity className="w-4 h-4" />
                                    {evo.vitalSigns.heartRate} bpm
                                </span>
                                <span className={cn(
                                    'flex items-center gap-1',
                                    evo.vitalSigns.oxygenSaturation < 92 ? 'text-error-600' : 'text-neutral-600'
                                )}>
                                    <Droplets className="w-4 h-4" />
                                    {evo.vitalSigns.oxygenSaturation}%
                                </span>
                            </div>

                            <p className="text-sm text-neutral-600 line-clamp-2">
                                {evo.observations}
                            </p>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-neutral-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatDateTime(evo.date)}
                                </span>
                                <span>{evo.nurseName}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Evolution Detail Modal */}
            <AnimatePresence>
                {selectedEvolution && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setSelectedEvolution(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
                                <h2 className="text-lg font-semibold">Evolução de Enfermagem</h2>
                                <button onClick={() => setSelectedEvolution(null)} className="p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Header */}
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center">
                                        <User className="w-7 h-7 text-brand-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">{selectedEvolution.patientName}</h3>
                                        <p className="text-neutral-500">
                                            Quarto {selectedEvolution.room} • {getShiftLabel(selectedEvolution.shift)}
                                        </p>
                                        <p className="text-sm text-neutral-400">{formatDateTime(selectedEvolution.date)}</p>
                                    </div>
                                </div>

                                {/* Vitals Grid */}
                                <div>
                                    <h4 className="font-medium mb-3">Sinais Vitais</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="p-2 bg-neutral-50 rounded-lg text-center">
                                            <p className="text-xs text-neutral-500">PA</p>
                                            <p className="font-semibold">{selectedEvolution.vitalSigns.bloodPressure}</p>
                                        </div>
                                        <div className="p-2 bg-neutral-50 rounded-lg text-center">
                                            <p className="text-xs text-neutral-500">FC</p>
                                            <p className="font-semibold">{selectedEvolution.vitalSigns.heartRate}</p>
                                        </div>
                                        <div className="p-2 bg-neutral-50 rounded-lg text-center">
                                            <p className="text-xs text-neutral-500">SpO₂</p>
                                            <p className={cn(
                                                'font-semibold',
                                                selectedEvolution.vitalSigns.oxygenSaturation < 92 && 'text-error-600'
                                            )}>
                                                {selectedEvolution.vitalSigns.oxygenSaturation}%
                                            </p>
                                        </div>
                                        <div className="p-2 bg-neutral-50 rounded-lg text-center">
                                            <p className="text-xs text-neutral-500">Temp</p>
                                            <p className="font-semibold">{selectedEvolution.vitalSigns.temperature}°C</p>
                                        </div>
                                        <div className="p-2 bg-neutral-50 rounded-lg text-center">
                                            <p className="text-xs text-neutral-500">FR</p>
                                            <p className="font-semibold">{selectedEvolution.vitalSigns.respiratoryRate}</p>
                                        </div>
                                        {selectedEvolution.vitalSigns.pain !== undefined && (
                                            <div className="p-2 bg-neutral-50 rounded-lg text-center">
                                                <p className="text-xs text-neutral-500">Dor</p>
                                                <p className="font-semibold">{selectedEvolution.vitalSigns.pain}/10</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Assessment */}
                                <div>
                                    <h4 className="font-medium mb-3">Avaliação</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex"><span className="w-28 text-neutral-500">Estado geral:</span><span>{selectedEvolution.generalState}</span></div>
                                        <div className="flex"><span className="w-28 text-neutral-500">Consciência:</span><span>{selectedEvolution.consciousness}</span></div>
                                        <div className="flex"><span className="w-28 text-neutral-500">Pele:</span><span>{selectedEvolution.skin}</span></div>
                                        <div className="flex"><span className="w-28 text-neutral-500">Dieta:</span><span>{selectedEvolution.diet}</span></div>
                                        <div className="flex"><span className="w-28 text-neutral-500">Eliminações:</span><span>{selectedEvolution.elimination}</span></div>
                                        <div className="flex"><span className="w-28 text-neutral-500">Mobilidade:</span><span>{selectedEvolution.mobility}</span></div>
                                    </div>
                                </div>

                                {/* Medications */}
                                {selectedEvolution.medications.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-3 flex items-center gap-2">
                                            <Pill className="w-5 h-5 text-purple-500" />
                                            Medicações
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedEvolution.medications.map((med, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                                                    <span className="text-sm">{med.name} {med.dose}</span>
                                                    <span className="text-xs text-neutral-500">{med.route} • {med.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Procedures */}
                                {selectedEvolution.procedures.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-3 flex items-center gap-2">
                                            <Stethoscope className="w-5 h-5 text-green-500" />
                                            Procedimentos
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedEvolution.procedures.map((proc, idx) => (
                                                <div key={idx} className="p-2 bg-green-50 rounded-lg">
                                                    <span className="text-sm">{proc.name}</span>
                                                    {proc.notes && <p className="text-xs text-neutral-500 mt-1">{proc.notes}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Nursing Diagnoses */}
                                <div>
                                    <h4 className="font-medium mb-3">Diagnósticos de Enfermagem</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedEvolution.nursingDiagnoses.map((dx, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                {dx}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Observations */}
                                <div>
                                    <h4 className="font-medium mb-2">Observações</h4>
                                    <p className="text-neutral-700 bg-neutral-50 p-4 rounded-xl">
                                        {selectedEvolution.observations}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="text-sm text-neutral-500">
                                    Registrado por: {selectedEvolution.nurseName}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* New Evolution Modal (placeholder) */}
            <AnimatePresence>
                {showNewModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowNewModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-md rounded-2xl p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4">Nova Evolução</h2>
                            <p className="text-neutral-500 mb-6">
                                Selecione o paciente para iniciar uma nova evolução de enfermagem.
                            </p>

                            <div className="space-y-2 mb-6">
                                {['Maria Silva - Q501-A', 'João Santos - Q502-B', 'Ana Oliveira - Q503-A'].map((p) => (
                                    <button
                                        key={p}
                                        className="w-full flex items-center justify-between p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                                    >
                                        <span>{p}</span>
                                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowNewModal(false)}
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
