// src/types/pricing.ts
// Types for pricing and cost breakdown

export interface PriceBreakdown {
    baseHourlyRate: number;
    hoursPerDay: number;
    daysPerWeek: number;
    shiftsPerMonth: number;
    complexityMultiplier: number;
    nightShiftMultiplier: number;
    weekendMultiplier: number;
    professionalTypeRate: number;
    subtotal: number;
    adjustments: PricingAdjustment[];
    totalAdjustment: number;
    finalShiftCost: number;
    monthlyTotal: number;
}

export interface PricingAdjustment {
    id: string;
    type: 'additional' | 'discount';
    description: string;
    valueType: 'fixed' | 'percentage';
    value: number;
    calculatedValue: number;
}

export interface PricingData {
    baseHourlyRate: number;
    complexityMultiplier: number;
    nightShiftMultiplier: number;
    weekendMultiplier: number;
    dailyCost: number;
    monthlyCost: number;
    taxes: number;
    totalMonthly: number;
}

export interface FrequencyOption {
    days: number;
    label: string;
    weekDays: string[];
    shiftsPerMonth: number;
    shiftCost: number;
    monthlyCost: number;
}

export const PROFESSIONAL_RATES: Record<string, number> = {
    caregiver: 350,      // Base rate for 12h
    tech_nurse: 450,     // Technical nurse rate
    nurse: 600,          // Registered nurse rate
};

// Tipos de frequência de faturamento
export type BillingFrequency =
    | 'specific_days'   // Dias específicos do mês
    | 'daily'           // Diária (por plantão)
    | 'weekly'          // Semanal
    | 'biweekly'        // Quinzenal
    | 'monthly'         // Mensal
    | 'yearly';         // Anual

export interface BillingConfig {
    frequency: BillingFrequency;
    selectedWeekDays?: string[];        // Para weekly: ['seg', 'qua', 'sex']
    selectedMonthDays?: number[];       // Para specific_days: [1, 15, 30]
    shiftsPerPeriod: number;            // Quantidade de plantões no período
    periodLabel: string;                // "semana", "mês", "ano"
    totalValue: number;                 // Valor total do período
    unitValue: number;                  // Valor por plantão
}

export const BILLING_FREQUENCY_OPTIONS: {
    id: BillingFrequency;
    label: string;
    icon: string;
    description: string;
    periodLabel: string;
}[] = [
        { id: 'daily', label: 'Diária', icon: '📅', description: 'Cobrança por plantão individual', periodLabel: 'plantão' },
        { id: 'specific_days', label: 'Dias Específicos', icon: '🗓️', description: 'Selecionar dias do mês', periodLabel: 'mês' },
        { id: 'weekly', label: 'Semanal', icon: '📆', description: 'Fechamento toda semana', periodLabel: 'semana' },
        { id: 'biweekly', label: 'Quinzenal', icon: '📋', description: 'Fechamento a cada 15 dias', periodLabel: 'quinzena' },
        { id: 'monthly', label: 'Mensal', icon: '📊', description: 'Fechamento mensal', periodLabel: 'mês' },
        { id: 'yearly', label: 'Anual', icon: '📈', description: 'Contrato anual', periodLabel: 'ano' },
    ];
