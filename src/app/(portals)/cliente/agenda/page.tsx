'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    MapPin,
    Filter,
} from 'lucide-react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    addMonths,
    subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils/cn';

// Mock de eventos
const mockEvents = [
    {
        id: '1',
        date: new Date(),
        startTime: '07:00',
        endTime: '19:00',
        title: 'Plantão - Ana Paula',
        type: 'shift',
        professionalName: 'Ana Paula Costa',
        professionalType: 'Cuidadora',
        status: 'confirmed',
    },
    {
        id: '2',
        date: new Date(),
        startTime: '14:00',
        endTime: '15:00',
        title: 'Fisioterapia',
        type: 'appointment',
        professionalName: 'Dr. Carlos Silva',
        professionalType: 'Fisioterapeuta',
        location: 'Residência',
        status: 'confirmed',
    },
    {
        id: '3',
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        startTime: '10:00',
        endTime: '11:00',
        title: 'Consulta Neurologia',
        type: 'external',
        professionalName: 'Dra. Patricia Souza',
        professionalType: 'Neurologista',
        location: 'Clínica Neuro Center - Rua Principal, 500',
        status: 'confirmed',
    },
];

export default function ClientAgendaPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    }, [currentDate]);

    const selectedDayEvents = useMemo(() => {
        return mockEvents.filter((event) => isSameDay(event.date, selectedDate));
    }, [selectedDate]);

    const hasEvents = (day: Date) => mockEvents.some((event) => isSameDay(event.date, day));

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case 'shift': return 'bg-brand-500';
            case 'appointment': return 'bg-purple-500';
            case 'external': return 'bg-orange-500';
            default: return 'bg-neutral-500';
        }
    };

    const getEventTypeBadge = (type: string) => {
        switch (type) {
            case 'shift': return { label: 'Plantão', class: 'bg-brand-100 text-brand-700' };
            case 'appointment': return { label: 'Atendimento', class: 'bg-purple-100 text-purple-700' };
            case 'external': return { label: 'Externo', class: 'bg-orange-100 text-orange-700' };
            default: return { label: 'Outro', class: 'bg-neutral-100 text-neutral-700' };
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-neutral-900">Agenda</h1>
                <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
                    <Filter className="w-5 h-5" />
                </button>
            </div>

            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-neutral-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-neutral-900 capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </h2>
                    <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-neutral-100 rounded-lg">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-7 mb-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-neutral-500 py-2">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isSelected = isSameDay(day, selectedDate);
                        const dayHasEvents = hasEvents(day);

                        return (
                            <motion.button
                                key={idx}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    'aspect-square flex flex-col items-center justify-center rounded-lg relative transition-colors',
                                    !isCurrentMonth && 'text-neutral-300',
                                    isCurrentMonth && !isSelected && 'hover:bg-neutral-100',
                                    isSelected && 'bg-brand-500 text-white',
                                    isToday(day) && !isSelected && 'ring-2 ring-brand-500 ring-inset',
                                )}
                            >
                                <span className={cn('text-sm', isSelected && 'font-semibold')}>{format(day, 'd')}</span>
                                {dayHasEvents && !isSelected && (
                                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-brand-500" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-neutral-900 mb-3">
                    {isToday(selectedDate) ? 'Hoje' : format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </h3>

                {selectedDayEvents.length === 0 ? (
                    <div className="card text-center py-8">
                        <CalendarIcon className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                        <p className="text-neutral-500">Nenhum evento neste dia</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {selectedDayEvents.map((event, idx) => {
                                const typeBadge = getEventTypeBadge(event.type);

                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="card"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={cn('w-3 h-3 rounded-full', getEventTypeColor(event.type))} />
                                                <div className="w-0.5 flex-1 bg-neutral-200 my-1" />
                                            </div>

                                            <div className="flex-1 pb-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="font-semibold text-neutral-900">{event.title}</p>
                                                        <span className={cn('badge mt-1', typeBadge.class)}>{typeBadge.label}</span>
                                                    </div>
                                                    <div className="text-right text-sm text-neutral-500">
                                                        <p>{event.startTime}</p>
                                                        <p>{event.endTime}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 space-y-2 text-sm text-neutral-600">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-neutral-400" />
                                                        <span>{event.professionalName}</span>
                                                        <span className="text-neutral-400">•</span>
                                                        <span className="text-neutral-400">{event.professionalType}</span>
                                                    </div>

                                                    {event.location && (
                                                        <div className="flex items-start gap-2">
                                                            <MapPin className="w-4 h-4 text-neutral-400 mt-0.5" />
                                                            <span>{event.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
