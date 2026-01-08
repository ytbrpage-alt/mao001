/**
 * Tipos base compartilhados entre todos os usuários do sistema
 */

// Tipo de portal/área do sistema
export type PortalType = 'client' | 'admin' | 'professional';

// Tipo de usuário no sistema
export type UserType =
    | 'client'
    | 'admin'
    | 'supervisor'
    | 'evaluator'
    | 'caregiver'
    | 'nurse'
    | 'nurse_tech'
    | 'physiotherapist'
    | 'nutritionist'
    | 'psychologist'
    | 'speech_therapist'
    | 'occupational_therapist'
    | 'physician';

// Status genérico de conta
export type AccountStatus =
    | 'pending_approval'
    | 'active'
    | 'inactive'
    | 'suspended'
    | 'blocked';

// Dados base de qualquer usuário
export interface BaseUser {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    phoneSecondary?: string;
    cpf: string;
    userType: UserType;
    portalAccess: PortalType[];
    status: AccountStatus;
    avatarUrl?: string;
    avatarColor?: string;
    address?: Address;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    lastActiveAt?: Date;
    preferences: UserPreferences;
    notificationSettings: NotificationSettings;
}

// Endereço completo
export interface Address {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
}

// Preferências de usuário
export interface UserPreferences {
    language: 'pt-BR' | 'en' | 'es';
    timezone: string;
    dateFormat: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
    timeFormat: '24h' | '12h';
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
    highContrast: boolean;
    autoLogoutMinutes: number;
    showTutorials: boolean;
    compactMode: boolean;
}

// Configurações de notificação
export interface NotificationSettings {
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
    whatsappEnabled: boolean;
    scheduleReminders: boolean;
    scheduleChanges: boolean;
    newMessages: boolean;
    documentUpdates: boolean;
    paymentReminders: boolean;
    systemUpdates: boolean;
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
}

// Documento de identificação
export interface IdentityDocument {
    type: 'rg' | 'cnh' | 'passport' | 'other';
    number: string;
    issuingAuthority: string;
    issueDate?: Date;
    expiryDate?: Date;
    frontImageUrl?: string;
    backImageUrl?: string;
    verified: boolean;
    verifiedAt?: Date;
    verifiedBy?: string;
}

// Contato de emergência
export interface EmergencyContact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    phoneSecondary?: string;
    email?: string;
    isMainContact: boolean;
    canMakeDecisions: boolean;
    notifyOnEmergency: boolean;
}

// Relacionamento familiar/responsável
export interface FamilyRelationship {
    userId: string;
    patientId: string;
    relationship:
    | 'spouse'
    | 'child'
    | 'parent'
    | 'sibling'
    | 'grandchild'
    | 'in_law'
    | 'caregiver'
    | 'guardian'
    | 'other';
    isMainResponsible: boolean;
    financialResponsible: boolean;
    canAccessMedicalInfo: boolean;
    canMakeDecisions: boolean;
    canReceiveReports: boolean;
    createdAt: Date;
}
