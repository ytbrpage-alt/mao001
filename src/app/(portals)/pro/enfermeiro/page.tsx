'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Heart,
    Thermometer,
    Droplets,
    Clock,
    Pill,
    Syringe,
    ClipboardCheck,
    AlertTriangle,
    ChevronRight,
    Plus,
    User,
    FileText,
    TrendingUp,
    CheckCircle,
} from 'lucide-react';
import { format, isToday, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';

// Mock vital signs data
const mockVitalSigns = {
    lastUpdate: new Date(),
    bloodPressure: { systolic: 120, diastolic: 80, status: 'normal' as const },
    heartRate: { value: 72, status: 'normal' as const },
    temperature: { value: 36.5, status: 'normal' as const },
    oxygenSaturation: { value: 98, status: 'normal' as const },
    respiratoryRate: { value: 16, status: 'normal' as const },
    glucose: { value: 95, status: 'normal' as const },
};

// Mock medications
const mockMedications = [
    {
        id: '1',
        name: 'Losartana 50mg',
        dosage: '1 comprimido',
        route: 'Oral',
        scheduledTime: '08:00',
        status: 'administered' as const,
        administeredAt: '08:05',
        administeredBy: 'Enf. Ana',
    },
    {
        id: '2',
        name: 'Metformina 500mg',
        dosage: '1 comprimido',
        route: 'Oral',
        scheduledTime: '08:00',
        status: 'administered' as const,
        administeredAt: '08:05',
        administeredBy: 'Enf. Ana',
    },
    {
        id: '3',
        name: 'Insulina NPH',
        dosage: '10 UI',
        route: 'Subcutânea',
        scheduledTime: '12:00',
        status: 'pending' as const,
    },
    {
        id: '4',
        name: 'Omeprazol 20mg',
        dosage: '1 cápsula',
        route: 'Oral',
        scheduledTime: '12:00',
        status: 'pending' as const,
    },
    {
        id: '5',
        name: 'AAS 100mg',
        dosage: '1 comprimido',
        route: 'Oral',
        scheduledTime: '14:00',
        status: 'pending' as const,
    },
];

// Mock procedures
const mockProcedures = [
    {
        id: '1',
        name: 'Curativo - Úlcera de pressão',
        scheduledTime: '09:00',
        location: 'Região sacral',
        status: 'completed' as const,
        completedAt: '09:30',
        notes: 'Tecido de granulação presente, bordas sem sinais flogísticos',
    },
    {
        id: '2',
        name: 'Aspiração traqueal',
        scheduledTime: '10:00',
        location: 'Traqueostomia',
        status: 'completed' as const,
        completedAt: '10:15',
        notes: 'Secreção clara em moderada quantidade',
    },
    {
        id: '3',
        name: 'Sondagem vesical - Troca',
        scheduledTime: '14:00',
        location: '',
        status: 'pending' as const,
        priority: 'medium' as const,
    },
    {
        id: '4',
        name: 'GTT - Administração de dieta',
        scheduledTime: '12:00',
        location: 'Gastrostomia',
        status: 'pending' as const,
    },
];

// Mock alerts
const mockAlerts = [
    {
        id: '1',
        type: 'warning' as const,
        message: 'Paciente em jejum para exame (14h)',
        timestamp: new Date(),
    },
    {
        id: '2',
        type: 'info' as const,
        message: 'Visita do fisioterapeuta agendada para 15h',
        timestamp: new Date(),
    },
];

// Mock stats
const mockNurseStats = {
    patientsToday: 3,
    proceduresCompleted: 8,
    medicationsAdministered: 12,
    pendingDocumentation: 2,
};

// Mock patients list  
const mockPatients = [
    { id: '1', name: 'Maria Silva', age: 82, room: 'Domicílio', condition: 'Estável', priority: 'normal' as const },
    { id: '2', name: 'José Santos', age: 75, room: 'Domicílio', condition: 'Atenção', priority: 'high' as const },
    { id: '3', name: 'Ana Costa', age: 68, room: 'Domicílio', condition: 'Estável', priority: 'normal' as const },
];

type TabType = 'overview' | 'vitals' | 'medications' | 'procedures';

export default function NurseDashboardPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);

    const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
        switch (status) {
            case 'normal': return 'text-success-600 bg-success-100';
            case 'warning': return 'text-warning-600 bg-warning-100';
            case 'critical': return 'text-danger-600 bg-danger-100';
        }
    };

    const getMedicationStatusColor = (status: 'administered' | 'pending' | 'missed') => {
        switch (status) {
            case 'administered': return 'bg-success-100 text-success-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'missed': return 'bg-danger-100 text-danger-700';
        }
    };

    const tabs = [
        { id: 'overview' as const, label: 'Visão Geral', icon: Activity },
        { id: 'vitals' as const, label: 'Sinais Vitais', icon: Heart },
        { id: 'medications' as const, label: 'Medicações', icon: Pill },
        { id: 'procedures' as const, label: 'Procedimentos', icon: Syringe },
    ];

    return (
        <div className="space-y-4 pb-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-xl font-semibold text-neutral-900">
                    Olá, {user?.fullName?.split(' ')[0] || 'Enfermeiro(a)'} 👩‍⚕️
                </h1>
                <p className="text-neutral-500 text-sm">
                    {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </p>
            </motion.div>

            {/* Alertas */}
            {mockAlerts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    {mockAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={cn(
                                'flex items-center gap-3 p-3 rounded-lg',
                                alert.type === 'warning' ? 'bg-warning-50' : 'bg-blue-50'
                            )}
                        >
                            <AlertTriangle className={cn(
                                'w-5 h-5',
                                alert.type === 'warning' ? 'text-warning-600' : 'text-blue-600'
                            )} />
                            <p className={cn(
                                'text-sm',
                                alert.type === 'warning' ? 'text-warning-800' : 'text-blue-800'
                            )}>
                                {alert.message}
                            </p>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Seletor de Paciente */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-0 overflow-hidden"
            >
                <div className="p-3 bg-brand-50 border-b border-brand-100">
                    <p className="text-xs font-medium text-brand-600 uppercase">Paciente Selecionado</p>
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center',
                            selectedPatient.priority === 'high' ? 'bg-warning-100' : 'bg-brand-100'
                        )}>
                            <User className={cn(
                                'w-6 h-6',
                                selectedPatient.priority === 'high' ? 'text-warning-600' : 'text-brand-600'
                            )} />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-neutral-900">{selectedPatient.name}</p>
                            <p className="text-sm text-neutral-500">
                                {selectedPatient.age} anos • {selectedPatient.condition}
                            </p>
                        </div>
                        <select
                            value={selectedPatient.id}
                            onChange={(e) => setSelectedPatient(mockPatients.find(p => p.id === e.target.value)!)}
                            className="text-sm border border-neutral-200 rounded-lg px-3 py-2"
                        >
                            {mockPatients.map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-w-fit',
                            activeTab === tab.id
                                ? 'bg-white text-brand-600 shadow-sm'
                                : 'text-neutral-600 hover:text-neutral-900'
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="card p-4">
                                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center mb-2">
                                    <User className="w-5 h-5 text-brand-600" />
                                </div>
                                <p className="text-2xl font-bold text-neutral-900">{mockNurseStats.patientsToday}</p>
                                <p className="text-sm text-neutral-500">Pacientes hoje</p>
                            </div>
                            <div className="card p-4">
                                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center mb-2">
                                    <Syringe className="w-5 h-5 text-success-600" />
                                </div>
                                <p className="text-2xl font-bold text-neutral-900">{mockNurseStats.proceduresCompleted}</p>
                                <p className="text-sm text-neutral-500">Procedimentos</p>
                            </div>
                            <div className="card p-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                                    <Pill className="w-5 h-5 text-purple-600" />
                                </div>
                                <p className="text-2xl font-bold text-neutral-900">{mockNurseStats.medicationsAdministered}</p>
                                <p className="text-sm text-neutral-500">Medicações</p>
                            </div>
                            <div className="card p-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
                                    <FileText className="w-5 h-5 text-amber-600" />
                                </div>
                                <p className="text-2xl font-bold text-neutral-900">{mockNurseStats.pendingDocumentation}</p>
                                <p className="text-sm text-neutral-500">Evoluções pendentes</p>
                            </div>
                        </div>

                        {/* Quick Vital Signs */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-neutral-900">Sinais Vitais</h3>
                                <span className="text-xs text-neutral-500">
                                    Atualizado às {format(mockVitalSigns.lastUpdate, 'HH:mm')}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-2 bg-neutral-50 rounded-lg">
                                    <Heart className="w-5 h-5 text-danger-500 mx-auto mb-1" />
                                    <p className="text-lg font-bold text-neutral-900">{mockVitalSigns.heartRate.value}</p>
                                    <p className="text-xs text-neutral-500">bpm</p>
                                </div>
                                <div className="text-center p-2 bg-neutral-50 rounded-lg">
                                    <Activity className="w-5 h-5 text-brand-500 mx-auto mb-1" />
                                    <p className="text-lg font-bold text-neutral-900">
                                        {mockVitalSigns.bloodPressure.systolic}/{mockVitalSigns.bloodPressure.diastolic}
                                    </p>
                                    <p className="text-xs text-neutral-500">mmHg</p>
                                </div>
                                <div className="text-center p-2 bg-neutral-50 rounded-lg">
                                    <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                    <p className="text-lg font-bold text-neutral-900">{mockVitalSigns.oxygenSaturation.value}%</p>
                                    <p className="text-xs text-neutral-500">SpO2</p>
                                </div>
                            </div>
                        </div>

                        {/* Next Actions */}
                        <div className="card">
                            <h3 className="font-semibold text-neutral-900 mb-3">Próximas Ações</h3>
                            <div className="space-y-2">
                                {mockMedications.filter(m => m.status === 'pending').slice(0, 2).map((med) => (
                                    <div key={med.id} className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                                        <Pill className="w-5 h-5 text-purple-600" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-neutral-900">{med.name}</p>
                                            <p className="text-xs text-neutral-500">{med.scheduledTime} - {med.route}</p>
                                        </div>
                                    </div>
                                ))}
                                {mockProcedures.filter(p => p.status === 'pending').slice(0, 1).map((proc) => (
                                    <div key={proc.id} className="flex items-center gap-3 p-2 bg-brand-50 rounded-lg">
                                        <Syringe className="w-5 h-5 text-brand-600" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-neutral-900">{proc.name}</p>
                                            <p className="text-xs text-neutral-500">{proc.scheduledTime}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'vitals' && (
                    <motion.div
                        key="vitals"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-neutral-900">Sinais Vitais</h3>
                            <button className="flex items-center gap-1 text-sm text-brand-600 font-medium">
                                <Plus className="w-4 h-4" />
                                Registrar
                            </button>
                        </div>

                        <div className="grid gap-3">
                            {/* Blood Pressure */}
                            <div className="card flex items-center gap-4">
                                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', getStatusColor(mockVitalSigns.bloodPressure.status))}>
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-neutral-900">Pressão Arterial</p>
                                    <p className="text-sm text-neutral-500">Sistólica / Diastólica</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-neutral-900">
                                        {mockVitalSigns.bloodPressure.systolic}/{mockVitalSigns.bloodPressure.diastolic}
                                    </p>
                                    <p className="text-xs text-neutral-500">mmHg</p>
                                </div>
                            </div>

                            {/* Heart Rate */}
                            <div className="card flex items-center gap-4">
                                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', getStatusColor(mockVitalSigns.heartRate.status))}>
                                    <Heart className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-neutral-900">Frequência Cardíaca</p>
                                    <p className="text-sm text-neutral-500">Batimentos por minuto</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-neutral-900">{mockVitalSigns.heartRate.value}</p>
                                    <p className="text-xs text-neutral-500">bpm</p>
                                </div>
                            </div>

                            {/* Temperature */}
                            <div className="card flex items-center gap-4">
                                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', getStatusColor(mockVitalSigns.temperature.status))}>
                                    <Thermometer className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-neutral-900">Temperatura</p>
                                    <p className="text-sm text-neutral-500">Axilar</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-neutral-900">{mockVitalSigns.temperature.value}°C</p>
                                </div>
                            </div>

                            {/* SpO2 */}
                            <div className="card flex items-center gap-4">
                                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', getStatusColor(mockVitalSigns.oxygenSaturation.status))}>
                                    <Droplets className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-neutral-900">Saturação O2</p>
                                    <p className="text-sm text-neutral-500">Oximetria de pulso</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-neutral-900">{mockVitalSigns.oxygenSaturation.value}%</p>
                                </div>
                            </div>

                            {/* Glucose */}
                            <div className="card flex items-center gap-4">
                                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', getStatusColor(mockVitalSigns.glucose.status))}>
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-neutral-900">Glicemia Capilar</p>
                                    <p className="text-sm text-neutral-500">Jejum</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-neutral-900">{mockVitalSigns.glucose.value}</p>
                                    <p className="text-xs text-neutral-500">mg/dL</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'medications' && (
                    <motion.div
                        key="medications"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-neutral-900">Medicações do Dia</h3>
                            <span className="text-xs text-neutral-500">
                                {mockMedications.filter(m => m.status === 'administered').length}/{mockMedications.length} administradas
                            </span>
                        </div>

                        <div className="space-y-2">
                            {mockMedications.map((med) => (
                                <div
                                    key={med.id}
                                    className={cn(
                                        'card flex items-start gap-3',
                                        med.status === 'administered' && 'bg-success-50/50'
                                    )}
                                >
                                    <div className={cn(
                                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                                        med.status === 'administered' ? 'bg-success-100' : 'bg-purple-100'
                                    )}>
                                        {med.status === 'administered' ? (
                                            <CheckCircle className="w-5 h-5 text-success-600" />
                                        ) : (
                                            <Pill className="w-5 h-5 text-purple-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-medium text-neutral-900">{med.name}</p>
                                                <p className="text-sm text-neutral-500">
                                                    {med.dosage} • {med.route}
                                                </p>
                                            </div>
                                            <span className={cn(
                                                'px-2 py-0.5 rounded text-xs font-medium flex-shrink-0',
                                                getMedicationStatusColor(med.status)
                                            )}>
                                                {med.status === 'administered' ? 'Administrado' : 'Pendente'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {med.status === 'administered' ? med.administeredAt : med.scheduledTime}
                                            </span>
                                            {med.administeredBy && (
                                                <span>por {med.administeredBy}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'procedures' && (
                    <motion.div
                        key="procedures"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-neutral-900">Procedimentos</h3>
                            <button className="flex items-center gap-1 text-sm text-brand-600 font-medium">
                                <Plus className="w-4 h-4" />
                                Adicionar
                            </button>
                        </div>

                        <div className="space-y-2">
                            {mockProcedures.map((proc) => (
                                <div
                                    key={proc.id}
                                    className={cn(
                                        'card',
                                        proc.status === 'completed' && 'bg-success-50/50'
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                                            proc.status === 'completed' ? 'bg-success-100' : 'bg-brand-100'
                                        )}>
                                            {proc.status === 'completed' ? (
                                                <CheckCircle className="w-5 h-5 text-success-600" />
                                            ) : (
                                                <Syringe className="w-5 h-5 text-brand-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-medium text-neutral-900">{proc.name}</p>
                                                <span className={cn(
                                                    'px-2 py-0.5 rounded text-xs font-medium',
                                                    proc.status === 'completed'
                                                        ? 'bg-success-100 text-success-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                )}>
                                                    {proc.status === 'completed' ? 'Concluído' : 'Pendente'}
                                                </span>
                                            </div>
                                            {proc.location && (
                                                <p className="text-sm text-neutral-500">{proc.location}</p>
                                            )}
                                            <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {proc.status === 'completed' ? proc.completedAt : proc.scheduledTime}
                                                </span>
                                            </div>
                                            {proc.notes && (
                                                <p className="mt-2 text-sm text-neutral-600 bg-neutral-50 p-2 rounded">
                                                    {proc.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
