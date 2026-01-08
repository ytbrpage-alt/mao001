import { PROFESSIONAL_BASE_RATES } from './abemidCalculator';
import type { ScheduleData, PricingData } from '@/types';

export interface PricingInput {
    professionalType: 'caregiver' | 'tech_nurse' | 'nurse';
    complexityMultiplier: number;
    schedule: Partial<ScheduleData>;
    includeSupplies?: boolean;
    suppliesCost?: number;
}

export interface PricingResult extends PricingData {
    shiftCost: number;
    shiftsPerMonth: number;
    professionalLabel: string;
}

export function calculatePricing(input: PricingInput): PricingResult {
    const {
        professionalType,
        complexityMultiplier,
        schedule,
        includeSupplies = false,
        suppliesCost = 0,
    } = input;

    // Taxa base por tipo de profissional (12h)
    const baseRate = PROFESSIONAL_BASE_RATES[professionalType];

    // Ajustar por horas (se diferente de 12h)
    const hoursPerDay = schedule.totalHoursPerDay || 12;
    const hourlyRate = baseRate / 12;

    // Calcular adicional noturno (20% nas horas entre 22h-05h)
    let nightShiftMultiplier = 1;
    if (schedule.shiftType === 'night' || schedule.shiftType === '24h') {
        // Estimativa: 7 horas noturnas em plantão noturno/24h
        const nightHours = schedule.shiftType === 'night' ? 7 : 7;
        const nightBonus = (nightHours / hoursPerDay) * 0.2;
        nightShiftMultiplier = 1 + nightBonus;
    }

    // Calcular custo do plantão
    const dailyCost = hourlyRate * hoursPerDay;
    const adjustedDailyCost = dailyCost * complexityMultiplier * nightShiftMultiplier;
    const shiftCost = Math.ceil(adjustedDailyCost);

    // Calcular plantões por mês
    const weekDays = schedule.weekDays || ['mon', 'tue', 'wed', 'thu', 'fri'];
    const shiftsPerMonth = Math.round((weekDays.length * 52) / 12);

    // Calcular custo mensal
    const monthlyCost = shiftCost * shiftsPerMonth;

    // Adicionar insumos se incluído
    const suppliesMonthly = includeSupplies ? suppliesCost : 0;

    // Total
    const totalMonthly = monthlyCost + suppliesMonthly;

    const professionalLabels = {
        caregiver: 'Cuidador(a)',
        tech_nurse: 'Técnico(a) de Enfermagem',
        nurse: 'Enfermeiro(a)',
    };

    return {
        baseHourlyRate: hourlyRate,
        complexityMultiplier,
        nightShiftMultiplier,
        weekendMultiplier: 1, // Não implementado ainda
        dailyCost: shiftCost,
        monthlyCost,
        taxes: 0, // Calcular impostos se necessário
        totalMonthly,
        shiftCost,
        shiftsPerMonth,
        professionalLabel: professionalLabels[professionalType],
    };
}

// Gerar opções de frequência com preços dinâmicos
export interface FrequencyOption {
    days: number;
    label: string;
    weekDays: string[];
    shiftsPerMonth: number;
    shiftCost: number;
    monthlyCost: number;
}

export interface FrequencyOptionsInput {
    baseShiftCost: number;
    professionalType: 'caregiver' | 'tech_nurse' | 'nurse';
    complexityMultiplier: number;
    hoursPerDay: number;
    shiftType: string;
}

export function generateFrequencyOptions(
    input: FrequencyOptionsInput | number // backward compatible - accepts just baseShiftCost
): FrequencyOption[] {
    // Backward compatibility: if just a number is passed, use it as base shift cost
    const baseShiftCost = typeof input === 'number' ? input : input.baseShiftCost;

    const options: FrequencyOption[] = [
        {
            days: 3,
            label: '3 dias (alternados)',
            weekDays: ['mon', 'wed', 'fri'],
            shiftsPerMonth: 12,
            shiftCost: baseShiftCost,
            monthlyCost: baseShiftCost * 12,
        },
        {
            days: 5,
            label: '5 dias (Seg-Sex)',
            weekDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
            shiftsPerMonth: 20,
            shiftCost: baseShiftCost,
            monthlyCost: baseShiftCost * 20,
        },
        {
            days: 6,
            label: '6 dias (Seg-Sáb)',
            weekDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            shiftsPerMonth: 24,
            shiftCost: baseShiftCost,
            monthlyCost: baseShiftCost * 24,
        },
        {
            days: 7,
            label: '7 dias (todos)',
            weekDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            shiftsPerMonth: 28,
            shiftCost: baseShiftCost,
            monthlyCost: baseShiftCost * 28,
        },
    ];

    return options;
}

// Generate fully dynamic options with weekend/holiday adjustments
export function generateDynamicFrequencyOptions(input: FrequencyOptionsInput): FrequencyOption[] {
    const { baseShiftCost, shiftType } = input;

    // Weekend multiplier if applicable
    const weekendMultiplier = shiftType === 'night' || shiftType === '24h' ? 1.1 : 1.0;

    const options: FrequencyOption[] = [
        {
            days: 3,
            label: '3 dias (alternados)',
            weekDays: ['mon', 'wed', 'fri'],
            shiftsPerMonth: 12,
            shiftCost: baseShiftCost,
            monthlyCost: baseShiftCost * 12,
        },
        {
            days: 5,
            label: '5 dias (Seg-Sex)',
            weekDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
            shiftsPerMonth: 20,
            shiftCost: baseShiftCost,
            monthlyCost: baseShiftCost * 20,
        },
        {
            days: 6,
            label: '6 dias (Seg-Sáb)',
            weekDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            shiftsPerMonth: 24,
            // Saturday has weekend multiplier
            shiftCost: baseShiftCost,
            monthlyCost: (baseShiftCost * 20) + (baseShiftCost * weekendMultiplier * 4),
        },
        {
            days: 7,
            label: '7 dias (todos)',
            weekDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            shiftsPerMonth: 28,
            // Saturday and Sunday have weekend multiplier
            shiftCost: baseShiftCost,
            monthlyCost: (baseShiftCost * 20) + (baseShiftCost * weekendMultiplier * 8),
        },
    ];

    return options;
}

// Formatar valor em reais
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}
