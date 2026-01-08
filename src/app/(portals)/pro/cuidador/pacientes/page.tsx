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
    Star,
    Moon,
    Sun,
    Sunrise,
    Sunset,
    Coffee,
    UtensilsCrossed,
    Bed,
    Music,
    Book,
    Users,
    Home,
    Shield,
    Droplets,
    Wind,
    PersonStanding,
    Thermometer,
    AlertCircle,
    Edit3,
    Save,
    Camera,
    FileText,
    ClipboardList,
    MessageCircle,
    Check,
    Cloud,
    CloudOff,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Types
interface Occurrence {
    id: string;
    date: Date;
    type: 'observation' | 'incident' | 'medication' | 'vital_signs' | 'behavior' | 'family_contact';
    title: string;
    description: string;
    severity: 'info' | 'warning' | 'critical';
    syncStatus: 'synced' | 'pending';
    createdBy: string;
}

interface PatientComplete {
    id: string;
    // Basic Info
    fullName: string;
    preferredName: string;
    birthDate: string;
    age: number;
    phone: string;
    address: string;
    city: string;
    maritalStatus: string;
    previousOccupation: string;
    // Routine
    wakeUpTime: string;
    breakfastTime: string;
    lunchTime: string;
    takesNap: boolean;
    dinnerTime: string;
    bedTime: string;
    sleepQuality: string;
    nightWakeups: number;
    // Preferences
    temperament: string;
    hobbies: string[];
    preferences: string[];
    // Health
    neurologicalConditions: string[];
    cardiovascularConditions: string[];
    respiratoryConditions: string[];
    mobilityConditions: string[];
    otherConditions: string[];
    allergies: string[];
    dietaryRestrictions: string[];
    medications: { name: string; dose: string; schedule: string }[];
    // Clinical Scores
    abemidScore: number;
    abemidClassification: string;
    katzScore: number;
    katzClassification: string;
    lawtonScore: number;
    lawtonClassification: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    indicatedProfessional: string;
    // Emergency Contacts
    emergencyContacts: { name: string; relation: string; phone: string }[];
    // Status
    status: 'active' | 'hospital' | 'paused';
    careStartDate: string;
    lastVisit: string;
}

// Mock complete patient data based on evaluation form
const mockPatients: PatientComplete[] = [
    {
        id: '1',
        fullName: 'Maria da Silva Santos',
        preferredName: 'Dona Maria',
        birthDate: '1942-05-15',
        age: 82,
        phone: '(45) 99999-1234',
        address: 'Rua das Flores, 123 - Apt 501',
        city: 'Foz do Iguaçu, PR',
        maritalStatus: 'Viúva',
        previousOccupation: 'Professora',
        wakeUpTime: '07:00',
        breakfastTime: '08:00',
        lunchTime: '12:00',
        takesNap: true,
        dinnerTime: '19:00',
        bedTime: '21:00',
        sleepQuality: 'Acorda para ir ao banheiro',
        nightWakeups: 2,
        temperament: 'Calma e tranquila',
        hobbies: ['Música', 'Leitura', 'Novelas', 'Artesanato'],
        preferences: ['Gosta de conversar', 'Prefere banho morno', 'Não gosta de comida muito condimentada'],
        neurologicalConditions: ['Alzheimer (fase inicial)'],
        cardiovascularConditions: ['Hipertensão arterial'],
        respiratoryConditions: [],
        mobilityConditions: ['Usa bengala'],
        otherConditions: ['Diabetes tipo 2'],
        allergies: ['Dipirona'],
        dietaryRestrictions: ['Dieta diabética', 'Baixo sódio'],
        medications: [
            { name: 'Donepezila', dose: '10mg', schedule: '08:00' },
            { name: 'Losartana', dose: '50mg', schedule: '08:00' },
            { name: 'Metformina', dose: '850mg', schedule: '08:00, 20:00' },
            { name: 'AAS', dose: '100mg', schedule: '12:00' },
        ],
        abemidScore: 8,
        abemidClassification: 'Cuidador de Idosos',
        katzScore: 4,
        katzClassification: 'Dependência moderada',
        lawtonScore: 5,
        lawtonClassification: 'Necessita assistência',
        riskLevel: 'medium',
        indicatedProfessional: 'Cuidador de Idosos',
        emergencyContacts: [
            { name: 'Carlos Santos', relation: 'Filho', phone: '(45) 99888-1111' },
            { name: 'Ana Paula Santos', relation: 'Filha', phone: '(45) 99777-2222' },
        ],
        status: 'active',
        careStartDate: '2024-01-15',
        lastVisit: '2024-01-07',
    },
    {
        id: '2',
        fullName: 'João Pedro Oliveira',
        preferredName: 'Seu João',
        birthDate: '1940-10-22',
        age: 84,
        phone: '(45) 99999-5678',
        address: 'Av. Brasil, 456 - Casa',
        city: 'Foz do Iguaçu, PR',
        maritalStatus: 'Casado',
        previousOccupation: 'Comerciante',
        wakeUpTime: '06:00',
        breakfastTime: '07:00',
        lunchTime: '12:00',
        takesNap: false,
        dinnerTime: '18:30',
        bedTime: '20:30',
        sleepQuality: 'Insônia frequente',
        nightWakeups: 4,
        temperament: 'Comunicativo e sociável',
        hobbies: ['Televisão', 'Conversar', 'Jogar cartas'],
        preferences: ['Gosta de café forte', 'Prefere banho de manhã', 'Assiste jornal às 20h'],
        neurologicalConditions: ['AVC (2023) - Hemiparesia esquerda'],
        cardiovascularConditions: ['Hipertensão', 'Arritmia'],
        respiratoryConditions: ['DPOC'],
        mobilityConditions: ['Cadeira de rodas'],
        otherConditions: [],
        allergies: [],
        dietaryRestrictions: ['Baixo sódio', 'Líquidos espessados'],
        medications: [
            { name: 'Clopidogrel', dose: '75mg', schedule: '08:00' },
            { name: 'Sinvastatina', dose: '40mg', schedule: '20:00' },
            { name: 'Amiodarona', dose: '200mg', schedule: '12:00' },
            { name: 'Omeprazol', dose: '20mg', schedule: '07:00' },
        ],
        abemidScore: 14,
        abemidClassification: 'Técnico de Enfermagem',
        katzScore: 8,
        katzClassification: 'Dependência severa',
        lawtonScore: 2,
        lawtonClassification: 'Totalmente dependente',
        riskLevel: 'high',
        indicatedProfessional: 'Técnico de Enfermagem',
        emergencyContacts: [
            { name: 'Maria Oliveira', relation: 'Esposa', phone: '(45) 99666-3333' },
            { name: 'Pedro Oliveira', relation: 'Filho', phone: '(45) 99555-4444' },
        ],
        status: 'active',
        careStartDate: '2023-11-01',
        lastVisit: '2024-01-07',
    },
];

// Mock occurrences
const mockOccurrences: Record<string, Occurrence[]> = {
    '1': [
        { id: 'o1', date: new Date(), type: 'observation', title: 'Humor melhor hoje', description: 'Paciente acordou bem disposta, conversou bastante durante o café.', severity: 'info', syncStatus: 'synced', createdBy: 'Cuidador Ana' },
        { id: 'o2', date: new Date(Date.now() - 24 * 60 * 60 * 1000), type: 'vital_signs', title: 'Sinais vitais', description: 'PA: 130/85, FC: 72, Glicemia: 128mg/dL', severity: 'info', syncStatus: 'synced', createdBy: 'Cuidador Ana' },
        { id: 'o3', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), type: 'incident', title: 'Quase queda', description: 'Paciente escorregou no banheiro mas foi amparada. Sem lesões. Orientada a chamar para ir ao banheiro.', severity: 'warning', syncStatus: 'synced', createdBy: 'Cuidador Ana' },
        { id: 'o4', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), type: 'medication', title: 'Medicação recusada', description: 'Paciente recusou tomar Metformina da noite. Alegou mal estar estomacal.', severity: 'warning', syncStatus: 'synced', createdBy: 'Cuidador Ana' },
    ],
    '2': [
        { id: 'o5', date: new Date(), type: 'vital_signs', title: 'Sinais vitais', description: 'PA: 145/95, FC: 88, SpO2: 92%', severity: 'warning', syncStatus: 'synced', createdBy: 'Cuidador Pedro' },
        { id: 'o6', date: new Date(Date.now() - 24 * 60 * 60 * 1000), type: 'behavior', title: 'Agitação noturna', description: 'Paciente acordou agitado às 3h, pedindo para sair de casa. Acalmado após conversa.', severity: 'warning', syncStatus: 'synced', createdBy: 'Cuidador Pedro' },
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

const getOccurrenceConfig = (type: Occurrence['type']) => {
    switch (type) {
        case 'observation': return { icon: FileText, color: 'bg-blue-100 text-blue-600' };
        case 'incident': return { icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' };
        case 'medication': return { icon: Pill, color: 'bg-purple-100 text-purple-600' };
        case 'vital_signs': return { icon: Activity, color: 'bg-green-100 text-green-600' };
        case 'behavior': return { icon: Brain, color: 'bg-pink-100 text-pink-600' };
        case 'family_contact': return { icon: Users, color: 'bg-cyan-100 text-cyan-600' };
    }
};

const getSeverityStyle = (severity: Occurrence['severity']) => {
    switch (severity) {
        case 'info': return 'border-l-blue-500';
        case 'warning': return 'border-l-warning-500';
        case 'critical': return 'border-l-error-500';
    }
};

export default function CuidadorPacientesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<PatientComplete | null>(null);
    const [activeSection, setActiveSection] = useState<string>('info');
    const [showNewOccurrence, setShowNewOccurrence] = useState(false);
    const [newOccurrence, setNewOccurrence] = useState({
        type: 'observation' as Occurrence['type'],
        title: '',
        description: '',
        severity: 'info' as Occurrence['severity'],
    });
    const [localOccurrences, setLocalOccurrences] = useState<Record<string, Occurrence[]>>(mockOccurrences);

    const filteredPatients = mockPatients.filter(p =>
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.preferredName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddOccurrence = () => {
        if (!selectedPatient || !newOccurrence.title || !newOccurrence.description) return;

        const occurrence: Occurrence = {
            id: `new-${Date.now()}`,
            date: new Date(),
            type: newOccurrence.type,
            title: newOccurrence.title,
            description: newOccurrence.description,
            severity: newOccurrence.severity,
            syncStatus: 'pending',
            createdBy: 'Você',
        };

        setLocalOccurrences(prev => ({
            ...prev,
            [selectedPatient.id]: [occurrence, ...(prev[selectedPatient.id] || [])],
        }));

        setNewOccurrence({ type: 'observation', title: '', description: '', severity: 'info' });
        setShowNewOccurrence(false);
    };

    const sections = [
        { id: 'info', label: 'Informações', icon: User },
        { id: 'routine', label: 'Rotina', icon: Clock },
        { id: 'health', label: 'Saúde', icon: Heart },
        { id: 'meds', label: 'Medicações', icon: Pill },
        { id: 'scores', label: 'Avaliações', icon: ClipboardList },
        { id: 'occurrences', label: 'Ocorrências', icon: FileText },
    ];

    return (
        <div className="space-y-4 pb-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-brand-500" />
                    Meus Pacientes
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                    {mockPatients.filter(p => p.status === 'active').length} pacientes ativos
                </p>
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
                    placeholder="Buscar paciente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-primary pl-10"
                />
            </motion.div>

            {/* Patient List */}
            <div className="space-y-3">
                {filteredPatients.map((patient, index) => (
                    <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedPatient(patient)}
                        className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-7 h-7 text-brand-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-neutral-900 truncate">
                                        {patient.preferredName}
                                    </h3>
                                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getRiskColor(patient.riskLevel))}>
                                        {patient.riskLevel === 'low' ? 'Baixo' : patient.riskLevel === 'medium' ? 'Médio' : patient.riskLevel === 'high' ? 'Alto' : 'Crítico'}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-500">{patient.fullName}</p>
                                <p className="text-xs text-neutral-400 mt-1">{patient.age} anos • {patient.indicatedProfessional}</p>

                                {/* Quick health info */}
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {patient.neurologicalConditions.length > 0 && (
                                        <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-xs">
                                            {patient.neurologicalConditions[0].split(' ')[0]}
                                        </span>
                                    )}
                                    {patient.mobilityConditions.length > 0 && (
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                                            {patient.mobilityConditions[0]}
                                        </span>
                                    )}
                                    {patient.allergies.length > 0 && (
                                        <span className="px-2 py-0.5 bg-error-50 text-error-600 rounded text-xs flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            Alergia
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Patient Detail Modal */}
            <AnimatePresence>
                {selectedPatient && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setSelectedPatient(null)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-neutral-900 overflow-y-auto pb-20"
                        >
                            {/* Patient Header */}
                            <div className="sticky top-0 bg-gradient-to-b from-brand-500 to-brand-600 text-white p-4 z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <button onClick={() => setSelectedPatient(null)}>
                                        <X className="w-6 h-6" />
                                    </button>
                                    <span className={cn('px-3 py-1 rounded-full text-xs font-medium',
                                        selectedPatient.status === 'active' ? 'bg-white/20' : 'bg-error-500'
                                    )}>
                                        {selectedPatient.status === 'active' ? 'Ativo' : 'Hospitalizado'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                                        <User className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{selectedPatient.preferredName}</h2>
                                        <p className="text-white/80 text-sm">{selectedPatient.fullName}</p>
                                        <p className="text-white/60 text-sm mt-1">{selectedPatient.age} anos • {selectedPatient.maritalStatus}</p>
                                    </div>
                                </div>

                                {/* Allergies alert */}
                                {selectedPatient.allergies.length > 0 && (
                                    <div className="mt-4 p-3 bg-error-500 rounded-xl flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                        <div className="text-sm">
                                            <span className="font-medium">ALERGIA: </span>
                                            {selectedPatient.allergies.join(', ')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section Tabs */}
                            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b dark:border-neutral-700 z-10 shadow-sm">
                                <div className="flex p-2 gap-1 overflow-x-auto scrollbar-hide min-w-0">
                                    {sections.map(section => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={cn(
                                                'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0',
                                                activeSection === section.id
                                                    ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                                                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                            )}
                                        >
                                            <section.icon className="w-4 h-4" />
                                            {section.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-4">
                                {/* Informações Pessoais */}
                                {activeSection === 'info' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium flex items-center gap-2">
                                                <User className="w-5 h-5 text-brand-500" />
                                                Dados Pessoais
                                            </h3>
                                            <div className="grid gap-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-neutral-400" />
                                                    <span>Nascimento: {new Date(selectedPatient.birthDate).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-neutral-400" />
                                                    <span>{selectedPatient.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-neutral-400" />
                                                    <span>{selectedPatient.address}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Home className="w-4 h-4 text-neutral-400" />
                                                    <span>{selectedPatient.city}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium flex items-center gap-2">
                                                <Brain className="w-5 h-5 text-purple-500" />
                                                Temperamento e Preferências
                                            </h3>
                                            <div className="p-2 bg-purple-50 rounded-lg text-sm">
                                                <span className="font-medium">Temperamento: </span>
                                                {selectedPatient.temperament}
                                            </div>
                                            <div>
                                                <p className="text-sm text-neutral-500 mb-2">Hobbies:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedPatient.hobbies.map((hobby, i) => (
                                                        <span key={i} className="px-2 py-1 bg-neutral-100 rounded text-sm">{hobby}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-neutral-500 mb-2">Preferências:</p>
                                                <ul className="space-y-1">
                                                    {selectedPatient.preferences.map((pref, i) => (
                                                        <li key={i} className="text-sm flex items-start gap-2">
                                                            <Check className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                                                            {pref}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium flex items-center gap-2">
                                                <Phone className="w-5 h-5 text-error-500" />
                                                Contatos de Emergência
                                            </h3>
                                            {selectedPatient.emergencyContacts.map((contact, i) => (
                                                <a
                                                    key={i}
                                                    href={`tel:${contact.phone}`}
                                                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                                                >
                                                    <div>
                                                        <p className="font-medium">{contact.name}</p>
                                                        <p className="text-sm text-neutral-500">{contact.relation}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-brand-600">
                                                        <Phone className="w-5 h-5" />
                                                        <span className="text-sm">{contact.phone}</span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Rotina */}
                                {activeSection === 'routine' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium flex items-center gap-2">
                                                <Sun className="w-5 h-5 text-warning-500" />
                                                Rotina Diária
                                            </h3>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                                                    <span className="flex items-center gap-2 text-sm text-orange-800 dark:text-orange-200"><Sunrise className="w-4 h-4" /> Acordar</span>
                                                    <span className="font-medium text-orange-900 dark:text-orange-100">{selectedPatient.wakeUpTime}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                                                    <span className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200"><Coffee className="w-4 h-4" /> Café da manhã</span>
                                                    <span className="font-medium text-yellow-900 dark:text-yellow-100">{selectedPatient.breakfastTime}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                                    <span className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200"><UtensilsCrossed className="w-4 h-4" /> Almoço</span>
                                                    <span className="font-medium text-green-900 dark:text-green-100">{selectedPatient.lunchTime}</span>
                                                </div>
                                                {selectedPatient.takesNap && (
                                                    <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                                        <span className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200"><Bed className="w-4 h-4" /> Cochilo</span>
                                                        <span className="font-medium text-blue-900 dark:text-blue-100">Sim</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                                                    <span className="flex items-center gap-2 text-sm text-orange-800 dark:text-orange-200"><Sunset className="w-4 h-4" /> Jantar</span>
                                                    <span className="font-medium text-orange-900 dark:text-orange-100">{selectedPatient.dinnerTime}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                                                    <span className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200"><Moon className="w-4 h-4" /> Dormir</span>
                                                    <span className="font-medium text-purple-900 dark:text-purple-100">{selectedPatient.bedTime}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium flex items-center gap-2">
                                                <Moon className="w-5 h-5 text-indigo-500" />
                                                Sono
                                            </h3>
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                                <p className="text-sm font-medium text-indigo-700 dark:text-indigo-200">{selectedPatient.sleepQuality}</p>
                                                <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-1">
                                                    Acorda {selectedPatient.nightWakeups}x por noite
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Saúde */}
                                {activeSection === 'health' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        {selectedPatient.neurologicalConditions.length > 0 && (
                                            <div className="card p-4 space-y-2">
                                                <h3 className="font-medium flex items-center gap-2">
                                                    <Brain className="w-5 h-5 text-purple-500" />
                                                    Condições Neurológicas
                                                </h3>
                                                {selectedPatient.neurologicalConditions.map((c, i) => (
                                                    <div key={i} className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-sm text-purple-800 dark:text-purple-200">{c}</div>
                                                ))}
                                            </div>
                                        )}

                                        {selectedPatient.cardiovascularConditions.length > 0 && (
                                            <div className="card p-4 space-y-2">
                                                <h3 className="font-medium flex items-center gap-2">
                                                    <Heart className="w-5 h-5 text-error-500" />
                                                    Condições Cardiovasculares
                                                </h3>
                                                {selectedPatient.cardiovascularConditions.map((c, i) => (
                                                    <div key={i} className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-sm text-red-800 dark:text-red-200">{c}</div>
                                                ))}
                                            </div>
                                        )}

                                        {selectedPatient.respiratoryConditions.length > 0 && (
                                            <div className="card p-4 space-y-2">
                                                <h3 className="font-medium flex items-center gap-2">
                                                    <Wind className="w-5 h-5 text-cyan-500" />
                                                    Condições Respiratórias
                                                </h3>
                                                {selectedPatient.respiratoryConditions.map((c, i) => (
                                                    <div key={i} className="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg text-sm text-cyan-800 dark:text-cyan-200">{c}</div>
                                                ))}
                                            </div>
                                        )}

                                        {selectedPatient.mobilityConditions.length > 0 && (
                                            <div className="card p-4 space-y-2">
                                                <h3 className="font-medium flex items-center gap-2">
                                                    <PersonStanding className="w-5 h-5 text-blue-500" />
                                                    Mobilidade
                                                </h3>
                                                {selectedPatient.mobilityConditions.map((c, i) => (
                                                    <div key={i} className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-800 dark:text-blue-200">{c}</div>
                                                ))}
                                            </div>
                                        )}

                                        {selectedPatient.allergies.length > 0 && (
                                            <div className="card p-4 space-y-2 border-2 border-red-200 dark:border-red-800">
                                                <h3 className="font-medium flex items-center gap-2 text-red-600 dark:text-red-400">
                                                    <AlertTriangle className="w-5 h-5" />
                                                    ALERGIAS
                                                </h3>
                                                {selectedPatient.allergies.map((a, i) => (
                                                    <div key={i} className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-sm font-medium text-red-700 dark:text-red-200">{a}</div>
                                                ))}
                                            </div>
                                        )}

                                        {selectedPatient.dietaryRestrictions.length > 0 && (
                                            <div className="card p-4 space-y-2">
                                                <h3 className="font-medium flex items-center gap-2">
                                                    <Apple className="w-5 h-5 text-green-500" />
                                                    Restrições Alimentares
                                                </h3>
                                                {selectedPatient.dietaryRestrictions.map((d, i) => (
                                                    <div key={i} className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-sm text-green-800 dark:text-green-200">{d}</div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Medicações */}
                                {activeSection === 'meds' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium flex items-center gap-2">
                                                <Pill className="w-5 h-5 text-purple-500" />
                                                Medicações Diárias ({selectedPatient.medications.length})
                                            </h3>
                                            <div className="space-y-2">
                                                {selectedPatient.medications.map((med, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                                                        <div>
                                                            <p className="font-medium">{med.name}</p>
                                                            <p className="text-sm text-neutral-500">{med.dose}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="flex items-center gap-1 text-purple-600">
                                                                <Clock className="w-4 h-4" />
                                                                <span className="text-sm font-medium">{med.schedule}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Avaliações Clínicas */}
                                {activeSection === 'scores' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        <div className="card p-4 space-y-3">
                                            <h3 className="font-medium flex items-center gap-2">
                                                <ClipboardList className="w-5 h-5 text-brand-500" />
                                                Escalas de Avaliação
                                            </h3>

                                            <div className="p-3 bg-brand-50 rounded-xl">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium">ABEMID</span>
                                                    <span className="text-xl font-bold text-brand-600">{selectedPatient.abemidScore}</span>
                                                </div>
                                                <p className="text-sm text-neutral-600">{selectedPatient.abemidClassification}</p>
                                            </div>

                                            <div className="p-3 bg-success-50 rounded-xl">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium">KATZ (AVDs)</span>
                                                    <span className="text-xl font-bold text-success-600">{selectedPatient.katzScore}</span>
                                                </div>
                                                <p className="text-sm text-neutral-600">{selectedPatient.katzClassification}</p>
                                            </div>

                                            <div className="p-3 bg-purple-50 rounded-xl">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium">LAWTON (AIVDs)</span>
                                                    <span className="text-xl font-bold text-purple-600">{selectedPatient.lawtonScore}</span>
                                                </div>
                                                <p className="text-sm text-neutral-600">{selectedPatient.lawtonClassification}</p>
                                            </div>
                                        </div>

                                        <div className="card p-4">
                                            <h3 className="font-medium mb-3 flex items-center gap-2">
                                                <Shield className="w-5 h-5 text-warning-500" />
                                                Nível de Risco
                                            </h3>
                                            <div className={cn('p-4 rounded-xl text-center', getRiskColor(selectedPatient.riskLevel))}>
                                                <p className="text-2xl font-bold uppercase">{selectedPatient.riskLevel === 'low' ? 'Baixo' : selectedPatient.riskLevel === 'medium' ? 'Médio' : selectedPatient.riskLevel === 'high' ? 'Alto' : 'Crítico'}</p>
                                                <p className="text-sm mt-1">Profissional indicado: {selectedPatient.indicatedProfessional}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Ocorrências */}
                                {activeSection === 'occurrences' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        {/* Add new occurrence button */}
                                        <button
                                            onClick={() => setShowNewOccurrence(true)}
                                            className="w-full btn-primary"
                                        >
                                            <Plus className="w-5 h-5 mr-2" />
                                            Nova Ocorrência
                                        </button>

                                        {/* Occurrences list */}
                                        <div className="space-y-3">
                                            {(localOccurrences[selectedPatient.id] || []).map((occ) => {
                                                const config = getOccurrenceConfig(occ.type);
                                                return (
                                                    <div
                                                        key={occ.id}
                                                        className={cn('card p-4 border-l-4', getSeverityStyle(occ.severity))}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', config.color)}>
                                                                <config.icon className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="font-medium">{occ.title}</h4>
                                                                    {occ.syncStatus === 'synced' ? (
                                                                        <Cloud className="w-4 h-4 text-success-500" />
                                                                    ) : (
                                                                        <CloudOff className="w-4 h-4 text-warning-500" />
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-neutral-600 mt-1">{occ.description}</p>
                                                                <div className="flex items-center justify-between mt-2 text-xs text-neutral-400">
                                                                    <span>{occ.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                                    <span>{occ.createdBy}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {(localOccurrences[selectedPatient.id] || []).length === 0 && (
                                                <div className="text-center py-8 text-neutral-400">
                                                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                    <p>Nenhuma ocorrência registrada</p>
                                                </div>
                                            )}
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[60] flex items-end"
                        onClick={() => setShowNewOccurrence(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
                                <h2 className="text-lg font-semibold">Nova Ocorrência</h2>
                                <button onClick={() => setShowNewOccurrence(false)} className="p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* Type selector */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tipo de Ocorrência</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: 'observation', label: 'Observação', icon: FileText },
                                            { value: 'incident', label: 'Incidente', icon: AlertTriangle },
                                            { value: 'vital_signs', label: 'Sinais Vitais', icon: Activity },
                                            { value: 'medication', label: 'Medicação', icon: Pill },
                                            { value: 'behavior', label: 'Comportamento', icon: Brain },
                                            { value: 'family_contact', label: 'Família', icon: Users },
                                        ].map(type => (
                                            <button
                                                key={type.value}
                                                onClick={() => setNewOccurrence({ ...newOccurrence, type: type.value as Occurrence['type'] })}
                                                className={cn(
                                                    'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors',
                                                    newOccurrence.type === type.value
                                                        ? 'border-brand-500 bg-brand-50'
                                                        : 'border-neutral-200 hover:border-neutral-300'
                                                )}
                                            >
                                                <type.icon className={cn('w-5 h-5', newOccurrence.type === type.value ? 'text-brand-600' : 'text-neutral-400')} />
                                                <span className="text-xs">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Severity */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Severidade</label>
                                    <div className="flex gap-2">
                                        {[
                                            { value: 'info', label: 'Informativo', color: 'bg-blue-100 text-blue-700 border-blue-300' },
                                            { value: 'warning', label: 'Atenção', color: 'bg-warning-100 text-warning-700 border-warning-300' },
                                            { value: 'critical', label: 'Crítico', color: 'bg-error-100 text-error-700 border-error-300' },
                                        ].map(sev => (
                                            <button
                                                key={sev.value}
                                                onClick={() => setNewOccurrence({ ...newOccurrence, severity: sev.value as Occurrence['severity'] })}
                                                className={cn(
                                                    'flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-opacity',
                                                    sev.color,
                                                    newOccurrence.severity === sev.value ? 'opacity-100' : 'opacity-40'
                                                )}
                                            >
                                                {sev.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Título</label>
                                    <input
                                        type="text"
                                        value={newOccurrence.title}
                                        onChange={(e) => setNewOccurrence({ ...newOccurrence, title: e.target.value })}
                                        placeholder="Ex: Sinais vitais, Queda, Medicação recusada..."
                                        className="input-primary"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Descrição</label>
                                    <textarea
                                        value={newOccurrence.description}
                                        onChange={(e) => setNewOccurrence({ ...newOccurrence, description: e.target.value })}
                                        placeholder="Descreva a ocorrência em detalhes..."
                                        rows={4}
                                        className="input-primary resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleAddOccurrence}
                                    disabled={!newOccurrence.title || !newOccurrence.description}
                                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    Salvar Ocorrência
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
