// src/types/health.ts
// Types for health history data

export type NeurologicalCondition =
    | 'alzheimer'
    | 'vascular_dementia'
    | 'lewy_body'
    | 'parkinson'
    | 'stroke'
    | 'epilepsy'
    | 'other_neuro';

export type CardiovascularCondition =
    | 'hypertension'
    | 'heart_failure'
    | 'arrhythmia'
    | 'coronary_disease'
    | 'pacemaker'
    | 'other_cardio';

export type RespiratoryCondition =
    | 'copd'
    | 'asthma'
    | 'oxygen_therapy'
    | 'tracheostomy'
    | 'sleep_apnea'
    | 'other_respiratory';

export type MobilityCondition =
    | 'wheelchair'
    | 'walker'
    | 'cane'
    | 'bedridden'
    | 'amputation'
    | 'fracture'
    | 'other_mobility';

export type SpecialMedication =
    | 'insulin'
    | 'anticoagulant'
    | 'controlled'
    | 'morphine'
    | 'chemotherapy'
    | 'immunosuppressant';

export type DietaryRestriction =
    | 'diabetic'
    | 'low_sodium'
    | 'renal'
    | 'vegetarian'
    | 'enteral'
    | 'pureed'
    | 'thickened_liquids'
    | 'allergies';

export interface HealthHistoryData {
    neurologicalConditions: string[];
    cardiovascularConditions: string[];
    respiratoryConditions: string[];
    mobilityConditions: string[];
    otherConditions: string[];
    recentHospitalizations: boolean;
    recentFalls: 'none' | '1_month' | '3_months' | '6_months' | 'frequent';
    recentSurgery: boolean;
    medicationCount: '0' | '1-3' | '4-7' | '8+';
    specialMedications: string[];
    hasAllergies: boolean;
    medicationAllergies: string;
    foodAllergies: string;
    latexAllergy: boolean;
    otherAllergies: string;
    dietaryRestrictions: string[];
    otherDietaryRestrictions: string;
}

export const NEUROLOGICAL_CONDITIONS: { value: NeurologicalCondition; label: string }[] = [
    { value: 'alzheimer', label: 'Alzheimer' },
    { value: 'vascular_dementia', label: 'Demência vascular' },
    { value: 'lewy_body', label: 'Demência por corpos de Lewy' },
    { value: 'parkinson', label: 'Parkinson' },
    { value: 'stroke', label: 'AVC / Derrame' },
    { value: 'epilepsy', label: 'Epilepsia' },
    { value: 'other_neuro', label: 'Outra condição neurológica' },
];

export const CARDIOVASCULAR_CONDITIONS: { value: CardiovascularCondition; label: string }[] = [
    { value: 'hypertension', label: 'Hipertensão arterial' },
    { value: 'heart_failure', label: 'Insuficiência cardíaca' },
    { value: 'arrhythmia', label: 'Arritmia' },
    { value: 'coronary_disease', label: 'Doença coronariana' },
    { value: 'pacemaker', label: 'Marcapasso' },
    { value: 'other_cardio', label: 'Outra condição cardíaca' },
];
