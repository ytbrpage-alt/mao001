/**
 * Tipos específicos para profissionais de saúde
 */

import type { BaseUser, Address } from './base';

// Profissional de saúde (base)
export interface ProfessionalUser extends BaseUser {
    userType:
    | 'caregiver'
    | 'nurse'
    | 'nurse_tech'
    | 'physiotherapist'
    | 'nutritionist'
    | 'psychologist'
    | 'speech_therapist'
    | 'occupational_therapist'
    | 'physician';
    professionalInfo: ProfessionalInfo;
    availability: ProfessionalAvailability;
    currentAssignments: ProfessionalAssignment[];
    completedAssignments: number;
    totalHoursWorked: number;
    averageRating: number;
    totalRatings: number;
    documents: ProfessionalDocument[];
    financialInfo: ProfessionalFinancialInfo;
    professionalPreferences: ProfessionalPreferences;
}

// Informações profissionais
export interface ProfessionalInfo {
    education: Education[];
    professionalRegistration?: {
        council: string;
        number: string;
        state: string;
        expiryDate?: Date;
        verified: boolean;
        verificationDate?: Date;
        documentUrl?: string;
    };
    specializations: string[];
    yearsOfExperience: number;
    experienceAreas: string[];
    skills: ProfessionalSkill[];
    languages: { language: string; level: 'basic' | 'intermediate' | 'advanced' | 'native' }[];
    certifications: Certification[];
    bio: string;
    employmentType: 'employee' | 'contractor' | 'partner';
    hireDate: Date;
    contractEndDate?: Date;
}

// Formação acadêmica
export interface Education {
    level: 'technical' | 'undergraduate' | 'graduate' | 'specialization' | 'masters' | 'doctorate';
    course: string;
    institution: string;
    startYear: number;
    endYear?: number;
    inProgress: boolean;
    certificateUrl?: string;
}

// Habilidade profissional
export interface ProfessionalSkill {
    category:
    | 'clinical'
    | 'mobility'
    | 'hygiene'
    | 'nutrition'
    | 'medication'
    | 'wound_care'
    | 'equipment'
    | 'emergency'
    | 'dementia'
    | 'palliative'
    | 'pediatric'
    | 'psychiatric'
    | 'communication'
    | 'administrative';
    name: string;
    level: 'basic' | 'intermediate' | 'advanced' | 'expert';
    certified: boolean;
    certificationDate?: Date;
}

// Certificação
export interface Certification {
    name: string;
    issuingOrganization: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
    documentUrl?: string;
    verified: boolean;
}

// Disponibilidade do profissional
export interface ProfessionalAvailability {
    isAvailable: boolean;
    unavailableUntil?: Date;
    unavailableReason?: string;
    weeklySchedule: {
        dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        isAvailable: boolean;
        slots: { startTime: string; endTime: string }[];
    }[];
    preferences: {
        maxHoursPerDay: number;
        maxHoursPerWeek: number;
        minHoursPerShift: number;
        preferredShiftTypes: ('day' | 'night' | 'overnight' | 'weekend')[];
        willingToTravel: boolean;
        maxTravelDistanceKm: number;
        acceptsEmergencyCalls: boolean;
    };
    blockedPeriods: {
        id: string;
        startDate: Date;
        endDate: Date;
        reason: 'vacation' | 'medical' | 'personal' | 'training' | 'other';
        description?: string;
    }[];
    serviceAreas: { city: string; neighborhoods: string[]; isPreferred: boolean }[];
}

// Atribuição de paciente
export interface ProfessionalAssignment {
    id: string;
    patientId: string;
    patientName: string;
    patientPhotoUrl?: string;
    patientAddress: Address;
    role: 'primary' | 'secondary' | 'substitute' | 'specialist';
    status: 'active' | 'paused' | 'completed' | 'cancelled';
    schedule: {
        type: 'fixed' | 'rotating' | 'on_demand';
        weekDays?: number[];
        startTime?: string;
        endTime?: string;
        hoursPerWeek?: number;
    };
    startDate: Date;
    endDate?: Date;
    specialInstructions?: string;
    familyContact: { name: string; phone: string; relationship: string };
}

// Documento profissional
export interface ProfessionalDocument {
    id: string;
    type:
    | 'identity'
    | 'cpf'
    | 'address_proof'
    | 'professional_id'
    | 'education'
    | 'certification'
    | 'criminal_record'
    | 'health_certificate'
    | 'contract'
    | 'other';
    name: string;
    description?: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    status: 'pending' | 'approved' | 'rejected' | 'expired';
    expiryDate?: Date;
    uploadedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
    reviewNotes?: string;
}

// Informações financeiras do profissional
export interface ProfessionalFinancialInfo {
    bankAccount: {
        bankCode: string;
        bankName: string;
        agency: string;
        account: string;
        accountType: 'checking' | 'savings';
        holderName: string;
        holderCpf: string;
        pixKey?: string;
    };
    hourlyRate: number;
    nightHourlyRate?: number;
    weekendHourlyRate?: number;
    holidayHourlyRate?: number;
    isMei: boolean;
    cnpj?: string;
    paymentFrequency: 'weekly' | 'biweekly' | 'monthly';
    paymentDay: number;
}

// Preferências do profissional
export interface ProfessionalPreferences {
    preferredPatientProfiles: string[];
    avoidPatientProfiles: string[];
    notifyNewAssignments: boolean;
    notifyScheduleChanges: boolean;
    notifyMessageFromFamily: boolean;
    notifyPaymentProcessed: boolean;
    enableGpsTracking: boolean;
    autoCheckIn: boolean;
    showEarningsOnDashboard: boolean;
}
