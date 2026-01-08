'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Settings,
    Bell,
    Moon,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    Camera,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award,
    Clock,
    FileText,
    ToggleLeft,
    ToggleRight,
    X,
    Check,
    Edit3,
    Lock,
    MessageCircle,
    Smartphone,
    Volume2,
    VolumeX,
    Eye,
    EyeOff,
    Star,
    TrendingUp,
    Activity,
    Heart,
    ChevronDown,
    AlertCircle,
    Briefcase,
    GraduationCap,
    Users,
    Save,
    Upload,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';

// Types
interface WorkHistory {
    id: string;
    date: Date;
    type: 'shift' | 'evolution' | 'patient' | 'training';
    title: string;
    description: string;
    duration?: number;
    patient?: string;
}

// Mock work history data
const mockWorkHistory: WorkHistory[] = [
    { id: '1', date: new Date(), type: 'shift', title: 'Plantão Diurno', description: 'Maria Silva - 82 anos', duration: 12, patient: 'Maria Silva' },
    { id: '2', date: new Date(Date.now() - 24 * 60 * 60 * 1000), type: 'evolution', title: 'Evolução Registrada', description: 'João Santos - Acompanhamento pós-AVC', patient: 'João Santos' },
    { id: '3', date: new Date(Date.now() - 24 * 60 * 60 * 1000), type: 'shift', title: 'Plantão Noturno', description: 'Ana Oliveira - 68 anos', duration: 12, patient: 'Ana Oliveira' },
    { id: '4', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), type: 'patient', title: 'Novo Paciente', description: 'Primeiro atendimento - Pedro Costa', patient: 'Pedro Costa' },
    { id: '5', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), type: 'training', title: 'Treinamento Concluído', description: 'Primeiros Socorros - Atualização' },
    { id: '6', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), type: 'shift', title: 'Plantão Diurno', description: 'Maria Silva - 82 anos', duration: 12, patient: 'Maria Silva' },
    { id: '7', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), type: 'evolution', title: 'Evolução Registrada', description: 'Ana Oliveira - Acompanhamento respiratório', patient: 'Ana Oliveira' },
];

// Monthly hours breakdown
const monthlyHours = [
    { month: 'Jan', hours: 168, target: 180 },
    { month: 'Fev', hours: 172, target: 180 },
    { month: 'Mar', hours: 180, target: 180 },
    { month: 'Abr', hours: 156, target: 180 },
    { month: 'Mai', hours: 188, target: 180 },
    { month: 'Jun', hours: 175, target: 180 },
    { month: 'Jul', hours: 180, target: 180 },
];

export default function PerfilPage() {
    const { user, logout } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile state
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || 'Administrador',
        email: user?.email || 'admin@maosamigas.com.br',
        phone: user?.phone || '(45) 99999-9999',
        bio: 'Cuidador(a) dedicado(a) com experiência em atendimento domiciliar para idosos.',
        emergencyContact: 'Carlos Silva - (45) 98888-7777',
        address: 'Foz do Iguaçu, PR',
    });

    // Settings toggles
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [shiftReminders, setShiftReminders] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    // Modals
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState<'hours' | 'shifts' | 'patients' | 'evolutions' | null>(null);

    // Security form
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [showCurrentPin, setShowCurrentPin] = useState(false);
    const [showNewPin, setShowNewPin] = useState(false);

    // Stats
    const stats = {
        hoursThisMonth: 180,
        totalShifts: 156,
        patientsServed: 24,
        evaluationsCompleted: 89,
        memberSince: new Date(2024, 0, 15),
        rating: 4.9,
    };

    // Handle photo upload
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePhoto(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Get stats modal content
    const getStatsModalContent = () => {
        switch (showStatsModal) {
            case 'hours':
                return {
                    title: 'Histórico de Horas',
                    icon: Clock,
                    content: (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <p className="text-4xl font-bold text-brand-600">{stats.hoursThisMonth}h</p>
                                <p className="text-neutral-500">Este mês</p>
                            </div>
                            <h4 className="font-medium">Histórico Mensal</h4>
                            <div className="space-y-3">
                                {monthlyHours.map((m, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <span className="w-10 text-sm text-neutral-500">{m.month}</span>
                                        <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    'h-full rounded-full transition-all',
                                                    m.hours >= m.target ? 'bg-success-500' : 'bg-brand-500'
                                                )}
                                                style={{ width: `${Math.min(100, (m.hours / m.target) * 100)}%` }}
                                            />
                                        </div>
                                        <span className="w-14 text-sm font-medium text-right">{m.hours}h</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-neutral-50 rounded-xl mt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">Total Anual</span>
                                    <span className="font-semibold">1.219 horas</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-neutral-500">Média Mensal</span>
                                    <span className="font-semibold">174 horas</span>
                                </div>
                            </div>
                        </div>
                    )
                };
            case 'shifts':
                return {
                    title: 'Histórico de Plantões',
                    icon: Calendar,
                    content: (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <p className="text-4xl font-bold text-success-600">{stats.totalShifts}</p>
                                <p className="text-neutral-500">Plantões totais</p>
                            </div>
                            <h4 className="font-medium">Últimos Plantões</h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {mockWorkHistory.filter(w => w.type === 'shift').map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-brand-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{item.title}</p>
                                            <p className="text-xs text-neutral-500">{item.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{item.duration}h</p>
                                            <p className="text-xs text-neutral-400">
                                                {item.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="p-3 bg-success-50 rounded-xl text-center">
                                    <p className="text-xl font-bold text-success-600">98%</p>
                                    <p className="text-xs text-neutral-500">Taxa de Presença</p>
                                </div>
                                <div className="p-3 bg-brand-50 rounded-xl text-center">
                                    <p className="text-xl font-bold text-brand-600">12</p>
                                    <p className="text-xs text-neutral-500">Este Mês</p>
                                </div>
                            </div>
                        </div>
                    )
                };
            case 'patients':
                return {
                    title: 'Pacientes Atendidos',
                    icon: Users,
                    content: (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <p className="text-4xl font-bold text-purple-600">{stats.patientsServed}</p>
                                <p className="text-neutral-500">Pacientes atendidos</p>
                            </div>
                            <h4 className="font-medium">Histórico de Pacientes</h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {['Maria Silva', 'João Santos', 'Ana Oliveira', 'Pedro Costa', 'Lucia Ferreira'].map((name, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <User className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{name}</p>
                                            <p className="text-xs text-neutral-500">{15 - idx * 2} atendimentos</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-warning-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="text-sm font-medium">5.0</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                    <span className="font-medium text-purple-700">Estatísticas</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-neutral-500">Média de atendimentos</p>
                                        <p className="font-semibold">6.5 por paciente</p>
                                    </div>
                                    <div>
                                        <p className="text-neutral-500">Avaliação média</p>
                                        <p className="font-semibold">4.9 ★</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                };
            case 'evolutions':
                return {
                    title: 'Evoluções Registradas',
                    icon: FileText,
                    content: (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <p className="text-4xl font-bold text-warning-600">{stats.evaluationsCompleted}</p>
                                <p className="text-neutral-500">Evoluções totais</p>
                            </div>
                            <h4 className="font-medium">Últimas Evoluções</h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {mockWorkHistory.filter(w => w.type === 'evolution').map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-warning-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{item.title}</p>
                                            <p className="text-xs text-neutral-500">{item.description}</p>
                                        </div>
                                        <p className="text-xs text-neutral-400">
                                            {item.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <div className="p-3 bg-blue-50 rounded-xl text-center">
                                    <p className="text-lg font-bold text-blue-600">45</p>
                                    <p className="text-xs text-neutral-500">Rotina</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-xl text-center">
                                    <p className="text-lg font-bold text-purple-600">32</p>
                                    <p className="text-xs text-neutral-500">Medicação</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-xl text-center">
                                    <p className="text-lg font-bold text-green-600">12</p>
                                    <p className="text-xs text-neutral-500">Procedimento</p>
                                </div>
                            </div>
                        </div>
                    )
                };
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4 pb-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <h1 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                    <User className="w-6 h-6 text-brand-500" />
                    Meu Perfil
                </h1>
                <button
                    onClick={() => setShowEditProfile(true)}
                    className="p-2 rounded-lg bg-brand-100 text-brand-600 hover:bg-brand-200 transition-colors"
                >
                    <Edit3 className="w-5 h-5" />
                </button>
            </motion.div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
            >
                <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                            {profilePhoto ? (
                                <img src={profilePhoto} alt="Foto de perfil" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-brand-600" />
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-brand-600 transition-colors"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold" suppressHydrationWarning>
                            {profileData.fullName}
                        </h2>
                        <p className="text-neutral-500">Cuidador(a) de Idosos</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-sm text-success-600">
                                <div className="w-2 h-2 rounded-full bg-success-500" />
                                Disponível
                            </div>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-warning-100 rounded-full">
                                <Star className="w-3.5 h-3.5 text-warning-500 fill-current" />
                                <span className="text-sm font-medium text-warning-700">{stats.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-neutral-600 mb-4 p-3 bg-neutral-50 rounded-xl">
                    {profileData.bio}
                </p>

                {/* Contact Info */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600">{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600">{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600">{profileData.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <AlertCircle className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600">Emergência: {profileData.emergencyContact}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600">
                            Membro desde {stats.memberSince.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Stats - CLICKABLE */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-3"
            >
                <button
                    onClick={() => setShowStatsModal('hours')}
                    className="card p-4 text-center hover:shadow-md transition-shadow"
                >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-brand-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-brand-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">{stats.hoursThisMonth}h</p>
                    <p className="text-xs text-neutral-500">Este mês</p>
                    <ChevronRight className="w-4 h-4 text-neutral-400 mx-auto mt-1" />
                </button>
                <button
                    onClick={() => setShowStatsModal('shifts')}
                    className="card p-4 text-center hover:shadow-md transition-shadow"
                >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-success-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-success-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">{stats.totalShifts}</p>
                    <p className="text-xs text-neutral-500">Plantões totais</p>
                    <ChevronRight className="w-4 h-4 text-neutral-400 mx-auto mt-1" />
                </button>
                <button
                    onClick={() => setShowStatsModal('patients')}
                    className="card p-4 text-center hover:shadow-md transition-shadow"
                >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">{stats.patientsServed}</p>
                    <p className="text-xs text-neutral-500">Pacientes atendidos</p>
                    <ChevronRight className="w-4 h-4 text-neutral-400 mx-auto mt-1" />
                </button>
                <button
                    onClick={() => setShowStatsModal('evolutions')}
                    className="card p-4 text-center hover:shadow-md transition-shadow"
                >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-warning-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-warning-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">{stats.evaluationsCompleted}</p>
                    <p className="text-xs text-neutral-500">Evoluções</p>
                    <ChevronRight className="w-4 h-4 text-neutral-400 mx-auto mt-1" />
                </button>
            </motion.div>

            {/* Certifications */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="card p-4"
            >
                <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-brand-500" />
                    Certificações
                </h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-success-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-success-600" />
                            <span className="text-sm font-medium text-success-700">Cuidador de Idosos</span>
                        </div>
                        <span className="text-xs text-success-600">Válido</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-success-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-success-600" />
                            <span className="text-sm font-medium text-success-700">Primeiros Socorros</span>
                        </div>
                        <span className="text-xs text-success-600">Válido</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-warning-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-warning-600" />
                            <span className="text-sm font-medium text-warning-700">BLS - Suporte Básico</span>
                        </div>
                        <span className="text-xs text-warning-600">Expira em 30 dias</span>
                    </div>
                </div>
            </motion.div>

            {/* Settings Menu */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-0 overflow-hidden"
            >
                <h3 className="font-medium p-4 pb-2 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-brand-500" />
                    Configurações
                </h3>
                <div className="divide-y divide-neutral-100">
                    {/* Notifications */}
                    <button
                        onClick={() => setShowNotificationsModal(true)}
                        className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-neutral-900">Notificações</p>
                                <p className="text-sm text-neutral-500">Alertas de plantão e mensagens</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </button>

                    {/* Dark Mode */}
                    <button
                        onClick={() => setDarkModeEnabled(!darkModeEnabled)}
                        className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <Moon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-neutral-900">Modo Escuro</p>
                                <p className="text-sm text-neutral-500">Tema escuro para a interface</p>
                            </div>
                        </div>
                        {darkModeEnabled ? (
                            <ToggleRight className="w-8 h-8 text-brand-500" />
                        ) : (
                            <ToggleLeft className="w-8 h-8 text-neutral-300" />
                        )}
                    </button>

                    {/* Security */}
                    <button
                        onClick={() => setShowSecurityModal(true)}
                        className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-error-100 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-error-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-neutral-900">Segurança</p>
                                <p className="text-sm text-neutral-500">Alterar PIN e configurações</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </button>

                    {/* Help */}
                    <button
                        onClick={() => setShowHelpModal(true)}
                        className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <HelpCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-neutral-900">Ajuda</p>
                                <p className="text-sm text-neutral-500">Central de suporte</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </button>
                </div>
            </motion.div>

            {/* Logout Button */}
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 p-4 bg-error-50 text-error-600 rounded-xl font-medium hover:bg-error-100 transition-colors"
            >
                <LogOut className="w-5 h-5" />
                Sair da Conta
            </motion.button>

            {/* App Version */}
            <p className="text-center text-xs text-neutral-400">
                Mãos Amigas v1.0.0 • © 2024
            </p>

            {/* MODALS */}

            {/* Stats Modal */}
            <AnimatePresence>
                {showStatsModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setShowStatsModal(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {getStatsModalContent()?.icon && (
                                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                                            {(() => {
                                                const Icon = getStatsModalContent()?.icon;
                                                return Icon ? <Icon className="w-4 h-4 text-brand-600" /> : null;
                                            })()}
                                        </div>
                                    )}
                                    <h2 className="text-lg font-semibold">{getStatsModalContent()?.title}</h2>
                                </div>
                                <button onClick={() => setShowStatsModal(null)} className="p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                {getStatsModalContent()?.content}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notifications Modal */}
            <AnimatePresence>
                {showNotificationsModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setShowNotificationsModal(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full rounded-t-3xl"
                        >
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-brand-500" />
                                    Notificações
                                </h2>
                                <button onClick={() => setShowNotificationsModal(false)} className="p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Bell className="w-5 h-5 text-neutral-500" />
                                        <div>
                                            <p className="font-medium">Notificações Push</p>
                                            <p className="text-sm text-neutral-500">Receber alertas no dispositivo</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                                        {notificationsEnabled ? (
                                            <ToggleRight className="w-8 h-8 text-brand-500" />
                                        ) : (
                                            <ToggleLeft className="w-8 h-8 text-neutral-300" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Volume2 className="w-5 h-5 text-neutral-500" />
                                        <div>
                                            <p className="font-medium">Som</p>
                                            <p className="text-sm text-neutral-500">Alertas sonoros</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSoundEnabled(!soundEnabled)}>
                                        {soundEnabled ? (
                                            <ToggleRight className="w-8 h-8 text-brand-500" />
                                        ) : (
                                            <ToggleLeft className="w-8 h-8 text-neutral-300" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="w-5 h-5 text-neutral-500" />
                                        <div>
                                            <p className="font-medium">Vibração</p>
                                            <p className="text-sm text-neutral-500">Feedback háptico</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setVibrationEnabled(!vibrationEnabled)}>
                                        {vibrationEnabled ? (
                                            <ToggleRight className="w-8 h-8 text-brand-500" />
                                        ) : (
                                            <ToggleLeft className="w-8 h-8 text-neutral-300" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-neutral-500" />
                                        <div>
                                            <p className="font-medium">Lembretes de Plantão</p>
                                            <p className="text-sm text-neutral-500">30 min antes do início</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShiftReminders(!shiftReminders)}>
                                        {shiftReminders ? (
                                            <ToggleRight className="w-8 h-8 text-brand-500" />
                                        ) : (
                                            <ToggleLeft className="w-8 h-8 text-neutral-300" />
                                        )}
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowNotificationsModal(false)}
                                    className="w-full btn-primary mt-4"
                                >
                                    <Check className="w-5 h-5 mr-2" />
                                    Salvar Preferências
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Security Modal */}
            <AnimatePresence>
                {showSecurityModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setShowSecurityModal(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full rounded-t-3xl"
                        >
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-error-500" />
                                    Segurança
                                </h2>
                                <button onClick={() => setShowSecurityModal(false)} className="p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        PIN Atual
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPin ? 'text' : 'password'}
                                            value={currentPin}
                                            onChange={(e) => setCurrentPin(e.target.value)}
                                            placeholder="Digite seu PIN atual"
                                            className="input-primary pr-10"
                                            maxLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPin(!showCurrentPin)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showCurrentPin ? (
                                                <EyeOff className="w-5 h-5 text-neutral-400" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-neutral-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Novo PIN
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPin ? 'text' : 'password'}
                                            value={newPin}
                                            onChange={(e) => setNewPin(e.target.value)}
                                            placeholder="Digite o novo PIN (6 dígitos)"
                                            className="input-primary pr-10"
                                            maxLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPin(!showNewPin)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showNewPin ? (
                                                <EyeOff className="w-5 h-5 text-neutral-400" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-neutral-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Confirmar Novo PIN
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPin}
                                        onChange={(e) => setConfirmPin(e.target.value)}
                                        placeholder="Confirme o novo PIN"
                                        className="input-primary"
                                        maxLength={6}
                                    />
                                </div>
                                {newPin && confirmPin && newPin !== confirmPin && (
                                    <p className="text-sm text-error-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Os PINs não coincidem
                                    </p>
                                )}
                                <button
                                    onClick={() => {
                                        // TODO: Implement PIN change logic
                                        setShowSecurityModal(false);
                                        setCurrentPin('');
                                        setNewPin('');
                                        setConfirmPin('');
                                    }}
                                    disabled={!currentPin || !newPin || newPin !== confirmPin}
                                    className="w-full btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Lock className="w-5 h-5 mr-2" />
                                    Alterar PIN
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelpModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setShowHelpModal(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-green-500" />
                                    Central de Ajuda
                                </h2>
                                <button onClick={() => setShowHelpModal(false)} className="p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Perguntas Frequentes</h4>
                                    {[
                                        { q: 'Como faço check-in no plantão?', a: 'Acesse a página inicial e clique em "Fazer Check-in" no card do plantão ativo.' },
                                        { q: 'Como registro uma evolução?', a: 'Vá até a aba "Evoluções" e clique em "Nova Evolução". Preencha os dados do paciente.' },
                                        { q: 'Como altero minha disponibilidade?', a: 'Na página de Perfil, você pode atualizar seu status de disponibilidade.' },
                                        { q: 'Posso ver meu histórico de plantões?', a: 'Sim! Clique no card "Plantões totais" no seu perfil para ver o histórico completo.' },
                                    ].map((faq, idx) => (
                                        <details key={idx} className="p-4 bg-neutral-50 rounded-xl group">
                                            <summary className="font-medium cursor-pointer flex items-center justify-between">
                                                {faq.q}
                                                <ChevronDown className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" />
                                            </summary>
                                            <p className="mt-2 text-sm text-neutral-600">{faq.a}</p>
                                        </details>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-3">Precisa de mais ajuda?</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <a
                                            href="tel:+5545999999999"
                                            className="flex items-center justify-center gap-2 p-4 bg-brand-50 rounded-xl text-brand-600 font-medium hover:bg-brand-100 transition-colors"
                                        >
                                            <Phone className="w-5 h-5" />
                                            Ligar
                                        </a>
                                        <a
                                            href="https://wa.me/5545999999999"
                                            className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-xl text-green-600 font-medium hover:bg-green-100 transition-colors"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            WhatsApp
                                        </a>
                                    </div>
                                    <a
                                        href="mailto:suporte@maosamigas.com.br"
                                        className="flex items-center justify-center gap-2 p-4 bg-neutral-50 rounded-xl text-neutral-600 font-medium hover:bg-neutral-100 transition-colors mt-3"
                                    >
                                        <Mail className="w-5 h-5" />
                                        suporte@maosamigas.com.br
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {showEditProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setShowEditProfile(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Edit3 className="w-5 h-5 text-brand-500" />
                                    Editar Perfil
                                </h2>
                                <button onClick={() => setShowEditProfile(false)} className="p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* Photo */}
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                            {profilePhoto ? (
                                                <img src={profilePhoto} alt="Foto" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-12 h-12 text-brand-600" />
                                            )}
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute -bottom-1 -right-1 w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-lg"
                                        >
                                            <Camera className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.fullName}
                                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                        className="input-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="input-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="input-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        rows={3}
                                        className="input-primary resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Contato de Emergência
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.emergencyContact}
                                        onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                                        placeholder="Nome - Telefone"
                                        className="input-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Endereço
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        className="input-primary"
                                    />
                                </div>

                                <button
                                    onClick={() => setShowEditProfile(false)}
                                    className="w-full btn-primary mt-4"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    Salvar Alterações
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
