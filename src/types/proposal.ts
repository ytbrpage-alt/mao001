// src/types/proposal.ts
// Types for proposal data

export interface ProposalData {
    generatedAt: Date;
    validUntil: Date;
    professionalType: 'caregiver' | 'tech_nurse' | 'nurse';
    professionalLabel: string;
    schedule: {
        startTime: string;
        endTime: string;
        hoursPerDay: number;
        daysPerWeek: number;
        shiftsPerMonth: number;
        shiftType: string;
    };
    pricing: {
        shiftCost: number;
        monthlyTotal: number;
        adjustments: { description: string; value: number }[];
    };
    includedServices: string[];
    excludedServices: string[];
    specialClauses: string[];
    observations: string;
    status: 'draft' | 'presented' | 'accepted' | 'rejected' | 'negotiating';
}

export const PROPOSAL_STATUS_LABELS: Record<ProposalData['status'], string> = {
    draft: 'Rascunho',
    presented: 'Apresentada',
    accepted: 'Aceita',
    rejected: 'Recusada',
    negotiating: 'Em negociação',
};
