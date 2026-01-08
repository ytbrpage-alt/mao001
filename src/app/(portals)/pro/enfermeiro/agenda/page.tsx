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
    Stethoscope,
    Pill,
    Activity,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Tipos
interface ScheduleItem {
    id: string;
    time: string;
    type: 'visit' | 'procedure' | 'medication' | 'assessment';
    patient: {
        name: string;
        age: number;
        room?: string;
        condition: string;
    };
    description: string;
    status: 'pending' | 'completed' | 'in_progress';
    priority: 'normal' | 'high' | 'urgent';
}

// Mock data
const generateDaySchedule = (): ScheduleItem[] => [
    {
        id: '1',
        time: '07:00',
        type: 'medication',
        patient: { name: 'Maria Silva', age: 82, room: '501', condition: 'Alzheimer' },
        description: 'Administrar medicação matinal',
        status: 'completed',
        priority: 'normal'
    },
    {
        id: '2',
        time: '08:00',
        type: 'assessment',
        patient: { name: 'João Santos', age: 75, room: '502', condition: 'Pós-AVC' },
        description: 'Aferição de sinais vitais',
        status: 'completed',
        priority: 'normal'
    },
    {
        id: '3',
        time: '09:30',
        type: 'procedure',
        patient: { name: 'Ana Oliveira', age: 68, room: '503', condition: 'DPOC' },
        description: 'Troca de curativo - MID',
        status: 'in_progress',
        priority: 'high'
    },
    {
        id: '4',
        time: '10:00',
        type: 'visit',
        patient: { name: 'Pedro Costa', age: 79, room: '504', condition: 'Diabetes' },
        description: 'Visita de rotina + glicemia',
        status: 'pending',
        priority: 'normal'
    },
    {
        id: '5',
        time: '11:00',
        type: 'medication',
        patient: { name: 'Maria Silva', age: 82, room: '501', condition: 'Alzheimer' },
        description: 'Medicação pré-almoço',
        status: 'pending',
        priority: 'normal'
    },
    {
        id: '6',
        time: '12:00',
        type: 'assessment',
        patient: { name: 'Ana Oliveira', age: 68, room: '503', condition: 'DPOC' },
        description: 'Monitorização SpO2 - URGENTE',
        status: 'pending',
        priority: 'urgent'
    },
];

const schedule = generateDaySchedule();

// Helpers
const getTypeConfig = (type: ScheduleItem['type']) => {
    switch (type) {
        case 'visit':
            return { icon: User, color: 'text-blue-600', bg: 'bg-blue-100' };
        case 'procedure':
            return { icon: Stethoscope, color: 'text-green-600', bg: 'bg-green-100' };
        case 'medication':
            return { icon: Pill, color: 'text-purple-600', bg: 'bg-purple-100' };
        case 'assessment':
            return { icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' };
    }
};

const getStatusConfig = (status: ScheduleItem['status']) => {
    switch (status) {
        case 'completed':
            return { icon: CheckCircle, color: 'text-success-500', label: 'Concluído' };
        case 'in_progress':
            return { icon: Clock, color: 'text-warning-500', label: 'Em andamento' };
        case 'pending':
            return { icon: Clock, color: 'text-neutral-400', label: 'Pendente' };
    }
};

export default function EnfermeiroAgendaPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const today = new Date();

    // Generate week dates
    const weekDays: Date[] = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        weekDays.push(day);
    }

    const navigateDay = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        setSelectedDate(newDate);
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
                    Agenda do Dia
                </h1>
            </motion.div>

            {/* Date Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-3"
            >
                <div className="flex items-center justify-between mb-3">
                    <button
                        onClick={() => navigateDay('prev')}
                        className="p-2 rounded-lg hover:bg-neutral-100"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                        <p className="font-semibold text-neutral-900" suppressHydrationWarning>
                            {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
                        </p>
                        <p className="text-sm text-neutral-500" suppressHydrationWarning>
                            {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    <button
                        onClick={() => navigateDay('next')}
                        className="p-2 rounded-lg hover:bg-neutral-100"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Date Pills */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {weekDays.map((day, idx) => {
                        const isToday = day.toDateString() === today.toDateString();
                        const isSelected = day.toDateString() === selectedDate.toDateString();

                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    'flex-shrink-0 px-3 py-2 rounded-lg text-center min-w-[50px] transition-colors',
                                    isSelected ? 'bg-brand-500 text-white' :
                                        isToday ? 'bg-brand-100 text-brand-700' :
                                            'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                )}
                            >
                                <p className="text-xs opacity-70">
                                    {day.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)}
                                </p>
                                <p className="font-semibold">{day.getDate()}</p>
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-4 gap-2"
            >
                <div className="card p-3 text-center">
                    <p className="text-xl font-bold text-brand-600">
                        {schedule.filter(s => s.status === 'completed').length}
                    </p>
                    <p className="text-xs text-neutral-500">Concluídos</p>
                </div>
                <div className="card p-3 text-center">
                    <p className="text-xl font-bold text-warning-600">
                        {schedule.filter(s => s.status === 'in_progress').length}
                    </p>
                    <p className="text-xs text-neutral-500">Em andamento</p>
                </div>
                <div className="card p-3 text-center">
                    <p className="text-xl font-bold text-neutral-600">
                        {schedule.filter(s => s.status === 'pending').length}
                    </p>
                    <p className="text-xs text-neutral-500">Pendentes</p>
                </div>
                <div className="card p-3 text-center">
                    <p className="text-xl font-bold text-error-600">
                        {schedule.filter(s => s.priority === 'urgent').length}
                    </p>
                    <p className="text-xs text-neutral-500">Urgentes</p>
                </div>
            </motion.div>

            {/* Timeline */}
            <div className="space-y-2">
                {schedule.map((item, index) => {
                    const typeConfig = getTypeConfig(item.type);
                    const statusConfig = getStatusConfig(item.status);
                    const TypeIcon = typeConfig.icon;
                    const StatusIcon = statusConfig.icon;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                'card p-4 border-l-4',
                                item.priority === 'urgent' ? 'border-l-error-500 bg-error-50' :
                                    item.priority === 'high' ? 'border-l-warning-500' :
                                        item.status === 'completed' ? 'border-l-success-500 opacity-60' :
                                            'border-l-neutral-300'
                            )}
                        >
                            <div className="flex items-start gap-3">
                                {/* Time */}
                                <div className="text-center flex-shrink-0 w-12">
                                    <p className={cn(
                                        'font-bold text-lg',
                                        item.status === 'completed' ? 'text-neutral-400' : 'text-neutral-900'
                                    )}>
                                        {item.time}
                                    </p>
                                </div>

                                {/* Icon */}
                                <div className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                                    typeConfig.bg
                                )}>
                                    <TypeIcon className={cn('w-5 h-5', typeConfig.color)} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className={cn(
                                                'font-medium',
                                                item.status === 'completed' ? 'text-neutral-500 line-through' : 'text-neutral-900'
                                            )}>
                                                {item.description}
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                {item.patient.name} • {item.patient.age} anos
                                                {item.patient.room && ` • Quarto ${item.patient.room}`}
                                            </p>
                                        </div>
                                        <StatusIcon className={cn('w-5 h-5 flex-shrink-0', statusConfig.color)} />
                                    </div>

                                    {item.priority === 'urgent' && (
                                        <div className="flex items-center gap-1 mt-2 text-error-600 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="font-medium">Prioridade URGENTE</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
