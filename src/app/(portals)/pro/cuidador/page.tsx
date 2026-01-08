'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    CheckCircle,
    AlertCircle,
    User,
    FileText,
    ChevronRight,
    Phone,
    MessageCircle,
    Plus,
    Pill,
    Droplets,
    Activity,
    AlertTriangle,
    Sparkles,
    X,
    UtensilsCrossed,
    PersonStanding,
    Brain,
    Save,
    ChevronDown,
    Lightbulb,
    Moon,
    Sun,
} from 'lucide-react';
import { format, isToday, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils/cn';

// Types
interface DynamicTask {
    id: string;
    title: string;
    description?: string;
    time: string;
    completed: boolean;
    category: 'medication' | 'hygiene' | 'feeding' | 'mobility' | 'monitoring' | 'therapy' | 'custom' | 'suggested';
    priority: 'low' | 'medium' | 'high' | 'critical';
    linkedTo?: string;
    isAISuggested?: boolean;
    suggestedReason?: string;
    recurring?: boolean;
}

interface PatientContext {
    id: string;
    name: string;
    age: number;
    conditions: string[];
    medications: { name: string; dose: string; times: string[] }[];
    mobilityAids: string[];
    allergies: string[];
    dietaryRestrictions: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    needsVitalMonitoring: boolean;
    needsGlucoseMonitoring: boolean;
    needsOxygenMonitoring: boolean;
    sleepQuality: string;
    wakeUpTime: string;
    breakfastTime: string;
    lunchTime: string;
    dinnerTime: string;
    bedTime: string;
    katzScore: number;
    abemidScore: number;
}

// Mock data
const currentPatient: PatientContext = {
    id: '1',
    name: 'Maria Silva',
    age: 82,
    conditions: ['Alzheimer (fase inicial)', 'Hipertensão arterial', 'Diabetes tipo 2'],
    medications: [
        { name: 'Donepezila', dose: '10mg', times: ['08:00'] },
        { name: 'Losartana', dose: '50mg', times: ['08:00'] },
        { name: 'Metformina', dose: '850mg', times: ['08:00', '20:00'] },
        { name: 'AAS', dose: '100mg', times: ['12:00'] },
    ],
    mobilityAids: ['Bengala'],
    allergies: ['Dipirona'],
    dietaryRestrictions: ['Dieta diabética', 'Baixo sódio'],
    riskLevel: 'medium',
    needsVitalMonitoring: true,
    needsGlucoseMonitoring: true,
    needsOxygenMonitoring: false,
    sleepQuality: 'Acorda para ir ao banheiro',
    wakeUpTime: '07:00',
    breakfastTime: '08:00',
    lunchTime: '12:00',
    dinnerTime: '19:00',
    bedTime: '21:00',
    katzScore: 4,
    abemidScore: 8,
};

// Task generators
const generateDynamicTasks = (patient: PatientContext): DynamicTask[] => {
    const tasks: DynamicTask[] = [];
    let taskId = 1;

    patient.medications.forEach(med => {
        med.times.forEach(time => {
            tasks.push({
                id: `med-${taskId++}`,
                title: `Administrar ${med.name} ${med.dose}`,
                description: `Medicação prescrita`,
                time,
                completed: false,
                category: 'medication',
                priority: 'high',
                linkedTo: med.name,
                recurring: true,
            });
        });
    });

    if (patient.katzScore >= 3) {
        tasks.push({
            id: `hyg-${taskId++}`,
            title: 'Banho assistido',
            description: 'Auxiliar no banho completo',
            time: '09:00',
            completed: false,
            category: 'hygiene',
            priority: 'medium',
            linkedTo: `KATZ ${patient.katzScore}`,
        });
        tasks.push({
            id: `hyg-${taskId++}`,
            title: 'Higiene oral',
            time: '08:30',
            completed: false,
            category: 'hygiene',
            priority: 'medium',
        });
    }

    tasks.push({
        id: `feed-${taskId++}`,
        title: 'Café da manhã',
        description: patient.dietaryRestrictions.join(', '),
        time: patient.breakfastTime,
        completed: false,
        category: 'feeding',
        priority: 'high',
    });
    tasks.push({
        id: `feed-${taskId++}`,
        title: 'Almoço',
        time: patient.lunchTime,
        completed: false,
        category: 'feeding',
        priority: 'high',
    });
    tasks.push({
        id: `feed-${taskId++}`,
        title: 'Jantar',
        time: patient.dinnerTime,
        completed: false,
        category: 'feeding',
        priority: 'high',
    });

    if (patient.conditions.some(c => c.includes('Hipertensão'))) {
        tasks.push({
            id: `mon-${taskId++}`,
            title: 'Aferir pressão arterial',
            time: '08:00',
            completed: false,
            category: 'monitoring',
            priority: 'high',
            linkedTo: 'Hipertensão',
        });
    }
    if (patient.conditions.some(c => c.includes('Diabetes'))) {
        tasks.push({
            id: `mon-${taskId++}`,
            title: 'Verificar glicemia',
            description: 'Em jejum',
            time: '07:30',
            completed: false,
            category: 'monitoring',
            priority: 'critical',
            linkedTo: 'Diabetes',
        });
    }

    if (patient.conditions.some(c => c.includes('Alzheimer'))) {
        tasks.push({
            id: `ther-${taskId++}`,
            title: 'Estimulação cognitiva',
            description: 'Atividades de memória',
            time: '11:00',
            completed: false,
            category: 'therapy',
            priority: 'medium',
            linkedTo: 'Alzheimer',
        });
    }

    if (patient.mobilityAids.length > 0) {
        tasks.push({
            id: `mob-${taskId++}`,
            title: 'Exercícios de mobilidade',
            time: '10:30',
            completed: false,
            category: 'mobility',
            priority: 'medium',
        });
    }

    tasks.push({
        id: `rest-${taskId++}`,
        title: 'Repouso supervisionado',
        time: '14:00',
        completed: false,
        category: 'monitoring',
        priority: 'low',
    });

    return tasks.sort((a, b) => a.time.localeCompare(b.time));
};

const generateAISuggestions = (patient: PatientContext): DynamicTask[] => {
    const suggestions: DynamicTask[] = [];
    let suggId = 100;

    if (patient.conditions.some(c => c.includes('Alzheimer'))) {
        suggestions.push({
            id: `sugg-${suggId++}`,
            title: 'Orientação temporal',
            description: 'Lembrar dia, hora, local',
            time: '09:30',
            completed: false,
            category: 'suggested',
            priority: 'low',
            isAISuggested: true,
            suggestedReason: '85% dos cuidadores adicionam',
        });
    }

    if (patient.conditions.some(c => c.includes('Diabetes'))) {
        suggestions.push({
            id: `sugg-${suggId++}`,
            title: 'Inspeção dos pés',
            description: 'Verificar lesões',
            time: '21:00',
            completed: false,
            category: 'suggested',
            priority: 'medium',
            isAISuggested: true,
            suggestedReason: '92% de adesão',
        });
    }

    suggestions.push({
        id: `sugg-${suggId++}`,
        title: 'Hidratação',
        description: 'Água a cada 2h',
        time: '10:00',
        completed: false,
        category: 'suggested',
        priority: 'medium',
        isAISuggested: true,
        suggestedReason: '78% recomendam',
    });

    return suggestions;
};

const currentShift = {
    patientName: 'Maria Silva',
    patientAge: 82,
    startTime: '07:00',
    endTime: '19:00',
    checkInTime: '06:55',
    address: 'Rua das Flores, 123 - Apt 501',
    familyContact: { name: 'João Silva', relationship: 'Filho', phone: '(11) 99999-8888' },
};

const mockStats = { hoursThisMonth: 156, shiftsCompleted: 13, patientsActive: 2, pendingEvolutions: 3 };

const mockUpcomingShifts = [
    { id: '1', patientName: 'Maria Silva', date: new Date(), time: '07:00 - 19:00' },
    { id: '2', patientName: 'José Santos', date: addDays(new Date(), 1), time: '19:00 - 07:00' },
    { id: '3', patientName: 'Maria Silva', date: addDays(new Date(), 2), time: '07:00 - 19:00' },
];

// Category config
const getCategoryConfig = (category: DynamicTask['category']) => {
    switch (category) {
        case 'medication': return { icon: Pill, color: 'text-purple-500', bg: 'rgba(168, 85, 247, 0.15)' };
        case 'hygiene': return { icon: Droplets, color: 'text-blue-500', bg: 'rgba(59, 130, 246, 0.15)' };
        case 'feeding': return { icon: UtensilsCrossed, color: 'text-green-500', bg: 'rgba(34, 197, 94, 0.15)' };
        case 'mobility': return { icon: PersonStanding, color: 'text-orange-500', bg: 'rgba(249, 115, 22, 0.15)' };
        case 'monitoring': return { icon: Activity, color: 'text-red-500', bg: 'rgba(239, 68, 68, 0.15)' };
        case 'therapy': return { icon: Brain, color: 'text-pink-500', bg: 'rgba(236, 72, 153, 0.15)' };
        case 'custom': return { icon: FileText, color: 'text-neutral-500', bg: 'rgba(115, 115, 122, 0.15)' };
        case 'suggested': return { icon: Sparkles, color: 'text-amber-500', bg: 'rgba(245, 158, 11, 0.15)' };
    }
};

const getPriorityBorder = (priority: DynamicTask['priority']) => {
    switch (priority) {
        case 'critical': return 'border-l-red-500';
        case 'high': return 'border-l-orange-500';
        case 'medium': return 'border-l-brand-500';
        case 'low': return 'border-l-neutral-400 dark:border-l-neutral-600';
    }
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
};

export default function CaregiverDashboardPage() {
    const { user } = useAuth();
    const { resolvedTheme, toggleTheme } = useTheme();
    const [isCheckedIn, setIsCheckedIn] = useState(true);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        time: '',
        category: 'custom' as DynamicTask['category'],
        priority: 'medium' as DynamicTask['priority'],
    });

    const baseTasks = useMemo(() => generateDynamicTasks(currentPatient), []);
    const [tasks, setTasks] = useState<DynamicTask[]>(baseTasks);
    const suggestions = useMemo(() => generateAISuggestions(currentPatient), []);

    const toggleTaskCompletion = (taskId: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    };

    const addCustomTask = () => {
        if (!newTask.title || !newTask.time) return;
        const task: DynamicTask = {
            id: `custom-${Date.now()}`,
            title: newTask.title,
            description: newTask.description,
            time: newTask.time,
            completed: false,
            category: newTask.category,
            priority: newTask.priority,
        };
        setTasks(prev => [...prev, task].sort((a, b) => a.time.localeCompare(b.time)));
        setNewTask({ title: '', description: '', time: '', category: 'custom', priority: 'medium' });
        setShowAddTask(false);
    };

    const acceptSuggestion = (suggestion: DynamicTask) => {
        setTasks(prev => [...prev, { ...suggestion, category: 'monitoring' as const }].sort((a, b) => a.time.localeCompare(b.time)));
    };

    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const progressPercent = (completedTasks / totalTasks) * 100;

    return (
        <motion.div
            className="space-y-5 pb-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg sm:text-xl font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                        Olá, {user?.fullName?.split(' ')[0] || 'Profissional'}! 👋
                    </h1>
                    <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                        {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full transition-colors"
                    style={{
                        backgroundColor: 'rgb(var(--color-bg-muted))',
                        color: 'rgb(var(--color-text-secondary))'
                    }}
                >
                    {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>
            </motion.div>

            {/* Shift Card */}
            <motion.div variants={itemVariants} className="card p-0 overflow-hidden">
                <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{
                        backgroundColor: isCheckedIn
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)'
                    }}
                >
                    <div className="flex items-center gap-2">
                        {isCheckedIn ? (
                            <CheckCircle className="w-5 h-5 text-success-500" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-warning-500" />
                        )}
                        <span className={cn('font-medium text-sm', isCheckedIn ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400')}>
                            {isCheckedIn ? 'Plantão em andamento' : 'Aguardando check-in'}
                        </span>
                    </div>
                    <span className="text-xs" style={{ color: 'rgb(var(--color-text-tertiary))' }}>
                        {currentShift.startTime} - {currentShift.endTime}
                    </span>
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(30, 138, 173, 0.15)' }}
                        >
                            <User className="w-6 h-6 text-brand-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base" style={{ color: 'rgb(var(--color-text))' }}>
                                {currentShift.patientName}
                            </p>
                            <p className="text-sm truncate" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                {currentShift.patientAge} anos • {currentShift.address}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {currentPatient.conditions.slice(0, 3).map((condition, i) => (
                            <span key={i} className="badge-info text-xs">
                                {condition.split(' ')[0]}
                            </span>
                        ))}
                        {currentPatient.allergies.length > 0 && (
                            <span className="badge-danger text-xs flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Alergia
                            </span>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsCheckedIn(!isCheckedIn)}
                        className={cn(
                            'w-full py-3 rounded-xl font-medium transition-all',
                            isCheckedIn ? 'btn-danger' : 'btn-primary'
                        )}
                    >
                        {isCheckedIn ? 'Fazer Check-out' : 'Fazer Check-in'}
                    </motion.button>

                    {isCheckedIn && (
                        <p className="text-xs text-center mt-2" style={{ color: 'rgb(var(--color-text-tertiary))' }}>
                            Check-in: {currentShift.checkInTime}
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Tasks Section */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="font-semibold flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            Tarefas do Dia
                        </h2>
                        <p className="text-xs" style={{ color: 'rgb(var(--color-text-tertiary))' }}>
                            Baseadas em {currentPatient.name}
                        </p>
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                        {completedTasks}/{totalTasks}
                    </span>
                </div>

                {/* Progress */}
                <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ backgroundColor: 'rgb(var(--color-bg-muted))' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-success-400 to-success-500"
                    />
                </div>

                {/* AI Suggestions Banner */}
                {suggestions.length > 0 && (
                    <motion.button
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="w-full mb-4 p-3 rounded-xl flex items-center justify-between transition-all hover:shadow-md"
                        style={{
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.3)'
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-amber-500" />
                            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                {suggestions.length} sugestões IA
                            </span>
                        </div>
                        <motion.div animate={{ rotate: showSuggestions ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="w-5 h-5 text-amber-500" />
                        </motion.div>
                    </motion.button>
                )}

                <AnimatePresence>
                    {showSuggestions && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-4"
                        >
                            <div className="space-y-2">
                                {suggestions.map(suggestion => (
                                    <motion.div
                                        key={suggestion.id}
                                        className="card p-3"
                                        style={{
                                            backgroundColor: 'rgba(245, 158, 11, 0.05)',
                                            border: '1px solid rgba(245, 158, 11, 0.2)'
                                        }}
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm" style={{ color: 'rgb(var(--color-text))' }}>{suggestion.title}</p>
                                                <p className="text-xs" style={{ color: 'rgb(var(--color-text-tertiary))' }}>{suggestion.description}</p>
                                                <p className="text-xs text-amber-500 mt-1 italic">{suggestion.suggestedReason}</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => acceptSuggestion(suggestion)}
                                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white text-xs rounded-lg font-medium"
                                            >
                                                Adicionar
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Task List */}
                <div className="space-y-2">
                    {tasks.map((task, index) => {
                        const config = getCategoryConfig(task.category);
                        const isCurrent = Math.abs(parseInt(task.time.split(':')[0]) - new Date().getHours()) <= 1;

                        return (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className={cn(
                                    'card flex items-start gap-3 py-3 border-l-4',
                                    getPriorityBorder(task.priority),
                                    task.completed && 'opacity-60'
                                )}
                                style={{
                                    boxShadow: isCurrent && !task.completed ? '0 0 0 2px rgba(30, 138, 173, 0.3)' : undefined
                                }}
                            >
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => toggleTaskCompletion(task.id)}
                                    className={cn(
                                        'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
                                        task.completed
                                            ? 'border-success-500 bg-success-500'
                                            : 'border-neutral-300 dark:border-neutral-600 hover:border-brand-500'
                                    )}
                                >
                                    {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                                </motion.button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <div
                                            className={cn('w-5 h-5 rounded flex items-center justify-center flex-shrink-0', config.color)}
                                            style={{ backgroundColor: config.bg }}
                                        >
                                            <config.icon className="w-3 h-3" />
                                        </div>
                                        <p className={cn(
                                            'text-sm font-medium truncate',
                                            task.completed && 'line-through'
                                        )} style={{ color: task.completed ? 'rgb(var(--color-text-tertiary))' : 'rgb(var(--color-text))' }}>
                                            {task.title}
                                        </p>
                                    </div>
                                    {task.description && (
                                        <p className="text-xs ml-7 truncate" style={{ color: 'rgb(var(--color-text-tertiary))' }}>{task.description}</p>
                                    )}
                                    {task.linkedTo && (
                                        <p className="text-xs ml-7 mt-0.5 text-brand-500">↳ {task.linkedTo}</p>
                                    )}
                                </div>

                                <div className="text-right flex-shrink-0">
                                    <span className={cn('text-xs font-medium', isCurrent && !task.completed ? 'text-brand-500' : '')} style={{ color: isCurrent && !task.completed ? undefined : 'rgb(var(--color-text-tertiary))' }}>
                                        {task.time}
                                    </span>
                                    {task.recurring && (
                                        <p className="text-[10px]" style={{ color: 'rgb(var(--color-text-tertiary))' }}>Recorrente</p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Add Task Button */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowAddTask(true)}
                    className="w-full mt-3 py-3 border-2 border-dashed rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                    style={{
                        borderColor: 'rgb(var(--color-border))',
                        color: 'rgb(var(--color-text-secondary))'
                    }}
                >
                    <Plus className="w-5 h-5" />
                    Adicionar Tarefa
                </motion.button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants}>
                <h2 className="font-semibold mb-3" style={{ color: 'rgb(var(--color-text))' }}>Este Mês</h2>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { value: `${mockStats.hoursThisMonth}h`, label: 'Horas', icon: Clock, color: 'text-brand-500', bg: 'rgba(30, 138, 173, 0.15)' },
                        { value: mockStats.shiftsCompleted, label: 'Plantões', icon: CheckCircle, color: 'text-success-500', bg: 'rgba(16, 185, 129, 0.15)' },
                        { value: mockStats.patientsActive, label: 'Pacientes', icon: User, color: 'text-purple-500', bg: 'rgba(168, 85, 247, 0.15)' },
                        { value: mockStats.pendingEvolutions, label: 'Evoluções', icon: FileText, color: 'text-amber-500', bg: 'rgba(245, 158, 11, 0.15)' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            className="card p-4"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-2', stat.color)} style={{ backgroundColor: stat.bg }}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <p className="text-xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>{stat.value}</p>
                            <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Upcoming Shifts */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Próximos Plantões</h2>
                    <a href="/pro/cuidador/agenda" className="text-sm text-brand-500 hover:underline">Ver agenda</a>
                </div>
                <div className="space-y-2">
                    {mockUpcomingShifts.map((shift) => (
                        <motion.div
                            key={shift.id}
                            className="card flex items-center gap-4 cursor-pointer"
                            whileHover={{ scale: 1.01, x: 4 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div
                                className={cn(
                                    'w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0',
                                    isToday(shift.date) ? 'bg-brand-500 text-white' : ''
                                )}
                                style={{
                                    backgroundColor: isToday(shift.date) ? undefined : 'rgb(var(--color-bg-muted))',
                                    color: isToday(shift.date) ? undefined : 'rgb(var(--color-text-secondary))'
                                }}
                            >
                                <span className="text-xs font-medium">{format(shift.date, 'MMM', { locale: ptBR }).toUpperCase()}</span>
                                <span className="text-lg font-bold leading-none">{format(shift.date, 'dd')}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate" style={{ color: 'rgb(var(--color-text))' }}>{shift.patientName}</p>
                                <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{shift.time}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(var(--color-text-tertiary))' }} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Family Contact */}
            <motion.div variants={itemVariants} className="card">
                <p className="text-sm mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>Contato da Família</p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{currentShift.familyContact.name}</p>
                        <p className="text-sm" style={{ color: 'rgb(var(--color-text-tertiary))' }}>{currentShift.familyContact.relationship}</p>
                    </div>
                    <div className="flex gap-2">
                        <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            href={`tel:${currentShift.familyContact.phone}`}
                            className="p-2 rounded-lg text-brand-500"
                            style={{ backgroundColor: 'rgba(30, 138, 173, 0.15)' }}
                        >
                            <Phone className="w-5 h-5" />
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            href={`https://wa.me/55${currentShift.familyContact.phone.replace(/\D/g, '')}`}
                            className="p-2 rounded-lg text-success-500"
                            style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
                        >
                            <MessageCircle className="w-5 h-5" />
                        </motion.a>
                    </div>
                </div>
            </motion.div>

            {/* Add Task Modal */}
            <AnimatePresence>
                {showAddTask && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay flex items-end"
                        onClick={() => setShowAddTask(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="modal-content w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div
                                className="p-4 flex justify-between items-center sticky top-0 z-10"
                                style={{
                                    backgroundColor: 'rgb(var(--color-bg-elevated))',
                                    borderBottom: '1px solid rgb(var(--color-border-subtle))'
                                }}
                            >
                                <h2 className="text-lg font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Adicionar Tarefa</h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowAddTask(false)}
                                    className="p-2 rounded-full"
                                    style={{ backgroundColor: 'rgb(var(--color-bg-muted))' }}
                                >
                                    <X className="w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                                </motion.button>
                            </div>
                            <div className="p-6 space-y-5">
                                {/* Category */}
                                <div>
                                    <label className="label">Categoria</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { value: 'medication', icon: Pill, label: 'Medicação' },
                                            { value: 'hygiene', icon: Droplets, label: 'Higiene' },
                                            { value: 'feeding', icon: UtensilsCrossed, label: 'Alimentação' },
                                            { value: 'monitoring', icon: Activity, label: 'Monit.' },
                                            { value: 'mobility', icon: PersonStanding, label: 'Mobilidade' },
                                            { value: 'therapy', icon: Brain, label: 'Terapia' },
                                            { value: 'custom', icon: FileText, label: 'Outra' },
                                        ].map(cat => (
                                            <motion.button
                                                key={cat.value}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setNewTask({ ...newTask, category: cat.value as DynamicTask['category'] })}
                                                className={cn(
                                                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all',
                                                    newTask.category === cat.value ? 'border-brand-500' : ''
                                                )}
                                                style={{
                                                    backgroundColor: newTask.category === cat.value ? 'rgba(30, 138, 173, 0.1)' : 'rgb(var(--color-bg-muted))',
                                                    borderColor: newTask.category === cat.value ? undefined : 'rgb(var(--color-border))'
                                                }}
                                            >
                                                <cat.icon className={cn('w-5 h-5', newTask.category === cat.value ? 'text-brand-500' : '')} style={{ color: newTask.category === cat.value ? undefined : 'rgb(var(--color-text-tertiary))' }} />
                                                <span className="text-[10px]" style={{ color: newTask.category === cat.value ? 'rgb(var(--color-text))' : 'rgb(var(--color-text-secondary))' }}>{cat.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="label">Prioridade</label>
                                    <div className="flex gap-2">
                                        {[
                                            { value: 'low', label: 'Baixa', color: 'rgba(115, 115, 122, 0.2)', active: 'rgba(115, 115, 122, 0.4)' },
                                            { value: 'medium', label: 'Média', color: 'rgba(245, 158, 11, 0.15)', active: 'rgba(245, 158, 11, 0.3)' },
                                            { value: 'high', label: 'Alta', color: 'rgba(249, 115, 22, 0.15)', active: 'rgba(249, 115, 22, 0.3)' },
                                            { value: 'critical', label: 'Crítica', color: 'rgba(239, 68, 68, 0.15)', active: 'rgba(239, 68, 68, 0.3)' },
                                        ].map(p => (
                                            <motion.button
                                                key={p.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setNewTask({ ...newTask, priority: p.value as DynamicTask['priority'] })}
                                                className={cn(
                                                    'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all',
                                                    newTask.priority === p.value && 'ring-2 ring-brand-500'
                                                )}
                                                style={{
                                                    backgroundColor: newTask.priority === p.value ? p.active : p.color,
                                                    color: 'rgb(var(--color-text))'
                                                }}
                                            >
                                                {p.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Título</label>
                                    <input
                                        type="text"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        placeholder="Ex: Verificar sinais vitais"
                                        className="input-primary"
                                    />
                                </div>

                                <div>
                                    <label className="label">Horário</label>
                                    <input
                                        type="time"
                                        value={newTask.time}
                                        onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                                        className="input-primary"
                                    />
                                </div>

                                <div>
                                    <label className="label">Descrição (opcional)</label>
                                    <textarea
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        placeholder="Detalhes adicionais..."
                                        rows={2}
                                        className="input-primary resize-none"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={addCustomTask}
                                    disabled={!newTask.title || !newTask.time}
                                    className="w-full btn-primary disabled:opacity-50"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    Salvar Tarefa
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
