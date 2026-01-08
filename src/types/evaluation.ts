// src/types/evaluation.ts
// Main evaluation types

import type { DiscoveryData } from './discovery';
import type { PatientData } from './patient';
import type { HealthHistoryData } from './health';
import type { AbemidData, KatzData, LawtonData } from './scales';
import type { SafetyChecklistData } from './safety';
import type { ScheduleData } from './schedule';
import type { PricingData } from './pricing';
import type { ProposalData } from './proposal';
import type { ContractData } from './contract';

export type EvaluationStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';

export interface EvaluatorData {
    evaluatorId: string;
    evaluatorName: string;
    evaluatorRole: string;
    evaluatorEmail: string;
    evaluatorPhone: string;
    branchOffice: string;
    evaluationStartTime: Date;
    evaluationEndTime?: Date;
    evaluationLocation: string;
    evaluationNotes: string;
}

export type KYCDocumentType = 'rg' | 'cnh' | 'passport' | 'other';
export type KYCVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface KYCData {
    documentType: KYCDocumentType;
    documentNumber: string;
    documentIssuer: string;
    documentIssueDate?: Date;
    documentExpiryDate?: Date;
    documentFrontPhoto: string;    // Base64
    documentBackPhoto: string;     // Base64
    selfiePhoto?: string;          // Base64
    verificationStatus: KYCVerificationStatus;
    verificationNotes: string;
    consentGiven: boolean;
    consentTimestamp?: Date;
}

export interface EvaluationResults {
    abemidScore: number;
    abemidClassification: string;
    katzScore: number;
    katzClassification: string;
    lawtonScore: number;
    lawtonClassification: string;
    indicatedProfessional: 'caregiver' | 'tech_nurse' | 'nurse';
    complexityMultiplier: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    suggestedServices: string[];
    contraindications: string[];
    upsellOpportunities: string[];
}

export interface Evaluation {
    id: string;
    status: EvaluationStatus;
    createdAt: Date;
    updatedAt: Date;
    evaluatorId: string;
    discovery: DiscoveryData;
    patient: PatientData;
    healthHistory: HealthHistoryData;
    abemid: AbemidData;
    katz: KatzData;
    lawton: LawtonData;
    safetyChecklist: SafetyChecklistData;
    schedule: ScheduleData;
    evaluatorInfo: EvaluatorData;
    kyc: KYCData;
    results: EvaluationResults;
    proposal: ProposalData;
    contract: ContractData;
}

export const EVALUATION_STATUS_LABELS: Record<EvaluationStatus, string> = {
    draft: 'Rascunho',
    in_progress: 'Em andamento',
    completed: 'Concluída',
    cancelled: 'Cancelada',
};
