// src/lib/validations/evaluationSchemas.ts
// Zod validation schemas for all evaluation sections

import { z } from 'zod';
import { sanitizeString, extractDigits } from './sanitizers';

// ==========================================
// HELPER VALIDATORS
// ==========================================

/**
 * Validate CPF with check digits
 */
function validateCPF(cpf: string): boolean {
    const digits = cpf.replace(/\D/g, '');

    if (digits.length !== 11) return false;

    // Check for known invalid sequences
    if (/^(\d)\1+$/.test(digits)) return false;

    // Calculate first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(digits[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(digits[9])) return false;

    // Calculate second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(digits[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(digits[10])) return false;

    return true;
}

/**
 * Calculate age from birth date
 */
function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// ==========================================
// COMMON SCHEMAS
// ==========================================

// CPF with validation
export const cpfSchema = z.string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 0 || val.length === 11, {
        message: 'CPF deve ter 11 dígitos',
    })
    .refine((val) => val.length === 0 || validateCPF(val), {
        message: 'CPF inválido',
    });

// Required CPF
export const requiredCpfSchema = z.string()
    .min(1, 'CPF é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 11, {
        message: 'CPF deve ter 11 dígitos',
    })
    .refine(validateCPF, {
        message: 'CPF inválido',
    });

// Phone number
export const phoneSchema = z.string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 0 || val.length === 10 || val.length === 11, {
        message: 'Telefone deve ter 10 ou 11 dígitos',
    });

// Email
export const emailSchema = z.string()
    .email('E-mail inválido')
    .transform((val) => val.toLowerCase().trim());

// Optional email
export const optionalEmailSchema = z.string()
    .transform((val) => val.trim())
    .refine((val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: 'E-mail inválido',
    });

// CEP
export const cepSchema = z.string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 0 || val.length === 8, {
        message: 'CEP deve ter 8 dígitos',
    });

// Time in HH:MM format
export const timeSchema = z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido (use HH:MM)');

// Date (not in future)
export const pastDateSchema = z.coerce.date()
    .refine((date) => date <= new Date(), {
        message: 'Data não pode ser no futuro',
    });

// Birth date with age validation
export const birthDateSchema = z.coerce.date()
    .refine((date) => date <= new Date(), {
        message: 'Data de nascimento não pode ser no futuro',
    })
    .refine((date) => {
        const age = calculateAge(date);
        return age >= 0 && age <= 120;
    }, {
        message: 'Idade deve ser entre 0 e 120 anos',
    });

// Sanitized string
export const sanitizedStringSchema = z.string()
    .transform(sanitizeString);

// Required sanitized string
export const requiredStringSchema = z.string()
    .min(1, 'Campo obrigatório')
    .transform(sanitizeString);

// Name (minimum 3 chars, only letters)
export const nameSchema = z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras')
    .transform(sanitizeString);

// ==========================================
// DISCOVERY SCHEMA
// ==========================================

export const triggerCategorySchema = z.enum([
    'hospitalization',
    'fall',
    'diagnosis',
    'family_burnout',
    'clinical_decline',
    'loss_of_caregiver',
    'other',
]);

export const currentCaregiverSchema = z.enum([
    'alone',
    'family',
    'informal',
    'professional',
]);

export const previousExperienceSchema = z.enum([
    'none',
    'positive',
    'negative',
    'mixed',
]);

export const discoverySchema = z.object({
    triggerEvent: z.string()
        .min(10, 'Descreva o evento com mais detalhes (mínimo 10 caracteres)')
        .max(1000, 'Texto muito longo (máximo 1000 caracteres)')
        .transform(sanitizeString),
    triggerCategory: triggerCategorySchema,
    triggerDetails: z.string().max(500).transform(sanitizeString).optional(),
    currentCaregiver: currentCaregiverSchema,
    familyBurdenLevel: z.number().min(1).max(10),
    concerns: z.array(z.string()).default([]),
    mainConcern: z.string().max(500).transform(sanitizeString).optional(),
    previousExperience: previousExperienceSchema,
    previousIssues: z.array(z.string()).default([]),
    previousIssueDetails: z.string().max(500).transform(sanitizeString).optional(),
    notes: z.string().max(2000).transform(sanitizeString).optional(),
});

export type DiscoveryFormData = z.infer<typeof discoverySchema>;

// ==========================================
// PATIENT SCHEMA
// ==========================================

export const maritalStatusSchema = z.enum([
    'single',
    'married',
    'divorced',
    'widowed',
    'other',
]);

export const temperamentSchema = z.enum([
    'calm',
    'anxious',
    'agitated',
    'depressed',
    'aggressive',
    'variable',
]);

export const sleepQualitySchema = z.enum([
    'good',
    'regular',
    'poor',
    'insomnia',
]);

export const patientSchema = z.object({
    fullName: nameSchema,
    preferredName: z.string().max(50).transform(sanitizeString).optional(),
    birthDate: birthDateSchema,
    age: z.number().min(0).max(120).optional(),
    cpf: cpfSchema,
    maritalStatus: maritalStatusSchema,
    previousOccupation: z.string().max(100).transform(sanitizeString).optional(),
    hobbies: z.array(z.string()).default([]),
    otherHobbies: z.string().max(200).transform(sanitizeString).optional(),
    temperament: temperamentSchema,
    preferences: z.array(z.string()).default([]),
    otherPreferences: z.string().max(500).transform(sanitizeString).optional(),
    wakeUpTime: timeSchema.optional(),
    breakfastTime: timeSchema.optional(),
    lunchTime: timeSchema.optional(),
    takesNap: z.boolean().default(false),
    dinnerTime: timeSchema.optional(),
    bedTime: timeSchema.optional(),
    sleepQuality: sleepQualitySchema,
    nightWakeups: z.number().min(0).max(20).default(0),
});

export type PatientFormData = z.infer<typeof patientSchema>;

// ==========================================
// HEALTH HISTORY SCHEMA
// ==========================================

export const fallFrequencySchema = z.enum([
    'none',
    'once_6months',
    'multiple_6months',
    'frequent',
]);

export const medicationCountSchema = z.enum([
    'none',
    '1-3',
    '4-6',
    '7+',
]);

export const healthHistorySchema = z.object({
    neurologicalConditions: z.array(z.string()).default([]),
    cardiovascularConditions: z.array(z.string()).default([]),
    respiratoryConditions: z.array(z.string()).default([]),
    mobilityConditions: z.array(z.string()).default([]),
    otherConditions: z.array(z.string()).default([]),
    recentHospitalizations: z.boolean().default(false),
    recentFalls: fallFrequencySchema,
    recentSurgery: z.boolean().default(false),
    medicationCount: medicationCountSchema,
    specialMedications: z.array(z.string()).default([]),
    hasAllergies: z.boolean().default(false),
    medicationAllergies: z.string().max(500).transform(sanitizeString).optional(),
    foodAllergies: z.string().max(500).transform(sanitizeString).optional(),
    latexAllergy: z.boolean().default(false),
    otherAllergies: z.string().max(500).transform(sanitizeString).optional(),
    dietaryRestrictions: z.array(z.string()).default([]),
    otherDietaryRestrictions: z.string().max(500).transform(sanitizeString).optional(),
});

export type HealthHistoryFormData = z.infer<typeof healthHistorySchema>;

// ==========================================
// ABEMID SCHEMA
// ==========================================

export const professionalTypeSchema = z.enum([
    'caregiver',
    'nursing_technician',
    'nurse',
]);

export const abemidSchema = z.object({
    consciousness: z.number().min(0).max(4),
    breathing: z.number().min(0).max(4),
    feeding: z.number().min(0).max(4),
    medication: z.number().min(0).max(4),
    skin: z.number().min(0).max(4),
    elimination: z.number().min(0).max(4),
    totalScore: z.number().min(0).max(24),
    activeTriggers: z.array(z.string()).default([]),
    indicatedProfessional: professionalTypeSchema,
});

export type AbemidFormData = z.infer<typeof abemidSchema>;

// ==========================================
// KATZ SCHEMA
// ==========================================

export const dependencyLevelSchema = z.number().min(0).max(2);

export const katzClassificationSchema = z.enum([
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'Other',
]);

export const katzSchema = z.object({
    bathing: dependencyLevelSchema,
    bathingDetails: z.array(z.string()).default([]),
    dressing: dependencyLevelSchema,
    dressingDetails: z.array(z.string()).default([]),
    toileting: dependencyLevelSchema,
    toiletingDetails: z.array(z.string()).default([]),
    transferring: dependencyLevelSchema,
    transferringDetails: z.array(z.string()).default([]),
    mobilityAids: z.array(z.string()).default([]),
    continence: dependencyLevelSchema,
    continenceDetails: z.array(z.string()).default([]),
    feeding: dependencyLevelSchema,
    feedingDetails: z.array(z.string()).default([]),
    totalScore: z.number().min(0).max(12),
    classification: katzClassificationSchema,
    complexityMultiplier: z.number().min(1).max(2),
});

export type KatzFormData = z.infer<typeof katzSchema>;

// ==========================================
// LAWTON SCHEMA
// ==========================================

export const lawtonCapabilitySchema = z.enum([
    'capable',
    'needs_help',
    'incapable',
]);

export const medicationSeparationSchema = z.enum([
    'patient_separates',
    'family_separates',
    'caregiver_separates',
]);

export const medicationAdminSchema = z.enum([
    'self_administered',
    'needs_reminder',
    'caregiver_administers',
]);

export const supplyProvisionSchema = z.enum([
    'patient',
    'family',
    'caregiver',
]);

export const mealPrepSchema = z.enum([
    'patient_prepares',
    'family_prepares',
    'caregiver_prepares',
]);

export const lawtonSchema = z.object({
    medicationManagement: lawtonCapabilitySchema,
    medicationSeparation: medicationSeparationSchema,
    medicationAdministration: medicationAdminSchema,
    supplyProvision: supplyProvisionSchema,
    supplyList: z.array(z.string()).default([]),
    mealPreparation: mealPrepSchema,
    hasSpecialDiet: z.boolean().default(false),
    houseworkScope: z.boolean().default(false),
    clausesToGenerate: z.array(z.string()).default([]),
});

export type LawtonFormData = z.infer<typeof lawtonSchema>;

// ==========================================
// SAFETY CHECKLIST SCHEMA
// ==========================================

export const circulationRisksSchema = z.object({
    looseRugs: z.boolean().default(false),
    exposedWires: z.boolean().default(false),
    obstructedPaths: z.boolean().default(false),
    slipperyFloors: z.boolean().default(false),
    poorLighting: z.boolean().default(false),
});

export const bathroomRisksSchema = z.object({
    noGrabBarsShower: z.boolean().default(false),
    noGrabBarsToilet: z.boolean().default(false),
    slipperyShowerFloor: z.boolean().default(false),
    lowToilet: z.boolean().default(false),
    noNonSlipMat: z.boolean().default(false),
    noShowerChair: z.boolean().default(false),
});

export const bedroomRisksSchema = z.object({
    bedTooLow: z.boolean().default(false),
    bedTooHigh: z.boolean().default(false),
    noSideAccess: z.boolean().default(false),
    noNightLight: z.boolean().default(false),
    inadequateMattress: z.boolean().default(false),
});

export const familyPositionSchema = z.enum([
    'will_adapt_all',
    'will_adapt_some',
    'aware_only',
    'no_changes',
]);

export const safetyChecklistSchema = z.object({
    circulation: circulationRisksSchema,
    bathroom: bathroomRisksSchema,
    bedroom: bedroomRisksSchema,
    hasStairs: z.boolean().default(false),
    totalRisks: z.number().min(0).default(0),
    criticalRisks: z.number().min(0).default(0),
    riskList: z.array(z.string()).default([]),
    familyPosition: familyPositionSchema,
    adaptationsCommitted: z.array(z.string()).default([]),
    photos: z.array(z.string()).default([]),
});

export type SafetyChecklistFormData = z.infer<typeof safetyChecklistSchema>;

// ==========================================
// SCHEDULE SCHEMA
// ==========================================

export const dayTypeSchema = z.enum([
    'weekday',
    'weekend',
    'daily',
]);

export const scheduleSchema = z.object({
    startTime: timeSchema,
    endTime: timeSchema,
    hoursPerDay: z.number().min(1).max(24),
    daysPerWeek: z.number().min(1).max(7),
    selectedDays: z.array(z.string()).default([]),
    dayType: dayTypeSchema.optional(),
    needsNight: z.boolean().default(false),
    nightHours: z.number().min(0).max(12).optional(),
    needs24h: z.boolean().default(false),
    startDate: z.coerce.date().optional(),
    minimumContract: z.number().min(1).max(24).optional(),
    notes: z.string().max(1000).transform(sanitizeString).optional(),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;

// ==========================================
// COMPLETE EVALUATION SCHEMA
// ==========================================

export const evaluationFormSchema = z.object({
    discovery: discoverySchema,
    patient: patientSchema,
    healthHistory: healthHistorySchema,
    abemid: abemidSchema,
    katz: katzSchema,
    lawton: lawtonSchema,
    safetyChecklist: safetyChecklistSchema,
    schedule: scheduleSchema,
});

export type EvaluationFormData = z.infer<typeof evaluationFormSchema>;

// ==========================================
// PARTIAL SCHEMAS FOR STEP UPDATES
// ==========================================

export const partialDiscoverySchema = discoverySchema.partial();
export const partialPatientSchema = patientSchema.partial();
export const partialHealthHistorySchema = healthHistorySchema.partial();
export const partialAbemidSchema = abemidSchema.partial();
export const partialKatzSchema = katzSchema.partial();
export const partialLawtonSchema = lawtonSchema.partial();
export const partialSafetyChecklistSchema = safetyChecklistSchema.partial();
export const partialScheduleSchema = scheduleSchema.partial();
