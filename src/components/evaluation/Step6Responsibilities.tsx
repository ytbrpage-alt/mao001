'use client';

import { useEvaluationStore } from '@/stores/evaluationStore';
import { QuestionCard } from '@/components/shared/QuestionCard';
import { SummaryCard } from '@/components/shared/SummaryCard';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';

export function Step6Responsibilities() {
    const { lawton, safetyChecklist, updateLawton, updateSafetyChecklist } = useEvaluationStore((state) => ({
        lawton: state.getCurrentEvaluation()?.lawton,
        safetyChecklist: state.getCurrentEvaluation()?.safetyChecklist,
        updateLawton: state.updateLawton,
        updateSafetyChecklist: state.updateSafetyChecklist,
    }));

    if (!lawton || !safetyChecklist) return null;

    // Contar riscos
    const circulationRisks = Object.values(safetyChecklist.circulation).filter(Boolean).length;
    const bathroomRisks = Object.values(safetyChecklist.bathroom).filter(Boolean).length;
    const bedroomRisks = Object.values(safetyChecklist.bedroom).filter(Boolean).length;
    const totalRisks = circulationRisks + bathroomRisks + bedroomRisks;

    // Riscos críticos
    const criticalRisks = [
        safetyChecklist.bathroom.noGrabBarsShower,
        safetyChecklist.bathroom.slipperyShowerFloor,
    ].filter(Boolean).length;

    return (
        <div className="space-y-6">
            {/* PARTE A: Responsabilidades */}
            <div className="bg-neutral-800 text-white px-4 py-2 rounded-t-xl -mx-4">
                <h2 className="font-bold">PARTE A: RESPONSABILIDADES</h2>
                <p className="text-sm text-neutral-300">Define cláusulas do contrato</p>
            </div>

            {/* 1. Medicamentos */}
            <QuestionCard
                number={1}
                title="ADMINISTRAÇÃO DE MEDICAMENTOS"
                script="Quem vai ficar responsável por separar os remédios? E quem deve dar para o(a) paciente?"
            >
                <RadioGroup
                    label="Separação dos medicamentos"
                    options={[
                        { value: 'family', label: 'Família separa em porta-comprimidos' },
                        { value: 'caregiver', label: 'Cuidador pode separar conforme receita' },
                        { value: 'pharmacy', label: 'Serviço externo de farmácia prepara' },
                    ]}
                    value={lawton.medicationSeparation}
                    onValueChange={(value) => updateLawton({ medicationSeparation: value })}
                />

                <RadioGroup
                    label="Administração"
                    options={[
                        { value: 'self', label: 'Paciente toma sozinho (só precisa lembrar)' },
                        { value: 'supervised', label: 'Cuidador deve dar na mão e supervisionar' },
                        { value: 'administered', label: 'Cuidador deve administrar (inclusive amassar se preciso)' },
                    ]}
                    value={lawton.medicationAdministration}
                    onValueChange={(value) => updateLawton({ medicationAdministration: value })}
                />

                <div className="bg-warning-50 p-3 rounded-lg text-sm text-warning-700">
                    ⚠️ <strong>IMPORTANTE:</strong> O cuidador NÃO pode alterar doses.
                    <br />→ Gerar cláusula: [Sim]
                </div>
            </QuestionCard>

            {/* 2. Insumos */}
            <QuestionCard
                number={2}
                title="FORNECIMENTO DE INSUMOS"
                script="Os materiais como fraldas, luvas, lenços... vocês preferem que a família forneça ou quer que a gente inclua no serviço?"
            >
                <RadioGroup
                    options={[
                        { value: 'family', label: 'Família fornece todos os insumos' },
                        { value: 'company', label: 'Empresa fornece (incluir no valor)' },
                        { value: 'not_applicable', label: 'Não se aplica (paciente não usa fraldas/insumos)' },
                    ]}
                    value={lawton.supplyProvision}
                    onValueChange={(value) => updateLawton({ supplyProvision: value })}
                />
            </QuestionCard>

            {/* 3. Alimentação */}
            <QuestionCard
                number={3}
                title="ALIMENTAÇÃO"
                script="Sobre as refeições, vocês preferem que o cuidador prepare a comida ou vão deixar pronto?"
            >
                <RadioGroup
                    options={[
                        { value: 'ready', label: 'Família deixa refeições prontas/congeladas' },
                        { value: 'simple', label: 'Cuidador prepara refeições simples para o paciente' },
                        { value: 'full', label: 'Cuidador prepara refeições para paciente + família', badge: 'Cobrar adicional', badgeColor: 'warning' as const },
                    ]}
                    value={lawton.mealPreparation}
                    onValueChange={(value) => updateLawton({ mealPreparation: value })}
                />

                <Checkbox
                    id="special_diet"
                    label="Paciente tem dieta especial com orientação de nutricionista"
                    checked={lawton.hasSpecialDiet}
                    onCheckedChange={(checked) => updateLawton({ hasSpecialDiet: checked })}
                />
            </QuestionCard>

            {/* 4. Tarefas Domésticas */}
            <QuestionCard
                number={4}
                title="TAREFAS DOMÉSTICAS (ESCLARECIMENTO IMPORTANTE)"
                script="É importante esclarecer: o cuidador cuida da PESSOA, não da casa..."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-success-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-success-700 mb-2">✅ O que ESTÁ incluído:</p>
                        <ul className="text-sm text-success-600 space-y-1">
                            <li>• Organizar o quarto do paciente</li>
                            <li>• Lavar a louça da refeição do paciente</li>
                            <li>• Lavar/passar roupa do paciente</li>
                            <li>• Trocar roupa de cama do paciente</li>
                        </ul>
                    </div>
                    <div className="bg-danger-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-danger-700 mb-2">❌ O que NÃO está incluído:</p>
                        <ul className="text-sm text-danger-600 space-y-1">
                            <li>• Limpar a casa toda</li>
                            <li>• Cozinhar para a família</li>
                            <li>• Cuidar de outras pessoas</li>
                            <li>• Jardinagem, lavar carro, etc.</li>
                        </ul>
                    </div>
                </div>

                <Checkbox
                    id="scope_understood"
                    label="Família entendeu e concorda com o escopo de trabalho"
                    checked={lawton.houseworkScope}
                    onCheckedChange={(checked) => updateLawton({ houseworkScope: checked })}
                />
            </QuestionCard>

            {/* PARTE B: Checklist Ambiental */}
            <div className="bg-neutral-800 text-white px-4 py-2 rounded-t-xl -mx-4 mt-8">
                <h2 className="font-bold">PARTE B: CHECKLIST AMBIENTAL</h2>
                <p className="text-sm text-neutral-300">Segurança do ambiente</p>
            </div>

            <div className="bg-brand-50 p-4 rounded-xl">
                <p className="text-sm text-brand-800">
                    💬 "Vamos dar uma volta pela casa? Quero ver os ambientes que o(a) paciente
                    mais usa pra identificar se tem algum ajuste simples que pode prevenir acidentes."
                </p>
            </div>

            {/* Circulação */}
            <QuestionCard title="CIRCULAÇÃO">
                <div className="space-y-3">
                    <Checkbox id="loose_rugs" label="Tapetes soltos → Sugerir remover"
                        checked={safetyChecklist.circulation.looseRugs}
                        onCheckedChange={(c) => updateSafetyChecklist({ circulation: { ...safetyChecklist.circulation, looseRugs: c } })} />
                    <Checkbox id="exposed_wires" label="Fios expostos no caminho → Sugerir fixar"
                        checked={safetyChecklist.circulation.exposedWires}
                        onCheckedChange={(c) => updateSafetyChecklist({ circulation: { ...safetyChecklist.circulation, exposedWires: c } })} />
                    <Checkbox id="obstructed_paths" label="Móveis obstruindo passagem → Sugerir mover"
                        checked={safetyChecklist.circulation.obstructedPaths}
                        onCheckedChange={(c) => updateSafetyChecklist({ circulation: { ...safetyChecklist.circulation, obstructedPaths: c } })} />
                    <Checkbox id="slippery_floors" label="Piso escorregadio → Sugerir tapete antiderrapante"
                        checked={safetyChecklist.circulation.slipperyFloors}
                        onCheckedChange={(c) => updateSafetyChecklist({ circulation: { ...safetyChecklist.circulation, slipperyFloors: c } })} />
                    <Checkbox id="poor_lighting" label="Iluminação fraca → Sugerir melhorar"
                        checked={safetyChecklist.circulation.poorLighting}
                        onCheckedChange={(c) => updateSafetyChecklist({ circulation: { ...safetyChecklist.circulation, poorLighting: c } })} />
                </div>
            </QuestionCard>

            {/* Banheiro */}
            <QuestionCard title="BANHEIRO">
                <div className="space-y-3">
                    <Checkbox id="no_grab_bars_shower" label="Sem barras de apoio no box"
                        description="🔴 CRÍTICO"
                        checked={safetyChecklist.bathroom.noGrabBarsShower}
                        onCheckedChange={(c) => updateSafetyChecklist({ bathroom: { ...safetyChecklist.bathroom, noGrabBarsShower: c } })} />
                    <Checkbox id="no_grab_bars_toilet" label="Sem barras ao lado do vaso"
                        description="⚠️ RISCO"
                        checked={safetyChecklist.bathroom.noGrabBarsToilet}
                        onCheckedChange={(c) => updateSafetyChecklist({ bathroom: { ...safetyChecklist.bathroom, noGrabBarsToilet: c } })} />
                    <Checkbox id="slippery_shower" label="Piso do box escorregadio"
                        description="🔴 CRÍTICO"
                        checked={safetyChecklist.bathroom.slipperyShowerFloor}
                        onCheckedChange={(c) => updateSafetyChecklist({ bathroom: { ...safetyChecklist.bathroom, slipperyShowerFloor: c } })} />
                    <Checkbox id="low_toilet" label="Vaso muito baixo → Elevador de vaso"
                        checked={safetyChecklist.bathroom.lowToilet}
                        onCheckedChange={(c) => updateSafetyChecklist({ bathroom: { ...safetyChecklist.bathroom, lowToilet: c } })} />
                    <Checkbox id="no_nonslip_mat" label="Sem tapete antiderrapante"
                        checked={safetyChecklist.bathroom.noNonSlipMat}
                        onCheckedChange={(c) => updateSafetyChecklist({ bathroom: { ...safetyChecklist.bathroom, noNonSlipMat: c } })} />
                    <Checkbox id="no_shower_chair" label="Sem cadeira de banho"
                        checked={safetyChecklist.bathroom.noShowerChair}
                        onCheckedChange={(c) => updateSafetyChecklist({ bathroom: { ...safetyChecklist.bathroom, noShowerChair: c } })} />
                </div>
            </QuestionCard>

            {/* Quarto */}
            <QuestionCard title="QUARTO">
                <div className="space-y-3">
                    <Checkbox id="bed_too_low" label="Cama muito baixa (< 55cm)"
                        checked={safetyChecklist.bedroom.bedTooLow}
                        onCheckedChange={(c) => updateSafetyChecklist({ bedroom: { ...safetyChecklist.bedroom, bedTooLow: c } })} />
                    <Checkbox id="bed_too_high" label="Cama muito alta (> 65cm) → Risco queda"
                        checked={safetyChecklist.bedroom.bedTooHigh}
                        onCheckedChange={(c) => updateSafetyChecklist({ bedroom: { ...safetyChecklist.bedroom, bedTooHigh: c } })} />
                    <Checkbox id="no_side_access" label="Sem acesso dos dois lados"
                        checked={safetyChecklist.bedroom.noSideAccess}
                        onCheckedChange={(c) => updateSafetyChecklist({ bedroom: { ...safetyChecklist.bedroom, noSideAccess: c } })} />
                    <Checkbox id="no_night_light" label="Sem luz noturna para banheiro"
                        checked={safetyChecklist.bedroom.noNightLight}
                        onCheckedChange={(c) => updateSafetyChecklist({ bedroom: { ...safetyChecklist.bedroom, noNightLight: c } })} />
                    <Checkbox id="bad_mattress" label="Colchão inadequado (muito mole)"
                        checked={safetyChecklist.bedroom.inadequateMattress}
                        onCheckedChange={(c) => updateSafetyChecklist({ bedroom: { ...safetyChecklist.bedroom, inadequateMattress: c } })} />
                </div>
            </QuestionCard>

            {/* Resultado */}
            <div className={cn(
                'p-6 rounded-xl border-2',
                criticalRisks > 0 ? 'bg-danger-50 border-danger-300' :
                    totalRisks > 3 ? 'bg-warning-50 border-warning-300' :
                        'bg-success-50 border-success-300'
            )}>
                <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
                    📊 RESULTADO DO CHECKLIST
                </h3>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-neutral-600">Total de riscos identificados:</span>
                        <span className="font-bold">{totalRisks}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-neutral-600">Riscos críticos:</span>
                        <span className={cn('font-bold', criticalRisks > 0 ? 'text-danger-600' : 'text-success-600')}>
                            {criticalRisks}
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm font-medium text-neutral-700 mb-3">POSIÇÃO DA FAMÍLIA:</p>
                    <RadioGroup
                        options={[
                            { value: 'will_adapt', label: 'Vai fazer as adaptações sugeridas' },
                            { value: 'partial', label: 'Vai fazer algumas adaptações' },
                            { value: 'wont_adapt', label: 'Não vai fazer adaptações', badge: 'Assunção de risco', badgeColor: 'danger' as const },
                        ]}
                        value={safetyChecklist.familyPosition}
                        onValueChange={(value) => updateSafetyChecklist({ familyPosition: value })}
                    />

                    {safetyChecklist.familyPosition === 'wont_adapt' && (
                        <div className="mt-3 p-3 bg-danger-100 rounded-lg text-sm text-danger-700">
                            ⚠️ <strong>GERAR CLÁUSULA DE ASSUNÇÃO DE RISCO COMPLETA</strong>
                            <br />Família deve assinar ciência dos riscos
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
