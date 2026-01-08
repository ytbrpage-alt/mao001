'use client';

import { useRouter } from 'next/navigation';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { calculateAbemid } from '@/lib/calculations/abemidCalculator';
import { calculateKatz } from '@/lib/calculations/katzCalculator';
import { calculatePricing, generateFrequencyOptions, formatCurrency } from '@/lib/calculations/pricingCalculator';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProposalViewProps {
    evaluationId?: string;
}

export function ProposalView({ evaluationId }: ProposalViewProps) {
    const router = useRouter();
    const evaluation = useEvaluationStore((state) => state.getCurrentEvaluation());

    if (!evaluation) return null;

    const { patient, schedule, abemid, katz } = evaluation;

    // Calcular resultados
    const abemidResult = calculateAbemid(abemid);
    const katzResult = calculateKatz(katz);

    // Calcular horas
    const startHour = parseInt(schedule.startTime?.split(':')[0] || '7');
    const endHour = parseInt(schedule.endTime?.split(':')[0] || '19');
    const hoursPerDay = endHour > startHour ? endHour - startHour : 24 - startHour + endHour;

    // Calcular preço
    const pricing = calculatePricing({
        professionalType: abemidResult.indicatedProfessional,
        complexityMultiplier: katzResult.complexityMultiplier,
        schedule: {
            ...schedule,
            totalHoursPerDay: hoursPerDay,
        },
    });

    const frequencyOptions = generateFrequencyOptions(pricing.shiftCost);

    // Formatação de dias
    const weekdayLabels: Record<string, string> = {
        mon: 'Segunda', tue: 'Terça', wed: 'Quarta',
        thu: 'Quinta', fri: 'Sexta', sat: 'Sábado', sun: 'Domingo',
    };
    const daysLabel = schedule.weekDays.length === 5 && !schedule.weekDays.includes('sat') && !schedule.weekDays.includes('sun')
        ? 'Segunda a Sexta-feira'
        : schedule.weekDays.length === 7
            ? 'Todos os dias'
            : schedule.weekDays.map(d => weekdayLabels[d]).join(', ');

    // Serviços incluídos baseados na avaliação
    const services = [];
    if (katz.bathing < 1) services.push('Auxílio no banho e higiene pessoal');
    if (katz.feeding < 1) services.push('Acompanhamento na alimentação');
    if (abemid.activeTriggers?.includes('subcutaneous_injection')) services.push('Aplicação de insulina conforme prescrição');
    if (katz.transferring < 0.5) services.push('Supervisão para prevenção de quedas');
    services.push('Administração de medicamentos orais');
    services.push('Estímulo e companhia');

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-brand-500 text-white py-6">
                <div className="container-mobile text-center">
                    <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-2xl font-bold text-brand-600">MA</span>
                    </div>
                    <h1 className="text-xl font-bold">PROPOSTA DE CUIDADOS DOMICILIARES</h1>
                </div>
            </header>

            <div className="container-mobile py-6 space-y-6">
                {/* Info do paciente */}
                <div className="text-center pb-4 border-b border-neutral-200">
                    <p className="text-neutral-600">Elaborada para:</p>
                    <p className="text-xl font-bold text-neutral-900">
                        {patient.preferredName || patient.fullName || 'Paciente'}, {patient.age} anos
                    </p>
                    <p className="text-sm text-neutral-500">
                        Data: {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                </div>

                {/* Avaliação */}
                <section>
                    <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                        📋 Avaliação Realizada
                    </h2>
                    <p className="text-neutral-700 mb-3">
                        Após avaliação presencial, identificamos que {patient.preferredName || 'o(a) paciente'} necessita
                        de cuidados de complexidade {katzResult.complexityMultiplier >= 1.20 ? 'alta' :
                            katzResult.complexityMultiplier >= 1.10 ? 'moderada' : 'leve'}, incluindo:
                    </p>
                    <ul className="space-y-2">
                        {services.map((service, i) => (
                            <li key={i} className="flex items-start gap-2 text-neutral-700">
                                <span className="text-brand-500">•</span>
                                <span>{service}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Profissional */}
                <section className={cn(
                    'p-4 rounded-xl text-center',
                    abemidResult.indicatedProfessional === 'nurse' ? 'bg-danger-50' :
                        abemidResult.indicatedProfessional === 'tech_nurse' ? 'bg-warning-50' :
                            'bg-success-50'
                )}>
                    <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                        👩‍⚕️ Profissional Indicado
                    </h2>
                    <p className={cn(
                        'text-2xl font-bold',
                        abemidResult.indicatedProfessional === 'nurse' ? 'text-danger-600' :
                            abemidResult.indicatedProfessional === 'tech_nurse' ? 'text-warning-600' :
                                'text-success-600'
                    )}>
                        {abemidResult.professionalLabel.toUpperCase()}
                    </p>
                    <p className="text-sm text-neutral-600 mt-1">
                        {abemidResult.justification}
                    </p>
                </section>

                {/* Regime */}
                <section>
                    <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                        📅 Regime de Atendimento
                    </h2>
                    <div className="space-y-2 text-neutral-700">
                        <p>• <strong>Dias:</strong> {daysLabel}</p>
                        <p>• <strong>Horário:</strong> {schedule.startTime || '07:00'} às {schedule.endTime || '19:00'} ({hoursPerDay} horas)</p>
                        <p>• <strong>Total mensal:</strong> {pricing.shiftsPerMonth} plantões</p>
                    </div>
                </section>

                {/* Investimento */}
                <section className="bg-brand-500 text-white p-6 rounded-xl text-center">
                    <h2 className="text-sm font-semibold opacity-80 uppercase tracking-wide mb-2">
                        💰 Investimento
                    </h2>
                    <p className="text-4xl font-bold mb-2">
                        {formatCurrency(pricing.totalMonthly)}<span className="text-lg font-normal"> / mês</span>
                    </p>
                    <p className="text-sm opacity-80">
                        (equivalente a {formatCurrency(pricing.shiftCost)} por dia de atendimento)
                    </p>
                </section>

                {/* Incluído */}
                <section>
                    <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                        ✅ O que está incluído
                    </h2>
                    <ul className="space-y-2">
                        {[
                            'Profissional selecionado para o perfil do paciente',
                            'Supervisão contínua da equipe Mãos Amigas',
                            'Substituição em caso de falta ou férias',
                            'Canal direto de comunicação',
                            'Contrato formal com todas as garantias',
                            'Início em até 48 horas após aprovação',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-neutral-700">
                                <span className="text-success-500">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Outras opções */}
                <section className="bg-neutral-50 p-4 rounded-xl">
                    <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                        📞 Outras opções de frequência
                    </h2>
                    <div className="space-y-2 text-sm">
                        {frequencyOptions
                            .filter(o => o.days !== schedule.weekDays.length)
                            .map((option) => (
                                <div key={option.days} className="flex justify-between">
                                    <span>{option.label}:</span>
                                    <span className="font-medium">{formatCurrency(option.monthlyCost)}/mês</span>
                                </div>
                            ))}
                    </div>
                </section>

                {/* Botões de ação */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                    <button
                        onClick={() => evaluationId && router.push(`/avaliacao/${evaluationId}`)}
                        className="py-4 px-6 rounded-xl border-2 border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors min-h-touch"
                    >
                        Ajustar
                    </button>
                    <button
                        onClick={() => evaluationId && router.push(`/avaliacao/${evaluationId}/contrato`)}
                        className="py-4 px-6 rounded-xl bg-success-500 text-white font-bold hover:bg-success-600 transition-colors min-h-touch"
                    >
                        ✓ Gerar Contrato
                    </button>
                </div>
            </div>
        </div>
    );
}
