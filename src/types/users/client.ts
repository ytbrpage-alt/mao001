/**
 * Tipos específicos para clientes/famílias
 */

import type { BaseUser, Address, EmergencyContact, FamilyRelationship } from './base';

// Cliente (família/responsável pelo paciente)
export interface ClientUser extends BaseUser {
    userType: 'client';
    patientIds: string[];
    relationships: FamilyRelationship[];
    billingInfo: BillingInfo;
    paymentMethods: PaymentMethod[];
    contractIds: string[];
    clientPreferences: ClientPreferences;
}

// Informações de faturamento
export interface BillingInfo {
    billingName: string;
    billingCpfCnpj: string;
    billingEmail: string;
    billingPhone: string;
    billingAddress: Address;
    invoiceDelivery: 'email' | 'whatsapp' | 'printed';
    invoiceDay: number;
    autoDebit?: {
        enabled: boolean;
        bankCode: string;
        agency: string;
        account: string;
        accountType: 'checking' | 'savings';
    };
}

// Método de pagamento
export interface PaymentMethod {
    id: string;
    type: 'credit_card' | 'debit_card' | 'pix' | 'bank_slip' | 'bank_transfer';
    isDefault: boolean;
    cardBrand?: string;
    cardLastFour?: string;
    cardExpiry?: string;
    cardholderName?: string;
    pixKey?: string;
    pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
    createdAt: Date;
}

// Preferências específicas do cliente
export interface ClientPreferences {
    preferredContactMethod: 'phone' | 'whatsapp' | 'email';
    preferredContactTime: 'morning' | 'afternoon' | 'evening' | 'any';
    receiveWeeklyReports: boolean;
    receiveMonthlyReports: boolean;
    reportFormat: 'detailed' | 'summary';
    canProfessionalContactDirectly: boolean;
    shareLocationWithProfessional: boolean;
}

// Paciente (pessoa que recebe o cuidado)
export interface Patient {
    id: string;
    fullName: string;
    preferredName: string;
    birthDate: Date;
    age: number;
    gender: 'male' | 'female' | 'other';
    cpf: string;
    rg?: string;
    photoUrl?: string;
    phone?: string;
    email?: string;
    address: Address;
    accessInstructions?: string;
    medicalInfo: PatientMedicalInfo;
    evaluationIds: string[];
    currentEvaluationId?: string;
    carePlanId?: string;
    assignedProfessionals: AssignedProfessional[];
    careStatus: 'evaluation' | 'active' | 'paused' | 'discharged' | 'deceased';
    careStartDate?: Date;
    careEndDate?: Date;
    emergencyContacts: EmergencyContact[];
    createdAt: Date;
    updatedAt: Date;
}

// Informações médicas do paciente
export interface PatientMedicalInfo {
    primaryDiagnoses: string[];
    secondaryDiagnoses: string[];
    allergies: {
        type: 'medication' | 'food' | 'environmental' | 'other';
        substance: string;
        severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
        reaction: string;
    }[];
    medications: {
        name: string;
        dosage: string;
        frequency: string;
        route: 'oral' | 'topical' | 'injection' | 'inhalation' | 'other';
        prescribedBy?: string;
        startDate?: Date;
        endDate?: Date;
        notes?: string;
    }[];
    dietaryRestrictions: string[];
    dietType?: 'normal' | 'soft' | 'pureed' | 'liquid' | 'enteral' | 'parenteral';
    medicalDevices: {
        type: string;
        model?: string;
        settings?: string;
        lastMaintenanceDate?: Date;
    }[];
    primaryPhysician?: {
        name: string;
        specialty: string;
        phone: string;
        crm: string;
    };
    healthInsurance?: {
        provider: string;
        planName: string;
        cardNumber: string;
        expiryDate?: Date;
    };
    currentScores?: {
        abemidScore?: number;
        abemidIndicatedProfessional?: 'caregiver' | 'nurse';
        katzScore?: number;
        katzClassification?: string;
        lawtonScore?: number;
        lastEvaluationDate?: Date;
    };
}

// Profissional atribuído ao paciente
export interface AssignedProfessional {
    professionalId: string;
    professionalName: string;
    professionalType: string;
    role: 'primary' | 'secondary' | 'substitute' | 'specialist';
    assignedAt: Date;
    assignedBy: string;
    schedule?: {
        weekDays: string[];
        startTime: string;
        endTime: string;
    };
    isActive: boolean;
}
