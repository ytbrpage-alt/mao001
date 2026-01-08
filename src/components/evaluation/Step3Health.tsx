'use client';

import { useEvaluationStore } from '@/stores/evaluationStore';
import { QuestionCard } from '@/components/shared/QuestionCard';
import { SummaryCard } from '@/components/shared/SummaryCard';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Input } from '@/components/ui/Input';
import type { HealthHistoryData } from '@/types';

const NEUROLOGICAL_CONDITIONS = [
    { id: 'alzheimer', label: 'Alzheimer / Demência' },
    { id: 'parkinson', label: 'Parkinson' },
    { id: 'stroke', label: 'AVC / Derrame' },
    { id: 'depression', label: 'Depressão diagnosticada' },
    { id: 'anxiety', label: 'Ansiedade' },
];

const CARDIOVASCULAR_CONDITIONS = [
    { id: 'hypertension', label: 'Hipertensão (pressão alta)' },
    { id: 'diabetes', label: 'Diabetes' },
    { id: 'heart_disease', label: 'Problemas cardíacos' },
    { id: 'cholesterol', label: 'Colesterol alto' },
];

const RESPIRATORY_CONDITIONS = [
    { id: 'copd', label: 'DPOC / Enfisema' },
    { id: 'asthma', label: 'Asma' },
    { id: 'sleep_apnea', label: 'Apneia do sono' },
];

const MOBILITY_CONDITIONS = [
    { id: 'arthrosis', label: 'Artrose / Artrite' },
    { id: 'osteoporosis', label: 'Osteoporose' },
    { id: 'fracture', label: 'Fratura recente' },
    { id: 'prosthesis', label: 'Prótese de quadril/joelho' },
];

const FALLS_OPTIONS = [
    { value: 'none', label: 'Nenhuma' },
    { value: '1_month', label: 'Última queda há menos de 1 mês', badge: 'Risco elevado', badgeColor: 'danger' as const },
    { value: '3_months', label: 'Última queda há 1-3 meses' },
    { value: '6_months', label: 'Última queda há 3-6 meses' },
    { value: 'frequent', label: 'Quedas frequentes', badge: 'Alto risco', badgeColor: 'danger' as const },
];

const MEDICATION_COUNT_OPTIONS = [
    { value: '1-3', label: '1-3 medicamentos' },
    { value: '4-7', label: '4-7 medicamentos', badge: 'Polifarmácia moderada', badgeColor: 'warning' as const },
    { value: '8+', label: '8+ medicamentos', badge: 'Risco de interações', badgeColor: 'danger' as const },
];

const SPECIAL_MEDICATIONS = [
    { id: 'insulin', label: 'Insulina', description: 'Exige técnica de aplicação' },
    { id: 'anticoagulant', label: 'Anticoagulante (Marevan, Xarelto)', description: 'Risco de sangramento' },
    { id: 'controlled', label: 'Medicamento controlado (tarja preta)' },
    { id: 'critical_timing', label: 'Medicamento de horário crítico', description: 'Ex: Parkinson' },
];

const DIETARY_RESTRICTIONS = [
    { id: 'diabetic', label: 'Dieta para diabético' },
    { id: 'low_sodium', label: 'Dieta com pouco sal (hipertensão)' },
    { id: 'fluid_restriction', label: 'Dieta com restrição de líquidos' },
    { id: 'soft', label: 'Dieta pastosa/líquida (dificuldade de engolir)' },
    { id: 'vegetarian', label: 'Vegetariano/vegano' },
    { id: 'religious', label: 'Restrição religiosa (kosher, halal)' },
];

export function Step3Health() {
    const { healthHistory, updateHealthHistory } = useEvaluationStore((state) => ({
        healthHistory: state.getCurrentEvaluation()?.healthHistory,
        updateHealthHistory: state.updateHealthHistory,
    }));

    if (!healthHistory) return null;

    const handleConditionToggle = (
        field: 'neurologicalConditions' | 'cardiovascularConditions' | 'respiratoryConditions' | 'mobilityConditions' | 'otherConditions',
        id: string,
        checked: boolean
    ) => {
        const current = healthHistory[field];
        const updated = checked ? [...current, id] : current.filter((c) => c !== id);
        updateHealthHistory({ [field]: updated });
    };

    const handleMedicationToggle = (id: string, checked: boolean) => {
        const meds = checked
            ? [...healthHistory.specialMedications, id]
            : healthHistory.specialMedications.filter((m) => m !== id);
        updateHealthHistory({ specialMedications: meds });
    };

    const handleDietaryToggle = (id: string, checked: boolean) => {
        const restrictions = checked
            ? [...healthHistory.dietaryRestrictions, id]
            : healthHistory.dietaryRestrictions.filter((r) => r !== id);
        updateHealthHistory({ dietaryRestrictions: restrictions });
    };

    // Contar condições
    const totalConditions =
        healthHistory.neurologicalConditions.length +
        healthHistory.cardiovascularConditions.length +
        healthHistory.respiratoryConditions.length +
        healthHistory.mobilityConditions.length +
        healthHistory.otherConditions.length;

    const usesInsulin = healthHistory.specialMedications.includes('insulin');

    return (
        <div className="space-y-6">
            {/* Diagnósticos */}
            <QuestionCard
                title="DIAGNÓSTICOS E CONDIÇÕES"
                script="Quais problemas de saúde o(a) paciente tem?"
            >
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-neutral-700 mb-2">Neurológico/Cognitivo</p>
                        <div className="space-y-2">
                            {NEUROLOGICAL_CONDITIONS.map((cond) => (
                                <Checkbox
                                    key={cond.id}
                                    id={cond.id}
                                    label={cond.label}
                                    checked={healthHistory.neurologicalConditions.includes(cond.id)}
                                    onCheckedChange={(checked) => handleConditionToggle('neurologicalConditions', cond.id, checked)}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-neutral-700 mb-2">Cardiovascular</p>
                        <div className="space-y-2">
                            {CARDIOVASCULAR_CONDITIONS.map((cond) => (
                                <Checkbox
                                    key={cond.id}
                                    id={cond.id}
                                    label={cond.label}
                                    checked={healthHistory.cardiovascularConditions.includes(cond.id)}
                                    onCheckedChange={(checked) => handleConditionToggle('cardiovascularConditions', cond.id, checked)}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-neutral-700 mb-2">Respiratório</p>
                        <div className="space-y-2">
                            {RESPIRATORY_CONDITIONS.map((cond) => (
                                <Checkbox
                                    key={cond.id}
                                    id={cond.id}
                                    label={cond.label}
                                    checked={healthHistory.respiratoryConditions.includes(cond.id)}
                                    onCheckedChange={(checked) => handleConditionToggle('respiratoryConditions', cond.id, checked)}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-neutral-700 mb-2">Mobilidade</p>
                        <div className="space-y-2">
                            {MOBILITY_CONDITIONS.map((cond) => (
                                <Checkbox
                                    key={cond.id}
                                    id={cond.id}
                                    label={cond.label}
                                    checked={healthHistory.mobilityConditions.includes(cond.id)}
                                    onCheckedChange={(checked) => handleConditionToggle('mobilityConditions', cond.id, checked)}
                                />
                            ))}
                        </div>
                    </div>

                    <Input
                        label="Outras condições"
                        value={healthHistory.otherConditions.join(', ')}
                        onChange={(e) => updateHealthHistory({ otherConditions: e.target.value.split(', ').filter(Boolean) })}
                        placeholder="Ex: Câncer, doença renal..."
                    />
                </div>
            </QuestionCard>

            {/* Histórico Recente */}
            <QuestionCard
                title="HISTÓRICO RECENTE"
                script="Aconteceu alguma coisa importante nos últimos meses? Internação, cirurgia, queda...?"
            >
                <Checkbox
                    id="hospitalizations"
                    label="Hospitalizações recentes (últimos 12 meses)"
                    checked={healthHistory.recentHospitalizations}
                    onCheckedChange={(checked) => updateHealthHistory({ recentHospitalizations: checked })}
                />

                <RadioGroup
                    label="Quedas recentes (últimos 6 meses)"
                    options={FALLS_OPTIONS}
                    value={healthHistory.recentFalls}
                    onValueChange={(value) => updateHealthHistory({ recentFalls: value as HealthHistoryData['recentFalls'] })}
                />

                <Checkbox
                    id="surgery"
                    label="Cirurgias recentes"
                    checked={healthHistory.recentSurgery}
                    onCheckedChange={(checked) => updateHealthHistory({ recentSurgery: checked })}
                />
            </QuestionCard>

            {/* Medicamentos */}
            <QuestionCard
                title="MEDICAMENTOS EM USO"
                script="O(A) paciente toma muitos remédios? Consegue me mostrar?"
            >
                <p className="text-xs text-neutral-500 mb-3">
                    💡 Ideal: pedir para ver a receita ou caixa dos remédios
                </p>

                <RadioGroup
                    label="Quantidade aproximada de medicamentos"
                    options={MEDICATION_COUNT_OPTIONS}
                    value={healthHistory.medicationCount}
                    onValueChange={(value) => updateHealthHistory({ medicationCount: value as HealthHistoryData['medicationCount'] })}
                />

                <div className="space-y-3">
                    <p className="text-sm font-medium text-neutral-700">Medicamentos que exigem atenção especial</p>
                    {SPECIAL_MEDICATIONS.map((med) => (
                        <Checkbox
                            key={med.id}
                            id={med.id}
                            label={med.label}
                            description={med.description}
                            checked={healthHistory.specialMedications.includes(med.id)}
                            onCheckedChange={(checked) => handleMedicationToggle(med.id, checked)}
                        />
                    ))}
                </div>
            </QuestionCard>

            {/* Alergias */}
            <QuestionCard
                title="ALERGIAS E RESTRIÇÕES"
                script="Tem alguma alergia que a gente precisa saber?"
            >
                <Checkbox
                    id="no_allergies"
                    label="Nenhuma alergia conhecida"
                    checked={!healthHistory.hasAllergies}
                    onCheckedChange={(checked) => updateHealthHistory({ hasAllergies: !checked })}
                />

                {healthHistory.hasAllergies && (
                    <div className="space-y-3 mt-3">
                        <Input
                            label="Alergia a medicamentos"
                            value={healthHistory.medicationAllergies}
                            onChange={(e) => updateHealthHistory({ medicationAllergies: e.target.value })}
                        />
                        <Input
                            label="Alergia alimentar"
                            value={healthHistory.foodAllergies}
                            onChange={(e) => updateHealthHistory({ foodAllergies: e.target.value })}
                        />
                        <Checkbox
                            id="latex_allergy"
                            label="Alergia a látex (importante para luvas)"
                            checked={healthHistory.latexAllergy}
                            onCheckedChange={(checked) => updateHealthHistory({ latexAllergy: checked })}
                        />
                        <Input
                            label="Outras alergias"
                            value={healthHistory.otherAllergies}
                            onChange={(e) => updateHealthHistory({ otherAllergies: e.target.value })}
                        />
                    </div>
                )}

                <div className="space-y-3 mt-4">
                    <p className="text-sm font-medium text-neutral-700">Restrições alimentares</p>
                    {DIETARY_RESTRICTIONS.map((restriction) => (
                        <Checkbox
                            key={restriction.id}
                            id={restriction.id}
                            label={restriction.label}
                            checked={healthHistory.dietaryRestrictions.includes(restriction.id)}
                            onCheckedChange={(checked) => handleDietaryToggle(restriction.id, checked)}
                        />
                    ))}
                    <Input
                        label="Outras restrições"
                        value={healthHistory.otherDietaryRestrictions}
                        onChange={(e) => updateHealthHistory({ otherDietaryRestrictions: e.target.value })}
                    />
                </div>
            </QuestionCard>

            {/* Resumo */}
            <SummaryCard
                title="INDICADORES DE COMPLEXIDADE CLÍNICA"
                items={[
                    { label: 'Condições crônicas', value: totalConditions.toString() },
                    {
                        label: 'Polifarmácia',
                        value: healthHistory.medicationCount === '8+' ? 'Sim - 8+ medicamentos' :
                            healthHistory.medicationCount === '4-7' ? 'Moderada - 4-7 medicamentos' : 'Não',
                        color: healthHistory.medicationCount === '8+' ? 'danger' : 'default',
                    },
                    {
                        label: 'Quedas recentes',
                        value: healthHistory.recentFalls === 'none' ? 'Não' : 'Sim',
                        color: healthHistory.recentFalls === 'frequent' || healthHistory.recentFalls === '1_month' ? 'danger' : 'default',
                    },
                    {
                        label: 'Usa insulina',
                        value: usesInsulin ? 'Sim' : 'Não',
                        color: usesInsulin ? 'warning' : 'default',
                        highlight: usesInsulin,
                    },
                ]}
                tip={usesInsulin ? '⚠️ Necessário Técnico de Enfermagem para aplicação de insulina' : undefined}
            />
        </div>
    );
}
