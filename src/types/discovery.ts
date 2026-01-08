// src/types/discovery.ts
// Types for discovery/trigger data

export type TriggerCategory =
    | 'fall'
    | 'cognitive_decline'
    | 'hospital_discharge'
    | 'family_overload'
    | 'new_diagnosis'
    | 'previous_caregiver'
    | 'spouse_death'
    | 'recent_fall'
    | 'loss_of_autonomy'
    | 'caregiver_burnout'
    | 'dementia_diagnosis'
    | 'post_surgery'
    | 'preventive'
    | 'other';

export type CaregiverType =
    | 'elderly_spouse'
    | 'working_child'
    | 'family_rotation'
    | 'informal'
    | 'previous_professional'
    | 'alone';

export type PreviousExperience = 'none' | 'positive' | 'negative';

export interface DiscoveryData {
    triggerEvent: string;
    triggerCategory: TriggerCategory | '';
    triggerDetails: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical' | '';
    referralSource: string;
    initialExpectations: string;
    familyDecisionMaker: string;
    budgetRange: string;
    currentCaregiver: CaregiverType | '';
    familyBurdenLevel: number;
    concerns: string[];
    mainConcern: string;
    previousExperience: PreviousExperience | '';
    previousIssues: string[];
    previousIssueDetails: string;
    notes: string;
}

export const TRIGGER_CATEGORIES: { value: TriggerCategory; label: string; icon: string }[] = [
    { value: 'fall', label: 'Queda recente', icon: '🤕' },
    { value: 'cognitive_decline', label: 'Piora cognitiva', icon: '🧠' },
    { value: 'hospital_discharge', label: 'Alta hospitalar', icon: '🏥' },
    { value: 'family_overload', label: 'Sobrecarga familiar', icon: '😓' },
    { value: 'new_diagnosis', label: 'Diagnóstico novo', icon: '📋' },
    { value: 'previous_caregiver', label: 'Cuidador anterior não deu certo', icon: '❌' },
    { value: 'spouse_death', label: 'Falecimento do cônjuge', icon: '💔' },
    { value: 'recent_fall', label: 'Queda recente', icon: '🤕' },
    { value: 'loss_of_autonomy', label: 'Perda de autonomia', icon: '♿' },
    { value: 'caregiver_burnout', label: 'Exaustão do cuidador familiar', icon: '😓' },
    { value: 'dementia_diagnosis', label: 'Diagnóstico de demência', icon: '🧠' },
    { value: 'post_surgery', label: 'Pós-cirúrgico', icon: '🩹' },
    { value: 'preventive', label: 'Prevenção/companhia', icon: '🤝' },
    { value: 'other', label: 'Outro', icon: '📝' },
];

