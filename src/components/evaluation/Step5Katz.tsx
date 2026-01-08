'use client';

import { useEvaluationStore } from '@/stores/evaluationStore';
import { QuestionCard } from '@/components/shared/QuestionCard';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { calculateKatz } from '@/lib/calculations/katzCalculator';
import { cn } from '@/lib/utils/cn';

export function Step5Katz() {
    const { katz, updateKatz } = useEvaluationStore((state) => ({
        katz: state.getCurrentEvaluation()?.katz,
        updateKatz: state.updateKatz,
    }));

    if (!katz) return null;

    const result = calculateKatz(katz);

    const handleDetailToggle = (
        field: 'bathingDetails' | 'dressingDetails' | 'toiletingDetails' | 'transferringDetails' | 'continenceDetails' | 'feedingDetails',
        detail: string,
        checked: boolean
    ) => {
        const current = katz[field];
        const updated = checked ? [...current, detail] : current.filter((d) => d !== detail);
        updateKatz({ [field]: updated });
    };

    const handleMobilityAidToggle = (aid: string, checked: boolean) => {
        const aids = checked
            ? [...katz.mobilityAids, aid]
            : katz.mobilityAids.filter((a) => a !== aid);
        updateKatz({ mobilityAids: aids });
    };

    return (
        <div className="space-y-6">
            {/* Introdução */}
            <div className="bg-brand-50 p-4 rounded-xl">
                <p className="text-sm text-brand-800">
                    💬 "Agora vou perguntar sobre algumas atividades do dia a dia.
                    Isso ajuda a entender quanto de ajuda o(a) paciente precisa
                    e dimensionar corretamente o serviço."
                </p>
            </div>

            {/* 1. Banho */}
            <QuestionCard
                number={1}
                title="TOMAR BANHO 🚿"
                script="Na hora do banho, como é? Consegue ir sozinho(a) ou alguém precisa ajudar?"
            >
                <RadioGroup
                    options={[
                        { value: '1', label: 'Independente', description: 'Toma banho sozinho(a), sem ajuda' },
                        { value: '0.5', label: 'Precisa de ajuda parcial', description: 'Precisa de ajuda para lavar costas, pernas ou pés' },
                        { value: '0', label: 'Dependente total', description: 'Precisa que deem banho nele(a)' },
                    ]}
                    value={katz.bathing.toString()}
                    onValueChange={(value) => updateKatz({ bathing: parseFloat(value) })}
                />

                <div className="space-y-2 mt-3">
                    <p className="text-sm font-medium text-neutral-600">Detalhes adicionais:</p>
                    <Checkbox id="bath_fear" label="Tem medo de cair no banheiro"
                        checked={katz.bathingDetails.includes('fear')}
                        onCheckedChange={(c) => handleDetailToggle('bathingDetails', 'fear', c)} />
                    <Checkbox id="bath_chair" label="Precisa de cadeira de banho"
                        checked={katz.bathingDetails.includes('chair')}
                        onCheckedChange={(c) => handleDetailToggle('bathingDetails', 'chair', c)} />
                    <Checkbox id="bath_bed" label="Banho é no leito (acamado)"
                        checked={katz.bathingDetails.includes('bed')}
                        onCheckedChange={(c) => handleDetailToggle('bathingDetails', 'bed', c)} />
                    <Checkbox id="bath_resist" label="Resiste/não gosta de tomar banho"
                        checked={katz.bathingDetails.includes('resist')}
                        onCheckedChange={(c) => handleDetailToggle('bathingDetails', 'resist', c)} />
                </div>
            </QuestionCard>

            {/* 2. Vestir */}
            <QuestionCard
                number={2}
                title="VESTIR-SE 👕"
                script="E para se vestir? Consegue escolher a roupa e vestir sozinho(a)?"
            >
                <RadioGroup
                    options={[
                        { value: '1', label: 'Independente', description: 'Escolhe a roupa e veste-se completamente' },
                        { value: '0.5', label: 'Precisa de ajuda parcial', description: 'Precisa de ajuda com botões, zíperes, meias ou sapatos' },
                        { value: '0', label: 'Dependente total', description: 'Precisa que vistam nele(a)' },
                    ]}
                    value={katz.dressing.toString()}
                    onValueChange={(value) => updateKatz({ dressing: parseFloat(value) })}
                />
            </QuestionCard>

            {/* 3. Banheiro */}
            <QuestionCard
                number={3}
                title="USAR O BANHEIRO 🚽"
                script="Consegue ir ao banheiro sozinho(a)? Ou precisa de ajuda?"
            >
                <RadioGroup
                    options={[
                        { value: '1', label: 'Independente', description: 'Vai ao banheiro e faz a higiene sem ajuda' },
                        { value: '0.5', label: 'Precisa de ajuda parcial', description: 'Precisa de ajuda para limpar-se ou ajeitar a roupa' },
                        { value: '0', label: 'Dependente total', description: 'Usa fralda e depende de outros para troca' },
                    ]}
                    value={katz.toileting.toString()}
                    onValueChange={(value) => updateKatz({ toileting: parseFloat(value) })}
                />

                <div className="space-y-2 mt-3">
                    <p className="text-sm font-medium text-neutral-600">Detalhes adicionais:</p>
                    <Checkbox id="toilet_ask" label="Consegue pedir quando quer ir ao banheiro"
                        checked={katz.toiletingDetails.includes('ask')}
                        onCheckedChange={(c) => handleDetailToggle('toiletingDetails', 'ask', c)} />
                    <Checkbox id="toilet_unaware" label="Não avisa, descobrem pela fralda suja"
                        checked={katz.toiletingDetails.includes('unaware')}
                        onCheckedChange={(c) => handleDetailToggle('toiletingDetails', 'unaware', c)} />
                    <Checkbox id="toilet_support" label="Precisa de apoio para sentar/levantar do vaso"
                        checked={katz.toiletingDetails.includes('support')}
                        onCheckedChange={(c) => handleDetailToggle('toiletingDetails', 'support', c)} />
                </div>
            </QuestionCard>

            {/* 4. Transferência */}
            <QuestionCard
                number={4}
                title="TRANSFERÊNCIA (Mobilidade) 🚶"
                script="O(A) paciente consegue levantar da cama sozinho(a)? E sentar numa cadeira?"
            >
                <RadioGroup
                    options={[
                        { value: '1', label: 'Independente', description: 'Deita, senta e levanta sem ajuda. Anda pela casa sem apoio' },
                        { value: '0.5', label: 'Precisa de ajuda parcial', description: 'Precisa de apoio de pessoa ou equipamento' },
                        { value: '0', label: 'Dependente total', description: 'Está acamado(a) ou precisa ser carregado(a)', badge: 'CARGA FÍSICA ALTA', badgeColor: 'danger' as const },
                    ]}
                    value={katz.transferring.toString()}
                    onValueChange={(value) => updateKatz({ transferring: parseFloat(value) })}
                />

                {katz.transferring === 0.5 && (
                    <div className="space-y-2 mt-3">
                        <p className="text-sm font-medium text-neutral-600">Usa:</p>
                        <Checkbox id="mobility_cane" label="Bengala"
                            checked={katz.mobilityAids.includes('cane')}
                            onCheckedChange={(c) => handleMobilityAidToggle('cane', c)} />
                        <Checkbox id="mobility_walker" label="Andador"
                            checked={katz.mobilityAids.includes('walker')}
                            onCheckedChange={(c) => handleMobilityAidToggle('walker', c)} />
                        <Checkbox id="mobility_wheelchair" label="Cadeira de rodas"
                            checked={katz.mobilityAids.includes('wheelchair')}
                            onCheckedChange={(c) => handleMobilityAidToggle('wheelchair', c)} />
                    </div>
                )}

                <div className="space-y-2 mt-3">
                    <p className="text-sm font-medium text-neutral-600">Detalhes adicionais:</p>
                    <Checkbox id="transfer_bed" label="Fica a maior parte do tempo na cama"
                        checked={katz.transferringDetails.includes('bed')}
                        onCheckedChange={(c) => handleDetailToggle('transferringDetails', 'bed', c)} />
                    <Checkbox id="transfer_chair" label="Fica a maior parte do tempo sentado(a)"
                        checked={katz.transferringDetails.includes('chair')}
                        onCheckedChange={(c) => handleDetailToggle('transferringDetails', 'chair', c)} />
                </div>
            </QuestionCard>

            {/* 5. Continência */}
            <QuestionCard
                number={5}
                title="CONTINÊNCIA 🩺"
                script="Sobre o controle de xixi e cocô... Consegue controlar ou usa fralda?"
            >
                <RadioGroup
                    options={[
                        { value: '1', label: 'Controle total', description: 'Controla urina e fezes, não usa fralda' },
                        { value: '0.5', label: 'Incontinência ocasional', description: 'Escapes às vezes (especialmente à noite)' },
                        { value: '0', label: 'Incontinente', description: 'Usa fralda o tempo todo, não consegue controlar' },
                    ]}
                    value={katz.continence.toString()}
                    onValueChange={(value) => updateKatz({ continence: parseFloat(value) })}
                />
            </QuestionCard>

            {/* 6. Alimentação */}
            <QuestionCard
                number={6}
                title="ALIMENTAÇÃO 🍽️"
                script="Na hora das refeições, come sozinho(a) ou precisa de ajuda?"
            >
                <RadioGroup
                    options={[
                        { value: '1', label: 'Independente', description: 'Come sozinho(a), sem ajuda' },
                        { value: '0.5', label: 'Precisa de ajuda parcial', description: 'Precisa que cortem a comida ou preparem o prato' },
                        { value: '0', label: 'Dependente total', description: 'Precisa ser alimentado(a) por outra pessoa' },
                    ]}
                    value={katz.feeding.toString()}
                    onValueChange={(value) => updateKatz({ feeding: parseFloat(value) })}
                />

                <div className="space-y-2 mt-3">
                    <p className="text-sm font-medium text-neutral-600">Detalhes adicionais:</p>
                    <Checkbox id="feed_supervision" label="Precisa de supervisão (engasga, come rápido demais)"
                        checked={katz.feedingDetails.includes('supervision')}
                        onCheckedChange={(c) => handleDetailToggle('feedingDetails', 'supervision', c)} />
                    <Checkbox id="feed_forget" label="Esquece de comer se não lembrarem"
                        checked={katz.feedingDetails.includes('forget')}
                        onCheckedChange={(c) => handleDetailToggle('feedingDetails', 'forget', c)} />
                    <Checkbox id="feed_slow" label="Come muito devagar (> 45min por refeição)"
                        checked={katz.feedingDetails.includes('slow')}
                        onCheckedChange={(c) => handleDetailToggle('feedingDetails', 'slow', c)} />
                </div>
            </QuestionCard>

            {/* Resultado */}
            <div className={cn(
                'p-6 rounded-xl border-2',
                result.complexityMultiplier >= 1.25 ? 'bg-danger-50 border-danger-300' :
                    result.complexityMultiplier >= 1.10 ? 'bg-warning-50 border-warning-300' :
                        'bg-success-50 border-success-300'
            )}>
                <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
                    📊 RESULTADO KATZ
                </h3>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-neutral-600">Escore total:</span>
                        <span className="font-bold">{result.totalScore} de 6 pontos</span>
                    </div>

                    <div className="mt-4 p-4 bg-white rounded-lg">
                        <p className="text-xs font-medium text-neutral-500 uppercase mb-1">
                            Classificação: KATZ {result.classification}
                        </p>
                        <p className={cn(
                            'text-xl font-bold',
                            result.complexityMultiplier >= 1.25 ? 'text-danger-600' :
                                result.complexityMultiplier >= 1.10 ? 'text-warning-600' :
                                    'text-success-600'
                        )}>
                            {result.classificationLabel}
                        </p>

                        <div className="mt-4 p-3 bg-neutral-100 rounded-lg">
                            <p className="text-xs font-medium text-neutral-500 uppercase mb-1">
                                Multiplicador de Complexidade
                            </p>
                            <p className="text-2xl font-bold text-brand-600">
                                ×{result.complexityMultiplier.toFixed(2)} (+{((result.complexityMultiplier - 1) * 100).toFixed(0)}%)
                            </p>
                        </div>

                        <p className="text-sm text-neutral-600 mt-3">
                            {result.justification}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
