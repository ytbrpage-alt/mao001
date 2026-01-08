import type { KatzData } from '@/types';

export interface KatzResult {
    totalScore: number;
    classification: string;
    classificationLabel: string;
    complexityMultiplier: number;
    justification: string;
}

// Classificações Katz
const CLASSIFICATIONS = [
    { min: 6, max: 6, letter: 'A', label: 'Independente', multiplier: 1.0 },
    { min: 5, max: 5.5, letter: 'B', label: 'Dependência Leve', multiplier: 1.05 },
    { min: 4, max: 4.5, letter: 'C', label: 'Dependência Leve-Moderada', multiplier: 1.10 },
    { min: 3, max: 3.5, letter: 'D', label: 'Dependência Moderada', multiplier: 1.15 },
    { min: 2, max: 2.5, letter: 'E', label: 'Dependência Moderada-Grave', multiplier: 1.20 },
    { min: 1, max: 1.5, letter: 'F', label: 'Dependência Grave', multiplier: 1.25 },
    { min: 0, max: 0.5, letter: 'G', label: 'Dependência Total', multiplier: 1.35 },
];

export function calculateKatz(data: Partial<KatzData>): KatzResult {
    const bathing = data.bathing ?? 1;
    const dressing = data.dressing ?? 1;
    const toileting = data.toileting ?? 1;
    const transferring = data.transferring ?? 1;
    const continence = data.continence ?? 1;
    const feeding = data.feeding ?? 1;

    const totalScore = bathing + dressing + toileting + transferring + continence + feeding;

    // Encontrar classificação
    const classInfo = CLASSIFICATIONS.find(
        c => totalScore >= c.min && totalScore <= c.max
    ) || CLASSIFICATIONS[CLASSIFICATIONS.length - 1];

    return {
        totalScore,
        classification: classInfo.letter,
        classificationLabel: classInfo.label,
        complexityMultiplier: classInfo.multiplier,
        justification: generateJustification(data, classInfo),
    };
}

function generateJustification(data: Partial<KatzData>, classInfo: typeof CLASSIFICATIONS[0]): string {
    const dependentAreas: string[] = [];

    if ((data.bathing ?? 1) < 1) dependentAreas.push('banho');
    if ((data.dressing ?? 1) < 1) dependentAreas.push('vestuário');
    if ((data.toileting ?? 1) < 1) dependentAreas.push('higiene');
    if ((data.transferring ?? 1) < 1) dependentAreas.push('transferência');
    if ((data.continence ?? 1) < 1) dependentAreas.push('continência');
    if ((data.feeding ?? 1) < 1) dependentAreas.push('alimentação');

    if (dependentAreas.length === 0) {
        return 'Paciente independente em todas as atividades de vida diária.';
    }

    const areas = dependentAreas.length > 1
        ? `${dependentAreas.slice(0, -1).join(', ')} e ${dependentAreas[dependentAreas.length - 1]}`
        : dependentAreas[0];

    return `Paciente com ${classInfo.label.toLowerCase()} em ${areas}, caracterizando maior demanda de cuidados.`;
}

// Verificar se paciente é acamado (transferência = 0 e peso alto)
export function checkHighPhysicalDemand(
    transferring: number,
    weight?: number
): boolean {
    return transferring === 0 && (weight ?? 0) > 90;
}
