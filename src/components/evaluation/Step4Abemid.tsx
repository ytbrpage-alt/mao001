'use client';

import { useEvaluationStore } from '@/stores/evaluationStore';
import { QuestionCard } from '@/components/shared/QuestionCard';
import { SummaryCard } from '@/components/shared/SummaryCard';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { calculateAbemid } from '@/lib/calculations/abemidCalculator';
import { cn } from '@/lib/utils/cn';

export function Step4Abemid() {
    const { abemid, updateAbemid } = useEvaluationStore((state) => ({
        abemid: state.getCurrentEvaluation()?.abemid,
        updateAbemid: state.updateAbemid,
    }));

    if (!abemid) return null;

    const result = calculateAbemid(abemid);

    const handleTriggerToggle = (trigger: string, checked: boolean) => {
        const triggers = checked
            ? [...abemid.activeTriggers, trigger]
            : abemid.activeTriggers.filter((t) => t !== trigger);
        updateAbemid({ activeTriggers: triggers });
    };

    return (
        <div className="space-y-6">
            {/* Introdução */}
            <div className="bg-brand-50 p-4 rounded-xl">
                <p className="text-sm text-brand-800">
                    💬 "Agora vou entender melhor como está o dia a dia do(a) paciente
                    em relação a algumas atividades importantes. Isso me ajuda a indicar
                    o profissional mais adequado."
                </p>
            </div>

            {/* 1. Consciência */}
            <QuestionCard
                number={1}
                title="CONSCIÊNCIA E ORIENTAÇÃO"
                script="O(A) paciente está lúcido(a)? Sabe onde está, que dia é hoje, reconhece todo mundo?"
            >
                <RadioGroup
                    options={[
                        {
                            value: '0',
                            label: 'Totalmente lúcido(a)',
                            description: 'Conversa normalmente, sabe a data, reconhece todos',
                        },
                        {
                            value: '2',
                            label: 'Às vezes confuso(a)',
                            description: 'Tem momentos de esquecimento, repete perguntas',
                        },
                        {
                            value: '5',
                            label: 'Muito confuso(a) ou não responsivo',
                            description: 'Não reconhece familiares, desorientado no tempo e espaço',
                            badge: 'Cuidador especializado',
                            badgeColor: 'danger',
                        },
                    ]}
                    value={abemid.consciousness.toString()}
                    onValueChange={(value) => updateAbemid({ consciousness: parseInt(value) })}
                />
            </QuestionCard>

            {/* 2. Respiração */}
            <QuestionCard
                number={2}
                title="RESPIRAÇÃO"
                script="O(A) paciente respira bem? Precisa de algum aparelho para ajudar a respirar?"
            >
                <RadioGroup
                    options={[
                        {
                            value: '0',
                            label: 'Respira normalmente',
                            description: 'Sem necessidade de oxigênio ou aparelhos',
                        },
                        {
                            value: '2',
                            label: 'Usa oxigênio suplementar',
                            description: 'Cateter nasal ou máscara de oxigênio',
                        },
                        {
                            value: '5',
                            label: 'Usa aparelho de ventilação',
                            description: 'BiPAP, CPAP ou ventilador mecânico',
                            badge: 'ENFERMEIRO OBRIGATÓRIO',
                            badgeColor: 'danger',
                        },
                    ]}
                    value={abemid.breathing.toString()}
                    onValueChange={(value) => {
                        const score = parseInt(value);
                        updateAbemid({ breathing: score });
                        if (score === 5) handleTriggerToggle('ventilation', true);
                        if (score === 2) handleTriggerToggle('oxygen', true);
                    }}
                />

                <Checkbox
                    id="tracheostomy"
                    label="Tem traqueostomia"
                    description="→ ENFERMEIRO OBRIGATÓRIO"
                    checked={abemid.activeTriggers.includes('tracheostomy')}
                    onCheckedChange={(checked) => handleTriggerToggle('tracheostomy', checked)}
                />
            </QuestionCard>

            {/* 3. Alimentação */}
            <QuestionCard
                number={3}
                title="ALIMENTAÇÃO"
                script="Como o(a) paciente se alimenta? Come de tudo ou precisa de comida especial?"
            >
                <RadioGroup
                    options={[
                        {
                            value: '0',
                            label: 'Come normalmente pela boca',
                            description: 'Qualquer consistência, sem dificuldade',
                        },
                        {
                            value: '2',
                            label: 'Precisa de dieta modificada',
                            description: 'Comida pastosa, batida ou picada',
                            badge: 'Risco broncoaspiração',
                            badgeColor: 'warning',
                        },
                        {
                            value: '5',
                            label: 'Usa sonda para alimentação',
                            description: 'Sonda nasogástrica, nasoenteral ou gastrostomia',
                            badge: 'TÉC. ENFERMAGEM MIN.',
                            badgeColor: 'danger',
                        },
                    ]}
                    value={abemid.feeding.toString()}
                    onValueChange={(value) => {
                        const score = parseInt(value);
                        updateAbemid({ feeding: score });
                        if (score === 5) handleTriggerToggle('tube_feeding', true);
                    }}
                />

                <Checkbox
                    id="tube_placement"
                    label="Precisa passar sonda"
                    description="→ ENFERMEIRO OBRIGATÓRIO"
                    checked={abemid.activeTriggers.includes('tube_placement')}
                    onCheckedChange={(checked) => handleTriggerToggle('tube_placement', checked)}
                />
            </QuestionCard>

            {/* 4. Medicação */}
            <QuestionCard
                number={4}
                title="MEDICAÇÃO"
                script="Os remédios são só de engolir (comprimidos) ou tem alguma injeção?"
            >
                <RadioGroup
                    options={[
                        {
                            value: '0',
                            label: 'Apenas via oral',
                            description: 'Comprimidos, gotas, xaropes',
                        },
                        {
                            value: '2',
                            label: 'Precisa de injeções subcutâneas',
                            description: 'Insulina, anticoagulante (Clexane), etc.',
                            badge: 'TÉC. ENFERMAGEM OBRIG.',
                            badgeColor: 'warning',
                        },
                        {
                            value: '5',
                            label: 'Medicação intravenosa',
                            description: 'Soro, antibiótico IV, quimioterapia',
                            badge: 'ENFERMEIRO OBRIGATÓRIO',
                            badgeColor: 'danger',
                        },
                    ]}
                    value={abemid.medication.toString()}
                    onValueChange={(value) => {
                        const score = parseInt(value);
                        updateAbemid({ medication: score });
                        if (score === 2) handleTriggerToggle('subcutaneous_injection', true);
                        if (score === 5) handleTriggerToggle('iv_medication', true);
                    }}
                />

                <Checkbox
                    id="picc_catheter"
                    label="Tem PICC ou cateter central"
                    description="→ ENFERMEIRO OBRIGATÓRIO"
                    checked={abemid.activeTriggers.includes('picc_catheter')}
                    onCheckedChange={(checked) => handleTriggerToggle('picc_catheter', checked)}
                />
            </QuestionCard>

            {/* 5. Pele e Feridas */}
            <QuestionCard
                number={5}
                title="PELE E FERIDAS"
                script="O(A) paciente tem alguma ferida, escara ou machucado que precisa de curativo?"
            >
                <RadioGroup
                    options={[
                        {
                            value: '0',
                            label: 'Pele íntegra',
                            description: 'Sem feridas ou lesões',
                        },
                        {
                            value: '2',
                            label: 'Feridas simples em cicatrização',
                            description: 'Escaras pequenas, arranhões, lesões superficiais',
                        },
                        {
                            value: '5',
                            label: 'Feridas complexas ou infectadas',
                            description: 'Escaras profundas, feridas com secreção, odor',
                            badge: 'ENFERMEIRO OBRIGATÓRIO',
                            badgeColor: 'danger',
                        },
                    ]}
                    value={abemid.skin.toString()}
                    onValueChange={(value) => {
                        const score = parseInt(value);
                        updateAbemid({ skin: score });
                        if (score === 5) handleTriggerToggle('complex_wounds', true);
                    }}
                />
            </QuestionCard>

            {/* 6. Eliminações */}
            <QuestionCard
                number={6}
                title="ELIMINAÇÕES"
                script="Como está o controle de urina e fezes? Usa fralda ou alguma sonda?"
            >
                <RadioGroup
                    options={[
                        {
                            value: '0',
                            label: 'Controle total',
                            description: 'Vai ao banheiro sozinho, não usa fralda',
                        },
                        {
                            value: '1',
                            label: 'Usa fralda geriátrica',
                            description: 'Necessita de trocas periódicas',
                        },
                        {
                            value: '3',
                            label: 'Usa sonda vesical de demora (SVD)',
                            description: 'Sonda fixa com bolsa coletora',
                        },
                        {
                            value: '5',
                            label: 'Precisa de cateterismo intermitente',
                            description: 'Passagem de sonda várias vezes ao dia',
                            badge: 'ENFERMEIRO OBRIGATÓRIO',
                            badgeColor: 'danger',
                        },
                    ]}
                    value={abemid.elimination.toString()}
                    onValueChange={(value) => {
                        const score = parseInt(value);
                        updateAbemid({ elimination: score });
                        if (score === 5) handleTriggerToggle('intermittent_catheter', true);
                    }}
                />

                <Checkbox
                    id="ostomy"
                    label="Usa colostomia/ileostomia"
                    checked={abemid.activeTriggers.includes('ostomy')}
                    onCheckedChange={(checked) => handleTriggerToggle('ostomy', checked)}
                />
            </QuestionCard>

            {/* Resultado */}
            <div className={cn(
                'p-6 rounded-xl border-2',
                result.indicatedProfessional === 'nurse' ? 'bg-danger-50 border-danger-300' :
                    result.indicatedProfessional === 'tech_nurse' ? 'bg-warning-50 border-warning-300' :
                        'bg-success-50 border-success-300'
            )}>
                <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
                    📊 RESULTADO ABEMID
                </h3>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-neutral-600">Escore total:</span>
                        <span className="font-bold">{result.totalScore} pontos</span>
                    </div>

                    {result.activeTriggers.length > 0 && (
                        <div className="flex justify-between">
                            <span className="text-neutral-600">Triggers ativos:</span>
                            <span className="font-medium text-danger-600">{result.activeTriggers.length}</span>
                        </div>
                    )}

                    <div className="mt-4 p-4 bg-white rounded-lg">
                        <p className="text-xs font-medium text-neutral-500 uppercase mb-1">
                            Profissional Indicado
                        </p>
                        <p className={cn(
                            'text-xl font-bold',
                            result.indicatedProfessional === 'nurse' ? 'text-danger-600' :
                                result.indicatedProfessional === 'tech_nurse' ? 'text-warning-600' :
                                    'text-success-600'
                        )}>
                            {result.indicatedProfessional === 'nurse' ? '🔴' :
                                result.indicatedProfessional === 'tech_nurse' ? '🟡' : '🟢'} {result.professionalLabel}
                        </p>
                        <p className="text-sm text-neutral-600 mt-2">
                            {result.justification}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
