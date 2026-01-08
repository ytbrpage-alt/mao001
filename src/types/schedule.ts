// src/types/schedule.ts
// Types for schedule and shift data

export type ShiftType = 'day' | 'night' | '24h';

export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface ScheduleData {
    startTime: string;
    endTime: string;
    shiftType: ShiftType | string;
    weekDays: WeekDay[] | string[];
    totalHoursPerDay: number;
    preferredStartDate: Date | null;
    flexibility: 'fixed' | 'flexible' | 'negotiable';
    specialRequirements: string;
    holidays: 'included' | 'excluded' | 'negotiable';
    notes: string;
}

export const WEEKDAYS: { id: WeekDay; label: string; shortLabel: string }[] = [
    { id: 'mon', label: 'Segunda-feira', shortLabel: 'Seg' },
    { id: 'tue', label: 'Terça-feira', shortLabel: 'Ter' },
    { id: 'wed', label: 'Quarta-feira', shortLabel: 'Qua' },
    { id: 'thu', label: 'Quinta-feira', shortLabel: 'Qui' },
    { id: 'fri', label: 'Sexta-feira', shortLabel: 'Sex' },
    { id: 'sat', label: 'Sábado', shortLabel: 'Sáb' },
    { id: 'sun', label: 'Domingo', shortLabel: 'Dom' },
];

export const SHIFT_TYPE_OPTIONS: { value: ShiftType; label: string; description: string }[] = [
    { value: 'day', label: 'Diurno', description: 'Sem adicional noturno' },
    { value: 'night', label: 'Noturno', description: '+20% nas horas entre 22h-05h' },
    { value: '24h', label: '24 horas', description: 'Com pernoite' },
];
