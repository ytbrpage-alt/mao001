import type { AbemidData } from '@/types';

export interface AbemidResult {
    totalScore: number;
    activeTriggers: string[];
    indicatedProfessional: 'caregiver' | 'tech_nurse' | 'nurse';
    professionalLabel: string;
    justification: string;
}

// Triggers que requerem profissional específico
const NURSE_TRIGGERS = [
    'ventilation', // Ventilação mecânica
    'tracheostomy', // Traqueostomia
    'iv_medication', // Medicação IV
    'picc_catheter', // PICC ou cateter central
    'complex_wounds', // Feridas complexas
    'intermittent_catheter', // Cateterismo intermitente
    'tube_placement', // Passagem de sonda
];

const TECH_NURSE_TRIGGERS = [
    'oxygen', // Oxigênio suplementar
    'tube_feeding', // Alimentação por sonda
    'subcutaneous_injection', // Injeções subcutâneas
];

export function calculateAbemid(data: Partial<AbemidData>): AbemidResult {
    const totalScore =
        (data.consciousness || 0) +
        (data.breathing || 0) +
        (data.feeding || 0) +
        (data.medication || 0) +
        (data.skin || 0) +
        (data.elimination || 0);

    const activeTriggers = data.activeTriggers || [];

    // Verificar se precisa de Enfermeiro
    const needsNurse = activeTriggers.some(t => NURSE_TRIGGERS.includes(t));

    // Verificar se precisa de Técnico de Enfermagem
    const needsTechNurse =
        !needsNurse && activeTriggers.some(t => TECH_NURSE_TRIGGERS.includes(t));

    let indicatedProfessional: 'caregiver' | 'tech_nurse' | 'nurse' = 'caregiver';
    let professionalLabel = 'Cuidador(a)';
    let justification = 'Paciente sem necessidades técnicas de enfermagem.';

    if (needsNurse) {
        indicatedProfessional = 'nurse';
        professionalLabel = 'Enfermeiro(a)';
        justification = `Paciente necessita de procedimentos privativos de enfermeiro: ${formatTriggers(
            activeTriggers.filter(t => NURSE_TRIGGERS.includes(t))
        )}.`;
    } else if (needsTechNurse) {
        indicatedProfessional = 'tech_nurse';
        professionalLabel = 'Técnico(a) de Enfermagem';
        justification = `Paciente necessita de procedimentos técnicos: ${formatTriggers(
            activeTriggers.filter(t => TECH_NURSE_TRIGGERS.includes(t))
        )}.`;
    } else if (totalScore >= 10) {
        indicatedProfessional = 'tech_nurse';
        professionalLabel = 'Técnico(a) de Enfermagem';
        justification = 'Paciente com alta complexidade clínica (pontuação ABEMID elevada).';
    }

    return {
        totalScore,
        activeTriggers,
        indicatedProfessional,
        professionalLabel,
        justification,
    };
}

function formatTriggers(triggers: string[]): string {
    const labels: Record<string, string> = {
        ventilation: 'ventilação mecânica',
        tracheostomy: 'traqueostomia',
        iv_medication: 'medicação intravenosa',
        picc_catheter: 'cateter PICC/central',
        complex_wounds: 'curativos complexos',
        intermittent_catheter: 'cateterismo intermitente',
        tube_placement: 'passagem de sonda',
        oxygen: 'oxigenoterapia',
        tube_feeding: 'alimentação por sonda',
        subcutaneous_injection: 'aplicação de insulina/injeções subcutâneas',
    };

    return triggers.map(t => labels[t] || t).join(', ');
}

// Tabela de preços base por tipo de profissional (12h)
export const PROFESSIONAL_BASE_RATES = {
    caregiver: 220,
    tech_nurse: 280,
    nurse: 380,
};
