'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Heart,
    Clock,
    Search,
    Plus,
    Phone,
    MapPin,
    Calendar,
    Activity,
    AlertTriangle,
    Pill,
    Apple,
    Brain,
    Stethoscope,
    X,
    ChevronRight,
    Moon,
    Sun,
    Sunrise,
    Sunset,
    Coffee,
    UtensilsCrossed,
    Bed,
    Users,
    Home,
    Shield,
    Wind,
    PersonStanding,
    AlertCircle,
    Save,
    FileText,
    ClipboardList,
    Cloud,
    CloudOff,
    Droplets,
    Thermometer,
    Check,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Types
interface NursingOccurrence {
    id: string;
    date: Date;
    type: 'evolution' | 'procedure' | 'vital_signs' | 'medication' | 'incident' | 'observation';
    title: string;
    description: string;
    severity: 'info' | 'warning' | 'critical';
    vitalSigns?: {
        bloodPressure?: string;
        heartRate?: number;
        temperature?: number;
        oxygenSaturation?: number;
        respiratoryRate?: number;
        glucose?: number;
        pain?: number;
    };
    syncStatus: 'synced' | 'pending';
    createdBy: string;
}

interface NursingPatient {
    id: string;
    fullName: string;
    preferredName: string;
    birthDate: string;
    age: number;
    room: string;
    bed: string;
    phone: string;
    address: string;
    city: string;
    maritalStatus: string;
    // Routine
    wakeUpTime: string;
    breakfastTime: string;
    lunchTime: string;
    dinnerTime: string;
    bedTime: string;
    sleepQuality: string;
    nightWakeups: number;
    // Health
    admissionDate: string;
    admissionReason: string;
    neurologicalConditions: string[];
    cardiovascularConditions: string[];
    respiratoryConditions: string[];
    mobilityConditions: string[];
    otherConditions: string[];
    allergies: string[];
    dietaryRestrictions: string[];
    devices: string[];
    medications: { name: string; dose: string; route: string; schedule: string }[];
    // Clinical
    abemidScore: number;
    abemidClassification: string;
    katzScore: number;
    katzClassification: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    // Current vitals
    currentVitals: {
        bloodPressure: string;
        heartRate: number;
        temperature: number;
        oxygenSaturation: number;
        respiratoryRate: number;
        glucose?: number;
        pain: number;
        lastUpdate: Date;
    };
    // Alerts
    alerts: string[];
    // Contacts
    emergencyContacts: { name: string; relation: string; phone: string }[];
    status: 'stable' | 'attention' | 'critical';
}

// Mock nursing patients
const mockPatients: NursingPatient[] = [
    {
        id: '1',
        fullName: 'Maria da Silva Santos',
        preferredName: 'Dona Maria',
        birthDate: '1942-05-15',
        age: 82,
        room: '501',
        bed: 'A',
        phone: '(45) 99999-1234',
        address: 'Rua das Flores, 123',
        city: 'Foz do Iguaçu, PR',
        maritalStatus: 'Viúva',
        wakeUpTime: '07:00',
        breakfastTime: '08:00',
        lunchTime: '12:00',
        dinnerTime: '19:00',
        bedTime: '21:00',
        sleepQuality: 'Acorda para ir ao banheiro',
        nightWakeups: 2,
        admissionDate: '2024-01-05',
        admissionReason: 'Acompanhamento pós-cirúrgico (fratura de fêmur)',
        neurologicalConditions: ['Alzheimer (fase inicial)'],
        cardiovascularConditions: ['Hipertensão arterial'],
        respiratoryConditions: [],
        mobilityConditions: ['Acamada temporariamente', 'Fisioterapia diária'],
        otherConditions: ['Diabetes tipo 2'],
        allergies: ['Dipirona', 'Contraste iodado'],
        dietaryRestrictions: ['Dieta diabética', 'Baixo sódio', 'Pastosa'],
        devices: ['SVD (Sonda Vesical de Demora)', 'Acesso venoso periférico MSD'],
        medications: [
            { name: 'Donepezila', dose: '10mg', route: 'VO', schedule: '08:00' },
            { name: 'Losartana', dose: '50mg', route: 'VO', schedule: '08:00' },
            { name: 'Metformina', dose: '850mg', route: 'VO', schedule: '08:00, 20:00' },
            { name: 'Enoxaparina', dose: '40mg', route: 'SC', schedule: '22:00' },
            { name: 'Tramadol', dose: '50mg', route: 'VO', schedule: 'SOS' },
        ],
        abemidScore: 12,
        abemidClassification: 'Técnico de Enfermagem',
        katzScore: 10,
        katzClassification: 'Dependência total',
        riskLevel: 'high',
        currentVitals: {
            bloodPressure: '130/85',
            heartRate: 78,
            temperature: 36.8,
            oxygenSaturation: 96,
            respiratoryRate: 18,
            glucose: 145,
            pain: 3,
            lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        alerts: ['Risco de queda ALTO', 'Risco de UPP', 'Jejum para exame amanhã'],
        emergencyContacts: [
            { name: 'Carlos Santos', relation: 'Filho', phone: '(45) 99888-1111' },
            { name: 'Ana Paula Santos', relation: 'Filha', phone: '(45) 99777-2222' },
        ],
        status: 'attention',
    },
    {
        id: '2',
        fullName: 'João Pedro Oliveira',
        preferredName: 'Seu João',
        birthDate: '1940-10-22',
        age: 84,
        room: '502',
        bed: 'B',
        phone: '(45) 99999-5678',
        address: 'Av. Brasil, 456',
        city: 'Foz do Iguaçu, PR',
        maritalStatus: 'Casado',
        wakeUpTime: '06:00',
        breakfastTime: '07:00',
        lunchTime: '12:00',
        dinnerTime: '18:30',
        bedTime: '20:30',
        sleepQuality: 'Insônia frequente',
        nightWakeups: 4,
        admissionDate: '2024-01-03',
        admissionReason: 'Descompensação cardíaca + Infecção respiratória',
        neurologicalConditions: ['AVC (2023) - Hemiparesia esquerda'],
        cardiovascularConditions: ['ICC', 'FA crônica', 'Hipertensão'],
        respiratoryConditions: ['DPOC exacerbado', 'Pneumonia'],
        mobilityConditions: ['Restrito ao leito'],
        otherConditions: [],
        allergies: [],
        dietaryRestrictions: ['Baixo sódio', 'Líquidos espessados', 'Restrição hídrica 1L/dia'],
        devices: ['O2 via CN 3L/min', 'Acesso venoso periférico MSE', 'Monitorização contínua'],
        medications: [
            { name: 'Furosemida', dose: '40mg', route: 'EV', schedule: '08:00, 14:00' },
            { name: 'Ceftriaxona', dose: '1g', route: 'EV', schedule: '08:00, 20:00' },
            { name: 'Amiodarona', dose: '200mg', route: 'VO', schedule: '12:00' },
            { name: 'Heparina', dose: '5000 UI', route: 'SC', schedule: '08:00, 20:00' },
            { name: 'Dipirona', dose: '1g', route: 'EV', schedule: 'SOS' },
        ],
        abemidScore: 18,
        abemidClassification: 'Enfermeiro',
        katzScore: 12,
        katzClassification: 'Dependência total',
        riskLevel: 'critical',
        currentVitals: {
            bloodPressure: '150/95',
            heartRate: 98,
            temperature: 37.8,
            oxygenSaturation: 89,
            respiratoryRate: 26,
            pain: 2,
            lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
        },
        alerts: ['SpO2 BAIXO', 'Febre', 'Balanço hídrico rigoroso', 'ATB em curso'],
        emergencyContacts: [
            { name: 'Maria Oliveira', relation: 'Esposa', phone: '(45) 99666-3333' },
        ],
        status: 'critical',
    },
];

// Mock occurrences
const mockOccurrences: Record<string, NursingOccurrence[]> = {
    '1': [
        { id: 'o1', date: new Date(), type: 'vital_signs', title: 'Sinais vitais 14h', description: 'PA: 130/85, FC: 78, Tax: 36.8°C, SpO2: 96%, Glicemia: 145mg/dL, Dor: 3/10', severity: 'info', syncStatus: 'synced', createdBy: 'Enf. Ana Paula', vitalSigns: { bloodPressure: '130/85', heartRate: 78, temperature: 36.8, oxygenSaturation: 96, glucose: 145, pain: 3 } },
        { id: 'o2', date: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'procedure', title: 'Curativo MID', description: 'Realizado curativo em ferida operatória MID. Bordas bem aproximadas, sem sinais flogísticos. Mantido curativo oclusivo.', severity: 'info', syncStatus: 'synced', createdBy: 'Enf. Ana Paula' },
        { id: 'o3', date: new Date(Date.now() - 6 * 60 * 60 * 1000), type: 'medication', title: 'Enoxaparina administrada', description: 'Administrada Enoxaparina 40mg SC conforme prescrição. Rodízio de local realizado (abdome lado E).', severity: 'info', syncStatus: 'synced', createdBy: 'Enf. Ana Paula' },
    ],
    '2': [
        { id: 'o4', date: new Date(), type: 'vital_signs', title: 'Sinais vitais 14h', description: 'PA: 150/95, FC: 98, Tax: 37.8°C, SpO2: 89%, FR: 26 irpm, Dor: 2/10. MÉDICO NOTIFICADO SOBRE SPO2.', severity: 'critical', syncStatus: 'synced', createdBy: 'Enf. Carlos', vitalSigns: { bloodPressure: '150/95', heartRate: 98, temperature: 37.8, oxygenSaturation: 89, respiratoryRate: 26, pain: 2 } },
        { id: 'o5', date: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'evolution', title: 'Evolução de enfermagem', description: 'Paciente mantém dispneia aos mínimos esforços. Tosse produtiva. Aceitação alimentar parcial. Diurese via SVD.', severity: 'warning', syncStatus: 'synced', createdBy: 'Enf. Carlos' },
    ],
};

// Helpers
const getRiskColor = (risk: string) => {
    switch (risk) {
        case 'low': return 'bg-success-100 text-success-700';
        case 'medium': return 'bg-warning-100 text-warning-700';
        case 'high': return 'bg-orange-100 text-orange-700';
        case 'critical': return 'bg-error-100 text-error-700';
        default: return 'bg-neutral-100 text-neutral-700';
    }
};

const getStatusConfig = (status: NursingPatient['status']) => {
    switch (status) {
        case 'stable': return { label: 'Estável', color: 'bg-success-500' };
        case 'attention': return { label: 'Atenção', color: 'bg-warning-500' };
        case 'critical': return { label: 'Crítico', color: 'bg-error-500' };
    }
};

const getOccurrenceConfig = (type: NursingOccurrence['type']) => {
    switch (type) {
        case 'evolution': return { icon: FileText, color: 'bg-blue-100 text-blue-600' };
        case 'procedure': return { icon: Stethoscope, color: 'bg-green-100 text-green-600' };
        case 'vital_signs': return { icon: Activity, color: 'bg-purple-100 text-purple-600' };
        case 'medication': return { icon: Pill, color: 'bg-pink-100 text-pink-600' };
        case 'incident': return { icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' };
        case 'observation': return { icon: FileText, color: 'bg-cyan-100 text-cyan-600' };
    }
};

export default function EnfermeiroPacientesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<NursingPatient | null>(null);
    const [activeSection, setActiveSection] = useState<string>('vitals');
    const [showNewOccurrence, setShowNewOccurrence] = useState(false);
    const [newOccurrence, setNewOccurrence] = useState({
        type: 'vital_signs' as NursingOccurrence['type'],
        title: '',
        description: '',
        severity: 'info' as NursingOccurrence['severity'],
        vitalSigns: {
            bloodPressure: '',
            heartRate: '',
            temperature: '',
            oxygenSaturation: '',
            respiratoryRate: '',
            glucose: '',
            pain: '',
        },
    });
    const [localOccurrences, setLocalOccurrences] = useState<Record<string, NursingOccurrence[]>>(mockOccurrences);

    const filteredPatients = mockPatients.filter(p =>
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.room.includes(searchQuery)
    );

    const handleAddOccurrence = () => {
        if (!selectedPatient || !newOccurrence.title) return;

        const occurrence: NursingOccurrence = {
            id: `new-${Date.now()}`,
            date: new Date(),
            type: newOccurrence.type,
            title: newOccurrence.title,
            description: newOccurrence.description,
            severity: newOccurrence.severity,
            syncStatus: 'pending',
            createdBy: 'Você',
            vitalSigns: newOccurrence.type === 'vital_signs' ? {
                bloodPressure: newOccurrence.vitalSigns.bloodPressure || undefined,
                heartRate: newOccurrence.vitalSigns.heartRate ? parseInt(newOccurrence.vitalSigns.heartRate) : undefined,
                temperature: newOccurrence.vitalSigns.temperature ? parseFloat(newOccurrence.vitalSigns.temperature) : undefined,
                oxygenSaturation: newOccurrence.vitalSigns.oxygenSaturation ? parseInt(newOccurrence.vitalSigns.oxygenSaturation) : undefined,
                respiratoryRate: newOccurrence.vitalSigns.respiratoryRate ? parseInt(newOccurrence.vitalSigns.respiratoryRate) : undefined,
                glucose: newOccurrence.vitalSigns.glucose ? parseInt(newOccurrence.vitalSigns.glucose) : undefined,
                pain: newOccurrence.vitalSigns.pain ? parseInt(newOccurrence.vitalSigns.pain) : undefined,
            } : undefined,
        };

        setLocalOccurrences(prev => ({
            ...prev,
            [selectedPatient.id]: [occurrence, ...(prev[selectedPatient.id] || [])],
        }));

        setNewOccurrence({ type: 'vital_signs', title: '', description: '', severity: 'info', vitalSigns: { bloodPressure: '', heartRate: '', temperature: '', oxygenSaturation: '', respiratoryRate: '', glucose: '', pain: '' } });
        setShowNewOccurrence(false);
    };

    const sections = [
        { id: 'vitals', label: 'Sinais Vitais', icon: Activity },
        { id: 'info', label: 'Informações', icon: User },
        { id: 'health', label: 'Diagnósticos', icon: Heart },
        { id: 'meds', label: 'Medicações', icon: Pill },
        { id: 'devices', label: 'Dispositivos', icon: Stethoscope },
        { id: 'occurrences', label: 'Registros', icon: FileText },
    ];

    return (
        <div className="space-y-4 pb-4">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-brand-500" />
                    Pacientes
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                    {mockPatients.length} pacientes internados
                </p>
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input type="text" placeholder="Buscar por nome ou quarto..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-primary pl-10" />
            </motion.div>

            {/* Patient List */}
            <div className="space-y-3">
                {filteredPatients.map((patient, index) => {
                    const statusConfig = getStatusConfig(patient.status);
                    return (
                        <motion.div key={patient.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setSelectedPatient(patient)} className="card p-4 cursor-pointer hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center">
                                        <User className="w-7 h-7 text-brand-600" />
                                    </div>
                                    <div className={cn('absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white', statusConfig.color)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-neutral-900">{patient.preferredName}</h3>
                                        <span className="text-sm font-medium text-brand-600">Q{patient.room}-{patient.bed}</span>
                                    </div>
                                    <p className="text-sm text-neutral-500">{patient.age} anos</p>

                                    {/* Vitals summary */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="flex items-center gap-1 text-xs bg-neutral-100 px-2 py-1 rounded">
                                            <Heart className="w-3 h-3" /> {patient.currentVitals.bloodPressure}
                                        </span>
                                        <span className={cn('flex items-center gap-1 text-xs px-2 py-1 rounded', patient.currentVitals.oxygenSaturation < 92 ? 'bg-error-100 text-error-700' : 'bg-neutral-100')}>
                                            <Droplets className="w-3 h-3" /> {patient.currentVitals.oxygenSaturation}%
                                        </span>
                                        {patient.currentVitals.temperature >= 37.5 && (
                                            <span className="flex items-center gap-1 text-xs bg-warning-100 text-warning-700 px-2 py-1 rounded">
                                                <Thermometer className="w-3 h-3" /> {patient.currentVitals.temperature}°C
                                            </span>
                                        )}
                                    </div>

                                    {/* Alerts */}
                                    {patient.alerts.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {patient.alerts.slice(0, 2).map((alert, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded text-xs flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {alert}
                                                </span>
                                            ))}
                                            {patient.alerts.length > 2 && (
                                                <span className="text-xs text-neutral-500">+{patient.alerts.length - 2}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <ChevronRight className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Patient Detail Modal */}
            <AnimatePresence>
                {selectedPatient && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedPatient(null)}>
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-neutral-900 overflow-y-auto pb-20">
                            {/* Header */}
                            <div className={cn('sticky top-0 text-white p-4 z-10', selectedPatient.status === 'critical' ? 'bg-gradient-to-b from-error-600 to-error-700' : selectedPatient.status === 'attention' ? 'bg-gradient-to-b from-warning-500 to-warning-600' : 'bg-gradient-to-b from-success-500 to-success-600')}>
                                <div className="flex items-center justify-between mb-4">
                                    <button onClick={() => setSelectedPatient(null)}><X className="w-6 h-6" /></button>
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Q{selectedPatient.room}-{selectedPatient.bed}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{selectedPatient.preferredName}</h2>
                                        <p className="text-white/80 text-sm">{selectedPatient.fullName}</p>
                                        <p className="text-white/60 text-sm">{selectedPatient.age} anos</p>
                                    </div>
                                </div>

                                {/* Allergies */}
                                {selectedPatient.allergies.length > 0 && (
                                    <div className="mt-4 p-3 bg-error-700 rounded-xl flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                        <span className="font-bold">ALERGIA: {selectedPatient.allergies.join(', ')}</span>
                                    </div>
                                )}

                                {/* Alerts */}
                                {selectedPatient.alerts.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {selectedPatient.alerts.map((a, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/20 rounded text-xs">{a}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tabs */}
                            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b dark:border-neutral-700 z-10 shadow-sm">
                                <div className="flex p-2 gap-1 overflow-x-auto scrollbar-hide min-w-0">
                                    {sections.map(section => (
                                        <button key={section.id} onClick={() => setActiveSection(section.id)} className={cn('flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0', activeSection === section.id ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800')}>
                                            <section.icon className="w-4 h-4" />
                                            {section.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-4">
                                {/* Sinais Vitais */}
                                {activeSection === 'vitals' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        <div className="card p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-medium">Sinais Vitais Atuais</h3>
                                                <span className="text-xs text-neutral-400">Última atualização: {selectedPatient.currentVitals.lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="p-3 bg-neutral-50 rounded-xl text-center">
                                                    <p className="text-xs text-neutral-500 mb-1">PA</p>
                                                    <p className="text-lg font-bold">{selectedPatient.currentVitals.bloodPressure}</p>
                                                </div>
                                                <div className="p-3 bg-neutral-50 rounded-xl text-center">
                                                    <p className="text-xs text-neutral-500 mb-1">FC</p>
                                                    <p className="text-lg font-bold">{selectedPatient.currentVitals.heartRate}</p>
                                                </div>
                                                <div className={cn('p-3 rounded-xl text-center', selectedPatient.currentVitals.oxygenSaturation < 92 ? 'bg-error-50' : 'bg-neutral-50')}>
                                                    <p className="text-xs text-neutral-500 mb-1">SpO₂</p>
                                                    <p className={cn('text-lg font-bold', selectedPatient.currentVitals.oxygenSaturation < 92 && 'text-error-600')}>{selectedPatient.currentVitals.oxygenSaturation}%</p>
                                                </div>
                                                <div className={cn('p-3 rounded-xl text-center', selectedPatient.currentVitals.temperature >= 37.5 ? 'bg-warning-50' : 'bg-neutral-50')}>
                                                    <p className="text-xs text-neutral-500 mb-1">Temp</p>
                                                    <p className={cn('text-lg font-bold', selectedPatient.currentVitals.temperature >= 37.5 && 'text-warning-600')}>{selectedPatient.currentVitals.temperature}°C</p>
                                                </div>
                                                <div className="p-3 bg-neutral-50 rounded-xl text-center">
                                                    <p className="text-xs text-neutral-500 mb-1">FR</p>
                                                    <p className="text-lg font-bold">{selectedPatient.currentVitals.respiratoryRate}</p>
                                                </div>
                                                <div className="p-3 bg-neutral-50 rounded-xl text-center">
                                                    <p className="text-xs text-neutral-500 mb-1">Dor</p>
                                                    <p className="text-lg font-bold">{selectedPatient.currentVitals.pain}/10</p>
                                                </div>
                                                {selectedPatient.currentVitals.glucose && (
                                                    <div className="p-3 bg-neutral-50 rounded-xl text-center col-span-3">
                                                        <p className="text-xs text-neutral-500 mb-1">Glicemia</p>
                                                        <p className="text-lg font-bold">{selectedPatient.currentVitals.glucose} mg/dL</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button onClick={() => { setShowNewOccurrence(true); setNewOccurrence({ ...newOccurrence, type: 'vital_signs', title: 'Sinais vitais ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }); }} className="w-full btn-primary">
                                            <Plus className="w-5 h-5 mr-2" />
                                            Registrar Novos Sinais Vitais
                                        </button>
                                    </motion.div>
                                )}

                                {/* Informações */}
                                {activeSection === 'info' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium flex items-center gap-2"><ClipboardList className="w-5 h-5 text-brand-500" /> Admissão</h3>
                                            <div className="p-3 bg-brand-50 rounded-xl">
                                                <p className="text-sm font-medium">Data: {new Date(selectedPatient.admissionDate).toLocaleDateString('pt-BR')}</p>
                                                <p className="text-sm mt-1">{selectedPatient.admissionReason}</p>
                                            </div>
                                        </div>

                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium flex items-center gap-2"><User className="w-5 h-5 text-brand-500" /> Dados Pessoais</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-neutral-400" /> {new Date(selectedPatient.birthDate).toLocaleDateString('pt-BR')} ({selectedPatient.age} anos)</div>
                                                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-neutral-400" /> {selectedPatient.phone}</div>
                                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-neutral-400" /> {selectedPatient.address}, {selectedPatient.city}</div>
                                            </div>
                                        </div>

                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium flex items-center gap-2"><Clock className="w-5 h-5 text-warning-500" /> Rotina</h3>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center gap-2 text-orange-800 dark:text-orange-200"><Sunrise className="w-4 h-4" /> {selectedPatient.wakeUpTime}</div>
                                                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center gap-2 text-yellow-800 dark:text-yellow-200"><Coffee className="w-4 h-4" /> {selectedPatient.breakfastTime}</div>
                                                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center gap-2 text-green-800 dark:text-green-200"><UtensilsCrossed className="w-4 h-4" /> {selectedPatient.lunchTime}</div>
                                                <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center gap-2 text-orange-800 dark:text-orange-200"><Sunset className="w-4 h-4" /> {selectedPatient.dinnerTime}</div>
                                            </div>
                                        </div>

                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium flex items-center gap-2 text-error-600"><Phone className="w-5 h-5" /> Contatos de Emergência</h3>
                                            {selectedPatient.emergencyContacts.map((c, i) => (
                                                <a key={i} href={`tel:${c.phone}`} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                                                    <div><p className="font-medium">{c.name}</p><p className="text-sm text-neutral-500">{c.relation}</p></div>
                                                    <Phone className="w-5 h-5 text-brand-600" />
                                                </a>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Diagnósticos */}
                                {activeSection === 'health' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        {selectedPatient.neurologicalConditions.length > 0 && (
                                            <div className="card p-4 space-y-2">
                                                <h3 className="font-medium flex items-center gap-2"><Brain className="w-5 h-5 text-purple-500" /> Neurológico</h3>
                                                {selectedPatient.neurologicalConditions.map((c, i) => <div key={i} className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-sm text-purple-800 dark:text-purple-200">{c}</div>)}
                                            </div>
                                        )}
                                        {selectedPatient.cardiovascularConditions.length > 0 && (
                                            <div className="card p-4 space-y-2">
                                                <h3 className="font-medium flex items-center gap-2"><Heart className="w-5 h-5 text-red-500 dark:text-red-400" /> Cardiovascular</h3>
                                                {selectedPatient.cardiovascularConditions.map((c, i) => <div key={i} className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-sm text-red-800 dark:text-red-200">{c}</div>)}
                                            </div>
                                        )}
                                        {selectedPatient.respiratoryConditions.length > 0 && (
                                            <div className="card p-4 space-y-2">
                                                <h3 className="font-medium flex items-center gap-2"><Wind className="w-5 h-5 text-cyan-500" /> Respiratório</h3>
                                                {selectedPatient.respiratoryConditions.map((c, i) => <div key={i} className="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg text-sm text-cyan-800 dark:text-cyan-200">{c}</div>)}
                                            </div>
                                        )}
                                        {selectedPatient.dietaryRestrictions.length > 0 && (
                                            <div className="card p-4 space-y-2">
                                                <h3 className="font-medium flex items-center gap-2"><Apple className="w-5 h-5 text-green-500" /> Dieta</h3>
                                                {selectedPatient.dietaryRestrictions.map((d, i) => <div key={i} className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-sm text-green-800 dark:text-green-200">{d}</div>)}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Medicações */}
                                {activeSection === 'meds' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium">Prescrição Atual ({selectedPatient.medications.length})</h3>
                                            {selectedPatient.medications.map((med, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                                                    <div>
                                                        <p className="font-medium">{med.name}</p>
                                                        <p className="text-sm text-neutral-500">{med.dose} • {med.route}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-purple-600 dark:text-purple-300">{med.schedule}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Dispositivos */}
                                {activeSection === 'devices' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium flex items-center gap-2"><Stethoscope className="w-5 h-5 text-brand-500" /> Dispositivos em Uso</h3>
                                            {selectedPatient.devices.map((d, i) => (
                                                <div key={i} className="p-3 bg-brand-50 rounded-xl text-sm font-medium">{d}</div>
                                            ))}
                                            {selectedPatient.devices.length === 0 && (
                                                <p className="text-neutral-400 text-center py-4">Nenhum dispositivo</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Registros */}
                                {activeSection === 'occurrences' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        <button onClick={() => setShowNewOccurrence(true)} className="w-full btn-primary">
                                            <Plus className="w-5 h-5 mr-2" />
                                            Novo Registro
                                        </button>
                                        <div className="space-y-3">
                                            {(localOccurrences[selectedPatient.id] || []).map((occ) => {
                                                const config = getOccurrenceConfig(occ.type);
                                                return (
                                                    <div key={occ.id} className={cn('card p-4 border-l-4', occ.severity === 'critical' ? 'border-l-error-500' : occ.severity === 'warning' ? 'border-l-warning-500' : 'border-l-blue-500')}>
                                                        <div className="flex items-start gap-3">
                                                            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', config.color)}>
                                                                <config.icon className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="font-medium">{occ.title}</h4>
                                                                    {occ.syncStatus === 'synced' ? <Cloud className="w-4 h-4 text-success-500" /> : <CloudOff className="w-4 h-4 text-warning-500" />}
                                                                </div>
                                                                <p className="text-sm text-neutral-600 mt-1">{occ.description}</p>
                                                                <div className="flex items-center justify-between mt-2 text-xs text-neutral-400">
                                                                    <span>{occ.date.toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                                    <span>{occ.createdBy}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* New Occurrence Modal */}
            <AnimatePresence>
                {showNewOccurrence && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[60] flex items-end" onClick={() => setShowNewOccurrence(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
                                <h2 className="text-lg font-semibold">Novo Registro</h2>
                                <button onClick={() => setShowNewOccurrence(false)} className="p-2"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tipo</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: 'vital_signs', label: 'Sinais Vitais', icon: Activity },
                                            { value: 'evolution', label: 'Evolução', icon: FileText },
                                            { value: 'procedure', label: 'Procedimento', icon: Stethoscope },
                                            { value: 'medication', label: 'Medicação', icon: Pill },
                                            { value: 'incident', label: 'Incidente', icon: AlertTriangle },
                                            { value: 'observation', label: 'Observação', icon: FileText },
                                        ].map(t => (
                                            <button key={t.value} onClick={() => setNewOccurrence({ ...newOccurrence, type: t.value as NursingOccurrence['type'] })} className={cn('flex flex-col items-center gap-1 p-3 rounded-xl border-2', newOccurrence.type === t.value ? 'border-brand-500 bg-brand-50' : 'border-neutral-200')}>
                                                <t.icon className={cn('w-5 h-5', newOccurrence.type === t.value ? 'text-brand-600' : 'text-neutral-400')} />
                                                <span className="text-xs">{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Vital Signs Fields */}
                                {newOccurrence.type === 'vital_signs' && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <div><label className="block text-xs mb-1">PA</label><input type="text" placeholder="120/80" value={newOccurrence.vitalSigns.bloodPressure} onChange={(e) => setNewOccurrence({ ...newOccurrence, vitalSigns: { ...newOccurrence.vitalSigns, bloodPressure: e.target.value } })} className="input-primary text-sm" /></div>
                                        <div><label className="block text-xs mb-1">FC</label><input type="number" placeholder="80" value={newOccurrence.vitalSigns.heartRate} onChange={(e) => setNewOccurrence({ ...newOccurrence, vitalSigns: { ...newOccurrence.vitalSigns, heartRate: e.target.value } })} className="input-primary text-sm" /></div>
                                        <div><label className="block text-xs mb-1">SpO₂%</label><input type="number" placeholder="98" value={newOccurrence.vitalSigns.oxygenSaturation} onChange={(e) => setNewOccurrence({ ...newOccurrence, vitalSigns: { ...newOccurrence.vitalSigns, oxygenSaturation: e.target.value } })} className="input-primary text-sm" /></div>
                                        <div><label className="block text-xs mb-1">Temp°C</label><input type="number" step="0.1" placeholder="36.5" value={newOccurrence.vitalSigns.temperature} onChange={(e) => setNewOccurrence({ ...newOccurrence, vitalSigns: { ...newOccurrence.vitalSigns, temperature: e.target.value } })} className="input-primary text-sm" /></div>
                                        <div><label className="block text-xs mb-1">FR</label><input type="number" placeholder="18" value={newOccurrence.vitalSigns.respiratoryRate} onChange={(e) => setNewOccurrence({ ...newOccurrence, vitalSigns: { ...newOccurrence.vitalSigns, respiratoryRate: e.target.value } })} className="input-primary text-sm" /></div>
                                        <div><label className="block text-xs mb-1">Dor</label><input type="number" max="10" placeholder="0" value={newOccurrence.vitalSigns.pain} onChange={(e) => setNewOccurrence({ ...newOccurrence, vitalSigns: { ...newOccurrence.vitalSigns, pain: e.target.value } })} className="input-primary text-sm" /></div>
                                        <div className="col-span-3"><label className="block text-xs mb-1">Glicemia</label><input type="number" placeholder="100" value={newOccurrence.vitalSigns.glucose} onChange={(e) => setNewOccurrence({ ...newOccurrence, vitalSigns: { ...newOccurrence.vitalSigns, glucose: e.target.value } })} className="input-primary text-sm" /></div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-2">Título</label>
                                    <input type="text" value={newOccurrence.title} onChange={(e) => setNewOccurrence({ ...newOccurrence, title: e.target.value })} placeholder="Ex: Curativo realizado, Evolução 14h..." className="input-primary" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Descrição</label>
                                    <textarea value={newOccurrence.description} onChange={(e) => setNewOccurrence({ ...newOccurrence, description: e.target.value })} placeholder="Descreva em detalhes..." rows={4} className="input-primary resize-none" />
                                </div>

                                <button onClick={handleAddOccurrence} disabled={!newOccurrence.title} className="w-full btn-primary disabled:opacity-50">
                                    <Save className="w-5 h-5 mr-2" />
                                    Salvar Registro
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
