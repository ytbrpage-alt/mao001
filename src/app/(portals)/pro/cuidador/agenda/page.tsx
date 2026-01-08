'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    User,
    AlertCircle,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';

// Tipos
interface Shift {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    patient: {
        name: string;
        age: number;
        address: string;
        condition: string;
    };
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
    notes?: string;
}

// Mock data
const generateMockShifts = (): Shift[] => {
    const today = new Date();
    return [
        {
            id: '1',
            date: today,
            startTime: '07:00',
            endTime: '19:00',
            patient: {
                name: 'Maria Silva',
                age: 82,
                address: 'Rua das Flores, 123 - Apt 501',
                condition: 'Alzheimer estágio inicial'
            },
            status: 'confirmed',
        },
        {
            id: '2',
            date: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            startTime: '19:00',
            endTime: '07:00',
            patient: {
                name: 'João Santos',
                age: 75,
                address: 'Av. Brasil, 456 - Casa',
                condition: 'Pós-AVC'
            },
            status: 'confirmed',
        },
        {
            id: '3',
            date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
            startTime: '07:00',
            endTime: '19:00',
            patient: {
                name: 'Ana Oliveira',
                age: 68,
                address: 'Rua Paraná, 789 - Apt 102',
                condition: 'DPOC'
            },
            status: 'pending',
        },
        {
            id: '4',
            date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
            startTime: '07:00',
            endTime: '19:00',
            patient: {
                name: 'Maria Silva',
                age: 82,
                address: 'Rua das Flores, 123 - Apt 501',
                condition: 'Alzheimer estágio inicial'
            },
            status: 'confirmed',
        },
        {
            id: '5',
            date: new Date(today.getTime() - 24 * 60 * 60 * 1000),
            startTime: '07:00',
            endTime: '19:00',
            patient: {
                name: 'Pedro Costa',
                age: 79,
                address: 'Rua São Paulo, 321',
                condition: 'Diabetes tipo 2'
            },
            status: 'completed',
        },
    ];
};

const mockShifts = generateMockShifts();

// Helpers
const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
};

const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString();
};

const getWeekDays = (centerDate: Date): Date[] => {
    const days: Date[] = [];
    const start = new Date(centerDate);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        days.push(day);
    }
    return days;
};

const getStatusConfig = (status: Shift['status']) => {
    switch (status) {
        case 'confirmed':
            return { icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-100', label: 'Confirmado' };
        case 'pending':
            return { icon: AlertCircle, color: 'text-warning-600', bg: 'bg-warning-100', label: 'Pendente' };
        case 'cancelled':
            return { icon: XCircle, color: 'text-error-600', bg: 'bg-error-100', label: 'Cancelado' };
        case 'completed':
            return { icon: CheckCircle, color: 'text-neutral-500', bg: 'bg-neutral-100', label: 'Concluído' };
    }
};

export default function AgendaPage() {
    const { user } = useAuth();
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const weekDays = getWeekDays(currentWeekStart);
    const today = new Date();

    const shiftsForSelectedDate = mockShifts.filter(shift =>
        isSameDay(shift.date, selectedDate)
    );

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeekStart(newDate);
    };

    const getShiftsForDay = (date: Date) => {
        return mockShifts.filter(shift => isSameDay(shift.date, date));
    };

    return (
        <div className="space-y-4 pb-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-brand-500" />
                    Minha Agenda
                </h1>
                <p className="text-sm text-neutral-500 mt-1" suppressHydrationWarning>
                    {today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </motion.div>

            {/* Week Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-3"
            >
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigateWeek('prev')}
                        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-neutral-600" />
                    </button>
                    <span className="font-medium text-neutral-900">
                        {weekDays[0].toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                        onClick={() => navigateWeek('next')}
                        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-neutral-600" />
                    </button>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day, index) => {
                        const isSelected = isSameDay(day, selectedDate);
                        const isToday = isSameDay(day, today);
                        const hasShifts = getShiftsForDay(day).length > 0;

                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    'flex flex-col items-center py-2 px-1 rounded-lg transition-colors relative',
                                    isSelected
                                        ? 'bg-brand-500 text-white'
                                        : isToday
                                            ? 'bg-brand-100 text-brand-700'
                                            : 'hover:bg-neutral-100'
                                )}
                            >
                                <span className="text-xs opacity-70">
                                    {day.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)}
                                </span>
                                <span className="text-lg font-semibold">
                                    {day.getDate()}
                                </span>
                                {hasShifts && (
                                    <span className={cn(
                                        'w-1.5 h-1.5 rounded-full mt-1',
                                        isSelected ? 'bg-white' : 'bg-brand-500'
                                    )} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Shifts for Selected Date */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
            >
                <h2 className="font-medium text-neutral-900">
                    Plantões - {formatDate(selectedDate)}
                </h2>

                <AnimatePresence mode="wait">
                    {shiftsForSelectedDate.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="card text-center py-8"
                        >
                            <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                            <p className="text-neutral-500">Nenhum plantão agendado para este dia</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-3">
                            {shiftsForSelectedDate.map((shift, index) => {
                                const statusConfig = getStatusConfig(shift.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <motion.div
                                        key={shift.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => setSelectedShift(shift)}
                                        className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-brand-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-neutral-900">
                                                        {shift.patient.name}
                                                    </h3>
                                                    <p className="text-sm text-neutral-500">
                                                        {shift.patient.age} anos • {shift.patient.condition}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                                                statusConfig.bg, statusConfig.color
                                            )}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {statusConfig.label}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-neutral-600">
                                                <Clock className="w-4 h-4" />
                                                <span>{shift.startTime} - {shift.endTime}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-neutral-600">
                                                <MapPin className="w-4 h-4" />
                                                <span className="truncate">{shift.patient.address.split(',')[0]}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Selected Shift Modal */}
            <AnimatePresence>
                {selectedShift && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-end z-50"
                        onClick={() => setSelectedShift(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mb-6" />

                            <h2 className="text-xl font-semibold mb-4">Detalhes do Plantão</h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center">
                                        <User className="w-7 h-7 text-brand-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">{selectedShift.patient.name}</h3>
                                        <p className="text-neutral-500">{selectedShift.patient.age} anos</p>
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                                        <Clock className="w-5 h-5 text-neutral-500" />
                                        <div>
                                            <p className="text-sm text-neutral-500">Horário</p>
                                            <p className="font-medium">{selectedShift.startTime} - {selectedShift.endTime}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                                        <MapPin className="w-5 h-5 text-neutral-500" />
                                        <div>
                                            <p className="text-sm text-neutral-500">Endereço</p>
                                            <p className="font-medium">{selectedShift.patient.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                                        <AlertCircle className="w-5 h-5 text-neutral-500" />
                                        <div>
                                            <p className="text-sm text-neutral-500">Condição</p>
                                            <p className="font-medium">{selectedShift.patient.condition}</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full btn-primary mt-4">
                                    Ver Prontuário do Paciente
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
