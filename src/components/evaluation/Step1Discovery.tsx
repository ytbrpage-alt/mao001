'use client';

import { useEvaluationStore } from '@/stores/evaluationStore';
import { QuestionCard } from '@/components/shared/QuestionCard';
import { SummaryCard } from '@/components/shared/SummaryCard';
import { TextArea } from '@/components/ui/TextArea';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Checkbox } from '@/components/ui/Checkbox';
import { Slider } from '@/components/ui/Slider';
import { Input } from '@/components/ui/Input';
import type { TriggerCategory, CaregiverType, PreviousExperience } from '@/types/discovery';

const TRIGGER_OPTIONS = [
    { value: 'fall', label: 'Queda recente' },
    { value: 'cognitive_decline', label: 'Piora cognitiva' },
    { value: 'hospital_discharge', label: 'Alta hospitalar' },
    { value: 'family_overload', label: 'Sobrecarga familiar' },
    { value: 'new_diagnosis', label: 'Diagnóstico novo' },
    { value: 'previous_caregiver', label: 'Cuidador anterior não deu certo' },
    { value: 'spouse_death', label: 'Falecimento do cônjuge' },
    { value: 'other', label: 'Outro' },
];

const CAREGIVER_OPTIONS = [
    { value: 'elderly_spouse', label: 'Cônjuge idoso', badge: 'Vulnerável', badgeColor: 'warning' as const },
    { value: 'working_child', label: 'Filho(a) que trabalha', badge: 'Sobrecarga dupla', badgeColor: 'warning' as const },
    { value: 'family_rotation', label: 'Revezamento familiar', badge: 'Desgaste relacional', badgeColor: 'warning' as const },
    { value: 'informal', label: 'Cuidador informal (vizinho, conhecido)' },
    { value: 'previous_professional', label: 'Já teve cuidador profissional antes' },
    { value: 'alone', label: 'Está sozinho(a) durante o dia', badge: 'URGENTE', badgeColor: 'danger' as const },
];

const CONCERNS = [
    { id: 'falls', label: 'Medo de quedas' },
    { id: 'choking', label: 'Medo de engasgo' },
    { id: 'medication', label: 'Medo de não dar a medicação certa' },
    { id: 'mistreatment', label: 'Medo de maus tratos por cuidador' },
    { id: 'cost', label: 'Preocupação com o custo' },
    { id: 'guilt', label: 'Culpa por "terceirizar" o cuidado' },
    { id: 'acceptance', label: 'Medo do idoso não aceitar estranho' },
    { id: 'own_health', label: 'Preocupação com a própria saúde (cuidador)' },
    { id: 'work_impact', label: 'Impacto no trabalho/carreira' },
];

const EXPERIENCE_OPTIONS = [
    { value: 'none', label: 'Nunca tiveram cuidador' },
    { value: 'positive', label: 'Tiveram e foi positivo' },
    { value: 'negative', label: 'Tiveram e foi negativo' },
];

const NEGATIVE_ISSUES = [
    { id: 'absences', label: 'Faltava muito' },
    { id: 'unqualified', label: 'Não tinha qualificação' },
    { id: 'mistreatment', label: 'Maltratou o idoso' },
    { id: 'dishonest', label: 'Roubou/foi desonesto' },
    { id: 'poor_work', label: 'Não fazia as tarefas direito' },
    { id: 'conflict', label: 'Conflito de personalidade' },
    { id: 'expensive', label: 'Custo muito alto' },
];

export function Step1Discovery() {
    const { discovery, updateDiscovery } = useEvaluationStore((state) => ({
        discovery: state.getCurrentEvaluation()?.discovery,
        updateDiscovery: state.updateDiscovery,
    }));

    if (!discovery) return null;

    const handleConcernToggle = (concernId: string, checked: boolean) => {
        const concerns = checked
            ? [...discovery.concerns, concernId]
            : discovery.concerns.filter((c) => c !== concernId);
        updateDiscovery({ concerns });
    };

    const handleIssueToggle = (issueId: string, checked: boolean) => {
        const issues = checked
            ? [...discovery.previousIssues, issueId]
            : discovery.previousIssues.filter((i) => i !== issueId);
        updateDiscovery({ previousIssues: issues });
    };

    // Gerar resumo
    const triggerLabel = TRIGGER_OPTIONS.find(t => t.value === discovery.triggerCategory)?.label || '';
    const caregiverLabel = CAREGIVER_OPTIONS.find(c => c.value === discovery.currentCaregiver)?.label || '';
    const mainConcernLabel = CONCERNS.find(c => c.id === discovery.mainConcern)?.label || discovery.concerns[0] ? CONCERNS.find(c => c.id === discovery.concerns[0])?.label : '';
    const experienceLabel = EXPERIENCE_OPTIONS.find(e => e.value === discovery.previousExperience)?.label || '';

    return (
        <div className="space-y-6">
            {/* Pergunta 1: O Gatilho */}
            <QuestionCard
                number={1}
                title="O GATILHO"
                script="Me conta... o que aconteceu que fez vocês buscarem ajuda profissional agora?"
                objective="Identificar o evento gatilho e urgência"
            >
                <TextArea
                    label="Registrar resposta"
                    value={discovery.triggerEvent}
                    onChange={(e) => updateDiscovery({ triggerEvent: e.target.value })}
                    placeholder="Descreva o que a família relatou..."
                />

                <RadioGroup
                    label="Classificar gatilho"
                    options={TRIGGER_OPTIONS}
                    value={discovery.triggerCategory}
                    onValueChange={(value) => updateDiscovery({ triggerCategory: value as TriggerCategory })}
                />

                {discovery.triggerCategory === 'other' && (
                    <Input
                        label="Especificar"
                        value={discovery.triggerDetails}
                        onChange={(e) => updateDiscovery({ triggerDetails: e.target.value })}
                    />
                )}
            </QuestionCard>

            {/* Pergunta 2: Situação Atual */}
            <QuestionCard
                number={2}
                title="A SITUAÇÃO ATUAL"
                script="E hoje, como está sendo o dia a dia? Quem está cuidando do(a) paciente?"
                objective="Mapear rede de apoio e sobrecarga"
            >
                <RadioGroup
                    label="Cuidador atual"
                    options={CAREGIVER_OPTIONS}
                    value={discovery.currentCaregiver}
                    onValueChange={(value) => updateDiscovery({ currentCaregiver: value as CaregiverType })}
                />

                <Slider
                    label="Nível de sobrecarga familiar percebido"
                    value={discovery.familyBurdenLevel}
                    onValueChange={(value) => updateDiscovery({ familyBurdenLevel: value })}
                    min={1}
                    max={10}
                    minLabel="Leve"
                    maxLabel="Crítico"
                />
            </QuestionCard>

            {/* Pergunta 3: Preocupações */}
            <QuestionCard
                number={3}
                title="AS PREOCUPAÇÕES"
                script="O que mais te preocupa em relação ao cuidado? O que te tira o sono?"
                objective="Identificar medos para endereçar depois"
            >
                <p className="text-sm text-neutral-600 mb-3">
                    Preocupações relatadas (marcar todas mencionadas):
                </p>
                <div className="space-y-3">
                    {CONCERNS.map((concern) => (
                        <Checkbox
                            key={concern.id}
                            id={concern.id}
                            label={concern.label}
                            checked={discovery.concerns.includes(concern.id)}
                            onCheckedChange={(checked) => handleConcernToggle(concern.id, checked)}
                        />
                    ))}
                </div>

                <Input
                    label="Outra preocupação"
                    value={discovery.mainConcern}
                    onChange={(e) => updateDiscovery({ mainConcern: e.target.value })}
                    placeholder="Descreva outras preocupações..."
                />
            </QuestionCard>

            {/* Pergunta 4: Experiências Anteriores */}
            <QuestionCard
                number={4}
                title="EXPERIÊNCIAS ANTERIORES"
                script="Vocês já tiveram alguma experiência com cuidador antes? Como foi?"
                objective="Entender objeções ocultas e expectativas"
            >
                <RadioGroup
                    options={EXPERIENCE_OPTIONS}
                    value={discovery.previousExperience}
                    onValueChange={(value) => updateDiscovery({ previousExperience: value as PreviousExperience })}
                />

                {discovery.previousExperience === 'negative' && (
                    <div className="mt-4 p-4 bg-warning-50 rounded-lg">
                        <p className="text-sm font-medium text-warning-700 mb-3">
                            O que deu errado?
                        </p>
                        <div className="space-y-3">
                            {NEGATIVE_ISSUES.map((issue) => (
                                <Checkbox
                                    key={issue.id}
                                    id={issue.id}
                                    label={issue.label}
                                    checked={discovery.previousIssues.includes(issue.id)}
                                    onCheckedChange={(checked) => handleIssueToggle(issue.id, checked)}
                                />
                            ))}
                        </div>
                        <Input
                            label="Outro problema"
                            value={discovery.previousIssueDetails}
                            onChange={(e) => updateDiscovery({ previousIssueDetails: e.target.value })}
                            className="mt-3"
                        />
                        <p className="text-xs text-warning-600 mt-3">
                            ⚠️ <strong>ANOTAR:</strong> Endereçar esses problemas na apresentação da proposta.
                        </p>
                    </div>
                )}

                {discovery.previousExperience === 'positive' && (
                    <Input
                        label="Por que mudaram?"
                        value={discovery.previousIssueDetails}
                        onChange={(e) => updateDiscovery({ previousIssueDetails: e.target.value })}
                    />
                )}
            </QuestionCard>

            {/* Notas adicionais */}
            <QuestionCard title="NOTAS ADICIONAIS">
                <TextArea
                    value={discovery.notes}
                    onChange={(e) => updateDiscovery({ notes: e.target.value })}
                    placeholder="Observações importantes sobre a descoberta..."
                />
            </QuestionCard>

            {/* Resumo */}
            <SummaryCard
                title="RESUMO DA DESCOBERTA"
                items={[
                    { label: 'Gatilho', value: triggerLabel },
                    {
                        label: 'Urgência percebida',
                        value: discovery.currentCaregiver === 'alone' ? 'Alta - idoso ficando sozinho' : discovery.familyBurdenLevel >= 7 ? 'Moderada-Alta' : 'Moderada',
                        color: discovery.currentCaregiver === 'alone' ? 'danger' : 'default',
                    },
                    { label: 'Sobrecarga familiar', value: `${discovery.familyBurdenLevel}/10` },
                    { label: 'Principal preocupação', value: mainConcernLabel || '—' },
                    { label: 'Experiência anterior', value: experienceLabel },
                ]}
                tip="Use essas informações na apresentação final!"
            />
        </div>
    );
}
