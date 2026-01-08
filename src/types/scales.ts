// src/types/scales.ts
// Types for clinical assessment scales (ABEMID, KATZ, Lawton)

export interface AbemidData {
    consciousness: number;      // 0-3
    breathing: number;          // 0-3
    feeding: number;            // 0-3
    mobility: number;           // 0-3
    skinCare: number;           // 0-3
    skin: number;               // alias for skinCare
    procedures: number;         // 0-3
    medications: number;        // 0-3
    medication: number;         // alias for medications
    monitoring: number;         // 0-3
    elimination: number;        // 0-5
    activeTriggers: string[];
    notes: string;
}

export interface KatzData {
    bathing: number;            // 0-2
    dressing: number;           // 0-2
    toileting: number;          // 0-2
    transferring: number;       // 0-2
    continence: number;         // 0-2
    feeding: number;            // 0-2
    notes: string;
}

export interface LawtonData {
    phoneUse: number;           // 0-3
    shopping: number;           // 0-3
    cooking: number;            // 0-3
    housekeeping: number;       // 0-3
    laundry: number;            // 0-3
    transportation: number;     // 0-3
    medicationManagement: number; // 0-3
    financeManagement: number;  // 0-3
    medicationSeparation: boolean;
    supplyProvision: 'company' | 'family' | 'shared' | '';
    houseworkScope: string;
    notes: string;
}

export interface AbemidResult {
    totalScore: number;
    indicatedProfessional: 'caregiver' | 'tech_nurse' | 'nurse';
    professionalLabel: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface KatzResult {
    totalScore: number;
    dependencyLevel: 'independent' | 'moderate' | 'severe' | 'total';
    dependencyLabel: string;
    complexityMultiplier: number;
}

export interface LawtonResult {
    totalScore: number;
    functionalLevel: 'independent' | 'needs_assistance' | 'dependent';
    functionalLabel: string;
}
