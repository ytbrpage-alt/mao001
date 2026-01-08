'use client';

import { useState } from 'react';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { QuestionCard } from '@/components/shared/QuestionCard';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { calculateAbemid } from '@/lib/calculations/abemidCalculator';
import { calculateKatz } from '@/lib/calculations/katzCalculator';
import { calculatePricing, generateFrequencyOptions, formatCurrency } from '@/lib/calculations/pricingCalculator';
import { cn } from '@/lib/utils/cn';
import { Plus, Trash2, Percent, DollarSign } from 'lucide-react';
import { BillingFrequency, BILLING_FREQUENCY_OPTIONS } from '@/types/pricing';

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
    value: `${i.toString().padStart(2, '0')}:00`,
    label: `${i.toString().padStart(2, '0')}:00`,
}));

const SHIFT_TYPE_OPTIONS = [
    { value: 'day', label: 'Diurno (sem adicional noturno)' },
    { value: 'night', label: 'Noturno (+20% nas horas entre 22h-05h)' },
    { value: '24h', label: '24 horas (com pernoite)' },
];

const WEEKDAYS = [
    { id: 'mon', label: 'Seg' },
    { id: 'tue', label: 'Ter' },
    { id: 'wed', label: 'Qua' },
    { id: 'thu', label: 'Qui' },
    { id: 'fri', label: 'Sex' },
    { id: 'sat', label: 'Sáb' },
    { id: 'sun', label: 'Dom' },
];

interface PricingAdjustment {
    id: string;
    type: 'additional' | 'discount';
    description: string;
    valueType: 'fixed' | 'percentage';
    value: number;
}

export function Step7Proposal() {
    const store = useEvaluationStore();
    const evaluation = store.getCurrentEvaluation();

    // Estados para personalização de preço
    const [adjustments, setAdjustments] = useState<PricingAdjustment[]>([]);
    const [customShiftValue, setCustomShiftValue] = useState<number | null>(null);
    const [useCustomPrice, setUseCustomPrice] = useState(false);
    const [discountReason, setDiscountReason] = useState('');
    const [additionalReason, setAdditionalReason] = useState('');

    // Estados para tipo de fechamento e frequência selecionada (alinhado com backend)
    const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>('monthly');
    const [selectedFrequencyDays, setSelectedFrequencyDays] = useState<number | null>(null);
    const [specificMonthDays, setSpecificMonthDays] = useState<number[]>([]);
    const [selectedWeekDaysForBilling, setSelectedWeekDaysForBilling] = useState<string[]>([]);

    // Filtro de dias da semana para o calendário mensal
    const [weekdayFilter, setWeekdayFilter] = useState<string[]>([]);

    // Helper para obter o dia da semana de uma data (usando mês atual como referência)
    const getWeekdayForDay = (day: number): string => {
        const currentDate = new Date();
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const weekdays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
        return weekdays[date.getDay()];
    };

    const getWeekdayLabel = (day: number): string => {
        const labels: Record<string, string> = {
            'dom': 'Dom', 'seg': 'Seg', 'ter': 'Ter', 'qua': 'Qua',
            'qui': 'Qui', 'sex': 'Sex', 'sab': 'Sáb'
        };
        return labels[getWeekdayForDay(day)];
    };

    // Verificar se um dia deve ser exibido baseado no filtro
    const isDayVisible = (day: number): boolean => {
        if (weekdayFilter.length === 0) return true;
        return weekdayFilter.includes(getWeekdayForDay(day));
    };

    if (!evaluation) return null;

    const { schedule, patient, abemid, katz, lawton, safetyChecklist } = evaluation;

    // Calcular resultados
    const abemidResult = calculateAbemid(abemid);
    const katzResult = calculateKatz(katz);

    // Calcular horas por dia
    const startHour = parseInt(schedule.startTime?.split(':')[0] || '7');
    const endHour = parseInt(schedule.endTime?.split(':')[0] || '19');
    const hoursPerDay = endHour > startHour ? endHour - startHour : 24 - startHour + endHour;

    // Calcular preço base
    const basePricing = calculatePricing({
        professionalType: abemidResult.indicatedProfessional,
        complexityMultiplier: katzResult.complexityMultiplier,
        schedule: {
            ...schedule,
            totalHoursPerDay: hoursPerDay,
        },
    });

    // Calcular ajustes
    const calculateAdjustedPrice = () => {
        let baseShift = useCustomPrice && customShiftValue !== null
            ? customShiftValue
            : basePricing.shiftCost;

        let totalAdjustment = 0;

        adjustments.forEach(adj => {
            if (adj.type === 'additional') {
                if (adj.valueType === 'fixed') {
                    totalAdjustment += adj.value;
                } else {
                    totalAdjustment += (baseShift * adj.value / 100);
                }
            } else {
                if (adj.valueType === 'fixed') {
                    totalAdjustment -= adj.value;
                } else {
                    totalAdjustment -= (baseShift * adj.value / 100);
                }
            }
        });

        const finalShiftCost = baseShift + totalAdjustment;
        const shiftsPerMonth = Math.round((schedule.weekDays.length * 52) / 12);
        const monthlyTotal = finalShiftCost * shiftsPerMonth;

        return {
            baseShift,
            totalAdjustment,
            finalShiftCost,
            shiftsPerMonth,
            monthlyTotal,
        };
    };

    const adjustedPricing = calculateAdjustedPrice();

    // Gerar opções de frequência com preço ajustado
    const frequencyOptions = generateFrequencyOptions(adjustedPricing.finalShiftCost);

    const handleWeekdayToggle = (dayId: string, checked: boolean) => {
        const days = checked
            ? [...schedule.weekDays, dayId]
            : schedule.weekDays.filter((d) => d !== dayId);
        store.updateSchedule({ weekDays: days });
    };

    const addAdjustment = (type: 'additional' | 'discount') => {
        const newAdjustment: PricingAdjustment = {
            id: Date.now().toString(),
            type,
            description: type === 'additional' ? additionalReason : discountReason,
            valueType: 'fixed',
            value: 0,
        };
        setAdjustments([...adjustments, newAdjustment]);
        if (type === 'additional') setAdditionalReason('');
        else setDiscountReason('');
    };

    const updateAdjustment = (id: string, updates: Partial<PricingAdjustment>) => {
        setAdjustments(adjustments.map(adj =>
            adj.id === id ? { ...adj, ...updates } : adj
        ));
    };

    const removeAdjustment = (id: string) => {
        setAdjustments(adjustments.filter(adj => adj.id !== id));
    };

    // Contar riscos críticos do checklist
    const criticalRisks = [
        safetyChecklist?.bathroom?.noGrabBarsShower,
        safetyChecklist?.bathroom?.slipperyShowerFloor,
    ].filter(Boolean).length;

    // Gerar cláusulas
    const clauses = [
        lawton?.medicationSeparation && 'Administração de medicamentos conforme receita',
        abemid?.activeTriggers?.includes('subcutaneous_injection') && 'Aplicação de insulina/injeções subcutâneas',
        lawton?.supplyProvision === 'family' && 'Fornecimento de insumos pela família',
        lawton?.houseworkScope && 'Escopo de trabalho (apenas cuidados ao paciente)',
        safetyChecklist?.familyPosition === 'wont_adapt' && 'Assunção de risco ambiental',
        'Não-pessoalidade (empresa pode substituir profissional)',
    ].filter(Boolean);

    return (
        <div className="space-y-6">
            {/* Introdução */}
            <div className="bg-brand-50 dark:bg-brand-900/30 p-4 rounded-xl border border-brand-200 dark:border-brand-700">
                <p className="text-sm text-brand-700 dark:text-brand-200">
                    💬 "Agora que entendi bem a situação, vou montar uma proposta personalizada.
                    Me conta: qual seria o horário ideal para ter o cuidador aqui?"
                </p>
            </div>

            {/* Definição de Horário */}
            <QuestionCard title="DEFINIÇÃO DE HORÁRIO">
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Horário de entrada"
                        options={TIME_OPTIONS}
                        value={schedule.startTime}
                        onValueChange={(value) => store.updateSchedule({ startTime: value })}
                    />
                    <Select
                        label="Horário de saída"
                        options={TIME_OPTIONS}
                        value={schedule.endTime}
                        onValueChange={(value) => store.updateSchedule({ endTime: value })}
                    />
                </div>

                <div className="bg-neutral-100 p-3 rounded-lg text-center">
                    <span className="text-sm text-neutral-600">Total de horas: </span>
                    <span className="text-lg font-bold text-brand-600">{hoursPerDay} horas/dia</span>
                </div>

                <RadioGroup
                    label="Tipo de turno"
                    options={SHIFT_TYPE_OPTIONS}
                    value={schedule.shiftType}
                    onValueChange={(value) => store.updateSchedule({ shiftType: value })}
                />
            </QuestionCard>

            {/* Definição de Frequência */}
            <QuestionCard title="DEFINIÇÃO DE FREQUÊNCIA">
                <p className="text-sm text-neutral-600 mb-3">
                    💬 "E quantos dias por semana vocês precisam?"
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {WEEKDAYS.map((day) => (
                        <label
                            key={day.id}
                            className={cn(
                                'flex items-center justify-center w-12 h-12 rounded-lg border-2 cursor-pointer font-medium transition-colors',
                                schedule.weekDays.includes(day.id)
                                    ? 'bg-brand-500 border-brand-500 text-white'
                                    : 'bg-white border-neutral-300 text-neutral-700 hover:border-brand-300'
                            )}
                        >
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={schedule.weekDays.includes(day.id)}
                                onChange={(e) => handleWeekdayToggle(day.id, e.target.checked)}
                            />
                            {day.label}
                        </label>
                    ))}
                </div>

                <div className="flex justify-between text-sm text-neutral-600 mb-4">
                    <span>Total: <strong>{schedule.weekDays.length} dias/semana</strong></span>
                    <span>Plantões/mês: <strong>{adjustedPricing.shiftsPerMonth}</strong></span>
                </div>
            </QuestionCard>

            {/* NOVA SEÇÃO: Personalização de Preço */}
            <QuestionCard title="💰 PERSONALIZAÇÃO DE PREÇO">
                <p className="text-sm text-neutral-600 mb-4">
                    Configure o preço final de acordo com as negociações.
                </p>

                {/* Preço Base Sugerido */}
                <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-neutral-700">Preço Base Sugerido (Sistema):</span>
                        <span className="text-lg font-bold text-neutral-900">{formatCurrency(basePricing.shiftCost)}/plantão</span>
                    </div>
                    <div className="text-xs text-neutral-500">
                        {abemidResult.professionalLabel} • {hoursPerDay}h • Complexidade ×{katzResult.complexityMultiplier.toFixed(2)}
                    </div>
                </div>

                {/* Option to use custom price - Toggle visível */}
                <div className="mb-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        {/* Toggle Switch estilizado */}
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={useCustomPrice}
                                onChange={(e) => {
                                    setUseCustomPrice(e.target.checked);
                                    if (e.target.checked && customShiftValue === null) {
                                        setCustomShiftValue(basePricing.shiftCost);
                                    }
                                }}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-neutral-300 dark:bg-neutral-600 rounded-full peer-checked:bg-brand-500 transition-colors" />
                            <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6" />
                        </div>
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            Usar valor personalizado por plantão
                        </span>
                    </label>
                </div>

                {useCustomPrice && (
                    <div className="bg-brand-50 dark:bg-brand-900/30 p-4 rounded-lg mb-4 border border-brand-200 dark:border-brand-600">
                        <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
                            Valor por plantão (R$)
                        </label>
                        <input
                            type="number"
                            value={customShiftValue || ''}
                            onChange={(e) => setCustomShiftValue(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 rounded-lg border-2 border-brand-300 dark:border-brand-500 bg-white dark:bg-neutral-800 text-lg font-bold text-brand-700 dark:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-neutral-400"
                            step="10"
                            min="0"
                        />
                    </div>
                )}

                {/* Adicionais */}
                <div className="border-t border-neutral-200 pt-4 mt-4">
                    <h4 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-success-600" />
                        ADICIONAIS
                    </h4>

                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={additionalReason}
                            onChange={(e) => setAdditionalReason(e.target.value)}
                            placeholder="Motivo do adicional (ex: Feriado, Cuidados especiais)"
                            className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 text-sm"
                        />
                        <button
                            onClick={() => addAdjustment('additional')}
                            disabled={!additionalReason}
                            className="px-4 py-2 bg-success-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {adjustments.filter(a => a.type === 'additional').map(adj => (
                        <div key={adj.id} className="flex items-center gap-2 p-3 bg-success-50 rounded-lg mb-2">
                            <span className="text-sm text-success-700 flex-1">{adj.description}</span>
                            <select
                                value={adj.valueType}
                                onChange={(e) => updateAdjustment(adj.id, { valueType: e.target.value as 'fixed' | 'percentage' })}
                                className="px-2 py-1 rounded border border-success-300 text-sm"
                            >
                                <option value="fixed">R$</option>
                                <option value="percentage">%</option>
                            </select>
                            <input
                                type="number"
                                value={adj.value}
                                onChange={(e) => updateAdjustment(adj.id, { value: parseFloat(e.target.value) || 0 })}
                                className="w-20 px-2 py-1 rounded border border-success-300 text-sm text-right"
                                step={adj.valueType === 'percentage' ? '1' : '10'}
                            />
                            <button
                                onClick={() => removeAdjustment(adj.id)}
                                className="p-1 text-danger-500 hover:bg-danger-50 rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Descontos */}
                <div className="border-t border-neutral-200 pt-4 mt-4">
                    <h4 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                        <Percent className="w-4 h-4 text-warning-600" />
                        DESCONTOS
                    </h4>

                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={discountReason}
                            onChange={(e) => setDiscountReason(e.target.value)}
                            placeholder="Motivo do desconto (ex: Indicação, Fidelidade)"
                            className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 text-sm"
                        />
                        <button
                            onClick={() => addAdjustment('discount')}
                            disabled={!discountReason}
                            className="px-4 py-2 bg-warning-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            <Percent className="w-4 h-4" />
                        </button>
                    </div>

                    {adjustments.filter(a => a.type === 'discount').map(adj => (
                        <div key={adj.id} className="flex items-center gap-2 p-3 bg-warning-50 rounded-lg mb-2">
                            <span className="text-sm text-warning-700 flex-1">{adj.description}</span>
                            <select
                                value={adj.valueType}
                                onChange={(e) => updateAdjustment(adj.id, { valueType: e.target.value as 'fixed' | 'percentage' })}
                                className="px-2 py-1 rounded border border-warning-300 text-sm"
                            >
                                <option value="fixed">R$</option>
                                <option value="percentage">%</option>
                            </select>
                            <input
                                type="number"
                                value={adj.value}
                                onChange={(e) => updateAdjustment(adj.id, { value: parseFloat(e.target.value) || 0 })}
                                className="w-20 px-2 py-1 rounded border border-warning-300 text-sm text-right"
                                step={adj.valueType === 'percentage' ? '1' : '10'}
                            />
                            <button
                                onClick={() => removeAdjustment(adj.id)}
                                className="p-1 text-danger-500 hover:bg-danger-50 rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Resumo dos Ajustes */}
                {adjustments.length > 0 && (
                    <div className="border-t border-neutral-200 pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                            RESUMO DOS AJUSTES
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Base:</span>
                                <span>{formatCurrency(adjustedPricing.baseShift)}</span>
                            </div>
                            {adjustments.map(adj => (
                                <div key={adj.id} className="flex justify-between">
                                    <span className={adj.type === 'additional' ? 'text-success-600' : 'text-warning-600'}>
                                        {adj.type === 'additional' ? '+' : '-'} {adj.description}
                                    </span>
                                    <span className={adj.type === 'additional' ? 'text-success-600' : 'text-warning-600'}>
                                        {adj.type === 'additional' ? '+' : '-'}
                                        {adj.valueType === 'percentage'
                                            ? `${adj.value}%`
                                            : formatCurrency(adj.value)}
                                    </span>
                                </div>
                            ))}
                            <div className="flex justify-between font-bold pt-2 border-t border-neutral-200">
                                <span>Ajuste total:</span>
                                <span className={adjustedPricing.totalAdjustment >= 0 ? 'text-success-600' : 'text-warning-600'}>
                                    {adjustedPricing.totalAdjustment >= 0 ? '+' : ''}{formatCurrency(adjustedPricing.totalAdjustment)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </QuestionCard>

            {/* Opções de Fechamento e Frequência */}
            <QuestionCard title="📊 OPÇÕES DE FECHAMENTO">
                {/* Tipo de Fechamento/Frequência */}
                <div className="mb-6">
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                        Selecione o tipo de fechamento/cobrança:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BILLING_FREQUENCY_OPTIONS.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setBillingFrequency(option.id)}
                                className={cn(
                                    'p-3 rounded-lg border-2 text-left transition-all',
                                    billingFrequency === option.id
                                        ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 text-brand-700 dark:text-brand-300 shadow-md'
                                        : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:border-brand-300'
                                )}
                            >
                                <span className="text-lg">{option.icon}</span>
                                <span className="font-medium block">{option.label}</span>
                                <span className="text-xs opacity-75">{option.description}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Seção de seleção de dias da semana (para weekly) */}
                {billingFrequency === 'weekly' && (
                    <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-3">
                            Quais dias da semana terá plantão?
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {WEEKDAYS.map((day) => (
                                <button
                                    key={day.id}
                                    onClick={() => {
                                        setSelectedWeekDaysForBilling(prev =>
                                            prev.includes(day.id)
                                                ? prev.filter(d => d !== day.id)
                                                : [...prev, day.id]
                                        );
                                    }}
                                    className={cn(
                                        'px-4 py-2 rounded-lg font-medium transition-all',
                                        selectedWeekDaysForBilling.includes(day.id)
                                            ? 'bg-brand-500 text-white shadow-md'
                                            : 'bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:border-brand-300'
                                    )}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                        {selectedWeekDaysForBilling.length > 0 && (
                            <div className="mt-3 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
                                <p className="text-sm text-brand-700 dark:text-brand-300">
                                    <strong>{selectedWeekDaysForBilling.length}</strong> dia(s) por semana =
                                    <strong className="ml-1">{selectedWeekDaysForBilling.length * 4} plantões/mês</strong>
                                </p>
                                <p className="text-lg font-bold text-brand-600 dark:text-brand-400 mt-1">
                                    {formatCurrency(adjustedPricing.finalShiftCost * selectedWeekDaysForBilling.length)}/semana
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Seção para quinzenal */}
                {billingFrequency === 'biweekly' && (
                    <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-3">
                            Configuração quinzenal:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-white dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">Plantões por quinzena</p>
                                <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                                    {schedule.weekDays.length * 2}
                                </p>
                            </div>
                            <div className="p-4 bg-brand-50 dark:bg-brand-900/30 rounded-lg border border-brand-200 dark:border-brand-600">
                                <p className="text-xs text-brand-600 dark:text-brand-400 uppercase">Valor quinzenal</p>
                                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                                    {formatCurrency(adjustedPricing.finalShiftCost * schedule.weekDays.length * 2)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Seção para anual */}
                {billingFrequency === 'yearly' && (
                    <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-3">
                            Contrato anual:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-white dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">Plantões por ano</p>
                                <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                                    {schedule.weekDays.length * 52}
                                </p>
                            </div>
                            <div className="p-4 bg-brand-50 dark:bg-brand-900/30 rounded-lg border border-brand-200 dark:border-brand-600">
                                <p className="text-xs text-brand-600 dark:text-brand-400 uppercase">Valor anual estimado</p>
                                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                                    {formatCurrency(adjustedPricing.monthlyTotal * 12)}
                                </p>
                                <p className="text-xs text-success-600 dark:text-success-400 mt-1">
                                    🎁 Desconto de fidelidade pode ser aplicado
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dias específicos do mês (se selecionado) */}
                {billingFrequency === 'specific_days' && (
                    <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                        {/* Filtro por dia da semana */}
                        <div className="mb-4">
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                                Filtrar por dia da semana:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'seg', label: 'Seg' },
                                    { id: 'ter', label: 'Ter' },
                                    { id: 'qua', label: 'Qua' },
                                    { id: 'qui', label: 'Qui' },
                                    { id: 'sex', label: 'Sex' },
                                    { id: 'sab', label: 'Sáb' },
                                    { id: 'dom', label: 'Dom' },
                                ].map((weekday) => (
                                    <button
                                        key={weekday.id}
                                        onClick={() => {
                                            setWeekdayFilter(prev =>
                                                prev.includes(weekday.id)
                                                    ? prev.filter(d => d !== weekday.id)
                                                    : [...prev, weekday.id]
                                            );
                                        }}
                                        className={cn(
                                            'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                                            weekdayFilter.includes(weekday.id)
                                                ? 'bg-brand-500 text-white shadow-md'
                                                : 'bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:border-brand-300'
                                        )}
                                    >
                                        {weekday.label}
                                    </button>
                                ))}
                                {weekdayFilter.length > 0 && (
                                    <button
                                        onClick={() => setWeekdayFilter([])}
                                        className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                    >
                                        Limpar filtro
                                    </button>
                                )}
                            </div>
                            {weekdayFilter.length > 0 && (
                                <p className="text-xs text-brand-600 dark:text-brand-400 mt-2">
                                    Exibindo apenas: {weekdayFilter.map(d => {
                                        const labels: Record<string, string> = {
                                            'dom': 'Dom', 'seg': 'Seg', 'ter': 'Ter', 'qua': 'Qua',
                                            'qui': 'Qui', 'sex': 'Sex', 'sab': 'Sáb'
                                        };
                                        return labels[d];
                                    }).join(', ')}
                                </p>
                            )}
                        </div>

                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-3">
                            {weekdayFilter.length > 0
                                ? `Dias de ${weekdayFilter.map(d => {
                                    const labels: Record<string, string> = {
                                        'dom': 'Domingo', 'seg': 'Segunda', 'ter': 'Terça', 'qua': 'Quarta',
                                        'qui': 'Quinta', 'sex': 'Sexta', 'sab': 'Sábado'
                                    };
                                    return labels[d];
                                }).join(' e ')} do mês:`
                                : 'Selecione os dias do mês:'
                            }
                        </p>

                        {/* Grid do calendário - apenas dias visíveis */}
                        {weekdayFilter.length === 0 ? (
                            /* Calendário completo quando não há filtro */
                            <>
                                {/* Cabeçalho dos dias da semana */}
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((label) => (
                                        <div key={label} className="text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 py-1">
                                            {label}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                                        const isSelected = specificMonthDays.includes(day);
                                        return (
                                            <button
                                                key={day}
                                                onClick={() => {
                                                    setSpecificMonthDays(prev =>
                                                        prev.includes(day)
                                                            ? prev.filter(d => d !== day)
                                                            : [...prev, day].sort((a, b) => a - b)
                                                    );
                                                }}
                                                className={cn(
                                                    'w-full aspect-square rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center gap-0.5',
                                                    isSelected
                                                        ? 'bg-brand-500 text-white shadow-md'
                                                        : 'bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                                                )}
                                            >
                                                <span className="text-sm font-bold">{day}</span>
                                                <span className={cn(
                                                    'text-[10px]',
                                                    isSelected ? 'text-white/80' : 'text-neutral-400 dark:text-neutral-500'
                                                )}>
                                                    {getWeekdayLabel(day)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            /* Grid reorganizado com apenas os dias filtrados */
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                {Array.from({ length: 31 }, (_, i) => i + 1)
                                    .filter(day => isDayVisible(day))
                                    .map((day) => {
                                        const isSelected = specificMonthDays.includes(day);
                                        return (
                                            <button
                                                key={day}
                                                onClick={() => {
                                                    setSpecificMonthDays(prev =>
                                                        prev.includes(day)
                                                            ? prev.filter(d => d !== day)
                                                            : [...prev, day].sort((a, b) => a - b)
                                                    );
                                                }}
                                                className={cn(
                                                    'p-3 rounded-xl text-center transition-all',
                                                    isSelected
                                                        ? 'bg-brand-500 text-white shadow-lg ring-2 ring-brand-400'
                                                        : 'bg-white dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                                                )}
                                            >
                                                <span className="text-2xl font-bold block">{day}</span>
                                                <span className={cn(
                                                    'text-xs font-medium',
                                                    isSelected ? 'text-white/90' : 'text-neutral-500 dark:text-neutral-400'
                                                )}>
                                                    {getWeekdayLabel(day)}
                                                </span>
                                            </button>
                                        );
                                    })}
                            </div>
                        )}

                        {/* Resumo da seleção */}
                        <div className="mt-3 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
                            <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
                                {specificMonthDays.length} dia(s) selecionado(s)
                            </p>
                            {specificMonthDays.length > 0 && (
                                <p className="text-xs text-brand-600 dark:text-brand-400 mt-1">
                                    Dias: {specificMonthDays.map(d => `${d} (${getWeekdayLabel(d)})`).join(', ')}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Opções de Frequência - Dinâmicas por tipo de fechamento */}
                <div className="space-y-2">
                    {/* DIÁRIA - Valor único por plantão */}
                    {billingFrequency === 'daily' && (
                        <>
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                                💰 Valor por diária:
                            </p>
                            <div className="p-4 bg-brand-50 dark:bg-brand-900/30 rounded-lg border-2 border-brand-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium text-neutral-800 dark:text-neutral-100">Valor por plantão (diária)</span>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            Cobrança individual por atendimento
                                        </p>
                                    </div>
                                    <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                                        {formatCurrency(adjustedPricing.finalShiftCost)}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* DIAS ESPECÍFICOS - Valor por dias selecionados */}
                    {billingFrequency === 'specific_days' && (
                        <>
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                                📅 Resumo da seleção de dias:
                            </p>
                            <div className="p-4 bg-brand-50 dark:bg-brand-900/30 rounded-lg border-2 border-brand-500">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">Dias selecionados</p>
                                        <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                                            {specificMonthDays.length}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">Valor por dia</p>
                                        <p className="text-xl font-bold text-brand-600 dark:text-brand-400">
                                            {formatCurrency(adjustedPricing.finalShiftCost)}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-brand-200 dark:border-brand-600">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-neutral-700 dark:text-neutral-200">Total mensal estimado:</span>
                                        <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                                            {formatCurrency(adjustedPricing.finalShiftCost * specificMonthDays.length)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* SEMANAL - Valor por semana baseado nos dias selecionados */}
                    {billingFrequency === 'weekly' && (
                        <>
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                                📆 Resumo semanal:
                            </p>
                            <div className="p-4 bg-brand-50 dark:bg-brand-900/30 rounded-lg border-2 border-brand-500">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">Dias/semana</p>
                                        <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                                            {selectedWeekDaysForBilling.length || schedule.weekDays.length}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">Valor/dia</p>
                                        <p className="text-lg font-bold text-neutral-600 dark:text-neutral-300">
                                            {formatCurrency(adjustedPricing.finalShiftCost)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-brand-600 dark:text-brand-400 uppercase font-semibold">Total/semana</p>
                                        <p className="text-xl font-bold text-brand-600 dark:text-brand-400">
                                            {formatCurrency(adjustedPricing.finalShiftCost * (selectedWeekDaysForBilling.length || schedule.weekDays.length))}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-brand-200 dark:border-brand-600">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600 dark:text-neutral-300">Estimativa mensal (4 semanas):</span>
                                        <span className="font-bold text-neutral-800 dark:text-neutral-100">
                                            {formatCurrency(adjustedPricing.finalShiftCost * (selectedWeekDaysForBilling.length || schedule.weekDays.length) * 4)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* QUINZENAL - Valor quinzenal */}
                    {billingFrequency === 'biweekly' && (
                        <>
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                                📋 Selecione a frequência semanal para cálculo quinzenal:
                            </p>
                            {frequencyOptions.map((option) => (
                                <button
                                    key={option.days}
                                    onClick={() => {
                                        setSelectedFrequencyDays(option.days);
                                        store.updateSchedule({ weekDays: option.weekDays as any });
                                    }}
                                    className={cn(
                                        'w-full flex justify-between items-center p-4 rounded-lg border-2 transition-all text-left',
                                        (selectedFrequencyDays === option.days || schedule.weekDays.length === option.days)
                                            ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 shadow-md'
                                            : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-600 hover:border-brand-300'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                                            (selectedFrequencyDays === option.days || schedule.weekDays.length === option.days)
                                                ? 'border-brand-500 bg-brand-500'
                                                : 'border-neutral-300 dark:border-neutral-500'
                                        )}>
                                            {(selectedFrequencyDays === option.days || schedule.weekDays.length === option.days) && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-medium text-neutral-800 dark:text-neutral-100">{option.label}</span>
                                            <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
                                                → {option.days * 2} plantões/quinzena
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                                        {formatCurrency(adjustedPricing.finalShiftCost * option.days * 2)}/quinzena
                                    </span>
                                </button>
                            ))}
                        </>
                    )}

                    {/* MENSAL - Opções de frequência com valores mensais */}
                    {billingFrequency === 'monthly' && (
                        <>
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                                📊 Selecione a frequência semanal:
                            </p>
                            {frequencyOptions.map((option) => (
                                <button
                                    key={option.days}
                                    onClick={() => {
                                        setSelectedFrequencyDays(option.days);
                                        store.updateSchedule({ weekDays: option.weekDays as any });
                                    }}
                                    className={cn(
                                        'w-full flex justify-between items-center p-4 rounded-lg border-2 transition-all text-left',
                                        (selectedFrequencyDays === option.days || schedule.weekDays.length === option.days)
                                            ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 shadow-md'
                                            : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-600 hover:border-brand-300'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                                            (selectedFrequencyDays === option.days || schedule.weekDays.length === option.days)
                                                ? 'border-brand-500 bg-brand-500'
                                                : 'border-neutral-300 dark:border-neutral-500'
                                        )}>
                                            {(selectedFrequencyDays === option.days || schedule.weekDays.length === option.days) && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-medium text-neutral-800 dark:text-neutral-100">{option.label}</span>
                                            <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
                                                → {option.shiftsPerMonth} plantões/mês
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                                        {formatCurrency(option.monthlyCost)}
                                    </span>
                                </button>
                            ))}
                        </>
                    )}

                    {/* ANUAL - Opções de frequência com valores anuais */}
                    {billingFrequency === 'yearly' && (
                        <>
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                                📈 Selecione a frequência semanal para contrato anual:
                            </p>
                            {frequencyOptions.map((option) => {
                                const annualShifts = option.shiftsPerMonth * 12;
                                const annualCost = option.monthlyCost * 12;
                                const discountedCost = annualCost * 0.95; // 5% desconto fidelidade

                                return (
                                    <button
                                        key={option.days}
                                        onClick={() => {
                                            setSelectedFrequencyDays(option.days);
                                            store.updateSchedule({ weekDays: option.weekDays as any });
                                        }}
                                        className={cn(
                                            'w-full p-4 rounded-lg border-2 transition-all text-left',
                                            (selectedFrequencyDays === option.days || schedule.weekDays.length === option.days)
                                                ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 shadow-md'
                                                : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-600 hover:border-brand-300'
                                        )}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1',
                                                    (selectedFrequencyDays === option.days || schedule.weekDays.length === option.days)
                                                        ? 'border-brand-500 bg-brand-500'
                                                        : 'border-neutral-300 dark:border-neutral-500'
                                                )}>
                                                    {(selectedFrequencyDays === option.days || schedule.weekDays.length === option.days) && (
                                                        <div className="w-2 h-2 rounded-full bg-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-neutral-800 dark:text-neutral-100">{option.label}</span>
                                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                        {annualShifts} plantões/ano
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-neutral-400 line-through">
                                                    {formatCurrency(annualCost)}
                                                </p>
                                                <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                                                    {formatCurrency(discountedCost)}
                                                </p>
                                                <p className="text-xs text-success-600 dark:text-success-400">
                                                    🎁 5% desconto fidelidade
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </>
                    )}
                </div>

                {/* Resumo do fechamento selecionado */}
                <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Tipo de Fechamento</p>
                            <p className="font-medium text-neutral-800 dark:text-neutral-100">
                                {billingFrequency === 'monthly' && 'Mensal'}
                                {billingFrequency === 'daily' && 'Diária (por plantão)'}
                                {billingFrequency === 'weekly' && `Semanal (${selectedWeekDaysForBilling.length || schedule.weekDays.length} dias/semana)`}
                                {billingFrequency === 'biweekly' && 'Quinzenal'}
                                {billingFrequency === 'yearly' && 'Anual'}
                                {billingFrequency === 'specific_days' && `${specificMonthDays.length} dia(s) do mês`}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Valor Estimado</p>
                            <p className="text-xl font-bold text-brand-600 dark:text-brand-400">
                                {billingFrequency === 'daily'
                                    ? `${formatCurrency(adjustedPricing.finalShiftCost)}/dia`
                                    : billingFrequency === 'specific_days'
                                        ? formatCurrency(adjustedPricing.finalShiftCost * specificMonthDays.length)
                                        : billingFrequency === 'weekly'
                                            ? `${formatCurrency(adjustedPricing.finalShiftCost * (selectedWeekDaysForBilling.length || schedule.weekDays.length))}/semana`
                                            : billingFrequency === 'biweekly'
                                                ? `${formatCurrency(adjustedPricing.finalShiftCost * schedule.weekDays.length * 2)}/quinzena`
                                                : billingFrequency === 'yearly'
                                                    ? `${formatCurrency(adjustedPricing.monthlyTotal * 12)}/ano`
                                                    : `${formatCurrency(adjustedPricing.monthlyTotal)}/mês`
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </QuestionCard>

            {/* Resumo Final */}
            <div className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-4">
                    📋 RESUMO FINAL (Visão do Avaliador)
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between pb-2 border-b border-neutral-200">
                        <span className="font-medium">PACIENTE:</span>
                        <span>{patient.fullName || 'Não informado'}, {patient.age} anos</span>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium text-neutral-600">AVALIAÇÕES:</p>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>• ABEMID: {abemidResult.totalScore} pts</span>
                                <span className={cn(
                                    'font-medium',
                                    abemidResult.indicatedProfessional === 'nurse' ? 'text-danger-600' :
                                        abemidResult.indicatedProfessional === 'tech_nurse' ? 'text-warning-600' :
                                            'text-success-600'
                                )}>
                                    → {abemidResult.indicatedProfessional === 'nurse' ? '🔴' :
                                        abemidResult.indicatedProfessional === 'tech_nurse' ? '🟡' : '🟢'} {abemidResult.professionalLabel}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>• KATZ: {katzResult.totalScore} pts</span>
                                <span>→ Multiplicador ×{katzResult.complexityMultiplier.toFixed(2)}</span>
                            </div>
                            {criticalRisks > 0 && (
                                <div className="flex justify-between">
                                    <span>• Checklist: {criticalRisks} riscos críticos</span>
                                    <span className="text-danger-600">→ Cláusula de risco</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-200">
                        <p className="text-sm font-medium text-neutral-600">PRECIFICAÇÃO:</p>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Valor sugerido (sistema):</span>
                                <span>{formatCurrency(basePricing.shiftCost)}</span>
                            </div>
                            {useCustomPrice && (
                                <div className="flex justify-between text-brand-600">
                                    <span>Valor personalizado:</span>
                                    <span>{formatCurrency(customShiftValue || 0)}</span>
                                </div>
                            )}
                            {adjustments.length > 0 && (
                                <div className="flex justify-between">
                                    <span>Ajustes ({adjustments.length}):</span>
                                    <span className={adjustedPricing.totalAdjustment >= 0 ? 'text-success-600' : 'text-warning-600'}>
                                        {adjustedPricing.totalAdjustment >= 0 ? '+' : ''}{formatCurrency(adjustedPricing.totalAdjustment)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between font-medium">
                                <span>Valor/plantão final:</span>
                                <span>{formatCurrency(adjustedPricing.finalShiftCost)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>× {adjustedPricing.shiftsPerMonth} plantões:</span>
                                <span>{formatCurrency(adjustedPricing.monthlyTotal)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-brand-500 text-white rounded-lg text-center">
                        <p className="text-sm opacity-80">VALOR MENSAL FINAL</p>
                        <p className="text-3xl font-bold">{formatCurrency(adjustedPricing.monthlyTotal)}</p>
                        <p className="text-sm opacity-80 mt-1">
                            ({formatCurrency(adjustedPricing.finalShiftCost)}/plantão)
                        </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-200">
                        <p className="text-sm font-medium text-neutral-600">CLÁUSULAS A INCLUIR:</p>
                        <div className="space-y-1">
                            {clauses.map((clause, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <span className="text-success-500">✓</span>
                                    <span>{clause}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
