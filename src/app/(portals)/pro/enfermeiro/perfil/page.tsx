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
    Eye,
    EyeOff,
    Star,
    TrendingUp,
    Activity,
    Stethoscope,
    ChevronDown,
    AlertCircle,
    GraduationCap,
    Users,
    Save,
    Heart,
    Pill,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';

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

export default function EnfermeiroPerfilPage() {
    const { user, logout } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile state
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || 'Enfermeiro(a)',
        email: user?.email || 'enfermeiro@maosamigas.com.br',
        phone: user?.phone || '(45) 99999-9999',
        coren: 'COREN-PR 123456',
        bio: 'Enfermeiro(a) especializado(a) em cuidados geriátricos e gerontológicos.',
        emergencyContact: 'Ana Paula - (45) 98888-7777',
        address: 'Foz do Iguaçu, PR',
        unit: 'Unidade Central',
        shift: 'Manhã (07h - 13h)',
    });

    // Settings toggles
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [shiftReminders, setShiftReminders] = useState(true);
    const [criticalAlerts, setCriticalAlerts] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    // Modals
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState<'patients' | 'evolutions' | 'procedures' | 'shifts' | null>(null);

    // Security form
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [showCurrentPin, setShowCurrentPin] = useState(false);
    const [showNewPin, setShowNewPin] = useState(false);

    // Stats
    const stats = {
        patientsToday: 8,
        evolutions: 24,
        procedures: 12,
        shiftsMonth: 20,
        rating: 4.9,
        memberSince: new Date(2023, 5, 10),
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

    // Stats modal content
    const getStatsModalContent = () => {
        switch (showStatsModal) {
            case 'patients':
                return {
                    title: 'Pacientes Atendidos',
                    icon: Users,
                    content: (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <p className="text-4xl font-bold text-brand-600">{stats.patientsToday}</p>
                                <p className="text-neutral-500">Pacientes hoje</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-success-50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-success-600">45</p>
                                    <p className="text-xs text-neutral-500">Este mês</p>
                                </div>
                                <div className="p-4 bg-brand-50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-brand-600">520</p>
                                    <p className="text-xs text-neutral-500">Total</p>
                                </div>
                            </div>
                            <h4 className="font-medium mt-4">Pacientes Recentes</h4>
                            <div className="space-y-2">
                                {['Maria Silva - Q501', 'João Santos - Q502', 'Ana Oliveira - Q503', 'Pedro Costa - Q504'].map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                                            <User className="w-5 h-5 text-brand-600" />
                                        </div>
                                        <span className="text-sm font-medium">{p}</span>
                                    </div>
                                ))}
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
                                <p className="text-4xl font-bold text-success-600">{stats.evolutions}</p>
                                <p className="text-neutral-500">Este mês</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-3 bg-blue-50 rounded-xl text-center">
                                    <p className="text-xl font-bold text-blue-600">12</p>
                                    <p className="text-xs text-neutral-500">Admissão</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-xl text-center">
                                    <p className="text-xl font-bold text-green-600">10</p>
                                    <p className="text-xs text-neutral-500">Evolução</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-xl text-center">
                                    <p className="text-xl font-bold text-purple-600">2</p>
                                    <p className="text-xs text-neutral-500">Alta</p>
                                </div>
                            </div>
                            <div className="p-4 bg-neutral-50 rounded-xl mt-4">
                                <p className="text-sm text-neutral-500">Total Anual</p>
                                <p className="text-2xl font-bold">286 evoluções</p>
                            </div>
                        </div>
                    )
                };
            case 'procedures':
                return {
                    title: 'Procedimentos Realizados',
                    icon: Stethoscope,
                    content: (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <p className="text-4xl font-bold text-purple-600">{stats.procedures}</p>
                                <p className="text-neutral-500">Este mês</p>
                            </div>
                            <h4 className="font-medium">Por Tipo</h4>
                            <div className="space-y-2">
                                {[
                                    { name: 'Curativos', count: 45, color: 'bg-green-100 text-green-700' },
                                    { name: 'Sondagem', count: 12, color: 'bg-blue-100 text-blue-700' },
                                    { name: 'Medicação IV', count: 38, color: 'bg-purple-100 text-purple-700' },
                                    { name: 'Coleta de exames', count: 25, color: 'bg-orange-100 text-orange-700' },
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                                        <span className="font-medium">{p.name}</span>
                                        <span className={cn('px-3 py-1 rounded-full text-sm font-medium', p.color)}>{p.count}</span>
                                    </div>
                                ))}
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
                                <p className="text-4xl font-bold text-warning-600">{stats.shiftsMonth}</p>
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
                                                    'h-full rounded-full',
                                                    m.hours >= m.target ? 'bg-success-500' : 'bg-brand-500'
                                                )}
                                                style={{ width: `${Math.min(100, (m.hours / m.target) * 100)}%` }}
                                            />
                                        </div>
                                        <span className="w-14 text-sm font-medium text-right">{m.hours}h</span>
                                    </div>
                                ))}
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
                                <img src={profilePhoto} alt="Foto" className="w-full h-full object-cover" />
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
                        <p className="text-neutral-500">Enfermeiro(a)</p>
                        <p className="text-sm text-neutral-400">{profileData.coren}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-sm text-success-600">
                                <div className="w-2 h-2 rounded-full bg-success-500" />
                                Em serviço
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
                        <span className="text-neutral-600">{profileData.unit} - {profileData.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Stethoscope className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600">Turno: {profileData.shift}</span>
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
                    onClick={() => setShowStatsModal('patients')}
                    className="card p-4 text-center hover:shadow-md transition-shadow"
                >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-brand-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-brand-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">{stats.patientsToday}</p>
                    <p className="text-xs text-neutral-500">Pacientes hoje</p>
                    <ChevronRight className="w-4 h-4 text-neutral-400 mx-auto mt-1" />
                </button>
                <button
                    onClick={() => setShowStatsModal('evolutions')}
                    className="card p-4 text-center hover:shadow-md transition-shadow"
                >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-success-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-success-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">{stats.evolutions}</p>
                    <p className="text-xs text-neutral-500">Evoluções (mês)</p>
                    <ChevronRight className="w-4 h-4 text-neutral-400 mx-auto mt-1" />
                </button>
                <button
                    onClick={() => setShowStatsModal('procedures')}
                    className="card p-4 text-center hover:shadow-md transition-shadow"
                >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">{stats.procedures}</p>
                    <p className="text-xs text-neutral-500">Procedimentos (mês)</p>
                    <ChevronRight className="w-4 h-4 text-neutral-400 mx-auto mt-1" />
                </button>
                <button
                    onClick={() => setShowStatsModal('shifts')}
                    className="card p-4 text-center hover:shadow-md transition-shadow"
                >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-warning-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-warning-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">{stats.shiftsMonth}</p>
                    <p className="text-xs text-neutral-500">Plantões (mês)</p>
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
                    Certificações e Registros
                </h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-success-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-success-600" />
                            <span className="text-sm font-medium text-success-700">COREN-PR Ativo</span>
                        </div>
                        <span className="text-xs text-success-600">Válido até 12/2025</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-success-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-success-600" />
                            <span className="text-sm font-medium text-success-700">ACLS</span>
                        </div>
                        <span className="text-xs text-success-600">Válido</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-success-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-success-600" />
                            <span className="text-sm font-medium text-success-700">PALS</span>
                        </div>
                        <span className="text-xs text-success-600">Válido</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-warning-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-warning-600" />
                            <span className="text-sm font-medium text-warning-700">Especialização Gerontologia</span>
                        </div>
                        <span className="text-xs text-warning-600">Em andamento</span>
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
                                <p className="text-sm text-neutral-500">Alertas e lembretes</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </button>
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
                                <p className="text-sm text-neutral-500">Tema noturno</p>
                            </div>
                        </div>
                        {darkModeEnabled ? (
                            <ToggleRight className="w-8 h-8 text-brand-500" />
                        ) : (
                            <ToggleLeft className="w-8 h-8 text-neutral-300" />
                        )}
                    </button>
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
                                <p className="text-sm text-neutral-500">PIN e configurações</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </button>
                    <button
                        onClick={() => setShowHelpModal(true)}
                        className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <HelpCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-neutral-900">Central de Ajuda</p>
                                <p className="text-sm text-neutral-500">Suporte e FAQ</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </button>
                </div>
            </motion.div>

            {/* Logout */}
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
                                <h2 className="text-lg font-semibold">{getStatsModalContent()?.title}</h2>
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
                                <h2 className="text-lg font-semibold">Notificações</h2>
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
                                            <p className="text-sm text-neutral-500">Alertas no dispositivo</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                                        {notificationsEnabled ? <ToggleRight className="w-8 h-8 text-brand-500" /> : <ToggleLeft className="w-8 h-8 text-neutral-300" />}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 text-error-500" />
                                        <div>
                                            <p className="font-medium">Alertas Críticos</p>
                                            <p className="text-sm text-neutral-500">Pacientes em estado grave</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setCriticalAlerts(!criticalAlerts)}>
                                        {criticalAlerts ? <ToggleRight className="w-8 h-8 text-brand-500" /> : <ToggleLeft className="w-8 h-8 text-neutral-300" />}
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
                                        {soundEnabled ? <ToggleRight className="w-8 h-8 text-brand-500" /> : <ToggleLeft className="w-8 h-8 text-neutral-300" />}
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowNotificationsModal(false)}
                                    className="w-full btn-primary mt-4"
                                >
                                    <Check className="w-5 h-5 mr-2" />
                                    Salvar
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
                                <h2 className="text-lg font-semibold">Segurança</h2>
                                <button onClick={() => setShowSecurityModal(false)} className="p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">PIN Atual</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPin ? 'text' : 'password'}
                                            value={currentPin}
                                            onChange={(e) => setCurrentPin(e.target.value)}
                                            placeholder="PIN atual"
                                            className="input-primary pr-10"
                                            maxLength={6}
                                        />
                                        <button onClick={() => setShowCurrentPin(!showCurrentPin)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {showCurrentPin ? <EyeOff className="w-5 h-5 text-neutral-400" /> : <Eye className="w-5 h-5 text-neutral-400" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Novo PIN</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPin ? 'text' : 'password'}
                                            value={newPin}
                                            onChange={(e) => setNewPin(e.target.value)}
                                            placeholder="Novo PIN (6 dígitos)"
                                            className="input-primary pr-10"
                                            maxLength={6}
                                        />
                                        <button onClick={() => setShowNewPin(!showNewPin)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {showNewPin ? <EyeOff className="w-5 h-5 text-neutral-400" /> : <Eye className="w-5 h-5 text-neutral-400" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Confirmar PIN</label>
                                    <input
                                        type="password"
                                        value={confirmPin}
                                        onChange={(e) => setConfirmPin(e.target.value)}
                                        placeholder="Confirme o PIN"
                                        className="input-primary"
                                        maxLength={6}
                                    />
                                </div>
                                <button
                                    onClick={() => { setShowSecurityModal(false); setCurrentPin(''); setNewPin(''); setConfirmPin(''); }}
                                    disabled={!currentPin || !newPin || newPin !== confirmPin}
                                    className="w-full btn-primary mt-4 disabled:opacity-50"
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
                                <h2 className="text-lg font-semibold">Central de Ajuda</h2>
                                <button onClick={() => setShowHelpModal(false)} className="p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <h4 className="font-medium">Perguntas Frequentes</h4>
                                {[
                                    { q: 'Como registro uma evolução de enfermagem?', a: 'Acesse a aba Evoluções e clique em Nova. Preencha os sinais vitais e observações.' },
                                    { q: 'Como vejo os alertas dos pacientes?', a: 'Na lista de pacientes, os alertas aparecem em vermelho. Clique para ver detalhes.' },
                                    { q: 'Como altero meu turno?', a: 'Entre em contato com a coordenação através do suporte.' },
                                ].map((faq, idx) => (
                                    <details key={idx} className="p-4 bg-neutral-50 rounded-xl">
                                        <summary className="font-medium cursor-pointer flex items-center justify-between">
                                            {faq.q}
                                            <ChevronDown className="w-5 h-5 text-neutral-400" />
                                        </summary>
                                        <p className="mt-2 text-sm text-neutral-600">{faq.a}</p>
                                    </details>
                                ))}
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-3">Contato</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <a href="tel:+5545999999999" className="flex items-center justify-center gap-2 p-4 bg-brand-50 rounded-xl text-brand-600 font-medium">
                                            <Phone className="w-5 h-5" />
                                            Ligar
                                        </a>
                                        <a href="https://wa.me/5545999999999" className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-xl text-green-600 font-medium">
                                            <MessageCircle className="w-5 h-5" />
                                            WhatsApp
                                        </a>
                                    </div>
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
                                <h2 className="text-lg font-semibold">Editar Perfil</h2>
                                <button onClick={() => setShowEditProfile(false)} className="p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                            {profilePhoto ? (
                                                <img src={profilePhoto} alt="Foto" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-12 h-12 text-brand-600" />
                                            )}
                                        </div>
                                        <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                            <Camera className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nome Completo</label>
                                    <input type="text" value={profileData.fullName} onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} className="input-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="input-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Telefone</label>
                                    <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="input-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Bio</label>
                                    <textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} rows={3} className="input-primary resize-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Contato de Emergência</label>
                                    <input type="text" value={profileData.emergencyContact} onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })} className="input-primary" />
                                </div>
                                <button onClick={() => setShowEditProfile(false)} className="w-full btn-primary mt-4">
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
